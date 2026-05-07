"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const stats = [
  { value: "47+", numericTarget: 47, prefix: "", suffix: "+", label: "Autoescuelas en lista de espera" },
  { value: "8h", numericTarget: 8, prefix: "", suffix: "h", label: "Ahorradas de media por semana" },
  { value: "€800", numericTarget: 800, prefix: "€", suffix: "", label: "Recuperados en deudas el primer mes" },
];

const testimonials = [
  {
    name: "Ana Rodríguez",
    role: "Directora · Autoescuela Rodríguez, Sevilla",
    avatar: "AR",
    quote:
      "Llevaba 12 años con Excel y carpetas. El primer día con Escualia encontré en 10 segundos el expediente de un alumno que llevaba meses buscando.",
    stars: 5,
  },
  {
    name: "Miguel Torres",
    role: "Instructor y propietario · Autoescuela Torres, Valencia",
    avatar: "MT",
    quote:
      "Mis alumnos ahora reservan solos. Antes recibía 20 WhatsApps al día para coordinar clases. Ahora ninguno. El tiempo que ahorro lo invierto en dar mejores clases.",
    stars: 5,
  },
  {
    name: "Carmen Díaz",
    role: "Gerente · Academia Díaz, Barcelona",
    avatar: "CD",
    quote:
      "La facturación automática me salvó. Tenía deudas de alumnos que no sabía ni que existían. El primer mes recuperé más de 800€ pendientes de cobro.",
    stars: 5,
  },
];

function StatsStrip() {
  const gridRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const countRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const startCounters = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      stats.forEach((stat, i) => {
        const el = countRefs.current[i];
        if (!el) return;
        if (prefersReduced) { el.textContent = stat.value; return; }
        const duration = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = `${stat.prefix}${Math.round(eased * stat.numericTarget)}${stat.suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) { startCounters(); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={gridRef}
      className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x"
      style={{ divideColor: "rgba(255,255,255,0.08)" }}
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="stagger-item flex flex-col items-center justify-center py-14 px-8 text-center"
          style={{ ["--i" as string]: i }}
        >
          <span
            ref={(el) => { countRefs.current[i] = el; }}
            className="block font-black mb-3"
            style={{
              fontSize: "clamp(52px, 6vw, 72px)",
              letterSpacing: "-0.04em",
              color: "white",
              lineHeight: 1,
            }}
          >
            {stat.value}
          </span>
          <span
            style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, fontWeight: 500 }}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SocialProof() {
  const sectionRef = useReveal<HTMLElement>({ threshold: 0.08 });

  return (
    <>
      {/* Stats — full-bleed dark strip */}
      <div
        className="w-full"
        style={{ background: "#080c18" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <StatsStrip />
        </div>
      </div>

      {/* Testimonials */}
      <section
        ref={sectionRef}
        className="py-32 px-4 sm:px-6"
        style={{ background: "var(--bg)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-16">
            <p className="reveal text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--brand)" }}>
              Resultados reales
            </p>
            <h2
              className="reveal font-bold leading-tight"
              style={{ color: "var(--text)", fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.025em" }}
            >
              No promesas.<br />Números.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="stagger-item flex flex-col rounded-2xl p-8"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  ["--i" as string]: i,
                }}
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <blockquote
                  className="text-base leading-relaxed mb-8 flex-1"
                  style={{ color: "var(--text)", fontStyle: "normal" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div
                  className="flex items-center gap-3 pt-5"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                    style={{
                      background: "color-mix(in srgb, var(--brand) 12%, transparent)",
                      color: "var(--brand)",
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t.name}</div>
                    <div className="text-xs" style={{ color: "var(--text-subtle)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
