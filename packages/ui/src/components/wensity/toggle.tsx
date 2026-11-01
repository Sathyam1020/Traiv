"use client";

import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { cn } from "@traiv/ui/lib/cn";

/** Segmented track: painted by data-surface="well" (a recessed groove). */
const segmentedTrackClass =
  "relative isolate overflow-hidden rounded-[var(--primitive-radius-control)]";

export type ToggleVariant = "default" | "icon" | "outline" | "soft";
export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseToggle>, "className"> {
  variant?: ToggleVariant;
  size?: ToggleSize;
  className?: string;
  onPressedChange?: (pressed: boolean) => void;
}

export interface ToggleGroupProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseToggleGroup>,
    "className" | "defaultValue" | "value" | "onValueChange" | "multiple"
  > {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  className?: string;
  children: React.ReactNode;
}

export interface ToggleGroupItemProps
  extends Omit<ToggleProps, "pressed" | "defaultPressed" | "onPressedChange"> {
  value: string;
}

type ToggleGroupContextValue = {
  type: "single" | "multiple";
  variant: ToggleVariant;
  size: ToggleSize;
  disabled?: boolean;
  segmented: boolean;
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);

const EASE_OUT_CSS = "var(--primitive-ease, cubic-bezier(0.23, 1, 0.32, 1))";
const EASE_DRAWER_CSS = "cubic-bezier(0.32, 0.72, 0, 1)";
// v2: moved onto the motion tiers (a site copy still injects v1).
const TOGGLE_STYLE_ID = "wensity-toggle-styles-v2";

const base = cn(
  "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--primitive-radius-control-sm)]",
  "text-sm font-medium leading-none tracking-[-0.01em] select-none touch-manipulation",
  // Same timing and press as Button: colour fast, release moderate, press fast.
  "transition-[background-color,border-color,color,opacity,box-shadow,translate] [transition-duration:var(--primitive-motion-fast),var(--primitive-motion-fast),var(--primitive-motion-fast),var(--primitive-motion-fast),var(--primitive-motion-moderate),var(--primitive-motion-moderate)] active:[transition-duration:var(--primitive-motion-fast)] ease-[var(--primitive-ease)]",
  "active:translate-y-px motion-reduce:active:translate-y-0 motion-reduce:transition-[background-color,border-color,color,opacity,box-shadow]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
  "disabled:pointer-events-none disabled:opacity-45 data-disabled:pointer-events-none data-disabled:opacity-45",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
);

const sizes: Record<ToggleSize, string> = {
  sm: "h-[var(--primitive-control-height-sm)] gap-1.5 px-3 text-xs [&_svg]:size-3.5",
  md: "h-[var(--primitive-control-height-md)] gap-2 px-3.5 [&_svg]:size-4",
  lg: "h-[var(--primitive-control-height-lg)] gap-2 px-4 text-[15px] [&_svg]:size-[18px]",
};

const iconSizes: Record<ToggleSize, string> = {
  sm: "size-8 gap-0 p-0 [&_svg]:size-3.5",
  md: "size-9 gap-0 p-0 [&_svg]:size-4",
  lg: "size-10 gap-0 p-0 [&_svg]:size-[18px]",
};

/**
 * Surface role per variant (`data-surface`). `toggle-fill` is flat when off
 * and a solid fill when pressed; `control` sinks into a recess when pressed;
 * soft toggles are flat with a tinted face. Variant classes only set text and
 * face colours.
 */
export const toggleSurface: Record<ToggleVariant, string> = {
  default: "toggle-fill",
  icon: "toggle-fill",
  outline: "control",
  soft: "flat",
};

const offDefault = "text-[var(--muted-foreground)] hover:text-[var(--foreground)]";

const onDefault = "text-[var(--primitive-control-solid-foreground)]";

const offOutline =
  "[--surface-face:transparent] text-[var(--muted-foreground)] hover:text-[var(--foreground)]";

const onOutline = "[--surface-face:transparent] text-[var(--foreground)]";

const offSoft =
  "[--surface-face:var(--primitive-surface-hover)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]";

const onSoft = cn(
  "[--surface-face:var(--primitive-surface-selected)] text-[var(--foreground)]",
  "[--surface-depth:var(--primitive-shadow-recess)]",
);

const variantOff: Record<ToggleVariant, string> = {
  default: offDefault,
  icon: offDefault,
  outline: offOutline,
  soft: offSoft,
};

const variantOn: Record<ToggleVariant, string> = {
  default: onDefault,
  icon: onDefault,
  outline: onOutline,
  soft: onSoft,
};

const groupItemBase = cn(
  "relative z-[1] rounded-[var(--primitive-radius-item)]",
  "data-[segmented=true]:border-transparent data-[segmented=true]:bg-transparent",
  "data-[segmented=true]:shadow-none",
  "data-[segmented=true]:hover:border-transparent",
  "data-[segmented=true]:data-pressed:border-transparent",
  "data-[segmented=true]:data-pressed:bg-transparent",
  "data-[segmented=true]:data-pressed:text-[var(--foreground)]",
  "data-[segmented=true]:data-pressed:shadow-none",
);

function ensureToggleStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(TOGGLE_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = TOGGLE_STYLE_ID;
  style.textContent = `
    [data-slot="toggle-segment-indicator"] {
      transform: translate3d(0, 0, 0);
      transition: transform var(--primitive-motion-moderate) ${EASE_DRAWER_CSS};
    }

    [data-slot="toggle-segment-indicator"][data-orientation="vertical"] {
      transition-duration: var(--primitive-motion-moderate);
    }

    [data-slot="toggle-group-item"][data-segmented="true"] {
      transition: color var(--primitive-motion-fast) ${EASE_OUT_CSS};
    }

    @media (prefers-reduced-motion: reduce) {
      [data-slot="toggle-segment-indicator"],
      [data-slot="toggle-group-item"][data-segmented="true"] {
        transition-duration: 0ms !important;
      }
    }
  `;
  document.head.appendChild(style);
}

/** Segmented items: track padding (p-1) + item height = one control height. */
const segmentedHeights: Record<ToggleSize, string> = {
  sm: "h-[calc(var(--primitive-control-height-sm)-0.5rem)]",
  md: "h-[calc(var(--primitive-control-height-md)-0.5rem)]",
  lg: "h-[calc(var(--primitive-control-height-lg)-0.5rem)]",
};

function resolveSizeClasses(variant: ToggleVariant, size: ToggleSize) {
  return variant === "icon" ? iconSizes[size] : sizes[size];
}

export function toggleVariants({
  variant = "default",
  size = "md",
  pressed = false,
  segmented = false,
  className,
}: {
  variant?: ToggleVariant;
  size?: ToggleSize;
  pressed?: boolean;
  segmented?: boolean;
  className?: string;
} = {}) {
  return cn(
    base,
    resolveSizeClasses(variant, size),
    segmented ? null : pressed ? variantOn[variant] : variantOff[variant],
    segmented && segmentedHeights[size],
    segmented && "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
    segmented && pressed && "text-[var(--foreground)]",
    className,
  );
}

function toGroupArray(
  type: "single" | "multiple",
  value: string | string[] | undefined,
): string[] | undefined {
  if (value === undefined) return undefined;
  if (type === "multiple") {
    return Array.isArray(value) ? [...value] : value ? [value] : [];
  }
  if (Array.isArray(value)) return value[0] ? [value[0]] : [];
  return value ? [value] : [];
}

function getSegmentIndex(children: React.ReactNode, selectedValue?: string) {
  const values = React.Children.toArray(children)
    .map((child) => {
      if (!React.isValidElement(child)) return undefined;
      const props = child.props as { value?: string };
      return typeof props.value === "string" ? props.value : undefined;
    })
    .filter((value): value is string => value !== undefined);

  const selectedIndex = values.findIndex((value) => value === selectedValue);
  return {
    count: values.length,
    index: selectedIndex >= 0 ? selectedIndex : 0,
  };
}

function useToggleGroupContext(component: string) {
  const context = React.useContext(ToggleGroupContext);
  if (!context) {
    throw new Error(`${component} must be used inside ToggleGroup.`);
  }
  return context;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      pressed,
      defaultPressed = false,
      disabled,
      onPressedChange,
      ...props
    },
    ref,
  ) => {
    return (
      <BaseToggle
        data-wensity-primitive=""
        ref={ref}
        data-surface={toggleSurface[variant]}
        pressed={pressed}
        defaultPressed={defaultPressed}
        disabled={disabled}
        data-slot="toggle"
        className={(state) =>
          toggleVariants({
            variant,
            size,
            pressed: state.pressed,
            className,
          })
        }
        onPressedChange={(next) => {
          onPressedChange?.(next);
        }}
        {...props}
      />
    );
  },
);

Toggle.displayName = "Toggle";

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      type = "single",
      value,
      defaultValue,
      onValueChange,
      variant = "default",
      size = "md",
      orientation = "horizontal",
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const multiple = type === "multiple";
    const segmented = type === "single";
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | string[] | undefined>(
      defaultValue,
    );
    const selectedValue = isControlled ? value : uncontrolledValue;

    const context = React.useMemo<ToggleGroupContextValue>(
      () => ({
        type,
        variant,
        size,
        disabled,
        segmented,
      }),
      [disabled, segmented, size, type, variant],
    );

    React.useEffect(() => {
      ensureToggleStyles();
    }, []);

    const segmentLayout =
      segmented && typeof selectedValue === "string"
        ? getSegmentIndex(children, selectedValue)
        : null;

    const baseValue = toGroupArray(type, value);
    const baseDefaultValue = toGroupArray(type, defaultValue);

    return (
      <ToggleGroupContext.Provider value={context}>
        <BaseToggleGroup
          data-wensity-primitive=""
          ref={ref}
          multiple={multiple}
          value={baseValue}
          defaultValue={baseDefaultValue}
          orientation={orientation}
          disabled={disabled}
          data-slot="toggle-group"
          data-type={type}
          data-surface={segmented ? "well" : undefined}
          className={cn(
            "inline-flex",
            segmented && cn(segmentedTrackClass, "p-1"),
            orientation === "horizontal"
              ? segmented
                ? "flex-row items-stretch gap-1"
                : "flex-row flex-wrap items-center gap-2"
              : segmented
                ? "flex-col gap-1"
                : "flex-col items-stretch gap-2",
            className,
          )}
          style={
            segmentLayout
              ? ({
                  "--toggle-segment-count": segmentLayout.count,
                  "--toggle-segment-index": segmentLayout.index,
                } as React.CSSProperties)
              : undefined
          }
          onValueChange={(groupValue) => {
            if (multiple) {
              if (!isControlled) setUncontrolledValue(groupValue);
              onValueChange?.(groupValue);
              return;
            }
            const next = groupValue[0] ?? "";
            if (!isControlled) setUncontrolledValue(next);
            onValueChange?.(next);
          }}
          {...props}
        >
          {segmented && segmentLayout && segmentLayout.count > 0 ? (
            <span
              aria-hidden="true"
              data-slot="toggle-segment-indicator"
              data-orientation={orientation}
              // The selected segment is a raised control sliding in the well.
              data-surface="control"
              className={cn(
                "pointer-events-none absolute rounded-[var(--primitive-radius-item)]",
                orientation === "horizontal" ? "top-1 bottom-1 left-1" : "left-1 right-1 top-1",
              )}
              style={
                orientation === "horizontal"
                  ? {
                      width:
                        "calc((100% - 0.5rem - (var(--toggle-segment-count) - 1) * 0.25rem) / var(--toggle-segment-count))",
                      transform:
                        "translate3d(calc(var(--toggle-segment-index) * (100% + 0.25rem)), 0, 0)",
                    }
                  : {
                      height:
                        "calc((100% - 0.5rem - (var(--toggle-segment-count) - 1) * 0.25rem) / var(--toggle-segment-count))",
                      transform:
                        "translate3d(0, calc(var(--toggle-segment-index) * (100% + 0.25rem)), 0)",
                    }
              }
            />
          ) : null}
          {children}
        </BaseToggleGroup>
      </ToggleGroupContext.Provider>
    );
  },
);

ToggleGroup.displayName = "ToggleGroup";

export const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ value, variant, size, disabled, className, ...props }, ref) => {
    const context = useToggleGroupContext("ToggleGroupItem");
    const itemVariant = variant ?? context.variant;
    const itemSize = size ?? context.size;
    const itemDisabled = disabled || context.disabled;

    return (
      <BaseToggle
        ref={ref}
        value={value}
        disabled={itemDisabled}
        data-slot="toggle-group-item"
        data-segmented={context.segmented ? "true" : undefined}
        data-surface={context.segmented ? undefined : toggleSurface[itemVariant]}
        className={(state) =>
          toggleVariants({
            variant: itemVariant,
            size: itemSize,
            pressed: state.pressed,
            segmented: context.segmented,
            className: cn(context.segmented && "min-w-[4.5rem] flex-1", groupItemBase, className),
          })
        }
        {...props}
      />
    );
  },
);

ToggleGroupItem.displayName = "ToggleGroupItem";
