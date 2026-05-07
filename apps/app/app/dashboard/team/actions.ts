"use server";

import { revalidatePath } from "next/cache";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { BrevoClient } from "@getbrevo/brevo";
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

  // Verificar si ya existe una invitación pendiente para este email
  const { data: existingInvite } = await admin
    .from("invitations")
    .select("id")
    .eq("school_id", user.schoolId)
    .eq("email", email)
    .eq("status", "pending")
    .single();

  if (existingInvite) return { error: "Ya existe una invitación pendiente para este email" };

  // Crear invitación y enviar email — el callback gestiona usuarios nuevos y existentes
  const { data: invitation, error: inviteError } = await admin
    .from("invitations")
    .insert({
      school_id: user.schoolId,
      email,
      role: "instructor",
      invited_by: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select("token")
    .single();

  if (inviteError) {
    return { error: "Error al crear la invitación. Inténtalo de nuevo." };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002";
  const loginUrl = `${appUrl}/login?invitation=${invitation.token}`;

  // Enviar email con Brevo
  const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! });

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      sender: { name: "Escualia", email: process.env.BREVO_SENDER_EMAIL ?? "hola@escualia.es" },
      to: [{ email }],
      subject: "Te han invitado a unirte a Escualia",
      htmlContent: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2 style="color:#2563EB;margin-bottom:8px;">Bienvenido a Escualia</h2>
          <p style="color:#374151;margin-bottom:24px;">
            Has sido invitado como instructor. Haz clic en el botón para acceder a tu panel.
          </p>
          <a href="${loginUrl}"
             style="display:inline-block;background:#2563EB;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
            Aceptar invitación
          </a>
          <p style="color:#9CA3AF;font-size:12px;margin-top:24px;">
            Este enlace caduca en 7 días. Si no esperabas esta invitación, ignora este email.
          </p>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error("[inviteInstructor] brevo error:", JSON.stringify(emailErr));
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
