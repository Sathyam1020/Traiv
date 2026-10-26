"use client";

import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { Textarea } from "@traiv/ui/components/textarea";
import { Video, X } from "@traiv/ui/icons";

const NAME_MAX = 255;
const DESCRIPTION_MAX = 2048;

/**
 * Tab 1 of the exercise panel: name, description, and the video/image.
 *
 * Image and video are URL fields rather than a direct upload here — the signed-upload
 * flow built for check-in photos (`apps/api/src/features/client/uploads.ts`) is
 * client-scoped, and wiring a second signer for studio-owned library assets is its own
 * small piece of work rather than something to improvise inline. A coach can paste a
 * YouTube/Vimeo link or a hosted image URL today; direct upload is the natural follow-up.
 */
export function NameAndMedia({
  draft,
  onChange,
  nameId,
}: {
  draft: { name: string; description: string; videoUrl: string; imageUrl: string };
  onChange: (next: {
    name: string;
    description: string;
    videoUrl: string;
    imageUrl: string;
  }) => void;
  nameId: string;
}) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <Label htmlFor={nameId}>Name</Label>
          <span className="text-caption text-fg-subtle tabular-nums">
            {draft.name.length}/{NAME_MAX}
          </span>
        </div>
        <Input
          id={nameId}
          value={draft.name}
          onChange={(e) => onChange({ ...draft, name: e.target.value.slice(0, NAME_MAX) })}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <Label>Description</Label>
          <span className="text-caption text-fg-subtle tabular-nums">
            {draft.description.length}/{DESCRIPTION_MAX}
          </span>
        </div>
        <Textarea
          value={draft.description}
          onChange={(e) =>
            onChange({ ...draft, description: e.target.value.slice(0, DESCRIPTION_MAX) })
          }
          placeholder="Describe the exercise and proper form..."
          rows={4}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Media</Label>

        <div className="flex flex-col gap-1.5">
          <span className="text-caption text-fg-subtle">Video URL (optional)</span>
          {draft.videoUrl ? (
            <MediaPreview
              url={draft.videoUrl}
              icon={<Video className="size-5" />}
              onRemove={() => onChange({ ...draft, videoUrl: "" })}
            />
          ) : (
            <Input
              value={draft.videoUrl}
              onChange={(e) => onChange({ ...draft, videoUrl: e.target.value })}
              placeholder="https://youtube.com/... or a hosted video URL"
            />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-caption text-fg-subtle">Image URL (optional)</span>
          {draft.imageUrl ? (
            <div className="relative w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={draft.imageUrl}
                alt=""
                className="h-24 w-24 rounded-control border border-line object-cover"
              />
              <button
                type="button"
                onClick={() => onChange({ ...draft, imageUrl: "" })}
                aria-label="Remove image"
                className="absolute -top-2 -right-2 flex size-6 cursor-pointer items-center justify-center rounded-full bg-contrast text-contrast-fg"
              >
                <X className="size-3" />
              </button>
            </div>
          ) : (
            <Input
              value={draft.imageUrl}
              onChange={(e) => onChange({ ...draft, imageUrl: e.target.value })}
              placeholder="A hosted image URL"
            />
          )}
        </div>
      </div>
    </>
  );
}

function MediaPreview({
  url,
  icon,
  onRemove,
}: {
  url: string;
  icon: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-control border border-line bg-sunken px-3 py-2.5">
      <span className="flex min-w-0 items-center gap-2">
        {icon}
        <span className="truncate text-body-sm text-fg-muted">{url}</span>
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 cursor-pointer text-caption text-danger underline-offset-4 hover:underline"
      >
        Remove
      </button>
    </div>
  );
}
