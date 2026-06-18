# GymTracker

Visualizador web personal de pesajes Tanita. Sin servidor, sin base de datos: tú gestionas el CSV, la app se encarga de los gráficos y las estadísticas.

## Características

- **Importación directa** del CSV exportado por la app Tanita.
- **File System Access API**: la app recuerda la carpeta y carga el CSV más reciente automáticamente (Chrome / Edge / Brave / Opera).
- **Fallback a file picker** en Firefox / Safari / móvil.
- **Dashboard** con KPIs (peso actual, Δ desde inicio, Δ 7d, IMC, grasa, masa muscular) — cada uno con **sparkline**.
- **Gráficos** de cada métrica con **ApexCharts**: línea + área degradada, marcadores de max/min, línea de promedio, zoom, brush (selección arrastrando), tooltips ricos.
- **Tooltip rico**: al pasar sobre cualquier chart se muestran **todas las métricas del mismo día** en una mini-tabla.
- **Calendario de consistencia** estilo GitHub: visualiza qué días te pesaste.
- **Selector de rango** (Todo / 1m / 3m / 6m / 1y) y rango custom vía brush.
- **Estadísticas** por métrica (min, max, media, último, Δ, Δ%, slope semanal).
- **Tabla cruda** con ordenación, paginación y export a CSV.
- **Toggle de métricas** visibles (persiste en `localStorage`).
- **Modo claro / oscuro / sistema** sincronizado entre UI, gráficos y sparklines.
- **Bilingüe** ES / EN con switcher.
- **Iconos** Lucide en toda la UI (header, KPIs, botones, tabla, empty states).
- **Empty states** ilustrados, **transiciones suaves** en hover/tema.
- **Multi-dispositivo** colocando la carpeta de CSVs en OneDrive / Google Drive / Dropbox / iCloud.
- **Sin backend**, sin tracking, sin licencias de pago.

## Stack

- **Build**: Vite 6 + Tailwind v4
- **Charts**: [ApexCharts](https://apexcharts.com/) (MIT) — ~167 KB gzipped
- **Iconos**: [Lucide](https://lucide.dev/) (ISC) — tree-shaken, ~1.5 KB gzipped
- **CSV**: PapaParse (MIT)
- **Fechas**: date-fns (MIT)

## Requisitos

- Node.js 18+ (probado con Node 24).
- Navegador compatible con File System Access API para la mejor experiencia (Chrome, Edge, Brave, Opera).
  - En Firefox / Safari / móvil la app funciona, pero tendrás que elegir el CSV manualmente cada vez.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173` y empieza.

## Build de producción

```bash
npm run build
```

Sirve el contenido de `dist/` con cualquier servidor estático:

```bash
npm run serve         # npx serve dist -l 5173
# o bien:
python -m http.server -d dist 5173
```

## Uso

1. **Primera vez**: la app te pide que elijas la carpeta donde guardas los CSV de Tanita.
2. **Cada nueva pesaje**: descarga el CSV de la app Tanita y guárdalo en esa misma carpeta.
3. La app detectará automáticamente el CSV más reciente al abrirla.
4. **Multi-dispositivo**: pon esa carpeta dentro de OneDrive / Drive / Dropbox / iCloud y la app la verá desde cualquier dispositivo.

## Formato del CSV esperado

Cabeceras (orden tolerante, con o sin comillas):

```
Date, "Weight (kg)", BMI, "Body Fat (%)", "Visc Fat", "Muscle Mass (kg)",
"Muscle Quality", "Bone Mass (kg)", "BMR (kcal)", "Metab Age",
"Body Water (%)", "Physique Rating", ...
```

Las celdas vacías (`-` o `""`) se interpretan como `null`.

## Licencia

MIT.
