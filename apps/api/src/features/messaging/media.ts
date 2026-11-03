import { newId, schema } from "@traiv/db";
import { and, eq } from "drizzle-orm";
import { db } from "../../db.js";
import { badRequest, notFound } from "../../errors.js";
import { mediaStorage, type ResourceType } from "../../integrations/media-storage.js";
import type { Actor } from "./service.js";
export async function ticket(actor: Actor, name: string, type: ResourceType) {
  const id = newId(),
    key = `traiv/private/${actor.studioId}/${actor.clientId}/${id}${type === "raw" ? ".pdf" : ""}`;
  const signed = mediaStorage.upload(key, type, "private");
  await db
    .insert(schema.mediaAssets)
    .values({
      id,
      studioId: actor.studioId,
      clientId: actor.clientId,
      ownerId: actor.userId,
      provider: mediaStorage.provider,
      key,
      resourceType: type,
      name,
    });
  return { id, ...signed };
}
export async function finalize(actor: Actor, id: string) {
  const [asset] = await db
    .select()
    .from(schema.mediaAssets)
    .where(
      and(
        eq(schema.mediaAssets.id, id),
        eq(schema.mediaAssets.clientId, actor.clientId),
        eq(schema.mediaAssets.ownerId, actor.userId),
      ),
    );
  if (!asset) throw notFound();
  if (asset.verifiedAt) return asset;
  const data = await mediaStorage.inspect(asset.key, asset.resourceType as ResourceType);
  const allowed =
    asset.resourceType === "image"
      ? ["jpg", "jpeg", "png", "webp", "gif", "heic", "avif"]
      : asset.resourceType === "video"
        ? ["mp4", "mov", "webm", "m4a", "mp3", "ogg", "wav"]
        : ["pdf"];
  if (
    data.key !== asset.key ||
    !Number.isFinite(data.bytes) ||
    data.bytes > 100 * 1024 * 1024 ||
    !allowed.includes(data.format)
  )
    throw badRequest("invalid_media", "Use an image, video, audio file or PDF up to 100 MB.");
  const [saved] = await db
    .update(schema.mediaAssets)
    .set({
      bytes: data.bytes,
      format: data.format,
      metadata: {
        width: data.width,
        height: data.height,
        duration: data.duration,
        version: data.version,
      },
      verifiedAt: new Date(),
    })
    .where(eq(schema.mediaAssets.id, id))
    .returning();
  return saved;
}
export async function delivery(actor: Actor, id: string) {
  const [asset] = await db
    .select()
    .from(schema.mediaAssets)
    .where(
      and(
        eq(schema.mediaAssets.id, id),
        eq(schema.mediaAssets.clientId, actor.clientId),
        eq(schema.mediaAssets.studioId, actor.studioId),
      ),
    );
  if (!asset?.verifiedAt) throw notFound();
  if (asset.ownerId !== actor.userId) {
    const [linked] = await db
      .select()
      .from(schema.messageAttachments)
      .where(eq(schema.messageAttachments.assetId, id))
      .limit(1);
    if (!linked) throw notFound();
  }
  return mediaStorage.delivery(
    { key: asset.key, format: asset.format ?? "pdf", bytes: asset.bytes ?? 0 },
    asset.resourceType as ResourceType,
  );
}
