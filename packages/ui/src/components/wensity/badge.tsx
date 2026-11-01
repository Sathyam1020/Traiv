"use client";

import * as React from "react";
import { IconX } from "@tabler/icons-react";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@traiv/ui/lib/cn";

export type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brand"
  | "carbon"
  | "outline";

export type BadgeSize = "sm" | "md" | "lg";
export type BadgeRadius = "sm" | "md" | "pill";

export interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  radius?: BadgeRadius;
  asChild?: boolean;
  interactive?: boolean;
  dot?: boolean;
  pulseDot?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
}

const base = cn(
  "group/badge relative inline-flex max-w-full shrink-0 items-center justify-center overflow-hidden",
  "border font-medium leading-none tracking-[-0.005em] select-none",
  "transition-[background,border-color,color,box-shadow,opacity] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.22,1,0.36,1))]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
);

const interactiveClasses = "cursor-default";

const sizes: Record<BadgeSize, string> = {
  sm: "h-6 gap-1.5 px-2.5 text-[11px] [&_svg]:size-3",
  md: "h-7 gap-1.5 px-3 text-xs [&_svg]:size-3.5",
  lg: "h-8 gap-2 px-3.5 text-[13px] [&_svg]:size-4",
};

const radii: Record<BadgeRadius, string> = {
  sm: "rounded-[var(--primitive-radius-control-sm)]",
  md: "rounded-[var(--primitive-radius-control)]",
  pill: "rounded-full",
};

/**
 * Surface role per variant (`data-surface`). Neutral and outline chips are a
 * lifted `frame` (rim with a lit top edge); carbon is a true `fill`; status
 * tones are soft tints painted below, with a quiet rim in their own hue.
 */
export const badgeSurface: Record<BadgeVariant, string | undefined> = {
  neutral: "frame",
  success: undefined,
  warning: undefined,
  danger: undefined,
  info: undefined,
  brand: undefined,
  carbon: "fill",
  outline: "frame",
};

const variants: Record<BadgeVariant, string> = {
  neutral: "text-[var(--foreground)]",
  // Soft tint: low-alpha fill and rim in the tone, the tone as text.
  success:
    "border-[color-mix(in_srgb,var(--primitive-success)_24%,transparent)] bg-[color-mix(in_srgb,var(--primitive-success)_11%,transparent)] text-[var(--primitive-success)]",
  warning:
    "border-[color-mix(in_srgb,var(--primitive-warning)_24%,transparent)] bg-[color-mix(in_srgb,var(--primitive-warning)_11%,transparent)] text-[var(--primitive-warning)]",
  danger:
    "border-[color-mix(in_srgb,var(--primitive-destructive)_24%,transparent)] bg-[color-mix(in_srgb,var(--primitive-destructive)_11%,transparent)] text-[var(--primitive-destructive)]",
  info: "border-[color-mix(in_srgb,var(--primitive-info)_24%,transparent)] bg-[color-mix(in_srgb,var(--primitive-info)_11%,transparent)] text-[var(--primitive-info)]",
  // The accent can be a deep solid (rose, ink), so its text leans toward the
  // foreground to stay readable on a dark card.
  brand:
    "border-[color-mix(in_srgb,var(--primitive-control-solid)_30%,transparent)] bg-[color-mix(in_srgb,var(--primitive-control-solid)_14%,transparent)] text-[color-mix(in_srgb,var(--primitive-control-solid)_62%,var(--foreground))]",
  carbon: "text-[var(--primitive-control-solid-foreground)]",
  outline: "[--surface-face:transparent] text-[var(--foreground)]",
};

const dotColors: Record<BadgeVariant, string> = {
  neutral: "bg-[var(--muted-foreground)]",
  success: "bg-[var(--primitive-success)]",
  warning: "bg-[var(--primitive-warning)]",
  danger: "bg-[var(--primitive-destructive)]",
  info: "bg-[var(--primitive-info)]",
  brand: "bg-[var(--primitive-control-solid)]",
  carbon: "bg-[var(--primitive-control-solid-foreground)]",
  outline: "bg-[var(--foreground)]",
};

const closeSizes: Record<BadgeSize, string> = {
  sm: "-mr-1 size-4",
  md: "-mr-1 size-4.5",
  lg: "-mr-1.5 size-5",
};

export function badgeVariants({
  variant = "neutral",
  size = "md",
  radius = "pill",
  interactive = false,
  className,
}: {
  variant?: BadgeVariant;
  size?: BadgeSize;
  radius?: BadgeRadius;
  interactive?: boolean;
  className?: string;
} = {}) {
  return cn(
    base,
    variants[variant],
    sizes[size],
    radii[radius],
    interactive && interactiveClasses,
    className,
  );
}

export const Badge = React.forwardRef<HTMLElement, BadgeProps>(
  (
    {
      className,
      variant = "neutral",
      size = "md",
      radius = "pill",
      asChild = false,
      interactive = false,
      dot = false,
      pulseDot = false,
      leftIcon,
      rightIcon,
      onRemove,
      removeLabel = "Remove",
      children,
      ...props
    },
    ref,
  ) => {
    const isInteractive = interactive || Boolean(onRemove);
    const composedClassName = badgeVariants({
      variant,
      size,
      radius,
      interactive: isInteractive,
      className,
    });

    const body = (
      <>
        {dot ? (
          <span className="relative z-10 inline-flex size-2 shrink-0 items-center justify-center">
            {pulseDot ? (
              <span
                className={cn(
                  "absolute inline-flex size-2 rounded-full opacity-40 motion-safe:animate-ping",
                  dotColors[variant],
                )}
              />
            ) : null}
            <span className={cn("relative size-1.5 rounded-full", dotColors[variant])} />
          </span>
        ) : null}
        {leftIcon ? <span className="relative z-10 inline-flex">{leftIcon}</span> : null}
        <span className="relative z-10 min-w-0 truncate">{children}</span>
        {rightIcon ? (
          <span className="relative z-10 inline-flex opacity-75 transition-opacity group-hover/badge:opacity-100">
            {rightIcon}
          </span>
        ) : null}
        {onRemove ? (
          <button
            type="button"
            aria-label={removeLabel}
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
            className={cn(
              "relative z-10 inline-flex shrink-0 items-center justify-center rounded-full text-current/62",
              "transition-[background-color,color] duration-[var(--primitive-motion-fast)] ease-out",
              "hover:bg-current/[0.10] hover:text-current",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/20",
              closeSizes[size],
            )}
          >
            <IconX stroke={2} />
          </button>
        ) : null}
      </>
    );

    const asChildElement = asChild && React.isValidElement(children) ? children : null;

    const asChildRendered = useRender({
      enabled: Boolean(asChildElement),
      ref: ref as React.Ref<HTMLElement>,
      render: asChildElement ?? undefined,
      props: {
        "data-slot": "badge",
        "data-variant": variant,
        "data-surface": badgeSurface[variant],
        className: composedClassName,
        children: body,
        ...props,
      },
    });

    if (asChildRendered) return asChildRendered;

    return (
      <span
        data-wensity-primitive=""
        ref={ref}
        data-slot="badge"
        data-variant={variant}
        data-surface={badgeSurface[variant]}
        className={composedClassName}
        {...props}
      >
        {body}
      </span>
    );
  },
);

Badge.displayName = "Badge";
