import { newId, schema } from "@traiv/db";
import { inArray } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const ADMIN = "admin-phase4-admin@example.com";
const ENDORSER = "admin-phase4-endorser@example.com";
const ALL = [ADMIN, ENDORSER];

/** Same admin-auth env override as `funnels.test.ts` / `no-otp-and-admin.test.ts`. */
vi.mock("../../env.js", async (importActual) => {
  const actual = await importActual<typeof import("../../env.js")>();
  return { ...actual, env: { ...actual.env, OTP: false, ADMIN_EMAIL: ADMIN } };
});

const { db } = await import("../../db.js");
const { Agent, startApi } = await import("../../test-support/http.js");
const { resetEmails } = await import("../../test-support/reset.js");

type TestServer = Awaited<ReturnType<typeof startApi>>;
let api: TestServer;
const createdFunnelIds: string[] = [];
const createdEndorserIds: string[] = [];
const createdReferralIds: string[] = [];
const createdStudioIds: string[] = [];

async function wipe() {
  if (createdReferralIds.length) {
    await db.delete(schema.referrals).where(inArray(schema.referrals.id, createdReferralIds));
    createdReferralIds.length = 0;
  }
  if (createdStudioIds.length) {
    await db.delete(schema.studios).where(inArray(schema.studios.id, createdStudioIds));
    createdStudioIds.length = 0;
  }
  if (createdEndorserIds.length) {
    await db.delete(schema.endorsers).where(inArray(schema.endorsers.id, createdEndorserIds));
    createdEndorserIds.length = 0;
  }
  if (createdFunnelIds.length) {
    await db
      .delete(schema.funnelDefinitions)
      .where(inArray(schema.funnelDefinitions.id, createdFunnelIds));
    createdFunnelIds.length = 0;
  }
  await resetEmails(ALL);
}

beforeAll(async () => {
  api = await startApi();
});
afterAll(async () => {
  await wipe();
  await api.close();
});
beforeEach(wipe);

async function signUp(email: string, name: string) {
  const agent = new Agent(api.url);
  const res = await agent.request("POST", "/auth/direct", { email, name });
  if (res.status !== 200)
    throw new Error(`signup failed: ${res.status} ${JSON.stringify(res.body)}`);
  return { agent, userId: (res.body.user as { id: string }).id };
}

describe("funnel builder CRUD", () => {
  it("creates, computes, edits, and deletes a funnel end to end", async () => {
    const admin = await signUp(ADMIN, "Admin");

    const created = await admin.agent.post("/admin/analytics/funnels", {
      name: "Test funnel",
      steps: [{ name: "signup_completed" }, { name: "client_joined" }],
    });
    expect(created.status).toBe(201);
    const funnelId = (created.body.funnel as { id: string }).id;
    createdFunnelIds.push(funnelId);

    const listed = await admin.agent.get("/admin/analytics/funnels");
    expect(listed.status).toBe(200);
    const names = (listed.body.funnels as { id: string; name: string }[]).map((f) => f.name);
    expect(names).toContain("Test funnel");

    const computed = await admin.agent.get(`/admin/analytics/funnels/${funnelId}`);
    expect(computed.status).toBe(200);
    expect(computed.body.name).toBe("Test funnel");
    expect((computed.body.steps as unknown[]).length).toBe(2);

    const updated = await admin.agent.patch(`/admin/analytics/funnels/${funnelId}`, {
      name: "Renamed funnel",
      steps: [
        { name: "signup_completed" },
        { name: "client_joined" },
        { name: "check_in_submitted" },
      ],
    });
    expect(updated.status).toBe(200);
    expect((updated.body.funnel as { name: string }).name).toBe("Renamed funnel");

    const recomputed = await admin.agent.get(`/admin/analytics/funnels/${funnelId}`);
    expect((recomputed.body.steps as unknown[]).length).toBe(3);

    const deleted = await admin.agent.delete(`/admin/analytics/funnels/${funnelId}`);
    expect(deleted.status).toBe(204);
    createdFunnelIds.length = 0; // already gone — nothing left for wipe() to delete

    const afterDelete = await admin.agent.get(`/admin/analytics/funnels/${funnelId}`);
    expect(afterDelete.status).toBe(404);
  });

  it("refuses a funnel with fewer than two steps", async () => {
    const admin = await signUp(ADMIN, "Admin");
    const res = await admin.agent.post("/admin/analytics/funnels", {
      name: "Too short",
      steps: [{ name: "signup_completed" }],
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /admin/analytics/referrals", () => {
  it("counts codes and attributed referrals separately, and conversion only over attributed studios", async () => {
    const admin = await signUp(ADMIN, "Admin");
    const endorserUser = await signUp(ENDORSER, "Endorser");

    const endorserId = newId();
    createdEndorserIds.push(endorserId);
    await db
      .insert(schema.endorsers)
      .values({ id: endorserId, userId: endorserUser.userId, code: "TESTCODE" });

    // One referral to a studio that's still active, one to a studio that's since
    // deleted — the conversion rate must only count the first.
    const activeStudioId = newId();
    createdStudioIds.push(activeStudioId);
    await db.insert(schema.studios).values({
      id: activeStudioId,
      name: "Active Studio",
      slug: `active-${activeStudioId.slice(0, 8)}`,
      joinCode: `ACTIVE${activeStudioId.slice(0, 4).toUpperCase()}`,
    });
    const deletedStudioId = newId();
    createdStudioIds.push(deletedStudioId);
    await db.insert(schema.studios).values({
      id: deletedStudioId,
      name: "Deleted Studio",
      slug: `deleted-${deletedStudioId.slice(0, 8)}`,
      joinCode: `DELETED${deletedStudioId.slice(0, 4).toUpperCase()}`,
      deletedAt: new Date(),
    });

    const referralActiveId = newId();
    createdReferralIds.push(referralActiveId);
    await db.insert(schema.referrals).values({
      id: referralActiveId,
      studioId: activeStudioId,
      endorserId,
      codeUsed: "TESTCODE",
    });
    const referralDeletedId = newId();
    createdReferralIds.push(referralDeletedId);
    await db.insert(schema.referrals).values({
      id: referralDeletedId,
      studioId: deletedStudioId,
      endorserId,
      codeUsed: "TESTCODE",
    });

    const res = await admin.agent.get("/admin/analytics/referrals?days=365");
    expect(res.status).toBe(200);
    expect(res.body.referralsAttributed).toBeGreaterThanOrEqual(2);
    // 1 of the (at least) 2 attributed studios in this window is still active.
    expect(res.body.activeConversionRate).toBeLessThan(1);
    expect(res.body.activeConversionRate).toBeGreaterThan(0);
  });
});
