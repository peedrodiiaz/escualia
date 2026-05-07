import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://escualia.es"),
  title: "Escualia — El software que entiende tu autoescuela",
  description:
    "Gestiona alumnos, clases, facturación y preparación de exámenes en una sola plataforma. Diseñado para autoescuelas españolas.",
  keywords: ["autoescuela", "software autoescuela", "gestión autoescuela", "DGT", "clases prácticas"],
  openGraph: {
    title: "Escualia — El software que entiende tu autoescuela",
    description: "Gestiona alumnos, clases, facturación y preparación de exámenes en una sola plataforma.",
    url: "https://escualia.es",
    siteName: "Escualia",
    images: [{ url: "/og", width: 1200, height: 630, alt: "Escualia — Software para autoescuelas españolas" }],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Escualia — El software que entiende tu autoescuela",
    description: "Gestiona alumnos, clases, facturación y preparación de exámenes.",
    images: ["/og"],
  },
  alternates: { canonical: "https://escualia.es" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={GeistSans.variable}>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Escualia",
              "url": "https://escualia.es",
              "logo": "https://escualia.es/og",
              "description": "Software SaaS de gestión para autoescuelas españolas",
              "email": "hola@escualia.es",
              "areaServed": "ES",
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
