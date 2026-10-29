import { http } from "./client";
import type { StudioUploadKind, UploadTicket } from "./types";

/**
 * Signed, browser-direct uploads to Cloudinary — recipe/ingredient images and video,
 * meal-plan cover images. Mirrors the client app's `uploadApi` exactly; see
 * `apps/api/src/features/studio/uploads.ts`.
 */
export const uploadApi = {
  /** Asked before a panel offers an upload button, so it never shows one that cannot work. */
  configured: async (studioId: string) =>
    (await http.get<{ uploads: boolean }>(`/studios/${studioId}/uploads/config`)).data.uploads,

  sign: async (studioId: string, kind: StudioUploadKind) =>
    (await http.post<UploadTicket>(`/studios/${studioId}/uploads/sign`, { kind })).data,

  /**
   * Straight to Cloudinary, bypassing our API entirely.
   *
   * Deliberately `fetch` and not the configured axios instance: that one sends our
   * session cookie on every request, and this request goes to a third party.
   */
  put: async (ticket: UploadTicket, file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    for (const [k, v] of Object.entries(ticket.fields)) form.append(k, v);

    const res = await fetch(ticket.url, { method: "POST", body: form });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);

    const body = (await res.json()) as { secure_url?: string };
    if (!body.secure_url) throw new Error("Upload returned no URL");
    return body.secure_url;
  },
};
