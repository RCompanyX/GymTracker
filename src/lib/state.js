import { getPref, setPref } from './prefs.js';
import { DICTS, t as translate } from '../i18n/dict.js';

export const state = {
  measurements: [],
  folderName: null,
  fileName: null,
  theme: getPref('theme', 'system'),
  lang: getPref('lang', 'es'),
  range: { preset: 'all', from: null, to: null },
  visibleMetrics: getPref('visibleMetrics', [
    'weight', 'bmi', 'bodyFat', 'muscleMass', 'viscFat',
    'boneMass', 'bmr', 'metabAge', 'bodyWater', 'physiqueRating'
  ]),
  error: null
};

export function t(key) { return translate(state.lang, key); }

const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function notify() { for (const fn of listeners) fn(state); }

export function setLang(lang) {
  if (!DICTS[lang]) return;
  state.lang = lang;
  setPref('lang', lang);
  notify();
}

export function setTheme(theme) {
  state.theme = theme;
  setPref('theme', theme);
  applyTheme();
  notify();
}

export function applyTheme() {
  const root = document.documentElement;
  if (state.theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', state.theme);
  }
}

if (typeof window !== 'undefined') {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener?.('change', () => {
    if (state.theme === 'system') applyTheme();
  });
}

export function setMeasurements(measurements, meta = {}) {
  state.measurements = measurements;
  state.folderName = meta.folderName ?? state.folderName;
  state.fileName = meta.fileName ?? state.fileName;
  state.error = null;
  notify();
}

export function setError(message) {
  state.error = message;
  notify();
}

export function setRange(preset, from = null, to = null) {
  state.range = { preset, from, to };
  notify();
}

export function setVisibleMetrics(list) {
  state.visibleMetrics = list;
  setPref('visibleMetrics', list);
  notify();
}

export function filteredMeasurements() {
  const { preset, from, to } = state.range;
  if (preset === 'all' || state.measurements.length === 0) return state.measurements;
  let start = null, end = null;
  const now = new Date();
  if (preset === '1m') start = new Date(now.getTime() - 30 * 86400000);
  else if (preset === '3m') start = new Date(now.getTime() - 90 * 86400000);
  else if (preset === '6m') start = new Date(now.getTime() - 180 * 86400000);
  else if (preset === '1y') start = new Date(now.getTime() - 365 * 86400000);
  else if (preset === 'custom') {
    start = from ? new Date(from) : null;
    end = to ? new Date(to + 'T23:59:59') : null;
  }
  return state.measurements.filter(m => {
    const d = new Date(m.date);
    if (start && d < start) return false;
    if (end && d > end) return false;
    return true;
  });
}
