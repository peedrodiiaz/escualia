"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createInvoice, type BillingActionState } from "@/app/dashboard/billing/actions";
import type { Database } from "@/types/database";

type StudentRow = Database["public"]["Tables"]["students"]["Row"];

type Props = {
  students: StudentRow[];
  onClose: () => void;
};

type ItemRow = {
  id: string;
  description: string;
  quantity: number;
  unit_price_euros: string;
};

const TEMPLATES: { label: string; description: string; price: string }[] = [
  { label: "Clase práctica", description: "Clase práctica (1h)", price: "35.00" },
  { label: "Bono 10 clases", description: "Bono 10 clases prácticas", price: "300.00" },
  { label: "Matrícula", description: "Matrícula expediente B", price: "150.00" },
  { label: "Examen teórico", description: "Examen teórico DGT", price: "94.00" },
  { label: "Examen práctico", description: "Examen práctico DGT", price: "182.00" },
];

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function CreateInvoiceModal({ students, onClose }: Props) {
  const [state, action] = useActionState<BillingActionState, FormData>(createInvoice, null);
  const hasSubmittedRef = useRef(false);

  const [items, setItems] = useState<ItemRow[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1, unit_price_euros: "" },
  ]);
  const [taxRate, setTaxRate] = useState(21);

  useEffect(() => {
    if (state === null && hasSubmittedRef.current) onClose();
  }, [state, onClose]);

  const addItem = (template?: { description: string; price: string }) => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description: template?.description ?? "",
        quantity: 1,
        unit_price_euros: template?.price ?? "",
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
  };

  const updateItem = (id: string, field: keyof ItemRow, value: string | number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const summary = useMemo(() => {
    const subtotal = items.reduce((sum, i) => {
      const price = parseFloat(i.unit_price_euros) || 0;
      return sum + i.quantity * Math.round(price * 100);
    }, 0);
    const tax = Math.round(subtotal * taxRate / 100);
    return { subtotal, tax, total: subtotal + tax };
  }, [items, taxRate]);

  const serializedItems = JSON.stringify(
    items.map((i) => ({
      description: i.description,
      quantity: i.quantity,
      unit_price_cents: Math.round((parseFloat(i.unit_price_euros) || 0) * 100),
    }))
  );

  function formatEuros(cents: number): string {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl shadow-xl flex flex-col"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          maxHeight: "92vh",
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            Nueva factura
          </h2>
        </div>

        {/* Body scrollable */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <form
            id="invoice-form"
            action={action}
            onSubmit={() => { hasSubmittedRef.current = true; }}
          >
            <input type="hidden" name="items" value={serializedItems} />

            {/* Alumno */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
                Alumno <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <select
                name="student_id"
                required
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border)",
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
            </div>

            {/* Fechas */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
                  Fecha de emisión <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="date"
                  name="issue_date"
                  defaultValue={todayISO()}
                  required
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
                  Vencimiento
                </label>
                <input
                  type="date"
                  name="due_date"
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>
            </div>

            {/* Quick templates */}
            <div className="mb-4">
              <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
                Plantillas rápidas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => addItem(t)}
                    className="text-xs px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
                    style={{
                      background: "var(--brand-bg)",
                      color: "var(--brand)",
                      border: "1px solid var(--brand)",
                    }}
                  >
                    + {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                Líneas de factura
              </p>
              <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                {/* Cabecera tabla */}
                <div
                  className="grid text-xs font-semibold px-3 py-2"
                  style={{
                    gridTemplateColumns: "1fr 60px 100px 24px",
                    gap: "8px",
                    background: "var(--bg-muted)",
                    color: "var(--text-muted)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span>Descripción</span>
                  <span className="text-center">Cant.</span>
                  <span className="text-right">Precio (€)</span>
                  <span />
                </div>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid px-3 py-2 items-center"
                    style={{
                      gridTemplateColumns: "1fr 60px 100px 24px",
                      gap: "8px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Descripción del concepto"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="rounded px-2 py-1 text-sm w-full"
                      style={{
                        background: "var(--bg-subtle)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                      }}
                    />
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                      className="rounded px-2 py-1 text-sm text-center w-full"
                      style={{
                        background: "var(--bg-subtle)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                      }}
                    />
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      value={item.unit_price_euros}
                      onChange={(e) => updateItem(item.id, "unit_price_euros", e.target.value)}
                      className="rounded px-2 py-1 text-sm text-right w-full"
                      style={{
                        background: "var(--bg-subtle)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      style={{
                        color: "var(--danger)",
                        opacity: items.length === 1 ? 0.3 : 1,
                        cursor: items.length === 1 ? "not-allowed" : "pointer",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem()}
                  className="w-full flex items-center gap-1.5 px-3 py-2 text-sm transition-opacity hover:opacity-70"
                  style={{ color: "var(--brand)" }}
                >
                  <Plus size={14} />
                  Añadir línea
                </button>
              </div>
            </div>

            {/* IVA + Totales */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="w-32">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
                  IVA
                </label>
                <select
                  name="tax_rate"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseInt(e.target.value))}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <option value={0}>0%</option>
                  <option value={10}>10%</option>
                  <option value={21}>21%</option>
                </select>
              </div>
              <div className="text-sm text-right flex-1">
                <div className="flex justify-between gap-4 mb-1" style={{ color: "var(--text-muted)" }}>
                  <span>Subtotal</span>
                  <span>{formatEuros(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4 mb-2" style={{ color: "var(--text-muted)" }}>
                  <span>IVA ({taxRate}%)</span>
                  <span>{formatEuros(summary.tax)}</span>
                </div>
                <div
                  className="flex justify-between gap-4 font-bold text-base pt-2"
                  style={{ color: "var(--text)", borderTop: "1px solid var(--border)" }}
                >
                  <span>Total</span>
                  <span>{formatEuros(summary.total)}</span>
                </div>
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
                Notas
              </label>
              <textarea
                name="notes"
                rows={2}
                placeholder="Observaciones opcionales..."
                className="w-full rounded-lg px-3 py-2 text-sm resize-none"
                style={{
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {state?.error ? (
            <p className="text-sm" style={{ color: "var(--danger)" }}>
              {state.error}
            </p>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--bg-muted)", color: "var(--text)" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="invoice-form"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity"
              style={{ background: "var(--brand)", color: "#fff" }}
            >
              Crear factura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
