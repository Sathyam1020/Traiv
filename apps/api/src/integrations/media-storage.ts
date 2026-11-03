import { createHash } from "node:crypto";
import { env } from "../env.js";
import { AppError } from "../errors.js";
export type ResourceType = "image" | "video" | "raw";
export type StoredMedia = {
  key: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
  duration?: number;
  version?: number;
};
/** Browser-direct POST tickets also work with a future S3 presigned POST adapter. */
export interface MediaStorage {
  provider: string;
  upload(
    key: string,
    type: ResourceType,
    access: "public" | "private",
  ): { url: string; fields: Record<string, string> };
  inspect(key: string, type: ResourceType): Promise<StoredMedia>;
  delivery(asset: StoredMedia, type: ResourceType): string;
}
function credentials() {
  const cloud = env.CLOUDINARY_CLOUD_NAME,
    key = env.CLOUDINARY_API_KEY,
    secret = env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret)
    throw new AppError(503, "uploads_unconfigured", "Media uploads aren't configured.");
  return { cloud, key, secret };
}
function sign(params: Record<string, string>, secret: string) {
  return createHash("sha1")
    .update(
      Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join("&") + secret,
    )
    .digest("hex");
}
export const mediaStorage: MediaStorage = {
  provider: "cloudinary",
  upload(publicId, type, access) {
    const { cloud, key, secret } = credentials();
    const params = {
      public_id: publicId,
      type: access === "private" ? "authenticated" : "upload",
      overwrite: "false",
      timestamp: String(Math.floor(Date.now() / 1000)),
    };
    return {
      url: `https://api.cloudinary.com/v1_1/${cloud}/${type}/upload`,
      fields: { ...params, api_key: key, signature: sign(params, secret) },
    };
  },
  async inspect(publicId, type) {
    const { cloud, key, secret } = credentials();
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/resources/${type}/authenticated/${encodeURIComponent(publicId)}`,
      {
        headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` },
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!response.ok)
      throw new AppError(502, "upload_unverified", "Couldn't verify this upload. Try again.");
    const data = (await response.json()) as {
      public_id: string;
      bytes: number;
      format?: string;
      width?: number;
      height?: number;
      duration?: number;
      version: number;
    };
    return {
      key: data.public_id,
      bytes: data.bytes,
      format: data.format ?? (data.public_id.endsWith(".pdf") ? "pdf" : ""),
      width: data.width,
      height: data.height,
      duration: data.duration,
      version: data.version,
    };
  },
  delivery(asset, type) {
    const { cloud, key, secret } = credentials();
    const now = Math.floor(Date.now() / 1000);
    const params = {
      public_id: asset.key,
      format: asset.format,
      type: "authenticated",
      timestamp: String(now),
      expires_at: String(now + 3600),
      attachment: "false",
    };
    return `https://api.cloudinary.com/v1_1/${cloud}/${type}/download?${new URLSearchParams({ ...params, api_key: key, signature: sign(params, secret) })}`;
  },
};
