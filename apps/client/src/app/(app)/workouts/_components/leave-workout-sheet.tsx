"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@traiv/ui/components/dialog";

/**
 * The back arrow, mid-session: "You can pause to continue later or cancel to discard
 * your progress." — exact copy from the real app.
 */
export function LeaveWorkoutSheet({
  open,
  onOpenChange,
  onPause,
  onCancelWorkout,
  cancelling,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPause: () => void;
  onCancelWorkout: () => void;
  cancelling: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 text-center sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Leave Workout</DialogTitle>
          <p className="text-body-sm text-fg-muted">
            You can pause to continue later or cancel to discard your progress.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onPause}
            className="w-full cursor-pointer rounded-control bg-sunken py-3 text-body font-medium transition-colors hover:bg-hover"
          >
            Pause Workout
          </button>
          <button
            type="button"
            onClick={onCancelWorkout}
            disabled={cancelling}
            className="w-full cursor-pointer rounded-control bg-sunken py-3 text-body font-medium text-danger transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelling ? "Cancelling…" : "Cancel Workout"}
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full cursor-pointer rounded-control py-3 text-body font-medium text-fg-muted transition-colors hover:bg-hover"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
