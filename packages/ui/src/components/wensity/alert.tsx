"use client";

import * as React from "react";
import {
  IconAlertTriangle,
  IconCheck,
  IconCircleX,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@traiv/ui/lib/cn";

export type AlertVariant = "neutral" | "info" | "success" | "warning" | "error";
export type AlertDensity = "comfortable" | "compact";

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  density?: AlertDensity;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export type AlertTitleProps = React.HTMLAttributes<HTMLDivElement>;

export type AlertDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

/** Status-token recipes — source of truth for Phase 7 status system. */
const variantStyles: Record<
  AlertVariant,
  {
    root: string;
    icon: string;
    iconNode: React.ReactNode;
  }
> = {
  neutral: {
    root: cn("text-[var(--foreground)]"),
    icon: "text-[var(--primitive-text-secondary)]",
    iconNode: <IconInfoCircle stroke={1.9} />,
  },
  info: {
    root: cn(
      "[--surface-face:var(--primitive-info-surface)] [--surface-rim:var(--primitive-info-border)] [--surface-rim-top:var(--primitive-info-border)] text-[var(--foreground)]",
    ),
    icon: "text-[var(--primitive-info)]",
    iconNode: <IconInfoCircle stroke={1.9} />,
  },
  success: {
    root: cn(
      "[--surface-face:var(--primitive-success-surface)] [--surface-rim:var(--primitive-success-border)] [--surface-rim-top:var(--primitive-success-border)] text-[var(--foreground)]",
    ),
    icon: "text-[var(--primitive-success)]",
    iconNode: <IconCheck stroke={2.1} />,
  },
  warning: {
    root: cn(
      "[--surface-face:var(--primitive-warning-surface)] [--surface-rim:var(--primitive-warning-border)] [--surface-rim-top:var(--primitive-warning-border)] text-[var(--foreground)]",
    ),
    icon: "text-[var(--primitive-warning)]",
    iconNode: <IconAlertTriangle stroke={1.9} />,
  },
  error: {
    root: cn(
      "[--surface-face:var(--primitive-destructive-surface)] [--surface-rim:var(--primitive-destructive-border)] [--surface-rim-top:var(--primitive-destructive-border)] text-[var(--foreground)]",
    ),
    icon: "text-[var(--primitive-destructive)]",
    iconNode: <IconCircleX stroke={1.9} />,
  },
};

const densityStyles: Record<AlertDensity, string> = {
  comfortable: "gap-3 px-3.5 py-3",
  compact: "gap-2.5 px-3 py-2.5",
};

function alertRole(variant: AlertVariant): "alert" | "status" {
  return variant === "error" || variant === "warning" ? "alert" : "status";
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "info",
      density = "comfortable",
      title,
      description,
      icon,
      action,
      onDismiss,
      dismissLabel = "Dismiss alert",
      children,
      ...props
    },
    ref,
  ) => {
    const styles = variantStyles[variant];

    return (
      <div
        data-wensity-primitive=""
        data-surface="panel"
        ref={ref}
        role={alertRole(variant)}
        data-slot="alert"
        data-variant={variant}
        className={cn(
          "wensity-alert relative isolate flex overflow-hidden rounded-[var(--primitive-radius-surface)]",
          "motion-safe:animate-[wensity-alert-enter_var(--primitive-motion-moderate)_var(--primitive-ease,cubic-bezier(0.22,1,0.36,1))_both]",
          densityStyles[density],
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
            {title ? <AlertTitle>{title}</AlertTitle> : null}
            {description ? <AlertDescription>{description}</AlertDescription> : null}
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
              "transition-[background,color,border-color] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.22,1,0.36,1))]",
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
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<HTMLDivElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-title"
      className={cn(
        "font-[family-name:var(--primitive-font-display)] text-[13px] font-semibold leading-5 tracking-[-0.01em] text-[var(--foreground)]",
        className,
      )}
      {...props}
    />
  ),
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn("text-[12.5px] leading-5 text-[var(--primitive-text-secondary)]", className)}
      {...props}
    />
  ),
);
AlertDescription.displayName = "AlertDescription";
