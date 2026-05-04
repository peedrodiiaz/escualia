"use client";

import { useReveal } from "@/hooks/useReveal";

const steps = [
  {
    number: "01",
    title: "Das de alta al alumno en segundos",
    description:
      "Nombre, DNI, tipo de carnet y listo. Escualia crea la ficha completa, organiza la documentación y lleva el seguimiento de horas automáticamente.",
    highlight: "Sin formularios largos. Sin duplicados.",
    illustration: (
      <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="20" y="20" width="120" height="80" rx="10" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1.5" />
        <circle cx="50" cy="52" r="16" fill="color-mix(in srgb, var(--brand) 15%, transparent)" />
        <circle cx="50" cy="48" r="7" fill="var(--brand)" opacity="0.7" />
        <path d="M37 65 Q50 58 63 65" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
        <rect x="72" y="38" width="52" height="6" rx="3" fill="var(--border)" />
        <rect x="72" y="50" width="36" height="5" rx="2.5" fill="var(--border)" opacity="0.6" />
        <rect x="72" y="62" width="44" height="5" rx="2.5" fill="var(--border)" opacity="0.6" />
        <rect x="28" y="82" width="48" height="10" rx="5" fill="color-mix(in srgb, #10b981 15%, transparent)" />
        <text x="52" y="90" textAnchor="middle" fontSize="6" fill="#059669" fontWeight="600">Expediente activo</text>
        <circle cx="126" cy="38" r="10" fill="var(--brand)" />
        <path d="M121 38 L124.5 41.5 L131 35" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "El alumno reserva su clase solo",
    description:
      "El alumno ve los huecos disponibles desde su app y reserva directamente. Tú recibes la confirmación. Cero llamadas, cero WhatsApps para coordinar.",
    highlight: "Tu agenda siempre actualizada en tiempo real.",
    illustration: (
      <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="52" y="10" width="56" height="100" rx="10" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1.5" />
        <rect x="57" y="18" width="46" height="70" rx="4" fill="var(--bg-subtle)" />
        <rect x="57" y="18" width="46" height="14" rx="4" fill="var(--brand)" />
        <text x="80" y="28" textAnchor="middle" fontSize="6" fill="white" fontWeight="700">Mayo 2026</text>
        {[0,1,2,3,4].map((col) =>
          [0,1,2].map((row) => {
            const selected = col === 2 && row === 1;
            return (
              <rect
                key={`${col}-${row}`}
                x={59 + col * 9}
                y={34 + row * 10}
                width="7"
                height="7"
                rx="2"
                fill={selected ? "var(--accent)" : "var(--bg-card)"}
                stroke={selected ? "var(--accent)" : "var(--border)"}
                strokeWidth="0.8"
              />
            );
          })
        )}
        <rect x="59" y="68" width="42" height="12" rx="6" fill="color-mix(in srgb, #10b981 15%, transparent)" stroke="#10b981" strokeWidth="0.8" />
        <text x="80" y="76.5" textAnchor="middle" fontSize="5.5" fill="#059669" fontWeight="700">✓ Clase reservada</text>
        <circle cx="80" cy="103" r="4" stroke="var(--border)" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Cobras automáticamente y sin errores",
    description:
      "Escualia genera la factura, registra el pago y te avisa si alguien tiene deuda pendiente. Exporta a contabilidad con un clic.",
    highlight: "Sin facturas olvidadas. Sin deudas que se escapan.",
    illustration: (
      <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="30" y="15" width="80" height="90" rx="8" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1.5" />
        <rect x="30" y="15" width="80" height="18" rx="8" fill="var(--brand)" />
        <rect x="30" y="24" width="80" height="9" fill="var(--brand)" />
        <text x="70" y="27" textAnchor="middle" fontSize="7" fill="white" fontWeight="700">FACTURA</text>
        <rect x="38" y="42" width="44" height="5" rx="2.5" fill="var(--border)" />
        <rect x="38" y="52" width="32" height="4" rx="2" fill="var(--border)" opacity="0.5" />
        <rect x="38" y="62" width="36" height="4" rx="2" fill="var(--border)" opacity="0.5" />
        <line x1="38" y1="75" x2="102" y2="75" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2" />
        <text x="38" y="87" fontSize="7" fill="var(--text-muted)" fontWeight="500">Total</text>
        <text x="102" y="87" textAnchor="end" fontSize="9" fill="var(--text)" fontWeight="800">€320</text>
        <rect x="72" y="78" width="34" height="18" rx="4" fill="color-mix(in srgb, #10b981 12%, transparent)" stroke="#10b981" strokeWidth="1.2" transform="rotate(-8 89 87)" />
        <text x="89" y="89" textAnchor="middle" fontSize="7.5" fill="#059669" fontWeight="800" transform="rotate(-8 89 87)">PAGADO</text>
        <path d="M118 60 L134 60 M128 54 L134 60 L128 66" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="138" y="55" fontSize="5.5" fill="var(--text-muted)">Export</text>
        <text x="138" y="63" fontSize="5.5" fill="var(--text-muted)">conta</text>
      </svg>
    ),
  },
];

export function HowItWorks() {
  const sectionRef = useReveal<HTMLElement>({ threshold: 0.08 });

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      style={{ background: "var(--bg-subtle)" }}
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
            Cómo funciona
          </div>
          <h2
            className="reveal text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "var(--text)" }}
          >
            Tres pasos. Toda la gestión resuelta.
          </h2>
          <p
            className="reveal text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            No necesitas migrar nada ni aprender un sistema complejo. Empiezas a usarlo hoy.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="stagger-item flex flex-col items-center text-center"
              style={{ ["--i" as string]: i }}
            >
              {/* Illustration */}
              <div
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                className="card-hover w-full h-44 rounded-2xl mb-6 overflow-hidden p-4 flex items-center justify-center"
              >
                {step.illustration}
              </div>

              {/* Step number + connector */}
              <div className="flex items-center w-full mb-4">
                <div
                  style={{ background: "var(--brand)", color: "white" }}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    style={{ background: "linear-gradient(90deg, var(--brand), transparent)" }}
                    className="flex-1 h-0.5 opacity-20 ml-2"
                  />
                )}
              </div>

              <h3 style={{ color: "var(--text)" }} className="text-lg font-bold mb-3 text-left w-full">
                {step.title}
              </h3>
              <p style={{ color: "var(--text-muted)" }} className="text-sm leading-relaxed mb-4 text-left">
                {step.description}
              </p>
              <div
                style={{
                  background: "color-mix(in srgb, #10b981 10%, transparent)",
                  color: "#059669",
                  border: "1px solid color-mix(in srgb, #10b981 20%, transparent)",
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full self-start"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {step.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
