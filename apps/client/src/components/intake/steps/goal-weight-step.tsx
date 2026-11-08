"use client";

import { useState } from "react";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";
import { WeightRulerSlider } from "../weight-ruler-slider";

/** The slider always holds a value, so unlike most of this flow there is nothing to
 * validate — the only question is whether they touch it before continuing. */
export function GoalWeightStep({ flow }: { flow: IntakeFlow }) {
  const [target, setTarget] = useState(flow.intake?.targetWeightKg ?? flow.weightKg ?? 60);

  return (
    <StepShell
      step={5}
      title="Goal Weight"
      blurb="Select your goal weight"
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue
      onContinue={() => flow.next(5, { targetWeightKg: target })}
    >
      <div className="py-6">
        <WeightRulerSlider value={target} onChange={setTarget} />
      </div>
    </StepShell>
  );
}
