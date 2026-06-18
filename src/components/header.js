import { el } from '../lib/dom.js';
import { state, setTheme, setLang, t } from '../lib/state.js';
import { setFormatLang } from '../lib/format.js';
import { isFsaSupported, pickCsvFile, pickFolder, listCsvsInFolder } from '../lib/folder.js';
import { parseCsvFile } from '../lib/csv.js';
import { setMeasurements, setError } from '../lib/state.js';
import { icon } from '../lib/icons.js';

function ThemeIcon({ theme }) {
  if (theme === 'light') return icon('sun', { size: 16 });
  if (theme === 'dark') return icon('moon', { size: 16 });
  return icon('monitor', { size: 16 });
}

function openCsv() {
  return async () => {
    try {
      const file = await pickCsvFile();
      const m = await parseCsvFile(file);
      setMeasurements(m, { fileName: file.name });
    } catch (e) {
      if (e?.name !== 'AbortError' && e?.message !== 'No se seleccionó archivo') setError(e.message);
    }
  };
}

function changeFolder() {
  return async () => {
    try {
      const handle = await pickFolder();
      const csvs = await listCsvsInFolder(handle);
      if (csvs.length === 0) { setError(t('empty.noCsvInFolder')); return; }
      const file = await csvs[0].getFile();
      const m = await parseCsvFile(file);
      setMeasurements(m, { folderName: handle.name, fileName: file.name });
    } catch (e) {
      if (e?.name !== 'AbortError') setError(e.message);
    }
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

export function Header() {
  const fsa = isFsaSupported();

  const subtitle = state.fileName
    ? el('div', { class: 'text-xs text-[var(--color-fg-muted)] truncate' },
        `${state.fileName}${state.folderName ? ` · ${state.folderName}` : ''} · ${state.measurements.length}`)
    : null;

  const logoBox = el('div', { class: 'flex items-center gap-2' }, [
    el('div', {
      class: 'w-8 h-8 rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-fg)] flex items-center justify-center shrink-0'
    }, icon('dumbbell', { size: 18, 'stroke-width': 2.5 })),
    el('div', { class: 'min-w-0' }, [
      el('div', { class: 'font-semibold truncate' }, t('app.title')),
      subtitle
    ])
  ]);

  const buttons = el('div', { class: 'flex items-center gap-1.5' }, [
    fsa && state.measurements.length > 0
      ? el('button', {
          class: 'hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm hover:bg-[var(--color-surface-2)] transition-colors',
          title: t('actions.changeFolder'),
          onclick: changeFolder()
        }, [icon('folder-open', { size: 14 }), el('span', { class: 'hidden md:inline' }, t('actions.changeFolder'))])
      : null,
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

  return el('header', {
    class: 'sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-surface)]/85 backdrop-blur transition-shadow'
  }, el('div', {
    class: 'mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center gap-3'
  }, [
    logoBox,
    el('div', { class: 'flex-1' }),
    buttons
  ]));
}
