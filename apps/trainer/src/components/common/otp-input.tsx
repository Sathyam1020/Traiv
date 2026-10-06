"use client";

import { useEffect, useRef } from "react";

/**
 * Six separate boxes rather than one text field.
 *
 * Worth the extra code: it shows the expected length without saying it, auto-advances so
 * nobody taps between boxes, accepts a pasted code into all six at once, and backspace on
 * an empty box moves back — the things people actually do with a code from WhatsApp.
 */
export function OtpInput({
  value,
  onChange,
  disabled,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function setDigit(i: number, digit: string) {
    const next = value.padEnd(6, " ").split("");
    next[i] = digit;
    onChange(next.join("").replace(/\s/g, "").slice(0, 6));
  }

  return (
    // A fieldset rather than role="group": the native element already carries the
    // semantics, and the legend names the set without showing it.
    <fieldset className="m-0 flex gap-2 border-0 p-0">
      <legend className="sr-only">Six digit code</legend>
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid || undefined}
          value={value[i] ?? ""}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "");
            if (!d) return;
            setDigit(i, d[d.length - 1] ?? "");
            refs.current[Math.min(i + 1, 5)]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i]) {
              refs.current[Math.max(i - 1, 0)]?.focus();
              setDigit(Math.max(i - 1, 0), "");
            }
            if (e.key === "ArrowLeft") refs.current[Math.max(i - 1, 0)]?.focus();
            if (e.key === "ArrowRight") refs.current[Math.min(i + 1, 5)]?.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (!pasted) return;
            onChange(pasted);
            refs.current[Math.min(pasted.length, 5)]?.focus();
          }}
          className={`h-12 w-full min-w-0 rounded-control border bg-surface text-center text-heading font-medium tabular-nums transition-colors
            focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-line-focus
            disabled:opacity-50
            ${invalid ? "border-danger" : "border-line-strong"}`}
        />
      ))}
    </fieldset>
  );
}
