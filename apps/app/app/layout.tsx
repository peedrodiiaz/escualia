import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Escualia — Panel de gestión",
  description: "Panel de gestión para autoescuelas españolas.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={GeistSans.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
