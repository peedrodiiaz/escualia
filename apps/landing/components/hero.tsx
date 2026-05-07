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

function AppMockup() {
  return (
    <div className="relative w-full" aria-hidden="true">
      {/* Glow behind the mockup */}
      <div
        className="absolute left-1/2 top-1/4 w-3/4 h-1/2 pointer-events-none"
        style={{
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse, color-mix(in srgb, var(--brand) 20%, transparent) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Browser frame */}
      <div
        className="relative mx-auto rounded-2xl overflow-hidden"
        style={{
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 24px 80px -16px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.03)",
          maxWidth: 880,
        }}
      >
        {/* Browser chrome */}
        <div
          className="flex items-center gap-2 px-4 h-10 shrink-0"
          style={{ background: "#f5f5f7", borderBottom: "1px solid rgba(0,0,0,0.07)" }}
        >
          <div className="flex gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <div
            className="flex-1 mx-4 h-5 rounded flex items-center justify-center"
            style={{
              background: "white",
              border: "1px solid rgba(0,0,0,0.07)",
              maxWidth: 220,
              color: "#aaa",
              fontSize: 11,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            app.escualia.es/dashboard
          </div>
        </div>

        {/* App UI */}
        <div className="flex" style={{ background: "#080c18", height: 420 }}>

          {/* Sidebar — hidden on small screens */}
          <div
            className="hidden sm:flex flex-col shrink-0 py-4"
            style={{ width: 172, borderRight: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="px-4 mb-5">
              <div className="flex items-center gap-2 mb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt=""
                  width={15}
                  height={14}
                  aria-hidden="true"
                  style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
                />
                <span style={{ color: "white", fontWeight: 800, fontSize: 12, letterSpacing: "-0.02em" }}>
                  Escualia
                </span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>Autoescuela García</p>
            </div>

            <div className="px-2 space-y-0.5">
              {[
                { label: "Dashboard", active: true },
                { label: "Alumnos" },
                { label: "Agenda" },
                { label: "Facturación" },
                { label: "Informes" },
                { label: "Ajustes" },
              ].map(({ label, active }) => (
                <div
                  key={label}
                  className="px-3 py-2 rounded-lg"
                  style={{
                    background: active ? "rgba(255,255,255,0.08)" : "transparent",
                    color: active ? "white" : "rgba(255,255,255,0.38)",
                    fontSize: 12,
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-5 overflow-hidden">
            {/* Page header */}
            <div className="mb-5">
              <p style={{ color: "white", fontWeight: 600, fontSize: 13 }}>Buenos días, Carlos</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>
                Lunes, 7 de mayo · 3 clases hoy
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { v: "47", l: "Alumnos activos" },
                { v: "€2.840", l: "Facturado este mes" },
                { v: "23", l: "Clases esta semana" },
              ].map(({ v, l }) => (
                <div
                  key={l}
                  className="rounded-xl p-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div style={{ color: "white", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{v}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Today's classes */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.09em",
                  marginBottom: 12,
                }}
              >
                CLASES DE HOY
              </div>
              {[
                { time: "09:00", student: "María López", type: "Práctica B" },
                { time: "11:30", student: "Carlos Ruiz", type: "Práctica C1" },
                { time: "16:00", student: "Ana García", type: "Práctica B" },
              ].map(({ time, student, type }, idx) => (
                <div
                  key={time}
                  className="flex items-center gap-3 py-2"
                  style={{
                    borderBottom: idx < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 11,
                      width: 36,
                      flexShrink: 0,
                    }}
                  >
                    {time}
                  </span>
                  <span style={{ color: "white", fontSize: 12, flex: 1 }}>{student}</span>
                  <span
                    style={{
                      background: "rgba(37,99,235,0.2)",
                      color: "#93c5fd",
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 999,
                      flexShrink: 0,
                    }}
                  >
                    {type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gradient fade at bottom so mockup blends into background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--bg) 20%, transparent)" }}
      />
    </div>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const items = heroRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!items) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    items.forEach((el, i) => {
      if (prefersReduced) {
        el.style.opacity = "1";
        el.style.transform = "none";
        return;
      }
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      setTimeout(() => {
        el.style.transition =
          "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 60 + i * 130);
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden pt-36 pb-0 px-4 sm:px-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-4xl mx-auto text-center">

        {/* Eyebrow */}
        <div
          data-reveal
          className="inline-flex items-center gap-3 mb-8"
        >
          <span
            className="inline-block h-px w-6"
            style={{ background: "var(--brand)", opacity: 0.6 }}
          />
          <p
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "var(--brand)" }}
          >
            El software que tu autoescuela necesita
          </p>
          <span
            className="inline-block h-px w-6"
            style={{ background: "var(--brand)", opacity: 0.6 }}
          />
        </div>

        {/* Headline */}
        <h1
          data-reveal
          className="font-black leading-[1.02] tracking-tight mb-8"
          style={{
            fontSize: "clamp(42px, 7vw, 80px)",
            letterSpacing: "-0.035em",
            color: "var(--text)",
          }}
        >
          Recupera 8 horas y<br />
          <span className="gradient-text">
            cobra lo que te deben.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          data-reveal
          className="max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{
            fontSize: "clamp(17px, 2.2vw, 22px)",
            color: "var(--text-muted)",
            letterSpacing: "-0.01em",
          }}
        >
          Software de gestión para autoescuelas españolas. Alumnos, agenda,
          facturación y tests DGT desde un solo lugar.
        </p>

        {/* CTAs */}
        <div data-reveal className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#lista-espera"
            style={{ background: "var(--brand)", color: "white" }}
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl text-base transition-opacity hover:opacity-85"
          >
            Solicitar acceso anticipado
            <ArrowRight size={17} />
          </a>
          <a
            href="#como-funciona"
            style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl text-base transition-opacity hover:opacity-70"
          >
            Ver cómo funciona
          </a>
        </div>

        {/* Trust line */}
        <div data-reveal className="mb-16">
          <p
            className="text-xs font-medium tracking-widest uppercase mb-5"
            style={{ color: "var(--text-subtle)" }}
          >
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

      {/* Product mockup — full bleed */}
      <div data-reveal className="max-w-5xl mx-auto px-0 sm:px-6">
        <AppMockup />
      </div>
    </section>
  );
}
