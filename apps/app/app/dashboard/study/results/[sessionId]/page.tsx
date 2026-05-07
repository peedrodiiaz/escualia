import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import { TestResults } from "@/components/study/test-results";
import type { SessionWithAnswers } from "@/types/database";

type Props = {
  params: Promise<{ sessionId: string }>;
};

export default async function TestResultsPage({ params }: Props) {
  const { sessionId } = await params;

  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect("/dashboard");

  const supabase = await createClient();

  const { data: session } = await supabase
    .from("test_sessions")
    .select(`
      *,
      test_answers (
        *,
        questions (*)
      )
    `)
    .eq("id", sessionId)
    .single();

  if (!session) notFound();

  // Si está en curso, redirigir al test
  if (session.status === "in_progress") {
    redirect(`/dashboard/study/${sessionId}`);
  }

  const typedSession = session as unknown as SessionWithAnswers;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        Resultados
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        {typedSession.mode === "exam" ? "Simulacro de examen" : "Test de práctica"}
      </p>
      <TestResults session={typedSession} />
    </div>
  );
}
