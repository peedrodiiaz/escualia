"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuestionCard } from "./question-card";
import { TestProgressBar } from "./test-progress-bar";
import { ExamCountdown } from "./exam-countdown";
import { submitAnswer, finishTestSession, abandonSession } from "../../../app/dashboard/study/actions";
import type { AnswerOption, QuestionRow, TestAnswerRow, TestSessionRow } from "@/types/database";

type AnswerWithQuestion = TestAnswerRow & { questions: QuestionRow };

type Props = {
  session: TestSessionRow;
  answers: AnswerWithQuestion[];
};

export function TestRunner({ session, answers }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, AnswerOption | null>>({});
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const currentAnswer = answers[currentIndex];
  const question = currentAnswer?.questions;
  const questionId = currentAnswer?.question_id;
  const selectedOption = selections[questionId] ?? null;
  const isShowingAnswer = showAnswer[questionId] ?? false;

  const correctSoFar = Object.keys(selections).filter((qId) => {
    const ans = answers.find((a) => a.question_id === qId);
    return ans && selections[qId] !== null && selections[qId] === ans.questions.correct_option;
  }).length;
  const incorrectSoFar = Object.keys(selections).filter(
    (qId) => {
      const ans = answers.find((a) => a.question_id === qId);
      return ans && selections[qId] !== null && selections[qId] !== ans.questions.correct_option;
    }
  ).length;

  async function handleSelect(option: AnswerOption) {
    if (selections[questionId] !== undefined) return;

    setSelections((prev) => ({ ...prev, [questionId]: option }));

    startTransition(async () => {
      const result = await submitAnswer(session.id, questionId, option);
      if (!("error" in result)) {
        setShowAnswer((prev) => ({ ...prev, [questionId]: true }));
        // Avanzar automáticamente tras 1.5s en practice, en exam el usuario avanza
        if (session.mode === "practice") {
          setTimeout(() => {
            if (currentIndex < answers.length - 1) {
              setCurrentIndex((prev) => prev + 1);
            }
          }, 1500);
        }
      }
    });
  }

  async function handleFinish() {
    setIsFinishing(true);
    const result = await finishTestSession(session.id);
    if (!("error" in result)) {
      router.push(`/dashboard/study/results/${session.id}`);
    } else {
      setIsFinishing(false);
    }
  }

  async function handleExpire() {
    await finishTestSession(session.id);
    router.push(`/dashboard/study/results/${session.id}`);
  }

  const allAnswered = answers.every((a) => selections[a.question_id] !== undefined);
  const isLastQuestion = currentIndex === answers.length - 1;

  if (!question) return null;

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
          {session.mode === "exam" ? "Simulacro de examen" : "Test de práctica"}
        </h1>
        {session.mode === "exam" && session.time_limit_secs && (
          <ExamCountdown
            timeLimitSecs={session.time_limit_secs}
            startedAt={session.started_at}
            onExpire={handleExpire}
          />
        )}
      </div>

      {/* Progreso */}
      <div className="mb-6">
        <TestProgressBar
          current={currentIndex + 1}
          total={answers.length}
          correctSoFar={correctSoFar}
          incorrectSoFar={incorrectSoFar}
        />
      </div>

      {/* Pregunta */}
      <div
        className="rounded-xl p-6 mb-5"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <QuestionCard
          question={question}
          selectedOption={selectedOption}
          showAnswer={isShowingAnswer}
          onSelect={handleSelect}
        />
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-opacity hover:opacity-70 disabled:opacity-30"
          style={{ background: "var(--bg-muted)", color: "var(--text)", border: "1px solid var(--border)" }}
        >
          <ChevronLeft size={16} />
          Anterior
        </button>

        <div className="flex gap-2">
          {isLastQuestion || allAnswered ? (
            <button
              onClick={handleFinish}
              disabled={isFinishing || isPending}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {isFinishing ? "Finalizando..." : "Entregar test"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((i) => Math.min(answers.length - 1, i + 1))}
              disabled={session.mode === "exam" && !selectedOption}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-opacity hover:opacity-70 disabled:opacity-30"
              style={{ background: "var(--bg-muted)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
