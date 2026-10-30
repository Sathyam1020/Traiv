"use client";

import { Button } from "@traiv/ui/components/button";
import { Textarea } from "@traiv/ui/components/textarea";
import { GripVertical, Trash } from "@traiv/ui/icons";
import { useRef, useState } from "react";

export function RecipeSteps({
  steps,
  onChange,
}: {
  steps: string[];
  onChange: (steps: string[]) => void;
}) {
  const list = useRef<HTMLOListElement>(null);
  const dragging = useRef<number | null>(null);
  const beforeDrag = useRef<string[]>([]);
  const latest = useRef(steps);
  latest.current = steps;
  const [active, setActive] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const start = (index: number) => {
    beforeDrag.current = [...latest.current];
    dragging.current = index;
    setActive(index);
    setAnnouncement(
      `Picked up step ${index + 1}. Use arrow keys to move, Enter to drop, Escape to cancel.`,
    );
  };
  const move = (target: number) => {
    const from = dragging.current;
    if (from === null || from === target || target < 0 || target >= latest.current.length) return;
    const next = [...latest.current];
    const [step] = next.splice(from, 1);
    if (step === undefined) return;
    next.splice(target, 0, step);
    latest.current = next;
    dragging.current = target;
    setActive(target);
    onChange(next);
    setAnnouncement(`Step moved to position ${target + 1}.`);
  };
  const finish = (cancel = false) => {
    if (cancel && dragging.current !== null) onChange(beforeDrag.current);
    dragging.current = null;
    setActive(null);
    setAnnouncement(cancel ? "Move cancelled." : "Step dropped.");
  };
  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      <ol ref={list} className="flex flex-col gap-2">
        {steps.map((step, index) => (
          <li
            key={index}
            data-recipe-step={index}
            className={`flex items-start gap-2 rounded-control border p-3 transition-colors duration-100 ${active === index ? "border-line-focus bg-selected" : "border-transparent bg-sunken"}`}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-1 shrink-0 touch-none cursor-grab active:cursor-grabbing"
              aria-label={`Drag step ${index + 1} to reorder`}
              aria-pressed={active === index}
              aria-keyshortcuts="Space Enter ArrowUp ArrowDown Escape"
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                event.preventDefault();
                event.currentTarget.focus();
                event.currentTarget.setPointerCapture(event.pointerId);
                start(index);
              }}
              onPointerMove={(event) => {
                if (dragging.current === null || event.buttons === 0) return;
                const row = document
                  .elementFromPoint(event.clientX, event.clientY)
                  ?.closest<HTMLElement>("[data-recipe-step]");
                if (row && row.parentElement === list.current) move(Number(row.dataset.recipeStep));
                const scroller = list.current?.parentElement?.parentElement;
                if (scroller) {
                  const bounds = scroller.getBoundingClientRect();
                  if (event.clientY < bounds.top + 48) scroller.scrollBy(0, -12);
                  else if (event.clientY > bounds.bottom - 48) scroller.scrollBy(0, 12);
                }
              }}
              onPointerUp={() => finish()}
              onPointerCancel={() => finish(true)}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  if (dragging.current === null) start(index);
                  else finish();
                } else if (event.key === "Escape" && dragging.current !== null) {
                  event.preventDefault();
                  finish(true);
                } else if (
                  (event.key === "ArrowUp" || event.key === "ArrowDown") &&
                  dragging.current !== null
                ) {
                  event.preventDefault();
                  move(dragging.current + (event.key === "ArrowUp" ? -1 : 1));
                }
              }}
            >
              <GripVertical className="size-4" />
            </Button>
            <span className="mt-3 flex size-6 shrink-0 items-center justify-center rounded-full bg-selected text-caption text-fg-muted">
              {index + 1}
            </span>
            <Textarea
              className="min-h-11 min-w-0 flex-1 resize-y bg-surface"
              aria-label={`Instruction ${index + 1}`}
              value={step}
              onChange={(event) =>
                onChange(steps.map((text, n) => (n === index ? event.target.value : text)))
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-1 shrink-0"
              aria-label={`Remove step ${index + 1}`}
              onClick={() => onChange(steps.filter((_, n) => n !== index))}
            >
              <Trash className="size-4" />
            </Button>
          </li>
        ))}
      </ol>
    </>
  );
}
