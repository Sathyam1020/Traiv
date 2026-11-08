"use client";

import { filterLabel } from "@traiv/exercises";

import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Page } from "@traiv/ui/components/shell/page";
import { SidebarToggle } from "@traiv/ui/components/shell/page-header";
import { StickyPageHeader } from "@traiv/ui/components/shell/sticky-page-header";
import { Skeleton } from "@traiv/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@traiv/ui/components/table";
import { Dumbbell, Image, Plus, Search, Video } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import type { Exercise } from "@/lib/api";
import { useExercises } from "@/lib/query";
import { ExercisePanel } from "./_components/exercise-panel";
import { FilterPill } from "./_components/filter-pill";

const PAGE_SIZE = 20;

/**
 * Exercises — the shared library plus the studio's own.
 *
 * A table with Name · Content · Muscle groups · Equipment · Library, matching the real
 * trainer app exactly, including the Content column's two icons (image / video present)
 * and the Library badge ("System" for the shared library, otherwise the studio's own).
 */
export default function ExercisesPage() {
  const studioId = useActiveStudioId();
  const [q, setQ] = useState("");
  const [muscle, setMuscle] = useState<string | undefined>();
  const [equipment, setEquipment] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [panel, setPanel] = useState<{ open: boolean; exerciseId: string | null }>({
    open: false,
    exerciseId: null,
  });

  useEffect(() => {
    const exerciseId = new URLSearchParams(window.location.search).get("exercise");
    if (exerciseId && exerciseId.length <= 256) setPanel({ open: true, exerciseId });
  }, []);

  const exercises = useExercises(studioId, { q: q || undefined, muscle, equipment, category });
  const rows = exercises.data ?? [];

  const { muscles, equipments, categories } = exercises.filterOptions;
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visiblePage = Math.min(page, pageCount);
  const shown = rows.slice((visiblePage - 1) * PAGE_SIZE, visiblePage * PAGE_SIZE);
  const filterKey = useRef(exercises.filterKey);
  filterKey.current = exercises.filterKey;
  useEffect(() => {
    if (!exercises.isPending) setPage((value) => Math.min(value, pageCount));
  }, [pageCount, exercises.isPending]);

  return (
    <Page className="max-w-none gap-5">
      <StickyPageHeader>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SidebarToggle />
            <h1 className="text-display font-medium">Exercises</h1>
          </div>
          <Button onClick={() => setPanel({ open: true, exerciseId: null })}>
            <Plus className="size-4" />
            New Exercise
          </Button>
        </header>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[16rem] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle" />
            <Input
              value={q}
              maxLength={200}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search exercises..."
              className="h-10 pl-9"
            />
          </div>
          <FilterPill
            label="Muscle Group"
            value={muscle}
            options={muscles}
            format={filterLabel}
            disabled={!exercises.filtersReady}
            onChange={(v) => {
              setMuscle(v);
              setPage(1);
            }}
          />
          <FilterPill
            label="Equipment"
            value={equipment}
            options={equipments}
            format={filterLabel}
            disabled={!exercises.filtersReady}
            onChange={(v) => {
              setEquipment(v);
              setPage(1);
            }}
          />
          <FilterPill
            label="Type"
            value={category}
            options={categories}
            format={filterLabel}
            disabled={!exercises.filtersReady}
            onChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
          />
          {(q.trim() || muscle || equipment || category) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQ("");
                setMuscle(undefined);
                setEquipment(undefined);
                setCategory(undefined);
                setPage(1);
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
            <button
              type="button"
              className="underline"
              onClick={() => void exercises.retryFilters()}
            >
              Retry
            </button>
          </p>
        )}
      </StickyPageHeader>
      {exercises.providerError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-surface border border-line bg-surface p-4 text-sm"
        >
          <p>{exercises.providerError}</p>
          <Button variant="outline" onClick={() => void exercises.refetch()}>
            Retry
          </Button>
        </div>
      )}
      {exercises.isError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-surface border border-line bg-surface p-4 text-sm"
        >
          <p>
            {exercises.error instanceof Error
              ? exercises.error.message
              : "Couldn't load exercises."}
          </p>
          <Button variant="outline" onClick={() => void exercises.refetch()}>
            Retry
          </Button>
        </div>
      )}
      {exercises.isPending ? (
        <Loading />
      ) : rows.length === 0 && !exercises.isError ? (
        <p className="rounded-surface border border-line border-dashed bg-surface p-8 text-center text-body-sm text-fg-muted">
          {exercises.hasNextPage
            ? "No matches loaded yet. Select Next to continue."
            : "Nothing matches those filters."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-surface border border-line bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Muscle groups</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Library</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((e) => (
                <Row
                  key={e.id}
                  exercise={e}
                  onOpen={() => setPanel({ open: true, exerciseId: e.id })}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between text-caption text-fg-subtle">
        <span>
          {exercises.isPending
            ? "Searching…"
            : rows.length
              ? `Showing ${(visiblePage - 1) * PAGE_SIZE + 1}–${(visiblePage - 1) * PAGE_SIZE + shown.length} · ${rows.length} loaded`
              : "0 results"}
        </span>
        {pageCount > 1 || exercises.hasNextPage ? (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={visiblePage === 1 || exercises.isSearching}
              onClick={() => setPage(visiblePage - 1)}
            >
              Previous
            </Button>
            <span className="tabular-nums">
              Page {visiblePage}
              {exercises.hasNextPage ? "" : ` / ${pageCount}`}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={
                exercises.isSearching || (visiblePage >= pageCount && !exercises.hasNextPage)
              }
              onClick={async () => {
                const requestedKey = exercises.filterKey;
                const target = visiblePage + 1;
                if (target * PAGE_SIZE > rows.length && exercises.hasNextPage) {
                  const result = await exercises.fetchNextPage();
                  if (result.isError || filterKey.current !== requestedKey) return;
                  setPage(
                    Math.min(target, Math.max(1, Math.ceil(result.visibleCount / PAGE_SIZE))),
                  );
                } else if (target <= pageCount) setPage(target);
              }}
            >
              {exercises.isFetchingNextPage ? "Loading…" : "Next"}
            </Button>
          </div>
        ) : null}
      </div>

      {exercises.limitReached && (
        <p role="status" className="text-xs text-fg-muted">
          Catalog browsing is limited to 500 results per search. Refine your search or filters to
          find other exercises.
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
      <ExercisePanel
        studioId={studioId ?? ""}
        open={panel.open}
        exerciseId={panel.exerciseId}
        onOpenChange={(open) => setPanel((p) => ({ ...p, open }))}
      />
    </Page>
  );
}

function Row({ exercise: e, onOpen }: { exercise: Exercise; onOpen: () => void }) {
  return (
    <TableRow className="cursor-pointer" onClick={onOpen}>
      <TableCell>
        <span className="flex items-center gap-3">
          {e.imageUrl ? (
            <NextImage
              src={e.imageUrl}
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
          <span className="font-medium text-body-sm">{e.name}</span>
        </span>
      </TableCell>
      <TableCell>
        <span className="flex items-center gap-1.5 text-fg-subtle">
          <Image
            aria-label={e.imageUrl ? "Has an image" : "No image"}
            className={cn("size-4", !e.imageUrl && "opacity-30")}
          />
          <Video
            aria-label={e.videoUrl ? "Has a video" : "No video"}
            className={cn("size-4", !e.videoUrl && "opacity-30")}
          />
        </span>
      </TableCell>
      <TableCell className="text-body-sm text-fg-muted">{e.muscle}</TableCell>
      <TableCell className="text-body-sm text-fg-muted">
        {e.equipment.replace(/_/gu, " ")}
      </TableCell>
      <TableCell>
        <span className="rounded-full bg-sunken px-2 py-0.5 text-caption text-fg-muted">
          {e.shared ? "System" : "Studio"}
        </span>
      </TableCell>
    </TableRow>
  );
}

function Loading() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 8 }, (_, n) => n).map((n) => (
        <Skeleton key={n} className="h-12 w-full rounded-control" />
      ))}
    </div>
  );
}
