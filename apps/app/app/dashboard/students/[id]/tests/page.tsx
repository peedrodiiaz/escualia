import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import { getStudentTestStats } from "@/app/dashboard/study/actions";
import { StudentTestStats } from "@/components/study/student-test-stats";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StudentTestsPage({ params }: Props) {
  const { id } = await params;

  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role === "student") redirect("/dashboard");

  const supabase = await createClient();

  const { data: student } = await supabase
    .from("students")
    .select("id, first_name, last_name")
    .eq("id", id)
    .eq("school_id", user.schoolId)
    .single();

  if (!student) notFound();

  const stats = await getStudentTestStats(student.id);

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href={`/dashboard/students/${id}`}
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={15} />
        Volver al alumno
      </Link>

      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        Tests de {student.first_name} {student.last_name}
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Estadísticas de rendimiento en tests DGT.
      </p>

      {stats ? (
        <StudentTestStats
          summary={stats}
          studentName={`${student.first_name} ${student.last_name}`}
        />
      ) : (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No se pudieron cargar las estadísticas.
          </p>
        </div>
      )}
    </div>
  );
}
