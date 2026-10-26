"use client";

import { Button } from "@traiv/ui/components/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@traiv/ui/components/dialog";
import { useEffect, useState } from "react";
import { WheelPicker } from "./wheel-picker";

const MINUTES = Array.from({ length: 11 }, (_, n) => n);
const SECONDS = Array.from({ length: 60 }, (_, n) => n);

export function DurationDialog({
  open,
  onOpenChange,
  initialSeconds,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSeconds: number;
  onSubmit: (seconds: number) => void;
}) {
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);

  // Initialize the picker when opened.
  // Scrolling only updates these local values.
  useEffect(() => {
    if (!open) return;

    setMin(Math.min(10, Math.floor(initialSeconds / 60)));
    setSec(initialSeconds % 60);
  }, [open, initialSeconds]);

  function handleDone() {
    // Apply the chosen duration only when Done is pressed.
    onSubmit(min * 60 + sec);
    onOpenChange(false);
  }

  function handleCancel() {
    // Discard the selection without changing the timer.
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Set Duration</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center gap-3 py-3">
          <WheelPicker values={MINUTES} value={min} onChange={setMin} label="Min" />

          <span className="self-center pb-1 text-heading font-semibold">:</span>

          <WheelPicker values={SECONDS} value={sec} onChange={setSec} label="Sec" />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-line pt-3">
          <Button type="button" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>

          <Button type="button" onClick={handleDone}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
