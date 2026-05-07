"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const sectionRef = useReveal<HTMLElement>({ threshold: 0.1 });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al registrarte");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error al registrarte. Inténtalo de nuevo.");
    }
  }

  return (
    <section
      ref={sectionRef}
      id="lista-espera"
      className="py-32 px-4 sm:px-6"
      style={{ background: "var(--brand-deeper)" }}
    >
      <div className="max-w-xl mx-auto text-center">

        <p className="reveal text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
          Acceso anticipado · Quedan pocas plazas
        </p>

        <h2
          className="reveal font-bold leading-tight text-white mb-6"
          style={{ fontSize: "clamp(32px, 4.5vw, 52px)", letterSpacing: "-0.025em" }}
        >
          Sé de las primeras<br />autoescuelas en usarlo.
        </h2>

        <p className="reveal text-lg mb-12" style={{ color: "rgba(255,255,255,0.65)" }}>
          3 meses de acceso gratuito completo + soporte personalizado para las primeras 50 autoescuelas. Sin tarjeta, sin compromiso.
        </p>

        <div className="reveal">
          {status === "success" ? (
            <div className="text-center py-8">
              <CheckCircle size={40} className="mx-auto mb-4" style={{ color: "rgba(255,255,255,0.8)" }} />
              <h3 className="text-white text-xl font-bold mb-2">Estás en la lista.</h3>
              <p style={{ color: "rgba(255,255,255,0.6)" }}>
                Te avisaremos cuando Escualia esté listo. Revisa tu email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="text-left">
                  <label htmlFor="name" className="block text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Nombre de la autoescuela
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Autoescuela García"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  />
                </div>
                <div className="text-left">
                  <label htmlFor="email" className="block text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Email de contacto
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hola@autoescuela.es"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  />
                </div>
              </div>

              {status === "error" && (
                <p className="text-red-300 text-sm text-left">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full disabled:opacity-60 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-sm transition-opacity hover:opacity-85"
                style={{ background: "white", color: "var(--brand-deeper)" }}
              >
                {status === "loading" ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Solicitar mi plaza ahora
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                Sin tarjeta de crédito · 3 meses gratis · Cancela cuando quieras
              </p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
