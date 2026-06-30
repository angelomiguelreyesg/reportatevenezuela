"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/cliente";
import TarjetaReporte from "@/componentes/TarjetaReporte";
import { TIPOS_REPORTE, ETIQUETAS_TIPO } from "@/lib/constantes";

interface Reporte {
  id: string;
  tipo_reporte: string;
  titulo: string;
  descripcion: string;
  direccion: string;
  fotos: string[];
  creado_en: string;
  estado: string;
}

export default function ExplorarReportes() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<string | null>(null);
  const [pagina, setPagina] = useState(0);
  const [hayMas, setHayMas] = useState(true);
  const POR_PAGINA = 12;

  const cargarReportes = useCallback(async (offset: number, reiniciar: boolean = false) => {
    setCargando(true);
    let consulta = supabase
      .from("reportes")
      .select("*")
      .order("creado_en", { ascending: false })
      .range(offset, offset + POR_PAGINA - 1);

    if (filtro) {
      consulta = consulta.eq("tipo_reporte", filtro);
    }

    const { data, error } = await consulta;

    if (!error && data) {
      setReportes((prev) => (reiniciar ? (data as Reporte[]) : [...prev, ...(data as Reporte[])]));
      setHayMas(data.length === POR_PAGINA);
    }
    setCargando(false);
  }, [filtro]);

  useEffect(() => {
    let activo = true;

    async function inicializar() {
      let consulta = supabase
        .from("reportes")
        .select("*")
        .order("creado_en", { ascending: false })
        .range(0, POR_PAGINA - 1);

      if (filtro) {
        consulta = consulta.eq("tipo_reporte", filtro);
      }

      const { data, error } = await consulta;

      if (activo) {
        if (!error && data) {
          setReportes(data as Reporte[]);
          setHayMas(data.length === POR_PAGINA);
        }
        setCargando(false);
      }
    }

    inicializar();

    return () => {
      activo = false;
    };
  }, [filtro]);

  function cargarMas() {
    const nuevaPagina = pagina + 1;
    setPagina(nuevaPagina);
    cargarReportes(nuevaPagina * POR_PAGINA);
  }

  const OPCIONES_FILTRO = [
    { id: null, etiqueta: "Todos" },
    ...TIPOS_REPORTE.map((t) => ({ id: t.id, etiqueta: t.titulo })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {OPCIONES_FILTRO.map((opcion) => (
          <button
            key={opcion.id || "todos"}
            onClick={() => setFiltro(opcion.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === opcion.id
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {opcion.etiqueta}
          </button>
        ))}
      </div>

      {cargando && reportes.length === 0 ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
        </div>
      ) : reportes.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-lg">
          <p className="text-zinc-500">
            {filtro
              ? `No hay reportes de ${ETIQUETAS_TIPO[filtro] || filtro} aun.`
              : "No hay reportes registrados aun."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportes.map((reporte) => (
              <TarjetaReporte key={reporte.id} reporte={reporte} />
            ))}
          </div>

          {hayMas && (
            <div className="flex justify-center pt-4">
              <button
                onClick={cargarMas}
                disabled={cargando}
                className="px-6 py-2.5 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {cargando ? "Cargando..." : "Cargar mas reportes"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
