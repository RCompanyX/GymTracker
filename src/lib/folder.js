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
      else {
        const error = new Error();
        error.name = 'AbortError';
        reject(error);
      }
    };
    document.body.appendChild(input);
    input.click();
  });
}
