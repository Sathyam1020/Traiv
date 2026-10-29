import { createHash, randomUUID } from "node:crypto";
import { env } from "../../env.js";
import { AppError } from "../../errors.js";

/**
 * Signed, browser-direct uploads to Cloudinary — the studio-scoped twin of
 * `../client/uploads.ts`.
 *
 * That one only ever needed images (check-in photos, avatars). Recipe media needs both:
 * an uploaded video, or an uploaded image, or a YouTube/Vimeo link typed directly (no
 * upload at all — the New Recipe panel offers "Upload Video" and "YouTube / Vimeo" as
 * alternatives). `resourceType` is what Cloudinary's upload endpoint is keyed on
 * (`/image/upload` vs `/video/upload`), so it has to be part of the ticket rather than
 * assumed the way the client-scoped signer could.
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

export type StudioUploadKind =
  | "recipe-image"
  | "recipe-video"
  | "ingredient-image"
  | "mealplan-cover";

const RESOURCE_TYPE: Record<StudioUploadKind, "image" | "video"> = {
  "recipe-image": "image",
  "recipe-video": "video",
  "ingredient-image": "image",
  "mealplan-cover": "image",
};

/**
 * A single-use ticket for one upload.
 *
 * `folder` is derived from the studio id and is part of the signed payload, so it cannot
 * be swapped by whoever holds the ticket. `public_id` is random rather than a name the
 * caller picked — a predictable id is an invitation to overwrite somebody else's asset,
 * and Cloudinary's upload is an upsert.
 */
export function signStudioUpload(studioId: string, kind: StudioUploadKind): UploadTicket {
  const {
    CLOUDINARY_CLOUD_NAME: cloud,
    CLOUDINARY_API_KEY: key,
    CLOUDINARY_API_SECRET: secret,
  } = env;

  if (!cloud || !key || !secret) {
    throw new AppError(
      503,
      "uploads_unconfigured",
      "Media upload isn't set up yet. Everything else here still works — add the image or video link later.",
    );
  }

  const publicId = randomUUID();
  const signed = {
    folder: `traiv/${kind}/${studioId}`,
    public_id: publicId,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };

  return {
    url: `https://api.cloudinary.com/v1_1/${cloud}/${RESOURCE_TYPE[kind]}/upload`,
    publicId,
    // api_key is sent but never signed — Cloudinary's scheme signs only the parameters
    // that affect where and what the upload becomes.
    fields: { ...signed, api_key: key, signature: sign(signed, secret) },
  };
}

/** True when the route should exist at all — the New Recipe panel asks before offering
 *  an upload button, same as the client app does for check-in photos. */
export const studioUploadsConfigured = (): boolean =>
  Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
