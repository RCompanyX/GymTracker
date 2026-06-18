import { el } from '../lib/dom.js';
import { mountLineChart } from '../lib/charts.js';
import { asPoints, stats } from '../lib/stats.js';
import { fmtNumber, fmtSigned, fmtPercent } from '../lib/format.js';
import { state } from '../lib/state.js';

export function MetricChart({ field, label, unit, measurements }) {
  const container = el('div', {
    class: 'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 transition-colors hover:border-[var(--color-brand)]/40'
  });

  const points = asPoints(measurements, field);
  if (points.length === 0) {
    container.appendChild(el('div', { class: 'text-sm text-[var(--color-fg-muted)]' },
      `${label}: sin datos`));
    return container;
  }

  const s = stats(points.map(p => p.y));

  const header = el('div', { class: 'flex items-baseline justify-between mb-3 gap-2' }, [
    el('div', { class: 'min-w-0' }, [
      el('div', { class: 'text-sm font-medium truncate' }, label),
      el('div', { class: 'text-xs text-[var(--color-fg-muted)]' },
        `min ${fmtNumber(s.min, 1)} · max ${fmtNumber(s.max, 1)} · avg ${fmtNumber(s.avg, 1)}${unit ? ' ' + unit : ''}`)
    ]),
    el('div', { class: 'text-right shrink-0' }, [
      el('div', { class: 'text-lg font-mono' }, fmtNumber(s.last, 1) + (unit ? ' ' + unit : '')),
      s.delta != null ? el('div', {
        class: 'text-xs',
        style: { color: s.delta === 0 ? 'var(--color-fg-muted)' : s.delta > 0 ? 'var(--color-success)' : 'var(--color-danger)' }
      }, fmtSigned(s.delta, 1) + (s.deltaPct != null ? ' (' + fmtPercent(s.deltaPct, 1) + ')' : '')) : null
    ])
  ]);

  const chartEl = el('div', { class: 'w-full' });
  chartEl.style.height = '220px';
  container.append(header, chartEl);

  requestAnimationFrame(async () => {
    if (!container.isConnected) return;
    try {
      await mountLineChart(chartEl, points, {
        area: true,
        label,
        unit,
        measurements: state.measurements,
        height: 220
      });
    } catch (e) {
      console.warn('Chart mount failed:', e);
    }
  });

  return container;
}

export function MetricGrid({ fields, measurements }) {
  if (fields.length === 0) return null;
  const grid = el('div', { class: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' });
  for (const f of fields) {
    grid.appendChild(MetricChart({
      field: f.field, label: f.label, unit: f.unit, measurements
    }));
  }
  return grid;
}
