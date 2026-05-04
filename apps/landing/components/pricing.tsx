import { Check } from "lucide-react";

const plans = [
  {
    name: "Autónomo",
    price: "29",
    description: "Para autoescuelas independientes con hasta 2 instructores.",
    features: [
      "Hasta 100 alumnos activos",
      "2 instructores",
      "Gestión de alumnos y agenda",
      "Facturación básica",
      "App de estudio para alumnos",
      "Soporte por email",
    ],
    cta: "Empezar gratis 30 días",
    highlighted: false,
  },
  {
    name: "Escuela",
    price: "79",
    description: "La opción más popular para autoescuelas en crecimiento.",
    features: [
      "Alumnos ilimitados",
      "Instructores ilimitados",
      "Todo el plan Autónomo",
      "Informes y estadísticas",
      "App móvil para instructores",
      "Recordatorios automáticos",
      "Soporte prioritario",
    ],
    cta: "Empezar gratis 30 días",
    highlighted: true,
    badge: "Más popular",
  },
  {
    name: "Franquicia",
    price: "Consultar",
    description: "Para grupos con varias academias y necesidades avanzadas.",
    features: [
      "Todo el plan Escuela",
      "Multi-sede centralizada",
      "API e integraciones",
      "Panel de administración",
      "Gestor de cuenta dedicado",
      "SLA garantizado",
    ],
    cta: "Hablar con ventas",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="precios" className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-block bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Precios
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Sin sorpresas. Sin comisiones.
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            30 días gratuitos sin tarjeta de crédito. Cancela cuando quieras.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-7 relative ${
                plan.highlighted
                  ? "bg-[#1D4ED8] border-[#1D4ED8] text-white shadow-2xl shadow-blue-300 scale-105"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className={`text-sm font-semibold mb-1 ${plan.highlighted ? "text-blue-200" : "text-slate-500"}`}>
                  {plan.name}
                </div>
                <div className="flex items-end gap-1 mb-2">
                  {plan.price !== "Consultar" && (
                    <span className={`text-sm font-medium ${plan.highlighted ? "text-blue-200" : "text-slate-500"}`}>€</span>
                  )}
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Consultar" && (
                    <span className={`text-sm mb-1 ${plan.highlighted ? "text-blue-200" : "text-slate-500"}`}>/mes</span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed ${plan.highlighted ? "text-blue-100" : "text-slate-500"}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check
                      size={16}
                      className={`shrink-0 ${plan.highlighted ? "text-blue-200" : "text-[#1D4ED8]"}`}
                    />
                    <span className={plan.highlighted ? "text-blue-50" : "text-slate-700"}>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#lista-espera"
                className={`block text-center font-semibold py-3 px-6 rounded-xl transition-colors ${
                  plan.highlighted
                    ? "bg-white text-[#1D4ED8] hover:bg-blue-50"
                    : "bg-[#1D4ED8] text-white hover:bg-[#1e3a8a]"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
