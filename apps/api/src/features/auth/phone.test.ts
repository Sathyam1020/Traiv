import { schema } from "@traiv/db";
import { COUNTRIES, DEFAULT_COUNTRY, parsePhone, phoneProblemMessage } from "@traiv/phone";
import { eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { requestChallenge, toE164, verifyChallenge } from "./service.js";

/**
 * The phone rule, which the API and all four apps share.
 *
 * It was `/^[6-9]\d{9}$/` copied into nine places. These assert the two things that
 * matters about replacing it: every written form of one number collapses to the same
 * stored value, and nothing India-specific leaks into what another country is told.
 */
describe("phone numbers", () => {
  it("collapses every written form to one stored value", () => {
    const canonical = "+919876543210";
    for (const form of [
      "9876543210",
      "+919876543210",
      "919876543210",
      "09876543210",
      "98765 43210",
      "+91 98765-43210",
      "(98765) 43210",
    ]) {
      expect(toE164(form), form).toBe(canonical);
    }
  });

  it("is idempotent, so a stored number survives another pass", () => {
    expect(toE164(toE164("9876543210"))).toBe(toE164("9876543210"));
  });

  it("refuses what it cannot store", () => {
    for (const bad of ["1234567890", "", "12345", "abcdefghij", "0000000000"]) {
      expect(() => toE164(bad), bad).toThrow();
    }
  });

  it("knows other countries", () => {
    expect(parsePhone("2133734253", "US")).toMatchObject({ ok: true, e164: "+12133734253" });
    expect(parsePhone("7400123456", "GB")).toMatchObject({ ok: true, e164: "+447400123456" });
    expect(parsePhone("501234567", "AE")).toMatchObject({ ok: true, e164: "+971501234567" });
  });

  it("keeps the country a number carries, whatever the field is set to", () => {
    // Somebody pastes a full international number into a field defaulted elsewhere.
    expect(parsePhone("+919876543210", "US")).toMatchObject({ ok: true, country: "IN" });
  });

  it("refuses a landline, which could never receive the code", () => {
    // A real Indian fixed line. Accepting it creates an account nobody can sign into.
    const r = parsePhone("+911123456789", "IN");
    expect(r.ok).toBe(false);
  });

  it("never names one country's rules to another country's user", () => {
    // The old message said "Indian mobile numbers start with 6, 7, 8 or 9" — useless to
    // anyone who is not Indian, and there are ~200 other rule sets.
    for (const code of ["US", "GB", "DE", "BR"] as const) {
      const msg = phoneProblemMessage("invalid", code);
      expect(msg).not.toMatch(/Indian/i);
      expect(msg).toContain(COUNTRIES.find((c) => c.code === code)?.name as string);
    }
  });

  it("offers a real example for every country it lists", () => {
    expect(COUNTRIES.length).toBeGreaterThan(200);
    const withoutExample = COUNTRIES.filter((c) => !c.examplePlain);
    expect(withoutExample).toHaveLength(0);
  });

  it("puts the market we serve first", () => {
    expect(COUNTRIES[0]?.code).toBe(DEFAULT_COUNTRY);
    expect(COUNTRIES[0]?.dial).toBe("91");
  });
});

/**
 * A coach outside India, through the real service and the real database.
 *
 * The parsing tests above would pass even if the `user_phone_e164` CHECK constraint were
 * still India-only — the row never gets written. This signs somebody up on a UAE number
 * end to end, which is the only way to know the whole path accepts them.
 */
describe("a coach outside India", () => {
  const FOREIGN = "+971501234567";

  async function wipe() {
    const [u] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.phone, FOREIGN))
      .limit(1);
    if (u) {
      await db.delete(schema.sessions).where(eq(schema.sessions.userId, u.id));
      await db.delete(schema.authIdentities).where(eq(schema.authIdentities.userId, u.id));
      await db.delete(schema.users).where(eq(schema.users.id, u.id));
    }
    await db.delete(schema.authChallenges).where(eq(schema.authChallenges.phone, FOREIGN));
  }

  beforeEach(wipe);
  afterAll(wipe);

  it("can sign up, and is stored in E.164 like everyone else", async () => {
    const sent = await requestChallenge({ phone: FOREIGN, name: "Aisha Rahman" });
    if (!sent.code) throw new Error("console transport expected in tests");

    const { user, isNew } = await verifyChallenge({ phone: FOREIGN, code: sent.code });
    expect(isNew).toBe(true);
    expect(user.phone).toBe(FOREIGN);
    expect(user.name).toBe("Aisha Rahman");
  });

  it("signs back in as the same person, not a second account", async () => {
    const first = await requestChallenge({ phone: FOREIGN, name: "Aisha Rahman" });
    const a = await verifyChallenge({ phone: FOREIGN, code: first.code as string });

    // The server defaults to India, so a bare foreign national number is refused rather
    // than quietly read as an Indian one — which would create a second, wrong account.
    expect(() => toE164("50 123 4567")).toThrow();

    // The form sends E.164, so the spacing the person typed makes no difference.
    const second = await requestChallenge({ phone: "+971 50 123 4567" });
    const b = await verifyChallenge({ phone: FOREIGN, code: second.code as string });

    expect(b.user.id).toBe(a.user.id);
    expect(b.isNew).toBe(false);
  });
});
