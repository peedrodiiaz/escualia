import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { getStudentTestStats } from "./actions";
import { StudyHub } from "@/components/study/study-hub";

export default async function StudyPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect("/dashboard");

  const stats = await getStudentTestStats();

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        Estudiar
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Tests tipo DGT, simulacros de examen y estadísticas de progreso.
      </p>
      <StudyHub stats={stats} recentSessions={stats?.recentSessions ?? []} />
    </div>
  );
}
