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
import { fmtDateShort, fmtNumber, fmtSigned } from '../lib/format.js';
import { icon } from '../lib/icons.js';

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

function SectionHeading({ iconName, title, description }) {
  return el('div', { class: 'flex items-start gap-3 pt-2' }, [
    el('div', { class: 'mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand)]/10 text-[var(--color-brand)]' },
      icon(iconName, { size: 16 })),
    el('div', {}, [
      el('h2', { class: 'text-lg font-semibold tracking-tight' }, title),
      description ? el('p', { class: 'mt-0.5 text-sm text-[var(--color-fg-muted)]' }, description) : null
    ])
  ]);
}

function DashboardSummary(measurements) {
  const first = measurements[0];
  const last = measurements[measurements.length - 1];
  const change = last.weight != null && first.weight != null ? last.weight - first.weight : null;

  return el('section', {
    class: 'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-4 sm:px-5 sm:py-4'
  }, [
    el('div', { class: 'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between' }, [
      el('div', { class: 'min-w-0' }, [
        el('p', { class: 'text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-muted)]' }, t('summary.overview')),
        el('div', { class: 'mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1' }, [
          el('span', { class: 'text-xl font-semibold tracking-tight sm:text-2xl' }, `${fmtNumber(last.weight, 1)} kg`),
          change != null ? el('span', { class: 'font-mono text-sm text-[var(--color-brand)]' }, `${fmtSigned(change, 1)} kg`) : null,
          el('span', { class: 'text-sm text-[var(--color-fg-muted)]' }, t('summary.sinceStart'))
        ])
      ]),
      el('div', { class: 'grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:flex sm:gap-6' }, [
        el('div', {}, [
          el('div', { class: 'text-xs text-[var(--color-fg-muted)]' }, t('summary.weighIns')),
          el('div', { class: 'font-mono font-medium' }, String(measurements.length))
        ]),
        el('div', {}, [
          el('div', { class: 'text-xs text-[var(--color-fg-muted)]' }, t('summary.latest')),
          el('div', { class: 'font-medium' }, fmtDateShort(last.date))
        ])
      ])
    ])
  ]);
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
  safeAppend(wrap, DashboardSummary(data));

  safeAppend(wrap, SectionHeading({ iconName: 'activity', title: t('sections.snapshot'), description: t('sections.snapshotHint') }));
  safeAppend(wrap, KpiGrid(data));
  safeAppend(wrap, ConsistencyCalendar({ measurements: fullData }));
  safeAppend(wrap, SectionHeading({ iconName: 'chart-no-axes-combined', title: t('sections.trends'), description: t('sections.trendsHint') }));
  safeAppend(wrap, MetricGrid({
    fields: visible.map(f => ({ field: f.field, label: f.label(), unit: f.unit })),
    measurements: data
  }));
  safeAppend(wrap, SectionHeading({ iconName: 'table-properties', title: t('sections.statistics'), description: t('sections.statisticsHint') }));
  safeAppend(wrap, StatsTable({
    fields: visible.map(f => ({ field: f.field, label: f.label(), unit: f.unit })),
    measurements: data
  }));
  safeAppend(wrap, SectionHeading({ iconName: 'rows-3', title: t('sections.records'), description: t('sections.recordsHint') }));
  safeAppend(wrap, el('div', { id: 'data-table-wrap' }, DataTable(data)));

  return wrap;
}
