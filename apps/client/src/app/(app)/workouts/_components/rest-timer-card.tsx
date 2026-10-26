"use client";

import { Pencil, SkipForward, Volume2, VolumeX } from "@traiv/ui/icons";
import { useState } from "react";
import { DurationDialog } from "./duration-dialog";

export type RestTimerState = {
  exerciseName: string;
  totalSeconds: number;
  remainingSeconds: number;
};

type RestTimerCardProps = {
  timer: RestTimerState;
  onSkip: () => void;
  onChangeDuration: (totalSeconds: number) => void;
  onEditingChange: (editing: boolean) => void;
};

function formatClock(totalSeconds: number) {
  const seconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function RestTimerCard({
  timer,
  onSkip,
  onChangeDuration,
  onEditingChange,
}: RestTimerCardProps) {
  const [muted, setMuted] = useState(false);
  const [editing, setEditing] = useState(false);

  const remainingSeconds = Math.max(0, timer.remainingSeconds);

  const fraction = timer.totalSeconds > 0 ? Math.min(1, remainingSeconds / timer.totalSeconds) : 0;

  function handleDialogChange(open: boolean) {
    setEditing(open);
    onEditingChange(open);
  }

  function handleDurationSubmit(totalSeconds: number) {
    onChangeDuration(totalSeconds);
    handleDialogChange(false);
  }

  function handleSkip() {
    handleDialogChange(false);
    onSkip();
  }

  return (
    <>
      <div className="sticky bottom-0 z-20 border-t border-line bg-surface/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-surface border border-line bg-surface p-3 shadow-lg">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col">
              <span className="text-caption text-fg-muted">Rest timer</span>

              <span className="truncate text-body-sm font-medium">{timer.exerciseName}</span>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setMuted((value) => !value)}
                aria-label={muted ? "Enable sound" : "Mute sound"}
                aria-pressed={muted}
                className="flex size-9 items-center justify-center rounded-control text-fg-muted transition-colors hover:bg-hover hover:text-fg"
              >
                {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleDialogChange(true)}
                aria-label="Edit rest duration"
                className="flex size-9 items-center justify-center rounded-control text-fg-muted transition-colors hover:bg-hover hover:text-fg"
              >
                <Pencil className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="min-w-0 flex-1 font-semibold text-heading tabular-nums">
              {formatClock(remainingSeconds)}
            </span>

            <button
              type="button"
              onClick={handleSkip}
              className="flex shrink-0 items-center gap-1.5 rounded-control bg-sunken px-3 py-2 text-body-sm font-medium transition-colors hover:bg-hover"
            >
              <SkipForward className="size-4" />
              Skip
            </button>
          </div>

          <div
            className="h-1.5 overflow-hidden rounded-full bg-sunken"
            role="progressbar"
            aria-label="Rest time remaining"
            aria-valuemin={0}
            aria-valuemax={timer.totalSeconds}
            aria-valuenow={remainingSeconds}
          >
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-300"
              style={{ width: `${fraction * 100}%` }}
            />
          </div>
        </div>
      </div>

      <DurationDialog
        open={editing}
        onOpenChange={handleDialogChange}
        initialSeconds={timer.remainingSeconds}
        onSubmit={handleDurationSubmit}
      />
    </>
  );
}
