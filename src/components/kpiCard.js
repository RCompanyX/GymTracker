import { el } from '../lib/dom.js';
import { fmtNumber, fmtSigned, fmtPercent } from '../lib/format.js';
import { stats, deltaOverWindow, asPoints } from '../lib/stats.js';
import { t, state } from '../lib/state.js';

export function KpiCard({ label, value, sub, trend }) {
  let trendEl = null;
  if (trend != null && Number.isFinite(trend)) {
    const positive = trend > 0;
    const negative = trend < 0;
    const color = positive ? 'var(--color-success)' : negative ? 'var(--color-danger)' : 'var(--color-fg-muted)';
    const arrow = positive ? '↑' : negative ? '↓' : '·';
    trendEl = el('div', { class: 'text-xs mt-1 flex items-center gap-1', style: { color } }, [
      el('span', {}, arrow),
      el('span', {}, fmtSigned(trend, 1))
    ]);
  }
  return el('div', {
    class: 'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4'
  }, [
    el('div', { class: 'text-xs text-[var(--color-fg-muted)] uppercase tracking-wide' }, label),
    el('div', { class: 'text-2xl font-semibold mt-1 font-mono' }, value),
    sub ? el('div', { class: 'text-xs text-[var(--color-fg-muted)] mt-1' }, sub) : null,
    trendEl
  ]);
}

function bmiCategory(bmi, lang) {
  if (bmi < 18.5) return lang === 'es' ? 'Bajo peso' : 'Underweight';
  if (bmi < 25) return lang === 'es' ? 'Normal' : 'Normal';
  if (bmi < 30) return lang === 'es' ? 'Sobrepeso' : 'Overweight';
  return lang === 'es' ? 'Obesidad' : 'Obesity';
}

export function KpiGrid(measurements) {
  if (measurements.length === 0) return null;

  const last = measurements[measurements.length - 1];
  const first = measurements[0];
  const d7 = deltaOverWindow(asPoints(measurements, 'weight'), 7);
  const dStart = last.weight != null && first.weight != null ? last.weight - first.weight : null;
  const dStartPct = first.weight != null && first.weight !== 0 && dStart != null
    ? (dStart / first.weight) * 100 : null;

  const cards = [
    KpiCard({
      label: t('kpi.currentWeight'),
      value: fmtNumber(last.weight, 1) + ' kg',
      sub: last.date ? new Date(last.date).toISOString().slice(0, 10) : null,
      trend: d7
    }),
    KpiCard({
      label: t('kpi.deltaFromStart'),
      value: fmtSigned(dStart, 1, ' kg'),
      sub: dStartPct != null ? fmtPercent(dStartPct, 1) : null
    }),
    KpiCard({
      label: t('kpi.bmi'),
      value: fmtNumber(last.bmi, 1),
      sub: last.bmi != null ? bmiCategory(last.bmi, state.lang) : null
    }),
    KpiCard({
      label: t('kpi.bodyFat'),
      value: fmtNumber(last.bodyFat, 1) + '%'
    }),
    KpiCard({
      label: t('kpi.muscleMass'),
      value: fmtNumber(last.muscleMass, 1) + ' kg'
    })
  ];

  return el('div', {
    class: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3'
  }, cards);
}
