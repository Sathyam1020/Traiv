"use client";

import { useState } from "react";

export const CM_PER_INCH = 2.54;

export const cmToInches = (cm: number) => Math.round((cm / CM_PER_INCH) * 10) / 10;
export const inchesToCm = (inches: number) => Math.round(inches * CM_PER_INCH * 10) / 10;

export type LengthUnit = "cm" | "in";

/**
 * A length field that can be typed in cm or inches, saved as cm either way.
 *
 * Keeps one raw-text buffer per unit rather than converting on every keystroke, so
 * switching units mid-entry never rounds away what was already typed — the digits
 * typed in cm are still there if the client flips back from inches. `cm` is the only
 * thing a caller ever reads; nothing downstream ever sees inches.
 *
 * `externalUnit`, when passed, overrides this field's own unit — for a list of fields
 * that share one toggle (the check-in's circumference step, same as onboarding's) rather
 * than each field switching independently. The returned `toggle` is a no-op in that
 * case; the caller drives the shared unit itself instead.
 */
export function useCmInches(initialCm?: number | null, externalUnit?: LengthUnit) {
  const [internalUnit, setInternalUnit] = useState<LengthUnit>("cm");
  const unit = externalUnit ?? internalUnit;
  const [cmText, setCmText] = useState(initialCm ? String(initialCm) : "");
  const [inText, setInText] = useState(initialCm ? String(cmToInches(initialCm)) : "");

  const text = unit === "cm" ? cmText : inText;
  const setText = (raw: string) => {
    const cleaned = raw.replace(/[^\d.]/g, "").slice(0, 6);
    if (unit === "cm") setCmText(cleaned);
    else setInText(cleaned);
  };

  const n = Number(text);
  const hasValue = text.trim() !== "";
  const cm = !hasValue || !Number.isFinite(n) ? null : unit === "cm" ? n : inchesToCm(n);

  return {
    unit,
    toggle: () => setInternalUnit((u) => (u === "cm" ? "in" : "cm")),
    text,
    setText,
    cm,
    hasValue,
  };
}
