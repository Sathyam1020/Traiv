"use client";

import { Label } from "@traiv/ui/components/label";
import {
  SelectContent,
  SelectItem,
  Select as SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@traiv/ui/components/select";
import { Slider as SliderRoot } from "@traiv/ui/components/slider";
import { type ReactNode, useId } from "react";

/**
 * The three shapes the public calculators are built from.
 *
 * Thin wrappers over the shadcn primitives rather than controls of their own — an
 * earlier version of this file hand-rolled a native `<select>` and a bare `<input
 * type=range>` on the theory that they would match the site's tokens better than the
 * shadcn ones. That was wrong: `globals.css` already aliases every shadcn variable onto
 * those same tokens, so the shadcn components were always going to match, and what the
 * hand-rolled pair actually bought was two controls nobody else in the repo maintains.
 */

/** One label bound to one control, by id rather than by nesting. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children(id)}
      {hint ? <span className="text-caption text-fg-subtle">{hint}</span> : null}
    </div>
  );
}

/** Several controls under one heading, where no single control owns the label. */
export function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-2 text-body-sm font-medium">{label}</legend>
      {children}
      {hint ? <span className="mt-1 text-caption text-fg-subtle">{hint}</span> : null}
    </fieldset>
  );
}

export function Choice<T extends string>({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
}) {
  return (
    <SelectRoot value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger id={id} className="h-11 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}

export function NumberField({
  id,
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  id: string;
  value: number | "";
  onChange: (v: number | "") => void;
  min: number;
  max: number;
  suffix?: string;
}) {
  return (
    <div className="relative flex items-center">
      <input
        id={id}
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        // The shadcn Input, with the one change a measurement needs: lining figures, so
        // 72 and 165 do not jump about as they are typed.
        className={`h-11 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base tabular-nums shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm dark:bg-input/30 ${
          suffix ? "pr-12" : ""
        }`}
      />
      {suffix ? (
        <span className="pointer-events-none absolute right-3 text-caption text-fg-subtle">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

/**
 * One number on a track.
 *
 * Radix's Slider is a multi-thumb control, so its value is an array. Every use here has
 * exactly one thumb, and unwrapping it in one place keeps three calculators from each
 * writing `value[0] ?? min`.
 */
export function Slider({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  id?: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <SliderRoot
      id={id}
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={([v]) => onChange(v ?? min)}
      className="py-2"
    />
  );
}
