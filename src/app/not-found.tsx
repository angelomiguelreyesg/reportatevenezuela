import Link from "next/link";

export default function PaginaNoEncontrada() {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-zinc-200">404</h1>
        <p className="text-xl text-zinc-500">Pagina no encontrada</p>
        <Link
          href="/"
          className="inline-block mt-4 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
