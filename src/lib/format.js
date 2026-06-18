import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const LOCALES = { es, en: enUS };

export function fmtNumber(value, decimals = 1) {
  if (value == null || !Number.isFinite(value)) return '—';
  return value.toLocaleString(LOCALES_KEY(), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function fmtSigned(value, decimals = 1, suffix = '') {
  if (value == null || !Number.isFinite(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString(LOCALES_KEY(), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}${suffix}`;
}

export function fmtPercent(value, decimals = 1) {
  if (value == null || !Number.isFinite(value)) return '—';
  return `${value > 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function fmtDate(iso, pattern = 'yyyy-MM-dd HH:mm') {
  if (!iso) return '—';
  try {
    return format(parseISO(iso), pattern, { locale: LOCALES[LOCALES_KEY()] });
  } catch {
    return iso;
  }
}

export function fmtDateShort(iso) {
  return fmtDate(iso, 'yyyy-MM-dd');
}

export function fmtRelative(iso) {
  if (!iso) return '—';
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: LOCALES[LOCALES_KEY()] });
  } catch {
    return iso;
  }
}

let _currentLang = 'es';
export function setFormatLang(lang) { _currentLang = lang; }
function LOCALES_KEY() { return _currentLang || 'es'; }
