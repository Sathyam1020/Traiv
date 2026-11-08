"use client";

/**
 * PreviewCard — Base UI Preview Card foundation.
 *
 * Base UI's name for what most libraries call a "hover card": an interactive popup that
 * opens on hover (or focus) rather than on click, and — unlike a tooltip — can hold real
 * content: buttons, a calendar, anything a `Popover` could. Same anatomy as `Popover`
 * (Root/Trigger/Portal/Positioner/Popup), so this wrapper mirrors `popover.tsx` exactly
 * rather than inventing a second styling convention.
 */

import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card";
import { cn } from "@traiv/ui/lib/cn";
import * as React from "react";

const overlaySurfaceClass = "text-[var(--foreground)]";

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

export interface PreviewCardProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BasePreviewCard.Root>, "onOpenChange"> {
  onOpenChange?: (open: boolean) => void;
}

export function PreviewCard({ onOpenChange, children, ...props }: PreviewCardProps) {
  return (
    <BasePreviewCard.Root onOpenChange={adaptOpenChange(onOpenChange)} {...props}>
      {children}
    </BasePreviewCard.Root>
  );
}

export interface PreviewCardTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BasePreviewCard.Trigger> {
  /** Renders as the child element (a `<span>`, typically) instead of Base UI's default
   * `<a>` — this trigger is inline text being previewed, not a navigation link. */
  asChild?: boolean;
}

export function PreviewCardTrigger({
  asChild = false,
  children,
  ...props
}: PreviewCardTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return <BasePreviewCard.Trigger render={children as React.ReactElement} {...props} />;
  }
  return <BasePreviewCard.Trigger {...props}>{children}</BasePreviewCard.Trigger>;
}

export interface PreviewCardContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BasePreviewCard.Popup>, "title"> {
  width?: "auto" | "sm" | "md" | "lg";
  side?: React.ComponentPropsWithoutRef<typeof BasePreviewCard.Positioner>["side"];
  align?: React.ComponentPropsWithoutRef<typeof BasePreviewCard.Positioner>["align"];
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
}

const widthClasses: Record<NonNullable<PreviewCardContentProps["width"]>, string> = {
  auto: "w-auto min-w-[12rem]",
  sm: "w-[14rem]",
  md: "w-[18rem]",
  lg: "w-[22rem]",
};

export function PreviewCardContent({
  className,
  width = "auto",
  side = "bottom",
  align = "start",
  sideOffset = 6,
  alignOffset,
  collisionPadding = 12,
  children,
  ...props
}: PreviewCardContentProps) {
  return (
    <BasePreviewCard.Portal>
      <BasePreviewCard.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className="z-[var(--primitive-z-popover)] outline-none"
      >
        <BasePreviewCard.Popup
          data-surface="overlay"
          data-wensity-primitive=""
          className={cn(
            overlaySurfaceClass,
            "overflow-hidden rounded-[var(--primitive-radius-popup)] p-0",
            popupMotionClass,
            widthClasses[width],
            className,
          )}
          {...props}
        >
          {children}
        </BasePreviewCard.Popup>
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  );
}
