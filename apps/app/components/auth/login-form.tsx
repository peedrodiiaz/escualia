"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, CheckCircle } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get("invitation");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const callbackUrl = new URL(`${window.location.origin}/auth/callback`);
    if (invitationToken) callbackUrl.searchParams.set("invitation", invitationToken);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl.toString() },
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  };

  if (status === "sent") {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <CheckCircle size={40} className="mx-auto mb-4" style={{ color: "var(--success)" }} />
        <h2 className="font-semibold text-base mb-2" style={{ color: "var(--text)" }}>
          Revisa tu correo
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Hemos enviado un enlace de acceso a <strong>{email}</strong>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-8"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text)" }}
        >
          Correo electrónico
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-subtle)" }}
          />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@autoescuela.com"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg outline-none transition-colors"
            style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          />
        </div>
      </div>

      {status === "error" && (
        <p className="text-xs mb-4" style={{ color: "var(--danger)" }}>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
        style={{ background: "var(--brand)", color: "#fff" }}
      >
        {status === "loading" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : null}
        {status === "loading" ? "Enviando..." : "Acceder con magic link"}
      </button>

      <p className="mt-4 text-xs text-center" style={{ color: "var(--text-subtle)" }}>
        Sin contraseña. Te enviamos un enlace seguro al correo.
      </p>
    </form>
  );
}
