import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash") ?? searchParams.get("token");
  const type = searchParams.get("type") as EmailOtpType | null;
  const invitationToken = searchParams.get("invitation");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const supabase = await createClient();

  let sessionEstablished = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) sessionEstablished = true;
  }

  if (!sessionEstablished && token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) sessionEstablished = true;
  }

  if (!sessionEstablished) {
    return NextResponse.redirect(`${origin}/auth/error`);
  }

  // Procesar invitación si viene en la URL
  if (invitationToken) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const admin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );

      const { data: invitation } = await admin
        .from("invitations")
        .select("id, school_id, role, status, expires_at, email")
        .eq("token", invitationToken)
        .single();

      if (
        invitation &&
        invitation.status === "pending" &&
        new Date(invitation.expires_at) > new Date()
      ) {
        // Verificar que el email coincide con el usuario autenticado
        if (invitation.email === user.email) {
          // Crear membership
          await admin.from("memberships").insert({
            school_id: invitation.school_id,
            user_id: user.id,
            role: invitation.role,
          });

          // Marcar invitación como aceptada
          await admin
            .from("invitations")
            .update({ status: "accepted" })
            .eq("id", invitation.id);
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
