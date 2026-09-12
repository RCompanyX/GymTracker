# GymTracker

Personal web viewer for **Tanita BC-401** scale measurements. No server or database: drag in the CSV and the app handles the charts and statistics.

## Features

- **Drag and drop** a Tanita BC-401 CSV. Select it each time; no measurement data is stored.
- **BC-401 signature validation** detects CSVs that do not belong to this model.
- **Dashboard** with five KPIs (current weight, change since the start, BMI, body fat, and muscle mass), each with a **sparkline**. Current weight includes a 7-day change.
- **Charts** for up to ten dashboard metrics using **ApexCharts**: line and gradient area, min/max markers, average line, zoom, brush selection, and rich tooltips.
- **Rich tooltip**: hovering over a chart displays the available dashboard metrics from that measurement in a compact table.
- GitHub-style **consistency calendar** showing the days you weighed yourself.
- **Range selector** (All / 1m / 3m / 6m / 1y) and a custom range through brush selection.
- Per-metric **statistics** (min, max, mean, latest, latest weight, change, change percentage, and weekly slope).
- **Normalized measurement table** for the ten dashboard metrics, with sorting, pagination, and CSV export.
- Toggle for visible **metrics** (persisted in `localStorage`).
- **Light, dark, and system** themes synchronized across the UI, charts, and sparklines.
- **Bilingual** Spanish / English UI with a language switcher.
- **Lucide icons** throughout the UI.
- Dismissible, locally calculated **progress highlights** for new lows, milestones, recent changes, and frequent weigh-ins.
- **No backend**, tracking, or paid licenses. Measurement data is never persisted; drag in your CSV each time you visit.

## Stack

- **Build**: Vite 6 + Tailwind v4
- **Charts**: [ApexCharts](https://apexcharts.com/) (MIT), ~167 KB gzipped
- **Icons**: [Lucide](https://lucide.dev/) (ISC), tree-shaken, ~1.5 KB gzipped
- **CSV parsing**: PapaParse (MIT)
- **Dates**: date-fns (MIT)

## Requirements

- Node.js 20+ (tested with Node 24).
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

Headers use the canonical Tanita English names, in any order and with or without quotes. `Date` and `Weight (kg)` are required, and the CSV must also contain at least four of these BC-401 signature columns: `BMI`, `Body Fat (%)`, `Muscle Mass (kg)`, `Bone Mass (kg)`, `BMR (kcal)`, `Metab Age`, and `Body Water (%)`.

```
Date, "Weight (kg)", BMI, "Body Fat (%)", "Visc Fat", "Muscle Mass (kg)",
"Muscle Quality", "Bone Mass (kg)", "BMR (kcal)", "Metab Age",
"Body Water (%)", "Physique Rating", ...
```

The importer recognizes the fields above plus segmental muscle mass, muscle quality, segmental body fat, and heart rate when their headers match exactly. Invalid date rows are skipped. Empty cells, `-`, `—`, and `null` are interpreted as `null`.

## Data Handling

Measurement data stays in memory and is discarded when the page is reloaded. The app only stores these preferences in `localStorage`: theme, language, visible metrics, and dismissed progress highlights.

## License

MIT.
