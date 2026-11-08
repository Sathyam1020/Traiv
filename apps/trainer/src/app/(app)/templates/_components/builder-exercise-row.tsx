"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@traiv/ui/components/dropdown-menu";
import { Input } from "@traiv/ui/components/input";
import { ChevronRight, Copy, Dumbbell, MoreHorizontal, Plus, Trash } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import Image from "next/image";
import { useState } from "react";
import type { FieldName, PrescribedSet, SessionExercise } from "@/lib/api";

/**
 * One exercise inside a session: collapsed it shows the common value per field ("sets
 * 3", "weight 100"), the chevron expands it into one row per set — exactly the real
 * builder's behaviour, which is why `exercise_set` is one row per set server-side too.
 */
export function BuilderExerciseRow({
  exercise,
  onChange,
  onRemove,
  onSaveForReuse,
}: {
  exercise: SessionExercise;
  onChange: (next: SessionExercise) => void;
  onRemove: () => void;
  onSaveForReuse?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const fields = exercise.fields ?? ["weight", "reps", "rest"];
  const sets = exercise.sets;

  const setSets = (next: PrescribedSet[]) => onChange({ ...exercise, sets: next });

  // The collapsed summary: the first set's values, which is what "sets 3 / weight 100 /
  // rep range 8-10" means when every set is the same — the common case a coach starts from.
  const lead = sets[0] ?? {};

  return (
    <div className="rounded-control border border-line">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Collapse sets" : "Expand sets"}
          aria-expanded={expanded}
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center text-fg-subtle"
        >
          <ChevronRight className={cn("size-4 transition-transform", expanded && "rotate-90")} />
        </button>

        {exercise.imageUrl ? (
          <Image
            src={exercise.imageUrl}
            alt=""
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-control object-cover"
          />
        ) : (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-sunken">
            <Dumbbell className="size-4 text-fg-subtle" />
          </span>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-body-sm font-medium">{exercise.name ?? "Exercise"}</span>
          {!expanded ? (
            <input
              value={exercise.note ?? ""}
              onChange={(e) => onChange({ ...exercise, note: e.target.value || null })}
              placeholder="Add note"
              aria-label={`Note for ${exercise.name ?? "exercise"}`}
              className="w-full bg-transparent text-caption text-fg-subtle outline-none placeholder:text-fg-subtle focus:text-fg"
            />
          ) : null}
        </div>

        {!expanded ? (
          <div className="flex shrink-0 items-center gap-4">
            <SummaryField label="sets" value={String(sets.length)} />
            {fields.includes("rep_range") ? (
              <SummaryField
                label="rep range"
                value={
                  lead.reps != null || lead.repsMax != null
                    ? `${lead.reps ?? "—"} - ${lead.repsMax ?? "—"}`
                    : "—"
                }
              />
            ) : fields.includes("reps") ? (
              <SummaryField label="reps" value={lead.reps != null ? String(lead.reps) : "—"} />
            ) : null}
            {fields.includes("weight") ? (
              <SummaryField
                label="weight"
                value={lead.weightKg != null ? String(lead.weightKg) : "—"}
              />
            ) : null}
            {fields.includes("rest") ? (
              <SummaryField
                label="rest"
                value={lead.restSeconds != null ? String(lead.restSeconds) : "—"}
              />
            ) : null}
          </div>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`More actions for ${exercise.name ?? "exercise"}`}
              className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-control text-fg-subtle transition-colors hover:bg-hover"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onSaveForReuse ? (
              <DropdownMenuItem onSelect={onSaveForReuse}>
                <Copy className="size-4" />
                Save section for reuse
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem variant="destructive" onSelect={onRemove}>
              <Trash className="size-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {expanded ? (
        <div className="grid grid-cols-1 gap-3 border-line border-t px-3 py-2.5 sm:grid-cols-[2fr_3fr]">
          <textarea
            value={exercise.note ?? ""}
            onChange={(e) => onChange({ ...exercise, note: e.target.value || null })}
            placeholder="Add a note for this exercise"
            aria-label={`Note for ${exercise.name ?? "exercise"}`}
            rows={4}
            className="w-full resize-none rounded-control border border-line bg-transparent px-2.5 py-2 text-body-sm outline-none placeholder:text-fg-subtle focus:border-fg-subtle"
          />

          <div className="flex flex-col gap-1.5">
            {sets.map((set, i) => (
              <SetRow
                key={set.id ?? i}
                set={set}
                index={i}
                fields={fields}
                onChange={(next) => setSets(sets.map((x, xi) => (xi === i ? next : x)))}
                onDuplicate={() =>
                  setSets([
                    ...sets.slice(0, i + 1),
                    { ...set, id: undefined },
                    ...sets.slice(i + 1),
                  ])
                }
                onRemove={() => setSets(sets.length > 1 ? sets.filter((_, xi) => xi !== i) : sets)}
                canRemove={sets.length > 1}
              />
            ))}
            <button
              type="button"
              onClick={() => setSets([...sets, { ...(sets.at(-1) ?? {}), id: undefined }])}
              className="flex w-fit cursor-pointer items-center gap-1 rounded-control px-2 py-1.5 text-caption text-fg-muted transition-colors hover:bg-hover"
            >
              <Plus className="size-3.5" />
              Add set
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex w-16 flex-col items-center">
      <span className="text-[0.6875rem] text-fg-subtle">{label}</span>
      <span className="text-body-sm tabular-nums">{value}</span>
    </span>
  );
}

function SetRow({
  set,
  index,
  fields,
  onChange,
  onDuplicate,
  onRemove,
  canRemove,
}: {
  set: PrescribedSet;
  index: number;
  fields: FieldName[];
  onChange: (next: PrescribedSet) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-control bg-sunken/60 px-2 py-1.5">
      <span className="w-5 shrink-0 text-center text-caption text-fg-subtle tabular-nums">
        {index + 1}
      </span>

      {fields.includes("rep_range") ? (
        <>
          <Field label="min" value={set.reps} onChange={(v) => onChange({ ...set, reps: v })} />
          <Field
            label="max"
            value={set.repsMax}
            onChange={(v) => onChange({ ...set, repsMax: v })}
          />
        </>
      ) : fields.includes("reps") ? (
        <Field label="reps" value={set.reps} onChange={(v) => onChange({ ...set, reps: v })} />
      ) : null}

      {fields.includes("weight") ? (
        <Field
          label="kg"
          value={set.weightKg}
          onChange={(v) => onChange({ ...set, weightKg: v })}
        />
      ) : null}
      {fields.includes("duration") ? (
        <Field label="sec" value={set.seconds} onChange={(v) => onChange({ ...set, seconds: v })} />
      ) : null}
      {fields.includes("distance") ? (
        <Field
          label="m"
          value={set.distanceM}
          onChange={(v) => onChange({ ...set, distanceM: v })}
        />
      ) : null}
      {fields.includes("calories") ? (
        <Field
          label="cal"
          value={set.calories}
          onChange={(v) => onChange({ ...set, calories: v })}
        />
      ) : null}
      {fields.includes("rest") ? (
        <Field
          label="rest"
          value={set.restSeconds}
          onChange={(v) => onChange({ ...set, restSeconds: v })}
        />
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`More actions for set ${index + 1}`}
            className="ml-auto flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-control text-fg-subtle transition-colors hover:bg-hover"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onDuplicate}>
            <Copy className="size-3.5" />
            Duplicate set
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" disabled={!canRemove} onSelect={onRemove}>
            <Trash className="size-3.5" />
            Delete set
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null | undefined;
  onChange: (v: number | null) => void;
}) {
  return (
    <span className="flex w-16 flex-col gap-0.5">
      <span className="text-[0.6875rem] text-fg-subtle">{label}</span>
      <Input
        inputMode="decimal"
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          if (v.trim() === "") onChange(null);
          else {
            const n = Number(v);
            if (Number.isFinite(n)) onChange(n);
          }
        }}
        placeholder="—"
        className="h-8 tabular-nums"
      />
    </span>
  );
}
