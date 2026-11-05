"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Dumbbell } from "@traiv/ui/icons";
import Link from "next/link";
import { QueryError } from "@/components/common/query-state";
import type { WorkoutListItem } from "@/lib/api";
import { useActiveStudio, useWorkouts } from "@/lib/query";
import { useWorkoutPrefetch } from "@/lib/query/use-workout-prefetch";

export default function WorkoutsPage() {
  const { studioId } = useActiveStudio();
  const list = useWorkouts(studioId);
  const prefetch = useWorkoutPrefetch(studioId);

  if (list.isPending) return <Loading />;

  if (list.isError && !list.data)
    return (
      <Page className="max-w-xl">
        <QueryError
          title="Couldn't load your workouts."
          busy={list.isFetching}
          onRetry={() => void list.refetch()}
        />
      </Page>
    );

  const programs = list.data ?? [];

  return (
    <Page className="w-full max-w-xl gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-display font-medium">Workouts</h1>
        <h2 className="text-body-sm text-fg-muted">Your plans</h2>
      </header>

      {programs.length === 0 ? (
        <p className="rounded-surface border border-line border-dashed bg-surface p-4 text-body-sm">
          Your coach hasn't assigned a workout yet. Your plan will appear here when it's ready.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onIntent={(sessionId) => prefetch.session(program.id, sessionId)}
            />
          ))}
        </ul>
      )}
    </Page>
  );
}

function ProgramCard({
  program,
  onIntent,
}: {
  program: WorkoutListItem;
  onIntent: (sessionId: string) => void;
}) {
  return (
    <li className="overflow-hidden rounded-surface border border-line bg-surface">
      {/* Programme header */}
      <div className="flex flex-col px-4 pt-4 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          {program.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={program.imageUrl}
              alt=""
              className="size-11 shrink-0 rounded-control object-cover"
            />
          ) : (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-control bg-brand text-brand-fg">
              {program.name.slice(0, 1).toUpperCase()}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{program.name}</h3>
            <p className="text-caption text-fg-muted">
              {program.sessions} {program.sessions === 1 ? "program" : "programs"}
            </p>
          </div>

          {program.source === "coach" && (
            <span className="shrink-0 rounded-full bg-sunken px-3 py-1 text-caption font-medium">
              Coach
            </span>
          )}
        </div>
      </div>

      {/* Every session opens its workout directly. */}
      {program.sessionItems.map((session) => (
        <Link
          key={session.id}
          href={`/workouts/${program.id}/${session.id}`}
          onPointerEnter={() => onIntent(session.id)}
          onFocus={() => onIntent(session.id)}
          onPointerDown={() => onIntent(session.id)}
          className="client-tappable flex min-w-0 items-center gap-3 border-t border-line px-4 py-3 transition-colors hover:bg-hover"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-control bg-signal-subtle text-signal p-3">
            <Dumbbell
              aria-hidden="true"
              className="size-5 rotate-[-35deg] fill-current text-signal"
            />
          </div>

          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate font-semibold">{session.name}</span>

            <span className="truncate text-caption text-fg-muted">
              {session.muscleGroups.length > 0 ? session.muscleGroups.join(" & ") : "Workout"}
              {" · "}
              {session.exercises} {session.exercises === 1 ? "Exercise" : "Exercises"}
            </span>
          </span>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-signal-subtle p-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="ml-0.5 size-5 fill-current text-signal"
            >
              <path d="M8.5 4.8C6.5 3.65 4 5.1 4 7.4v9.2c0 2.3 2.5 3.75 4.5 2.6l8-4.6c2-1.15 2-4.05 0-5.2l-8-4.6Z" />
            </svg>
          </div>
        </Link>
      ))}
      {!program.sessionItems.length && (
        <p className="border-t border-line px-4 py-3 text-sm text-fg-muted">
          No sessions in this plan yet.
        </p>
      )}
    </li>
  );
}

function Loading() {
  return (
    <Page className="w-full max-w-xl gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      <Skeleton className="h-48 w-full rounded-surface" />
      <Skeleton className="h-48 w-full rounded-surface" />
    </Page>
  );
}
