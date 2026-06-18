import * as echarts from 'echarts';
import { tokens, withAlpha, onThemeChange } from './theme.js';

const INSTANCES = new Set();

function baseOption(extra = {}) {
  const t = tokens();
  return {
    backgroundColor: 'transparent',
    textStyle: { color: t.fg, fontFamily: 'inherit' },
    grid: { left: 56, right: 24, top: 32, bottom: 36, containLabel: false },
    tooltip: {
      trigger: 'axis',
      backgroundColor: t.bg2,
      borderColor: t.border,
      textStyle: { color: t.fg }
    },
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: t.border } },
      axisLabel: { color: t.fgMuted }
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: t.border, opacity: 0.4 } },
      axisLabel: { color: t.fgMuted }
    },
    ...extra
  };
}

function buildSeries(points, opts) {
  const t = tokens();
  return {
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 5,
    showSymbol: points.length < 50,
    lineStyle: { width: 2, color: t.brand },
    itemStyle: { color: t.brand },
    areaStyle: opts.area ? {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: withAlpha(t.brand, 0.4) },
          { offset: 1, color: withAlpha(t.brand, 0) }
        ]
      }
    } : undefined,
    data: points.map(p => [p.x, p.y])
  };
}

export function mountLineChart(container, points, opts = {}) {
  container.style.width = '100%';
  if (!container.style.height) container.style.height = '192px';

  const chart = echarts.init(container, null, { renderer: 'canvas' });
  chart.setOption(baseOption({ series: [buildSeries(points, opts)] }));

  const resize = () => chart.resize();
  window.addEventListener('resize', resize);

  let disposed = false;
  const unsub = onThemeChange(() => {
    if (disposed) return;
    try {
      const t = tokens();
      chart.setOption({
        tooltip: { backgroundColor: t.bg2, borderColor: t.border, textStyle: { color: t.fg } },
        xAxis: { axisLine: { lineStyle: { color: t.border } }, axisLabel: { color: t.fgMuted } },
        yAxis: { splitLine: { lineStyle: { color: t.border, opacity: 0.4 } }, axisLabel: { color: t.fgMuted } },
        series: [{
          lineStyle: { color: t.brand },
          itemStyle: { color: t.brand },
          areaStyle: opts.area ? {
            color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: withAlpha(t.brand, 0.4) },
                { offset: 1, color: withAlpha(t.brand, 0) }
              ] }
          } : undefined
        }]
      }, { replaceMerge: ['series'] });
    } catch (e) {
      if (!disposed) console.warn('Chart theme update failed:', e);
    }
  });

  const instance = {
    chart,
    dispose() {
      if (disposed) return;
      disposed = true;
      window.removeEventListener('resize', resize);
      unsub();
      try { chart.dispose(); } catch {}
      INSTANCES.delete(instance);
    }
  };
  INSTANCES.add(instance);
  return instance;
}

export function disposeAllCharts() {
  for (const inst of [...INSTANCES]) inst.dispose();
}
