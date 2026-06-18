import Papa from 'papaparse';

export const COLUMN_MAP = {
  'Date': 'date',
  'Weight (kg)': 'weight',
  'BMI': 'bmi',
  'Body Fat (%)': 'bodyFat',
  'Visc Fat': 'viscFat',
  'Muscle Mass (kg)': 'muscleMass',
  'Muscle Quality': 'muscleQuality',
  'Bone Mass (kg)': 'boneMass',
  'BMR (kcal)': 'bmr',
  'Metab Age': 'metabAge',
  'Body Water (%)': 'bodyWater',
  'Physique Rating': 'physiqueRating',
  'Muscle mass - right arm': 'muscleMassRightArm',
  'Muscle mass - left arm': 'muscleMassLeftArm',
  'Muscle mass - right leg': 'muscleMassRightLeg',
  'Muscle mass - left leg': 'muscleMassLeftLeg',
  'Muscle mass - trunk': 'muscleMassTrunk',
  'Muscle quality - right arm': 'muscleQualityRightArm',
  'Muscle quality - left arm': 'muscleQualityLeftArm',
  'Muscle quality - right leg': 'muscleQualityRightLeg',
  'Muscle quality - left leg': 'muscleQualityLeftLeg',
  'Muscle quality - trunk': 'muscleQualityTrunk',
  'Body fat (%) - right arm': 'bodyFatRightArm',
  'Body fat (%) - left arm': 'bodyFatLeftArm',
  'Body fat (%) - right leg': 'bodyFatRightLeg',
  'Body fat (%) - left leg': 'bodyFatLeftLeg',
  'Body fat (%) - trunk': 'bodyFatTrunk',
  'Heart rate': 'heartRate'
};

export const REQUIRED_COLUMNS = ['Date', 'Weight (kg)'];

function toNumberOrNull(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (s === '' || s === '-' || s === '—' || s.toLowerCase() === 'null') return null;
  const n = Number(s.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function normalizeDate(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/);
  if (m) {
    return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6])).toISOString();
  }
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function validateHeaders(headers) {
  const missing = REQUIRED_COLUMNS.filter(r => !headers.includes(r));
  if (missing.length) {
    throw new Error(`Faltan columnas requeridas: ${missing.join(', ')}`);
  }
}

export function parseCsvText(text) {
  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: h => h.trim()
  });

  if (result.errors.length) {
    const fatal = result.errors.find(e => e.type === 'Delimiter' || e.type === 'Quotes');
    if (fatal) throw new Error(`Error parseando CSV: ${fatal.message}`);
  }

  const headers = result.meta.fields || [];
  validateHeaders(headers);

  const measurements = [];
  for (const row of result.data) {
    const m = { sourceFilename: null, importedAt: new Date().toISOString() };
    for (const [csvKey, fieldKey] of Object.entries(COLUMN_MAP)) {
      if (fieldKey === 'sourceFilename' || fieldKey === 'importedAt') continue;
      const raw = row[csvKey];
      m[fieldKey] = fieldKey === 'date' ? normalizeDate(raw) : toNumberOrNull(raw);
    }
    if (!m.date) continue;
    measurements.push(m);
  }

  measurements.sort((a, b) => a.date.localeCompare(b.date));
  return measurements;
}

export async function parseCsvFile(file) {
  const text = await file.text();
  const measurements = parseCsvText(text);
  for (const m of measurements) m.sourceFilename = file.name;
  return measurements;
}

export function detectFileFormat(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] || '';
  const headers = firstLine.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
  return headers;
}
