"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Checkbox } from "@traiv/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@traiv/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@traiv/ui/components/sheet";
import { PageHeader } from "@traiv/ui/components/shell/page-header";
import { Textarea } from "@traiv/ui/components/textarea";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  File,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Lock,
  MoreHorizontal,
  Music,
  Plus,
  Search,
  Upload,
  Video,
} from "@traiv/ui/icons";
import { fileSize, RESOURCE_TYPES, type VaultResource, type VaultType } from "@traiv/ui/lib/vault";
import { useId, useRef, useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import { http } from "@/lib/api/client";
import { vaultApi, vaultPath } from "@/lib/api/vault";
import { useTags } from "@/lib/query";
import { MultiPick } from "../nutrition/_components/controls";

const control = "h-10 w-full";
const glyphs = { Document: FileText, Image: ImageIcon, Video, Audio: Music, Link: LinkIcon, File };
export function ResourceIcon({ type }: { type: VaultType }) {
  const Icon = glyphs[type] ?? File;
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sunken">
      <Icon className="size-5" />
    </span>
  );
}
export function Vault({ clientId }: { clientId?: string }) {
  const studioId = useActiveStudioId();
  return studioId ? (
    <VaultContent
      key={`${studioId}:${clientId ?? "library"}`}
      studioId={studioId}
      clientId={clientId}
    />
  ) : null;
}
function VaultContent({ studioId, clientId }: { studioId: string; clientId?: string }) {
  const searchId = useId();
  const qc = useQueryClient();
  const resources = useQuery({
    queryKey: ["vault", studioId, clientId ?? "library"],
    queryFn: () => vaultApi.list(studioId, clientId),
  });
  const tags = useTags(studioId);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const [editing, setEditing] = useState<VaultResource | null>(null);
  const [deleting, setDeleting] = useState<VaultResource | null>(null);
  const [error, setError] = useState("");
  const refresh = () => qc.invalidateQueries({ queryKey: ["vault", studioId] });
  const remove = useMutation({
    mutationFn: async (row: VaultResource) => {
      await http.delete(
        clientId
          ? `${vaultPath(studioId)}/clients/${clientId}/${row.id}`
          : `${vaultPath(studioId)}/${row.id}`,
      );
    },
    onSuccess: () => {
      setDeleting(null);
      void refresh();
    },
    onError: (e) => setError(e.message),
  });
  const filtered = (resources.data ?? []).filter(
    (r) =>
      `${r.name} ${r.description}`.toLowerCase().includes(search.toLowerCase()) &&
      (!type || r.type === type) &&
      (!tag || r.tagIds.includes(tag)),
  );
  const rows = filtered.slice((page - 1) * 25, page * 25);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {!clientId && <PageHeader title="Vault" />}
      <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-5 sm:px-6">
        <label htmlFor={searchId} className="relative min-w-48 flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-fg-subtle" />
          <Input
            id={searchId}
            aria-label="Search resources"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-10 w-full pl-9"
          />
        </label>
        <TypeFilter
          value={type}
          onChange={(v) => {
            setType(v);
            setPage(1);
          }}
        />
        {!clientId && (
          <VaultSelect
            label="Select tags"
            value={tag}
            onChange={(v) => {
              setTag(v);
              setPage(1);
            }}
            options={[
              { value: "", label: "All tags" },
              ...(tags.data ?? []).map((t) => ({ value: t.id, label: t.name })),
            ]}
            className="w-44"
          />
        )}
        <Button
          className="shrink-0 rounded-full sm:ml-auto"
          onClick={() => (clientId ? setChoosing(true) : setAdding(true))}
        >
          <Plus className="size-4" />
          {clientId ? "Add from library" : "Add file"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="px-5 text-sm text-danger">
          {error}
        </p>
      )}
      {resources.isError ? (
        <div role="alert" className="p-12 text-center">
          <p>Couldn't load resources.</p>
          <Button variant="outline" onClick={() => void resources.refetch()}>
            Try again
          </Button>
        </div>
      ) : resources.isPending ? (
        <p className="p-12 text-center text-fg-muted">Loading resources…</p>
      ) : !resources.data.length ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <FileText className="size-8 text-fg-subtle" />
          <h2 className="font-semibold">
            {clientId ? "No client vault resources yet" : "No resources found"}
          </h2>
          <p className="text-sm text-fg-muted">
            {clientId
              ? "Upload or choose resources to share with this client."
              : "Keep useful files and links ready to share with clients."}
          </p>
          <Button
            className="rounded-full"
            onClick={() => (clientId ? setChoosing(true) : setAdding(true))}
          >
            <Plus className="size-4" />
            {clientId ? "Upload resources" : "Upload Resource"}
          </Button>
        </div>
      ) : (
        <div className="mx-4 mb-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-surface border border-line bg-surface sm:mx-6">
          <ResourceTable
            rows={rows}
            client={Boolean(clientId)}
            onSelect={setEditing}
            actions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-label={`Actions for ${row.name}`} size="icon" variant="ghost">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditing(row)}>Edit resource</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        const url = await vaultApi.open(studioId, row.id);
                        window.open(url, "_blank", "noopener,noreferrer");
                      } catch (e) {
                        setError(e instanceof Error ? e.message : "Couldn't open resource.");
                      }
                    }}
                  >
                    Open resource
                  </DropdownMenuItem>
                  {(!clientId || row.direct) && (
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleting(row)}>
                      {clientId ? "Remove" : "Delete"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
          <div className="flex flex-1 bg-sunken/40" />
          <footer className="flex items-center justify-between border-t border-line px-4 py-3 text-sm">
            <span>
              Viewing {rows.length} of {filtered.length}
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <span>{page}</span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page * 25 >= filtered.length}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </footer>
        </div>
      )}
      <Dialog open={adding} onOpenChange={setAdding}>
        {adding && (
          <ResourceEditor
            studioId={studioId}
            clientId={clientId}
            onSaved={() => {
              setAdding(false);
              void refresh();
            }}
            onCancel={() => setAdding(false)}
          />
        )}
      </Dialog>
      <Sheet open={Boolean(editing)} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && (
          <ResourceEditor
            studioId={studioId}
            resource={editing}
            onSaved={() => {
              setEditing(null);
              void refresh();
            }}
            onCancel={() => setEditing(null)}
          />
        )}
      </Sheet>
      <Dialog open={choosing} onOpenChange={setChoosing}>
        {choosing && clientId && (
          <LibraryPicker
            studioId={studioId}
            clientId={clientId}
            assigned={resources.data ?? []}
            onUpload={() => {
              setChoosing(false);
              setAdding(true);
            }}
            onAssigned={() => {
              setChoosing(false);
              void refresh();
            }}
          />
        )}
      </Dialog>
      <Dialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{clientId ? "Remove resource?" : "Delete resource?"}</DialogTitle>
            <DialogDescription>
              {clientId
                ? `Remove “${deleting?.name}” from this client’s vault.`
                : `“${deleting?.name}” will also be removed from every client's vault.`}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button disabled={remove.isPending} onClick={() => deleting && remove.mutate(deleting)}>
              {remove.isPending ? "Removing…" : clientId ? "Remove" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function VaultSelect({
  id,
  label,
  value,
  onChange,
  options,
  className = "w-full",
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <Select
      id={id}
      value={value || "__all"}
      onValueChange={(v) => onChange(v === "__all" ? "" : v)}
      containerClassName={className}
    >
      <SelectTrigger aria-label={label} className="w-full bg-surface">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent position="popper" align="start" sideOffset={6}>
        {options.map((o) => (
          <SelectItem key={o.value || "__all"} value={o.value || "__all"}>
            {o.value ? o.label : label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
function TypeFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <VaultSelect
      label="Resource type"
      value={value}
      onChange={onChange}
      options={[
        { value: "", label: "All types" },
        ...RESOURCE_TYPES.map((t) => ({ value: t, label: t })),
      ]}
      className="w-40"
    />
  );
}
function ResourceTable({
  rows,
  onSelect,
  actions,
  client,
}: {
  rows: VaultResource[];
  onSelect: (r: VaultResource) => void;
  actions?: (r: VaultResource) => React.ReactNode;
  client?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="border-b border-line text-fg-muted">
          <tr>
            {[
              "Name",
              "Type",
              "Uploaded",
              "Size",
              "Visibility",
              ...(client ? ["Status"] : []),
              "",
            ].map((h, i) => (
              <th key={`${h}${i}`} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line last:border-0 hover:bg-hover">
              <td className="px-4 py-4">
                <button
                  type="button"
                  onClick={() => onSelect(row)}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <ResourceIcon type={row.type} />
                  <span>
                    <span className="block font-medium">{row.name}</span>
                    <span className="line-clamp-1 text-fg-muted">{row.description}</span>
                  </span>
                </button>
              </td>
              <td className="px-4">
                <span className="rounded-lg border border-line px-2 py-1 text-xs">{row.type}</span>
              </td>
              <td className="px-4 text-fg-muted">
                {new Date(row.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-4 text-fg-muted">{fileSize(row.bytes)}</td>
              <td className="px-4">
                <span
                  className={`rounded-lg px-2 py-1 text-xs ${row.allClients || row.tagIds.length || row.gender ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`}
                >
                  {row.allClients
                    ? "All clients"
                    : row.tagIds.length || row.gender
                      ? "Selected clients"
                      : "Private"}
                </span>
              </td>
              {client && (
                <td className="px-4 text-xs text-fg-muted">{row.openedAt ? "Opened" : "New"}</td>
              )}
              <td className="px-3">{actions?.(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && (
        <p className="p-12 text-center text-sm text-fg-muted">No matching resources.</p>
      )}
    </div>
  );
}
function ResourceEditor({
  studioId,
  clientId,
  resource,
  onSaved,
  onCancel,
}: {
  studioId: string;
  clientId?: string;
  resource?: VaultResource;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const tags = useTags(studioId);
  const fieldId = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(resource?.name ?? "");
  const [description, setDescription] = useState(resource?.description ?? "");
  const [type, setType] = useState<VaultType>(resource?.type ?? "Document");
  const [allClients, setAllClients] = useState(resource?.allClients ?? false);
  const [tagIds, setTagIds] = useState<string[]>(resource?.tagIds ?? []);
  const [gender, setGender] = useState(resource?.gender ?? "");
  const [mode, setMode] = useState<"file" | "link">("file");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function choose(file?: File) {
    if (!file) return;
    if (!file.size || file.size > 512 * 1024 * 1024) {
      setError("Choose a file between 1 byte and 512 MB.");
      return;
    }
    setError("");
    setFile(file);
    setUploadId(undefined);
    if (!name) setName(file.name.replace(/\.[^.]+$/, ""));
    setType(
      file.type.startsWith("image/")
        ? "Image"
        : file.type.startsWith("video/")
          ? "Video"
          : file.type.startsWith("audio/")
            ? "Audio"
            : file.type === "application/pdf" || /\.(pdf|docx?|pptx?|xlsx?|txt)$/i.test(file.name)
              ? "Document"
              : "File",
    );
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = { name, description, type, allClients, tagIds, gender: gender || null };
      if (resource) await http.patch(`${vaultPath(studioId)}/${resource.id}`, data);
      else {
        if (mode === "file" && !file) throw new Error("Choose a file to upload.");
        let uploaded = uploadId;
        if (mode === "file" && file && !uploaded) {
          uploaded = await vaultApi.upload(studioId, file);
          setUploadId(uploaded);
        }
        await http.post(vaultPath(studioId), {
          ...data,
          ...(mode === "file" ? { uploadId: uploaded } : { link }),
          clientId,
        });
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save this resource.");
    } finally {
      setBusy(false);
    }
  }
  const fields = (
    <>
      {!resource && (
        <section className="space-y-4">
          <h3 className="text-sm font-semibold">Content</h3>
          <div className="flex rounded-xl bg-sunken p-1">
            {(["file", "link"] as const).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => {
                  setMode(m);
                  if (m === "link") setType("Link");
                  else if (type === "Link") setType("Document");
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm ${mode === m ? "bg-surface shadow-sm" : "text-fg-muted"}`}
              >
                {m === "file" ? <Upload className="size-4" /> : <LinkIcon className="size-4" />}
                {m === "file" ? "Upload file" : "Add link"}
              </button>
            ))}
          </div>
          {mode === "file" ? (
            <fieldset
              aria-label="File upload drop zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                choose(e.dataTransfer.files[0]);
              }}
              className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line bg-sunken/40 p-6"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-success-subtle text-success">
                <FileText className="size-6" />
              </span>
              <input
                ref={fileInput}
                type="file"
                className="hidden"
                onChange={(e) => choose(e.target.files?.[0])}
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => fileInput.current?.click()}
              >
                <Upload className="size-4" />
                {file ? "Change file" : "Choose file"}
              </Button>
              {file ? (
                <p className="max-w-full break-all text-center text-sm">
                  {file.name} · {fileSize(file.size)}
                </p>
              ) : (
                <p className="text-center text-sm leading-6 text-fg-muted">
                  Documents, images, video and audio
                  <br />
                  Drag &amp; drop or click to browse (max 512MB)
                </p>
              )}
            </fieldset>
          ) : (
            <label htmlFor={`${fieldId}-link`} className="block space-y-2 text-sm">
              Resource link
              <Input
                id={`${fieldId}-link`}
                type="url"
                required
                placeholder="https://"
                className={control}
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </label>
          )}
        </section>
      )}
      <section className="space-y-4">
        {!resource && <h3 className="text-sm font-semibold">Details</h3>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
          <label htmlFor={`${fieldId}-name`} className="flex min-w-0 flex-col gap-2 text-sm">
            Resource name
            <Input
              required
              id={`${fieldId}-name`}
              maxLength={200}
              className={control}
              placeholder="e.g. Getting started guide"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label htmlFor={`${fieldId}-type`} className="flex min-w-0 flex-col gap-2 text-sm">
            Resource type
            <VaultSelect
              id={`${fieldId}-type`}
              label="Resource type"
              value={type}
              onChange={(v) => setType(v as VaultType)}
              options={RESOURCE_TYPES.map((t) => ({ value: t, label: t }))}
            />
          </label>
        </div>
        <label htmlFor={`${fieldId}-description`} className="block space-y-2 text-sm">
          Description <span className="text-fg-muted">(optional)</span>
          <Textarea
            id={`${fieldId}-description`}
            maxLength={5000}
            rows={4}
            className={`${control} h-auto resize-y py-3`}
            placeholder="What will clients learn or find here?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <span className="block text-xs text-fg-muted">
            {description.length.toLocaleString()} / 5,000
          </span>
        </label>
      </section>
      <section
        className={`${resource ? "border-t border-line pt-6" : "rounded-2xl bg-sunken p-4"} space-y-4 text-sm`}
      >
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 size-4 shrink-0 text-fg-muted" />
          <div>
            <h3 className="font-semibold">
              {resource ? "Sharing Options" : "Who can access this?"}
            </h3>
            <p className="mt-2 text-fg-muted">
              This resource stays in your vault until you share it with clients.
            </p>
          </div>
        </div>
        <Checkbox
          id={`${fieldId}-all`}
          label="Available to all clients"
          fullWidth={false}
          checked={allClients}
          onCheckedChange={(checked) => setAllClients(Boolean(checked))}
        />
        <p className="text-xs text-fg-muted">
          Or share with clients by tag or gender. Leave both empty to keep it private.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-2">
            <span>
              Client tags <span className="text-fg-muted">(optional)</span>
            </span>
            <MultiPick
              label="Select tags"
              values={tagIds.map((id) => tags.data?.find((t) => t.id === id)?.name ?? id)}
              options={(tags.data ?? []).map((t) => t.name)}
              onChange={(names) =>
                setTagIds((tags.data ?? []).filter((t) => names.includes(t.name)).map((t) => t.id))
              }
            />
          </div>
          <label htmlFor={`${fieldId}-gender`} className="flex min-w-0 flex-col gap-2">
            <span>
              Gender <span className="text-fg-muted">(optional)</span>
            </span>
            <VaultSelect
              id={`${fieldId}-gender`}
              label="Select gender"
              value={gender}
              onChange={setGender}
              options={[
                { value: "", label: "Select gender" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "undisclosed", label: "Undisclosed" },
              ]}
            />
          </label>
        </div>
      </section>
    </>
  );
  const form = (
    <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-6 py-5">
        {fields}
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
      <footer className="flex shrink-0 justify-end gap-2 border-t border-line px-6 py-4">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          disabled={busy}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="rounded-full" disabled={busy}>
          {resource && <Check className="size-4" />}
          {busy ? "Saving…" : resource ? "Update Resource" : "Add resource"}
        </Button>
      </footer>
    </form>
  );
  return resource ? (
    <SheetContent
      className="w-full gap-0 p-0 sm:max-w-[640px]"
      onInteractOutside={(e) => busy && e.preventDefault()}
    >
      <SheetHeader className="shrink-0">
        <SheetTitle>Edit Resource</SheetTitle>
        <SheetDescription>Update the resource details and sharing options.</SheetDescription>
      </SheetHeader>
      {form}
    </SheetContent>
  ) : (
    <DialogContent
      variant="scrollable"
      className="flex h-[min(90dvh,860px)] max-h-[90dvh] max-w-[680px] flex-col overflow-hidden p-0"
      onInteractOutside={(e) => busy && e.preventDefault()}
    >
      <DialogHeader className="shrink-0 px-6 pt-6 pb-2">
        <DialogTitle>Add resource</DialogTitle>
        <DialogDescription>
          Keep useful files and links in your vault, ready to share with clients.
        </DialogDescription>
      </DialogHeader>
      {form}
    </DialogContent>
  );
}
function LibraryPicker({
  studioId,
  clientId,
  assigned,
  onAssigned,
  onUpload,
}: {
  studioId: string;
  clientId: string;
  assigned: VaultResource[];
  onAssigned: () => void;
  onUpload: () => void;
}) {
  const library = useQuery({
    queryKey: ["vault", studioId, "library"],
    queryFn: () => vaultApi.list(studioId),
  });
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const rows = (library.data ?? []).filter(
    (r) =>
      !assigned.some((a) => a.id === r.id) &&
      r.name.toLowerCase().includes(search.toLowerCase()) &&
      (!type || r.type === type),
  );
  async function assign(row: VaultResource) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await http.post(`${vaultPath(studioId)}/clients/${clientId}/${row.id}`);
      onAssigned();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't assign resource.");
    } finally {
      setBusy(false);
    }
  }
  const available = (library.data ?? []).filter((r) => !assigned.some((a) => a.id === r.id));
  const filtered = Boolean(search || type);
  return (
    <DialogContent
      variant="scrollable"
      className="h-[min(85dvh,760px)] max-h-[85dvh] max-w-[900px] overflow-hidden p-0"
    >
      <DialogHeader className="shrink-0 px-6 py-5 pr-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <DialogTitle>Choose from library</DialogTitle>
            <DialogDescription>Choose a resource to share with this client.</DialogDescription>
          </div>
          <Button className="shrink-0 rounded-full" onClick={onUpload}>
            <Plus className="size-4" />
            Upload
          </Button>
        </div>
      </DialogHeader>
      <div className="flex shrink-0 items-center gap-3 px-6 py-4">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-fg-subtle"
          />
          <Input
            aria-label="Search library resources"
            placeholder="Search resources..."
            className="h-10 w-full pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="shrink-0">
          <TypeFilter value={type} onChange={setType} />
        </div>
      </div>
      {error && (
        <p role="alert" className="shrink-0 px-6 pb-3 text-sm text-danger">
          {error}
        </p>
      )}
      <div
        aria-busy={busy}
        className="mx-6 mb-6 flex min-h-0 flex-1 flex-col overflow-hidden rounded-surface border border-line bg-surface"
      >
        {library.isPending ? (
          <div
            role="status"
            className="flex flex-1 items-center justify-center p-8 text-sm text-fg-muted"
          >
            Loading resources…
          </div>
        ) : library.isError ? (
          <div
            role="alert"
            className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center"
          >
            <p>Couldn't load the library.</p>
            <Button variant="outline" onClick={() => void library.refetch()}>
              Try again
            </Button>
          </div>
        ) : !rows.length ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-y-auto px-6 py-10 text-center">
            <span className="mb-2 flex size-16 shrink-0 items-center justify-center rounded-2xl border border-line bg-sunken">
              {filtered ? (
                <Search className="size-7 text-fg-subtle" />
              ) : (
                <FileText className="size-7 text-fg-subtle" />
              )}
            </span>
            <h2 className="text-subheading font-medium">
              {filtered
                ? "No matching resources"
                : available.length === 0 && (library.data?.length ?? 0) > 0
                  ? "Everything is already shared"
                  : "Your library is empty"}
            </h2>
            <p className="max-w-[38ch] text-body-sm leading-relaxed text-fg-muted">
              {filtered
                ? "Try another search or clear the filters to see available resources."
                : (library.data?.length ?? 0) > 0
                  ? "This client already has access to every resource in your library. Upload a new file to share something else."
                  : "Upload a guide, image, video or other useful file to share with your client."}
            </p>
            <Button
              className="mt-2 rounded-full"
              variant={filtered ? "outline" : "default"}
              onClick={
                filtered
                  ? () => {
                      setSearch("");
                      setType("");
                    }
                  : onUpload
              }
            >
              {filtered ? (
                "Clear filters"
              ) : (
                <>
                  <Plus className="size-4" />
                  Upload resource
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-auto">
            <ResourceTable rows={rows} onSelect={(r) => void assign(r)} />
          </div>
        )}
        {rows.length > 0 && !library.isPending && !library.isError && (
          <footer className="shrink-0 border-t border-line bg-sunken/40 px-4 py-3 text-caption text-fg-muted">
            {busy
              ? "Assigning resource…"
              : `${rows.length} ${rows.length === 1 ? "resource" : "resources"} available`}
          </footer>
        )}
      </div>
    </DialogContent>
  );
}
