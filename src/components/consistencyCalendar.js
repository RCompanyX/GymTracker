import { el } from '../lib/dom.js';
import { fmtDateShort, fmtNumber } from '../lib/format.js';
import { icon } from '../lib/icons.js';

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayKey(d) {
  return d.toISOString().slice(0, 10);
}

function getWeeks(measurements) {
  if (measurements.length === 0) return { weeks: [], monthLabels: [] };
  const dates = measurements.map(m => new Date(m.date));
  const minDate = startOfDay(new Date(Math.min(...dates)));
  const maxDate = startOfDay(new Date(Math.max(...dates)));
  const dayOfWeek = (minDate.getDay() + 6) % 7;
  const firstMonday = new Date(minDate);
  firstMonday.setDate(minDate.getDate() - dayOfWeek);

  const lastDayOfWeek = (maxDate.getDay() + 6) % 7;
  const lastSunday = new Date(maxDate);
  lastSunday.setDate(maxDate.getDate() + (6 - lastDayOfWeek));

  const measurementByDay = new Map();
  for (const m of measurements) {
    const k = dayKey(startOfDay(new Date(m.date)));
    if (!measurementByDay.has(k)) measurementByDay.set(k, m);
  }

  const totalDays = Math.round((lastSunday - firstMonday) / 86400000) + 1;
  const totalWeeks = Math.ceil(totalDays / 7);

  const weeks = [];
  const monthLabels = new Array(totalWeeks).fill(null);

  for (let w = 0; w < totalWeeks; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(firstMonday);
      cellDate.setDate(firstMonday.getDate() + w * 7 + d);
      const k = dayKey(cellDate);
      const m = measurementByDay.get(k);
      const inRange = cellDate >= minDate && cellDate <= maxDate;
      week.push({ date: cellDate, m, inRange });

      if (d === 0 && inRange) {
        const month = cellDate.getMonth();
        const prev = w > 0 ? monthLabels[w - 1] : -1;
        if (month !== prev) {
          monthLabels[w] = cellDate.toLocaleString(state_lang(), { month: 'short' });
        }
      }
    }
    weeks.push(week);
  }

  return { weeks, monthLabels };
}

function state_lang() {
  return document.documentElement.lang || 'es';
}

export function ConsistencyCalendar({ measurements }) {
  if (measurements.length === 0) return null;

  const { weeks, monthLabels } = getWeeks(measurements);
  const totalDays = weeks.length * 7;
  const measuredDays = weeks.flat().filter(c => c.m).length;
  const consistency = totalDays > 0 ? (measuredDays / totalDays) * 100 : 0;
  const dayLabels = state_lang() === 'es'
    ? ['L', 'M', 'X', 'J', 'V', 'S', 'D']
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const grid = el('div', { class: 'flex gap-1' });

  const dayLabelsCol = el('div', { class: 'flex flex-col gap-0.5 text-[10px] text-[var(--color-fg-muted)] pr-1 justify-start' });
  for (let d = 0; d < 7; d++) {
    const isWeekend = d >= 5;
    const lbl = el('div', {
      class: `h-3 leading-3 ${isWeekend ? 'opacity-50' : ''}`
    }, dayLabels[d]);
    dayLabelsCol.appendChild(lbl);
  }
  grid.appendChild(dayLabelsCol);

  const weeksContainer = el('div', { class: 'flex gap-0.5 overflow-x-auto scrollbar-thin' });

  const monthRow = el('div', { class: 'flex gap-0.5 h-3 text-[10px] text-[var(--color-fg-muted)] mb-0.5' });
  for (const lbl of monthLabels) {
    monthRow.appendChild(el('div', { class: 'w-3 shrink-0' }, lbl || ''));
  }
  weeksContainer.appendChild(monthRow);

  const weeksRow = el('div', { class: 'flex gap-0.5' });
  for (const week of weeks) {
    const weekCol = el('div', { class: 'flex flex-col gap-0.5' });
    for (const cell of week) {
      const title = cell.m
        ? `${fmtDateShort(cell.date.toISOString())} · ${fmtNumber(cell.m.weight, 1)} kg`
        : cell.inRange ? fmtDateShort(cell.date.toISOString()) : '';
      const cellEl = el('div', {
        class: [
          'w-3 h-3 rounded-sm transition-colors',
          cell.m ? 'bg-[var(--color-brand)]' : cell.inRange ? 'bg-[var(--color-surface-3)]' : 'bg-transparent'
        ].join(' '),
        title
      });
      weekCol.appendChild(cellEl);
    }
    weeksRow.appendChild(weekCol);
  }
  weeksContainer.appendChild(weeksRow);
  grid.appendChild(weeksContainer);

  const legend = el('div', { class: 'flex items-center gap-2 mt-3 text-xs text-[var(--color-fg-muted)]' }, [
    el('span', {}, 'Menos'),
    el('div', { class: 'flex gap-1' }, [
      el('div', { class: 'w-3 h-3 rounded-sm bg-[var(--color-surface-3)]' }),
      el('div', { class: 'w-3 h-3 rounded-sm bg-[var(--color-brand)]/40' }),
      el('div', { class: 'w-3 h-3 rounded-sm bg-[var(--color-brand)]/70' }),
      el('div', { class: 'w-3 h-3 rounded-sm bg-[var(--color-brand)]' })
    ]),
    el('span', {}, 'Más'),
    el('div', { class: 'flex-1' }),
    el('span', { class: 'font-mono' }, `${measuredDays}/${totalDays} días · ${consistency.toFixed(0)}%`)
  ]);

  return el('div', {
    class: 'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4'
  }, [
    el('div', { class: 'flex items-center gap-2 mb-3' }, [
      icon('calendar', { size: 16, class: 'text-[var(--color-brand)]' }),
      el('h3', { class: 'text-sm font-semibold' }, state_lang() === 'es' ? 'Consistencia' : 'Consistency')
    ]),
    grid,
    legend
  ]);
}
