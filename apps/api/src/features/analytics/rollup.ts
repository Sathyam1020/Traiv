import { schema } from "@traiv/db";
import { eq, sql } from "drizzle-orm";
import { db } from "../../db.js";
import { logger } from "../../lib/logger.js";
import { computeHealthScores } from "./health-score.js";

/**
 * Daily DAU/WAU/MAU + weekly-active-clients, computed from `product_event` into
 * `daily_metric_rollup` — what the admin Overview page actually reads. A plain interval
 * timer, not a new queue, same shape as `startCheckInReminders`: this is recurring
 * background work, not a one-off job with a payload.
 *
 * Only ever rolls up a day that has fully elapsed (UTC) — today's events are still
 * arriving, so counting them would make "today" visibly shrink and grow as the day
 * goes on. `analytics_checkpoint` records the last day actually finished, so a crash
 * mid-run resumes from there instead of re-scanning from the start.
 */
export const ROLLUP_NAME = "analytics_daily_rollup";

export function toDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(day: string, delta: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return toDay(d);
}

/** A `'YYYY-MM-DD'` day string as the UTC instant at its midnight — never a bare `::date`
 *  cast, which Postgres resolves against the session timezone and silently shifts the
 *  boundary against a `timestamptz` column. */
function dayStart(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

async function countActiveUsers(
  role: "trainer" | "client",
  fromInclusive: string,
  toExclusive: string,
): Promise<number> {
  const result = await db.execute(sql`
    select count(distinct user_id)::int as count
    from product_event
    where actor_role = ${role}
      and user_id is not null
      and received_at >= ${dayStart(fromInclusive)}
      and received_at < ${dayStart(toExclusive)}
  `);
  return (result.rows[0] as { count: number } | undefined)?.count ?? 0;
}

async function countSignups(day: string): Promise<number> {
  const result = await db.execute(sql`
    select count(*)::int as count
    from product_event
    where name = 'signup_completed'
      and received_at >= ${dayStart(day)}
      and received_at < ${dayStart(addDays(day, 1))}
  `);
  return (result.rows[0] as { count: number } | undefined)?.count ?? 0;
}

async function earliestEventDay(): Promise<string | null> {
  const result = await db.execute(sql`select min(received_at) as min from product_event`);
  const min = (result.rows[0] as { min: Date | string | null } | undefined)?.min;
  return min ? toDay(new Date(min)) : null;
}

async function upsertMetric(day: string, metric: string, value: number) {
  await db
    .insert(schema.dailyMetricRollups)
    .values({ day, studioId: schema.PLATFORM_ROLLUP_SCOPE, metric, value })
    .onConflictDoUpdate({
      target: [
        schema.dailyMetricRollups.day,
        schema.dailyMetricRollups.studioId,
        schema.dailyMetricRollups.metric,
      ],
      set: { value },
    });
}

export async function rollupDay(day: string) {
  const dayEnd = addDays(day, 1);
  const weekStart = addDays(day, -6);
  const monthStart = addDays(day, -29);

  const [dauTrainer, dauClient, wauTrainer, wauClient, mauTrainer, mauClient, signupsTrainer] =
    await Promise.all([
      countActiveUsers("trainer", day, dayEnd),
      countActiveUsers("client", day, dayEnd),
      countActiveUsers("trainer", weekStart, dayEnd),
      countActiveUsers("client", weekStart, dayEnd),
      countActiveUsers("trainer", monthStart, dayEnd),
      countActiveUsers("client", monthStart, dayEnd),
      countSignups(day),
    ]);

  await Promise.all([
    upsertMetric(day, "dau_trainer", dauTrainer),
    upsertMetric(day, "dau_client", dauClient),
    // "Weekly active clients" in admin-dashboard-spec.md §1 is this same number — no
    // separate metric needed.
    upsertMetric(day, "wau_trainer", wauTrainer),
    upsertMetric(day, "wau_client", wauClient),
    upsertMetric(day, "mau_trainer", mauTrainer),
    upsertMetric(day, "mau_client", mauClient),
    upsertMetric(day, "signups_trainer", signupsTrainer),
  ]);
}

/**
 * Walk from the day after the checkpoint (or the earliest event ever recorded, if this
 * is the very first run) through yesterday, rolling up and checkpointing one day at a
 * time. Separated from `startAnalyticsRollup` so a test can await one real run instead
 * of reaching into a `setInterval` closure.
 */
export async function runRollupTick(): Promise<void> {
  const yesterday = addDays(toDay(new Date()), -1);

  const [checkpoint] = await db
    .select()
    .from(schema.analyticsCheckpoints)
    .where(eq(schema.analyticsCheckpoints.rollupName, ROLLUP_NAME))
    .limit(1);

  const start = checkpoint ? addDays(checkpoint.lastProcessedDay, 1) : await earliestEventDay();
  if (!start) return; // no events recorded yet — nothing to roll up

  let day = start;
  while (day <= yesterday) {
    await rollupDay(day);
    await db
      .insert(schema.analyticsCheckpoints)
      .values({ rollupName: ROLLUP_NAME, lastProcessedDay: day, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: schema.analyticsCheckpoints.rollupName,
        set: { lastProcessedDay: day, updatedAt: new Date() },
      });
    day = addDays(day, 1);
  }
}

export function startAnalyticsRollup() {
  let busy = false;

  const tick = async () => {
    if (busy) return;
    busy = true;
    try {
      await runRollupTick();
    } catch (err) {
      logger.error("analytics rollup tick failed", {
        error: err instanceof Error ? err.message : String(err),
      });
    }
    // Its own try/catch: a health-score failure must not stop the DAU/WAU/MAU walk
    // above (or vice versa) from making progress.
    try {
      await computeHealthScores();
    } catch (err) {
      logger.error("health score tick failed", {
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      busy = false;
    }
  };

  // Hourly: the data is daily-grained, so nothing is gained by checking more often than
  // that — this just keeps a day's rollup from waiting a full day after it ends.
  const timer = setInterval(() => void tick(), 60 * 60 * 1000);
  timer.unref();
  void tick();
  return () => clearInterval(timer);
}
