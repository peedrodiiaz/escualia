import { jsPDF } from "jspdf";
import type { InvoiceRow, InvoiceItemRow } from "@/types/database";

type StudentData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  dni: string | null;
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Datáfono",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "PENDIENTE",
  paid: "PAGADO",
  overdue: "VENCIDA",
  cancelled: "CANCELADA",
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

export function generateInvoicePdf(
  invoice: InvoiceRow,
  items: InvoiceItemRow[],
  student: StudentData,
  schoolName: string
): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // ── Colores
  const gray = [100, 100, 100] as const;
  const darkGray = [40, 40, 40] as const;
  const lightGray = [220, 220, 220] as const;
  const black = [0, 0, 0] as const;
  const brandColor = [37, 99, 235] as const; // azul

  // ── Cabecera
  doc.setFontSize(22);
  doc.setTextColor(...brandColor);
  doc.setFont("helvetica", "bold");
  doc.text(schoolName.toUpperCase(), margin, 28);

  doc.setFontSize(24);
  doc.setTextColor(...darkGray);
  doc.text("FACTURA", pageWidth - margin, 20, { align: "right" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...gray);
  doc.text(invoice.number, pageWidth - margin, 28, { align: "right" });
  doc.text(`Fecha: ${formatDate(invoice.issue_date)}`, pageWidth - margin, 35, { align: "right" });
  if (invoice.due_date) {
    doc.text(`Vencimiento: ${formatDate(invoice.due_date)}`, pageWidth - margin, 41, { align: "right" });
  }

  // ── Separador
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(margin, 48, pageWidth - margin, 48);

  // ── Datos del cliente
  let y = 56;
  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENTE", margin, y);

  y += 6;
  doc.setFontSize(12);
  doc.setTextColor(...darkGray);
  doc.setFont("helvetica", "bold");
  doc.text(`${student.first_name} ${student.last_name}`, margin, y);

  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...gray);
  if (student.dni) {
    doc.text(`DNI: ${student.dni}`, margin, y);
    y += 5;
  }
  doc.text(student.email, margin, y);
  if (student.phone) {
    y += 5;
    doc.text(student.phone, margin, y);
  }

  // ── Tabla de items
  y += 12;
  doc.setDrawColor(...lightGray);
  doc.line(margin, y, pageWidth - margin, y);

  y += 7;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...gray);
  doc.text("DESCRIPCIÓN", margin, y);
  doc.text("CANT.", margin + contentWidth * 0.62, y, { align: "right" });
  doc.text("PRECIO UNIT.", margin + contentWidth * 0.78, y, { align: "right" });
  doc.text("TOTAL", pageWidth - margin, y, { align: "right" });

  y += 3;
  doc.setDrawColor(...lightGray);
  doc.line(margin, y, pageWidth - margin, y);

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkGray);
  doc.setFontSize(10);

  for (const item of items) {
    const desc = item.description.length > 55
      ? item.description.substring(0, 52) + "..."
      : item.description;
    doc.text(desc, margin, y);
    doc.text(String(item.quantity), margin + contentWidth * 0.62, y, { align: "right" });
    doc.text(formatEuros(item.unit_price_cents), margin + contentWidth * 0.78, y, { align: "right" });
    doc.text(formatEuros(item.total_cents), pageWidth - margin, y, { align: "right" });
    y += 8;
  }

  // ── Separador totales
  y += 2;
  doc.setDrawColor(...lightGray);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // ── Totales
  const totalsX = pageWidth - margin - 80;
  const valuesX = pageWidth - margin;

  doc.setFontSize(10);
  doc.setTextColor(...gray);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", totalsX, y);
  doc.text(formatEuros(invoice.subtotal_cents), valuesX, y, { align: "right" });

  y += 7;
  doc.text(`IVA (${invoice.tax_rate}%)`, totalsX, y);
  doc.text(formatEuros(invoice.tax_cents), valuesX, y, { align: "right" });

  y += 3;
  doc.setDrawColor(...lightGray);
  doc.line(totalsX, y, pageWidth - margin, y);
  y += 7;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...black);
  doc.text("TOTAL", totalsX, y);
  doc.text(formatEuros(invoice.total_cents), valuesX, y, { align: "right" });

  // ── Estado de pago
  y += 14;
  const statusLabel = STATUS_LABELS[invoice.status] ?? invoice.status.toUpperCase();
  const isPaid = invoice.status === "paid";

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...(isPaid ? ([22, 163, 74] as const) : ([156, 163, 175] as const)));
  let statusLine = `Estado: ${statusLabel}`;
  if (isPaid && invoice.payment_method) {
    statusLine += ` · ${PAYMENT_LABELS[invoice.payment_method] ?? invoice.payment_method}`;
  }
  if (isPaid && invoice.paid_at) {
    statusLine += ` · ${formatDate(invoice.paid_at)}`;
  }
  doc.text(statusLine, margin, y);

  // ── Notas
  if (invoice.notes) {
    y += 10;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text("Notas:", margin, y);
    y += 5;
    const lines = doc.splitTextToSize(invoice.notes, contentWidth) as string[];
    doc.text(lines, margin, y);
  }

  // ── Pie
  const footerY = 280;
  doc.setDrawColor(...lightGray);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.setFont("helvetica", "normal");
  doc.text("Documento generado por Escualia", margin, footerY + 6);

  doc.save(`${invoice.number}.pdf`);
}
