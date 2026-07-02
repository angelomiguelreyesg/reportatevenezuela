"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/cliente";
import { TIPOS_REPORTE, NIVELES_RIESGO } from "@/lib/constantes";
import { obtenerCache, guardarCache } from "@/lib/utilidades/cache";

interface Conteos {
  total: number;
  porTipo: Record<string, number>;
  porEstado: Record<string, number>;
  porRiesgo: Record<string, number>;
  genero: Record<string, number>;
  rangoEdad: Record<string, number>;
}

export default function PanelDatos() {
  const [conteos, setConteos] = useState<Conteos | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    async function obtenerEstadisticas() {
      const CACHE_CLAVE = "panel_datos";
      const cache = obtenerCache<Conteos>(CACHE_CLAVE);
      if (cache) {
        if (activo) {
          setConteos(cache);
          setCargando(false);
          return;
        }
      }

      try {
        const { data: todos } = await supabase.from("reportes").select("*");

        if (!activo) return;

        if (!todos) {
          setCargando(false);
          return;
        }

        const resultado: Conteos = {
          total: todos.length,
          porTipo: {},
          porEstado: {},
          porRiesgo: {},
          genero: {},
          rangoEdad: {},
        };

        for (const r of todos) {
          resultado.porTipo[r.tipo_reporte] = (resultado.porTipo[r.tipo_reporte] || 0) + 1;
          resultado.porEstado[r.estado] = (resultado.porEstado[r.estado] || 0) + 1;

          if (r.nivel_riesgo) {
            resultado.porRiesgo[r.nivel_riesgo] = (resultado.porRiesgo[r.nivel_riesgo] || 0) + 1;
          }
          if (r.genero) {
            resultado.genero[r.genero] = (resultado.genero[r.genero] || 0) + 1;
          }
          if (r.edad) {
            const rango = r.edad < 18 ? "0-17" : r.edad < 30 ? "18-29" : r.edad < 50 ? "30-49" : r.edad < 65 ? "50-64" : "65+";
            resultado.rangoEdad[rango] = (resultado.rangoEdad[rango] || 0) + 1;
          }
        }

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

    obtenerEstadisticas();

    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!conteos || conteos.total === 0) {
    return (
      <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-lg">
        <p className="text-zinc-500">No hay datos disponibles aun. Los reportes de la comunidad alimentaran este panel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-lg p-5 text-center">
          <p className="text-3xl font-bold text-zinc-900">{conteos.total}</p>
          <p className="text-sm text-zinc-500 mt-1">Total reportes</p>
        </div>
        {TIPOS_REPORTE.map((t) => (
          <div key={t.id} className="bg-white border border-zinc-200 rounded-lg p-5 text-center">
            <p className="text-3xl font-bold text-zinc-900">{conteos.porTipo[t.id] || 0}</p>
            <p className="text-sm text-zinc-500 mt-1">{t.titulo}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Por estado</h3>
          <div className="space-y-2">
            {Object.entries(conteos.porEstado).map(([estado, cantidad]) => (
              <BarraDatos key={estado} etiqueta={estado} cantidad={cantidad} total={conteos.total} />
            ))}
          </div>
        </div>

        {conteos.genero && Object.keys(conteos.genero).length > 0 && (
          <div className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Distribucion por genero</h3>
            <div className="space-y-2">
              {Object.entries(conteos.genero).map(([genero, cantidad]) => (
                <BarraDatos key={genero} etiqueta={genero} cantidad={cantidad} total={conteos.total} />
              ))}
            </div>
          </div>
        )}

        {conteos.rangoEdad && Object.keys(conteos.rangoEdad).length > 0 && (
          <div className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Rangos de edad</h3>
            <div className="space-y-2">
              {Object.entries(conteos.rangoEdad).sort(([a], [b]) => a.localeCompare(b)).map(([rango, cantidad]) => (
                <BarraDatos key={rango} etiqueta={rango + " anos"} cantidad={cantidad} total={conteos.total} />
              ))}
            </div>
          </div>
        )}

        {conteos.porRiesgo && Object.keys(conteos.porRiesgo).length > 0 && (
          <div className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Nivel de riesgo (infraestructura)</h3>
            <div className="space-y-2">
              {NIVELES_RIESGO.map((n) => (
                <BarraDatos
                  key={n.id}
                  etiqueta={n.etiqueta}
                  cantidad={conteos.porRiesgo[n.id] || 0}
                  total={conteos.porTipo["infraestructura"] || 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 text-center">
        <p className="text-sm text-zinc-600">
          Esta informacion esta disponible para consulta de autoridades y organismos competentes.
          Los datos agregados permiten identificar tendencias y zonas criticas en el territorio nacional.
        </p>
      </div>
    </div>
  );
}

function BarraDatos({ etiqueta, cantidad, total }: { etiqueta: string; cantidad: number; total: number }) {
  const porcentaje = total > 0 ? Math.round((cantidad / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-700 w-28 shrink-0 capitalize">{etiqueta}</span>
      <div className="flex-1 h-5 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-zinc-900 rounded-full transition-all duration-500"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <span className="text-sm text-zinc-500 w-16 text-right">{cantidad}</span>
      <span className="text-xs text-zinc-400 w-10 text-right">{porcentaje}%</span>
    </div>
  );
}
