import Link from "next/link";
import ListaReportes from "@/componentes/ListaReportes";

export default function PaginaInicio() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900">
          Reportate Venezuela
        </h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          Plataforma ciudadana para reportar infraestructuras deterioradas, edificios en riesgo de
          colapso y otras situaciones que requieren atencion en todo el territorio nacional.
          Tu reporte puede hacer la diferencia.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-2">
          <Link
            href="/reportar"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 text-white font-medium px-6 py-3 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
          >
            Hacer un reporte
          </Link>
          <Link
            href="/reportes"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-zinc-300 text-zinc-700 font-medium px-6 py-3 rounded-lg hover:border-zinc-400 hover:text-zinc-900 transition-colors text-sm"
          >
            Ver historial
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/reportes"
          className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-400 hover:shadow-sm transition-all space-y-2"
        >
          <h3 className="text-base font-semibold text-zinc-900">Historial de reportes</h3>
          <p className="text-sm text-zinc-600">
            Explora todos los reportes registrados, filtrados por categoria y con paginacion.
          </p>
        </Link>
        <Link
          href="/datos"
          className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-400 hover:shadow-sm transition-all space-y-2"
        >
          <h3 className="text-base font-semibold text-zinc-900">Centro de datos censales</h3>
          <p className="text-sm text-zinc-600">
            Estadisticas agregadas y datos estructurados para consulta de autoridades y organismos competentes.
          </p>
        </Link>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-2xl font-semibold text-zinc-900">Reportes recientes</h2>
          <Link
            href="/reportes"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Ver todos
          </Link>
        </div>
        <ListaReportes limite={6} />
      </section>
    </div>
  );
}
