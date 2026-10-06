"use client";

import { useEffect } from "react";
import { useStudios } from "@/lib/query/use-studios";
import { useUiStore } from "@/lib/stores";

/**
 * Which studio *this tab* is showing.
 *
 * The session has an `activeStudioId`, but one session is shared by every tab: a coach
 * with studio A open in one tab and B in another would have the first tab's writes land
 * in B, and the membership check would pass because they belong to both. So the session
 * value is only a starting point — it seeds this once, and from then on the studio lives
 * in per-tab state and travels with each request.
 */
export function useActiveStudioId(): string | null {
  const studioId = useUiStore((s) => s.studioId);
  const setStudioId = useUiStore((s) => s.setStudioId);
  const { data } = useStudios();

  const seed = data?.activeStudioId ?? null;
  const known = data?.studios.some((s) => s.id === studioId) ?? false;

  useEffect(() => {
    // Seed on first load, and recover if this tab is holding a studio the coach has
    // since been removed from.
    if (!studioId || (data && !known)) setStudioId(seed);
  }, [studioId, known, data, seed, setStudioId]);

  return known ? studioId : seed;
}
