import { newId, schema } from "@traiv/db";
import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { isForeignKeyViolation, isUniqueViolation } from "../../lib/db-errors.js";
import { resetPhones } from "../../test-support/reset.js";
import { requestChallenge, toE164, verifyChallenge } from "../auth/service.js";
import { joinByCode } from "../client/join.js";
import { listStudios } from "../studio/service.js";
import {
  becomeEndorser,
  findEndorserByUser,
  listReferrals,
  previewEndorserCode,
} from "./service.js";

/**
 * Endorsers and attribution.
 *
 * Money is owed against these rows, so the cases that matter are the ones where a
 * referral is created twice, created for the wrong person, or quietly lost.
 */
const A = "7980000001";
const B = "7980000002";
const C = "7980000003";
const D = "7980000004";
const ALL = [A, B, C, D];

async function wipe() {
  // Referrals must go before the studios and endorsers they point at — the endorser FK
  // is `restrict` on purpose, so a half-ordered teardown fails loudly rather than
  // silently leaving rows behind.
  const phones = ALL.map(toE164);
  const users = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(inArray(schema.users.phone, phones));
  const ids = users.map((u) => u.id);

  if (ids.length) {
    const mine = db
      .select({ id: schema.endorsers.id })
      .from(schema.endorsers)
      .where(inArray(schema.endorsers.userId, ids));
    const theirStudios = db
      .select({ id: schema.memberships.studioId })
      .from(schema.memberships)
      .where(inArray(schema.memberships.userId, ids));

    await db
      .delete(schema.referrals)
      .where(
        or(
          inArray(schema.referrals.endorserId, mine),
          inArray(schema.referrals.studioId, theirStudios),
        ),
      );
    await db.delete(schema.endorsers).where(inArray(schema.endorsers.userId, ids));
  }
  await resetPhones(phones);
}

beforeEach(wipe);
afterAll(wipe);

async function signUp(phone: string, name: string, endorserCode?: string) {
  const res = await requestChallenge({ phone, name, ...(endorserCode ? { endorserCode } : {}) });
  if (!res.code) throw new Error("console transport expected");
  return verifyChallenge({ phone, code: res.code });
}

describe("endorsers", () => {
  it("anyone signed in can become one, and joining twice is the same record", async () => {
    const { user } = await signUp(A, "Nikhil Rao");

    const first = await becomeEndorser(user.id);
    const second = await becomeEndorser(user.id);

    // Two codes for one person would let them split referrals and hit milestone bonuses
    // twice over.
    expect(second.id).toBe(first.id);
    expect(second.code).toBe(first.code);

    const [{ n } = { n: 0 }] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.endorsers)
      .where(eq(schema.endorsers.userId, user.id));
    expect(n).toBe(1);
  });

  it("survives a double tap on the join button", async () => {
    const { user } = await signUp(A, "Nikhil Rao");

    const both = await Promise.allSettled([becomeEndorser(user.id), becomeEndorser(user.id)]);
    expect(both.every((r) => r.status === "fulfilled")).toBe(true);

    const [{ n } = { n: 0 }] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.endorsers)
      .where(eq(schema.endorsers.userId, user.id));
    expect(n).toBe(1);
  });

  it("a trainer can be an endorser", async () => {
    const { user } = await signUp(A, "Rahul Deshmukh");
    const [studio] = await listStudios(user.id);
    expect(studio).toBeDefined(); // they are a coach
    await expect(becomeEndorser(user.id)).resolves.toMatchObject({ referrals: 0 });
  });

  it("a client can be an endorser", async () => {
    const coach = await signUp(A, "Rahul Deshmukh");
    const [studio] = await listStudios(coach.user.id);
    const [row] = await db
      .select({ joinCode: schema.studios.joinCode })
      .from(schema.studios)
      .where(eq(schema.studios.id, studio?.id as string))
      .limit(1);

    const client = await signUp(B, "Priya Nair");
    await joinByCode(client.user.id, row?.joinCode as string);

    await expect(becomeEndorser(client.user.id)).resolves.toMatchObject({ referrals: 0 });
  });

  describe("attribution", () => {
    it("records the referral when a coach signs up with a code", async () => {
      const endorser = await signUp(A, "Nikhil Rao");
      const { code } = await becomeEndorser(endorser.user.id);

      const coach = await signUp(B, "Rahul Deshmukh", code);
      expect(coach.referred).toBe(true);

      const rows = await listReferrals(endorser.user.id);
      expect(rows).toHaveLength(1);
      expect(rows[0]?.studioName).toBe("Rahul Deshmukh");

      const summary = await findEndorserByUser(endorser.user.id);
      expect(summary?.referrals).toBe(1);
    });

    it("refuses an invalid code before sending a code, so a typo is fixable", async () => {
      // Validated at request time rather than after verification: dropping it silently
      // later would cost the endorser a referral nobody could see was missing.
      await expect(
        requestChallenge({ phone: B, name: "Rahul", endorserCode: "NOTREAL1" }),
      ).rejects.toMatchObject({ status: 404 });

      const [{ n } = { n: 0 }] = await db
        .select({ n: sql<number>`count(*)::int` })
        .from(schema.authChallenges)
        .where(eq(schema.authChallenges.phone, toE164(B)));
      expect(n).toBe(0); // and no OTP was sent
    });

    it("signing up without a code still works", async () => {
      const coach = await signUp(B, "Rahul Deshmukh");
      expect(coach.referred).toBe(false);
      expect(coach.isNew).toBe(true);
    });

    it("a studio is attributed once, ever", async () => {
      const one = await signUp(A, "Nikhil Rao");
      const two = await signUp(C, "Second Endorser");
      const first = await becomeEndorser(one.user.id);
      const second = await becomeEndorser(two.user.id);

      const coach = await signUp(B, "Rahul Deshmukh", first.code);
      expect(coach.referred).toBe(true);

      // Signing in again with a different code must not move the attribution.
      const again = await requestChallenge({ phone: B, endorserCode: second.code });
      if (!again.code) throw new Error("console transport expected");
      await verifyChallenge({ phone: B, code: again.code });

      expect(await listReferrals(one.user.id)).toHaveLength(1);
      expect(await listReferrals(two.user.id)).toHaveLength(0);
    });

    it("does not attribute a studio to the person who owns it", async () => {
      const self = await signUp(A, "Rahul Deshmukh");
      const { code } = await becomeEndorser(self.user.id);
      const [own] = await listStudios(self.user.id);

      // Reachable only if a code is ever accepted after signup, which it is not today —
      // but the rule is written down, so it is enforced and tested rather than assumed.
      const { attributeStudio } = await import("./service.js");
      const done = await attributeStudio(db, {
        studioId: own?.id as string,
        ownerUserId: self.user.id,
        code,
      });
      expect(done).toBe(false);
      expect(await listReferrals(self.user.id)).toHaveLength(0);
    });

    it("an endorser who has referred someone cannot be deleted", async () => {
      const endorser = await signUp(A, "Nikhil Rao");
      const { id, code } = await becomeEndorser(endorser.user.id);
      await signUp(B, "Rahul Deshmukh", code);

      // Money is owed against the referral, so the row it points at has to stay.
      // Asserted through isForeignKeyViolation rather than err.code, because Drizzle
      // wraps the driver error and the code lives on `cause`.
      const err = await db
        .delete(schema.endorsers)
        .where(eq(schema.endorsers.id, id))
        .then(() => null)
        .catch((e: unknown) => e);
      expect(err).not.toBeNull();
      expect(isForeignKeyViolation(err)).toBe(true);
    });
  });

  describe("reading", () => {
    it("tells a non-endorser they have not joined, rather than erroring vaguely", async () => {
      const { user } = await signUp(A, "Nikhil Rao");
      expect(await findEndorserByUser(user.id)).toBeNull();
      await expect(listReferrals(user.id)).rejects.toMatchObject({ code: "not_an_endorser" });
    });

    it("the public code check reveals a name and nothing else", async () => {
      const endorser = await signUp(A, "Nikhil Rao");
      const { code } = await becomeEndorser(endorser.user.id);

      const preview = await previewEndorserCode(code.toLowerCase());
      expect(preview).toEqual({ name: "Nikhil Rao" });
    });

    it("an unknown code and a deleted endorser look the same", async () => {
      const endorser = await signUp(A, "Nikhil Rao");
      const { id, code } = await becomeEndorser(endorser.user.id);
      await db
        .update(schema.endorsers)
        .set({ deletedAt: new Date() })
        .where(eq(schema.endorsers.id, id));

      const deleted = await previewEndorserCode(code).catch((e) => e);
      const unknown = await previewEndorserCode("ZZZZZZZZ").catch((e) => e);
      expect(deleted.status).toBe(unknown.status);
      expect(deleted.message).toBe(unknown.message);
    });

    it("only lists your own referrals", async () => {
      const one = await signUp(A, "Nikhil Rao");
      const two = await signUp(C, "Second Endorser");
      const a = await becomeEndorser(one.user.id);
      await becomeEndorser(two.user.id);
      await signUp(B, "Rahul Deshmukh", a.code);

      expect(await listReferrals(one.user.id)).toHaveLength(1);
      expect(await listReferrals(two.user.id)).toHaveLength(0);
    });

    it("a deleted endorser frees their code and their slot", async () => {
      const { user } = await signUp(A, "Nikhil Rao");
      const first = await becomeEndorser(user.id);
      await db
        .update(schema.endorsers)
        .set({ deletedAt: new Date() })
        .where(eq(schema.endorsers.id, first.id));

      // The partial unique index is what makes rejoining possible at all.
      const second = await becomeEndorser(user.id);
      expect(second.id).not.toBe(first.id);

      const [{ n } = { n: 0 }] = await db
        .select({ n: sql<number>`count(*)::int` })
        .from(schema.endorsers)
        .where(and(eq(schema.endorsers.userId, user.id), isNull(schema.endorsers.deletedAt)));
      expect(n).toBe(1);
      expect(newId()).toEqual(expect.any(String));
    });
  });
});

describe("drizzle wraps driver errors", () => {
  it("finds a constraint code through the wrapper", async () => {
    const { user } = await signUp(A, "Nikhil Rao");
    const { code } = await becomeEndorser(user.id);

    // The same code twice. A check against err.code would be false here — silently, and
    // only on a collision nobody can reproduce on demand, which is how rotateJoinCode's
    // retry shipped broken.
    const err = await db
      .insert(schema.endorsers)
      .values({ id: newId(), userId: newId(), code })
      .then(() => null)
      .catch((e: unknown) => e);

    expect(err).not.toBeNull();
    expect((err as { code?: string }).code).toBeUndefined();
    expect(isUniqueViolation(err)).toBe(true);
  });
});
