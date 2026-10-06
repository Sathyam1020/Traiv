import { http } from "./client";
import type { AuthConfig, DevUser, TransportName, User } from "./types";

export const authApi = {
  config: async () => (await http.get<AuthConfig>("/auth/config")).data,

  me: async () => (await http.get<{ user: User }>("/auth/me")).data,

  challenge: async (input: { phone: string; name?: string }) =>
    (await http.post<{ sent: true; transport: TransportName }>("/auth/challenge", input)).data,

  verify: async (input: { phone: string; code: string }) =>
    (await http.post<{ user: User; isNew: boolean }>("/auth/verify", input)).data,

  /** Only answers when the API reports `otpRequired: false`. */
  direct: async (input: { phone: string; name?: string }) =>
    (await http.post<{ user: User; isNew: boolean }>("/auth/direct", input)).data,

  logout: async () => (await http.post<{ ok: true }>("/auth/logout")).data,

  /** Unfiltered: anyone can hold these roles, so there is no subset to offer. */
  devUsers: async () => (await http.get<{ users: DevUser[] }>("/auth/dev/users")).data,

  devLogin: async (userId: string) =>
    (await http.post<{ user: User }>("/auth/dev/login", { userId })).data,
};
