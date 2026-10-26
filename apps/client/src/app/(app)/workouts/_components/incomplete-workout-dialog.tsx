"use client";

import { Button } from "@traiv/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@traiv/ui/components/dialog";

/** Header "Finish" tapped with sets still open — exact copy from the real app. */
export function IncompleteWorkoutDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Incomplete Workout</DialogTitle>
          <DialogDescription>
            You haven&apos;t completed all sets. Are you sure you want to finish the workout anyway?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Finish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
