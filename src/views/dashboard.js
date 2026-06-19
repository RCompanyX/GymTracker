import { el } from '../lib/dom.js';
import { KpiGrid } from '../components/kpiCard.js';
import { RangePicker } from '../components/rangePicker.js';
import { MetricsToggle } from '../components/metricsToggle.js';
import { MetricGrid } from '../components/metricChart.js';
import { StatsTable } from '../components/statsTable.js';
import { DataTable } from './dataTable.js';
import { ConsistencyCalendar } from '../components/consistencyCalendar.js';
import { EmptyState } from '../components/emptyState.js';
import { QuickWins } from '../components/quickWins.js';
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

function safeAppend(parent, child) {
  if (child == null || child === false) return;
  parent.appendChild(child);
}

export function Dashboard() {
  const visible = FIELDS.filter(f => state.visibleMetrics.includes(f.field));
  const data = filteredMeasurements();
  const fullData = state.measurements;

  const wrap = el('div', { class: 'mx-auto max-w-[1600px] px-4 sm:px-6 py-6 space-y-6' });

  if (fullData.length === 0) return wrap;

  if (data.length === 0) {
    safeAppend(wrap, EmptyState({
      iconName: 'calendar',
      title: t('empty.noMeasurementsInRange'),
      hint: t('range.label') + ': ' + t('range.all')
    }));
    return wrap;
  }

  const controls = el('div', { class: 'grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2 sm:gap-3' }, [
    RangePicker(),
    MetricsToggle()
  ]);
  safeAppend(wrap, controls);

  safeAppend(wrap, QuickWins({ measurements: fullData }));

  safeAppend(wrap, KpiGrid(data));
  safeAppend(wrap, ConsistencyCalendar({ measurements: fullData }));
  safeAppend(wrap, MetricGrid({
    fields: visible.map(f => ({ field: f.field, label: f.label(), unit: f.unit })),
    measurements: data
  }));
  safeAppend(wrap, el('h2', { class: 'text-lg font-semibold mt-4' }, t('table.metric') + 's'));
  safeAppend(wrap, StatsTable({
    fields: visible.map(f => ({ field: f.field, label: f.label(), unit: f.unit })),
    measurements: data
  }));
  safeAppend(wrap, el('h2', { class: 'text-lg font-semibold mt-8' }, t('table.date') + 's'));
  safeAppend(wrap, DataTable(data));

  return wrap;
}
