const PREFIX = 'gymtracker:';

export function getPref(key, fallback) {
  try {
    const v = localStorage.getItem(PREFIX + key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}

export function setPref(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {}
}

export function removePref(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {}
}

export function getPrefSet(key) {
  const v = getPref(key, []);
  return Array.isArray(v) ? new Set(v) : new Set();
}

export function isWinDismissed(id) {
  return getPrefSet('dismissedWins').has(id);
}

export function dismissWin(id) {
  const set = getPrefSet('dismissedWins');
  if (set.has(id)) return;
  set.add(id);
  setPref('dismissedWins', Array.from(set));
}
