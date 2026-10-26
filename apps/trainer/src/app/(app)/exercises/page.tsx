"use client";

import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Page } from "@traiv/ui/components/shell/page";
import { SidebarToggle } from "@traiv/ui/components/shell/page-header";
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
import { useMemo, useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import type { Exercise } from "@/lib/api";
import { useExercises } from "@/lib/query";
import { ExercisePanel } from "./_components/exercise-panel";
import { FilterPill } from "./_components/filter-pill";

const PAGE_SIZE = 25;

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

  const exercises = useExercises(studioId, { q: q || undefined, muscle, equipment, category });
  const rows = exercises.data ?? [];

  const muscles = useMemo(
    () => [...new Set(rows.map((e) => e.muscle))].sort((a, b) => a.localeCompare(b)),
    [rows],
  );
  const equipments = useMemo(
    () => [...new Set(rows.map((e) => e.equipment))].sort((a, b) => a.localeCompare(b)),
    [rows],
  );
  const categories = useMemo(
    () => [...new Set(rows.map((e) => e.category).filter((c): c is string => Boolean(c)))].sort(),
    [rows],
  );

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const shown = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Page className="max-w-none gap-5">
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
          onChange={(v) => {
            setMuscle(v);
            setPage(1);
          }}
        />
        <FilterPill
          label="Equipment"
          value={equipment}
          options={equipments}
          format={(v) => v.replace(/_/gu, " ")}
          onChange={(v) => {
            setEquipment(v);
            setPage(1);
          }}
        />
        <FilterPill
          label="Type"
          value={category}
          options={categories}
          onChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
        />
      </div>

      {exercises.isPending ? (
        <Loading />
      ) : rows.length === 0 ? (
        <p className="rounded-surface border border-line border-dashed bg-surface p-8 text-center text-body-sm text-fg-muted">
          Nothing matches those filters.
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
          Viewing {shown.length} of {rows.length}
        </span>
        {pageCount > 1 ? (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="tabular-nums">
              {page} / {pageCount}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={page === pageCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>

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
            // eslint-disable-next-line @next/next/no-img-element
            <img src={e.imageUrl} alt="" className="size-9 shrink-0 rounded-control object-cover" />
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
