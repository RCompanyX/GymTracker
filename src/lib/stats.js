export function stats(values) {
  const clean = values.filter(v => v != null && Number.isFinite(v));
  if (clean.length === 0) {
    return { count: 0, min: null, max: null, avg: null, first: null, last: null, delta: null, deltaPct: null, slope: null };
  }
  let min = Infinity, max = -Infinity, sum = 0;
  for (const v of clean) {
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }
  const first = clean[0];
  const last = clean[clean.length - 1];
  const delta = last - first;
  const deltaPct = first !== 0 ? (delta / first) * 100 : null;
  return { count: clean.length, min, max, avg: sum / clean.length, first, last, delta, deltaPct, slope: null };
}

export function slopePerWeek(points) {
  const clean = points.filter(p => p.y != null && Number.isFinite(p.y));
  if (clean.length < 2) return null;
  const t0 = new Date(clean[0].x).getTime();
  const xs = clean.map(p => (new Date(p.x).getTime() - t0) / (7 * 86400000));
  const ys = clean.map(p => p.y);
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (ys[i] - meanY);
    den += (xs[i] - meanX) ** 2;
  }
  if (den === 0) return null;
  return num / den;
}

export function deltaOverWindow(points, days) {
  if (points.length === 0) return null;
  const last = points[points.length - 1];
  if (last.y == null) return null;
  const cutoff = new Date(last.x).getTime() - days * 86400000;
  let ref = null;
  for (const p of points) {
    if (new Date(p.x).getTime() >= cutoff && p.y != null) {
      ref = p;
      break;
    }
  }
  if (!ref) return null;
  return last.y - ref.y;
}

export function asPoints(measurements, field) {
  return measurements
    .filter(m => m.date && m[field] != null)
    .map(m => ({ x: m.date, y: m[field] }));
}
