import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Si no hay sesión en absoluto → login
  if (!user) redirect("/login");

  // Si ya tiene membership → dashboard
  const { data: membership } = await supabase
    .from("memberships")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (membership) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-subtle)" }}>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-2xl font-black tracking-tight" style={{ color: "var(--brand)" }}>
            Escualia
          </span>
          <h1 className="mt-3 text-xl font-bold" style={{ color: "var(--text)" }}>
            Configura tu autoescuela
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Es tu primera vez. Crea tu espacio de trabajo en 30 segundos.
          </p>
        </div>
        <OnboardingForm userId={user.id} />
      </div>
    </main>
  );
}
