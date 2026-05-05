import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/get-user-role";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    // Usuario autenticado pero sin membership → onboarding
    redirect("/onboarding");
  }

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
