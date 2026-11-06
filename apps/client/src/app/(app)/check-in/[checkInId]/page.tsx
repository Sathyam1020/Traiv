"use client";

import { Button } from "@traiv/ui/components/button";
import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { ArrowLeft, ArrowRight, Check } from "@traiv/ui/icons";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { CheckInAnswers } from "@/components/check-in/answers";
import {
  playCompletionSound,
  prepareCompletionSound,
} from "@/components/check-in/completion-sound";
import { useCheckInFlow } from "@/components/check-in/use-check-in-flow";
import { WeeklyFields } from "@/components/check-in/weekly-fields";
import { QueryError } from "@/components/common/query-state";

import { longDate } from "@/lib/dates";
import { useActiveStudio, useCheckIn, useUploadsConfigured } from "@/lib/query";

/**
 * One check-in: filling it in, or reading one that is done.
 *
 * Both on one route, because which of the two you get is a property of the check-in
 * rather than of where you came from — a client who taps last week's entry in their
 * history wants to read it, and one who taps this week's card wants to fill it in.
 * Coachway splits these into `StepsScreen` and `CheckInDetailScreen`; the split is
 * theirs to need, because their form is a separate entity from its answers.
 */
/** `useCheckInReturn` reads `useSearchParams`, which requires a Suspense boundary. */
export default function CheckInPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CheckInPageContent />
    </Suspense>
  );
}

function CheckInPageContent() {
  const returnTo = useCheckInReturn();
  const { checkInId } = useParams<{ checkInId: string }>();
  const { studioId } = useActiveStudio();
  const detail = useCheckIn(studioId, checkInId);
  const [submitted, setSubmitted] = useState(false);
  const filling = useRef(false);
  if (submitted) return <Success />;

  if (detail.isPending) return <Loading />;

  if (detail.error || !detail.data) {
    return (
      <Page className="gap-3">
        <QueryError
          title="Couldn't load this check-in."
          busy={detail.isFetching}
          onRetry={() => void detail.refetch()}
        />
        <Button asChild variant="secondary" className="mt-2 self-start">
          <Link href={returnTo}>Go back</Link>
        </Button>
      </Page>
    );
  }

  const { state } = detail.data.checkIn;
  const open = state === "upcoming" || state === "overdue";

  if (open) filling.current = true;
  return (open || filling.current) && studioId ? (
    <Wizard studioId={studioId} detail={detail.data} onSubmitted={() => setSubmitted(true)} />
  ) : (
    <Done detail={detail.data} />
  );
}

function Wizard({
  studioId,
  detail,
  onSubmitted,
}: {
  studioId: string;
  detail: NonNullable<ReturnType<typeof useCheckIn>["data"]>;
  onSubmitted: () => void;
}) {
  const router = useRouter();
  const returnTo = useCheckInReturn();
  const uploads = useUploadsConfigured(studioId);
  const { state, answer, clear, next, back } = useCheckInFlow(studioId, detail, onSubmitted);
  const [uploadCount, setUploadCount] = useState(0);
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    content.current?.scrollTo({ top: 0 });
  }, [state.kind === "asking" ? state.index : -1]);
  if (state.kind === "loading") return <Loading />;
  if (state.kind === "done") return <Success />;
  const last = state.index === state.total - 1;
  return (
    <div className="mx-auto flex h-dvh w-full max-w-[480px] flex-col bg-panel px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="shrink-0 pb-7">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
          Step {state.index + 1} of {state.total}
        </p>
        <div
          role="progressbar"
          aria-label="Check-in progress"
          aria-valuenow={state.index + 1}
          aria-valuemin={0}
          aria-valuemax={state.total}
          className="h-[3px] overflow-hidden rounded-full bg-line"
        >
          <div
            className="h-full rounded-full bg-signal transition-[width] duration-200 motion-reduce:transition-none"
            style={{ width: `${((state.index + 1) / state.total) * 100}%` }}
          />
        </div>
      </div>
      <div ref={content} className="min-h-0 flex-1 overflow-y-auto pb-5">
        <h1 className="text-[26px] font-semibold leading-[1.25] tracking-tight text-fg">
          {state.step.title}
        </h1>
        {state.step.description ? (
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">{state.step.description}</p>
        ) : null}
        <div key={state.index} className="mt-5">
          <WeeklyFields
            step={state.step}
            metrics={state.metrics}
            answers={state.answers}
            onAnswer={answer}
            onClear={clear}
            studioId={studioId}
            uploads={uploads.data ?? false}
            onBusy={(busy) => setUploadCount((n) => Math.max(0, n + (busy ? 1 : -1)))}
          />
        </div>
        {state.error ? (
          <p role="alert" className="mt-4 text-sm text-danger">
            {state.error}
          </p>
        ) : null}
      </div>
      <footer className="shrink-0 pt-4">
        <div className="flex items-center gap-2.5">
          {
            <button
              type="button"
              aria-label={state.index > 0 ? "Previous step" : "Go back"}
              disabled={state.busy || uploadCount > 0}
              onClick={() => (state.index > 0 ? back() : router.push(returnTo))}
              className="flex size-[52px] shrink-0 items-center justify-center rounded-full border border-line bg-surface disabled:opacity-40"
            >
              <ArrowLeft className="size-5" />
            </button>
          }
          <button
            type="button"
            disabled={!state.valid || state.busy || uploadCount > 0}
            onClick={() => {
              if (last) prepareCompletionSound();
              next();
            }}
            className="flex h-[52px] flex-1 items-center justify-center gap-3 rounded-full bg-signal text-base font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {state.busy ? "Submitting…" : last ? "Done" : "Continue"}
            {last ? <Check className="size-5" /> : <ArrowRight className="size-5" />}
          </button>
        </div>
        {!last ? (
          <button
            type="button"
            disabled={state.busy || uploadCount > 0}
            onClick={() => router.push(returnTo)}
            className="mt-3 h-10 w-full text-sm text-fg-subtle disabled:opacity-40"
          >
            Continue Later
          </button>
        ) : (
          <div className="h-[52px]" />
        )}
      </footer>
    </div>
  );
}
function useCheckInReturn() {
  return useSearchParams().get("from") === "profile" ? "/you" : "/dashboard";
}
function Success() {
  const returnTo = useCheckInReturn();
  const played = useRef(false);
  useEffect(() => {
    if (!played.current) {
      played.current = true;
      playCompletionSound();
    }
  }, []);
  return (
    <div className="mx-auto flex h-dvh w-full max-w-[480px] flex-col bg-panel px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="check-in-success-tick mb-8 flex size-[72px] items-center justify-center rounded-full bg-signal text-white">
          <Check className="size-10" strokeWidth={3.5} />
        </span>
        <h1 className="text-2xl font-semibold">You're all set</h1>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          Your check-in has been submitted successfully.
        </p>
      </div>
      <Button asChild className="h-[52px] w-full rounded-full text-base">
        <Link href={returnTo}>
          Continue <ArrowRight className="size-5" />
        </Link>
      </Button>
    </div>
  );
}

/** A check-in that is finished, or one whose window closed. Read-only either way. */
function Done({ detail }: { detail: NonNullable<ReturnType<typeof useCheckIn>["data"]> }) {
  const { checkIn } = detail;
  const missed = checkIn.state === "missed";

  return (
    <Page className="max-w-xl gap-6">
      <header className="flex flex-col gap-1">
        <span className="text-caption font-medium uppercase tracking-[0.08em] text-fg-subtle">
          {missed ? "Missed" : "Completed"}
        </span>
        <h1 className="text-heading font-medium">{longDate(checkIn.dueOn)}</h1>
        {missed ? (
          <p className="text-body-sm text-fg-muted">
            This one closed on {longDate(checkIn.closesOn)}. Nothing to do — the next one is what
            counts.
          </p>
        ) : null}
      </header>

      {missed ? null : <CheckInAnswers answers={checkIn.answers} />}

      <Button asChild variant="secondary" className="self-start">
        <Link href="/check-ins">All check-ins</Link>
      </Button>
    </Page>
  );
}

function Loading() {
  return (
    <Page className="max-w-xl gap-6">
      <Skeleton className="h-1 w-full" />
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-11 w-full" />
    </Page>
  );
}
