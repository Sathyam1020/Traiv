import { newId, schema } from "@traiv/db";
import { eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { resetPhones } from "../../test-support/reset.js";
import { requestChallenge, toE164, verifyChallenge } from "../auth/service.js";
import { listStudios } from "../studio/service.js";
import { joinByCode, newJoinCode, previewJoin, rotateJoinCode, setJoinEnabled } from "./join.js";

const COACH = "7920000001";
const CLIENT_A = "7920000002";
const CLIENT_B = "7920000003";
const CLIENT_C = "7920000004";
const ALL = [COACH, CLIENT_A, CLIENT_B, CLIENT_C];

async function codeFor(phone: string) {
  const res = await requestChallenge({ phone });
  if (!res.code) throw new Error("console transport expected in tests");
  return res.code;
}

async function signUp(phone: string, name: string) {
  // One challenge only: a second would supersede this one and drop the pending name.
  const res = await requestChallenge({ phone, name });
  if (!res.code) throw new Error("console transport expected in tests");
  const { user } = await verifyChallenge({ phone, code: res.code });
  return user;
}

/** A coach, their studio, and the join code a client would scan. */
async function makeCoach() {
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

async function wipe() {
  await resetPhones(ALL.map(toE164));
}

beforeEach(wipe);
afterAll(wipe);

describe("join codes", () => {
  it("are eight unambiguous characters", () => {
    const codes = Array.from({ length: 5000 }, newJoinCode);
    expect(codes.filter((c) => !/^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{8}$/.test(c))).toEqual([]);
    // 0/O and 1/I/L are indistinguishable when a code is read aloud or typed.
    expect(codes.filter((c) => /[01ILOU]/.test(c))).toEqual([]);
  });

  it("every new studio gets one", async () => {
    const { joinCode } = await makeCoach();
    expect(joinCode).toMatch(/^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{8}$/);
  });
});

describe("scanning the QR", () => {
  // SCENARIO 1
  it("a brand-new person signs up and is attached", async () => {
    const coach = await makeCoach();
    const client = await signUp(CLIENT_A, "Priya Sharma");

    const result = await joinByCode(client.id, coach.joinCode);

    expect(result.status).toBe("joined");
    const rows = await db.select().from(schema.clients).where(eq(schema.clients.userId, client.id));
    expect(rows).toHaveLength(1);
    expect(rows[0]?.studioId).toBe(coach.studioId);
    expect(rows[0]?.name).toBe("Priya Sharma");
    expect(rows[0]?.joinedVia).toBe("join_code");
    // Activation is the first logged workout, never the moment of joining.
    expect(rows[0]?.activatedAt).toBeNull();
  });

  // SCENARIO 2 — an existing user, already signed in
  it("an existing user is attached without a second account", async () => {
    const coach = await makeCoach();
    const joiner = await signUp(CLIENT_A, "Priya Sharma");
    await joinByCode(joiner.id, coach.joinCode);

    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.phone, toE164(CLIENT_A)));
    expect(users).toHaveLength(1);
  });

  // SCENARIO 3 — signed out, signs in, then attaches. The join must survive the gap.
  it("attaches after a fresh sign-in, not before", async () => {
    const coach = await makeCoach();
    const first = await signUp(CLIENT_A, "Priya Sharma");

    // Signed out, so scanning sends them through sign-in again before the join.
    const again = await verifyChallenge({ phone: CLIENT_A, code: await codeFor(CLIENT_A) });
    expect(again.isNew).toBe(false);
    expect(again.user.id).toBe(first.id);

    const result = await joinByCode(again.user.id, coach.joinCode);
    expect(result.status).toBe("joined");
  });

  // SCENARIO 4 — THE SECOND ATTEMPT
  it("scanning twice does not create a duplicate", async () => {
    const coach = await makeCoach();
    const client = await signUp(CLIENT_A, "Priya Sharma");

    const first = await joinByCode(client.id, coach.joinCode);
    const second = await joinByCode(client.id, coach.joinCode);

    expect(first.status).toBe("joined");
    expect(second.status).toBe("already_joined");
    expect(second.clientId).toBe(first.clientId);

    const rows = await db.select().from(schema.clients).where(eq(schema.clients.userId, client.id));
    expect(rows).toHaveLength(1);
  });

  // SCENARIO 6
  it("a coach cannot join their own studio as a client", async () => {
    const coach = await makeCoach();
    await expect(joinByCode(coach.user.id, coach.joinCode)).rejects.toMatchObject({
      code: "own_studio",
    });
  });

  // SCENARIO 8 — AFTER EXPIRY
  it("a rotated code invalidates every QR already in circulation", async () => {
    const coach = await makeCoach();
    const client = await signUp(CLIENT_A, "Priya Sharma");

    const fresh = await rotateJoinCode(coach.studioId);
    expect(fresh).not.toBe(coach.joinCode);

    await expect(joinByCode(client.id, coach.joinCode)).rejects.toMatchObject({ status: 404 });
    await expect(joinByCode(client.id, fresh)).resolves.toMatchObject({ status: "joined" });
  });

  it("refuses while joining is switched off, and works again once re-enabled", async () => {
    const coach = await makeCoach();
    const client = await signUp(CLIENT_A, "Priya Sharma");

    await setJoinEnabled(coach.studioId, false);
    await expect(joinByCode(client.id, coach.joinCode)).rejects.toMatchObject({
      code: "join_disabled",
    });
    await expect(previewJoin(coach.joinCode)).rejects.toMatchObject({ code: "join_disabled" });

    await setJoinEnabled(coach.studioId, true);
    await expect(joinByCode(client.id, coach.joinCode)).resolves.toMatchObject({
      status: "joined",
    });
  });

  it("is case-insensitive, because people type these by hand", async () => {
    const coach = await makeCoach();
    const client = await signUp(CLIENT_A, "Priya Sharma");
    await expect(joinByCode(client.id, coach.joinCode.toLowerCase())).resolves.toMatchObject({
      status: "joined",
    });
  });

  it("shows who you are joining before you sign in", async () => {
    const coach = await makeCoach();
    const preview = await previewJoin(coach.joinCode);
    expect(preview.name).toBe("Rahul Deshmukh");
    expect(preview.studioId).toBe(coach.studioId);
  });

  it("rejects a code that never existed", async () => {
    const client = await signUp(CLIENT_A, "Priya Sharma");
    await expect(joinByCode(client.id, "ZZZZZZZZ")).rejects.toMatchObject({ status: 404 });
  });
});

describe("seat limits", () => {
  // SCENARIO 7
  it("refuses once a free studio is full", async () => {
    const coach = await makeCoach();
    const a = await signUp(CLIENT_A, "Priya Sharma");
    const b = await signUp(CLIENT_B, "Aditya Nair");
    const c = await signUp(CLIENT_C, "Meera Iyer");

    await joinByCode(a.id, coach.joinCode);
    await joinByCode(b.id, coach.joinCode);

    // Free is two clients (ADR 0001).
    await expect(joinByCode(c.id, coach.joinCode)).rejects.toMatchObject({ status: 403 });
  });

  it("lets them in once the studio upgrades", async () => {
    const coach = await makeCoach();
    const a = await signUp(CLIENT_A, "Priya Sharma");
    const b = await signUp(CLIENT_B, "Aditya Nair");
    const c = await signUp(CLIENT_C, "Meera Iyer");

    await joinByCode(a.id, coach.joinCode);
    await joinByCode(b.id, coach.joinCode);
    await db
      .update(schema.studios)
      .set({ tier: "pro" })
      .where(eq(schema.studios.id, coach.studioId));

    await expect(joinByCode(c.id, coach.joinCode)).resolves.toMatchObject({ status: "joined" });
  });

  // SCENARIO 10 — TWO ACTORS
  it("two people scanning at once cannot both take the last slot", async () => {
    const coach = await makeCoach();
    const a = await signUp(CLIENT_A, "Priya Sharma");
    const b = await signUp(CLIENT_B, "Aditya Nair");
    const c = await signUp(CLIENT_C, "Meera Iyer");

    await joinByCode(a.id, coach.joinCode); // one of two seats taken

    const results = await Promise.allSettled([
      joinByCode(b.id, coach.joinCode),
      joinByCode(c.id, coach.joinCode),
    ]);

    const ok = results.filter((r) => r.status === "fulfilled");
    // The seat count is taken inside the transaction with the studio row locked, so the
    // second joiner sees the first one's insert rather than a stale count.
    expect(ok).toHaveLength(1);

    const rows = await db
      .select()
      .from(schema.clients)
      .where(eq(schema.clients.studioId, coach.studioId));
    expect(rows).toHaveLength(2);
  });
});

describe("a client of more than one coach", () => {
  // SCENARIO 5 — confirmed intended: a lifting coach and a dietitian are two relationships
  it("can join a second studio and keep the first", async () => {
    const first = await makeCoach();
    const client = await signUp(CLIENT_A, "Priya Sharma");
    await joinByCode(client.id, first.joinCode);

    // A second, unrelated studio.
    const otherStudioId = newId();
    const otherUserId = newId();
    await db
      .insert(schema.users)
      .values({ id: otherUserId, phone: toE164(CLIENT_B), name: "Dietitian" });
    await db.insert(schema.studios).values({
      id: otherStudioId,
      slug: `other-${Date.now().toString(36)}`,
      name: "Dietitian",
      joinCode: newJoinCode(),
      tier: "pro",
    });
    const membershipId = newId();
    await db.insert(schema.memberships).values({
      id: membershipId,
      studioId: otherStudioId,
      userId: otherUserId,
      role: "owner",
    });
    const [other] = await db
      .select({ joinCode: schema.studios.joinCode })
      .from(schema.studios)
      .where(eq(schema.studios.id, otherStudioId))
      .limit(1);

    await expect(joinByCode(client.id, other?.joinCode as string)).resolves.toMatchObject({
      status: "joined",
    });

    const rows = await db.select().from(schema.clients).where(eq(schema.clients.userId, client.id));
    expect(rows).toHaveLength(2);
    expect(new Set(rows.map((r) => r.studioId)).size).toBe(2);
  });
});
