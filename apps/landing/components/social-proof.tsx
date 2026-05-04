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

function StatsGrid() {
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
        const duration = 1400;
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
    <div ref={gridRef} className="grid sm:grid-cols-3 gap-px mb-20" style={{ background: "var(--border)" }}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="stagger-item py-12 px-8 text-center"
          style={{ background: "var(--bg)", ["--i" as string]: i }}
        >
          <span
            ref={(el) => { countRefs.current[i] = el; }}
            className="block text-5xl font-black mb-3"
            style={{ color: "var(--text)" }}
          >
            {stat.value}
          </span>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
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
    <section
      ref={sectionRef}
      className="py-32 px-4 sm:px-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="reveal text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--brand)" }}>
            Resultados reales
          </p>
          <h2 className="reveal text-4xl sm:text-5xl font-bold leading-tight" style={{ color: "var(--text)" }}>
            No promesas.<br />Números.
          </h2>
        </div>

        <StatsGrid />

        {/* Testimonials */}
        <div className="grid sm:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="stagger-item flex flex-col"
              style={{ ["--i" as string]: i }}
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <blockquote
                className="text-base leading-relaxed mb-8 flex-1"
                style={{ color: "var(--text)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3" style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
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
  );
}
