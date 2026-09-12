import { readFile } from 'node:fs/promises';
import { parseCsvText } from '../src/lib/csv.js';

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node scripts/test-csv.mjs <path-to.csv>');
  process.exit(1);
}

const text = await readFile(csvPath, 'utf-8');
console.log('Read from:', csvPath);

const measurements = parseCsvText(text);
console.log('Total measurements:', measurements.length);
console.log('First:', measurements[0]);
console.log('Last:', measurements[measurements.length - 1]);
const keys = Object.keys(measurements[0]).filter(k => k !== 'sourceFilename' && k !== 'importedAt');
console.log('Fields detected:', keys.length);
console.log('Non-null counts:');
for (const k of keys) {
  const n = measurements.filter(m => m[k] != null).length;
  console.log(`  ${k}: ${n}`);
}
