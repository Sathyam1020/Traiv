import { notifyClient } from "../notifications/service.js";
import { newId, schema } from "@traiv/db";
import { and, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db.js";
import { badRequest, notFound } from "../../errors.js";
import { mediaStorage, type ResourceType } from "../../integrations/media-storage.js";
import { getClient } from "../studio/roster.js";

const r = schema.vaultResources;
export const resourceInput = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().max(5000).default(""),
  type: z.enum(["Image", "Video", "Audio", "Document", "Link", "File"]),
  allClients: z.boolean().default(false),
  tagIds: z.array(z.string().uuid()).max(100).default([]),
  gender: z.enum(["male", "female", "undisclosed"]).nullable().default(null),
});
export const safeLink = z
  .string()
  .url()
  .max(2000)
  .refine((v) => ["https:", "http:"].includes(new URL(v).protocol), "Use an http or https link.");
export type ResourceInput = z.infer<typeof resourceInput>;
export async function resource(studioId: string, id: string) {
  const [row] = await db
    .select()
    .from(r)
    .where(and(eq(r.studioId, studioId), eq(r.id, id), isNotNull(r.verifiedAt)));
  if (!row) throw notFound("Resource not found.");
  return row;
}
async function validateTags(studioId: string, ids: string[]) {
  if (!ids.length) return;
  const rows = await db
    .select({ id: schema.tags.id })
    .from(schema.tags)
    .where(and(eq(schema.tags.studioId, studioId), inArray(schema.tags.id, ids)));
  if (rows.length !== new Set(ids).size)
    throw badRequest("invalid_tags", "Choose tags from this studio.");
}
export async function list(studioId: string) {
  return db
    .select()
    .from(r)
    .where(and(eq(r.studioId, studioId), isNotNull(r.verifiedAt)))
    .orderBy(desc(r.createdAt));
}
export async function uploadTicket(studioId: string, name: string, mime: string) {
  const id = newId();
  // Raw files retain their extension; images/videos use the provider's detected format.
  const storageType: ResourceType = mime.startsWith("image/")
    ? "image"
    : mime.startsWith("video/") || mime.startsWith("audio/")
      ? "video"
      : "raw";
  const extension = name.match(/\.[a-zA-Z0-9]{1,10}$/)?.[0]?.toLowerCase() ?? "";
  const storageKey = `traiv/vault/${studioId}/${id}${storageType === "raw" ? extension : ""}`;
  const ticket = mediaStorage.upload(storageKey, storageType, "private");
  await db.insert(r).values({ id, studioId, name, storageKey, storageType });
  return { id, ...ticket };
}
export async function save(
  studioId: string,
  data: ResourceInput,
  uploadId?: string,
  link?: string,
) {
  await validateTags(studioId, data.tagIds);
  if (uploadId) {
    const [pending] = await db
      .select()
      .from(r)
      .where(and(eq(r.id, uploadId), eq(r.studioId, studioId)));
    if (!pending?.storageKey || pending.verifiedAt)
      throw badRequest("invalid_upload", "Choose a new file.");
    const asset = await mediaStorage.inspect(
      pending.storageKey,
      pending.storageType as ResourceType,
    );
    if (asset.key !== pending.storageKey || !asset.bytes || asset.bytes > 512 * 1024 * 1024)
      throw badRequest("invalid_file", "Files must be between 1 byte and 512 MB.");
    const [saved] = await db
      .update(r)
      .set({ ...data, bytes: asset.bytes, format: asset.format, verifiedAt: new Date() })
      .where(and(eq(r.id, uploadId), eq(r.studioId, studioId)))
      .returning();
    return saved!;
  }
  if (!link) throw badRequest("missing_content", "Choose a file or add a link.");
  const [saved] = await db
    .insert(r)
    .values({ id: newId(), studioId, ...data, link: safeLink.parse(link), verifiedAt: new Date() })
    .returning();
  return saved!;
}
export async function update(studioId: string, id: string, data: ResourceInput) {
  await resource(studioId, id);
  await validateTags(studioId, data.tagIds);
  const [saved] = await db
    .update(r)
    .set(data)
    .where(and(eq(r.id, id), eq(r.studioId, studioId)))
    .returning();
  return saved;
}
export async function assign(studioId: string, clientId: string, id: string) {
  await getClient(studioId, clientId);
  await resource(studioId, id);
  await db
    .insert(schema.vaultAssignments)
    .values({ clientId, resourceId: id })
    .onConflictDoNothing();
  void notifyClient(clientId, "content", `vault:${id}`, "/vault?from=profile").catch(() => console.warn("Vault push delivery failed"));
}
export async function clientResources(studioId: string, clientId: string) {
  const client = await getClient(studioId, clientId);
  const [resources, assignments, tags, reads] = await Promise.all([
    list(studioId),
    db.select().from(schema.vaultAssignments).where(eq(schema.vaultAssignments.clientId, clientId)),
    db.select().from(schema.clientTags).where(eq(schema.clientTags.clientId, clientId)),
    db.select().from(schema.vaultReads).where(eq(schema.vaultReads.clientId, clientId)),
  ]);
  const tagIds = new Set(tags.map((t) => t.tagId));
  return resources.flatMap((row) => {
    const assignment = assignments.find((a) => a.resourceId === row.id);
    const matches =
      (row.tagIds.length > 0 || row.gender !== null) &&
      (!row.tagIds.length || row.tagIds.some((t) => tagIds.has(t))) &&
      (!row.gender || row.gender === client.intake?.sex);
    return assignment || row.allClients || matches
      ? [
          {
            ...row,
            assignedAt: assignment?.assignedAt ?? row.createdAt,
            openedAt: assignment?.openedAt ?? null,
            seenAt:
              reads.find((r) => r.resourceId === row.id)?.seenAt ?? assignment?.openedAt ?? null,
            direct: Boolean(assignment),
          },
        ]
      : [];
  });
}
export async function delivery(studioId: string, id: string) {
  const row = await resource(studioId, id);
  return (
    row.link ??
    mediaStorage.delivery(
      { key: row.storageKey!, bytes: row.bytes!, format: row.format ?? "" },
      row.storageType as ResourceType,
    )
  );
}
