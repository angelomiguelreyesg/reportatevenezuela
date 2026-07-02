import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/servidor";
import Image from "next/image";
import { ETIQUETAS_TIPO, COLORES_TIPO, COLORES_ESTADO } from "@/lib/constantes";
import { limpiarTexto } from "@/lib/utilidades/sanitizacion";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PaginaDetalleReporte({ params }: Props) {
  const { id } = await params;

  const { data: reporte } = await supabaseAdmin
    .from("reportes")
    .select("*")
    .eq("id", id)
    .single();

  if (!reporte) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/reportes"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver al historial
      </Link>

      <article className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        {reporte.fotos && reporte.fotos.length > 0 && (
          <div className="relative h-64 sm:h-96 bg-zinc-100">
            <Image
              src={reporte.fotos[0]}
              alt={reporte.titulo}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded border ${
                  COLORES_TIPO[reporte.tipo_reporte] || "bg-zinc-100 text-zinc-700 border-zinc-200"
                }`}
              >
                {ETIQUETAS_TIPO[reporte.tipo_reporte] || reporte.tipo_reporte}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  COLORES_ESTADO[reporte.estado] || "bg-zinc-100 text-zinc-600"
                }`}
              >
                {reporte.estado}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {new Date(reporte.creado_en).toLocaleDateString("es-VE", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">{limpiarTexto(reporte.titulo)}</h1>

          <p className="text-zinc-700 leading-relaxed whitespace-pre-line">{limpiarTexto(reporte.descripcion)}</p>

          <div className="flex items-start gap-2 text-sm text-zinc-600">
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{limpiarTexto(reporte.direccion)}</span>
          </div>

          <div className="border-t border-zinc-200 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="block text-zinc-400 text-xs">Telefono de contacto</span>
              <span className="text-zinc-900">{reporte.telefono_contacto}</span>
            </div>
            {reporte.nombre_reportante && (
              <div>
                <span className="block text-zinc-400 text-xs">Reportado por</span>
                <span className="text-zinc-900">{limpiarTexto(reporte.nombre_reportante)}</span>
              </div>
            )}
            {reporte.edad && (
              <div>
                <span className="block text-zinc-400 text-xs">Edad</span>
                <span className="text-zinc-900">{reporte.edad}</span>
              </div>
            )}
            {reporte.genero && (
              <div>
                <span className="block text-zinc-400 text-xs">Genero</span>
                <span className="text-zinc-900 capitalize">{reporte.genero}</span>
              </div>
            )}
            {reporte.nivel_riesgo && (
              <div>
                <span className="block text-zinc-400 text-xs">Nivel de riesgo</span>
                <span className="text-zinc-900 capitalize">{reporte.nivel_riesgo}</span>
              </div>
            )}
            {reporte.fecha_evento && (
              <div>
                <span className="block text-zinc-400 text-xs">Fecha del evento</span>
                <span className="text-zinc-900">
                  {new Date(reporte.fecha_evento).toLocaleDateString("es-VE")}
                </span>
              </div>
            )}
          </div>

          {reporte.fotos && reporte.fotos.length > 1 && (
            <div className="border-t border-zinc-200 pt-4">
              <h3 className="text-sm font-medium text-zinc-900 mb-3">Fotos adicionales</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {reporte.fotos.slice(1).map((foto: string, i: number) => (
                  <div key={i} className="relative h-32 bg-zinc-100 rounded-lg overflow-hidden">
                    <Image
                      src={foto}
                      alt={`Foto ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 200px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
