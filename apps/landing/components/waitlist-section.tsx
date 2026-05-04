"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
    <section id="lista-espera" className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#1D4ED8] to-[#1e3a8a]">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-block bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
          Acceso anticipado
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Sé de las primeras autoescuelas en usar Escualia
        </h2>
        <p className="text-blue-100 text-lg mb-10">
          Acceso gratuito extendido y soporte personalizado para las primeras 50 autoescuelas. Sin tarjeta de crédito.
        </p>

        {status === "success" ? (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 text-center">
            <CheckCircle size={48} className="text-emerald-300 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">¡Estás en la lista!</h3>
            <p className="text-blue-100">
              Te avisaremos cuando Escualia esté listo. Revisa tu email (y el spam, por si acaso).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 sm:p-8">
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
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
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
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>
            </div>

            {status === "error" && (
              <p className="text-red-300 text-sm mb-4">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-[#F97316] hover:bg-[#ea580c] disabled:opacity-70 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
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
    </section>
  );
}
