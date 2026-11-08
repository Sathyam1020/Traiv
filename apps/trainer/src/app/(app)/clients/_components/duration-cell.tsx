"use client";

import { Button } from "@traiv/ui/components/button";
import { Calendar } from "@traiv/ui/components/calendar";
import {
  PreviewCard,
  PreviewCardContent,
  PreviewCardTrigger,
} from "@traiv/ui/components/preview-card";
import { Unlimited } from "@traiv/ui/icons";
import { useEffect, useState } from "react";
import { useUpdateClient } from "@/lib/query";

/**
 * When the coaching started, and when it finishes — both editable.
 *
 * The end date always was. The start date now is too: a coach onboarding a gym's
 * existing roster is recording people who started months or years ago, and a client
 * that always shows "started today" for someone who has trained there for a year is
 * simply wrong. `client.startedAt` is its own column, separate from `createdAt` — the
 * untouched fact of when the row was actually added — so editing this can't retroactively
 * rewrite that audit trail, only correct what's shown.
 *
 * Opens on hover rather than on click, over either date — a `PreviewCard`, not a
 * `Popover`, because unlike a tooltip it has to survive the pointer moving from the
 * trigger text into the calendars themselves.
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

  const [start, setStart] = useState(() => new Date(client.startedAt));
  const [end, setEnd] = useState<Date | undefined>(
    client.endsAt ? new Date(client.endsAt) : undefined,
  );

  // Re-sync the draft from the server's own values every time the card opens — otherwise
  // an edit that was cancelled, or a change made elsewhere, would not be reflected the
  // next time a coach opens this.
  useEffect(() => {
    if (!open) return;
    setStart(new Date(client.startedAt));
    setEnd(client.endsAt ? new Date(client.endsAt) : undefined);
  }, [open, client.startedAt, client.endsAt]);

  const dirty =
    start.getTime() !== new Date(client.startedAt).getTime() ||
    (end?.getTime() ?? null) !== (client.endsAt ? new Date(client.endsAt).getTime() : null);

  function save() {
    update.mutate({
      clientId: client.id,
      startedAt: start.toISOString(),
      endsAt: end ? end.toISOString() : null,
    });
    setOpen(false);
  }

  return (
    <PreviewCard open={open} onOpenChange={setOpen}>
      {/* Base UI's own default is 600ms before the card even starts opening — too slow
          for something this close to a tooltip. */}
      <PreviewCardTrigger asChild delay={80} closeDelay={150}>
        {/* A `<button>`, not a `<span>` — the row it sits in navigates on any click that
            doesn't land on a button/link/input, and this is a hover trigger, not a
            navigation target. */}
        <button
          type="button"
          aria-label={`Coaching runs ${shortDate(new Date(client.startedAt))} to ${
            client.endsAt ? shortDate(new Date(client.endsAt)) : "open-ended"
          }. Edit the dates`}
          className="flex cursor-pointer items-center gap-1 whitespace-nowrap bg-transparent tabular-nums"
        >
          <span className="-mx-1 rounded-control px-1 py-0.5 text-fg-muted transition-colors hover:bg-hover">
            {shortDate(new Date(client.startedAt))}
          </span>
          <span aria-hidden="true" className="text-fg-subtle">
            –
          </span>
          <span className="-mx-1 rounded-control px-1 py-0.5 transition-colors hover:bg-hover">
            {client.endsAt ? (
              shortDate(new Date(client.endsAt))
            ) : (
              <Unlimited className="size-4 text-fg-subtle" />
            )}
          </span>
        </button>
      </PreviewCardTrigger>

      <PreviewCardContent align="start" className="w-auto overflow-hidden p-0">
        <div className="flex items-center justify-between gap-6 border-line border-b px-4 py-3">
          <strong className="text-sm font-semibold">Edit Duration</strong>
          <span className="whitespace-nowrap text-caption text-fg-subtle">
            {longDate(start)} – {end ? longDate(end) : "No end date"}
          </span>
        </div>

        <div className="flex divide-x divide-line">
          <div className="p-3">
            <DateColumnLabel label="Start Date">{longDate(start)}</DateColumnLabel>
            <Calendar
              mode="single"
              selected={start}
              defaultMonth={start}
              onSelect={(date) => date && setStart(date)}
              disabled={end ? { after: end } : undefined}
            />
          </div>
          <div className="p-3">
            <DateColumnLabel label="End Date">
              {end ? (
                longDate(end)
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Unlimited className="size-3.5" />
                  No end date
                </span>
              )}
            </DateColumnLabel>
            <Calendar
              mode="single"
              selected={end}
              defaultMonth={end ?? start}
              onSelect={setEnd}
              disabled={{ before: start }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-line border-t px-3 py-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" disabled={!dirty || update.isPending} onClick={save}>
            {update.isPending ? "Saving…" : "Update"}
          </Button>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  );
}

function DateColumnLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="mb-2 flex items-center justify-between gap-4 px-1 text-caption">
      <span className="font-medium text-fg-muted">{label}</span>
      <span className="font-semibold">{children}</span>
    </p>
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

/** "Nov 7, 2026" — the editor's own header always carries the year, since the two dates
 * being compared there can span different years. */
function longDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
