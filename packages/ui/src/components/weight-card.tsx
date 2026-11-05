"use client";

// Coachway uses ArrowUp01/ArrowDown01 here; those are ChevronUp/ChevronDown in our set.
import { ArrowRight, ChevronDown, ChevronUp, Plus, Weight } from "@traiv/ui/icons";
export type WeightProgressData = {
  series: { date: string; kg: number }[];
  latest: number | null;
  delta: number | null;
  start: number | null;
  goal: number | null;
};
const shortDate = (day: string) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

/**
 * Weight, as Coachway's `WeightProgressChart` lays it out.
 *
 * Label and an add button on one row, the number large underneath, the change as a
 * pill in the coach's colour, the trend as a sparkline, and a Start-to-Goal bar under a
 * rule. The bar is the part that turns a number into progress — a weight on its own
 * says nothing about whether this is working.
 *
 * Hand-rolled SVG rather than a charting library: the catalog has none and one
 * sparkline cannot honestly justify the written case `dependencies.md` requires.
 */
export function WeightCard({ weight, onLog }: { weight: WeightProgressData; onLog: () => void }) {
  const { series, latest, delta, start, goal } = weight;

  return (
    <section className="flex w-full flex-col gap-4 rounded-surface border border-line bg-surface p-4">
      <header className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-body-sm font-medium text-fg-muted">
          <Weight aria-hidden="true" className="size-4" />
          Weight
        </span>
        <button
          type="button"
          onClick={onLog}
          aria-label="Log your weight"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-signal text-signal-fg transition-transform active:scale-95"
        >
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </header>

      {latest === null ? (
        <p className="text-body-sm text-fg-muted">Awaiting first weigh-in.</p>
      ) : (
        <>
          <div className="flex items-end gap-4">
            <div className="flex min-w-0 flex-col">
              <span className="flex items-baseline gap-1">
                <span className="text-lead font-medium tabular-nums">{latest}</span>
                <span className="text-body-sm text-fg-muted">kg</span>
              </span>
              <Change delta={delta} />
            </div>
            {series.length >= 2 ? <Spark series={series} /> : null}
          </div>

          {start !== null && goal !== null && start !== goal ? (
            <Progress latest={latest} start={start} goal={goal} />
          ) : null}
        </>
      )}
    </section>
  );
}

/**
 * The change since the last weigh-in, as a pill.
 *
 * No red and no green. A client building muscle and a client losing fat read the same
 * number in opposite directions, and the app does not know which this one is — colouring
 * it would be the app guessing at somebody's goal and congratulating them wrongly. The
 * arrow states direction; the coach's colour says "this is your number", not "good".
 */
function Change({ delta }: { delta: number | null }) {
  if (delta === null) {
    return <span className="mt-2 text-caption font-medium text-fg-muted">No change yet</span>;
  }

  const Icon = delta > 0 ? ChevronUp : delta < 0 ? ChevronDown : ArrowRight;

  return (
    <span className="mt-2 flex w-fit items-center gap-1 rounded-full bg-signal-subtle px-2 py-1">
      <Icon aria-hidden="true" className="size-3 text-signal-text" />
      <span className="text-caption font-semibold text-signal-text tabular-nums">
        {delta === 0 ? "No change" : `${Math.abs(delta)} kg`}
      </span>
    </span>
  );
}

/** Start on the left, goal on the right, and how far along between them. */
function Progress({ latest, start, goal }: { latest: number; start: number; goal: number }) {
  // Clamped: overshooting a goal is a success, not a bar that runs off the end.
  const done = Math.min(Math.max((latest - start) / (goal - start), 0), 1);
  const pct = Math.round(done * 100);

  return (
    <div className="flex flex-col gap-2 border-line border-t pt-3">
      <div className="flex items-center justify-between gap-3">
        <span className="flex flex-col">
          <span className="text-caption text-fg-subtle">Start</span>
          <span className="text-body-sm font-semibold tabular-nums">{start} kg</span>
        </span>
        <span className="flex flex-col items-end">
          <span className="text-caption text-fg-subtle">Goal</span>
          <span className="text-body-sm font-semibold text-signal-text tabular-nums">
            {goal} kg
          </span>
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-sunken"
        role="progressbar"
        aria-label="Progress towards your goal weight"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-signal transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Padding inside the viewBox, so the stroke and the end dot are never clipped. */
const PAD = 4;
const W = 140;
const H = 48;

function Spark({ series }: { series: { date: string; kg: number }[] }) {
  const values = series.map((p) => p.kg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  // A flat series would divide by zero and draw a line along the floor; one kilo of
  // range centres it instead.
  const span = max - min || 1;

  const x = (i: number) => PAD + (i * (W - PAD * 2)) / Math.max(series.length - 1, 1);
  const y = (kg: number) => H - PAD - ((kg - min) / span) * (H - PAD * 2);

  const line = series.map((p, i) => `${x(i)},${y(p.kg)}`).join(" ");
  const lastIndex = series.length - 1;
  const lastPoint = series[lastIndex];
  const firstPoint = series[0];

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-12 w-full text-signal"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Weight from ${values[0]} to ${values[lastIndex]} kilograms`}
      >
        <polygon
          points={`${PAD},${H} ${line} ${W - PAD},${H}`}
          fill="currentColor"
          fillOpacity={0.12}
          stroke="none"
        />
        <polyline
          points={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          // The viewBox stretches to the container, which would stretch the stroke with
          // it. This keeps the line one weight at every width.
          vectorEffect="non-scaling-stroke"
        />
        {lastPoint ? (
          <circle cx={x(lastIndex)} cy={y(lastPoint.kg)} r={3} fill="currentColor" stroke="none" />
        ) : null}
      </svg>
      <span className="flex justify-between text-caption text-fg-subtle tabular-nums">
        <span>{firstPoint ? shortDate(firstPoint.date) : ""}</span>
        <span>{lastPoint ? shortDate(lastPoint.date) : ""}</span>
      </span>
    </div>
  );
}
