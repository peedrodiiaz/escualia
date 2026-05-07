"use client";

import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
};

export function StatsCard({ label, value, icon: Icon, color = "var(--accent)" }: Props) {
  return (
    <div
      className="rounded-xl p-5 flex items-center gap-4"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "var(--bg-muted)" }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p className="text-xl font-bold" style={{ color: "var(--text)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
