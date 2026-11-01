"use client";

import * as React from "react";
import { IconFileText } from "@tabler/icons-react";
import { cn } from "@traiv/ui/lib/cn";

export type TextareaSize = "sm" | "md" | "lg";
export type TextareaVariant = "default" | "filled" | "ghost";
export type TextareaResize = "none" | "vertical" | "both";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  textareaSize?: TextareaSize;
  variant?: TextareaVariant;
  resize?: TextareaResize;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  showCount?: boolean;
  fullWidth?: boolean;
  containerClassName?: string;
  textareaClassName?: string;
}

const textareaSizes: Record<TextareaSize, string> = {
  sm: "min-h-[5.5rem] rounded-[var(--primitive-radius-control)] px-4 py-3 text-xs leading-5",
  md: "min-h-[7.5rem] rounded-[var(--primitive-radius-control)] px-4 py-4 text-sm leading-6",
  lg: "min-h-[9.5rem] rounded-[var(--primitive-radius-control)] px-5 py-4 text-[15px] leading-6",
};

const countPadding: Record<TextareaSize, string> = {
  sm: "pb-9",
  md: "pb-10",
  lg: "pb-11",
};

const resizeClasses: Record<TextareaResize, string> = {
  none: "resize-none",
  vertical: "resize-y",
  both: "resize",
};

const variantClasses: Record<TextareaVariant, string> = {
  default: cn(
    // Face, rim, lit top edge and depth come from data-surface="field".
    "",
  ),
  filled: cn(
    "border-[var(--primitive-edge)]",
    "bg-[var(--muted)]",
    "hover:border-[color-mix(in_srgb,var(--foreground)_14%,transparent)]",
    "hover:bg-[var(--primitive-surface-hover)]",
    "active:bg-[var(--primitive-surface-active)]",
  ),
  ghost: cn(
    "border-transparent bg-transparent",
    "hover:border-[color-mix(in_srgb,var(--foreground)_10%,transparent)]",
    "hover:bg-[var(--primitive-surface-hover)]",
  ),
};

const focusClasses = cn(
  "focus:border-[color-mix(in_srgb,var(--foreground)_24%,transparent)]",
  "focus:ring-2 focus:ring-[var(--primitive-ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)]",
);

const errorClasses = cn(
  "border-[var(--primitive-destructive-border)]",
  "hover:border-[color-mix(in_srgb,var(--primitive-destructive)_65%,transparent)]",
  "focus:border-[var(--primitive-destructive)]",
  "focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primitive-destructive)_45%,transparent)] focus:ring-offset-2 focus:ring-offset-[var(--background)]",
);

const disabledClasses = cn("cursor-not-allowed opacity-45");

const readOnlyClasses = cn("[--surface-face:var(--muted)]", "text-[var(--muted-foreground)]");

function rowsToHeight(rows: number) {
  return `${Math.max(rows, 1) * 24 + 32}px`;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      className,
      containerClassName,
      textareaClassName,
      label,
      hint,
      error,
      textareaSize = "md",
      variant = "default",
      resize = "vertical",
      autoResize = false,
      minRows = textareaSize === "sm" ? 3 : textareaSize === "lg" ? 5 : 4,
      maxRows,
      showCount = false,
      fullWidth = true,
      disabled,
      readOnly,
      value,
      defaultValue,
      maxLength,
      onChange,
      "aria-describedby": ariaDescribedBy,
      style,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const textareaId = id ?? `wensity-textarea-${reactId}`;
    const hintId = hint ? `${textareaId}-hint` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;
    const countId = showCount ? `${textareaId}-count` : undefined;
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue?.toString() ?? "",
    );
    const currentValue = isControlled ? value : uncontrolledValue;
    const currentLength = currentValue == null ? 0 : String(currentValue).length;
    const describedBy =
      [ariaDescribedBy, errorId, hintId, countId].filter(Boolean).join(" ") || undefined;

    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const syncHeight = React.useCallback(() => {
      const node = textareaRef.current;
      if (!node || !autoResize) return;

      node.style.height = "auto";
      const maxHeight = maxRows ? Number.parseFloat(rowsToHeight(maxRows)) : Infinity;
      node.style.height = `${Math.min(node.scrollHeight, maxHeight)}px`;
      node.style.overflowY = node.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [autoResize, maxRows]);

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isControlled) setUncontrolledValue(event.target.value);
        onChange?.(event);
        window.requestAnimationFrame(syncHeight);
      },
      [isControlled, onChange, syncHeight],
    );

    React.useLayoutEffect(() => {
      syncHeight();
    }, [currentValue, syncHeight]);

    return (
      <div
        data-wensity-primitive=""
        className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-fit", containerClassName)}
      >
        {label ? (
          <label
            htmlFor={textareaId}
            className="text-[13px] font-medium leading-none tracking-[-0.01em] text-[var(--foreground)]"
          >
            {label}
          </label>
        ) : null}

        <div className={cn("relative", fullWidth ? "w-full" : "w-fit", className)}>
          <textarea
            ref={setRefs}
            id={textareaId}
            value={isControlled ? value : uncontrolledValue}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            rows={autoResize ? minRows : (props.rows ?? minRows)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={handleChange}
            data-wensity-textarea=""
            data-surface={variant === "default" ? "field" : undefined}
            data-error={error ? "" : undefined}
            data-readonly={readOnly ? "" : undefined}
            data-disabled={disabled ? "" : undefined}
            className={cn(
              "wensity-textarea-control w-full border outline-none",
              // 16px on touch screens: iOS zooms into any field set smaller.
              "pointer-coarse:text-base",
              "text-[var(--foreground)] placeholder:text-[var(--primitive-text-placeholder)]",
              "transition-[border-color,background-color,box-shadow] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease)]",
              "motion-reduce:transition-none",
              "disabled:cursor-not-allowed",
              textareaSizes[textareaSize],
              showCount && countPadding[textareaSize],
              !autoResize && resizeClasses[resize],
              autoResize && "resize-none overflow-hidden",
              variantClasses[variant],
              !disabled && !readOnly && !error && focusClasses,
              error && errorClasses,
              disabled && disabledClasses,
              readOnly && readOnlyClasses,
              textareaClassName,
            )}
            style={{
              minHeight: rowsToHeight(minRows),
              maxHeight: maxRows ? rowsToHeight(maxRows) : undefined,
              ...style,
            }}
            {...props}
          />

          {showCount ? (
            <div
              id={countId}
              aria-live="polite"
              className={cn(
                "pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5",
                "text-[length:var(--primitive-text-hint)] leading-none tabular-nums text-[var(--primitive-text-secondary)]",
                maxLength && currentLength > maxLength * 0.9 && "text-[var(--primitive-warning)]",
                maxLength && currentLength >= maxLength && "text-[var(--primitive-destructive)]",
              )}
            >
              <IconFileText aria-hidden="true" className="size-3.5 opacity-70" stroke={1.75} />
              <span>
                {currentLength}
                {maxLength ? `/${maxLength}` : null}
              </span>
            </div>
          ) : null}
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

Textarea.displayName = "Textarea";
