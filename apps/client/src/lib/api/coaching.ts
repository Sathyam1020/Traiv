import { http } from "./client";
import type {
  AnswerInput,
  CheckInDetail,
  CheckInList,
  CheckInSummary,
  Today,
  UploadTicket,
} from "./types";

/**
 * Everything a client does with their coach.
 *
 * Every path carries the studio id, because the API takes the tenant from the URL and
 * never from the session — ADR 0014. A user who is staff in one studio and a client in
 * another carries the wrong one in their session, so the id is the first argument of
 * every function here and the type system is what notices when it is missing.
 */
export const todayApi = {
  get: async (studioId: string) =>
    (await http.get<{ today: Today }>(`/c/${studioId}/today`)).data.today,

  /**
   * Weight is the only metric with a home outside a check-in — `body_metric` is keyed on
   * the user and append-only. Everything else a check-in asks for needs a check-in to
   * belong to.
   */
  logWeight: async (studioId: string, kg: number) =>
    (await http.post<{ weightKg: number }>(`/c/${studioId}/weight`, { kg })).data.weightKg,
};

export const checkInApi = {
  list: async (studioId: string) => (await http.get<CheckInList>(`/c/${studioId}/check-ins`)).data,

  get: async (studioId: string, checkInId: string) =>
    (await http.get<CheckInDetail>(`/c/${studioId}/check-ins/${checkInId}`)).data,

  /**
   * `submissionId` is minted once per draft and resent on retry.
   *
   * Submission is already idempotent — answers are replaced rather than appended and the
   * row is set to completed either way — so a retry after a dropped response converges
   * instead of creating a second check-in. Sending the id is what makes that a contract
   * rather than an accident of the implementation.
   */
  submit: async (
    studioId: string,
    checkInId: string,
    submissionId: string,
    answers: AnswerInput[],
  ) =>
    (
      await http.post<{ checkIn: CheckInSummary }>(`/c/${studioId}/check-ins/${checkInId}`, {
        submissionId,
        answers,
      })
    ).data.checkIn,
};

export const uploadApi = {
  /** Asked before the form offers a camera, so it never shows a button that cannot work. */
  configured: async (studioId: string) =>
    (await http.get<{ uploads: boolean }>(`/c/${studioId}/uploads/config`)).data.uploads,

  sign: async (studioId: string, kind: "check-in" | "avatar" = "check-in") =>
    (await http.post<UploadTicket>(`/c/${studioId}/uploads/sign`, { kind })).data,

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
