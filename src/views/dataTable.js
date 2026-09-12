import { el } from '../lib/dom.js';
import { state, t } from '../lib/state.js';
import { fmtDate, fmtNumber } from '../lib/format.js';
import { icon } from '../lib/icons.js';

const COLUMNS = [
  { field: 'date', label: () => t('table.date'), render: m => fmtDate(m.date) },
  { field: 'weight', label: () => t('metrics.weight') + ' (kg)', render: m => fmtNumber(m.weight, 1) },
  { field: 'bmi', label: () => t('metrics.bmi'), render: m => fmtNumber(m.bmi, 1) },
  { field: 'bodyFat', label: () => t('metrics.bodyFat') + ' (%)', render: m => fmtNumber(m.bodyFat, 1) },
  { field: 'viscFat', label: () => t('metrics.viscFat'), render: m => fmtNumber(m.viscFat, 1) },
  { field: 'muscleMass', label: () => t('metrics.muscleMass') + ' (kg)', render: m => fmtNumber(m.muscleMass, 1) },
  { field: 'boneMass', label: () => t('metrics.boneMass') + ' (kg)', render: m => fmtNumber(m.boneMass, 2) },
  { field: 'bmr', label: () => t('metrics.bmr') + ' (kcal)', render: m => fmtNumber(m.bmr, 0) },
  { field: 'metabAge', label: () => t('metrics.metabAge'), render: m => fmtNumber(m.metabAge, 0) },
  { field: 'bodyWater', label: () => t('metrics.bodyWater') + ' (%)', render: m => fmtNumber(m.bodyWater, 1) },
  { field: 'physiqueRating', label: () => t('metrics.physiqueRating'), render: m => fmtNumber(m.physiqueRating, 1) }
];

let sortField = 'date';
let sortDir = 'desc';
let page = 0;
const PAGE_SIZE = 20;

function exportCsv(measurements) {
  const header = COLUMNS.map(c => c.label()).join(',');
  const lines = measurements.map(m =>
    COLUMNS.map(c => {
      const v = m[c.field];
      if (v == null) return '';
      return String(v).includes(',') ? `"${v}"` : v;
    }).join(','));
  const csv = [header, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gymtracker-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataTable(measurements) {
  const sorted = [...measurements].sort((a, b) => {
    const av = a[sortField], bv = b[sortField];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  if (page >= totalPages) page = totalPages - 1;
  const slice = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const thead = el('thead', { class: 'bg-[var(--color-surface-2)]' });
  const trh = el('tr');
  for (const [index, c] of COLUMNS.entries()) {
    const isActive = sortField === c.field;
    trh.appendChild(el('th', {
      class: [
        'sticky top-0 z-[2] px-3 py-2 font-medium text-[var(--color-fg-muted)] cursor-pointer select-none whitespace-nowrap hover:text-[var(--color-fg)] transition-colors bg-[var(--color-surface-2)]',
        index === 0 ? 'left-0 text-left data-table-first-cell' : 'text-right'
      ].join(' '),
      onclick: () => {
        if (sortField === c.field) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        else { sortField = c.field; sortDir = c.field === 'date' ? 'desc' : 'asc'; }
        page = 0;
        const root = document.getElementById('data-table-wrap');
        if (root) root.replaceChildren(DataTable(state.measurements));
      }
    }, [
      el('span', {}, c.label()),
      isActive ? icon(sortDir === 'asc' ? 'chevron-up' : 'chevron-down', { size: 12, class: 'ml-1 inline-block align-middle' }) : null
    ]));
  }
  thead.appendChild(trh);

  const tbody = el('tbody');
  for (const m of slice) {
    const tr = el('tr', { class: 'border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-2)]' });
    for (const [index, c] of COLUMNS.entries()) {
      tr.appendChild(el('td', {
        class: [
          'px-3 py-2 font-mono whitespace-nowrap',
          index === 0 ? 'sticky left-0 z-[1] text-left data-table-first-cell' : 'text-right'
        ].join(' ')
      }, c.render(m) ?? '—'));
    }
    tbody.appendChild(tr);
  }

  const table = el('table', { class: 'w-full text-sm bg-[var(--color-surface)]' }, [thead, tbody]);

  const pagination = el('div', { class: 'flex items-center justify-between px-3 py-2 border-t border-[var(--color-border)] text-sm' }, [
    el('div', { class: 'text-[var(--color-fg-muted)]' },
      `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, sorted.length)} / ${sorted.length}`),
    el('div', { class: 'flex items-center gap-2' }, [
      el('button', {
        class: 'w-8 h-8 inline-flex items-center justify-center rounded border border-[var(--color-border)] disabled:opacity-40 hover:bg-[var(--color-surface-2)] transition-colors',
        disabled: page === 0,
        onclick: () => { page--; refresh(state.measurements); }
      }, icon('chevron-left', { size: 14 })),
      el('span', { class: 'font-mono' }, `${page + 1}/${totalPages}`),
      el('button', {
        class: 'w-8 h-8 inline-flex items-center justify-center rounded border border-[var(--color-border)] disabled:opacity-40 hover:bg-[var(--color-surface-2)] transition-colors',
        disabled: page >= totalPages - 1,
        onclick: () => { page++; refresh(state.measurements); }
      }, icon('chevron-right', { size: 14 }))
    ])
  ]);

  const toolbar = el('div', { class: 'flex justify-end mb-3' }, [
    el('button', {
      class: 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm hover:bg-[var(--color-surface-2)] transition-colors',
      onclick: () => exportCsv(sorted)
    }, [icon('download', { size: 14 }), t('actions.exportCsv')])
  ]);

  return el('div', {}, [
    toolbar,
    el('div', { class: 'rounded-xl border border-[var(--color-border)] overflow-hidden' }, [
      el('div', { class: 'max-h-[32rem] overflow-auto scrollbar-thin' }, table),
      pagination
    ])
  ]);
}

function refresh(m) {
  const root = document.getElementById('data-table-wrap');
  if (root) root.replaceChildren(DataTable(m));
}

export function DataTableView(measurements) {
  return el('div', { id: 'data-table-wrap', class: 'mx-auto max-w-6xl px-4 sm:px-6 py-6' },
    DataTable(measurements));
}
