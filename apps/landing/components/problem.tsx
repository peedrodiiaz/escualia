import { FileText, Calendar, AlertCircle, Phone } from "lucide-react";

const problems = [
  {
    icon: FileText,
    title: "Fichas en papel o Excel",
    description: "Perder horas buscando el expediente de un alumno entre carpetas o buscando en 20 pestañas de Excel.",
  },
  {
    icon: Calendar,
    title: "Agenda desorganizada",
    description: "Coordinar clases por WhatsApp, llamadas y notas sueltas. Los dobles turnos y olvidos son inevitables.",
  },
  {
    icon: AlertCircle,
    title: "Facturación manual",
    description: "Facturas en Word, pagos sin registrar, deudas que se olvidan. Imposible saber cuánto debes cobrar.",
  },
  {
    icon: Phone,
    title: "El alumno siempre llama",
    description: "Preguntas sobre fechas de examen, horas hechas, material de estudio. Todo pasa por ti.",
  },
];

export function Problem() {
  return (
    <section id="problema" className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-block bg-red-50 text-red-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            El problema real
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Así gestionas hoy tu autoescuela
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            No es culpa tuya. Es que las herramientas actuales no están pensadas para autoescuelas.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-red-200 hover:bg-red-50/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <Icon size={20} className="text-red-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500 text-lg">
            ¿Te suena?{" "}
            <a href="#lista-espera" className="text-[#1D4ED8] font-semibold hover:underline">
              Escualia lo resuelve todo →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
