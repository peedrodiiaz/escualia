import { XCircle } from "lucide-react";
import type { StudentTestSummary } from "@/types/database";

type Props = {
  summary: StudentTestSummary;
  studentName: string;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function ScoreBar({ pct }: { pct: number }) {
  const color = pct >= 90 ? "var(--success)" : pct >= 70 ? "var(--warning)" : "var(--danger)";
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--border)" }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs tabular-nums font-semibold w-10 text-right" style={{ color }}>
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

export function StudentTestStats({ summary, studentName }: Props) {
  const {
    totalSessions,
    totalExams,
    passedExams,
    avgScorePct,
    recentSessions,
    mostFailedQuestions,
  } = summary;

  return (
    <div className="flex flex-col gap-5">
      {/* Resumen global */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Tests realizados", value: totalSessions },
          { label: "% medio acierto", value: `${avgScorePct.toFixed(0)}%` },
          { label: "Simulacros", value: totalExams },
          {
            label: "Aprobados",
            value: `${passedExams}/${totalExams}`,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </p>
            <p className="text-xl font-bold" style={{ color: "var(--text)" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Evolución de scores */}
      {recentSessions.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <div
            className="px-5 py-3"
            style={{ background: "var(--bg-muted)", borderBottom: "1px solid var(--border)" }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              Últimas sesiones
            </h3>
          </div>
          <div style={{ background: "var(--bg-card)" }}>
            {recentSessions.map((s, i) => (
              <div
                key={s.id}
                className="px-5 py-3"
                style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {s.mode === "exam" ? "Simulacro" : "Práctica"} · {formatDate(s.started_at)}
                  </span>
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
                </div>
                {s.score_pct !== null && <ScoreBar pct={s.score_pct} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preguntas más falladas */}
      {mostFailedQuestions.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <div
            className="px-5 py-3"
            style={{ background: "var(--bg-muted)", borderBottom: "1px solid var(--border)" }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              Preguntas más falladas
            </h3>
          </div>
          <div style={{ background: "var(--bg-card)" }}>
            {mostFailedQuestions.map((item, i) => (
              <div
                key={item.question.id}
                className="px-5 py-3.5 flex items-start gap-3"
                style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
              >
                <XCircle size={15} className="shrink-0 mt-0.5" style={{ color: "var(--danger)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: "var(--text)" }}>
                    {item.question.text}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Fallada {item.failCount} {item.failCount === 1 ? "vez" : "veces"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalSessions === 0 && (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {studentName} aún no ha realizado ningún test.
          </p>
        </div>
      )}
    </div>
  );
}
