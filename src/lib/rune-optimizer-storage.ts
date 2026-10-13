import type { AccountSnapshot } from './rune-optimizer-types.ts';

const DATABASE_NAME = 'playerdojo-rune-optimizer';
const STORE_NAME = 'account';
const SNAPSHOT_KEY = 'snapshot';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function transaction<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, mode);
      const request = operation(tx.objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    database.close();
  }
}

export async function loadRuneSnapshot(): Promise<AccountSnapshot | null> {
  if (!('indexedDB' in globalThis)) return null;
  const result = await transaction<AccountSnapshot | undefined>(
    'readonly',
    (store) => store.get(SNAPSHOT_KEY),
  );
  return result?.schemaVersion === 1 ? result : null;
}

export async function saveRuneSnapshot(
  snapshot: AccountSnapshot,
): Promise<void> {
  if (!('indexedDB' in globalThis)) throw new Error('storage-unavailable');
  await transaction<IDBValidKey>('readwrite', (store) =>
    store.put(snapshot, SNAPSHOT_KEY),
  );
}

export async function clearRuneSnapshot(): Promise<void> {
  if (!('indexedDB' in globalThis)) return;
  await transaction<undefined>('readwrite', (store) =>
    store.delete(SNAPSHOT_KEY),
  );
}
