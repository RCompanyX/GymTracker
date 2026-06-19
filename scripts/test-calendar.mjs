// Quick test of the month label logic
function getWeeksTest(measurements) {
  if (measurements.length === 0) return { weeks: [], monthLabels: [] };
  const dates = measurements.map(m => new Date(m.date));
  const minDate = new Date(Math.min(...dates));
  minDate.setHours(0, 0, 0, 0);
  const maxDate = new Date(Math.max(...dates));
  maxDate.setHours(0, 0, 0, 0);
  const dayOfWeek = (minDate.getDay() + 6) % 7;
  const firstMonday = new Date(minDate);
  firstMonday.setDate(minDate.getDate() - dayOfWeek);
  const lastDayOfWeek = (maxDate.getDay() + 6) % 7;
  const lastSunday = new Date(maxDate);
  lastSunday.setDate(maxDate.getDate() + (6 - lastDayOfWeek));
  const totalDays = Math.round((lastSunday - firstMonday) / 86400000) + 1;
  const totalWeeks = Math.ceil(totalDays / 7);
  const weeks = [];
  const monthLabels = new Array(totalWeeks).fill(null);
  const monthIndices = new Array(totalWeeks).fill(null);
  for (let w = 0; w < totalWeeks; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(firstMonday);
      cellDate.setDate(firstMonday.getDate() + w * 7 + d);
      const inRange = cellDate >= minDate && cellDate <= maxDate;
      week.push(cellDate.toISOString().slice(0, 10));
      if (d === 0 && inRange) {
        const month = cellDate.getMonth();
        monthIndices[w] = month;
        const prev = w > 0 ? monthIndices[w - 1] : -1;
        if (month !== prev) {
          monthLabels[w] = cellDate.toLocaleString('es', { month: 'short' });
        }
      }
    }
    weeks.push(week);
  }
  return { weeks, monthLabels, totalWeeks };
}

const measurements = [
  { date: '2026-04-14T07:20:38Z' },
  { date: '2026-04-23T07:20:41Z' },
  { date: '2026-04-28T07:21:48Z' },
  { date: '2026-05-06T07:36:31Z' },
  { date: '2026-05-12T07:29:43Z' },
  { date: '2026-05-14T07:28:32Z' },
  { date: '2026-05-14T07:29:20Z' },
  { date: '2026-05-22T07:20:00Z' },
  { date: '2026-05-25T07:31:17Z' },
  { date: '2026-05-26T07:27:43Z' },
  { date: '2026-05-30T08:53:35Z' },
  { date: '2026-06-03T07:29:17Z' },
  { date: '2026-06-07T09:04:21Z' },
  { date: '2026-06-13T08:47:20Z' },
  { date: '2026-06-16T07:20:45Z' }
];

const result = getWeeksTest(measurements);
console.log('Total weeks:', result.totalWeeks);
console.log('Month labels:', result.monthLabels.filter(Boolean));
console.log('Label positions:', result.monthLabels.map((l, i) => l ? `[${i}]=${l}` : null).filter(Boolean));
console.log('\nFirst week:', result.weeks[0]);
console.log('Last week:', result.weeks[result.weeks.length - 1]);
