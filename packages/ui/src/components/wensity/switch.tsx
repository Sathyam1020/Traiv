"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "@traiv/ui/lib/cn";

/**
 * CSS rules for Switch animation slots. Re-keyed to Base UI `data-checked` /
 * `data-unchecked` attributes so they light up automatically from `BaseSwitch.Root`.
 *
 * These rules ship in the Wensity token CSS block the CLI writes into your
 * stylesheet, so this file injects no runtime `<style>` tag.
 */

export type SwitchSize = "sm" | "md" | "lg";
export type SwitchVariant = "minimal" | "elevated" | "segmented" | "power";

export type SwitchChangeHandler = (checked: boolean, eventDetails?: unknown) => void;

export interface SwitchProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>,
    "className" | "onCheckedChange" | "render"
  > {
  onCheckedChange?: SwitchChangeHandler;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  switchSize?: SwitchSize;
  variant?: SwitchVariant;
  labelPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
  controlClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
}

export interface SwitchGroupProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactNode;
  divided?: boolean;
}

export interface SwitchCardProps extends SwitchProps {
  leading?: React.ReactNode;
  /** Static status label when trailingOn/trailingOff are not set. */
  trailing?: React.ReactNode;
  /** Status label when the switch is on. */
  trailingOn?: React.ReactNode;
  /** Status label when the switch is off. */
  trailingOff?: React.ReactNode;
}

export interface SwitchSettingsGroupProps {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const trackSizes: Record<SwitchSize, string> = {
  sm: "h-5 w-9",
  md: "h-6 w-11",
  lg: "h-7 w-[3.25rem]",
};

const knobSizes: Record<SwitchSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const segmentedSizes: Record<SwitchSize, string> = {
  sm: "h-7 w-[4.5rem] text-[10px]",
  md: "h-8 w-[5.25rem] text-[11px]",
  lg: "h-9 w-24 text-xs",
};

const iconSizes: Record<SwitchSize, string> = {
  sm: "size-7",
  md: "size-8",
  lg: "size-9",
};

const labelSizes: Record<SwitchSize, string> = {
  sm: "text-[13px]",
  md: "text-sm",
  lg: "text-[15px]",
};

const rowGap: Record<SwitchSize, string> = {
  sm: "gap-3",
  md: "gap-3.5",
  lg: "gap-4",
};

const controlOffset: Record<SwitchSize, string> = {
  sm: "mt-px",
  md: "mt-0.5",
  lg: "mt-0.5",
};

/**
 * Focus ring applied via Base UI's `data-focused` / native `:focus-visible` on the
 * button-role span. Uses primitive ring token.
 */
const focusRing = cn(
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
);

/**
 * ≥44px touch target for small pill variant. Positioned as a pseudo overlay so it
 * expands the click surface without shifting layout (PRIM-A11Y-004).
 */
const smTouchTarget =
  "before:absolute before:inset-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:h-11 before:w-11 before:content-['']";

/** Recessed rail — visible against page bg in both themes. */
const trackOff = cn(
  "border border-transparent",
  "bg-[color-mix(in_srgb,var(--foreground)_8%,var(--background))]",
  "dark:bg-[color-mix(in_srgb,var(--foreground)_14%,var(--background))]",
  "data-hover:bg-[color-mix(in_srgb,var(--foreground)_12%,var(--background))]",
  "dark:data-hover:bg-[color-mix(in_srgb,var(--foreground)_18%,var(--background))]",
);

/** Active pill rail — solid foreground fill styled via `--primitive-control-solid` fallback. */
const trackOnPill = cn(
  "border border-[color-mix(in_srgb,var(--foreground)_10%,transparent)]",
  "bg-[var(--primitive-control-solid)]",
  "dark:border-[color-mix(in_srgb,var(--foreground)_24%,transparent)]",
);

/** Active power rail — full foreground fill; icon provides contrast. */
const trackOnPower = cn(
  "border border-[color-mix(in_srgb,var(--foreground)_10%,transparent)]",
  "bg-[var(--primitive-control-solid)]",
);

const trackOnError = cn(
  "border border-[var(--primitive-destructive-border)]",
  "bg-[var(--primitive-destructive)]",
);

/** Thumb stays on the solid-foreground token so it reads against the solid rail. */
const knobBase = cn(
  "pointer-events-none rounded-full bg-[var(--primitive-control-solid-foreground)] transform-gpu",
  "shadow-[0_1px_1px_rgba(0,0,0,0.14),0_0_0_1px_rgba(0,0,0,0.05)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.34),0_0_0_1px_rgba(255,255,255,0.08)]",
);

const knobElevated = cn(
  "shadow-[0_1px_2px_rgba(0,0,0,0.16),0_0_0_1px_rgba(0,0,0,0.05)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.38),0_0_0_1px_rgba(255,255,255,0.10)]",
);

/** Segmented / power shell (off). */
const shellOff = cn(
  "border border-[var(--border-strong)]",
  "bg-[color-mix(in_srgb,var(--foreground)_6%,var(--background))]",
  "dark:bg-[color-mix(in_srgb,var(--foreground)_10%,var(--background))]",
);

/** Segmented shell when on (non-error). */
const shellOn = cn(
  "border border-[color-mix(in_srgb,var(--foreground)_12%,transparent)]",
  "bg-[color-mix(in_srgb,var(--foreground)_9%,var(--background))]",
  "dark:border-[color-mix(in_srgb,var(--foreground)_14%,transparent)] dark:bg-[color-mix(in_srgb,var(--foreground)_16%,var(--background))]",
);

function knobClasses(elevatedKnob: boolean) {
  return cn(knobBase, elevatedKnob && knobElevated);
}

function resolvePillTrack(
  checked: boolean,
  error?: React.ReactNode,
  mode: "pill" | "power" = "pill",
) {
  if (error && checked) return trackOnError;
  if (checked) return mode === "power" ? trackOnPower : trackOnPill;
  return trackOff;
}

function resolveSegmentedShell(checked: boolean, error?: React.ReactNode) {
  if (error && checked) {
    return cn(
      "border border-[var(--primitive-destructive-border)]",
      "bg-[var(--primitive-destructive-surface)]",
    );
  }
  if (checked) return shellOn;
  return shellOff;
}

function SwitchCheckIcon({ className, slot }: { className?: string; slot?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      data-slot={slot}
      className={cn("size-3.5", className)}
    >
      <path
        d="M3.5 8.2 6.4 11.1 12.6 4.9"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
    </svg>
  );
}

function SwitchPowerIcon({ checked, error }: { checked: boolean; error?: React.ReactNode }) {
  return (
    <span className="relative size-3.5">
      <span data-slot="switch-power-icon" data-active={!checked} aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" className="size-3.5 text-[var(--muted-foreground)]">
          <path d="M8 3.25v3.5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
          <path
            d="M5.35 5.35a3.65 3.65 0 1 0 5.3 0"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span data-slot="switch-power-icon" data-active={checked} aria-hidden="true">
        <SwitchCheckIcon
          slot="switch-power-check"
          className={
            error
              ? "text-[var(--primitive-destructive-foreground)]"
              : "text-[var(--primitive-control-solid-foreground)]"
          }
        />
      </span>
    </span>
  );
}

const segmentActiveText = "text-[var(--foreground)]";
const segmentInactiveText = "text-[var(--muted-foreground)]";

type SwitchControlRenderProps = {
  checked: boolean;
  disabled?: boolean;
  error?: React.ReactNode;
  switchSize: SwitchSize;
  variant: SwitchVariant;
  className?: string;
};

/** Builds the class string + children for the BaseSwitch.Root visual. */
function buildSwitchControl({
  checked,
  disabled,
  error,
  switchSize,
  variant,
  className,
}: SwitchControlRenderProps) {
  if (variant === "segmented") {
    return {
      className: cn(
        "relative grid shrink-0 grid-cols-2 items-center overflow-hidden rounded-full p-0.5",
        resolveSegmentedShell(checked, error),
        focusRing,
        disabled && "opacity-45",
        segmentedSizes[switchSize],
        className,
      ),
      children: (
        <>
          <span
            data-slot="switch-segment-indicator"
            aria-hidden="true"
            className={cn(
              "absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full",
              checked && error
                ? cn("bg-[var(--primitive-destructive)]", "shadow-[0_1px_1px_rgba(0,0,0,0.18)]")
                : knobBase,
            )}
          />
          <span
            data-slot="switch-segment-label"
            className={cn(
              "relative z-[2] text-center font-medium tracking-[-0.01em]",
              checked ? segmentInactiveText : segmentActiveText,
            )}
          >
            Off
          </span>
          <span
            data-slot="switch-segment-label"
            className={cn(
              "relative z-[2] text-center font-medium tracking-[-0.01em]",
              checked
                ? error
                  ? "text-[var(--primitive-destructive-foreground)]"
                  : segmentActiveText
                : segmentInactiveText,
            )}
          >
            On
          </span>
        </>
      ),
    };
  }

  if (variant === "power") {
    return {
      className: cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full",
        resolvePillTrack(checked, error, "power"),
        focusRing,
        iconSizes[switchSize],
        disabled && "opacity-45",
        switchSize === "sm" && smTouchTarget,
        className,
      ),
      children: <SwitchPowerIcon checked={checked} error={error} />,
    };
  }

  const elevatedKnob = variant === "elevated";

  return {
    className: cn(
      "relative inline-flex shrink-0 items-center rounded-full p-0.5",
      resolvePillTrack(checked, error),
      focusRing,
      trackSizes[switchSize],
      disabled && "opacity-45",
      switchSize === "sm" && smTouchTarget,
      className,
    ),
    children: (
      <BaseSwitch.Thumb
        data-slot="switch-knob"
        data-size={switchSize}
        aria-hidden="true"
        className={cn(knobClasses(elevatedKnob), knobSizes[switchSize])}
      />
    ),
  };
}

/**
 * Base UI–backed Switch. Renders `BaseSwitch.Root` (a `<span role="switch">` plus
 * hidden `<input>`) styled as track/knob/segmented/power. Emits Base UI's
 * `data-checked` / `data-unchecked` / `data-disabled` for CSS state hooks.
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      id,
      className,
      containerClassName,
      controlClassName,
      labelClassName,
      descriptionClassName,
      label,
      description,
      error,
      switchSize = "md",
      variant = "minimal",
      labelPosition = "right",
      fullWidth = true,
      checked,
      defaultChecked = false,
      disabled,
      onCheckedChange,
      inputRef,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const switchId = id ?? `ui-switch-${reactId}`;
    const descriptionId = description ? `${switchId}-description` : undefined;
    const errorId = error ? `${switchId}-error` : undefined;
    const isControlled = checked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
    const isChecked = isControlled ? checked : uncontrolledChecked;
    const describedBy =
      [ariaDescribedBy, errorId, descriptionId].filter(Boolean).join(" ") || undefined;
    const hasCopy = Boolean(label || description || error);
    const alignStart = Boolean(description || error);

    const handleCheckedChange = React.useCallback(
      (next: boolean, eventDetails: unknown) => {
        if (!isControlled) setUncontrolledChecked(next);
        onCheckedChange?.(next, eventDetails);
      },
      [isControlled, onCheckedChange],
    );

    const rendered = buildSwitchControl({
      checked: isChecked,
      disabled,
      error,
      switchSize,
      variant,
      className: controlClassName,
    });

    const control = (
      <BaseSwitch.Root
        ref={ref}
        id={switchId}
        checked={isChecked}
        disabled={disabled}
        onCheckedChange={handleCheckedChange}
        inputRef={inputRef}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        data-slot="switch-control"
        data-variant={variant}
        className={rendered.className}
        {...props}
      >
        {rendered.children}
      </BaseSwitch.Root>
    );

    const copy = hasCopy ? (
      <span className="min-w-0 flex-1">
        {label ? (
          typeof label === "string" || typeof label === "number" ? (
            <span
              className={cn(
                "block font-medium leading-snug tracking-[-0.015em] text-[var(--foreground)]",
                labelSizes[switchSize],
                disabled && "text-[var(--muted-foreground)]",
                labelClassName,
              )}
            >
              {label}
            </span>
          ) : (
            label
          )
        ) : null}
        {description ? (
          <span
            id={descriptionId}
            className={cn(
              "mt-1 block text-[12px] leading-5 text-[var(--muted-foreground)]",
              descriptionClassName,
            )}
          >
            {description}
          </span>
        ) : null}
        {error ? (
          <span
            id={errorId}
            className="mt-1 block text-[12px] leading-5 text-[var(--primitive-destructive)]"
          >
            {error}
          </span>
        ) : null}
      </span>
    ) : null;

    return (
      <label
        data-wensity-primitive=""
        data-slot="switch"
        htmlFor={switchId}
        className={cn(
          "group/switch relative flex cursor-pointer select-none",
          alignStart ? "items-start" : "items-center",
          rowGap[switchSize],
          fullWidth ? "w-full" : "w-fit",
          disabled && "cursor-not-allowed",
          labelPosition === "left" && "justify-between",
          containerClassName,
          className,
        )}
      >
        {labelPosition === "left" ? (
          <>
            {copy}
            <span className={cn("shrink-0", alignStart && controlOffset[switchSize])}>
              {control}
            </span>
          </>
        ) : (
          <>
            <span className={cn("shrink-0", alignStart && controlOffset[switchSize])}>
              {control}
            </span>
            {copy}
          </>
        )}
      </label>
    );
  },
);

Switch.displayName = "Switch";

export function SwitchGroup({
  label,
  description,
  error,
  children,
  divided = true,
  className,
  ...props
}: SwitchGroupProps) {
  const reactId = React.useId();
  const descriptionId = description ? `ui-switch-group-${reactId}-description` : undefined;
  const errorId = error ? `ui-switch-group-${reactId}-error` : undefined;

  return (
    <fieldset
      aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
      className={cn("space-y-3", className)}
      {...props}
    >
      {label || description ? (
        <div className="space-y-1">
          {label ? (
            <legend className="text-sm font-semibold tracking-[-0.015em] text-[var(--foreground)]">
              {label}
            </legend>
          ) : null}
          {description ? (
            <p id={descriptionId} className="text-[12px] leading-5 text-[var(--muted-foreground)]">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      <div
        data-surface={divided ? "panel" : undefined}
        className={cn(
          divided && "relative isolate overflow-hidden rounded-[var(--primitive-radius-surface)]",
          divided &&
            "[&>[data-slot=switch]]:border-b [&>[data-slot=switch]]:border-[var(--border)] [&>[data-slot=switch]]:px-4 [&>[data-slot=switch]]:py-3.5 [&>[data-slot=switch]:last-child]:border-b-0",
          !divided && "space-y-1",
        )}
      >
        {children}
      </div>
      {error ? (
        <p id={errorId} className="text-[12px] leading-5 text-[var(--primitive-destructive)]">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function SwitchSettingsGroup({
  title,
  description,
  children,
  className,
}: SwitchSettingsGroupProps) {
  return (
    <section className={cn("flex min-h-0 min-w-0 flex-col gap-2.5", className)}>
      <header className="min-h-11 px-0.5">
        <h3 className="font-[family-name:var(--primitive-font-display)] text-[13px] font-semibold leading-5 tracking-[-0.015em] text-[var(--foreground)]">
          {title}
        </h3>
        {description ? (
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-5 text-[var(--muted-foreground)]">
            {description}
          </p>
        ) : (
          <p className="mt-0.5 text-[12px] leading-5 text-transparent" aria-hidden="true">
            &nbsp;
          </p>
        )}
      </header>
      <div
        data-surface="panel"
        className={cn(
          "relative isolate overflow-hidden rounded-[var(--primitive-radius-surface)]",
          "[&_[data-slot=switch]]:border-b [&_[data-slot=switch]]:border-[var(--border)]",
          "[&_[data-slot=switch]:last-child]:border-b-0",
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function SwitchCard({
  leading,
  trailing,
  trailingOn,
  trailingOff,
  label,
  description,
  error,
  className,
  switchSize = "md",
  variant = "minimal",
  disabled,
  checked,
  defaultChecked = false,
  onCheckedChange,
  id,
  inputRef,
  labelPosition: _labelPosition,
  fullWidth: _fullWidth,
  containerClassName: _containerClassName,
  controlClassName: _controlClassName,
  labelClassName: _labelClassName,
  descriptionClassName: _descriptionClassName,
  ...props
}: SwitchCardProps) {
  const reactId = React.useId();
  const switchId = id ?? `ui-switch-card-${reactId}`;
  const descriptionId = description ? `${switchId}-description` : undefined;
  const errorId = error ? `${switchId}-error` : undefined;
  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
  const isChecked = isControlled ? checked : uncontrolledChecked;
  const trailingLabel =
    trailingOn !== undefined || trailingOff !== undefined
      ? isChecked
        ? trailingOn
        : trailingOff
      : trailing;
  const describedBy = [errorId, descriptionId].filter(Boolean).join(" ") || undefined;
  const hasAnimatedTrailing = trailingOn !== undefined || trailingOff !== undefined;
  const [trailingSwapping, setTrailingSwapping] = React.useState(false);
  const prevCheckedRef = React.useRef(isChecked);

  React.useEffect(() => {
    if (!hasAnimatedTrailing) {
      prevCheckedRef.current = isChecked;
      return;
    }
    if (prevCheckedRef.current === isChecked) return;
    prevCheckedRef.current = isChecked;
    setTrailingSwapping(true);
    const timeoutId = window.setTimeout(() => setTrailingSwapping(false), 220);
    return () => window.clearTimeout(timeoutId);
  }, [hasAnimatedTrailing, isChecked]);

  const handleCheckedChange = React.useCallback(
    (next: boolean, eventDetails: unknown) => {
      if (!isControlled) setUncontrolledChecked(next);
      onCheckedChange?.(next, eventDetails);
    },
    [isControlled, onCheckedChange],
  );

  const rendered = buildSwitchControl({
    checked: isChecked,
    disabled,
    error,
    switchSize,
    variant,
  });

  return (
    <label
      data-wensity-primitive=""
      data-slot="switch"
      htmlFor={switchId}
      className={cn(
        "group/switch flex min-h-16 w-full cursor-pointer select-none items-center gap-3.5 px-4 py-3",
        "transition-[background-color] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.16,1,0.3,1))] motion-reduce:transition-none",
        !disabled && "hover:bg-[var(--primitive-surface-hover)]",
        "has-[[data-checked]]:bg-[var(--primitive-surface-selected)]",
        disabled && "cursor-not-allowed opacity-45 hover:bg-transparent",
        className,
      )}
    >
      {leading ? (
        <span
          data-surface="frame"
          className={cn(
            "switch-card-icon grid size-9 shrink-0 place-items-center rounded-[var(--primitive-radius-control-sm)]",
            "text-[var(--muted-foreground)]",
            "transition-[border-color,background-color,color] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.16,1,0.3,1))] motion-reduce:transition-none",
            "[&_svg]:size-[17px]",
            "group-has-[[data-checked]]/switch:border-[color-mix(in_srgb,var(--foreground)_12%,transparent)]",
            "group-has-[[data-checked]]/switch:bg-[color-mix(in_srgb,var(--foreground)_7%,var(--background))]",
            "group-has-[[data-checked]]/switch:text-[var(--foreground)]",
            disabled && "opacity-80",
          )}
        >
          {leading}
        </span>
      ) : null}

      <span className="min-w-0 flex-1">
        {label ? (
          <span
            className={cn(
              "block font-medium leading-snug tracking-[-0.015em] text-[var(--foreground)]",
              labelSizes[switchSize],
              disabled && "text-[var(--muted-foreground)]",
            )}
          >
            {label}
          </span>
        ) : null}
        {description ? (
          <span
            id={descriptionId}
            className="mt-0.5 line-clamp-2 block text-[12px] leading-[1.45] text-[var(--muted-foreground)]"
          >
            {description}
          </span>
        ) : null}
        {error ? (
          <span
            id={errorId}
            className="mt-1 block text-[12px] leading-5 text-[var(--primitive-destructive)]"
          >
            {error}
          </span>
        ) : null}
      </span>

      <span className="flex shrink-0 items-center gap-2.5 pl-1">
        {trailingLabel ? (
          <span
            aria-live="polite"
            data-slot="switch-card-trailing"
            data-swapping={trailingSwapping ? "true" : undefined}
            data-surface="frame"
            className={cn(
              "inline-flex min-w-[3.25rem] items-center justify-center rounded-[var(--primitive-radius-control-sm)]",
              "px-1.5 py-0.5",
              "text-[10px] font-medium tracking-[0.01em] text-[var(--muted-foreground)]",
              "group-has-[[data-checked]]/switch:border-[color-mix(in_srgb,var(--foreground)_10%,transparent)]",
              "group-has-[[data-checked]]/switch:text-[var(--foreground)]",
            )}
          >
            {trailingLabel}
          </span>
        ) : null}
        <BaseSwitch.Root
          id={switchId}
          checked={isChecked}
          disabled={disabled}
          onCheckedChange={handleCheckedChange}
          inputRef={inputRef}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          data-slot="switch-control"
          data-variant={variant}
          className={rendered.className}
          {...props}
        >
          {rendered.children}
        </BaseSwitch.Root>
      </span>
    </label>
  );
}
