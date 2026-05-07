"use client";

import { Users, CalendarDays, Receipt, BookOpen, BarChart3, Smartphone } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const features = [
  {
    icon: Users,
    title: "Gestión de alumnos",
    description: "Ficha completa: datos, documentación, horas realizadas, estado del expediente y notas del instructor.",
  },
  {
    icon: CalendarDays,
    title: "Agenda inteligente",
    description: "Calendario por instructor, reservas en tiempo real, recordatorios automáticos. Sin llamadas, sin líos.",
  },
  {
    icon: Receipt,
    title: "Facturación automática",
    description: "Genera facturas con un clic, controla pagos pendientes y exporta a contabilidad. Siempre al día con Hacienda.",
  },
  {
    icon: BookOpen,
    title: "App de estudio para alumnos",
    description: "Tests tipo DGT, simulacros con tiempo y estadísticas de progreso. Tu alumno estudia más, aprueba antes.",
  },
  {
    icon: BarChart3,
    title: "Informes y estadísticas",
    description: "Tasa de aprobados, ingresos por mes, alumnos por fase. Toma decisiones con datos reales.",
  },
  {
    icon: Smartphone,
    title: "App móvil para instructores",
    description: "El instructor ve su agenda, registra la clase y añade observaciones desde el móvil. Sin papel.",
  },
];

export function Features() {
  const sectionRef = useReveal<HTMLElement>({ threshold: 0.07 });

  return (
    <section
      ref={sectionRef}
      id="funciones"
      className="py-32 px-4 sm:px-6"
      style={{ background: "var(--bg-subtle)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-20">
          <p className="reveal text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--brand)" }}>
            Funciones
          </p>
          <h2
            className="reveal font-bold leading-tight mb-5"
            style={{ color: "var(--text)", fontSize: "clamp(32px, 4.5vw, 52px)", letterSpacing: "-0.025em" }}
          >
            Una plataforma completa,<br />diseñada para autoescuelas.
          </h2>
          <p className="reveal text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Sin aprendizajes complicados. Empiezas a usar Escualia en 5 minutos.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="stagger-item group rounded-2xl p-8 transition-shadow"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  ["--i" as string]: i,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 transition-colors"
                  style={{
                    background: "color-mix(in srgb, var(--brand) 10%, transparent)",
                    color: "var(--brand)",
                  }}
                >
                  <Icon size={19} />
                </div>
                <h3
                  className="font-semibold mb-3"
                  style={{ color: "var(--text)", fontSize: 15 }}
                >
                  {f.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: "var(--text-muted)", fontSize: 14 }}
                >
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
