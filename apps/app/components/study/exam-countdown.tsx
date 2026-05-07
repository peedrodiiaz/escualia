"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

type Props = {
  timeLimitSecs: number;
  startedAt: string;
  onExpire: () => void;
};

export function ExamCountdown({ timeLimitSecs, startedAt, onExpire }: Props) {
  const [remaining, setRemaining] = useState<number>(() => {
    const elapsed = (Date.now() - new Date(startedAt).getTime()) / 1000;
    return Math.max(0, timeLimitSecs - Math.floor(elapsed));
  });

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isUrgent = remaining < 300; // últimos 5 minutos

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold tabular-nums"
      style={{
        background: isUrgent ? "var(--danger-bg)" : "var(--bg-muted)",
        color: isUrgent ? "var(--danger)" : "var(--text)",
        border: `1px solid ${isUrgent ? "var(--danger)" : "var(--border)"}`,
      }}
    >
      <Timer size={15} />
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
}
