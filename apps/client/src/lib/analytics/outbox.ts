import { type DBSchema, type IDBPDatabase, openDB } from "idb";

/**
 * A durable, write-ahead queue for analytics events, so one logged while offline (or
 * mid-navigation, or the moment before the tab is killed) survives to be sent later.
 *
 * Close in shape to `lib/workouts/outbox.ts` (same IndexedDB-over-localStorage
 * reasoning — see that file), but **not** the same semantics: a set log is "the latest
 * value for this exact set," so that outbox keeps at most one pending write per natural
 * key. An analytics event is a fact that happened, and a second `check_in_submitted`
 * five minutes later is a second fact, not a correction of the first — so this one is
 * append-only, keyed by the event's own client-minted id, and a queued entry is never
 * overwritten, only ever removed once the server has it.
 */

export type PendingEvent = {
  /** Client-minted (`crypto.randomUUID()`), the event's own primary key — also this
   *  store's key, and the server's own dedup key (`ON CONFLICT (id) DO NOTHING`). */
  id: string;
  name: string;
  occurredAt: string;
  sourceApp: "client";
  properties: Record<string, unknown>;
  /** When this entry was queued — used to flush oldest-first, not for display. */
  queuedAt: number;
  /** Failed send attempts. Used for backoff, not a retry cap — see `workouts/outbox.ts`'s
   *  identical reasoning: a queue that gives up on its own is worse than slow sync. */
  attempts: number;
  lastError?: string;
};

interface OutboxSchema extends DBSchema {
  "pending-events": {
    key: string;
    value: PendingEvent;
    indexes: { "by-queued-at": number };
  };
}

const DB_NAME = "traiv-client-analytics-outbox";
const DB_VERSION = 1;
const STORE = "pending-events";

let dbPromise: Promise<IDBPDatabase<OutboxSchema>> | null = null;

function getDb(): Promise<IDBPDatabase<OutboxSchema>> | null {
  if (typeof indexedDB === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB<OutboxSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("by-queued-at", "queuedAt");
      },
    }).catch((error) => {
      // Private-browsing storage limits, a corrupted DB, a browser that blocks it
      // outright — the outbox degrades to "no durability," not a broken app.
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}

/** Write-ahead: call this before attempting the network send, not after it fails. */
export async function queueEvent(
  input: Omit<PendingEvent, "queuedAt" | "attempts">,
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    await db.put(STORE, { ...input, queuedAt: Date.now(), attempts: 0 });
  } catch {
    // Degrade silently — losing durability here is better than losing the user-facing
    // action this call is attached to.
  }
}

/** Oldest first, up to `limit` — matches `POST /analytics/events`'s own 50-event cap. */
export async function listPending(limit = 50): Promise<PendingEvent[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const all = await db.getAllFromIndex(STORE, "by-queued-at");
    return all.slice(0, limit);
  } catch {
    return [];
  }
}

/** Call after the server has acknowledged a batch — removes exactly the ids it accepted. */
export async function removeEvents(ids: string[]): Promise<void> {
  if (!ids.length) return;
  try {
    const db = await getDb();
    if (!db) return;
    const tx = db.transaction(STORE, "readwrite");
    await Promise.all([...ids.map((id) => tx.store.delete(id)), tx.done]);
  } catch {
    // The next flush retries; the server's own id-based dedup makes a redundant resend
    // harmless.
  }
}

/** Record a failed send per event, so a flush can skip one still backing off while
 *  still trying the rest of the batch. */
export async function markAttempts(ids: string[], error: string): Promise<void> {
  if (!ids.length) return;
  try {
    const db = await getDb();
    if (!db) return;
    const tx = db.transaction(STORE, "readwrite");
    for (const id of ids) {
      const existing = await tx.store.get(id);
      if (existing) await tx.store.put({ ...existing, attempts: existing.attempts + 1, lastError: error });
    }
    await tx.done;
  } catch {
    // Non-fatal — the next flush still tries, just without an updated attempt count.
  }
}
