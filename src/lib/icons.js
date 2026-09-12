import {
  createElement,
  Dumbbell,
  FileUp,
  FolderOpen,
  Scale,
  RefreshCw,
  Download,
  Sun,
  Moon,
  Monitor,
  Languages,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  SlidersHorizontal,
  FileX,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Activity,
  ChartNoAxesCombined,
  TableProperties,
  Rows3
} from 'lucide';

const REGISTRY = {
  dumbbell: Dumbbell,
  'file-up': FileUp,
  'folder-open': FolderOpen,
  scale: Scale,
  'refresh-cw': RefreshCw,
  download: Download,
  sun: Sun,
  moon: Moon,
  monitor: Monitor,
  languages: Languages,
  menu: Menu,
  x: X,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  minus: Minus,
  calendar: Calendar,
  'sliders-horizontal': SlidersHorizontal,
  'file-x': FileX,
  'alert-circle': AlertCircle,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  check: Check,
  activity: Activity,
  'chart-no-axes-combined': ChartNoAxesCombined,
  'table-properties': TableProperties,
  'rows-3': Rows3
};

export function icon(name, props = {}) {
  const Icon = REGISTRY[name];
  if (!Icon) return document.createTextNode('');
  const { class: className, size = 16, strokeWidth, ...rest } = props;
  const attrs = { class: className, size, 'stroke-width': strokeWidth, ...rest };
  return createElement(Icon, attrs);
}

export function iconHtml(name, props = {}) {
  const el = icon(name, props);
  return el.outerHTML || '';
}
