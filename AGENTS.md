# AGENTS.md — GymTracker

Client-side SPA. No backend, no DB, no test framework wired up. Vite 6 + Tailwind v4 + ApexCharts. Reads Tanita BC-401 CSVs the user drags in; only user preferences persist (in `localStorage`).

## Commands

| Task | Command | Notes |
|------|---------|-------|
| Dev server | `npm run dev` | Vite, port 5173, `open: true` — auto-launches the browser. |
| Production build | `npm run build` | Output: `dist/`, sourcemaps on. |
| Preview build | `npm run preview` | Vite preview server. |
| Serve built `dist/` | `npm run serve` | `npx serve dist -l 5173`. |

There is **no** lint, typecheck, formatter, or test script defined in `package.json`. Do not invent one. The Node scripts under `scripts/` are run directly:

```bash
node scripts/test-csv.mjs <path-to.csv>     # parses & summarises the supplied CSV
node scripts/test-stats.mjs <path-to.csv>   # reports statistics for the supplied CSV
node scripts/test-calendar.mjs              # pure logic test, no file I/O
node scripts/test-tokens.mjs                # prints selected CSS design tokens for inspection
```

## Architecture

Entry: `src/main.js`. State container: `src/lib/state.js` (singleton `state` + `subscribe`/`notify` pub-sub). Re-render is a full DOM rebuild: `disposeAllCharts()` is called on every render to avoid ApexCharts leaks — keep that pattern.

Key modules:
- `src/lib/csv.js` — `parseCsvText` validates the **BC-401 header signature** (≥4 of: BMI, Body Fat (%), Muscle Mass, Bone Mass, BMR, Metab Age, Body Water) and required columns `Date` + `Weight (kg)`. `COLUMN_MAP` lists every field the app understands.
- `src/lib/theme.js` — design tokens are `oklch(...)` CSS vars. ApexCharts can't parse OKLCH, so `toRgb()` uses a hidden Canvas 2D context to convert them to `rgb(...)`. **Requires a browser environment** — won't work under plain Node.
- `src/lib/folder.js` — tiny wrapper around a hidden `<input type="file">` for opening the CSV (`pickCsvFile`).
- `src/lib/charts.js` — ApexCharts wrapper; `INSTANCES` set + `disposeAllCharts()`.
- `src/lib/dom.js` — `el(tag, props, children)` tiny DOM helper. **No framework, no JSX.** Look at neighboring components to see the prop conventions (e.g. `onclick`, `class`, `style` as object, `dataset`).
- `src/lib/prefs.js` — `localStorage` wrapper, key prefix `gymtracker:`.
- `src/i18n/dict.js` — `es` and `en` dictionaries, accessed via `t(key)` from `state.js`.

Directory map:
- `src/lib/` — domain logic and browser utilities; `csv.js`, `stats.js`, and `quickWins.js` are DOM-independent, while chart, theme, and file-picker helpers require a browser
- `src/components/` — UI building blocks
- `src/views/` — page-level compositions
- `src/i18n/` — translation dictionaries

## Styling

Tailwind v4 (CSS-first config). `src/style.css` uses `@import "tailwindcss";` and a `@theme` block that defines custom OKLCH tokens (`--color-surface`, `--color-fg`, `--color-brand`, …). To add a token, edit `@theme` and the `:root[data-theme="dark"]` override. Reference tokens as `var(--color-…)` in components — do not hardcode colors.

ApexCharts DOM is heavily restyled with `!important` selectors in `src/style.css`. Keep that pattern; do not "clean it up".

## Gotchas

- **`scripts/test-stats.mjs` and `scripts/test-csv.mjs` require a CSV path as their first argument.** These are ad-hoc development scripts; pass an explicit local path when running them.
- `vite.config.js` sets `chunkSizeWarningLimit: 1500` and a fixed `manualChunks` split (apexcharts / papaparse / datefns / lucide). Do not remove without expecting chunk-size warnings on `npm run build`.
- `dist/` is gitignored. The repo ships source-only; `npm run build` is required to produce a deployable bundle.
- The package is ESM (`"type": "module"`). All imports must use full specifiers with `.js` extensions, even for `.js` files. There is no bundler resolver relaxation.
- No CI workflows, no pre-commit hooks, no `.opencode/` config in-repo. If you add one, wire it through the existing `package.json` scripts.
