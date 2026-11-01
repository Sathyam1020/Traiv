"use client";

import * as React from "react";
import { cn } from "@traiv/ui/lib/cn";

export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorVariant = "default" | "gradient" | "dashed";
export type SeparatorLabelPosition = "start" | "center" | "end";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: SeparatorOrientation;
  variant?: SeparatorVariant;
  label?: React.ReactNode;
  labelPosition?: SeparatorLabelPosition;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = "horizontal",
      variant = "default",
      label,
      labelPosition = "center",
      ...props
    },
    ref,
  ) => {
    const isHorizontal = orientation === "horizontal";

    // Style builders for line elements
    const getLineStyles = (isFirst: boolean) => {
      return cn(
        isHorizontal ? "h-px w-full" : "w-px h-full self-stretch",
        // Default: an engraved groove (a dark line over a highlight)
        variant === "default" &&
          (isHorizontal
            ? "h-[2px] bg-[linear-gradient(to_bottom,var(--primitive-groove-shadow)_0_1px,var(--primitive-groove-highlight)_1px_2px)]"
            : "w-[2px] bg-[linear-gradient(to_right,var(--primitive-groove-shadow)_0_1px,var(--primitive-groove-highlight)_1px_2px)]"),
        // Gradient Styling
        variant === "gradient" && [
          isHorizontal
            ? isFirst
              ? "bg-gradient-to-r from-transparent via-[var(--border)] to-[var(--border)]"
              : "bg-gradient-to-r from-[var(--border)] via-[var(--border)] to-transparent"
            : isFirst
              ? "bg-gradient-to-b from-transparent via-[var(--border)] to-[var(--border)]"
              : "bg-gradient-to-b from-[var(--border)] via-[var(--border)] to-transparent",
        ],
        // Dashed Styling (Uses border rather than background fill)
        variant === "dashed" && [
          isHorizontal
            ? "border-t border-dashed border-[var(--border)]"
            : "border-l border-dashed border-[var(--border)]",
        ],
      );
    };

    // If no label, render a single straight line
    if (!label) {
      return (
        <div
          data-wensity-primitive=""
          ref={ref}
          role="separator"
          aria-orientation={orientation}
          // Default: the engraved groove from the surface system.
          data-groove={variant === "default" ? orientation : undefined}
          className={cn(
            variant === "default"
              ? isHorizontal
                ? "w-full"
                : "h-full"
              : isHorizontal
                ? "h-px w-full"
                : "w-px h-full self-stretch",
            variant === "gradient" && [
              isHorizontal
                ? "bg-gradient-to-r from-transparent via-[var(--border)] to-transparent"
                : "bg-gradient-to-b from-transparent via-[var(--border)] to-transparent",
            ],
            variant === "dashed" && [
              isHorizontal
                ? "border-t border-dashed border-[var(--border)]"
                : "border-l border-dashed border-[var(--border)]",
            ],
            className,
          )}
          {...props}
        />
      );
    }

    // Label position alignment sizes for the surrounding lines
    const line1Flex =
      labelPosition === "start" ? (isHorizontal ? "w-8 shrink-0" : "h-8 shrink-0") : "flex-1";
    const line2Flex =
      labelPosition === "end" ? (isHorizontal ? "w-8 shrink-0" : "h-8 shrink-0") : "flex-1";

    return (
      <div
        data-wensity-primitive=""
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          "flex items-center text-[var(--muted-foreground)] select-none",
          isHorizontal
            ? "flex-row w-full gap-3 text-[11px] font-semibold tracking-wider"
            : "flex-col h-full gap-3 py-1 text-[10px] font-semibold tracking-wider",
          className,
        )}
        {...props}
      >
        <div className={cn(getLineStyles(true), line1Flex)} />
        <span className="shrink-0 text-[10px] uppercase text-[var(--muted-foreground)]">
          {label}
        </span>
        <div className={cn(getLineStyles(false), line2Flex)} />
      </div>
    );
  },
);
Separator.displayName = "Separator";
