"use client";

import { Input } from "@traiv/ui/components/input";
import { useState } from "react";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

/** Rounded border, no ring — see `personal-info-step.tsx` for why. */
const FOCUS = "focus:outline-none focus-visible:outline-none focus:border-brand";

/** Weight alone, now that name/DOB/sex/height have their own screen — `weightKg`
 * still routes to `body_metric`, never this table, the same as every other write to
 * it. See `saveStep`. */
export function BodyMeasurementStep({ flow }: { flow: IntakeFlow }) {
  const [weight, setWeight] = useState(flow.weightKg ? String(flow.weightKg) : "");
  const weightNum = Number(weight);
  const valid = weight.trim() !== "" && weightNum >= 25 && weightNum <= 400;

  return (
    <StepShell
      step={4}
      title="Body Measurement"
      blurb="Enter your measurements in the fields below"
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue={valid}
      onContinue={() => flow.next(4, valid ? { weightKg: weightNum } : {})}
    >
      <div className="flex items-center justify-between gap-3 rounded-surface border border-line-strong bg-surface px-4 py-3.5">
        <span className="text-body-sm font-medium">Weight</span>
        <div className="flex items-center gap-2">
          <Input
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value.replace(/[^\d.]/g, "").slice(0, 5))}
            placeholder="68"
            inputClassName={`w-24 border-none bg-transparent px-0 text-right text-heading font-semibold tabular-nums shadow-none ${FOCUS}`}
          />
          <span className="text-body-sm text-fg-muted">kg</span>
        </div>
      </div>
    </StepShell>
  );
}
