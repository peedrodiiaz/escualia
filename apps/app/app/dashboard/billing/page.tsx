import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import { InvoiceList } from "@/components/billing/invoice-list";

export default async function BillingPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  const { data: invoices } = await supabase
    .from("invoices")
    .select(`
      *,
      student:students(id, first_name, last_name, email, phone, dni),
      items:invoice_items(*)
    `)
    .eq("school_id", user.schoolId)
    .order("created_at", { ascending: false });

  const { data: students } = await supabase
    .from("students")
    .select("id, school_id, user_id, first_name, last_name, email, phone, dni, status, notes, created_at")
    .eq("school_id", user.schoolId)
    .eq("status", "active")
    .order("first_name", { ascending: true });

  return (
    <InvoiceList
      invoices={invoices ?? []}
      students={students ?? []}
    />
  );
}
