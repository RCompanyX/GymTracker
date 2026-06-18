export const es = {
  app: { title: 'GymTracker' },
  actions: {
    openCsv: 'Abrir CSV',
    pickFolder: 'Elegir carpeta',
    changeFolder: 'Cambiar carpeta',
    clearFolder: 'Olvidar carpeta',
    refresh: 'Refrescar',
    exportJson: 'Exportar JSON',
    metrics: 'Métricas ▾',
    selectAll: 'Todas',
    selectNone: 'Ninguna'
  },
  empty: {
    noData: 'Sin datos. Abre un CSV para empezar.',
    noCsvInFolder: 'No se han encontrado CSVs en la carpeta seleccionada.',
    noMeasurementsInRange: 'No hay pesajes en el rango seleccionado.'
  },
  folder: {
    prompt: 'Selecciona la carpeta donde guardas los CSV de Tanita. La app recordará la carpeta y leerá automáticamente el CSV más reciente.',
    unsupported: 'Tu navegador no soporta File System Access API. Puedes seguir usando la app, pero tendrás que elegir el CSV manualmente cada vez.',
    pickManually: 'Elegir CSV manualmente',
    selected: 'Carpeta activa',
    permissionDenied: 'Permiso denegado para acceder a la carpeta.'
  },
  kpi: {
    currentWeight: 'Peso actual',
    deltaFromStart: 'Δ desde inicio',
    delta7d: 'Δ 7 días',
    bmi: 'IMC',
    bodyFat: 'Grasa corporal',
    muscleMass: 'Masa muscular'
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
  table: {
    date: 'Fecha',
    metric: 'Métrica',
    min: 'Mín',
    max: 'Máx',
    avg: 'Media',
    last: 'Último',
    delta: 'Δ',
    deltaPct: 'Δ %',
    trend: 'Tendencia/sem'
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
  }
};

export const en = {
  app: { title: 'GymTracker' },
  actions: {
    openCsv: 'Open CSV',
    pickFolder: 'Pick folder',
    changeFolder: 'Change folder',
    clearFolder: 'Forget folder',
    refresh: 'Refresh',
    exportJson: 'Export JSON',
    metrics: 'Metrics ▾',
    selectAll: 'All',
    selectNone: 'None'
  },
  empty: {
    noData: 'No data. Open a CSV to get started.',
    noCsvInFolder: 'No CSVs found in the selected folder.',
    noMeasurementsInRange: 'No weigh-ins in the selected range.'
  },
  folder: {
    prompt: 'Pick the folder where you keep your Tanita CSVs. The app will remember the folder and auto-read the newest CSV.',
    unsupported: 'Your browser does not support the File System Access API. You can still use the app, but you will need to pick the CSV manually each time.',
    pickManually: 'Pick CSV manually',
    selected: 'Active folder',
    permissionDenied: 'Permission denied for the folder.'
  },
  kpi: {
    currentWeight: 'Current weight',
    deltaFromStart: 'Δ from start',
    delta7d: 'Δ 7 days',
    bmi: 'BMI',
    bodyFat: 'Body fat',
    muscleMass: 'Muscle mass'
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
  table: {
    date: 'Date',
    metric: 'Metric',
    min: 'Min',
    max: 'Max',
    avg: 'Avg',
    last: 'Last',
    delta: 'Δ',
    deltaPct: 'Δ %',
    trend: 'Trend/week'
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
