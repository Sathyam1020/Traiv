import { activity } from "../messaging/service.js";
import { newId, schema } from "@traiv/db";
import { and, asc, desc, eq, inArray, isNull, lte, or, sql } from "drizzle-orm";
import { db } from "../../db.js";
import { badRequest, notFound } from "../../errors.js";

/**
 * Check-ins: a scheduled form submission, not a workout.
 *
 * The point of the table is `due_on`. Without a record of what was *expected* there is
 * no completion rate and nothing can ever be missed, which is precisely the limitation
 * of treating a completed training session as a check-in.
 */

/** How far ahead rows are materialised. Four weeks of future for the grid to show. */
const HORIZON_DAYS = 28;
/**
 * Cells in the grid on the client's overview — check-ins, not days.
 *
 * Fifteen *days* of a weekly cadence is two or three cells and a dozen blanks. Fifteen
 * check-ins is three months of history for a weekly client and a fortnight for a daily
 * one, which is the right amount of context either way.
 */
export const TREND_CELLS = 15;

export const CHECK_IN_STATES = ["completed", "missed", "overdue", "upcoming"] as const;
export type CheckInState = (typeof CHECK_IN_STATES)[number];

/* -------------------------------------------------------------------------- */
/* Dates                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Dates here are plain `YYYY-MM-DD` strings, never `Date` objects.
 *
 * A check-in is due on a *day*, and a day is not an instant. Carrying these as
 * timestamps means a client in IST and a server in UTC disagree about which day it is
 * for five and a half hours out of every twenty-four, and the disagreement shows up as
 * a check-in that is overdue in the morning and upcoming again in the evening.
 */
export type Day = string;

const MS_DAY = 86_400_000;

export const today = (): Day => new Date().toISOString().slice(0, 10);

export function addDays(day: Day, n: number): Day {
  const d = new Date(`${day}T00:00:00Z`);
  return new Date(d.getTime() + n * MS_DAY).toISOString().slice(0, 10);
}

export const daysBetween = (from: Day, to: Day): number =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / MS_DAY);

/** The first `weekday` (0 = Sunday) strictly after `from`. */
export function nextWeekdayAfter(from: Day, weekday: number): Day {
  const dow = new Date(`${from}T00:00:00Z`).getUTCDay();
  const ahead = (weekday - dow + 7) % 7 || 7;
  return addDays(from, ahead);
}

/* -------------------------------------------------------------------------- */
/* State                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Derived, never stored — except `completed`, which is a fact.
 *
 * A nightly job that flips rows between upcoming, overdue and missed is a job that can
 * fail silently, and the failure mode is a screen confidently asserting something
 * untrue. Deriving costs one comparison per row and cannot drift.
 */
export function checkInState(
  row: { dueOn: Day; closesOn: Day; status: "pending" | "completed" },
  now: Day = today(),
): CheckInState {
  if (row.status === "completed") return "completed";
  if (now < row.dueOn) return "upcoming";
  if (now <= row.closesOn) return "overdue";
  return "missed";
}

/* -------------------------------------------------------------------------- */
/* Scheduling                                                                  */
/* -------------------------------------------------------------------------- */

type Schedule = { weekday: number; graceDays: number; enabled: boolean };

/** The client's own cadence, falling back to the studio's wherever it is not set. */
function scheduleFor(client: {
  checkInWeekday: number | null;
  checkInGraceDays: number | null;
  checkInsEnabled: boolean;
  studioWeekday: number;
  studioGraceDays: number;
}): Schedule {
  return {
    weekday: client.checkInWeekday ?? client.studioWeekday,
    graceDays: client.checkInGraceDays ?? client.studioGraceDays,
    enabled: client.checkInsEnabled,
  };
}

/**
 * Make sure every due date from now to the horizon exists as a row.
 *
 * Idempotent through `check_in_due_key`, so running it twice — or on a cron that
 * overlaps with itself — adds nothing the second time.
 *
 * It only ever inserts. Rows that already exist are left exactly as they are, which is
 * what makes a schedule change safe: a client whose cadence moves keeps every check-in
 * they already completed, and keeps the closing dates those were judged against.
 */
export async function ensureCheckIns(clientId: string, now: Day = today()): Promise<number> {
  const [row] = await db
    .select({
      id: schema.clients.id,
      status: schema.clients.status,
      startedAt: schema.clients.createdAt,
      checkInWeekday: schema.clients.checkInWeekday,
      checkInGraceDays: schema.clients.checkInGraceDays,
      checkInsEnabled: schema.clients.checkInsEnabled,
      studioWeekday: schema.studios.checkInWeekday,
      studioGraceDays: schema.studios.checkInGraceDays,
    })
    .from(schema.clients)
    .innerJoin(schema.studios, eq(schema.studios.id, schema.clients.studioId))
    .where(and(eq(schema.clients.id, clientId), isNull(schema.clients.deletedAt)))
    .limit(1);

  if (!row) return 0;

  // Somebody who is paused or finished should not accrue check-ins they were never
  // going to be asked for. Their history stays; only the future stops.
  const schedule = scheduleFor(row);
  if (!schedule.enabled || row.status !== "active") return 0;

  const [last] = await db
    .select({ dueOn: schema.checkIns.dueOn })
    .from(schema.checkIns)
    .where(eq(schema.checkIns.clientId, clientId))
    .orderBy(desc(schema.checkIns.dueOn))
    .limit(1);

  // Start from the last scheduled date, or from the day they joined. Never before
  // they joined — backfilling misses for a relationship that did not exist yet would
  // open every new client's first screen on a wall of red.
  const joined = (row.startedAt as Date).toISOString().slice(0, 10);
  const from = last?.dueOn && last.dueOn > joined ? last.dueOn : addDays(joined, -1);
  const horizon = addDays(now, HORIZON_DAYS);

  const rows: (typeof schema.checkIns.$inferInsert)[] = [];
  let due = nextWeekdayAfter(from, schedule.weekday);
  while (due <= horizon) {
    rows.push({
      id: newId(),
      clientId,
      dueOn: due,
      closesOn: addDays(due, schedule.graceDays),
    });
    due = addDays(due, 7);
  }

  if (rows.length === 0) return 0;
  await db.insert(schema.checkIns).values(rows).onConflictDoNothing();
  return rows.length;
}

/** Every active client in a studio. The hook for a cron, and for tests. */
export async function ensureStudioCheckIns(studioId: string, now: Day = today()) {
  const clients = await db
    .select({ id: schema.clients.id })
    .from(schema.clients)
    .where(
      and(
        eq(schema.clients.studioId, studioId),
        eq(schema.clients.status, "active"),
        eq(schema.clients.checkInsEnabled, true),
        isNull(schema.clients.deletedAt),
      ),
    );

  let made = 0;
  for (const c of clients) made += await ensureCheckIns(c.id, now);
  return { clients: clients.length, created: made };
}

/* -------------------------------------------------------------------------- */
/* Reading                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The trend the overview card draws: the window's cells, plus the two figures.
 *
 * `completionRate` counts completed against completed-plus-missed. Upcoming is excluded
 * because a rate that counts the future starts every week at nought and climbs, which
 * reads as failure for someone who has done nothing wrong. Overdue is excluded for the
 * same reason — there is still time.
 */
export async function checkInTrend(clientId: string, now: Day = today()) {
  // The most recent fifteen up to the horizon — so the grid shows what just happened
  // and the next few that are coming, rather than a fixed span mostly full of blanks.
  const rows = (
    await db
      .select({
        id: schema.checkIns.id,
        dueOn: schema.checkIns.dueOn,
        closesOn: schema.checkIns.closesOn,
        status: schema.checkIns.status,
        completedAt: schema.checkIns.completedAt,
      })
      .from(schema.checkIns)
      .where(
        and(
          eq(schema.checkIns.clientId, clientId),
          lte(schema.checkIns.dueOn, addDays(now, HORIZON_DAYS)),
        ),
      )
      .orderBy(desc(schema.checkIns.dueOn))
      .limit(TREND_CELLS)
  ).reverse();

  const cells = rows.map((r) => ({
    id: r.id,
    date: r.dueOn,
    closesOn: r.closesOn,
    state: checkInState(r, now),
    completedAt: r.completedAt,
  }));

  // The rate is over everything settled, not just what fits in the grid: fifteen days
  // of a weekly cadence is two or three check-ins, and a rate computed from two is
  // noise.
  const settled = await db
    .select({
      completed: sql<number>`count(*) filter (where ${schema.checkIns.status} = 'completed')::int`,
      missed: sql<number>`count(*) filter (
        where ${schema.checkIns.status} = 'pending' and ${schema.checkIns.closesOn} < ${now}
      )::int`,
    })
    .from(schema.checkIns)
    .where(eq(schema.checkIns.clientId, clientId));

  const completed = settled[0]?.completed ?? 0;
  const missed = settled[0]?.missed ?? 0;
  const denominator = completed + missed;

  return {
    cells: TREND_CELLS,
    checkIns: cells,
    completionRate: denominator === 0 ? null : Math.round((completed / denominator) * 100),
    currentStreak: await currentStreak(clientId, now),
    completed,
    missed,
  };
}

/**
 * Consecutive completions, newest first, over check-ins that have settled.
 *
 * Upcoming and overdue are skipped rather than breaking the run: a streak should not
 * collapse on a Monday morning because this week's check-in has not been filled in
 * yet. Only a genuine miss ends it.
 */
async function currentStreak(clientId: string, now: Day): Promise<number> {
  const rows = await db
    .select({
      dueOn: schema.checkIns.dueOn,
      closesOn: schema.checkIns.closesOn,
      status: schema.checkIns.status,
    })
    .from(schema.checkIns)
    .where(eq(schema.checkIns.clientId, clientId))
    .orderBy(desc(schema.checkIns.dueOn));

  let streak = 0;
  for (const r of rows) {
    const state = checkInState(r, now);
    if (state === "upcoming" || state === "overdue") continue;
    if (state === "completed") streak += 1;
    else break;
  }
  return streak;
}

/** One check-in with its answers, for the panel a coach opens. */
export async function getCheckIn(studioId: string, checkInId: string, now: Day = today()) {
  const [row] = await db
    .select({
      id: schema.checkIns.id,
      clientId: schema.checkIns.clientId,
      dueOn: schema.checkIns.dueOn,
      closesOn: schema.checkIns.closesOn,
      status: schema.checkIns.status,
      completedAt: schema.checkIns.completedAt,
    })
    .from(schema.checkIns)
    .innerJoin(schema.clients, eq(schema.clients.id, schema.checkIns.clientId))
    .where(
      and(
        eq(schema.checkIns.id, checkInId),
        eq(schema.clients.studioId, studioId),
        isNull(schema.clients.deletedAt),
      ),
    )
    .limit(1);

  if (!row) throw notFound("No such check-in.");

  const answers = await db
    .select({
      metricId: schema.metrics.id,
      code: schema.metrics.code,
      name: schema.metrics.name,
      type: schema.metrics.type,
      unit: schema.metrics.unit,
      numberValue: schema.checkInAnswers.numberValue,
      textValue: schema.checkInAnswers.textValue,
      ratingValue: schema.checkInAnswers.ratingValue,
      imageUrl: schema.checkInAnswers.imageUrl,
    })
    .from(schema.checkInAnswers)
    .innerJoin(schema.metrics, eq(schema.metrics.id, schema.checkInAnswers.metricId))
    .where(eq(schema.checkInAnswers.checkInId, checkInId))
    .orderBy(asc(schema.metrics.position), asc(schema.metrics.name));

  return { ...row, state: checkInState(row, now), answers };
}

/* -------------------------------------------------------------------------- */
/* Writing                                                                     */
/* -------------------------------------------------------------------------- */

export type AnswerInput = {
  metricId: string;
  numberValue?: number | null;
  textValue?: string | null;
  ratingValue?: number | null;
  imageUrl?: string | null;
};

/**
 * Record a submission.
 *
 * A check-in past its closing date is refused rather than quietly accepted: the whole
 * value of the grace window is that it ends, and a rate computed from submissions that
 * ignored the deadline measures nothing.
 */
export async function submitCheckIn(
  studioId: string,
  checkInId: string,
  answers: AnswerInput[],
  now: Day = today(),
) {
  const [row] = await db
    .select({
      id: schema.checkIns.id,
      clientId: schema.checkIns.clientId,
      userId: schema.clients.userId,
      dueOn: schema.checkIns.dueOn,
      closesOn: schema.checkIns.closesOn,
      status: schema.checkIns.status,
    })
    .from(schema.checkIns)
    .innerJoin(schema.clients, eq(schema.clients.id, schema.checkIns.clientId))
    .where(
      and(
        eq(schema.checkIns.id, checkInId),
        eq(schema.clients.studioId, studioId),
        isNull(schema.clients.deletedAt),
      ),
    )
    .limit(1);

  if (!row) throw notFound("No such check-in.");
  if (checkInState(row, now) === "missed") {
    throw badRequest("check_in_closed", `That check-in closed on ${row.closesOn}.`);
  }

  // Every metric has to be one this studio may use — the shared library or its own.
  const ids = [...new Set(answers.map((a) => a.metricId))];
  const allowed = ids.length
    ? await db
        .select({ id: schema.metrics.id, code: schema.metrics.code })
        .from(schema.metrics)
        .where(
          and(
            inArray(schema.metrics.id, ids),
            or(isNull(schema.metrics.studioId), eq(schema.metrics.studioId, studioId)),
            isNull(schema.metrics.archivedAt),
          ),
        )
    : [];

  if (allowed.length !== ids.length) {
    throw badRequest("unknown_metric", "One of those metrics is gone.");
  }

  await db.transaction(async (tx) => {
    await tx.delete(schema.checkInAnswers).where(eq(schema.checkInAnswers.checkInId, checkInId));

    if (answers.length) {
      await tx.insert(schema.checkInAnswers).values(
        answers.map((a) => ({
          id: newId(),
          checkInId,
          metricId: a.metricId,
          numberValue: a.numberValue ?? null,
          textValue: a.textValue ?? null,
          ratingValue: a.ratingValue ?? null,
          imageUrl: a.imageUrl ?? null,
        })),
      );
    }

    await tx
      .update(schema.checkIns)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(schema.checkIns.id, checkInId));
    await activity(tx, row.clientId, "check-in", checkInId);
  });

  // A weight answer also lands in `body_metric` with source `check_in` — a value that
  // column was always documented to carry. That table stays the one series every chart
  // reads, rather than each of them having to union two sources.
  const weightMetric = allowed.find((m) => m.code === "weight");
  const weight = weightMetric
    ? answers.find((a) => a.metricId === weightMetric.id)?.numberValue
    : null;

  if (row.userId && typeof weight === "number") {
    await db.insert(schema.bodyMetrics).values({
      id: newId(),
      userId: row.userId,
      weightKg: weight,
      source: "check_in",
    });
  }

  return getCheckIn(studioId, checkInId, now);
}

/* -------------------------------------------------------------------------- */
/* Metrics                                                                     */
/* -------------------------------------------------------------------------- */

/** The shared library plus this studio's own, in asking order. */
export function listMetrics(studioId: string) {
  return db
    .select({
      id: schema.metrics.id,
      code: schema.metrics.code,
      name: schema.metrics.name,
      type: schema.metrics.type,
      unit: schema.metrics.unit,
      unitCategory: schema.metrics.unitCategory,
      position: schema.metrics.position,
      shared: sql<boolean>`${schema.metrics.studioId} is null`,
    })
    .from(schema.metrics)
    .where(
      and(
        or(isNull(schema.metrics.studioId), eq(schema.metrics.studioId, studioId)),
        isNull(schema.metrics.archivedAt),
      ),
    )
    .orderBy(asc(schema.metrics.position), asc(schema.metrics.name));
}

export async function createMetric(
  studioId: string,
  input: {
    code: string;
    name: string;
    type: "number" | "text" | "image" | "rating";
    unit?: string | null;
  },
) {
  const code = input.code.trim().toLowerCase();

  const [clash] = await db
    .select({ id: schema.metrics.id })
    .from(schema.metrics)
    .where(
      and(
        eq(schema.metrics.code, code),
        or(isNull(schema.metrics.studioId), eq(schema.metrics.studioId, studioId)),
      ),
    )
    .limit(1);

  if (clash) throw badRequest("metric_exists", "You already have a metric with that code.");

  const [metric] = await db
    .insert(schema.metrics)
    .values({
      id: newId(),
      studioId,
      code,
      name: input.name.trim(),
      type: input.type,
      unit: input.unit?.trim() || null,
      position: 100,
    })
    .returning();

  return metric;
}
