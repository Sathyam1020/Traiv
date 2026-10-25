"use client";

import { Button } from "@traiv/ui/components/button";
import { CircleSlash, Hourglass, PauseCircle } from "@traiv/ui/icons";
import type { ReactNode } from "react";
import type { ClientStatus } from "@/lib/api";

/**
 * What a client sees when their coaching is not running.
 *
 * A full screen rather than a dialog over the app. A dialog implies the thing behind it
 * is still yours and you are one dismissal away from it — but a paused client genuinely
 * cannot log a session, and the API refuses the write (`requireClient({ write: true })`
 * answers 403). Showing a greyed-out app they can almost use is the version that
 * generates support messages.
 *
 * Every state says the same three things: what happened, what it means for their data,
 * and who ends it. The last one matters most — none of these are states the client can
 * exit themselves, and not saying so is how somebody spends ten minutes looking for a
 * button that does not exist.
 */
const STATES: Partial<
  Record<ClientStatus, { icon: typeof PauseCircle; title: string; body: ReactNode }>
> = {
  paused: {
    icon: PauseCircle,
    title: "Your coaching is paused",
    body: (
      <>
        <p>
          Your coach has put things on hold for now. Nothing is lost — your plans, your logged
          sessions and your measurements are all exactly where you left them, and they come back the
          moment this is lifted.
        </p>
        <p>
          You cannot log sessions or check in while it is paused. Only your coach can start it
          again, so message them if you were not expecting this.
        </p>
      </>
    ),
  },
  archived: {
    icon: CircleSlash,
    title: "This coaching has ended",
    body: (
      <>
        <p>
          You and your coach are no longer working together. Your history stays here — nothing has
          been deleted — but there is nothing new to do in the app.
        </p>
        <p>
          If this is a mistake, or you want to start again, your coach can bring you back. You can
          also join a different coach with their code.
        </p>
      </>
    ),
  },
  waiting: {
    icon: Hourglass,
    title: "You are on the waiting list",
    body: (
      <p>
        Your coach's roster is full, so you are queued. They will let you in as soon as a place
        opens, and the app unlocks the moment they do — there is nothing you need to do in the
        meantime.
      </p>
    ),
  },
  frozen: {
    icon: PauseCircle,
    title: "Your coaching is on hold",
    body: (
      <p>
        Something on your coach's side has put this on hold. Your plans and your history are safe
        and nothing has been deleted. Your coach can lift it — message them if you were not
        expecting this.
      </p>
    ),
  },
};

export function StatusGate({
  status,
  coachName,
  children,
}: {
  status: ClientStatus | undefined;
  coachName?: string;
  /** Passed through untouched when the status is one that may use the app. */
  children?: ReactNode;
}) {
  const state = status ? STATES[status] : undefined;
  if (!state) return <>{children ?? null}</>;

  const { icon: Icon, title, body } = state;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[28rem] flex-col justify-center gap-5 px-5 py-10">
      <span className="flex size-11 items-center justify-center rounded-surface bg-sunken">
        <Icon className="size-5 text-fg-muted" />
      </span>

      <div className="flex flex-col gap-2">
        <h1 className="text-heading font-medium">{title}</h1>
        {coachName ? <p className="text-body-sm text-fg-subtle">with {coachName}</p> : null}
      </div>

      <div className="flex flex-col gap-3 text-body-sm leading-relaxed text-fg-muted">{body}</div>

      {status === "archived" ? (
        <Button asChild className="mt-2 w-fit">
          <a href="/join">Join another coach</a>
        </Button>
      ) : null}
    </main>
  );
}
