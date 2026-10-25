"use client";

import { Button } from "@traiv/ui/components/button";
import { TrendingDown, TrendingUp, Weight } from "@traiv/ui/icons";
import type { Today } from "@/lib/api";
import { shortDate } from "@/lib/dates";

/**
 * Weight over the last dozen weigh-ins.
 *
 * Hand-rolled SVG rather than a charting library: the catalog has none, one sparkline
 * does not justify adding one, and `dependencies.md` requires a written justification
 * for a dependency that a 40-line polyline makes impossible to write honestly.
 *
 * The delta is against the **previous weigh-in**, not the first. Somebody standing on a
 * scale is asking "since last time", and a total-since-January figure answers a question
 * they did not ask — it also makes a good week look like nothing.
 */
export function WeightCard({ weight, onLog }: { weight: Today["weight"]; onLog: () => void }) {
  const { series, latest, delta } = weight;

  return (
    <section className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-4 sm:p-5">
      <header className="flex items-start justify-between gap-3">
        <span className="flex items-center gap-2 text-caption font-medium uppercase tracking-[0.08em] text-fg-subtle">
          <Weight aria-hidden="true" className="size-3.5" />
          Weight
        </span>
        {series.length > 0 ? (
          <button
            type="button"
            onClick={onLog}
            className="cursor-pointer text-caption text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
          >
            Log
          </button>
        ) : null}
      </header>

      {latest === null ? (
        <Empty onLog={onLog} />
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-display font-medium tabular-nums">{latest}</span>
            <span className="text-body-sm text-fg-muted">kg</span>
            {delta === null ? null : <Delta delta={delta} />}
          </div>
          {series.length >= 2 ? <Spark series={series} /> : null}
        </>
      )}
    </section>
  );
}

/**
 * Up is not bad and down is not good — the arrow states the direction and nothing more.
 *
 * A client building muscle and a client losing fat read the same number in opposite
 * directions, and the app does not know which they are, so colouring it green or red
 * would be the app guessing at somebody's goal and congratulating them wrongly.
 */
function Delta({ delta }: { delta: number }) {
  const up = delta > 0;
  const flat = delta === 0;
  const Icon = up ? TrendingUp : TrendingDown;

  return (
    <span className="flex items-center gap-1 text-body-sm text-fg-muted tabular-nums">
      {flat ? null : <Icon aria-hidden="true" className="size-3.5" />}
      {flat ? "no change" : `${up ? "+" : ""}${delta} kg`}
      <span className="text-fg-subtle">since last</span>
    </span>
  );
}

/** Padding inside the viewBox, so the stroke and the end dot are never clipped. */
const PAD = 4;
const W = 300;
const H = 64;

function Spark({ series }: { series: { date: string; kg: number }[] }) {
  const values = series.map((p) => p.kg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  // A flat series would divide by zero and, worse, draw a line along the floor. One
  // kilo of range centres it instead.
  const span = max - min || 1;

  const x = (i: number) => PAD + (i * (W - PAD * 2)) / Math.max(series.length - 1, 1);
  const y = (kg: number) => H - PAD - ((kg - min) / span) * (H - PAD * 2);

  const line = series.map((p, i) => `${x(i)},${y(p.kg)}`).join(" ");
  const area = `${PAD},${H} ${line} ${W - PAD},${H}`;
  const lastIndex = series.length - 1;
  const lastPoint = series[lastIndex];

  return (
    <div className="flex flex-col gap-1.5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-16 w-full text-brand"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Weight from ${values[0]} to ${values[lastIndex]} kilograms`}
      >
        <polygon points={area} fill="currentColor" fillOpacity={0.12} stroke="none" />
        <polyline
          points={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          // The viewBox is stretched to the container, which would stretch the stroke
          // with it. This keeps the line the same weight at every width.
          vectorEffect="non-scaling-stroke"
        />
        {lastPoint ? (
          <circle cx={x(lastIndex)} cy={y(lastPoint.kg)} r={3} fill="currentColor" stroke="none" />
        ) : null}
      </svg>
      <div className="flex justify-between text-caption text-fg-subtle tabular-nums">
        <span>{series[0] ? shortDate(series[0].date) : ""}</span>
        <span>{lastPoint ? shortDate(lastPoint.date) : ""}</span>
      </div>
    </div>
  );
}

function Empty({ onLog }: { onLog: () => void }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-body-sm leading-relaxed text-fg-muted">
        Nothing weighed in yet. One number now is what every later one is read against.
      </p>
      <Button variant="secondary" className="h-10" onClick={onLog}>
        Log your weight
      </Button>
    </div>
  );
}
