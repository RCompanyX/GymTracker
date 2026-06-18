import { el } from '../lib/dom.js';
import { state, setRange, t } from '../lib/state.js';

const PRESETS = [
  { key: 'all', labelKey: 'range.all' },
  { key: '1m', labelKey: 'range.month1' },
  { key: '3m', labelKey: 'range.months3' },
  { key: '6m', labelKey: 'range.months6' },
  { key: '1y', labelKey: 'range.year1' }
];

export function RangePicker() {
  const group = el('div', {
    class: 'inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-0.5'
  });

  const update = () => {
    group.innerHTML = '';
    for (const p of PRESETS) {
      const active = state.range.preset === p.key;
      group.appendChild(el('button', {
        class: [
          'px-3 py-1.5 text-sm rounded-md transition-colors',
          active
            ? 'bg-[var(--color-surface)] text-[var(--color-fg)] shadow-sm'
            : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
        ].join(' '),
        onclick: () => setRange(p.key)
      }, t(p.labelKey)));
    }
  };

  update();
  return el('div', { class: 'flex items-center gap-3' }, [
    el('span', { class: 'text-sm text-[var(--color-fg-muted)]' }, t('range.label') + ':'),
    group
  ]);
}
