"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(0);
  const [hayMas, setHayMas] = useState(true);
  const POR_PAGINA = 12;
  const refInput = useRef<HTMLInputElement>(null);

  const construirConsulta = useCallback((offset: number) => {
    let consulta = supabase
      .from("reportes")
      .select("*")
      .order("creado_en", { ascending: false })
      .range(offset, offset + POR_PAGINA - 1);

    if (filtro) {
      consulta = consulta.eq("tipo_reporte", filtro);
    }

    if (busqueda.trim()) {
      const termino = `%${busqueda.trim()}%`;
      consulta = consulta.or(
        `titulo.ilike.${termino},nombre_reportante.ilike.${termino},cedula_identidad.ilike.${termino},telefono_contacto.ilike.${termino}`
      );
    }

    return consulta;
  }, [filtro, busqueda]);

  useEffect(() => {
    let activo = true;
    const temporizador = setTimeout(async () => {
      try {
        if (!activo) return;

        const consulta = construirConsulta(0);
        const { data: datos } = await consulta;

        if (activo) {
          setPagina(0);
          setReportes(datos ? (datos as Reporte[]) : []);
          setHayMas(datos ? datos.length === POR_PAGINA : false);
        }
      } catch {
        if (activo) {
          setReportes([]);
          setHayMas(false);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }, 300);

    return () => {
      activo = false;
      clearTimeout(temporizador);
    };
  }, [construirConsulta]);

  async function cargarMas() {
    const nuevaPagina = pagina + 1;
    setPagina(nuevaPagina);
    setCargando(true);

    try {
      const { data: datos } = await construirConsulta(nuevaPagina * POR_PAGINA);
      if (datos) {
        setReportes((prev) => [...prev, ...(datos as Reporte[])]);
        setHayMas(datos.length === POR_PAGINA);
      } else {
        setHayMas(false);
      }
    } catch {
      setHayMas(false);
    } finally {
      setCargando(false);
    }
  }

  const OPCIONES_FILTRO = [
    { id: null, etiqueta: "Todos" },
    ...TIPOS_REPORTE.map((t) => ({ id: t.id, etiqueta: t.titulo })),
  ];

  return (
    <div className="space-y-6">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={refInput}
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, apellido, cedula o telefono..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
        />
        {busqueda && (
          <button
            onClick={() => { setBusqueda(""); refInput.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

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
            {busqueda
              ? "No se encontraron reportes con ese criterio de busqueda."
              : filtro
                ? `No hay reportes de ${ETIQUETAS_TIPO[filtro] || filtro} aun.`
                : "No hay reportes registrados aun."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-zinc-400">
            {busqueda && `${reportes.length} resultado(s) encontrado(s)`}
          </p>
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
