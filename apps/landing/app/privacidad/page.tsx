import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — Escualia",
  description: "Información sobre el tratamiento de tus datos personales en Escualia.",
  alternates: { canonical: "https://escualia.es/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 prose prose-slate">
      <h1>Política de Privacidad</h1>
      <p><strong>Última actualización:</strong> mayo de 2025</p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        El responsable del tratamiento de tus datos es <strong>Escualia</strong>, con dirección de contacto:{" "}
        <a href="mailto:hola@escualia.es">hola@escualia.es</a>.
      </p>
      <p>
        <em>
          Nota: Los datos del responsable (NIF/CIF y domicilio social) se completarán una vez constituida la
          entidad jurídica.
        </em>
      </p>

      <h2>2. Datos que recogemos</h2>
      <p>
        A través del formulario de lista de espera recogemos los siguientes datos personales:
      </p>
      <ul>
        <li>Nombre de la autoescuela</li>
        <li>Dirección de correo electrónico</li>
      </ul>

      <h2>3. Finalidad del tratamiento</h2>
      <p>
        Tus datos se utilizan exclusivamente para comunicarte el lanzamiento del servicio Escualia y enviarte
        información relacionada con el acceso anticipado a la plataforma.
      </p>

      <h2>4. Base jurídica</h2>
      <p>
        El tratamiento se basa en el <strong>consentimiento del interesado</strong> (art. 6.1.a del Reglamento
        General de Protección de Datos — RGPD), otorgado de forma libre y voluntaria al cumplimentar el
        formulario de lista de espera.
      </p>
      <p>
        Puedes retirar tu consentimiento en cualquier momento enviando un email a{" "}
        <a href="mailto:hola@escualia.es">hola@escualia.es</a> sin que ello afecte a la licitud del
        tratamiento anterior.
      </p>

      <h2>5. Destinatarios</h2>
      <p>
        Tus datos se almacenan en <strong>Supabase</strong> (Supabase Inc.), proveedor de base de datos en la
        nube cuyos servidores se encuentran en la Unión Europea / Espacio Económico Europeo. Supabase actúa
        como encargado del tratamiento bajo las garantías del RGPD.
      </p>
      <p>No cedemos tus datos a terceros salvo obligación legal.</p>

      <h2>6. Plazo de conservación</h2>
      <p>
        Conservamos tus datos mientras no solicites su supresión. Una vez retirado el consentimiento o
        ejercido el derecho de supresión, procederemos a eliminarlos en un plazo máximo de 30 días.
      </p>

      <h2>7. Tus derechos</h2>
      <p>Tienes derecho a:</p>
      <ul>
        <li><strong>Acceso:</strong> obtener confirmación de si tratamos tus datos y acceder a ellos.</li>
        <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos.</li>
        <li><strong>Supresión:</strong> solicitar la eliminación de tus datos.</li>
        <li><strong>Limitación:</strong> solicitar que restrinjamos el tratamiento.</li>
        <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado.</li>
        <li><strong>Oposición:</strong> oponerte al tratamiento en determinadas circunstancias.</li>
      </ul>
      <p>
        Para ejercer cualquiera de estos derechos, escríbenos a{" "}
        <a href="mailto:hola@escualia.es">hola@escualia.es</a> indicando el derecho que deseas ejercer.
      </p>
      <p>
        También tienes derecho a presentar una reclamación ante la{" "}
        <strong>Agencia Española de Protección de Datos (AEPD)</strong>:{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>.
      </p>

      <h2>8. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a accesos no
        autorizados, pérdida o destrucción accidental.
      </p>

      <h2>9. Modificaciones</h2>
      <p>
        Podemos actualizar esta política en cualquier momento. Te notificaremos los cambios relevantes por
        email si así lo requiere la normativa aplicable.
      </p>
    </main>
  );
}
