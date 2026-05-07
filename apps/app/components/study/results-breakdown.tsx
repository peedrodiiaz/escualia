"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import type { AnswerOption, QuestionRow, TestAnswerRow } from "@/types/database";

type AnswerWithQuestion = TestAnswerRow & { questions: QuestionRow };

type Props = {
  answers: AnswerWithQuestion[];
};

const OPTION_LABELS: Record<string, string> = { a: "A", b: "B", c: "C" };

function getOptionText(q: QuestionRow, opt: string): string {
  if (opt === "a") return q.option_a;
  if (opt === "b") return q.option_b;
  return q.option_c;
}

export function ResultsBreakdown({ answers }: Props) {
  const [tab, setTab] = useState<"incorrect" | "correct">("incorrect");

  const correct = answers.filter((a) => a.is_correct === true);
  const incorrect = answers.filter((a) => a.is_correct === false || a.chosen_option === null);
  const displayed = tab === "correct" ? correct : incorrect;

  return (
    <div>
      {/* Tabs */}
      <div
        className="flex rounded-lg overflow-hidden mb-4"
        style={{ border: "1px solid var(--border)" }}
      >
        {(["incorrect", "correct"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 text-sm font-medium transition-colors"
            style={{
              background: tab === t ? "var(--accent)" : "var(--bg-muted)",
              color: tab === t ? "#fff" : "var(--text-muted)",
            }}
          >
            {t === "incorrect" ? (
              <>
                <XCircle size={14} className="inline mr-1.5" />
                Incorrectas ({incorrect.length})
              </>
            ) : (
              <>
                <CheckCircle size={14} className="inline mr-1.5" />
                Correctas ({correct.length})
              </>
            )}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-3">
        {displayed.length === 0 && (
          <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>
            {tab === "correct" ? "Ninguna correcta." : "¡Todo correcto!"}
          </p>
        )}
        {displayed.map((a) => {
          const q = a.questions;
          const chosenLabel = a.chosen_option ? OPTION_LABELS[a.chosen_option] : "Sin responder";
          const correctLabel = OPTION_LABELS[q.correct_option];
          return (
            <div
              key={a.id}
              className="rounded-xl p-4"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              {q.image_url && (
                <img
                  src={q.image_url}
                  alt=""
                  className="mb-2 rounded object-contain"
                  style={{ maxHeight: 120 }}
                />
              )}
              <p className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>
                {q.text}
              </p>
              <div className="flex flex-col gap-1.5">
                {(["a", "b", "c"] as AnswerOption[]).map((opt) => {
                  const isCorrect = opt === q.correct_option;
                  const isChosen = opt === a.chosen_option;
                  return (
                    <div
                      key={opt}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                      style={{
                        background: isCorrect
                          ? "var(--success-bg)"
                          : isChosen
                          ? "var(--danger-bg)"
                          : "var(--bg-muted)",
                        color: isCorrect
                          ? "var(--success)"
                          : isChosen
                          ? "var(--danger)"
                          : "var(--text-muted)",
                      }}
                    >
                      <span className="font-semibold w-5 shrink-0">{OPTION_LABELS[opt]}.</span>
                      <span>{getOptionText(q, opt)}</span>
                      {isCorrect && <CheckCircle size={14} className="ml-auto shrink-0" />}
                      {isChosen && !isCorrect && <XCircle size={14} className="ml-auto shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
