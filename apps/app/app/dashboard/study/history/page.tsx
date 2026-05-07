import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import { SessionHistory } from "@/components/study/session-history";

export default async function StudyHistoryPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect("/dashboard");

  const supabase = await createClient();

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .eq("school_id", user.schoolId)
    .single();

  const sessions = student
    ? (
        await supabase
          .from("test_sessions")
          .select("*")
          .eq("student_id", student.id)
          .eq("school_id", user.schoolId)
          .order("started_at", { ascending: false })
      ).data ?? []
    : [];

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href="/dashboard/study"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={15} />
        Volver a estudiar
      </Link>

      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        Historial de tests
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Todos tus tests y simulacros realizados.
      </p>

      <SessionHistory sessions={sessions} />
    </div>
  );
}
