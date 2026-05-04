"use client";

import { Check } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const plans = [
  {
    name: "Autónomo",
    price: "29",
    description: "Para autoescuelas independientes con hasta 2 instructores.",
    features: [
      "Hasta 100 alumnos activos",
      "2 instructores",
      "Gestión de alumnos y agenda",
      "Facturación básica",
      "App de estudio para alumnos",
      "Soporte por email",
    ],
    cta: "Empezar gratis 30 días",
    highlighted: false,
  },
  {
    name: "Escuela",
    price: "79",
    description: "La opción más popular para autoescuelas en crecimiento.",
    features: [
      "Alumnos ilimitados",
      "Instructores ilimitados",
      "Todo el plan Autónomo",
      "Informes y estadísticas",
      "App móvil para instructores",
      "Recordatorios automáticos",
      "Soporte prioritario",
    ],
    cta: "Empezar gratis 30 días",
    highlighted: true,
    badge: "Más popular",
  },
  {
    name: "Franquicia",
    price: "Consultar",
    description: "Para grupos con varias academias y necesidades avanzadas.",
    features: [
      "Todo el plan Escuela",
      "Multi-sede centralizada",
      "API e integraciones",
      "Panel de administración",
      "Gestor de cuenta dedicado",
      "SLA garantizado",
    ],
    cta: "Hablar con ventas",
    highlighted: false,
  },
];

export function Pricing() {
  const sectionRef = useReveal<HTMLElement>({ threshold: 0.07 });

  return (
    <section
      ref={sectionRef}
      id="precios"
      style={{ background: "var(--bg-subtle)" }}
      className="py-24 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div
            className="reveal inline-block text-sm font-semibold px-4 py-2 rounded-full mb-4"
            style={{
              background: "color-mix(in srgb, #059669 10%, transparent)",
              color: "#059669",
              border: "1px solid color-mix(in srgb, #059669 20%, transparent)",
            }}
          >
            Precios
          </div>
          <h2
            className="reveal text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "var(--text)" }}
          >
            Sin sorpresas. Sin comisiones.
          </h2>
          <p
            className="reveal text-lg max-w-xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            30 días gratuitos sin tarjeta de crédito. Cancela cuando quieras.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`stagger-item relative rounded-2xl border p-7 ${
                plan.highlighted
                  ? "scale-105 shadow-[0_20px_60px_-12px_rgb(37_99_235_/_0.35)] hover:shadow-[0_28px_80px_-12px_rgb(37_99_235_/_0.45)] transition-shadow duration-300"
                  : "card-hover"
              }`}
              style={
                plan.highlighted
                  ? {
                      background: "var(--brand)",
                      borderColor: "var(--brand)",
                      boxShadow: "var(--shadow-lg)",
                      ["--i" as string]: i,
                    }
                  : {
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      ["--i" as string]: i,
                    }
              }
            >
              {plan.badge && (
                <div
                  style={{ background: "var(--accent)", color: "white" }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg"
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div
                  style={{ color: plan.highlighted ? "rgba(255,255,255,0.6)" : "var(--text-muted)" }}
                  className="text-sm font-semibold mb-1"
                >
                  {plan.name}
                </div>
                <div className="flex items-end gap-1 mb-2">
                  {plan.price !== "Consultar" && (
                    <span
                      style={{ color: plan.highlighted ? "rgba(255,255,255,0.6)" : "var(--text-muted)" }}
                      className="text-sm font-medium"
                    >
                      €
                    </span>
                  )}
                  <span
                    style={{ color: plan.highlighted ? "white" : "var(--text)" }}
                    className="text-4xl font-bold"
                  >
                    {plan.price}
                  </span>
                  {plan.price !== "Consultar" && (
                    <span
                      style={{ color: plan.highlighted ? "rgba(255,255,255,0.6)" : "var(--text-muted)" }}
                      className="text-sm mb-1"
                    >
                      /mes
                    </span>
                  )}
                </div>
                <p
                  style={{ color: plan.highlighted ? "rgba(255,255,255,0.75)" : "var(--text-muted)" }}
                  className="text-sm leading-relaxed"
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check
                      size={16}
                      style={{ color: plan.highlighted ? "rgba(255,255,255,0.7)" : "var(--brand)" }}
                      className="shrink-0"
                    />
                    <span style={{ color: plan.highlighted ? "rgba(255,255,255,0.9)" : "var(--text-muted)" }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#lista-espera"
                style={
                  plan.highlighted
                    ? { background: "white", color: "var(--brand)" }
                    : { background: "var(--brand)", color: "white" }
                }
                className="block text-center font-semibold py-3 px-6 rounded-xl transition-all hover:opacity-90 hover:scale-[1.02]"
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
