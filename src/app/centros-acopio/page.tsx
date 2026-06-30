import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/servidor";

export const metadata: Metadata = {
  title: "Centros de Acopio - Reportate Venezuela",
  description: "Registro de centros de acopio habilitados en todo el territorio nacional.",
};

interface CentroAcopio {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
  telefonos: string[];
  horario: string;
  descripcion: string;
  creado_en: string;
}

async function obtenerCentros(): Promise<CentroAcopio[]> {
  const { data } = await supabaseAdmin
    .from("centros_acopio")
    .select("*")
    .order("creado_en", { ascending: false });

  return (data as CentroAcopio[]) || [];
}

export default async function PaginaCentrosAcopio() {
  const centros = await obtenerCentros();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">Centros de Acopio</h1>
          <p className="text-zinc-600">
            Puntos de recoleccion y distribucion de ayuda habilitados en todo el pais.
          </p>
        </div>
        <Link
          href="/centros-acopio/registrar"
          className="inline-flex items-center gap-2 bg-zinc-900 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-sm shrink-0"
        >
          Registrar centro
        </Link>
      </section>

      {centros.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-lg">
          <p className="text-zinc-500">No hay centros de acopio registrados aun.</p>
          <Link
            href="/centros-acopio/registrar"
            className="inline-block mt-4 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Registrar el primero
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {centros.map((centro) => (
            <article
              key={centro.id}
              className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-300 hover:shadow-sm transition-all space-y-4"
            >
              <h2 className="text-lg font-semibold text-zinc-900">{centro.nombre}</h2>

              <p className="text-sm text-zinc-600 leading-relaxed">
                {centro.descripcion || "Sin descripcion adicional."}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-zinc-500">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-zinc-600">{centro.direccion}</span>
                </div>

                {centro.telefonos.length > 0 && (
                  <div className="flex items-start gap-2 text-zinc-500">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="flex flex-col gap-1">
                      {centro.telefonos.map((tel, i) => (
                        <a
                          key={i}
                          href={`tel:${tel}`}
                          className="text-zinc-600 hover:text-zinc-900 transition-colors"
                        >
                          {tel}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {centro.horario && (
                  <div className="flex items-start gap-2 text-zinc-500">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-zinc-600">{centro.horario}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-zinc-400">
                Registrado el {new Date(centro.creado_en).toLocaleDateString("es-VE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
