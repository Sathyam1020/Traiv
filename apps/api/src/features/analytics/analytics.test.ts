import { newId, schema } from "@traiv/db";
import { eq, inArray } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { signUpOverHttp, startApi, type TestServer } from "../../test-support/http.js";
import { resetEmails } from "../../test-support/reset.js";
import { addDays, ROLLUP_NAME, rollupDay, runRollupTick, toDay } from "./rollup.js";

/**
 * Ingestion (`POST /analytics/events`) and the daily rollup, against the real database.
 *
 * `product_event.user_id` is a real FK, so every seeded row below needs a real user —
 * three are signed up once, in `beforeAll`, and reused across every test rather than
 * re-created per test. That FK is also `on delete set null`, not cascading, so
 * `resetEmails` at the very end would leave this file's product_event rows behind if
 * they weren't deleted first by the exact ids this file tracked. `daily_metric_rollup`
 * and `analytics_checkpoint` are untouched by every other suite, so this file owns
 * clearing them outright between tests.
 *
 * Every historical event below is inserted directly with an explicit `receivedAt`,
 * bypassing `track()` — the whole point of several of these tests is to control that
 * column precisely, which a real caller never does.
 */
const COACH = "analytics-coach@example.com";
const USER_A = "analytics-user-a@example.com";
const USER_B = "analytics-user-b@example.com";
const ALL = [COACH, USER_A, USER_B];

let api: TestServer;
let userAId: string;
let userBId: string;
const insertedEventIds: string[] = [];

async function seedEvent(input: {
  userId: string;
  actorRole: "trainer" | "client";
  receivedAt: Date;
  occurredAt?: Date;
}) {
  const id = newId();
  insertedEventIds.push(id);
  await db.insert(schema.productEvents).values({
    id,
    name: "check_in_submitted",
    occurredAt: input.occurredAt ?? input.receivedAt,
    receivedAt: input.receivedAt,
    userId: input.userId,
    studioId: null,
    actorRole: input.actorRole,
    sourceApp: input.actorRole,
    properties: {},
  });
  return id;
}

async function wipeAnalytics() {
  if (insertedEventIds.length) {
    await db.delete(schema.productEvents).where(inArray(schema.productEvents.id, insertedEventIds));
    insertedEventIds.length = 0;
  }
  await db
    .delete(schema.analyticsCheckpoints)
    .where(eq(schema.analyticsCheckpoints.rollupName, ROLLUP_NAME));
  // Every row this file's rollup calls ever write is platform-scoped — safe to clear
  // in full between tests since no other suite writes this table.
  await db.delete(schema.dailyMetricRollups);
}

beforeAll(async () => {
  api = await startApi();
  const a = await signUpOverHttp(api.url, USER_A, "Test User A");
  const b = await signUpOverHttp(api.url, USER_B, "Test User B");
  userAId = a.userId;
  userBId = b.userId;
});

afterAll(async () => {
  await wipeAnalytics();
  await api.close();
  await resetEmails(ALL);
});

beforeEach(async () => {
  await wipeAnalytics();
});

describe("POST /analytics/events", () => {
  // SCENARIO: the second attempt — a retry or a double-send resends the same event id.
  it("a resent event is stored once, not twice", async () => {
    const coach = await signUpOverHttp(api.url, COACH, "Rahul Deshmukh");
    const id = newId();
    insertedEventIds.push(id);
    const body = {
      events: [
        {
          id,
          name: "check_in_submitted",
          occurredAt: new Date().toISOString(),
          sourceApp: "trainer",
          properties: { check_in_id: "x", on_time: true },
        },
      ],
    };

    const first = await coach.agent.post("/analytics/events", body);
    const second = await coach.agent.post("/analytics/events", body);

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    const rows = await db
      .select()
      .from(schema.productEvents)
      .where(eq(schema.productEvents.id, id));
    expect(rows).toHaveLength(1);
  });
});

describe("the daily rollup", () => {
  // SCENARIO: two actors — a trainer active a week ago and a client active today both
  // have to surface, correctly separated by role and by the DAU/WAU window they fall in.
  it("counts distinct users per role, and WAU reaches back 7 days while DAU does not", async () => {
    const day = addDays(toDay(new Date()), -30); // far from "today," so no other
    // suite's real-time activity lands in this window.

    await seedEvent({
      userId: userAId,
      actorRole: "trainer",
      receivedAt: new Date(`${addDays(day, -6)}T12:00:00Z`),
    });
    await seedEvent({
      userId: userBId,
      actorRole: "client",
      receivedAt: new Date(`${day}T12:00:00Z`),
    });

    await rollupDay(day);

    const rows = await db
      .select()
      .from(schema.dailyMetricRollups)
      .where(eq(schema.dailyMetricRollups.day, day));
    const value = (metric: string) => rows.find((r) => r.metric === metric)?.value;

    // The trainer's only event was 6 days before `day`, inside the 7-day window but
    // not on `day` itself.
    expect(value("dau_trainer")).toBe(0);
    expect(value("wau_trainer")).toBe(1);
    expect(value("dau_client")).toBe(1);
    expect(value("wau_client")).toBe(1);
  });

  // SCENARIO: out of order — a client-reported `occurredAt` cannot be trusted to order
  // or date anything; only the server's own `receivedAt` may.
  it("buckets an event by when the server received it, not by its self-reported occurredAt", async () => {
    const day = addDays(toDay(new Date()), -60);
    const farFuture = new Date(`${addDays(day, 400)}T00:00:00Z`); // a broken device clock

    await seedEvent({
      userId: userAId,
      actorRole: "client",
      receivedAt: new Date(`${day}T08:00:00Z`),
      occurredAt: farFuture,
    });

    await rollupDay(day);
    await rollupDay(addDays(day, 400));

    const onReceivedDay = await db
      .select()
      .from(schema.dailyMetricRollups)
      .where(eq(schema.dailyMetricRollups.day, day));
    const onOccurredDay = await db
      .select()
      .from(schema.dailyMetricRollups)
      .where(eq(schema.dailyMetricRollups.day, addDays(day, 400)));

    expect(onReceivedDay.find((r) => r.metric === "dau_client")?.value).toBe(1);
    expect(onOccurredDay.find((r) => r.metric === "dau_client")?.value).toBe(0);
  });

  // SCENARIO: a boundary case — an event one second either side of midnight must land
  // in exactly one day's DAU and exactly one day's MAU, never both and never neither.
  it("never double-counts or drops an event that falls right on a day or month boundary", async () => {
    const day = addDays(toDay(new Date()), -90);
    const prevDay = addDays(day, -1);
    const monthStartDay = addDays(day, -29); // inside the 30-day MAU window
    const justBeforeMonthStart = addDays(day, -30); // one day outside it

    await seedEvent({
      userId: userAId,
      actorRole: "trainer",
      receivedAt: new Date(`${prevDay}T23:59:59.999Z`),
    });
    await seedEvent({
      userId: userBId,
      actorRole: "trainer",
      receivedAt: new Date(`${day}T00:00:00.000Z`),
    });
    await seedEvent({
      userId: userAId,
      actorRole: "client",
      receivedAt: new Date(`${monthStartDay}T00:00:00.000Z`),
    });
    await seedEvent({
      userId: userBId,
      actorRole: "client",
      receivedAt: new Date(`${justBeforeMonthStart}T23:59:59.999Z`),
    });

    await rollupDay(prevDay);
    await rollupDay(day);

    const prevRows = await db
      .select()
      .from(schema.dailyMetricRollups)
      .where(eq(schema.dailyMetricRollups.day, prevDay));
    const dayRows = await db
      .select()
      .from(schema.dailyMetricRollups)
      .where(eq(schema.dailyMetricRollups.day, day));

    expect(prevRows.find((r) => r.metric === "dau_trainer")?.value).toBe(1);
    expect(dayRows.find((r) => r.metric === "dau_trainer")?.value).toBe(1);
    // The 30-day MAU window for `day` reaches back to `monthStartDay` inclusive, and no
    // further — the client one day earlier must not appear in it.
    expect(dayRows.find((r) => r.metric === "mau_client")?.value).toBe(1);
  });

  // SCENARIO: abandoned halfway — the rollup only ran once a while ago; a later run must
  // resume forward from the checkpoint rather than re-walking or getting stuck.
  it("resumes from the checkpoint instead of re-rolling up a day it already finished", async () => {
    const yesterday = addDays(toDay(new Date()), -1);
    await seedEvent({
      userId: userAId,
      actorRole: "trainer",
      receivedAt: new Date(`${yesterday}T10:00:00Z`),
    });

    await runRollupTick();
    const [afterFirst] = await db
      .select()
      .from(schema.analyticsCheckpoints)
      .where(eq(schema.analyticsCheckpoints.rollupName, ROLLUP_NAME));
    expect(afterFirst?.lastProcessedDay).toBe(yesterday);

    // A day further in the past arrives only now — already-finished work is never
    // redone, so the checkpoint must not move backward to pick it up.
    const longAgo = addDays(yesterday, -10);
    await seedEvent({
      userId: userBId,
      actorRole: "trainer",
      receivedAt: new Date(`${longAgo}T10:00:00Z`),
    });

    await runRollupTick();
    const [afterSecond] = await db
      .select()
      .from(schema.analyticsCheckpoints)
      .where(eq(schema.analyticsCheckpoints.rollupName, ROLLUP_NAME));
    expect(afterSecond?.lastProcessedDay).toBe(yesterday);

    const longAgoRows = await db
      .select()
      .from(schema.dailyMetricRollups)
      .where(eq(schema.dailyMetricRollups.day, longAgo));
    expect(longAgoRows).toHaveLength(0);
  });
});
