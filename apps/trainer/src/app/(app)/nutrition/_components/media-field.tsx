"use client";
import { Input } from "@traiv/ui/components/input";
import { useState } from "react";
import type { StudioUploadKind } from "@/lib/api";
import { uploadApi } from "@/lib/api";
import { useUploadsConfigured } from "@/lib/query";
import { Field } from "./controls";
export function MediaField({
  studioId,
  kind,
  value,
  onChange,
  label,
}: {
  studioId: string;
  kind: StudioUploadKind;
  value: string;
  onChange: (s: string) => void;
  label: string;
}) {
  const configured = useUploadsConfigured(studioId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isVideo = kind === "recipe-video";
  return (
    <Field
      label={label}
      hint={
        busy
          ? "Uploading… Keep this form open."
          : configured.data
            ? "Upload a file or paste a hosted URL."
            : "Optional. Paste a hosted URL, or leave empty."
      }
    >
      <Input
        aria-label={label}
        type="url"
        value={value}
        disabled={busy}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://…"
      />
      {configured.data ? (
        <Input
          aria-label={`Upload ${label.toLowerCase()}`}
          type="file"
          accept={isVideo ? "video/mp4,video/quicktime" : "image/png,image/jpeg,image/gif"}
          disabled={busy}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setError("");
            const allowed = isVideo
              ? ["video/mp4", "video/quicktime"]
              : ["image/png", "image/jpeg", "image/gif"];
            if (!allowed.includes(file.type) || file.size > (isVideo ? 150 : 5) * 1024 * 1024) {
              setError(
                isVideo ? "Choose an MP4/MOV under 150 MB." : "Choose a PNG/JPG/GIF under 5 MB.",
              );
              return;
            }
            setBusy(true);
            try {
              onChange(await uploadApi.put(await uploadApi.sign(studioId, kind), file));
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed. Try again.");
            } finally {
              setBusy(false);
            }
          }}
        />
      ) : null}
      {error ? (
        <p role="alert" className="text-caption text-danger">
          {error}
        </p>
      ) : null}
    </Field>
  );
}
