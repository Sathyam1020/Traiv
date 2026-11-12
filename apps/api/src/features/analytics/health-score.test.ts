import { newId, schema } from "@traiv/db";
import { eq, inArray } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { resetEmails } from "../../test-support/reset.js";
import { requestChallenge, verifyChallenge } from "../auth/service.js";
import { listStudios } from "../studio/service.js";
import { computeHealthScores } from "./health-score.js";

/**
 * The health score is a weighted sum of five independent boolean/rate inputs
 * (`metric-definitions.md`'s table: 25/25/20/15/15) — the risk is in the wiring, not
 * the arithmetic: does each input actually read the right table, and does a studio with
 * nothing going for it score 0 rather than silently defaulting to full credit anywhere
 * except the one input (`noDropInActiveClients30d`) that's *supposed* to default to
 * full credit when there's no 30-day-old baseline yet.
 */
const COACH_FULL = "health-score-coach-full@example.com";
const COACH_EMPTY = "health-score-coach-empty@example.com";
const ALL = [COACH_FULL, COACH_EMPTY];
const CLIENT_EMAILS = [
  "priya-health-score-test@example.com",
  "arjun-health-score-test@example.com",
];

const insertedEventIds: string[] = [];
const insertedIntakeIds: string[] = [];

async function signUp(email: string, name: string) {
  const res = await requestChallenge({ email, name });
  if (!res.code) throw new Error("console transport expected in tests");
  return verifyChallenge({ email, code: res.code });
}

async function wipe() {
  const { productEvents, userIntakes, studioActivitySummaries, dailyMetricRollups } = schema;
  if (insertedEventIds.length) {
    await db.delete(productEvents).where(inArray(productEvents.id, insertedEventIds));
    insertedEventIds.length = 0;
  }
  if (insertedIntakeIds.length) {
    await db.delete(userIntakes).where(inArray(userIntakes.id, insertedIntakeIds));
    insertedIntakeIds.length = 0;
  }
  const users = await db.select().from(schema.users).where(inArray(schema.users.email, ALL));
  for (const u of users) {
    const memberships = await db
      .select()
      .from(schema.memberships)
      .where(eq(schema.memberships.userId, u.id));
    for (const m of memberships) {
      await db
        .delete(studioActivitySummaries)
        .where(eq(studioActivitySummaries.studioId, m.studioId));
      await db.delete(dailyMetricRollups).where(eq(dailyMetricRollups.studioId, m.studioId));
    }
  }
  await resetEmails(ALL);

  // The fake client-users are a separate, unrelated set of addresses, so `resetEmails`
  // above never reaches them — their `client` rows are already gone (cascaded with the
  // studio above), but the `user` rows themselves would otherwise leak across every run
  // of this file.
  await db.delete(schema.users).where(inArray(schema.users.email, CLIENT_EMAILS));
}

beforeEach(wipe);
afterAll(wipe);

async function seedEvent(name: string, userId: string, studioId: string, receivedAt: Date) {
  const id = newId();
  insertedEventIds.push(id);
  await db.insert(schema.productEvents).values({
    id,
    name,
    occurredAt: receivedAt,
    receivedAt,
    userId,
    studioId,
    actorRole: "trainer",
    sourceApp: "trainer",
    properties: {},
  });
}

describe("computeHealthScores", () => {
  it("gives full credit on every input a studio actually clears, and zero on every one it doesn't", async () => {
    const full = await signUp(COACH_FULL, "Rahul Deshmukh");
    const [fullStudio] = await listStudios(full.user.id);
    if (!fullStudio) throw new Error("setup: no studio");

    const empty = await signUp(COACH_EMPTY, "Nikhil Rao");
    const [emptyStudio] = await listStudios(empty.user.id);
    if (!emptyStudio) throw new Error("setup: no studio");

    // FULL: a recent login (signup itself just created one), an engaged client, a core
    // feature used, and a completed intake.
    const fullClientUserId = newId();
    await db.insert(schema.users).values({
      id: fullClientUserId,
      name: "Priya Sharma",
      email: "priya-health-score-test@example.com",
    });
    const fullClientId = newId();
    await db.insert(schema.clients).values({
      id: fullClientId,
      studioId: fullStudio.id,
      coachId: (
        await db
          .select({ id: schema.memberships.id })
          .from(schema.memberships)
          .where(eq(schema.memberships.userId, full.user.id))
          .limit(1)
      )[0]?.id as string,
      userId: fullClientUserId,
      name: "Priya Sharma",
    });
    const intakeId = newId();
    insertedIntakeIds.push(intakeId);
    await db.insert(schema.userIntakes).values({
      id: intakeId,
      userId: fullClientUserId,
      completedAt: new Date(),
    });
    await seedEvent("check_in_submitted", fullClientUserId, fullStudio.id, new Date());
    await seedEvent("workout_template_created", full.user.id, fullStudio.id, new Date());

    // EMPTY: a stale login, no engagement, no core feature, no intake at all for its
    // one client.
    await db
      .update(schema.sessions)
      .set({ lastUsedAt: new Date(Date.now() - 30 * 86_400_000) })
      .where(eq(schema.sessions.userId, empty.user.id));
    const emptyClientUserId = newId();
    await db.insert(schema.users).values({
      id: emptyClientUserId,
      name: "Arjun Rao",
      email: "arjun-health-score-test@example.com",
    });
    await db.insert(schema.clients).values({
      id: newId(),
      studioId: emptyStudio.id,
      coachId: (
        await db
          .select({ id: schema.memberships.id })
          .from(schema.memberships)
          .where(eq(schema.memberships.userId, empty.user.id))
          .limit(1)
      )[0]?.id as string,
      userId: emptyClientUserId,
      name: "Arjun Rao",
    });

    await computeHealthScores();

    const [fullSummary] = await db
      .select()
      .from(schema.studioActivitySummaries)
      .where(eq(schema.studioActivitySummaries.studioId, fullStudio.id));
    const [emptySummary] = await db
      .select()
      .from(schema.studioActivitySummaries)
      .where(eq(schema.studioActivitySummaries.studioId, emptyStudio.id));

    // 25 (login) + 25 (engaged) + 20 (core feature) + 15 (onboarding 1/1) + 15 (no
    // baseline yet, full credit) = 100.
    expect(fullSummary?.healthScore).toBe(100);
    const fullExplanation = fullSummary?.healthScoreExplanation as Record<
      string,
      { pass?: boolean }
    >;
    expect(fullExplanation.loggedInWithin7Days?.pass).toBe(true);
    expect(fullExplanation.activeClientEngaged?.pass).toBe(true);
    expect(fullExplanation.coreFeatureUsed14d?.pass).toBe(true);

    // 0 + 0 + 0 + 0 (onboarding 0/1) + 15 (no baseline yet, full credit) = 15.
    expect(emptySummary?.healthScore).toBe(15);
    const emptyExplanation = emptySummary?.healthScoreExplanation as Record<
      string,
      { pass?: boolean; rate?: number | null }
    >;
    expect(emptyExplanation.loggedInWithin7Days?.pass).toBe(false);
    expect(emptyExplanation.activeClientEngaged?.pass).toBe(false);
    expect(emptyExplanation.coreFeatureUsed14d?.pass).toBe(false);
    expect(emptyExplanation.onboardingCompletionRate?.rate).toBe(0);
  });
});
