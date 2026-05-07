import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import { TestRunner } from "@/components/study/test-runner";
import type { SessionWithAnswers } from "@/types/database";

type Props = {
  params: Promise<{ sessionId: string }>;
};

export default async function TestSessionPage({ params }: Props) {
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

  // Si ya terminó, redirigir a resultados
  if (session.status !== "in_progress") {
    redirect(`/dashboard/study/results/${sessionId}`);
  }

  const typedSession = session as unknown as SessionWithAnswers;

  return (
    <div className="p-8">
      <TestRunner session={typedSession} answers={typedSession.test_answers} />
    </div>
  );
}
