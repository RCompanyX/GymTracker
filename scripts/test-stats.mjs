import { readFile } from 'node:fs/promises';
import { parseCsvText } from '../src/lib/csv.js';
import { stats, asPoints, slopePerWeek, deltaOverWindow } from '../src/lib/stats.js';

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node scripts/test-stats.mjs <path-to.csv>');
  process.exit(1);
}

const text = await readFile(csvPath, 'utf-8');
const m = parseCsvText(text);

console.log('=== Measurements ===');
console.log('Total:', m.length);
console.log('First date:', m[0].date);
console.log('Last date:', m[m.length - 1].date);
console.log();

console.log('=== Stats per field ===');
const fields = ['weight', 'bmi', 'bodyFat', 'viscFat', 'muscleMass', 'boneMass', 'bmr', 'metabAge', 'bodyWater', 'physiqueRating'];
for (const f of fields) {
  const pts = asPoints(m, f);
  const s = stats(pts.map(p => p.y));
  const slope = slopePerWeek(pts);
  const d7 = deltaOverWindow(pts, 7);
  console.log(`${f.padEnd(18)} n=${s.count} min=${s.min?.toFixed(2)} max=${s.max?.toFixed(2)} avg=${s.avg?.toFixed(2)} last=${s.last?.toFixed(2)} Δ=${s.delta?.toFixed(2)} (${s.deltaPct?.toFixed(2)}%) slope/wk=${slope?.toFixed(3)} Δ7d=${d7?.toFixed(2)}`);
}

console.log();
console.log('=== Weight progression ===');
const wpts = asPoints(m, 'weight');
for (const p of wpts) {
  console.log(p.x.slice(0, 10), p.y.toFixed(1) + ' kg');
}
