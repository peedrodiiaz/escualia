"use client";

import { useState } from "react";
import { SessionHistoryRow } from "./session-history-row";
import type { TestSessionRow } from "@/types/database";

type Props = {
  sessions: TestSessionRow[];
};

type Filter = "all" | "practice" | "exam";

const FILTER_LABELS: Record<Filter, string> = {
  all: "Todos",
  practice: "Práctica",
  exam: "Simulacros",
};

export function SessionHistory({ sessions }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = sessions.filter((s) => filter === "all" || s.mode === filter);

  return (
    <div>
      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        {(["all", "practice", "exam"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: filter === f ? "var(--accent)" : "var(--bg-muted)",
              color: filter === f ? "#fff" : "var(--text-muted)",
              border: `1px solid ${filter === f ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No hay sesiones con este filtro.
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <div style={{ background: "var(--bg-card)" }}>
            {filtered.map((session, i) => (
              <div
                key={session.id}
                style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
              >
                <SessionHistoryRow session={session} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
