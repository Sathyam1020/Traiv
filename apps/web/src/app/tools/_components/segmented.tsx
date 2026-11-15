"use client";

import { ToggleGroup, ToggleGroupItem } from "@traiv/ui/components/toggle-group";

/**
 * The pill switch nearly every tool uses: units, sex, a result view, a tone.
 *
 * A single-choice ToggleGroup that refuses to be emptied: clicking the active pill again
 * would otherwise deselect it and leave the calculator with no unit at all.
 */
export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
  stretch = false,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
  stretch?: boolean;
}) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      aria-label={label}
      value={value}
      onValueChange={(v: string) => {
        if (v) onChange(v as T);
      }}
      className={`flex flex-wrap justify-start gap-1 rounded-control border border-line bg-sunken p-1 ${stretch ? "w-full" : "w-fit"}`}
    >
      {options.map((o) => (
        <ToggleGroupItem
          key={o.value}
          value={o.value}
          className={`h-auto cursor-pointer rounded-control border-0 px-3.5 py-2 text-body-sm first:rounded-control last:rounded-control data-[state=on]:bg-brand data-[state=on]:text-brand-fg pointer-coarse:min-h-11 ${stretch ? "flex-1" : ""}`}
        >
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
