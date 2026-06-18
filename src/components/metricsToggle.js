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

if (typeof document !== 'undefined') {
  document.addEventListener('click', onDocClick);
}

export function MetricsToggle() {
  btnEl = el('button', {
    class: 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm hover:bg-[var(--color-surface-2)] transition-colors',
    onclick: (e) => { e.stopPropagation(); toggle(); }
  }, [icon('sliders-horizontal', { size: 14 }), t('actions.metrics')]);

  panelEl = el('div', {
    class: 'absolute right-0 top-full mt-2 z-10 min-w-56 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg p-2 hidden'
  });

  for (const m of ALL_METRICS) {
    const checked = state.visibleMetrics.includes(m.field);
    const row = el('label', { class: 'flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--color-surface-2)] cursor-pointer text-sm' }, [
      el('input', {
        type: 'checkbox',
        checked,
        class: 'accent-[var(--color-brand)]',
        onchange: (e) => {
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
      onclick: () => setVisibleMetrics(ALL_METRICS.map(m => m.field))
    }, [icon('check', { size: 12 }), t('actions.selectAll')]),
    el('button', {
      class: 'px-2 py-1 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-fg-muted)] inline-flex items-center gap-1',
      onclick: () => setVisibleMetrics([])
    }, [icon('x', { size: 12 }), t('actions.selectNone')])
  ]));

  return el('div', { class: 'relative' }, [btnEl, panelEl]);
}
