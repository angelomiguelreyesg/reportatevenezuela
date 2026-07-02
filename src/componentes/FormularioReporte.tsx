"use client";

import { useState, useRef, FormEvent } from "react";
import { supabase } from "@/lib/supabase/cliente";
import {
  sanitizarTexto,
  sanitizarTelefono,
  validarTelefono,
} from "@/lib/utilidades/sanitizacion";
import {
  TIPOS_REPORTE,
  LIMITE_FOTOS,
  TAMANIO_MAXIMO_FOTO,
  NIVELES_RIESGO,
  OPCIONES_GENERO,
} from "@/lib/constantes";
import type { TipoReporte } from "@/lib/constantes";

interface Props {
  tipoPorDefecto?: TipoReporte;
}

interface DatosFormulario {
  tipo: TipoReporte | "";
  titulo: string;
  nombreDesaparecido: string;
  apellidoDesaparecido: string;
  generoDesaparecido: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  nombre: string;
  cedula: string;
  edad: string;
  genero: string;
  fechaEvento: string;
  nivelRiesgo: string;
  datosAdicionales: string;
}

export default function FormularioReporte({ tipoPorDefecto }: Props) {
  const [datos, setDatos] = useState<DatosFormulario>({
    tipo: tipoPorDefecto || "infraestructura",
    titulo: "",
    nombreDesaparecido: "",
    apellidoDesaparecido: "",
    generoDesaparecido: "",
    descripcion: "",
    direccion: "",
    telefono: "",
    nombre: "",
    cedula: "",
    edad: "",
    genero: "",
    fechaEvento: "",
    nivelRiesgo: "",
    datosAdicionales: "",
  });

  const [archivos, setArchivos] = useState<File[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const refInputArchivo = useRef<HTMLInputElement>(null);

  function actualizarCampo(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  }

  function manejarArchivos(e: React.ChangeEvent<HTMLInputElement>) {
    const seleccionados = Array.from(e.target.files || []);
    const validos = seleccionados.filter((f) => f.size <= TAMANIO_MAXIMO_FOTO);
    const sobrantes = seleccionados.length - validos.length;

    if (validos.length > LIMITE_FOTOS) {
      setError(`Maximo ${LIMITE_FOTOS} fotos permitidas.`);
      return;
    }

    setArchivos((prev) => [...prev, ...validos].slice(0, LIMITE_FOTOS));

    if (sobrantes > 0) {
      setError(`Se omitieron ${sobrantes} archivo(s) por exceder el tamano maximo de 5MB.`);
    } else {
      setError("");
    }
  }

  function eliminarArchivo(indice: number) {
    setArchivos((prev) => prev.filter((_, i) => i !== indice));
  }

  async function enviarFormulario(e: FormEvent) {
    e.preventDefault();
    setError("");
    setExito("");
    setSubiendo(true);

    try {
      if (!datos.tipo) throw new Error("Selecciona un tipo de reporte.");

      let tituloFinal: string;
      if (datos.tipo === "desaparecido") {
        const nombre = sanitizarTexto(datos.nombreDesaparecido).trim();
        const apellido = sanitizarTexto(datos.apellidoDesaparecido).trim();
        if (!nombre) throw new Error("El nombre de la persona desaparecida es obligatorio.");
        if (!apellido) throw new Error("El apellido de la persona desaparecida es obligatorio.");
        if (!datos.generoDesaparecido) throw new Error("Selecciona el genero de la persona desaparecida.");
        tituloFinal = `${nombre} ${apellido}`;
      } else {
        if (!sanitizarTexto(datos.titulo).trim()) throw new Error("El titulo es obligatorio.");
        tituloFinal = sanitizarTexto(datos.titulo.trim());
      }

      if (!sanitizarTexto(datos.descripcion).trim()) throw new Error("La descripcion es obligatoria.");
      if (!sanitizarTexto(datos.direccion).trim()) throw new Error("La direccion es obligatoria.");

      const telefonoLimpio = sanitizarTelefono(datos.telefono);
      if (!validarTelefono(telefonoLimpio)) {
        throw new Error("Ingresa un numero telefonico valido (7-15 digitos).");
      }

      const urlsFotos: string[] = [];
      for (const archivo of archivos) {
        const extension = archivo.name.split(".").pop()?.toLowerCase();
        const nombreUnico = `${Date.now()}_${Math.random().toString(36).slice(2)}.${extension}`;
        const rutaArchivo = `publicos/${nombreUnico}`;

        const { error: errorSubida } = await supabase.storage
          .from("fotos-reportes")
          .upload(rutaArchivo, archivo, { cacheControl: "3600", upsert: false });

        if (errorSubida) throw new Error("Error al subir foto: " + errorSubida.message);

        const { data: urlPublica } = supabase.storage
          .from("fotos-reportes")
          .getPublicUrl(rutaArchivo);

        urlsFotos.push(urlPublica.publicUrl);
      }

      const edadNum = datos.edad ? parseInt(datos.edad, 10) : null;

      const { error: errorInsercion } = await supabase.from("reportes").insert({
        tipo_reporte: datos.tipo,
        titulo: tituloFinal,
        descripcion: sanitizarTexto(datos.descripcion.trim()),
        direccion: sanitizarTexto(datos.direccion.trim()),
        fotos: urlsFotos,
        telefono_contacto: telefonoLimpio,
        nombre_reportante: sanitizarTexto(datos.nombre.trim()),
      });

      if (errorInsercion) throw new Error("Error al guardar el reporte: " + errorInsercion.message);

      setExito("Reporte enviado correctamente. Gracias por contribuir.");
      setDatos({
        tipo: "",
        titulo: "",
        nombreDesaparecido: "",
        apellidoDesaparecido: "",
        generoDesaparecido: "",
        descripcion: "",
        direccion: "",
        telefono: "",
        nombre: "",
        cedula: "",
        edad: "",
        genero: "",
        fechaEvento: "",
        nivelRiesgo: "",
        datosAdicionales: "",
      });
      setArchivos([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setSubiendo(false);
    }
  }

  const mostrarDesaparecido = datos.tipo === "desaparecido";
  const mostrarRiesgo = datos.tipo === "infraestructura";
  const mostrarGeneroEdad = mostrarDesaparecido || datos.tipo === "incidencia";

  return (
    <form onSubmit={enviarFormulario} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <label htmlFor="tipo" className="block text-sm font-medium text-zinc-700">
          Tipo de reporte *
        </label>
        <select
          id="tipo"
          name="tipo"
          value={datos.tipo}
          onChange={actualizarCampo}
          className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          required
        >
          <option value="">Selecciona un tipo</option>
          {TIPOS_REPORTE.map((t) => (
            <option key={t.id} value={t.id}>
              {t.titulo}
            </option>
          ))}
        </select>
      </div>

      {mostrarDesaparecido ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="nombreDesaparecido" className="block text-sm font-medium text-zinc-700">
                Nombre *
              </label>
              <input
                type="text"
                id="nombreDesaparecido"
                name="nombreDesaparecido"
                value={datos.nombreDesaparecido}
                onChange={actualizarCampo}
                maxLength={100}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="apellidoDesaparecido" className="block text-sm font-medium text-zinc-700">
                Apellido *
              </label>
              <input
                type="text"
                id="apellidoDesaparecido"
                name="apellidoDesaparecido"
                value={datos.apellidoDesaparecido}
                onChange={actualizarCampo}
                maxLength={100}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Genero *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                <input
                  type="radio"
                  name="generoDesaparecido"
                  value="masculino"
                  checked={datos.generoDesaparecido === "masculino"}
                  onChange={actualizarCampo}
                  className="accent-zinc-900"
                />
                Masculino
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                <input
                  type="radio"
                  name="generoDesaparecido"
                  value="femenino"
                  checked={datos.generoDesaparecido === "femenino"}
                  onChange={actualizarCampo}
                  className="accent-zinc-900"
                />
                Femenino
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor="titulo" className="block text-sm font-medium text-zinc-700">
            Titulo del reporte *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={datos.titulo}
            onChange={actualizarCampo}
            maxLength={200}
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            required
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="cedula" className="block text-sm font-medium text-zinc-700">
            Cedula de identidad (opcional)
          </label>
          <input
            type="text"
            id="cedula"
            name="cedula"
            value={datos.cedula}
            onChange={actualizarCampo}
            maxLength={20}
            placeholder="V-12345678"
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="fechaEvento" className="block text-sm font-medium text-zinc-700">
            Fecha del evento (opcional)
          </label>
          <input
            type="date"
            id="fechaEvento"
            name="fechaEvento"
            value={datos.fechaEvento}
            onChange={actualizarCampo}
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          />
        </div>
      </div>

      {mostrarGeneroEdad && !mostrarDesaparecido && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="edad" className="block text-sm font-medium text-zinc-700">
              Edad (opcional)
            </label>
            <input
              type="number"
              id="edad"
              name="edad"
              value={datos.edad}
              onChange={actualizarCampo}
              min={0}
              max={130}
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="genero" className="block text-sm font-medium text-zinc-700">
              Genero (opcional)
            </label>
            <select
              id="genero"
              name="genero"
              value={datos.genero}
              onChange={actualizarCampo}
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            >
              <option value="">Selecciona</option>
              {OPCIONES_GENERO.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.etiqueta}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {mostrarDesaparecido && (
        <div className="space-y-2">
          <label htmlFor="edad" className="block text-sm font-medium text-zinc-700">
            Edad (opcional)
          </label>
          <input
            type="number"
            id="edad"
            name="edad"
            value={datos.edad}
            onChange={actualizarCampo}
            min={0}
            max={130}
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          />
        </div>
      )}

      {mostrarRiesgo && (
        <div className="space-y-2">
          <label htmlFor="nivelRiesgo" className="block text-sm font-medium text-zinc-700">
            Nivel de riesgo (opcional)
          </label>
          <select
            id="nivelRiesgo"
            name="nivelRiesgo"
            value={datos.nivelRiesgo}
            onChange={actualizarCampo}
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          >
            <option value="">Selecciona nivel de riesgo</option>
            {NIVELES_RIESGO.map((n) => (
              <option key={n.id} value={n.id}>
                {n.etiqueta}
              </option>
            ))}
          </select>
        </div>
      )}

      {datos.tipo !== "infraestructura" && (
        <div className="space-y-2">
          <label htmlFor="datosAdicionales" className="block text-sm font-medium text-zinc-700">
            Datos adicionales (opcional)
          </label>
          <textarea
            id="datosAdicionales"
            name="datosAdicionales"
            value={datos.datosAdicionales}
            onChange={actualizarCampo}
            rows={3}
            maxLength={500}
            placeholder="Cualquier otra informacion relevante para el reporte"
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-y"
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="descripcion" className="block text-sm font-medium text-zinc-700">
          Descripcion detallada *
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={datos.descripcion}
          onChange={actualizarCampo}
          rows={5}
          maxLength={2000}
          className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-y"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="direccion" className="block text-sm font-medium text-zinc-700">
          Ubicacion (direccion o referencia) *
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

      <div className="border-t border-zinc-200 pt-6">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">
          Informacion de contacto
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="telefono" className="block text-sm font-medium text-zinc-700">
              Telefono de contacto *
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={datos.telefono}
              onChange={actualizarCampo}
              placeholder="+58 412 123 4567"
              maxLength={15}
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700">
              Tu nombre (opcional)
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={datos.nombre}
              onChange={actualizarCampo}
              maxLength={100}
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700">
            Fotos (maximo {LIMITE_FOTOS}, hasta 5MB cada una)
          </label>
          <input
            type="file"
            ref={refInputArchivo}
            onChange={manejarArchivos}
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => refInputArchivo.current?.click()}
            className="w-full border-2 border-dashed border-zinc-300 rounded-lg px-4 py-6 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            Haz clic para seleccionar fotos
          </button>
          {archivos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {archivos.map((archivo, i) => (
                <div key={i} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(archivo)}
                    alt={`Foto ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-zinc-200"
                  />
                  <button
                    type="button"
                    onClick={() => eliminarArchivo(i)}
                    className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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
        {subiendo ? "Enviando reporte..." : "Enviar reporte"}
      </button>
    </form>
  );
}
