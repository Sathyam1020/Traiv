"use client";

import { Button } from "@traiv/ui/components/button";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@traiv/ui/components/input";
import { Copy, Download, GripVertical, Plus, Settings, Trash } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import { useEffect, useState } from "react";
import type { WorkoutSession } from "@/lib/api";
import { SessionNamePrompt } from "./session-name-prompt";

/**
 * The session tabs across the top of the builder.
 *
 * Each pill carries a drag handle, the name, and a gear menu — Save section / Edit
 * section / Duplicate section / Delete section — and the row reorders by native HTML5
 * drag and drop. No library: the catalog has none, and `draggable` plus five DOM events
 * is the whole implementation a reorder needs.
 */
export function SessionTabs({
  sessions,
  active,
  onSelect,
  onReorder,
  onCreate,
  onRename,
  onDuplicate,
  onDelete,
  onSaveForReuse,
  savingSection,
}: {
  sessions: WorkoutSession[];
  active: number;
  onSelect: (index: number) => void;
  onReorder: (from: number, to: number) => void;
  onCreate: (name: string) => void;
  onRename: (index: number, name: string) => void;
  onDuplicate: (index: number) => void;
  onDelete: (index: number) => void;
  onSaveForReuse: (index: number) => void;
  savingSection: boolean;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <ul className="flex flex-wrap items-center gap-2 [list-style:none]">
      {sessions.map((s, i) => (
        <SessionPill
          key={s.id ?? i}
          session={s}
          active={i === active}
          dragging={dragIndex === i}
          onSelect={() => onSelect(i)}
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex !== null && dragIndex !== i) onReorder(dragIndex, i);
            setDragIndex(null);
          }}
          onDragEnd={() => setDragIndex(null)}
          onRename={(name) => onRename(i, name)}
          onDuplicate={() => onDuplicate(i)}
          onDelete={() => onDelete(i)}
          onSaveForReuse={() => onSaveForReuse(i)}
          savingSection={savingSection}
        />
      ))}

      <li>
        <SessionNamePrompt
          open={creating}
          onOpenChange={setCreating}
          onSubmit={onCreate}
          trigger={
            <button
              type="button"
              aria-label="Add session"
              className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-fg-muted transition-colors hover:bg-hover"
            >
              <Plus className="size-3.5" />
            </button>
          }
        />
      </li>
    </ul>
  );
}

function SessionPill({
  session,
  active,
  dragging,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onRename,
  onDuplicate,
  onDelete,
  onSaveForReuse,
  savingSection,
}: {
  session: WorkoutSession;
  active: boolean;
  dragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onRename: (name: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSaveForReuse: () => void;
  savingSection: boolean;
}) {
  const [renaming, setRenaming] = useState(false);

  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-full border py-1 pr-1 pl-2 text-caption font-medium transition-colors",
        active
          ? "border-transparent bg-signal text-signal-fg"
          : "border-line bg-surface text-fg-muted hover:bg-hover",
        dragging && "opacity-50",
      )}
    >
      <GripVertical
        aria-hidden="true"
        className="size-3 cursor-grab opacity-70 active:cursor-grabbing"
      />

      <button type="button" onClick={onSelect} className="cursor-pointer px-1 py-0.5">
        {session.name}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`${session.name} settings`}
            className={cn(
              "flex size-5 cursor-pointer items-center justify-center rounded-full transition-colors",
              active ? "hover:bg-signal-fg/20" : "hover:bg-hover",
            )}
          >
            <Settings className="size-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem disabled={!session.id || savingSection} onSelect={onSaveForReuse}>
            <Download className="size-3.5" />
            {session.id ? "Save section" : "Save workout template first"}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setRenaming(true)}>
            <Settings className="size-3.5" />
            Edit section
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onDuplicate}>
            <Copy className="size-3.5" />
            Duplicate section
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={onDelete}>
            <Trash className="size-3.5" />
            Delete section
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameDialog
        open={renaming}
        onOpenChange={setRenaming}
        initial={session.name}
        onSubmit={onRename}
      />
    </li>
  );
}

function RenameDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: string;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(initial);

  useEffect(() => {
    if (open) setName(initial);
  }, [open, initial]);

  function submit() {
    const trimmed = name.trim();
    if (trimmed) onSubmit(trimmed);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit section</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!name.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
