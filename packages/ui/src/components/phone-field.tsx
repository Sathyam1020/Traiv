"use client";

import {
  COUNTRIES,
  type CountryCode,
  country,
  parsePhone,
  phoneProblemMessage,
} from "@traiv/phone";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@traiv/ui/components/dropdown-menu";
import { Label } from "@traiv/ui/components/label";
import { ChevronsUpDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * A phone number, in any country.
 *
 * The country used to be a fixed "+91" label, and the error said "Indian mobile numbers
 * start with 6, 7, 8 or 9" — which is useless to everyone who is not Indian, and there
 * are about two hundred other rule sets nobody should be hardcoding. Both the validation
 * and the message now come from `@traiv/phone`, which the API uses too, so the form can
 * never accept something the server refuses.
 *
 * The message appears only once there is enough typed to be sure, so it does not scold
 * somebody mid-way through their own number.
 */
export function PhoneField({
  value,
  onChange,
  countryCode,
  onCountryChange,
  hint,
  label = "Phone number",
}: {
  value: string;
  onChange: (v: string) => void;
  countryCode: CountryCode;
  onCountryChange: (c: CountryCode) => void;
  hint?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Radix puts focus on the first item when the menu opens. With 245 of them, the search
  // box is the only useful place for it — so move it there on the frame after opening.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => searchRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const selected = country(countryCode);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dial.startsWith(q.replace(/^\+/, "")),
    );
  }, [query]);

  const parsed = parsePhone(value, countryCode);
  // Only complain once it is long enough to be a real attempt, so somebody typing their
  // own number is not told it is wrong at the third digit.
  const enough = value.replace(/\D/g, "").length >= 6;
  const invalid = !parsed.ok && parsed.problem !== "empty" && enough;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="phone">{label}</Label>

      <div className="flex items-stretch gap-2">
        <DropdownMenu
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) setQuery("");
          }}
        >
          <DropdownMenuTrigger
            type="button"
            aria-label={`Country: ${selected.name}`}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-control border border-line-strong bg-surface px-2.5 text-body-sm tabular-nums text-fg-muted transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-line-focus"
          >
            <span aria-hidden="true">{selected.flag}</span>+{selected.dial}
            <ChevronsUpDown className="size-3.5 shrink-0 text-fg-subtle" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-[17rem] p-0">
            {/* 245 countries is far too many to scroll, so the list is searchable. */}
            <div className="flex items-center gap-2 border-b border-line px-3 py-2">
              <Search className="size-3.5 shrink-0 text-fg-subtle" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Search country or code"
                className="min-w-0 flex-1 bg-transparent text-body-sm outline-none placeholder:text-fg-subtle"
              />
            </div>

            <div className="max-h-64 overflow-y-auto py-1">
              {results.length ? (
                results.map((c) => (
                  <DropdownMenuItem
                    key={c.code}
                    onSelect={() => onCountryChange(c.code)}
                    className="cursor-pointer gap-2"
                  >
                    <span aria-hidden="true">{c.flag}</span>
                    <span className="min-w-0 flex-1 truncate">{c.name}</span>
                    <span className="shrink-0 tabular-nums text-fg-subtle">+{c.dial}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <p className="px-3 py-6 text-center text-caption text-fg-subtle">
                  No country matches “{query}”.
                </p>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          id="phone"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={selected.examplePlain || "Phone number"}
          value={value}
          aria-invalid={invalid || undefined}
          aria-describedby="phone-hint"
          // Punctuation is kept: people paste numbers with spaces, dashes and brackets,
          // and the parser handles all of it.
          onChange={(e) => onChange(e.target.value.replace(/[^\d+\s().-]/g, "").slice(0, 24))}
          className={`h-10 min-w-0 flex-1 rounded-control border bg-surface px-3 text-body-sm tabular-nums outline-none placeholder:text-fg-subtle focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-line-focus ${
            invalid ? "border-danger" : "border-line-strong"
          }`}
        />
      </div>

      <p id="phone-hint" className={`text-caption ${invalid ? "text-danger" : "text-fg-subtle"}`}>
        {invalid && !parsed.ok ? phoneProblemMessage(parsed.problem, countryCode) : (hint ?? "")}
      </p>
    </div>
  );
}
