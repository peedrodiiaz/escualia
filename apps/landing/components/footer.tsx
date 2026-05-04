"use client";

import { Logo } from "@/components/logo";
import { useReveal } from "@/hooks/useReveal";

export function Footer() {
  const sectionRef = useReveal<HTMLElement>({ threshold: 0.1 });

  return (
    <footer
      ref={sectionRef}
      style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)" }}
      className="py-12 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="reveal flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo />

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {[
              { label: "Política de privacidad", href: "#" },
              { label: "Términos de uso", href: "#" },
              { label: "hola@escualia.es", href: "mailto:hola@escualia.es" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{ color: "var(--text-muted)" }}
                className="transition-all hover:opacity-70 hover:translate-y-[-1px]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div
          className="reveal mt-8 pt-8 text-center text-sm"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-subtle)" }}
        >
          <p>© {new Date().getFullYear()} Escualia. El software que entiende tu autoescuela.</p>
        </div>
      </div>
    </footer>
  );
}
