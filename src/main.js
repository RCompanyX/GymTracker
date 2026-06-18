import './style.css';

import { isFsaSupported, queryStoredHandle, pickFolder, listCsvsInFolder, pickCsvFile } from './lib/folder.js';
import { parseCsvFile } from './lib/csv.js';
import { state, setMeasurements, setError, subscribe, applyTheme, t, setLang } from './lib/state.js';
import { setFormatLang } from './lib/format.js';
import { disposeAllCharts } from './lib/charts.js';
import { Header } from './components/header.js';
import { Dashboard } from './views/dashboard.js';
import { el } from './lib/dom.js';

async function tryAutoLoad() {
  if (!isFsaSupported()) return false;
  const { state: hs, handle } = await queryStoredHandle();
  if (hs !== 'granted' || !handle) return false;
  const csvs = await listCsvsInFolder(handle);
  if (csvs.length === 0) { setError(t('empty.noCsvInFolder')); return false; }
  const file = await csvs[0].getFile();
  const m = await parseCsvFile(file);
  setMeasurements(m, { folderName: handle.name, fileName: file.name });
  return true;
}

function renderEmpty() {
  const fsa = isFsaSupported();
  const wrap = el('div', { class: 'mx-auto max-w-2xl px-6 py-16' });
  const card = el('div', {
    class: 'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-8 shadow-sm'
  });
  card.append(
    el('h1', { class: 'text-2xl font-semibold mb-2' }, t('app.title')),
    el('p', { class: 'text-[var(--color-fg-muted)] mb-6' },
      fsa ? t('folder.prompt') : t('folder.unsupported'))
  );

  const actions = el('div', { class: 'flex flex-wrap gap-3' });
  if (fsa) {
    actions.appendChild(el('button', {
      class: 'px-4 py-2 rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-fg)] font-medium hover:opacity-90',
      onclick: async () => {
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
      }
    }, t('actions.pickFolder')));
  }
  actions.appendChild(el('button', {
    class: 'px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-3)]',
    onclick: async () => {
      try {
        const file = await pickCsvFile();
        const m = await parseCsvFile(file);
        setMeasurements(m, { fileName: file.name });
      } catch (e) {
        if (e?.name !== 'AbortError' && e?.message !== 'No se seleccionó archivo') setError(e.message);
      }
    }
  }, t('actions.openCsv')));

  card.appendChild(actions);
  wrap.appendChild(card);
  return wrap;
}

function renderError() {
  if (!state.error) return null;
  return el('div', { class: 'mx-auto max-w-2xl mt-4 px-6' }, el('div', {
    class: 'rounded-lg border border-[var(--color-danger)] bg-[var(--color-surface-2)] text-[var(--color-danger)] px-4 py-3 text-sm flex items-start justify-between gap-3'
  }, [
    el('span', {}, state.error),
    el('button', {
      class: 'opacity-70 hover:opacity-100',
      onclick: () => setError(null)
    }, '✕')
  ]));
}

function render() {
  disposeAllCharts();
  const root = document.getElementById('app');
  root.innerHTML = '';
  applyTheme();

  root.appendChild(Header());

  const err = renderError();
  if (err) root.appendChild(err);

  if (state.measurements.length === 0) {
    root.appendChild(renderEmpty());
  } else {
    root.appendChild(Dashboard());
  }
}

async function bootstrap() {
  setFormatLang(state.lang);
  document.documentElement.lang = state.lang;
  applyTheme();
  subscribe(() => { document.documentElement.lang = state.lang; render(); });
  render();
  try {
    await tryAutoLoad();
  } catch (e) {
    if (e?.name !== 'AbortError') setError(e.message);
  }
  render();
}

bootstrap();
