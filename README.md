# GymTracker

Visualizador web personal de pesajes de la báscula **Tanita BC-401**. Sin servidor, sin base de datos: tú arrastras el CSV, la app se encarga de los gráficos y las estadísticas.

## Características

- **Drag & drop del CSV** de la Tanita BC-401 — selecciónalo cada vez, no se guarda nada.
- **Validación de firma BC-401**: detecta CSVs que no son de este modelo.
- **Dashboard** con KPIs (peso actual, Δ desde inicio, Δ 7d, IMC, grasa, masa muscular) — cada uno con **sparkline**.
- **Gráficos** de cada métrica con **ApexCharts**: línea + área degradada, marcadores de max/min, línea de promedio, zoom, brush (selección arrastrando), tooltips ricos.
- **Tooltip rico**: al pasar sobre cualquier chart se muestran **todas las métricas del mismo día** en una mini-tabla.
- **Calendario de consistencia** estilo GitHub: visualiza qué días te pesaste.
- **Selector de rango** (Todo / 1m / 3m / 6m / 1y) y rango custom vía brush.
- **Estadísticas** por métrica (min, max, media, último, último peso, Δ, Δ%, slope semanal).
- **Tabla cruda** con ordenación, paginación y export a CSV.
- **Toggle de métricas** visibles (persiste en `localStorage`).
- **Modo claro / oscuro / sistema** sincronizado entre UI, gráficos y sparklines.
- **Bilingüe** ES / EN con switcher.
- **Iconos** Lucide en toda la UI.
- **Sin backend**, sin tracking, sin licencias de pago. Sin persistencia de datos de pesaje — cada vez que entras, arrastras tu CSV.

## Stack

- **Build**: Vite 6 + Tailwind v4
- **Charts**: [ApexCharts](https://apexcharts.com/) (MIT) — ~167 KB gzipped
- **Iconos**: [Lucide](https://lucide.dev/) (ISC) — tree-shaken, ~1.5 KB gzipped
- **CSV**: PapaParse (MIT)
- **Fechas**: date-fns (MIT)

## Requisitos

- Node.js 18+ (probado con Node 24).
- Navegador moderno (Chrome, Edge, Firefox, Safari, Brave, Opera).

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

1. Abre la app en el navegador.
2. Arrastra el CSV exportado de la Tanita (o usa el botón "Abrir CSV" de la cabecera).
3. La app parsea, valida y muestra el dashboard con KPIs, gráficos, calendario y tablas.
4. Cada vez que entres, arrastra de nuevo el CSV — los pesajes **no se persisten**.

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
