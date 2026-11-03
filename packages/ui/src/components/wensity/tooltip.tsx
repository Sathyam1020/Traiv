"use client";

/**
 * Tooltip — Base UI Tooltip foundation (Phase 4B).
 * Solid overlay surface; Provider delay/closeDelay; motion 150/100.
 * D-17: interactive variant removed (use Popover openOnHover infotip);
 * followCursor → Root trackCursorAxis (gated by reduced motion);
 * onOpenChange → (open: boolean) => void; asChild → render.
 */

import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "@traiv/ui/lib/cn";

export type TooltipVariant = "default" | "rich" | "shortcut";

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

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * `matchMedia` is an external store, so read it with `useSyncExternalStore`
 * rather than mirroring it into state from an effect. This also removes the
 * first-paint flash where the value was `false` for one commit even when the
 * user prefers reduced motion.
 */
function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false, // Server render: assume motion is allowed.
  );
}

type TooltipFollowContextValue = {
  followCursor: boolean;
  setFollowCursor: (value: boolean) => void;
};

const TooltipFollowContext = React.createContext<TooltipFollowContextValue | null>(null);

export interface TooltipProviderProps
  extends React.ComponentPropsWithoutRef<typeof BaseTooltip.Provider> {
  /** @deprecated Use `delay`. Mapped for Radix migration. */
  delayDuration?: number;
  /** @deprecated Use `timeout`. Mapped for Radix migration. */
  skipDelayDuration?: number;
}

export function TooltipProvider({
  delay = 400,
  closeDelay = 0,
  delayDuration,
  skipDelayDuration,
  timeout,
  ...props
}: TooltipProviderProps) {
  return (
    <BaseTooltip.Provider
      delay={delayDuration ?? delay}
      closeDelay={closeDelay}
      timeout={skipDelayDuration ?? timeout}
      {...props}
    />
  );
}

export interface TooltipProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseTooltip.Root>,
    "onOpenChange" | "trackCursorAxis"
  > {
  onOpenChange?: (open: boolean) => void;
  /** Tracks pointer while open (maps to trackCursorAxis="both"). Disabled under reduced motion. */
  followCursor?: boolean;
  /** @deprecated Prefer Provider delay. Mapped onto Trigger when using TooltipRich/Shortcut. */
  delayDuration?: number;
}

export function Tooltip({
  onOpenChange,
  followCursor: followCursorProp = false,
  delayDuration: _delayDuration,
  children,
  ...props
}: TooltipProps) {
  const [followFromContent, setFollowFromContent] = React.useState(false);
  const followCursor = followCursorProp || followFromContent;
  const reducedMotion = usePrefersReducedMotion();

  return (
    <TooltipFollowContext.Provider
      value={{
        followCursor,
        setFollowCursor: setFollowFromContent,
      }}
    >
      <BaseTooltip.Root
        trackCursorAxis={followCursor && !reducedMotion ? "both" : "none"}
        onOpenChange={adaptOpenChange(onOpenChange)}
        {...props}
      >
        {children}
      </BaseTooltip.Root>
    </TooltipFollowContext.Provider>
  );
}

export interface TooltipTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseTooltip.Trigger> {
  asChild?: boolean;
}

export function TooltipTrigger({ asChild = false, children, ...props }: TooltipTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return <BaseTooltip.Trigger render={children as React.ReactElement} {...props} />;
  }
  return <BaseTooltip.Trigger {...props}>{children}</BaseTooltip.Trigger>;
}

export interface TooltipContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseTooltip.Popup>, "title"> {
  variant?: TooltipVariant;
  /** Rich tooltip heading — separate from the native `title` attribute. */
  heading?: React.ReactNode;
  shortcut?: string[];
  /** Tracks pointer — registers with Tooltip Root as trackCursorAxis. */
  followCursor?: boolean;
  side?: React.ComponentPropsWithoutRef<typeof BaseTooltip.Positioner>["side"];
  align?: React.ComponentPropsWithoutRef<typeof BaseTooltip.Positioner>["align"];
  sideOffset?: number;
  collisionPadding?: number;
  container?: React.ComponentPropsWithoutRef<typeof BaseTooltip.Portal>["container"];
}

export function TooltipContent({
  className,
  variant = "default",
  heading,
  shortcut,
  followCursor = false,
  side = "top",
  align = "center",
  sideOffset = 6,
  collisionPadding = 12,
  container,
  children,
  ...props
}: TooltipContentProps) {
  const followCtx = React.useContext(TooltipFollowContext);

  React.useLayoutEffect(() => {
    if (!followCursor || !followCtx) return;
    followCtx.setFollowCursor(true);
    return () => followCtx.setFollowCursor(false);
  }, [followCursor, followCtx]);

  const isRich = variant === "rich" || Boolean(heading);
  const isShortcut = variant === "shortcut" || Boolean(shortcut?.length);
  const tracking = followCursor || followCtx?.followCursor;

  return (
    <BaseTooltip.Portal container={container}>
      <BaseTooltip.Positioner
        side={side}
        align={align}
        sideOffset={tracking ? 14 : sideOffset}
        collisionPadding={collisionPadding}
        className="z-[var(--primitive-z-popover)] outline-none"
      >
        <BaseTooltip.Popup
          data-surface="overlay"
          data-wensity-primitive=""
          data-wensity-tooltip-content=""
          className={cn(
            overlaySurfaceClass,
            "max-w-[16rem] rounded-[var(--primitive-radius-popup)] px-2.5 py-1.5 text-[12px] leading-[1.45]",
            popupMotionClass,
            isRich && "max-w-[18rem] px-3 py-2.5",
            className,
          )}
          {...props}
        >
          {isRich && heading ? (
            <div className="space-y-1">
              <p className="text-[12px] font-semibold text-[var(--foreground)]">{heading}</p>
              {children ? (
                <p className="text-[11px] leading-[1.45] text-[var(--muted-foreground)]">
                  {children}
                </p>
              ) : null}
            </div>
          ) : (
            children
          )}

          {isShortcut && shortcut?.length ? (
            <span className="ml-2 inline-flex items-center gap-0.5 align-middle">
              {shortcut.map((key) => (
                <kbd
                  key={key}
                  data-surface="frame"
                  className={cn(
                    "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[var(--primitive-radius-control-sm)]",
                    "px-1",
                    "font-[family-name:var(--primitive-font-mono)] text-[10px] font-medium text-[var(--muted-foreground)]",
                  )}
                >
                  {key}
                </kbd>
              ))}
            </span>
          ) : null}

          {!tracking ? (
            <BaseTooltip.Arrow className="flex data-[side=bottom]:-top-1 data-[side=left]:-right-1 data-[side=right]:-left-1 data-[side=top]:-bottom-1">
              <svg width="10" height="5" viewBox="0 0 10 5" fill="none">
                <path
                  d="M0 0 L5 5 L10 0"
                  className="fill-[var(--primitive-surface-overlay)] stroke-[var(--border)]"
                  strokeWidth="1"
                />
              </svg>
            </BaseTooltip.Arrow>
          ) : null}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}

/** Convenience wrapper for rich two-line tooltips. */
export function TooltipRich({
  title,
  description,
  children,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
  side,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  children: React.ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  side?: TooltipContentProps["side"];
}) {
  return (
    <Tooltip open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <TooltipTrigger asChild delay={delayDuration}>
        {children}
      </TooltipTrigger>
      <TooltipContent variant="rich" heading={title} side={side}>
        {description}
      </TooltipContent>
    </Tooltip>
  );
}

/** Convenience wrapper for shortcut hints. */
export function TooltipShortcut({
  label,
  shortcut,
  children,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
}: {
  label: React.ReactNode;
  shortcut: string[];
  children: React.ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
}) {
  return (
    <Tooltip open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <TooltipTrigger asChild delay={delayDuration}>
        {children}
      </TooltipTrigger>
      <TooltipContent variant="shortcut" shortcut={shortcut}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
