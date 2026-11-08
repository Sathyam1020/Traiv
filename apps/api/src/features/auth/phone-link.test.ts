import { newId, schema } from "@traiv/db";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { Agent, startApi, type TestServer } from "../../test-support/http.js";
import { devIssueSession, requestPhoneLink, toE164, verifyPhoneLink } from "./service.js";

/**
 * Scenario tests, per .ai/engineering/testing.md.
 *
 * The phone step for an account that proved itself another way (Google): it has no
 * phone, `needsPhone` gates it (ADR 0010), and this is what finishing that step does —
 * attaches a phone to the *session that already exists*, never establishSession's
 * look-up-or-create-by-phone. The HTTP layer is exercised too, not just the service
 * functions, because requireSession is the actual gate an unauthenticated caller hits.
 *
 * Numbers are in a reserved 797xxxx range — auth.test.ts uses 790xxxxx, no-otp-and-admin
 * uses 799xxxxx.
 */
const N1 = "7970000001";
const EMAIL_A = "phone-link-a@example.com";
const EMAIL_B = "phone-link-b@example.com";

let api: TestServer;

async function createGoogleUser(email: string, name: string) {
  const [user] = await db
    .insert(schema.users)
    .values({ id: newId(), email, name, emailVerifiedAt: new Date() })
    .returning();
  if (!user) throw new Error("setup failed");
  return user;
}

/** Leaves an Agent signed in exactly the way the Google callback does — no phone yet. */
async function signedInAs(userId: string) {
  const { token } = await devIssueSession(userId);
  const agent = new Agent(api.url);
  agent.setCookie("traiv_session", token);
  return agent;
}

async function wipe() {
  await db.delete(schema.authChallenges).where(eq(schema.authChallenges.phone, toE164(N1)));
  for (const email of [EMAIL_A, EMAIL_B]) {
    const [u] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (u) {
      await db.delete(schema.sessions).where(eq(schema.sessions.userId, u.id));
      await db.delete(schema.users).where(eq(schema.users.id, u.id));
    }
  }
}

beforeAll(async () => {
  api = await startApi();
});
afterAll(async () => {
  await api.close();
  await wipe();
});
beforeEach(wipe);

describe("attaching a phone to a session that already exists", () => {
  it("sets the phone on the signed-in account, not a new one", async () => {
    const user = await createGoogleUser(EMAIL_A, "Priya Kulkarni");
    const agent = await signedInAs(user.id);

    const issued = await requestPhoneLink(user.id, { phone: N1 });
    if (!issued.code) throw new Error("console transport expected in tests");

    const res = await agent.request("POST", "/auth/phone/verify", {
      phone: N1,
      code: issued.code,
    });

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ id: user.id, phone: toE164(N1), needsPhone: false });

    const rows = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.phone, toE164(N1)));
    expect(rows).toHaveLength(1); // not a second account
    expect(rows[0]?.id).toBe(user.id);
  });

  it("requires a session — an anonymous caller cannot attach a phone to anyone", async () => {
    const res = await new Agent(api.url).request("POST", "/auth/phone/verify", {
      phone: N1,
      code: "000000",
    });
    expect(res.status).toBe(401);
  });

  it("refuses a number another account already proved", async () => {
    const owner = await createGoogleUser(EMAIL_A, "Already Has It");
    await db
      .update(schema.users)
      .set({ phone: toE164(N1), phoneVerifiedAt: new Date() })
      .where(eq(schema.users.id, owner.id));

    const claimant = await createGoogleUser(EMAIL_B, "Wants The Same Number");
    await expect(requestPhoneLink(claimant.id, { phone: N1 })).rejects.toMatchObject({
      code: "phone_taken",
    });
  });

  it("re-checks uniqueness at verify time, not only at request time", async () => {
    // The race this guards: the number was free when the code was requested, but
    // something else (a normal signup elsewhere, a different link in flight) claims it
    // before this code is spent. The code itself is still genuinely theirs — the number
    // just is not, any more — so verifying must fail even though the OTP was correct.
    const user = await createGoogleUser(EMAIL_A, "Wants N1");
    const issued = await requestPhoneLink(user.id, { phone: N1 });
    if (!issued.code) throw new Error("console transport expected in tests");

    const other = await createGoogleUser(EMAIL_B, "Got There First");
    await db
      .update(schema.users)
      .set({ phone: toE164(N1), phoneVerifiedAt: new Date() })
      .where(eq(schema.users.id, other.id));

    await expect(verifyPhoneLink(user.id, { phone: N1, code: issued.code })).rejects.toMatchObject({
      code: "phone_taken",
    });

    const rows = await db.select().from(schema.users).where(eq(schema.users.id, user.id));
    expect(rows[0]?.phone).toBeNull(); // the correct code did not override the real owner
  });

  it("will not spend someone else's challenge", async () => {
    const owner = await createGoogleUser(EMAIL_A, "Owner");
    const intruder = await createGoogleUser(EMAIL_B, "Intruder");

    const issued = await requestPhoneLink(owner.id, { phone: N1 });
    if (!issued.code) throw new Error("console transport expected in tests");

    await expect(
      verifyPhoneLink(intruder.id, { phone: N1, code: issued.code }),
    ).rejects.toMatchObject({ code: "no_challenge" });
  });

  it("rejects the wrong code without spending the real one", async () => {
    const user = await createGoogleUser(EMAIL_A, "Rahul");
    await requestPhoneLink(user.id, { phone: N1 });

    await expect(verifyPhoneLink(user.id, { phone: N1, code: "000000" })).rejects.toMatchObject({
      code: "code_invalid",
    });

    const rows = await db.select().from(schema.users).where(eq(schema.users.id, user.id));
    expect(rows[0]?.phone).toBeNull();
  });

  it("burns the code on use, so it cannot be replayed", async () => {
    const user = await createGoogleUser(EMAIL_A, "Meera");
    const issued = await requestPhoneLink(user.id, { phone: N1 });
    if (!issued.code) throw new Error("console transport expected in tests");

    await verifyPhoneLink(user.id, { phone: N1, code: issued.code });
    await expect(verifyPhoneLink(user.id, { phone: N1, code: issued.code })).rejects.toMatchObject({
      code: "code_used",
    });
  });

  it("does not disturb the account's name or email", async () => {
    const user = await createGoogleUser(EMAIL_A, "Aarav Sharma");
    const issued = await requestPhoneLink(user.id, { phone: N1 });
    if (!issued.code) throw new Error("console transport expected in tests");

    const updated = await verifyPhoneLink(user.id, { phone: N1, code: issued.code });
    expect(updated.name).toBe("Aarav Sharma");
    expect(updated.email).toBe(EMAIL_A);
  });
});
