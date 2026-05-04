"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";

const links = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#funciones", label: "Funciones" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        background: scrolled ? "color-mix(in srgb, var(--bg) 90%, transparent)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#">
          <Logo />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-opacity hover:opacity-60"
              style={{ color: "var(--text-muted)" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#lista-espera"
            style={{ background: "var(--brand)", color: "white" }}
            className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-85"
          >
            Solicitar acceso
          </a>
        </div>

        <button
          className="md:hidden p-2"
          style={{ color: "var(--text-muted)" }}
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}
          className="md:hidden px-4 py-6 flex flex-col gap-5"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{ color: "var(--text)" }}
              className="font-medium text-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#lista-espera"
            style={{ background: "var(--brand)", color: "white" }}
            className="text-sm font-semibold px-5 py-3 rounded-lg text-center mt-2"
            onClick={() => setOpen(false)}
          >
            Solicitar acceso
          </a>
        </div>
      )}
    </header>
  );
}
