import type { Metadata } from "next";
import ExplorarReportes from "./ExplorarReportes";

export const metadata: Metadata = {
  title: "Historial de reportes - Reportate Venezuela",
  description: "Explora todos los reportes de infraestructuras deterioradas, personas desaparecidas e incidencias generales.",
};

export default function PaginaReportes() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <section className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">Historial de reportes</h1>
        <p className="text-zinc-600 max-w-xl mx-auto">
          Explora los reportes registrados por la comunidad. Filtra por categoria para encontrar la informacion que buscas.
        </p>
      </section>
      <ExplorarReportes />
    </div>
  );
}
