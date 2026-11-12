import { newId, schema } from "@traiv/db";
import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { db } from "../../db.js";
import { mediaStorage } from "../../integrations/media-storage.js";
import { type Agent, signUpOverHttp, startApi, type TestServer } from "../../test-support/http.js";
import { resetEmails } from "../../test-support/reset.js";

const emails = [
  "vault-coach@example.com",
  "vault-client@example.com",
  "vault-outsider@example.com",
];
let api: TestServer, coach: Agent, client: Agent, stranger: Agent;
let studioId: string, clientId: string, base: string, cbase: string;
beforeAll(async () => {
  api = await startApi();
  await resetEmails(emails);
  const a = await signUpOverHttp(api.url, emails[0]!, "Vault Coach");
  const b = await signUpOverHttp(api.url, emails[1]!, "Vault Client");
  const c = await signUpOverHttp(api.url, emails[2]!, "Vault Outsider");
  coach = a.agent;
  client = b.agent;
  stranger = c.agent;
  studioId = ((await coach.get("/studios")).body.studios as { id: string }[])[0]!.id;
  const [membership] = await db
    .select()
    .from(schema.memberships)
    .where(and(eq(schema.memberships.studioId, studioId), eq(schema.memberships.userId, a.userId)));
  clientId = newId();
  await db.insert(schema.clients).values({
    id: clientId,
    studioId,
    coachId: membership!.id,
    userId: b.userId,
    name: "Vault Client",
  });
  base = `/studios/${studioId}/vault`;
  cbase = `/c/${studioId}/vault`;
});
afterAll(async () => {
  vi.restoreAllMocks();
  await resetEmails(emails);
  await api?.close();
});
const input = {
  name: "Guide",
  type: "Document",
  description: "Getting started",
  link: "https://example.com/guide.pdf",
};
async function create(extra = {}) {
  const reply = await coach.post(base, { ...input, ...extra });
  expect(reply.status).toBe(201);
  return reply.body.id as string;
}

describe("Vault through authenticated HTTP", () => {
  it("isolates tenants and keeps private files invisible until assigned", async () => {
    const id = await create();
    expect((await stranger.get(base)).status).toBe(403);
    expect((await client.get(base)).status).toBe(403);
    expect((await stranger.get(cbase)).status).toBe(403);
    expect((await client.get(`${cbase}/${id}/open`)).status).toBe(404);
    expect((await stranger.patch(`${base}/${id}`, input)).status).toBe(403);
    expect((await coach.post(`${base}/clients/${clientId}/${id}`, {})).status).toBe(200);
    expect((await coach.post(`${base}/clients/${clientId}/${id}`, {})).status).toBe(200);
    const rows = (await client.get(cbase)).body as unknown as {
      id: string;
      openedAt: string | null;
    }[];
    expect(rows.filter((r) => r.id === id)).toHaveLength(1);
    expect(rows.find((r) => r.id === id)?.openedAt).toBeNull();
    expect((await client.get(`${cbase}/${id}/open`)).body.url).toBe(input.link);
    const opened = (await client.get(cbase)).body as unknown as {
      id: string;
      openedAt: string | null;
    }[];
    expect(opened.find((r) => r.id === id)?.openedAt).toBeTruthy();
    expect((await coach.delete(`${base}/clients/${clientId}/${id}`)).status).toBe(200);
    expect((await client.get(`${cbase}/${id}/open`)).status).toBe(404);
  });
  it("applies all-client and tag sharing and revokes access when rules change", async () => {
    const tagId = newId();
    await db.insert(schema.tags).values({ id: tagId, studioId, name: "Vault group" });
    const id = await create({ tagIds: [tagId] });
    expect((await client.get(`${cbase}/${id}/open`)).status).toBe(404);
    await db.insert(schema.clientTags).values({ clientId, tagId });
    expect((await client.get(`${cbase}/${id}/open`)).status).toBe(200);
    expect((await coach.patch(`${base}/${id}`, { ...input, tagIds: [] })).status).toBe(200);
    expect((await client.get(`${cbase}/${id}/open`)).status).toBe(404);
    expect((await coach.patch(`${base}/${id}`, { ...input, allClients: true })).status).toBe(200);
    expect((await client.get(`${cbase}/${id}/open`)).status).toBe(200);
    expect((await coach.delete(`${base}/${id}`)).status).toBe(200);
    expect((await client.get(`${cbase}/${id}/open`)).status).toBe(404);
  });
  it("rejects unsafe links, foreign tags, nonexistent clients and missing content", async () => {
    expect((await coach.post(base, { ...input, link: "javascript:alert(1)" })).status).toBe(400);
    expect((await coach.post(base, { ...input, tagIds: [newId()] })).status).toBe(400);
    expect((await coach.post(base, { ...input, clientId: newId() })).status).toBe(404);
    expect((await coach.post(base, { name: "Missing", type: "Document" })).status).toBe(400);
  });
  it("verifies private uploads, hides pending files and prevents cross-tenant finalization", async () => {
    const upload = vi
      .spyOn(mediaStorage, "upload")
      .mockReturnValue({ url: "https://example.com/upload", fields: {} });
    const inspect = vi.spyOn(mediaStorage, "inspect");
    const ticket = await coach.post(`${base}/uploads`, {
      name: "guide.pdf",
      mime: "application/pdf",
    });
    expect(ticket.status).toBe(201);
    const id = ticket.body.id as string;
    const key = upload.mock.calls.at(-1)![0];
    expect(upload.mock.calls.at(-1)?.slice(1)).toEqual(["raw", "private"]);
    expect((await coach.get(`${base}/${id}/open`)).status).toBe(404);
    expect(
      (await stranger.post(base, { name: "Stolen", type: "Document", uploadId: id })).status,
    ).toBe(403);
    inspect.mockResolvedValue({ key: "wrong-key", bytes: 100, format: "pdf" });
    expect((await coach.post(base, { name: "Guide", type: "Document", uploadId: id })).status).toBe(
      400,
    );
    inspect.mockResolvedValue({ key, bytes: 1200, format: "pdf" });
    expect(
      (await coach.post(base, { name: "Guide", type: "Document", uploadId: id, clientId })).status,
    ).toBe(201);
    const deliver = vi
      .spyOn(mediaStorage, "delivery")
      .mockReturnValue("https://example.com/signed");
    expect((await client.get(`${cbase}/${id}/open`)).body.url).toBe("https://example.com/signed");
    expect(deliver).toHaveBeenCalledWith({ key, bytes: 1200, format: "pdf" }, "raw");
    vi.restoreAllMocks();
  });
});
