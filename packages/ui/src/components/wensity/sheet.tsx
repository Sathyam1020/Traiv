"use client";

/**
 * Sheet — Base UI Dialog styled as an edge panel (Phase 4B).
 * Focus/dismissal/portal/scroll-lock from Base UI; motion CSS on starting/ending attrs.
 * D-17: asChild → render; persistent → Root disablePointerDismissal.
 */

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { IconX } from "@tabler/icons-react";
import { cn } from "@traiv/ui/lib/cn";

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
}

export function SheetContent({
  className,
  children,
  side = "right",
  showClose = true,
  container,
  accessibilityTitle = "Sheet",
  persistent: _persistentIgnored,
  ...props
}: SheetContentProps) {
  const hasProvidedTitle = hasSheetTitle(children);

  return (
    <BaseDialog.Portal container={container}>
      <BaseDialog.Backdrop className={backdropClass} />
      <BaseDialog.Viewport className="fixed inset-0 z-[var(--primitive-z-overlay)] outline-none">
        <BaseDialog.Popup
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
          <div className="relative flex h-full min-h-0 flex-1 flex-col gap-[inherit]">
            {children}
            {showClose ? (
              <BaseDialog.Close
                className={cn(
                  "absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-[var(--primitive-radius-control-sm)]",
                  "border border-transparent text-[var(--muted-foreground)]",
                  "transition-[background-color,border-color,color] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease)]",
                  "hover:border-[var(--border)] hover:bg-[var(--primitive-surface-hover)] hover:text-[var(--foreground)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
                )}
                aria-label="Close"
              >
                <IconX stroke={1.75} className="size-4" />
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
