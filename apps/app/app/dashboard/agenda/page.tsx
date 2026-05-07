import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import { ClassList } from "@/components/agenda/class-list";

export default async function AgendaPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const now = new Date().toISOString();

  let classesQuery = supabase
    .from("classes")
    .select("*")
    .eq("school_id", user.schoolId)
    .gte("start_time", now)
    .order("start_time", { ascending: true });

  if (user.role === "instructor") {
    classesQuery = classesQuery.eq("instructor_id", user.id);
  }

  const { data: classes } = await classesQuery;

  const { data: students } = await supabase
    .from("students")
    .select("id, first_name, last_name, school_id, user_id, email, phone, dni, status, notes, created_at")
    .eq("school_id", user.schoolId)
    .eq("status", "active")
    .order("first_name", { ascending: true });

  return (
    <ClassList
      classes={classes ?? []}
      students={students ?? []}
      canCreate={user.role !== "student"}
      canManage={user.role !== "student"}
    />
  );
}
