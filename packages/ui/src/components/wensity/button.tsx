"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "@traiv/ui/lib/cn";

export type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "white"
  | "destructive"
  | "link";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
  disabled?: boolean;
  /** Keep the button focusable while disabled (Base UI behavior). */
  focusableWhenDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Animate the left icon on hover. */
  leftIconMotion?: "trash" | "mail";
  /** Animate the right icon on hover. */
  rightIconMotion?: "arrow" | "download";
}

const base =
  "wensity-button relative inline-flex shrink-0 transform-gpu items-center justify-center gap-2 whitespace-nowrap rounded-[var(--primitive-radius-control)] " +
  "text-sm font-medium select-none touch-manipulation " +
  // Colour answers fast; the release (depth + press) settles on moderate, and
  // pressing drops every property to fast so the press lands immediately.
  "transition-[background-color,border-color,box-shadow,color,opacity,translate] [transition-duration:var(--primitive-motion-fast),var(--primitive-motion-fast),var(--primitive-motion-moderate),var(--primitive-motion-fast),var(--primitive-motion-fast),var(--primitive-motion-moderate)] active:[transition-duration:var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.23,1,0.32,1))] motion-reduce:transition-[background-color,border-color,box-shadow,color,opacity] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] " +
  "disabled:pointer-events-none disabled:opacity-45 data-disabled:pointer-events-none data-disabled:opacity-45 " +
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

// Press: the face drops 1px (same at any width, unlike a scale) while the
// surface role sinks it into a recess.
const pressable =
  "active:translate-y-px motion-reduce:active:translate-y-0 disabled:active:translate-y-0 data-disabled:active:translate-y-0";

/**
 * Surface role per variant (`data-surface`). The role paints face, rim, lit
 * top edge, depth and the hover / press / open states; the variant classes
 * below only pick colours by overriding `--surface-face`.
 *
 * When `buttonVariants()` styles another element (a link, a menu trigger),
 * give that element `data-surface={buttonSurface[variant]}` too.
 */
export const buttonSurface: Record<ButtonVariant, string | undefined> = {
  default: "fill",
  secondary: "control",
  outline: "control",
  ghost: "flat",
  white: "fill",
  destructive: "fill",
  link: undefined,
};

const variants: Record<ButtonVariant, string> = {
  default: cn(
    pressable,
    "text-[var(--primitive-control-solid-foreground)] " +
      "hover:[--surface-face:var(--primitive-control-solid-hover)] active:[--surface-face:var(--primitive-control-solid-active)]",
  ),
  // Light: soft grey control; dark: the control face (one step above the panel).
  secondary: cn(
    pressable,
    "[--surface-face:var(--muted)] dark:[--surface-face:var(--primitive-control-face)] text-[var(--foreground)]",
  ),
  outline: cn(pressable, "[--surface-face:transparent] text-[var(--foreground)]"),
  ghost: cn(pressable, "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"),
  // Light: a white fill; dark: shares the solid finish with default.
  white: cn(
    pressable,
    "[--surface-face:var(--primitive-surface-elevated)] text-[var(--foreground)] " +
      "dark:[--surface-face:var(--primitive-control-solid)] dark:text-[var(--primitive-control-solid-foreground)] " +
      "dark:hover:[--surface-face:var(--primitive-control-solid-hover)] dark:active:[--surface-face:var(--primitive-control-solid-active)]",
  ),
  destructive: cn(
    pressable,
    "[--surface-face:var(--primitive-destructive)] text-[var(--primitive-destructive-foreground)] " +
      "hover:[--surface-face:var(--primitive-destructive-hover)] active:[--surface-face:var(--primitive-destructive-active)]",
  ),
  link:
    "h-auto border border-transparent bg-transparent px-0 font-medium text-[var(--foreground)] underline-offset-4 " +
    "hover:text-[var(--muted-foreground)] hover:underline hover:decoration-[color-mix(in_srgb,var(--foreground)_35%,transparent)] " +
    "active:translate-y-0 active:text-[var(--foreground)]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-[var(--primitive-control-height-sm)] gap-1.5 px-3.5 text-xs",
  md: "h-[var(--primitive-control-height-md)] gap-2 px-4",
  lg: "h-[var(--primitive-control-height-lg)] gap-2 px-5 text-[15px]",
  icon: "h-9 w-9 gap-0 p-0",
};

const ICON_SHELL = "relative z-10 inline-flex shrink-0";

const ICON_MOTION_SHELL = "btn-icon-motion inline-flex shrink-0 origin-center transform-gpu";

const leftIconMotionClass = {
  trash: cn(ICON_MOTION_SHELL, "btn-icon-motion--trash"),
  mail: cn(ICON_MOTION_SHELL, "btn-icon-motion--mail"),
} as const;

const rightIconMotionClass = {
  arrow: cn(ICON_MOTION_SHELL, "btn-icon-motion--arrow"),
  download: cn(ICON_MOTION_SHELL, "btn-icon-motion--download"),
} as const;

const BUTTON_ICON_KEYFRAMES_ID = "button-icon-keyframes";

function ensureButtonIconKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(BUTTON_ICON_KEYFRAMES_ID)) return;

  const style = document.createElement("style");
  style.id = BUTTON_ICON_KEYFRAMES_ID;
  // The icon keyframes below run 300-340ms on purpose: expressive icon actions
  // (shake, lift, tick) are the one exception to the motion tiers.
  style.textContent = `
    @keyframes button-trash-shake {
      0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
      24% { transform: translate3d(-0.5px, -1px, 0) rotate(-4deg); }
      48% { transform: translate3d(0.5px, -1px, 0) rotate(3deg); }
      72% { transform: translate3d(-0.25px, -0.5px, 0) rotate(-1.5deg); }
    }
    @keyframes button-mail-lift {
      0% { transform: translate3d(0, 0, 0) rotate(0deg); }
      46% { transform: translate3d(2px, -2px, 0) rotate(-5deg); }
      100% { transform: translate3d(0, 0, 0) rotate(0deg); }
    }
    @keyframes button-download-tick {
      0%, 100% { transform: translate3d(0, 0, 0); }
      46% { transform: translate3d(0, 2.5px, 0); }
    }
    .btn-icon-motion--arrow {
      transition: transform var(--primitive-motion-moderate) var(--primitive-ease, cubic-bezier(0.23, 1, 0.32, 1));
    }
    @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
      .wensity-button:hover .btn-icon-motion--trash {
        animation: button-trash-shake 340ms var(--primitive-ease, cubic-bezier(0.23, 1, 0.32, 1)) both;
      }
      .wensity-button:hover .btn-icon-motion--mail {
        animation: button-mail-lift 320ms var(--primitive-ease, cubic-bezier(0.23, 1, 0.32, 1)) both;
      }
      .wensity-button:hover .btn-icon-motion--arrow {
        transform: translate3d(2px, 0, 0);
      }
      .wensity-button:active .btn-icon-motion--arrow {
        transform: translate3d(1px, 0, 0);
      }
      .wensity-button:hover .btn-icon-motion--download {
        animation: button-download-tick 300ms var(--primitive-ease, cubic-bezier(0.23, 1, 0.32, 1)) both;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .btn-icon-motion {
        animation: none !important;
        transition: none !important;
        transform: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

export function buttonVariants({
  variant = "default",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      asChild = false,
      loading = false,
      disabled = false,
      focusableWhenDisabled,
      leftIcon,
      rightIcon,
      leftIconMotion,
      rightIconMotion,
      children,
      type,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const hasIconMotion = Boolean(leftIconMotion || rightIconMotion);

    React.useLayoutEffect(() => {
      if (hasIconMotion) ensureButtonIconKeyframes();
    }, [hasIconMotion]);

    const composedClassName = buttonVariants({
      variant,
      size,
      className: cn(hasIconMotion && "group", className),
    });

    const content = (
      <>
        {loading ? <ButtonSpinner /> : null}
        {!loading && leftIcon ? (
          <span className={cn(ICON_SHELL, leftIconMotion && leftIconMotionClass[leftIconMotion])}>
            {leftIcon}
          </span>
        ) : null}
        {size === "icon" && !loading && !leftIcon && !rightIcon ? (
          <span className={cn(ICON_SHELL, "items-center justify-center")}>{children}</span>
        ) : (
          <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
        )}
        {!loading && rightIcon ? (
          <span
            className={cn(ICON_SHELL, rightIconMotion && rightIconMotionClass[rightIconMotion])}
          >
            {rightIcon}
          </span>
        ) : null}
      </>
    );

    if (asChild && React.isValidElement(children)) {
      // Compose Base UI Button props onto the provided child element (e.g. <a>).
      // The child owns the DOM tag; wrapped content still renders through its children.
      return (
        <BaseButton
          data-wensity-primitive=""
          data-surface={buttonSurface[variant]}
          ref={ref as React.Ref<HTMLElement>}
          disabled={isDisabled}
          focusableWhenDisabled={focusableWhenDisabled}
          nativeButton={false}
          className={composedClassName}
          aria-busy={loading ? true : undefined}
          data-loading={loading ? "" : undefined}
          render={children as React.ReactElement}
          {...props}
        />
      );
    }

    return (
      <BaseButton
        data-wensity-primitive=""
        data-surface={buttonSurface[variant]}
        ref={ref}
        disabled={isDisabled}
        focusableWhenDisabled={focusableWhenDisabled}
        type={type ?? "button"}
        className={composedClassName}
        aria-busy={loading ? true : undefined}
        data-loading={loading ? "" : undefined}
        {...props}
      >
        {content}
      </BaseButton>
    );
  },
);

Button.displayName = "Button";

function ButtonSpinner() {
  return (
    <span
      aria-hidden="true"
      className="relative z-10 size-3.5 shrink-0 rounded-full border-2 border-current border-r-transparent opacity-80 motion-safe:animate-spin"
    />
  );
}
