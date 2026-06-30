-- ============================================================
-- ESQUEMA DE BASE DE DATOS - REPORTA VENEZUELA
-- Motor: PostgreSQL (Supabase)
-- ============================================================

-- 1. TABLA: reportes
-- Almacena todos los reportes de personas desaparecidas,
-- incidencias generales e infraestructuras deterioradas,
-- con campos censales para recoleccion de datos estructurados.
CREATE TABLE reportes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_reporte TEXT NOT NULL CHECK (tipo_reporte IN ('desaparecido', 'incidencia', 'infraestructura')),
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  direccion TEXT NOT NULL,
  latitud DOUBLE PRECISION,
  longitud DOUBLE PRECISION,
  fotos TEXT[] DEFAULT '{}',
  telefono_contacto TEXT NOT NULL,
  nombre_reportante TEXT DEFAULT '',
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'revisado', 'resuelto')),
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  -- Campos censales
  cedula_identidad TEXT DEFAULT '',
  edad INTEGER,
  genero TEXT DEFAULT '',
  fecha_evento DATE,
  nivel_riesgo TEXT DEFAULT '',
  datos_adicionales TEXT DEFAULT ''
);

-- Indices para busquedas y analisis
CREATE INDEX idx_reportes_tipo ON reportes(tipo_reporte);
CREATE INDEX idx_reportes_creado ON reportes(creado_en DESC);
CREATE INDEX idx_reportes_edad ON reportes(edad);
CREATE INDEX idx_reportes_genero ON reportes(genero);
CREATE INDEX idx_reportes_fecha_evento ON reportes(fecha_evento);
CREATE INDEX idx_reportes_nivel_riesgo ON reportes(nivel_riesgo);

-- 2. TABLA: centros_acopio
-- Almacena los centros de acopio registrados por la comunidad.
CREATE TABLE centros_acopio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  latitud DOUBLE PRECISION,
  longitud DOUBLE PRECISION,
  telefonos TEXT[] DEFAULT '{}',
  horario TEXT DEFAULT '',
  descripcion TEXT DEFAULT '',
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_centros_acopio_nombre ON centros_acopio(nombre);

-- 3. POLITICAS DE SEGURIDAD (Row Level Security)

ALTER TABLE reportes ENABLE ROW LEVEL SECURITY;
ALTER TABLE centros_acopio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura publica de reportes"
  ON reportes
  FOR SELECT
  USING (true);

CREATE POLICY "Insercion publica de reportes"
  ON reportes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Lectura publica de centros de acopio"
  ON centros_acopio
  FOR SELECT
  USING (true);

CREATE POLICY "Insercion publica de centros de acopio"
  ON centros_acopio
  FOR INSERT
  WITH CHECK (true);

-- 4. BUCKET DE ALMACENAMIENTO para fotos
-- Crear bucket 'fotos-reportes' desde el panel de Supabase Storage
-- Politica: lectura publica, escritura publica (con limite de tamano)

-- NOTA: Ejecutar este bloque desde el SQL Editor de Supabase
-- ============================================================
