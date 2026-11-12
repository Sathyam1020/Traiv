import { newId, schema } from "@traiv/db";
import { and, desc, eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { resetEmails } from "../../test-support/reset.js";
import { requestChallenge, verifyChallenge } from "../auth/service.js";
import { becomeEndorser } from "../endorse/service.js";
import { saveRecipe } from "../studio/nutrition.js";
import { updateClient } from "../studio/roster.js";
import { listStudios, renameStudio } from "../studio/service.js";
import { createTemplate } from "../studio/workouts.js";

/**
 * The Phase 2 server-side events whose `track()` call is gated on real conditional
 * logic — not "does this event exist," but "does it fire on exactly the state
 * transition it claims to, and not on the retries/no-ops around it." Each test below
 * targets one such transition this session's own instrumentation introduced:
 *
 *  - `business_name_confirmed`: the false→true edge, not every later rename.
 *  - `roster_status_changed` / `check_in_schedule_set`: fire independently, and only
 *    when the field they describe actually changed.
 *  - `workout_template_created` vs `workout_assigned_to_client`: the same function
 *    (`createTemplate`) has to pick the right one of two events from one argument.
 *  - `referral_code_created` / `referral_attributed`: idempotent join, and an invalid
 *    code must not fire an attribution that never happened.
 *  - `recipe_created`: once on the genuine insert, never on an update of the same row.
 */

const COACH = "phase2-events-coach@example.com";
const COACH_B = "phase2-events-coach-b@example.com";
const CLIENT = "phase2-events-client@example.com";
const ALL = [COACH, COACH_B, CLIENT];

async function signUp(email: string, name: string, endorserCode?: string) {
  const res = await requestChallenge({ email, name, ...(endorserCode ? { endorserCode } : {}) });
  if (!res.code) throw new Error("console transport expected in tests");
  return verifyChallenge({ email, code: res.code });
}

async function membershipFor(userId: string, studioId: string) {
  const [row] = await db
    .select({ id: schema.memberships.id })
    .from(schema.memberships)
    .where(and(eq(schema.memberships.userId, userId), eq(schema.memberships.studioId, studioId)))
    .limit(1);
  if (!row) throw new Error("signup did not create a membership");
  return row.id;
}

async function eventsNamed(name: string, userId: string) {
  return db
    .select()
    .from(schema.productEvents)
    .where(and(eq(schema.productEvents.name, name), eq(schema.productEvents.userId, userId)))
    .orderBy(desc(schema.productEvents.receivedAt));
}

async function wipe() {
  await resetEmails(ALL);
}

beforeEach(wipe);
afterAll(wipe);

describe("business_name_confirmed", () => {
  it("fires on the false-to-true edge only, never on a later rename", async () => {
    const { user } = await signUp(COACH, "Rahul Deshmukh");
    const [studio] = await listStudios(user.id);
    if (!studio) throw new Error("coach has no studio");

    await renameStudio(studio.id, user.id, "Rahul's Strength Co");
    await renameStudio(studio.id, user.id, "Rahul's Strength Co, Renamed");

    const fired = await eventsNamed("business_name_confirmed", user.id);
    expect(fired).toHaveLength(1);
  });
});

describe("roster_status_changed and check_in_schedule_set", () => {
  it("fire independently, and only when the field they describe actually changed", async () => {
    const { user } = await signUp(COACH, "Nikhil Rao");
    const [studio] = await listStudios(user.id);
    if (!studio) throw new Error("coach has no studio");
    const membershipId = await membershipFor(user.id, studio.id);

    const clientId = newId();
    await db
      .insert(schema.clients)
      .values({ id: clientId, studioId: studio.id, coachId: membershipId, name: "Priya Sharma" });

    // Only the schedule changes — no status in the patch at all.
    await updateClient(studio.id, clientId, membershipId, { checkInWeekday: 2 });
    // Only the status changes.
    await updateClient(studio.id, clientId, membershipId, { status: "paused" });
    // Same status again — a no-op write, must not re-fire.
    await updateClient(studio.id, clientId, membershipId, { status: "paused" });

    const statusChanges = await eventsNamed("roster_status_changed", user.id);
    const scheduleChanges = await eventsNamed("check_in_schedule_set", user.id);

    expect(statusChanges).toHaveLength(1);
    expect(statusChanges[0]?.properties).toEqual({ from_status: "active", to_status: "paused" });
    expect(scheduleChanges).toHaveLength(1);
  });
});

describe("workout_template_created vs workout_assigned_to_client", () => {
  it("createTemplate fires the library event for clientId=null, the assignment event otherwise", async () => {
    const { user } = await signUp(COACH, "Arjun Rao");
    const [studio] = await listStudios(user.id);
    if (!studio) throw new Error("coach has no studio");
    const membershipId = await membershipFor(user.id, studio.id);

    const clientId = newId();
    await db
      .insert(schema.clients)
      .values({ id: clientId, studioId: studio.id, coachId: membershipId, name: "Sana Iyer" });

    await createTemplate(studio.id, null, membershipId, {
      name: "Push Pull Legs",
      sessions: [
        { name: "Push", exercises: [] },
        { name: "Pull", exercises: [] },
      ],
    });
    await createTemplate(studio.id, clientId, membershipId, {
      name: "Sana's Programme",
      sessions: [{ name: "Day 1", exercises: [] }],
    });

    const libraryCreated = await eventsNamed("workout_template_created", user.id);
    const assigned = await eventsNamed("workout_assigned_to_client", user.id);

    expect(libraryCreated).toHaveLength(1);
    expect(libraryCreated[0]?.properties).toEqual({ session_count: 2 });
    expect(assigned).toHaveLength(1);
    expect(assigned[0]?.properties).toEqual({});
  });
});

describe("referral_code_created and referral_attributed", () => {
  it("joining twice fires the event once, and an invalid code attributes nothing", async () => {
    const { user: endorser } = await signUp(COACH, "Nikhil Rao");
    const first = await becomeEndorser(endorser.id);
    const second = await becomeEndorser(endorser.id);
    expect(second.id).toBe(first.id);

    const created = await eventsNamed("referral_code_created", endorser.id);
    expect(created).toHaveLength(1);

    // An invalid code is refused before signup even starts (`previewEndorserCode`,
    // checked at the challenge step) — so there is no path to a spurious attribution.
    await expect(
      requestChallenge({ email: COACH_B, name: "Someone Else", endorserCode: "ZZZZZZZZ" }),
    ).rejects.toMatchObject({
      status: 404,
    });

    // A real code attributes correctly, with the right endorser id in the properties.
    const { user: referred } = await signUp(CLIENT, "Priya Sharma", first.code);
    const goodAttribution = await eventsNamed("referral_attributed", referred.id);
    expect(goodAttribution).toHaveLength(1);
    // The endorser *record's* id (`first.id`), not the endorser's own user id.
    expect(goodAttribution[0]?.properties).toEqual({ endorser_id: first.id });
  });
});

describe("acquisition attribution", () => {
  it("writes first/last touch on a fresh signup with utm params, and nothing when there are none", async () => {
    const withUtm = await requestChallenge({
      email: COACH,
      name: "Rahul Deshmukh",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "launch",
    });
    if (!withUtm.code) throw new Error("console transport expected in tests");
    const { user: a } = await verifyChallenge({ email: COACH, code: withUtm.code });

    const [attribution] = await db
      .select()
      .from(schema.acquisitionAttributions)
      .where(eq(schema.acquisitionAttributions.userId, a.id));
    expect(attribution?.firstTouchSource).toBe("google");
    expect(attribution?.firstTouchMedium).toBe("cpc");
    expect(attribution?.firstTouchCampaign).toBe("launch");

    const withoutUtm = await requestChallenge({ email: COACH_B, name: "Someone Else" });
    if (!withoutUtm.code) throw new Error("console transport expected in tests");
    const { user: b } = await verifyChallenge({ email: COACH_B, code: withoutUtm.code });

    const rows = await db
      .select()
      .from(schema.acquisitionAttributions)
      .where(eq(schema.acquisitionAttributions.userId, b.id));
    expect(rows).toHaveLength(0);
  });
});

describe("recipe_created", () => {
  it("fires once on the genuine insert, never again when the same recipe is updated", async () => {
    const { user } = await signUp(COACH, "Meera Pillai");
    const [studio] = await listStudios(user.id);
    if (!studio) throw new Error("coach has no studio");
    const membershipId = await membershipFor(user.id, studio.id);

    const id = newId();
    const input = {
      id,
      name: "Paneer Bhurji",
      servings: 2,
      mealTypes: ["lunch"],
      difficulty: "easy" as const,
      prepMinutes: 10,
      cookMinutes: 15,
      ingredients: [] as never[],
      steps: ["Heat oil", "Add paneer"],
    };

    const saved = await saveRecipe(studio.id, membershipId, input as never);
    await saveRecipe(
      studio.id,
      membershipId,
      {
        ...input,
        name: "Paneer Bhurji, Updated",
        expectedUpdatedAt: new Date(saved.updatedAt).toISOString(),
      } as never,
      id,
    );

    const fired = await eventsNamed("recipe_created", user.id);
    expect(fired).toHaveLength(1);
    expect(fired[0]?.properties).toEqual({ source: "coach" });
  });
});
