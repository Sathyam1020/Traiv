import { http } from "./client";
import type { AuthConfig, TransportName, User } from "./types";

export const authApi = {
  config: async () => (await http.get<AuthConfig>("/auth/config")).data,

  /** A client has no studio, so /auth/me is read for the user alone. */
  me: async () => (await http.get<{ user: User }>("/auth/me")).data,

  challenge: async (input: { phone: string; name?: string }) =>
    (await http.post<{ sent: true; transport: TransportName }>("/auth/challenge", input)).data,

  verify: async (input: { phone: string; code: string }) =>
    (await http.post<{ user: User; isNew: boolean }>("/auth/verify", input)).data,

  logout: async () => (await http.post<{ ok: true }>("/auth/logout")).data,
};
