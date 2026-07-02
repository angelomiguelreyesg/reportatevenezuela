"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/cliente";

export default function PaginaExportar() {
  const [exportando, setExportando] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  async function exportarCSV() {
    setExportando(true);
    setError("");

    try {
      const { data: reportes, error: err } = await supabase
        .from("reportes")
        .select("*")
        .order("creado_en", { ascending: false });

      if (err) throw new Error(err.message);
      if (!reportes || reportes.length === 0) {
        setError("No hay reportes para exportar.");
        return;
      }

      setTotal(reportes.length);

      const sep = ";";
      const esc = (v: any) => `"${(v ?? "").toString().replace(/"/g, '""').replace(/\n/g, " ").replace(/\r/g, "")}"`;

      const encabezados = [
        "ID", "Tipo", "Titulo", "Descripcion", "Direccion",
        "Telefono", "Reportante", "Estado", "Edad", "Genero",
        "Nivel de riesgo", "Fecha del evento", "Creado en"
      ];

      const filas = reportes.map((r: any) => [
        esc(r.id),
        esc(r.tipo_reporte),
        esc(r.titulo),
        esc(r.descripcion),
        esc(r.direccion),
        esc(r.telefono_contacto),
        esc(r.nombre_reportante),
        esc(r.estado),
        esc(r.edad),
        esc(r.genero),
        esc(r.nivel_riesgo),
        esc(r.fecha_evento ? new Date(r.fecha_evento).toLocaleDateString("es-VE") : ""),
        esc(r.creado_en ? new Date(r.creado_en).toLocaleDateString("es-VE") : ""),
      ]);

      const csv = [
        `sep=${sep}`,
        encabezados.join(sep),
        ...filas.map((f: string[]) => f.join(sep)),
      ].join("\n");
      const bom = "\uFEFF";
      const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reportes_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al exportar.");
    } finally {
      setExportando(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center space-y-4 mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">Exportar reportes</h1>
        <p className="text-zinc-600 max-w-xl mx-auto">
          Descarga todos los reportes registrados en formato CSV para su analisis en hojas de calculo.
        </p>
      </section>

      <div className="max-w-md mx-auto bg-white border border-zinc-200 rounded-lg p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <p className="text-sm text-zinc-600">
          Se exportaran todos los reportes registrados en la plataforma en formato CSV.
        </p>

        <button
          onClick={exportarCSV}
          disabled={exportando}
          className="w-full bg-zinc-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {exportando
            ? "Exportando..."
            : total > 0
              ? `Exportar ${total} reportes`
              : "Exportar reportes"}
        </button>

        {total > 0 && !exportando && (
          <p className="text-xs text-green-600">
            {total} reportes exportados correctamente.
          </p>
        )}

        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
