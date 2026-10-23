"use client";

import { Badge } from "@traiv/ui/components/badge";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Popover, PopoverContent, PopoverTrigger } from "@traiv/ui/components/popover";
import { cn } from "@traiv/ui/lib/cn";
import { Check, Loader2, Plus, Tag as TagIcon, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Tag } from "@/lib/api";
import { useDeleteTag, useSetClientTags } from "@/lib/query";
import { CreateTagDialog } from "./create-tag-dialog";

/**
 * The tags on one client, and the picker that changes them.
 *
 * The write is the whole set rather than add and remove calls, so a double-tap and a
 * slow network cannot leave the client with a tag they unticked.
 *
 * Two things the row has to say out loud. While a tag is saving it carries a spinner on
 * the row that was pressed, not somewhere else — the coach pressed that line and that
 * line is what is working. And the picker closes once the tag has landed: tagging one
 * client with one tag is the common case, and a popover still sitting open afterwards
 * reads as a press that did nothing.
 */
export function TagPicker({
  studioId,
  client,
  tags,
}: {
  studioId: string | null;
  /** Only the three fields the picker needs, so the client header can pass a profile. */
  client: { id: string; name: string; tags: Tag[] };
  tags: Tag[];
}) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const setTags = useSetClientTags(studioId);
  const removeTag = useDeleteTag(studioId);

  const chosen = useMemo(() => new Set(client.tags.map((t) => t.id)), [client.tags]);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? tags.filter((t) => t.name.toLowerCase().includes(q)) : tags;
  }, [tags, query]);

  // Typing a name nobody has is the fastest route to creating it, so the button says so.
  const exact = tags.some((t) => t.name.toLowerCase() === query.trim().toLowerCase());

  function toggle(tagId: string) {
    const next = new Set(chosen);
    next.has(tagId) ? next.delete(tagId) : next.add(tagId);
    setSaving(tagId);
    setTags.mutate(
      { clientId: client.id, tagIds: [...next] },
      {
        onSuccess: () => setOpen(false),
        onSettled: () => setSaving(null),
      },
    );
  }

  return (
    <>
      <Popover
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          // Leaving a half-finished "delete this?" behind would greet the coach with it
          // the next time they open the picker, on a row they have forgotten pressing.
          if (!v) setConfirmDelete(null);
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Tags for ${client.name}`}
            className="-mx-2 flex max-w-[14rem] cursor-pointer flex-wrap items-center gap-1 rounded-control px-2 py-1 text-left transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
          >
            {client.tags.length ? (
              client.tags.map((t) => <TagChip key={t.id} tag={t} />)
            ) : (
              <span className="text-body-sm text-fg-subtle">No tags</span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-72 p-0">
          <div className="p-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or create tag"
              aria-label="Search tags"
            />
          </div>

          <div className="max-h-60 overflow-y-auto px-2 pb-2">
            {matches.length === 0 ? (
              <p className="px-2 py-6 text-center text-body-sm text-fg-muted">
                {tags.length === 0 ? "No tags yet." : "Nothing matches that."}
              </p>
            ) : (
              matches.map((tag) =>
                confirmDelete === tag.id ? (
                  <DeleteRow
                    key={tag.id}
                    tag={tag}
                    pending={removeTag.isPending}
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={() =>
                      removeTag.mutate(tag.id, { onSettled: () => setConfirmDelete(null) })
                    }
                  />
                ) : (
                  <TagRow
                    key={tag.id}
                    tag={tag}
                    on={chosen.has(tag.id)}
                    saving={saving === tag.id}
                    disabled={setTags.isPending}
                    onToggle={() => toggle(tag.id)}
                    onDelete={() => setConfirmDelete(tag.id)}
                  />
                ),
              )
            )}
          </div>

          <div className="border-line border-t p-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                setOpen(false);
                setCreating(true);
              }}
            >
              <Plus className="size-4" />
              {query.trim() && !exact ? `Create "${query.trim()}"` : "Add new tag"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <CreateTagDialog
        studioId={studioId}
        open={creating}
        onOpenChange={setCreating}
        initialName={exact ? "" : query.trim()}
        onCreated={(tag) => {
          setQuery("");
          setTags.mutate({ clientId: client.id, tagIds: [...chosen, tag.id] });
        }}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function TagRow({
  tag,
  on,
  saving,
  disabled,
  onToggle,
  onDelete,
}: {
  tag: Tag;
  on: boolean;
  saving: boolean;
  disabled: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex items-center rounded-control pr-1 transition-colors hover:bg-hover has-focus-visible:bg-hover">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={on}
        // Taller on a finger than on a pointer. The question is what is doing the
        // pressing, not how wide the screen is — a tablet with a mouse wants the
        // compact row and a small phone does not.
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-control px-2 py-2 text-left text-body-sm outline-none disabled:cursor-default disabled:opacity-60 pointer-coarse:py-3"
      >
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: tag.color }}
        />
        <span className="min-w-0 flex-1 truncate">{tag.name}</span>
        {saving ? (
          <Loader2 className="size-4 shrink-0 animate-spin text-fg-muted" />
        ) : on ? (
          <Check className="size-4 shrink-0 text-fg-muted" />
        ) : null}
      </button>

      {/* Always on screen rather than revealed on hover: a control nobody can see is a
          control nobody finds, and on a touch screen there is no hover to reveal it
          with. Quiet enough that a column of them does not read as a column of things
          to press, and it only turns red once the pointer is on it. */}
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete the ${tag.name} tag`}
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-control text-fg-subtle/60 transition-colors hover:bg-sunken hover:text-danger focus-visible:outline-2 focus-visible:outline-line-focus pointer-coarse:size-11"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

/** Deleting a tag takes it off every client who had it, so it says that before it does. */
function DeleteRow({
  tag,
  pending,
  onCancel,
  onConfirm,
}: {
  tag: Tag;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-control bg-sunken px-2 py-1.5">
      <span className="min-w-0 flex-1 truncate text-caption text-fg-muted">
        Delete for everyone?
      </span>
      <Button variant="ghost" size="sm" onClick={onCancel}>
        Keep
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={onConfirm}
        aria-label={`Delete the ${tag.name} tag for every client`}
      >
        {pending ? "Deleting…" : "Delete"}
      </Button>
    </div>
  );
}

export function TagChip({ tag, className }: { tag: Tag; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-normal", className)}
      // The coach picked the colour, so it cannot come from a token. Kept to a dot and a
      // tint: a fully coloured chip at eight tags turns the row into a fruit salad, and
      // a bold arbitrary hue behind text is the fastest way to fail contrast.
      style={{ borderColor: `${tag.color}66`, backgroundColor: `${tag.color}14` }}
    >
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: tag.color }}
      />
      {tag.name}
    </Badge>
  );
}

export { TagIcon };
