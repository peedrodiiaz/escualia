import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-subtle)" }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-2xl font-black tracking-tight" style={{ color: "var(--brand)" }}>
            Escualia
          </span>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Accede a tu panel de gestión
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
