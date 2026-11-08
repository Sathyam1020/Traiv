"use client";

/**
 * Sheet — Base UI Dialog styled as an edge panel (Phase 4B).
 * Focus/dismissal/portal/scroll-lock from Base UI; motion CSS on starting/ending attrs.
 * D-17: asChild → render; persistent → Root disablePointerDismissal.
 */

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { IconX } from "@tabler/icons-react";
import { cn } from "@traiv/ui/lib/cn";
import * as React from "react";

export type SheetSide = "left" | "right" | "top" | "bottom";

const modalSurfaceClass = "isolate overflow-hidden";

const backdropClass = cn(
  "fixed inset-0 z-[var(--primitive-z-overlay)] bg-[var(--primitive-backdrop)]",
  "transition-opacity duration-[var(--primitive-motion-slow)] ease-[var(--primitive-ease,cubic-bezier(0.23,1,0.32,1))]",
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
  "motion-reduce:transition-none",
);

const sheetMotionBase = cn(
  "transition-[opacity,translate] duration-300 ease-[var(--primitive-ease,cubic-bezier(0.23,1,0.32,1))]",
  "data-[ending-style]:duration-200",
  "motion-reduce:transition-none motion-reduce:data-[starting-style]:translate-x-0 motion-reduce:data-[starting-style]:translate-y-0 motion-reduce:data-[ending-style]:translate-x-0 motion-reduce:data-[ending-style]:translate-y-0",
);

const sideMotion: Record<SheetSide, string> = {
  left: cn(
    sheetMotionBase,
    "data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full",
  ),
  right: cn(
    sheetMotionBase,
    "data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full",
  ),
  top: cn(
    sheetMotionBase,
    "data-[starting-style]:-translate-y-[105%] data-[ending-style]:-translate-y-[105%]",
  ),
  bottom: cn(
    sheetMotionBase,
    "data-[starting-style]:translate-y-[105%] data-[ending-style]:translate-y-[105%]",
  ),
};

const sideLayout: Record<SheetSide, string> = {
  left: "fixed inset-y-0 left-0 z-[var(--primitive-z-overlay)] flex h-full w-[min(100vw,24rem)] flex-col rounded-none",
  right:
    "fixed inset-y-0 right-0 z-[var(--primitive-z-overlay)] flex h-full w-[min(100vw,24rem)] flex-col rounded-none",
  top: "fixed left-1/2 top-4 z-[var(--primitive-z-overlay)] w-[min(calc(100vw-2rem),26rem)] max-w-full -translate-x-1/2 rounded-[var(--primitive-radius-surface)]",
  bottom:
    "fixed bottom-0 left-1/2 z-[var(--primitive-z-overlay)] max-h-[94dvh] w-full max-w-lg -translate-x-1/2 rounded-t-[28px] rounded-b-none pb-[env(safe-area-inset-bottom)]",
};

function adaptOpenChange(
  onOpenChange?: (open: boolean) => void,
): ((open: boolean, details: unknown) => void) | undefined {
  if (!onOpenChange) return undefined;
  return (open) => onOpenChange(open);
}

function hasSheetTitle(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    if (child.type === SheetTitle || child.type === BaseDialog.Title) {
      return true;
    }
    return hasSheetTitle((child.props as { children?: React.ReactNode }).children);
  });
}

export interface SheetProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseDialog.Root>, "onOpenChange"> {
  onOpenChange?: (open: boolean) => void;
  /** When true, outside press does not dismiss (disablePointerDismissal). */
  persistent?: boolean;
}

export function Sheet({
  onOpenChange,
  modal = true,
  persistent = false,
  children,
  ...props
}: SheetProps) {
  return (
    <BaseDialog.Root
      modal={modal}
      disablePointerDismissal={persistent}
      onOpenChange={adaptOpenChange(onOpenChange)}
      {...props}
    >
      {children}
    </BaseDialog.Root>
  );
}

export interface SheetTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseDialog.Trigger> {
  asChild?: boolean;
}

export function SheetTrigger({ asChild = false, children, ...props }: SheetTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    const nativeButton = typeof children.type === "string" ? children.type === "button" : true;
    return (
      <BaseDialog.Trigger
        nativeButton={nativeButton}
        render={children as React.ReactElement}
        {...props}
      />
    );
  }
  return <BaseDialog.Trigger {...props}>{children}</BaseDialog.Trigger>;
}

export interface SheetCloseProps extends React.ComponentPropsWithoutRef<typeof BaseDialog.Close> {
  asChild?: boolean;
}

export function SheetClose({ asChild = false, children, ...props }: SheetCloseProps) {
  if (asChild && React.isValidElement(children)) {
    const nativeButton = typeof children.type === "string" ? children.type === "button" : true;
    return (
      <BaseDialog.Close
        nativeButton={nativeButton}
        render={children as React.ReactElement}
        {...props}
      />
    );
  }
  return <BaseDialog.Close {...props}>{children}</BaseDialog.Close>;
}

export type SheetOverlayProps = React.ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>;

export function SheetOverlay({ className, ...props }: SheetOverlayProps) {
  return <BaseDialog.Backdrop className={cn(backdropClass, className)} {...props} />;
}

export interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> {
  side?: SheetSide;
  /** @deprecated Prefer Sheet `persistent` on Root (`disablePointerDismissal`). Ignored on Content. */
  persistent?: boolean;
  showClose?: boolean;
  container?: React.ComponentPropsWithoutRef<typeof BaseDialog.Portal>["container"];
  accessibilityTitle?: string;
  /**
   * Swipe-down-to-close on a `side="bottom"` sheet. On by default for bottom sheets —
   * set false only for one that must stay open mid-gesture (e.g. an upload in
   * progress), the same case `onInteractOutside` is already used to guard.
   */
  dragToDismiss?: boolean;
}

/**
 * How far (as a fraction of the sheet's own height) or how fast a downward drag has to
 * go before release commits to closing rather than snapping back. Matching iOS's own
 * sheet feel: a confident flick closes even from near the top; a slow dawdle needs to
 * cross about a third of the sheet before it's read as "let go of this."
 */
const DISMISS_HEIGHT_FRACTION = 0.3;
const DISMISS_VELOCITY = 0.5; // px/ms
const SETTLE_MS = 220;

/**
 * Drag tracking for a bottom sheet's handle, as plain pointer events on the popup's own
 * DOM node — the same "five events and a transform, no library" approach already used
 * for swipe actions elsewhere in this codebase. Framer Motion's `drag` prop measures
 * layout in a way that fights Base UI's own open/close transition on the same element;
 * driving `transform` directly (a property Base UI's own transition never touches —
 * that's the `translate` property, via the `data-[starting/ending-style]` classes)
 * keeps the two fully independent.
 */
function useSheetDrag(
  popupRef: React.RefObject<HTMLDivElement | null>,
  closeRef: React.RefObject<HTMLButtonElement | null>,
  enabled: boolean,
) {
  const drag = React.useRef<{ startY: number; startTime: number } | null>(null);

  const settle = React.useCallback((popup: HTMLDivElement, toY: number, then?: () => void) => {
    popup.style.transition = `transform ${SETTLE_MS}ms cubic-bezier(0.23,1,0.32,1)`;
    popup.style.transform = toY === 0 ? "" : `translateY(${toY}px)`;
    const done = (event: TransitionEvent) => {
      if (event.target !== popup || event.propertyName !== "transform") return;
      popup.removeEventListener("transitionend", done);
      popup.style.transition = "";
      if (toY === 0) popup.style.transform = "";
      then?.();
    };
    popup.addEventListener("transitionend", done);
  }, []);

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled) return;
      drag.current = { startY: event.clientY, startTime: event.timeStamp };
      const popup = popupRef.current;
      if (popup) popup.style.transition = "none";
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [enabled, popupRef],
  );

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const state = drag.current;
      const popup = popupRef.current;
      if (!state || !popup) return;
      const delta = Math.max(0, event.clientY - state.startY);
      popup.style.transform = `translateY(${delta}px)`;
    },
    [popupRef],
  );

  const onPointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const state = drag.current;
      const popup = popupRef.current;
      drag.current = null;
      if (!state || !popup) return;
      const delta = Math.max(0, event.clientY - state.startY);
      const velocity = delta / Math.max(1, event.timeStamp - state.startTime);
      const shouldClose =
        delta > popup.offsetHeight * DISMISS_HEIGHT_FRACTION || velocity > DISMISS_VELOCITY;
      if (shouldClose) {
        settle(popup, popup.offsetHeight + 48, () => closeRef.current?.click());
      } else {
        settle(popup, 0);
      }
    },
    [popupRef, closeRef, settle],
  );

  return { onPointerDown, onPointerMove, onPointerUp };
}

function SheetHandle(
  props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> },
) {
  const { className, ...rest } = props;
  return (
    <div
      // A good chunk taller than the visible bar so the drag can start from a real
      // touch target, not a 4px hairline — the bar is just what that target *looks*
      // like.
      className={cn(
        "flex shrink-0 touch-none cursor-grab justify-center pb-2 pt-2.5 active:cursor-grabbing",
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="h-1 w-9 rounded-full bg-[color-mix(in_srgb,var(--foreground)_18%,transparent)]"
      />
    </div>
  );
}

export function SheetContent({
  className,
  children,
  side = "right",
  showClose = true,
  dragToDismiss = true,
  container,
  accessibilityTitle = "Sheet",
  persistent: _persistentIgnored,
  ...props
}: SheetContentProps) {
  const hasProvidedTitle = hasSheetTitle(children);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const draggable = side === "bottom" && dragToDismiss;
  const drag = useSheetDrag(popupRef, closeRef, draggable);
  // Either button renders — the visible X when `showClose`, an off-screen one when a
  // drag still needs somewhere to click through to Base UI's own close handling — so
  // there is exactly one in the DOM, never both.
  const needsCloseTarget = showClose || side === "bottom";

  return (
    <BaseDialog.Portal container={container}>
      <BaseDialog.Backdrop className={backdropClass} />
      <BaseDialog.Viewport className="fixed inset-0 z-[var(--primitive-z-overlay)] outline-none">
        <BaseDialog.Popup
          ref={popupRef}
          data-slot="sheet-content"
          data-side={side}
          data-surface="modal"
          data-wensity-primitive=""
          className={cn(
            sideLayout[side],
            modalSurfaceClass,
            sideMotion[side],
            "outline-none",
            className,
          )}
          {...props}
        >
          {hasProvidedTitle ? null : (
            <BaseDialog.Title className="sr-only">{accessibilityTitle}</BaseDialog.Title>
          )}
          {draggable ? (
            <SheetHandle
              onPointerDown={drag.onPointerDown}
              onPointerMove={drag.onPointerMove}
              onPointerUp={drag.onPointerUp}
              onPointerCancel={drag.onPointerUp}
            />
          ) : null}
          <div className="relative flex h-full min-h-0 flex-1 flex-col gap-[inherit]">
            {children}
            {needsCloseTarget ? (
              <BaseDialog.Close
                ref={closeRef}
                className={
                  showClose
                    ? cn(
                        "absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-[var(--primitive-radius-control-sm)]",
                        "border border-transparent text-[var(--muted-foreground)]",
                        "transition-[background-color,border-color,color] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease)]",
                        "hover:border-[var(--border)] hover:bg-[var(--primitive-surface-hover)] hover:text-[var(--foreground)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
                      )
                    : "sr-only"
                }
                tabIndex={showClose ? 0 : -1}
                aria-label="Close"
              >
                {showClose ? <IconX stroke={1.75} className="size-4" /> : null}
              </BaseDialog.Close>
            ) : null}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-carve="bottom" className={cn("px-5 py-4 sm:px-6 sm:py-5", className)} {...props} />
  );
}

export function SheetBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5", className)}
      {...props}
    />
  );
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-surface="footer"
      className={cn(
        "flex flex-col-reverse gap-2 px-5 py-4 sm:flex-row sm:justify-end sm:px-6",
        className,
      )}
      {...props}
    />
  );
}

export function SheetTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      className={cn(
        "pr-8 font-[family-name:var(--primitive-font-display)] text-base font-semibold tracking-[-0.015em] text-[var(--foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      className={cn("mt-1.5 text-[13px] leading-[1.55] text-[var(--muted-foreground)]", className)}
      {...props}
    />
  );
}
