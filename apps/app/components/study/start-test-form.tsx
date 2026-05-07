"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap } from "lucide-react";
import { startTestSession } from "@/app/dashboard/study/actions";

type State = { sessionId: string } | { error: string } | null;

const initialState: State = null;

type Props = {
  onModeSelect?: (mode: "practice" | "exam") => void;
};

export function StartTestForm(_props: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [questionCount, setQuestionCount] = useState(20);

  const [state, formAction, isPending] = useActionState(
    async (prev: State, formData: FormData) => {
      const result = await startTestSession(prev, formData);
      if (result && "sessionId" in result) {
        router.push(`/dashboard/study/${result.sessionId}`);
      }
      return result;
    },
    initialState
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Selector de modo */}
      <div className="grid grid-cols-2 gap-3">
        {(["practice", "exam"] as const).map((m) => {
          const isSelected = mode === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="flex flex-col items-center gap-2 p-5 rounded-xl transition-all"
              style={{
                background: isSelected ? "var(--accent)" : "var(--bg-muted)",
                color: isSelected ? "#fff" : "var(--text)",
                border: `2px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {m === "practice" ? <BookOpen size={24} /> : <GraduationCap size={24} />}
              <span className="font-semibold text-sm">
                {m === "practice" ? "Test de práctica" : "Simulacro de examen"}
              </span>
              <span
                className="text-xs text-center"
                style={{ color: isSelected ? "rgba(255,255,255,0.8)" : "var(--text-muted)" }}
              >
                {m === "practice"
                  ? "Elige el número de preguntas"
                  : "30 preguntas · 30 min · aprobado ≥ 90%"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Opciones de práctica */}
      {mode === "practice" && (
        <div
          className="rounded-xl p-4"
          style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}
        >
          <label className="flex items-center justify-between text-sm" style={{ color: "var(--text)" }}>
            <span>Número de preguntas</span>
            <span className="font-semibold">{questionCount}</span>
          </label>
          <input
            type="range"
            min={10}
            max={40}
            step={5}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full mt-2 accent-[var(--accent)]"
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            <span>10</span>
            <span>40</span>
          </div>
        </div>
      )}

      {/* Error */}
      {state && "error" in state && (
        <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "var(--danger-bg)", color: "var(--danger)" }}>
          {state.error}
        </p>
      )}

      {/* Submit */}
      <form action={formAction}>
        <input type="hidden" name="mode" value={mode} />
        <input type="hidden" name="question_count" value={questionCount} />
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {isPending
            ? "Preparando test..."
            : mode === "practice"
            ? `Empezar test (${questionCount} preguntas)`
            : "Empezar simulacro"}
        </button>
      </form>
    </div>
  );
}
