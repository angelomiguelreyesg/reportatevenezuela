"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/cliente";
import { TIPOS_REPORTE, ETIQUETAS_TIPO, NIVELES_RIESGO } from "@/lib/constantes";
import { obtenerCache, guardarCache } from "@/lib/utilidades/cache";

interface Conteos {
  total: number;
  porTipo: Record<string, number>;
  porEstado: Record<string, number>;
  porRiesgo: Record<string, number>;
  porGenero: Record<string, number>;
  rangosEdad: Record<string, number>;
}

function BarraDatos({ etiqueta, valor, total }: { etiqueta: string; valor: number; total: number }) {
  const porcentaje = total > 0 ? (valor / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-zinc-700 capitalize">{etiqueta}</span>
        <span className="text-zinc-500 font-mono">{valor} ({porcentaje.toFixed(1)}%)</span>
      </div>
      <div className="w-full bg-zinc-100 rounded-full h-2">
        <div className="bg-zinc-900 h-2 rounded-full transition-all" style={{ width: `${porcentaje}%` }} />
      </div>
    </div>
  );
}

export default function PaginaGobierno() {
  const [conteos, setConteos] = useState<Conteos | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    async function obtenerDatos() {
      const CACHE_CLAVE = "gobierno_datos";
      const cache = obtenerCache<Conteos>(CACHE_CLAVE);
      if (cache) {
        if (activo) {
          setConteos(cache);
          setCargando(false);
          return;
        }
      }

      try {
        const { data: reportes } = await supabase.from("reportes").select("*");

        if (!activo) return;
        if (!reportes) return;

        const porTipo: Record<string, number> = {};
        const porEstado: Record<string, number> = {};
        const porRiesgo: Record<string, number> = {};
        const porGenero: Record<string, number> = {};
        const rangosEdad: Record<string, number> = {};

        for (const r of reportes) {
          porTipo[r.tipo_reporte] = (porTipo[r.tipo_reporte] || 0) + 1;
          porEstado[r.estado] = (porEstado[r.estado] || 0) + 1;
          if (r.nivel_riesgo) porRiesgo[r.nivel_riesgo] = (porRiesgo[r.nivel_riesgo] || 0) + 1;
          if (r.genero) porGenero[r.genero] = (porGenero[r.genero] || 0) + 1;
          if (r.edad) {
            if (r.edad <= 12) rangosEdad["0-12"] = (rangosEdad["0-12"] || 0) + 1;
            else if (r.edad <= 17) rangosEdad["13-17"] = (rangosEdad["13-17"] || 0) + 1;
            else if (r.edad <= 30) rangosEdad["18-30"] = (rangosEdad["18-30"] || 0) + 1;
            else if (r.edad <= 60) rangosEdad["31-60"] = (rangosEdad["31-60"] || 0) + 1;
            else rangosEdad["60+"] = (rangosEdad["60+"] || 0) + 1;
          }
        }

        const resultado = { total: reportes.length, porTipo, porEstado, porRiesgo, porGenero, rangosEdad };
        guardarCache(CACHE_CLAVE, resultado);

        if (activo) {
          setConteos(resultado);
        }
      } catch {
        if (activo) {
          setConteos(null);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    obtenerDatos();

    return () => { activo = false; };
  }, []);

  if (cargando) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!conteos) {
    return (
      <div className="text-center py-24 text-zinc-500">
        No se pudieron cargar los datos.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">
          Panel de datos gubernamental
        </h1>
        <p className="text-zinc-600 max-w-2xl mx-auto">
          Estadisticas agregadas de todos los reportes ciudadanos para consulta de entes
          gubernamentales y empresas. Datos actualizados en tiempo real.
        </p>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold text-zinc-900">{conteos.total}</p>
          <p className="text-xs text-zinc-500 mt-1">Total reportes</p>
        </div>
        {TIPOS_REPORTE.map((t) => (
          <div key={t.id} className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-zinc-900">{conteos.porTipo[t.id] || 0}</p>
            <p className="text-xs text-zinc-500 mt-1">{ETIQUETAS_TIPO[t.id] || t.id}</p>
          </div>
        ))}
      </div>

      <section className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">Por estado</h2>
        <div className="space-y-3">
          {Object.entries(conteos.porEstado).length > 0 ? (
            Object.entries(conteos.porEstado).map(([clave, valor]) => (
              <BarraDatos key={clave} etiqueta={clave} valor={valor} total={conteos.total} />
            ))
          ) : (
            <p className="text-sm text-zinc-500">Sin datos</p>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900">Distribucion por genero</h2>
          <div className="space-y-3">
            {Object.entries(conteos.porGenero).length > 0 ? (
              Object.entries(conteos.porGenero).map(([clave, valor]) => (
                <BarraDatos key={clave} etiqueta={clave} valor={valor} total={conteos.total} />
              ))
            ) : (
              <p className="text-sm text-zinc-500">Sin datos</p>
            )}
          </div>
        </section>

        <section className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900">Rangos de edad</h2>
          <div className="space-y-3">
            {Object.entries(conteos.rangosEdad).length > 0 ? (
              Object.entries(conteos.rangosEdad).map(([clave, valor]) => (
                <BarraDatos key={clave} etiqueta={clave} valor={valor} total={conteos.total} />
              ))
            ) : (
              <p className="text-sm text-zinc-500">Sin datos</p>
            )}
          </div>
        </section>
      </div>

      <section className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">Nivel de riesgo (infraestructura)</h2>
        <div className="space-y-3">
          {Object.entries(conteos.porRiesgo).length > 0 ? (
            Object.entries(conteos.porRiesgo).map(([clave, valor]) => (
              <BarraDatos key={clave} etiqueta={clave} valor={valor} total={conteos.total} />
            ))
          ) : (
            <p className="text-sm text-zinc-500">Sin datos</p>
          )}
        </div>
      </section>

      <div className="text-center">
        <a
          href="/reportes/exportar"
          className="inline-flex items-center gap-2 bg-zinc-900 text-white font-medium px-6 py-3 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar todos los reportes
        </a>
      </div>
    </div>
  );
}
