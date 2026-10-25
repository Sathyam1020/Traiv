"use client";

import { ChevronRight, Ruler } from "@traiv/ui/icons";
import Link from "next/link";
import type { Today } from "@/lib/api";
import { relativeDay } from "@/lib/dates";

/**
 * Body composition, as Coachway's `CircumferenceChart` lays it out: a single row —
 * tinted icon tile, label above value, chevron — rather than a card full of numbers.
 *
 * It is a row and not a grid because on Today it answers one question ("has anything
 * moved") and defers the rest. Coachway's opens a bottom sheet with the full set; ours
 * goes to the check-in that recorded them, which is the same information and a screen
 * that already exists.
 */
export function MeasurementsCard({
  measurements,
  href,
}: {
  measurements: Today["measurements"];
  /** Where the detail lives — null when nothing has been recorded to look at. */
  href: string | null;
}) {
  if (measurements.length === 0) return null;

  const [lead, ...rest] = measurements;
  if (!lead) return null;

  const latest = measurements.reduce<string | null>(
    (newest, m) => (m.takenOn && (!newest || m.takenOn > newest) ? m.takenOn : newest),
    null,
  );

  const body = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-signal-subtle">
        <Ruler aria-hidden="true" className="size-4 text-signal-text" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-body-sm font-medium text-fg-muted">Body composition</span>
        <span className="flex items-baseline gap-1.5">
          <span className="text-body font-medium tabular-nums">
            {lead.name} {lead.value}
            {lead.unit ? <span className="text-fg-subtle"> {lead.unit}</span> : null}
          </span>
          {rest.length > 0 ? (
            <span className="text-caption text-fg-subtle">+{rest.length} more</span>
          ) : null}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-2">
        {latest ? <span className="text-caption text-fg-subtle">{relativeDay(latest)}</span> : null}
        {href ? <ChevronRight aria-hidden="true" className="size-4 text-fg-subtle" /> : null}
      </span>
    </>
  );

  const className =
    "flex w-full items-center gap-3 rounded-surface border border-line bg-surface px-3.5 py-3 text-left";

  return href ? (
    <Link href={href} className={`${className} transition-colors hover:bg-hover`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
