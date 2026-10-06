import { schema } from "@traiv/db";
import { and, eq, isNull, sql } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { hashOtp } from "../../lib/crypto.js";
import { resetPhones } from "../../test-support/reset.js";
import { requestChallenge, toE164, verifyChallenge } from "./service.js";

/**
 * The adversarial half of the auth flow.
 *
 * The existing suite asks whether the right thing happens. These ask what happens when
 * someone is actively trying to break it: concurrent guesses, concurrent wins, resend
 * used to reset a limit, and input shaped to defeat a uniqueness constraint.
 */
const N1 = "7950000001";
const N2 = "7950000002";
const ALL = [N1, N2];

async function wipe() {
  await resetPhones(ALL.map(toE164));
}

beforeEach(wipe);
afterAll(wipe);

describe("auth hardening", () => {
  // TWO ACTORS
  it("twenty concurrent wrong guesses cost twenty attempts, not one", async () => {
    await requestChallenge({ phone: N1 });

    // All twenty start before any of them finishes, which is the shape that let a
    // read-check-increment cycle hand out twenty guesses for the price of one.
    const results = await Promise.allSettled(
      Array.from({ length: 20 }, () => verifyChallenge({ phone: N1, code: "000000" })),
    );
    expect(results.every((r) => r.status === "rejected")).toBe(true);

    const [row] = await db
      .select({ attempts: schema.authChallenges.attempts })
      .from(schema.authChallenges)
      .where(eq(schema.authChallenges.phone, toE164(N1)))
      .limit(1);

    // The cap holds regardless of concurrency: attempts never exceed the maximum, and
    // the guesses that arrived after it was reached were refused rather than counted.
    expect(row?.attempts).toBeLessThanOrEqual(5);
    expect(row?.attempts).toBeGreaterThan(1);
  });

  // TWO ACTORS
  it("two correct submissions of the same code produce one session, not two", async () => {
    const issued = await requestChallenge({ phone: N1 });
    if (!issued.code) throw new Error("console transport expected");

    const both = await Promise.allSettled([
      verifyChallenge({ phone: N1, code: issued.code }),
      verifyChallenge({ phone: N1, code: issued.code }),
    ]);

    const won = both.filter((r) => r.status === "fulfilled");
    expect(won).toHaveLength(1);

    const sessions = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.sessions)
      .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
      .where(eq(schema.users.phone, toE164(N1)));
    expect(sessions[0]?.n).toBe(1);
  });

  // AFTER EXPIRY — the limit that actually binds
  it("resending does not reset the failure budget", async () => {
    await requestChallenge({ phone: N1 });

    // Burn the per-challenge cap, then ask for a fresh code and burn it again. The
    // per-challenge counter resets; the per-number budget must not.
    for (let round = 0; round < 4; round++) {
      for (let i = 0; i < 5; i++) {
        await verifyChallenge({ phone: N1, code: "000000" }).catch(() => {});
      }
      await requestChallenge({ phone: N1 }).catch(() => {});
    }

    await expect(verifyChallenge({ phone: N1, code: "000000" })).rejects.toMatchObject({
      status: 429,
    });
  });

  it("only one code is ever live for a number", async () => {
    await requestChallenge({ phone: N2 });
    await requestChallenge({ phone: N2 });
    await requestChallenge({ phone: N2 });

    const [row] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.authChallenges)
      .where(
        and(eq(schema.authChallenges.phone, toE164(N2)), isNull(schema.authChallenges.consumedAt)),
      );
    // Enforced by a partial unique index, so it holds even if the application forgets.
    expect(row?.n).toBe(1);
  });

  it("binds a code's hash to its own challenge", async () => {
    // The same six digits in two rows must not produce the same hash, or one recovered
    // code is reusable wherever it appears.
    expect(hashOtp("challenge-a", "123456")).not.toBe(hashOtp("challenge-b", "123456"));
    expect(hashOtp("challenge-a", "123456")).toBe(hashOtp("challenge-a", "123456"));
  });

  describe("phone normalisation", () => {
    it("collapses every written form to one stored value", () => {
      const canonical = toE164("9876543210");
      for (const form of [
        "9876543210",
        "+919876543210",
        "919876543210",
        "09876543210",
        "98765 43210",
        "+91 98765-43210",
      ]) {
        expect(toE164(form), form).toBe(canonical);
      }
    });

    it("refuses what it cannot store", () => {
      for (const bad of ["1234567890", "", "12345", "+15551234567", "abcdefghij"]) {
        expect(() => toE164(bad), bad).toThrow();
      }
    });

    it("is idempotent, so a stored number survives a second pass", () => {
      expect(toE164(toE164("9876543210"))).toBe(toE164("9876543210"));
    });
  });
});
