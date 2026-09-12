import { http } from "./client";
import type { Studio } from "./types";

export const studiosApi = {
  list: async () =>
    (await http.get<{ studios: Studio[]; activeStudioId: string }>("/studios")).data,

  activate: async (id: string) =>
    (await http.post<{ studio: Studio }>(`/studios/${id}/activate`)).data,
};
