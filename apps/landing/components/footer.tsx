"use client";

import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer
      className="py-12 px-4 sm:px-6"
      style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <Logo />

        <div className="flex flex-wrap items-center justify-center gap-8 text-sm" style={{ color: "var(--text-subtle)" }}>
          {[
            { label: "Política de privacidad", href: "#" },
            { label: "Términos de uso", href: "#" },
            { label: "hola@escualia.es", href: "mailto:hola@escualia.es" },
          ].map((link) => (
            <a key={link.label} href={link.href} className="transition-opacity hover:opacity-60">
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-sm" style={{ color: "var(--text-subtle)" }}>
          © {new Date().getFullYear()} Escualia
        </p>
      </div>
    </footer>
  );
}
