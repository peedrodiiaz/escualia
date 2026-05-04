"use client";

import { useReveal } from "@/hooks/useReveal";

const problems = [
  {
    title: "Fichas en papel o Excel",
    description: "Perder horas buscando el expediente de un alumno entre carpetas o entre 20 pestañas abiertas.",
  },
  {
    title: "Agenda desorganizada",
    description: "Coordinar clases por WhatsApp y llamadas. Los dobles turnos y los olvidos son inevitables.",
  },
  {
    title: "Facturación manual",
    description: "Facturas en Word, pagos sin registrar, deudas que se olvidan. Nunca sabes exactamente cuánto debes cobrar.",
  },
  {
    title: "El alumno siempre llama",
    description: "Preguntas sobre fechas de examen, horas hechas, material. Todo pasa por ti, todo el tiempo.",
  },
];

export function Problem() {
  const sectionRef = useReveal<HTMLElement>({ threshold: 0.08 });

  return (
    <section
      ref={sectionRef}
      id="problema"
      className="py-32 px-4 sm:px-6"
      style={{ background: "var(--bg-subtle)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="reveal text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--brand)" }}>
            El problema real
          </p>
          <h2 className="reveal text-4xl sm:text-5xl font-bold leading-tight mb-6" style={{ color: "var(--text)" }}>
            Así gestionas hoy<br />tu autoescuela.
          </h2>
          <p className="reveal text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
            No es culpa tuya. Las herramientas que usas no estaban pensadas para autoescuelas.
          </p>
        </div>

        {/* Lista editorial */}
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {problems.map((p, i) => (
            <div
              key={p.title}
              className="stagger-item grid sm:grid-cols-[1fr_2fr] gap-4 sm:gap-12 py-8"
              style={{
                borderBottom: "1px solid var(--border)",
                ["--i" as string]: i,
              }}
            >
              <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
                {p.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 reveal">
          <a href="#lista-espera" style={{ color: "var(--brand)" }} className="font-semibold text-base hover:opacity-70 transition-opacity">
            Escualia lo resuelve todo →
          </a>
        </div>

      </div>
    </section>
  );
}
