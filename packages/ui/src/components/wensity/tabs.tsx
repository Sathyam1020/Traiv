"use client";

/**
 * Tabs — Base UI Tabs foundation (Phase 5).
 * Base UI owns tablist/tab/tabpanel roles, roving focus, and aria-selected;
 * the Framer indicator (layoutId glide) reads the mirrored active value from
 * context and is gated by `useReducedMotion` → instant swap under RM
 * (closes PRIM-MOTION-002 for tabs).
 *
 * NOTE (PRIM-API-002): `variant="vertical"` is orientation, not a pure style.
 * It stays as a variant for shipped API compat and internally sets the Base UI
 * Root orientation.
 */

import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { cn } from "@traiv/ui/lib/cn";

/* ─── Types ─────────────────────────────────────────────────── */

export type TabsVariant = "default" | "underline" | "pills" | "segmented" | "vertical";

export type TabsSize = "sm" | "md" | "lg";

export interface TabsProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseTabs.Root>,
    "value" | "defaultValue" | "onValueChange" | "orientation"
  > {
  variant?: TabsVariant;
  size?: TabsSize;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export type TabsListProps = React.ComponentPropsWithoutRef<typeof BaseTabs.List>;

export interface TabsTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseTabs.Tab>, "value"> {
  value: string;
}

export type TabsContentProps = React.ComponentPropsWithoutRef<typeof BaseTabs.Panel>;

/* ─── Context (variant/size + mirrored active value) ────────── */

type TabsContextValue = {
  variant: TabsVariant;
  size: TabsSize;
  activeValue: string | null;
  layoutId: string;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs subcomponents must be used within <Tabs>");
  }
  return ctx;
}

/* ─── Size / list / trigger visual maps ─────────────────────── */

const triggerSizes: Record<TabsSize, string> = {
  sm: "h-7 px-2.5 text-xs gap-1.5 [&_svg]:size-3",
  md: "h-8 px-3 text-sm gap-2 [&_svg]:size-3.5",
  lg: "h-9 px-3.5 text-[15px] gap-2 [&_svg]:size-4",
};

const listGaps: Record<TabsSize, string> = {
  sm: "gap-0.5",
  md: "gap-1",
  lg: "gap-1",
};

const listVariantClasses: Record<TabsVariant, string> = {
  default: "",
  underline: "border-b border-[var(--border)]",
  pills: "",
  // Painted by data-surface="well": a recessed track the indicator slides in.
  segmented: "rounded-[var(--primitive-radius-control)] p-1",
  vertical: cn("flex-col items-stretch", "border-l border-[var(--border)]", "pl-0"),
};

const triggerBase = cn(
  // isolate: the selected indicator (z -1) stays above the list's hover glide.
  "relative isolate inline-flex shrink-0 items-center justify-center whitespace-nowrap",
  "font-medium leading-none tracking-[-0.01em] select-none touch-manipulation",
  "rounded-[var(--primitive-radius-item)] outline-none cursor-default",
  "transition-[color,background-color] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.23,1,0.32,1))]",
  "motion-reduce:transition-none",
  "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
  "data-disabled:pointer-events-none data-disabled:opacity-45",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
);

function triggerVariantClasses(variant: TabsVariant, isActive: boolean): string {
  switch (variant) {
    case "default":
      return isActive ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]";
    case "underline":
      return isActive
        ? "text-[var(--foreground)] rounded-none"
        : "text-[var(--muted-foreground)] rounded-none";
    case "pills":
      return isActive
        ? "text-[var(--foreground)] rounded-full"
        : "text-[var(--muted-foreground)] rounded-full";
    case "segmented":
      return isActive ? "text-[var(--foreground)] z-[1]" : "text-[var(--muted-foreground)] z-[1]";
    case "vertical":
      return isActive
        ? "text-[var(--foreground)] justify-start rounded-none"
        : "text-[var(--muted-foreground)] justify-start rounded-none";
    default:
      return "";
  }
}

/** Text-only: the list's glide highlight is the hover background. */
const hoverClasses: Record<TabsVariant, string> = {
  default: "hover:text-[var(--foreground)]",
  underline: "hover:text-[var(--foreground)]",
  pills: "hover:text-[var(--foreground)]",
  segmented: "hover:text-[var(--foreground)]",
  vertical: "hover:text-[var(--foreground)]",
};

/** The moderate motion tier (--primitive-motion-moderate): the indicator glides, no bounce. */
const indicatorSpring = { type: "spring" as const, duration: 0.16, bounce: 0 };

/* ─── <Tabs> ────────────────────────────────────────────────── */

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    variant = "default",
    size = "md",
    value: valueProp,
    defaultValue,
    onValueChange,
    className,
    children,
    ...props
  },
  ref,
) {
  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = React.useState<string | null>(defaultValue ?? null);
  const activeValue: string | null = isControlled ? (valueProp ?? null) : internal;
  const layoutId = React.useId();

  const handleValueChange = React.useCallback(
    (value: unknown) => {
      const next = (value ?? null) as string | null;
      if (!isControlled) setInternal(next);
      if (typeof next === "string") onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const ctx = React.useMemo<TabsContextValue>(
    () => ({ variant, size, activeValue, layoutId }),
    [variant, size, activeValue, layoutId],
  );

  return (
    <TabsContext.Provider value={ctx}>
      <BaseTabs.Root
        data-wensity-primitive=""
        ref={ref}
        value={activeValue as never}
        defaultValue={defaultValue as never}
        onValueChange={handleValueChange}
        orientation={variant === "vertical" ? "vertical" : "horizontal"}
        data-variant={variant}
        className={cn(variant === "vertical" ? "flex gap-4" : "flex flex-col", className)}
        {...props}
      >
        <LayoutGroup id={layoutId}>{children}</LayoutGroup>
      </BaseTabs.Root>
    </TabsContext.Provider>
  );
});

/* ─── <TabsList> ────────────────────────────────────────────── */

/* ─── Glide hover ───────────────────────────────────────────── */

/**
 * One hover highlight per list. It glides (fast motion tier) to the item
 * nearest the pointer, stays lit across the gaps between items, fades in where
 * the pointer enters instead of sliding over from its last spot, and a click
 * in a gap goes to the lit item. Items opt in with `data-glide-item`.
 */
type GlideRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  session: number;
  visible: boolean;
};

const GLIDE_SPRING = { type: "spring", duration: 0.08, bounce: 0 } as const;

function useGlideHover<T extends HTMLElement = HTMLElement>(
  axis: "x" | "y" | "xy",
  {
    gapClick = true,
    itemSelector = "[data-glide-item]",
  }: { gapClick?: boolean; itemSelector?: string } = {},
) {
  const containerRef = React.useRef<T | null>(null);
  const activeRef = React.useRef<HTMLElement | null>(null);
  const sessionRef = React.useRef(0);
  const [glide, setGlide] = React.useState<GlideRect | null>(null);

  const pick = React.useCallback(
    (clientX: number, clientY: number) => {
      const root = containerRef.current;
      if (!root) return;
      let best: HTMLElement | null = null;
      let bestDistance = Infinity;
      for (const item of root.querySelectorAll<HTMLElement>(itemSelector)) {
        if (item.matches(':disabled, [data-disabled], [aria-disabled="true"]')) continue;
        const r = item.getBoundingClientRect();
        if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
          best = item;
          break;
        }
        const dx = axis === "y" ? 0 : clientX - (r.left + r.width / 2);
        const dy = axis === "x" ? 0 : clientY - (r.top + r.height / 2);
        const distance = dx * dx + dy * dy;
        if (distance < bestDistance) {
          bestDistance = distance;
          best = item;
        }
      }
      activeRef.current = best;
      if (!best) return;
      const rootRect = root.getBoundingClientRect();
      const r = best.getBoundingClientRect();
      const x = r.left - rootRect.left - root.clientLeft + root.scrollLeft;
      const y = r.top - rootRect.top - root.clientTop + root.scrollTop;
      const session = sessionRef.current;
      setGlide((prev) =>
        prev &&
        prev.visible &&
        prev.session === session &&
        prev.x === x &&
        prev.y === y &&
        prev.w === r.width &&
        prev.h === r.height
          ? prev
          : { x, y, w: r.width, h: r.height, session, visible: true },
      );
    },
    [axis, itemSelector],
  );

  const handlers = {
    onPointerEnter(event: React.PointerEvent) {
      if (event.pointerType !== "mouse") return;
      sessionRef.current += 1;
      pick(event.clientX, event.clientY);
    },
    onPointerMove(event: React.PointerEvent) {
      if (event.pointerType === "mouse") pick(event.clientX, event.clientY);
    },
    onPointerLeave() {
      activeRef.current = null;
      setGlide((prev) => (prev ? { ...prev, visible: false } : prev));
    },
    onClick(event: React.MouseEvent) {
      if (!gapClick) return;
      // Membership, not closest(): a scoped selector (":scope > li > …") only
      // matches from the container, so test each item for the click target.
      const root = containerRef.current;
      const target = event.target as Node;
      if (
        root &&
        Array.from(root.querySelectorAll(itemSelector)).some((item) => item.contains(target))
      )
        return;
      activeRef.current?.click();
    },
  };

  return { containerRef, glide, handlers };
}

function GlideHighlight({ glide, className }: { glide: GlideRect | null; className?: string }) {
  const reduceMotion = useReducedMotion();
  if (!glide) return null;
  const box = { x: glide.x, y: glide.y, width: glide.w, height: glide.h };
  return (
    <motion.span
      key={glide.session}
      aria-hidden="true"
      data-slot="glide-highlight"
      className={cn(
        "pointer-events-none absolute left-0 top-0 z-0 bg-[var(--primitive-surface-hover)]",
        className,
      )}
      initial={{ ...box, opacity: 0 }}
      animate={{ ...box, opacity: glide.visible ? 1 : 0 }}
      transition={
        reduceMotion
          ? { duration: 0, opacity: { duration: 0.08 } }
          : { ...GLIDE_SPRING, opacity: { duration: glide.visible ? 0.08 : 0.06 } }
      }
    />
  );
}

/**
 * One callback ref for the glide container and the caller's ref, so the caller
 * always gets the mounted element (also on branches without the glide).
 */
function assignGlideRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as React.RefObject<T | null>).current = node;
}

function useGlideRef<T extends HTMLElement>(
  forwarded: React.ForwardedRef<T>,
  containerRef: React.RefObject<T | null>,
) {
  return React.useCallback(
    (node: T | null) => {
      assignGlideRef(containerRef, node);
      assignGlideRef(forwarded, node);
    },
    [forwarded, containerRef],
  );
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, children, onPointerEnter, onPointerMove, onPointerLeave, onClick, ...props },
  ref,
) {
  const { variant, size } = useTabsContext();
  // Underline tabs keep a still text-only hover; every other variant glides.
  const glideOn = variant !== "underline";
  const glide = useGlideHover<HTMLDivElement>(variant === "vertical" ? "y" : "x");
  const listRef = useGlideRef(ref, glide.containerRef);
  return (
    <BaseTabs.List
      ref={listRef}
      data-variant={variant}
      data-surface={variant === "segmented" ? "well" : undefined}
      className={cn(
        "relative isolate inline-flex items-center",
        listGaps[size],
        listVariantClasses[variant],
        variant === "vertical" && "min-w-[140px]",
        className,
      )}
      {...props}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (glideOn) glide.handlers.onPointerEnter(event);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (glideOn) glide.handlers.onPointerMove(event);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (glideOn) glide.handlers.onPointerLeave();
      }}
      onClick={(event) => {
        onClick?.(event);
        if (glideOn) glide.handlers.onClick(event);
      }}
    >
      {glideOn ? (
        <GlideHighlight
          glide={glide.glide}
          className={
            variant === "pills" ? "rounded-full" : "rounded-[var(--primitive-radius-item)]"
          }
        />
      ) : null}
      {children}
    </BaseTabs.List>
  );
});

/* ─── <TabsTrigger> ─────────────────────────────────────────── */

function TabIndicator({
  layoutKey,
  layoutId,
  surface,
  className,
  style,
}: {
  layoutKey: string;
  layoutId: string;
  /** Surface role painting the indicator (`data-surface`). */
  surface?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) {
    return <span aria-hidden="true" data-surface={surface} className={className} style={style} />;
  }
  return (
    <motion.span
      aria-hidden="true"
      data-surface={surface}
      layoutId={`${layoutKey}-${layoutId}`}
      transition={indicatorSpring}
      className={className}
      style={style}
    />
  );
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ value, className, children, ...props }, ref) {
    const { variant, size, activeValue, layoutId } = useTabsContext();
    const isActive = activeValue === value;

    return (
      <BaseTabs.Tab
        data-state={isActive ? "active" : "inactive"}
        ref={ref}
        value={value}
        data-variant={variant}
        data-glide-item={variant === "underline" ? undefined : ""}
        className={cn(
          triggerBase,
          triggerSizes[size],
          triggerVariantClasses(variant, isActive),
          !isActive && hoverClasses[variant],
          className,
        )}
        {...props}
      >
        {children}

        {variant === "default" && isActive && (
          <TabIndicator
            layoutKey="tabs-default-pill"
            layoutId={layoutId}
            surface="frame"
            className={cn("absolute inset-0 rounded-[var(--primitive-radius-item)]")}
            style={{ zIndex: -1 }}
          />
        )}

        {variant === "underline" && isActive && (
          <TabIndicator
            layoutKey="tabs-underline"
            layoutId={layoutId}
            className="absolute inset-x-0 -bottom-px h-[2px] bg-[var(--foreground)]"
            style={{ borderRadius: 1 }}
          />
        )}

        {variant === "pills" && isActive && (
          <TabIndicator
            layoutKey="tabs-pill"
            layoutId={layoutId}
            surface="frame"
            className={cn("absolute inset-0 rounded-full")}
            style={{ zIndex: -1 }}
          />
        )}

        {variant === "segmented" && isActive && (
          <TabIndicator
            layoutKey="tabs-segment"
            layoutId={layoutId}
            surface="control"
            className={cn("absolute inset-0 rounded-[var(--primitive-radius-item)]")}
            style={{ zIndex: -1 }}
          />
        )}

        {variant === "vertical" && isActive && (
          <TabIndicator
            layoutKey="tabs-vertical-bar"
            layoutId={layoutId}
            className="absolute -left-px top-1 bottom-1 w-[2px] rounded-full bg-[var(--foreground)]"
          />
        )}
      </BaseTabs.Tab>
    );
  },
);

/* ─── <TabsContent> ─────────────────────────────────────────── */

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { className, ...props },
  ref,
) {
  return (
    <BaseTabs.Panel
      ref={ref}
      className={cn(
        "flex-1 outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)] focus-visible:ring-offset-2",
        "transition-opacity duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.23,1,0.32,1))]",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
});
