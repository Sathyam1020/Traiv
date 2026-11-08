"use client";

import { Button } from "@traiv/ui/components/button";
import { Calendar } from "@traiv/ui/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@traiv/ui/components/popover";
import { CalendarDays, Copy, ShoppingBasket } from "@traiv/ui/icons";
import { type UIEvent, useLayoutEffect, useRef, useState } from "react";
import { localDay, offsetDay } from "@/lib/api/food";

function sunday(date: string) {
  return offsetDay(date, -new Date(`${date}T12:00:00`).getDay());
}

/** Space between one week's strip and the next — visually, so Saturday and the
 * following Sunday don't read as touching, and functionally, so the pager's own
 * scroll-position math (`center`, `scrollWeek`) can account for it. Keep this in sync
 * with the `gap-6` on the scroller below; they are the same 24px by construction. */
const WEEK_GAP_PX = 24;

/** The header is outside the diary scroller. Each snap page is one complete week. */
export function FoodHeader({
  date,
  onDateChange,
  onShopping,
  onCopyDay,
  loggedDays,
}: {
  date: string;
  onDateChange: (date: string) => void;
  onShopping: () => void;
  onCopyDay?: () => void;
  loggedDays: readonly string[];
}) {
  const pager = useRef<HTMLDivElement>(null);
  const settling = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const start = sunday(date);

  useLayoutEffect(() => {
    const element = pager.current;
    if (!element) return;
    const center = () => {
      if (settling.current) clearTimeout(settling.current);
      element.scrollLeft = element.clientWidth + WEEK_GAP_PX;
    };
    center();
    const resize = new ResizeObserver(center);
    resize.observe(element);
    return () => {
      resize.disconnect();
      if (settling.current) clearTimeout(settling.current);
    };
  }, [start]);

  function scrollWeek(event: UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    if (settling.current) clearTimeout(settling.current);
    settling.current = setTimeout(() => {
      if (!element.clientWidth) return;
      const page = Math.round(element.scrollLeft / (element.clientWidth + WEEK_GAP_PX));
      if (page !== 1) onDateChange(offsetDay(date, (page - 1) * 7));
    }, 180);
  }

  return (
    <header className="z-20 shrink-0 bg-panel px-4 pt-5 pb-4 sm:px-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          aria-label="Shopping list"
          onClick={onShopping}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface shadow-sm focus-visible:outline-2 focus-visible:outline-line-focus"
        >
          <ShoppingBasket className="size-5" />
        </button>
        <p
          aria-live="polite"
          className="text-center text-body-sm font-semibold uppercase text-fg-muted"
        >
          {new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </p>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Choose diary date"
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface shadow-sm focus-visible:outline-2 focus-visible:outline-line-focus"
            >
              <CalendarDays className="size-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-auto max-w-[calc(100vw-2rem)] overflow-hidden p-0"
          >
            <Calendar
              mode="single"
              selected={new Date(`${date}T12:00:00`)}
              defaultMonth={new Date(`${date}T12:00:00`)}
              onSelect={(selected) => {
                if (selected) {
                  onDateChange(localDay(selected));
                  setCalendarOpen(false);
                }
              }}
              autoFocus
              className="p-3 pointer-coarse:[--cell-size:--spacing(10)]"
            />
            {onCopyDay ? (
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setCalendarOpen(false);
                  onCopyDay();
                }}
              >
                <Copy className="size-4" />
                Copy this day
              </Button>
            ) : null}
          </PopoverContent>
        </Popover>
      </div>
      <div
        ref={pager}
        onScroll={scrollWeek}
        role="toolbar"
        aria-label="Diary week. Swipe horizontally for previous or next week."
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            onDateChange(offsetDay(date, event.key === "ArrowLeft" ? -7 : 7));
          }
        }}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {[-1, 0, 1].map((week) => (
          <div
            key={offsetDay(start, week * 7)}
            aria-hidden={week !== 0}
            className="grid w-full shrink-0 snap-center snap-always grid-cols-7 gap-1.5 py-1"
          >
            {Array.from({ length: 7 }, (_, day) => offsetDay(start, week * 7 + day)).map(
              (value) => {
                const selected = value === date;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    aria-current={selected ? "date" : undefined}
                    tabIndex={week === 0 ? 0 : -1}
                    aria-label={new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                    onClick={() => onDateChange(value)}
                    className={`flex min-w-0 flex-col items-center gap-2 rounded-full px-1 pt-2 pb-3 transition-colors focus-visible:outline-2 focus-visible:outline-line-focus ${selected ? "bg-signal text-signal-fg shadow-sm" : "bg-surface text-fg"}`}
                  >
                    <span
                      className={`flex aspect-square w-full max-w-12 items-center justify-center rounded-full border-4 bg-surface text-body-sm font-semibold text-fg ${selected ? "border-signal-fg/30" : "border-line"}`}
                    >
                      {Number(value.slice(-2))}
                    </span>
                    <span className="text-caption font-medium uppercase">
                      {
                        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                          new Date(`${value}T12:00:00`).getDay()
                        ]
                      }
                    </span>
                    {loggedDays.includes(value) ? (
                      <span className="sr-only">Food logged</span>
                    ) : null}
                  </button>
                );
              },
            )}
          </div>
        ))}
      </div>
    </header>
  );
}
