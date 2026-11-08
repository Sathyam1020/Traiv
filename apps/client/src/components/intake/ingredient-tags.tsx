"use client";

import { useQuery } from "@tanstack/react-query";
import { Input } from "@traiv/ui/components/input";
import { X } from "@traiv/ui/icons";
import { useDeferredValue, useState } from "react";
import { searchIngredients } from "./ingredient-search";

/** Rounded border, no ring — see `personal-info-step.tsx` for why. */
const FOCUS = "focus:outline-none focus-visible:outline-none focus:border-brand";

/**
 * A real search against the shared ingredient catalog (`ingredient-search.ts`, the same
 * one the coach's recipe builder uses), not a plain type-and-press-enter box pretending
 * to be one — typing shows actual matching suggestions to tap. Enter still adds
 * whatever was typed verbatim, because a client avoiding "shellfish" as a category, or
 * an ingredient the catalog genuinely does not have, is a real answer too; the intake
 * row stores plain strings either way (see the schema comment on `excludedIngredients`).
 */
export function IngredientTags({
  studioId,
  value,
  onChange,
}: {
  studioId: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const deferred = useDeferredValue(draft);

  const results = useQuery({
    queryKey: ["ingredient-search", studioId, deferred],
    queryFn: () => searchIngredients(studioId, deferred),
    enabled: Boolean(deferred.trim()),
    staleTime: 60_000,
  });

  function addName(name: string) {
    const trimmed = name.trim();
    if (!trimmed || value.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, trimmed]);
    setDraft("");
  }

  const showSuggestions = focused && deferred.trim().length > 0;
  const suggestions = (results.data ?? []).filter(
    (s) => !value.some((v) => v.toLowerCase() === s.name.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => setFocused(true)}
          // A delay, not an immediate blur-hide — otherwise a tap on a suggestion
          // blurs the field and removes the list before the click is ever registered.
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addName(draft);
            }
          }}
          placeholder="Search ingredients (e.g., eggs, nuts, dairy…)"
          aria-label="Search for an ingredient to avoid"
          inputClassName={FOCUS}
        />

        {showSuggestions ? (
          <div className="absolute top-full right-0 left-0 z-10 mt-1.5 max-h-56 overflow-y-auto rounded-control border border-line-strong bg-surface py-1 shadow-raised">
            {results.isPending ? (
              <p className="px-3.5 py-2.5 text-caption text-fg-subtle">Searching…</p>
            ) : suggestions.length > 0 ? (
              suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  // Fires before the input's own blur-timeout, which is what lets a
                  // click register instead of being pre-empted by the list vanishing.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addName(s.name)}
                  className="block w-full cursor-pointer px-3.5 py-2.5 text-left text-body-sm transition-colors hover:bg-hover"
                >
                  {s.name}
                </button>
              ))
            ) : (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addName(draft)}
                className="block w-full cursor-pointer px-3.5 py-2.5 text-left text-body-sm text-fg-muted transition-colors hover:bg-hover"
              >
                Add "{draft.trim()}" anyway
              </button>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-caption font-medium text-fg-muted">
          Excluded ingredients ({value.length})
        </span>

        {value.length === 0 ? (
          <p className="rounded-control border border-dashed border-line-strong px-4 py-6 text-center text-caption text-fg-subtle">
            No ingredients excluded yet. Search above to add ingredients you want to avoid.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {value.map((name) => (
              <li
                key={name}
                className="flex items-center gap-1.5 rounded-full border border-line-strong bg-surface py-1.5 pr-2 pl-3 text-body-sm"
              >
                {name}
                <button
                  type="button"
                  aria-label={`Remove ${name}`}
                  onClick={() => onChange(value.filter((v) => v !== name))}
                  className="flex size-5 cursor-pointer items-center justify-center rounded-full text-fg-subtle transition-colors hover:bg-hover hover:text-fg"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
