"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const faqs = [
  {
    question: "¿Tengo que migrar todos mis datos desde Excel o papel?",
    answer:
      "No. Puedes empezar a usar Escualia desde cero con tus nuevos alumnos y migrar los históricos poco a poco. También ofrecemos un servicio de migración asistida gratuito para las primeras 50 autoescuelas.",
  },
  {
    question: "¿Los datos de mis alumnos están seguros? ¿Cumple con el RGPD?",
    answer:
      "Sí. Escualia cumple con el Reglamento General de Protección de Datos (RGPD) y la normativa española. Los servidores están en la UE, los datos se cifran en tránsito y en reposo, y tú eres siempre el propietario de tu información.",
  },
  {
    question: "¿Funciona con mi gestor de contabilidad o con Hacienda?",
    answer:
      "Escualia genera facturas en formato estándar y exporta a los formatos más comunes (Excel, CSV, PDF). Estamos trabajando en integración directa con los principales programas de contabilidad. Si usas uno específico, cuéntanoslo y lo priorizamos.",
  },
  {
    question: "¿Puedo probar Escualia sin pagar nada?",
    answer:
      "Sí. Las primeras 50 autoescuelas en la lista de espera tienen 30 días gratuitos con acceso completo, sin tarjeta de crédito. Cancelas cuando quieras, sin penalizaciones.",
  },
  {
    question: "¿Qué pasa si tengo varias sedes o varios instructores?",
    answer:
      "El plan Escuela incluye instructores ilimitados y el plan Franquicia cubre multi-sede con panel centralizado. Cada instructor tiene su propio acceso y agenda. Tú ves todo desde un único panel de control.",
  },
  {
    question: "¿El alumno necesita instalar algo para reservar o estudiar?",
    answer:
      "No necesita instalar nada para reservar clases — lo hace desde el navegador del móvil. Para la app de estudio con tests y simulacros DGT, hay una app nativa disponible en iOS y Android.",
  },
];

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="stagger-item rounded-xl overflow-hidden"
      style={{
        border: "1px solid var(--border)",
        background: "var(--bg-card)",
        ["--i" as string]: index,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        ...(open
          ? { borderColor: "color-mix(in srgb, var(--brand) 40%, var(--border))", boxShadow: "0 4px 20px -4px rgb(37 99 235 / 0.12)" }
          : {}),
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-opacity hover:opacity-80"
      >
        <span style={{ color: "var(--text)" }} className="font-semibold text-sm sm:text-base">
          {question}
        </span>
        <ChevronDown
          size={18}
          style={{ color: "var(--text-subtle)" }}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p
            style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
            className="text-sm leading-relaxed pt-4"
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export function FAQ() {
  const sectionRef = useReveal<HTMLElement>({ threshold: 0.07 });

  return (
    <section
      ref={sectionRef}
      id="faq"
      style={{ background: "var(--bg)" }}
      className="py-24 px-4 sm:px-6"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="reveal inline-block text-sm font-semibold px-4 py-2 rounded-full mb-4"
            style={{
              background: "var(--bg-muted)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
          >
            Preguntas frecuentes
          </div>
          <h2
            className="reveal text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "var(--text)" }}
          >
            Todo lo que necesitas saber
          </h2>
          <p className="reveal" style={{ color: "var(--text-muted)" }}>
            ¿Tienes otra pregunta?{" "}
            <a
              href="mailto:hola@escualia.es"
              style={{ color: "var(--brand)" }}
              className="font-semibold hover:underline"
            >
              Escríbenos directamente.
            </a>
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={faq.question} {...faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
