import { el } from '../lib/dom.js';
import { state, setRange, t } from '../lib/state.js';
import { icon } from '../lib/icons.js';

const PRESETS = [
  { key: 'all', labelKey: 'range.all' },
  { key: '1m', labelKey: 'range.month1' },
  { key: '3m', labelKey: 'range.months3' },
  { key: '6m', labelKey: 'range.months6' },
  { key: '1y', labelKey: 'range.year1' }
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

if (typeof document !== 'undefined' && !onDocClick._installed) {
  document.addEventListener('click', onDocClick);
  onDocClick._installed = true;
}

export function RangePicker() {
  const activePreset = PRESETS.find(p => p.key === state.range.preset) || PRESETS[0];
  const activeLabel = t(activePreset.labelKey);

  // Mobile: dropdown button + panel
  const mobileBtn = el('button', {
    class: 'sm:hidden w-full h-full min-h-[44px] inline-flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm hover:bg-[var(--color-surface-2)] transition-colors',
    onclick: (e) => { e.stopPropagation(); toggle(); }
  }, [
    el('span', { class: 'inline-flex items-center gap-2 min-w-0 flex-1' }, [
      icon('calendar', { size: 14, class: 'shrink-0 text-[var(--color-fg-muted)]' }),
      el('span', { class: 'truncate' }, [
        el('span', { class: 'hidden sm:inline text-[var(--color-fg-muted)]' }, t('range.label') + ': '),
        el('span', { class: 'font-medium' }, activeLabel)
      ])
    ]),
    icon(isOpen ? 'chevron-up' : 'chevron-down', { size: 14, class: 'shrink-0 text-[var(--color-fg-muted)]' })
  ]);

  const mobilePanel = el('div', {
    class: [
      'sm:hidden absolute left-2 right-2 top-full mt-1 z-20 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg p-1',
      isOpen ? '' : 'hidden'
    ].join(' '),
    onclick: e => e.stopPropagation()
  });

  for (const p of PRESETS) {
    const active = state.range.preset === p.key;
    mobilePanel.appendChild(el('button', {
      class: [
        'w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center justify-between gap-2',
        active
          ? 'bg-[var(--color-brand)] text-[var(--color-brand-fg)]'
          : 'hover:bg-[var(--color-surface-2)] text-[var(--color-fg)]'
      ].join(' '),
      onclick: (e) => {
        e.stopPropagation();
        isOpen = false;
        setRange(p.key);
      }
    }, [
      el('span', {}, t(p.labelKey)),
      active ? icon('check', { size: 14 }) : null
    ]));
  }

  btnEl = mobileBtn;
  panelEl = mobilePanel;

  // Desktop: segmented control
  const desktopGroup = el('div', {
    class: 'hidden sm:inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-0.5'
  });

  for (const p of PRESETS) {
    const active = state.range.preset === p.key;
    desktopGroup.appendChild(el('button', {
      class: [
        'px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap',
        active
          ? 'bg-[var(--color-surface)] text-[var(--color-fg)] shadow-sm'
          : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
      ].join(' '),
      onclick: () => setRange(p.key)
    }, t(p.labelKey)));
  }

  return el('div', { class: 'relative w-full h-full' }, [
    mobileBtn,
    mobilePanel,
    el('div', { class: 'hidden sm:flex items-center gap-2' }, [
      el('span', { class: 'inline-flex items-center gap-1.5 text-sm text-[var(--color-fg-muted)] shrink-0' }, [
        icon('calendar', { size: 14 }),
        t('range.label') + ':'
      ]),
      desktopGroup
    ])
  ]);
}
