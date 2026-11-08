"use client";

import { useState } from "react";
import { IngredientTags } from "../ingredient-tags";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

export function IngredientExclusionStep({
  flow,
  studioId,
}: {
  flow: IntakeFlow;
  studioId: string;
}) {
  const [excluded, setExcluded] = useState<string[]>(flow.intake?.excludedIngredients ?? []);

  return (
    <StepShell
      step={11}
      title="Ingredient Exclusion"
      blurb="Select ingredients you want to avoid in your meal plans."
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue
      onContinue={() => flow.next(11, excluded.length ? { excludedIngredients: excluded } : {})}
    >
      <IngredientTags studioId={studioId} value={excluded} onChange={setExcluded} />
    </StepShell>
  );
}
