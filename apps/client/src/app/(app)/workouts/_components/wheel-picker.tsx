"use client";

import { useCallback, useEffect, useRef } from "react";

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const PAD = (ITEM_HEIGHT * (VISIBLE_ROWS - 1)) / 2;

export function WheelPicker({
  values,
  value,
  onChange,
  label,
}: {
  values: number[];
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const settling = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToValue = useCallback(
    (nextValue: number, behavior: ScrollBehavior = "auto") => {
      const el = ref.current;
      const index = values.indexOf(nextValue);

      if (!el || index < 0) return;

      el.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior,
      });
    },
    [values],
  );

  useEffect(() => {
    if (settling.current) return;

    scrollToValue(value);
  }, [value, scrollToValue]);

  function onScroll() {
    const el = ref.current;
    if (!el) return;

    settling.current = true;

    if (settleTimer.current) {
      clearTimeout(settleTimer.current);
    }

    settleTimer.current = setTimeout(() => {
      const index = Math.round(el.scrollTop / ITEM_HEIGHT);
      const safeIndex = Math.max(0, Math.min(values.length - 1, index));
      const next = values[safeIndex];

      settling.current = false;

      if (next !== undefined && next !== value) {
        onChange(next);
      }
    }, 120);
  }

  useEffect(() => {
    return () => {
      if (settleTimer.current) {
        clearTimeout(settleTimer.current);
      }
    };
  }, []);

  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <span className="text-caption font-medium uppercase tracking-[0.08em] text-fg-subtle">
        {label}
      </span>

      <div
        className="relative"
        style={{
          height: ITEM_HEIGHT * VISIBLE_ROWS,
          width: 88,
        }}
      >
        {/* Selection highlight stays behind the selected number. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 z-0 rounded-control bg-sunken"
          style={{
            top: PAD,
            height: ITEM_HEIGHT,
          }}
        />

        <div
          ref={ref}
          onScroll={onScroll}
          role="listbox"
          tabIndex={0}
          aria-label={label}
          aria-activedescendant={`${label.toLowerCase()}-${value}`}
          className="relative z-10 h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            paddingTop: PAD,
            paddingBottom: PAD,
            scrollSnapType: "y mandatory",
          }}
        >
          {values.map((v) => {
            const selected = v === value;

            return (
              <div
                key={v}
                id={`${label.toLowerCase()}-${v}`}
                role="option"
                aria-selected={selected}
                aria-label={`${v}`}
                tabIndex={-1}
                className={[
                  "flex snap-center items-center justify-center font-semibold tabular-nums",
                  "transition-colors duration-150",
                  selected ? "text-fg opacity-100" : "text-fg-muted opacity-80",
                ].join(" ")}
                style={{
                  height: ITEM_HEIGHT,
                  color: selected ? "var(--foreground, #f5f5f7)" : undefined,
                }}
              >
                {String(v).padStart(2, "0")}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
