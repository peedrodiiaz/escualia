import { getSessionUser } from "@/lib/auth/get-user-role";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserPlus } from "lucide-react";

export default async function StudentsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role === "student") redirect("/dashboard");

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("id, first_name, last_name, email, phone, status")
    .eq("school_id", user.schoolId)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
            Alumnos
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {students?.length ?? 0} alumnos registrados
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
          style={{ background: "var(--brand)", color: "#fff" }}
        >
          <UserPlus size={16} />
          Nuevo alumno
        </button>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        {students && students.length > 0 ? (
          <table className="w-full text-sm">
            <thead style={{ background: "var(--bg-muted)" }}>
              <tr>
                {["Nombre", "Email", "Teléfono", "Estado"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ background: "var(--bg-card)" }}>
              {students.map((s, i) => (
                <tr
                  key={s.id}
                  style={{
                    borderTop: i > 0 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <td className="px-5 py-3.5 font-medium" style={{ color: "var(--text)" }}>
                    {s.first_name} {s.last_name}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "var(--text-muted)" }}>
                    {s.email}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "var(--text-muted)" }}>
                    {s.phone ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={s.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div
            className="py-16 text-center"
            style={{ background: "var(--bg-card)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No hay alumnos todavía. ¡Añade el primero!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    active: { label: "Activo", color: "var(--success)", bg: "var(--success-bg)" },
    inactive: { label: "Inactivo", color: "var(--text-muted)", bg: "var(--bg-muted)" },
    passed: { label: "Aprobado", color: "var(--brand)", bg: "color-mix(in srgb, var(--brand) 10%, transparent)" },
    failed: { label: "Suspendido", color: "var(--danger)", bg: "var(--danger-bg)" },
  };
  const s = map[status] ?? map.inactive;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  );
}
