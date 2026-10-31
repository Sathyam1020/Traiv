import { createHash, randomUUID } from "node:crypto";
import { env } from "../../env.js";
import { AppError } from "../../errors.js";

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

/** Cloudinary's own rule: sha1 over the sorted params, then the secret appended raw. */
function sign(params: Record<string, string>, secret: string): string {
  const canonical = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1")
    .update(canonical + secret)
    .digest("hex");
}

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
  const {
    CLOUDINARY_CLOUD_NAME: cloud,
    CLOUDINARY_API_KEY: key,
    CLOUDINARY_API_SECRET: secret,
  } = env;

  if (!cloud || !key || !secret) {
    throw new AppError(
      503,
      "uploads_unconfigured",
      "Photo upload isn't set up yet. Everything else in this check-in still works.",
    );
  }

  const publicId = randomUUID();
  const signed = {
    folder: `traiv/${kind}/${clientId}`,
    public_id: publicId,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };

  return {
    url: `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
    publicId,
    // api_key is sent but never signed — Cloudinary's scheme signs only the parameters
    // that affect where and what the upload becomes.
    fields: { ...signed, api_key: key, signature: sign(signed, secret) },
  };
}

/** True when the route should exist at all. The client app asks before offering a camera. */
export const uploadsConfigured = (): boolean =>
  Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
