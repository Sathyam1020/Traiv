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
import { Textarea } from "@traiv/ui/components/textarea";
import { cn } from "@traiv/ui/lib/cn";
import { Tag as TagIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { isApiError, type Tag } from "@/lib/api";
import { useCreateTag } from "@/lib/query";

/**
 * Eight colours, picked rather than typed.
 *
 * A free hex field alone gets you #ffffff on white. These are the ones that hold their
 * contrast as a dot and as a tint behind text, and the field below them is still there
 * for a coach matching their own brand.
 */
const SWATCHES = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

const HEX = /^#[0-9a-f]{6}$/i;

export function CreateTagDialog({
  studioId,
  open,
  onOpenChange,
  initialName = "",
  onCreated,
}: {
  studioId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Prefilled when the coach typed a name into the picker's search box. */
  initialName?: string;
  onCreated?: (tag: Tag) => void;
}) {
  const nameId = useId();
  const descriptionId = useId();
  const colorId = useId();

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(SWATCHES[4] as string);
  const [error, setError] = useState<string | null>(null);
  const create = useCreateTag(studioId);

  // Reset on each open rather than on close, so the fields do not visibly empty
  // themselves while the dialog is still on screen.
  useEffect(() => {
    if (!open) return;
    setName(initialName);
    setDescription("");
    setColor(SWATCHES[4] as string);
    setError(null);
  }, [open, initialName]);

  const validColor = HEX.test(color);
  const ready = name.trim().length > 0 && validColor && !create.isPending;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setError(null);
    try {
      const tag = await create.mutateAsync({
        name: name.trim(),
        description: description.trim() || null,
        color: color.toLowerCase(),
      });
      onCreated?.(tag);
      onOpenChange(false);
    } catch (err) {
      setError(isApiError(err) ? err.message : "That didn't save. Try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[26rem]">
        <form onSubmit={submit} className="flex flex-col gap-5">
          <DialogHeader className="gap-1 text-left">
            <DialogTitle>New tag</DialogTitle>
            <DialogDescription>
              Tags are yours alone — your clients never see them.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={nameId}>Name</Label>
            <Input
              id={nameId}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Weight loss"
              maxLength={40}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={descriptionId}>Description</Label>
            <Textarea
              id={descriptionId}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this tag is for. Optional."
              rows={2}
              maxLength={200}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <Label htmlFor={colorId}>Colour</Label>
            <div className="flex flex-wrap gap-2">
              {SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  aria-label={swatch}
                  aria-pressed={color.toLowerCase() === swatch}
                  onClick={() => setColor(swatch)}
                  style={{ backgroundColor: swatch }}
                  className={cn(
                    "size-8 cursor-pointer rounded-full transition-[outline-width]",
                    "outline-offset-2 focus-visible:outline-2 focus-visible:outline-line-focus",
                    color.toLowerCase() === swatch
                      ? "outline-2 outline-line-focus"
                      : "outline-0 outline-transparent",
                  )}
                />
              ))}
            </div>
            <Input
              id={colorId}
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-invalid={!validColor || undefined}
              className="font-mono"
              maxLength={7}
            />
            {!validColor ? (
              <p className="text-caption text-danger">A colour looks like #3b82f6.</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium">Preview</span>
            <div className="flex items-center gap-2 rounded-control border border-line bg-sunken px-3 py-2.5">
              <TagIcon
                className="size-4 shrink-0"
                style={{ color: validColor ? color : undefined }}
              />
              <span className="truncate text-body-sm font-medium">{name.trim() || "Your tag"}</span>
            </div>
          </div>

          {error ? (
            <p role="alert" className="text-body-sm text-danger">
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!ready}>
              {create.isPending ? "Creating…" : "Create tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
