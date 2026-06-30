import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FormularioReporte from "@/componentes/FormularioReporte";
import { TIPOS_REPORTE } from "@/lib/constantes";
import type { TipoReporte } from "@/lib/constantes";

interface Props {
  params: Promise<{ tipo: string }>;
}

const MAPA_TITULOS: Record<string, string> = {
  desaparecido: "Reportar persona desaparecida",
  incidencia: "Reportar incidencia general",
  infraestructura: "Reportar infraestructura deteriorada",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tipo } = await params;
  const valido = TIPOS_REPORTE.find((t) => t.id === tipo);
  if (!valido) return { title: "Tipo no valido - Reportate Venezuela" };
  return {
    title: `${valido.titulo} - Reportate Venezuela`,
    description: valido.descripcion,
  };
}

export default async function PaginaReportarTipo({ params }: Props) {
  const { tipo } = await params;
  const valido = TIPOS_REPORTE.find((t) => t.id === tipo);

  if (!valido) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-zinc-900">{MAPA_TITULOS[tipo]}</h1>
        <p className="text-zinc-600 max-w-xl mx-auto">{valido.descripcion}</p>
      </section>
      <FormularioReporte tipoPorDefecto={tipo as TipoReporte} />
    </div>
  );
}
