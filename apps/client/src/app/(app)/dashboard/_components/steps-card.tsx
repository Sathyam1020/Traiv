"use client";
import type { StepsData } from "@traiv/ui/components/steps-progress";
import { StepsProgress } from "@traiv/ui/components/steps-progress";
import { useCallback } from "react";
import { http } from "@/lib/api/client";
export function StepsCard({ studioId, weightKg }: { studioId: string; weightKg?: number }) {
  const path = `/c/${studioId}/steps`;
  const load = useCallback(
    async (start: string, end: string) =>
      (await http.get<StepsData>(path, { params: { start, end } })).data,
    [path],
  );
  const save = useCallback(
    async (date: string, count: number) => {
      await http.put(path, {
        date,
        count,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    },
    [path],
  );
  return <StepsProgress scope={studioId} load={load} save={save} weightKg={weightKg} />;
}
