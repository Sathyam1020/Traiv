"use client";

import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { Check, CircleAlert, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useEndorserName } from "@/lib/query";

const CODE_LENGTH = 8;

export type EndorserCodeState =
  | { status: "empty"; ready: true }
  | { status: "typing"; ready: false }
  | { status: "checking"; ready: false }
  | { status: "valid"; ready: true; name: string }
  | { status: "invalid"; ready: false };

/**
 * The state of the referral code, owned by the step rather than the field.
 *
 * The Continue button has to know about it — submitting while the code is still being
 * checked sends a code we have not confirmed, and the server rejects it after the person
 * has already committed to the click. The field used to hold this itself, which meant
 * the button could not see it.
 *
 * `ready` is what gates submission, and an empty code is ready: the field is optional, so
 * not using it must never block anybody.
 */
export function useEndorserCode(value: string): EndorserCodeState {
  const [debounced, setDebounced] = useState(value);

  // One request once typing settles, not one per keystroke.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), 350);
    return () => clearTimeout(id);
  }, [value]);

  const { data, isError } = useEndorserName(debounced);

  if (!value) return { status: "empty", ready: true };

  // Still mid-word, or the debounce has not caught up — either way what we know is stale,
  // so this window must be closed too, not just the request itself.
  if (value.length < CODE_LENGTH || debounced !== value) return { status: "typing", ready: false };

  if (data) return { status: "valid", ready: true, name: data.name };
  if (isError) return { status: "invalid", ready: false };

  // In flight, or settled and about to be. Both mean we do not know yet.
  return { status: "checking", ready: false };
}

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
  state,
}: {
  value: string;
  onChange: (v: string) => void;
  state: EndorserCodeState;
}) {
  const [open, setOpen] = useState(Boolean(value));

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
        aria-invalid={state.status === "invalid" || undefined}
        aria-describedby="endorser-code-status"
        className="font-mono tracking-[0.12em]"
      />

      <p
        id="endorser-code-status"
        aria-live="polite"
        className="flex items-center gap-1.5 text-caption"
      >
        {state.status === "empty" ? (
          <span className="text-fg-subtle">Leave this blank if nobody referred you.</span>
        ) : state.status === "typing" ? (
          <span className="text-fg-subtle">
            {value.length < CODE_LENGTH
              ? `${CODE_LENGTH - value.length} more characters`
              : "Checking…"}
          </span>
        ) : state.status === "checking" ? (
          <span className="text-fg-subtle">Checking…</span>
        ) : state.status === "valid" ? (
          <>
            <Check className="size-3.5 shrink-0 text-success" />
            <span className="text-fg-muted">
              Referred by <span className="font-medium text-fg">{state.name}</span>
            </span>
          </>
        ) : (
          <>
            <CircleAlert className="size-3.5 shrink-0 text-danger" />
            <span className="text-danger">That code isn't valid. Clear it to continue.</span>
          </>
        )}
      </p>
    </div>
  );
}
