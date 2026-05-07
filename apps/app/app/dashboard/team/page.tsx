import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { TeamTable } from "@/components/team/team-table";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { createClient: createAdminClient } = await import("@supabase/supabase-js");
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Usamos admin para saltar RLS — la policy solo permite ver la propia membership
  const { data: memberships } = await admin
    .from("memberships")
    .select("id, user_id, role, created_at")
    .eq("school_id", user.schoolId)
    .order("created_at", { ascending: true });

  const { data: invitations } = await admin
    .from("invitations")
    .select("id, email, role, status, expires_at, created_at")
    .eq("school_id", user.schoolId)
    .neq("status", "revoked")
    .order("created_at", { ascending: false });

  const userIds = (memberships ?? []).map((m) => m.user_id);
  const emailMap: Record<string, string> = {};

  if (userIds.length > 0) {
    const results = await Promise.all(userIds.map((id) => admin.auth.admin.getUserById(id)));
    for (const { data } of results) {
      if (data?.user) emailMap[data.user.id] = data.user.email ?? "";
    }
  }

  const members = (memberships ?? []).map((m) => ({
    id: m.id,
    user_id: m.user_id,
    role: m.role as "admin" | "instructor" | "student",
    email: emailMap[m.user_id] ?? "—",
    created_at: m.created_at,
  }));

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <TeamTable
        members={members}
        invitations={invitations ?? []}
        currentUserId={user.id}
        isAdmin={user.role === "admin"}
      />
    </div>
  );
}
