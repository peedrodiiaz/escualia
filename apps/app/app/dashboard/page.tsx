import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import { Users, CalendarDays, Receipt, TrendingUp } from "lucide-react";

async function getDashboardStats(schoolId: string) {
  const supabase = await createClient();

  const [{ count: totalStudents }, { count: activeStudents }] = await Promise.all([
    supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("school_id", schoolId),
    supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("school_id", schoolId)
      .eq("status", "active"),
  ]);

  return {
    totalStudents: totalStudents ?? 0,
    activeStudents: activeStudents ?? 0,
  };
}

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const stats = await getDashboardStats(user.schoolId);

  const cards = [
    {
      label: "Alumnos totales",
      value: stats.totalStudents,
      icon: Users,
      color: "var(--brand)",
      colorBg: "color-mix(in srgb, var(--brand) 10%, transparent)",
    },
    {
      label: "Alumnos activos",
      value: stats.activeStudents,
      icon: TrendingUp,
      color: "var(--success)",
      colorBg: "var(--success-bg)",
    },
    {
      label: "Clases esta semana",
      value: "—",
      icon: CalendarDays,
      color: "#7c3aed",
      colorBg: "color-mix(in srgb, #7c3aed 10%, transparent)",
    },
    {
      label: "Facturación pendiente",
      value: "—",
      icon: Receipt,
      color: "var(--warning)",
      colorBg: "var(--warning-bg)",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
          Bienvenido, {user.email.split("@")[0]}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {user.schoolName} · {roleLabel(user.role)}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl p-5"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                style={{ background: card.colorBg, color: card.color }}
              >
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
                {card.value}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Placeholder upcoming features */}
      <div
        className="rounded-xl p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>
          Próximas clases
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          El módulo de agenda estará disponible próximamente.
        </p>
      </div>
    </div>
  );
}

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    admin: "Administrador",
    instructor: "Instructor",
    student: "Alumno",
  };
  return labels[role] ?? role;
}
