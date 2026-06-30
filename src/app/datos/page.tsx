import type { Metadata } from "next";
import PanelDatos from "./PanelDatos";

export const metadata: Metadata = {
  title: "Datos y estadisticas - Reportate Venezuela",
  description: "Estadisticas agregadas de reportes ciudadanos. Informacion estructurada para el analisis y toma de decisiones.",
};

export default function PaginaDatos() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <section className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">Datos y estadisticas</h1>
        <p className="text-zinc-600 max-w-2xl mx-auto">
          Este modulo consolida la informacion reportada por la comunidad como un centro de datos censales.
          Las autoridades y organismos competentes pueden utilizar esta informacion para la toma de decisiones
          y la asignacion de recursos.
        </p>
      </section>
      <PanelDatos />
    </div>
  );
}
