import { http } from "./client";

export type JoinCode = { joinCode: string; joinEnabled: boolean; name: string };

/**
 * Every call names its studio. The session's active studio is shared by every tab, so
 * resolving the tenant from it meant two tabs on different studios wrote to whichever
 * was switched to last.
 */
export const joinApi = {
  get: async (studioId: string) =>
    (await http.get<JoinCode>(`/studios/${studioId}/join-code`)).data,

  rotate: async (studioId: string) =>
    (await http.post<{ joinCode: string }>(`/studios/${studioId}/join-code/rotate`)).data,

  setEnabled: async (studioId: string, enabled: boolean) =>
    (await http.patch<{ joinEnabled: boolean }>(`/studios/${studioId}/join-code`, { enabled }))
      .data,
};
