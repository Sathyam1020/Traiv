import { randomUUID } from "node:crypto";
import type { schema } from "@traiv/db";
import { claim, fail, succeed } from "./queue.js";

type Job = typeof schema.jobs.$inferSelect;

export type Handler = (job: Job) => Promise<void>;

/** Registered by feature modules so this file does not import half the app. */
const handlers = new Map<string, Handler>();

export function register(kind: string, handler: Handler) {
  handlers.set(kind, handler);
}

/**
 * Take one job and run it. Exported separately from the loop so tests can drive it a
 * step at a time instead of racing a timer.
 */
export async function runOnce(workerId: string): Promise<"idle" | "done" | "failed"> {
  const job = await claim(workerId);
  if (!job) return "idle";

  const handler = handlers.get(job.kind);
  if (!handler) {
    // An unknown kind is a deploy that removed a handler while rows were still queued.
    // Failing it loudly beats retrying forever against a handler that is never coming back.
    await fail(job.id, `No handler registered for "${job.kind}"`);
    return "failed";
  }

  try {
    await handler(job);
    await succeed(job.id);
    return "done";
  } catch (err) {
    const { exhausted } = await fail(job.id, err);
    console.error(
      `job ${job.kind} ${job.id} failed (attempt ${job.attempts}${exhausted ? ", giving up" : ", will retry"})`,
      err,
    );
    return "failed";
  }
}

/**
 * The loop, started by the API process.
 *
 * In-process rather than a separate service, because one more deployable to run is a real
 * cost and this volume does not need one — a few plans a day, not a few thousand a second.
 * When it does, the handlers move to their own process unchanged; `claim` already assumes
 * competing workers.
 *
 * Polling rather than LISTEN/NOTIFY: the delay costs a second on a job that takes a
 * minute, and a poll survives a dropped connection without anybody noticing.
 */
export function startWorker({ intervalMs = 1000 }: { intervalMs?: number } = {}) {
  const workerId = `${process.pid}-${randomUUID().slice(0, 8)}`;
  let stopped = false;
  let timer: NodeJS.Timeout | undefined;

  async function tick() {
    if (stopped) return;
    try {
      // Drain rather than one-per-tick, so a burst of image jobs does not take a minute
      // to clear at one a second.
      let worked = 0;
      while (!stopped && worked < 10) {
        const outcome = await runOnce(workerId);
        if (outcome === "idle") break;
        worked += 1;
      }
    } catch (err) {
      // Reaching here means the queue itself is unreachable. Keep the loop alive — the
      // database coming back should resume work rather than need a restart.
      console.error("worker tick failed", err);
    }
    if (!stopped) timer = setTimeout(tick, intervalMs);
  }

  void tick();
  console.warn(`worker ${workerId} started (${handlers.size} handlers)`);

  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}
