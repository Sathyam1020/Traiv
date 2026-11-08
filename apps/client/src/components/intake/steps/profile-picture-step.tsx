"use client";

import { Camera, User } from "@traiv/ui/icons";
import Image from "next/image";
import { useRef, useState } from "react";
import { uploadApi } from "@/lib/api";
import { useSettings } from "@/lib/query/use-settings";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

/** Skippable — the only step with no field the rest of the flow or the coach depends
 * on, which is exactly why it says so on screen. */
export function ProfilePictureStep({ flow, studioId }: { flow: IntakeFlow; studioId: string }) {
  const settings = useSettings(studioId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const shown = preview ?? settings.data?.user.avatarUrl ?? null;

  async function choose(file: File) {
    setUploadError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadApi.put(await uploadApi.sign(studioId, "avatar"), file);
      setUploadedUrl(url);
    } catch {
      setUploadError("Couldn't upload that photo. Try again.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <StepShell
      step={2}
      title="Profile Picture"
      blurb="Add a photo so your coach can recognise you."
      busy={flow.busy}
      error={flow.error ?? uploadError}
      onBack={flow.back}
      canContinue={!uploading}
      onContinue={() => flow.next(2, uploadedUrl ? { avatarUrl: uploadedUrl } : {})}
    >
      <div className="flex flex-col items-center gap-4 py-6">
        <span
          className={`flex size-32 items-center justify-center overflow-hidden rounded-full border border-line bg-sunken ${
            settings.isPending ? "animate-pulse" : ""
          }`}
        >
          {settings.isPending ? null : shown ? (
            <Image src={shown} alt="" width={128} height={128} className="size-full object-cover" />
          ) : (
            <User className="size-14 text-fg-subtle" />
          )}
        </span>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void choose(file);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-body-sm font-medium transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Camera className="size-4" />
          {uploading ? "Uploading…" : "Add a photo"}
        </button>

        <p className="text-caption text-fg-subtle">You can skip this step and add a photo later</p>
      </div>
    </StepShell>
  );
}
