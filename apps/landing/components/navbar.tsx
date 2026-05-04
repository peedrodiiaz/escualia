"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll(); // estado inicial
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        background: scrolled
          ? "color-mix(in srgb, var(--bg) 88%, transparent)"
          : "transparent",
        borderBottom: scrolled
          ? "1px solid var(--border-subtle)"
          : "1px solid transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        boxShadow: scrolled ? "0 1px 24px -4px rgb(0 0 0 / 0.08)" : "none",
        transition:
          "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease",
      }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#">
          <Logo />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: "#como-funciona", label: "Cómo funciona" },
            { href: "#funciones", label: "Funciones" },
            { href: "#precios", label: "Precios" },
            { href: "#faq", label: "FAQ" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{ color: "var(--text-muted)" }}
              className="text-sm font-medium transition-all hover:opacity-70 hover:translate-y-[-1px]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#lista-espera"
            style={{ background: "var(--brand)", color: "white" }}
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90 hover:scale-105"
          >
            Solicitar acceso
          </a>
        </div>

        <button
          className="md:hidden p-2 transition-colors"
          style={{ color: "var(--text-muted)" }}
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          style={{
            background: "var(--bg)",
            borderTop: "1px solid var(--border)",
          }}
          className="md:hidden px-4 py-4 flex flex-col gap-4"
        >
          {[
            { href: "#como-funciona", label: "Cómo funciona" },
            { href: "#funciones", label: "Funciones" },
            { href: "#precios", label: "Precios" },
            { href: "#faq", label: "FAQ" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{ color: "var(--text)" }}
              className="font-medium"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#lista-espera"
            style={{ background: "var(--brand)", color: "white" }}
            className="text-sm font-semibold px-4 py-2 rounded-lg text-center"
            onClick={() => setOpen(false)}
          >
            Solicitar acceso
          </a>
        </div>
      )}
    </header>
  );
}
