import { el } from '../lib/dom.js';
import { state, setTheme, setLang, t } from '../lib/state.js';
import { setFormatLang } from '../lib/format.js';
import { pickCsvFile } from '../lib/folder.js';
import { formatCsvError, parseCsvFile } from '../lib/csv.js';
import { setMeasurements, setError } from '../lib/state.js';
import { icon } from '../lib/icons.js';

let mobileMenuOpen = false;
let mobileMenuEl = null;
let mobileMenuBtnEl = null;

function closeMobileMenu() {
  mobileMenuOpen = false;
  if (mobileMenuEl) mobileMenuEl.classList.add('hidden');
}

function toggleMobileMenu() {
  mobileMenuOpen = !mobileMenuOpen;
  if (mobileMenuEl) mobileMenuEl.classList.toggle('hidden', !mobileMenuOpen);
}

function onDocClickMobile(e) {
  if (!mobileMenuOpen) return;
  if (mobileMenuEl && !mobileMenuEl.contains(e.target) && mobileMenuBtnEl && !mobileMenuBtnEl.contains(e.target)) {
    closeMobileMenu();
  }
}

if (typeof document !== 'undefined' && !onDocClickMobile._installed) {
  document.addEventListener('click', onDocClickMobile);
  onDocClickMobile._installed = true;
}

function ThemeIcon({ theme }) {
  if (theme === 'light') return icon('sun', { size: 16 });
  if (theme === 'dark') return icon('moon', { size: 16 });
  return icon('monitor', { size: 16 });
}

function openCsv() {
  return async () => {
    closeMobileMenu();
    try {
      const file = await pickCsvFile();
      const m = await parseCsvFile(file);
      setMeasurements(m, { fileName: file.name });
    } catch (e) {
      if (e?.name !== 'AbortError') setError(formatCsvError(e, t));
    }
  };
}

function setThemeAndClose(theme) {
  return () => {
    mobileMenuOpen = false;
    setTheme(theme);
    closeMobileMenu();
  };
}

function setLangAndClose(lang) {
  return () => {
    mobileMenuOpen = false;
    setLang(lang);
    setFormatLang(lang);
    closeMobileMenu();
  };
}

function toggleTheme() {
  const order = ['system', 'light', 'dark'];
  const next = order[(order.indexOf(state.theme) + 1) % order.length];
  setTheme(next);
}

function toggleLang() {
  const next = state.lang === 'es' ? 'en' : 'es';
  setLang(next);
  setFormatLang(next);
}

function sectionLabel(text) {
  return el('div', { class: 'text-[10px] uppercase tracking-wide text-[var(--color-fg-muted)] px-2 pt-2 pb-1 font-semibold' }, text);
}

function themeButton(themeValue, iconName, label) {
  const active = state.theme === themeValue;
  return el('button', {
    class: [
      'flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-colors',
      active
        ? 'bg-[var(--color-brand)] text-[var(--color-brand-fg)]'
        : 'hover:bg-[var(--color-surface-2)] text-[var(--color-fg-muted)]'
    ].join(' '),
    onclick: setThemeAndClose(themeValue)
  }, [icon(iconName, { size: 14 }), label]);
}

function langButton(lang, label) {
  const active = state.lang === lang;
  return el('button', {
    class: [
      'flex-1 px-2 py-1.5 rounded-md text-xs font-mono transition-colors',
      active
        ? 'bg-[var(--color-brand)] text-[var(--color-brand-fg)]'
        : 'hover:bg-[var(--color-surface-2)] text-[var(--color-fg-muted)]'
    ].join(' '),
    onclick: setLangAndClose(lang)
  }, label);
}

export function Header() {
  const subtitle = state.fileName
    ? el('div', { class: 'text-xs text-[var(--color-fg-muted)] truncate hidden sm:block' },
        `${state.fileName} · ${state.measurements.length}`)
    : el('div', { class: 'text-xs text-[var(--color-fg-muted)] truncate hidden sm:block' }, t('app.subtitle'));

  const logoBox = el('div', { class: 'flex items-center gap-2 min-w-0' }, [
    el('div', {
      class: 'w-8 h-8 rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-fg)] flex items-center justify-center shrink-0'
    }, icon('scale', { size: 18, 'stroke-width': 2 })),
    el('div', { class: 'min-w-0' }, [
      el('div', { class: 'font-semibold truncate' }, t('app.title')),
      subtitle
    ])
  ]);

  const desktopButtons = el('div', { class: 'hidden sm:flex items-center gap-1.5' }, [
    el('button', {
      class: 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--color-brand)] text-[var(--color-brand-fg)] text-sm font-medium hover:opacity-90 transition-opacity',
      onclick: openCsv()
    }, [icon('file-up', { size: 14 }), el('span', {}, t('actions.openCsv'))]),
    el('button', {
      class: 'w-9 h-9 inline-flex items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm hover:bg-[var(--color-surface-2)] transition-colors',
      title: `Theme: ${state.theme}`,
      onclick: toggleTheme
    }, ThemeIcon({ theme: state.theme })),
    el('button', {
      class: 'px-2.5 h-9 inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-mono hover:bg-[var(--color-surface-2)] transition-colors',
      onclick: toggleLang
    }, [icon('languages', { size: 14 }), state.lang.toUpperCase()])
  ]);

  mobileMenuBtnEl = el('button', {
    class: 'sm:hidden w-9 h-9 inline-flex items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] transition-colors',
    title: t('actions.menu'),
    'aria-label': t('actions.menu'),
    onclick: (e) => { e.stopPropagation(); toggleMobileMenu(); }
  }, [icon(mobileMenuOpen ? 'x' : 'menu', { size: 18 })]);

  mobileMenuEl = el('div', {
    class: [
      'sm:hidden absolute right-2 top-full mt-2 z-30 min-w-56 max-w-[calc(100vw-1rem)] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg p-2',
      mobileMenuOpen ? '' : 'hidden'
    ].join(' '),
    onclick: e => e.stopPropagation()
  }, [
    el('div', { class: 'flex items-center justify-between mb-1 pb-2 border-b border-[var(--color-border)]' }, [
      el('span', { class: 'text-sm font-semibold' }, t('actions.menu')),
      el('button', {
        class: 'w-7 h-7 inline-flex items-center justify-center rounded-md text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)] transition-colors',
        'aria-label': t('actions.close'),
        title: t('actions.close'),
        onclick: (e) => { e.stopPropagation(); closeMobileMenu(); }
      }, icon('x', { size: 14 }))
    ]),
    el('button', {
      class: 'w-full inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--color-brand)] text-[var(--color-brand-fg)] text-sm font-medium hover:opacity-90 transition-opacity',
      onclick: openCsv()
    }, [icon('file-up', { size: 16 }), t('actions.openCsv')]),
    el('div', { class: 'border-t border-[var(--color-border)] my-2' }),
    sectionLabel(t('actions.theme')),
    el('div', { class: 'flex gap-1' }, [
      themeButton('system', 'monitor', t('kpi.system') || 'Auto'),
      themeButton('light', 'sun', t('kpi.light') || 'Claro'),
      themeButton('dark', 'moon', t('kpi.dark') || 'Oscuro')
    ]),
    el('div', { class: 'border-t border-[var(--color-border)] my-2' }),
    sectionLabel(t('actions.language')),
    el('div', { class: 'flex gap-1' }, [
      langButton('es', 'ES'),
      langButton('en', 'EN')
    ])
  ]);

  return el('header', {
    class: 'sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 sm:bg-[var(--color-surface)]/85 sm:backdrop-blur transition-shadow'
  }, el('div', {
    class: 'relative mx-auto max-w-[1600px] px-3 sm:px-6 py-3 flex items-center gap-3'
  }, [
    logoBox,
    el('div', { class: 'flex-1' }),
    desktopButtons,
    mobileMenuBtnEl,
    mobileMenuEl
  ]));
}
