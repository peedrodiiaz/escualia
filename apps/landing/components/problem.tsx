"use client";

import { FileText, Calendar, AlertCircle, Phone } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const problems = [
  {
    icon: FileText,
    title: "Fichas en papel o Excel",
    description: "Perder horas buscando el expediente de un alumno entre carpetas o buscando en 20 pestañas de Excel.",
  },
  {
    icon: Calendar,
    title: "Agenda desorganizada",
    description: "Coordinar clases por WhatsApp, llamadas y notas sueltas. Los dobles turnos y olvidos son inevitables.",
  },
  {
    icon: AlertCircle,
    title: "Facturación manual",
    description: "Facturas en Word, pagos sin registrar, deudas que se olvidan. Imposible saber cuánto debes cobrar.",
  },
  {
    icon: Phone,
    title: "El alumno siempre llama",
    description: "Preguntas sobre fechas de examen, horas hechas, material de estudio. Todo pasa por ti.",
  },
];

export function Problem() {
  const sectionRef = useReveal<HTMLElement>({ threshold: 0.08 });

  return (
    <section
      ref={sectionRef}
      id="problema"
      style={{ background: "var(--bg)" }}
      className="py-24 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div
            className="reveal inline-block text-sm font-semibold px-4 py-2 rounded-full mb-4"
            style={{
              background: "color-mix(in srgb, #ef4444 10%, transparent)",
              color: "#dc2626",
              border: "1px solid color-mix(in srgb, #ef4444 20%, transparent)",
            }}
          >
            El problema real
          </div>
          <h2
            className="reveal text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "var(--text)" }}
          >
            Así gestionas hoy tu autoescuela
          </h2>
          <p
            className="reveal text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            No es culpa tuya. Es que las herramientas actuales no están pensadas para autoescuelas.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="stagger-item card-hover rounded-2xl p-6 group hover:border-red-300"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  ["--i" as string]: i,
                }}
              >
                <div
                  style={{ background: "color-mix(in srgb, #ef4444 10%, transparent)" }}
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                >
                  <Icon size={20} className="text-red-500" />
                </div>
                <h3 style={{ color: "var(--text)" }} className="font-bold mb-2">{p.title}</h3>
                <p style={{ color: "var(--text-muted)" }} className="text-sm leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center reveal">
          <p style={{ color: "var(--text-muted)" }} className="text-lg">
            ¿Te suena?{" "}
            <a href="#lista-espera" style={{ color: "var(--brand)" }} className="font-semibold hover:underline">
              Escualia lo resuelve todo →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
