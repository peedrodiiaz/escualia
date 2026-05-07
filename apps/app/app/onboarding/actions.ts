"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export type CreateSchoolState = { error: string } | null;

export async function createSchool(
  _prev: CreateSchoolState,
  formData: FormData
): Promise<CreateSchoolState> {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "El nombre es obligatorio" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existingMembership } = await supabase
    .from("memberships")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existingMembership) redirect("/dashboard");

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: school, error: schoolError } = await admin
    .from("schools")
    .insert({ name, slug: `${slug}-${Date.now()}`, owner_id: user.id })
    .select("id")
    .single();

  if (schoolError || !school) {
    console.error("[createSchool] schools insert error:", schoolError);
    return { error: "No se pudo crear la autoescuela. Inténtalo de nuevo." };
  }

  const { error: membershipError } = await admin.from("memberships").insert({
    school_id: school.id,
    user_id: user.id,
    role: "admin",
  });

  if (membershipError) {
    console.error("[createSchool] memberships insert error:", membershipError);
    return { error: "Error al configurar tu cuenta. Contacta con soporte." };
  }

  redirect("/dashboard");
}
