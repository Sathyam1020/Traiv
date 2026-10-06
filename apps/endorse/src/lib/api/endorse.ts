import { http } from "./client";

export type Endorser = { id: string; code: string; createdAt: string; referrals: number };
export type Referral = { studioName: string; joinedAt: string; tier: string };

export const endorseApi = {
  /** Null when you have not joined. A state, not an error. */
  me: async () => (await http.get<{ endorser: Endorser | null }>("/e/me")).data.endorser,

  join: async () => (await http.post<Endorser>("/e/join")).data,

  referrals: async () => (await http.get<{ referrals: Referral[] }>("/e/referrals")).data.referrals,
};
