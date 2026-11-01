"use client";

import * as React from "react";
import { cn } from "@traiv/ui/lib/cn";

export type SkeletonVariant = "text" | "avatar" | "card" | "table" | "custom";
export type SkeletonTone = "neutral" | "soft" | "contrast";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  tone?: SkeletonTone;
  rows?: number;
  animate?: boolean;
}

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  widths?: string[];
  tone?: SkeletonTone;
  animate?: boolean;
}

export interface SkeletonAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  tone?: SkeletonTone;
  animate?: boolean;
}

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: SkeletonTone;
  animate?: boolean;
}

export interface SkeletonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  columns?: number;
  tone?: SkeletonTone;
  animate?: boolean;
}

const toneStyles: Record<SkeletonTone, string> = {
  neutral:
    "[--wensity-skeleton-base:color-mix(in_srgb,var(--foreground)_10%,var(--background))] [--wensity-skeleton-glint:color-mix(in_srgb,var(--foreground)_18%,var(--background))]",
  soft: "[--wensity-skeleton-base:color-mix(in_srgb,var(--foreground)_7%,var(--background))] [--wensity-skeleton-glint:color-mix(in_srgb,var(--foreground)_13%,var(--background))]",
  contrast:
    "[--wensity-skeleton-base:color-mix(in_srgb,var(--foreground)_14%,var(--background))] [--wensity-skeleton-glint:color-mix(in_srgb,var(--foreground)_26%,var(--background))]",
};

const avatarSizes = {
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
};

function useSkeletonStyles() {
  React.useEffect(() => {
    ensureSkeletonStyles();
  }, []);
}

function skeletonClass(tone: SkeletonTone, animate: boolean, className?: string) {
  return cn(
    "relative overflow-hidden bg-[var(--wensity-skeleton-base)]",
    toneStyles[tone],
    animate && "wensity-skeleton",
    className,
  );
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = "custom",
      tone = "neutral",
      rows = 3,
      animate = true,
      children,
      ...props
    },
    ref,
  ) => {
    useSkeletonStyles();

    if (variant === "text") {
      return (
        <SkeletonText
          ref={ref}
          rows={rows}
          tone={tone}
          animate={animate}
          className={className}
          {...props}
        />
      );
    }

    if (variant === "avatar") {
      return (
        <SkeletonAvatar ref={ref} tone={tone} animate={animate} className={className} {...props} />
      );
    }

    if (variant === "card") {
      return (
        <SkeletonCard ref={ref} tone={tone} animate={animate} className={className} {...props} />
      );
    }

    if (variant === "table") {
      return (
        <SkeletonTable
          ref={ref}
          rows={rows}
          tone={tone}
          animate={animate}
          className={className}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-slot="skeleton"
        className={skeletonClass(
          tone,
          animate,
          cn("h-4 rounded-[var(--primitive-radius-control-sm)]", className),
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Skeleton.displayName = "Skeleton";

export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  (
    {
      className,
      rows = 3,
      widths = ["100%", "92%", "68%"],
      tone = "neutral",
      animate = true,
      ...props
    },
    ref,
  ) => {
    useSkeletonStyles();

    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-slot="skeleton-text"
        className={cn("space-y-2.5", className)}
        {...props}
      >
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={skeletonClass(
              tone,
              animate,
              "h-3.5 rounded-[var(--primitive-radius-control-sm)]",
            )}
            style={{ width: widths[index % widths.length] }}
          />
        ))}
      </div>
    );
  },
);
SkeletonText.displayName = "SkeletonText";

export const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ className, size = "md", tone = "neutral", animate = true, ...props }, ref) => {
    useSkeletonStyles();

    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-slot="skeleton-avatar"
        className={skeletonClass(tone, animate, cn("rounded-full", avatarSizes[size], className))}
        {...props}
      />
    );
  },
);
SkeletonAvatar.displayName = "SkeletonAvatar";

export const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className, tone = "neutral", animate = true, ...props }, ref) => {
    useSkeletonStyles();

    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-slot="skeleton-card"
        className={cn(
          "rounded-[var(--primitive-radius-surface)] border border-[color-mix(in_srgb,var(--foreground)_10%,transparent)] p-4",
          "bg-[color-mix(in_srgb,var(--foreground)_3%,var(--background))]",
          className,
        )}
        {...props}
      >
        <div
          className={skeletonClass(tone, animate, "h-32 rounded-[var(--primitive-radius-surface)]")}
        />
        <div className="mt-4 flex items-start gap-3">
          <SkeletonAvatar size="sm" tone={tone} animate={animate} />
          <div className="min-w-0 flex-1 pt-0.5">
            <SkeletonText rows={3} widths={["82%", "96%", "54%"]} tone={tone} animate={animate} />
          </div>
        </div>
      </div>
    );
  },
);
SkeletonCard.displayName = "SkeletonCard";

export const SkeletonTable = React.forwardRef<HTMLDivElement, SkeletonTableProps>(
  ({ className, rows = 4, columns = 4, tone = "neutral", animate = true, ...props }, ref) => {
    useSkeletonStyles();

    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-slot="skeleton-table"
        className={cn(
          "overflow-hidden rounded-[var(--primitive-radius-surface)] border border-[color-mix(in_srgb,var(--foreground)_10%,transparent)]",
          className,
        )}
        {...props}
      >
        <div className="grid gap-px bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)]">
          {Array.from({ length: rows + 1 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-3 bg-[var(--primitive-frame-face)] px-3 py-3"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <div
                  key={columnIndex}
                  className={skeletonClass(
                    rowIndex === 0 ? "contrast" : tone,
                    animate,
                    cn(
                      "h-3 rounded-[var(--primitive-radius-control-sm)]",
                      columnIndex === columns - 1 && "w-2/3",
                    ),
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
SkeletonTable.displayName = "SkeletonTable";

function ensureSkeletonStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("wensity-skeleton-styles")) return;

  const style = document.createElement("style");
  style.id = "wensity-skeleton-styles";
  style.textContent = `
@media (prefers-reduced-motion: no-preference) {
  .wensity-skeleton::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    transform: translateX(-145%);
    background: linear-gradient(
      90deg,
      transparent 0%,
      transparent 32%,
      var(--wensity-skeleton-glint) 50%,
      transparent 68%,
      transparent 100%
    );
    animation: wensity-skeleton-shimmer 1.65s linear infinite;
    will-change: transform;
  }
}

@keyframes wensity-skeleton-shimmer {
  from {
    transform: translateX(-145%);
  }
  to {
    transform: translateX(145%);
  }
}
`;
  document.head.appendChild(style);
}
