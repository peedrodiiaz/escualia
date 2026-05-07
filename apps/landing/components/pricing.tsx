"use client";

import { Check } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { pricingPlans as plans } from "@/lib/pricing-data";

export function Pricing() {
  const sectionRef = useReveal<HTMLElement>({ threshold: 0.07 });

  return (
    <section
      ref={sectionRef}
      id="precios"
      className="py-32 px-4 sm:px-6"
      style={{ background: "var(--bg-subtle)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="reveal text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--brand)" }}>
            Precios
          </p>
          <h2
            className="reveal font-bold leading-tight mb-5"
            style={{ color: "var(--text)", fontSize: "clamp(32px, 4.5vw, 52px)", letterSpacing: "-0.025em" }}
          >
            Precios claros para<br />tu autoescuela.
          </h2>
          <p className="reveal text-lg" style={{ color: "var(--text-muted)" }}>
            30 días gratuitos sin tarjeta de crédito. Cancela cuando quieras, sin penalizaciones.
          </p>
        </div>

        {/* Plans */}
        <div className="grid sm:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => {
            const isHighlighted = plan.highlighted;
            return (
              <div
                key={plan.name}
                className="stagger-item relative rounded-2xl p-8"
                style={{
                  background: isHighlighted ? "var(--brand)" : "var(--bg-card)",
                  border: isHighlighted
                    ? "none"
                    : "1px solid var(--border)",
                  boxShadow: isHighlighted
                    ? "0 0 0 1px var(--brand-dark), 0 20px 48px -12px color-mix(in srgb, var(--brand) 35%, transparent)"
                    : "none",
                  transform: isHighlighted ? "scale(1.025)" : "none",
                  ["--i" as string]: i,
                }}
              >
                {plan.badge && (
                  <div
                    className="absolute -top-3.5 left-6 text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      background: isHighlighted
                        ? "rgba(255,255,255,0.18)"
                        : "color-mix(in srgb, var(--brand) 12%, transparent)",
                      color: isHighlighted ? "white" : "var(--brand)",
                      border: isHighlighted ? "none" : "1px solid color-mix(in srgb, var(--brand) 25%, transparent)",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="mb-8">
                  <h3
                    className="text-sm font-semibold mb-4"
                    style={{
                      color: isHighlighted ? "rgba(255,255,255,0.65)" : "var(--text-subtle)",
                    }}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-end gap-1 mb-3">
                    {plan.price !== "Consultar" && (
                      <span
                        className="text-sm font-medium mb-1"
                        style={{ color: isHighlighted ? "rgba(255,255,255,0.6)" : "var(--text-muted)" }}
                      >
                        €
                      </span>
                    )}
                    <span
                      className="font-bold tracking-tight"
                      style={{
                        fontSize: "clamp(36px, 5vw, 48px)",
                        letterSpacing: "-0.03em",
                        color: isHighlighted ? "white" : "var(--text)",
                      }}
                    >
                      {plan.price}
                    </span>
                    {plan.price !== "Consultar" && (
                      <span
                        className="text-sm mb-1"
                        style={{ color: isHighlighted ? "rgba(255,255,255,0.6)" : "var(--text-muted)" }}
                      >
                        /mes
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: isHighlighted ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}
                  >
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check
                        size={15}
                        className="shrink-0 mt-0.5"
                        style={{ color: isHighlighted ? "rgba(255,255,255,0.65)" : "var(--brand)" }}
                      />
                      <span style={{ color: isHighlighted ? "rgba(255,255,255,0.85)" : "var(--text-muted)" }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#lista-espera"
                  className="block text-center font-semibold py-3 px-6 rounded-xl text-sm transition-opacity hover:opacity-85"
                  style={
                    isHighlighted
                      ? { background: "white", color: "var(--brand)" }
                      : { background: "var(--brand)", color: "white" }
                  }
                >
                  {plan.cta}
                </a>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
