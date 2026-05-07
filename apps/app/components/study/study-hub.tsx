"use client";

import Link from "next/link";
import { Target, BookOpen, Trophy, History } from "lucide-react";
import { StatsCard } from "./stats-card";
import { StartTestForm } from "./start-test-form";
import type { StudentTestSummary, TestSessionRow } from "@/types/database";

type Props = {
  stats: StudentTestSummary | null;
  recentSessions: TestSessionRow[];
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const MODE_LABELS: Record<string, string> = { practice: "Práctica", exam: "Simulacro" };
const STATUS_LABELS: Record<string, string> = {
  completed: "Completado",
  abandoned: "Abandonado",
  in_progress: "En curso",
};

export function StudyHub({ stats, recentSessions }: Props) {
  return (
    <div>
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          <StatsCard
            label="Tests realizados"
            value={stats.totalSessions}
            icon={BookOpen}
          />
          <StatsCard
            label="% medio acierto"
            value={`${stats.avgScorePct.toFixed(0)}%`}
            icon={Target}
            color="var(--accent)"
          />
          <StatsCard
            label="Simulacros"
            value={stats.totalExams}
            icon={Trophy}
            color="var(--warning)"
          />
          <StatsCard
            label="Aprobados"
            value={stats.passedExams}
            icon={Trophy}
            color="var(--success)"
          />
        </div>
      )}

      {/* Formulario de inicio */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text)" }}>
          Iniciar nuevo test
        </h2>
        <StartTestForm />
      </div>

      {/* Historial reciente */}
      {recentSessions.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ background: "var(--bg-muted)", borderBottom: "1px solid var(--border)" }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              Últimas sesiones
            </h2>
            <Link
              href="/dashboard/study/history"
              className="text-xs flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: "var(--accent)" }}
            >
              <History size={12} />
              Ver todo
            </Link>
          </div>
          <div style={{ background: "var(--bg-card)" }}>
            {recentSessions.slice(0, 5).map((s, i) => (
              <Link
                key={s.id}
                href={s.status !== "in_progress" ? `/dashboard/study/results/${s.id}` : `/dashboard/study/${s.id}`}
                className="flex items-center justify-between px-5 py-3.5 transition-opacity hover:opacity-70"
                style={{
                  borderTop: i > 0 ? "1px solid var(--border)" : "none",
                  textDecoration: "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                    {MODE_LABELS[s.mode] ?? s.mode}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {formatDate(s.started_at)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {s.score_pct !== null && (
                    <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                      {s.score_pct.toFixed(0)}%
                    </span>
                  )}
                  {s.mode === "exam" && s.status === "completed" && (
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: s.passed ? "var(--success-bg)" : "var(--danger-bg)",
                        color: s.passed ? "var(--success)" : "var(--danger)",
                      }}
                    >
                      {s.passed ? "Aprobado" : "Suspendido"}
                    </span>
                  )}
                  {s.status !== "completed" && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--bg-muted)", color: "var(--text-muted)" }}
                    >
                      {STATUS_LABELS[s.status]}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
