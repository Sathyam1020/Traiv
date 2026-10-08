"use client";

import { useCallback, useEffect, useState } from "react";
import type { IntakePatch } from "@/lib/api";
import { useCompleteIntake, useIntake, useSaveStep } from "@/lib/query";

export const LAST_STEP = 6;

export type IntakeStep = 1 | 2 | 3 | 4 | 5 | 6 | "done";

/**
 * The six questions, as a state machine.
 *
 * Each step saves when it is left, which is the whole reason this is worth doing over a
 * single long form: a client who closes the tab at step four has lost step four, not
 * everything. `lastStep` comes back from the server, so reopening the link resumes rather
 * than restarts — including on a different phone.
 *
 * There is no way out of it other than through. Onboarding is what turns a verified phone
 * number into somebody a coach can write a plan for, so the app does not open until it is
 * done — see `StepShell` for why there is no skip.
 */
export function useIntakeFlow(studioId: string) {
  const state = useIntake(studioId);
  const save = useSaveStep(studioId);
  const complete = useCompleteIntake(studioId);

  const [step, setStep] = useState<IntakeStep | null>(null);
  const [error, setError] = useState<string | null>(null);

  const intake = state.data?.intake ?? null;

  // Resolved once, from the server, and then owned locally. Re-deriving it on every render
  // would yank somebody back a step the moment a save lands.
  useEffect(() => {
    if (step !== null || !state.data) return;
    if (intake?.completedAt) {
      setStep("done");
      return;
    }
    const last = intake?.lastStep ?? 0;
    setStep(last >= LAST_STEP ? LAST_STEP : ((last + 1) as IntakeStep));
  }, [state.data, intake, step]);

  const advance = useCallback(
    async (from: number, patch: IntakePatch) => {
      setError(null);
      try {
        await save.mutateAsync({ step: from, patch });
      } catch {
        setError("Couldn't save that. Check your connection and try again.");
        return;
      }

      if (from < LAST_STEP) {
        setStep((from + 1) as IntakeStep);
        return;
      }

      try {
        await complete.mutateAsync();
        setStep("done");
      } catch {
        setError("Couldn't finish. Check your connection and try again.");
      }
    },
    [save, complete],
  );

  const back = useCallback(() => {
    setError(null);
    setStep((s) => (typeof s === "number" && s > 1 ? ((s - 1) as IntakeStep) : s));
  }, []);

  return {
    step,
    /** Null until the server has said where they left off. */
    loading: state.isPending || step === null,
    intake,
    weightKg: state.data?.weightKg ?? null,
    target: state.data?.target ?? null,
    awaitingReview: state.data?.awaitingReview ?? false,
    busy: save.isPending || complete.isPending,
    error,
    /** Answer and move on. */
    next: (from: number, patch: IntakePatch) => advance(from, patch),
    back,
  };
}

export type IntakeFlow = ReturnType<typeof useIntakeFlow>;
