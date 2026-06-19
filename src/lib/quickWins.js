const RECENT_DELTA_THRESHOLD = 0.3;
const MILESTONE_STEP_KG = 1;
const STREAK_WINDOW_DAYS = 28;
const STREAK_MIN_COUNT = 4;
const DAY_MS = 86400000;

function round1(n) {
  return Math.round(n * 10) / 10;
}

function isFinishedMeasurement(m) {
  return m && m.date && Number.isFinite(m.weight);
}

function asWeights(measurements) {
  return measurements
    .filter(isFinishedMeasurement)
    .map(m => ({ date: m.date, weight: m.weight }));
}

function dateOnly(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

function detectedStarted(weights) {
  if (weights.length !== 1) return null;
  return {
    id: 'started',
    variant: 'warn',
    icon: 'scale',
    titleKey: 'quickWins.startedTitle',
    msgKey: 'quickWins.startedMsg',
    msgParams: {}
  };
}

function detectedRecord(weights) {
  if (weights.length < 2) return null;
  const min = Math.min(...weights.map(w => w.weight));
  const last = weights[weights.length - 1].weight;
  if (last !== min) return null;
  return {
    id: `low-${round1(min)}`,
    variant: 'brand',
    icon: 'trending-down',
    titleKey: 'quickWins.recordTitle',
    msgKey: 'quickWins.recordMsg',
    msgParams: { weight: round1(min) }
  };
}

function detectedMilestone(weights) {
  if (weights.length < 2) return null;
  const first = weights[0].weight;
  const last = weights[weights.length - 1].weight;
  const delta = last - first;
  if (delta === 0) return null;
  const isLoss = delta < 0;
  const abs = Math.abs(delta);
  const reached = Math.floor(abs / MILESTONE_STEP_KG) * MILESTONE_STEP_KG;
  if (reached < MILESTONE_STEP_KG) return null;
  return {
    id: `milestone-${isLoss ? 'loss' : 'gain'}-${reached}`,
    variant: isLoss ? 'success' : 'success',
    icon: 'check',
    titleKey: isLoss ? 'quickWins.milestoneLossTitle' : 'quickWins.milestoneGainTitle',
    msgKey: isLoss ? 'quickWins.milestoneLossMsg' : 'quickWins.milestoneGainMsg',
    msgParams: { kg: reached }
  };
}

function detectedRecentChange(weights) {
  if (weights.length < 2) return null;
  const last = weights[weights.length - 1];
  const prev = weights[weights.length - 2];
  const delta = last.weight - prev.weight;
  if (Math.abs(delta) < RECENT_DELTA_THRESHOLD) return null;
  const isLoss = delta < 0;
  return {
    id: `change-${dateOnly(prev.date)}-${round1(Math.abs(delta))}`,
    variant: isLoss ? 'success' : 'danger',
    icon: isLoss ? 'trending-down' : 'trending-up',
    titleKey: isLoss ? 'quickWins.lossTitle' : 'quickWins.gainTitle',
    msgKey: isLoss ? 'quickWins.lossMsg' : 'quickWins.gainMsg',
    msgParams: { kg: round1(Math.abs(delta)) }
  };
}

function detectedStreak(measurements) {
  const cutoff = Date.now() - STREAK_WINDOW_DAYS * DAY_MS;
  const recent = measurements.filter(m => {
    if (!isFinishedMeasurement(m)) return false;
    const t = new Date(m.date).getTime();
    return t >= cutoff;
  });
  if (recent.length < STREAK_MIN_COUNT) return null;
  return {
    id: `streak-${recent.length}-in-${STREAK_WINDOW_DAYS}d`,
    variant: 'success',
    icon: 'calendar',
    titleKey: 'quickWins.streakTitle',
    msgKey: 'quickWins.streakMsg',
    msgParams: { count: recent.length, days: STREAK_WINDOW_DAYS }
  };
}

const DETECTORS = [
  detectedRecord,
  detectedMilestone,
  detectedRecentChange,
  detectedStreak,
  detectedStarted
];

export function detectWins(measurements) {
  if (!Array.isArray(measurements) || measurements.length === 0) return [];
  const weights = asWeights(measurements);
  if (weights.length === 0) return [];
  const out = [];
  for (const fn of DETECTORS) {
    const w = fn(weights, measurements);
    if (w) out.push(w);
  }
  return out;
}
