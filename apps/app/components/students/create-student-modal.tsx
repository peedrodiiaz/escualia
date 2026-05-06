"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { X } from "lucide-react";
import { createStudent, type StudentActionState } from "@/app/dashboard/students/actions";

type Props = {
  onClose: () => void;
};

export function CreateStudentModal({ onClose }: Props) {
  const [state, action] = useActionState<StudentActionState, FormData>(createStudent, null);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (state === null && hasSubmittedRef.current) {
      onClose();
    }
  }, [state, onClose]);

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
            Nuevo alumno
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Nombre *
              </label>
              <input
                name="first_name"
                required
                placeholder="María"
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
                Apellidos *
              </label>
              <input
                name="last_name"
                required
                placeholder="García López"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{
                  background: "var(--bg-muted)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Email *
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="maria@ejemplo.com"
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{
                background: "var(--bg-muted)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Teléfono
              </label>
              <input
                name="phone"
                placeholder="612 345 678"
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
                DNI
              </label>
              <input
                name="dni"
                placeholder="12345678A"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{
                  background: "var(--bg-muted)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Notas
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Observaciones internas..."
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
      {pending ? "Guardando..." : "Crear alumno"}
    </button>
  );
}
