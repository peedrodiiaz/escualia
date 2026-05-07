"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CreateInvoiceModal } from "./create-invoice-modal";
import { InvoiceActions } from "./invoice-actions";
import type { InvoiceRow, InvoiceItemRow, Database } from "@/types/database";

type StudentRow = Database["public"]["Tables"]["students"]["Row"];

type InvoiceWithStudent = InvoiceRow & {
  student: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    dni: string | null;
  } | null;
  items?: InvoiceItemRow[];
};

type Props = {
  invoices: InvoiceWithStudent[];
  students: StudentRow[];
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  overdue: "Vencida",
  cancelled: "Cancelada",
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "var(--warning-bg)", color: "var(--warning)" },
  paid: { bg: "var(--success-bg)", color: "var(--success)" },
  overdue: { bg: "var(--danger-bg)", color: "var(--danger)" },
  cancelled: { bg: "var(--bg-muted)", color: "var(--text-muted)" },
};

function formatEuros(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function InvoiceList({ invoices, students }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const summary = useMemo(() => {
    const active = invoices.filter((i) => i.status !== "cancelled");
    const totalBilled = active.reduce((sum, i) => sum + i.total_cents, 0);
    const totalPaid = active
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.total_cents, 0);
    const totalPending = active
      .filter((i) => ["pending", "overdue"].includes(i.status))
      .reduce((sum, i) => sum + i.total_cents, 0);
    const pendingCount = active.filter((i) => ["pending", "overdue"].includes(i.status)).length;
    return { totalBilled, totalPaid, totalPending, pendingCount };
  }, [invoices]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return invoices.filter((inv) => {
      const matchesSearch =
        !q ||
        inv.number.toLowerCase().includes(q) ||
        (inv.student
          ? `${inv.student.first_name} ${inv.student.last_name}`.toLowerCase().includes(q)
          : false);
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            Facturación
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Facturas emitidas a los alumnos
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: "var(--brand)", color: "#fff" }}
        >
          <Plus size={15} />
          Nueva factura
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
        <SummaryCard label="Total facturado" value={formatEuros(summary.totalBilled)} />
        <SummaryCard label="Total cobrado" value={formatEuros(summary.totalPaid)} color="var(--success)" />
        <SummaryCard
          label="Pendiente de cobro"
          value={formatEuros(summary.totalPending)}
          color={summary.totalPending > 0 ? "var(--warning)" : undefined}
        />
        <SummaryCard
          label="Facturas pendientes"
          value={String(summary.pendingCount)}
          color={summary.pendingCount > 0 ? "var(--warning)" : undefined}
        />
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por alumno o nº factura..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 rounded-lg px-3 py-2 text-sm"
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm"
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="paid">Pagado</option>
          <option value="overdue">Vencida</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>

      {/* Tabla */}
      {filtered.length > 0 ? (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--bg-muted)", borderBottom: "1px solid var(--border)" }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>
                  Nº Factura
                </th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>
                  Alumno
                </th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>
                  Fecha
                </th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>
                  Vencimiento
                </th>
                <th className="text-right px-4 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>
                  Total
                </th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>
                  Estado
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => {
                const statusStyle = STATUS_COLORS[inv.status] ?? STATUS_COLORS.pending;
                return (
                  <tr
                    key={inv.id}
                    className="transition-colors cursor-pointer"
                    style={{ borderBottom: "1px solid var(--border)" }}
                    onClick={() => router.push(`/dashboard/billing/${inv.id}`)}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>
                      {inv.number}
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text)" }}>
                      {inv.student
                        ? `${inv.student.first_name} ${inv.student.last_name}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {formatDate(inv.issue_date)}
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {inv.due_date ? formatDate(inv.due_date) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium" style={{ color: "var(--text)" }}>
                      {formatEuros(inv.total_cents)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: statusStyle.bg, color: statusStyle.color }}
                      >
                        {STATUS_LABELS[inv.status] ?? inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <InvoiceActions
                        invoice={inv}
                        items={inv.items ?? []}
                        student={inv.student ?? { first_name: "", last_name: "", email: "", phone: null, dni: null }}
                        schoolName=""
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="rounded-xl py-16 text-center"
          style={{ border: "1px solid var(--border)", background: "var(--bg-subtle)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            {search || statusFilter !== "all"
              ? "No hay facturas que coincidan con los filtros"
              : "No hay facturas todavía"}
          </p>
          {!search && statusFilter === "all" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-3 text-sm font-medium"
              style={{ color: "var(--brand)" }}
            >
              Crear la primera factura
            </button>
          )}
        </div>
      )}

      {showCreateModal && (
        <CreateInvoiceModal
          students={students}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
    >
      <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p
        className="text-xl font-bold"
        style={{ color: color ?? "var(--text)" }}
      >
        {value}
      </p>
    </div>
  );
}
