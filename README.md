# 🇻🇪 Reportate Venezuela

**Plataforma ciudadana sin fines de lucro** para reportar y visibilizar situaciones que requieren atencion en todo el territorio nacional.

Construida con [Next.js](https://nextjs.org) y [Supabase](https://supabase.com).

---

## Funcionalidades

### 📋 Reportes ciudadanos
- **Infraestructura deteriorada** — Reporta edificios, vias publicas o estructuras en riesgo de colapso.
- **Personas desaparecidas** — Reporta desapariciones con nombre, apellido y genero de la persona.
- **Incidencias generales** — Reporta situaciones irregulares, abusos o eventos que requieran atencion.
- Adjunta hasta 5 fotos por reporte.
- Campos censales opcionales (cedula, edad, fecha del evento, datos adicionales).

### 🔍 Exploracion de reportes
- Busqueda por nombre, apellido, cedula o telefono.
- Filtrado por categoria.
- Paginacion con carga progresiva.
- Vista detallada de cada reporte con toda su informacion.

### 📊 Datos y estadisticas
- Panel publico con estadisticas agregadas.
- Distribucion por tipo de reporte, estado, genero, edad y nivel de riesgo.
- Visualizacion con barras de progreso.

### 🏛️ Panel gubernamental
- Seccion separada para entes gubernamentales y empresas.
- Estadisticas consolidadas en tiempo real.
- Exportacion de todos los reportes a CSV compatible con Excel.

### 📦 Exportacion de datos
- Descarga completa de la base de reportes en formato CSV.
- Compatible con Excel (separador `;`, UTF-8 con BOM).
- Todos los campos incluidos: ID, tipo, titulo, descripcion, direccion, telefono, estado, edad, genero, nivel de riesgo, fecha del evento.

### 📍 Centros de acopio
- Registro y consulta de centros de acopio.
- Informacion de contacto, horarios y ubicacion.

---

## Sin fines de lucro

**Reportate Venezuela** es un proyecto de caracter publico y responsable, creado para facilitar la comunicacion entre la ciudadania y las autoridades. No tiene fines comerciales ni politicos. La informacion proporcionada es de acceso publico y se utiliza unicamente para fines de documentacion y analisis.

---

## Tecnologias

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Base de datos:** Supabase (PostgreSQL)
- **Almacenamiento:** Supabase Storage (fotos)
- **Despliegue:** Vercel

---

## Configuracion local

```bash
# Clonar el repositorio
git clone https://github.com/angelomiguelreyesg/reportatevenezuela.git
cd reportatevenezuela

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Completar las credenciales de Supabase en .env.local
```

Luego iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Variables de entorno

| Variable | Descripcion |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Llave anonima de Supabase |
| `SUPABASE_URL` | URL del proyecto Supabase (servidor) |
| `SUPABASE_SERVICE_ROLE_KEY` | Llave de servicio de Supabase (servidor) |

---

## Licencia

Proyecto de codigo abierto. Uso libre y responsable.
