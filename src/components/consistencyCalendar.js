import { el } from '../lib/dom.js';
import { fmtDateShort, fmtNumber } from '../lib/format.js';
import { icon } from '../lib/icons.js';
import { t } from '../lib/state.js';

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayKey(d) {
  return d.toISOString().slice(0, 10);
}

function state_lang() {
  return document.documentElement.lang || 'es';
}

function getWeeks(measurements, minWeeks = 0) {
  if (measurements.length === 0) return { weeks: [], monthLabels: [] };
  const dates = measurements.map(m => new Date(m.date));
  const minDate = startOfDay(new Date(Math.min(...dates)));
  const maxDate = startOfDay(new Date(Math.max(...dates)));
  // Keep the activity timeline current even when no recent weigh-ins exist.
  const displayEnd = new Date(Math.max(maxDate, startOfDay(new Date())));
  const dayOfWeek = (minDate.getDay() + 6) % 7;
  const firstMonday = new Date(minDate);
  firstMonday.setDate(minDate.getDate() - dayOfWeek);

  const lastDayOfWeek = (displayEnd.getDay() + 6) % 7;
  const lastSunday = new Date(displayEnd);
  lastSunday.setDate(displayEnd.getDate() + (6 - lastDayOfWeek));

  const measurementByDay = new Map();
  for (const m of measurements) {
    const k = dayKey(startOfDay(new Date(m.date)));
    if (!measurementByDay.has(k)) measurementByDay.set(k, m);
  }

  const totalDays = Math.round((lastSunday - firstMonday) / 86400000) + 1;
  const totalWeeks = Math.max(Math.ceil(totalDays / 7), minWeeks);

  const weeks = [];
  const monthLabels = new Array(totalWeeks).fill(null);
  const monthIndices = new Array(totalWeeks).fill(null);

  for (let w = 0; w < totalWeeks; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(firstMonday);
      cellDate.setDate(firstMonday.getDate() + w * 7 + d);
      const k = dayKey(cellDate);
      const m = measurementByDay.get(k);
      const inRange = cellDate >= minDate && cellDate <= displayEnd;
      const filler = cellDate > displayEnd;
      week.push({ date: cellDate, m, inRange, filler });

      if (d === 0) {
        const month = cellDate.getMonth();
        monthIndices[w] = month;
        const prev = w > 0 ? monthIndices[w - 1] : -1;
        if (month !== prev) {
          monthLabels[w] = cellDate.toLocaleString(state_lang(), { month: 'short' });
        }
      }
    }
    weeks.push(week);
  }

  return { weeks, monthLabels };
}

export function ConsistencyCalendar({ measurements, minWeeks = 0 }) {
  if (measurements.length === 0) return null;

  const { weeks, monthLabels } = getWeeks(measurements, minWeeks);
  const totalDays = weeks.flat().filter(c => c.inRange).length;
  const measuredDays = weeks.flat().filter(c => c.m).length;
  const consistency = totalDays > 0 ? (measuredDays / totalDays) * 100 : 0;
  const lang = state_lang();
  const dayLabels = lang === 'es'
    ? ['L', 'M', 'X', 'J', 'V', 'S', 'D']
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const grid = el('div', { class: 'consistency-scroll scrollbar-thin' },
    el('div', { class: 'consistency-grid' }));

  const dayLabelsCol = el('div', { class: 'consistency-day-labels text-[10px] text-[var(--color-fg-muted)]' });
  for (let d = 0; d < 7; d++) {
    const isWeekend = d >= 5;
    dayLabelsCol.appendChild(el('div', {
      class: `flex items-center justify-center ${isWeekend ? 'opacity-50' : ''}`
    }, dayLabels[d]));
  }
  const gridContent = grid.firstElementChild;
  gridContent.appendChild(dayLabelsCol);

  const weeksContainer = el('div', {
    class: 'consistency-weeks-container',
    style: { width: `min(100%, ${Math.max(0, weeks.length * 14 - 2)}px)` }
  });

  const weekGridStyle = {
    gridTemplateColumns: `repeat(${weeks.length}, minmax(var(--calendar-cell-size), 1fr))`
  };
  const monthRow = el('div', {
    class: 'consistency-week-grid consistency-month-row text-[10px] text-[var(--color-fg-muted)] mb-0.5',
    style: weekGridStyle
  });
  for (const lbl of monthLabels) {
    monthRow.appendChild(el('div', { class: 'min-w-0 overflow-visible whitespace-nowrap' }, lbl || ''));
  }
  weeksContainer.appendChild(monthRow);

  const weeksRow = el('div', { class: 'consistency-week-grid', style: weekGridStyle });
  for (const week of weeks) {
    const weekCol = el('div', { class: 'flex min-w-0 flex-col gap-0.5' });
    for (const cell of week) {
      const title = cell.m
        ? `${fmtDateShort(cell.date.toISOString())} · ${fmtNumber(cell.m.weight, 1)} kg`
        : cell.inRange ? fmtDateShort(cell.date.toISOString()) : '';
      const cellEl = el('div', {
        class: [
          'aspect-square w-full rounded-sm transition-colors',
          cell.m ? 'bg-[var(--color-brand)]' : cell.inRange || cell.filler ? 'bg-[var(--color-surface-3)]' : 'bg-transparent'
        ].join(' '),
        title
      });
      weekCol.appendChild(cellEl);
    }
    weeksRow.appendChild(weekCol);
  }
  weeksContainer.appendChild(weeksRow);
  gridContent.appendChild(weeksContainer);

  const legend = el('div', { class: 'flex flex-wrap items-center gap-2 mt-3 text-xs text-[var(--color-fg-muted)]' }, [
    el('div', { class: 'flex items-center gap-1.5' }, [
      el('div', { class: 'w-3 h-3 rounded-sm bg-[var(--color-surface-3)]' }),
      el('span', {}, t('calendar.noRecord'))
    ]),
    el('div', { class: 'flex gap-1' }, [
      el('div', { class: 'w-3 h-3 rounded-sm bg-[var(--color-brand)]' })
    ]),
    el('span', {}, t('calendar.recorded')),
    el('div', { class: 'flex-1' }),
    el('span', { class: 'font-mono' }, `${measuredDays}/${totalDays} ${t('calendar.days')} · ${consistency.toFixed(0)}%`)
  ]);

  const card = el('div', {
    class: 'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4'
  }, [
    el('div', { class: 'flex items-center gap-2 mb-3' }, [
      icon('calendar', { size: 16, class: 'text-[var(--color-brand)]' }),
      el('h3', { class: 'text-sm font-semibold' }, t('calendar.title'))
    ]),
    grid,
    legend
  ]);

  if (minWeeks === 0) {
    requestAnimationFrame(() => {
      if (!card.isConnected) return;
      const availableWidth = card.clientWidth - 52;
      const requiredWeeks = Math.floor(availableWidth / 14);
      if (requiredWeeks > weeks.length) {
        card.replaceWith(ConsistencyCalendar({ measurements, minWeeks: requiredWeeks }));
      }
    });
  }

  return card;
}
