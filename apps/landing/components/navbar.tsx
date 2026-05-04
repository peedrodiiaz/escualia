"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1D4ED8] flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-bold text-xl text-slate-900">Escualia</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#problema" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
            El problema
          </a>
          <a href="#funciones" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
            Funciones
          </a>
          <a href="#precios" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
            Precios
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#lista-espera"
            className="bg-[#1D4ED8] hover:bg-[#1e3a8a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Solicitar acceso
          </a>
        </div>

        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-4">
          <a href="#problema" className="text-slate-700 font-medium" onClick={() => setOpen(false)}>El problema</a>
          <a href="#funciones" className="text-slate-700 font-medium" onClick={() => setOpen(false)}>Funciones</a>
          <a href="#precios" className="text-slate-700 font-medium" onClick={() => setOpen(false)}>Precios</a>
          <a
            href="#lista-espera"
            className="bg-[#1D4ED8] text-white text-sm font-semibold px-4 py-2 rounded-lg text-center"
            onClick={() => setOpen(false)}
          >
            Solicitar acceso
          </a>
        </div>
      )}
    </header>
  );
}
