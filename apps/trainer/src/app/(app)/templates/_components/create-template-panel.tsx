"use client";

import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@traiv/ui/components/sheet";
import { Textarea } from "@traiv/ui/components/textarea";
import { Image as ImageIcon, Upload } from "@traiv/ui/icons";
import { useEffect, useId, useState } from "react";
import type { TemplateInput, WorkoutDefaultValues } from "@/lib/api";
import { isApiError } from "@/lib/api";

const NAME_MAX = 255;
const DESCRIPTION_MAX = 4096;

/**
 * "Create Template" — name, description, an image, and the **Default Values** that
 * seed every new exercise added inside it (sets, reps, rest, weight, duration,
 * distance). "Continue" creates the template and hands back its id; the caller
 * navigates into the builder.
 *
 * The same panel, relabelled, is "Customize Template" on a client's own copy — see
 * `duplicate-from-template-panel.tsx`, which reuses the field layout with different
 * copy and a different submit action rather than duplicating this form.
 */
export function CreateTemplatePanel({
  open,
  onOpenChange,
  onCreate,
  creating,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: TemplateInput) => void;
  creating: boolean;
}) {
  const nameId = useId();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [defaults, setDefaults] = useState<WorkoutDefaultValues>({ sets: 3, reps: 10, rest: 60 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setImageUrl("");
      setDefaults({ sets: 3, reps: 10, rest: 60 });
      setError(null);
    }
  }, [open]);

  function submit() {
    setError(null);
    if (!name.trim()) {
      setError("Give it a name first.");
      return;
    }
    try {
      onCreate({
        name: name.trim(),
        description: description.trim() || null,
        imageUrl: imageUrl.trim() || null,
        defaultValues: defaults,
        sessions: [],
      });
    } catch (e) {
      setError(isApiError(e) ? e.message : "Couldn't create that. Try again.");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-4 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Create Template</SheetTitle>
          <SheetDescription>
            Fill in the details to create a new workout template. You can add exercises and
            customize sessions after saving.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor={nameId}>Name</Label>
              <span className="text-caption text-fg-subtle tabular-nums">
                {name.length}/{NAME_MAX}
              </span>
            </div>
            <Input
              id={nameId}
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
              placeholder="Enter Name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <Label>Description</Label>
              <span className="text-caption text-fg-subtle tabular-nums">
                {description.length}/{DESCRIPTION_MAX}
              </span>
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, DESCRIPTION_MAX))}
              placeholder="Enter Description"
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Image</Label>
            {imageUrl ? (
              <div className="relative w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt=""
                  className="h-24 w-24 rounded-control border border-line object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-control border border-line border-dashed px-4 py-6">
                <ImageIcon className="size-6 text-fg-subtle" />
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste an image URL"
                  className="h-9"
                />
                <span className="flex items-center gap-1 text-caption text-fg-subtle">
                  <Upload className="size-3" />
                  PNG, JPG or GIF
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Default Values</Label>
            <p className="text-caption text-fg-subtle">
              These values will be used as the default for new exercises in this template.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <NumberField
                label="sets"
                value={defaults.sets}
                onChange={(v) => setDefaults({ ...defaults, sets: v })}
              />
              <NumberField
                label="reps"
                value={defaults.reps}
                onChange={(v) => setDefaults({ ...defaults, reps: v })}
              />
              <NumberField
                label="rest"
                suffix="s"
                value={defaults.rest}
                onChange={(v) => setDefaults({ ...defaults, rest: v })}
              />
              <NumberField
                label="weight (kg)"
                value={defaults.weightKg}
                onChange={(v) => setDefaults({ ...defaults, weightKg: v })}
              />
              <NumberField
                label="duration (s)"
                value={defaults.durationSeconds}
                onChange={(v) => setDefaults({ ...defaults, durationSeconds: v })}
              />
              <NumberField
                label="distance (m)"
                value={defaults.distanceM}
                onChange={(v) => setDefaults({ ...defaults, distanceM: v })}
              />
            </div>
          </div>

          {error ? <p className="text-caption text-danger">{error}</p> : null}
        </div>

        <div className="border-line border-t px-4 py-3">
          <Button className="w-full" onClick={submit} disabled={creating}>
            {creating ? "Creating…" : "Continue"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NumberField({
  label,
  suffix,
  value,
  onChange,
}: {
  label: string;
  suffix?: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex flex-col gap-1">
      <span className="text-caption text-fg-subtle">{label}</span>
      <span className="flex items-center gap-1">
        <Input
          id={id}
          inputMode="decimal"
          value={value ?? ""}
          onChange={(e) => {
            const n = Number(e.target.value);
            onChange(e.target.value.trim() === "" || !Number.isFinite(n) ? undefined : n);
          }}
          className="h-9 tabular-nums"
        />
        {suffix ? <span className="text-caption text-fg-subtle">{suffix}</span> : null}
      </span>
    </label>
  );
}
