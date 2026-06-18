import { el } from '../lib/dom.js';
import { KpiGrid } from '../components/kpiCard.js';
import { RangePicker } from '../components/rangePicker.js';
import { MetricsToggle } from '../components/metricsToggle.js';
import { MetricGrid } from '../components/metricChart.js';
import { StatsTable } from '../components/statsTable.js';
import { DataTable } from './dataTable.js';
import { state, filteredMeasurements, t } from '../lib/state.js';

const FIELDS = [
  { field: 'weight', label: () => t('metrics.weight'), unit: 'kg' },
  { field: 'bmi', label: () => t('metrics.bmi'), unit: '' },
  { field: 'bodyFat', label: () => t('metrics.bodyFat'), unit: '%' },
  { field: 'viscFat', label: () => t('metrics.viscFat'), unit: '' },
  { field: 'muscleMass', label: () => t('metrics.muscleMass'), unit: 'kg' },
  { field: 'boneMass', label: () => t('metrics.boneMass'), unit: 'kg' },
  { field: 'bmr', label: () => t('metrics.bmr'), unit: 'kcal' },
  { field: 'metabAge', label: () => t('metrics.metabAge'), unit: '' },
  { field: 'bodyWater', label: () => t('metrics.bodyWater'), unit: '%' },
  { field: 'physiqueRating', label: () => t('metrics.physiqueRating'), unit: '' }
];

export function Dashboard() {
  const visible = FIELDS.filter(f => state.visibleMetrics.includes(f.field));
  const data = filteredMeasurements();

  const wrap = el('div', { class: 'mx-auto max-w-6xl px-4 sm:px-6 py-6 space-y-6' });

  if (data.length === 0) {
    wrap.appendChild(el('div', {
      class: 'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-8 text-center text-[var(--color-fg-muted)]'
    }, t('empty.noMeasurementsInRange')));
    return wrap;
  }

  const controls = el('div', { class: 'flex items-center justify-between flex-wrap gap-3' }, [
    RangePicker(),
    MetricsToggle()
  ]);
  wrap.appendChild(controls);

  wrap.appendChild(KpiGrid(data));
  wrap.appendChild(MetricGrid({
    fields: visible.map(f => ({ field: f.field, label: f.label(), unit: f.unit })),
    measurements: data
  }));
  wrap.appendChild(el('h2', { class: 'text-lg font-semibold mt-4' }, t('table.metric') + 's'));
  wrap.appendChild(StatsTable({
    fields: visible.map(f => ({ field: f.field, label: f.label(), unit: f.unit })),
    measurements: data
  }));
  wrap.appendChild(el('h2', { class: 'text-lg font-semibold mt-8' }, t('table.date') + 's'));
  wrap.appendChild(DataTable(data));

  return wrap;
}
