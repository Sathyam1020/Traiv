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
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { useEffect, useId, useState } from "react";
import { isApiError } from "@/lib/api";
import { useLogWeight } from "@/lib/query";

/** The same range as the column's check constraint, so the field refuses what the row would. */
const MIN = 25;
const MAX = 400;

export function LogWeightDialog({
  studioId,
  open,
  onOpenChange,
  current,
}: {
  studioId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-filled so somebody logging 71.4 after 71.6 types one character, not four. */
  current: number | null;
}) {
  const id = useId();
  const log = useLogWeight(studioId);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset on each open rather than on close: closing mid-animation would blank the field
  // while it is still on screen.
  useEffect(() => {
    if (open) {
      setValue(current === null ? "" : String(current));
      setError(null);
    }
  }, [open, current]);

  const kg = Number(value);
  const valid = value.trim() !== "" && Number.isFinite(kg) && kg >= MIN && kg <= MAX;

  async function submit() {
    if (!valid) return;
    setError(null);
    try {
      await log.mutateAsync(kg);
      onOpenChange(false);
    } catch (e) {
      setError(isApiError(e) ? e.message : "Couldn't save that. Try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Log your weight</DialogTitle>
          <DialogDescription>
            Weigh yourself at the same time of day — first thing, before eating, is the easiest to
            repeat.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor={id}>Weight</Label>
          <div className="flex items-center gap-2">
            <Input
              id={id}
              // `decimal` rather than `numeric`: Android's numeric pad has no decimal
              // point, and 71.4 is the normal case.
              inputMode="decimal"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void submit();
              }}
              className="tabular-nums"
            />
            <span className="shrink-0 text-body-sm text-fg-muted">kg</span>
          </div>
          {error ? <p className="text-caption text-danger">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!valid || log.isPending} onClick={() => void submit()}>
            {log.isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
