import { el } from '../lib/dom.js';
import { fmtNumber, fmtSigned, fmtPercent } from '../lib/format.js';
import { stats, deltaOverWindow, asPoints, slopePerWeek } from '../lib/stats.js';
import { t, state } from '../lib/state.js';
import { icon } from '../lib/icons.js';
import { mountSparkline } from '../lib/charts.js';

const REGISTRY = new WeakMap();

export function KpiCard({ label, value, sub, trend, sparkline, sparklineColor, featured = false }) {
  const container = el('div', {
    class: [
      'rounded-xl border p-4 flex flex-col gap-2 transition-colors hover:border-[var(--color-brand)]/40',
      featured
        ? 'border-[var(--color-brand)]/35 bg-[var(--color-brand)]/5 shadow-sm shadow-[var(--color-brand)]/5'
        : 'border-[var(--color-border)] bg-[var(--color-surface-2)]'
    ].join(' ')
  });

  let trendEl = null;
  if (trend != null && Number.isFinite(trend)) {
    const positive = trend > 0;
    const negative = trend < 0;
    const color = trend === 0 ? 'var(--color-fg-muted)' : 'var(--color-brand)';
    const TrendIcon = positive ? 'trending-up' : negative ? 'trending-down' : 'minus';
    trendEl = el('div', { class: 'text-xs flex items-center gap-1', style: { color } }, [
      icon(TrendIcon, { size: 12 }),
      el('span', { class: 'font-mono' }, fmtSigned(trend, 1))
    ]);
  }

  container.append(
    el('div', { class: 'text-xs text-[var(--color-fg-muted)] uppercase tracking-wide' }, label),
    el('div', { class: 'text-2xl font-semibold font-mono' }, value),
    el('div', { class: 'flex items-center justify-between gap-2' }, [
      sub ? el('div', { class: 'text-xs text-[var(--color-fg-muted)] truncate' }, sub) : el('div'),
      trendEl
    ])
  );

  if (sparkline && sparkline.length > 1) {
    const chartEl = el('div', { class: 'w-full -mb-1' });
    chartEl.style.height = '52px';
    container.appendChild(chartEl);
    requestAnimationFrame(async () => {
      if (!container.isConnected) return;
      const existing = REGISTRY.get(container);
      if (existing) existing.dispose();
      try {
        const inst = await mountSparkline(chartEl, sparkline, {
          color: sparklineColor,
          height: 52,
          fill: true
        });
        REGISTRY.set(container, inst);
      } catch (e) {
        console.warn('Sparkline mount failed:', e);
      }
    });
  }

  return container;
}

function bmiCategory(bmi, lang) {
  if (bmi < 18.5) return lang === 'es' ? 'Bajo peso' : 'Underweight';
  if (bmi < 25) return lang === 'es' ? 'Normal' : 'Normal';
  if (bmi < 30) return lang === 'es' ? 'Sobrepeso' : 'Overweight';
  return lang === 'es' ? 'Obesidad' : 'Obesity';
}

function disposeKpiSparklines() {
  for (const inst of REGISTRY.values?.() || []) {
    if (inst?.dispose) inst.dispose();
  }
}

export function KpiGrid(measurements) {
  if (measurements.length === 0) return null;

  const last = measurements[measurements.length - 1];
  const first = measurements[0];
  const weightPoints = asPoints(measurements, 'weight');
  const d7 = deltaOverWindow(weightPoints, 7);
  const dStart = last.weight != null && first.weight != null ? last.weight - first.weight : null;
  const dStartPct = first.weight != null && first.weight !== 0 && dStart != null
    ? (dStart / first.weight) * 100 : null;
  const weightSlope = slopePerWeek(weightPoints);

  const cards = [
    KpiCard({
      label: t('kpi.currentWeight'),
      value: fmtNumber(last.weight, 1) + ' kg',
      sub: `${t('kpi.latestMeasurement')} · ${last.date ? new Date(last.date).toISOString().slice(0, 10) : ''}`,
      trend: d7,
      sparkline: weightPoints,
      featured: true
    }),
    KpiCard({
      label: t('kpi.deltaFromStart'),
      value: fmtSigned(dStart, 1, ' kg'),
      sub: dStartPct != null ? fmtPercent(dStartPct, 1) : null,
      sparkline: weightPoints.map(p => ({ x: p.x, y: last.weight != null ? p.y - first.weight : null })),
    }),
    KpiCard({
      label: t('kpi.bmi'),
      value: fmtNumber(last.bmi, 1),
      sub: last.bmi != null ? bmiCategory(last.bmi, state.lang) : null,
      sparkline: asPoints(measurements, 'bmi')
    }),
    KpiCard({
      label: t('kpi.bodyFat'),
      value: fmtNumber(last.bodyFat, 1) + '%',
      sparkline: asPoints(measurements, 'bodyFat')
    }),
    KpiCard({
      label: t('kpi.muscleMass'),
      value: fmtNumber(last.muscleMass, 1) + ' kg',
      sparkline: asPoints(measurements, 'muscleMass')
    })
  ];

  return el('div', {
    class: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3'
  }, cards);
}
