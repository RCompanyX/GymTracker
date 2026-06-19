import { el } from '../lib/dom.js';
import { asPoints, stats, slopePerWeek } from '../lib/stats.js';
import { fmtNumber, fmtSigned, fmtPercent } from '../lib/format.js';
import { t } from '../lib/state.js';
import { icon } from '../lib/icons.js';

export function StatsTable({ fields, measurements }) {
  const rows = fields.map(f => {
    const points = asPoints(measurements, f.field);
    const s = stats(points.map(p => p.y));
    const slope = slopePerWeek(points);
    return { f, s, slope, hasData: s.count > 0 };
  });

  const lastWeight = measurements.length > 0
    ? measurements[measurements.length - 1].weight
    : null;

  const table = el('table', { class: 'w-full text-sm' });
  const thead = el('thead', { class: 'bg-[var(--color-surface-2)]' });
  const trh = el('tr');
  for (const c of [
    t('table.metric'), t('table.min'), t('table.max'), t('table.avg'),
    t('table.last'), t('table.lastWeight'),
    t('table.delta'), t('table.deltaPct'), t('table.trend')
  ]) trh.appendChild(el('th', { class: 'text-left px-3 py-2 font-medium text-[var(--color-fg-muted)] whitespace-nowrap' }, c));
  thead.appendChild(trh);

  const tbody = el('tbody');
  for (const r of rows) {
    if (!r.hasData) continue;
    const tr = el('tr', { class: 'border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-2)]' });
    const cls = 'px-3 py-2 font-mono whitespace-nowrap';
    const deltaColor = r.s.delta == null ? null
      : r.s.delta === 0 ? 'var(--color-fg-muted)'
      : r.s.delta > 0 ? 'var(--color-success)' : 'var(--color-danger)';
    const trendColor = r.slope == null ? null
      : r.slope === 0 ? 'var(--color-fg-muted)'
      : r.slope > 0 ? 'var(--color-success)' : 'var(--color-danger)';
    tr.append(
      el('td', { class: cls + ' font-sans' }, r.f.label),
      el('td', { class: cls }, fmtNumber(r.s.min, 1) + (r.f.unit ? ' ' + r.f.unit : '')),
      el('td', { class: cls }, fmtNumber(r.s.max, 1) + (r.f.unit ? ' ' + r.f.unit : '')),
      el('td', { class: cls }, fmtNumber(r.s.avg, 1) + (r.f.unit ? ' ' + r.f.unit : '')),
      el('td', { class: cls }, fmtNumber(r.s.last, 1) + (r.f.unit ? ' ' + r.f.unit : '')),
      el('td', { class: cls, style: { color: 'var(--color-fg-muted)' } }, lastWeight != null ? fmtNumber(lastWeight, 1) + ' kg' : '—'),
      el('td', { class: cls, style: { color: deltaColor } }, fmtSigned(r.s.delta, 1) + (r.f.unit ? ' ' + r.f.unit : '')),
      el('td', { class: cls, style: { color: deltaColor } }, fmtPercent(r.s.deltaPct, 1)),
      el('td', { class: cls, style: { color: trendColor } }, r.slope == null ? '—' : fmtSigned(r.slope, 2))
    );
    tbody.appendChild(tr);
  }
  table.append(thead, tbody);

  return el('div', { class: 'rounded-xl border border-[var(--color-border)] overflow-hidden' }, [
    el('div', { class: 'overflow-x-auto scrollbar-thin' }, table)
  ]);
}
