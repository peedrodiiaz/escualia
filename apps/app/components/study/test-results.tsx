"use client";

import Link from "next/link";
import { CheckCircle, XCircle, BookOpen } from "lucide-react";
import { ResultsBreakdown } from "./results-breakdown";
import type { SessionWithAnswers } from "@/types/database";

type Props = {
  session: SessionWithAnswers;
};

function formatDuration(startedAt: string, finishedAt: string | null): string {
  if (!finishedAt) return "—";
  const secs = Math.floor((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

export function TestResults({ session }: Props) {
  const scorePct = session.score_pct ?? 0;
  const isExam = session.mode === "exam";
  const passed = session.passed;

  let badge: { label: string; bg: string; color: string } | null = null;
  if (isExam) {
    badge =
      passed === true
        ? { label: "APROBADO", bg: "var(--success-bg)", color: "var(--success)" }
        : { label: "SUSPENDIDO", bg: "var(--danger-bg)", color: "var(--danger)" };
  }

  return (
    <div className="max-w-2xl">
      {/* Puntuación */}
      <div
        className="rounded-xl p-8 mb-5 text-center"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        {badge && (
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4"
            style={{ background: badge.bg, color: badge.color }}
          >
            {passed ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {badge.label}
          </div>
        )}
        <div className="text-6xl font-bold mb-2" style={{ color: "var(--text)" }}>
          {scorePct.toFixed(0)}%
        </div>
        <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
          {session.correct_count} correctas de {session.total_questions} preguntas
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <span style={{ color: "var(--success)" }}>✓ {session.correct_count} correctas</span>
          <span style={{ color: "var(--danger)" }}>✗ {session.incorrect_count} incorrectas</span>
          {session.unanswered_count > 0 && (
            <span style={{ color: "var(--text-muted)" }}>
              — {session.unanswered_count} sin responder
            </span>
          )}
        </div>
        <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
          Tiempo: {formatDuration(session.started_at, session.finished_at)}
        </p>
      </div>

      {/* Acciones */}
      <div className="flex gap-3 mb-6">
        <Link
          href="/dashboard/study"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <BookOpen size={15} />
          Volver a estudiar
        </Link>
        <Link
          href="/dashboard/study/history"
          className="px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            background: "var(--bg-muted)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        >
          Ver historial
        </Link>
      </div>

      {/* Desglose */}
      <ResultsBreakdown answers={session.test_answers} />
    </div>
  );
}
