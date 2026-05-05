import { getSessionUser } from "@/lib/auth/get-user-role";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        Ajustes
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Configuración de la autoescuela, usuarios y roles.
      </p>
      <div
        className="rounded-xl p-8"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", maxWidth: "480px" }}
      >
        <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>
          Información de la escuela
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
              Nombre
            </label>
            <input
              defaultValue={user.schoolName}
              disabled
              className="w-full px-3 py-2.5 text-sm rounded-lg"
              style={{
                background: "var(--bg-muted)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>
        </div>
        <p className="text-xs mt-4" style={{ color: "var(--text-subtle)" }}>
          Edición completa disponible próximamente.
        </p>
      </div>
    </div>
  );
}
