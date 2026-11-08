"use client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Dialog, DialogContent, DialogTitle } from "@traiv/ui/components/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@traiv/ui/components/sheet";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  File,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Music,
  Search,
  Share,
  Video,
  X,
} from "@traiv/ui/icons";
import { fileSize, resourceCategory, type VaultResource } from "@traiv/ui/lib/vault";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { http } from "@/lib/api/client";
import { useActiveStudio } from "@/lib/query";
import { useVault } from "@/lib/query/use-vault";

const categories = ["All", "Documents", "Images", "Videos", "Other"];
const icons = { Document: FileText, Image: ImageIcon, Video, Audio: Music, Link: LinkIcon, File };

/** `useSearchParams` below requires a Suspense boundary for static prerendering. */
export default function ClientVaultPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[75dvh] w-full max-w-3xl flex-1 flex-col px-4 pb-5" />
      }
    >
      <VaultPageContent />
    </Suspense>
  );
}

function VaultPageContent() {
  const { studioId } = useActiveStudio();
  const resources = useVault(studioId);
  const qc = useQueryClient();
  const params = useSearchParams();
  const unseenIds = (resources.data ?? [])
    .filter((r) => !r.seenAt)
    .map((r) => r.id)
    .sort()
    .join(",");
  useEffect(() => {
    if (!studioId || !unseenIds) return;
    const ids = unseenIds.split(",");
    let active = true;
    void http
      .post(`/c/${studioId}/vault/read`, { ids })
      .then(() => {
        if (active)
          qc.setQueryData<VaultResource[]>(["client-vault", studioId], (rows) =>
            rows?.map((row) =>
              ids.includes(row.id) ? { ...row, seenAt: new Date().toISOString() } : row,
            ),
          );
      })
      .catch(() => {
        /* Keep the badge unread if the acknowledgement fails. */
      });
    return () => {
      active = false;
    };
  }, [studioId, unseenIds, qc]);

  const [category, setCategory] = useState(
    categories.includes(params.get("category") ?? "") ? params.get("category")! : "All",
  );
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<VaultResource | null>(null);
  const [viewer, setViewer] = useState<{ resource: VaultResource; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const rows = (resources.data ?? []).filter(
    (r) =>
      (category === "All" || resourceCategory(r.type) === category) &&
      `${r.name} ${r.description}`.toLowerCase().includes(search.toLowerCase()),
  );
  async function getUrl(resource: VaultResource) {
    const { data } = await http.get<{ url: string }>(`/c/${studioId}/vault/${resource.id}/open`);
    void qc.invalidateQueries({ queryKey: ["client-vault", studioId] });
    return data.url;
  }
  async function action(kind: "open" | "download" | "share") {
    if (!selected || !studioId || busy) return;
    setBusy(true);
    setError("");
    try {
      const url = await getUrl(selected);
      if (kind === "open") {
        if (selected.link) {
          window.location.assign(url);
          return;
        }
        setLoaded(false);
        setViewer({ resource: selected, url });
        setSelected(null);
      } else if (kind === "share") {
        if (navigator.share) {
          if (selected.link) await navigator.share({ title: selected.name, url });
          else {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Couldn't prepare this file for sharing.");
            const blob = await response.blob();
            const file = new globalThis.File(
              [blob],
              `${selected.name}.${selected.format || "pdf"}`,
              { type: blob.type },
            );
            if (navigator.canShare?.({ files: [file] }))
              await navigator.share({ title: selected.name, files: [file] });
            else
              throw new Error(
                "File sharing isn't available in this browser. Download the file to share it.",
              );
          }
        } else {
          if (!selected.link) throw new Error("Download the file to share it from your device.");
          await navigator.clipboard.writeText(url);
          setError("Link copied.");
        }
      } else {
        if (selected.link) {
          window.location.assign(url);
          return;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error("Couldn't download this file. Try opening it instead.");
        const blob = await response.blob();
        const localUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = localUrl;
        a.download = `${selected.name}.${selected.format || "pdf"}`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(localUrl), 60000);
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError"))
        setError(e instanceof Error ? e.message : "Couldn't open this resource.");
    } finally {
      setBusy(false);
    }
  }
  const count = (c: string) =>
    (resources.data ?? []).filter((r) => c === "All" || resourceCategory(r.type) === c).length;
  return (
    <main className="mx-auto flex min-h-[75dvh] w-full max-w-3xl flex-1 flex-col px-4 pb-5">
      <header className="sticky top-0 z-10 -mx-4 mb-5 grid shrink-0 grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 border-b border-line bg-panel px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
        <Link
          href={params.get("from") === "profile" ? "/you" : "/dashboard"}
          aria-label={params.get("from") === "profile" ? "Back to Profile" : "Back to Today"}
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-line-focus"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 text-center">
          <h1 className="text-base font-semibold leading-snug tracking-tight">
            Lessons &amp; documents
          </h1>
          <p className="mt-1 text-xs leading-normal text-fg-muted">
            Shared with you · {resources.data?.length ?? 0}{" "}
            {resources.data?.length === 1 ? "resource" : "resources"}
          </p>
        </div>
        <span aria-hidden="true" className="size-11" />
      </header>
      {searching && (
        <input
          aria-label="Search shared resources"
          className="mb-4 h-11 rounded-xl border border-line bg-surface px-3 text-sm"
          placeholder="Search resources"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      <div className="mb-3 flex items-center justify-between text-xs">
        <h2 className="font-medium">{category === "All" ? "Resources" : category}</h2>
        <span className="text-fg-muted">
          New: {rows.filter((r) => !r.openedAt).length} · Total: {rows.length}
        </span>
      </div>
      {resources.isPending ? (
        <p className="py-16 text-center text-sm text-fg-muted">Loading resources…</p>
      ) : resources.isError ? (
        <div role="alert" className="py-16 text-center">
          <p>Couldn't load resources.</p>
          <Button variant="outline" onClick={() => void resources.refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => {
            const Icon = icons[r.type] ?? File;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelected(r);
                  setError("");
                }}
                className="client-tappable flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-left"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-signal-subtle text-signal-text">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{r.name}</span>
                  {r.description && (
                    <span className="block truncate text-xs text-fg-muted">{r.description}</span>
                  )}
                  <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-fg-muted">
                    {!r.openedAt && (
                      <span className="rounded bg-signal px-1.5 py-0.5 text-signal-fg">New</span>
                    )}
                    <span>{r.format?.toUpperCase() || r.type}</span>
                    <span>· {fileSize(r.bytes)}</span>
                    <span>
                      · Added{" "}
                      {new Date(r.assignedAt ?? r.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
          {!rows.length && (
            <p className="py-16 text-center text-sm text-fg-muted">
              {resources.data?.length
                ? "No resources in this category."
                : "Your coach hasn't shared any resources yet."}
            </p>
          )}
        </div>
      )}
      <p className="mt-5 px-4 text-center text-xs leading-relaxed text-fg-subtle">
        Files stay available while they are shared with you. Downloaded copies remain on your
        device.
      </p>
      <nav
        aria-label="Resource categories"
        className="sticky bottom-4 mt-auto flex items-center gap-1 rounded-full border border-line bg-sunken/95 p-1.5 shadow-sm"
      >
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => (
            <button
              type="button"
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-3 py-2 text-[11px] ${category === c ? "bg-signal text-signal-fg" : "text-fg-muted"}`}
            >
              {c} <span className="ml-1 opacity-70">{count(c)}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Search resources"
          onClick={() => setSearching((v) => !v)}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface"
        >
          <Search className="size-4" />
        </button>
      </nav>
      <Sheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open && !busy) setSelected(null);
        }}
      >
        <SheetContent
          side="bottom"
          className="h-[62dvh] gap-0 p-0"
          showCloseButton={false}
          onInteractOutside={(e) => busy && e.preventDefault()}
        >
          <div aria-hidden="true" className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-line" />
          <SheetHeader className="flex items-start gap-3 px-4 py-5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-signal-subtle text-signal-text">
              <FileText className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate pr-0 text-sm">{selected?.name}</SheetTitle>
              <SheetDescription className="text-[10px]">
                {selected?.format?.toUpperCase() ?? selected?.type} ·{" "}
                {fileSize(selected?.bytes ?? null)}
              </SheetDescription>
            </div>
            <button
              type="button"
              aria-label="Close resource"
              disabled={busy}
              onClick={() => setSelected(null)}
              className="flex size-8 items-center justify-center rounded-full bg-sunken"
            >
              <X className="size-4" />
            </button>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 text-sm leading-relaxed whitespace-pre-wrap">
            {selected?.description}
          </div>
          {error && (
            <p role="status" className="px-5 py-2 text-xs text-danger">
              {error}
            </p>
          )}
          <footer className="space-y-2 border-t border-line bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button
              disabled={busy}
              onClick={() => void action("open")}
              className="w-full rounded-full bg-signal text-signal-fg"
            >
              {busy
                ? "Preparing…"
                : selected?.format === "pdf" || selected?.format === "PDF"
                  ? "Open PDF"
                  : selected?.link
                    ? "Open link"
                    : `Open ${selected?.type.toLowerCase() ?? "resource"}`}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="rounded-full"
                disabled={busy}
                onClick={() => void action("download")}
              >
                <Download className="size-4" />
                Download
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                disabled={busy}
                onClick={() => void action("share")}
              >
                <Share className="size-4" />
                Share
              </Button>
            </div>
          </footer>
        </SheetContent>
      </Sheet>
      <Dialog open={Boolean(viewer)} onOpenChange={(open) => !open && setViewer(null)}>
        <DialogContent
          showCloseButton={false}
          variant="fullscreen"
          className="fixed inset-0 flex h-dvh max-h-none w-screen max-w-none flex-col rounded-none p-0 sm:h-dvh sm:max-h-none sm:w-screen"
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-line bg-surface px-3 py-2 pt-[max(.5rem,env(safe-area-inset-top))]">
            <button
              type="button"
              aria-label="Close viewer"
              onClick={() => setViewer(null)}
              className="flex size-10 items-center justify-center"
            >
              <X className="size-5" />
            </button>
            <DialogTitle className="min-w-0 flex-1 truncate text-center text-sm">
              {viewer?.resource.name}
              {viewer?.resource.format ? `.${viewer.resource.format}` : ""}
            </DialogTitle>
            <a
              href={viewer?.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in browser"
              className="flex size-10 items-center justify-center"
            >
              <ExternalLink className="size-4" />
            </a>
          </header>
          {viewer && (
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto bg-sunken">
              {viewer.resource.type === "Image" ? (
                <img
                  src={viewer.url}
                  alt={viewer.resource.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : viewer.resource.type === "Video" ? (
                <video controls autoPlay src={viewer.url} className="max-h-full max-w-full">
                  <track kind="captions" />
                </video>
              ) : viewer.resource.type === "Audio" ? (
                <audio controls src={viewer.url}>
                  <track kind="captions" />
                </audio>
              ) : (
                <>
                  <iframe
                    title={viewer.resource.name}
                    src={viewer.url}
                    onLoad={() => setLoaded(true)}
                    className="h-full w-full border-0 bg-white"
                  />
                  {!loaded && (
                    <p className="absolute top-4 rounded-lg bg-surface p-3 text-sm">
                      Loading document…
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          <p className="shrink-0 bg-surface px-4 py-2 text-center text-xs text-fg-muted">
            Preview unavailable?{" "}
            <a className="underline" href={viewer?.url} target="_blank" rel="noopener noreferrer">
              Open in browser
            </a>
          </p>
        </DialogContent>
      </Dialog>
    </main>
  );
}
