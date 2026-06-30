export function sanitizarTexto(texto: string): string {
  return texto
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function sanitizarTelefono(telefono: string): string {
  return telefono.replace(/[^0-9+\-() ]/g, "").trim();
}

export function validarTelefono(telefono: string): boolean {
  const limpio = telefono.replace(/[\s\-()]/g, "");
  return limpio.length >= 7 && limpio.length <= 15 && /^\+?\d+$/.test(limpio);
}

export function validarCoordenadas(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function truncarTexto(texto: string, max: number): string {
  if (texto.length <= max) return texto;
  return texto.slice(0, max).trimEnd() + "...";
}

export function sanitizarArrayFotos(urls: string[]): string[] {
  return urls.filter((url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:";
    } catch {
      return false;
    }
  });
}
