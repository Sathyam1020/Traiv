import type { Query } from "@tanstack/react-query";
import type { PersistedClient, Persister } from "@tanstack/react-query-persist-client";
import { type DBSchema, type IDBPDatabase, openDB } from "idb";

/**
 * A local cache of read-heavy query results, so a client's workout programs and
 * exercise detail/history paint instantly on reopen and are there to browse at all with
 * no connection — pairing with the active-workout outbox
 * (`apps/client/src/lib/workouts/outbox.ts`), which already makes *logging* a workout
 * work offline; this is what makes *starting* one work offline too.
 *
 * Same `idb` package and reasoning as the outbox. This is a cache, not a source of
 * truth — losing it costs nothing but a cold reload, so there is no write-ahead concern
 * here the way there is for the outbox.
 */

interface PersistSchema extends DBSchema {
  cache: { key: string; value: PersistedClient };
}

const DB_NAME = "traiv-client-query-cache";
const DB_VERSION = 1;
const STORE = "cache";
const ROOT_KEY = "root";

let dbPromise: Promise<IDBPDatabase<PersistSchema>> | null = null;

function getDb(): Promise<IDBPDatabase<PersistSchema>> | null {
  if (typeof indexedDB === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB<PersistSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore(STORE);
      },
    }).catch((error) => {
      // Private-browsing storage limits, a corrupted DB, a browser that blocks it
      // outright — this degrades to "no persistence," never a broken app.
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}

export const idbPersister: Persister = {
  persistClient: async (client) => {
    try {
      const db = await getDb();
      if (!db) return;
      await db.put(STORE, client, ROOT_KEY);
    } catch {
      // Next reload just starts cold — no worse than before this existed.
    }
  },
  restoreClient: async () => {
    try {
      const db = await getDb();
      if (!db) return undefined;
      return await db.get(STORE, ROOT_KEY);
    } catch {
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      const db = await getDb();
      if (!db) return;
      await db.delete(STORE, ROOT_KEY);
    } catch {
      // A later persistClient overwrites whatever is left, so nothing to recover here.
    }
  },
};

// Bump this if the shape of what's persisted ever changes incompatibly — every device
// starts cold once, which is the same cost as not shipping this at all.
export const PERSIST_BUSTER = "v1";
export const PERSIST_MAX_AGE = 24 * 60 * 60 * 1000;

/**
 * Allowlisted, not "everything" — `queryKeys.ts` is the source of truth for what each
 * key actually contains. Every key here is nested under `["client", ...]`, so the
 * second element is what actually discriminates.
 *
 * Deliberately excluded: `auth` (session/config must always be freshly verified, never
 * served stale), `me`/`intake` (personal profile data — a shared family device signing
 * in as a different client must not flash the previous one's answers before the real
 * query response arrives), `today` (the layout already has its own bespoke
 * `localStorage` cache for this exact screen — duplicating it through a second
 * mechanism would just be two sources of truth for the same tab-reveal state),
 * `check-ins`/`check-in` (same per-person reasoning as `me`), `uploads` (trivial),
 * `workout-session` (a live session already has its own durable recovery path through
 * the outbox — persisting it a second way here would be a second, competing mechanism
 * for the same job).
 */
const PERSISTED_SECOND_KEYS = new Set(["coaches", "workouts", "workout", "exercise"]);

export function shouldPersistQuery(query: Query): boolean {
  if (query.state.status !== "success") return false;
  const [first, second] = query.queryKey;
  return first === "client" && PERSISTED_SECOND_KEYS.has(String(second));
}
