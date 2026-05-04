"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

const logos = [
  "Autoescuela García",
  "Academia Díaz",
  "Autoescuela Torres",
  "AutoDrive Madrid",
  "Autoescuela Rodríguez",
  "Centro Vial Sur",
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const items = heroRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!items) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    items.forEach((el, i) => {
      if (prefersReduced) { el.style.opacity = "1"; return; }
      el.style.opacity = "0";
      setTimeout(() => {
        el.style.transition = "opacity 0.8s ease";
        el.style.opacity = "1";
      }, 80 + i * 120);
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative pt-40 pb-32 px-4 sm:px-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-4xl mx-auto text-center">

        {/* Eyebrow */}
        <p
          data-reveal
          className="text-sm font-semibold tracking-widest uppercase mb-8"
          style={{ color: "var(--brand)" }}
        >
          Software para autoescuelas españolas
        </p>

        {/* Headline */}
        <h1
          data-reveal
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-8"
          style={{ color: "var(--text)" }}
        >
          Recupera 8 horas<br />
          <span style={{ color: "var(--brand)" }}>cada semana.</span>
        </h1>

        {/* Subheadline */}
        <p
          data-reveal
          className="text-xl sm:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          Gestiona alumnos, agenda, facturación y exámenes
          desde un solo lugar. Sin Excel, sin papel, sin caos.
        </p>

        {/* CTAs */}
        <div data-reveal className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <a
            href="#lista-espera"
            style={{ background: "var(--brand)", color: "white" }}
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl text-base transition-opacity hover:opacity-85"
          >
            Solicitar acceso anticipado
            <ArrowRight size={18} />
          </a>
          <a
            href="#como-funciona"
            style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl text-base transition-opacity hover:opacity-70"
          >
            Ver cómo funciona
          </a>
        </div>

        {/* Social proof logos */}
        <div data-reveal>
          <p className="text-xs font-medium tracking-widest uppercase mb-6" style={{ color: "var(--text-subtle)" }}>
            Ya en lista de espera
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {logos.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold"
                style={{ color: "var(--text-subtle)" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
