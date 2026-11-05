"use client";

import { Button } from "@traiv/ui/components/button";
import { Label } from "@traiv/ui/components/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@traiv/ui/components/sheet";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@traiv/ui/components/tabs";
import { Plus, X } from "@traiv/ui/icons";
import { useEffect, useId, useState } from "react";
import type { ExerciseWrite, FieldName } from "@/lib/api";
import { FIELD_LABELS, FIELD_NAMES, isApiError } from "@/lib/api";
import { useExercise, useExerciseActions } from "@/lib/query";
import { ChipInput } from "./chip-input";
import { NameAndMedia } from "./name-and-media";

const MOVEMENT_PATTERNS = [
  "squat",
  "hinge",
  "push_horizontal",
  "push_vertical",
  "pull_horizontal",
  "pull_vertical",
  "lunge",
  "carry",
  "core",
  "cardio",
  "mobility",
] as const;

type Draft = {
  name: string;
  description: string;
  videoUrl: string;
  imageUrl: string;
  primary: string;
  secondary: string[];
  pattern: (typeof MOVEMENT_PATTERNS)[number];
  equipment: string[];
  stimulus: string[];
  location: string[];
  injuryRisk: string[];
  level: string[];
  type: string[];
  fields: FieldName[];
};

const BLANK: Draft = {
  name: "",
  description: "",
  videoUrl: "",
  imageUrl: "",
  primary: "",
  secondary: [],
  pattern: "core",
  equipment: [],
  stimulus: [],
  location: [],
  injuryRisk: [],
  level: [],
  type: [],
  fields: ["weight", "reps", "rest"],
};

/**
 * "Edit Exercise" / "New Exercise" — the real two-step panel: **1 Details** (name,
 * description, video and image) then **2 Exercise** (Primary/Secondary/Tertiary Focus,
 * Equipment, Stimulus, Location, Injury Risk, Experience Level, Exercise Type, and the
 * "Default fields" picker — "the fields a set starts with when you add this exercise to
 * a workout, in this order").
 */
export function ExercisePanel({
  studioId,
  open,
  exerciseId,
  onOpenChange,
}: {
  studioId: string;
  open: boolean;
  exerciseId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const existing = useExercise(studioId, exerciseId);
  const actions = useExerciseActions(studioId);
  const [tab, setTab] = useState("1");
  const [draft, setDraft] = useState<Draft>(BLANK);
  const [error, setError] = useState<string | null>(null);
  const [draftFor, setDraftFor] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) {
      setDraftFor(null);
      return;
    }
    const identity = `${studioId}:${exerciseId ?? "new"}`;
    if (draftFor === identity) return;
    if (!exerciseId) {
      setDraft(BLANK);
      setDraftFor(identity);
      setTab("1");
      setError(null);
      return;
    }
    if (existing.data?.id === exerciseId) {
      setTab("1");
      setError(null);
      setDraftFor(identity);
      const e = existing.data;
      setDraft({
        name: e.name,
        description: (e.description ?? "").slice(0, 2048),
        videoUrl: e.videoUrl ?? "",
        imageUrl: e.imageUrl ?? "",
        primary: e.muscle,
        secondary: e.secondaryMuscles ?? [],
        pattern: (e.pattern as Draft["pattern"]) ?? "core",
        equipment: e.equipment ? [e.equipment] : [],
        stimulus: e.stimulus ? [e.stimulus] : [],
        location: e.location ? [e.location] : [],
        injuryRisk: e.injuryRisk ? [e.injuryRisk] : [],
        level: e.level ? [e.level] : [],
        type: e.category ? [e.category] : [],
        fields: e.defaultFields ?? ["weight", "reps", "rest"],
      });
    }
    // Deliberately re-runs when the fetched record arrives, not only on open — editing
    // from the list opens before the exercise has loaded the first time.
  }, [open, studioId, exerciseId, existing.data, draftFor]);

  const nameId = useId();
  const canSave = draft.name.trim().length > 0 && draft.primary.trim().length > 0;

  async function save() {
    setError(null);
    const input: ExerciseWrite = {
      name: draft.name.trim(),
      description: draft.description.trim() || null,
      muscle: draft.primary.trim(),
      secondaryMuscles: draft.secondary,
      equipment: draft.equipment[0] ?? "other",
      pattern: draft.pattern,
      imageUrl: draft.imageUrl.trim() || null,
      videoUrl: draft.videoUrl.trim() || null,
      stimulus: draft.stimulus[0] ?? null,
      level: draft.level[0] ?? null,
      category: draft.type[0] ?? null,
      location: draft.location[0] ?? null,
      injuryRisk: draft.injuryRisk[0] ?? null,
      defaultFields: draft.fields,
    };

    try {
      if (exerciseId) await actions.update.mutateAsync({ id: exerciseId, input });
      else await actions.create.mutateAsync(input);
      onOpenChange(false);
    } catch (e) {
      setError(isApiError(e) ? e.message : "Couldn't save. Try again.");
    }
  }

  const saving = actions.create.isPending || actions.update.isPending;
  const ready = draftFor === `${studioId}:${exerciseId ?? "new"}`;

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        if (!saving && !uploading) onOpenChange(value);
      }}
    >
      <SheetContent className="w-full gap-0 p-0 sm:max-w-2xl">
        <SheetHeader className="shrink-0 px-5 py-4">
          <SheetTitle>{exerciseId ? "Edit Exercise" : "New Exercise"}</SheetTitle>
          <SheetDescription>
            {exerciseId
              ? "Update your exercise details below. Press save to update your exercise."
              : "Fill in the details below to add this exercise to your library."}
          </SheetDescription>
        </SheetHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex min-h-0 flex-1 flex-col gap-0">
          <TabsList variant="line" className="mx-4 shrink-0">
            <TabsTrigger value="1" disabled={uploading || saving}>
              <span
                className={`flex size-5 items-center justify-center rounded-full text-xs ${tab === "1" ? "bg-contrast text-contrast-fg" : "bg-sunken text-fg-subtle"}`}
              >
                1
              </span>
              Details
            </TabsTrigger>
            <TabsTrigger value="2" disabled={uploading || saving}>
              <span
                className={`flex size-5 items-center justify-center rounded-full text-xs ${tab === "2" ? "bg-contrast text-contrast-fg" : "bg-sunken text-fg-subtle"}`}
              >
                2
              </span>
              Exercise
            </TabsTrigger>
          </TabsList>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            {!ready ? (
              existing.isError ? (
                <div role="alert" className="space-y-3 text-sm">
                  <p>
                    {existing.error instanceof Error
                      ? existing.error.message
                      : "Couldn't load exercise."}
                  </p>
                  <Button variant="outline" onClick={() => void existing.refetch()}>
                    Retry
                  </Button>
                </div>
              ) : (
                <div role="status" aria-label="Loading exercise" className="space-y-5">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-11 w-full" />
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              )
            ) : (
              <>
                <TabsContent value="1" className="flex flex-col gap-4">
                  <NameAndMedia
                    draft={draft}
                    onChange={(next) => setDraft((current) => ({ ...current, ...next }))}
                    nameId={nameId}
                    studioId={studioId}
                    onBusyChange={setUploading}
                  />
                </TabsContent>

                <TabsContent value="2" className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-body-sm font-semibold">Muscle Groups</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <ChipInput
                        label="Primary Focus"
                        single
                        values={draft.primary ? [draft.primary] : []}
                        onChange={(v) => setDraft({ ...draft, primary: v[0] ?? "" })}
                      />
                      <ChipInput
                        label="Secondary Focus"
                        single
                        values={draft.secondary.slice(0, 1)}
                        onChange={(v) => setDraft({ ...draft, secondary: v })}
                      />
                      <ChipInput
                        label="Tertiary Focus"
                        single
                        values={draft.secondary.slice(1, 2)}
                        onChange={(v) =>
                          setDraft({
                            ...draft,
                            secondary: [draft.secondary[0] ?? "", ...v].filter(Boolean),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-body-sm font-semibold">Advanced</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <ChipInput
                        label="Equipment"
                        single
                        values={draft.equipment}
                        onChange={(v) => setDraft({ ...draft, equipment: v })}
                      />
                      <ChipInput
                        label="Stimulus"
                        single
                        values={draft.stimulus}
                        onChange={(v) => setDraft({ ...draft, stimulus: v })}
                      />
                      <ChipInput
                        label="Location"
                        single
                        values={draft.location}
                        onChange={(v) => setDraft({ ...draft, location: v })}
                      />
                      <ChipInput
                        label="Injury Risk"
                        single
                        values={draft.injuryRisk}
                        onChange={(v) => setDraft({ ...draft, injuryRisk: v })}
                      />
                      <ChipInput
                        label="Experience Level"
                        single
                        values={draft.level}
                        onChange={(v) => setDraft({ ...draft, level: v })}
                      />
                      <ChipInput
                        label="Exercise Type"
                        single
                        values={draft.type}
                        onChange={(v) => setDraft({ ...draft, type: v })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Default fields</Label>
                    <div className="flex flex-wrap items-center gap-2">
                      {draft.fields.map((f) => (
                        <span
                          key={f}
                          className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-caption font-medium"
                        >
                          {FIELD_LABELS[f]}
                          <button
                            type="button"
                            onClick={() =>
                              setDraft({ ...draft, fields: draft.fields.filter((x) => x !== f) })
                            }
                            aria-label={`Remove ${FIELD_LABELS[f]}`}
                            className="cursor-pointer text-fg-subtle hover:text-danger"
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      ))}
                      <AddField
                        fields={draft.fields}
                        onAdd={(f) => setDraft({ ...draft, fields: [...draft.fields, f] })}
                      />
                    </div>
                    <p className="text-caption text-fg-subtle">
                      The fields a set starts with when you add this exercise to a workout, in this
                      order.
                    </p>
                  </div>
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>

        {error ? <p className="px-4 pb-2 text-caption text-danger">{error}</p> : null}

        <div className="flex shrink-0 items-center justify-between gap-3 border-line border-t bg-surface px-5 py-3">
          {tab === "2" ? (
            <Button variant="ghost" onClick={() => setTab("1")}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {tab === "1" ? (
            <Button
              onClick={() => setTab("2")}
              disabled={!draft.name.trim() || !ready || uploading || saving}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={() => void save()}
              disabled={!canSave || saving || uploading || !ready}
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AddField({ fields, onAdd }: { fields: FieldName[]; onAdd: (f: FieldName) => void }) {
  const [open, setOpen] = useState(false);
  const remaining = FIELD_NAMES.filter((f) => !fields.includes(f));

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={remaining.length === 0}
        className="flex cursor-pointer items-center gap-1 rounded-full border border-line border-dashed px-3 py-1.5 text-caption text-fg-muted transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="size-3" />
        Add field
      </button>
    );
  }

  return (
    <span className="flex flex-wrap gap-1.5">
      {remaining.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => {
            onAdd(f);
            setOpen(false);
          }}
          className="cursor-pointer rounded-full bg-sunken px-2.5 py-1 text-caption transition-colors hover:bg-hover"
        >
          {FIELD_LABELS[f]}
        </button>
      ))}
    </span>
  );
}
