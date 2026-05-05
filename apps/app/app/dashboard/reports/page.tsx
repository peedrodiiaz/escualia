import { getSessionUser } from "@/lib/auth/get-user-role";
import { redirect } from "next/navigation";

export default async function ReportsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        Informes
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Estadísticas de alumnos, instructores e ingresos.
      </p>
      <div
        className="rounded-xl p-8 text-center"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Módulo en construcción — próximamente.
        </p>
      </div>
    </div>
  );
}
