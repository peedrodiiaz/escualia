import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash") ?? searchParams.get("token");
  const type = (searchParams.get("type") ?? "magiclink") as EmailOtpType;
  const invitationToken = searchParams.get("invitation");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const supabase = await createClient();
  let sessionEstablished = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) sessionEstablished = true;
    else console.error("[callback] exchangeCodeForSession error:", error.message);
  }

  if (!sessionEstablished && token_hash) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) sessionEstablished = true;
    else console.error("[callback] verifyOtp error:", error.message);
  }

  if (!sessionEstablished) {
    // Redact sensitive query params before logging
    const safeParams = Object.fromEntries(
      [...searchParams.entries()].map(([k, v]) =>
        ["code", "token_hash", "token", "invitation"].includes(k)
          ? [k, "[REDACTED]"]
          : [k, v]
      )
    );
    console.error("[callback] no session — params:", safeParams);
    return NextResponse.redirect(`${origin}/login?error=link_invalido`);
  }

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
        new Date(invitation.expires_at) > new Date() &&
        invitation.email === user.email
      ) {
        // Evitar membership duplicada
        const { data: existing } = await admin
          .from("memberships")
          .select("id")
          .eq("school_id", invitation.school_id)
          .eq("user_id", user.id)
          .single();

        if (!existing) {
          await admin.from("memberships").insert({
            school_id: invitation.school_id,
            user_id: user.id,
            role: invitation.role,
          });
        }

        await admin
          .from("invitations")
          .update({ status: "accepted" })
          .eq("id", invitation.id);
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
