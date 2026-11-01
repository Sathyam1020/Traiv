"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@traiv/ui/lib/cn";

/* ─── Types ─────────────────────────────────────────────────── */

export type CalendarMode = "single" | "range" | "multiple";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface CalendarEvent {
  date: Date;
  label?: string;
}

interface CalendarSharedProps {
  /** Month currently displayed (controlled). */
  month?: Date;
  /** Initial displayed month (uncontrolled). Defaults to today's month. */
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** 0 = Sunday, 1 = Monday. Default 0. */
  weekStartsOn?: 0 | 1;
  /** Return true to disable a date from selection. */
  disabled?: (date: Date) => boolean;
  /** Dates that are unavailable/reserved — shown struck-through and disabled. */
  bookedDates?: Date[];
  /** Dates with a scheduled-event indicator dot. */
  events?: CalendarEvent[];
  /** Enables the fast month/year jump view when clicking the header label. Default true. */
  quickNav?: boolean;
  className?: string;
}

interface CalendarSingleProps extends CalendarSharedProps {
  mode?: "single";
  selected?: Date;
  defaultSelected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

interface CalendarMultipleProps extends CalendarSharedProps {
  mode: "multiple";
  selected?: Date[];
  defaultSelected?: Date[];
  onSelect?: (dates: Date[]) => void;
}

interface CalendarRangeProps extends CalendarSharedProps {
  mode: "range";
  selected?: DateRange;
  defaultSelected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarMultipleProps | CalendarRangeProps;

/* ─── Easing ────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

/* ─── Date Helpers ──────────────────────────────────────────── */

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAY_LABELS_SUN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WEEKDAY_LABELS_MON = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function isSameDay(a?: Date, b?: Date): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function isWithinRange(date: Date, range: DateRange): boolean {
  if (!range.from || !range.to) return false;
  const t = startOfDay(date).getTime();
  const from = startOfDay(range.from).getTime();
  const to = startOfDay(range.to).getTime();
  return t > Math.min(from, to) && t < Math.max(from, to);
}

function buildMonthGrid(month: Date, weekStartsOn: 0 | 1): Date[] {
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const firstWeekday = firstOfMonth.getDay();
  const leading = weekStartsOn === 1 ? (firstWeekday + 6) % 7 : firstWeekday;
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - leading);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

/* ─── Quick-Nav Tooltip ─────────────────────────────────────── */

/**
 * Minimal CSS-only tooltip for the header's month/year quick-nav controls.
 * Kept local instead of the Tooltip primitive: it needs no portal/positioning
 * logic for a fixed-position label, so a Tooltip (+ Radix) dependency isn't
 * worth it here — and primitives can't import each other's source directly.
 */
function QuickNavTooltip({
  label,
  disabled,
  children,
}: {
  label: string;
  disabled?: boolean;
  children: React.ReactElement;
}) {
  if (disabled) return children;

  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span
        role="tooltip"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 -translate-x-1/2 whitespace-nowrap",
          "rounded-[var(--primitive-radius-control-sm)] bg-[var(--foreground)] px-1.5 py-0.5 text-[10.5px] font-medium text-[var(--background)]",
          "origin-top scale-95 opacity-0 transition-[opacity,transform] delay-0 duration-[var(--primitive-motion-moderate)] ease-[cubic-bezier(0.23,1,0.32,1)]",
          // Hover-only: no focus-within trigger (would fire on click since
          // the button receives focus) and force-hidden on :active so a
          // click can't leave a stale label visible mid-transition.
          "group-hover/tip:scale-100 group-hover/tip:opacity-100 group-hover/tip:delay-300",
          "group-active/tip:!opacity-0 group-active/tip:!delay-0 group-active/tip:!duration-0",
        )}
      >
        {label}
      </span>
    </span>
  );
}

/* ─── <Calendar> ────────────────────────────────────────────── */

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>((props, ref) => {
  const {
    mode = "single",
    month: controlledMonth,
    defaultMonth,
    onMonthChange,
    weekStartsOn = 0,
    disabled,
    bookedDates,
    events,
    quickNav = true,
    className,
    selected,
    defaultSelected,
    onSelect,
  } = props as CalendarSharedProps & {
    mode?: CalendarMode;
    selected?: Date | Date[] | DateRange;
    defaultSelected?: Date | Date[] | DateRange;
    onSelect?: (value: Date | undefined | Date[] | DateRange | undefined) => void;
  };

  const prefersReducedMotion = useReducedMotion();
  const today = React.useMemo(() => startOfDay(new Date()), []);

  const [internalMonth, setInternalMonth] = React.useState(() =>
    startOfDay(defaultMonth ?? controlledMonth ?? new Date()),
  );
  const isMonthControlled = controlledMonth !== undefined;
  const displayedMonth = isMonthControlled ? controlledMonth : internalMonth;

  const [navView, setNavView] = React.useState<"days" | "months" | "years">("days");
  const [direction, setDirection] = React.useState(1);
  // Center of the 12-year picker grid — independent of displayedMonth so
  // paging through years (via the picker's own prev/next) doesn't require
  // navigating the actual displayed month.
  const [yearAnchor, setYearAnchor] = React.useState(() => displayedMonth.getFullYear());

  function openYearsView() {
    setYearAnchor(displayedMonth.getFullYear());
    setNavView("years");
  }

  // When keyboard nav crosses a month boundary, the day grid remounts (its
  // motion.div key changes) so the old DOM node queried synchronously is the
  // exiting month's grid, not the one containing the target date. Stash the
  // target here and focus it once the new month's grid is actually mounted.
  const dayGridRef = React.useRef<HTMLDivElement | null>(null);
  const pendingFocusDateRef = React.useRef<Date | null>(null);

  React.useEffect(() => {
    if (!pendingFocusDateRef.current) return;
    const iso = pendingFocusDateRef.current.toDateString();
    pendingFocusDateRef.current = null;
    (dayGridRef.current?.querySelector(`[data-date-key="${iso}"]`) as HTMLElement | null)?.focus();
  }, [displayedMonth]);

  const setMonth = React.useCallback(
    (next: Date, dir: number) => {
      setDirection(dir);
      if (!isMonthControlled) setInternalMonth(next);
      onMonthChange?.(next);
    },
    [isMonthControlled, onMonthChange],
  );

  // Internal selection state, used when the caller does not control `selected`.
  const [internalSingle, setInternalSingle] = React.useState<Date | undefined>(
    mode === "single" ? (defaultSelected as Date | undefined) : undefined,
  );
  const [internalMultiple, setInternalMultiple] = React.useState<Date[]>(
    mode === "multiple" ? ((defaultSelected as Date[] | undefined) ?? []) : [],
  );
  const [internalRange, setInternalRange] = React.useState<DateRange | undefined>(
    mode === "range" ? (defaultSelected as DateRange | undefined) : undefined,
  );

  const isSelectedControlled = selected !== undefined;

  const currentSingle =
    mode === "single"
      ? ((isSelectedControlled ? selected : internalSingle) as Date | undefined)
      : undefined;
  const currentMultiple =
    mode === "multiple" ? ((isSelectedControlled ? selected : internalMultiple) as Date[]) : [];
  const currentRange =
    mode === "range"
      ? ((isSelectedControlled ? selected : internalRange) as DateRange | undefined)
      : undefined;

  function isDisabled(date: Date): boolean {
    if (bookedDates?.some((b) => isSameDay(b, date))) return true;
    return disabled?.(date) ?? false;
  }

  function isBooked(date: Date): boolean {
    return bookedDates?.some((b) => isSameDay(b, date)) ?? false;
  }

  function eventFor(date: Date): CalendarEvent | undefined {
    return events?.find((e) => isSameDay(e.date, date));
  }

  function handleSelectDay(date: Date) {
    if (isDisabled(date)) return;

    if (mode === "single") {
      const next = isSameDay(currentSingle, date) ? undefined : date;
      if (!isSelectedControlled) setInternalSingle(next);
      (onSelect as CalendarSingleProps["onSelect"])?.(next);
      return;
    }

    if (mode === "multiple") {
      const exists = currentMultiple.some((d) => isSameDay(d, date));
      const next = exists
        ? currentMultiple.filter((d) => !isSameDay(d, date))
        : [...currentMultiple, date];
      if (!isSelectedControlled) setInternalMultiple(next);
      (onSelect as CalendarMultipleProps["onSelect"])?.(next);
      return;
    }

    // range
    const from = currentRange?.from;
    const to = currentRange?.to;
    let next: DateRange;
    if (!from || (from && to)) {
      next = { from: date, to: undefined };
    } else if (isBefore(date, from)) {
      next = { from: date, to: from };
    } else {
      next = { from, to: date };
    }
    if (!isSelectedControlled) setInternalRange(next);
    (onSelect as CalendarRangeProps["onSelect"])?.(next);
  }

  function goToMonth(offset: number) {
    setMonth(addMonths(displayedMonth, offset), offset >= 0 ? 1 : -1);
  }

  const weekdayLabels = weekStartsOn === 1 ? WEEKDAY_LABELS_MON : WEEKDAY_LABELS_SUN;
  const grid = React.useMemo(
    () => buildMonthGrid(displayedMonth, weekStartsOn),
    [displayedMonth, weekStartsOn],
  );

  // Roving tabindex target: the selected day if it falls in the displayed
  // month, otherwise today if visible, otherwise the 1st of the month.
  const focusableDate = React.useMemo(() => {
    if (mode === "single" && currentSingle && isSameMonth(currentSingle, displayedMonth))
      return currentSingle;
    if (isSameMonth(today, displayedMonth)) return today;
    return new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1);
  }, [mode, currentSingle, displayedMonth, today]);

  function cellState(date: Date) {
    const outsideMonth = !isSameMonth(date, displayedMonth);
    const isToday = isSameDay(date, today);
    const isBookedDay = isBooked(date);
    const event = eventFor(date);
    const isDayDisabled = isDisabled(date);

    let isSelected = false;
    let isRangeStart = false;
    let isRangeEnd = false;
    let isInRange = false;

    if (mode === "single") {
      isSelected = isSameDay(currentSingle, date);
    } else if (mode === "multiple") {
      isSelected = currentMultiple.some((d) => isSameDay(d, date));
    } else if (mode === "range" && currentRange) {
      isRangeStart = isSameDay(currentRange.from, date);
      isRangeEnd = isSameDay(currentRange.to, date);
      isInRange = isWithinRange(date, currentRange);
      isSelected = isRangeStart || isRangeEnd;
    }

    return {
      outsideMonth,
      isToday,
      isBookedDay,
      event,
      isDayDisabled,
      isSelected,
      isRangeStart,
      isRangeEnd,
      isInRange,
    };
  }

  const monthLabel = `${MONTH_NAMES[displayedMonth.getMonth()]} ${displayedMonth.getFullYear()}`;
  const weeks = React.useMemo(() => {
    const rows: Date[][] = [];
    for (let i = 0; i < grid.length; i += 7) {
      rows.push(grid.slice(i, i + 7));
    }
    return rows;
  }, [grid]);

  return (
    <div
      data-wensity-primitive=""
      ref={ref}
      data-slot="calendar"
      data-mode={mode}
      // A nested frame: calendars almost always sit inside a card or popover.
      data-surface="frame"
      className={cn(
        "w-full max-w-[300px] select-none rounded-[var(--primitive-radius-surface)] p-3",
        className,
      )}
    >
      {/* Screen-reader announcement when the displayed month changes. */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {monthLabel}
      </div>

      {/* Header */}
      <div className="mb-2 flex items-center justify-between gap-1">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => goToMonth(-1)}
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-[var(--primitive-radius-control-sm)] text-[var(--muted-foreground)]",
            "outline-none transition-colors duration-[var(--primitive-motion-fast)]",
            "hover:bg-[var(--primitive-surface-hover)] hover:text-[var(--foreground)]",
            "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
          )}
        >
          <IconChevronLeft className="size-4" stroke={1.9} />
        </button>

        <div className="flex items-center gap-0.5">
          <QuickNavTooltip label="Jump to month" disabled={!quickNav}>
            <button
              type="button"
              disabled={!quickNav}
              aria-label="Show month picker"
              onClick={() => setNavView("months")}
              className={cn(
                "rounded-[var(--primitive-radius-control-sm)] px-1.5 py-1 text-[13px] font-medium tracking-[-0.01em] text-[var(--foreground)]",
                "outline-none transition-colors duration-[var(--primitive-motion-fast)]",
                quickNav && "hover:bg-[var(--primitive-surface-hover)]",
                "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
                navView === "months" && "bg-[var(--primitive-surface-selected)]",
              )}
            >
              {MONTH_NAMES[displayedMonth.getMonth()]}
            </button>
          </QuickNavTooltip>

          <QuickNavTooltip
            label={navView === "months" ? "Jump to year" : "Quick navigation"}
            disabled={!quickNav}
          >
            <button
              type="button"
              disabled={!quickNav}
              aria-label="Toggle month or year picker"
              onClick={() => (navView === "months" ? openYearsView() : setNavView("months"))}
              className={cn(
                "rounded-[var(--primitive-radius-control-sm)] px-0.5 py-1 text-[13px] font-medium text-[var(--muted-foreground)]/40",
                "outline-none transition-colors duration-[var(--primitive-motion-fast)]",
                quickNav && "hover:text-[var(--muted-foreground)]",
                "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
              )}
            >
              |
            </button>
          </QuickNavTooltip>

          <QuickNavTooltip label="Jump to year" disabled={!quickNav}>
            <button
              type="button"
              disabled={!quickNav}
              aria-label="Show year picker"
              onClick={openYearsView}
              className={cn(
                "rounded-[var(--primitive-radius-control-sm)] px-1.5 py-1 text-[13px] font-medium tracking-[-0.01em] text-[var(--foreground)]",
                "outline-none transition-colors duration-[var(--primitive-motion-fast)]",
                quickNav && "hover:bg-[var(--primitive-surface-hover)]",
                "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
                navView === "years" && "bg-[var(--primitive-surface-selected)]",
              )}
            >
              {displayedMonth.getFullYear()}
            </button>
          </QuickNavTooltip>
        </div>

        <button
          type="button"
          aria-label="Next month"
          onClick={() => goToMonth(1)}
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-[var(--primitive-radius-control-sm)] text-[var(--muted-foreground)]",
            "outline-none transition-colors duration-[var(--primitive-motion-fast)]",
            "hover:bg-[var(--primitive-surface-hover)] hover:text-[var(--foreground)]",
            "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
          )}
        >
          <IconChevronRight className="size-4" stroke={1.9} />
        </button>
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          {navView === "days" && (
            <motion.div
              key={`${displayedMonth.getFullYear()}-${displayedMonth.getMonth()}`}
              custom={direction}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -12 }}
              transition={{ duration: prefersReducedMotion ? 0.12 : 0.18, ease: EASE_OUT }}
            >
              {/* Weekday row */}
              <div className="mb-1 grid grid-cols-7">
                {weekdayLabels.map((label, i) => (
                  <div
                    key={`${label}-${i}`}
                    className="flex h-7 items-center justify-center text-[length:var(--primitive-text-hint)] font-medium text-[var(--muted-foreground)]"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Day grid — ARIA grid with row/gridcell required children. */}
              <div
                ref={dayGridRef}
                role="grid"
                aria-label={monthLabel}
                className="grid grid-cols-7 gap-y-0.5"
                onKeyDown={(e) => {
                  const deltas: Record<string, number> = {
                    ArrowLeft: -1,
                    ArrowRight: 1,
                    ArrowUp: -7,
                    ArrowDown: 7,
                  };
                  let targetDate: Date | undefined;
                  if (e.key in deltas) {
                    const current = new Date((e.target as HTMLElement).dataset.date ?? "");
                    current.setDate(current.getDate() + deltas[e.key]!);
                    targetDate = current;
                  } else if (e.key === "Home" || e.key === "End") {
                    const current = new Date((e.target as HTMLElement).dataset.date ?? "");
                    const weekday =
                      weekStartsOn === 1 ? (current.getDay() + 6) % 7 : current.getDay();
                    current.setDate(
                      current.getDate() + (e.key === "Home" ? -weekday : 6 - weekday),
                    );
                    targetDate = current;
                  } else if (e.key === "PageUp" || e.key === "PageDown") {
                    e.preventDefault();
                    const current = new Date((e.target as HTMLElement).dataset.date ?? "");
                    targetDate = addMonths(current, e.key === "PageUp" ? -1 : 1);
                    // Clamp to the target month's last day (e.g. Jan 31 -> Feb 28).
                    const daysInTargetMonth = new Date(
                      targetDate.getFullYear(),
                      targetDate.getMonth() + 1,
                      0,
                    ).getDate();
                    targetDate.setDate(Math.min(current.getDate(), daysInTargetMonth));
                  }
                  if (!targetDate) return;
                  e.preventDefault();
                  if (!isSameMonth(targetDate, displayedMonth)) {
                    pendingFocusDateRef.current = targetDate;
                    setMonth(
                      new Date(targetDate.getFullYear(), targetDate.getMonth(), 1),
                      isBefore(targetDate, displayedMonth) ? -1 : 1,
                    );
                    return;
                  }
                  const iso = targetDate.toDateString();
                  (
                    dayGridRef.current?.querySelector(
                      `[data-date-key="${iso}"]`,
                    ) as HTMLElement | null
                  )?.focus();
                }}
              >
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} role="row" className="contents">
                    {week.map((date) => {
                      const state = cellState(date);
                      return (
                        <div
                          key={date.toISOString()}
                          role="gridcell"
                          aria-selected={state.isSelected || undefined}
                          className="relative flex h-8 items-center justify-center"
                        >
                          {/* Range band: full width between the endpoints, half width
                              on the endpoint cells themselves so it visually meets
                              the solid selected circle instead of leaving a gap. */}
                          {mode === "range" &&
                            currentRange?.from &&
                            currentRange?.to &&
                            !isSameDay(currentRange.from, currentRange.to) &&
                            (state.isInRange || state.isRangeStart || state.isRangeEnd) && (
                              <div
                                className={cn(
                                  "absolute inset-y-0 bg-[var(--primitive-surface-selected)]",
                                  state.isRangeStart
                                    ? "left-1/2 right-0"
                                    : state.isRangeEnd
                                      ? "left-0 right-1/2"
                                      : "inset-x-0",
                                )}
                              />
                            )}
                          <button
                            type="button"
                            disabled={state.isDayDisabled}
                            aria-label={date.toDateString()}
                            data-date={date.toISOString()}
                            data-date-key={date.toDateString()}
                            tabIndex={isSameDay(date, focusableDate) ? 0 : -1}
                            onClick={() => handleSelectDay(date)}
                            className={cn(
                              "relative z-10 flex size-8 items-center justify-center rounded-full text-[13px] tabular-nums",
                              "outline-none transition-colors duration-[var(--primitive-motion-fast)]",
                              "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
                              state.outsideMonth
                                ? "text-[var(--muted-foreground)]/40"
                                : "text-[var(--foreground)]",
                              !state.isSelected &&
                                !state.isDayDisabled &&
                                "hover:bg-[var(--primitive-surface-hover)]",
                              state.isSelected &&
                                "bg-[var(--primitive-control-solid)] text-[var(--primitive-control-solid-foreground)] hover:bg-[var(--primitive-control-solid-hover)]",
                              state.isToday &&
                                !state.isSelected &&
                                "border border-[var(--border)] font-semibold",
                              state.isDayDisabled &&
                                !state.isBookedDay &&
                                "pointer-events-none text-[var(--muted-foreground)] opacity-30",
                              state.isBookedDay &&
                                "pointer-events-none text-[var(--muted-foreground)]/50 line-through",
                            )}
                          >
                            {date.getDate()}
                            {state.event && !state.isSelected && (
                              <span className="absolute bottom-0.5 size-1 rounded-full bg-[var(--primitive-info)]" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {navView === "months" && (
            <motion.div
              key="months"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.12 : 0.15, ease: EASE_OUT }}
              className="grid grid-cols-3 gap-1 py-1"
            >
              {MONTH_NAMES.map((name, i) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setMonth(new Date(displayedMonth.getFullYear(), i, 1), 1);
                    setNavView("days");
                  }}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-[var(--primitive-radius-control-sm)] text-[13px] text-[var(--foreground)]",
                    "outline-none transition-colors duration-[var(--primitive-motion-fast)]",
                    "hover:bg-[var(--primitive-surface-hover)]",
                    i === displayedMonth.getMonth() &&
                      "bg-[var(--primitive-control-solid)] text-[var(--primitive-control-solid-foreground)]",
                  )}
                >
                  {name.slice(0, 3)}
                </button>
              ))}
            </motion.div>
          )}

          {navView === "years" && (
            <motion.div
              key="years"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.12 : 0.15, ease: EASE_OUT }}
            >
              {/* Decade pager — the 12-year grid below is a window, not the full range. */}
              <div className="mb-1 flex items-center justify-between px-0.5">
                <button
                  type="button"
                  aria-label="Previous years"
                  onClick={() => setYearAnchor((y) => y - 12)}
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-[var(--primitive-radius-control-sm)] text-[var(--muted-foreground)]",
                    "outline-none transition-colors duration-[var(--primitive-motion-fast)]",
                    "hover:bg-[var(--primitive-surface-hover)] hover:text-[var(--foreground)]",
                    "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
                  )}
                >
                  <IconChevronLeft className="size-4" stroke={1.9} />
                </button>
                <span className="text-[length:var(--primitive-text-hint)] font-medium text-[var(--muted-foreground)]">
                  {yearAnchor - 5}–{yearAnchor + 6}
                </span>
                <button
                  type="button"
                  aria-label="Next years"
                  onClick={() => setYearAnchor((y) => y + 12)}
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-[var(--primitive-radius-control-sm)] text-[var(--muted-foreground)]",
                    "outline-none transition-colors duration-[var(--primitive-motion-fast)]",
                    "hover:bg-[var(--primitive-surface-hover)] hover:text-[var(--foreground)]",
                    "focus-visible:ring-2 focus-visible:ring-[var(--primitive-ring)]",
                  )}
                >
                  <IconChevronRight className="size-4" stroke={1.9} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1 py-1">
                {Array.from({ length: 12 }, (_, i) => yearAnchor - 5 + i).map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setMonth(new Date(year, displayedMonth.getMonth(), 1), 1);
                      setNavView("months");
                    }}
                    className={cn(
                      "flex h-10 items-center justify-center rounded-[var(--primitive-radius-control-sm)] text-[13px] tabular-nums text-[var(--foreground)]",
                      "outline-none transition-colors duration-[var(--primitive-motion-fast)]",
                      "hover:bg-[var(--primitive-surface-hover)]",
                      year === displayedMonth.getFullYear() &&
                        "bg-[var(--primitive-control-solid)] text-[var(--primitive-control-solid-foreground)]",
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
Calendar.displayName = "Calendar";
