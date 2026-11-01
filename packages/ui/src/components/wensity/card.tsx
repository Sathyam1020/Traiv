"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@traiv/ui/lib/cn";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconMinus,
  IconChevronRight,
} from "@tabler/icons-react";

/** Motion tiers, the same speeds as the --primitive-motion-* tokens. */
const SPRING = {
  fast: { type: "spring", duration: 0.08, bounce: 0 },
  moderate: { type: "spring", duration: 0.16, bounce: 0 },
  slow: { type: "spring", duration: 0.24, bounce: 0 },
} as const;

/* ─── Card Core Component ───────────────────────────────────── */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, children, ...props }, ref) => {
    return (
      <div
        data-wensity-primitive=""
        data-surface="panel"
        ref={ref}
        className={cn(
          "group relative overflow-hidden rounded-[var(--primitive-radius-surface)] text-[var(--foreground)]",
          interactive && [
            "transition-[border-color,background-color,box-shadow] duration-[var(--primitive-motion-fast)] ease-out",
            "hover:[--surface-tint:var(--primitive-tint-hover)]",
          ],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";

/* ─── Card Structure Subcomponents ────────────────────────── */

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-[family-name:var(--primitive-font-display)] font-semibold text-base leading-none tracking-tight text-[var(--foreground)]",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-xs text-[var(--muted-foreground)]", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

/* ─── Card Media Wrapper ────────────────────────────────────── */

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: "video" | "square" | "portrait" | "auto";
  hoverZoom?: boolean;
}

const aspectRatioClasses = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  auto: "h-auto",
};

export const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  ({ className, aspectRatio = "video", hoverZoom = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-[var(--surface-muted)] w-full",
          aspectRatioClasses[aspectRatio],
          hoverZoom &&
            "motion-safe:[@media(hover:hover)_and_(pointer:fine)]:hover:[&>div]:scale-[1.04]",
          className,
        )}
        {...props}
      >
        {/* We find child media items (like img/video) and wrap them or style them */}
        <div
          className={cn(
            "w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_video]:w-full [&_video]:h-full [&_video]:object-cover",
            hoverZoom &&
              "transition-transform duration-[var(--primitive-motion-moderate)] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);
CardMedia.displayName = "CardMedia";

/* ─── Card Stat Details & Sparkline ─────────────────────────── */

export interface CardStatTrendProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  trend: "up" | "down" | "flat";
}

export const CardStatTrend = React.forwardRef<HTMLDivElement, CardStatTrendProps>(
  ({ className, value, trend, ...props }, ref) => {
    const trendConfig = {
      up: {
        icon: <IconArrowUpRight className="size-3.5 shrink-0" stroke={2} />,
        color:
          "text-[var(--primitive-success)] bg-[var(--primitive-success-surface)] border-[var(--primitive-success-border)]",
      },
      down: {
        icon: <IconArrowDownRight className="size-3.5 shrink-0" stroke={2} />,
        color:
          "text-[var(--primitive-destructive)] bg-[var(--primitive-destructive-surface)] border-[var(--primitive-destructive-border)]",
      },
      flat: {
        icon: <IconMinus className="size-3.5 shrink-0" stroke={2} />,
        color:
          "text-[var(--muted-foreground)] bg-[color-mix(in_srgb,var(--foreground)_6%,var(--background))] border-[color-mix(in_srgb,var(--foreground)_12%,transparent)]",
      },
    };

    const current = trendConfig[trend];

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold tracking-tight",
          current.color,
          className,
        )}
        {...props}
      >
        {current.icon}
        <span>{value}</span>
      </div>
    );
  },
);
CardStatTrend.displayName = "CardStatTrend";

export interface CardStatSparklineProps extends React.SVGProps<SVGSVGElement> {
  data: number[];
  trend?: "up" | "down" | "flat";
  width?: number;
  height?: number;
}

export function CardStatSparkline({
  data,
  trend = "up",
  width = 120,
  height = 40,
  className,
  ...props
}: CardStatSparklineProps) {
  const uniqueId = React.useId().replace(/:/g, "");

  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3; // padding top/bottom
    return { x, y };
  });

  const pathD = points.reduce(
    (acc, point, i) => (i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`),
    "",
  );

  const fillD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  const colors = {
    up: {
      stroke: "var(--primitive-success)",
      gradientStart: "color-mix(in srgb, var(--primitive-success) 16%, transparent)",
      gradientEnd: "color-mix(in srgb, var(--primitive-success) 0%, transparent)",
    },
    down: {
      stroke: "var(--primitive-destructive)",
      gradientStart: "color-mix(in srgb, var(--primitive-destructive) 16%, transparent)",
      gradientEnd: "color-mix(in srgb, var(--primitive-destructive) 0%, transparent)",
    },
    flat: {
      stroke: "var(--muted-foreground)",
      gradientStart: "color-mix(in srgb, var(--muted-foreground) 12%, transparent)",
      gradientEnd: "color-mix(in srgb, var(--muted-foreground) 0%, transparent)",
    },
  };

  const selectedColor = colors[trend];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      {...props}
    >
      <defs>
        <linearGradient id={`grad-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={selectedColor.gradientStart} />
          <stop offset="100%" stopColor={selectedColor.gradientEnd} />
        </linearGradient>
      </defs>

      {/* Shadow/Glow under path */}
      <path d={fillD} fill={`url(#grad-${uniqueId})`} />

      {/* Animating Sparkline Path */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={selectedColor.stroke}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={SPRING.slow}
      />
    </svg>
  );
}

/* ─── Card Feature Details ──────────────────────────────────── */

type CardFeatureActionLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  label?: string;
};

type CardFeatureActionStaticProps = React.HTMLAttributes<HTMLDivElement> & {
  href?: undefined;
  label?: string;
};

export type CardFeatureActionProps = CardFeatureActionLinkProps | CardFeatureActionStaticProps;

export const CardFeatureAction = React.forwardRef<
  HTMLAnchorElement | HTMLDivElement,
  CardFeatureActionProps
>(({ className, label = "Learn more", href, ...props }, ref) => {
  const content = (
    <>
      <span>{label}</span>
      <IconChevronRight
        className="size-3.5 transition-transform duration-[var(--primitive-motion-moderate)] ease-out group-hover:translate-x-0.5"
        stroke={2.2}
      />
    </>
  );

  const actionClassName = cn(
    "inline-flex items-center gap-1 text-xs font-semibold text-[var(--foreground)]",
    "transition-colors duration-[var(--primitive-motion-fast)] group-hover:text-[var(--primitive-destructive)]",
    className,
  );

  if (href) {
    return (
      <a
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        href={href}
        className={actionClassName}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      ref={ref as React.ForwardedRef<HTMLDivElement>}
      className={actionClassName}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {content}
    </div>
  );
});
CardFeatureAction.displayName = "CardFeatureAction";
