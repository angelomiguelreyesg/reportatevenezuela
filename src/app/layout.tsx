import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Encabezado from "@/componentes/Encabezado";
import PiePagina from "@/componentes/PiePagina";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reportate Venezuela",
  description:
    "Plataforma ciudadana para reportar infraestructuras deterioradas, edificios en riesgo de colapso, personas desaparecidas e incidencias generales.",
};

export const viewport = "width=device-width, initial-scale=1";

export default function RaizLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 font-sans">
        <Encabezado />
        <main className="flex-1">{children}</main>
        <PiePagina />
      </body>
    </html>
  );
}
