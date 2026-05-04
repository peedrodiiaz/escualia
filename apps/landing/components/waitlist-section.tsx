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
      style={{
        background: "linear-gradient(135deg, var(--brand-deeper) 0%, var(--brand-dark) 50%, #1e40af 100%)",
      }}
      className="py-24 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
        style={{ background: "white" }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-5"
        style={{ background: "white" }}
      />
      {/* Grid sutil */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div
          className="reveal inline-block text-white text-sm font-semibold px-4 py-2 rounded-full mb-6"
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          Acceso anticipado · Solo 50 plazas
        </div>
        <h2 className="reveal text-3xl sm:text-4xl font-bold text-white mb-4">
          Sé de las primeras autoescuelas en usar Escualia
        </h2>
        <p className="reveal text-blue-100 text-lg mb-10">
          Acceso gratuito extendido y soporte personalizado para las primeras 50 autoescuelas.
          Sin tarjeta de crédito.
        </p>

        <div className="reveal">
          {status === "success" ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <CheckCircle size={48} className="text-emerald-300 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">¡Estás en la lista!</h3>
              <p className="text-blue-100">
                Te avisaremos cuando Escualia esté listo. Revisa tu email (y el spam, por si acaso).
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-6 sm:p-8"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="text-left">
                  <label htmlFor="name" className="block text-blue-100 text-sm font-medium mb-2">
                    Nombre de la autoescuela
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Autoescuela García"
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition-shadow"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "white",
                    }}
                  />
                </div>
                <div className="text-left">
                  <label htmlFor="email" className="block text-blue-100 text-sm font-medium mb-2">
                    Email de contacto
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hola@autoescuela.es"
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition-shadow"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "white",
                    }}
                  />
                </div>
              </div>

              {status === "error" && (
                <p className="text-red-300 text-sm mb-4">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                style={{ background: "var(--accent)" }}
                className="w-full disabled:opacity-70 text-white font-bold py-4 px-6 rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] flex items-center justify-center gap-2 text-base"
              >
                {status === "loading" ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Quiero acceso anticipado
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <p className="text-blue-200 text-xs mt-4 text-center">
                Sin tarjeta de crédito · Sin compromiso · Cancela cuando quieras
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
