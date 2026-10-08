"use client";

import { ChoiceCard } from "@traiv/ui/components/choice-card";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { useState } from "react";
import type { Goal } from "@/lib/api";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

const GOALS: readonly { value: Goal; label: string }[] = [
  { value: "lose_fat", label: "Lose fat" },
  { value: "build_muscle", label: "Build muscle" },
  { value: "get_stronger", label: "Get stronger" },
  { value: "maintain", label: "Maintain weight" },
  { value: "improve_fitness", label: "Improve fitness" },
  { value: "general_health", label: "General health" },
];

/** Only these three imply a number on a scale. Nobody has a goal weight for "get stronger". */
const HAS_TARGET_WEIGHT = new Set<Goal>(["lose_fat", "build_muscle", "maintain"]);

export function GoalStep({ flow }: { flow: IntakeFlow }) {
  const [goal, setGoal] = useState<Goal | null>(flow.intake?.goal ?? null);
  const [target, setTarget] = useState(
    flow.intake?.targetWeightKg ? String(flow.intake.targetWeightKg) : "",
  );

  const targetKg = Number(target);
  const targetValid = target.trim() !== "" && targetKg >= 25 && targetKg <= 400;

  return (
    <StepShell
      step={1}
      title="What do you want to get out of this?"
      blurb="Your coach uses this to decide what your first few weeks look like."
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue={goal !== null}
      onContinue={() =>
        flow.next(1, {
          ...(goal ? { goal } : {}),
          ...(goal && HAS_TARGET_WEIGHT.has(goal) && targetValid
            ? { targetWeightKg: targetKg }
            : {}),
        })
      }
    >
      {GOALS.map((g) => (
        <ChoiceCard
          key={g.value}
          label={g.label}
          selected={goal === g.value}
          onClick={() => setGoal(g.value)}
        />
      ))}

      {goal && HAS_TARGET_WEIGHT.has(goal) ? (
        <div className="mt-2 flex flex-col gap-2">
          <Label htmlFor="target-weight">
            Weight you're aiming for <span className="font-normal text-fg-subtle">(optional)</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="target-weight"
              inputMode="decimal"
              value={target}
              onChange={(e) => setTarget(e.target.value.replace(/[^\d.]/g, "").slice(0, 5))}
              placeholder="62"
              className="tabular-nums"
            />
            <span className="text-body-sm text-fg-muted">kg</span>
          </div>
          <p className="text-caption text-fg-subtle">
            Leave this blank if you don't have a number in mind.
          </p>
        </div>
      ) : null}
    </StepShell>
  );
}
