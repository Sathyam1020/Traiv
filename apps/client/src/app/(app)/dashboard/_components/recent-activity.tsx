"use client";

import { Activity } from "@traiv/ui/icons";
import type { Today } from "@/lib/api";
import { relativeDay } from "@/lib/dates";

/**
 * The last few completed sessions.
 *
 * Coachway's `RecentActivitySection` also carries steps and platform-synced workouts
 * from Health Connect. That cannot be ported — the web has no equivalent — so this is
 * logged training only, which is the half that was ever ours to record.
 */
export function RecentActivity({ sessions }: { sessions: Today["recentSessions"] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-caption font-semibold uppercase tracking-[0.08em] text-fg-subtle">
        Recent activity
      </h2>

      {sessions.length === 0 ? (
        <div className="flex items-start gap-3 rounded-surface border border-line border-dashed bg-surface p-4">
          <Activity aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
          <p className="text-body-sm leading-relaxed text-fg-muted">
            Nothing logged yet. Workouts you finish will show up here.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-3 rounded-surface border border-line bg-surface px-4 py-3"
            >
              <Activity aria-hidden="true" className="size-4 shrink-0 text-fg-subtle" />
              <span className="min-w-0 flex-1 truncate text-body-sm font-medium">Workout</span>
              <span className="shrink-0 text-caption text-fg-subtle tabular-nums">
                {relativeDay(s.date)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
