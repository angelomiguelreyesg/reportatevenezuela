"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/cliente";
import TarjetaReporte from "./TarjetaReporte";

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

interface Props {
  filtro?: string;
  limite?: number;
}

export default function ListaReportes({ filtro, limite = 12 }: Props) {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    async function obtenerReportes() {
      setCargando(true);
      let consulta = supabase
        .from("reportes")
        .select("*")
        .order("creado_en", { ascending: false })
        .limit(limite);

      if (filtro) {
        consulta = consulta.eq("tipo_reporte", filtro);
      }

      const { data, error } = await consulta;

      if (activo) {
        if (!error && data) {
          setReportes(data as Reporte[]);
        }
        setCargando(false);
      }
    }

    obtenerReportes();

    return () => {
      activo = false;
    };
  }, [filtro, limite]);

  if (cargando) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (reportes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">No hay reportes registrados aun.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reportes.map((reporte) => (
        <TarjetaReporte key={reporte.id} reporte={reporte} />
      ))}
    </div>
  );
}
