import { el } from '../lib/dom.js';
import { state, setVisibleMetrics, t } from '../lib/state.js';

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

function toggle(visible) {
  isOpen = !isOpen;
  visible();
}

function render() {
  const wrap = el('div', { class: 'relative' });

  const btn = el('button', {
    class: 'px-3 py-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm hover:bg-[var(--color-surface-2)]',
    onclick: () => toggle(() => render())
  }, t('actions.metrics') || 'Métricas ▾');

  const panel = el('div', {
    class: [
      'absolute right-0 top-full mt-2 z-10 min-w-56 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg p-2',
      isOpen ? '' : 'hidden'
    ].join(' ')
  });

  for (const m of ALL_METRICS) {
    const checked = state.visibleMetrics.includes(m.field);
    const row = el('label', { class: 'flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--color-surface-2)] cursor-pointer text-sm' }, [
      el('input', {
        type: 'checkbox',
        checked,
        onchange: (e) => {
          const next = new Set(state.visibleMetrics);
          if (e.target.checked) next.add(m.field);
          else next.delete(m.field);
          setVisibleMetrics([...next]);
        }
      }),
      el('span', {}, t(m.labelKey))
    ]);
    panel.appendChild(row);
  }

  panel.appendChild(el('div', { class: 'border-t border-[var(--color-border)] mt-2 pt-2 flex justify-between text-xs' }, [
    el('button', {
      class: 'px-2 py-1 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-fg-muted)]',
      onclick: () => setVisibleMetrics(ALL_METRICS.map(m => m.field))
    }, t('actions.selectAll') || 'Todas'),
    el('button', {
      class: 'px-2 py-1 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-fg-muted)]',
      onclick: () => setVisibleMetrics([])
    }, t('actions.selectNone') || 'Ninguna')
  ]));

  wrap.append(btn, panel);
  return wrap;
}

export function MetricsToggle() {
  return render();
}
