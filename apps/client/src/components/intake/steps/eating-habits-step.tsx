"use client";

import { useState } from "react";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";
import { YesNo } from "../yes-no";

/**
 * Five questions, built as specified (founder decision, 2026-11-08) — coach-visible
 * only, nothing here is interpreted by software. All five are required: a partial
 * screening answered for three of five questions is not useful to a coach the way a
 * complete one is.
 */
const QUESTIONS = [
  {
    key: "edInduceVomiting",
    label: "Have you tried to induce vomiting due to feeling uncomfortably full?",
  },
  { key: "edFoodDominates", label: "Do you feel that food dominates your life?" },
  { key: "edRecentWeightLoss", label: "Have you lost more than 6kg in a 3-month period recently?" },
  {
    key: "edBodyImageMismatch",
    label: "Do you see yourself as fat when others say you are too thin?",
  },
  { key: "edLossOfControl", label: "Are you worried about losing control over how much you eat?" },
] as const;

type Key = (typeof QUESTIONS)[number]["key"];

export function EatingHabitsStep({ flow }: { flow: IntakeFlow }) {
  const [answers, setAnswers] = useState<Record<Key, boolean | null>>({
    edInduceVomiting: flow.intake?.edInduceVomiting ?? null,
    edFoodDominates: flow.intake?.edFoodDominates ?? null,
    edRecentWeightLoss: flow.intake?.edRecentWeightLoss ?? null,
    edBodyImageMismatch: flow.intake?.edBodyImageMismatch ?? null,
    edLossOfControl: flow.intake?.edLossOfControl ?? null,
  });

  const allAnswered = QUESTIONS.every((q) => answers[q.key] !== null);

  return (
    <StepShell
      step={12}
      title="Eating Habits"
      blurb="Answer the questions below to help us understand your relationship with food and eating habits."
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue={allAnswered}
      onContinue={() =>
        flow.next(
          12,
          allAnswered
            ? (Object.fromEntries(QUESTIONS.map((q) => [q.key, answers[q.key]])) as Record<
                Key,
                boolean
              >)
            : {},
        )
      }
    >
      {QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-body-sm font-medium">{q.label}</p>
          <YesNo
            value={answers[q.key]}
            onChange={(v) => setAnswers((a) => ({ ...a, [q.key]: v }))}
          />
        </div>
      ))}
    </StepShell>
  );
}
