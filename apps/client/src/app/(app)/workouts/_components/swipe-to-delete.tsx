"use client";

import { Trash } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import { type ReactNode, useRef, useState } from "react";

const REVEAL = 72;
/** Below this, a touch that wobbled a few px while tapping an input isn't a swipe. */
const LOCK_THRESHOLD = 10;

/**
 * iOS Mail/Reminders swipe-to-delete, for a set row — this app is mobile-first and the
 * real delete affordance is a left swipe, not a button sitting on the row. Plain pointer
 * events and a transform; no library for a gesture five DOM events already cover.
 *
 * A real finger rarely moves in a perfectly straight line — a vertical page-scroll that
 * starts on a row always carries some horizontal wobble too. Without a direction lock,
 * that wobble alone is enough to cross the open/closed threshold, which is exactly what
 * "swiping" more than one row at once turned out to be: not a second gesture, a scroll
 * being misread as one. Nothing moves until the gesture has committed to horizontal.
 *
 * `open`/`onOpenChange` are controlled so the parent can keep only one row open at a
 * time — opening a second row closes whichever one was already open, the same as the
 * real thing.
 */
export function SwipeToDelete({
  open,
  onOpenChange,
  onDelete,
  disabled,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  const [liveX, setLiveX] = useState<number | null>(null);
  const start = useRef({ x: 0, y: 0, open: false });
  // "unset" until the gesture commits one way or the other; "horizontal" is the only
  // state that actually drags the row.
  const lock = useRef<"unset" | "horizontal" | "vertical">("unset");

  const x = liveX ?? (open ? -REVEAL : 0);
  const dragging = liveX !== null;

  function onPointerDown(e: React.PointerEvent) {
    if (disabled) return;
    start.current = { x: e.clientX, y: e.clientY, open };
    lock.current = "unset";
    // Not setPointerCapture yet — captured too early, a tap on the checkbox or an
    // input never gets its click because this element swallowed the pointer first.
  }

  function onPointerMove(e: React.PointerEvent) {
    if (lock.current === "vertical") return;

    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;

    if (lock.current === "unset") {
      if (Math.abs(dx) < LOCK_THRESHOLD && Math.abs(dy) < LOCK_THRESHOLD) return;
      // Horizontal only once it's unambiguously more horizontal than vertical —
      // otherwise this is a page scroll and the row stays put.
      if (Math.abs(dy) > Math.abs(dx)) {
        lock.current = "vertical";
        return;
      }
      lock.current = "horizontal";
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    e.preventDefault();
    const base = start.current.open ? -REVEAL : 0;
    setLiveX(Math.min(0, Math.max(-REVEAL, base + dx)));
  }

  function onPointerUp() {
    if (lock.current !== "horizontal") {
      lock.current = "unset";
      return;
    }
    lock.current = "unset";
    const next = (liveX ?? 0) < -REVEAL / 2;
    setLiveX(null);
    onOpenChange(next);
  }

  return (
    // `scroll-mt` so a browser scrolling this row into view (a focused input, an
    // anchor) leaves room for the active session's sticky header instead of tucking
    // the row straight underneath it.
    <div className="relative scroll-mt-44 overflow-hidden rounded-control">
      <button
        type="button"
        onClick={() => {
          onDelete();
          onOpenChange(false);
        }}
        aria-label="Delete set"
        tabIndex={open ? 0 : -1}
        className="absolute inset-y-0 right-0 flex w-[72px] items-center justify-center rounded-control bg-danger text-white"
      >
        <Trash className="size-4" />
      </button>
      <div
        style={{ transform: `translateX(${x}px)`, touchAction: "pan-y" }}
        className={cn(
          "relative bg-panel",
          !dragging && "transition-transform duration-200 ease-out",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          // A tap anywhere on an already-open row closes it instead of reaching
          // whatever's underneath — the same as tapping away from an open iOS swipe.
          if (open) {
            e.preventDefault();
            e.stopPropagation();
            onOpenChange(false);
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
