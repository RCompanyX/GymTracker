import { el } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { t } from '../lib/state.js';
import { setMeasurements, setError } from '../lib/state.js';
import { formatCsvError, parseCsvFile } from '../lib/csv.js';

export function DropZone() {
  let isDragOver = false;
  const zone = el('label', {
    class: 'drop-zone block w-full cursor-pointer rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)]/50 p-10 sm:p-16 text-center transition-all duration-200 ease-out hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)]/5 focus-within:border-[var(--color-brand)] focus-within:bg-[var(--color-brand)]/5 focus-within:ring-2 focus-within:ring-[var(--color-brand)]/30',
    ondragover: (e) => {
      e.preventDefault();
      if (!isDragOver) {
        isDragOver = true;
        zone.classList.add('drop-zone-active');
      }
    },
    ondragenter: (e) => {
      e.preventDefault();
    },
    ondragleave: (e) => {
      if (e.currentTarget.contains(e.relatedTarget)) return;
      isDragOver = false;
      zone.classList.remove('drop-zone-active');
    },
    ondrop: (e) => {
      e.preventDefault();
      isDragOver = false;
      zone.classList.remove('drop-zone-active');
      const file = e.dataTransfer?.files?.[0];
      if (file) handleFile(file);
    }
  });

  const input = el('input', {
    type: 'file',
    accept: '.csv,text/csv',
    class: 'sr-only',
    onchange: (e) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = '';
    }
  });

  async function handleFile(file) {
    try {
      const measurements = await parseCsvFile(file);
      setMeasurements(measurements, { fileName: file.name });
    } catch (err) {
      setError(formatCsvError(err, t));
    }
  }

  const content = el('div', { class: 'flex flex-col items-center gap-3 pointer-events-none' }, [
    el('div', {
      class: 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[var(--color-brand)]/10 text-[var(--color-brand)] flex items-center justify-center transition-transform duration-200 group-hover:scale-110',
      'data-icon': 'upload-icon'
    }, icon('file-up', { size: 32, 'stroke-width': 1.8 })),
    el('div', {}, [
      el('div', { class: 'text-base sm:text-lg font-semibold text-[var(--color-fg)]' }, t('empty.dropHere')),
      el('div', { class: 'text-sm text-[var(--color-fg-muted)] mt-1' }, t('empty.dropOrClick'))
    ])
  ]);

  zone.appendChild(input);
  zone.appendChild(content);

  zone.addEventListener('mouseenter', () => {
    const iconEl = zone.querySelector('[data-icon="upload-icon"]');
    if (iconEl) iconEl.style.transform = 'scale(1.1)';
  });
  zone.addEventListener('mouseleave', () => {
    const iconEl = zone.querySelector('[data-icon="upload-icon"]');
    if (iconEl) iconEl.style.transform = 'scale(1)';
  });

  return zone;
}
