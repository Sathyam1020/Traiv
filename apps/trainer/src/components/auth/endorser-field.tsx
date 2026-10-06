"use client";

import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { Check, CircleAlert, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useEndorserName } from "@/lib/query";

const CODE_LENGTH = 8;

/**
 * The optional referral code, collapsed until asked for.
 *
 * Most people signing up were not referred, and a field they have to read and skip is a
 * field that slows every signup down to serve a minority. It opens as a link instead.
 *
 * The code is confirmed as it is typed, because "DBTC6NPF" tells the person nothing — the
 * name behind it is the only way they can tell they typed their friend's code correctly.
 * The server validates it again at submit; this is for the human, not for safety.
 */
export function EndorserField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(Boolean(value));
  const [debounced, setDebounced] = useState(value);

  // One request once typing settles, not one per keystroke.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), 350);
    return () => clearTimeout(id);
  }, [value]);

  const complete = debounced.length === CODE_LENGTH;
  const { data, isError, isFetching } = useEndorserName(debounced);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-fit cursor-pointer items-center gap-1.5 rounded-control px-1 py-0.5 text-caption text-fg-muted transition-colors hover:text-fg"
      >
        <Plus className="size-3.5" />
        Have a referral code?
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="endorser-code">
        Referral code <span className="font-normal text-fg-subtle">(optional)</span>
      </Label>
      <Input
        id="endorser-code"
        value={value}
        onChange={(e) =>
          // Same alphabet the server generates, upper-cased as they type so the code on
          // the screen matches the one they were given.
          onChange(
            e.target.value
              .toUpperCase()
              .replace(/[^23456789ABCDEFGHJKMNPQRSTVWXYZ]/g, "")
              .slice(0, CODE_LENGTH),
          )
        }
        placeholder="ABCD2345"
        autoComplete="off"
        spellCheck={false}
        className="font-mono tracking-[0.12em]"
        aria-describedby="endorser-code-status"
      />

      <p id="endorser-code-status" className="flex items-center gap-1.5 text-caption">
        {!complete ? (
          <span className="text-fg-subtle">
            {value.length
              ? `${CODE_LENGTH - value.length} more characters`
              : "Leave this blank if nobody referred you."}
          </span>
        ) : isFetching ? (
          <span className="text-fg-subtle">Checking…</span>
        ) : data ? (
          <>
            <Check className="size-3.5 shrink-0 text-success" />
            <span className="text-fg-muted">
              Referred by <span className="font-medium text-fg">{data.name}</span>
            </span>
          </>
        ) : isError ? (
          <>
            <CircleAlert className="size-3.5 shrink-0 text-danger" />
            <span className="text-danger">That code isn't valid.</span>
          </>
        ) : null}
      </p>
    </div>
  );
}
