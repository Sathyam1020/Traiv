import { schema } from "@traiv/db";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db.js";
import { badRequest, notFound } from "../../errors.js";
import {
  type AnswerInput,
  checkInState,
  type Day,
  getCheckIn,
  listMetrics,
  submitCheckIn,
  today,
} from "../studio/check-ins.js";

/**
 * The client's own side of check-ins.
 *
 * Every function here delegates to the service in `../studio/check-ins.ts` rather than
 * re-implementing it, so there is exactly one definition of what a check-in state is,
 * when one closes, and what submitting does to `body_metric`. Two implementations of
 * "is this overdue" is two answers to the same question, and the coach's grid and the
 * client's card would eventually disagree in front of both of them.
 *
 * What this file adds is one thing: ownership. `requireClient` proves you may act in
 * this studio and `requireClient({ write: true })` proves your coaching is running —
 * neither proves *this* check-in is yours, and the studio-side service scopes only to
 * the studio because a coach legitimately reads every client's.
 */

/** How much history the client's own list shows — a year of weekly check-ins. */
const HISTORY_LIMIT = 52;

/**
 * Assert this check-in is this client's, before anything else looks at it.
 *
 * 404 rather than 403 when it belongs to somebody else. A client has no business
 * learning that a given id exists in their coach's studio at all, and answering
 * differently for "not yours" and "not real" is how an id becomes an oracle.
 */
async function assertOwned(clientId: string, checkInId: string): Promise<void> {
  const [row] = await db
    .select({ clientId: schema.checkIns.clientId })
    .from(schema.checkIns)
    .where(eq(schema.checkIns.id, checkInId))
    .limit(1);

  if (!row || row.clientId !== clientId) throw notFound("No such check-in.");
}

/**
 * The client's history, newest first, with the tally derived from the same rows.
 *
 * Newest first because the client reads backwards from now, where the coach's grid reads
 * left to right through time. The tally comes off this list rather than its own query —
 * it is the same 52 rows either way, and two queries could answer differently.
 */
export async function listClientCheckIns(clientId: string, now: Day = today()) {
  const rows = await db
    .select({
      id: schema.checkIns.id,
      dueOn: schema.checkIns.dueOn,
      closesOn: schema.checkIns.closesOn,
      status: schema.checkIns.status,
      completedAt: schema.checkIns.completedAt,
    })
    .from(schema.checkIns)
    .where(eq(schema.checkIns.clientId, clientId))
    .orderBy(desc(schema.checkIns.dueOn))
    .limit(HISTORY_LIMIT);

  const checkIns = rows.map((r) => ({
    id: r.id,
    dueOn: r.dueOn,
    closesOn: r.closesOn,
    completedAt: r.completedAt?.toISOString() ?? null,
    state: checkInState(r, now),
  }));

  const completed = checkIns.filter((c) => c.state === "completed").length;
  const missed = checkIns.filter((c) => c.state === "missed").length;
  const settled = completed + missed;

  return {
    checkIns,
    completed,
    missed,
    // Null rather than 0 when nothing has settled. A client in their first week has not
    // failed at anything, and "0%" is a lie told by an average over nothing. Upcoming
    // and overdue are both excluded because neither has been decided yet.
    completionRate: settled === 0 ? null : Math.round((completed / settled) * 100),
  };
}

/**
 * One check-in, with the questions to ask.
 *
 * The form *is* the studio's metric registry — there is no separate form entity, which
 * is the simplification `.ai/features/check-ins/spec.md` settled on. Questions and
 * answers both come back either way, so a half-answered form renders without a second
 * request and a completed one renders without guessing which metrics were asked.
 */
export async function getClientCheckIn(
  studioId: string,
  clientId: string,
  checkInId: string,
  now: Day = today(),
) {
  await assertOwned(clientId, checkInId);

  const [checkIn, metrics] = await Promise.all([
    getCheckIn(studioId, checkInId, now),
    listMetrics(studioId),
  ]);

  return { checkIn, metrics };
}

/**
 * Submit.
 *
 * Everything that makes a submission correct already happens in the studio service and
 * is already tested there: a closed check-in is refused, every metric is checked against
 * the studio's allow-list, previous answers are replaced rather than appended, and a
 * weight answer also lands in `body_metric`. This adds ownership and nothing else.
 */
export async function submitClientCheckIn(
  studioId: string,
  clientId: string,
  checkInId: string,
  answers: AnswerInput[],
  now: Day = today(),
  formVersion?: "weekly-v2",
) {
  await assertOwned(clientId, checkInId);
  if (formVersion === "weekly-v2") {
    const metrics = await listMetrics(studioId);
    const required = [
      "weight",
      "arm",
      "chest",
      "forearm",
      "hips",
      "thigh",
      "waist",
      "photo_back",
      "photo_front",
      "photo_side",
      "mood",
      "energy",
      "nutrition",
      "progress",
      "biggest_win",
      "training_feel",
      "sleep_quality",
    ];
    if (new Set(answers.map((a) => a.metricId)).size !== answers.length)
      throw badRequest("invalid_check_in", "Duplicate check-in answers.");
    for (const code of required) {
      const metric = metrics.find((m) => m.code === code && m.shared);
      const answer = answers.find((a) => a.metricId === metric?.id);
      let valid = false;
      if (metric && answer) {
        if (metric.type === "number")
          valid =
            typeof answer.numberValue === "number" &&
            Number.isFinite(answer.numberValue) &&
            answer.numberValue > 0 &&
            answer.numberValue <= (code === "weight" ? 500 : 300);
        else if (metric.type === "rating")
          valid =
            Number.isInteger(answer.ratingValue) &&
            Number(answer.ratingValue) >= 1 &&
            Number(answer.ratingValue) <= 5;
        else if (metric.type === "image") valid = Boolean(answer.imageUrl?.startsWith("https://"));
        else {
          const value = answer.textValue?.trim() ?? "";
          valid =
            value.length > 0 &&
            value.length <= 2048 &&
            (code !== "training_feel" ||
              ["Struggled", "Okay", "Good", "Great", "Amazing"].includes(value));
        }
      }
      if (!valid)
        throw badRequest(
          "invalid_check_in",
          "Complete all required check-in fields before submitting.",
        );
    }
  }
  return submitCheckIn(studioId, checkInId, answers, now);
}

export type { AnswerInput };
