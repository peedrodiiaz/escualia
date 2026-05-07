import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart2 } from "lucide-react";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/students/student-table";
import { StudentActions } from "@/components/students/student-actions";

type Props = {
  params: Promise<{ id: string }>;
};

const INVOICE_STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  overdue: "Vencida",
  cancelled: "Cancelada",
};

const INVOICE_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "var(--warning-bg)", color: "var(--warning)" },
  paid: { bg: "var(--success-bg)", color: "var(--success)" },
  overdue: { bg: "var(--danger-bg)", color: "var(--danger)" },
  cancelled: { bg: "var(--bg-muted)", color: "var(--text-muted)" },
};

function formatEuros(cents: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function StudentDetailPage({ params }: Props) {
  const { id } = await params;

  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role === "student") redirect("/dashboard");

  const supabase = await createClient();
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .eq("school_id", user.schoolId)
    .single();

  if (!student) notFound();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, number, status, issue_date, total_cents")
    .eq("student_id", student.id)
    .eq("school_id", user.schoolId)
    .order("created_at", { ascending: false });

  const invoiceList = invoices ?? [];
  const pendingTotal = invoiceList
    .filter((i) => ["pending", "overdue"].includes(i.status))
    .reduce((sum, i) => sum + i.total_cents, 0);

  const createdAt = new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(
    new Date(student.created_at)
  );

  const fields = [
    { label: "Email", value: student.email },
    { label: "Teléfono", value: student.phone ?? "—" },
    { label: "DNI", value: student.dni ?? "—" },
    { label: "Alta", value: createdAt },
  ];

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href="/dashboard/students"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={15} />
        Volver a alumnos
      </Link>

      {/* Header */}
      <div
        className="rounded-xl p-6 mb-5"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
              {student.first_name} {student.last_name}
            </h1>
            <StatusBadge status={student.status} />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/students/${id}/tests`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-70"
              style={{
                background: "var(--bg-muted)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              <BarChart2 size={13} />
              Ver tests
            </Link>
            {user.role === "admin" && <StudentActions student={student} />}
          </div>
        </div>
      </div>

      {/* Datos personales */}
      <div
        className="rounded-xl overflow-hidden mb-5"
        style={{ border: "1px solid var(--border)" }}
      >
        <div
          className="px-5 py-3"
          style={{ background: "var(--bg-muted)", borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Datos personales
          </h2>
        </div>
        <div style={{ background: "var(--bg-card)" }}>
          {fields.map((f, i) => (
            <div
              key={f.label}
              className="flex items-center px-5 py-3.5"
              style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
            >
              <span className="text-sm w-28 shrink-0" style={{ color: "var(--text-muted)" }}>
                {f.label}
              </span>
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                {f.value}
              </span>
            </div>
          ))}
          {student.notes && (
            <div className="px-5 py-3.5" style={{ borderTop: "1px solid var(--border)" }}>
              <span className="text-sm block mb-1" style={{ color: "var(--text-muted)" }}>
                Notas
              </span>
              <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text)" }}>
                {student.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Facturación */}
      {user.role === "admin" && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ background: "var(--bg-muted)", borderBottom: "1px solid var(--border)" }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              Facturación
            </h2>
            {pendingTotal > 0 && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
              >
                Debe {formatEuros(pendingTotal)}
              </span>
            )}
          </div>

          {invoiceList.length > 0 ? (
            <div style={{ background: "var(--bg-card)" }}>
              {invoiceList.map((inv, i) => {
                const statusStyle = INVOICE_STATUS_COLORS[inv.status] ?? INVOICE_STATUS_COLORS.pending;
                return (
                  <Link
                    key={inv.id}
                    href={`/dashboard/billing/${inv.id}`}
                    className="flex items-center justify-between px-5 py-3.5 transition-opacity hover:opacity-70"
                    style={{
                      borderTop: i > 0 ? "1px solid var(--border)" : "none",
                      textDecoration: "none",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                        {inv.number}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {formatDate(inv.issue_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                        {formatEuros(inv.total_cents)}
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: statusStyle.bg, color: statusStyle.color }}
                      >
                        {INVOICE_STATUS_LABELS[inv.status] ?? inv.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div
              className="px-5 py-6 text-center"
              style={{ background: "var(--bg-card)" }}
            >
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Sin facturas emitidas
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
