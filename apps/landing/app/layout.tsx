import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Escualia — El software que entiende tu autoescuela",
  description:
    "Gestiona alumnos, clases, facturación y preparación de exámenes en una sola plataforma. Diseñado para autoescuelas españolas.",
  keywords: ["autoescuela", "software autoescuela", "gestión autoescuela", "DGT", "clases prácticas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={GeistSans.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
