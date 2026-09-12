import ApexCharts from 'apexcharts';
import { tokens, withAlpha, onThemeChange, currentTheme } from './theme.js';
import { state, t } from './state.js';
import { fmtNumber, fmtDate } from './format.js';

const INSTANCES = new Set();

function baseColors() {
  const t = tokens();
  return {
    series: [t.brand],
    gridColor: withAlpha(t.border, 0.6),
    borderColor: t.border,
    fg: t.fg,
    fgMuted: t.fgMuted,
    bg: t.bg,
    bg2: t.bg2,
    brand: t.brand
  };
}

function buildTooltipHtml(dateIso, m) {
  if (!m) return '';
  const lines = [];
  const fields = [
    { k: 'weight', label: t('metrics.weight'), unit: 'kg' },
    { k: 'bmi', label: t('metrics.bmi'), unit: '' },
    { k: 'bodyFat', label: t('metrics.bodyFat'), unit: '%' },
    { k: 'viscFat', label: t('metrics.viscFat'), unit: '' },
    { k: 'muscleMass', label: t('metrics.muscleMass'), unit: 'kg' },
    { k: 'boneMass', label: t('metrics.boneMass'), unit: 'kg' },
    { k: 'bmr', label: t('metrics.bmr'), unit: 'kcal' },
    { k: 'metabAge', label: t('metrics.metabAge'), unit: t('units.years') },
    { k: 'bodyWater', label: t('metrics.bodyWater'), unit: '%' },
    { k: 'physiqueRating', label: t('metrics.physiqueRating'), unit: '' }
  ];
  for (const f of fields) {
    if (m[f.k] != null) {
      lines.push(`<div class="flex justify-between gap-4"><span class="text-[var(--color-fg-muted)]">${f.label}</span><span class="font-mono">${fmtNumber(m[f.k], f.k === 'boneMass' ? 2 : 1)}${f.unit ? ' ' + f.unit : ''}</span></div>`);
    }
  }
  return `
    <div class="apex-tooltip rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 shadow-lg text-xs">
      <div class="font-semibold mb-1">${fmtDate(dateIso)}</div>
      ${lines.join('')}
    </div>
  `;
}

function buildRichTooltipFn(measurementsByDate) {
  return function({ dataPointIndex, w }) {
    const series = w.config.series[0];
    if (!series || !series.data || !series.data[dataPointIndex]) return '';
    const dateIso = series.data[dataPointIndex].x;
    const m = measurementsByDate.get(dateIso);
    return buildTooltipHtml(dateIso, m);
  };
}

function buildLineOptions({ points, measurements, unit, label, height = 200 }) {
  const c = baseColors();
  const values = points.map(p => p.y);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const maxIdx = values.indexOf(max);
  const minIdx = values.indexOf(min);
  const maxDate = points[maxIdx]?.x;
  const minDate = points[minIdx]?.x;
  const measurementsByDate = new Map(measurements.map(m => [m.date, m]));

  return {
    theme: { mode: currentTheme() },
    chart: {
      type: 'area',
      height,
      fontFamily: 'inherit',
      background: 'transparent',
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      zoom: { enabled: true, type: 'x', autoScaleYaxis: true },
      animations: { enabled: true, speed: 600, dynamicAnimation: { speed: 350 } },
      events: {
        selection: (_chartCtx, { xaxis }) => {
          if (xaxis && xaxis.min != null && xaxis.max != null) {
            document.dispatchEvent(new CustomEvent('gymtracker:brush', {
              detail: { fromTs: xaxis.min, toTs: xaxis.max }
            }));
          }
        }
      }
    },
    colors: c.series,
    stroke: { curve: 'smooth', width: 2.5, lineCap: 'round' },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 100]
      }
    },
    markers: {
      size: 0,
      hover: { size: 6, sizeOffset: 0 },
      strokeWidth: 2,
      strokeColors: c.bg
    },
    grid: {
      borderColor: c.gridColor,
      strokeDashArray: 4,
      padding: { top: 0, right: 12, bottom: 0, left: 8 }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: c.fgMuted, fontSize: '11px' },
        datetimeUTC: false
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: c.fgMuted, fontSize: '11px' },
        formatter: (v) => v == null ? '' : v.toFixed(unit === 'kg' ? 1 : unit === '%' ? 1 : 0)
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    annotations: {
      yaxis: [{
        y: avg,
        borderColor: withAlpha(c.fgMuted, 0.5),
        strokeDashArray: 4,
        label: {
          text: `${t('chart.average')} ${fmtNumber(avg, 1)}${unit ? ' ' + unit : ''}`,
          style: { color: c.fg, background: c.bg2, fontSize: '10px' },
          position: 'left',
          offsetX: 60
        }
      }],
      points: [
        maxDate ? {
          x: maxDate, y: max,
          marker: { size: 5, fillColor: c.brand, strokeColor: c.bg, shape: 'circle' },
          label: { text: `${t('chart.max')} ${fmtNumber(max, 1)}`, style: { background: c.brand, color: '#fff', fontSize: '10px' }, offsetY: -10, position: 'top' }
        } : {},
        minDate ? {
          x: minDate, y: min,
          marker: { size: 5, fillColor: c.fgMuted, strokeColor: c.bg, shape: 'circle' },
          label: { text: `${t('chart.min')} ${fmtNumber(min, 1)}`, style: { background: c.bg2, color: c.fg, fontSize: '10px', borderColor: c.border }, offsetY: 18, position: 'bottom' }
        } : {}
      ].filter(p => p.x)
    },
    series: [{ name: label, data: points.map(p => ({ x: p.x, y: p.y })) }],
    tooltip: {
      theme: 'dark',
      enabled: true,
      shared: false,
      intersect: false,
      x: { show: false },
      y: { show: false },
      custom: buildRichTooltipFn(measurementsByDate),
      style: { fontSize: '12px' },
      marker: { show: false }
    },
    dataLabels: { enabled: false }
  };
}

function buildSparklineOptions({ points, color, height = 60, fill = true }) {
  return {
    theme: { mode: currentTheme() },
    chart: {
      type: 'area',
      height,
      sparkline: { enabled: true },
      background: 'transparent',
      animations: { enabled: true, speed: 400 }
    },
    colors: [color],
    stroke: { curve: 'smooth', width: 2 },
    fill: fill ? {
      type: 'gradient',
      gradient: { opacityFrom: 0.3, opacityTo: 0, stops: [0, 100] }
    } : { type: 'solid', opacity: 0 },
    tooltip: { enabled: false },
    series: [{ data: points.map(p => p.y) }],
    xaxis: { type: 'numeric' }
  };
}

export async function mountLineChart(container, points, opts = {}) {
  container.style.width = '100%';
  container.style.minHeight = opts.height ? `${opts.height}px` : '200px';

  const measurements = opts.measurements || state.measurements;
  const label = opts.label || '';
  const unit = opts.unit || '';
  const options = buildLineOptions({ points, measurements, unit, label, height: opts.height });

  const chart = new ApexCharts(container, options);
  await chart.render();

  let disposed = false;
  const resize = () => { if (!disposed) chart.updateOptions({}, false, true); };
  window.addEventListener('resize', resize);

  const unsub = onThemeChange(() => {
    if (disposed) return;
    try {
      const c = baseColors();
      chart.updateOptions({
        theme: { mode: currentTheme() },
        colors: c.series,
        grid: { borderColor: c.gridColor },
        xaxis: { labels: { style: { colors: c.fgMuted } } },
        yaxis: { labels: { style: { colors: c.fgMuted } } },
        markers: { strokeColors: c.bg },
        annotations: {
          yaxis: [{
            y: chart.w?.globals?.average,
            borderColor: withAlpha(c.fgMuted, 0.5),
            strokeDashArray: 4,
            label: { text: `${t('chart.average')} ${fmtNumber(chart.w?.globals?.average, 1)}`, style: { color: c.fg, background: c.bg2 }, position: 'left', offsetX: 60 }
          }]
        }
      }, false, false, true);
    } catch (e) {
      if (!disposed) console.warn('Chart theme update failed:', e);
    }
  });

  const instance = {
    chart,
    dispose() {
      if (disposed) return;
      disposed = true;
      window.removeEventListener('resize', resize);
      unsub();
      try { chart.destroy(); } catch {}
      INSTANCES.delete(instance);
    }
  };
  INSTANCES.add(instance);
  return instance;
}

export async function mountSparkline(container, points, opts = {}) {
  const c = baseColors();
  const options = buildSparklineOptions({
    points,
    color: opts.color || c.brand,
    height: opts.height || 60,
    fill: opts.fill !== false
  });
  const chart = new ApexCharts(container, options);
  await chart.render();

  let disposed = false;
  const unsub = onThemeChange(() => {
    if (disposed) return;
    try {
      const cc = baseColors();
      chart.updateOptions({
        theme: { mode: currentTheme() },
        colors: [opts.color || cc.brand]
      }, false, false, true);
    } catch {}
  });

  const instance = {
    chart,
    dispose() {
      if (disposed) return;
      disposed = true;
      unsub();
      try { chart.destroy(); } catch {}
      INSTANCES.delete(instance);
    }
  };
  INSTANCES.add(instance);
  return instance;
}

export function disposeAllCharts() {
  for (const inst of [...INSTANCES]) inst.dispose();
}
