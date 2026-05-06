import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { TeamTable } from "@/components/team/team-table";

export default async function TeamPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  // Cargar miembros con sus emails desde auth.users via la vista de memberships
  // Hacemos un join manual: primero memberships, luego resolvemos emails
  const { data: memberships } = await supabase
    .from("memberships")
    .select("id, user_id, role, created_at")
    .eq("school_id", user.schoolId)
    .order("created_at", { ascending: true });

  // Cargar invitaciones (solo pendientes y recientes)
  const { data: invitations } = await supabase
    .from("invitations")
    .select("id, email, role, status, expires_at, created_at")
    .eq("school_id", user.schoolId)
    .neq("status", "revoked")
    .order("created_at", { ascending: false });

  // Resolver emails de los miembros usando la API de admin desde el servidor
  // Usamos un endpoint de Supabase que permite leer auth.users con service_role
  const { createClient: createAdminClient } = await import("@supabase/supabase-js");
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const userIds = (memberships ?? []).map((m) => m.user_id);
  const emailMap: Record<string, string> = {};

  if (userIds.length > 0) {
    const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 200 });
    for (const au of authUsers?.users ?? []) {
      if (userIds.includes(au.id)) {
        emailMap[au.id] = au.email ?? "";
      }
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
