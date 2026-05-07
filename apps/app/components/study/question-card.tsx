"use client";

import Image from "next/image";
import type { AnswerOption, QuestionRow } from "@/types/database";

type Props = {
  question: QuestionRow;
  selectedOption: AnswerOption | null;
  showAnswer: boolean;
  onSelect: (option: AnswerOption) => void;
};

const OPTIONS: AnswerOption[] = ["a", "b", "c"];

const OPTION_LABELS: Record<AnswerOption, string> = { a: "A", b: "B", c: "C" };

function getOptionStyle(
  option: AnswerOption,
  selected: AnswerOption | null,
  correct: AnswerOption,
  showAnswer: boolean
): React.CSSProperties {
  if (!showAnswer) {
    const isSelected = option === selected;
    return {
      background: isSelected ? "var(--accent)" : "var(--bg-muted)",
      color: isSelected ? "#fff" : "var(--text)",
      border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
      cursor: selected ? "default" : "pointer",
      opacity: selected && !isSelected ? 0.6 : 1,
    };
  }
  // Mostrar resultado
  if (option === correct) {
    return {
      background: "var(--success-bg)",
      color: "var(--success)",
      border: "1px solid var(--success)",
      cursor: "default",
    };
  }
  if (option === selected && option !== correct) {
    return {
      background: "var(--danger-bg)",
      color: "var(--danger)",
      border: "1px solid var(--danger)",
      cursor: "default",
    };
  }
  return {
    background: "var(--bg-muted)",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
    cursor: "default",
    opacity: 0.5,
  };
}

const OPTION_TEXT: Record<AnswerOption, string> = {
  a: "option_a",
  b: "option_b",
  c: "option_c",
} as unknown as Record<AnswerOption, string>;

export function QuestionCard({ question, selectedOption, showAnswer, onSelect }: Props) {
  const optionValues: Record<AnswerOption, string> = {
    a: question.option_a,
    b: question.option_b,
    c: question.option_c,
  };

  return (
    <div className="w-full">
      {question.image_url && (
        <div className="mb-4 rounded-lg overflow-hidden" style={{ maxHeight: 200 }}>
          <img
            src={question.image_url}
            alt="Imagen de la pregunta"
            className="w-full object-contain"
            style={{ maxHeight: 200 }}
          />
        </div>
      )}

      <p className="text-base font-medium mb-4" style={{ color: "var(--text)" }}>
        {question.text}
      </p>

      <div className="flex flex-col gap-2.5">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => !selectedOption && onSelect(opt)}
            disabled={!!selectedOption}
            className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
            style={getOptionStyle(opt, selectedOption, question.correct_option as AnswerOption, showAnswer)}
          >
            <span className="font-semibold mr-2">{OPTION_LABELS[opt]}.</span>
            {optionValues[opt]}
          </button>
        ))}
      </div>
    </div>
  );
}
