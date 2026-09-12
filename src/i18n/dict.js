export const es = {
  app: { title: 'GymTracker', subtitle: 'Báscula Tanita BC-401' },
  actions: {
    openCsv: 'Abrir CSV',
    refresh: 'Refrescar',
    exportJson: 'Exportar JSON',
    metrics: 'Métricas',
    selectAll: 'Todas',
    selectNone: 'Ninguna',
    menu: 'Menú',
    theme: 'Tema',
    language: 'Idioma',
    close: 'Cerrar'
  },
  empty: {
    welcomeSubtitle: 'Visualiza las mediciones de tu báscula Tanita BC-401',
    dropHere: 'Arrastra tu CSV aquí',
    dropOrClick: 'o haz click para elegir un archivo',
    csvFormat: 'Compatible con el CSV exportado de la Tanita BC-401',
    noData: 'Sin datos. Arrastra un CSV para empezar.',
    noMeasurementsInRange: 'No hay pesajes en el rango seleccionado.',
    noMetricsTitle: 'Sin métricas visibles',
    noMetricsHint: 'Has ocultado todas las métricas. Activa al menos una para ver los gráficos.'
  },
  kpi: {
    currentWeight: 'Peso actual',
    deltaFromStart: 'Δ desde inicio',
    delta7d: 'Δ 7 días',
    bmi: 'IMC',
    bodyFat: 'Grasa corporal',
    muscleMass: 'Masa muscular',
    system: 'Auto',
    light: 'Claro',
    dark: 'Oscuro',
    latestMeasurement: 'Última medición'
  },
  range: {
    label: 'Rango',
    all: 'Todo',
    month1: '1 mes',
    months3: '3 meses',
    months6: '6 meses',
    year1: '1 año',
    custom: 'Personalizado'
  },
  summary: {
    overview: 'Resumen del periodo',
    sinceStart: 'desde el inicio',
    weighIns: 'Pesajes',
    latest: 'Último registro'
  },
  sections: {
    snapshot: 'Vista general',
    snapshotHint: 'Tu estado actual y frecuencia de registro.',
    trends: 'Evolución',
    trendsHint: 'Selecciona un tramo del gráfico para ajustar el rango.',
    statistics: 'Resumen estadístico',
    statisticsHint: 'Valores clave de cada métrica visible.',
    records: 'Registros',
    recordsHint: 'Consulta, ordena y exporta tus mediciones.'
  },
  table: {
    date: 'Fecha',
    metric: 'Métrica',
    min: 'Mín',
    max: 'Máx',
    avg: 'Media',
    last: 'Último',
    lastWeight: 'Último peso',
    delta: 'Δ',
    deltaPct: 'Δ %',
    trend: 'Tendencia/sem',
    consistency: 'Consistencia'
  },
  metrics: {
    weight: 'Peso',
    bmi: 'IMC',
    bodyFat: 'Grasa corporal',
    viscFat: 'Grasa visceral',
    muscleMass: 'Masa muscular',
    boneMass: 'Masa ósea',
    bmr: 'Metabolismo basal',
    metabAge: 'Edad metabólica',
    bodyWater: 'Agua corporal',
    physiqueRating: 'Complexión'
  },
  units: {
    kg: 'kg',
    pct: '%',
    kcal: 'kcal',
    years: 'años',
    rating: ''
  },
  quickWins: {
    startedTitle: '¡Has empezado!',
    startedMsg: 'Registra tu próxima medición para empezar a ver tendencias.',
    recordTitle: '¡Nuevo mínimo histórico!',
    recordMsg: 'Has alcanzado {weight} kg, tu peso más bajo registrado.',
    milestoneLossTitle: '¡Hito alcanzado!',
    milestoneLossMsg: 'Llevas {kg} kg perdidos desde que empezaste.',
    milestoneGainTitle: '¡Hito alcanzado!',
    milestoneGainMsg: 'Llevas {kg} kg ganados desde que empezaste.',
    lossTitle: '¡Buen avance!',
    lossMsg: 'Has bajado {kg} kg desde la última medición.',
    gainTitle: 'Vas al alza',
    gainMsg: 'Has subido {kg} kg desde la última medición.',
    streakTitle: 'Racha activa',
    streakMsg: '{count} mediciones en los últimos {days} días. ¡Constante!',
    dismiss: 'Descartar'
  }
};

export const en = {
  app: { title: 'GymTracker', subtitle: 'Tanita BC-401 scale' },
  actions: {
    openCsv: 'Open CSV',
    refresh: 'Refresh',
    exportJson: 'Export JSON',
    metrics: 'Metrics',
    selectAll: 'All',
    selectNone: 'None',
    menu: 'Menu',
    theme: 'Theme',
    language: 'Language',
    close: 'Close'
  },
  empty: {
    welcomeSubtitle: 'Visualize the measurements from your Tanita BC-401 scale',
    dropHere: 'Drop your CSV here',
    dropOrClick: 'or click to choose a file',
    csvFormat: 'Compatible with CSV exported from Tanita BC-401',
    noData: 'No data. Drop a CSV to get started.',
    noMeasurementsInRange: 'No weigh-ins in the selected range.',
    noMetricsTitle: 'No metrics visible',
    noMetricsHint: 'You have hidden all metrics. Enable at least one to see the charts.'
  },
  kpi: {
    currentWeight: 'Current weight',
    deltaFromStart: 'Δ from start',
    delta7d: 'Δ 7 days',
    bmi: 'BMI',
    bodyFat: 'Body fat',
    muscleMass: 'Muscle mass',
    system: 'Auto',
    light: 'Light',
    dark: 'Dark',
    latestMeasurement: 'Latest measurement'
  },
  range: {
    label: 'Range',
    all: 'All',
    month1: '1 month',
    months3: '3 months',
    months6: '6 months',
    year1: '1 year',
    custom: 'Custom'
  },
  summary: {
    overview: 'Period overview',
    sinceStart: 'since the start',
    weighIns: 'Weigh-ins',
    latest: 'Latest record'
  },
  sections: {
    snapshot: 'Overview',
    snapshotHint: 'Your current status and logging frequency.',
    trends: 'Trends',
    trendsHint: 'Select a chart range to refine the period.',
    statistics: 'Statistical summary',
    statisticsHint: 'Key values for each visible metric.',
    records: 'Records',
    recordsHint: 'Review, sort, and export your measurements.'
  },
  table: {
    date: 'Date',
    metric: 'Metric',
    min: 'Min',
    max: 'Max',
    avg: 'Avg',
    last: 'Last',
    lastWeight: 'Last weight',
    delta: 'Δ',
    deltaPct: 'Δ %',
    trend: 'Trend/week',
    consistency: 'Consistency'
  },
  metrics: {
    weight: 'Weight',
    bmi: 'BMI',
    bodyFat: 'Body fat',
    viscFat: 'Visceral fat',
    muscleMass: 'Muscle mass',
    boneMass: 'Bone mass',
    bmr: 'BMR',
    metabAge: 'Metabolic age',
    bodyWater: 'Body water',
    physiqueRating: 'Physique rating'
  },
  units: {
    kg: 'kg',
    pct: '%',
    kcal: 'kcal',
    years: 'yr',
    rating: ''
  },
  quickWins: {
    startedTitle: "You've started!",
    startedMsg: 'Log your next weigh-in to start seeing trends.',
    recordTitle: 'New all-time low!',
    recordMsg: "You've hit {weight} kg, your lowest recorded weight.",
    milestoneLossTitle: 'Milestone reached!',
    milestoneLossMsg: "That's {kg} kg lost since you started.",
    milestoneGainTitle: 'Milestone reached!',
    milestoneGainMsg: "That's {kg} kg gained since you started.",
    lossTitle: 'Nice progress!',
    lossMsg: "You're down {kg} kg since the last weigh-in.",
    gainTitle: 'Trending up',
    gainMsg: "You're up {kg} kg since the last weigh-in.",
    streakTitle: 'Active streak',
    streakMsg: '{count} weigh-ins in the last {days} days. Keep it up!',
    dismiss: 'Dismiss'
  }
};

export const DICTS = { es, en };

export function t(lang, keyPath) {
  const dict = DICTS[lang] || es;
  const parts = keyPath.split('.');
  let cur = dict;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return keyPath;
  }
  return cur;
}
