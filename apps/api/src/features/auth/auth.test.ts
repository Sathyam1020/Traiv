import { schema } from "@traiv/db";
import { and, desc, eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { AppError } from "../../errors.js";
import {
  completeProfile,
  devIssueSession,
  getUser,
  requestChallenge,
  revokeSession,
  signInDirect,
  verifyChallenge,
} from "./service.js";

/**
 * Scenario tests, per .ai/engineering/testing.md.
 *
 * These run against the real database and the real service layer. Nothing is mocked —
 * the bugs this file exists to catch live in the interaction between rows and ordering,
 * which a mock would paper over.
 *
 * Reserved addresses so they never collide with seeded coaches.
 */
const E1 = "auth-test-1@example.com";
const E2 = "auth-test-2@example.com";
const E3 = "auth-test-3@example.com";
/** The address `completeProfile` changes E1 to, in "profile updates" below. */
const E1_UPDATED = "rohan.new@example.com";

/** The console transport already prints the code, so it comes straight back. */
async function latestCodeFor(email: string) {
  const res = await requestChallenge({ email });
  if (!res.code) throw new Error("console transport expected in tests");
  return res.code;
}

async function wipe() {
  for (const email of [E1, E2, E3, E1_UPDATED]) {
    const [u] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (u) {
      await db.delete(schema.sessions).where(eq(schema.sessions.userId, u.id));
      await db.delete(schema.authIdentities).where(eq(schema.authIdentities.userId, u.id));
      await db.delete(schema.users).where(eq(schema.users.id, u.id));
    }
    await db.delete(schema.authChallenges).where(eq(schema.authChallenges.email, email));
  }
}

async function newestSession(userId: string) {
  const [s] = await db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.userId, userId))
    .orderBy(desc(schema.sessions.createdAt))
    .limit(1);
  return s;
}

beforeEach(wipe);
afterAll(wipe);

describe("email sign-in", () => {
  it("creates an account the first time an address is used", async () => {
    // The code must come from this challenge — a second one would supersede it and
    // drop the pending name, which is the rule working, not a bug.
    const issued = await requestChallenge({ email: E1, name: "Kavya Reddy" });
    const { user, isNew } = await verifyChallenge({ email: E1, code: issued.code as string });

    expect(isNew).toBe(true);
    expect(user.name).toBe("Kavya Reddy");
    expect(user.email).toBe(E1);
    expect(user.emailVerifiedAt).not.toBeNull();
  });

  it("keeps the name across a restart — it lives on the row, not in memory", async () => {
    const issued = await requestChallenge({ email: E1, name: "Meera Iyer" });

    // Nothing in process memory is consulted; the name is read back from the challenge.
    const [challenge] = await db
      .select()
      .from(schema.authChallenges)
      .where(eq(schema.authChallenges.email, E1))
      .limit(1);
    expect(challenge?.pendingName).toBe("Meera Iyer");

    const { user } = await verifyChallenge({ email: E1, code: issued.code as string });
    expect(user.name).toBe("Meera Iyer");
  });

  // THE SECOND ATTEMPT
  it("signing up twice with the same address signs in, and does not duplicate", async () => {
    await requestChallenge({ email: E1, name: "Kavya" });
    const first = await verifyChallenge({ email: E1, code: await latestCodeFor(E1) });

    await requestChallenge({ email: E1 });
    const second = await verifyChallenge({ email: E1, code: await latestCodeFor(E1) });

    expect(second.isNew).toBe(false);
    expect(second.user.id).toBe(first.user.id);

    const rows = await db.select().from(schema.users).where(eq(schema.users.email, E1));
    expect(rows).toHaveLength(1);
  });

  // THE SECOND ATTEMPT
  it("rejects a code that has already been used", async () => {
    await requestChallenge({ email: E1 });
    const code = await latestCodeFor(E1);
    await verifyChallenge({ email: E1, code });

    await expect(verifyChallenge({ email: E1, code })).rejects.toMatchObject({
      code: "code_used",
    });
  });

  // OUT OF ORDER
  it("invalidates an older code as soon as a newer one is issued", async () => {
    await requestChallenge({ email: E1 });
    const older = await latestCodeFor(E1);

    await requestChallenge({ email: E1 });
    const newer = await latestCodeFor(E1);
    expect(newer).not.toBe(older);

    await expect(verifyChallenge({ email: E1, code: older })).rejects.toMatchObject({
      code: "code_invalid",
    });
    await expect(verifyChallenge({ email: E1, code: newer })).resolves.toBeTruthy();
  });

  // AFTER EXPIRY
  it("rejects an expired code", async () => {
    await requestChallenge({ email: E1 });
    const code = await latestCodeFor(E1);

    await db
      .update(schema.authChallenges)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(schema.authChallenges.email, E1));

    await expect(verifyChallenge({ email: E1, code })).rejects.toMatchObject({
      code: "code_expired",
    });
  });

  it("locks the code after five wrong attempts", async () => {
    await requestChallenge({ email: E1 });
    const real = await latestCodeFor(E1);
    const wrong = real === "000000" ? "111111" : "000000";

    for (let i = 0; i < 5; i++) {
      await expect(verifyChallenge({ email: E1, code: wrong })).rejects.toBeInstanceOf(AppError);
    }
    // Even the correct code is refused once the attempts are spent.
    await expect(verifyChallenge({ email: E1, code: real })).rejects.toMatchObject({
      status: 429,
    });
  });

  it("rate limits to five sends an hour", async () => {
    for (let i = 0; i < 5; i++) await requestChallenge({ email: E2 });
    await expect(requestChallenge({ email: E2 })).rejects.toMatchObject({ status: 429 });
  });

  it("does not spend the hourly quota on sends that failed", async () => {
    // Five challenges that never reached the user — a provider outage, not their doing.
    // Written as superseded, because only one code per address may be live at a time now
    // and a retry supersedes the last: five live rows is a state that cannot occur.
    for (let i = 0; i < 5; i++) {
      await db.insert(schema.authChallenges).values({
        id: crypto.randomUUID(),
        purpose: "email_verify",
        email: E2,
        codeHash: "x",
        expiresAt: new Date(Date.now() + 60_000),
        sentAt: null,
        sendError: "provider unavailable",
        consumedAt: new Date(),
      });
    }

    // The next real request still goes through.
    await expect(requestChallenge({ email: E2 })).resolves.toMatchObject({ sent: true });
  });

  it("records which channel delivered the code", async () => {
    const { transport } = await requestChallenge({ email: E1 });
    const [row] = await db
      .select()
      .from(schema.authChallenges)
      .where(eq(schema.authChallenges.email, E1))
      .orderBy(desc(schema.authChallenges.createdAt))
      .limit(1);

    expect(row?.transport).toBe(transport);
    expect(row?.sentAt).not.toBeNull();
    expect(row?.sendError).toBeNull();
  });

  it("refuses to verify when no code was ever requested", async () => {
    await expect(verifyChallenge({ email: E3, code: "123456" })).rejects.toMatchObject({
      code: "no_challenge",
    });
  });
});

describe("profile updates", () => {
  it("normalizes and saves a changed email", async () => {
    await requestChallenge({ email: E1, name: "Rohan Das" });
    const { user } = await verifyChallenge({ email: E1, code: await latestCodeFor(E1) });
    expect(user.email).toBe(E1);

    const saved = await completeProfile(user.id, { email: "ROHAN.NEW@Example.com " });
    expect(saved.email).toBe("rohan.new@example.com");
  });
});

describe("sessions", () => {
  // TWO ACTORS
  it("a revoked session stops working while another stays valid", async () => {
    await requestChallenge({ email: E1 });
    const a = await verifyChallenge({ email: E1, code: await latestCodeFor(E1) });

    await requestChallenge({ email: E1 });
    const b = await verifyChallenge({ email: E1, code: await latestCodeFor(E1) });

    const sessions = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, a.user.id));
    expect(sessions.length).toBe(2);

    const [toRevoke] = sessions;
    if (!toRevoke) throw new Error("expected a session");
    await revokeSession(toRevoke.id);

    const after = await db
      .select()
      .from(schema.sessions)
      .where(and(eq(schema.sessions.userId, a.user.id), eq(schema.sessions.id, toRevoke.id)));
    expect(after[0]?.revokedAt).not.toBeNull();

    // The other session is untouched.
    const others = sessions.filter((s) => s.id !== toRevoke.id);
    expect(others[0]?.revokedAt).toBeNull();
    expect(b.user.id).toBe(a.user.id);
  });

  it("refuses to skip the code when OTP is required", async () => {
    // The guard is in the service, not only the route, so no caller can route around it.
    // Production additionally refuses to boot with OTP=NO — see env.ts.
    await expect(signInDirect({ email: E1, name: "Rahul" })).rejects.toMatchObject({
      code: "otp_required",
    });

    const rows = await db.select().from(schema.users).where(eq(schema.users.email, E1));
    expect(rows).toHaveLength(0); // and nothing was created on the way out
  });

  it("keeps the email credential in one place", async () => {
    await requestChallenge({ email: E1 });
    const { user } = await verifyChallenge({ email: E1, code: await latestCodeFor(E1) });

    // auth_identity is for federated providers only. The address lives on `user`, and
    // only there, so changing it cannot leave a stale row that still authenticates.
    const ids = await db
      .select()
      .from(schema.authIdentities)
      .where(eq(schema.authIdentities.userId, user.id));
    expect(ids).toHaveLength(0);

    const [row] = await db
      .select({ email: schema.users.email })
      .from(schema.users)
      .where(eq(schema.users.id, user.id));
    expect(row?.email).toBe(E1);

    await expect(getUser(user.id)).resolves.toMatchObject({ id: user.id });
  });

  /**
   * The dev bypass shipped calling issueSession with no studio, so every session it
   * made carried activeStudioId null and 403'd on every studio-scoped route while the
   * sidebar still rendered a studio name — /auth/me reads memberships, not the session.
   */
  it("every session a coach gets opens in a studio, however it was issued", async () => {
    await requestChallenge({ email: E1, name: "Rahul Deshmukh" });
    const { user } = await verifyChallenge({ email: E1, code: await latestCodeFor(E1) });

    const signedIn = await newestSession(user.id);
    expect(signedIn?.activeStudioId).not.toBeNull();

    await devIssueSession(user.id);
    const bypassed = await newestSession(user.id);
    expect(bypassed?.activeStudioId).toBe(signedIn?.activeStudioId);
  });
});
