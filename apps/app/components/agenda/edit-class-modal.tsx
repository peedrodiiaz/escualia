"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { X } from "lucide-react";
import { updateClass, type ClassActionState } from "@/app/dashboard/agenda/actions";
import type { Database } from "@/types/database";

type ClassRow = Database["public"]["Tables"]["classes"]["Row"];
type StudentRow = Database["public"]["Tables"]["students"]["Row"];

type Props = {
  cls: ClassRow;
  students: StudentRow[];
  onClose: () => void;
};

function getTzOffset() {
  const offset = -new Date().getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${sign}${hh}:${mm}`;
}

export function EditClassModal({ cls, students, onClose }: Props) {
  const updateWithId = updateClass.bind(null, cls.id);
  const [state, action] = useActionState<ClassActionState, FormData>(updateWithId, null);
  const hasSubmittedRef = useRef(false);
  const [tzOffset, setTzOffset] = useState("+00:00");

  useEffect(() => {
    setTzOffset(getTzOffset());
  }, []);

  useEffect(() => {
    if (state === null && hasSubmittedRef.current) {
      onClose();
    }
  }, [state, onClose]);

  const startDate = new Date(cls.start_time);
  const defaultDate = startDate.toISOString().split("T")[0];
  const defaultTime = startDate.toTimeString().slice(0, 5);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="rounded-xl w-full max-w-lg"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="font-semibold text-base" style={{ color: "var(--text)" }}>
            Editar clase
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        <form
          action={action}
          onSubmit={() => { hasSubmittedRef.current = true; }}
          className="p-6 space-y-4"
        >
          <input type="hidden" name="tz_offset" value={tzOffset} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Fecha *
              </label>
              <input
                name="date"
                type="date"
                required
                defaultValue={defaultDate}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{
                  background: "var(--bg-muted)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Hora *
              </label>
              <input
                name="time"
                type="time"
                required
                defaultValue={defaultTime}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{
                  background: "var(--bg-muted)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Duración (minutos)
              </label>
              <select
                name="duration_minutes"
                defaultValue={String(cls.duration_minutes)}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{
                  background: "var(--bg-muted)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              >
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
                <option value="120">2 horas</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Tipo de clase
              </label>
              <select
                name="lesson_type"
                defaultValue={cls.lesson_type}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{
                  background: "var(--bg-muted)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              >
                <option value="práctica">Práctica</option>
                <option value="teoría">Teoría</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Estado
            </label>
            <select
              name="status"
              defaultValue={cls.status}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{
                background: "var(--bg-muted)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              <option value="available">Disponible</option>
              <option value="booked">Reservada</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Notas
            </label>
            <textarea
              name="notes"
              defaultValue={cls.notes ?? ""}
              rows={2}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-none"
              style={{
                background: "var(--bg-muted)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          {state?.error && (
            <p className="text-sm" style={{ color: "var(--danger)" }}>
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                background: "var(--bg-muted)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              Cancelar
            </button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
      style={{ background: "var(--brand)", color: "#fff" }}
    >
      {pending ? "Guardando..." : "Guardar cambios"}
    </button>
  );
}
