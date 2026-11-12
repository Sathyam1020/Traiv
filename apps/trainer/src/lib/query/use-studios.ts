"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studiosApi } from "@/lib/api";
import { queryKeys } from "./keys";

export function useStudios() {
  return useQuery({ queryKey: queryKeys.studios.list, queryFn: studiosApi.list });
}

export function useRenameStudio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => studiosApi.rename(id, name),
    // The session's own `studios` array (not just the settings list) carries
    // `nameConfirmed` — `AuthGuard` reads it from there, so a rename has to invalidate
    // both or it keeps redirecting to the business-name step after the name is saved.
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.studios.list });
      void qc.invalidateQueries({ queryKey: queryKeys.auth.session });
    },
  });
}

export function useSwitchStudio() {
  return useMutation({
    // `studio-switcher.tsx` sets the local studio id optimistically before this call
    // lands, with nothing else on screen watching it — a failure here has to say so, or
    // the tab is left showing a studio the server never actually switched to.
    meta: { feedback: { error: "Couldn't switch studios. Try again." } },
    mutationFn: studiosApi.activate,
    // Every query on the page is studio-scoped, so a reload is both correct and simpler
    // than invalidating each one and hoping nothing was missed.
    onSuccess: () => window.location.reload(),
  });
}
