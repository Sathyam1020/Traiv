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
import { Input } from "@traiv/ui/components/input";
import { Page } from "@traiv/ui/components/shell/page";
import { StickyPageHeader } from "@traiv/ui/components/shell/sticky-page-header";
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
import {
  Copy,
  Dumbbell,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Plus,
  Search,
  Trash,
} from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import type { TemplateSummary } from "@/lib/api";
import { isApiError } from "@/lib/api";
import { useCreateTemplate, useTemplateActions, useTemplates } from "@/lib/query";
import { CreateTemplatePanel } from "./_components/create-template-panel";

/**
 * Templates — the coach's library.
 *
 * A plain table: Name · Sessions · Created · Status, matching the real screen exactly
 * rather than the card grid an earlier pass invented. Row click opens the builder;
 * "New Template" opens "Create Template" and navigates in once it exists.
 */
export default function TemplatesPage() {
  const studioId = useActiveStudioId();
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const templates = useTemplates(studioId);
  const create = useCreateTemplate(studioId ?? "");
  const router = useRouter();

  const rows = useMemo(() => {
    const all = templates.data ?? [];
    const term = q.trim().toLowerCase();
    return term ? all.filter((t) => t.name.toLowerCase().includes(term)) : all;
  }, [templates.data, q]);

  async function create_(input: Parameters<typeof create.mutateAsync>[0]) {
    setError(null);
    try {
      const t = await create.mutateAsync(input);
      setCreating(false);
      router.push(`/templates/${t.id}`);
    } catch (e) {
      setError(isApiError(e) ? e.message : "Couldn't create that. Try again.");
    }
  }

  return (
    <Page className="max-w-none gap-5">
      <StickyPageHeader>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SidebarToggle />
            <h1 className="text-display font-medium">Templates</h1>
          </div>
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            New Template
          </Button>
        </header>

        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search workouts"
            className="h-10 pl-9"
          />
        </div>
      </StickyPageHeader>
      {templates.isPending ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Empty filtered={q.length > 0} onCreate={() => setCreating(true)} />
      ) : (
        <div className="overflow-x-auto rounded-surface border border-line bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3">Name</TableHead>
                <TableHead className="px-4 py-3">Sessions</TableHead>
                <TableHead className="px-4 py-3">Created</TableHead>
                <TableHead className="px-4 py-3">Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <Row key={t.id} studioId={studioId ?? ""} template={t} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {error ? <p className="text-caption text-danger">{error}</p> : null}

      <CreateTemplatePanel
        open={creating}
        onOpenChange={setCreating}
        onCreate={(input) => void create_(input)}
        creating={create.isPending}
      />
    </Page>
  );
}

function Row({ studioId, template: t }: { studioId: string; template: TemplateSummary }) {
  const router = useRouter();
  const actions = useTemplateActions(studioId, t.id);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <TableRow className="cursor-pointer">
      <TableCell className="p-0">
        <Link href={`/templates/${t.id}`} className="flex items-center gap-3 px-4 py-3">
          {t.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.imageUrl} alt="" className="size-9 shrink-0 rounded-control object-cover" />
          ) : (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-sunken text-caption font-semibold text-fg-muted">
              {t.name.slice(0, 2)}
            </span>
          )}
          <span className="font-medium text-body-sm">{t.name}</span>
        </Link>
      </TableCell>
      <TableCell className="px-4 py-3 text-body-sm text-fg-muted">
        {t.sessions} session{t.sessions === 1 ? "" : "s"}
      </TableCell>
      <TableCell className="px-4 py-3 text-body-sm text-fg-muted">
        {new Date(t.createdAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="px-4 py-3">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-caption font-medium",
            t.status === "active"
              ? "bg-success-subtle text-success"
              : "bg-warning-subtle text-warning",
          )}
        >
          {t.status === "active" ? "Live" : "Draft"}
        </span>
      </TableCell>
      <TableCell className="p-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              aria-label={`More actions for ${t.name}`}
              className="flex size-8 cursor-pointer items-center justify-center rounded-control text-fg-subtle transition-colors hover:bg-hover"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => router.push(`/templates/${t.id}`)}>
              <Pencil className="size-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => actions.setStatus.mutate(t.status === "active" ? "draft" : "active")}
            >
              {t.status === "active" ? (
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
            <DropdownMenuItem
              onSelect={() =>
                actions.duplicate.mutate(undefined, {
                  onSuccess: (c) => router.push(`/templates/${c.id}`),
                })
              }
            >
              <Copy className="size-3.5" />
              Clone
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => setConfirmingDelete(true)}>
              <Trash className="size-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DeleteConfirm
          open={confirmingDelete}
          onOpenChange={setConfirmingDelete}
          name={t.name}
          onConfirm={() => actions.archive.mutate()}
          deleting={actions.archive.isPending}
        />
      </TableCell>
    </TableRow>
  );
}

function DeleteConfirm({
  open,
  onOpenChange,
  name,
  onConfirm,
  deleting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete "{name}"?</DialogTitle>
          <DialogDescription>
            This removes it from your library. Clients already assigned a copy keep theirs —
            deleting the template does not touch what they have.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Empty({ filtered, onCreate }: { filtered: boolean; onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-surface border border-line border-dashed bg-surface py-16 text-center">
      <Dumbbell className="size-8 text-fg-subtle" />
      <h2 className="text-subheading font-medium">
        {filtered ? "Nothing matches" : "No templates yet"}
      </h2>
      <p className="max-w-[40ch] text-body-sm text-fg-muted">
        {filtered
          ? "Try a different search."
          : "Build a workout once and give it to as many clients as you like."}
      </p>
      {filtered ? null : (
        <Button variant="secondary" onClick={onCreate}>
          <Plus className="size-4" />
          New Template
        </Button>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }, (_, n) => n).map((n) => (
        <Skeleton key={n} className="h-14 w-full rounded-control" />
      ))}
    </div>
  );
}
