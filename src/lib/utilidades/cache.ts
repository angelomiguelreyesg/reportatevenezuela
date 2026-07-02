const TIEMPO_CACHE = 5 * 60 * 1000;

export function obtenerCache<T>(clave: string): T | null {
  try {
    const raw = sessionStorage.getItem(clave);
    if (!raw) return null;
    const { datos, tiempo } = JSON.parse(raw);
    if (Date.now() - tiempo > TIEMPO_CACHE) {
      sessionStorage.removeItem(clave);
      return null;
    }
    return datos as T;
  } catch {
    return null;
  }
}

export function guardarCache<T>(clave: string, datos: T): void {
  try {
    sessionStorage.setItem(clave, JSON.stringify({ datos, tiempo: Date.now() }));
  } catch {
  }
}
