"use client";

import { useState } from "react";
import { CalendarPlus, Search } from "lucide-react";
import { CreateClassModal } from "./create-class-modal";
import { ClassActions } from "./class-actions";
import type { Database } from "@/types/database";

type ClassRow = Database["public"]["Tables"]["classes"]["Row"];
type StudentRow = Database["public"]["Tables"]["students"]["Row"];

type Props = {
  classes: ClassRow[];
  students: StudentRow[];
  canCreate: boolean;
  canManage: boolean;
};

type StatusFilter = "all" | "available" | "booked" | "completed" | "cancelled";

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: "Disponible", color: "var(--success)", bg: "var(--success-bg)" },
  booked:    { label: "Reservada",  color: "var(--brand)", bg: "color-mix(in srgb, var(--brand) 10%, transparent)" },
  completed: { label: "Completada", color: "var(--text-muted)", bg: "var(--bg-muted)" },
  cancelled: { label: "Cancelada",  color: "var(--danger)", bg: "var(--danger-bg)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABELS[status] ?? STATUS_LABELS.available;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  );
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }),
    time: d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function ClassList({ classes, students, canCreate, canManage }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const studentsById = Object.fromEntries(students.map((s) => [s.id, s]));

  const filtered = classes.filter((c) => {
    const student = c.student_id ? studentsById[c.student_id] : null;
    const studentName = student ? `${student.first_name} ${student.last_name}` : "";
    const matchesSearch =
      search === "" ||
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.lesson_type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
            Agenda
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {filtered.length} de {classes.length} clases
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: "var(--brand)", color: "#fff" }}
          >
            <CalendarPlus size={16} />
            Nueva clase
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
            placeholder="Buscar por alumno o tipo..."
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
          <option value="available">Disponible</option>
          <option value="booked">Reservada</option>
          <option value="completed">Completada</option>
          <option value="cancelled">Cancelada</option>
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
                {["Fecha", "Hora", "Duración", "Tipo", "Alumno", "Estado", ""].map((h) => (
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
              {filtered.map((c, i) => {
                const { date, time } = formatDateTime(c.start_time);
                const student = c.student_id ? studentsById[c.student_id] : null;
                return (
                  <tr
                    key={c.id}
                    style={{
                      borderTop: i > 0 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <td className="px-5 py-3.5 font-medium" style={{ color: "var(--text)" }}>
                      {date}
                    </td>
                    <td className="px-5 py-3.5" style={{ color: "var(--text-muted)" }}>
                      {time}
                    </td>
                    <td className="px-5 py-3.5" style={{ color: "var(--text-muted)" }}>
                      {c.duration_minutes} min
                    </td>
                    <td className="px-5 py-3.5" style={{ color: "var(--text)" }}>
                      {c.lesson_type.charAt(0).toUpperCase() + c.lesson_type.slice(1)}
                    </td>
                    <td className="px-5 py-3.5" style={{ color: "var(--text-muted)" }}>
                      {student ? `${student.first_name} ${student.last_name}` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <ClassActions cls={c} students={students} canManage={canManage} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div
            className="py-16 text-center"
            style={{ background: "var(--bg-card)" }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
              {classes.length === 0
                ? "No hay clases todavía"
                : "No hay resultados para este filtro"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {classes.length === 0 && canCreate
                ? "Crea la primera con el botón de arriba."
                : search || filter !== "all"
                ? "Prueba con otro término de búsqueda o cambia el filtro."
                : ""}
            </p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateClassModal onClose={() => setShowCreateModal(false)} students={students} />
      )}
    </div>
  );
}
