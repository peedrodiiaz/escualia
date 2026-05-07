import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt=""
              width={30}
              height={30}
              aria-hidden="true"
              style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
            />
            <span
              style={{
                color: "white",
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Escualia
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Accede a tu panel de gestión
          </p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
