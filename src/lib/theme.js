import { state, applyTheme, subscribe } from './state.js';

const ROOT = document.documentElement;
const SUBS = new Set();

export function currentTheme() {
  if (state.theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return state.theme;
}

let _ctx = null;
function ctx2d() {
  if (!_ctx) _ctx = document.createElement('canvas').getContext('2d');
  return _ctx;
}

export function toRgb(cssColor) {
  if (!cssColor) return null;
  const c = ctx2d();
  c.fillStyle = '#000000';
  c.fillStyle = cssColor;
  return c.fillStyle;
}

export function withAlpha(cssColor, alpha) {
  const rgb = toRgb(cssColor);
  if (!rgb) return cssColor;
  const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return cssColor;
  return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`;
}

function readToken(name) {
  return getComputedStyle(ROOT).getPropertyValue(name).trim();
}

export function tokens() {
  return {
    bg: toRgb(readToken('--color-surface')),
    bg2: toRgb(readToken('--color-surface-2')),
    bg3: toRgb(readToken('--color-surface-3')),
    fg: toRgb(readToken('--color-fg')),
    fgMuted: toRgb(readToken('--color-fg-muted')),
    border: toRgb(readToken('--color-border')),
    brand: toRgb(readToken('--color-brand')),
    success: toRgb(readToken('--color-success')),
    warn: toRgb(readToken('--color-warn')),
    danger: toRgb(readToken('--color-danger'))
  };
}

export function onThemeChange(fn) {
  SUBS.add(fn);
  return () => SUBS.delete(fn);
}

subscribe(() => {
  for (const fn of SUBS) fn(currentTheme());
});

if (typeof window !== 'undefined') {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener?.('change', () => {
    if (state.theme === 'system') {
      for (const fn of SUBS) fn(currentTheme());
    }
  });
}
