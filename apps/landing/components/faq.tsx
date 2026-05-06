"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { faqItems as faqs } from "@/lib/faq-data";

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
        <span role="heading" aria-level={3} style={{ color: "var(--text)" }} className="font-semibold text-sm sm:text-base">
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
      className="py-32 px-4 sm:px-6"
      style={{ background: "var(--bg-subtle)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-14">
          <p className="reveal text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--brand)" }}>
            FAQ
          </p>
          <h2 className="reveal text-4xl sm:text-5xl font-bold leading-tight mb-6" style={{ color: "var(--text)" }}>
            Todo lo que necesitas saber.
          </h2>
          <p className="reveal text-base" style={{ color: "var(--text-muted)" }}>
            ¿Tienes otra pregunta?{" "}
            <a href="mailto:hola@escualia.es" style={{ color: "var(--brand)" }} className="font-semibold hover:opacity-70 transition-opacity">
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
