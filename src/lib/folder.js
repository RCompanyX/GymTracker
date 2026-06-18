const HANDLE_DB = 'gymtracker';
const HANDLE_STORE = 'handles';
const HANDLE_KEY = 'csvFolder';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(HANDLE_DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(HANDLE_STORE)) {
        db.createObjectStore(HANDLE_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function putHandle(handle) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HANDLE_STORE, 'readwrite');
    tx.objectStore(HANDLE_STORE).put(handle, HANDLE_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

async function getHandle() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HANDLE_STORE, 'readonly');
    const req = tx.objectStore(HANDLE_STORE).get(HANDLE_KEY);
    req.onsuccess = () => { db.close(); resolve(req.result || null); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

async function removeHandle() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HANDLE_STORE, 'readwrite');
    tx.objectStore(HANDLE_STORE).delete(HANDLE_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export function isFsaSupported() {
  return typeof window !== 'undefined'
    && 'showDirectoryPicker' in window
    && 'queryPermission' in window;
}

export async function pickFolder() {
  if (!isFsaSupported()) {
    throw new Error('FSA no soportado en este navegador');
  }
  const handle = await window.showDirectoryPicker({ mode: 'read' });
  await putHandle(handle);
  return handle;
}

export async function queryStoredHandle() {
  const handle = await getHandle();
  if (!handle) return { state: 'none', handle: null };
  if (!isFsaSupported()) return { state: 'unsupported', handle };
  try {
    const perm = await handle.queryPermission({ mode: 'read' });
    if (perm === 'granted') return { state: 'granted', handle };
    const req = await handle.requestPermission({ mode: 'read' });
    if (req === 'granted') return { state: 'granted', handle };
    return { state: 'denied', handle };
  } catch (err) {
    return { state: 'error', handle, error: err };
  }
}

export async function clearStoredHandle() {
  await removeHandle();
}

export async function listCsvsInFolder(handle) {
  const out = [];
  for await (const entry of handle.values()) {
    if (entry.kind !== 'file') continue;
    if (!entry.name.toLowerCase().endsWith('.csv')) continue;
    out.push(entry);
  }
  out.sort((a, b) => {
    if (a.name < b.name) return 1;
    if (a.name > b.name) return -1;
    return 0;
  });
  return out;
}

export async function pickCsvFile() {
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
