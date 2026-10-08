"use client";

/**
 * Small options in a row — days a week, minutes a session, meals a day.
 *
 * A full-width card each would turn one question into a page of scrolling for answers
 * that are a single digit. Cards stay for the choices that carry meaning and need
 * explaining; numbers get chips.
 */
export function Chips<T extends string | number>({
  options,
  value,
  onChange,
  label,
  hint,
}: {
  options: readonly { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
  label: string;
  hint?: string;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-caption font-medium text-fg-muted">{label}</legend>
      {hint ? <p className="mb-1 text-caption text-fg-subtle">{hint}</p> : null}
      <div className="mt-1 flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(o.value)}
              className={`cursor-pointer rounded-control border px-3.5 py-2 text-body-sm tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus ${
                selected
                  ? "border-brand bg-brand-subtle font-medium text-fg"
                  : "border-line-strong bg-surface text-fg-muted hover:bg-hover"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
