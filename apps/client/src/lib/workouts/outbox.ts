import { type DBSchema, type IDBPDatabase, openDB } from "idb";

/**
 * A durable, write-ahead queue for set-log writes, so a logged set survives the app
 * being killed mid-session and recovers correctly across tabs.
 *
 * IndexedDB, not `localStorage` (which backs the check-in draft elsewhere in this app) —
 * that draft is one object with "last write wins," which is fine for a form in progress.
 * This is an ordered queue of discrete writes, and `localStorage`'s read-modify-write is
 * not atomic across tabs: two tabs on the same session can silently clobber each other's
 * queued entries. IndexedDB's transactions don't have that failure mode. See
 * `.ai/engineering/dependencies.md` for the full comparison.
 *
 * The record key is the server's own natural key for a set
 * (`sessionId:sessionExerciseId:setNumber`) — the same key `logSet`'s own
 * `onConflictDoUpdate` upserts on. Queuing a new value for a set already queued
 * overwrites rather than appends, so the outbox always holds at most one — the latest —
 * pending write per set, matching the "only the latest intent matters" rule the in-memory
 * save queue already enforces for a single live session.
 */

export type PendingSet = {
  key: string;
  trainingSessionId: string;
  sessionExerciseId: string;
  setNumber: number;
  reps: number | null;
  loadKg: number | null;
  completed: boolean;
  /** When this value was last set locally — used to show "queued since…", not for ordering. */
  updatedAt: number;
  /** Failed send attempts since the value last changed. Used for backoff, not a retry cap —
   * a durable queue that gives up on its own is the one failure mode worse than slow sync. */
  attempts: number;
  lastError?: string;
};

interface OutboxSchema extends DBSchema {
  "pending-sets": {
    key: string;
    value: PendingSet;
    indexes: { "by-session": string };
  };
}

const DB_NAME = "traiv-client-outbox";
const DB_VERSION = 1;
const STORE = "pending-sets";

let dbPromise: Promise<IDBPDatabase<OutboxSchema>> | null = null;

function keyFor(trainingSessionId: string, sessionExerciseId: string, setNumber: number) {
  return `${trainingSessionId}:${sessionExerciseId}:${setNumber}`;
}

function getDb(): Promise<IDBPDatabase<OutboxSchema>> | null {
  if (typeof indexedDB === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB<OutboxSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE, { keyPath: "key" });
        store.createIndex("by-session", "trainingSessionId");
      },
    }).catch((error) => {
      // Private-browsing storage limits, a corrupted DB, a browser that blocks it
      // outright — the outbox degrades to "no durability," not a broken workout.
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}

/** Write-ahead: call this before attempting the network write, not after it fails. */
export async function queueSet(
  input: Omit<PendingSet, "key" | "updatedAt" | "attempts">,
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    const key = keyFor(input.trainingSessionId, input.sessionExerciseId, input.setNumber);
    await db.put(STORE, { ...input, key, updatedAt: Date.now(), attempts: 0 });
  } catch {
    // Degrade silently — the in-memory save queue still attempts the write this tick.
  }
}

/** Call after a confirmed server acknowledgement for this exact value. */
export async function removeSet(
  trainingSessionId: string,
  sessionExerciseId: string,
  setNumber: number,
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    await db.delete(STORE, keyFor(trainingSessionId, sessionExerciseId, setNumber));
  } catch {
    // If this fails, the entry is retried and the server's own idempotent upsert
    // (same natural key) makes the redundant retry harmless.
  }
}

/** Record a failed send so the UI can show "will retry" distinctly from "just queued". */
export async function markAttempt(
  trainingSessionId: string,
  sessionExerciseId: string,
  setNumber: number,
  error: string,
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    const key = keyFor(trainingSessionId, sessionExerciseId, setNumber);
    const existing = await db.get(STORE, key);
    if (!existing) return;
    await db.put(STORE, { ...existing, attempts: existing.attempts + 1, lastError: error });
  } catch {
    // Non-fatal — the next flush still tries, just without an updated attempt count.
  }
}

/** Every entry still waiting to reach the server for one session — read on mount to
 * recover state after a reload or a kill, and before every flush attempt. */
export async function listPending(trainingSessionId: string): Promise<PendingSet[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.getAllFromIndex(STORE, "by-session", trainingSessionId);
  } catch {
    return [];
  }
}

/** Called when a session finishes or is cancelled — nothing left to sync for it. */
export async function clearSession(trainingSessionId: string): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    const tx = db.transaction(STORE, "readwrite");
    const keys = await tx.store.index("by-session").getAllKeys(trainingSessionId);
    await Promise.all([...keys.map((key) => tx.store.delete(key)), tx.done]);
  } catch {
    // Leftover entries for a finished session are harmless — removeSet already clears
    // the common case, and a stale entry just gets skipped by assertSession server-side.
  }
}
