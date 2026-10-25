"use client";

import { Button } from "@traiv/ui/components/button";
import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { CircleCheck } from "@traiv/ui/icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CheckInAnswers } from "@/components/check-in/answers";
import { Step } from "@/components/check-in/steps";
import { useCheckInFlow } from "@/components/check-in/use-check-in-flow";
import { StepShell } from "@/components/common/step-shell";
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
export default function CheckInPage() {
  const { checkInId } = useParams<{ checkInId: string }>();
  const { studioId } = useActiveStudio();
  const detail = useCheckIn(studioId, checkInId);

  if (detail.isPending) return <Loading />;

  if (detail.error || !detail.data) {
    return (
      <Page className="gap-3">
        <h1 className="text-heading font-medium">Check-in not found</h1>
        <p className="text-body-sm text-fg-muted">This one isn't yours, or it's been removed.</p>
        <Button asChild variant="secondary" className="mt-2 self-start">
          <Link href="/dashboard">Back to today</Link>
        </Button>
      </Page>
    );
  }

  const { state } = detail.data.checkIn;
  const open = state === "upcoming" || state === "overdue";

  return open && studioId ? (
    <Wizard studioId={studioId} detail={detail.data} />
  ) : (
    <Done detail={detail.data} />
  );
}

function Wizard({
  studioId,
  detail,
}: {
  studioId: string;
  detail: NonNullable<ReturnType<typeof useCheckIn>["data"]>;
}) {
  const router = useRouter();
  const uploads = useUploadsConfigured(studioId);
  const { state, answer, next, back } = useCheckInFlow(studioId, detail);

  if (state.kind === "loading") return <Loading />;

  if (state.kind === "done") {
    return (
      <Page className="items-center gap-4 pt-10 text-center">
        <CircleCheck aria-hidden="true" className="size-12 text-success" />
        <h1 className="text-heading font-medium">You're all set</h1>
        <p className="max-w-[42ch] text-body-sm leading-relaxed text-fg-muted">
          Your check-in is in. Your coach will read it and come back to you.
        </p>
        <Button asChild className="mt-2">
          <Link href="/dashboard">Done</Link>
        </Button>
      </Page>
    );
  }

  const last = state.index === state.total - 1;

  return (
    <Page className="max-w-xl gap-0">
      <StepShell
        step={state.index + 1}
        total={state.total}
        title={state.metric.name}
        blurb={
          last
            ? "Last one. Anything you leave blank is simply not answered."
            : "Leave anything blank you'd rather skip."
        }
        onContinue={next}
        onBack={back}
        busy={state.busy}
        error={state.error}
        // Every question is skippable — the registry has no required flag, and a check-in
        // that refuses to move until a photo is taken is a check-in nobody finishes. The
        // flow refuses an entirely empty submission instead.
        canContinue
        continueLabel={
          last ? `Send check-in${state.answered ? "" : " — nothing answered"}` : "Continue"
        }
        secondary={
          <Button variant="ghost" className="h-10 w-full" onClick={() => router.push("/dashboard")}>
            Continue later
          </Button>
        }
      >
        <Step
          metric={state.metric}
          answer={state.answer}
          onAnswer={answer}
          studioId={studioId}
          uploads={uploads.data ?? false}
        />
      </StepShell>
    </Page>
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
