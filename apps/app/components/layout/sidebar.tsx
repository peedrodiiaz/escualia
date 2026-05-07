"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Receipt,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  UsersRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/auth/get-user-role";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "instructor", "student"] },
  { href: "/dashboard/students", label: "Alumnos", icon: Users, roles: ["admin", "instructor"] },
  { href: "/dashboard/team", label: "Equipo", icon: UsersRound, roles: ["admin"] },
  { href: "/dashboard/agenda", label: "Agenda", icon: CalendarDays, roles: ["admin", "instructor", "student"] },
  { href: "/dashboard/billing", label: "Facturación", icon: Receipt, roles: ["admin"] },
  { href: "/dashboard/study", label: "Estudiar", icon: BookOpen, roles: ["student"] },
  { href: "/dashboard/reports", label: "Informes", icon: BarChart3, roles: ["admin"] },
  { href: "/dashboard/settings", label: "Ajustes", icon: Settings, roles: ["admin"] },
];

export function Sidebar({ user, onClose }: { user: SessionUser; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside
      className="flex flex-col shrink-0 h-screen sticky top-0"
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-sidebar)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2.5 mb-1" aria-label="Escualia">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
            style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
          />
          <span className="text-base font-black tracking-tight" style={{ color: "#fff" }}>
            Escualia
          </span>
        </div>
        <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
          {user.schoolName}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                background: isActive
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
              }}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="px-3 mb-2">
          <p className="text-xs font-medium truncate" style={{ color: "rgba(255,255,255,0.6)" }}>
            {user.email}
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {roleLabel(user.role)}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-colors hover:bg-white/5"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </aside>
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
