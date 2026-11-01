"use client";

/**
 * Popover — Base UI Popover foundation (Phase 4B).
 * Solid overlay surface; Positioner + Popup anatomy; collisionPadding 12.
 * D-17: onOpenChange → (open: boolean) => void; asChild → render + nativeButton host match.
 * PopoverAnchor sets a custom Positioner anchor (no Base UI Anchor part).
 */

import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn } from "@traiv/ui/lib/cn";

export type PopoverVariant = "default" | "form" | "menu" | "rich";

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

type PopoverAnchorContextValue = {
  anchorRef: React.RefObject<Element | null>;
  hasAnchor: boolean;
  setHasAnchor: (value: boolean) => void;
};

const PopoverAnchorContext = React.createContext<PopoverAnchorContextValue | null>(null);

export interface PopoverProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BasePopover.Root>, "onOpenChange"> {
  onOpenChange?: (open: boolean) => void;
}

export function Popover({ onOpenChange, children, ...props }: PopoverProps) {
  const anchorRef = React.useRef<Element | null>(null);
  const [hasAnchor, setHasAnchor] = React.useState(false);

  return (
    <PopoverAnchorContext.Provider value={{ anchorRef, hasAnchor, setHasAnchor }}>
      <BasePopover.Root onOpenChange={adaptOpenChange(onOpenChange)} {...props}>
        {children}
      </BasePopover.Root>
    </PopoverAnchorContext.Provider>
  );
}

export interface PopoverTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BasePopover.Trigger> {
  asChild?: boolean;
}

export function PopoverTrigger({ asChild = false, children, ...props }: PopoverTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    const nativeButton = typeof children.type === "string" ? children.type === "button" : true;
    return (
      <BasePopover.Trigger
        nativeButton={nativeButton}
        render={children as React.ReactElement}
        {...props}
      />
    );
  }
  return <BasePopover.Trigger {...props}>{children}</BasePopover.Trigger>;
}

export interface PopoverCloseProps
  extends React.ComponentPropsWithoutRef<typeof BasePopover.Close> {
  asChild?: boolean;
}

export function PopoverClose({ asChild = false, children, ...props }: PopoverCloseProps) {
  if (asChild && React.isValidElement(children)) {
    const nativeButton = typeof children.type === "string" ? children.type === "button" : true;
    return (
      <BasePopover.Close
        nativeButton={nativeButton}
        render={children as React.ReactElement}
        {...props}
      />
    );
  }
  return <BasePopover.Close {...props}>{children}</BasePopover.Close>;
}

/**
 * Optional custom anchor for Positioner. Base UI has no Anchor part —
 * this stores a ref consumed by PopoverContent's Positioner.
 */
export function PopoverAnchor({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(PopoverAnchorContext);

  React.useLayoutEffect(() => {
    ctx?.setHasAnchor(true);
    return () => ctx?.setHasAnchor(false);
  }, [ctx]);

  return (
    <div
      ref={ctx?.anchorRef as React.RefObject<HTMLDivElement | null>}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

export interface PopoverContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BasePopover.Popup>, "title"> {
  variant?: PopoverVariant;
  width?: "auto" | "sm" | "md" | "lg";
  side?: React.ComponentPropsWithoutRef<typeof BasePopover.Positioner>["side"];
  align?: React.ComponentPropsWithoutRef<typeof BasePopover.Positioner>["align"];
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
  container?: React.ComponentPropsWithoutRef<typeof BasePopover.Portal>["container"];
}

const variantClasses: Record<PopoverVariant, string> = {
  default: "p-4",
  form: "p-0",
  menu: "p-1.5",
  rich: "overflow-hidden p-0",
};

const widthClasses: Record<NonNullable<PopoverContentProps["width"]>, string> = {
  auto: "w-auto min-w-[12rem]",
  sm: "w-[14rem]",
  md: "w-[18rem]",
  lg: "w-[22rem]",
};

export function PopoverContent({
  className,
  variant = "default",
  width = "auto",
  side = "bottom",
  align = "center",
  sideOffset = 6,
  alignOffset,
  collisionPadding = 12,
  container,
  children,
  ...props
}: PopoverContentProps) {
  const ctx = React.useContext(PopoverAnchorContext);

  return (
    <BasePopover.Portal container={container}>
      <BasePopover.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        anchor={ctx?.hasAnchor ? ctx.anchorRef : undefined}
        className="z-[var(--primitive-z-popover)] outline-none"
      >
        <BasePopover.Popup
          data-surface="overlay"
          data-wensity-primitive=""
          className={cn(
            overlaySurfaceClass,
            "rounded-[var(--primitive-radius-popup)]",
            popupMotionClass,
            widthClasses[width],
            variantClasses[variant],
            className,
          )}
          {...props}
        >
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export function PopoverHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-b border-[var(--border)] px-4 py-3", className)} {...props} />;
}

export function PopoverBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 py-3", className)} {...props} />;
}

export function PopoverTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BasePopover.Title>) {
  return (
    <BasePopover.Title
      className={cn(
        "font-[family-name:var(--primitive-font-display)] text-sm font-semibold tracking-[-0.01em] text-[var(--foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export function PopoverDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BasePopover.Description>) {
  return (
    <BasePopover.Description
      className={cn("mt-1 text-[12px] leading-[1.5] text-[var(--muted-foreground)]", className)}
      {...props}
    />
  );
}

export interface PopoverMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
  destructive?: boolean;
}

export function PopoverMenuItem({ className, inset, destructive, ...props }: PopoverMenuItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 rounded-[var(--primitive-radius-item)] px-2.5 py-2 text-left text-[13px]",
        "text-[var(--foreground)] transition-[background-color,color] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease)]",
        "hover:bg-[var(--primitive-surface-hover)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
        "motion-reduce:transition-none",
        inset && "pl-8",
        destructive &&
          "text-[var(--primitive-destructive)] hover:bg-[var(--primitive-destructive-surface)]",
        className,
      )}
      {...props}
    />
  );
}

export function PopoverMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="separator" data-groove="horizontal" className={cn("my-1", className)} {...props} />
  );
}

export interface PopoverRichMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
}

export function PopoverRichMedia({ src, alt, className, ...props }: PopoverRichMediaProps) {
  return (
    <div className={cn("relative aspect-[16/10] w-full overflow-hidden", className)} {...props}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="size-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55)_0%,transparent_55%)]" />
    </div>
  );
}
