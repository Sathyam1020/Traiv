"use client";

import { Button } from "@traiv/ui/components/button";
import { Calendar } from "@traiv/ui/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@traiv/ui/components/popover";
import { Unlimited, X } from "@traiv/ui/icons";
import { useState } from "react";
import { useUpdateClient } from "@/lib/query";

/**
 * When the coaching started, and when it finishes.
 *
 * The start is the day they joined and is not editable — it is a fact about what
 * happened, and a coach who could edit it could make their own retention numbers say
 * anything. The end is a decision, so it is.
 *
 * Open-ended is the default and is shown as ∞ rather than as an empty cell: a blank
 * reads as "not filled in yet", and most coaching genuinely has no end date. The ∞ says
 * the question was asked and the answer is "it runs until somebody stops it".
 */
export function DurationCell({
  studioId,
  client,
}: {
  studioId: string | null;
  client: { id: string; startedAt: string; endsAt: string | null };
}) {
  const [open, setOpen] = useState(false);
  const update = useUpdateClient(studioId);

  const ends = client.endsAt ? new Date(client.endsAt) : undefined;

  function set(date: Date | undefined) {
    update.mutate({ clientId: client.id, endsAt: date ? date.toISOString() : null });
    setOpen(false);
  }

  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap tabular-nums">
      <span className="text-fg-muted">{shortDate(new Date(client.startedAt))}</span>
      <span aria-hidden="true" className="text-fg-subtle">
        –
      </span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={update.isPending}
            aria-label={
              ends
                ? `Coaching ends ${shortDate(ends)}. Change the end date`
                : "Coaching is open-ended. Set an end date"
            }
            className="-mx-1.5 flex cursor-pointer items-center gap-1 rounded-control px-1.5 py-1 transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus disabled:opacity-60"
          >
            {ends ? (
              <span>{shortDate(ends)}</span>
            ) : (
              <Unlimited className="size-4 text-fg-subtle" />
            )}
          </button>
        </PopoverTrigger>

        {/* `w-auto` and nothing else: the calendar is 15.5rem wide and sets that width
            itself. A header with a sentence in it was what made this popover stretch
            across half the table — the prose had no width to wrap against, so the
            calendar grew to fit the paragraph instead of the other way round. */}
        <PopoverContent align="end" className="w-auto overflow-hidden p-0">
          <Calendar
            mode="single"
            selected={ends}
            defaultMonth={ends ?? new Date()}
            onSelect={set}
            // Coaching cannot end before it started.
            disabled={{ before: new Date(client.startedAt) }}
            autoFocus
            // 32px cells are a mouse target. A finger needs 44, and the popover has
            // room for it — seven of them is 308px inside a 390px screen.
            className="p-3 pointer-coarse:[--cell-size:--spacing(11)]"
          />

          <div className="border-line border-t p-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start whitespace-nowrap"
              onClick={() => set(undefined)}
            >
              {ends ? <X className="size-4" /> : <Unlimited className="size-4" />}
              {ends ? "Clear the end date" : "Keep it open-ended"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </span>
  );
}

/** "14 May", and the year too once it is not this one. */
export function shortDate(date: Date): string {
  const thisYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(thisYear ? {} : { year: "numeric" }),
  });
}
