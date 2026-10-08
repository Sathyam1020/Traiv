import { newId, schema } from "@traiv/db";
import { and, eq, isNull, sql } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { resetPhones } from "../../test-support/reset.js";
import { requestChallenge, toE164, verifyChallenge } from "../auth/service.js";
import { listStudios } from "../studio/service.js";
import { joinByCode, rotateJoinCode } from "./join.js";

/**
 * The adversarial half of joining.
 *
 * The existing join tests cover the happy path and the obvious refusals. These cover what
 * the review found everywhere else: concurrency, and statuses that should not count.
 */
const COACH = "8900000001";
const C1 = "8900000002";
const C2 = "8900000003";
const C3 = "8900000004";
const ALL = [COACH, C1, C2, C3];

async function wipe() {
  await resetPhones(ALL.map(toE164));
}
beforeEach(wipe);
afterAll(wipe);

async function signUp(phone: string, name: string) {
  const res = await requestChallenge({ phone, name });
  if (!res.code) throw new Error("console transport expected");
  const { user } = await verifyChallenge({ phone, code: res.code });
  return user;
}

async function coachWithStudio() {
  const user = await signUp(COACH, "Rahul Deshmukh");
  const [studio] = await listStudios(user.id);
  if (!studio) throw new Error("coach has no studio");
  const [row] = await db
    .select({ joinCode: schema.studios.joinCode })
    .from(schema.studios)
    .where(eq(schema.studios.id, studio.id))
    .limit(1);
  return { user, studioId: studio.id, joinCode: row?.joinCode as string };
}

describe("joining, under pressure", () => {
  // TWO ACTORS
  it("a double tap produces one client row, not a crash", async () => {
    const coach = await coachWithStudio();
    const client = await signUp(C1, "Priya Nair");

    // Both start before either finishes. The duplicate check used to be a read taken
    // before the lock, so both saw nothing and both inserted — the second hitting the
    // unique index as a 500 rather than coming back as "already joined".
    const both = await Promise.allSettled([
      joinByCode(client.id, coach.joinCode),
      joinByCode(client.id, coach.joinCode),
    ]);

    expect(both.every((r) => r.status === "fulfilled")).toBe(true);

    const [{ n } = { n: 0 }] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.clients)
      .where(and(eq(schema.clients.studioId, coach.studioId), isNull(schema.clients.deletedAt)));
    expect(n).toBe(1);
  });

  // TWO ACTORS
  it("concurrent joins cannot oversubscribe a free roster", async () => {
    const coach = await coachWithStudio();
    const a = await signUp(C1, "Priya Nair");
    const b = await signUp(C2, "Arjun Rao");
    const c = await signUp(C3, "Neha Shah");

    // Free tier seats two. Three people scan at once.
    const results = await Promise.allSettled([
      joinByCode(a.id, coach.joinCode),
      joinByCode(b.id, coach.joinCode),
      joinByCode(c.id, coach.joinCode),
    ]);

    const joined = results.filter((r) => r.status === "fulfilled");
    expect(joined).toHaveLength(2);

    const [{ n } = { n: 0 }] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.clients)
      .where(and(eq(schema.clients.studioId, coach.studioId), isNull(schema.clients.deletedAt)));
    expect(n).toBe(2);
  });

  it("an archived client does not hold a seat", async () => {
    const coach = await coachWithStudio();
    const a = await signUp(C1, "Priya Nair");
    const b = await signUp(C2, "Arjun Rao");

    await joinByCode(a.id, coach.joinCode);
    await joinByCode(b.id, coach.joinCode);

    // Full at two. Archiving one must free their place — counting every undeleted row
    // meant a coach who ended a relationship could never replace it.
    const c = await signUp(C3, "Neha Shah");
    await expect(joinByCode(c.id, coach.joinCode)).rejects.toMatchObject({ status: 403 });

    await db
      .update(schema.clients)
      .set({ status: "archived" })
      .where(and(eq(schema.clients.studioId, coach.studioId), eq(schema.clients.userId, a.id)));

    await expect(joinByCode(c.id, coach.joinCode)).resolves.toMatchObject({ status: "joined" });
  });

  it("a waiting client does not hold a seat either", async () => {
    const coach = await coachWithStudio();
    const a = await signUp(C1, "Priya Nair");
    await joinByCode(a.id, coach.joinCode);

    await db
      .update(schema.clients)
      .set({ status: "waiting" })
      .where(eq(schema.clients.studioId, coach.studioId));

    // Otherwise queued clients block each other out of the list they are queued in.
    const b = await signUp(C2, "Arjun Rao");
    const c = await signUp(C3, "Neha Shah");
    await expect(joinByCode(b.id, coach.joinCode)).resolves.toMatchObject({ status: "joined" });
    await expect(joinByCode(c.id, coach.joinCode)).resolves.toMatchObject({ status: "joined" });
  });

  it("a suspended owner is not handed new clients", async () => {
    const coach = await coachWithStudio();
    await db
      .update(schema.memberships)
      .set({ status: "suspended" })
      .where(eq(schema.memberships.studioId, coach.studioId));

    // requireStudio already treated suspended as not a member; joinByCode checked only
    // deletedAt, so the two disagreed about who counts as staff.
    const client = await signUp(C1, "Priya Nair");
    await expect(joinByCode(client.id, coach.joinCode)).rejects.toMatchObject({ status: 404 });
  });

  it("rotating returns a code that actually took effect", async () => {
    const coach = await coachWithStudio();
    const next = await rotateJoinCode(coach.studioId);

    expect(next).not.toBe(coach.joinCode);
    const [row] = await db
      .select({ joinCode: schema.studios.joinCode })
      .from(schema.studios)
      .where(eq(schema.studios.id, coach.studioId))
      .limit(1);
    expect(row?.joinCode).toBe(next);

    // And the old one is dead.
    const client = await signUp(C1, "Priya Nair");
    await expect(joinByCode(client.id, coach.joinCode)).rejects.toMatchObject({ status: 404 });
  });

  it("refuses to rotate a studio that no longer exists", async () => {
    await expect(rotateJoinCode(newId())).rejects.toMatchObject({ status: 404 });
  });
});
