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
