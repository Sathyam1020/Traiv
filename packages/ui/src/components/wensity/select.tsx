"use client";

/**
 * Select — Base UI Select foundation (Phase 4B).
 * Form integration via Root name/required/disabled (hidden native input from Base UI).
 * D-17: onOpenChange → (open: boolean) => void; `modal` not exposed publicly
 * (always non-modal dropdown). data-open replaces data-state=open.
 */

import { Select as BaseSelect } from "@base-ui/react/select";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { cn } from "@traiv/ui/lib/cn";
import * as React from "react";

export type SelectSize = "sm" | "md" | "lg";
export type SelectVariant = "field" | "filled" | "command" | "pill";

export type SelectOption = {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  disabled?: boolean;
};

export type SelectGroup = {
  label?: React.ReactNode;
  options: SelectOption[];
};

export interface SelectProps {
  id?: string;
  options: SelectOption[] | SelectGroup[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  /**
   * Accessible name for a Select with no visible `label` — compact selects in
   * tables, toolbars, and icon-only contexts. Nearby column-header text is not
   * automatically associated with the trigger, so one of `label`,
   * `aria-label`, or `aria-labelledby` is required for a usable control.
   */
  "aria-label"?: string;
  /** Ids of existing visible text that names this Select. */
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-required"?: boolean | "true" | "false";
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  placeholder?: React.ReactNode;
  selectSize?: SelectSize;
  variant?: SelectVariant;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  /** Traiv compatibility: a compact filter may supply its own display label. */
  displayLabel?: React.ReactNode;
  containerClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

const triggerHeights: Record<SelectSize, string> = {
  sm: "min-h-[var(--primitive-control-height-sm)] px-3 py-1 text-xs",
  md: "min-h-[var(--primitive-control-height-md)] px-3.5 py-1 text-sm",
  lg: "min-h-[var(--primitive-control-height-lg)] px-4 py-1 text-[15px]",
};

const contentWidths: Record<SelectSize, string> = {
  sm: "min-w-[12rem]",
  md: "min-w-[15rem]",
  lg: "min-w-[17rem]",
};

const overlaySurfaceClass = "";

const focusRing = cn(
  "focus-visible:outline-none",
  "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
);

const triggerBase = cn(
  "group/select-trigger inline-flex items-center justify-between gap-2",
  "rounded-[var(--primitive-radius-control)] border text-left",
  "disabled:cursor-not-allowed disabled:opacity-45",
  "transition-[background-color,border-color,box-shadow,color] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease)]",
  "motion-reduce:transition-none",
  focusRing,
);

const variantClasses: Record<SelectVariant, string> = {
  // field + command are painted by data-surface="control" (sinks while open).
  field: cn(
    "text-[var(--foreground)]",
    "data-[popup-open]:border-[color-mix(in_srgb,var(--foreground)_24%,transparent)]",
  ),
  filled: cn(
    "border-transparent bg-[var(--primitive-surface-hover)] text-[var(--foreground)]",
    "hover:bg-[var(--primitive-surface-active)]",
  ),
  command: cn(
    "text-[var(--foreground)]",
    "data-[popup-open]:border-[color-mix(in_srgb,var(--foreground)_24%,transparent)]",
  ),
  pill: cn(
    "rounded-full border-[var(--border)] bg-[var(--primitive-surface-hover)] text-[var(--foreground)]",
    "hover:border-[color-mix(in_srgb,var(--foreground)_18%,transparent)]",
  ),
};

const popupMotionClass = cn(
  "origin-[var(--transform-origin)] transform-gpu outline-none",
  "transition-[opacity,scale] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.23,1,0.32,1))]",
  "data-[ending-style]:duration-[var(--primitive-motion-fast-exit)]",
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
  "data-[starting-style]:scale-[0.96] data-[ending-style]:scale-[0.96]",
  "motion-reduce:transition-none motion-reduce:data-[starting-style]:scale-100 motion-reduce:data-[ending-style]:scale-100",
);

function adaptOpenChange(
  onOpenChange?: (open: boolean) => void,
): ((open: boolean, details: unknown) => void) | undefined {
  if (!onOpenChange) return undefined;
  return (open) => onOpenChange(open);
}

function adaptValueChange(
  onValueChange?: (value: string) => void,
): ((value: string | null, eventDetails: unknown) => void) | undefined {
  if (!onValueChange) return undefined;
  return (value) => {
    if (value != null) onValueChange(value);
  };
}

function isGroupedOptions(options: SelectOption[] | SelectGroup[]): options is SelectGroup[] {
  return options[0] !== undefined && "options" in options[0];
}

function flattenOptions(options: SelectOption[] | SelectGroup[]) {
  return isGroupedOptions(options) ? options.flatMap((group) => group.options) : options;
}

export function Select({
  options,
  id,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  name,
  required,
  disabled,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  label,
  hint,
  error,
  placeholder = "Select option",
  selectSize = "md",
  variant = "field",
  fullWidth = true,
  leadingIcon,
  displayLabel,
  containerClassName,
  triggerClassName,
  contentClassName,
}: SelectProps) {
  const reactId = React.useId();
  const selectId = id ?? `wensity-select-${reactId}`;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const flattenedOptions = React.useMemo(() => flattenOptions(options), [options]);
  const selectedOption = flattenedOptions.find((option) => option.value === value);
  const describedBy = [ariaDescribedBy, errorId, hintId].filter(Boolean).join(" ") || undefined;

  const renderOption = (option: SelectOption) => (
    <BaseSelect.Item
      key={option.value}
      value={option.value}
      disabled={option.disabled}
      className={cn(
        "group/select-item relative flex min-h-9 cursor-default select-none items-center gap-3",
        "rounded-[var(--primitive-radius-item)] px-2.5 py-2 pr-9",
        "text-sm text-[var(--foreground)] outline-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        "data-[highlighted]:bg-[var(--primitive-surface-hover)]",
        "data-[selected]:bg-[var(--primitive-surface-selected)]",
      )}
    >
      {option.leading ? (
        <span
          data-surface="frame"
          className="grid size-7 shrink-0 place-items-center rounded-[var(--primitive-radius-control-sm)] text-[var(--muted-foreground)] [&_svg]:size-4"
        >
          {option.leading}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 items-baseline gap-2">
        <BaseSelect.ItemText className="min-w-0 truncate font-medium tracking-[-0.01em]">
          {option.label}
        </BaseSelect.ItemText>
        {option.description ? (
          <span className="min-w-0 flex-1 truncate text-[12px] leading-none text-[var(--muted-foreground)]">
            {option.description}
          </span>
        ) : null}
      </span>
      {option.trailing ? (
        <span className="mt-0.5 shrink-0 text-[12px] font-medium text-[var(--muted-foreground)]">
          {option.trailing}
        </span>
      ) : null}
      <BaseSelect.ItemIndicator className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]">
        <IconCheck stroke={1.75} className="size-4" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );

  const renderOptions = () => {
    if (isGroupedOptions(options)) {
      return options.map((group, groupIndex) => (
        <BaseSelect.Group key={groupIndex}>
          {group.label ? (
            <BaseSelect.GroupLabel className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted-foreground)]">
              {group.label}
            </BaseSelect.GroupLabel>
          ) : null}
          <div className="space-y-0.5">{group.options.map((option) => renderOption(option))}</div>
        </BaseSelect.Group>
      ));
    }

    return options.map((option) => renderOption(option));
  };

  return (
    <div
      className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-fit", containerClassName)}
    >
      {label ? (
        <label
          htmlFor={selectId}
          className="text-[13px] font-medium leading-none tracking-[-0.01em] text-[var(--foreground)]"
        >
          {label}
        </label>
      ) : null}

      <BaseSelect.Root
        data-wensity-primitive=""
        id={selectId}
        items={flattenedOptions}
        name={name}
        required={required}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        open={open}
        defaultOpen={defaultOpen}
        modal={false}
        onOpenChange={adaptOpenChange(onOpenChange)}
        onValueChange={adaptValueChange(onValueChange)}
      >
        <BaseSelect.Trigger
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-invalid={ariaInvalid ?? (error ? true : undefined)}
          aria-describedby={describedBy}
          aria-required={ariaRequired ?? required ?? undefined}
          data-surface={variant === "field" || variant === "command" ? "control" : undefined}
          className={cn(
            triggerBase,
            variantClasses[variant],
            triggerHeights[selectSize],
            fullWidth ? "w-full" : "w-fit",
            error &&
              "border-[var(--primitive-destructive-border)] data-[popup-open]:border-[var(--primitive-destructive)]",
            triggerClassName,
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2.5">
            {leadingIcon || selectedOption?.leading ? (
              <span className="grid size-5 shrink-0 place-items-center text-[var(--muted-foreground)] [&_svg]:size-4">
                {leadingIcon ?? selectedOption?.leading}
              </span>
            ) : null}
            <BaseSelect.Value
              placeholder={placeholder}
              className={cn(
                "min-w-0 flex-1 truncate data-[placeholder]:text-[var(--primitive-text-placeholder)]",
              )}
            >
              {(selected) => {
                if (displayLabel) return displayLabel;
                const match =
                  selectedOption ??
                  flattenedOptions.find(
                    (option) => option.value === selected || option.label === selected,
                  );
                if (!match) return placeholder;
                if (variant === "command" && match.description) {
                  return (
                    <>
                      <span className="block truncate font-medium tracking-[-0.015em] text-[var(--foreground)]">
                        {match.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] leading-none text-[var(--muted-foreground)]">
                        {match.description}
                      </span>
                    </>
                  );
                }
                return (
                  <span className="block truncate font-medium tracking-[-0.015em]">
                    {match.label}
                  </span>
                );
              }}
            </BaseSelect.Value>
          </span>
          <BaseSelect.Icon className="flex shrink-0 text-[var(--muted-foreground)]">
            <IconChevronDown
              stroke={1.75}
              className="size-4 transition-transform duration-[var(--primitive-motion-moderate)] ease-[var(--primitive-ease)] group-data-[popup-open]/select-trigger:rotate-180 motion-reduce:transition-none"
            />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>

        <BaseSelect.Portal>
          <BaseSelect.Positioner
            sideOffset={8}
            collisionPadding={12}
            alignItemWithTrigger={false}
            className="z-[var(--primitive-z-popover)] outline-none"
          >
            <BaseSelect.Popup
              data-surface="overlay"
              data-wensity-primitive=""
              className={cn(
                overlaySurfaceClass,
                "relative max-h-[min(22rem,var(--available-height))] w-[var(--anchor-width)] overflow-x-hidden overflow-y-auto rounded-[var(--primitive-radius-popup)] p-1.5 text-[var(--foreground)]",
                contentWidths[selectSize],
                popupMotionClass,
                contentClassName,
              )}
            >
              <BaseSelect.List className="outline-none">{renderOptions()}</BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>

      {hint ? (
        <p id={hintId} className="text-[12px] leading-[1.45] text-[var(--muted-foreground)]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          className="text-[12px] font-medium leading-[1.45] text-[var(--primitive-destructive)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
