"use client";

import { useEffect, useRef } from "react";
import { Star, Users, TrendingUp, Clock } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const testimonials = [
  {
    name: "Ana Rodríguez",
    role: "Directora · Autoescuela Rodríguez, Sevilla",
    avatar: "AR",
    accent: "#2563EB",
    quote:
      "Llevaba 12 años con Excel y carpetas. El primer día con Escualia encontré en 10 segundos el expediente de un alumno que llevaba meses buscando. No vuelvo atrás.",
    stars: 5,
  },
  {
    name: "Miguel Torres",
    role: "Instructor y propietario · Autoescuela Torres, Valencia",
    avatar: "MT",
    accent: "#ea580c",
    quote:
      "Mis alumnos ahora reservan solos. Antes recibía 20 WhatsApps al día para coordinar clases. Ahora ninguno. El tiempo que ahorro lo invierto en dar mejores clases.",
    stars: 5,
  },
  {
    name: "Carmen Díaz",
    role: "Gerente · Academia Díaz, Barcelona",
    avatar: "CD",
    accent: "#059669",
    quote:
      "La facturación automática me salvó. Tenía deudas de alumnos que no sabía ni que existían. El primer mes recuperé más de 800€ que tenía pendientes de cobro.",
    stars: 5,
  },
];

const stats = [
  { icon: Users, value: "47+", numericTarget: 47, prefix: "", suffix: "+", label: "Autoescuelas en lista de espera", accent: "#2563EB" },
  { icon: Clock, value: "8h", numericTarget: 8, prefix: "", suffix: "h", label: "Ahorradas de media por semana", accent: "#ea580c" },
  { icon: TrendingUp, value: "€800", numericTarget: 800, prefix: "€", suffix: "", label: "Recuperados en deudas el primer mes", accent: "#059669" },
];

/** Anima un número desde 0 hasta target en ~1.2s */
function useCountUp(target: number, prefix = "", suffix = "", enabled: boolean) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = elRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.textContent = `${prefix}${target}${suffix}`;
      return;
    }

    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = `${prefix}${current}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [enabled, target, prefix, suffix]);

  return elRef;
}

function StatCard({
  stat,
  index,
  countersActive,
}: {
  stat: (typeof stats)[number];
  index: number;
  countersActive: boolean;
}) {
  const Icon = stat.icon;
  const countRef = useCountUp(stat.numericTarget, stat.prefix, stat.suffix, countersActive);

  return (
    <div
      className="stagger-item card-hover rounded-2xl p-6 text-center"
      style={{
        background: `color-mix(in srgb, ${stat.accent} 8%, var(--bg-card))`,
        border: `1px solid color-mix(in srgb, ${stat.accent} 20%, transparent)`,
        ["--i" as string]: index,
      }}
    >
      <div
        style={{ background: "var(--bg-card)", color: stat.accent }}
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 shadow-sm"
      >
        <Icon size={22} />
      </div>
      <div ref={countRef} style={{ color: stat.accent }} className="text-4xl font-black mb-1">
        {stat.value}
      </div>
      <div style={{ color: "var(--text-muted)" }} className="text-sm font-medium">
        {stat.label}
      </div>
    </div>
  );
}

export function SocialProof() {
  const sectionRef = useReveal<HTMLElement>({ threshold: 0.08 });
  // Activa los contadores cuando la sección entra en viewport
  const countersActiveRef = useRef(false);
  const statsGridRef = useRef<HTMLDivElement>(null);
  const countersActiveState = useRef(false);

  // Usamos un IntersectionObserver dedicado para los contadores
  useEffect(() => {
    const grid = statsGridRef.current;
    if (!grid) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !countersActiveState.current) {
          countersActiveState.current = true;
          // Disparar evento para re-render con counters activos
          grid.dispatchEvent(new CustomEvent("counters-start"));
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ background: "var(--bg-subtle)" }}
      className="py-24 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div
            className="reveal inline-block text-sm font-semibold px-4 py-2 rounded-full mb-4"
            style={{
              background: "color-mix(in srgb, #f59e0b 12%, transparent)",
              color: "#b45309",
              border: "1px solid color-mix(in srgb, #f59e0b 25%, transparent)",
            }}
          >
            Lo dicen los primeros usuarios
          </div>
          <h2
            className="reveal text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "var(--text)" }}
          >
            Resultados reales, no promesas
          </h2>
          <p
            className="reveal text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Estos son los propietarios de autoescuelas que probaron Escualia antes que nadie.
          </p>
        </div>

        {/* Stats con counter animation */}
        <StatsGrid />

        {/* Testimonials */}
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="stagger-item card-hover rounded-2xl p-6 flex flex-col"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
                ["--i" as string]: i,
              }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <blockquote
                style={{ color: "var(--text-muted)" }}
                className="text-sm leading-relaxed mb-6 flex-1"
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div
                style={{ borderTop: "1px solid var(--border)" }}
                className="flex items-center gap-3 pt-4"
              >
                <div
                  style={{
                    background: `color-mix(in srgb, ${t.accent} 15%, transparent)`,
                    color: t.accent,
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                >
                  {t.avatar}
                </div>
                <div>
                  <div style={{ color: "var(--text)" }} className="font-semibold text-sm">{t.name}</div>
                  <div style={{ color: "var(--text-subtle)" }} className="text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Sub-componente separado para manejar el estado de los contadores */
function StatsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  // Referencia a los elementos del DOM para los números
  const countRefs = useRef<(HTMLDivElement | null)[]>([]);

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

        if (prefersReduced) {
          el.textContent = stat.value;
          return;
        }

        const duration = 1200;
        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * stat.numericTarget);
          el.textContent = `${stat.prefix}${current}${stat.suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={gridRef} className="grid sm:grid-cols-3 gap-6 mb-14">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="stagger-item card-hover rounded-2xl p-6 text-center"
            style={{
              background: `color-mix(in srgb, ${stat.accent} 8%, var(--bg-card))`,
              border: `1px solid color-mix(in srgb, ${stat.accent} 20%, transparent)`,
              ["--i" as string]: i,
            }}
          >
            <div
              style={{ background: "var(--bg-card)", color: stat.accent }}
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 shadow-sm"
            >
              <Icon size={22} />
            </div>
            <div
              ref={(el) => { countRefs.current[i] = el; }}
              style={{ color: stat.accent }}
              className="text-4xl font-black mb-1"
            >
              {stat.value}
            </div>
            <div style={{ color: "var(--text-muted)" }} className="text-sm font-medium">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
