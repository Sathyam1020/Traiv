"use client";
import { useQuery } from "@tanstack/react-query";
import { localDay } from "@traiv/ui/lib/steps";
import type { Metric } from "@/lib/api";
import { http } from "@/lib/api/client";
export type MeasurementEntry = {
  id: string;
  takenAt: string;
  source: string;
  values: Record<string, number>;
  imageUrls: Record<string, string>;
};
export type MeasurementHistory = { fields: Metric[]; entries: MeasurementEntry[] };
export function useMeasurements(studioId: string | null) {
  const end = new Date(),
    start = new Date();
  start.setDate(start.getDate() - 365);
  const from = localDay(start),
    to = localDay(end);
  return useQuery({
    queryKey: ["measurement-history", studioId, from, to],
    queryFn: async () =>
      (
        await http.get<MeasurementHistory>(`/c/${studioId}/measurements/history`, {
          params: { from, to },
        })
      ).data,
    enabled: Boolean(studioId),
    refetchInterval: 15000,
  });
}
