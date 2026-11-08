"use client";

import { filterLabel } from "@traiv/exercises";


import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Plus, Search } from "@traiv/ui/icons";
import Image from "next/image";
import { useState } from "react";
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
  const [muscle, setMuscle] = useState<string | undefined>();
  const [equipment, setEquipment] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();

  const exercises = useExercises(studioId, { q: typed || undefined, muscle, equipment, category });
  const rows = exercises.data ?? [];

  const { muscles, equipments, categories } = exercises.filterOptions;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle" />
        <Input
          value={typed}
          maxLength={200}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="Search for exercises"
          className="h-9 pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <FilterPill
          label="Muscle"
          value={muscle}
          options={muscles}
          format={filterLabel}
          disabled={!exercises.filtersReady}
          onChange={setMuscle}
        />
        <FilterPill
          label="Equipment"
          value={equipment}
          options={equipments}
          format={filterLabel}
          disabled={!exercises.filtersReady}
          onChange={setEquipment}
        />
        <FilterPill
          label="Type"
          value={category}
          options={categories}
          format={filterLabel}
          disabled={!exercises.filtersReady}
          onChange={setCategory}
        />
        {(typed.trim() || muscle || equipment || category) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setTyped("");
              setMuscle(undefined);
              setEquipment(undefined);
              setCategory(undefined);
            }}
          >
            Clear all
          </Button>
        )}
      </div>
      {!exercises.filtersReady && !exercises.filterError && (
        <p role="status" className="text-xs text-fg-muted">
          Loading filter options…
        </p>
      )}
      {exercises.filterError && (
        <p role="alert" className="text-sm text-danger">
          {exercises.filterError}{" "}
          <button type="button" className="underline" onClick={() => void exercises.retryFilters()}>
            Retry
          </button>
        </p>
      )}
      {exercises.studioError && (
        <p role="alert" className="text-sm text-danger">
          {exercises.studioError}{" "}
          <button type="button" className="underline" onClick={() => void exercises.retryStudio()}>
            Retry
          </button>
        </p>
      )}
      {exercises.providerError && (
        <div role="alert" className="text-sm text-danger">
          <p>{exercises.providerError}</p>
          <Button variant="ghost" onClick={() => void exercises.refetch()}>
            Retry
          </Button>
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {exercises.isPending ? (
          Array.from({ length: 6 }, (_, n) => n).map((n) => (
            <Skeleton key={n} className="h-16 w-full rounded-control" />
          ))
        ) : exercises.isError && !rows.length ? (
          <div role="alert" className="p-3 text-sm">
            <p>
              {exercises.error instanceof Error
                ? exercises.error.message
                : "Couldn't load exercises."}
            </p>
            <Button variant="outline" onClick={() => void exercises.refetch()}>
              Retry
            </Button>
          </div>
        ) : rows.length === 0 ? (
          <p className="px-1 py-8 text-center text-caption text-fg-subtle">
            {exercises.hasNextPage
              ? "No matches loaded yet. Load more to continue."
              : "No matches."}
          </p>
        ) : (
          rows.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => onAdd(e)}
              className="flex cursor-pointer items-center gap-3 rounded-control px-2 py-2 text-left transition-colors hover:bg-hover"
            >
              {e.imageUrl ? (
                <Image
                  src={e.imageUrl}
                  alt=""
                  width={40}
                  height={40}
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
        {exercises.hasNextPage && (
          <Button
            type="button"
            variant="ghost"
            disabled={exercises.isSearching}
            onClick={() => void exercises.fetchNextPage()}
          >
            {exercises.isFetchingNextPage ? "Loading…" : "Load more"}
          </Button>
        )}
        {exercises.limitReached && (
          <p role="status" className="px-2 text-xs text-fg-muted">
            Refine your search or filters to find exercises beyond the 500-result browse limit.
          </p>
        )}
        {exercises.isFetchNextPageError && (
          <p role="alert" className="text-sm text-danger">
            Couldn't load more exercises. Try again.
          </p>
        )}
      </div>
    </div>
  );
}
