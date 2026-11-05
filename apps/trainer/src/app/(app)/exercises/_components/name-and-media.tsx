"use client";

import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { Textarea } from "@traiv/ui/components/textarea";
import { Image, Link as LinkIcon, Upload, Video, X } from "@traiv/ui/icons";
import { useRef, useState } from "react";
import { uploadApi } from "@/lib/api";
import { useUploadsConfigured } from "@/lib/query";

type Details = { name: string; description: string; videoUrl: string; imageUrl: string };
function embedUrl(raw: string) {
  try {
    const url = new URL(raw);
    if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(url.hostname)) {
      const id =
        url.hostname === "youtu.be"
          ? url.pathname.slice(1)
          : (url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).at(-1));
      if (id && /^[\w-]{11}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(url.hostname)) {
      const id = url.pathname.split("/").filter(Boolean).at(-1);
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* An incomplete URL remains editable. */
  }
  return null;
}

export function NameAndMedia({
  draft,
  onChange,
  nameId,
  studioId,
  onBusyChange,
}: {
  draft: Details;
  onChange: (next: Partial<Details>) => void;
  nameId: string;
  studioId: string;
  onBusyChange: (busy: boolean) => void;
}) {
  const configured = useUploadsConfigured(studioId);
  const [mode, setMode] = useState<"upload" | "link">(() =>
    embedUrl(draft.videoUrl) ? "link" : "upload",
  );
  const [busy, setBusy] = useState<"image" | "video" | null>(null);
  const [error, setError] = useState("");
  const uploadLock = useRef(false);
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  async function upload(file: File, kind: "image" | "video") {
    if (uploadLock.current) return;
    const allowed =
      kind === "video"
        ? ["video/mp4", "video/quicktime"]
        : ["image/png", "image/jpeg", "image/gif"];
    if (!allowed.includes(file.type) || file.size > (kind === "video" ? 150 : 10) * 1024 * 1024) {
      setError(
        kind === "video"
          ? "Choose an MP4 or MOV up to 150 MB."
          : "Choose a PNG, JPG or GIF up to 10 MB.",
      );
      return;
    }
    uploadLock.current = true;
    setBusy(kind);
    onBusyChange(true);
    setError("");
    try {
      const url = await uploadApi.put(
        await uploadApi.sign(studioId, kind === "video" ? "exercise-video" : "exercise-image"),
        file,
      );
      // Update only the uploaded field, preserving edits made while the upload was in flight.
      onChange(kind === "video" ? { videoUrl: url } : { imageUrl: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      uploadLock.current = false;
      setBusy(null);
      onBusyChange(false);
    }
  }
  return (
    <>
      <h3 className="text-sm font-semibold">Basic Information</h3>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={nameId}>Name</Label>
        <Input
          id={nameId}
          maxLength={255}
          value={draft.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="h-11 w-full"
        />
        <span className="text-right text-xs tabular-nums text-fg-subtle">
          {draft.name.length}/255
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${nameId}-description`}>Description</Label>
        <Textarea
          id={`${nameId}-description`}
          maxLength={2048}
          value={draft.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe the exercise and proper form..."
          className="min-h-40"
        />
        <span className="text-right text-xs tabular-nums text-fg-subtle">
          {draft.description.length}/2048
        </span>
      </div>
      <h3 className="mt-3 text-sm font-semibold">Upload Media</h3>
      <div className="grid grid-cols-2 rounded-control border border-line bg-panel p-1">
        {(
          [
            ["upload", "Upload Video", Video],
            ["link", "YouTube / Vimeo", LinkIcon],
          ] as const
        ).map(([value, label, Icon]) => (
          <button
            key={value}
            type="button"
            disabled={Boolean(busy)}
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
            className={`flex min-h-9 items-center justify-center gap-2 rounded-lg px-2 text-sm font-medium ${mode === value ? "bg-surface shadow-sm" : "text-fg-muted"}`}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>
      {mode === "link" && (
        <div className="space-y-2">
          <Label htmlFor={`${nameId}-video-link`}>YouTube / Vimeo link</Label>
          <Input
            id={`${nameId}-video-link`}
            type="url"
            value={draft.videoUrl}
            onChange={(e) => onChange({ videoUrl: e.target.value })}
            placeholder="https://youtube.com/watch?v=…"
            className="h-11 w-full"
          />
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(["video", "image"] as const).map((kind) => {
          const value = kind === "video" ? draft.videoUrl : draft.imageUrl;
          const Icon = kind === "video" ? Video : Image;
          const input = kind === "video" ? videoInput : imageInput;
          const embed = kind === "video" ? embedUrl(value) : null;
          return (
            <div key={kind} className="space-y-2">
              <p className="text-sm">
                Exercise {kind} <span className="text-fg-muted">(optional)</span>
              </p>
              <input
                ref={input}
                type="file"
                hidden
                accept={
                  kind === "video" ? "video/mp4,video/quicktime" : "image/png,image/jpeg,image/gif"
                }
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) void upload(file, kind);
                }}
              />
              {value ? (
                <div className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-control border border-line bg-surface pb-10">
                  {kind === "image" ? (
                    <img src={value} alt="Exercise" className="max-h-56 w-full object-contain" />
                  ) : embed ? (
                    <iframe
                      src={embed}
                      title="Exercise video"
                      allowFullScreen
                      className="aspect-video w-full"
                    />
                  ) : (
                    <video
                      muted
                      src={value}
                      controls
                      playsInline
                      preload="metadata"
                      className="max-h-56 w-full object-contain"
                    />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={Boolean(busy)}
                    onClick={() => onChange(kind === "video" ? { videoUrl: "" } : { imageUrl: "" })}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-danger-subtle text-danger"
                  >
                    <X className="size-4" />
                    Remove
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={
                    Boolean(busy) || !configured.data || (kind === "video" && mode === "link")
                  }
                  onClick={() => input.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file && configured.data && !(kind === "video" && mode === "link"))
                      void upload(file, kind);
                  }}
                  className="flex min-h-64 w-full flex-col items-center justify-center gap-4 rounded-control border border-dashed border-line bg-surface px-3 py-5 text-center disabled:cursor-not-allowed"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-signal-subtle text-signal-text">
                    <Icon className="size-6" />
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium shadow-sm">
                    <Upload className="size-4" />
                    {busy === kind
                      ? "Uploading…"
                      : `Upload ${kind === "video" ? "Video" : "Image"}`}
                  </span>
                  <span className="text-xs leading-relaxed text-fg-muted">
                    {kind === "video" ? "MP4 or MOV up to 150MB" : "PNG, JPG or GIF up to 10MB"}
                    <br />
                    Drag &amp; drop or click to browse
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>
      {configured.isPending && (
        <p className="text-xs text-fg-muted">Checking upload availability…</p>
      )}
      {configured.isError && (
        <p role="alert" className="text-sm text-danger">
          Couldn't check upload availability.{" "}
          <button type="button" className="underline" onClick={() => void configured.refetch()}>
            Retry
          </button>
        </p>
      )}
      {configured.data === false && (
        <p role="status" className="text-sm text-fg-muted">
          File uploads are not configured. You can still use a video link.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </>
  );
}
