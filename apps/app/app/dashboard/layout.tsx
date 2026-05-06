import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const user = await getSessionUser();
  if (!user) redirect("/onboarding");

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main
        className="flex-1 overflow-auto"
        style={{ background: "var(--bg-subtle)" }}
      >
        {children}
      </main>
    </div>
  );
}
