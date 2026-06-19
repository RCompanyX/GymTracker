import { el } from '../lib/dom.js';
import { state, setVisibleMetrics, t } from '../lib/state.js';
import { icon } from '../lib/icons.js';

const ALL_METRICS = [
  { field: 'weight', labelKey: 'metrics.weight' },
  { field: 'bmi', labelKey: 'metrics.bmi' },
  { field: 'bodyFat', labelKey: 'metrics.bodyFat' },
  { field: 'viscFat', labelKey: 'metrics.viscFat' },
  { field: 'muscleMass', labelKey: 'metrics.muscleMass' },
  { field: 'boneMass', labelKey: 'metrics.boneMass' },
  { field: 'bmr', labelKey: 'metrics.bmr' },
  { field: 'metabAge', labelKey: 'metrics.metabAge' },
  { field: 'bodyWater', labelKey: 'metrics.bodyWater' },
  { field: 'physiqueRating', labelKey: 'metrics.physiqueRating' }
];

export { ALL_METRICS };

let isOpen = false;
let panelEl = null;
let btnEl = null;

function close() {
  isOpen = false;
  if (panelEl) panelEl.classList.add('hidden');
}

function toggle() {
  isOpen = !isOpen;
  if (panelEl) panelEl.classList.toggle('hidden', !isOpen);
}

function onDocClick(e) {
  if (!isOpen) return;
  if (panelEl && !panelEl.contains(e.target) && btnEl && !btnEl.contains(e.target)) close();
}

if (typeof document !== 'undefined' && !onDocClick._installed) {
  document.addEventListener('click', onDocClick);
  onDocClick._installed = true;
}

export function MetricsToggle() {
  btnEl = el('button', {
    class: 'w-full h-full min-h-[44px] inline-flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm hover:bg-[var(--color-surface-2)] transition-colors',
    onclick: (e) => { e.stopPropagation(); toggle(); }
  }, [
    el('span', { class: 'inline-flex items-center gap-2 min-w-0' }, [
      icon('sliders-horizontal', { size: 14, class: 'shrink-0 text-[var(--color-fg-muted)]' }),
      el('span', { class: 'truncate' }, t('actions.metrics'))
    ]),
    icon(isOpen ? 'chevron-up' : 'chevron-down', { size: 14, class: 'shrink-0 text-[var(--color-fg-muted)]' })
  ]);

  panelEl = el('div', {
    class: [
      'absolute top-full mt-2 z-20 right-0 sm:left-auto sm:right-0 sm:w-72 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg p-2',
      isOpen ? '' : 'hidden'
    ].join(' '),
    onclick: e => e.stopPropagation()
  });

  const panelHeader = el('div', { class: 'flex items-center justify-between mb-1 pb-2 border-b border-[var(--color-border)]' }, [
    el('span', { class: 'text-sm font-semibold' }, t('actions.metrics')),
    el('button', {
      class: 'w-7 h-7 inline-flex items-center justify-center rounded-md text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)] transition-colors',
      'aria-label': t('actions.close'),
      title: t('actions.close'),
      onclick: (e) => { e.stopPropagation(); close(); }
    }, icon('x', { size: 14 }))
  ]);
  panelEl.appendChild(panelHeader);

  for (const m of ALL_METRICS) {
    const checked = state.visibleMetrics.includes(m.field);
    const row = el('label', { class: 'flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--color-surface-2)] cursor-pointer text-sm' }, [
      el('input', {
        type: 'checkbox',
        checked,
        class: 'accent-[var(--color-brand)]',
        onclick: (e) => e.stopPropagation(),
        onchange: (e) => {
          e.stopPropagation();
          const next = new Set(state.visibleMetrics);
          if (e.target.checked) next.add(m.field);
          else next.delete(m.field);
          setVisibleMetrics([...next]);
        }
      }),
      el('span', {}, t(m.labelKey))
    ]);
    panelEl.appendChild(row);
  }

  panelEl.appendChild(el('div', { class: 'border-t border-[var(--color-border)] mt-2 pt-2 flex justify-between text-xs' }, [
    el('button', {
      class: 'px-2 py-1 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-fg-muted)] inline-flex items-center gap-1',
      onclick: (e) => {
        e.stopPropagation();
        setVisibleMetrics(ALL_METRICS.map(m => m.field));
      }
    }, [icon('check', { size: 12 }), t('actions.selectAll')]),
    el('button', {
      class: 'px-2 py-1 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-fg-muted)] inline-flex items-center gap-1',
      onclick: (e) => {
        e.stopPropagation();
        setVisibleMetrics([]);
      }
    }, [icon('x', { size: 12 }), t('actions.selectNone')])
  ]));

  return el('div', { class: 'relative w-full h-full' }, [btnEl, panelEl]);
}
