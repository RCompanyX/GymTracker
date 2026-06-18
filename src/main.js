import './style.css';

import { isFsaSupported, queryStoredHandle, pickFolder, listCsvsInFolder, pickCsvFile } from './lib/folder.js';
import { parseCsvFile } from './lib/csv.js';
import { state, setMeasurements, setError, subscribe, applyTheme, t, setLang, setRange } from './lib/state.js';
import { setFormatLang } from './lib/format.js';
import { disposeAllCharts } from './lib/charts.js';
import { Header } from './components/header.js';
import { Dashboard } from './views/dashboard.js';
import { EmptyState } from './components/emptyState.js';
import { el } from './lib/dom.js';
import { icon } from './lib/icons.js';

let headerEl = null;
let headerObserver = null;

function setupHeaderObserver() {
  if (headerObserver) headerObserver.disconnect();
  const sentinel = document.getElementById('header-sentinel');
  const header = document.querySelector('header.sticky');
  if (!sentinel || !header) return;
  headerObserver = new IntersectionObserver(([entry]) => {
    header.classList.toggle('scrolled', !entry.isIntersecting);
  }, { rootMargin: '-1px 0px 0px 0px', threshold: 0 });
  headerObserver.observe(sentinel);
}

function setupBrushSync() {
  document.addEventListener('gymtracker:brush', (e) => {
    const { fromTs, toTs } = e.detail || {};
    if (fromTs == null || toTs == null) return;
    const from = new Date(fromTs).toISOString().slice(0, 10);
    const to = new Date(toTs).toISOString().slice(0, 10);
    setRange('custom', from, to);
  });
}

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
    el('div', { class: 'inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] mb-4' },
      icon('dumbbell', { size: 28, 'stroke-width': 1.8 })),
    el('h1', { class: 'text-2xl font-semibold mb-2' }, t('app.title')),
    el('p', { class: 'text-[var(--color-fg-muted)] mb-6' },
      fsa ? t('folder.prompt') : t('folder.unsupported'))
  );

  const actions = el('div', { class: 'flex flex-wrap gap-3' });
  if (fsa) {
    actions.appendChild(el('button', {
      class: 'inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-fg)] font-medium hover:opacity-90 transition-opacity',
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
    }, [icon('folder-open', { size: 16 }), t('actions.pickFolder')]));
  }
  actions.appendChild(el('button', {
    class: 'inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-3)] transition-colors',
    onclick: async () => {
      try {
        const file = await pickCsvFile();
        const m = await parseCsvFile(file);
        setMeasurements(m, { fileName: file.name });
      } catch (e) {
        if (e?.name !== 'AbortError' && e?.message !== 'No se seleccionó archivo') setError(e.message);
      }
    }
  }, [icon('file-up', { size: 16 }), t('actions.openCsv')]));

  card.appendChild(actions);
  wrap.appendChild(card);
  return wrap;
}

function renderError() {
  if (!state.error) return null;
  return el('div', { class: 'mx-auto max-w-2xl mt-4 px-6' }, el('div', {
    class: 'rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[var(--color-danger)] px-4 py-3 text-sm flex items-start gap-2 transition-colors'
  }, [
    icon('alert-circle', { size: 16, class: 'mt-0.5 shrink-0' }),
    el('span', { class: 'flex-1' }, state.error),
    el('button', {
      class: 'opacity-70 hover:opacity-100 transition-opacity',
      onclick: () => setError(null)
    }, icon('x', { size: 14 }))
  ]));
}

function render() {
  disposeAllCharts();
  const root = document.getElementById('app');
  root.innerHTML = '';
  applyTheme();

  root.appendChild(el('div', { id: 'header-sentinel', class: 'h-0' }));
  root.appendChild(Header());

  const err = renderError();
  if (err) root.appendChild(err);

  if (state.measurements.length === 0) {
    root.appendChild(renderEmpty());
  } else {
    root.appendChild(Dashboard());
  }

  setupHeaderObserver();
}

async function bootstrap() {
  setFormatLang(state.lang);
  document.documentElement.lang = state.lang;
  applyTheme();
  setupBrushSync();
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
