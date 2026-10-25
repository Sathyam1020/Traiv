"use client";

import { Skeleton } from "@traiv/ui/components/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@traiv/ui/components/tooltip";
import { Check, Clock, type Icon, X } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import type { CheckInCell, CheckInState, CheckInTrend as Trend } from "@/lib/api";

/**
 * How each of the four states looks and what it is called.
 *
 * One table rather than four branches, so a cell, its legend key and its tooltip can
 * never disagree about what a colour means.
 */
const STATES: Record<
  CheckInState,
  { label: string; icon: Icon; cell: string; dot: string; mark: string }
> = {
  completed: {
    label: "Completed",
    icon: Check,
    cell: "bg-success-subtle border-success/25",
    dot: "bg-success",
    mark: "text-success",
  },
  missed: {
    label: "Missed",
    icon: X,
    cell: "bg-danger-subtle border-danger/25",
    dot: "bg-danger",
    mark: "text-danger",
  },
  overdue: {
    label: "Overdue",
    icon: Clock,
    cell: "bg-warning-subtle border-warning/30",
    dot: "bg-warning",
    mark: "text-warning",
  },
  upcoming: {
    label: "Upcoming",
    icon: Clock,
    cell: "bg-sunken border-transparent",
    dot: "bg-fg-subtle/30",
    mark: "text-fg-subtle/50",
  },
};

const ORDER: CheckInState[] = ["completed", "missed", "overdue", "upcoming"];
const CELLS = 15;

const longDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

/**
 * The last fifteen check-ins — cells, not days.
 *
 * Fifteen days of a weekly cadence is three cells and a dozen blanks. Counting
 * check-ins instead means the grid is always full and always says something: recent
 * history on the left, the next few coming on the right.
 */
export function CheckInTrend({ trend }: { trend: Trend }) {
  // Already the right count and order from the API; the slice is belt and braces.
  const cells = trend.checkIns.slice(-CELLS);

  return (
    <section className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-4 sm:p-5">
      <span className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-semibold text-subheading">Check-in trend</span>
        <span className="text-body-sm text-fg-muted">
          {cells.length === 0 ? "Nothing scheduled" : `Last ${cells.length} check-ins`}
        </span>
      </span>

      <TooltipProvider delayDuration={100}>
        <span className="grid grid-cols-5 gap-2">
          {cells.map((c) => (
            <Cell key={c.id} cell={c} />
          ))}
        </span>
      </TooltipProvider>

      <span className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-caption text-fg-muted">
        {ORDER.map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={cn("size-2 rounded-full", STATES[s].dot)} />
            {STATES[s].label}
          </span>
        ))}
      </span>

      <span className="flex border-line border-t pt-3">
        <Tally
          label="Completion rate"
          value={trend.completionRate === null ? "—" : `${trend.completionRate}%`}
          foot={
            trend.completionRate === null
              ? "Nothing due yet"
              : `${trend.completed} of ${trend.completed + trend.missed}`
          }
        />
        <Tally
          label="Current streak"
          value={String(trend.currentStreak)}
          foot={trend.currentStreak === 1 ? "check-in" : "check-ins"}
        />
      </span>
    </section>
  );
}

/** One day. The tooltip carries the state and the date, as the reference does. */
function Cell({ cell }: { cell: CheckInCell }) {
  const s = STATES[cell.state];
  const Glyph = s.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "flex aspect-[4/3] cursor-default items-center justify-center rounded-control border transition-colors",
            s.cell,
            s.mark,
          )}
        >
          <Glyph className="size-4" aria-hidden="true" />
          <span className="sr-only">
            {s.label} — {longDate(cell.date)}
          </span>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-center">
        <span className="block font-medium">{s.label}</span>
        <span className="block text-fg-muted">{longDate(cell.date)}</span>
        {/* Only an overdue cell has a deadline worth stating — the others are settled. */}
        {cell.state === "overdue" ? (
          <span className="block text-fg-muted">Closes {longDate(cell.closesOn)}</span>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}

function Tally({ label, value, foot }: { label: string; value: string; foot: string }) {
  return (
    <span className="flex flex-1 flex-col items-center gap-0.5">
      <span className="text-body-sm text-fg-muted">{label}</span>
      <span className="font-semibold text-heading tabular-nums">{value}</span>
      <span className="text-caption text-fg-subtle">{foot}</span>
    </span>
  );
}

export function CheckInTrendSkeleton() {
  return (
    <section className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-4 sm:p-5">
      <Skeleton className="h-6 w-40" />
      <span className="grid grid-cols-5 gap-2">
        {Array.from({ length: CELLS }, (_, i) => (
          <Skeleton key={i} className="aspect-[4/3] rounded-control" />
        ))}
      </span>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-12 w-full" />
    </section>
  );
}
