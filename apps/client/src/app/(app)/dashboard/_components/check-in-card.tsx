"use client";

import { Button } from "@traiv/ui/components/button";
import { CircleCheck } from "@traiv/ui/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { hasDraft } from "@/components/check-in/draft";
import type { Today } from "@/lib/api";

/**
 * The reason to open the app this week.
 *
 * Coachway's `CheckInCard`, structurally: a card filled with the coach's brand colour,
 * everything centred, a 2xl title, a 70%-opacity line under it, and a white pill
 * button. It is the only filled surface on the screen, which is what makes it the only
 * thing being *asked* of the client — everything below it reports.
 *
 * `bg-signal` is the coach's colour (design-system.md › Theming) and `text-signal-fg` is
 * computed from its luminance, so a coach with a pale brand gets dark text rather than
 * an unreadable card.
 */
export function CheckInCard({ checkIn }: { checkIn: Today["checkIn"] }) {
  /**
   * Draft state lives in `localStorage`, which does not exist on the server — reading it
   * during render makes the first client paint disagree with the server's HTML. Starting
   * at false is the right way round: "Continue" on a check-in with nothing saved is a lie,
   * "Start" on one with a draft is merely a frame late.
   */
  const [resumable, setResumable] = useState(false);
  useEffect(() => setResumable(hasDraft(checkIn)), [checkIn]);

  if (!checkIn) return <AllClear />;

  return (
    <section className="flex flex-col items-center gap-1 rounded-surface bg-signal p-6 text-center">
      <h2 className="text-subheading font-medium text-signal-fg">
        {resumable ? "Finish your check-in" : "Time for a check-in"}
      </h2>
      <p className="mb-4 max-w-[34ch] text-body-sm font-medium text-signal-fg/70">
        {resumable
          ? "You have one in progress. It's saved where you left it."
          : "Share your progress and how the week actually went."}
      </p>
      <Button
        asChild
        variant="secondary"
        className="h-11 rounded-full border-transparent bg-white px-6 text-gray-800 hover:bg-white/90"
      >
        <Link href={`/check-in/${checkIn.id}`}>
          {resumable ? "Continue check-in" : "Start check-in"}
        </Link>
      </Button>
    </section>
  );
}

/**
 * Nothing due.
 *
 * Quiet rather than filled — there is nothing to ask for, so it reports like everything
 * else on the screen instead of shouting in the coach's colour.
 */
function AllClear() {
  return (
    <section className="flex items-center gap-3 rounded-surface border border-line bg-surface p-4">
      <CircleCheck aria-hidden="true" className="size-5 shrink-0 text-success" />
      <div className="flex min-w-0 flex-col">
        <span className="text-body font-medium">You're up to date</span>
        <span className="text-body-sm text-fg-muted">
          Nothing due. Your coach will be in touch.
        </span>
      </div>
    </section>
  );
}
