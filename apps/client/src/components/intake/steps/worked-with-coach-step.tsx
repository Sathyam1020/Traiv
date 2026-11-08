"use client";

import { ChoiceCard } from "@traiv/ui/components/choice-card";
import { useState } from "react";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

export function WorkedWithCoachStep({ flow }: { flow: IntakeFlow }) {
  const [worked, setWorked] = useState<boolean | null>(flow.intake?.workedWithCoach ?? null);

  return (
    <StepShell
      step={7}
      title="Have you worked with a coach before?"
      blurb="Just so I know your experience level"
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue={worked !== null}
      onContinue={() => flow.next(7, worked !== null ? { workedWithCoach: worked } : {})}
    >
      <ChoiceCard label="Yes" selected={worked === true} onClick={() => setWorked(true)} />
      <ChoiceCard label="No" selected={worked === false} onClick={() => setWorked(false)} />
    </StepShell>
  );
}
