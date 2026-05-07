import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import { InvoiceDetail } from "@/components/billing/invoice-detail";
import { InvoiceActions } from "@/components/billing/invoice-actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;

  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select(`
      *,
      student:students(id, first_name, last_name, email, phone, dni),
      items:invoice_items(*)
    `)
    .eq("id", id)
    .eq("school_id", user.schoolId)
    .single();

  if (!invoice) notFound();

  const student = invoice.student as {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    dni: string | null;
  } | null;

  if (!student) notFound();

  const items = (invoice.items ?? []) as Parameters<typeof InvoiceDetail>[0]["items"];

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/dashboard/billing"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={15} />
        Volver a facturación
      </Link>

      <div className="flex justify-end mb-4">
        <InvoiceActions
          invoice={invoice}
          items={items}
          student={student}
          schoolName={user.schoolName}
        />
      </div>

      <InvoiceDetail
        invoice={invoice}
        items={items}
        student={student}
        schoolName={user.schoolName}
      />
    </div>
  );
}
