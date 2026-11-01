"use client";

import * as React from "react";
import { LayoutGroup, motion, MotionConfig, useReducedMotion } from "motion/react";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { cn } from "@traiv/ui/lib/cn";

/**
 * CSS rules for RadioGroup animation slots. Re-keyed to Base UI
 * `data-checked` / `data-unchecked` attributes.
 *
 * These rules ship in the Wensity token CSS block the CLI writes into your
 * stylesheet, so this file injects no runtime `<style>` tag.
 */

export type RadioGroupSize = "sm" | "md" | "lg";
export type RadioGroupVariant = "orb" | "command" | "segment" | "tile";
export type RadioGroupOrientation = "vertical" | "horizontal";

export type RadioGroupChangeHandler = (value: string, eventDetails?: unknown) => void;

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: RadioGroupChangeHandler;
  name?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  radioSize?: RadioGroupSize;
  variant?: RadioGroupVariant;
  orientation?: RadioGroupOrientation;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface RadioOptionProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseRadio.Root>,
    "className" | "render" | "value" | "children"
  > {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  radioSize?: RadioGroupSize;
  variant?: RadioGroupVariant;
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
  controlClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
}

export interface RadioCardProps extends RadioOptionProps {
  eyebrow?: React.ReactNode;
}

type RadioGroupContextValue = {
  value?: string;
  radioSize: RadioGroupSize;
  variant: RadioGroupVariant;
  disabled?: boolean;
  error?: React.ReactNode;
  orbIndicatorLayoutId?: string;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

const controlSizes: Record<RadioGroupSize, string> = {
  sm: "size-4",
  md: "size-[18px]",
  lg: "size-5",
};

const segmentSizes: Record<RadioGroupSize, string> = {
  sm: "min-h-8 px-3 text-[12px]",
  md: "min-h-9 px-3.5 text-[13px]",
  lg: "min-h-10 px-4 text-sm",
};

const labelSizes: Record<RadioGroupSize, string> = {
  sm: "text-[13px]",
  md: "text-sm",
  lg: "text-[15px]",
};

const rowGap: Record<RadioGroupSize, string> = {
  sm: "gap-2.5",
  md: "gap-3",
  lg: "gap-3.5",
};

const controlOffset: Record<RadioGroupSize, string> = {
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

const smoothSurface =
  "transition-[background-color,border-color,box-shadow,color,opacity] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.16,1,0.3,1))] motion-reduce:transition-none";

/** The moderate motion tier (--primitive-motion-moderate): indicators glide, no bounce. */
const radioIndicatorTransition = { type: "spring", duration: 0.16, bounce: 0 } as const;

function getOptionValue(child: React.ReactNode): string | undefined {
  if (!React.isValidElement(child)) return undefined;
  const props = child.props as { value?: string };
  return typeof props.value === "string" ? props.value : undefined;
}

function getSegmentIndex(children: React.ReactNode, selectedValue?: string) {
  const values = React.Children.toArray(children)
    .map(getOptionValue)
    .filter((value): value is string => value !== undefined);

  const selectedIndex = values.findIndex((value) => value === selectedValue);
  return {
    count: values.length,
    index: selectedIndex >= 0 ? selectedIndex : 0,
  };
}

function RadioOrbMark({
  checked,
  radioSize,
  orbIndicatorLayoutId,
}: {
  checked: boolean;
  radioSize: RadioGroupSize;
  orbIndicatorLayoutId?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <BaseRadio.Indicator
      keepMounted
      data-slot="radio-orb-shell"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full border",
        "border-[var(--border-strong)] bg-[var(--primitive-field-face)]",
        focusRing,
        "data-checked:border-[var(--primitive-control-solid)]",
        "data-checked:bg-[color-mix(in_srgb,var(--primitive-control-solid)_8%,transparent)]",
        controlSizes[radioSize],
        radioSize === "sm" && smTouchTarget,
      )}
    >
      {checked && orbIndicatorLayoutId ? (
        <motion.span
          layoutId={orbIndicatorLayoutId}
          transition={reduceMotion ? { duration: 0 } : radioIndicatorTransition}
          className="absolute inset-[5px] rounded-full bg-[var(--primitive-control-solid)]"
        />
      ) : null}
    </BaseRadio.Indicator>
  );
}

function RadioCommandMark({ radioSize }: { radioSize: RadioGroupSize }) {
  return (
    <BaseRadio.Indicator
      keepMounted
      data-radio-mark=""
      data-slot="radio-command-shell"
      className={cn(
        "grid rounded-full border",
        "border-[var(--border-strong)] bg-[var(--primitive-field-face)]",
        focusRing,
        "data-checked:border-[var(--primitive-control-solid)]",
        "data-checked:bg-[var(--primitive-control-solid)]",
        "data-checked:text-[var(--primitive-control-solid-foreground)]",
        controlSizes[radioSize],
        radioSize === "sm" && smTouchTarget,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        data-slot="radio-command-check"
        className="m-auto size-3 transform-gpu text-current"
      >
        <path
          data-slot="radio-command-check-path"
          d="M3.4 8.2 6.45 11.25 12.6 4.75"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
        />
      </svg>
    </BaseRadio.Indicator>
  );
}

function useRadioGroupContext(component: string) {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error(`${component} must be used inside RadioGroup.`);
  }
  return context;
}

/**
 * Base UI–backed RadioGroup. Wraps children in `BaseRadioGroup` for keyboard
 * roving/focus while exposing Wensity variant/size/error via context.
 */
export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  name,
  label,
  description,
  error,
  radioSize = "md",
  variant = "orb",
  orientation = "vertical",
  disabled,
  children,
  className,
  ...props
}: RadioGroupProps) {
  const reactId = React.useId();
  const orbIndicatorLayoutId = React.useId();
  const groupName = name ?? `radio-group-${reactId}`;
  const descriptionId = description ? `${groupName}-description` : undefined;
  const errorId = error ? `${groupName}-error` : undefined;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const selectedValue = isControlled ? value : uncontrolledValue;

  const reduceMotion = useReducedMotion();

  const handleValueChange = React.useCallback(
    (nextValue: unknown, eventDetails: unknown) => {
      const next = typeof nextValue === "string" ? nextValue : "";
      if (!isControlled) setUncontrolledValue(next);
      onValueChange?.(next, eventDetails);
    },
    [isControlled, onValueChange],
  );

  const context = React.useMemo<RadioGroupContextValue>(
    () => ({
      value: selectedValue,
      radioSize,
      variant,
      disabled,
      error,
      orbIndicatorLayoutId: variant === "orb" ? orbIndicatorLayoutId : undefined,
    }),
    [disabled, error, orbIndicatorLayoutId, radioSize, selectedValue, variant],
  );

  const segmentLayout = variant === "segment" ? getSegmentIndex(children, selectedValue) : null;

  const list = (
    <BaseRadioGroup
      data-wensity-primitive=""
      name={groupName}
      {...(isControlled ? { value } : { defaultValue })}
      onValueChange={handleValueChange}
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      data-slot="radio-group-list"
      data-orientation={orientation}
      data-surface={variant === "segment" ? "well" : undefined}
      className={cn(
        orientation === "horizontal" ? "flex flex-wrap items-stretch gap-2.5" : "space-y-2",
        variant === "segment" &&
          cn(
            "relative isolate overflow-hidden rounded-[var(--primitive-radius-control)] p-1",
            orientation === "horizontal" ? "flex w-full gap-1" : "flex flex-col gap-1",
          ),
      )}
      style={
        variant === "segment" && segmentLayout
          ? ({
              "--radio-segment-count": segmentLayout.count,
              "--radio-segment-index": segmentLayout.index,
            } as React.CSSProperties)
          : undefined
      }
    >
      {variant === "segment" && segmentLayout && segmentLayout.count > 0 ? (
        <span
          aria-hidden="true"
          data-slot="radio-segment-indicator"
          data-orientation={orientation}
          className={cn(
            "pointer-events-none absolute rounded-[var(--primitive-radius-item)]",
            "bg-[var(--primitive-surface-selected)]",
            "shadow-[0_1px_2px_rgba(0,0,0,0.07),0_0_0_1px_color-mix(in_srgb,var(--foreground)_8%,transparent)]",
            "dark:shadow-[0_1px_2px_rgba(0,0,0,0.36),0_0_0_1px_color-mix(in_srgb,var(--foreground)_12%,transparent)]",
            orientation === "horizontal" ? "top-1 bottom-1 left-1" : "left-1 right-1 top-1",
          )}
          style={
            orientation === "horizontal"
              ? {
                  width:
                    "calc((100% - 0.5rem - (var(--radio-segment-count) - 1) * 0.25rem) / var(--radio-segment-count))",
                  transform:
                    "translate3d(calc(var(--radio-segment-index) * (100% + 0.25rem)), 0, 0)",
                }
              : {
                  height:
                    "calc((100% - 0.5rem - (var(--radio-segment-count) - 1) * 0.25rem) / var(--radio-segment-count))",
                  transform:
                    "translate3d(0, calc(var(--radio-segment-index) * (100% + 0.25rem)), 0)",
                }
          }
        />
      ) : null}
      {children}
    </BaseRadioGroup>
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <fieldset
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
        aria-invalid={error ? true : undefined}
        disabled={disabled}
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
        {variant === "orb" ? (
          <MotionConfig transition={reduceMotion ? { duration: 0 } : radioIndicatorTransition}>
            <LayoutGroup id={`radio-orb-group-${reactId}`}>{list}</LayoutGroup>
          </MotionConfig>
        ) : (
          list
        )}
        {error ? (
          <p
            id={errorId}
            className="text-[12px] leading-[1.45] font-medium text-[var(--primitive-destructive)]"
          >
            {error}
          </p>
        ) : null}
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

export const RadioOption = React.forwardRef<HTMLButtonElement, RadioOptionProps>(
  (
    {
      value,
      label,
      description,
      leading,
      trailing,
      radioSize,
      variant,
      fullWidth = true,
      disabled,
      className,
      containerClassName,
      controlClassName,
      labelClassName,
      descriptionClassName,
      inputRef,
      ...props
    },
    ref,
  ) => {
    const context = useRadioGroupContext("RadioOption");
    const optionSize = radioSize ?? context.radioSize;
    const optionVariant = variant ?? context.variant;
    const optionDisabled = disabled || context.disabled;
    const checked = context.value === value;
    const optionId = React.useId();
    const descriptionId = description ? `radio-option-${optionId}-description` : undefined;

    if (optionVariant === "segment") {
      return (
        <BaseRadio.Root
          ref={ref}
          value={value}
          disabled={optionDisabled}
          inputRef={inputRef}
          aria-describedby={descriptionId}
          aria-invalid={context.error ? true : undefined}
          data-slot="radio-option"
          className={cn(
            "group/radio relative z-[1] inline-flex cursor-pointer select-none items-center justify-center rounded-[var(--primitive-radius-item)]",
            "font-medium leading-none tracking-[-0.01em]",
            "text-[var(--muted-foreground)]",
            "hover:text-[var(--foreground)]",
            focusRing,
            "data-checked:text-[var(--foreground)]",
            optionDisabled && "cursor-not-allowed opacity-45",
            fullWidth && "flex-1",
            segmentSizes[optionSize],
            containerClassName,
            className,
          )}
          {...props}
        >
          <span data-slot="radio-segment-label" className="truncate">
            {label}
          </span>
        </BaseRadio.Root>
      );
    }

    if (optionVariant === "command") {
      return (
        <label
          data-slot="radio-option"
          data-radio-card
          data-surface="frame"
          className={cn(
            "group/radio flex cursor-pointer select-none items-start p-3.5",
            "relative isolate overflow-hidden rounded-[var(--primitive-radius-surface)]",
            smoothSurface,
            "has-[[data-checked]]:[--surface-rim:color-mix(in_srgb,var(--foreground)_22%,transparent)] has-[[data-checked]]:[--surface-rim-top:color-mix(in_srgb,var(--foreground)_22%,transparent)] has-[[data-checked]]:[--surface-tint:var(--primitive-tint-hover)]",
            !optionDisabled &&
              "hover:border-[color-mix(in_srgb,var(--foreground)_16%,transparent)]",
            optionDisabled && "cursor-not-allowed opacity-45",
            fullWidth ? "w-full" : "w-fit",
            rowGap[optionSize],
            containerClassName,
            className,
          )}
        >
          {leading ? (
            <span
              data-surface="frame"
              className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[var(--primitive-radius-control-sm)] text-[var(--muted-foreground)] [&_svg]:size-4"
            >
              {leading}
            </span>
          ) : null}
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block font-medium leading-snug tracking-[-0.015em] text-[var(--foreground)]",
                labelSizes[optionSize],
                labelClassName,
              )}
            >
              {label}
            </span>
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
          </span>
          {trailing ? (
            <span className="shrink-0 pt-0.5 text-[12px] font-medium text-[var(--muted-foreground)]">
              {trailing}
            </span>
          ) : null}
          <span className={cn("shrink-0", controlOffset[optionSize], controlClassName)}>
            <BaseRadio.Root
              ref={ref}
              value={value}
              disabled={optionDisabled}
              inputRef={inputRef}
              aria-describedby={descriptionId}
              aria-invalid={context.error ? true : undefined}
              className="inline-flex"
              {...props}
            >
              <RadioCommandMark radioSize={optionSize} />
            </BaseRadio.Root>
          </span>
        </label>
      );
    }

    return (
      <label
        data-slot="radio-option"
        className={cn(
          "group/radio relative flex cursor-pointer select-none items-start",
          rowGap[optionSize],
          fullWidth ? "w-full" : "w-fit",
          optionDisabled && "cursor-not-allowed opacity-45",
          containerClassName,
          className,
        )}
      >
        <span className={cn("shrink-0", controlOffset[optionSize], controlClassName)}>
          <BaseRadio.Root
            ref={ref}
            value={value}
            disabled={optionDisabled}
            inputRef={inputRef}
            aria-describedby={descriptionId}
            aria-invalid={context.error ? true : undefined}
            className="inline-flex"
            {...props}
          >
            <RadioOrbMark
              checked={checked}
              radioSize={optionSize}
              orbIndicatorLayoutId={context.orbIndicatorLayoutId}
            />
          </BaseRadio.Root>
        </span>
        <span className="min-w-0 flex-1 pt-px">
          <span
            className={cn(
              "block font-medium leading-snug tracking-[-0.015em] text-[var(--foreground)]",
              labelSizes[optionSize],
              labelClassName,
            )}
          >
            {label}
          </span>
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
        </span>
        {trailing ? (
          <span className="shrink-0 pt-0.5 text-[12px] font-medium text-[var(--muted-foreground)]">
            {trailing}
          </span>
        ) : null}
      </label>
    );
  },
);

RadioOption.displayName = "RadioOption";

export const RadioCard = React.forwardRef<HTMLButtonElement, RadioCardProps>(
  (
    {
      eyebrow,
      leading,
      trailing,
      value,
      label,
      description,
      disabled,
      radioSize = "md",
      variant: _variant,
      fullWidth = true,
      containerClassName,
      controlClassName: _controlClassName,
      className,
      labelClassName,
      descriptionClassName,
      inputRef,
      ...props
    },
    ref,
  ) => {
    const context = useRadioGroupContext("RadioCard");
    const checked = context.value === value;
    const optionDisabled = disabled || context.disabled;
    const optionId = React.useId();
    const descriptionId = description ? `radio-card-${optionId}-description` : undefined;

    return (
      <label
        data-radio-card
        data-checked={checked ? "" : undefined}
        data-unchecked={!checked ? "" : undefined}
        data-slot="radio-card-shell"
        data-surface="frame"
        className={cn(
          "group/radio-card relative block cursor-pointer select-none p-4",
          "isolate overflow-hidden rounded-[var(--primitive-radius-surface)]",
          smoothSurface,
          "data-checked:[--surface-rim:color-mix(in_srgb,var(--foreground)_28%,transparent)] data-checked:[--surface-rim-top:color-mix(in_srgb,var(--foreground)_28%,transparent)] data-checked:[--surface-tint:var(--primitive-tint-hover)]",
          !optionDisabled && "hover:border-[color-mix(in_srgb,var(--foreground)_18%,transparent)]",
          optionDisabled && "cursor-not-allowed opacity-45",
          fullWidth ? "w-full" : "w-fit",
          containerClassName,
          className,
        )}
      >
        <BaseRadio.Root
          ref={ref}
          value={value}
          disabled={optionDisabled}
          inputRef={inputRef}
          aria-describedby={descriptionId}
          aria-invalid={context.error ? true : undefined}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "pointer-events-none absolute right-3 top-3 grid size-5 place-items-center rounded-full",
            "border border-[var(--border-strong)] bg-[var(--primitive-field-face)]",
            checked &&
              "border-[var(--primitive-control-solid)] bg-[var(--primitive-control-solid)] text-[var(--primitive-control-solid-foreground)]",
          )}
          data-slot="radio-card-check-shell"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            data-slot="radio-card-check"
            className="size-3 transform-gpu"
            fill="none"
          >
            <path
              data-slot="radio-card-check-path"
              d="M3.4 8.2 6.45 11.25 12.6 4.75"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
            />
          </svg>
        </div>
        {eyebrow ? (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted-foreground)]">
            {eyebrow}
          </p>
        ) : null}
        {leading ? (
          <div
            data-surface="frame"
            className="mb-3 grid size-9 place-items-center rounded-[var(--primitive-radius-control-sm)] text-[var(--foreground)] [&_svg]:size-[18px]"
          >
            {leading}
          </div>
        ) : null}
        <span className="block min-w-0 pr-7">
          <span
            className={cn(
              "block font-medium leading-snug tracking-[-0.015em] text-[var(--foreground)]",
              labelSizes[radioSize],
              labelClassName,
            )}
          >
            {label}
          </span>
          {description ? (
            <span
              id={descriptionId}
              className={cn(
                "mt-1.5 block text-[12px] leading-[1.45] text-[var(--muted-foreground)]",
                descriptionClassName,
              )}
            >
              {description}
            </span>
          ) : null}
          {trailing ? (
            <span
              data-surface="frame"
              className="mt-3 inline-flex items-center rounded-[var(--primitive-radius-control-sm)] px-2 py-0.5 text-[11px] font-medium tracking-[0.01em] text-[var(--muted-foreground)]"
            >
              {trailing}
            </span>
          ) : null}
        </span>
      </label>
    );
  },
);

RadioCard.displayName = "RadioCard";
