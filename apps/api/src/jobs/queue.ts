import { newId, schema } from "@traiv/db";
import { and, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "../db.js";

export type JobKind = "generate_plan" | "generate_food_image" | "weekly_review" | "purge_auth_rows";

/**
 * How long a worker may hold a job before another is allowed to take it back.
 *
 * Expressed for Postgres, not Node, because every time in this table is the database's.
 */
const LEASE = sql`interval '10 minutes'`;

/** Doubling, in seconds: ~1 min, ~4 min, ~9 min. */
const BACKOFF_BASE_SECONDS = 60;

export async function enqueue(
  kind: JobKind,
  payload: Record<string, unknown>,
  options: { runAfter?: Date; maxAttempts?: number } = {},
) {
  const [job] = await db
    .insert(schema.jobs)
    .values({
      id: newId(),
      kind,
      payload,
      ...(options.runAfter ? { runAfter: options.runAfter } : {}),
      ...(options.maxAttempts ? { maxAttempts: options.maxAttempts } : {}),
    })
    .returning();
  return job;
}

/**
 * Take the next due job, or nothing.
 *
 * `FOR UPDATE SKIP LOCKED` is the whole trick: two workers running the same query get two
 * different rows instead of one row twice, with no coordination between them. Without it,
 * the second worker blocks on the first's lock and then picks up a job that has already
 * been claimed — which for `generate_plan` means paying for the same plan twice and
 * writing it twice.
 *
 * Reclaiming an expired lease is in the same query. A worker that was killed mid-job
 * leaves a row stuck `running` forever otherwise, and the client it belonged to waits for
 * a plan that will never arrive.
 *
 * Every time here is `now()` — the database's clock, never Node's. `runAfter` defaults to
 * the database clock on insert, so comparing it against `new Date()` makes a job enqueued
 * a millisecond ago invisible whenever the two machines disagree by a millisecond. A
 * polling worker hides that by trying again a second later; a test does not, which is how
 * it was found.
 */
export async function claim(workerId: string) {
  const claimed = await db.execute<{ id: string }>(sql`
    with next as (
      select ${schema.jobs.id}
      from ${schema.jobs}
      where (
              ${schema.jobs.status} = 'queued'
              and ${schema.jobs.runAfter} <= now()
            )
         or (
              ${schema.jobs.status} = 'running'
              and ${schema.jobs.lockedAt} < now() - ${LEASE}
            )
      order by ${schema.jobs.runAfter} asc
      limit 1
      for update skip locked
    )
    update ${schema.jobs}
       set status = 'running',
           attempts = ${schema.jobs.attempts} + 1,
           locked_at = now(),
           locked_by = ${workerId}
      from next
     where ${schema.jobs.id} = next.id
     returning ${schema.jobs.id}
  `);

  const id = claimed.rows[0]?.id;
  if (!id) return null;

  const [full] = await db.select().from(schema.jobs).where(eq(schema.jobs.id, id)).limit(1);
  return full ?? null;
}

export async function succeed(id: string) {
  await db
    .update(schema.jobs)
    .set({ status: "done", finishedAt: new Date(), lockedAt: null, lockedBy: null, error: null })
    .where(eq(schema.jobs.id, id));
}

/**
 * Put it back, or give up.
 *
 * Giving up is a state, not a deletion. A plan that never generated has to be findable —
 * "why does this client have nothing" is answered by a `failed` row with the error on it,
 * and by nothing at all if the row is gone.
 */
export async function fail(id: string, err: unknown) {
  const message = err instanceof Error ? err.message : String(err);

  const [job] = await db
    .select({ attempts: schema.jobs.attempts, maxAttempts: schema.jobs.maxAttempts })
    .from(schema.jobs)
    .where(eq(schema.jobs.id, id))
    .limit(1);

  const exhausted = !job || job.attempts >= job.maxAttempts;

  await db
    .update(schema.jobs)
    .set(
      exhausted
        ? {
            status: "failed",
            finishedAt: new Date(),
            error: message,
            lockedAt: null,
            lockedBy: null,
          }
        : {
            status: "queued",
            error: message,
            lockedAt: null,
            lockedBy: null,
            runAfter: sql`now() + make_interval(secs => ${BACKOFF_BASE_SECONDS * (job.attempts || 1) ** 2})`,
          },
    )
    .where(eq(schema.jobs.id, id));

  return { exhausted };
}

/** What the client's waiting screen polls. */
export async function latestJob(kind: JobKind, key: string, value: string) {
  const [job] = await db
    .select()
    .from(schema.jobs)
    .where(and(eq(schema.jobs.kind, kind), sql`${schema.jobs.payload} ->> ${key} = ${value}`))
    .orderBy(sql`${schema.jobs.createdAt} desc`)
    .limit(1);
  return job ?? null;
}

/** Only used by tests and the admin surface. */
export async function pendingCount() {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(schema.jobs)
    .where(
      and(
        isNotNull(schema.jobs.id),
        sql`${schema.jobs.status} in ('queued', 'running')`,
        sql`${schema.jobs.runAfter} <= now()`,
      ),
    );
  return row?.n ?? 0;
}
