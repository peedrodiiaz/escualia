import { Users, CalendarDays, Receipt, BookOpen, BarChart3, Smartphone } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestión de alumnos",
    description:
      "Ficha completa de cada alumno: datos personales, documentación, horas realizadas, estado del expediente y notas del instructor.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: CalendarDays,
    title: "Agenda inteligente",
    description:
      "Calendario por instructor, reservas en tiempo real, recordatorios automáticos por WhatsApp o email. Sin llamadas, sin líos.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Receipt,
    title: "Facturación automática",
    description:
      "Genera facturas con un clic, controla los pagos pendientes y exporta a contabilidad. Siempre al día con Hacienda.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: BookOpen,
    title: "App de estudio para alumnos",
    description:
      "Tests tipo DGT, simulacros con tiempo y estadísticas de progreso. Tu alumno estudia más, aprueba antes.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: BarChart3,
    title: "Informes y estadísticas",
    description:
      "Tasa de aprobados, ingresos por mes, alumnos por fase. Toma decisiones con datos reales de tu autoescuela.",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: Smartphone,
    title: "App móvil para instructores",
    description:
      "El instructor ve su agenda del día, registra la clase y añade observaciones desde el móvil. Sin papel, sin retrasos.",
    color: "bg-amber-50 text-amber-600",
  },
];

export function Features() {
  return (
    <section id="funciones" className="py-20 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-block bg-[#1D4ED8]/10 text-[#1D4ED8] text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Todo lo que necesitas
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Una plataforma completa,
            <br />
            diseñada para autoescuelas
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Sin aprendizajes complicados. Empiezas a usar Escualia en 5 minutos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:shadow-slate-100 transition-all"
              >
                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
