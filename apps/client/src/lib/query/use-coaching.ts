"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AnswerInput } from "@/lib/api";
import { checkInApi, todayApi, uploadApi } from "@/lib/api";
import { queryKeys } from "./keys";

/**
 * `retry: false` throughout, for the same reason as the rest of this app's queries: a
 * 403 from a paused relationship is an *answer*, not a flake worth asking three more
 * times — and three more times on a basement-gym connection is thirty seconds of
 * spinner before the screen admits what it already knew.
 */

/**
 * The home screen.
 *
 * `staleTime` is short because the check-in card is the thing on it that changes, and a
 * client who just submitted should not come back to a card telling them to submit.
 * Submitting invalidates this explicitly, so the window only covers tab switches.
 */
export function useToday(studioId: string | null) {
  return useQuery({
    queryKey: queryKeys.client.today(studioId ?? ""),
    queryFn: () => todayApi.get(studioId as string),
    enabled: Boolean(studioId),
    retry: false,
    staleTime: 30_000,
  });
}

/**
 * Log a weight.
 *
 * Invalidates Today because the chart on it reads `body_metric` — the new point *is* the
 * feedback, so refetching is the confirmation rather than a toast saying "saved".
 */
export function useLogWeight(studioId: string) {
  const qc = useQueryClient();
  return useMutation({
    meta: { feedback: { error: "Couldn't log your weight. Try again.", success: "Weight logged" } },
    mutationFn: (kg: number) => todayApi.logWeight(studioId, kg),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.client.today(studioId) });
      void qc.invalidateQueries({ queryKey: ["measurement-history", studioId] });
    },
  });
}

export function useCheckIns(studioId: string | null) {
  return useQuery({
    queryKey: queryKeys.client.checkIns(studioId ?? ""),
    queryFn: () => checkInApi.list(studioId as string),
    enabled: Boolean(studioId),
    retry: false,
  });
}

export function useCheckIn(studioId: string | null, checkInId: string | null) {
  return useQuery({
    queryKey: queryKeys.client.checkIn(studioId ?? "", checkInId ?? ""),
    queryFn: () => checkInApi.get(studioId as string, checkInId as string),
    enabled: Boolean(studioId && checkInId),
    retry: false,
  });
}

/**
 * Submit a check-in.
 *
 * Three caches go stale at once and all three are visible within a tap of each other:
 * Today's card, the history list and its tally, and this check-in's own answers. Weight
 * also lands in `body_metric` server-side, which is what Today's chart reads — so
 * invalidating Today is not optional, it is how the new point appears.
 */
export function useSubmitCheckIn(studioId: string) {
  const qc = useQueryClient();
  return useMutation({
    meta: {
      feedback: {
        error: "Couldn't send your check-in. Your answers are still here.",
        success: "Check-in sent",
      },
    },
    mutationFn: ({
      checkInId,
      submissionId,
      answers,
      formVersion,
    }: {
      checkInId: string;
      submissionId: string;
      answers: AnswerInput[];
      formVersion?: "weekly-v2";
    }) => checkInApi.submit(studioId, checkInId, submissionId, answers, formVersion),

    onSuccess: (_result, { checkInId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.client.today(studioId) });
      qc.invalidateQueries({ queryKey: queryKeys.client.checkIns(studioId) });
      qc.invalidateQueries({ queryKey: ["profile-history", studioId] });
      qc.invalidateQueries({ queryKey: queryKeys.client.checkIn(studioId, checkInId) });
    },
  });
}

/**
 * Whether photo steps can work at all.
 *
 * Asked once and cached for the session: Cloudinary is either configured on the server
 * or it is not, and that does not change while somebody fills in a form. The check-in
 * form reads this to say so on a photo step rather than offering a camera that 503s.
 */
export function useUploadsConfigured(studioId: string | null) {
  return useQuery({
    queryKey: queryKeys.client.uploads(studioId ?? ""),
    queryFn: () => uploadApi.configured(studioId as string),
    enabled: Boolean(studioId),
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
