import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import { Users, CalendarDays, Receipt, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

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
      bg: "rgba(59,130,246,0.1)",
    },
    {
      label: "Alumnos activos",
      value: stats.activeStudents,
      icon: TrendingUp,
      color: "var(--success)",
      bg: "var(--success-bg)",
    },
    {
      label: "Clases esta semana",
      value: "—",
      icon: CalendarDays,
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.1)",
    },
    {
      label: "Facturación pendiente",
      value: "—",
      icon: Receipt,
      color: "var(--warning)",
      bg: "var(--warning-bg)",
    },
  ];

  const quickLinks = [
    { label: "Ver alumnos", href: "/dashboard/students", description: "Gestiona expedientes" },
    { label: "Abrir agenda", href: "/dashboard/agenda", description: "Clases programadas" },
    { label: "Facturación", href: "/dashboard/billing", description: "Pagos y facturas" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl">

      {/* Page header */}
      <div className="mb-8">
        <h1
          className="font-bold mb-1"
          style={{ color: "var(--text)", fontSize: 22, letterSpacing: "-0.02em" }}
        >
          Dashboard
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {user.schoolName} · {roleLabel(user.role)}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl p-5"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                style={{ background: card.bg, color: card.color }}
              >
                <Icon size={16} />
              </div>
              <p
                className="font-bold mb-1"
                style={{ color: "var(--text)", fontSize: 24, letterSpacing: "-0.02em", lineHeight: 1 }}
              >
                {card.value}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick links */}
      {user.role !== "student" && (
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between rounded-xl p-4 transition-colors"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>
                  {link.label}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {link.description}
                </p>
              </div>
              <ArrowRight
                size={16}
                style={{ color: "var(--text-subtle)" }}
                className="shrink-0 group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          ))}
        </div>
      )}

      {/* Upcoming classes placeholder */}
      <div
        className="rounded-xl p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h2
          className="font-semibold mb-1"
          style={{ color: "var(--text)", fontSize: 14 }}
        >
          Próximas clases
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Las clases programadas aparecerán aquí.{" "}
          <Link
            href="/dashboard/agenda"
            className="font-medium"
            style={{ color: "var(--brand)" }}
          >
            Ir a la agenda →
          </Link>
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
