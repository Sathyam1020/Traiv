import { newId, schema } from "@traiv/db";
import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { type Agent, signUpOverHttp, startApi, type TestServer } from "../../test-support/http.js";
import { resetEmails } from "../../test-support/reset.js";
import { activity, photoMessage } from "./service.js";

const emails = [
  "messaging-coach@example.com",
  "messaging-client@example.com",
  "messaging-outside-coach@example.com",
];
let api: TestServer,
  coach: Agent,
  client: Agent,
  stranger: Agent,
  studioId: string,
  clientId: string,
  coachId: string,
  clientUserId: string;
let base: string, cbase: string;
beforeAll(async () => {
  api = await startApi();
  await resetEmails(emails);
  const a = await signUpOverHttp(api.url, emails[0]!, "Inbox Coach"),
    b = await signUpOverHttp(api.url, emails[1]!, "Inbox Client"),
    c = await signUpOverHttp(api.url, emails[2]!, "Outside Coach");
  coach = a.agent;
  client = b.agent;
  stranger = c.agent;
  coachId = a.userId;
  clientUserId = b.userId;
  const studios = (await coach.get("/studios")).body.studios as { id: string }[];
  studioId = studios[0]!.id;
  const [membership] = await db
    .select()
    .from(schema.memberships)
    .where(and(eq(schema.memberships.studioId, studioId), eq(schema.memberships.userId, coachId)));
  clientId = newId();
  await db.insert(schema.clients).values({
    id: clientId,
    studioId,
    coachId: membership!.id,
    userId: clientUserId,
    name: "Inbox Client",
  });
  base = `/studios/${studioId}/inbox/${clientId}`;
  cbase = `/c/${studioId}/chat`;
});
afterAll(async () => {
  if (studioId) await db.delete(schema.clients).where(eq(schema.clients.studioId, studioId));
  await resetEmails(emails);
  await api?.close();
});
describe("Unified inbox through authenticated HTTP", () => {
  it("isolates studios and rejects client access to the trainer API", async () => {
    expect((await stranger.get(`${base}/messages`)).status).toBe(403);
    expect((await client.get(`${base}/messages`)).status).toBe(403);
    expect((await stranger.get(`${cbase}/messages`)).status).toBe(403);
  });
  it("deduplicates retries, preserves text and rejects invalid replies", async () => {
    const id = newId(),
      body = { id, body: "Hello coach", assets: [] };
    expect((await client.post(`${cbase}/messages`, body)).status).toBe(201);
    expect((await client.post(`${cbase}/messages`, body)).status).toBe(201);
    const result = await coach.get(`${base}/messages`);
    expect(result.status).toBe(200);
    const rows = result.body.messages as { id: string; body: string; mine: boolean }[];
    expect(rows.filter((m) => m.id === id)).toHaveLength(1);
    expect(rows.find((m) => m.id === id)?.mine).toBe(false);
    expect(
      (await coach.post(`${base}/messages`, { id: newId(), body: "Reply", replyTo: newId() }))
        .status,
    ).toBe(404);
  });
  it("keeps reads channel-specific and supports reactions", async () => {
    const result = await coach.get(`${base}/messages`),
      messages = result.body.messages as { id: string }[],
      last = messages.at(-1)!;
    expect(
      (await coach.post(`${base}/read`, { messageId: last.id, channel: "photo" })).status,
    ).toBe(404);
    expect((await coach.post(`${base}/read`, { messageId: last.id, channel: "chat" })).status).toBe(
      200,
    );
    expect(
      (await coach.post(`${base}/reactions`, { messageId: last.id, emoji: "💪" })).status,
    ).toBe(200);
    const seen = (await client.get(`${cbase}/messages`)).body.messages as {
      id: string;
      read: boolean;
      reactions: unknown[];
    }[];
    expect(seen.find((m) => m.id === last.id)?.read).toBe(true);
    expect(seen.find((m) => m.id === last.id)?.reactions).toHaveLength(1);
  });
  it("does not attach unverified uploads or another user's assets", async () => {
    const id = newId();
    await db.insert(schema.mediaAssets).values({
      id,
      studioId,
      clientId,
      ownerId: clientUserId,
      key: "test",
      resourceType: "image",
      name: "Test",
    });
    expect(
      (await client.post(`${cbase}/messages`, { id: newId(), body: "", assets: [id] })).status,
    ).toBe(400);
    expect(
      (await coach.post(`${base}/messages`, { id: newId(), body: "", assets: [id] })).status,
    ).toBe(400);
    expect((await coach.get(`${base}/media/${id}`)).status).toBe(404);
  });
  it("mirrors Photo Log in one transaction without polluting normal chat", async () => {
    const id = newId();
    await db.transaction((tx) =>
      photoMessage(tx, { id, clientId, author: "client", note: "Lunch" }),
    );
    await db.transaction((tx) =>
      photoMessage(tx, { id, clientId, author: "client", note: "Lunch" }),
    );
    const photo = (await coach.get(`${base}/messages?channel=photo`)).body.messages as {
      id: string;
    }[];
    const normal = (await coach.get(`${base}/messages`)).body.messages as { id: string }[];
    expect(photo.filter((m) => m.id === id)).toHaveLength(1);
    expect(normal.some((m) => m.id === id)).toBe(false);
  });
  it("commits activity once and rolls it back with the domain transaction", async () => {
    const id = newId();
    await db
      .insert(schema.sessions_)
      .values({ id, clientId, date: "2026-11-02", completedAt: new Date(), totalCompletedSets: 3 });
    await db.transaction(async (tx) => {
      await activity(tx, clientId, "workout", id);
      await activity(tx, clientId, "workout", id);
    });
    const result = (await coach.get(`${base}/messages`)).body.messages as {
      sourceId: string;
      kind: string;
      detail: { totalCompletedSets: number };
    }[];
    expect(result.filter((m) => m.sourceId === id)).toHaveLength(1);
    expect(result.find((m) => m.sourceId === id)?.detail.totalCompletedSets).toBe(3);
    const rolled = newId();
    await expect(
      db.transaction(async (tx) => {
        await activity(tx, clientId, "workout", rolled);
        throw new Error("rollback");
      }),
    ).rejects.toThrow("rollback");
    expect(
      await db.select().from(schema.messages).where(eq(schema.messages.sourceId, rolled)),
    ).toHaveLength(0);
  });
  it("reviews an owned completed check-in idempotently", async () => {
    const id = newId();
    await db.insert(schema.checkIns).values({
      id,
      clientId,
      dueOn: "2026-11-02",
      closesOn: "2026-11-09",
      status: "completed",
      completedAt: new Date(),
    });
    await db.transaction((tx) => activity(tx, clientId, "check-in", id));
    expect((await coach.post(`${base}/reviews/${id}`, {})).status).toBe(200);
    expect((await coach.post(`${base}/reviews/${id}`, {})).status).toBe(200);
    expect((await stranger.post(`${base}/reviews/${id}`, {})).status).toBe(403);
    const result = (await coach.get(`${base}/messages`)).body.messages as {
      sourceId: string;
      detail: { review: unknown };
    }[];
    expect(result.find((m) => m.sourceId === id)?.detail.review).toBeTruthy();
  });
  it("exposes client unread counts and updates the sender's read receipt", async () => {
    const id = newId();
    expect((await coach.post(`${base}/messages`, { id, body: "Receipt test" })).status).toBe(201);
    const unread = await client.get(`${cbase}/unread`);
    expect(unread.status).toBe(200);
    expect(unread.body.unread).toBeGreaterThan(0);
    const before = (await coach.get(`${base}/messages`)).body.messages as {
      id: string;
      read: boolean;
    }[];
    expect(before.find((m) => m.id === id)?.read).toBe(false);
    expect((await client.post(`${cbase}/read`, { messageId: id, channel: "chat" })).status).toBe(
      200,
    );
    expect((await client.get(`${cbase}/unread`)).body.unread).toBe(0);
    const after = (await coach.get(`${base}/messages`)).body.messages as {
      id: string;
      read: boolean;
    }[];
    expect(after.find((m) => m.id === id)?.read).toBe(true);
    expect((await stranger.get(`${cbase}/unread`)).status).toBe(403);
  });
  it("allows paused clients to read but not send", async () => {
    await db
      .update(schema.clients)
      .set({ status: "paused" })
      .where(eq(schema.clients.id, clientId));
    expect((await client.get(`${cbase}/messages`)).status).toBe(200);
    expect((await client.post(`${cbase}/messages`, { id: newId(), body: "No write" })).status).toBe(
      403,
    );
  });
});
