export const TIPOS_REPORTE = [
  {
    id: "infraestructura",
    titulo: "Infraestructura Deteriorada",
    descripcion: "Reporta edificios, vias publicas o estructuras en riesgo de colapso que representen un peligro.",
  },
  {
    id: "desaparecido",
    titulo: "Persona Desaparecida",
    descripcion: "Reporta la desaparicion de una persona. Proporciona todos los detalles posibles para ayudar en su busqueda.",
  },
  {
    id: "incidencia",
    titulo: "Incidencia General",
    descripcion: "Reporta cualquier situacion irregular, abuso, o evento que requiera atencion de las autoridades.",
  },
] as const;

export type TipoReporte = (typeof TIPOS_REPORTE)[number]["id"];

export const ETIQUETAS_TIPO: Record<string, string> = {
  desaparecido: "Persona Desaparecida",
  incidencia: "Incidencia General",
  infraestructura: "Infraestructura Deteriorada",
};

export const COLORES_TIPO: Record<string, string> = {
  desaparecido: "bg-red-100 text-red-800 border-red-200",
  incidencia: "bg-amber-100 text-amber-800 border-amber-200",
  infraestructura: "bg-orange-100 text-orange-800 border-orange-200",
};

export const COLORES_ESTADO: Record<string, string> = {
  pendiente: "bg-zinc-100 text-zinc-600",
  revisado: "bg-blue-100 text-blue-800",
  resuelto: "bg-green-100 text-green-800",
};

export const NIVELES_RIESGO = [
  { id: "bajo", etiqueta: "Bajo" },
  { id: "medio", etiqueta: "Medio" },
  { id: "alto", etiqueta: "Alto" },
  { id: "critico", etiqueta: "Critico" },
] as const;

export const OPCIONES_GENERO = [
  { id: "femenino", etiqueta: "Femenino" },
  { id: "masculino", etiqueta: "Masculino" },
  { id: "otro", etiqueta: "Otro" },
  { id: "no_especifica", etiqueta: "No especifica" },
] as const;

export const LIMITE_FOTOS = 5;

export const TAMANIO_MAXIMO_FOTO = 5 * 1024 * 1024;
