import { randomUUID } from "node:crypto";
import { env } from "../../env.js";
import { mediaStorage } from "../../integrations/media-storage.js";

/**
 * Signed, browser-direct uploads to Cloudinary.
 *
 * The image never passes through this API. The browser POSTs the file straight to
 * Cloudinary with a signature we produced, which means no multipart body parser, no
 * temp files, no streaming a 4MB photo through a Neon-bound Node process on a
 * basement-gym connection. The secret stays here; the bytes never arrive.
 *
 * Signing rather than an unsigned preset is what makes the folder non-negotiable: an
 * unsigned preset lets the browser choose where the file lands, and "where" is the only
 * thing separating one client's photos from another's.
 */

export type UploadTicket = {
  url: string;
  publicId: string;
  fields: Record<string, string>;
};

/**
 * A single-use ticket for one photo.
 *
 * `folder` is derived from the client id and is part of the signed payload, so it cannot
 * be swapped by whoever holds the ticket. `public_id` is random rather than a name the
 * caller picked: a predictable id is an invitation to overwrite somebody else's photo,
 * and Cloudinary's upload is an upsert.
 */
export function signUpload(
  clientId: string,
  kind: "check-in" | "avatar" | "food" | "food-label" | "photo-log",
): UploadTicket {
  const publicId = randomUUID();
  const signed = mediaStorage.upload(`traiv/${kind}/${clientId}/${publicId}`, "image", "public");
  return { publicId, ...signed };
}

/** True when the route should exist at all. The client app asks before offering a camera. */
export const uploadsConfigured = (): boolean =>
  Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
