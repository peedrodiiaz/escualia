import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de Uso — Escualia",
  description: "Condiciones de uso del servicio Escualia.",
  alternates: { canonical: "https://escualia.es/terminos" },
};

export default function TerminosPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 prose prose-slate">
      <h1>Términos de Uso</h1>
      <p><strong>Última actualización:</strong> mayo de 2025</p>

      <h2>1. Objeto del servicio</h2>
      <p>
        Escualia es una plataforma SaaS (Software as a Service) diseñada para autoescuelas españolas que
        permite gestionar alumnos, clases prácticas, facturación y preparación de exámenes DGT desde un
        único lugar.
      </p>
      <p>
        El acceso actual al servicio corresponde a la <strong>fase de lista de espera y acceso anticipado
        (early access)</strong>, previa al lanzamiento público.
      </p>

      <h2>2. Acceso y registro</h2>
      <p>
        El registro en la lista de espera no garantiza acceso inmediato al servicio. Los participantes en
        la fase beta recibirán invitaciones de forma progresiva. El acceso a la plataforma estará sujeto a
        los términos vigentes en el momento del alta.
      </p>

      <h2>3. Uso aceptable</h2>
      <p>El usuario se compromete a no:</p>
      <ul>
        <li>Utilizar el servicio con fines fraudulentos o ilegales.</li>
        <li>Compartir credenciales de acceso con terceros no autorizados.</li>
        <li>Intentar acceder a datos de otras cuentas o tenants.</li>
        <li>Realizar ingeniería inversa, descompilar o extraer el código fuente del servicio.</li>
        <li>Sobrecargar intencionadamente los sistemas de Escualia.</li>
        <li>Introducir datos falsos, maliciosos o que vulneren derechos de terceros.</li>
      </ul>

      <h2>4. Propiedad intelectual</h2>
      <p>
        Todos los derechos sobre el software, diseño, marca, contenidos y documentación de Escualia
        pertenecen exclusivamente a sus titulares. Queda prohibida su reproducción, distribución o
        modificación sin autorización expresa.
      </p>
      <p>
        Los datos introducidos por el usuario en la plataforma son propiedad del usuario. Escualia no
        reivindica ningún derecho sobre ellos.
      </p>

      <h2>5. Disponibilidad del servicio</h2>
      <p>
        Durante la fase beta, el servicio se ofrece <strong>"tal cual"</strong> sin garantías de
        disponibilidad continua. Podemos interrumpir, modificar o suspender el servicio con previo aviso
        razonable.
      </p>

      <h2>6. Limitación de responsabilidad</h2>
      <p>
        En la medida permitida por la ley, Escualia no será responsable de daños indirectos, pérdida de
        datos o interrupciones del servicio durante la fase beta. Esta limitación no afecta a tus derechos
        como consumidor reconocidos por la legislación española.
      </p>

      <h2>7. Ley aplicable y jurisdicción</h2>
      <p>
        Estos términos se rigen por la legislación española. Para cualquier controversia, las partes se
        someten a los juzgados y tribunales competentes de España, sin perjuicio de los derechos que
        correspondan al usuario como consumidor.
      </p>

      <h2>8. Modificaciones</h2>
      <p>
        Nos reservamos el derecho a modificar estos términos en cualquier momento. Te notificaremos los
        cambios relevantes por email con una antelación mínima de 15 días antes de su entrada en vigor.
        El uso continuado del servicio tras la notificación implica la aceptación de los nuevos términos.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Para cualquier consulta sobre estos términos, escríbenos a{" "}
        <a href="mailto:hola@escualia.es">hola@escualia.es</a>.
      </p>
    </main>
  );
}
