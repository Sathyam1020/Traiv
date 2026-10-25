"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AnswerInput, CheckInDetail } from "@/lib/api";
import { isApiError } from "@/lib/api";
import { useSubmitCheckIn } from "@/lib/query";
import {
  clearAnswer,
  clearDraft,
  type Draft,
  loadDraft,
  saveAnswer,
  saveStepIndex,
  startDraft,
} from "./draft";

/**
 * One question at a time, over the studio's metric registry.
 *
 * The questions *are* the registry — there is no separate form entity, which is the
 * simplification `.ai/features/check-ins/spec.md` settled on. Coachway drives the same
 * wizard from a coach-authored form; the shape of the runner is identical either way,
 * which is why this and onboarding share `StepShell`.
 *
 * Answers are written to the draft on every change rather than on Continue. A client who
 * closes the tab mid-question has lost the question, not the check-in — and on the
 * connection `personas.md` describes, closing the tab is not an edge case.
 */
export type FlowState =
  | { kind: "loading" }
  | { kind: "done" }
  | {
      kind: "asking";
      index: number;
      total: number;
      metric: CheckInDetail["metrics"][number];
      answer: AnswerInput | undefined;
      answered: number;
      busy: boolean;
      error: string | null;
    };

export function useCheckInFlow(studioId: string, detail: CheckInDetail | undefined) {
  const submit = useSubmitCheckIn(studioId);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metrics = useMemo(() => detail?.metrics ?? [], [detail]);
  const checkIn = detail?.checkIn;

  /**
   * Open or resume, once, when the check-in arrives.
   *
   * `loadDraft` is what enforces Coachway's two resume rules — a draft for a different
   * check-in, or for a window that has since moved, is discarded rather than inherited.
   * Resuming at the saved step is the whole point of saying "Continue".
   */
  useEffect(() => {
    if (!checkIn || draft) return;

    const resumed = loadDraft(checkIn);
    const next = resumed ?? startDraft(checkIn);
    setDraft(next);
    // Clamp: the coach may have removed a metric since, which would otherwise resume
    // past the end of the form and render nothing.
    setIndex(Math.min(next.stepIndex, Math.max(metrics.length - 1, 0)));
  }, [checkIn, draft, metrics.length]);

  const answer = useCallback(
    (input: AnswerInput | null) => {
      setDraft((d) => {
        if (!d) return d;
        const metric = metrics[index];
        if (!metric) return d;
        return input === null ? clearAnswer(d, metric.id) : saveAnswer(d, input);
      });
    },
    [index, metrics],
  );

  const go = useCallback((to: number) => {
    setIndex(to);
    setDraft((d) => (d ? saveStepIndex(d, to) : d));
  }, []);

  const finish = useCallback(async () => {
    if (!draft || !checkIn) return;
    setError(null);

    const answers = Object.values(draft.answers);
    if (answers.length === 0) {
      setError("Answer at least one question before sending this.");
      return;
    }

    try {
      await submit.mutateAsync({
        checkInId: checkIn.id,
        // The same id on every attempt. A retry after a dropped response converges on
        // one check-in rather than creating a second.
        submissionId: draft.submissionId,
        answers,
      });
      // Only once the server has it. Clearing on optimism is how a failed submit loses
      // everything somebody just typed.
      clearDraft();
      setDone(true);
    } catch (e) {
      setError(
        isApiError(e) ? e.message : "Couldn't send that. Your answers are saved — try again.",
      );
    }
  }, [draft, checkIn, submit]);

  const next = useCallback(() => {
    if (index < metrics.length - 1) go(index + 1);
    else void finish();
  }, [index, metrics.length, go, finish]);

  const back = useCallback(() => {
    if (index > 0) go(index - 1);
  }, [index, go]);

  const state: FlowState = useMemo(() => {
    if (done) return { kind: "done" };
    const metric = metrics[index];
    if (!draft || !metric) return { kind: "loading" };

    return {
      kind: "asking",
      index,
      total: metrics.length,
      metric,
      answer: draft.answers[metric.id],
      answered: Object.keys(draft.answers).length,
      busy: submit.isPending,
      error,
    };
  }, [done, draft, metrics, index, submit.isPending, error]);

  /** Leaving keeps the draft — that is what "Continue later" means. */
  return { state, answer, next, back, discard: clearDraft };
}
