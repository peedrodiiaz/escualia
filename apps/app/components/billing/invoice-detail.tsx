import type { InvoiceRow, InvoiceItemRow } from "@/types/database";

type StudentData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  dni: string | null;
};

type Props = {
  invoice: InvoiceRow;
  items: InvoiceItemRow[];
  student: StudentData;
  schoolName: string;
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

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Datáfono",
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

export function InvoiceDetail({ invoice, items, student, schoolName }: Props) {
  const statusStyle = STATUS_COLORS[invoice.status] ?? STATUS_COLORS.pending;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
    >
      {/* Cabecera */}
      <div
        className="px-8 py-6 flex items-start justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--brand)" }}>
            {schoolName}
          </p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            {invoice.number}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
            Fecha de emisión
          </p>
          <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
            {formatDate(invoice.issue_date)}
          </p>
          {invoice.due_date && (
            <>
              <p className="text-xs mt-2 mb-1" style={{ color: "var(--text-muted)" }}>
                Vencimiento
              </p>
              <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                {formatDate(invoice.due_date)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Datos del cliente */}
      <div className="px-8 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-muted)" }}>
          Cliente
        </p>
        <p className="font-semibold" style={{ color: "var(--text)" }}>
          {student.first_name} {student.last_name}
        </p>
        {student.dni && (
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            DNI: {student.dni}
          </p>
        )}
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          {student.email}
        </p>
        {student.phone && (
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {student.phone}
          </p>
        )}
      </div>

      {/* Tabla de items */}
      <div className="px-8 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th className="text-left pb-3 font-semibold" style={{ color: "var(--text-muted)" }}>
                Descripción
              </th>
              <th className="text-right pb-3 font-semibold w-16" style={{ color: "var(--text-muted)" }}>
                Cant.
              </th>
              <th className="text-right pb-3 font-semibold w-28" style={{ color: "var(--text-muted)" }}>
                Precio unit.
              </th>
              <th className="text-right pb-3 font-semibold w-28" style={{ color: "var(--text-muted)" }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="py-3" style={{ color: "var(--text)" }}>
                  {item.description}
                </td>
                <td className="py-3 text-right" style={{ color: "var(--text)" }}>
                  {item.quantity}
                </td>
                <td className="py-3 text-right" style={{ color: "var(--text)" }}>
                  {formatEuros(item.unit_price_cents)}
                </td>
                <td className="py-3 text-right font-medium" style={{ color: "var(--text)" }}>
                  {formatEuros(item.total_cents)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="px-8 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-8 text-sm" style={{ color: "var(--text-muted)" }}>
            <span>Subtotal</span>
            <span className="w-28 text-right">{formatEuros(invoice.subtotal_cents)}</span>
          </div>
          <div className="flex gap-8 text-sm" style={{ color: "var(--text-muted)" }}>
            <span>IVA ({invoice.tax_rate}%)</span>
            <span className="w-28 text-right">{formatEuros(invoice.tax_cents)}</span>
          </div>
          <div
            className="flex gap-8 text-base font-bold mt-1 pt-3"
            style={{ color: "var(--text)", borderTop: "1px solid var(--border)", width: "auto" }}
          >
            <span>Total</span>
            <span className="w-28 text-right">{formatEuros(invoice.total_cents)}</span>
          </div>
        </div>
      </div>

      {/* Estado de pago */}
      <div className="px-8 py-5">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: statusStyle.bg, color: statusStyle.color }}
          >
            {STATUS_LABELS[invoice.status] ?? invoice.status}
          </span>
          {invoice.status === "paid" && invoice.payment_method && (
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              · {PAYMENT_LABELS[invoice.payment_method] ?? invoice.payment_method}
            </span>
          )}
          {invoice.status === "paid" && invoice.paid_at && (
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              · {formatDate(invoice.paid_at)}
            </span>
          )}
        </div>
        {invoice.notes && (
          <p className="text-sm mt-4" style={{ color: "var(--text-muted)" }}>
            <span className="font-medium" style={{ color: "var(--text)" }}>Notas: </span>
            {invoice.notes}
          </p>
        )}
      </div>
    </div>
  );
}
