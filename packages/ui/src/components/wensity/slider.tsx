"use client";

import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "@traiv/ui/lib/cn";

export type SliderSize = "sm" | "md" | "lg";
export type SliderTone = "neutral" | "brand";

/** Control height matches the thumb so Base UI `top: 50%` + `translate: -50%` lands on the rail. */
const CONTROL_SIZES: Record<SliderSize, string> = {
  sm: "h-5",
  md: "h-6",
  lg: "h-7",
};

const TRACK_SIZES: Record<SliderSize, string> = {
  sm: "h-2",
  md: "h-2.5",
  lg: "h-3",
};

const THUMB_SIZES: Record<SliderSize, string> = {
  sm: "size-5",
  md: "size-6",
  lg: "size-7",
};

const FILL_TONES: Record<SliderTone, string> = {
  neutral:
    "bg-[linear-gradient(90deg,color-mix(in_srgb,var(--foreground)_72%,transparent),color-mix(in_srgb,var(--foreground)_92%,transparent))]",
  // Theme accent — follows `--primitive-control-solid` from create-preset / host theme.
  brand: "bg-[var(--primitive-control-solid)]",
};

function computeMinSteps(minDistance: number, step: number) {
  if (!minDistance || minDistance <= 0 || step <= 0) return 0;
  return Math.max(0, Math.round(minDistance / step));
}

function bubbleClasses() {
  return cn(
    // Horizontal centering only — vertical lift lives in globals.css so it can
    // animate on drag/focus without fighting Base UI’s thumb `translate`.
    "absolute left-1/2 top-0 -translate-x-1/2",
    "rounded-[var(--primitive-radius-control-sm)]",
    "px-2 py-0.5 text-[11px] font-medium tabular-nums text-[var(--foreground)]",
  );
}

function thumbClasses(size: SliderSize) {
  return cn(
    // Do not set top / translate here — Base UI owns cross-axis geometry via
    // inline `top: 50%` + CSS `translate: -50% -50%` against Slider.Control.
    // Grab scale/ring lives in globals.css ([data-dragging] / :active).
    // Thumb stays neutral white/black via foreground — only the fill follows theme color.
    "box-border shrink-0 rounded-full",
    "border-2 border-[var(--background)] bg-[var(--foreground)]",
    "shadow-[0_1px_4px_rgba(0,0,0,0.35)]",
    "outline-none",
    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--primitive-ring)] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[var(--background)]",
    "cursor-grab data-[dragging]:cursor-grabbing",
    "data-disabled:cursor-not-allowed",
    THUMB_SIZES[size],
  );
}

function trackClasses(size: SliderSize) {
  return cn(
    // Painted by data-surface="well"; thin, so no rim eats into the range.
    "relative w-full grow rounded-full border-0",
    "data-disabled:cursor-not-allowed",
    TRACK_SIZES[size],
  );
}

function controlClasses(size: SliderSize) {
  return cn("relative flex w-full touch-none items-center select-none", CONTROL_SIZES[size]);
}

function rootClasses(disabled: boolean | undefined, className: string | undefined) {
  return cn(
    "relative w-full select-none touch-none",
    "focus-visible:outline-none",
    disabled && "opacity-45 pointer-events-none",
    className,
  );
}

function ThumbBubble({
  showValue,
  display,
  index,
}: {
  showValue: boolean;
  display: (v: number) => string;
  index?: number;
}) {
  if (!showValue) return null;
  return (
    <span data-slot="wensity-slider-bubble" data-surface="overlay" className={bubbleClasses()}>
      <BaseSlider.Value className="text-inherit">
        {(_formatted, values) => display(values[index ?? 0] ?? 0)}
      </BaseSlider.Value>
    </span>
  );
}

/* ─── <Slider> — single thumb ───────────────────────────────── */

export interface SliderProps {
  className?: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  size?: SliderSize;
  tone?: SliderTone;
  disabled?: boolean;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  /** Alias of `onValueCommit` matching Base UI's naming. */
  onValueCommitted?: (value: number) => void;
  label?: string;
  name?: string;
  id?: string;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      size = "md",
      // Match Progress / Switch / Button primary — theme color drives the fill.
      tone = "brand",
      disabled = false,
      showValue = true,
      formatValue,
      onValueChange,
      onValueCommit,
      onValueCommitted,
      label = "Slider",
      name,
      id,
    },
    ref,
  ) => {
    const display = (v: number) => (formatValue ? formatValue(v) : `${Math.round(v)}`);

    return (
      <BaseSlider.Root
        data-wensity-primitive=""
        ref={ref}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        name={name}
        id={id}
        onValueChange={(next) => onValueChange?.(next as number)}
        onValueCommitted={(next) => {
          const numeric = next as number;
          onValueCommit?.(numeric);
          onValueCommitted?.(numeric);
        }}
        className={rootClasses(disabled, className)}
      >
        {/*
          Control height === thumb size. Thumb is a sibling of Track so its
          containing block is Control (not the thin rail). Base UI then centers
          the thumb on the control midline, which coincides with the track.
        */}
        <BaseSlider.Control className={controlClasses(size)}>
          <BaseSlider.Track data-surface="well" className={trackClasses(size)}>
            <BaseSlider.Indicator
              className={cn("absolute inset-y-0 left-0 rounded-full", FILL_TONES[tone])}
            />
          </BaseSlider.Track>
          <BaseSlider.Thumb
            data-slot="wensity-slider-thumb"
            getAriaLabel={() => label}
            className={thumbClasses(size)}
          >
            <ThumbBubble showValue={showValue} display={display} />
          </BaseSlider.Thumb>
        </BaseSlider.Control>
      </BaseSlider.Root>
    );
  },
);
Slider.displayName = "Slider";

/* ─── <SliderRange> — dual thumb ────────────────────────────── */

export interface SliderRangeProps {
  className?: string;
  value?: [number, number];
  defaultValue?: [number, number];
  min?: number;
  max?: number;
  step?: number;
  minDistance?: number;
  size?: SliderSize;
  tone?: SliderTone;
  disabled?: boolean;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  onValueChange?: (value: [number, number]) => void;
  onValueCommit?: (value: [number, number]) => void;
  /** Alias of `onValueCommit` matching Base UI's naming. */
  onValueCommitted?: (value: [number, number]) => void;
  label?: string;
  name?: string;
  id?: string;
}

export const SliderRange = React.forwardRef<HTMLDivElement, SliderRangeProps>(
  (
    {
      className,
      value,
      defaultValue = [25, 75],
      min = 0,
      max = 100,
      step = 1,
      minDistance = 0,
      size = "md",
      tone = "brand",
      disabled = false,
      showValue = true,
      formatValue,
      onValueChange,
      onValueCommit,
      onValueCommitted,
      label = "Range slider",
      name,
      id,
    },
    ref,
  ) => {
    const minStepsBetweenValues = computeMinSteps(minDistance, step);
    const display = (v: number) => (formatValue ? formatValue(v) : `${Math.round(v)}`);

    return (
      <BaseSlider.Root
        data-wensity-primitive=""
        ref={ref}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        min={min}
        max={max}
        step={step}
        minStepsBetweenValues={minStepsBetweenValues}
        disabled={disabled}
        name={name}
        id={id}
        onValueChange={(next) => onValueChange?.(next as [number, number])}
        onValueCommitted={(next) => {
          const range = next as [number, number];
          onValueCommit?.(range);
          onValueCommitted?.(range);
        }}
        className={rootClasses(disabled, className)}
      >
        <BaseSlider.Control className={controlClasses(size)}>
          <BaseSlider.Track data-surface="well" className={trackClasses(size)}>
            <BaseSlider.Indicator
              className={cn("absolute inset-y-0 rounded-full", FILL_TONES[tone])}
            />
          </BaseSlider.Track>
          <BaseSlider.Thumb
            index={0}
            data-slot="wensity-slider-thumb"
            getAriaLabel={() => `${label} minimum`}
            className={thumbClasses(size)}
          >
            <ThumbBubble showValue={showValue} display={display} index={0} />
          </BaseSlider.Thumb>
          <BaseSlider.Thumb
            index={1}
            data-slot="wensity-slider-thumb"
            getAriaLabel={() => `${label} maximum`}
            className={thumbClasses(size)}
          >
            <ThumbBubble showValue={showValue} display={display} index={1} />
          </BaseSlider.Thumb>
        </BaseSlider.Control>
      </BaseSlider.Root>
    );
  },
);
SliderRange.displayName = "SliderRange";
