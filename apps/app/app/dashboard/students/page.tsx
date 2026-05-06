import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import { StudentTable } from "@/components/students/student-table";

export default async function StudentsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role === "student") redirect("/dashboard");

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("*")
    .eq("school_id", user.schoolId)
    .order("created_at", { ascending: false });

  return (
    <StudentTable
      students={students ?? []}
      canCreate={user.role === "admin"}
    />
  );
}
