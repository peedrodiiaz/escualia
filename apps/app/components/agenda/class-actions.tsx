"use client";

import { useState } from "react";
import { Pencil, Trash2, UserPlus, UserMinus } from "lucide-react";
import { deleteClass, bookStudent, unassignStudent } from "@/app/dashboard/agenda/actions";
import { EditClassModal } from "./edit-class-modal";
import type { Database } from "@/types/database";

type ClassRow = Database["public"]["Tables"]["classes"]["Row"];
type StudentRow = Database["public"]["Tables"]["students"]["Row"];

type Props = {
  cls: ClassRow;
  students: StudentRow[];
  canManage: boolean;
};

export function ClassActions({ cls, students, canManage }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [showAssignSelect, setShowAssignSelect] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [assignError, setAssignError] = useState<string | null>(null);

  if (!canManage) return null;

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta clase? Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    const result = await deleteClass(cls.id);
    if (result?.error) setDeleting(false);
  };

  const handleAssign = async () => {
    if (!selectedStudentId) return;
    setAssigning(true);
    setAssignError(null);
    const result = await bookStudent(cls.id, selectedStudentId);
    if (result?.error) {
      setAssignError(result.error);
      setAssigning(false);
    } else {
      setShowAssignSelect(false);
      setAssigning(false);
    }
  };

  const handleUnassign = async () => {
    if (!confirm("¿Desasignar el alumno de esta clase?")) return;
    setAssigning(true);
    await unassignStudent(cls.id);
    setAssigning(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {cls.student_id ? (
          <button
            onClick={handleUnassign}
            disabled={assigning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
            style={{
              background: "var(--bg-muted)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
          >
            <UserMinus size={13} />
            {assigning ? "..." : "Desasignar"}
          </button>
        ) : (
          showAssignSelect ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <select
                  value={selectedStudentId}
                  onChange={(e) => { setSelectedStudentId(e.target.value); setAssignError(null); }}
                  className="rounded-lg px-2 py-1.5 text-xs outline-none"
                  style={{
                    background: "var(--bg-muted)",
                    border: `1px solid ${assignError ? "var(--danger)" : "var(--border)"}`,
                    color: "var(--text)",
                  }}
                >
                  <option value="">Seleccionar alumno...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.first_name} {s.last_name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={assigning || !selectedStudentId}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-60"
                  style={{ background: "var(--brand)", color: "#fff" }}
                >
                  {assigning ? "..." : "Asignar"}
                </button>
                <button
                  onClick={() => { setShowAssignSelect(false); setAssignError(null); }}
                  className="px-2 py-1.5 rounded-lg text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  ✕
                </button>
              </div>
              {assignError && (
                <p className="text-xs" style={{ color: "var(--danger)" }}>
                  {assignError}
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAssignSelect(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: "var(--bg-muted)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              <UserPlus size={13} />
              Asignar alumno
            </button>
          )
        )}

        <button
          onClick={() => setShowEditModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            background: "var(--bg-muted)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        >
          <Pencil size={13} />
          Editar
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
          style={{
            background: "var(--danger-bg)",
            color: "var(--danger)",
            border: "1px solid var(--danger)",
          }}
        >
          <Trash2 size={13} />
          {deleting ? "..." : "Eliminar"}
        </button>
      </div>

      {showEditModal && (
        <EditClassModal
          cls={cls}
          students={students}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
