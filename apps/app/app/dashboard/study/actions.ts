"use server";

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import type { AnswerOption, StudentTestSummary, TestSessionRow } from "@/types/database";

const EXAM_QUESTION_COUNT = 30;
const EXAM_TIME_LIMIT_SECS = 1800; // 30 minutos
const EXAM_PASS_THRESHOLD = 90; // 90% = 27/30

// ─── startTestSession ─────────────────────────────────────────────────────────

type StartTestState = { sessionId: string } | { error: string } | null;

export async function startTestSession(
  _prev: StartTestState,
  formData: FormData
): Promise<StartTestState> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "student") return { error: "Solo los alumnos pueden iniciar tests." };

  const mode = formData.get("mode") as "practice" | "exam";
  if (!mode || !["practice", "exam"].includes(mode)) return { error: "Modo no válido." };

  const questionCount =
    mode === "exam"
      ? EXAM_QUESTION_COUNT
      : Math.min(40, Math.max(10, parseInt(formData.get("question_count") as string) || 20));

  const supabase = await createClient();

  // Buscar el student record del usuario en su escuela
  const { data: student } = await supabase
    .from("students")
    .select("id, school_id")
    .eq("user_id", user.id)
    .eq("school_id", user.schoolId)
    .single();

  if (!student) return { error: "No se encontró el registro de alumno." };

  // Seleccionar preguntas aleatorias via función SQL
  const { data: questionIds, error: rpcError } = await supabase.rpc("get_random_questions", {
    p_category: "B",
    p_count: questionCount,
  });

  if (rpcError || !questionIds || questionIds.length === 0) {
    return { error: "No hay preguntas disponibles. Contacta con tu autoescuela." };
  }

  // Crear la sesión
  const { data: session, error: sessionError } = await supabase
    .from("test_sessions")
    .insert({
      school_id: student.school_id,
      student_id: student.id,
      mode,
      total_questions: questionIds.length,
      time_limit_secs: mode === "exam" ? EXAM_TIME_LIMIT_SECS : null,
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    return { error: "Error al crear la sesión. Inténtalo de nuevo." };
  }

  // Insertar filas vacías de respuestas (una por pregunta)
  const answerRows = questionIds.map((qId: string) => ({
    session_id: session.id,
    school_id: student.school_id,
    student_id: student.id,
    question_id: qId,
  }));

  const { error: answersError } = await supabase.from("test_answers").insert(answerRows);

  if (answersError) {
    // Limpiar la sesión huérfana
    await supabase.from("test_sessions").delete().eq("id", session.id);
    return { error: "Error al preparar el test. Inténtalo de nuevo." };
  }

  return { sessionId: session.id };
}

// ─── submitAnswer ─────────────────────────────────────────────────────────────

type SubmitAnswerResult = { isCorrect: boolean; correctOption: AnswerOption } | { error: string };

export async function submitAnswer(
  sessionId: string,
  questionId: string,
  chosenOption: AnswerOption
): Promise<SubmitAnswerResult> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado." };

  const supabase = await createClient();

  // Verificar propiedad de la sesión y que está en curso
  const { data: session } = await supabase
    .from("test_sessions")
    .select("id, status, mode, started_at, time_limit_secs, student_id")
    .eq("id", sessionId)
    .eq("school_id", user.schoolId)
    .single();

  if (!session) return { error: "Sesión no encontrada." };
  if (session.status !== "in_progress") return { error: "La sesión ya ha finalizado." };

  // Verificar que la sesión pertenece al alumno actual (previene IDOR)
  if (user.role === "student") {
    const { data: studentRecord } = await supabase
      .from("students")
      .select("id")
      .eq("user_id", user.id)
      .eq("school_id", user.schoolId)
      .single();
    if (!studentRecord || session.student_id !== studentRecord.id) {
      return { error: "No autorizado." };
    }
  }

  // Para examen: verificar que no ha expirado el tiempo
  if (session.mode === "exam" && session.time_limit_secs) {
    const elapsed = (Date.now() - new Date(session.started_at).getTime()) / 1000;
    if (elapsed > session.time_limit_secs) {
      return { error: "El tiempo del examen ha expirado." };
    }
  }

  // Obtener la respuesta correcta
  const { data: question } = await supabase
    .from("questions")
    .select("correct_option")
    .eq("id", questionId)
    .single();

  if (!question) return { error: "Pregunta no encontrada." };

  const isCorrect = chosenOption === question.correct_option;

  // Upsert de la respuesta
  const { error: upsertError } = await supabase
    .from("test_answers")
    .update({
      chosen_option: chosenOption,
      is_correct: isCorrect,
      answered_at: new Date().toISOString(),
    })
    .eq("session_id", sessionId)
    .eq("question_id", questionId);

  if (upsertError) return { error: "Error al guardar la respuesta." };

  return { isCorrect, correctOption: question.correct_option as AnswerOption };
}

// ─── finishTestSession ────────────────────────────────────────────────────────

type FinishResult = { score_pct: number; passed: boolean | null } | { error: string };

export async function finishTestSession(sessionId: string): Promise<FinishResult> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado." };

  const supabase = await createClient();

  const { data: session } = await supabase
    .from("test_sessions")
    .select("id, status, mode, total_questions, student_id")
    .eq("id", sessionId)
    .eq("school_id", user.schoolId)
    .single();

  if (!session) return { error: "Sesión no encontrada." };
  if (session.status !== "in_progress") return { error: "La sesión ya ha finalizado." };

  // Verificar que la sesión pertenece al alumno actual (previene IDOR)
  if (user.role === "student") {
    const { data: studentRecord } = await supabase
      .from("students")
      .select("id")
      .eq("user_id", user.id)
      .eq("school_id", user.schoolId)
      .single();
    if (!studentRecord || session.student_id !== studentRecord.id) {
      return { error: "No autorizado." };
    }
  }

  // Agregar contadores desde test_answers
  const { data: answers } = await supabase
    .from("test_answers")
    .select("is_correct, chosen_option")
    .eq("session_id", sessionId);

  const correctCount = answers?.filter((a) => a.is_correct === true).length ?? 0;
  const incorrectCount = answers?.filter((a) => a.is_correct === false).length ?? 0;
  const unansweredCount = answers?.filter((a) => a.chosen_option === null).length ?? 0;

  const totalAnswerable = correctCount + incorrectCount + unansweredCount;
  const scorePct =
    totalAnswerable > 0 ? parseFloat(((correctCount / totalAnswerable) * 100).toFixed(2)) : 0;

  const passed =
    session.mode === "exam" ? scorePct >= EXAM_PASS_THRESHOLD : null;

  const { error: updateError } = await supabase
    .from("test_sessions")
    .update({
      status: "completed",
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      unanswered_count: unansweredCount,
      score_pct: scorePct,
      passed,
      finished_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (updateError) return { error: "Error al cerrar la sesión." };

  return { score_pct: scorePct, passed };
}

// ─── abandonSession ───────────────────────────────────────────────────────────

export async function abandonSession(sessionId: string): Promise<void | { error: string }> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado." };

  const supabase = await createClient();

  const { data: session } = await supabase
    .from("test_sessions")
    .select("id, status, total_questions, student_id")
    .eq("id", sessionId)
    .eq("school_id", user.schoolId)
    .single();

  if (!session || session.status !== "in_progress") return;

  // Verificar que la sesión pertenece al alumno actual (previene IDOR)
  if (user.role === "student") {
    const { data: studentRecord } = await supabase
      .from("students")
      .select("id")
      .eq("user_id", user.id)
      .eq("school_id", user.schoolId)
      .single();
    if (!studentRecord || session.student_id !== studentRecord.id) return;
  }

  const { data: answers } = await supabase
    .from("test_answers")
    .select("is_correct, chosen_option")
    .eq("session_id", sessionId);

  const correctCount = answers?.filter((a) => a.is_correct === true).length ?? 0;
  const incorrectCount = answers?.filter((a) => a.is_correct === false).length ?? 0;
  const unansweredCount = answers?.filter((a) => a.chosen_option === null).length ?? 0;
  const totalAnswerable = correctCount + incorrectCount + unansweredCount;
  const scorePct =
    totalAnswerable > 0 ? parseFloat(((correctCount / totalAnswerable) * 100).toFixed(2)) : 0;

  await supabase
    .from("test_sessions")
    .update({
      status: "abandoned",
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      unanswered_count: unansweredCount,
      score_pct: scorePct,
      finished_at: new Date().toISOString(),
    })
    .eq("id", sessionId);
}

// ─── getStudentTestStats ──────────────────────────────────────────────────────

export async function getStudentTestStats(studentId?: string): Promise<StudentTestSummary | null> {
  const user = await getSessionUser();
  if (!user) return null;

  const supabase = await createClient();

  let resolvedStudentId = studentId;

  if (!resolvedStudentId) {
    // Alumno viendo sus propias stats
    if (user.role !== "student") return null;
    const { data: student } = await supabase
      .from("students")
      .select("id")
      .eq("user_id", user.id)
      .eq("school_id", user.schoolId)
      .single();
    if (!student) return null;
    resolvedStudentId = student.id;
  } else {
    // Admin/instructor viendo stats de un alumno
    if (user.role === "student") return null;
  }

  const { data: sessions } = await supabase
    .from("test_sessions")
    .select("*")
    .eq("student_id", resolvedStudentId)
    .eq("school_id", user.schoolId)
    .order("started_at", { ascending: false });

  const allSessions: TestSessionRow[] = sessions ?? [];
  const completedSessions = allSessions.filter((s) => s.status === "completed");
  const examSessions = completedSessions.filter((s) => s.mode === "exam");
  const passedExams = examSessions.filter((s) => s.passed === true).length;
  const avgScorePct =
    completedSessions.length > 0
      ? parseFloat(
          (
            completedSessions.reduce((sum, s) => sum + (s.score_pct ?? 0), 0) /
            completedSessions.length
          ).toFixed(2)
        )
      : 0;

  // Preguntas más falladas
  const { data: failedAnswers } = await supabase
    .from("test_answers")
    .select("question_id")
    .eq("student_id", resolvedStudentId)
    .eq("school_id", user.schoolId)
    .eq("is_correct", false);

  const failCounts: Record<string, number> = {};
  for (const a of failedAnswers ?? []) {
    failCounts[a.question_id] = (failCounts[a.question_id] ?? 0) + 1;
  }

  const topFailedIds = Object.entries(failCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);

  let mostFailedQuestions: StudentTestSummary["mostFailedQuestions"] = [];
  if (topFailedIds.length > 0) {
    const { data: questions } = await supabase
      .from("questions")
      .select("*")
      .in("id", topFailedIds);

    mostFailedQuestions = (questions ?? []).map((q) => ({
      question: q,
      failCount: failCounts[q.id] ?? 0,
    }));
  }

  return {
    totalSessions: allSessions.length,
    totalExams: examSessions.length,
    passedExams,
    avgScorePct,
    recentSessions: allSessions.slice(0, 10),
    mostFailedQuestions,
  };
}
