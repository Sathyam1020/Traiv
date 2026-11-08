"use client";

import { Input } from "@traiv/ui/components/input";
import { useEffect, useMemo, useState } from "react";
import { apiErrorMessage } from "@/lib/api/client";
import { cmToInches, inchesToCm, type LengthUnit } from "@/lib/length-units";
import { useMeasurements } from "@/lib/query/use-measurements";
import { FieldsSkeleton } from "../fields-skeleton";
import { saveOnboardingMeasurement, useOnboardingMetrics } from "../onboarding-measurements";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

/** Rounded border, no ring — see `personal-info-step.tsx` for why. */
const FOCUS = "focus:outline-none focus-visible:outline-none focus:border-brand";

/**
 * Writes straight to the shared measurement system (`saveOnboardingMeasurement`), not
 * this flow's own `IntakePatch` — these are the same `arm`/`chest`/`forearm`/`hips`/
 * `thigh`/`waist` metrics the coach's "Add measurement" sheet already uses, so a value
 * entered here shows up in the client's own history immediately, not a second copy only
 * onboarding can see.
 *
 * A studio chooses which metrics it shares with clients, so the catalog is read live:
 * a field only renders if that studio actually has it turned on, and only the fields
 * that do render are required to continue.
 */
const FIELDS: readonly { code: string; label: string }[] = [
  { code: "arm", label: "Arm" },
  { code: "chest", label: "Chest" },
  { code: "forearm", label: "Forearm" },
  { code: "hips", label: "Hip" },
  { code: "thigh", label: "Thigh" },
  { code: "waist", label: "Waist" },
];

export function CircumferenceStep({ flow, studioId }: { flow: IntakeFlow; studioId: string }) {
  const metrics = useOnboardingMetrics(studioId);
  // Stepping back to an earlier screen and forward again remounts this component — without
  // reading back what was already saved, every field would show empty and ask again for
  // measurements the client already entered.
  const history = useMeasurements(studioId);
  const saved = useMemo(() => {
    const latest: Record<string, { value: number; takenAt: string }> = {};
    for (const entry of history.data?.entries ?? []) {
      for (const f of FIELDS) {
        const value = entry.values[f.code];
        if (value == null) continue;
        const existing = latest[f.code];
        if (!existing || entry.takenAt > existing.takenAt) {
          latest[f.code] = { value, takenAt: entry.takenAt };
        }
      }
    }
    return Object.fromEntries(Object.entries(latest).map(([code, v]) => [code, String(v.value)]));
  }, [history.data]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [prefilled, setPrefilled] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const loading = metrics.isPending || history.isPending;

  // One unit for every field, not six — a client picks cm or inches once for their
  // whole body, the same way the height field earlier in this flow does. `values`
  // always holds raw text in *this* unit; toggling converts what's already typed
  // rather than losing it.
  const [unit, setUnit] = useState<LengthUnit>("cm");
  function toggleUnit() {
    setUnit((old) => {
      const next = old === "cm" ? "in" : "cm";
      setValues((v) =>
        Object.fromEntries(
          Object.entries(v).map(([code, raw]) => {
            const n = Number(raw);
            if (!raw.trim() || !Number.isFinite(n)) return [code, raw];
            return [code, String(old === "cm" ? cmToInches(n) : inchesToCm(n))];
          }),
        ),
      );
      return next;
    });
  }
  // The cm-equivalent of a field's raw text, regardless of which unit is on screen —
  // every validity check and the save itself works in cm, same as the server does.
  const toCm = (raw: string | undefined): number | null => {
    const n = Number(raw);
    if (!raw?.trim() || !Number.isFinite(n)) return null;
    return unit === "cm" ? n : inchesToCm(n);
  };

  useEffect(() => {
    if (prefilled || loading) return;
    setValues((v) => ({ ...saved, ...v }));
    setPrefilled(true);
  }, [prefilled, loading, saved]);

  const available = FIELDS.filter((f) => metrics.data?.some((m) => m.code === f.code));
  const allFilled =
    available.length > 0 &&
    available.every((f) => {
      const cm = toCm(values[f.code]);
      return cm != null && cm > 0 && cm <= 300;
    });
  // A studio with none of these metrics shared has nothing to ask here — do not block
  // onboarding on a measurement that does not exist.
  const canContinue = !loading && (available.length === 0 || allFilled);

  async function submit() {
    setSaveError(null);
    setSubmitting(true);
    try {
      await Promise.all(
        available.map((f) => {
          const metricId = metrics.data?.find((m) => m.code === f.code)?.id;
          const cm = toCm(values[f.code]);
          return metricId && cm != null && cm > 0
            ? saveOnboardingMeasurement(studioId, metricId, cm)
            : undefined;
        }),
      );
      await flow.next(6, {});
    } catch (err) {
      setSaveError(apiErrorMessage(err, "Couldn't save your measurements. Try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <StepShell
      step={6}
      title="Circumference Measurement"
      blurb="Enter your measurements in the fields below"
      busy={flow.busy || loading || submitting}
      error={flow.error ?? saveError}
      onBack={flow.back}
      canContinue={canContinue}
      onContinue={() => void submit()}
    >
      {loading ? (
        <FieldsSkeleton rows={6} />
      ) : (
        <div className="flex flex-col gap-2">
          {available.length > 0 ? (
            <button
              type="button"
              onClick={toggleUnit}
              className="ml-auto cursor-pointer text-caption text-fg-muted underline-offset-2 transition-colors hover:text-fg hover:underline"
            >
              {unit === "cm" ? "Use inches" : "Use centimetres"}
            </button>
          ) : null}
          <div className="flex flex-col divide-y divide-line rounded-surface border border-line bg-surface">
            {available.map((f) => (
              <label
                key={f.code}
                htmlFor={`circumference-${f.code}`}
                className="flex items-center justify-between gap-3 px-4 py-3.5"
              >
                <span className="flex flex-col">
                  <span className="text-body-sm font-medium">{f.label}</span>
                  <span className="text-caption text-fg-subtle">Required</span>
                </span>
                <div className="flex items-center gap-2">
                  <Input
                    id={`circumference-${f.code}`}
                    inputMode="decimal"
                    value={values[f.code] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        [f.code]: e.target.value.replace(/[^\d.]/g, "").slice(0, 5),
                      }))
                    }
                    placeholder="0"
                    inputClassName={`w-20 border-none bg-transparent px-0 text-right tabular-nums shadow-none ${FOCUS}`}
                  />
                  <span className="text-body-sm text-fg-muted">{unit}</span>
                </div>
              </label>
            ))}
            {available.length === 0 ? (
              <p className="px-4 py-6 text-center text-body-sm text-fg-muted">
                Your coach hasn't enabled circumference measurements yet.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </StepShell>
  );
}
