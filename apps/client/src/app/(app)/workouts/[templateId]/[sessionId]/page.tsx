"use client";

import { Button } from "@traiv/ui/components/button";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Activity, ArrowLeft, ChevronRight, Clock, Dumbbell, Play } from "@traiv/ui/icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { QueryError } from "@/components/common/query-state";
import { useActiveStudio, useStartSession, useWorkoutSession } from "@/lib/query";
import { useWorkoutPrefetch } from "@/lib/query/use-workout-prefetch";
import { formatSetSummary } from "../../_components/set-summary";

export default function SessionPreviewPage() {
  const { templateId, sessionId } = useParams<{
    templateId: string;
    sessionId: string;
  }>();

  const router = useRouter();
  const { studioId } = useActiveStudio();

  const session = useWorkoutSession(studioId, templateId, sessionId);
  const prefetch = useWorkoutPrefetch(studioId);
  const start = useStartSession(studioId ?? "", templateId, sessionId);

  if (session.isPending) return <Loading />;

  if (session.error || !session.data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20 text-center">
        <QueryError
          title="Couldn't load this workout."
          busy={session.isFetching}
          onRetry={() => void session.refetch()}
        />
        <Button asChild variant="secondary" size="sm">
          <Link href="/workouts">All workouts</Link>
        </Button>
      </div>
    );
  }

  const { session: s, live, exercises } = session.data;

  async function begin() {
    try {
      await start.mutateAsync();
      router.push(`/workouts/${templateId}/${sessionId}/active`);
    } catch {
      /* Rendered by the mutation recovery state below. */
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Existing workout header */}
      <div className="client-workout-header flex flex-col gap-3 bg-brand px-4 pt-4 pb-6 text-brand-fg sm:px-6">
        <Link
          href="/workouts"
          aria-label="Back to workouts"
          className="flex size-9 items-center justify-center rounded-control bg-brand-fg/15 text-brand-fg transition-colors hover:bg-brand-fg/25"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <div className="flex flex-col gap-0.5">
          <h1 className="text-display font-medium">{s.name}</h1>
          <p className="text-body-sm text-brand-fg/80">
            {exercises.length} exercise
            {exercises.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Exercise list */}

      {/* Exercise list */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 rounded-t-panel bg-panel px-4 pt-5 pb-6 sm:px-6">
        <ul className="flex flex-col gap-2">
          {exercises.map((e) => {
            const summary = formatSetSummary(e.fields, e.sets);

            const sets = summary.find((v) => /^\d+\s+sets?$/i.test(v.trim()));

            const reps = summary.find((v) => /reps?/i.test(v));

            const rest = summary.find((v) => /rest/i.test(v));

            const remaining = summary.filter((v) => v !== sets && v !== reps && v !== rest);

            return (
              <li key={e.id}>
                <Link
                  href={`/workouts/${templateId}/${sessionId}/exercises/${encodeURIComponent(e.exerciseId)}`}
                  onPointerEnter={() => prefetch.exercise(e.exerciseId)}
                  onFocus={() => prefetch.exercise(e.exerciseId)}
                  onPointerDown={() => prefetch.exercise(e.exerciseId)}
                  className="client-tappable flex items-center gap-3 rounded-surface border border-line bg-surface px-2.5 py-2 transition-colors hover:bg-hover"
                >
                  {/* Thumbnail */}
                  {e.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={e.imageUrl}
                      alt=""
                      className="size-[56px] shrink-0 rounded-control object-cover"
                    />
                  ) : (
                    <span className="flex size-[56px] shrink-0 items-center justify-center rounded-control bg-sunken">
                      <Dumbbell className="size-5 text-fg-subtle" />
                    </span>
                  )}

                  {/* Name and single-row metadata */}
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="truncate text-body-sm font-semibold leading-5">{e.name}</span>

                    <span className="flex min-w-0 items-center gap-x-3 overflow-hidden whitespace-nowrap text-caption text-fg-muted">
                      {sets && (
                        <span className="inline-flex shrink-0 items-center gap-1.5">
                          <Activity className="size-4 shrink-0 text-fg-subtle" />
                          {sets}
                        </span>
                      )}

                      {reps && (
                        <span className="inline-flex shrink-0 items-center gap-1.5">
                          <Dumbbell className="size-4 shrink-0 text-fg-subtle" />
                          {reps}
                        </span>
                      )}

                      {rest && (
                        <span className="inline-flex shrink-0 items-center gap-1.5">
                          <Clock className="size-4 shrink-0 text-fg-subtle" />
                          {rest}
                        </span>
                      )}

                      {remaining.map((value) => (
                        <span key={value} className="shrink-0">
                          {value}
                        </span>
                      ))}
                    </span>
                  </span>

                  {/* Chevron */}
                  <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-fg-subtle" />
                </Link>
              </li>
            );
          })}
        </ul>

        {start.isError ? (
          <p role="alert" className="text-body-sm text-danger">
            Couldn't start your workout. Try again.
          </p>
        ) : null}
        <Button
          aria-busy={start.isPending}
          size="lg"
          className="w-full"
          onClick={() => void begin()}
          disabled={start.isPending}
        >
          <Play className="size-4" />
          {start.isPending ? "Starting…" : live ? "Resume workout" : "Start workout"}
        </Button>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pt-4 sm:px-6">
      <Skeleton className="h-32 w-full rounded-surface" />
      <Skeleton className="h-24 w-full rounded-surface" />
      <Skeleton className="h-24 w-full rounded-surface" />
    </div>
  );
}
