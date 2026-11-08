"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * A horizontal ruler you drag to a weight, the way the reference app's goal-weight step
 * works — not a plain `<input type="range">`, because the thing being chosen here is a
 * single number somebody wants to feel precise picking, and a ruler reads as a scale in
 * a way a thin track and a dot does not.
 *
 * Minor ticks are a CSS `repeating-linear-gradient`, not individual elements — at 1kg
 * resolution across a 25-400kg range that is up to 375 marks, which costs nothing as a
 * gradient and would be real DOM weight as elements. Only the labelled major ticks
 * (every 10kg, ~38 of them) are real nodes.
 *
 * The track is shifted by a measured pixel offset, not `translateX(calc(50% - Xpx))` —
 * a `%` inside `translateX` resolves against the *translated element's own* width, not
 * its container's, so against a ~3750px track that first version shifted the ruler by
 * roughly half of *that* (over a thousand pixels), pushing every tick off-screen. The
 * container's real width has to be measured and used directly.
 */
const MIN = 25;
const MAX = 400;
const PX_PER_KG = 10;
const MAJOR_EVERY = 10;

function clampRound(v: number): number {
  const clamped = Math.min(MAX, Math.max(MIN, v));
  return Math.round(clamped * 10) / 10;
}

export function WeightRulerSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startValue: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const majorTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let v = Math.ceil(MIN / MAJOR_EVERY) * MAJOR_EVERY; v <= MAX; v += MAJOR_EVERY) {
      ticks.push(v);
    }
    return ticks;
  }, []);

  const offsetFor = (v: number) => (v - MIN) * PX_PER_KG;
  const trackWidth = (MAX - MIN) * PX_PER_KG;
  const trackLeft = containerWidth / 2 - offsetFor(value);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startValue: value };
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const deltaPx = e.clientX - dragRef.current.startX;
    // Dragging left reveals higher numbers coming from the right — the direction every
    // ruler-style picker uses, and the opposite of a plain scrollbar.
    onChange(clampRound(dragRef.current.startValue - deltaPx / PX_PER_KG));
  }

  function endDrag(e: React.PointerEvent) {
    if ((e.target as Element).hasPointerCapture?.(e.pointerId)) {
      (e.target as Element).releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
    setDragging(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") onChange(clampRound(value - 0.1));
    else if (e.key === "ArrowRight") onChange(clampRound(value + 0.1));
    else if (e.key === "PageDown") onChange(clampRound(value - 1));
    else if (e.key === "PageUp") onChange(clampRound(value + 1));
    else return;
    e.preventDefault();
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-baseline gap-2 tabular-nums">
        <span className="text-5xl font-semibold">{value.toFixed(1)}</span>
        <span className="text-heading text-fg-muted">kg</span>
      </div>

      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="Goal weight in kilograms"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={value}
        aria-valuetext={`${value.toFixed(1)} kilograms`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative h-20 w-full cursor-grab touch-none overflow-hidden rounded-control outline-none focus-visible:ring-2 focus-visible:ring-line-focus active:cursor-grabbing"
      >
        {/* Fixed center indicator — the ruler moves under it, not the other way round. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 z-10 h-10 w-0.5 -translate-x-1/2 bg-brand"
        />

        {containerWidth > 0 ? (
          <div
            className="absolute top-0 h-10 transition-transform"
            style={{
              width: trackWidth,
              transform: `translateX(${trackLeft}px)`,
              transitionDuration: dragging ? "0ms" : "120ms",
              backgroundImage: `repeating-linear-gradient(to right, var(--color-line-strong) 0px, var(--color-line-strong) 1px, transparent 1px, transparent ${PX_PER_KG}px)`,
              backgroundPosition: "bottom left",
              backgroundRepeat: "repeat-x",
              backgroundSize: `${PX_PER_KG}px 14px`,
            }}
          >
            {majorTicks.map((tick) => (
              <div
                key={tick}
                className="absolute bottom-0 flex flex-col items-center"
                style={{ left: offsetFor(tick), transform: "translateX(-50%)" }}
              >
                <span className="mb-1 text-caption tabular-nums text-fg-subtle">{tick}</span>
                <div className="h-5 w-px bg-line-strong" />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
