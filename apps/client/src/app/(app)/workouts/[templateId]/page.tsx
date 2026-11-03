"use client";

import { Button } from "@traiv/ui/components/button";
import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Check, Dumbbell, Play } from "@traiv/ui/icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { QueryError } from "@/components/common/query-state";
import { useActiveStudio, useWorkout } from "@/lib/query";
import { useWorkoutPrefetch } from "@/lib/query/use-workout-prefetch";

/**
 * A programme with more than one session. One with exactly one skips this screen
 * entirely, so every entry point follows the same routing behavior.
 */
export default function ProgramPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const router = useRouter();
  const { studioId } = useActiveStudio();
  const program = useWorkout(studioId, templateId);
  const prefetch = useWorkoutPrefetch(studioId);

  const sessions = program.data?.sessions ?? [];
  const onlySession = sessions.length === 1 ? sessions[0] : null;

  useEffect(() => {
    if (onlySession) {
      router.replace(`/workouts/${templateId}/${onlySession.id}`);
    }
  }, [onlySession, router, templateId]);

  if (program.isPending || onlySession) return <Loading />;

  if (program.error || !program.data) {
    return (
      <Page className="max-w-xl gap-3">
        <QueryError
          title="Couldn't load this plan."
          busy={program.isFetching}
          onRetry={() => void program.refetch()}
        />
        <Button asChild variant="secondary" className="mt-2 self-start">
          <Link href="/workouts">All workouts</Link>
        </Button>
      </Page>
    );
  }

  const templateName = program.data.template.name;

  return (
    <Page className="max-w-xl gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-display font-medium">{templateName}</h1>
        <p className="text-body-sm text-fg-muted">
          {sessions.length} session{sessions.length === 1 ? "" : "s"}
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {sessions.map((session) => (
          <li key={session.id}>
            <Link
              href={`/workouts/${templateId}/${session.id}`}
              onPointerEnter={() => prefetch.session(templateId, session.id)}
              onFocus={() => prefetch.session(templateId, session.id)}
              onPointerDown={() => prefetch.session(templateId, session.id)}
              className="client-tappable group flex min-w-0 items-center gap-3 rounded-surface border border-line bg-surface p-3.5 transition-colors hover:bg-hover"
            >
              {/* Tinted icon container */}
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Dumbbell aria-hidden="true" className="size-6" />
              </span>

              {/* Keep title and metadata together on the same row */}
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate font-semibold text-body">{session.name}</span>

                <span className="text-caption text-fg-muted">
                  {session.exercises} exercise
                  {session.exercises === 1 ? "" : "s"}
                </span>
              </span>

              {session.lastCompletedAt ? (
                <span
                  role="img"
                  aria-label="Completed"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-success"
                >
                  <Check aria-hidden="true" className="size-4" />
                </span>
              ) : (
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-fg">
                  <Play aria-hidden="true" className="size-4 fill-current" />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}

function Loading() {
  return (
    <Page className="max-w-xl gap-5">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-[88px] w-full rounded-surface" />
        ))}
      </div>
    </Page>
  );
}
