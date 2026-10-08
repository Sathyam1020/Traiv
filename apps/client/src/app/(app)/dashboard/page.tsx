"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Clock, Pause, Snowflake } from "lucide-react";
import type { ClientStatus, Coach } from "@/lib/api";
import { useCoaches, useSession } from "@/lib/query";

/**
 * Today — what the client is meant to do right now.
 *
 * Light at the moment, honestly so: there are no plans, workouts or logging yet, and
 * filling the space with tiles that say nothing would be the slop `ui-principles.md`
 * bans. It grows down this column as those land.
 */
export default function TodayPage() {
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const coaches = useCoaches(signedIn);

  if (session.isPending || coaches.isPending) return <Loading />;
  if ((coaches.data?.length ?? 0) === 0) return <NoCoach />;

  const name = session.data?.user.name?.split(" ")[0];
  const many = (coaches.data?.length ?? 0) > 1;

  return (
    <Page className="gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-display font-semibold tracking-[-0.025em]">
          {name ? `Hey ${name}` : "You're all set"}
        </h1>
        <p className="text-body-sm text-fg-muted">
          {many
            ? "Your coaches are putting your plans together. There's nothing for you to do yet."
            : "Your coach is putting your plan together. There's nothing for you to do yet."}
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-caption font-semibold uppercase tracking-[0.08em] text-fg-subtle">
          {many ? "Your coaches" : "Your coach"}
        </h2>
        {/* A grid rather than a stack: one card reads as deliberate at any width, and the
            second and third coach fill across instead of pushing the page down. */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {coaches.data?.map((coach) => (
            <CoachCard key={coach.clientId} coach={coach} />
          ))}
        </div>
      </section>
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
      <h1 className="text-heading font-semibold tracking-[-0.02em]">No coach yet</h1>
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 2 }, (_, n) => n).map((n) => (
          <Skeleton key={n} className="h-[5.5rem] w-full rounded-surface" />
        ))}
      </div>
    </Page>
  );
}
