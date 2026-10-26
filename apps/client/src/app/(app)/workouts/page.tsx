"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Dumbbell, Play } from "@traiv/ui/icons";
import Link from "next/link";
import type { WorkoutListItem } from "@/lib/api";
import { useActiveStudio, useWorkouts } from "@/lib/query";

export default function WorkoutsPage() {
  const { studioId } = useActiveStudio();
  const list = useWorkouts(studioId);

  if (list.isPending) return <Loading />;

  const programs = list.data ?? [];

  return (
    <Page className="w-full max-w-xl gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-display font-medium">Workouts</h1>
        <h2 className="text-caption font-medium uppercase tracking-wide">Your plans</h2>
      </header>

      {programs.length === 0 ? (
        <p className="rounded-surface border border-line border-dashed bg-surface p-4 text-body-sm">
          No plan assigned yet. Plans assigned to you will show up here.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </ul>
      )}
    </Page>
  );
}

function ProgramCard({ program }: { program: WorkoutListItem }) {
  const workoutName = program.sessionNames[0] ?? program.name;

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

        <p className="mt-3 text-body-sm text-fg-muted">{program.name}</p>
      </div>

      <div className="border-t border-line" />

      {/* Session row */}
      <Link
        href={`/workouts/${program.id}`}
        className="flex min-w-0 items-center gap-3 px-4 py-3 transition-colors hover:bg-hover"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-control p-3 bg-sunken">
          <Dumbbell aria-hidden="true" className="size-5 text-brand" />
        </div>

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-semibold">{workoutName}</span>

          <span className="truncate text-caption text-fg-muted">
            {program.muscleGroups.length > 0 ? program.muscleGroups.join(" & ") : "Workout"}
            {" · "}
            {program.exercises} {program.exercises === 1 ? "Exercise" : "Exercises"}
          </span>
        </span>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sunken p-2">
          <Play aria-hidden="true" className="size-4 fill-brand text-brand" />
        </div>
      </Link>
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
