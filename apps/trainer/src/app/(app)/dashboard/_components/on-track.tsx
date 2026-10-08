import { Avatar } from "@traiv/ui/components/avatar";
import { ChevronRight } from "lucide-react";
import { WeekStrip } from "@/components/common/week-strip";
import type { RosterEntry } from "../_lib/roster";
import { press, Section } from "./section";

/** Deliberately denser than the sections above — this is scanned, not read. */
export function OnTrack({ roster, total }: { roster: RosterEntry[]; total: number }) {
  return (
    <Section label="On track" count={`${total} clients`}>
      <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-surface border border-line bg-surface">
        {roster.map((r) => (
          <li key={r.id}>
            <div className={`flex items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-4 ${press}`}>
              <Avatar name={r.name} size={28} />
              <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:gap-3">
                <span className="truncate text-body-sm font-medium sm:w-44 sm:shrink-0">
                  {r.name}
                </span>
                <span className="truncate text-caption text-fg-subtle">{r.plan}</span>
              </div>
              <span className="hidden text-caption text-fg-muted md:block">{r.lastSession}</span>
              <WeekStrip week={r.week} />
              <span
                className={`w-9 text-right text-body-sm font-medium tabular-nums ${
                  r.adherence >= 85 ? "text-fg-muted" : "text-warning"
                }`}
              >
                {r.adherence}
              </span>
              <ChevronRight className="size-4 shrink-0 text-fg-subtle" />
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`mt-2 w-full rounded-control px-3 py-2.5 text-body-sm font-medium text-fg-muted ${press}`}
      >
        Show all {total}
      </button>
    </Section>
  );
}
