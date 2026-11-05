"use client";
import { useQuery } from "@tanstack/react-query";
import type { CheckInAnswer, CheckInSummary } from "@/lib/api";
import { http } from "@/lib/api/client";
export type ProfileCheckIn = CheckInSummary & { answers: CheckInAnswer[] };
export function useProfileHistory(studioId: string | null) {
  return useQuery({
    queryKey: ["profile-history", studioId],
    queryFn: async () =>
      (
        await http.get<{ checkIns: ProfileCheckIn[]; workouts: number }>(
          `/c/${studioId}/profile-history`,
        )
      ).data,
    enabled: Boolean(studioId),
  });
}
