import { el } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { t } from '../lib/state.js';
import { isWinDismissed, dismissWin } from '../lib/prefs.js';
import { detectWins } from '../lib/quickWins.js';

function formatMsg(template, params) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in params ? String(params[k]) : `{${k}}`));
}

export function QuickWins({ measurements }) {
  if (!measurements || measurements.length === 0) return null;
  const wins = detectWins(measurements);
  const visible = wins.find(w => !isWinDismissed(w.id));
  if (!visible) return null;

  const title = t(visible.titleKey);
  const rawMsg = t(visible.msgKey);
  const msg = formatMsg(rawMsg, visible.msgParams);

  const banner = el('div', {
    class: `qw-banner qw-banner--${visible.variant}`,
    role: 'status'
  });

  const iconWrap = el('div', { class: 'qw-banner__icon shrink-0' }, icon(visible.icon, { size: 18 }));
  const textWrap = el('div', { class: 'flex-1 min-w-0' }, [
    el('div', { class: 'qw-banner__title text-sm font-semibold' }, title),
    el('div', { class: 'qw-banner__msg text-xs text-[var(--color-fg-muted)] mt-0.5' }, msg)
  ]);

  const closeBtn = el('button', {
    class: 'qw-banner__close shrink-0 w-7 h-7 inline-flex items-center justify-center rounded-md opacity-60 hover:opacity-100 transition-opacity',
    title: t('quickWins.dismiss'),
    'aria-label': t('quickWins.dismiss'),
    onclick: () => {
      dismissWin(visible.id);
      banner.remove();
    }
  }, icon('x', { size: 14 }));

  banner.append(iconWrap, textWrap, closeBtn);
  return banner;
}
