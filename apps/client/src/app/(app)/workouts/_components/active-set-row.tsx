"use client";

import { Check } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import type { FieldName } from "@/lib/api";

export type ActiveSetValue = {
  reps: number | null;
  loadKg: number | null;
  completed: boolean;
};

type ActiveSetRowProps = {
  index: number;
  disabled?: boolean;
  fields: FieldName[];
  value: ActiveSetValue;
  placeholder: {
    reps: number | null;
    repsMax: number | null;
    weightKg: number | null;
  };
  onChange: (next: { reps: number | null; loadKg: number | null }) => void;
  onBlur: () => void;
  onToggleComplete: () => void;
};

function parseNumber(value: string): number | null {
  if (!value.trim()) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function ActiveSetRow({
  index,
  disabled = false,
  fields,
  value,
  placeholder,
  onChange,
  onBlur,
  onToggleComplete,
}: ActiveSetRowProps) {
  const showWeight = fields.includes("weight");
  const showReps = fields.includes("reps") || fields.includes("rep_range");

  const repsPlaceholder =
    fields.includes("rep_range") && placeholder.repsMax != null
      ? `${placeholder.reps ?? "—"}–${placeholder.repsMax}`
      : String(placeholder.reps ?? "—");

  const gridColumns =
    showWeight && showReps
      ? "grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,1fr)_2.75rem]"
      : showWeight || showReps
        ? "grid-cols-[2.25rem_minmax(0,1fr)_2.75rem]"
        : "grid-cols-[2.25rem_minmax(0,1fr)]";

  return (
    <div
      data-complete={value.completed}
      className={cn(
        "client-set grid w-full min-w-0 items-end gap-x-2 gap-y-1 rounded-control bg-panel px-2 py-2 sm:gap-x-3 sm:px-3",
        gridColumns,
      )}
    >
      {/* Set number */}
      <div className="flex min-w-0 flex-col items-center justify-center gap-1 self-stretch pb-2">
        <span className="text-caption text-fg-subtle">Set</span>
        <span className="text-body-sm font-semibold tabular-nums text-fg">{index + 1}</span>
      </div>

      {/* Weight */}
      {showWeight && (
        <label className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-caption text-fg-subtle">
            Weight ({placeholder.weightKg ?? "—"})
          </span>

          <input
            type="number"
            disabled={disabled}
            inputMode="decimal"
            step="any"
            value={value.loadKg ?? ""}
            onChange={(event) => {
              onChange({
                reps: value.reps,
                loadKg: parseNumber(event.target.value),
              });
            }}
            onBlur={onBlur}
            aria-label={`Set ${index + 1} weight in kilograms`}
            placeholder={String(placeholder.weightKg ?? "—")}
            className="h-11 w-full min-w-0 appearance-none rounded-control border border-line bg-surface px-1 text-center text-base font-medium tabular-nums outline-none transition-colors focus:border-fg-subtle focus:ring-1 focus:ring-fg-subtle/30 sm:px-2"
          />
        </label>
      )}

      {/* Reps */}
      {showReps && (
        <label className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-caption text-fg-subtle">Reps ({repsPlaceholder})</span>

          <input
            type="number"
            disabled={disabled}
            inputMode="numeric"
            value={value.reps ?? ""}
            onChange={(event) => {
              onChange({
                reps: parseNumber(event.target.value),
                loadKg: value.loadKg,
              });
            }}
            onBlur={onBlur}
            aria-label={`Set ${index + 1} repetitions`}
            placeholder={repsPlaceholder}
            className="h-11 w-full min-w-0 appearance-none rounded-control border border-line bg-surface px-1 text-center text-base font-medium tabular-nums outline-none transition-colors focus:border-fg-subtle focus:ring-1 focus:ring-fg-subtle/30 sm:px-2"
          />
        </label>
      )}

      {/* Complete set */}
      <button
        type="button"
        onClick={onToggleComplete}
        disabled={disabled}
        aria-label={
          value.completed ? `Mark set ${index + 1} incomplete` : `Mark set ${index + 1} complete`
        }
        aria-pressed={value.completed}
        className={cn(
          "client-set-check flex size-11 w-full shrink-0 items-center justify-center self-end rounded-control transition-colors duration-200",
          value.completed ? "bg-success text-white" : "bg-sunken text-fg-subtle hover:bg-hover",
        )}
      >
        <Check className="size-4" />
      </button>
    </div>
  );
}
