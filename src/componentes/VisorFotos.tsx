"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  fotos: string[];
  titulo: string;
}

export default function VisorFotos({ fotos, titulo }: Props) {
  const [fotoAmpliada, setFotoAmpliada] = useState<string | null>(null);

  if (fotos.length === 0) return null;

  return (
    <>
      <div
        className="relative h-64 sm:h-96 bg-zinc-100 cursor-pointer"
        onClick={() => setFotoAmpliada(fotos[0])}
      >
        <Image
          src={fotos[0]}
          alt={titulo}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 800px"
        />
        {fotos.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
            1 / {fotos.length}
          </span>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="border-t border-zinc-200 pt-4">
          <h3 className="text-sm font-medium text-zinc-900 mb-3">Fotos adicionales</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fotos.slice(1).map((foto, i) => (
              <div
                key={i}
                className="relative h-32 bg-zinc-100 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setFotoAmpliada(foto)}
              >
                <Image
                  src={foto}
                  alt={`Foto ${i + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 200px"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {fotoAmpliada && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setFotoAmpliada(null)}
        >
          <button
            onClick={() => setFotoAmpliada(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
            aria-label="Cerrar"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-5xl h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={fotoAmpliada}
              alt="Foto ampliada"
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
