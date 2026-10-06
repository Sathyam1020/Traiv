"use client";

import { Button } from "@traiv/ui/components/button";
import { Logo } from "@traiv/ui/components/logo";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Clock, Pause, Snowflake } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ClientStatus, Coach } from "@/lib/api";
import { useCoaches, useLogout, useSession } from "@/lib/query";

/**
 * Where a client lands once signed in.
 *
 * There is nothing to train with yet — no plans, no workouts, no logging — so this is
 * honest about that rather than inventing a dashboard full of empty cards. What it does
 * carry is the thing a client actually needs to know right now: which coach they are
 * attached to, and whether that relationship is live.
 */
export default function DashboardPage() {
  const router = useRouter();
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const coaches = useCoaches(signedIn);
  const logout = useLogout();

  // Guarded client-side only. The API is the real gate — every route this page reads
  // from authorizes the session itself, so this is routing, not security.
  useEffect(() => {
    if (!session.isPending && !signedIn) router.replace("/");
  }, [session.isPending, signedIn, router]);

  if (session.isPending || !signedIn || (signedIn && coaches.isPending)) return <Loading />;

  if ((coaches.data?.length ?? 0) === 0) return <NoCoach />;

  const name = session.data?.user.name?.split(" ")[0];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[32rem] flex-col gap-6 px-5 py-10">
      <header className="flex items-center justify-between">
        <Logo size={28} />
        <Button
          variant="ghost"
          size="sm"
          disabled={logout.isPending}
          onClick={() => logout.mutate(undefined, { onSettled: () => router.replace("/") })}
        >
          Sign out
        </Button>
      </header>

      <div className="flex flex-col gap-1">
        <h1 className="text-display font-semibold tracking-[-0.025em]">
          {name ? `Hey ${name}` : "You're all set"}
        </h1>
        <p className="text-body-sm text-fg-muted">
          {coaches.data?.length === 1
            ? "Your coach is setting things up. There's nothing for you to do yet."
            : "Your coaches are setting things up. There's nothing for you to do yet."}
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-caption font-semibold uppercase tracking-[0.08em] text-fg-subtle">
          {coaches.data?.length === 1 ? "Your coach" : "Your coaches"}
        </h2>
        {coaches.data?.map((coach) => (
          <CoachCard key={coach.clientId} coach={coach} />
        ))}
      </section>
    </main>
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

function Loading() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[32rem] flex-col gap-6 px-5 py-10">
      <Skeleton className="size-7 rounded-control" />
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-[5.5rem] w-full rounded-surface" />
    </main>
  );
}

/**
 * Signed in, but attached to nobody. Reachable two ways: a number that signed in here
 * before ever following a link, and a client whose only relationship was archived.
 */
function NoCoach() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <Logo size={44} />
      <div className="flex max-w-[32ch] flex-col gap-2">
        <h1 className="text-heading font-semibold tracking-[-0.02em]">No coach yet</h1>
        <p className="text-body-sm text-fg-muted">
          You're signed in, but you haven't been connected to a coach. Open the link or QR code they
          sent you — that's the only thing that connects your account to theirs.
        </p>
      </div>
    </main>
  );
}
