"use client";

import { useReveal } from "@/hooks/useReveal";

const steps = [
  {
    number: "01",
    title: "Das de alta al alumno en segundos",
    description:
      "Nombre, DNI, tipo de carnet y listo. Escualia crea la ficha completa, organiza la documentación y lleva el seguimiento de horas automáticamente. Sin formularios largos, sin duplicados.",
  },
  {
    number: "02",
    title: "El alumno reserva su clase solo",
    description:
      "El alumno ve los huecos disponibles desde su app y reserva directamente. Tú recibes la confirmación. Cero llamadas, cero WhatsApps. Tu agenda siempre actualizada en tiempo real.",
  },
  {
    number: "03",
    title: "Cobras automáticamente y sin errores",
    description:
      "Escualia genera la factura, registra el pago y te avisa si alguien tiene deuda pendiente. Exporta a contabilidad con un clic. Sin facturas olvidadas, sin deudas que se escapan.",
  },
];

export function HowItWorks() {
  const sectionRef = useReveal<HTMLElement>({ threshold: 0.08 });

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      className="py-32 px-4 sm:px-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-20">
          <p className="reveal text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--brand)" }}>
            Cómo funciona
          </p>
          <h2
            className="reveal font-bold leading-tight"
            style={{ color: "var(--text)", fontSize: "clamp(32px, 4.5vw, 52px)", letterSpacing: "-0.025em" }}
          >
            Tres pasos.<br />Toda la gestión resuelta.
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-0" style={{ borderTop: "1px solid var(--border)" }}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="stagger-item grid sm:grid-cols-[120px_1fr] gap-4 sm:gap-16 py-12"
              style={{
                borderBottom: "1px solid var(--border)",
                ["--i" as string]: i,
              }}
            >
              {/* Number */}
              <div className="flex items-start">
                <span
                  className="text-5xl font-black leading-none tracking-tighter"
                  style={{ color: "color-mix(in srgb, var(--brand) 20%, var(--border))" }}
                >
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center">
                <h3
                  className="font-bold mb-4"
                  style={{ color: "var(--text)", fontSize: "clamp(19px, 2vw, 22px)", letterSpacing: "-0.015em" }}
                >
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
