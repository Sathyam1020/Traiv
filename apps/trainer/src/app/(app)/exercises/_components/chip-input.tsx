"use client";

import { Input } from "@traiv/ui/components/input";
import { X } from "@traiv/ui/icons";
import { useId, useState } from "react";

/**
 * One tag field — "Primary Focus", "Equipment", "Stimulus" — exactly as the real editor
 * shows them: free text, Enter to add, a chip with an × to remove. These are strings a
 * coach types, not a closed vocabulary the UI enforces — the exercise library has no
 * fixed muscle list, which is why the real editor does it this way too.
 */
export function ChipInput({
  label,
  values,
  onChange,
  single,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  /** Primary/Secondary/Tertiary Focus are single-value fields shown as one chip, not a list. */
  single?: boolean;
  placeholder?: string;
}) {
  const [typed, setTyped] = useState("");

  function commit() {
    const v = typed.trim();
    if (!v) return;
    onChange(single ? [v] : [...values, v]);
    setTyped("");
  }

  const id = useId();

  // `<label htmlFor>` rather than wrapping: with `single`, once a value is chosen the
  // field becomes a chip with no input underneath, and a label wrapping no control is
  // a label associated with nothing.
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-caption text-fg-subtle">
        {label} <span className="text-fg-subtle/70">(optional)</span>
      </label>

      {values.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <span
              key={`${v}-${i}`}
              className="flex items-center gap-1 rounded-full bg-sunken px-2.5 py-1 text-caption"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((_, xi) => xi !== i))}
                aria-label={`Remove ${v}`}
                className="cursor-pointer text-fg-subtle hover:text-danger"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {single && values.length > 0 ? null : (
        <Input
          id={id}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          onBlur={commit}
          placeholder={placeholder ?? "Type and press Enter"}
          className="h-9"
        />
      )}
    </div>
  );
}
