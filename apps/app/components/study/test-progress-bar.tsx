"use client";

type Props = {
  current: number;
  total: number;
  correctSoFar: number;
  incorrectSoFar: number;
};

export function TestProgressBar({ current, total, correctSoFar, incorrectSoFar }: Props) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
        <span>
          Pregunta {current} de {total}
        </span>
        <span className="flex gap-3">
          <span style={{ color: "var(--success)" }}>✓ {correctSoFar}</span>
          <span style={{ color: "var(--danger)" }}>✗ {incorrectSoFar}</span>
        </span>
      </div>
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: "var(--accent)" }}
        />
      </div>
    </div>
  );
}
