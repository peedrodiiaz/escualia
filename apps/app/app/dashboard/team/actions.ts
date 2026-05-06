"use server";

import { revalidatePath } from "next/cache";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSessionUser } from "@/lib/auth/get-user-role";

export type InvitationActionState = { error: string } | null;

function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function inviteInstructor(
  _prev: InvitationActionState,
  formData: FormData
): Promise<InvitationActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role !== "admin") return { error: "No autorizado" };

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "El email es obligatorio" };

  const admin = adminClient();

  // Comprobar que no sea ya miembro
  const { data: existing } = await admin
    .from("memberships")
    .select("id")
    .eq("school_id", user.schoolId)
    .eq("user_id", (
      await admin.from("memberships")
        .select("user_id")
        .eq("school_id", user.schoolId)
        .limit(1)
    ).data?.[0]?.user_id ?? "");

  // Buscar si el email ya tiene una cuenta en auth.users y ya es miembro
  const { data: authUsers } = await admin.auth.admin.listUsers();
  const existingUser = authUsers?.users.find(u => u.email === email);
  if (existingUser) {
    const { data: membership } = await admin
      .from("memberships")
      .select("id")
      .eq("school_id", user.schoolId)
      .eq("user_id", existingUser.id)
      .single();
    if (membership) return { error: "Este usuario ya es miembro de tu autoescuela" };
  }

  // Crear invitación
  const { data: invitation, error: inviteError } = await admin
    .from("invitations")
    .insert({
      school_id: user.schoolId,
      email,
      role: "instructor",
      invited_by: user.id,
    })
    .select("token")
    .single();

  if (inviteError) {
    if (inviteError.code === "23505") {
      return { error: "Ya existe una invitación pendiente para este email" };
    }
    return { error: "Error al crear la invitación. Inténtalo de nuevo." };
  }

  // Enviar magic link con el token en redirectTo
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const redirectTo = `${appUrl}/auth/callback?invitation=${invitation.token}`;

  const { error: otpError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (otpError) {
    // Revertir la invitación si falla el envío
    await admin.from("invitations").delete().eq("token", invitation.token);
    return { error: "Error al enviar el email de invitación. Inténtalo de nuevo." };
  }

  revalidatePath("/dashboard/team");
  return null;
}

export async function revokeInvitation(id: string): Promise<InvitationActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role !== "admin") return { error: "No autorizado" };

  const admin = adminClient();

  const { data: inv } = await admin
    .from("invitations")
    .select("id, school_id")
    .eq("id", id)
    .eq("school_id", user.schoolId)
    .single();

  if (!inv) return { error: "Invitación no encontrada" };

  const { error } = await admin
    .from("invitations")
    .update({ status: "revoked" })
    .eq("id", id);

  if (error) return { error: "Error al revocar la invitación." };

  revalidatePath("/dashboard/team");
  return null;
}

export async function removeMember(memberId: string): Promise<InvitationActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role !== "admin") return { error: "No autorizado" };

  const admin = adminClient();

  // No permitir que el admin se elimine a sí mismo
  const { data: membership } = await admin
    .from("memberships")
    .select("id, user_id, school_id")
    .eq("id", memberId)
    .eq("school_id", user.schoolId)
    .single();

  if (!membership) return { error: "Miembro no encontrado" };
  if (membership.user_id === user.id) return { error: "No puedes eliminarte a ti mismo" };

  const { error } = await admin.from("memberships").delete().eq("id", memberId);
  if (error) return { error: "Error al eliminar el miembro." };

  revalidatePath("/dashboard/team");
  return null;
}
