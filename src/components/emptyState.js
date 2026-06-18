import { el } from '../lib/dom.js';
import { icon } from '../lib/icons.js';

export function EmptyState({ iconName, title, hint, action }) {
  const wrap = el('div', {
    class: 'rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-10 text-center'
  });
  wrap.append(
    el('div', { class: 'inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-surface-3)] text-[var(--color-fg-muted)] mb-4' },
      icon(iconName, { size: 28, 'stroke-width': 1.5 })),
    el('h3', { class: 'text-lg font-semibold mb-1' }, title),
    hint ? el('p', { class: 'text-sm text-[var(--color-fg-muted)] mb-4' }, hint) : null,
    action || null
  );
  return wrap;
}
