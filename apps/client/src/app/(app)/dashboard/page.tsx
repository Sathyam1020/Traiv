"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Clock, Pause, Snowflake } from "@traiv/ui/icons";
import { useState } from "react";
import type { ClientStatus, Coach } from "@/lib/api";
import { useActiveStudio, useToday } from "@/lib/query";
import { CheckInCard } from "./_components/check-in-card";
import { LogWeightDialog } from "./_components/log-weight-dialog";
import { MeasurementsCard } from "./_components/measurements-card";
import { RecentActivity } from "./_components/recent-activity";
import { WeightCard } from "./_components/weight-card";

/**
 * Today — what the client is meant to do right now.
 *
 * Coachway's order, which is the order of how much it is asked *of* the client rather
 * than reported *to* them: greeting, the check-in, then the numbers, then what they have
 * already done. The one actionable thing is above the fold on a 360px phone; everything
 * below it is feedback.
 *
 * There is no quick-actions FAB yet. Coachway's has three entries and ours would have
 * one — logging a weight, which is already a word on the card it belongs to. It arrives
 * with "start today's workout", when there is a workout to start.
 */
export default function TodayPage() {
  const { studioId, coaches, stalled, isPending } = useActiveStudio();
  const today = useToday(studioId);
  const [logging, setLogging] = useState(false);

  if (isPending) return <Loading />;
  if (coaches.length === 0) return <NoCoach />;

  // A paused or waiting relationship with nothing else running: the layout's gate has
  // already taken the screen, so reaching here means something is active.
  const data = today.data;

  return (
    <Page className="gap-8">
      {/* Coachway's greeting carries the exclamation; it is the one place in the app
          that is pleased to see you, and the rest of the screen is deliberately flat. */}
      <header className="flex flex-col gap-1">
        <h1 className="text-display font-medium">
          {data?.firstName ? `Hey ${data.firstName}!` : "Hey!"}
        </h1>
      </header>

      {today.isPending ? (
        <Skeleton className="h-[11rem] w-full rounded-surface" />
      ) : data ? (
        <CheckInCard checkIn={data.checkIn} />
      ) : null}

      {data ? (
        <>
          {/* Coachway's ProgressCards: a `gap-3` stack, not a grid. The weight card is a
              block and the body-composition card is a row — stacking keeps that
              difference legible instead of forcing a row into half a grid cell. */}
          <div className="flex flex-col gap-3">
            <WeightCard weight={data.weight} onLog={() => setLogging(true)} />
            <MeasurementsCard
              measurements={data.measurements}
              href={data.measurements[0] ? `/check-in/${data.measurements[0].checkInId}` : null}
            />
          </div>

          <RecentActivity sessions={data.recentSessions} />
        </>
      ) : null}

      {/* Several coaches, or one that is not running: both are worth stating. A single
          active coach needs no card — the whole screen is already theirs. */}
      {coaches.length > 1 || stalled ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-caption font-semibold uppercase tracking-[0.08em] text-fg-subtle">
            {coaches.length > 1 ? "Your coaches" : "Your coach"}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {coaches.map((coach) => (
              <CoachCard key={coach.clientId} coach={coach} />
            ))}
          </div>
        </section>
      ) : null}

      {studioId ? (
        <LogWeightDialog
          studioId={studioId}
          open={logging}
          onOpenChange={setLogging}
          current={data?.weight.latest ?? null}
        />
      ) : null}
    </Page>
  );
}

/** Only states a client can actually be in here — `requireClient` refuses the rest. */
const STATUS: Record<ClientStatus, { label: string; detail: string; Icon: typeof Clock } | null> = {
  active: null,
  waiting: {
    label: "On the waitlist",
    detail: "Their roster is full. They'll add you as soon as a place opens up.",
    Icon: Clock,
  },
  archived: {
    label: "Ended",
    detail: "You and this coach are no longer working together. Your history stays here.",
    Icon: Pause,
  },
  paused: {
    label: "Paused",
    detail: "Your coach has paused this for now. Nothing is lost.",
    Icon: Pause,
  },
  frozen: {
    label: "Frozen",
    detail: "This is on hold. Your history is safe and comes back when it resumes.",
    Icon: Snowflake,
  },
};

function CoachCard({ coach }: { coach: Coach }) {
  const state = STATUS[coach.status];

  return (
    <article className="flex flex-col gap-3 rounded-surface border border-line bg-surface p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-sunken text-body-sm font-semibold">
          {coach.studio.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-body font-medium">{coach.studio.name}</span>
          <span className="text-caption text-fg-subtle">{state ? state.label : "Your coach"}</span>
        </div>
      </div>

      {state ? (
        <div className="flex items-start gap-2 rounded-control bg-sunken px-3 py-2.5">
          <state.Icon className="mt-0.5 size-3.5 shrink-0 text-fg-subtle" />
          <p className="text-caption leading-relaxed text-fg-muted">{state.detail}</p>
        </div>
      ) : null}
    </article>
  );
}

function NoCoach() {
  return (
    <Page className="gap-3">
      <h1 className="text-heading font-medium">No coach yet</h1>
      <p className="max-w-[46ch] text-body-sm leading-relaxed text-fg-muted">
        Traiv is something your coach sets up for you. Ask them for their link, open it on this
        phone, and you'll be connected.
      </p>
    </Page>
  );
}

function Loading() {
  return (
    <Page className="gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-[11rem] w-full rounded-surface" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-48 w-full rounded-surface" />
        <Skeleton className="h-16 w-full rounded-surface" />
      </div>
    </Page>
  );
}
