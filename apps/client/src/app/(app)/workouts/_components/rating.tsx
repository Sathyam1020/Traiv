"use client";

import { BarChart, Star } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";

const QUALITY = ["Bad", "OK", "Good", "Great", "Perfect"];
const INTENSITY = ["Very low", "Low", "Medium", "High", "Very high"];

/** "How was the workout?" — five stars, Bad through Perfect. */
export function QualityRating({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {QUALITY.map((label, i) => {
        const n = i + 1;
        const active = value === n;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={active}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-control border py-3 text-caption transition-colors",
              active
                ? "border-signal bg-signal-subtle text-signal-text"
                : "border-line text-fg-muted hover:bg-hover",
            )}
          >
            <Star className={cn("size-5", active && "fill-current")} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/** "How was the intensity?" — five bars, Very low through Very high. */
export function IntensityRating({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {INTENSITY.map((label, i) => {
        const n = i + 1;
        const active = value === n;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={active}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-control border py-3 text-caption transition-colors",
              active
                ? "border-signal bg-signal-subtle text-signal-text"
                : "border-line text-fg-muted hover:bg-hover",
            )}
          >
            <BarChart className="size-5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
