import { schema } from "@traiv/db";
import { eq, inArray } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const ADMIN = "7990000001";
const COACH = "7990000002";
const OUTSIDER = "7990000003";

/**
 * `OTP=NO` and the admin gate, which are both env-driven and so are tested with the env
 * overridden rather than by changing a file and restarting.
 *
 * Only the two flags move. Everything else — the database above all — stays real, because
 * the point is that the direct path creates exactly what the OTP path creates.
 */
vi.mock("./env.js", async (importActual) => {
  const actual = await importActual<typeof import("./env.js")>();
  return { ...actual, env: { ...actual.env, OTP: false, ADMIN_PHONE: ADMIN } };
});

const { db } = await import("./db.js");
const { toE164 } = await import("./features/auth/service.js");
const { listStudios } = await import("./features/studio/service.js");
const { becomeEndorser } = await import("./features/endorse/service.js");
const { Agent, startApi } = await import("./test-support/http.js");
const { resetPhones } = await import("./test-support/reset.js");

type TestServer = Awaited<ReturnType<typeof startApi>>;
let api: TestServer;
const ALL = [ADMIN, COACH, OUTSIDER];

async function wipe() {
  const phones = ALL.map(toE164);
  const mine = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(inArray(schema.users.phone, phones));
  const ids = mine.map((u) => u.id);

  if (ids.length) {
    // Scoped to this file's own numbers. A teardown that deletes every referral would
    // pass here and quietly break whichever suite runs next.
    await db
      .delete(schema.referrals)
      .where(
        inArray(
          schema.referrals.endorserId,
          db
            .select({ id: schema.endorsers.id })
            .from(schema.endorsers)
            .where(inArray(schema.endorsers.userId, ids)),
        ),
      );
    await db.delete(schema.endorsers).where(inArray(schema.endorsers.userId, ids));
  }
  await resetPhones(phones);
}

beforeAll(async () => {
  api = await startApi();
});
afterAll(async () => {
  await api.close();
  await wipe();
});
beforeEach(wipe);

/** Signs in over real HTTP with no code, the way the apps do when OTP is off. */
async function direct(phone: string, name?: string) {
  const agent = new Agent(api.url);
  const res = await agent.request("POST", "/auth/direct", { phone, ...(name ? { name } : {}) });
  if (res.status !== 200) throw new Error(`direct sign-in failed: ${res.status}`);
  return { agent, user: res.body.user as { id: string; name: string } };
}

describe("OTP=NO", () => {
  it("a phone number and a name are enough to create an account", async () => {
    const { user } = await direct(COACH, "Rahul Deshmukh");
    expect(user.name).toBe("Rahul Deshmukh");

    const [row] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.phone, toE164(COACH)));
    expect(row?.phoneVerifiedAt).not.toBeNull();
  });

  it("creates exactly what the OTP path creates", async () => {
    // The direct path runs the same establishSession, so a studio appears and the
    // account is a coach — the only thing skipped is proving the number.
    const { user } = await direct(COACH, "Rahul Deshmukh");
    const studios = await listStudios(user.id);
    expect(studios).toHaveLength(1);
    expect(studios[0]?.role).toBe("owner");
  });

  it("signing in again returns the same account", async () => {
    const first = await direct(COACH, "Rahul Deshmukh");
    const second = await direct(COACH);
    expect(second.user.id).toBe(first.user.id);

    const rows = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.phone, toE164(COACH)));
    expect(rows).toHaveLength(1);
  });

  it("still attributes a referral", async () => {
    const endorser = await direct(OUTSIDER, "Nikhil Rao");
    const { code } = await becomeEndorser(endorser.user.id);

    const agent = new Agent(api.url);
    const res = await agent.request("POST", "/auth/direct", {
      phone: COACH,
      name: "Rahul Deshmukh",
      endorserCode: code,
    });
    expect(res.body.referred).toBe(true);
  });

  it("still refuses an invalid endorser code", async () => {
    const res = await new Agent(api.url).request("POST", "/auth/direct", {
      phone: COACH,
      name: "Rahul",
      endorserCode: "NOTREAL1",
    });
    expect(res.status).toBe(404);
  });

  it("still refuses a number it cannot store", async () => {
    const res = await new Agent(api.url).request("POST", "/auth/direct", { phone: "1234567890" });
    expect(res.status).toBe(400);
  });

  it("fills in a missing name, and never replaces one", async () => {
    // The endorser and admin apps did not collect a name, so accounts created there were
    // nameless — and a nameless endorser shows up as "Referred by A Traiv endorser" to
    // whoever types their code.
    const created = await direct(COACH);
    expect(created.user.name).toBe("");

    const named = await direct(COACH, "Sathyam Sahu");
    expect(named.user.name).toBe("Sathyam Sahu");

    const again = await direct(COACH, "Someone Else");
    expect(again.user.name).toBe("Sathyam Sahu");
  });

  it("reports itself in /auth/config so the apps know to skip the code step", async () => {
    const res = await new Agent(api.url).get("/auth/config");
    expect(res.body.otpRequired).toBe(false);
  });
});

describe("the admin", () => {
  it("refuses an anonymous caller with 401", async () => {
    expect((await new Agent(api.url).get("/admin/stats")).status).toBe(401);
  });

  it("refuses a signed-in coach who is not the admin", async () => {
    const coach = await direct(COACH, "Rahul Deshmukh");
    expect((await coach.agent.get("/admin/stats")).status).toBe(403);
    expect((await coach.agent.get("/admin/me")).status).toBe(403);
  });

  it("admits the one phone number named by ADMIN_PHONE", async () => {
    const adm = await direct(ADMIN, "Platform Admin");
    expect((await adm.agent.get("/admin/me")).status).toBe(200);

    const res = await adm.agent.get("/admin/stats");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      trainers: expect.any(Number),
      clients: expect.any(Number),
      studios: expect.any(Number),
      endorsers: expect.any(Number),
      referrals: expect.any(Number),
    });
  });

  it("counts a trainer once however many studios they work in", async () => {
    const adm = await direct(ADMIN, "Platform Admin");
    const before = (await adm.agent.get("/admin/stats")).body.trainers as number;

    const coach = await direct(COACH, "Rahul Deshmukh");
    const after = (await adm.agent.get("/admin/stats")).body.trainers as number;
    expect(after).toBe(before + 1);

    // A second studio for the same person must not make them two trainers.
    const [own] = await listStudios(coach.user.id);
    await db.insert(schema.memberships).values({
      id: crypto.randomUUID(),
      studioId: own?.id as string,
      userId: adm.user.id,
      role: "coach",
      status: "active",
    });
    const third = (await adm.agent.get("/admin/stats")).body.trainers as number;
    expect(third).toBe(after); // the admin already counted as a trainer
  });

  it("gives the same answer to a non-admin whether or not an admin exists", async () => {
    // Otherwise the difference between the two responses reveals that one is configured.
    const outsider = await direct(OUTSIDER, "Nobody");
    const res = await outsider.agent.get("/admin/stats");
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Not allowed.");
  });
});
