"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/get-user-role";

export type BillingActionState = { error: string } | null;

type InvoiceItemInput = {
  description: string;
  quantity: number;
  unit_price_cents: number;
};

async function generateInvoiceNumber(
  supabase: Awaited<ReturnType<typeof createClient>>,
  schoolId: string,
  attempt: number
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `FAC-${year}-`;

  const { data } = await supabase
    .from("invoices")
    .select("number")
    .eq("school_id", schoolId)
    .like("number", `${prefix}%`)
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle();

  let seq = 1 + attempt;
  if (data?.number) {
    const parts = data.number.split("-");
    const last = parseInt(parts[2] ?? "0", 10);
    seq = last + 1 + attempt;
  }

  return `${prefix}${String(seq).padStart(3, "0")}`;
}

export async function createInvoice(
  _prev: BillingActionState,
  formData: FormData
): Promise<BillingActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role !== "admin") return { error: "No autorizado" };

  const student_id = (formData.get("student_id") as string)?.trim();
  const issue_date = (formData.get("issue_date") as string)?.trim();
  const due_date = (formData.get("due_date") as string)?.trim() || null;
  const tax_rate_raw = parseInt((formData.get("tax_rate") as string) ?? "21", 10);
  const notes = (formData.get("notes") as string)?.trim() || null;
  const itemsRaw = formData.get("items") as string;

  if (!student_id) return { error: "Selecciona un alumno" };
  if (!issue_date) return { error: "La fecha de emisión es obligatoria" };
  if (![0, 10, 21].includes(tax_rate_raw)) return { error: "IVA no válido" };

  const tax_rate = tax_rate_raw as 0 | 10 | 21;

  let items: InvoiceItemInput[];
  try {
    items = JSON.parse(itemsRaw);
    if (!Array.isArray(items) || items.length === 0) throw new Error();
  } catch {
    return { error: "Añade al menos una línea a la factura" };
  }

  for (const item of items) {
    if (!item.description?.trim()) return { error: "Todas las líneas necesitan descripción" };
    if (!item.quantity || item.quantity < 1) return { error: "La cantidad debe ser al menos 1" };
    if (item.unit_price_cents < 0) return { error: "El precio no puede ser negativo" };
  }

  const supabase = await createClient();

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("id", student_id)
    .eq("school_id", user.schoolId)
    .single();

  if (!student) return { error: "Alumno no encontrado" };

  const subtotal_cents = items.reduce((sum, i) => sum + i.quantity * i.unit_price_cents, 0);
  const tax_cents = Math.round(subtotal_cents * tax_rate / 100);
  const total_cents = subtotal_cents + tax_cents;

  for (let attempt = 0; attempt < 3; attempt++) {
    const number = await generateInvoiceNumber(supabase, user.schoolId, attempt);

    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        school_id: user.schoolId,
        student_id,
        number,
        issue_date,
        due_date,
        subtotal_cents,
        tax_rate,
        tax_cents,
        total_cents,
        notes,
        created_by: user.id,
        status: "pending",
      })
      .select("id")
      .single();

    if (invoiceError) {
      if (invoiceError.code === "23505" && attempt < 2) continue;
      return { error: "Error al crear la factura. Inténtalo de nuevo." };
    }

    const { error: itemsError } = await supabase.from("invoice_items").insert(
      items.map((i) => ({
        invoice_id: invoice.id,
        school_id: user.schoolId,
        description: i.description.trim(),
        quantity: i.quantity,
        unit_price_cents: i.unit_price_cents,
        total_cents: i.quantity * i.unit_price_cents,
      }))
    );

    if (itemsError) {
      await supabase.from("invoices").delete().eq("id", invoice.id);
      return { error: "Error al guardar las líneas de la factura." };
    }

    revalidatePath("/dashboard/billing");
    return null;
  }

  return { error: "No se pudo generar el número de factura. Inténtalo de nuevo." };
}

export async function markAsPaid(
  _prev: BillingActionState,
  formData: FormData
): Promise<BillingActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role !== "admin") return { error: "No autorizado" };

  const invoice_id = (formData.get("invoice_id") as string)?.trim();
  const payment_method = (formData.get("payment_method") as string)?.trim();

  if (!invoice_id) return { error: "ID de factura requerido" };
  if (!["cash", "transfer", "card"].includes(payment_method)) {
    return { error: "Método de pago no válido" };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("invoices")
    .select("id, status")
    .eq("id", invoice_id)
    .eq("school_id", user.schoolId)
    .single();

  if (!existing) return { error: "Factura no encontrada" };
  if (existing.status === "cancelled") return { error: "No se puede cobrar una factura cancelada" };
  if (existing.status === "paid") return { error: "La factura ya está pagada" };

  const { error } = await supabase
    .from("invoices")
    .update({
      status: "paid",
      payment_method: payment_method as "cash" | "transfer" | "card",
      paid_at: new Date().toISOString(),
    })
    .eq("id", invoice_id);

  if (error) return { error: "Error al marcar como pagada." };

  revalidatePath("/dashboard/billing");
  revalidatePath(`/dashboard/billing/${invoice_id}`);
  return null;
}

export async function cancelInvoice(invoiceId: string): Promise<BillingActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role !== "admin") return { error: "No autorizado" };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("invoices")
    .select("id, status")
    .eq("id", invoiceId)
    .eq("school_id", user.schoolId)
    .single();

  if (!existing) return { error: "Factura no encontrada" };
  if (existing.status === "paid") return { error: "No se puede cancelar una factura pagada" };
  if (existing.status === "cancelled") return { error: "La factura ya está cancelada" };

  const { error } = await supabase
    .from("invoices")
    .update({ status: "cancelled" })
    .eq("id", invoiceId);

  if (error) return { error: "Error al cancelar la factura." };

  revalidatePath("/dashboard/billing");
  revalidatePath(`/dashboard/billing/${invoiceId}`);
  return null;
}

export async function deleteInvoice(invoiceId: string): Promise<BillingActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role !== "admin") return { error: "No autorizado" };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("invoices")
    .select("id, status")
    .eq("id", invoiceId)
    .eq("school_id", user.schoolId)
    .single();

  if (!existing) return { error: "Factura no encontrada" };
  if (!["pending", "cancelled"].includes(existing.status)) {
    return { error: "Solo se pueden eliminar facturas pendientes o canceladas" };
  }

  const { error } = await supabase.from("invoices").delete().eq("id", invoiceId);
  if (error) return { error: "Error al eliminar la factura." };

  revalidatePath("/dashboard/billing");
  return null;
}
