"use client";

import { Camera, Plus } from "@traiv/ui/icons";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { uploadApi } from "@/lib/api";
import { useMeasurements } from "@/lib/query/use-measurements";
import { saveOnboardingMeasurement, useOnboardingMetrics } from "../onboarding-measurements";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

/** Same `photo_front`/`photo_side`/`photo_back` metrics the coach's measurement sheet
 * already shows, and the same upload call it already makes (`uploadApi.sign(studioId)`
 * with no `kind` — matching `MeasurementEditor`'s existing image-upload branch exactly,
 * not a new path). Every slot the studio shares is mandatory here. */
const SLOTS: readonly { code: string; label: string }[] = [
  { code: "photo_back", label: "Back Photo" },
  { code: "photo_front", label: "Front Photo" },
  { code: "photo_side", label: "Side Photo" },
];

export function ProgressionPhotosStep({ flow, studioId }: { flow: IntakeFlow; studioId: string }) {
  const metrics = useOnboardingMetrics(studioId);
  // `previews` only holds what was picked *this* visit — stepping back and forward
  // remounts this component and loses it, so what's actually "saved" has to come from
  // the measurement history itself (the same source the step just wrote to), not local
  // state. The latest entry carrying each code's image wins, same as the coach's own
  // measurement sheet.
  const history = useMeasurements(studioId);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const saved = useMemo(() => {
    const byCode: Record<string, { url: string; takenAt: string }> = {};
    for (const entry of history.data?.entries ?? []) {
      for (const [code, url] of Object.entries(entry.imageUrls)) {
        const existing = byCode[code];
        if (!existing || entry.takenAt > existing.takenAt)
          byCode[code] = { url, takenAt: entry.takenAt };
      }
    }
    return Object.fromEntries(Object.entries(byCode).map(([code, v]) => [code, v.url]));
  }, [history.data]);
  // A fresh upload this visit always wins over whatever history still shows, so the
  // thumbnail updates immediately rather than waiting on the history query to refetch.
  const shown = { ...saved, ...previews };

  async function choose(code: string, file: File) {
    const metricId = metrics.data?.find((m) => m.code === code)?.id;
    if (!metricId) return;
    setUploadError(null);
    setUploading(code);
    try {
      const url = await uploadApi.put(await uploadApi.sign(studioId), file);
      await saveOnboardingMeasurement(studioId, metricId, url);
      setPreviews((p) => ({ ...p, [code]: url }));
    } catch {
      setUploadError("Couldn't upload that photo. Try again.");
    } finally {
      setUploading(null);
    }
  }

  const available = SLOTS.filter((s) => metrics.data?.some((m) => m.code === s.code));
  const loading = metrics.isPending || history.isPending;
  // All three are mandatory where the studio shares all three — a studio that hasn't
  // turned a slot on at all has nothing to require for it.
  const canContinue = !loading && available.every((s) => Boolean(shown[s.code]));

  return (
    <StepShell
      step={14}
      title="Progression Photos"
      busy={flow.busy || loading || uploading !== null}
      error={flow.error ?? uploadError}
      onBack={flow.back}
      canContinue={canContinue}
      onContinue={() => flow.next(14, {})}
    >
      <div className="grid grid-cols-3 gap-3">
        {loading
          ? Array.from({ length: 3 }, (_, n) => n).map((n) => (
              <div
                key={n}
                className="aspect-[3/4] w-full animate-pulse rounded-surface bg-sunken"
              />
            ))
          : available.map((slot) => (
              <div key={slot.code} className="flex flex-col items-center gap-2">
                <input
                  ref={(el) => {
                    inputs.current[slot.code] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void choose(slot.code, file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => inputs.current[slot.code]?.click()}
                  disabled={uploading === slot.code}
                  aria-label={
                    shown[slot.code]
                      ? `Replace ${slot.label.toLowerCase()}`
                      : `Add ${slot.label.toLowerCase()}`
                  }
                  className="relative flex aspect-[3/4] w-full cursor-pointer items-center justify-center overflow-hidden rounded-surface border border-line-strong bg-surface disabled:cursor-not-allowed"
                >
                  {shown[slot.code] ? (
                    <>
                      <Image
                        src={shown[slot.code] as string}
                        alt=""
                        fill
                        sizes="33vw"
                        className="object-cover"
                      />
                      {/* Tapping the thumbnail re-opens the picker either way — this is
                          what tells a client who uploaded the wrong photo that they can. */}
                      <span className="absolute bottom-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
                        <Camera className="size-3.5" />
                      </span>
                    </>
                  ) : (
                    <span className="flex flex-col items-center gap-1.5 text-fg-subtle">
                      <Plus className="size-5" />
                      <span className="text-caption">
                        {uploading === slot.code ? "Uploading…" : "Add"}
                      </span>
                    </span>
                  )}
                  {uploading === slot.code && shown[slot.code] ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-caption font-medium text-white">
                      Uploading…
                    </span>
                  ) : null}
                </button>
                <span className="text-caption text-fg-muted">{slot.label}</span>
              </div>
            ))}
      </div>
    </StepShell>
  );
}
