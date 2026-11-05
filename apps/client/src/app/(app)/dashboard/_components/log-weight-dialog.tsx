"use client";

import { Button } from "@traiv/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent
        variant="scrollable"
        className="max-w-sm p-0"
        onInteractOutside={(e) => log.isPending && e.preventDefault()}
      >
        <DialogHeader className="shrink-0 px-5 py-5">
          <DialogTitle>Log your weight</DialogTitle>
          <DialogDescription>
            Weigh yourself at the same time each day, ideally before eating.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
          className="flex min-h-0 flex-col"
        >
          <div className="space-y-2 overflow-y-auto px-5 py-5">
            <Label htmlFor={id}>Weight</Label>
            <div className="relative">
              <Input
                id={id}
                type="number"
                inputMode="decimal"
                min={MIN}
                max={MAX}
                step="any"
                required
                value={value}
                disabled={log.isPending}
                onChange={(e) => setValue(e.target.value)}
                className="h-12 w-full pr-14 tabular-nums"
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-fg-muted">
                kg
              </span>
            </div>
            {error && (
              <p role="alert" className="text-caption text-danger">
                {error}
              </p>
            )}
          </div>
          <footer className="grid shrink-0 grid-cols-2 gap-3 border-t border-line px-5 py-4">
            <Button
              type="button"
              variant="outline"
              disabled={log.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!valid || log.isPending}>
              {log.isPending ? "Saving…" : "Save"}
            </Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}
