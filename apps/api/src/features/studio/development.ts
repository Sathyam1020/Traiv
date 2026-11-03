import { schema } from "@traiv/db";
import { and, asc, desc, eq, gte, inArray, isNull, lte } from "drizzle-orm";
import { db } from "../../db.js";
import { badRequest, notFound } from "../../errors.js";
import { getToday } from "../client/today.js";
import { getCheckIn } from "./check-ins.js";

export async function developmentClient(studioId: string, clientId: string) {
  const [row] = await db
    .select({ userId: schema.clients.userId, name: schema.clients.name })
    .from(schema.clients)
    .where(
      and(
        eq(schema.clients.id, clientId),
        eq(schema.clients.studioId, studioId),
        isNull(schema.clients.deletedAt),
      ),
    )
    .limit(1);
  if (!row) throw notFound("No such client.");
  return row;
}
export async function development(studioId: string, clientId: string) {
  const client = await developmentClient(studioId, clientId);
  const rows = await db
    .select()
    .from(schema.checkIns)
    .where(and(eq(schema.checkIns.clientId, clientId), eq(schema.checkIns.status, "completed")))
    .orderBy(desc(schema.checkIns.completedAt))
    .limit(104);
  const ids = rows.map((r) => r.id);
  const [answers, reviews, profile] = await Promise.all([
    ids.length
      ? db
          .select({
            checkInId: schema.checkInAnswers.checkInId,
            code: schema.metrics.code,
            name: schema.metrics.name,
            unit: schema.metrics.unit,
            numberValue: schema.checkInAnswers.numberValue,
            ratingValue: schema.checkInAnswers.ratingValue,
            textValue: schema.checkInAnswers.textValue,
            imageUrl: schema.checkInAnswers.imageUrl,
          })
          .from(schema.checkInAnswers)
          .innerJoin(schema.metrics, eq(schema.metrics.id, schema.checkInAnswers.metricId))
          .where(inArray(schema.checkInAnswers.checkInId, ids))
          .orderBy(asc(schema.metrics.position))
      : Promise.resolve([]),
    ids.length
      ? db
          .select()
          .from(schema.checkInReviews)
          .where(
            and(
              eq(schema.checkInReviews.studioId, studioId),
              inArray(schema.checkInReviews.checkInId, ids),
            ),
          )
      : Promise.resolve([]),
    getToday(clientId, client.userId ?? null),
  ]);
  return {
    checkIns: rows.map((c) => ({
      ...c,
      answers: answers.filter((a) => a.checkInId === c.id),
      reviewed: reviews.some((r) => r.checkInId === c.id),
    })),
    weight: profile.weight,
    goal: profile.goal,
    clientName: client.name,
  };
}
export async function readSteps(clientId: string, start: string, end: string) {
  const [days, goals, profile] = await Promise.all([
    db
      .select()
      .from(schema.dailySteps)
      .where(
        and(
          eq(schema.dailySteps.clientId, clientId),
          gte(schema.dailySteps.date, start),
          lte(schema.dailySteps.date, end),
        ),
      )
      .orderBy(asc(schema.dailySteps.date)),
    db
      .select()
      .from(schema.stepGoals)
      .where(and(eq(schema.stepGoals.clientId, clientId), lte(schema.stepGoals.effectiveOn, end)))
      .orderBy(desc(schema.stepGoals.effectiveOn)),
    db
      .select({ heightCm: schema.userIntakes.heightCm })
      .from(schema.clients)
      .innerJoin(schema.userIntakes, eq(schema.userIntakes.userId, schema.clients.userId))
      .where(eq(schema.clients.id, clientId))
      .limit(1),
  ]);
  return { days, goals, defaultGoal: 10000, profile: profile[0] ?? null };
}
export async function saveSteps(clientId: string, date: string, count: number) {
  await db
    .insert(schema.dailySteps)
    .values({ clientId, date, count })
    .onConflictDoUpdate({
      target: [schema.dailySteps.clientId, schema.dailySteps.date],
      set: { count, updatedAt: new Date() },
    });
}
export async function saveStepGoal(clientId: string, date: string, count: number) {
  await db
    .insert(schema.stepGoals)
    .values({ clientId, effectiveOn: date, count })
    .onConflictDoUpdate({
      target: [schema.stepGoals.clientId, schema.stepGoals.effectiveOn],
      set: { count },
    });
}
export async function reviewDevelopment(
  studioId: string,
  clientId: string,
  checkInId: string,
  reviewerId: string,
) {
  await developmentClient(studioId, clientId);
  const checkIn = await getCheckIn(studioId, checkInId);
  if (checkIn.clientId !== clientId) {
    throw notFound();
  }
  if (checkIn.status !== "completed")
    throw badRequest("invalid_check_in", "Only submitted check-ins can be reviewed.");
  await db
    .insert(schema.checkInReviews)
    .values({ studioId, checkInId, reviewerId })
    .onConflictDoNothing();
}
