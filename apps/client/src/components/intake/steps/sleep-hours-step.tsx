"use client";

import { Input } from "@traiv/ui/components/input";
import { useEffect, useMemo, useState } from "react";
import { apiErrorMessage } from "@/lib/api/client";
import { useMeasurements } from "@/lib/query/use-measurements";
import { FieldsSkeleton } from "../fields-skeleton";
import { saveOnboardingMeasurement, useOnboardingMetrics } from "../onboarding-measurements";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

/** Rounded border, no ring — see `personal-info-step.tsx` for why. */
const FOCUS = "focus:outline-none focus-visible:outline-none focus:border-brand";

/** `sleep_hours` is an existing measurement code (distinct from `sleep_quality`, a
 * 1-5 rating) — writing it here is the same write path the coach's measurement sheet
 * uses, so it shows up in the client's own history, not a second, onboarding-only copy. */
export function SleepHoursStep({ flow, studioId }: { flow: IntakeFlow; studioId: string }) {
  const metrics = useOnboardingMetrics(studioId);
  // Stepping back to an earlier screen and forward again remounts this component — without
  // reading back what was already saved, the field would show empty and ask again for
  // something the client already answered.
  const history = useMeasurements(studioId);
  const saved = useMemo(() => {
    let latest: { value: number; takenAt: string } | null = null;
    for (const entry of history.data?.entries ?? []) {
      const value = entry.values.sleep_hours;
      if (value == null) continue;
      if (!latest || entry.takenAt > latest.takenAt) latest = { value, takenAt: entry.takenAt };
    }
    return latest?.value ?? null;
  }, [history.data]);

  const [hours, setHours] = useState("");
  const [prefilled, setPrefilled] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (prefilled || saved == null) return;
    setHours(String(saved));
    setPrefilled(true);
  }, [prefilled, saved]);

  const metricId = metrics.data?.find((m) => m.code === "sleep_hours")?.id;
  const n = Number(hours);
  const valid = hours.trim() !== "" && n > 0 && n <= 24;
  const loading = metrics.isPending || history.isPending;

  async function submit() {
    setSaveError(null);
    setSubmitting(true);
    try {
      if (valid && metricId) await saveOnboardingMeasurement(studioId, metricId, n);
      await flow.next(9, {});
    } catch (err) {
      setSaveError(apiErrorMessage(err, "Couldn't save that. Try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <StepShell
      step={9}
      title="How many hours of sleep do you typically get?"
      blurb="Your best estimate"
      busy={flow.busy || loading || submitting}
      error={flow.error ?? saveError}
      onBack={flow.back}
      canContinue={!loading}
      onContinue={() => void submit()}
    >
      {loading ? (
        <FieldsSkeleton rows={1} />
      ) : (
        <Input
          inputMode="decimal"
          value={hours}
          onChange={(e) => setHours(e.target.value.replace(/[^\d.]/g, "").slice(0, 4))}
          placeholder="8"
          aria-label="Hours of sleep"
          inputClassName={`h-32 text-2xl tabular-nums ${FOCUS}`}
        />
      )}
    </StepShell>
  );
}
