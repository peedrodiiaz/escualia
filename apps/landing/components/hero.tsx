"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";

export function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  // Parallax sutil en el fondo al hacer scroll
  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const onScroll = () => {
      const y = window.scrollY;
      el.style.transform = `translateY(${y * 0.18}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fade-up en los elementos del hero al cargar
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".hero-reveal");
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      items.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    items.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      setTimeout(() => {
        el.style.transition =
          "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 100 + i * 100);
    });
  }, []);

  return (
    <section
      className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, var(--bg-subtle) 0%, var(--bg) 100%)" }}
    >
      {/* Fondo con parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
        aria-hidden="true"
      >
        {/* Círculo de fondo brand */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, var(--brand) 0%, transparent 70%)" }}
        />
        {/* Punto de acento */}
        <div
          className="absolute top-40 right-[10%] w-72 h-72 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
        />
        {/* Grid sutil */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div
          className="hero-reveal inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-6"
          style={{
            background: "color-mix(in srgb, var(--brand) 10%, transparent)",
            color: "var(--brand)",
            border: "1px solid color-mix(in srgb, var(--brand) 20%, transparent)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M7 0.5L8.545 5.045H13.34L9.397 7.91L10.942 12.455L7 9.59L3.058 12.455L4.603 7.91L0.66 5.045H5.455L7 0.5Z" />
          </svg>
          Software diseñado para autoescuelas españolas
        </div>

        <h1
          className="hero-reveal text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
          style={{ color: "var(--text)" }}
        >
          Recupera{" "}
          <span style={{ color: "var(--brand)" }}>8 horas a la semana</span>
          <br />
          y cobra todo lo que trabajas
        </h1>

        <p
          className="hero-reveal text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          El software que gestiona tu autoescuela de principio a fin: alumnos, agenda, facturación y exámenes.
          Sin papeles, sin Excel, sin caos.
        </p>

        <div className="hero-reveal flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="#lista-espera"
            style={{ background: "var(--brand)", color: "white", boxShadow: "var(--shadow-lg)" }}
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:opacity-90 hover:scale-105 hover:shadow-xl"
          >
            Solicitar acceso anticipado
            <ArrowRight size={20} />
          </a>
          <a
            href="#funciones"
            style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:opacity-80 hover:border-[var(--brand)]"
          >
            Ver funciones
          </a>
        </div>

        <div
          className="hero-reveal inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-10"
          style={{
            background: "color-mix(in srgb, #10b981 10%, transparent)",
            border: "1px solid color-mix(in srgb, #10b981 25%, transparent)",
            color: "#059669",
          }}
        >
          <TrendingUp size={14} />
          <span className="font-bold">47 autoescuelas</span>&nbsp;ya en lista de espera
        </div>

        <div
          className="hero-reveal flex flex-col sm:flex-row items-center justify-center gap-6 text-sm mb-16"
          style={{ color: "var(--text-subtle)" }}
        >
          {["Sin tarjeta de crédito", "Configuración en 5 minutos", "Soporte en español"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              {item}
            </div>
          ))}
        </div>

        {/* Dashboard mock */}
        <div className="hero-reveal relative">
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 25px 60px -12px rgb(0 0 0 / 0.25)",
            }}
            className="rounded-2xl overflow-hidden max-w-4xl mx-auto transition-all hover:shadow-[0_32px_80px_-12px_rgb(37_99_235_/_0.2)]"
          >
            {/* Browser chrome */}
            <div
              style={{ background: "var(--bg-muted)", borderBottom: "1px solid var(--border)" }}
              className="px-4 py-3 flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span style={{ color: "var(--text-subtle)" }} className="ml-2 text-xs font-mono">
                app.escualia.es — Dashboard
              </span>
            </div>

            {/* Dashboard content */}
            <div style={{ background: "var(--bg-subtle)" }} className="p-6">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Alumnos activos", value: "48", color: "var(--brand)", bg: "color-mix(in srgb, var(--brand) 8%, var(--bg-card))", border: "color-mix(in srgb, var(--brand) 20%, transparent)" },
                  { label: "Clases esta semana", value: "32", color: "#ea580c", bg: "color-mix(in srgb, #ea580c 8%, var(--bg-card))", border: "color-mix(in srgb, #ea580c 20%, transparent)" },
                  { label: "Exámenes pendientes", value: "12", color: "#059669", bg: "color-mix(in srgb, #059669 8%, var(--bg-card))", border: "color-mix(in srgb, #059669 20%, transparent)" },
                  { label: "Facturas emitidas", value: "€4.200", color: "#7c3aed", bg: "color-mix(in srgb, #7c3aed 8%, var(--bg-card))", border: "color-mix(in srgb, #7c3aed 20%, transparent)" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{ background: stat.bg, border: `1px solid ${stat.border}`, color: stat.color }}
                    className="rounded-xl p-4"
                  >
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs font-medium mt-1 opacity-80">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Agenda preview */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} className="rounded-xl p-4">
                <div style={{ color: "var(--text-subtle)" }} className="text-xs font-semibold mb-3 uppercase tracking-wide">
                  Próximas clases hoy
                </div>
                <div className="space-y-2">
                  {[
                    { time: "09:00", alumno: "María López", instructor: "Carlos R.", tipo: "Práctica", confirmada: true },
                    { time: "10:30", alumno: "Javier Martín", instructor: "Ana G.", tipo: "Teoría", confirmada: false },
                    { time: "12:00", alumno: "Sara Pérez", instructor: "Carlos R.", tipo: "Examen", confirmada: true },
                  ].map((clase) => (
                    <div
                      key={clase.time}
                      style={{ borderBottom: "1px solid var(--border-subtle)" }}
                      className="flex items-center justify-between text-xs py-2 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ color: "var(--text)" }} className="font-mono font-bold w-10">{clase.time}</span>
                        <span style={{ color: "var(--text)" }} className="font-medium">{clase.alumno}</span>
                        <span style={{ color: "var(--text-subtle)" }}>· {clase.instructor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: "var(--text-muted)" }}>{clase.tipo}</span>
                        <span
                          style={
                            clase.confirmada
                              ? { background: "color-mix(in srgb, #10b981 12%, transparent)", color: "#059669" }
                              : { background: "color-mix(in srgb, #f59e0b 12%, transparent)", color: "#d97706" }
                          }
                          className="px-2 py-0.5 rounded-full font-semibold"
                        >
                          {clase.confirmada ? "Confirmada" : "Pendiente"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating: notification */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
              animation: "floatUp 3s ease-in-out infinite",
            }}
            className="hidden sm:flex absolute -right-4 top-16 items-center gap-3 px-4 py-3 rounded-xl text-sm"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">ML</div>
            <div>
              <div style={{ color: "var(--text)" }} className="font-semibold text-xs">María López</div>
              <div style={{ color: "var(--text-muted)" }} className="text-xs">Ha reservado clase para mañana</div>
            </div>
          </div>

          {/* Floating: invoice */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
              animation: "floatUp 3.5s ease-in-out infinite 0.5s",
            }}
            className="hidden sm:flex absolute -left-4 bottom-16 items-center gap-3 px-4 py-3 rounded-xl text-sm"
          >
            <div
              style={{ background: "color-mix(in srgb, #059669 12%, transparent)" }}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8L6.5 11.5L13 5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div style={{ color: "var(--text)" }} className="font-semibold text-xs">Factura generada</div>
              <div style={{ color: "#059669" }} className="text-xs font-bold">€320,00 cobrado</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="floatUp"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
