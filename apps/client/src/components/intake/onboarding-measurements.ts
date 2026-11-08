"use client";

import { useQuery } from "@tanstack/react-query";
import { localDay } from "@traiv/ui/lib/steps";
import type { Metric } from "@/lib/api";
import { http } from "@/lib/api/client";

/**
 * Circumference and progress photos ride the same `client_measurement` system the
 * coach's "Add measurement" sheet already writes to (`profile-actions.tsx`) — not a
 * second copy inside the intake row. A studio toggles which metrics it shares with
 * clients, so the catalog is read live rather than assumed; a studio that hasn't
 * enabled a given measurement simply never shows that field here.
 */
export function useOnboardingMetrics(studioId: string) {
  return useQuery({
    queryKey: ["onboarding-metrics", studioId],
    queryFn: async () => (await http.get<Metric[]>(`/c/${studioId}/measurements`)).data,
    enabled: Boolean(studioId),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

const timeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/** Same write path and the same "today" convention as `MeasurementEditor`. */
export async function saveOnboardingMeasurement(
  studioId: string,
  metricId: string,
  value: number | string,
) {
  await http.post(`/c/${studioId}/measurements`, {
    id: crypto.randomUUID(),
    metricId,
    date: localDay(),
    timeZone: timeZone(),
    value,
  });
}
