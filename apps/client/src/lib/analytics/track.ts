import { http } from "../api/client";
import { listPending, markAttempts, queueEvent, removeEvents } from "./outbox";

/**
 * The client-side half of the event pipeline `apps/api/src/features/analytics/service.ts`
 * already validates and stores. Every call queues durably first, then makes one
 * best-effort attempt to flush — a lost network call never loses the event, it just
 * waits for the next flush (a reconnect, a periodic tick, or the next call to `track`).
 *
 * Deliberately not awaited by call sites in a way that can block the UI action it
 * describes — same "analytics must never fail the real thing" rule as every server-side
 * instrumentation site.
 */

type TrackName = "session_started" | "meal_logged" | "measurement_logged";

export async function track(name: TrackName, properties: Record<string, unknown>): Promise<void> {
  await queueEvent({
    id: crypto.randomUUID(),
    name,
    occurredAt: new Date().toISOString(),
    sourceApp: "client",
    properties,
  });
  void flush();
}

let flushing = false;

/** Safe to call as often as convenient — `flushing` collapses overlapping calls into
 *  one in-flight attempt, the same guard `startCheckInReminders`-style server timers use. */
export async function flush(): Promise<void> {
  if (flushing) return;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return;
  flushing = true;
  try {
    const pending = await listPending();
    if (!pending.length) return;

    try {
      await http.post("/analytics/events", {
        events: pending.map((e) => ({
          id: e.id,
          name: e.name,
          occurredAt: e.occurredAt,
          sourceApp: e.sourceApp,
          properties: e.properties,
        })),
      });
      await removeEvents(pending.map((e) => e.id));
    } catch (error) {
      await markAttempts(
        pending.map((e) => e.id),
        error instanceof Error ? error.message : "unknown error",
      );
    }
  } finally {
    flushing = false;
  }
}

let wired = false;

/** Call once, near app start (the root layout). Idempotent — a second call is a no-op,
 *  since nothing here is per-session state, just event listeners. */
export function startAnalyticsOutboxFlush(): void {
  if (wired || typeof window === "undefined") return;
  wired = true;
  window.addEventListener("online", () => void flush());
  // Periodic, not event-driven only — a queued event with no further app activity
  // (the common case: one `meal_logged` call, then the tab just sits open) still
  // flushes within a minute instead of waiting for the next unrelated action.
  setInterval(() => void flush(), 60_000);
  void flush();
}
