export function isFsaSupported() {
  return typeof window !== 'undefined'
    && 'showDirectoryPicker' in window
    && 'queryPermission' in window;
}

export function pickCsvFile() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,text/csv';
    input.style.display = 'none';
    input.onchange = () => {
      const file = input.files?.[0];
      document.body.removeChild(input);
      if (file) resolve(file);
      else reject(new Error('No se seleccionó archivo'));
    };
    document.body.appendChild(input);
    input.click();
  });
}
