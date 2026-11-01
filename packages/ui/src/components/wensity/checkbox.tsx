"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { cn } from "@traiv/ui/lib/cn";

/**
 * CSS rules for Checkbox mark animation slots. Re-keyed to Base UI
 * `data-checked` / `data-unchecked` / `data-indeterminate` attributes.
 *
 * These rules ship in the Wensity token CSS block the CLI writes into your
 * stylesheet, so this file injects no runtime `<style>` tag.
 */

export type CheckboxCheckedState = boolean | "indeterminate";
export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxVariant = "classic" | "soft";

export type CheckboxChangeHandler = (checked: boolean, eventDetails?: unknown) => void;

export interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>,
    "className" | "onCheckedChange" | "render" | "checked" | "defaultChecked" | "indeterminate"
  > {
  checked?: CheckboxCheckedState;
  defaultChecked?: CheckboxCheckedState;
  onCheckedChange?: CheckboxChangeHandler;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  checkboxSize?: CheckboxSize;
  variant?: CheckboxVariant;
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
  controlClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
}

export interface CheckboxGroupProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactNode;
}

export interface CheckboxCardProps extends CheckboxProps {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

const controlSizes: Record<CheckboxSize, string> = {
  sm: "size-[15px]",
  md: "size-[18px]",
  lg: "size-[21px]",
};

const rowGap: Record<CheckboxSize, string> = {
  sm: "gap-2.5",
  md: "gap-3",
  lg: "gap-3.5",
};

const labelSizes: Record<CheckboxSize, string> = {
  sm: "text-[13px]",
  md: "text-sm",
  lg: "text-[15px]",
};

const controlOffset: Record<CheckboxSize, string> = {
  sm: "mt-px",
  md: "mt-0.5",
  lg: "mt-0.5",
};

const focusRing = cn(
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
);

/** ≥44px touch target for small variant via pseudo overlay (PRIM-A11Y-004). */
const smTouchTarget =
  "before:absolute before:inset-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:h-11 before:w-11 before:content-['']";

const smoothControlTransition =
  "transition-[background-color,border-color,box-shadow,opacity] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.16,1,0.3,1))] motion-reduce:transition-none";

const checkPath = "M3.25 8.1 6.35 11.2 12.75 4.6";

const checkSizes: Record<CheckboxSize, string> = {
  sm: "size-2.5",
  md: "size-3",
  lg: "size-3.5",
};

function getControlClasses({
  variant,
  active,
  disabled,
  error,
  checkboxSize,
}: {
  variant: CheckboxVariant;
  active: boolean;
  disabled?: boolean;
  error?: React.ReactNode;
  checkboxSize: CheckboxSize;
}) {
  if (variant === "soft") {
    return cn(
      "relative grid shrink-0 place-items-center rounded-[var(--primitive-radius-control-sm)] border",
      smoothControlTransition,
      "border-[var(--border-strong)] bg-[color-mix(in_srgb,var(--foreground)_3.5%,var(--background))]",
      "shadow-[0_1px_1px_rgba(0,0,0,0.03)]",
      "dark:shadow-[0_1px_2px_rgba(0,0,0,0.28)]",
      focusRing,
      !disabled &&
        "group-hover/checkbox:border-[color-mix(in_srgb,var(--foreground)_20%,transparent)] group-hover/checkbox:bg-[color-mix(in_srgb,var(--foreground)_6%,var(--background))]",
      active &&
        cn(
          "border-[color-mix(in_srgb,var(--foreground)_32%,transparent)]",
          "bg-[color-mix(in_srgb,var(--foreground)_13%,var(--background))]",
          "shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_color-mix(in_srgb,var(--foreground)_8%,transparent)]",
          "dark:bg-[color-mix(in_srgb,var(--foreground)_18%,var(--background))]",
          "dark:shadow-[0_1px_3px_rgba(0,0,0,0.32),0_0_0_1px_color-mix(in_srgb,var(--foreground)_12%,transparent)]",
        ),
      error &&
        cn(
          "border-[var(--primitive-destructive-border)]",
          "bg-[var(--primitive-destructive-surface)]",
          "shadow-[0_0_0_1px_var(--primitive-destructive-border)]",
        ),
      disabled && "cursor-not-allowed opacity-45",
      controlSizes[checkboxSize],
      checkboxSize === "sm" && smTouchTarget,
    );
  }

  return cn(
    "relative grid shrink-0 place-items-center overflow-hidden rounded-[var(--primitive-radius-control-sm)] border",
    smoothControlTransition,
    "border-[var(--border-strong)] bg-[var(--primitive-field-face)]",
    "shadow-[0_1px_1px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)]",
    "dark:shadow-[0_1px_2px_rgba(0,0,0,0.32),0_0_0_1px_rgba(255,255,255,0.04)]",
    focusRing,
    !disabled &&
      "group-hover/checkbox:border-[color-mix(in_srgb,var(--foreground)_26%,transparent)]",
    active &&
      cn(
        "border-[var(--primitive-control-solid)]",
        "bg-[var(--primitive-control-solid)]",
        "shadow-[0_1px_2px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]",
        "dark:shadow-[0_1px_3px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.08)]",
      ),
    error && "border-[var(--primitive-destructive-border)]",
    disabled && "cursor-not-allowed opacity-45",
    controlSizes[checkboxSize],
    checkboxSize === "sm" && smTouchTarget,
  );
}

function CheckboxMark({
  variant,
  indeterminate,
  checkboxSize,
}: {
  variant: CheckboxVariant;
  indeterminate: boolean;
  checkboxSize: CheckboxSize;
}) {
  if (indeterminate) {
    return (
      <span
        aria-hidden="true"
        data-slot="radio-command-check"
        className={cn(
          "rounded-full transform-gpu origin-center",
          variant === "classic" && "relative z-[1]",
          variant === "classic"
            ? "bg-[var(--primitive-control-solid-foreground)]"
            : "bg-[var(--foreground)]",
          checkboxSize === "sm" && "h-0.5 w-2",
          checkboxSize === "md" && "h-0.5 w-2.5",
          checkboxSize === "lg" && "h-[3px] w-3",
        )}
      />
    );
  }

  if (variant === "soft") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        className={cn(checkSizes[checkboxSize], "text-[var(--foreground)] transform-gpu")}
      >
        <path
          data-slot="radio-command-check-path"
          d={checkPath}
          pathLength={1}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={cn(
        checkSizes[checkboxSize],
        "relative z-[1] text-[var(--primitive-control-solid-foreground)] transform-gpu",
      )}
    >
      <path
        data-slot="radio-command-check-path"
        d={checkPath}
        pathLength={1}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Base UI–backed Checkbox. Renders `BaseCheckbox.Root` with a hidden `<input>`
 * and exposes indeterminate through the native Base UI `indeterminate` prop.
 * Emits `data-checked` / `data-unchecked` / `data-indeterminate` / `data-disabled`
 * for CSS state hooks.
 */
export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
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
      checkboxSize = "md",
      variant = "classic",
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
    const checkboxId = id ?? `checkbox-${reactId}`;
    const descriptionId = description ? `${checkboxId}-description` : undefined;
    const errorId = error ? `${checkboxId}-error` : undefined;
    const isControlled = checked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] =
      React.useState<CheckboxCheckedState>(defaultChecked);
    const currentChecked = isControlled ? checked : uncontrolledChecked;
    const isChecked = currentChecked === true;
    const isIndeterminate = currentChecked === "indeterminate";
    const describedBy =
      [ariaDescribedBy, errorId, descriptionId].filter(Boolean).join(" ") || undefined;

    const handleCheckedChange = React.useCallback(
      (next: boolean, eventDetails: unknown) => {
        if (!isControlled) setUncontrolledChecked(next);
        onCheckedChange?.(next, eventDetails);
      },
      [isControlled, onCheckedChange],
    );

    const isActive = isChecked || isIndeterminate;

    return (
      <label
        data-checkbox=""
        data-variant={variant}
        data-checked={isChecked ? "" : undefined}
        data-unchecked={!isActive ? "" : undefined}
        data-indeterminate={isIndeterminate ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        data-error={error ? "" : undefined}
        htmlFor={checkboxId}
        className={cn(
          "group/checkbox relative flex cursor-pointer select-none items-start",
          rowGap[checkboxSize],
          fullWidth ? "w-full" : "w-fit",
          disabled && "cursor-not-allowed",
          containerClassName,
          className,
        )}
      >
        <BaseCheckbox.Root
          data-wensity-primitive=""
          data-radio-mark=""
          ref={ref}
          id={checkboxId}
          checked={isChecked}
          indeterminate={isIndeterminate}
          disabled={disabled}
          onCheckedChange={handleCheckedChange}
          inputRef={inputRef}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          data-slot="checkbox-control"
          className={cn(
            controlOffset[checkboxSize],
            getControlClasses({
              variant,
              active: isActive,
              disabled,
              error,
              checkboxSize,
            }),
            controlClassName,
          )}
          {...props}
        >
          <BaseCheckbox.Indicator keepMounted className="grid place-items-center">
            <CheckboxMark
              variant={variant}
              indeterminate={isIndeterminate}
              checkboxSize={checkboxSize}
            />
          </BaseCheckbox.Indicator>
        </BaseCheckbox.Root>

        {label || description || error ? (
          <span className="min-w-0 flex-1 pt-px">
            {label ? (
              <span
                className={cn(
                  "block font-medium leading-snug tracking-[-0.015em] text-[var(--foreground)]",
                  labelSizes[checkboxSize],
                  disabled && "text-[var(--muted-foreground)]",
                  labelClassName,
                )}
              >
                {label}
              </span>
            ) : null}
            {description ? (
              <span
                id={descriptionId}
                className={cn(
                  "mt-1 block text-[12px] leading-[1.45] text-[var(--muted-foreground)]",
                  descriptionClassName,
                )}
              >
                {description}
              </span>
            ) : null}
            {error ? (
              <span
                id={errorId}
                className="mt-1.5 block text-[12px] leading-[1.45] font-medium text-[var(--primitive-destructive)]"
              >
                {error}
              </span>
            ) : null}
          </span>
        ) : null}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

export function CheckboxGroup({
  label,
  description,
  error,
  children,
  className,
  ...props
}: CheckboxGroupProps) {
  const reactId = React.useId();
  const descriptionId = description ? `checkbox-group-${reactId}-description` : undefined;
  const errorId = error ? `checkbox-group-${reactId}-error` : undefined;

  return (
    <fieldset
      data-wensity-primitive=""
      aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
      className={cn("space-y-3.5", className)}
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
            <p
              id={descriptionId}
              className="text-[12px] leading-[1.45] text-[var(--muted-foreground)]"
            >
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="space-y-1">{children}</div>
      {error ? (
        <p
          id={errorId}
          className="text-[12px] leading-[1.45] font-medium text-[var(--primitive-destructive)]"
        >
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function CheckboxCard({
  leading,
  trailing,
  className,
  containerClassName,
  checkboxSize = "md",
  variant = "soft",
  id,
  disabled,
  ...props
}: CheckboxCardProps) {
  const reactId = React.useId();
  const checkboxId = id ?? `checkbox-card-${reactId}`;

  return (
    <div
      // A selectable frame: the rim firms up and the face tints when checked.
      data-surface="frame"
      className={cn(
        "group/checkbox-card relative isolate overflow-hidden rounded-[var(--primitive-radius-surface)]",
        !disabled &&
          "transition-[border-color,background-color] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.22,1,0.36,1))] motion-reduce:transition-none",
        "has-[[data-checked]]:[--surface-rim:color-mix(in_srgb,var(--foreground)_22%,transparent)] has-[[data-checked]]:[--surface-rim-top:color-mix(in_srgb,var(--foreground)_22%,transparent)] has-[[data-checked]]:[--surface-tint:var(--primitive-tint-hover)]",
        disabled && "cursor-not-allowed opacity-45",
        className,
      )}
    >
      <div className="flex items-start gap-3 p-4">
        {leading ? (
          <div
            className={cn(
              "mt-0.5 grid size-9 shrink-0 place-items-center rounded-[var(--primitive-radius-control-sm)] border border-[var(--border)]",
              "bg-[color-mix(in_srgb,var(--foreground)_3%,var(--background))] text-[var(--muted-foreground)]",
              "transition-[border-color,background-color,color] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.16,1,0.3,1))] motion-reduce:transition-none",
              "group-has-[[data-checked]]/checkbox-card:border-[color-mix(in_srgb,var(--foreground)_14%,transparent)]",
              "group-has-[[data-checked]]/checkbox-card:bg-[color-mix(in_srgb,var(--foreground)_7%,var(--background))]",
              "group-has-[[data-checked]]/checkbox-card:text-[var(--foreground)]",
              "[&_svg]:size-[17px]",
            )}
          >
            {leading}
          </div>
        ) : null}
        <Checkbox
          {...props}
          id={checkboxId}
          disabled={disabled}
          checkboxSize={checkboxSize}
          variant={variant}
          containerClassName={cn("flex-1", containerClassName)}
        />
        {trailing ? (
          <div className="shrink-0 pt-0.5">
            <span
              data-surface="frame"
              className="inline-flex items-center rounded-[var(--primitive-radius-control-sm)] px-2 py-0.5 text-[11px] font-medium tracking-[0.01em] text-[var(--muted-foreground)]"
            >
              {trailing}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
