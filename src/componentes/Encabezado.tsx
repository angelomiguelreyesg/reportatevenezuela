"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Encabezado() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const enlaces = [
    { ruta: "/", texto: "Inicio" },
    { ruta: "/reportar", texto: "Reportar" },
    { ruta: "/reportes", texto: "Historial" },
    { ruta: "/datos", texto: "Datos" },
    { ruta: "/gobierno", texto: "Gobierno" },
    { ruta: "/centros-acopio", texto: "Centros" },
  ];

  return (
    <header className="bg-white border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/bandera.png"
              alt="Bandera de Venezuela"
              width={40}
              height={27}
              className="rounded-sm shrink-0"
              priority
            />
            <span className="text-sm sm:text-xl font-bold text-zinc-900 tracking-tight truncate">
              REPORTATE VENEZUELA
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {enlaces.map((enlace) => (
              <Link
                key={enlace.ruta}
                href={enlace.ruta}
                className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                {enlace.texto}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden text-zinc-600 hover:text-zinc-900 p-2"
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuAbierto && (
          <nav className="md:hidden pb-4 border-t border-zinc-200 pt-4 space-y-1">
            {enlaces.map((enlace) => (
              <Link
                key={enlace.ruta}
                href={enlace.ruta}
                onClick={() => setMenuAbierto(false)}
                className="block py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                {enlace.texto}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
