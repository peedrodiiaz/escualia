"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
      className="stagger-item"
      style={{
        borderBottom: "1px solid var(--border)",
        ["--i" as string]: index,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <h3
          className="font-semibold"
          style={{ color: "var(--text)", fontSize: 15, lineHeight: 1.4 }}
        >
          {question}
        </h3>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: open
              ? "var(--brand)"
              : "color-mix(in srgb, var(--brand) 10%, transparent)",
            color: open ? "white" : "var(--brand)",
            transform: open ? "rotate(45deg)" : "none",
          }}
          aria-hidden
        >
          <Plus size={14} strokeWidth={2.5} />
        </span>
      </button>

      {/* Smooth height animation via max-height */}
      <div
        style={{
          maxHeight: open ? "400px" : "0",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <p
          className="pb-5 leading-relaxed"
          style={{ color: "var(--text-muted)", fontSize: 14 }}
        >
          {answer}
        </p>
      </div>
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
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-14">
          <p className="reveal text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--brand)" }}>
            FAQ
          </p>
          <h2
            className="reveal font-bold leading-tight mb-5"
            style={{ color: "var(--text)", fontSize: "clamp(32px, 4.5vw, 52px)", letterSpacing: "-0.025em" }}
          >
            Preguntas frecuentes sobre Escualia.
          </h2>
          <p className="reveal text-base" style={{ color: "var(--text-muted)" }}>
            ¿Tienes otra pregunta?{" "}
            <a
              href="mailto:hola@escualia.es"
              style={{ color: "var(--brand)" }}
              className="font-semibold hover:opacity-70 transition-opacity"
            >
              Escríbenos directamente.
            </a>
          </p>
        </div>

        <div style={{ borderTop: "1px solid var(--border)" }}>
          {faqs.map((faq, i) => (
            <FaqItem key={faq.question} {...faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
