import { schema } from "@traiv/db";
import { and, desc, eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { AppError } from "../../errors.js";
import {
  completeProfile,
  getUser,
  requestChallenge,
  revokeSession,
  toE164,
  verifyChallenge,
} from "./service.js";

/**
 * Scenario tests, per .ai/engineering/testing.md.
 *
 * These run against the real database and the real service layer. Nothing is mocked —
 * the bugs this file exists to catch live in the interaction between rows and ordering,
 * which a mock would paper over.
 *
 * Numbers are in a reserved 79xxxx range so they never collide with seeded coaches.
 */
const N1 = "7900000001";
const N2 = "7900000002";
const N3 = "7900000003";

/** The console transport already prints the code, so it comes straight back. */
async function latestCodeFor(phone: string) {
  const res = await requestChallenge({ phone });
  if (!res.code) throw new Error("console transport expected in tests");
  return res.code;
}

async function wipe() {
  for (const n of [N1, N2, N3]) {
    const phone = toE164(n);
    const [u] = await db.select().from(schema.users).where(eq(schema.users.phone, phone)).limit(1);
    if (u) {
      await db.delete(schema.sessions).where(eq(schema.sessions.userId, u.id));
      await db.delete(schema.authIdentities).where(eq(schema.authIdentities.userId, u.id));
      await db.delete(schema.users).where(eq(schema.users.id, u.id));
    }
    await db.delete(schema.authChallenges).where(eq(schema.authChallenges.phone, phone));
  }
}

beforeEach(wipe);
afterAll(wipe);

describe("phone sign-in", () => {
  it("creates an account the first time a number is used", async () => {
    // The code must come from this challenge — a second one would supersede it and
    // drop the pending name, which is the rule working, not a bug.
    const issued = await requestChallenge({ phone: N1, name: "Kavya Reddy" });
    const { user, isNew } = await verifyChallenge({ phone: N1, code: issued.code as string });

    expect(isNew).toBe(true);
    expect(user.name).toBe("Kavya Reddy");
    expect(user.phone).toBe(toE164(N1));
    expect(user.phoneVerifiedAt).not.toBeNull();
  });

  it("keeps the name across a restart — it lives on the row, not in memory", async () => {
    const issued = await requestChallenge({ phone: N1, name: "Meera Iyer" });

    // Nothing in process memory is consulted; the name is read back from the challenge.
    const [challenge] = await db
      .select()
      .from(schema.authChallenges)
      .where(eq(schema.authChallenges.phone, toE164(N1)))
      .limit(1);
    expect(challenge?.pendingName).toBe("Meera Iyer");

    const { user } = await verifyChallenge({ phone: N1, code: issued.code as string });
    expect(user.name).toBe("Meera Iyer");
  });

  // THE SECOND ATTEMPT
  it("signing up twice with the same number signs in, and does not duplicate", async () => {
    await requestChallenge({ phone: N1, name: "Kavya" });
    const first = await verifyChallenge({ phone: N1, code: await latestCodeFor(N1) });

    await requestChallenge({ phone: N1 });
    const second = await verifyChallenge({ phone: N1, code: await latestCodeFor(N1) });

    expect(second.isNew).toBe(false);
    expect(second.user.id).toBe(first.user.id);

    const rows = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.phone, toE164(N1)));
    expect(rows).toHaveLength(1);
  });

  // THE SECOND ATTEMPT
  it("rejects a code that has already been used", async () => {
    await requestChallenge({ phone: N1 });
    const code = await latestCodeFor(N1);
    await verifyChallenge({ phone: N1, code });

    await expect(verifyChallenge({ phone: N1, code })).rejects.toMatchObject({ code: "code_used" });
  });

  // OUT OF ORDER
  it("invalidates an older code as soon as a newer one is issued", async () => {
    await requestChallenge({ phone: N1 });
    const older = await latestCodeFor(N1);

    await requestChallenge({ phone: N1 });
    const newer = await latestCodeFor(N1);
    expect(newer).not.toBe(older);

    await expect(verifyChallenge({ phone: N1, code: older })).rejects.toMatchObject({
      code: "code_invalid",
    });
    await expect(verifyChallenge({ phone: N1, code: newer })).resolves.toBeTruthy();
  });

  // AFTER EXPIRY
  it("rejects an expired code", async () => {
    await requestChallenge({ phone: N1 });
    const code = await latestCodeFor(N1);

    await db
      .update(schema.authChallenges)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(schema.authChallenges.phone, toE164(N1)));

    await expect(verifyChallenge({ phone: N1, code })).rejects.toMatchObject({
      code: "code_expired",
    });
  });

  it("locks the code after five wrong attempts", async () => {
    await requestChallenge({ phone: N1 });
    const real = await latestCodeFor(N1);
    const wrong = real === "000000" ? "111111" : "000000";

    for (let i = 0; i < 5; i++) {
      await expect(verifyChallenge({ phone: N1, code: wrong })).rejects.toBeInstanceOf(AppError);
    }
    // Even the correct code is refused once the attempts are spent.
    await expect(verifyChallenge({ phone: N1, code: real })).rejects.toMatchObject({
      status: 429,
    });
  });

  it("rate limits to five sends an hour", async () => {
    for (let i = 0; i < 5; i++) await requestChallenge({ phone: N2 });
    await expect(requestChallenge({ phone: N2 })).rejects.toMatchObject({ status: 429 });
  });

  it("does not spend the hourly quota on sends that failed", async () => {
    // Five challenges that never reached the user — a provider outage, not their doing.
    for (let i = 0; i < 5; i++) {
      await db.insert(schema.authChallenges).values({
        id: crypto.randomUUID(),
        purpose: "phone_verify",
        phone: toE164(N2),
        codeHash: "x",
        expiresAt: new Date(Date.now() + 60_000),
        sentAt: null,
        sendError: "provider unavailable",
      });
    }

    // The next real request still goes through.
    await expect(requestChallenge({ phone: N2 })).resolves.toMatchObject({ sent: true });
  });

  it("records which channel delivered the code", async () => {
    const { transport } = await requestChallenge({ phone: N1 });
    const [row] = await db
      .select()
      .from(schema.authChallenges)
      .where(eq(schema.authChallenges.phone, toE164(N1)))
      .orderBy(desc(schema.authChallenges.createdAt))
      .limit(1);

    expect(row?.transport).toBe(transport);
    expect(row?.sentAt).not.toBeNull();
    expect(row?.sendError).toBeNull();
  });

  it("refuses to verify when no code was ever requested", async () => {
    await expect(verifyChallenge({ phone: N3, code: "123456" })).rejects.toMatchObject({
      code: "no_challenge",
    });
  });
});

describe("signup continued later", () => {
  // ABANDONED HALFWAY
  it("resumes at the email step when the account has no email yet", async () => {
    await requestChallenge({ phone: N1, name: "Rohan Das" });
    const { user } = await verifyChallenge({ phone: N1, code: await latestCodeFor(N1) });
    expect(user.email).toBeNull();

    // Days later, a fresh sign-in still reports the profile as incomplete.
    await requestChallenge({ phone: N1 });
    const again = await verifyChallenge({ phone: N1, code: await latestCodeFor(N1) });
    expect(again.user.email).toBeNull();

    const saved = await completeProfile(again.user.id, { email: "ROHAN@Example.com " });
    expect(saved.email).toBe("rohan@example.com");
  });
});

describe("sessions", () => {
  // TWO ACTORS
  it("a revoked session stops working while another stays valid", async () => {
    await requestChallenge({ phone: N1 });
    const a = await verifyChallenge({ phone: N1, code: await latestCodeFor(N1) });

    await requestChallenge({ phone: N1 });
    const b = await verifyChallenge({ phone: N1, code: await latestCodeFor(N1) });

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

  it("a user with a phone identity has exactly one", async () => {
    await requestChallenge({ phone: N1 });
    const { user } = await verifyChallenge({ phone: N1, code: await latestCodeFor(N1) });

    const ids = await db
      .select()
      .from(schema.authIdentities)
      .where(eq(schema.authIdentities.userId, user.id));
    expect(ids).toHaveLength(1);
    expect(ids[0]?.provider).toBe("phone");

    await expect(getUser(user.id)).resolves.toMatchObject({ id: user.id });
  });
});
