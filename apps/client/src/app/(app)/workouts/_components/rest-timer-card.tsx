"use client";

import { Pause, Pencil, Play, SkipForward } from "@traiv/ui/icons";
import { useState } from "react";
import { DurationDialog } from "./duration-dialog";

export type RestTimerState = {
  exerciseName: string;
  totalSeconds: number;
  remainingSeconds: number;
};

type RestTimerCardProps = {
  timer: RestTimerState;
  paused: boolean;
  onPausedChange: (paused: boolean) => void;
  onSkip: () => void;
  onChangeDuration: (totalSeconds: number) => void;
  onEditingChange: (editing: boolean) => void;
};

function formatClock(totalSeconds: number) {
  const seconds = Math.max(0, totalSeconds);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function RestTimerCard({
  timer,
  paused,
  onPausedChange,
  onSkip,
  onChangeDuration,
  onEditingChange,
}: RestTimerCardProps) {
  const [editing, setEditing] = useState(false);
  const remaining = Math.max(0, timer.remainingSeconds);
  const complete = remaining === 0;
  const fraction = timer.totalSeconds > 0 ? Math.min(1, remaining / timer.totalSeconds) : 0;
  function edit(open: boolean) {
    setEditing(open);
    onEditingChange(open);
  }

  return (
    <>
      <section
        aria-label="Rest timer"
        className="border-t border-line bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p role="status" className="text-caption font-medium text-signal-text">
                {complete
                  ? "Rest complete — ready for your next set"
                  : paused
                    ? "Rest paused"
                    : "Rest timer"}
              </p>
              <p className="truncate text-body-sm text-fg-muted">{timer.exerciseName}</p>
            </div>
            <span className="text-2xl font-semibold tabular-nums tracking-tight">
              {formatClock(remaining)}
            </span>
            <button
              type="button"
              disabled={complete}
              onClick={() => onPausedChange(!paused)}
              aria-label={paused ? "Resume rest timer" : "Pause rest timer"}
              aria-pressed={paused}
              className="client-tappable flex size-11 shrink-0 items-center justify-center rounded-full bg-signal-subtle text-signal-text disabled:opacity-40"
            >
              {paused ? <Play className="size-5" /> : <Pause className="size-5" />}
            </button>
            <button
              type="button"
              onClick={() => edit(true)}
              aria-label="Edit rest duration"
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-fg-muted hover:bg-hover"
            >
              <Pencil className="size-4" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-sunken"
              role="progressbar"
              aria-label="Rest time remaining"
              aria-valuemin={0}
              aria-valuemax={Math.max(1, timer.totalSeconds)}
              aria-valuenow={remaining}
              aria-valuetext={`${remaining} seconds remaining${paused ? ", paused" : ""}`}
            >
              <div
                className="h-full origin-left rounded-full bg-signal transition-transform duration-300 ease-linear motion-reduce:transition-none"
                style={{ transform: `scaleX(${fraction})` }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                edit(false);
                onSkip();
              }}
              className="flex min-h-11 shrink-0 items-center gap-1.5 text-body-sm font-medium text-fg-muted hover:text-fg"
            >
              <SkipForward className="size-4" />
              {complete ? "Dismiss" : "Skip rest"}
            </button>
          </div>
        </div>
      </section>
      <DurationDialog
        open={editing}
        onOpenChange={edit}
        initialSeconds={remaining}
        onSubmit={(seconds) => {
          onChangeDuration(seconds);
          edit(false);
        }}
      />
    </>
  );
}
