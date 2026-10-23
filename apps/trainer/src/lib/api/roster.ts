import { http } from "./client";
import type { ClientProfile, Roster, RosterClient, RosterParams, RosterStatus, Tag } from "./types";

/**
 * Everything the clients screen reads and writes.
 *
 * Every path carries the studio id, because the API takes the tenant from the URL and
 * never from the session — ADR 0014. A call without one is a bug the type system can
 * catch, so the id is the first argument of every function here.
 */
export const rosterApi = {
  list: async (studioId: string, params: RosterParams) =>
    (await http.get<Roster>(`/studios/${studioId}/clients`, { params })).data,

  get: async (studioId: string, clientId: string) =>
    (await http.get<{ client: ClientProfile }>(`/studios/${studioId}/clients/${clientId}`)).data
      .client,

  update: async (
    studioId: string,
    clientId: string,
    patch: { status?: RosterStatus; endsAt?: string | null },
  ) =>
    (
      await http.patch<{ client: Pick<RosterClient, "id" | "status" | "endsAt"> }>(
        `/studios/${studioId}/clients/${clientId}`,
        patch,
      )
    ).data.client,

  setTags: async (studioId: string, clientId: string, tagIds: string[]) =>
    (await http.put<{ tags: Tag[] }>(`/studios/${studioId}/clients/${clientId}/tags`, { tagIds }))
      .data.tags,

  tags: async (studioId: string) =>
    (await http.get<{ tags: Tag[] }>(`/studios/${studioId}/tags`)).data.tags,

  createTag: async (
    studioId: string,
    input: { name: string; description?: string | null; color: string },
  ) => (await http.post<{ tag: Tag }>(`/studios/${studioId}/tags`, input)).data.tag,

  deleteTag: async (studioId: string, tagId: string) => {
    await http.delete(`/studios/${studioId}/tags/${tagId}`);
  },
};
