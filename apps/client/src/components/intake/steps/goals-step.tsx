"use client";

import { ChoiceCard } from "@traiv/ui/components/choice-card";
import { Dumbbell, type Icon, TrendingDown, Zap } from "@traiv/ui/icons";
import { useState } from "react";
import type { Goal } from "@/lib/api";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

const GOALS: readonly { value: Goal; label: string; icon: Icon }[] = [
  { value: "lose_fat", label: "Lose Weight", icon: TrendingDown },
  { value: "build_muscle", label: "Build Muscle", icon: Dumbbell },
  { value: "general_health", label: "Build Healthy Habits", icon: Zap },
];

export function GoalsStep({ flow }: { flow: IntakeFlow }) {
  const [goal, setGoal] = useState<Goal | null>(flow.intake?.goal ?? null);

  return (
    <StepShell
      step={3}
      title="Goals"
      blurb="What are your goals?"
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue={goal !== null}
      onContinue={() => flow.next(3, goal ? { goal } : {})}
    >
      {GOALS.map((g) => (
        <ChoiceCard
          key={g.value}
          label={g.label}
          icon={g.icon}
          selected={goal === g.value}
          onClick={() => setGoal(g.value)}
        />
      ))}
    </StepShell>
  );
}
