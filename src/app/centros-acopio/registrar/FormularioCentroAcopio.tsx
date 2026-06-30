"use client";

import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase/cliente";
import { sanitizarTexto, sanitizarTelefono } from "@/lib/utilidades/sanitizacion";

interface DatosFormulario {
  nombre: string;
  direccion: string;
  latitud: string;
  longitud: string;
  telefonos: string;
  horario: string;
  descripcion: string;
}

export default function FormularioCentroAcopio() {
  const [datos, setDatos] = useState<DatosFormulario>({
    nombre: "",
    direccion: "",
    latitud: "",
    longitud: "",
    telefonos: "",
    horario: "",
    descripcion: "",
  });

  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  function actualizarCampo(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  }

  async function enviarFormulario(e: FormEvent) {
    e.preventDefault();
    setError("");
    setExito("");
    setSubiendo(true);

    try {
      const nombreLimpio = sanitizarTexto(datos.nombre.trim());
      const direccionLimpia = sanitizarTexto(datos.direccion.trim());

      if (!nombreLimpio) throw new Error("El nombre del centro es obligatorio.");
      if (!direccionLimpia) throw new Error("La direccion es obligatoria.");

      let lat: number | null = null;
      let lng: number | null = null;
      if (datos.latitud && datos.longitud) {
        lat = parseFloat(datos.latitud);
        lng = parseFloat(datos.longitud);
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          throw new Error("Coordenadas geograficas invalidas.");
        }
      }

      const listaTelefonos = datos.telefonos
        .split(",")
        .map((t) => sanitizarTelefono(t))
        .filter((t) => t.length > 0);

      const { error: errorInsercion } = await supabase.from("centros_acopio").insert({
        nombre: nombreLimpio,
        direccion: direccionLimpia,
        latitud: lat,
        longitud: lng,
        telefonos: listaTelefonos,
        horario: sanitizarTexto(datos.horario.trim()),
        descripcion: sanitizarTexto(datos.descripcion.trim()),
      });

      if (errorInsercion) throw new Error("Error al guardar el centro de acopio.");

      setExito("Centro de acopio registrado correctamente.");
      setDatos({
        nombre: "",
        direccion: "",
        latitud: "",
        longitud: "",
        telefonos: "",
        horario: "",
        descripcion: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <form onSubmit={enviarFormulario} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700">
          Nombre del centro
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={datos.nombre}
          onChange={actualizarCampo}
          maxLength={200}
          className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="direccion" className="block text-sm font-medium text-zinc-700">
          Direccion exacta
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={datos.direccion}
          onChange={actualizarCampo}
          maxLength={300}
          className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="latitud" className="block text-sm font-medium text-zinc-700">
            Latitud (opcional)
          </label>
          <input
            type="number"
            id="latitud"
            name="latitud"
            value={datos.latitud}
            onChange={actualizarCampo}
            step="any"
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="longitud" className="block text-sm font-medium text-zinc-700">
            Longitud (opcional)
          </label>
          <input
            type="number"
            id="longitud"
            name="longitud"
            value={datos.longitud}
            onChange={actualizarCampo}
            step="any"
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="telefonos" className="block text-sm font-medium text-zinc-700">
          Numeros de contacto (separados por coma)
        </label>
        <input
          type="text"
          id="telefonos"
          name="telefonos"
          value={datos.telefonos}
          onChange={actualizarCampo}
          placeholder="+58 412 123 4567, +58 212 765 4321"
          className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="horario" className="block text-sm font-medium text-zinc-700">
          Horario de atencion (opcional)
        </label>
        <input
          type="text"
          id="horario"
          name="horario"
          value={datos.horario}
          onChange={actualizarCampo}
          placeholder="Lunes a viernes 8:00 am - 5:00 pm"
          maxLength={200}
          className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="descripcion" className="block text-sm font-medium text-zinc-700">
          Descripcion adicional (opcional)
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={datos.descripcion}
          onChange={actualizarCampo}
          rows={4}
          maxLength={1000}
          className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-y"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {exito && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
          {exito}
        </div>
      )}

      <button
        type="submit"
        disabled={subiendo}
        className="w-full bg-zinc-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {subiendo ? "Registrando centro..." : "Registrar centro de acopio"}
      </button>
    </form>
  );
}
