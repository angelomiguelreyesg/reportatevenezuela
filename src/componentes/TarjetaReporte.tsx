"use client";

import { useState } from "react";
import Image from "next/image";
import { truncarTexto } from "@/lib/utilidades/sanitizacion";
import { ETIQUETAS_TIPO, COLORES_TIPO, COLORES_ESTADO } from "@/lib/constantes";

interface Reporte {
  id: string;
  tipo_reporte: string;
  titulo: string;
  descripcion: string;
  direccion: string;
  fotos: string[];
  creado_en: string;
  estado: string;
  edad?: number | null;
  genero?: string;
  nivel_riesgo?: string;
  fecha_evento?: string;
  cedula_identidad?: string;
}

interface Props {
  reporte: Reporte;
}

export default function TarjetaReporte({ reporte }: Props) {
  const [fotoAmpliada, setFotoAmpliada] = useState<string | null>(null);

    const tieneDatosCensales = reporte.edad || reporte.genero || reporte.nivel_riesgo || reporte.fecha_evento;

  return (
    <>
      <article className="bg-white border border-zinc-200 rounded-lg overflow-hidden hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col">
        {reporte.fotos.length > 0 && (
          <div className="relative h-48 bg-zinc-100">
            <Image
              src={reporte.fotos[0]}
              alt={reporte.titulo}
              fill
              className="object-cover cursor-pointer"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onClick={() => setFotoAmpliada(reporte.fotos[0])}
            />
            {reporte.fotos.length > 1 && (
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                +{reporte.fotos.length - 1}
              </span>
            )}
          </div>
        )}

        <div className="p-4 space-y-3 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
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

          <h3 className="text-base font-semibold text-zinc-900 leading-snug">
            {reporte.titulo}
          </h3>

          <p className="text-sm text-zinc-600 leading-relaxed flex-1">
            {truncarTexto(reporte.descripcion, 150)}
          </p>

          {tieneDatosCensales && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {reporte.edad && (
                <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                  Edad: {reporte.edad}
                </span>
              )}
              {reporte.genero && (
                <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded capitalize">
                  {reporte.genero}
                </span>
              )}
              {reporte.nivel_riesgo && (
                <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                  Riesgo: {reporte.nivel_riesgo}
                </span>
              )}
              {reporte.fecha_evento && (
                <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                  {new Date(reporte.fecha_evento).toLocaleDateString("es-VE")}
                </span>
              )}
            </div>
          )}

          <div className="flex items-start gap-1.5 text-xs text-zinc-500 pt-1">
            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{reporte.direccion}</span>
          </div>

          <p className="text-xs text-zinc-400">
            {new Date(reporte.creado_en).toLocaleDateString("es-VE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </article>

      {fotoAmpliada && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setFotoAmpliada(null)}
        >
          <div className="relative w-full max-w-3xl h-[80vh]">
            <Image
              src={fotoAmpliada}
              alt="Foto ampliada"
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
