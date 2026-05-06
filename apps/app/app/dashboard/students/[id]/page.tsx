import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/students/student-table";
import { StudentActions } from "@/components/students/student-actions";

type Props = {
  params: Promise<{ id: string }>;
};

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
          {user.role === "admin" && <StudentActions student={student} />}
        </div>
      </div>

      {/* Datos */}
      <div
        className="rounded-xl overflow-hidden"
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
              <span
                className="text-sm w-28 shrink-0"
                style={{ color: "var(--text-muted)" }}
              >
                {f.label}
              </span>
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                {f.value}
              </span>
            </div>
          ))}
          {student.notes && (
            <div
              className="px-5 py-3.5"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <span
                className="text-sm block mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Notas
              </span>
              <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text)" }}>
                {student.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
