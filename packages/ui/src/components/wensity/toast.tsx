"use client";

import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import {
  IconAlertTriangle,
  IconCheck,
  IconCircleX,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@traiv/ui/lib/cn";

export type ToastVariant = "info" | "success" | "warning" | "error" | "action";
export type ToastPlacement =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: ToastVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export interface ToastViewportProps
  extends React.ComponentPropsWithoutRef<typeof BaseToast.Viewport> {
  placement?: ToastPlacement;
}

export type ToastProviderProps = React.ComponentPropsWithoutRef<typeof BaseToast.Provider>;

export type ToastData = {
  variant?: ToastVariant;
};

const variantStyles: Record<
  ToastVariant,
  {
    root: string;
    icon: string;
    iconNode: React.ReactNode;
  }
> = {
  info: {
    root: cn(
      "[--surface-face:var(--primitive-info-surface)] [--surface-rim:var(--primitive-info-border)] [--surface-rim-top:var(--primitive-info-border)]",
      "text-[var(--foreground)]",
    ),
    icon: "text-[var(--primitive-info)]",
    iconNode: <IconInfoCircle stroke={1.9} />,
  },
  success: {
    root: cn(
      "[--surface-face:var(--primitive-success-surface)] [--surface-rim:var(--primitive-success-border)] [--surface-rim-top:var(--primitive-success-border)]",
      "text-[var(--foreground)]",
    ),
    icon: "text-[var(--primitive-success)]",
    iconNode: <IconCheck stroke={2.1} />,
  },
  warning: {
    root: cn(
      "[--surface-face:var(--primitive-warning-surface)] [--surface-rim:var(--primitive-warning-border)] [--surface-rim-top:var(--primitive-warning-border)]",
      "text-[var(--foreground)]",
    ),
    icon: "text-[var(--primitive-warning)]",
    iconNode: <IconAlertTriangle stroke={1.9} />,
  },
  error: {
    root: cn(
      "[--surface-face:var(--primitive-destructive-surface)] [--surface-rim:var(--primitive-destructive-border)] [--surface-rim-top:var(--primitive-destructive-border)]",
      "text-[var(--foreground)]",
    ),
    icon: "text-[var(--primitive-destructive)]",
    iconNode: <IconCircleX stroke={1.9} />,
  },
  action: {
    root: cn("[--surface-face:var(--primitive-surface-elevated)]", "text-[var(--foreground)]"),
    icon: "text-[var(--primitive-text-secondary)]",
    iconNode: <IconInfoCircle stroke={1.9} />,
  },
};

const placementClasses: Record<ToastPlacement, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-right": "top-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-right": "right-4 bottom-4 items-end",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

const toastMotionClass = cn(
  "transition-[opacity,transform] duration-[var(--primitive-motion-moderate)] ease-[var(--primitive-ease,cubic-bezier(0.22,1,0.36,1))]",
  "data-[ending-style]:duration-[var(--primitive-motion-moderate-exit)]",
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
  "data-[starting-style]:-translate-y-2 data-[ending-style]:-translate-y-1",
  "data-[swipe-direction=up][data-ending-style]:-translate-y-[150%]",
  "data-[swipe-direction=down][data-ending-style]:translate-y-[150%]",
  "data-[swipe-direction=left][data-ending-style]:-translate-x-[150%]",
  "data-[swipe-direction=right][data-ending-style]:translate-x-[150%]",
  "motion-reduce:transition-none motion-reduce:data-[starting-style]:translate-y-0 motion-reduce:data-[ending-style]:translate-y-0",
);

function toastRole(variant: ToastVariant): "alert" | "status" {
  return variant === "error" || variant === "warning" ? "alert" : "status";
}

/** Local Base UI provider — open-code, not a Wensity runtime dependency. */
export function ToastProvider({
  children,
  timeout = 5000,
  limit = 3,
  ...props
}: ToastProviderProps) {
  return (
    <BaseToast.Provider timeout={timeout} limit={limit} {...props}>
      {children}
    </BaseToast.Provider>
  );
}
ToastProvider.displayName = "ToastProvider";

export const useToastManager = BaseToast.useToastManager;
export const createToastManager = BaseToast.createToastManager;

/**
 * Presentational toast surface (status tokens). Use inside Base UI Root or
 * standalone for static demos; prefer ToastList + useToastManager for queues.
 */
export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant = "info",
      title,
      description,
      icon,
      action,
      onDismiss,
      dismissLabel = "Dismiss notification",
      children,
      ...props
    },
    ref,
  ) => {
    const styles = variantStyles[variant];

    return (
      <div
        data-wensity-primitive=""
        data-surface="overlay"
        ref={ref}
        role={toastRole(variant)}
        data-slot="toast"
        data-variant={variant}
        className={cn(
          "relative isolate flex w-full max-w-sm gap-3 overflow-hidden rounded-[var(--primitive-radius-surface)]",
          "px-3.5 py-3",
          // Solid surfaces — never translucent/glass (stacked toasts must not bleed through)
          "backdrop-blur-none",
          styles.root,
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center opacity-95 [&_svg]:size-[18px]",
            styles.icon,
          )}
        >
          {icon ?? styles.iconNode}
        </span>
        <div className="min-w-0 flex-1">
          <div className="space-y-1">
            {title ? (
              <div className="font-[family-name:var(--primitive-font-display)] text-[13px] font-semibold leading-5 tracking-[-0.01em] text-[var(--foreground)]">
                {title}
              </div>
            ) : null}
            {description ? (
              <div className="text-[12.5px] leading-5 text-[var(--primitive-text-secondary)]">
                {description}
              </div>
            ) : null}
            {children}
          </div>
        </div>
        {action ? (
          <div className="ml-2 flex shrink-0 items-center self-center">{action}</div>
        ) : null}
        {onDismiss ? (
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={onDismiss}
            className={cn(
              "-mr-1 flex size-7 shrink-0 items-center justify-center rounded-[var(--primitive-radius-control-sm)]",
              "text-[var(--primitive-text-secondary)]",
              "transition-[background,color] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.22,1,0.36,1))]",
              "hover:bg-[var(--primitive-surface-hover)] hover:text-[var(--foreground)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
            )}
          >
            <IconX aria-hidden="true" className="size-4" stroke={1.9} />
          </button>
        ) : null}
      </div>
    );
  },
);
Toast.displayName = "Toast";

export const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  ({ className, placement = "top-right", ...props }, ref) => (
    <BaseToast.Portal>
      <BaseToast.Viewport
        data-wensity-primitive=""
        ref={ref}
        data-slot="toast-viewport"
        className={cn(
          "pointer-events-none fixed z-[var(--primitive-z-toast)] flex w-[min(calc(100vw-2rem),24rem)] flex-col gap-2 outline-none",
          placementClasses[placement],
          "[&_[data-slot=toast]]:pointer-events-auto",
          className,
        )}
        {...props}
      />
    </BaseToast.Portal>
  ),
);
ToastViewport.displayName = "ToastViewport";

export interface ToastListProps {
  placement?: ToastPlacement;
  className?: string;
}

/** Renders the live Base UI toast queue with Wensity status styling. */
export function ToastList({ placement = "top-right", className }: ToastListProps) {
  const { toasts } = useToastManager<ToastData>();

  return (
    <ToastViewport placement={placement} className={className}>
      {toasts.map((toast) => {
        const variant = (toast.data?.variant ?? toast.type ?? "info") as ToastVariant;
        const styles = variantStyles[variant] ?? variantStyles.info;

        return (
          <BaseToast.Root
            data-wensity-primitive=""
            data-surface="overlay"
            key={toast.id}
            toast={toast}
            swipeDirection={placement.startsWith("bottom") ? "down" : "up"}
            data-slot="toast"
            data-variant={variant}
            className={cn(
              "relative isolate flex w-full max-w-sm gap-3 overflow-hidden rounded-[var(--primitive-radius-surface)]",
              "px-3.5 py-3",
              "backdrop-blur-none",
              "z-[calc(var(--primitive-z-toast)-var(--toast-index,0))]",
              styles.root,
              toastMotionClass,
              "data-[limited]:opacity-0",
            )}
          >
            <BaseToast.Content className="flex w-full gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center opacity-95 [&_svg]:size-[18px]",
                  styles.icon,
                )}
              >
                {styles.iconNode}
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                {toast.title ? (
                  <BaseToast.Title className="font-[family-name:var(--primitive-font-display)] text-[13px] font-semibold leading-5 tracking-[-0.01em] text-[var(--foreground)]">
                    {toast.title}
                  </BaseToast.Title>
                ) : null}
                {toast.description ? (
                  <BaseToast.Description className="text-[12.5px] leading-5 text-[var(--primitive-text-secondary)]">
                    {toast.description}
                  </BaseToast.Description>
                ) : null}
              </div>
              {toast.actionProps ? (
                <BaseToast.Action
                  {...toast.actionProps}
                  className={cn(
                    "ml-2 shrink-0 self-center rounded-[var(--primitive-radius-control-sm)] px-2.5 py-1.5 text-xs font-medium",
                    "bg-[var(--primitive-control-solid)] text-[var(--primitive-control-solid-foreground)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
                    toast.actionProps.className,
                  )}
                />
              ) : null}
              <BaseToast.Close
                aria-label="Dismiss notification"
                className={cn(
                  "-mr-1 flex size-7 shrink-0 items-center justify-center rounded-[var(--primitive-radius-control-sm)]",
                  "text-[var(--primitive-text-secondary)]",
                  "hover:bg-[var(--primitive-surface-hover)] hover:text-[var(--foreground)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
                )}
              >
                <IconX aria-hidden="true" className="size-4" stroke={1.9} />
              </BaseToast.Close>
            </BaseToast.Content>
          </BaseToast.Root>
        );
      })}
    </ToastViewport>
  );
}
ToastList.displayName = "ToastList";
