import type { Query } from "@tanstack/react-query";
import type { PersistedClient, Persister } from "@tanstack/react-query-persist-client";
import { type DBSchema, type IDBPDatabase, openDB } from "idb";

/**
 * A local cache of read-heavy query results, so the roster, the exercise and recipe
 * libraries, and templates paint instantly on reopen instead of every screen starting
 * from a blank loading state — and so they're there to browse at all with no connection.
 *
 * IndexedDB via `idb`, the same package and the same reasoning as the client app's
 * workout outbox (`apps/client/src/lib/workouts/outbox.ts`): this can hold the full
 * exercise and recipe libraries, which is more than `localStorage`'s quota comfortably
 * allows, and a Promise wrapper over the same native API rather than a second
 * key-value library. See `.ai/engineering/dependencies.md`.
 *
 * This is a cache, not a source of truth — unlike the outbox, losing it costs nothing
 * but a cold reload, so there is no write-ahead concern here at all.
 */

interface PersistSchema extends DBSchema {
  cache: { key: string; value: PersistedClient };
}

const DB_NAME = "traiv-trainer-query-cache";
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
 * prefix actually contains.
 *
 * Deliberately excluded: `auth` (session/config must always be freshly verified, never
 * served stale — a cached session surviving a sign-out is a real bug, not a
 * convenience), `client`/`client-workouts` (one client's own detail data — narrower
 * surface, and more likely to be stale by the time it's read back than it's worth),
 * `studio` (the join code is a secret, not something to leave sitting in IndexedDB
 * longer than it has to), `uploads` (trivial, not worth it), `client-mealplan` (per-client,
 * same reasoning as the roster exclusions above).
 */
const PERSISTED_KEY_PREFIXES = new Set([
  "studios",
  "workouts",
  "workout",
  "exercises",
  "saved-sections",
  "roster",
  "ingredients",
  "ingredient",
  "recipes",
  "recipe",
  "mealplan-templates",
  "mealplan-template",
]);

export function shouldPersistQuery(query: Query): boolean {
  return query.state.status === "success" && PERSISTED_KEY_PREFIXES.has(String(query.queryKey[0]));
}
