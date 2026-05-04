import { ArrowRight, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#1D4ED8]/10 text-[#1D4ED8] text-sm font-semibold px-4 py-2 rounded-full mb-6">
          <Star size={14} fill="currentColor" />
          Software diseñado para autoescuelas españolas
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
          El software que{" "}
          <span className="text-[#1D4ED8]">entiende</span>
          <br />
          tu autoescuela
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Gestiona alumnos, agenda clases, emite facturas y prepara a tus alumnos para el examen.
          Todo en una sola plataforma. Sin papeles, sin Excel, sin caos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#lista-espera"
            className="inline-flex items-center justify-center gap-2 bg-[#1D4ED8] hover:bg-[#1e3a8a] text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-blue-200"
          >
            Solicitar acceso anticipado
            <ArrowRight size={20} />
          </a>
          <a
            href="#funciones"
            className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Ver funciones
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Sin tarjeta de crédito
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Configuración en 5 minutos
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Soporte en español
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200 overflow-hidden max-w-4xl mx-auto">
            <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-2 text-xs text-slate-400 font-mono">app.escualia.es — Dashboard</span>
            </div>
            <div className="p-8 bg-slate-50 min-h-[300px] flex items-center justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                {[
                  { label: "Alumnos activos", value: "48", color: "bg-blue-50 border-blue-200 text-blue-700" },
                  { label: "Clases esta semana", value: "32", color: "bg-orange-50 border-orange-200 text-orange-700" },
                  { label: "Exámenes pendientes", value: "12", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                  { label: "Facturas emitidas", value: "€4.200", color: "bg-purple-50 border-purple-200 text-purple-700" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-xl border p-4 ${stat.color}`}
                  >
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs font-medium mt-1 opacity-80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
