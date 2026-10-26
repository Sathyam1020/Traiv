"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@traiv/ui/components/popover";
import { ChevronDown, X } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";

/**
 * One filter chip — "Muscle Group", "Equipment", "Type" — exactly as the real Exercises
 * page shows them: a pill that opens a short list, filled once a value is picked.
 *
 * The clear control is a sibling button, not nested inside the popover trigger's own
 * button — a button inside a button is invalid HTML and the reason an earlier version of
 * this used a fake `role="button"` span instead of fixing the actual structure.
 */
export function FilterPill({
  label,
  value,
  options,
  onChange,
  format,
}: {
  label: string;
  value: string | undefined;
  options: string[];
  onChange: (value: string | undefined) => void;
  format?: (value: string) => string;
}) {
  const show = (v: string) => (format ? format(v) : v);

  return (
    <span
      className={cn(
        "flex items-center overflow-hidden rounded-full border text-caption font-medium",
        value
          ? "border-transparent bg-brand text-brand-fg"
          : "border-line bg-surface text-fg-muted",
      )}
    >
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex cursor-pointer items-center gap-1.5 py-1.5 pl-3 transition-colors",
              value ? "pr-1.5" : "pr-3 hover:bg-hover",
            )}
          >
            {value ? show(value) : label}
            {value ? null : <ChevronDown className="size-3" />}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-1">
          {options.length === 0 ? (
            <p className="px-2 py-3 text-center text-caption text-fg-subtle">
              Nothing to filter yet.
            </p>
          ) : (
            <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
              {options.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => onChange(o === value ? undefined : o)}
                  className={cn(
                    "cursor-pointer rounded-control px-2.5 py-1.5 text-left text-body-sm transition-colors hover:bg-hover",
                    o === value && "bg-signal-subtle text-signal-text",
                  )}
                >
                  {show(o)}
                </button>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>

      {value ? (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          aria-label={`Clear ${label} filter`}
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center pr-2.5"
        >
          <X className="size-3" />
        </button>
      ) : null}
    </span>
  );
}
