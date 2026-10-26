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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@traiv/ui/components/dropdown-menu";
import { Skeleton } from "@traiv/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@traiv/ui/components/table";
import { Copy, Dumbbell, MoreHorizontal, Pause, Pencil, Play, Plus, Trash } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ClientProgramSummary } from "@/lib/api";
import { isApiError } from "@/lib/api";
import {
  useClientPrograms,
  useCreateClientProgram,
  useSaveAsTemplate,
  useTemplateActions,
} from "@/lib/query";
import { CreateTemplatePanel } from "../../../templates/_components/create-template-panel";
import { DuplicateFromTemplatePanel } from "./duplicate-from-template";

/**
 * A client's Workouts tab — the real screen: Name · Sessions · Muscle groups ·
 * Assigned · Status · Source, with "Create new program" and "Duplicate from template"
 * as the two ways in.
 *
 * Row click opens the same builder a studio template uses. A client's programme *is* a
 * `workout_template` row (ADR 0024) — the builder has no idea whether `clientId` is set,
 * and does not need to.
 */
export function ClientWorkouts({
  studioId,
  clientId,
}: {
  studioId: string | null;
  clientId: string;
}) {
  const programs = useClientPrograms(studioId, clientId);
  const create = useCreateClientProgram(studioId ?? "", clientId);
  const router = useRouter();

  const [creating, setCreating] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createNew(input: Parameters<typeof create.mutateAsync>[0]) {
    setError(null);
    try {
      const t = await create.mutateAsync(input);
      setCreating(false);
      router.push(`/templates/${t.id}`);
    } catch (e) {
      setError(isApiError(e) ? e.message : "Couldn't create that. Try again.");
    }
  }

  const rows = programs.data ?? [];

  return (
    <div className="flex flex-col gap-4 px-4 py-5 sm:px-6">
      {rows.length > 0 ? (
        <div className="flex items-center justify-end">
          <AddMenu onCreate={() => setCreating(true)} onDuplicate={() => setDuplicating(true)} />
        </div>
      ) : null}

      {programs.isPending ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Empty onCreate={() => setCreating(true)} onDuplicate={() => setDuplicating(true)} />
      ) : (
        <div className="overflow-x-auto rounded-surface border border-line bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3">Name</TableHead>
                <TableHead className="px-4 py-3">Sessions</TableHead>
                <TableHead className="px-4 py-3">Muscle groups</TableHead>
                <TableHead className="px-4 py-3">Assigned</TableHead>
                <TableHead className="px-4 py-3">Status</TableHead>
                <TableHead className="px-4 py-3">Source</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <Row key={p.id} studioId={studioId ?? ""} clientId={clientId} program={p} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {error ? <p className="text-caption text-danger">{error}</p> : null}

      <CreateTemplatePanel
        open={creating}
        onOpenChange={setCreating}
        onCreate={(input) => void createNew(input)}
        creating={create.isPending}
      />
      <DuplicateFromTemplatePanel
        studioId={studioId ?? ""}
        clientId={clientId}
        open={duplicating}
        onOpenChange={setDuplicating}
        onDuplicated={() => {
          // Matches Coachway: duplicating returns to the client's own Workouts tab —
          // the new program shows up in the list (the mutation already invalidates it)
          // rather than dropping the coach into its builder immediately.
          router.push(`/clients/${clientId}?tab=workouts`);
        }}
      />
    </div>
  );
}

function AddMenu({ onCreate, onDuplicate }: { onCreate: () => void; onDuplicate: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add Workout Program
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onCreate}>Create new program</DropdownMenuItem>
        <DropdownMenuItem onSelect={onDuplicate}>Duplicate from template</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Row({
  studioId,
  clientId,
  program: p,
}: {
  studioId: string;
  clientId: string;
  program: ClientProgramSummary;
}) {
  const router = useRouter();
  const actions = useTemplateActions(studioId, p.id);
  const saveAsTemplate = useSaveAsTemplate(studioId);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  return (
    <TableRow className="cursor-pointer" onClick={() => router.push(`/templates/${p.id}`)}>
      <TableCell className="p-0">
        <Link
          href={`/templates/${p.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-3 px-4 py-3"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-sunken text-caption font-semibold text-fg-muted">
            {p.name.slice(0, 2)}
          </span>
          <span className="font-medium text-body-sm">{p.name}</span>
        </Link>
      </TableCell>
      <TableCell className="px-4 py-3 text-body-sm text-fg-muted">
        {p.sessions} session{p.sessions === 1 ? "" : "s"}
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {p.muscleGroups.slice(0, 3).map((m) => (
            <span key={m} className="rounded-full bg-sunken px-2 py-0.5 text-caption text-fg-muted">
              {m}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-body-sm text-fg-muted">
        {new Date(p.createdAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="px-4 py-3">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-caption font-medium",
            p.status === "active"
              ? "bg-success-subtle text-success"
              : "bg-warning-subtle text-warning",
          )}
        >
          {p.status === "active" ? "Live" : "Draft"}
        </span>
      </TableCell>
      <TableCell className="px-4 py-3">
        <span className="rounded-full bg-sunken px-2.5 py-1 text-caption text-fg-muted">
          {p.source === "coach" ? "By coach" : "By client"}
        </span>
      </TableCell>
      {/* Radix renders the menu and these dialogs through a portal, but React still
          replays their click events up the *component* tree — straight through this
          cell to the row's onClick — so every interaction in here has to be stopped at
          the cell, not just on the dropdown's own trigger button. */}
      <TableCell className="p-0" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`More actions for ${p.name}`}
              className="flex size-8 cursor-pointer items-center justify-center rounded-control text-fg-subtle transition-colors hover:bg-hover"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => router.push(`/templates/${p.id}`)}>
              <Pencil className="size-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                saveAsTemplate.mutate(
                  { clientId, templateId: p.id },
                  { onSuccess: () => setSavedToast(true) },
                )
              }
            >
              <Copy className="size-3.5" />
              Save as template
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => actions.setStatus.mutate(p.status === "active" ? "draft" : "active")}
            >
              {p.status === "active" ? (
                <>
                  <Pause className="size-3.5" />
                  Set as Draft
                </>
              ) : (
                <>
                  <Play className="size-3.5" />
                  Set as Live
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => setConfirmingDelete(true)}>
              <Trash className="size-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete "{p.name}"?</DialogTitle>
              <DialogDescription>
                This removes the programme from this client&apos;s Workouts tab.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setConfirmingDelete(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => actions.archive.mutate()}
                disabled={actions.archive.isPending}
              >
                {actions.archive.isPending ? "Deleting…" : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* A plain confirmation dialog rather than a toast system this repo does not
            have yet — "Saved as template" is a fact worth confirming explicitly. */}
        <Dialog open={savedToast} onOpenChange={setSavedToast}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Saved as template</DialogTitle>
              <DialogDescription>
                "{p.name}" is now in your Templates library and can be given to any client.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setSavedToast(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

function Empty({ onCreate, onDuplicate }: { onCreate: () => void; onDuplicate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-surface border border-line border-dashed bg-surface py-16 text-center">
      <Dumbbell className="size-8 text-fg-subtle" />
      <h2 className="text-subheading font-medium">No workout programs yet</h2>
      <p className="max-w-[40ch] text-body-sm text-fg-muted">
        This client does not have a workout program assigned yet.
      </p>
      <div className="flex gap-2">
        <Button onClick={onCreate}>
          <Plus className="size-4" />
          Create new program
        </Button>
        <Button variant="secondary" onClick={onDuplicate}>
          Duplicate from template
        </Button>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }, (_, n) => n).map((n) => (
        <Skeleton key={n} className="h-14 w-full rounded-control" />
      ))}
    </div>
  );
}
