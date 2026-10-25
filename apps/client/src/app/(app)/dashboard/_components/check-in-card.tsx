"use client";

import { Button } from "@traiv/ui/components/button";
import { CalendarCheck, CircleCheck, Clock } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import Link from "next/link";
import { useEffect, useState } from "react";
import { hasDraft } from "@/components/check-in/draft";
import type { Today } from "@/lib/api";
import { longDate, relativeDay } from "@/lib/dates";

/**
 * The reason to open the app this week.
 *
 * It sits directly under the greeting because that is where Coachway puts it and because
 * it is the only thing on this screen that is *asked* of the client rather than reported
 * to them. `competitor-client-apps.md`: the check-in is the one feature that both gives
 * a client a weekly reason to open the app and feeds the adaptation loop its inputs.
 *
 * The server sends only an *open* check-in — one whose grace window has not closed — so
 * this never nags somebody about a week they can no longer do anything about. A missed
 * one belongs in the history, not on the home screen.
 */
export function CheckInCard({ checkIn }: { checkIn: Today["checkIn"] }) {
  /**
   * Whether to say "Start" or "Continue".
   *
   * Read in an effect rather than during render: the draft lives in `localStorage`,
   * which does not exist on the server, and reading it in the render body makes the
   * first client paint disagree with the server's HTML. Starting at false means the
   * button says "Start" for one frame and corrects itself, which is the right way round
   * — "Continue" on a check-in with nothing saved would be a lie.
   */
  const [resumable, setResumable] = useState(false);
  useEffect(() => setResumable(hasDraft(checkIn)), [checkIn]);

  if (!checkIn) return <AllClear />;

  const overdue = checkIn.state === "overdue";

  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-surface border p-4 sm:p-5",
        overdue ? "border-warning/30 bg-warning-subtle" : "border-line bg-surface",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="flex items-center gap-2 text-caption font-medium uppercase tracking-[0.08em] text-fg-subtle">
            <Clock aria-hidden="true" className="size-3.5" />
            {overdue ? "Check-in due" : "Next check-in"}
          </span>
          <h2 className="text-subheading font-medium">{relativeDay(checkIn.dueOn)}</h2>
          <p className="text-body-sm text-fg-muted">
            {overdue
              ? `Closes ${longDate(checkIn.closesOn)}`
              : `Due ${longDate(checkIn.dueOn)} — you can fill it in now if you like`}
          </p>
        </div>
        <CalendarCheck
          aria-hidden="true"
          className={cn("size-5 shrink-0", overdue ? "text-warning" : "text-fg-subtle")}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button asChild className="h-11 w-full sm:w-auto sm:px-6">
          <Link href={`/check-in/${checkIn.id}`}>
            {resumable ? "Continue check-in" : "Start check-in"}
          </Link>
        </Button>
        <HistoryLink />
      </div>
    </section>
  );
}

/**
 * The only way into the history, and it belongs here rather than in the tab bar.
 *
 * Coachway reaches "Check-in History" from the profile; a fifth tab for a list somebody
 * opens once a month would cost a permanent thumb target on a 360px phone. Next to the
 * thing it is the history *of* is where it is actually looked for.
 */
function HistoryLink({ className }: { className?: string }) {
  return (
    <Link
      href="/check-ins"
      className={cn(
        "text-body-sm text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline",
        className,
      )}
    >
      All check-ins
    </Link>
  );
}

/**
 * Nothing due.
 *
 * Either they have just submitted or their coach has check-ins switched off. Said
 * plainly rather than hidden, because an empty space where the card was reads as
 * something having gone wrong.
 */
function AllClear() {
  return (
    <section className="flex items-center gap-3 rounded-surface border border-line bg-surface p-4">
      <CircleCheck aria-hidden="true" className="size-5 shrink-0 text-success" />
      <div className="flex min-w-0 flex-col">
        <span className="text-body font-medium">Nothing due</span>
        <span className="text-body-sm text-fg-muted">
          You're up to date. Your coach will be in touch.
        </span>
      </div>
      <HistoryLink className="ml-auto shrink-0" />
    </section>
  );
}
