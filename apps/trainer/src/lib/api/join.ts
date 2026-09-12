import { http } from "./client";

export type JoinCode = { joinCode: string; joinEnabled: boolean; name: string };

export const joinApi = {
  get: async () => (await http.get<JoinCode>("/studio/join-code")).data,

  rotate: async () => (await http.post<{ joinCode: string }>("/studio/join-code/rotate")).data,

  setEnabled: async (enabled: boolean) =>
    (await http.patch<{ joinEnabled: boolean }>("/studio/join-code", { enabled })).data,
};
