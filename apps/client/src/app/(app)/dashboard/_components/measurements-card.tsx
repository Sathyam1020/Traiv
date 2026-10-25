"use client";

import { Ruler } from "@traiv/ui/icons";
import type { Today } from "@/lib/api";
import { relativeDay } from "@/lib/dates";

/**
 * The latest of each body measurement.
 *
 * One value per site, newest wins — the server reads it with a `DISTINCT ON` over the
 * check-in history, so this is "where you are", not a series. The series belongs on the
 * measurement's own screen; a home screen that charts eight sites charts nothing.
 *
 * Empty for most clients, and that is correct rather than broken: measurements arrive
 * through check-ins, so this fills in the first week their coach asks for one.
 */
export function MeasurementsCard({ measurements }: { measurements: Today["measurements"] }) {
  if (measurements.length === 0) return null;

  // Every site in one check-in shares a date, so stating it once per card beats once per
  // row — and when they do differ, the newest is the one worth naming.
  const latest = measurements.reduce<string | null>(
    (newest, m) => (m.takenOn && (!newest || m.takenOn > newest) ? m.takenOn : newest),
    null,
  );

  return (
    <section className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-4 sm:p-5">
      <header className="flex items-baseline justify-between gap-3">
        <span className="flex items-center gap-2 text-caption font-medium uppercase tracking-[0.08em] text-fg-subtle">
          <Ruler aria-hidden="true" className="size-3.5" />
          Measurements
        </span>
        {latest ? <span className="text-caption text-fg-subtle">{relativeDay(latest)}</span> : null}
      </header>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
        {measurements.map((m) => (
          <div key={m.code} className="flex flex-col gap-0.5">
            <dt className="truncate text-caption text-fg-muted">{m.name}</dt>
            <dd className="flex items-baseline gap-1">
              <span className="text-subheading font-medium tabular-nums">{m.value}</span>
              {m.unit ? <span className="text-caption text-fg-subtle">{m.unit}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
