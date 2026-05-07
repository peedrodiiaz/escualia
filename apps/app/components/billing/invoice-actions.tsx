"use client";

import { useState } from "react";
import { Download, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { cancelInvoice, deleteInvoice } from "@/app/dashboard/billing/actions";
import { MarkAsPaidModal } from "./mark-as-paid-modal";
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

export function InvoiceActions({ invoice, items, student, schoolName }: Props) {
  const [showPayModal, setShowPayModal] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    if (!confirm("¿Cancelar esta factura?")) return;
    setLoading("cancel");
    setError(null);
    const result = await cancelInvoice(invoice.id);
    if (result?.error) setError(result.error);
    setLoading(null);
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta factura? Esta acción no se puede deshacer.")) return;
    setLoading("delete");
    setError(null);
    const result = await deleteInvoice(invoice.id);
    if (result?.error) setError(result.error);
    setLoading(null);
  };

  const handlePdf = async () => {
    setLoading("pdf");
    const { generateInvoicePdf } = await import("@/lib/billing/generate-pdf");
    generateInvoicePdf(invoice, items, student, schoolName);
    setLoading(null);
  };

  const canPay = invoice.status === "pending" || invoice.status === "overdue";
  const canCancel = invoice.status === "pending" || invoice.status === "overdue";
  const canDelete = invoice.status === "pending" || invoice.status === "cancelled";

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {canPay && (
          <button
            onClick={() => setShowPayModal(true)}
            disabled={loading !== null}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity"
            style={{
              background: "var(--success-bg)",
              color: "var(--success)",
              opacity: loading !== null ? 0.5 : 1,
            }}
          >
            <CheckCircle size={15} />
            Marcar como pagada
          </button>
        )}

        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={loading !== null}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity"
            style={{
              background: "var(--warning-bg)",
              color: "var(--warning)",
              opacity: loading !== null ? 0.5 : 1,
            }}
          >
            <XCircle size={15} />
            {loading === "cancel" ? "Cancelando..." : "Cancelar"}
          </button>
        )}

        <button
          onClick={handlePdf}
          disabled={loading !== null}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity"
          style={{
            background: "var(--bg-muted)",
            color: "var(--text)",
            opacity: loading !== null ? 0.5 : 1,
          }}
        >
          <Download size={15} />
          {loading === "pdf" ? "Generando..." : "Descargar PDF"}
        </button>

        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={loading !== null}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity"
            style={{
              background: "var(--danger-bg)",
              color: "var(--danger)",
              opacity: loading !== null ? 0.5 : 1,
            }}
          >
            <Trash2 size={15} />
            {loading === "delete" ? "Eliminando..." : "Eliminar"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm mt-2" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      {showPayModal && (
        <MarkAsPaidModal
          invoiceId={invoice.id}
          onClose={() => setShowPayModal(false)}
        />
      )}
    </>
  );
}
