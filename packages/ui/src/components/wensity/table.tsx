"use client";

import * as React from "react";
import { IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons-react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { cn } from "@traiv/ui/lib/cn";

const tableSurfaceClass = "rounded-[var(--primitive-radius-surface)]";

export type TableDensity = "compact" | "comfortable" | "spacious";
export type SortDirection = "asc" | "desc" | null;

export interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  stickyHeader?: boolean;
  density?: TableDensity;
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Animate row reordering when sort order changes. */
  animatedSort?: boolean;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  expanded?: boolean;
  /** Click anywhere on the row to toggle selection. */
  selectable?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Click anywhere on the row to toggle expansion. */
  expandable?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
}

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export interface TableExpandableContentProps extends React.HTMLAttributes<HTMLTableRowElement> {
  open?: boolean;
  colSpan: number;
}

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_MORPH = [0.32, 0.72, 0, 1] as const;
const SORT_LAYOUT_MS = 0.36;

// E-10 density scale: compact 11px/xs, comfortable xs/sm, spacious sm/sm.
const densityClasses: Record<TableDensity, { head: string; cell: string }> = {
  compact: { head: "h-9 px-3 text-[11px]", cell: "h-10 px-3 py-2 text-xs" },
  comfortable: { head: "h-11 px-4 text-xs", cell: "h-12 px-4 py-3 text-sm" },
  spacious: { head: "h-12 px-5 text-sm", cell: "h-14 px-5 py-4 text-sm" },
};

type TableContextValue = {
  density: TableDensity;
  stickyHeader: boolean;
  animatedSort: boolean;
  layoutGroupId: string;
};

const TableContext = React.createContext<TableContextValue>({
  density: "comfortable",
  stickyHeader: false,
  animatedSort: false,
  layoutGroupId: "wensity-table",
});

function useTableContext() {
  return React.useContext(TableContext);
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest(
      'button, a, input, label, textarea, select, [role="checkbox"], [data-slot="table-select-cell"], [data-prevent-row-action="true"]',
    ),
  );
}

function SortIndicator({ direction }: { direction: SortDirection }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span className="relative inline-flex size-3.5 shrink-0 items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        {direction === "asc" ? (
          <motion.span
            key="asc"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 3 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.92, y: -3 }}
            transition={{ duration: SORT_LAYOUT_MS, ease: EASE_MORPH }}
            className="absolute inset-0 inline-flex items-center justify-center text-[var(--foreground)]"
          >
            <IconChevronUp size={14} stroke={2} />
          </motion.span>
        ) : direction === "desc" ? (
          <motion.span
            key="desc"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: -3 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.92, y: 3 }}
            transition={{ duration: SORT_LAYOUT_MS, ease: EASE_MORPH }}
            className="absolute inset-0 inline-flex items-center justify-center text-[var(--foreground)]"
          >
            <IconChevronDown size={14} stroke={2} />
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 0.55, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
            transition={{ duration: SORT_LAYOUT_MS * 0.85, ease: EASE_MORPH }}
            className="absolute inset-0 inline-flex items-center justify-center text-[var(--muted-foreground)]"
          >
            <IconSelector size={14} stroke={1.75} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

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

export const Table = React.forwardRef<HTMLDivElement, TableProps>(
  ({ className, stickyHeader = false, density = "comfortable", children, ...props }, ref) => {
    const layoutGroupId = React.useId();
    // Body rows share one hover highlight; header rows and gap clicks stay out.
    const glide = useGlideHover<HTMLDivElement>("y", {
      gapClick: false,
      itemSelector: 'tbody > tr[data-slot="table-row"]',
    });
    const tableRef = useGlideRef(ref, glide.containerRef);

    return (
      <TableContext.Provider
        value={{
          density,
          stickyHeader,
          animatedSort: false,
          layoutGroupId,
        }}
      >
        <div
          data-surface="panel"
          data-wensity-primitive=""
          ref={tableRef}
          data-slot="table"
          data-sticky-header={stickyHeader ? "true" : undefined}
          className={cn("relative w-full overflow-auto", tableSurfaceClass, className)}
          {...props}
          onPointerEnter={(event) => {
            props.onPointerEnter?.(event);
            glide.handlers.onPointerEnter(event);
          }}
          onPointerMove={(event) => {
            props.onPointerMove?.(event);
            glide.handlers.onPointerMove(event);
          }}
          onPointerLeave={(event) => {
            props.onPointerLeave?.(event);
            glide.handlers.onPointerLeave();
          }}
        >
          <GlideHighlight glide={glide.glide} />
          {/* relative: the table paints above the hover highlight behind it. */}
          <table className="relative w-full caption-bottom border-collapse text-left">
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  },
);
Table.displayName = "Table";

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-3 px-4 text-xs text-[var(--muted-foreground)]", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { stickyHeader } = useTableContext();
  return (
    <thead
      ref={ref}
      className={cn(
        "border-b border-[var(--border)] text-[var(--primitive-text-secondary,var(--muted-foreground))]",
        stickyHeader && "sticky top-0 z-10 bg-[var(--muted)]/95 backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
});
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, animatedSort = false, children, ...props }, ref) => {
    const parentContext = useTableContext();
    const sortEnabled = animatedSort || parentContext.animatedSort;

    return (
      <TableContext.Provider
        value={{
          ...parentContext,
          animatedSort: sortEnabled,
        }}
      >
        <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props}>
          {sortEnabled ? (
            <LayoutGroup id={parentContext.layoutGroupId}>{children}</LayoutGroup>
          ) : (
            children
          )}
        </tbody>
      </TableContext.Provider>
    );
  },
);
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-[color-mix(in_srgb,var(--foreground)_10%,transparent)] bg-[color-mix(in_srgb,var(--foreground)_4%,var(--background))] font-medium",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      className,
      selected = false,
      expanded = false,
      selectable = false,
      onSelectedChange,
      expandable = false,
      onExpandedChange,
      onClick,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const { animatedSort } = useTableContext();
    const shouldReduceMotion = useReducedMotion();
    const isInteractive = selectable || expandable;

    const handleClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || isInteractiveTarget(event.target)) return;

      if (selectable) {
        onSelectedChange?.(!selected);
      } else if (expandable) {
        onExpandedChange?.(!expanded);
      }
    };

    const sharedClass = cn(
      "border-b border-[var(--border)]",
      "transition-[background-color,box-shadow] duration-[var(--primitive-motion-fast)] ease-[var(--table-ease-out)] motion-reduce:transition-none",
      isInteractive && "cursor-pointer",
      selected &&
        "bg-[var(--primitive-surface-selected)] hover:bg-[var(--primitive-surface-selected)]",
      expanded &&
        !selected &&
        "bg-[var(--primitive-surface-hover)] hover:bg-[var(--primitive-surface-hover)]",
      className,
    );

    const sharedProps = {
      "data-slot": "table-row",
      "data-selected": selected ? "true" : undefined,
      "data-expanded": expanded ? "true" : undefined,
      "data-selectable": selectable ? "true" : undefined,
      "data-expandable": expandable ? "true" : undefined,
      onClick: isInteractive ? handleClick : onClick,
      className: sharedClass,
      style: { ["--table-ease-out" as string]: EASE_OUT, ...style },
      ...props,
    };

    if (animatedSort && !shouldReduceMotion) {
      const motionRowProps = sharedProps as React.ComponentPropsWithoutRef<typeof motion.tr>;

      return (
        <motion.tr
          ref={ref}
          {...motionRowProps}
          layout="position"
          transition={{
            layout: { duration: SORT_LAYOUT_MS, ease: EASE_MORPH },
          }}
        >
          {children}
        </motion.tr>
      );
    }

    return (
      <tr ref={ref} {...sharedProps}>
        {children}
      </tr>
    );
  },
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      sortable = false,
      sortDirection = null,
      onSort,
      children,
      "aria-sort": ariaSort,
      ...props
    },
    ref,
  ) => {
    const { density } = useTableContext();
    const isActive = Boolean(sortDirection);
    const resolvedAriaSort =
      sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : ariaSort;

    const content = (
      <>
        <span className="truncate">{children}</span>
        {sortable ? <SortIndicator direction={sortDirection} /> : null}
      </>
    );

    const sharedClass = cn(
      "relative whitespace-nowrap font-medium tracking-[-0.01em] text-[var(--primitive-text-secondary,var(--muted-foreground))]",
      densityClasses[density].head,
      sortable && "cursor-pointer select-none",
      sortable &&
        "transition-[color,background-color] duration-[var(--primitive-motion-fast)] ease-[var(--table-ease-out)] hover:text-[var(--foreground)] motion-reduce:transition-none",
      isActive &&
        "text-[var(--foreground)] after:absolute after:inset-x-3 after:bottom-0 after:h-px after:origin-left after:scale-x-100 after:bg-[color-mix(in_srgb,var(--foreground)_22%,transparent)] after:transition-transform after:duration-[var(--primitive-motion-moderate)] after:ease-[var(--table-ease-out)]",
      className,
    );

    if (sortable) {
      return (
        <th
          ref={ref}
          scope="col"
          data-sort-active={isActive ? "true" : undefined}
          aria-sort={resolvedAriaSort}
          className={sharedClass}
          style={{ ["--table-ease-out" as string]: EASE_OUT }}
          {...props}
        >
          <button
            type="button"
            onClick={onSort}
            className="inline-flex w-full items-center gap-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          >
            {content}
          </button>
        </th>
      );
    }

    return (
      <th
        ref={ref}
        scope="col"
        aria-sort={ariaSort}
        className={cn(sharedClass, "align-middle")}
        style={{ ["--table-ease-out" as string]: EASE_OUT }}
        {...props}
      >
        <span className="inline-flex items-center gap-1.5">{content}</span>
      </th>
    );
  },
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    const { density, animatedSort } = useTableContext();
    const shouldReduceMotion = useReducedMotion();

    const cellClass = cn(
      "align-middle text-[var(--foreground)]",
      densityClasses[density].cell,
      animatedSort &&
        !shouldReduceMotion &&
        "transition-[opacity,transform,filter] duration-[var(--primitive-motion-fast)] ease-[var(--table-ease-out)] motion-reduce:transition-none",
      className,
    );

    return (
      <td
        ref={ref}
        className={cellClass}
        style={{ ["--table-ease-out" as string]: EASE_OUT }}
        {...props}
      />
    );
  },
);
TableCell.displayName = "TableCell";

export interface TableSelectCellProps extends Omit<TableCellProps, "children"> {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  ariaLabel?: string;
}

function TableCheckbox({
  checked,
  indeterminate,
  onCheckedChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate: boolean;
  onCheckedChange?: (checked: boolean) => void;
  ariaLabel: string;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      data-slot="table-checkbox"
      className={cn(
        "relative inline-grid size-5 cursor-pointer place-items-center rounded-[var(--primitive-radius-control-sm)] border border-[var(--border)]",
        "bg-[var(--primitive-field-face)] text-[var(--background)]",
        "transition-[background-color,border-color,color,box-shadow] duration-[var(--primitive-motion-fast)] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--primitive-ring)] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[var(--background)]",
        (checked || indeterminate) &&
          "border-[var(--primitive-control-solid)] bg-[var(--primitive-control-solid)] text-[var(--primitive-control-solid-foreground)]",
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        aria-label={ariaLabel}
        onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
        className="sr-only"
      />
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5">
        {indeterminate ? (
          <path
            d="M4 8h8"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        ) : (
          <path
            d="m3.6 8.2 2.8 2.8 6-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        )}
      </svg>
    </label>
  );
}

export const TableSelectCell = React.forwardRef<HTMLTableCellElement, TableSelectCellProps>(
  (
    {
      checked = false,
      indeterminate = false,
      onCheckedChange,
      ariaLabel = "Select row",
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { density } = useTableContext();

    return (
      <td
        ref={ref}
        data-slot="table-select-cell"
        className={cn("w-10", densityClasses[density].cell, "px-3 text-center", className)}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.(event);
        }}
        {...props}
      >
        <TableCheckbox
          checked={checked}
          indeterminate={indeterminate}
          onCheckedChange={(value) => onCheckedChange?.(value === true)}
          ariaLabel={ariaLabel}
        />
      </td>
    );
  },
);
TableSelectCell.displayName = "TableSelectCell";

export interface TableExpandTriggerCellProps extends TableCellProps {
  expanded?: boolean;
  onToggle?: () => void;
  label?: string;
}

export const TableExpandTriggerCell = React.forwardRef<
  HTMLTableCellElement,
  TableExpandTriggerCellProps
>(
  (
    {
      expanded = false,
      onToggle,
      label = "Toggle row details",
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { density } = useTableContext();

    return (
      <td
        ref={ref}
        data-prevent-row-action="true"
        className={cn("w-10", densityClasses[density].cell, "px-3 text-center", className)}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.(event);
        }}
        {...props}
      >
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={label}
          data-prevent-row-action="true"
          onClick={(event) => {
            event.stopPropagation();
            onToggle?.();
          }}
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-[var(--primitive-radius-control-sm)]",
            "text-[var(--muted-foreground)] transition-[color,transform] duration-[var(--primitive-motion-fast)] ease-[var(--table-ease-out)] motion-reduce:transition-none",
            "hover:bg-[var(--primitive-surface-hover)] hover:text-[var(--foreground)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
          )}
          style={{ ["--table-ease-out" as string]: EASE_OUT }}
        >
          <IconChevronDown
            size={16}
            stroke={2}
            className={cn(
              "transition-transform duration-[var(--primitive-motion-moderate)] ease-[var(--table-ease-out)] motion-reduce:transition-none",
              expanded && "rotate-180",
            )}
          />
        </button>
        {children}
      </td>
    );
  },
);
TableExpandTriggerCell.displayName = "TableExpandTriggerCell";

export const TableExpandableContent = React.forwardRef<
  HTMLTableRowElement,
  TableExpandableContentProps
>(({ className, open = false, colSpan, children, ...props }, ref) => {
  return (
    <tr
      ref={ref}
      data-slot="table-expandable-content"
      aria-hidden={!open}
      className={cn(
        "border-b border-[color-mix(in_srgb,var(--foreground)_8%,transparent)]",
        className,
      )}
      {...props}
    >
      <td colSpan={colSpan} className="p-0">
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-[var(--primitive-motion-moderate)] ease-[var(--table-ease-out)] motion-reduce:transition-none",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
          style={{ ["--table-ease-out" as string]: EASE_OUT }}
          inert={open ? undefined : true}
        >
          <div className="overflow-hidden">
            <div className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{children}</div>
          </div>
        </div>
      </td>
    </tr>
  );
});
TableExpandableContent.displayName = "TableExpandableContent";
