import type { ReactNode } from "react";
import { Copy, Plus } from "@traiv/ui/icons";
import type { Entry, Slot } from "@/lib/api/food";

export function MealCard({
  slot,
  entries,
  yesterday,
  busy,
  disabled,
  actions,
  children,
  onAdd,
  onCopyYesterday,
}: {
  slot: Slot;
  entries: Entry[];
  yesterday: Entry[];
  busy: boolean;
  disabled: boolean;
  actions?: ReactNode;
  children?: ReactNode;
  onAdd: () => void;
  onCopyYesterday: () => void;
}) {
  const calories = entries.reduce((sum, entry) => sum + entry.kcal, 0);
  const yesterdayCalories = yesterday.reduce((sum, entry) => sum + entry.kcal, 0);
  return (
    <section
      aria-label={slot}
      className="overflow-hidden rounded-3xl border border-line bg-surface"
    >
      <header className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div className="min-w-0">
          <h3 className="text-body-sm font-semibold uppercase">{slot}</h3>
          {entries.length ? (
            <div className="mt-1 flex gap-3 text-caption tabular-nums">
              {(
                [
                  { key: "proteinG", color: "bg-macro-protein" },
                  { key: "carbsG", color: "bg-macro-carbs" },
                  { key: "fatG", color: "bg-macro-fat" },
                ] as const
              ).map((m) => (
                <span key={m.key} className="flex items-center gap-1">
                  <span aria-hidden className={`size-2 rounded-full ${m.color}`} />
                  {Math.round(entries.reduce((sum, entry) => sum + entry[m.key], 0) * 10) / 10}g
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-0.5 text-caption text-fg-muted">Nothing logged yet</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <p className="flex items-baseline gap-1 tabular-nums">
            <span className="text-subheading font-semibold">{calories.toLocaleString()}</span>
            <span className="text-caption text-fg-muted">kcal</span>
          </p>
        </div>
      </header>
      {entries.length ? (
        <div className="divide-y divide-line border-t border-line px-4">{children}</div>
      ) : null}
      {!entries.length && yesterday.length > 0 ? (
        <button
          type="button"
          disabled={busy || disabled}
          onClick={onCopyYesterday}
          className="flex w-full items-center gap-3 border-t border-line px-4 py-3 text-left transition-colors hover:bg-hover disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-line-focus"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-sunken text-signal-text">
            <Copy className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-body-sm font-semibold">Add from yesterday</span>
            <span className="mt-0.5 block text-caption text-fg-muted">
              {yesterday.length} {yesterday.length === 1 ? "item" : "items"} ·{" "}
              {yesterdayCalories.toLocaleString()} kcal
            </span>
          </span>
          <Plus className="size-5 shrink-0 text-signal-text" />
        </button>
      ) : null}
      <div className="relative flex items-center border-t border-line/50 bg-sunken/50">
        <button
          type="button"
          disabled={disabled}
          onClick={onAdd}
          className="flex min-w-0 flex-1 items-center justify-center gap-2 px-10 py-4 text-body-sm font-semibold text-signal-text transition-colors hover:bg-hover disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-line-focus"
        >
          <Plus className="size-5" />
          Add item to {slot}
        </button>
        {entries.length ? <div className="absolute right-2 text-signal-text">{actions}</div> : null}
      </div>
    </section>
  );
}
