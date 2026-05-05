import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export type SessionUser = {
  id: string;
  email: string;
  schoolId: string;
  role: UserRole;
  schoolName: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("memberships")
    .select("role, school_id, schools(name)")
    .eq("user_id", user.id)
    .single();

  if (!membership) return null;

  const school = membership.schools as { name: string } | null;

  return {
    id: user.id,
    email: user.email ?? "",
    schoolId: membership.school_id,
    role: membership.role,
    schoolName: school?.name ?? "",
  };
}
