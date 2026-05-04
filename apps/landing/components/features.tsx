"use client";

import { Users, CalendarDays, Receipt, BookOpen, BarChart3, Smartphone } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const features = [
  {
    icon: Users,
    title: "Gestión de alumnos",
    description: "Ficha completa: datos, documentación, horas realizadas, estado del expediente y notas del instructor.",
    accent: "#2563EB",
  },
  {
    icon: CalendarDays,
    title: "Agenda inteligente",
    description: "Calendario por instructor, reservas en tiempo real, recordatorios automáticos. Sin llamadas, sin líos.",
    accent: "#ea580c",
  },
  {
    icon: Receipt,
    title: "Facturación automática",
    description: "Genera facturas con un clic, controla pagos pendientes y exporta a contabilidad. Siempre al día con Hacienda.",
    accent: "#059669",
  },
  {
    icon: BookOpen,
    title: "App de estudio para alumnos",
    description: "Tests tipo DGT, simulacros con tiempo y estadísticas de progreso. Tu alumno estudia más, aprueba antes.",
    accent: "#7c3aed",
  },
  {
    icon: BarChart3,
    title: "Informes y estadísticas",
    description: "Tasa de aprobados, ingresos por mes, alumnos por fase. Toma decisiones con datos reales.",
    accent: "#db2777",
  },
  {
    icon: Smartphone,
    title: "App móvil para instructores",
    description: "El instructor ve su agenda, registra la clase y añade observaciones desde el móvil. Sin papel.",
    accent: "#d97706",
  },
];

export function Features() {
  const sectionRef = useReveal<HTMLElement>({ threshold: 0.07 });

  return (
    <section
      ref={sectionRef}
      id="funciones"
      style={{ background: "var(--bg)" }}
      className="py-24 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div
            className="reveal inline-block text-sm font-semibold px-4 py-2 rounded-full mb-4"
            style={{
              background: "color-mix(in srgb, var(--brand) 10%, transparent)",
              color: "var(--brand)",
              border: "1px solid color-mix(in srgb, var(--brand) 20%, transparent)",
            }}
          >
            Todo lo que necesitas
          </div>
          <h2
            className="reveal text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "var(--text)" }}
          >
            Una plataforma completa,
            <br />
            diseñada para autoescuelas
          </h2>
          <p
            className="reveal text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Sin aprendizajes complicados. Empiezas a usar Escualia en 5 minutos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="stagger-item card-hover rounded-2xl p-6"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-card)",
                  ["--i" as string]: i,
                }}
              >
                <div
                  style={{
                    background: `color-mix(in srgb, ${f.accent} 12%, transparent)`,
                    color: f.accent,
                  }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                >
                  <Icon size={22} />
                </div>
                <h3 style={{ color: "var(--text)" }} className="font-bold text-lg mb-2">{f.title}</h3>
                <p style={{ color: "var(--text-muted)" }} className="text-sm leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
