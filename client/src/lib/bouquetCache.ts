/**
 * IndexedDB-based cache for generated bouquet images
 * Cache key: combination of flower IDs, quantities, and colors
 */

const DB_NAME = 'FloriumBouquetCache';
const STORE_NAME = 'generatedBouquets';
const DB_VERSION = 1;

interface CachedBouquet {
  key: string;
  imageUrl: string;
  timestamp: number;
  flowers: Array<{
    nameKa: string;
    nameEn: string;
    quantity: number;
    colorNameEn?: string;
    colorNameKa?: string;
  }>;
}

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB
 */
export async function initBouquetCache(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('[BouquetCache] Failed to open IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('[BouquetCache] IndexedDB initialized');
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('[BouquetCache] Object store created');
      }
    };
  });
}

/**
 * Generate cache key from flower combination
 */
export function generateCacheKey(flowers: Array<{
  nameKa: string;
  nameEn: string;
  quantity: number;
  colorNameEn?: string;
  colorNameKa?: string;
}>): string {
  const sortedFlowers = [...flowers].sort((a, b) => a.nameEn.localeCompare(b.nameEn));
  const keyParts = sortedFlowers.map(f => 
    `${f.nameEn}:${f.quantity}:${f.colorNameEn || 'default'}`
  );
  return keyParts.join('|');
}

/**
 * Get cached bouquet image URL
 */
export async function getCachedBouquet(flowers: Array<{
  nameKa: string;
  nameEn: string;
  quantity: number;
  colorNameEn?: string;
  colorNameKa?: string;
}>): Promise<string | null> {
  if (!db) {
    await initBouquetCache();
  }

  const key = generateCacheKey(flowers);

  return new Promise((resolve, reject) => {
    if (!db) {
      resolve(null);
      return;
    }

    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onerror = () => {
      console.error('[BouquetCache] Failed to retrieve cache:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      const result = request.result as CachedBouquet | undefined;
      if (result) {
        console.log('[BouquetCache] Cache hit! Retrieved image URL:', result.imageUrl);
        resolve(result.imageUrl);
      } else {
        console.log('[BouquetCache] Cache miss for key:', key);
        resolve(null);
      }
    };
  });
}

/**
 * Cache a generated bouquet image
 */
export async function cacheBouquet(
  flowers: Array<{
    nameKa: string;
    nameEn: string;
    quantity: number;
    colorNameEn?: string;
    colorNameKa?: string;
  }>,
  imageUrl: string
): Promise<void> {
  if (!db) {
    await initBouquetCache();
  }

  const key = generateCacheKey(flowers);
  const cachedBouquet: CachedBouquet = {
    key,
    imageUrl,
    timestamp: Date.now(),
    flowers,
  };

  return new Promise((resolve, reject) => {
    if (!db) {
      resolve();
      return;
    }

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(cachedBouquet);

    request.onerror = () => {
      console.error('[BouquetCache] Failed to cache bouquet:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      console.log('[BouquetCache] Bouquet cached successfully. Key:', key);
      resolve();
    };
  });
}

/**
 * Clear all cached bouquets
 */
export async function clearBouquetCache(): Promise<void> {
  if (!db) {
    await initBouquetCache();
  }

  return new Promise((resolve, reject) => {
    if (!db) {
      resolve();
      return;
    }

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => {
      console.error('[BouquetCache] Failed to clear cache:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      console.log('[BouquetCache] Cache cleared');
      resolve();
    };
  });
}
