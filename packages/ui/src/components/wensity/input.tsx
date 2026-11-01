"use client";

import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { IconX } from "@tabler/icons-react";
import { cn } from "@traiv/ui/lib/cn";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Traiv compatibility: keep the input itself as the layout element. */
  nativeLayout?: boolean;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  inputSize?: InputSize;
  fullWidth?: boolean;
  containerClassName?: string;
  inputClassName?: string;
}

const fieldSizes: Record<InputSize, string> = {
  sm: "h-[var(--primitive-control-height-sm)] min-h-[var(--primitive-control-height-sm)]",
  md: "h-[var(--primitive-control-height-md)] min-h-[var(--primitive-control-height-md)]",
  lg: "h-[var(--primitive-control-height-lg)] min-h-[var(--primitive-control-height-lg)]",
};

const inputSizes: Record<InputSize, string> = {
  sm: "h-full px-3 text-xs",
  md: "h-full px-3.5 text-sm",
  lg: "h-full px-4 text-[15px]",
};

const iconBoxSizes: Record<InputSize, string> = {
  sm: "w-8",
  md: "w-9",
  lg: "w-10",
};

const trailingPad: Record<InputSize, string> = {
  sm: "pr-2",
  md: "pr-2.5",
  lg: "pr-3",
};

const fieldBase = cn(
  "wensity-input-shell group/input relative isolate flex w-full items-center overflow-hidden",
  // Face, rim, lit top edge and depth come from data-surface="field".
  "rounded-[var(--primitive-radius-control)]",
  "transition-[border-color,background-color,box-shadow] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease)]",
  "motion-reduce:transition-none",
);

const fieldInteractive = cn(
  "focus-within:border-[color-mix(in_srgb,var(--foreground)_24%,transparent)]",
  "focus-within:ring-2 focus-within:ring-[var(--primitive-ring)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--background)]",
);

const fieldError = cn(
  "border-[var(--primitive-destructive-border)]",
  "hover:border-[color-mix(in_srgb,var(--primitive-destructive)_65%,transparent)]",
  "focus-within:border-[var(--primitive-destructive)]",
  "focus-within:ring-2 focus-within:ring-[color-mix(in_srgb,var(--primitive-destructive)_45%,transparent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--background)]",
);

const fieldDisabled = cn("cursor-not-allowed opacity-45");

const fieldReadOnly = cn("[--surface-face:var(--muted)]");

const iconSlot = cn(
  "wensity-input-icon inline-flex self-stretch shrink-0 items-center justify-center",
  "bg-[color-mix(in_srgb,var(--foreground)_4%,var(--background))]",
  "text-[color-mix(in_srgb,var(--muted-foreground)_68%,transparent)]",
  "transition-[background-color,color,border-color] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease)]",
  "motion-reduce:transition-none",
  "group-hover/input:bg-[color-mix(in_srgb,var(--foreground)_5.5%,var(--background))]",
  "group-focus-within/input:text-[var(--muted-foreground)]",
  "group-data-[filled]/input:text-[var(--muted-foreground)]",
  "[&_svg]:size-4 [&_svg]:shrink-0",
);

const leadingIconSlot = cn(
  iconSlot,
  "border-r border-[color-mix(in_srgb,var(--foreground)_8%,transparent)]",
);

const trailingIconSlot = cn(
  iconSlot,
  "border-l border-[color-mix(in_srgb,var(--foreground)_8%,transparent)]",
);

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      nativeLayout = false,
      className,
      containerClassName,
      inputClassName,
      label,
      hint,
      error,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      inputSize = "md",
      fullWidth = true,
      disabled,
      readOnly,
      value,
      defaultValue,
      onChange,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const inputId = id ?? `wensity-input-${reactId}`;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue?.toString() ?? "",
    );
    const currentValue = isControlled ? value : uncontrolledValue;
    const hasValue = currentValue != null && String(currentValue).length > 0;
    const showClear = clearable && hasValue && !disabled && !readOnly;
    const describedBy = [ariaDescribedBy, errorId, hintId].filter(Boolean).join(" ") || undefined;

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) setUncontrolledValue(event.target.value);
        onChange?.(event);
      },
      [isControlled, onChange],
    );

    const handleClear = React.useCallback(() => {
      if (!isControlled) setUncontrolledValue("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onClear?.();
      if (typeof window !== "undefined") {
        window.requestAnimationFrame(() => inputRef.current?.focus());
      } else {
        inputRef.current?.focus();
      }
    }, [isControlled, onClear]);

    const handleClearPointerDown = React.useCallback(
      (event: React.PointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
      },
      [],
    );

    if (nativeLayout)
      return (
        <BaseInput
          ref={setRefs}
          id={inputId}
          value={value}
          defaultValue={isControlled ? undefined : defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={handleChange}
          data-surface="field"
          data-wensity-primitive=""
          className={cn(
            fieldBase,
            fieldSizes[inputSize],
            inputSizes[inputSize],
            "block w-full min-w-0 outline-none placeholder:text-[var(--primitive-text-placeholder)] pointer-coarse:min-h-11 pointer-coarse:text-base",
            className,
            inputClassName,
          )}
          {...props}
        />
      );
    return (
      <div
        data-wensity-primitive=""
        className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-fit", containerClassName)}
      >
        {label ? (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium leading-none tracking-[-0.01em] text-[var(--foreground)]"
          >
            {label}
          </label>
        ) : null}

        <div className={cn("relative", fullWidth ? "w-full" : "w-fit", className)}>
          <div
            data-wensity-input=""
            data-surface="field"
            data-filled={hasValue ? "" : undefined}
            data-error={error ? "" : undefined}
            data-readonly={readOnly ? "" : undefined}
            data-disabled={disabled ? "" : undefined}
            className={cn(
              fieldBase,
              !disabled && !readOnly && !error && fieldInteractive,
              error && fieldError,
              disabled && fieldDisabled,
              readOnly && fieldReadOnly,
              fieldSizes[inputSize],
            )}
          >
            {leftIcon ? (
              <span aria-hidden="true" className={cn(leadingIconSlot, iconBoxSizes[inputSize])}>
                {leftIcon}
              </span>
            ) : null}

            <BaseInput
              ref={setRefs}
              id={inputId}
              value={value}
              defaultValue={isControlled ? undefined : defaultValue}
              disabled={disabled}
              readOnly={readOnly}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              onChange={handleChange}
              className={cn(
                "wensity-input-control min-w-0 flex-1 border-0 bg-transparent text-[var(--foreground)] outline-none",
                // 16px on touch screens: iOS zooms into any field set smaller.
                "pointer-coarse:text-base",
                "placeholder:text-[var(--primitive-text-placeholder)]",
                "disabled:cursor-not-allowed",
                "read-only:cursor-default read-only:text-[var(--muted-foreground)]",
                inputSizes[inputSize],
                inputClassName,
              )}
              {...props}
            />

            {showClear ? (
              <span className={cn("inline-flex shrink-0 items-center", trailingPad[inputSize])}>
                <button
                  type="button"
                  aria-label="Clear"
                  onPointerDown={handleClearPointerDown}
                  onClick={handleClear}
                  className={cn(
                    "grid size-6 place-items-center rounded-[var(--primitive-radius-control-sm)]",
                    "text-[color-mix(in_srgb,var(--muted-foreground)_70%,transparent)]",
                    "transition-[color,background-color,translate] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease)]",
                    "motion-reduce:transition-none",
                    "hover:text-[var(--foreground)]",
                    "active:translate-y-px motion-reduce:active:translate-y-0",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--background)]",
                    "focus-visible:text-[var(--foreground)]",
                  )}
                >
                  <IconX aria-hidden="true" className="size-3.5" />
                </button>
              </span>
            ) : rightIcon ? (
              <span aria-hidden="true" className={cn(trailingIconSlot, iconBoxSizes[inputSize])}>
                {rightIcon}
              </span>
            ) : null}
          </div>
        </div>

        {error ? (
          <p
            id={errorId}
            className="text-[12px] leading-[1.45] text-[var(--primitive-destructive)]"
          >
            {error}
          </p>
        ) : hint ? (
          <p
            id={hintId}
            className="text-[12px] leading-[1.45] text-[var(--primitive-text-secondary)]"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
