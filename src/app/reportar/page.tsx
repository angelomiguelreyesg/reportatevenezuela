import type { Metadata } from "next";
import FormularioReporte from "@/componentes/FormularioReporte";
import { TIPOS_REPORTE } from "@/lib/constantes";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hacer un reporte - Reportate Venezuela",
  description: "Reporta personas desaparecidas, incidencias generales o infraestructuras deterioradas.",
};

export default function PaginaReportar() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">Hacer un reporte</h1>
        <p className="text-zinc-600 max-w-xl mx-auto">
          Todos los campos marcados con asterisco son obligatorios. La informacion proporcionada es confidencial
          y sera utilizada unicamente para fines de contacto y analisis censal.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {TIPOS_REPORTE.map((tipo) => (
          <Link
            key={tipo.id}
            href={`/reportar/${tipo.id}`}
            className="bg-white border border-zinc-200 rounded-lg p-4 hover:border-zinc-400 hover:shadow-sm transition-all"
          >
            <h3 className="text-sm font-semibold text-zinc-900">{tipo.titulo}</h3>
            <p className="text-xs text-zinc-500 mt-1">{tipo.descripcion}</p>
          </Link>
        ))}
      </div>

      <FormularioReporte />
    </div>
  );
}
