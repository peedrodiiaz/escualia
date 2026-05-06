"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { deleteStudent } from "@/app/dashboard/students/actions";
import { EditStudentModal } from "./edit-student-modal";
import type { Database } from "@/types/database";

type StudentRow = Database["public"]["Tables"]["students"]["Row"];

type Props = {
  student: StudentRow;
};

export function StudentActions({ student }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este alumno? Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    await deleteStudent(student.id);
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowEditModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: "var(--bg-muted)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        >
          <Pencil size={15} />
          Editar
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          style={{
            background: "var(--danger-bg)",
            color: "var(--danger)",
            border: "1px solid var(--danger)",
          }}
        >
          <Trash2 size={15} />
          {deleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>

      {showEditModal && (
        <EditStudentModal
          student={student}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
