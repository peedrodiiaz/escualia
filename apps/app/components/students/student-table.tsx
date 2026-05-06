"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Search } from "lucide-react";
import { CreateStudentModal } from "./create-student-modal";
import type { Database } from "@/types/database";

type StudentRow = Database["public"]["Tables"]["students"]["Row"];

type Props = {
  students: StudentRow[];
  canCreate: boolean;
};

type StatusFilter = "all" | "active" | "inactive" | "passed" | "failed";

export function StudentTable({ students, canCreate }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = students.filter((s) => {
    const matchesSearch =
      search === "" ||
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
            Alumnos
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {filtered.length} de {students.length} alumnos
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: "var(--brand)", color: "#fff" }}
          >
            <UserPlus size={16} />
            Nuevo alumno
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center gap-2 flex-1 max-w-xs rounded-lg px-3 py-2"
          style={{
            background: "var(--bg-muted)",
            border: "1px solid var(--border)",
          }}
        >
          <Search size={15} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full"
            style={{ color: "var(--text)" }}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as StatusFilter)}
          className="rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            background: "var(--bg-muted)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="passed">Aprobado</option>
          <option value="failed">Suspendido</option>
        </select>
      </div>

      {/* Tabla */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        {filtered.length > 0 ? (
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
              {filtered.map((s, i) => (
                <tr
                  key={s.id}
                  onClick={() => router.push(`/dashboard/students/${s.id}`)}
                  className="cursor-pointer transition-colors hover:opacity-80"
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
            <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
              {students.length === 0
                ? "No hay alumnos todavía"
                : "No hay resultados para este filtro"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {students.length === 0 && canCreate
                ? "Añade el primero con el botón de arriba."
                : search || filter !== "all"
                ? "Prueba con otro término de búsqueda o cambia el filtro."
                : ""}
            </p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateStudentModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    active: { label: "Activo", color: "var(--success)", bg: "var(--success-bg)" },
    inactive: { label: "Inactivo", color: "var(--text-muted)", bg: "var(--bg-muted)" },
    passed: {
      label: "Aprobado",
      color: "var(--brand)",
      bg: "color-mix(in srgb, var(--brand) 10%, transparent)",
    },
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
