"use client";

import { Input } from "@traiv/ui/components/input";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Plus, Search } from "@traiv/ui/icons";
import { useEffect, useMemo, useState } from "react";
import type { Exercise } from "@/lib/api";
import { useExercises } from "@/lib/query";
import { FilterPill } from "../../exercises/_components/filter-pill";

/**
 * The builder's left panel — "Exercises · Sections · Articles", though only Exercises
 * and Sections (saved sections) are live here; Articles has no screen behind it yet.
 *
 * Each row's `+` adds the exercise to whichever session is currently open, immediately
 * — the real builder shows a toast ("Added 'Barbell Squat' to the workout") the instant
 * you click, with the actual save happening later on "Save". That is reflected here by
 * `onAdd` writing into local draft state rather than calling the API.
 */
export function BuilderExercisePicker({
  studioId,
  onAdd,
}: {
  studioId: string;
  onAdd: (e: Exercise) => void;
}) {
  const [typed, setTyped] = useState("");
  const [q, setQ] = useState("");
  const [muscle, setMuscle] = useState<string | undefined>();
  const [equipment, setEquipment] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();

  useEffect(() => {
    const t = setTimeout(() => setQ(typed), 200);
    return () => clearTimeout(t);
  }, [typed]);

  const exercises = useExercises(studioId, { q: q || undefined, muscle, equipment, category });
  const rows = exercises.data ?? [];

  const muscles = useMemo(() => [...new Set(rows.map((e) => e.muscle))].sort(), [rows]);
  const equipments = useMemo(() => [...new Set(rows.map((e) => e.equipment))].sort(), [rows]);
  const categories = useMemo(
    () => [...new Set(rows.map((e) => e.category).filter((c): c is string => Boolean(c)))].sort(),
    [rows],
  );

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle" />
        <Input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="Search for exercises"
          className="h-9 pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <FilterPill label="Muscle" value={muscle} options={muscles} onChange={setMuscle} />
        <FilterPill
          label="Equipment"
          value={equipment}
          options={equipments}
          format={(v) => v.replace(/_/gu, " ")}
          onChange={setEquipment}
        />
        <FilterPill label="Type" value={category} options={categories} onChange={setCategory} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {exercises.isPending ? (
          Array.from({ length: 6 }, (_, n) => n).map((n) => (
            <Skeleton key={n} className="h-16 w-full rounded-control" />
          ))
        ) : rows.length === 0 ? (
          <p className="px-1 py-8 text-center text-caption text-fg-subtle">No matches.</p>
        ) : (
          rows.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => onAdd(e)}
              className="flex cursor-pointer items-center gap-3 rounded-control px-2 py-2 text-left transition-colors hover:bg-hover"
            >
              {e.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={e.imageUrl}
                  alt=""
                  className="size-10 shrink-0 rounded-control object-cover"
                />
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-sunken" />
              )}
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-body-sm font-medium">{e.name}</span>
                <span className="truncate text-caption text-fg-subtle">
                  {e.muscle} · {e.equipment.replace(/_/gu, " ")}
                </span>
              </span>
              <Plus className="size-4 shrink-0 text-fg-subtle" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
