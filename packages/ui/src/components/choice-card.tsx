"use client";

import { cn } from "@traiv/ui/lib/cn";
import { Check } from "lucide-react";
import type * as React from "react";

/**
 * One option in a question.
 *
 * Big enough to hit with a thumb on a 360px screen without aiming — these are answered
 * standing up, one-handed, often on the way somewhere.
 *
 * Single-select advances on tap and needs no confirm button; multi-select toggles and
 * shows a tick, because without one the only difference between chosen and not is a
 * border, and a border is not enough on a cheap screen in daylight.
 */
export function ChoiceCard({
  label,
  hint,
  selected,
  multi = false,
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & {
  label: string;
  hint?: string;
  selected: boolean;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-surface border px-4 py-3.5 text-left transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus",
        selected
          ? "border-brand bg-brand-subtle text-fg"
          : "border-line-strong bg-surface text-fg hover:bg-hover",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-sm font-medium">{label}</span>
        {hint ? <span className="text-caption text-fg-muted">{hint}</span> : null}
      </span>

      {multi ? (
        <span
          aria-hidden="true"
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-control border",
            selected ? "border-brand bg-brand text-brand-fg" : "border-line-strong",
          )}
        >
          {selected ? <Check className="size-3.5" /> : null}
        </span>
      ) : null}
    </button>
  );
}
