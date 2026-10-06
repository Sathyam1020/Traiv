import { http } from "./client";

export type Stats = {
  trainers: number;
  clients: number;
  studios: number;
  endorsers: number;
  referrals: number;
};

export const adminApi = {
  stats: async () => (await http.get<Stats>("/admin/stats")).data,
};
