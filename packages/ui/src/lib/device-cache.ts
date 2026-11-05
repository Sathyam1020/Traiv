/** Per-installation cache only; no server or cross-user data cache. */
const TTL = 24 * 60 * 60 * 1000;
export async function deviceCached<T>(
  key: string,
  load: () => Promise<T>,
  cacheIf: (value: T) => boolean = () => true,
): Promise<T> {
  const storageKey = `traiv.exerciseapi.${key}`;
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const cached = JSON.parse(raw) as { savedAt: number; value: T };
        if (
          Number.isFinite(cached.savedAt) &&
          Date.now() - cached.savedAt < TTL &&
          cached.value !== undefined
        )
          return cached.value;
        window.localStorage.removeItem(storageKey);
      }
    } catch {
      /* Disabled storage must not prevent fetching exercises. */
    }
  }
  const value = await load();
  if (typeof window !== "undefined" && cacheIf(value)) {
    try {
      // Bound catalog cache size; remove expired entries and oldest pages first.
      const keys = Object.keys(window.localStorage).filter((k) =>
        k.startsWith("traiv.exerciseapi."),
      );
      const entries: { key: string; time: number }[] = [];
      for (const k of keys) {
        try {
          const time = Number(JSON.parse(window.localStorage.getItem(k) ?? "{}").savedAt);
          if (!Number.isFinite(time) || Date.now() - time >= TTL) window.localStorage.removeItem(k);
          else entries.push({ key: k, time });
        } catch {
          window.localStorage.removeItem(k);
        }
      }
      entries
        .sort((a, b) => a.time - b.time)
        .slice(0, Math.max(0, entries.length - 99))
        .forEach((e) => {
          window.localStorage.removeItem(e.key);
        });
      window.localStorage.setItem(storageKey, JSON.stringify({ savedAt: Date.now(), value }));
    } catch {
      /* Quota/private mode: React Query still supplies the in-memory cache. */
    }
  }
  return value;
}

export function clearExerciseCatalogCache(studioId: string) {
  if (typeof window === "undefined") return;
  try {
    for (const key of Object.keys(window.localStorage))
      if (
        key.startsWith(`traiv.exerciseapi.catalog:${studioId}:`) ||
        key.startsWith(`traiv.exerciseapi.detail:${studioId}:`)
      )
        window.localStorage.removeItem(key);
  } catch {
    /* Optional browser cache. */
  }
}
