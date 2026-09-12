import { newId, schema } from "@traiv/db";
import { eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { requestChallenge, toE164, verifyChallenge } from "../auth/service.js";
import { activateStudio, listStudios, resolveActiveStudio, studioSlug } from "./service.js";

const A = "7910000001";
const B = "7910000002";

async function codeFor(phone: string) {
  const res = await requestChallenge({ phone });
  if (!res.code) throw new Error("console transport expected in tests");
  return res.code;
}

async function signUp(phone: string, name: string) {
  // One challenge only: a second would supersede this one and drop the pending name.
  const res = await requestChallenge({ phone, name });
  if (!res.code) throw new Error("console transport expected in tests");
  return verifyChallenge({ phone, code: res.code });
}

async function wipe() {
  for (const n of [A, B]) {
    const [u] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.phone, toE164(n)))
      .limit(1);
    if (u) {
      const ms = await db
        .select()
        .from(schema.memberships)
        .where(eq(schema.memberships.userId, u.id));
      await db.delete(schema.memberships).where(eq(schema.memberships.userId, u.id));
      for (const m of ms) await db.delete(schema.studios).where(eq(schema.studios.id, m.studioId));
      await db.delete(schema.sessions).where(eq(schema.sessions.userId, u.id));
      await db.delete(schema.authIdentities).where(eq(schema.authIdentities.userId, u.id));
      await db.delete(schema.users).where(eq(schema.users.id, u.id));
    }
    await db.delete(schema.authChallenges).where(eq(schema.authChallenges.phone, toE164(n)));
  }
}

beforeEach(wipe);
afterAll(wipe);

describe("slug", () => {
  // Regression: the suffix was base64url, which emits `-` and `_`. An underscore is not
  // legal in a hostname and this becomes <slug>.traiv.app. One sample only caught it
  // intermittently, so check enough to be certain.
  it("is always first name plus six url-safe characters", () => {
    const bad = Array.from({ length: 5000 }, () => studioSlug("Sathyam Sahu")).filter(
      (s) => !/^sathyam-[a-z0-9]{6}$/.test(s),
    );
    expect(bad).toEqual([]);
  });

  it("never emits a character that is illegal in a hostname", () => {
    const all = Array.from({ length: 5000 }, () => studioSlug("Rahul Deshmukh"));
    expect(all.filter((s) => /[^a-z0-9-]/.test(s))).toEqual([]);
    expect(all.filter((s) => s.includes("--"))).toEqual([]);
  });

  it("never collides for the same name", () => {
    const slugs = new Set(Array.from({ length: 200 }, () => studioSlug("Rahul Deshmukh")));
    expect(slugs.size).toBe(200);
  });

  it("falls back when there is no usable name", () => {
    expect(studioSlug("")).toMatch(/^studio-[a-z0-9]{6}$/);
    expect(studioSlug("!!!")).toMatch(/^studio-[a-z0-9]{6}$/);
  });
});

describe("signup", () => {
  it("gives every new trainer exactly one studio, owned by them", async () => {
    const { user } = await signUp(A, "Sathyam Sahu");
    const mine = await listStudios(user.id);

    expect(mine).toHaveLength(1);
    expect(mine[0]?.role).toBe("owner");
    expect(mine[0]?.name).toBe("Sathyam Sahu");
    expect(mine[0]?.tier).toBe("free");
  });

  it("creates the studio in the same transaction — the session lands in it immediately", async () => {
    const { user } = await signUp(A, "Sathyam Sahu");
    const [session] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, user.id))
      .limit(1);

    // Regression: resolveActiveStudio used to read on a separate connection and could
    // not see the studio the same transaction had just written.
    expect(session?.activeStudioId).not.toBeNull();
    const mine = await listStudios(user.id);
    expect(session?.activeStudioId).toBe(mine[0]?.id);
  });

  it("names the studio 'My studio' when no name was given", async () => {
    await requestChallenge({ phone: A });
    const { user } = await verifyChallenge({ phone: A, code: await codeFor(A) });
    const mine = await listStudios(user.id);
    expect(mine[0]?.name).toBe("My studio");
  });

  // THE SECOND ATTEMPT
  it("signing in again does not create a second studio", async () => {
    const first = await signUp(A, "Sathyam Sahu");
    await requestChallenge({ phone: A });
    await verifyChallenge({ phone: A, code: await codeFor(A) });

    const mine = await listStudios(first.user.id);
    expect(mine).toHaveLength(1);
  });
});

describe("multiple studios", () => {
  // TWO ACTORS
  it("an invited coach opens in the studio that invited them, not their own", async () => {
    const owner = await signUp(A, "Rahul Deshmukh");
    const invitee = await signUp(B, "Sathyam Sahu");

    const [ownerStudio] = await listStudios(owner.user.id);
    if (!ownerStudio) throw new Error("expected a studio");

    await db.insert(schema.memberships).values({
      id: newId(),
      studioId: ownerStudio.id,
      userId: invitee.user.id,
      role: "coach",
      status: "active",
    });

    const mine = await listStudios(invitee.user.id);
    expect(mine).toHaveLength(2);
    expect(mine.filter((s) => s.role === "owner")).toHaveLength(1);

    const active = await resolveActiveStudio(invitee.user.id);
    expect(active).toBe(ownerStudio.id);
  });

  it("keeps the session's studio when it is still valid", async () => {
    const { user } = await signUp(A, "Sathyam Sahu");
    const [own] = await listStudios(user.id);
    if (!own) throw new Error("expected a studio");

    expect(await resolveActiveStudio(user.id, own.id)).toBe(own.id);
  });

  it("ignores a stale studio id the user is no longer a member of", async () => {
    const { user } = await signUp(A, "Sathyam Sahu");
    const [own] = await listStudios(user.id);
    // A studio they were removed from, or one that never existed.
    expect(await resolveActiveStudio(user.id, "01a00000-0000-7000-8000-000000000000")).toBe(
      own?.id,
    );
  });

  it("refuses to switch into a studio you are not a member of", async () => {
    const owner = await signUp(A, "Rahul Deshmukh");
    const outsider = await signUp(B, "Sathyam Sahu");
    const [ownerStudio] = await listStudios(owner.user.id);
    if (!ownerStudio) throw new Error("expected a studio");

    const [session] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, outsider.user.id))
      .limit(1);

    await expect(
      activateStudio(outsider.user.id, session?.id ?? "", ownerStudio.id),
    ).rejects.toMatchObject({ status: 403 });
  });

  it("persists the switch onto the session", async () => {
    const owner = await signUp(A, "Rahul Deshmukh");
    const invitee = await signUp(B, "Sathyam Sahu");
    const [ownerStudio] = await listStudios(owner.user.id);
    if (!ownerStudio) throw new Error("expected a studio");

    await db.insert(schema.memberships).values({
      id: newId(),
      studioId: ownerStudio.id,
      userId: invitee.user.id,
      role: "coach",
      status: "active",
    });

    const [session] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, invitee.user.id))
      .limit(1);
    const [own] = (await listStudios(invitee.user.id)).filter((s) => s.role === "owner");
    if (!session || !own) throw new Error("setup failed");

    await activateStudio(invitee.user.id, session.id, own.id);

    const [after] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.id, session.id));
    expect(after?.activeStudioId).toBe(own.id);
  });
});
