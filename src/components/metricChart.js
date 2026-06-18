import { el } from '../lib/dom.js';
import { mountLineChart } from '../lib/charts.js';
import { asPoints, stats, slopePerWeek } from '../lib/stats.js';
import { fmtNumber, fmtSigned, fmtPercent } from '../lib/format.js';
import { t } from '../lib/state.js';

export function MetricChart({ field, label, unit, measurements }) {
  const container = el('div', {
    class: 'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4'
  });

  const points = asPoints(measurements, field);
  if (points.length === 0) {
    container.appendChild(el('div', { class: 'text-sm text-[var(--color-fg-muted)]' },
      `${label}: sin datos`));
    return container;
  }

  const s = stats(points.map(p => p.y));
  const slope = slopePerWeek(points);

  const header = el('div', { class: 'flex items-baseline justify-between mb-2' }, [
    el('div', {}, [
      el('div', { class: 'text-sm font-medium' }, label),
      el('div', { class: 'text-xs text-[var(--color-fg-muted)]' },
        `min ${fmtNumber(s.min, 1)} · max ${fmtNumber(s.max, 1)} · avg ${fmtNumber(s.avg, 1)}${unit ? ' ' + unit : ''}`)
    ]),
    el('div', { class: 'text-right' }, [
      el('div', { class: 'text-lg font-mono' }, fmtNumber(s.last, 1) + (unit ? ' ' + unit : '')),
      s.delta != null ? el('div', {
        class: 'text-xs',
        style: { color: s.delta === 0 ? 'var(--color-fg-muted)' : s.delta > 0 ? 'var(--color-success)' : 'var(--color-danger)' }
      }, fmtSigned(s.delta, 1) + (s.deltaPct != null ? ' (' + fmtPercent(s.deltaPct, 1) + ')' : '')) : null
    ])
  ]);

  const chartEl = el('div', { class: 'w-full h-48' });
  container.append(header, chartEl);

  requestAnimationFrame(() => {
    if (!container.isConnected) return;
    mountLineChart(chartEl, points, { area: true });
  });

  return container;
}

export function MetricGrid({ fields, measurements }) {
  if (fields.length === 0) return null;
  const grid = el('div', { class: 'grid grid-cols-1 lg:grid-cols-2 gap-4' });
  for (const f of fields) {
    grid.appendChild(MetricChart({
      field: f.field, label: f.label, unit: f.unit, measurements
    }));
  }
  return grid;
}
