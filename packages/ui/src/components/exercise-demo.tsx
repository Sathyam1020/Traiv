"use client";

import { Dumbbell } from "@traiv/ui/icons";
import { useState } from "react";

/** One player for trainer, PWA and native WebViews. Video bytes stay on the provider CDN. */
export function ExerciseDemo({
  src,
  poster,
  name,
  aspectRatio,
}: {
  src?: string | null;
  poster?: string | null;
  name: string;
  aspectRatio?: string | null;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [failedPoster, setFailedPoster] = useState<string | null>(null);
  const validRatio = aspectRatio?.match(/^(\d+):(\d+)$/);
  const ratio =
    validRatio && Number(validRatio[2]) > 0 ? `${validRatio[1]} / ${validRatio[2]}` : "16 / 9";
  return (
    <div
      className="mx-auto flex max-h-[360px] w-full items-center justify-center overflow-hidden rounded-control bg-sunken"
      style={{ aspectRatio: ratio }}
    >
      {src && src !== failedSrc ? (
        <video
          key={src}
          src={src}
          poster={poster ?? undefined}
          aria-label={`${name} demonstration`}
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
          onError={() => setFailedSrc(src)}
          className="h-full max-h-[360px] w-full object-contain"
        />
      ) : poster && poster !== failedPoster ? (
        <img
          src={poster}
          alt={name}
          onError={() => setFailedPoster(poster)}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 p-5 text-center text-fg-subtle">
          <Dumbbell className="size-8" />
          <p className="text-sm">
            {src ? "Demonstration temporarily unavailable" : "No demonstration available"}
          </p>
        </div>
      )}
    </div>
  );
}
