"use client";

import { cn } from "@traiv/ui/lib/cn";

/** A compact Yes/No pair — `ChoiceCard` is built for a question with its own screen;
 * this is for one line among several, like the eating-habits step's five questions. */
export function YesNo({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {([true, false] as const).map((option) => (
        <button
          key={String(option)}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "cursor-pointer rounded-control border px-4 py-2.5 text-body-sm font-medium transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus",
            value === option
              ? "border-brand bg-brand-subtle text-fg"
              : "border-line-strong bg-surface text-fg hover:bg-hover",
          )}
        >
          {option ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );
}
