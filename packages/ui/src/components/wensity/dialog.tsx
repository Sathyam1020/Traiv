"use client";

/**
 * Dialog — Base UI Dialog foundation (Phase 4B).
 * Focus trap/return, dismissal, portal, aria-modal, and scroll lock come from Base UI.
 * Motion is CSS keyed to data-starting-style / data-ending-style (overlay.tsx timing reference).
 * D-17: onOpenChange simplified to (open: boolean) => void; asChild maps to render.
 */

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { IconX } from "@tabler/icons-react";
import { cn } from "@traiv/ui/lib/cn";

const modalSurfaceClass = "isolate overflow-hidden rounded-[var(--primitive-radius-surface)]";

const backdropClass = cn(
  "fixed inset-0 z-[var(--primitive-z-overlay)] bg-[var(--primitive-backdrop)]",
  "transition-opacity duration-[var(--primitive-motion-slow)] ease-[var(--primitive-ease,cubic-bezier(0.23,1,0.32,1))]",
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
  "motion-reduce:transition-none",
);

const popupMotionClass = cn(
  "transition-[opacity,scale] duration-[var(--primitive-motion-slow)] ease-[var(--primitive-ease,cubic-bezier(0.23,1,0.32,1))]",
  "data-[ending-style]:duration-[var(--primitive-motion-slow-exit)]",
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
  "data-[starting-style]:scale-[0.965] data-[ending-style]:scale-[0.965]",
  "motion-reduce:transition-none motion-reduce:data-[starting-style]:scale-100 motion-reduce:data-[ending-style]:scale-100",
);

const fullscreenMotionClass = cn(
  "transition-[opacity,scale] duration-[var(--primitive-motion-slow)] ease-[var(--primitive-ease,cubic-bezier(0.23,1,0.32,1))]",
  "data-[ending-style]:duration-[var(--primitive-motion-slow-exit)]",
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
  "data-[starting-style]:scale-[0.985] data-[ending-style]:scale-[0.985]",
  "motion-reduce:transition-none motion-reduce:data-[starting-style]:scale-100 motion-reduce:data-[ending-style]:scale-100",
);

function hasDialogTitle(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    if (child.type === DialogTitle || child.type === BaseDialog.Title) {
      return true;
    }
    return hasDialogTitle((child.props as { children?: React.ReactNode }).children);
  });
}

function adaptOpenChange(
  onOpenChange?: (open: boolean) => void,
): ((open: boolean, details: unknown) => void) | undefined {
  if (!onOpenChange) return undefined;
  return (open) => onOpenChange(open);
}

export type DialogVariant = "default" | "confirmation" | "form" | "fullscreen" | "scrollable";

export interface DialogProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseDialog.Root>, "onOpenChange"> {
  onOpenChange?: (open: boolean) => void;
}

export function Dialog({ onOpenChange, modal = true, children, ...props }: DialogProps) {
  return (
    <BaseDialog.Root modal={modal} onOpenChange={adaptOpenChange(onOpenChange)} {...props}>
      {children}
    </BaseDialog.Root>
  );
}

export interface DialogTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseDialog.Trigger> {
  asChild?: boolean;
}

export function DialogTrigger({ asChild = false, children, ...props }: DialogTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    // Base UI: nativeButton must match the rendered host. Button → true; <a>/div → false.
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

export interface DialogCloseProps extends React.ComponentPropsWithoutRef<typeof BaseDialog.Close> {
  asChild?: boolean;
}

export function DialogClose({ asChild = false, children, ...props }: DialogCloseProps) {
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

export const DialogPortal = BaseDialog.Portal;

export type DialogOverlayProps = React.ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>;

export function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return <BaseDialog.Backdrop className={cn(backdropClass, className)} {...props} />;
}

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> {
  variant?: DialogVariant;
  showClose?: boolean;
  container?: React.ComponentPropsWithoutRef<typeof BaseDialog.Portal>["container"];
  /** Screen-reader label when no DialogTitle is provided. */
  accessibilityTitle?: string;
}

const contentVariants: Record<DialogVariant, string> = {
  default: "relative w-[calc(100vw-2rem)] max-w-[480px] outline-none",
  confirmation: "relative w-[calc(100vw-2rem)] max-w-[420px] outline-none",
  form: "relative w-[calc(100vw-2rem)] max-w-[540px] outline-none",
  fullscreen:
    "relative flex h-full w-full flex-col outline-none sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] md:max-h-[calc(100dvh-3rem)]",
  scrollable:
    "relative flex max-h-[min(88vh,720px)] w-[calc(100vw-2rem)] max-w-[520px] flex-col outline-none",
};

export function DialogContent({
  className,
  children,
  variant = "default",
  showClose = true,
  container,
  accessibilityTitle = "Dialog",
  ...props
}: DialogContentProps) {
  const isFullscreen = variant === "fullscreen";
  const isScrollable = variant === "scrollable";
  const hasProvidedTitle = hasDialogTitle(children);

  return (
    <BaseDialog.Portal container={container}>
      <BaseDialog.Backdrop className={backdropClass} />
      <BaseDialog.Viewport
        className={cn(
          "fixed inset-0 z-[var(--primitive-z-overlay)] flex outline-none",
          isFullscreen
            ? "items-stretch justify-stretch p-3 sm:items-center sm:justify-center sm:p-4 md:p-6"
            : "items-center justify-center p-4",
        )}
      >
        <BaseDialog.Popup
          data-surface="modal"
          data-wensity-primitive=""
          className={cn(
            contentVariants[variant],
            modalSurfaceClass,
            isFullscreen && "rounded-[var(--primitive-radius-surface)]",
            isScrollable && "min-h-0 overflow-hidden",
            isFullscreen ? fullscreenMotionClass : popupMotionClass,
            className,
          )}
          {...props}
        >
          {hasProvidedTitle ? null : (
            <BaseDialog.Title className="sr-only">{accessibilityTitle}</BaseDialog.Title>
          )}
          <div
            className={cn(
              isScrollable && "flex min-h-0 flex-1 flex-col",
              !isScrollable && "relative",
            )}
          >
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

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-carve="bottom" className={cn("px-5 py-4 sm:px-6 sm:py-5", className)} {...props} />
  );
}

export function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4 sm:px-6 sm:py-5", className)} {...props} />;
}

export function DialogScrollBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5",
        className,
      )}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
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

export function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      className={cn(
        "pr-8 font-[family-name:var(--primitive-font-display)] text-base font-semibold tracking-[-0.015em] text-[var(--foreground)] sm:text-[17px]",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({
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

export interface DialogConfirmationProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  container?: React.ComponentPropsWithoutRef<typeof BaseDialog.Portal>["container"];
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  onConfirm?: () => void;
  destructive?: boolean;
}

export function DialogConfirmation({
  open,
  onOpenChange,
  trigger,
  icon,
  title,
  description,
  container,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  destructive = false,
}: DialogConfirmationProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        variant="confirmation"
        showClose={false}
        container={container}
        accessibilityTitle={typeof title === "string" ? title : "Confirm action"}
      >
        <DialogBody className="pt-6 text-center sm:pt-7">
          {icon ? (
            <div
              className={cn(
                "mx-auto mb-4 flex size-11 items-center justify-center rounded-[var(--primitive-radius-surface)] border",
                destructive
                  ? "border-[var(--primitive-destructive-border)] bg-[var(--primitive-destructive-surface)] text-[var(--primitive-destructive)]"
                  : "border-[var(--border)] bg-[var(--primitive-surface-hover)] text-[var(--foreground)]",
              )}
            >
              {icon}
            </div>
          ) : null}
          <DialogTitle className="pr-0 text-center">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="mx-auto mt-2 max-w-[30ch] text-center">
              {description}
            </DialogDescription>
          ) : null}
        </DialogBody>
        <DialogFooter className="grid grid-cols-2 gap-2 sm:flex sm:justify-center">
          <DialogClose asChild>
            <button
              type="button"
              data-surface="control"
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-[var(--primitive-radius-control)] px-4 text-sm font-medium",
                "text-[var(--foreground)] transition-[background-color,border-color,box-shadow] duration-[var(--primitive-motion-fast)]",
              )}
            >
              {cancelLabel}
            </button>
          </DialogClose>
          <DialogClose asChild>
            <button
              type="button"
              onClick={onConfirm}
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-[var(--primitive-radius-control)] px-4 text-sm font-medium",
                "transition-[background-color,border-color] duration-[var(--primitive-motion-fast)]",
                destructive
                  ? "border border-[var(--primitive-destructive-border)] bg-[var(--primitive-destructive)] text-[var(--primitive-destructive-foreground)] hover:bg-[var(--primitive-destructive-hover)] active:bg-[var(--primitive-destructive-active)]"
                  : "border border-transparent bg-[var(--primitive-control-solid)] text-[var(--primitive-control-solid-foreground)] hover:bg-[var(--primitive-control-solid-hover)]",
              )}
            >
              {confirmLabel}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
