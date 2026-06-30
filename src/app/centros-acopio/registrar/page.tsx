import type { Metadata } from "next";
import FormularioCentroAcopio from "./FormularioCentroAcopio";

export const metadata: Metadata = {
  title: "Registrar centro de acopio - Reportate Venezuela",
  description: "Registra un nuevo centro de acopio en el mapa nacional de ayuda.",
};

export default function PaginaRegistrarCentro() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-zinc-900">Registrar centro de acopio</h1>
        <p className="text-zinc-600">
          Ingresa los datos del centro de acopio para que la comunidad pueda encontrarlo facilmente.
        </p>
      </section>
      <FormularioCentroAcopio />
    </div>
  );
}
