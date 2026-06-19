import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './style.css';

import { state, setMeasurements, setError, subscribe, applyTheme, t, setRange } from './lib/state.js';
import { setFormatLang } from './lib/format.js';
import { disposeAllCharts } from './lib/charts.js';
import { Header } from './components/header.js';
import { Dashboard } from './views/dashboard.js';
import { DropZone } from './components/dropZone.js';
import { el } from './lib/dom.js';
import { icon } from './lib/icons.js';

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

function renderEmpty() {
  const wrap = el('div', { class: 'mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-16' });

  const hero = el('div', { class: 'text-center mb-8 hero-enter' }, [
    el('div', {
      class: 'inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand)]/60 text-[var(--color-brand-fg)] mb-5 shadow-lg shadow-[var(--color-brand)]/20'
    }, icon('scale', { size: 40, 'stroke-width': 1.8 })),
    el('h1', { class: 'text-3xl sm:text-4xl font-bold tracking-tight mb-2' }, t('app.title')),
    el('p', { class: 'text-[var(--color-fg-muted)] text-base sm:text-lg max-w-md mx-auto' }, t('empty.welcomeSubtitle'))
  ]);
  wrap.appendChild(hero);

  wrap.appendChild(DropZone());

  wrap.appendChild(el('p', {
    class: 'text-center text-xs text-[var(--color-fg-muted)] mt-4'
  }, [
    icon('scale', { size: 12, class: 'inline-block align-[-1px] mr-1' }),
    t('empty.csvFormat')
  ]));

  return wrap;
}

function renderError() {
  if (!state.error) return null;
  return el('div', { class: 'mx-auto max-w-2xl mt-4 px-4 sm:px-6' }, el('div', {
    class: 'rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[var(--color-danger)] px-4 py-3 text-sm flex items-start gap-2 transition-colors'
  }, [
    icon('alert-circle', { size: 16, class: 'mt-0.5 shrink-0' }),
    el('span', { class: 'flex-1 whitespace-pre-line' }, state.error),
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
}

bootstrap();
