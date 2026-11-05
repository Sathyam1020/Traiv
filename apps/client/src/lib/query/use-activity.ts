"use client";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api/client";
export type Activity = {
  id: string;
  kind: "workout" | "health";
  name: string;
  programName: string | null;
  completedAt: string;
  date: string;
  quality: number | null;
  intensity: number | null;
  totalSeconds: number | null;
  totalWeightLiftedKg: number | null;
  exerciseCount: number;
};
export type ActivitySet = {
  id: string;
  sessionExerciseId: string | null;
  setNumber: number;
  completed: boolean;
  reps: number | null;
  loadKg: number | null;
  seconds: number | null;
  distanceM: number | null;
  calories: number | null;
  restSeconds: number | null;
  name: string | null;
  imageUrl: string | null;
  fields: string[] | null;
  repsMin: number | null;
  repsMax: number | null;
};
export type ActivityDetail = {
  id: string;
  kind: "workout" | "health";
  name: string;
  programName: string;
  completedAt: string;
  totalSeconds: number | null;
  quality: number | null;
  intensity: number | null;
  note: string | null;
  sets: ActivitySet[];
  version: string | null;
  editable: boolean;
};
export function useActivityList(studioId: string | null, page = 1, limit = 25) {
  return useQuery({
    queryKey: ["activity", studioId, "list", page, limit],
    queryFn: async () =>
      (
        await http.get<{ activities: Activity[]; hasMore: boolean }>(`/c/${studioId}/activity`, {
          params: { page, limit },
        })
      ).data,
    enabled: Boolean(studioId),
    refetchInterval: 15000,
  });
}
export function useActivity(studioId: string | null, id: string) {
  return useQuery({
    queryKey: ["activity", studioId, "detail", id],
    queryFn: async () =>
      (await http.get<ActivityDetail>(`/c/${studioId}/activity/${encodeURIComponent(id)}`)).data,
    enabled: Boolean(studioId && id),
  });
}
