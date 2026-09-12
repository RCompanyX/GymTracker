# GymTracker

Personal web viewer for **Tanita BC-401** scale measurements. No server or database: drag in the CSV and the app handles the charts and statistics.

## Features

- **Drag and drop** a Tanita BC-401 CSV. Select it each time; no measurement data is stored.
- **BC-401 signature validation** detects CSVs that do not belong to this model.
- **Dashboard** with KPIs (current weight, change since the start, 7-day change, BMI, body fat, and muscle mass), each with a **sparkline**.
- **Charts** for every metric using **ApexCharts**: line and gradient area, min/max markers, average line, zoom, brush selection, and rich tooltips.
- **Rich tooltip**: hovering over any chart displays **all metrics from that day** in a compact table.
- GitHub-style **consistency calendar** showing the days you weighed yourself.
- **Range selector** (All / 1m / 3m / 6m / 1y) and a custom range through brush selection.
- Per-metric **statistics** (min, max, mean, latest, latest weight, change, change percentage, and weekly slope).
- **Raw data table** with sorting, pagination, and CSV export.
- Toggle for visible **metrics** (persisted in `localStorage`).
- **Light, dark, and system** themes synchronized across the UI, charts, and sparklines.
- **Bilingual** Spanish / English UI with a language switcher.
- **Lucide icons** throughout the UI.
- **No backend**, tracking, or paid licenses. Measurement data is never persisted; drag in your CSV each time you visit.

## Stack

- **Build**: Vite 6 + Tailwind v4
- **Charts**: [ApexCharts](https://apexcharts.com/) (MIT), ~167 KB gzipped
- **Icons**: [Lucide](https://lucide.dev/) (ISC), tree-shaken, ~1.5 KB gzipped
- **CSV parsing**: PapaParse (MIT)
- **Dates**: date-fns (MIT)

## Requirements

- Node.js 18+ (tested with Node 24).
- A modern browser (Chrome, Edge, Firefox, Safari, Brave, or Opera).

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open `http://localhost:5173` to get started.

## Production Build

```bash
npm run build
```

Serve the contents of `dist/` with any static server:

```bash
npm run serve         # npx serve dist -l 5173
# or:
python -m http.server -d dist 5173
```

## Usage

1. Open the app in your browser.
2. Drag in the CSV exported by Tanita, or use the "Open CSV" button in the header.
3. The app parses and validates it, then shows the dashboard with KPIs, charts, calendar, and tables.
4. Drag in the CSV again each time you visit; measurements are **not persisted**.

## Expected CSV Format

Headers, in any order and with or without quotes:

```
Date, "Weight (kg)", BMI, "Body Fat (%)", "Visc Fat", "Muscle Mass (kg)",
"Muscle Quality", "Bone Mass (kg)", "BMR (kcal)", "Metab Age",
"Body Water (%)", "Physique Rating", ...
```

Empty cells (`-` or `""`) are interpreted as `null`.

## License

MIT.
