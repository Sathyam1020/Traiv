"use client";

/**
 * Navigation Menu — Base UI Navigation Menu foundation (Phase 5).
 * Shared overlay surface (Portal/Positioner/Popup/Viewport) is rendered
 * by the Root wrapper; per-item Content mounts inside the shared Viewport.
 *
 * Panels use solid `--primitive-surface-overlay` + `--primitive-shadow-overlay`
 * + `--primitive-radius-surface`. Item hover uses `--primitive-surface-hover`,
 * descriptions the muted-foreground role. Positioner: z `--primitive-z-popover`,
 * collisionPadding 12. Viewport transition CSS-driven and RM-gated.
 *
 * D-17: asChild patterns migrated to Base UI's `render` prop.
 *
 * Sub-menu family (Sub / SubTrigger / SubContent) stays custom — Base UI
 * Navigation Menu has no built-in submenu API. Preserved for API compat.
 */

import * as React from "react";
import { NavigationMenu as BaseNav } from "@base-ui/react/navigation-menu";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@traiv/ui/lib/cn";

/** Motion tiers, the same speeds as the --primitive-motion-* tokens. */
const SPRING = {
  fast: { type: "spring", duration: 0.08, bounce: 0 },
  moderate: { type: "spring", duration: 0.16, bounce: 0 },
  slow: { type: "spring", duration: 0.24, bounce: 0 },
} as const;

/* ─── Types ─────────────────────────────────────────────────── */

export type NavigationMenuSize = "default" | "compact";
export type NavigationMenuAlign = "start" | "center" | "end";

export interface NavigationMenuProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseNav.Root>,
    "value" | "defaultValue" | "onValueChange" | "delay"
  > {
  size?: NavigationMenuSize;
  /** Delay in ms before opening a menu on hover. Default 120. */
  delayDuration?: number;
  /**
   * @deprecated Base UI owns the hover bridge/close timing; kept for API compat.
   */
  skipDelayOnSwitch?: boolean;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}

export type NavigationMenuListProps = React.ComponentPropsWithoutRef<typeof BaseNav.List>;

export type NavigationMenuItemProps = React.ComponentPropsWithoutRef<typeof BaseNav.Item>;

export interface NavigationMenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseNav.Trigger> {
  /** Whether to show a chevron indicator. Default true. */
  showChevron?: boolean;
}

export interface NavigationMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseNav.Content> {
  /** Force a specific width. Use for mega menus (e.g. "w-[48rem]"). */
  width?: string;
  /**
   * @deprecated Base UI Navigation Menu uses a shared Viewport with
   * automatic alignment; per-content align is not supported.
   */
  align?: NavigationMenuAlign;
}

export interface NavigationMenuLinkProps
  extends React.ComponentPropsWithoutRef<typeof BaseNav.Link> {
  asChild?: boolean;
}

export type NavigationMenuIconProps = React.ComponentPropsWithoutRef<typeof BaseNav.Icon>;

export type NavigationMenuDescriptionProps = React.HTMLAttributes<HTMLSpanElement>;

export interface NavigationMenuSubProps {
  children: React.ReactNode;
}

export type NavigationMenuSubTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export type NavigationMenuSubContentProps = React.HTMLAttributes<HTMLDivElement>;

export type NavigationMenuGroupProps = React.HTMLAttributes<HTMLDivElement>;

export type NavigationMenuGroupHeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

/* ─── Density context ───────────────────────────────────────── */

const NavigationMenuSizeContext = React.createContext<NavigationMenuSize>("default");
const useNavSize = () => React.useContext(NavigationMenuSizeContext);

/* ─── Constants ─────────────────────────────────────────────── */

const overlaySurfaceClass = "text-[var(--foreground)]";

const popupMotionClass = cn(
  "origin-[var(--transform-origin)] transform-gpu outline-none",
  "transition-[opacity,scale] duration-[var(--primitive-motion-fast)] ease-[var(--primitive-ease,cubic-bezier(0.23,1,0.32,1))]",
  "data-[ending-style]:duration-[var(--primitive-motion-fast-exit)]",
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
  "data-[starting-style]:scale-[0.96] data-[ending-style]:scale-[0.96]",
  "motion-reduce:transition-none motion-reduce:data-[starting-style]:scale-100 motion-reduce:data-[ending-style]:scale-100",
);

const viewportMotionClass = cn(
  "relative overflow-hidden",
  "transition-[width,height] duration-[var(--primitive-motion-moderate)] ease-[var(--primitive-ease,cubic-bezier(0.23,1,0.32,1))]",
  "motion-reduce:transition-none",
);

/* ─── <NavigationMenu> ──────────────────────────────────────── */

export const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(
  function NavigationMenu(
    {
      size = "default",
      delayDuration = 120,
      skipDelayOnSwitch: _skipDelayOnSwitch,
      value: valueProp,
      defaultValue,
      onValueChange,
      className,
      children,
      "aria-label": ariaLabel = "Main navigation",
      ...props
    },
    ref,
  ) {
    const handleValueChange = React.useMemo(
      () =>
        onValueChange ? (v: unknown) => onValueChange((v ?? null) as string | null) : undefined,
      [onValueChange],
    );

    return (
      <NavigationMenuSizeContext.Provider value={size}>
        <BaseNav.Root
          data-wensity-primitive=""
          ref={ref as React.Ref<HTMLElement>}
          delay={delayDuration}
          value={valueProp as never}
          defaultValue={defaultValue as never}
          onValueChange={handleValueChange as never}
          data-size={size}
          aria-label={ariaLabel}
          className={cn("relative", className)}
          {...props}
        >
          {children}
          <BaseNav.Portal>
            <BaseNav.Positioner
              collisionPadding={12}
              sideOffset={8}
              className="z-[var(--primitive-z-popover)] outline-none"
            >
              <BaseNav.Popup
                data-surface="overlay"
                data-wensity-primitive=""
                className={cn(
                  overlaySurfaceClass,
                  "rounded-[var(--primitive-radius-popup)]",
                  popupMotionClass,
                )}
              >
                <BaseNav.Viewport className={viewportMotionClass} />
              </BaseNav.Popup>
            </BaseNav.Positioner>
          </BaseNav.Portal>
        </BaseNav.Root>
      </NavigationMenuSizeContext.Provider>
    );
  },
);

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

/* ─── <NavigationMenuList> ──────────────────────────────────── */

export const NavigationMenuList = React.forwardRef<HTMLUListElement, NavigationMenuListProps>(
  function NavigationMenuList(
    { className, children, onPointerEnter, onPointerMove, onPointerLeave, onClick, ...props },
    ref,
  ) {
    const size = useNavSize();
    // Top-level triggers and links only; links inside open panels keep their own hover.
    const glide = useGlideHover<HTMLUListElement>("x", {
      itemSelector: ":scope > li > [data-glide-item]",
    });
    const listRef = useGlideRef(ref, glide.containerRef);
    return (
      <BaseNav.List
        ref={listRef}
        className={cn(
          "relative isolate flex list-none items-center",
          size === "compact" ? "gap-0.5" : "gap-1",
          "[&>li>[data-glide-item]:hover]:bg-transparent",
          className,
        )}
        {...props}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          glide.handlers.onPointerEnter(event);
        }}
        onPointerMove={(event) => {
          onPointerMove?.(event);
          glide.handlers.onPointerMove(event);
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          glide.handlers.onPointerLeave();
        }}
        onClick={(event) => {
          onClick?.(event);
          glide.handlers.onClick(event);
        }}
      >
        <GlideHighlight glide={glide.glide} className="rounded-[var(--primitive-radius-item)]" />
        {children}
      </BaseNav.List>
    );
  },
);

/* ─── <NavigationMenuItem> ──────────────────────────────────── */

export const NavigationMenuItem = React.forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  function NavigationMenuItem({ className, ...props }, ref) {
    return <BaseNav.Item ref={ref} className={cn("relative", className)} {...props} />;
  },
);

/* ─── <NavigationMenuTrigger> ───────────────────────────────── */

export const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  NavigationMenuTriggerProps
>(function NavigationMenuTrigger({ className, showChevron = true, children, ...props }, ref) {
  const size = useNavSize();
  return (
    <BaseNav.Trigger
      ref={ref}
      data-glide-item=""
      className={cn(
        "group/nav-item relative inline-flex select-none items-center gap-1.5 rounded-[var(--primitive-radius-item)] font-medium outline-none",
        "transition-[color,background-color,translate] duration-[var(--primitive-motion-fast)] ease-out motion-reduce:transition-none",
        "text-[var(--primitive-text-secondary)]",
        "hover:text-[var(--foreground)] hover:bg-[var(--primitive-surface-hover)]",
        "data-[popup-open]:text-[var(--foreground)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
        "active:translate-y-px motion-reduce:active:translate-y-0",
        size === "compact" ? "px-2.5 py-1.5 text-[13px]" : "px-3 py-2 text-[14px]",
        className,
      )}
      {...props}
    >
      {children}
      {showChevron && (
        <IconChevronDown
          size={size === "compact" ? 12 : 14}
          stroke={2}
          className={cn(
            "shrink-0 text-[var(--muted-foreground)] transition-transform duration-[var(--primitive-motion-moderate)] ease-out motion-reduce:transition-none",
            "group-data-[popup-open]/nav-item:rotate-180",
          )}
        />
      )}
    </BaseNav.Trigger>
  );
});

/* ─── <NavigationMenuContent> ───────────────────────────────── */

export const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  function NavigationMenuContent({ className, width, align: _align, children, ...props }, ref) {
    return (
      <BaseNav.Content
        data-wensity-primitive=""
        ref={ref}
        className={cn("outline-none p-3", width, className)}
        {...props}
      >
        {children}
      </BaseNav.Content>
    );
  },
);

/* ─── <NavigationMenuLink> ──────────────────────────────────── */

export const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  function NavigationMenuLink({ className, asChild, active, children, ...props }, ref) {
    const size = useNavSize();
    const linkClass = cn(
      "group/nav-link inline-flex select-none items-center gap-1.5 rounded-[var(--primitive-radius-item)] font-medium outline-none",
      "transition-[color,background-color,translate] duration-[var(--primitive-motion-fast)] ease-out motion-reduce:transition-none",
      "text-[var(--primitive-text-secondary)]",
      "hover:text-[var(--foreground)] hover:bg-[var(--primitive-surface-hover)]",
      "data-[active]:text-[var(--foreground)]",
      "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
      "active:translate-y-px motion-reduce:active:translate-y-0",
      size === "compact" ? "px-2.5 py-1.5 text-[13px]" : "px-3 py-2 text-[14px]",
      className,
    );

    if (asChild && React.isValidElement(children)) {
      return (
        <BaseNav.Link
          ref={ref}
          data-glide-item=""
          active={active}
          render={children as React.ReactElement}
          className={linkClass}
          {...props}
        />
      );
    }

    return (
      <BaseNav.Link ref={ref} data-glide-item="" active={active} className={linkClass} {...props}>
        {children}
      </BaseNav.Link>
    );
  },
);

/* ─── <NavigationMenuIcon> ──────────────────────────────────── */

export const NavigationMenuIcon = React.forwardRef<HTMLSpanElement, NavigationMenuIconProps>(
  function NavigationMenuIcon({ className, ...props }, ref) {
    const size = useNavSize();
    return (
      <BaseNav.Icon
        ref={ref}
        className={cn(
          "inline-flex shrink-0 items-center justify-center text-[var(--muted-foreground)]",
          "group-hover/nav-item:text-[var(--foreground)] group-hover/nav-link:text-[var(--foreground)] transition-colors duration-[var(--primitive-motion-fast)] motion-reduce:transition-none",
          size === "compact" ? "size-4" : "size-5",
          className,
        )}
        {...props}
      />
    );
  },
);

/* ─── <NavigationMenuDescription> ───────────────────────────── */

export const NavigationMenuDescription = React.forwardRef<
  HTMLSpanElement,
  NavigationMenuDescriptionProps
>(function NavigationMenuDescription({ className, ...props }, ref) {
  const size = useNavSize();
  return (
    <span
      ref={ref}
      className={cn(
        "block text-[var(--muted-foreground)] leading-snug",
        "group-hover/nav-link:text-[var(--primitive-text-secondary)] transition-colors duration-[var(--primitive-motion-fast)] motion-reduce:transition-none",
        size === "compact" ? "text-[11px]" : "text-[12px]",
        className,
      )}
      {...props}
    />
  );
});

/* ─── <NavigationMenuSub> (custom, click-toggle) ────────────── */

type NavigationMenuSubContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
};

const NavigationMenuSubContext = React.createContext<NavigationMenuSubContextValue | null>(null);

function useNavigationMenuSubContext(): NavigationMenuSubContextValue {
  const ctx = React.useContext(NavigationMenuSubContext);
  if (!ctx) {
    throw new Error("NavigationMenuSub components must be used within <NavigationMenuSub>");
  }
  return ctx;
}

export function NavigationMenuSub({ children }: NavigationMenuSubProps) {
  const [open, setOpen] = React.useState(false);
  const reactId = React.useId();
  const ctx = React.useMemo<NavigationMenuSubContextValue>(
    () => ({ open, setOpen, contentId: `nav-sub-${reactId}` }),
    [open, reactId],
  );

  return (
    <NavigationMenuSubContext.Provider value={ctx}>
      <div className="relative">{children}</div>
    </NavigationMenuSubContext.Provider>
  );
}
NavigationMenuSub.displayName = "NavigationMenuSub";

export const NavigationMenuSubTrigger = React.forwardRef<
  HTMLButtonElement,
  NavigationMenuSubTriggerProps
>(function NavigationMenuSubTrigger({ className, children, onClick, ...props }, ref) {
  const { open, setOpen, contentId } = useNavigationMenuSubContext();
  const prefersReducedMotion = useReducedMotion();
  return (
    <button
      ref={ref}
      type="button"
      data-slot="navigation-menu-sub-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-controls={contentId}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) setOpen(!open);
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-[var(--primitive-radius-item)] px-2.5 py-2 text-sm outline-none",
        "transition-[color,background-color,translate] duration-[var(--primitive-motion-fast)] ease-out motion-reduce:transition-none",
        "text-[var(--foreground)]",
        "hover:bg-[var(--primitive-surface-hover)]",
        "data-popup-open:bg-[var(--primitive-surface-hover)] data-open:bg-[var(--primitive-surface-hover)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
        "active:translate-y-px motion-reduce:active:translate-y-0",
        className,
      )}
      {...props}
    >
      {children}
      <span className="ml-auto flex items-center">
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 90 : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : SPRING.fast}
          className="flex items-center justify-center text-[var(--muted-foreground)]"
        >
          <IconChevronRight size={14} stroke={2} />
        </motion.span>
      </span>
    </button>
  );
});

export const NavigationMenuSubContent = React.forwardRef<
  HTMLDivElement,
  NavigationMenuSubContentProps
>(function NavigationMenuSubContent({ className, children, ...props }, ref) {
  const { open, contentId } = useNavigationMenuSubContext();
  const prefersReducedMotion = useReducedMotion();

  // Destructure HTML-only event handlers that conflict with Framer Motion's
  // drag types to prevent TS2322 when spreading onto motion.div.
  const {
    onDrag: _onDrag,
    onDragStart: _onDragStart,
    onDragEnd: _onDragEnd,
    onAnimationStart: _onAnimationStart,
    ...safeProps
  } = props;

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          ref={ref}
          id={contentId}
          role="menu"
          data-slot="navigation-menu-sub-content"
          data-state="open"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : SPRING.fast}
          className={cn("overflow-hidden pl-4", className)}
          {...safeProps}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

/* ─── <NavigationMenuGroup> ─────────────────────────────────── */

export const NavigationMenuGroup = React.forwardRef<HTMLDivElement, NavigationMenuGroupProps>(
  function NavigationMenuGroup({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        role="group"
        data-slot="navigation-menu-group"
        className={cn("flex flex-col", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

/* ─── <NavigationMenuGroupHeading> ──────────────────────────── */

export const NavigationMenuGroupHeading = React.forwardRef<
  HTMLHeadingElement,
  NavigationMenuGroupHeadingProps
>(function NavigationMenuGroupHeading({ className, children, ...props }, ref) {
  return (
    <h4
      ref={ref}
      data-slot="navigation-menu-group-heading"
      className={cn(
        "px-2.5 py-1.5 text-[11px] font-medium tracking-[0.02em] text-[var(--muted-foreground)]",
        className,
      )}
      {...props}
    >
      {children}
    </h4>
  );
});
