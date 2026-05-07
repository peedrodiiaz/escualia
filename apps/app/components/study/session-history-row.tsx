"use client";

import Link from "next/link";
import type { TestSessionRow } from "@/types/database";

type Props = {
  session: TestSessionRow;
};

const MODE_LABELS: Record<string, string> = { practice: "Práctica", exam: "Simulacro" };

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(startedAt: string, finishedAt: string | null): string {
  if (!finishedAt) return "—";
  const secs = Math.floor((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

export function SessionHistoryRow({ session }: Props) {
  const isClickable = session.status !== "in_progress";
  const href =
    session.status === "in_progress"
      ? `/dashboard/study/${session.id}`
      : `/dashboard/study/results/${session.id}`;

  const content = (
    <div className="flex items-center justify-between px-5 py-3.5 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm font-medium shrink-0" style={{ color: "var(--text)" }}>
          {MODE_LABELS[session.mode] ?? session.mode}
        </span>
        <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
          {formatDate(session.started_at)}
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {formatDuration(session.started_at, session.finished_at)}
        </span>
        {session.score_pct !== null && (
          <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--text)" }}>
            {session.score_pct.toFixed(0)}%
          </span>
        )}
        {session.mode === "exam" && session.status === "completed" && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: session.passed ? "var(--success-bg)" : "var(--danger-bg)",
              color: session.passed ? "var(--success)" : "var(--danger)",
            }}
          >
            {session.passed ? "Aprobado" : "Suspendido"}
          </span>
        )}
        {session.status === "abandoned" && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--bg-muted)", color: "var(--text-muted)" }}
          >
            Abandonado
          </span>
        )}
        {session.status === "in_progress" && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--warning-bg)", color: "var(--warning)" }}
          >
            En curso
          </span>
        )}
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <Link
        href={href}
        className="block transition-opacity hover:opacity-70"
        style={{ textDecoration: "none" }}
      >
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}
