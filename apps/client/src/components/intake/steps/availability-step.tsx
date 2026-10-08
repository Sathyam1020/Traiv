"use client";

import { ChoiceCard } from "@traiv/ui/components/choice-card";
import { useState } from "react";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

const DAYS = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
] as const;

const TIMES = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "varies", label: "It changes week to week" },
] as const;

/** Last one, so it says so — people finish a thing they can see the end of. */
export function AvailabilityStep({ flow }: { flow: IntakeFlow }) {
  const [days, setDays] = useState<string[]>(flow.intake?.trainingDays ?? []);
  const [time, setTime] = useState<string | null>(flow.intake?.preferredTime ?? null);

  const toggle = (v: string) =>
    setDays((d) => (d.includes(v) ? d.filter((x) => x !== v) : [...d, v]));

  return (
    <StepShell
      step={6}
      title="When can you train?"
      blurb="Last one. Your plan gets built around the days you actually have."
      busy={flow.busy}
      error={flow.error}
      continueLabel="Finish"
      onBack={flow.back}
      canContinue={days.length > 0 && time !== null}
      onContinue={() =>
        flow.next(6, {
          ...(days.length ? { trainingDays: days } : {}),
          ...(time ? { preferredTime: time } : {}),
        })
      }
    >
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-body-sm font-medium">Days that work</legend>
        <div className="grid grid-cols-4 gap-2">
          {DAYS.map((d) => {
            const selected = days.includes(d.value);
            return (
              <button
                key={d.value}
                type="button"
                aria-pressed={selected}
                onClick={() => toggle(d.value)}
                className={`cursor-pointer rounded-control border py-2.5 text-body-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus ${
                  selected
                    ? "border-brand bg-brand-subtle font-medium text-fg"
                    : "border-line-strong bg-surface text-fg-muted hover:bg-hover"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-2 flex flex-col gap-2">
        <legend className="mb-2 text-body-sm font-medium">Time of day you prefer</legend>
        <div className="flex flex-col gap-2">
          {TIMES.map((t) => (
            <ChoiceCard
              key={t.value}
              label={t.label}
              selected={time === t.value}
              onClick={() => setTime(t.value)}
            />
          ))}
        </div>
      </fieldset>
    </StepShell>
  );
}
