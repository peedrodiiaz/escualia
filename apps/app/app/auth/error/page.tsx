export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-subtle)" }}>
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>
          Error de autenticación
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          El enlace ha expirado o no es válido.
        </p>
        <a
          href="/login"
          className="text-sm font-medium"
          style={{ color: "var(--brand)" }}
        >
          Volver al inicio de sesión
        </a>
      </div>
    </main>
  );
}
