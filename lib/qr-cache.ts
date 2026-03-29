const CACHE_PREFIX = "dozis_qr_";
const INDEX_KEY = "dozis_qr_index";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface QrCacheEntry {
  qrToken: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  cachedAt: number;
}

function getStorage(): Storage | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // SSR, private browsing, or storage disabled
  }
  return null;
}

function getIndex(storage: Storage): string[] {
  try {
    const raw = storage.getItem(INDEX_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    // Corrupted index
  }
  return [];
}

function setIndex(storage: Storage, ids: string[]): void {
  try {
    storage.setItem(INDEX_KEY, JSON.stringify(ids));
  } catch {
    // Storage full
  }
}

export function cacheQrData(
  entry: Omit<QrCacheEntry, "cachedAt">
): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    const full: QrCacheEntry = { ...entry, cachedAt: Date.now() };
    storage.setItem(CACHE_PREFIX + entry.eventId, JSON.stringify(full));

    const index = getIndex(storage);
    if (!index.includes(entry.eventId)) {
      index.push(entry.eventId);
      setIndex(storage, index);
    }
  } catch {
    // Storage full or write error
  }
}

export function getCachedQrData(eventId: string): QrCacheEntry | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(CACHE_PREFIX + eventId);
    if (!raw) return null;

    const entry = JSON.parse(raw) as QrCacheEntry;
    if (Date.now() - entry.cachedAt > MAX_AGE_MS) {
      // Stale — remove
      storage.removeItem(CACHE_PREFIX + eventId);
      const index = getIndex(storage).filter((id) => id !== eventId);
      setIndex(storage, index);
      return null;
    }

    return entry;
  } catch {
    return null;
  }
}

export function getAllCachedQrs(): QrCacheEntry[] {
  const storage = getStorage();
  if (!storage) return [];

  const entries: QrCacheEntry[] = [];
  const index = getIndex(storage);
  const validIds: string[] = [];

  for (const eventId of index) {
    const entry = getCachedQrData(eventId);
    if (entry) {
      entries.push(entry);
      validIds.push(eventId);
    }
  }

  // Update index if stale entries were removed
  if (validIds.length !== index.length) {
    setIndex(storage, validIds);
  }

  return entries;
}

export function clearExpiredQrCache(): void {
  const storage = getStorage();
  if (!storage) return;

  const index = getIndex(storage);
  const validIds: string[] = [];

  for (const eventId of index) {
    try {
      const raw = storage.getItem(CACHE_PREFIX + eventId);
      if (!raw) continue;

      const entry = JSON.parse(raw) as QrCacheEntry;
      if (Date.now() - entry.cachedAt > MAX_AGE_MS) {
        storage.removeItem(CACHE_PREFIX + eventId);
      } else {
        validIds.push(eventId);
      }
    } catch {
      storage.removeItem(CACHE_PREFIX + eventId);
    }
  }

  setIndex(storage, validIds);
}
