"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { markAsPaid, type BillingActionState } from "@/app/dashboard/billing/actions";

type Props = {
  invoiceId: string;
  onClose: () => void;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity"
      style={{
        background: "var(--success)",
        color: "#fff",
        opacity: pending ? 0.6 : 1,
        cursor: pending ? "not-allowed" : "pointer",
      }}
    >
      {pending ? "Guardando..." : "Confirmar pago"}
    </button>
  );
}

export function MarkAsPaidModal({ invoiceId, onClose }: Props) {
  const [state, action] = useActionState<BillingActionState, FormData>(markAsPaid, null);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (state === null && hasSubmittedRef.current) onClose();
  }, [state, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>
          Marcar como pagada
        </h2>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          Selecciona el método de cobro para registrar el pago.
        </p>

        <form
          action={action}
          onSubmit={() => { hasSubmittedRef.current = true; }}
        >
          <input type="hidden" name="invoice_id" value={invoiceId} />

          <div className="mb-5">
            <label
              htmlFor="payment_method"
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text)" }}
            >
              Método de pago
            </label>
            <select
              id="payment_method"
              name="payment_method"
              required
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              <option value="">Seleccionar...</option>
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia</option>
              <option value="card">Datáfono</option>
            </select>
          </div>

          {state?.error && (
            <p className="text-sm mb-4" style={{ color: "var(--danger)" }}>
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--bg-muted)", color: "var(--text)" }}
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
