"use client";

import { ChoiceCard } from "@traiv/ui/components/choice-card";
import { useState } from "react";
import type { ActivityLevel, Experience } from "@/lib/api";
import { Chips } from "../chips";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

/**
 * Described by what a day looks like, not by a word like "moderate" — which means
 * something different to a delivery rider and to someone at a desk, and gets picked by
 * vibe otherwise.
 */
const ACTIVITY: readonly { value: ActivityLevel; label: string; hint: string }[] = [
  { value: "sedentary", label: "Mostly sitting", hint: "Desk work, little walking" },
  { value: "light", label: "Lightly active", hint: "Some walking through the day" },
  { value: "moderate", label: "On your feet a fair bit", hint: "Teaching, retail, errands" },
  { value: "very", label: "Active most of the day", hint: "Physical job, lots of walking" },
  { value: "extra", label: "Very physical work", hint: "Labour, or training twice a day" },
];

const EXPERIENCE: readonly { value: Experience; label: string; hint: string }[] = [
  { value: "new", label: "New to this", hint: "Never trained properly, or starting again" },
  { value: "some", label: "Some experience", hint: "Trained on and off" },
  { value: "experienced", label: "Experienced", hint: "Train regularly and know the lifts" },
];

const EQUIPMENT = [
  { value: "full_gym", label: "Full gym" },
  { value: "home_basics", label: "Home setup" },
  { value: "dumbbells", label: "Dumbbells only" },
  { value: "bands", label: "Resistance bands" },
  { value: "bodyweight", label: "Nothing — bodyweight" },
] as const;

const DAYS = [2, 3, 4, 5, 6].map((n) => ({ value: n, label: String(n) }));
const MINUTES = [30, 45, 60, 90].map((n) => ({ value: n, label: `${n} min` }));

export function TrainingStep({ flow }: { flow: IntakeFlow }) {
  const [activity, setActivity] = useState<ActivityLevel | null>(
    flow.intake?.dailyActivity ?? null,
  );
  const [experience, setExperience] = useState<Experience | null>(flow.intake?.experience ?? null);
  const [days, setDays] = useState<number | null>(flow.intake?.daysPerWeek ?? null);
  const [minutes, setMinutes] = useState<number | null>(flow.intake?.sessionMinutes ?? null);
  const [equipment, setEquipment] = useState<string[]>(flow.intake?.equipment ?? []);

  const toggle = (v: string) =>
    setEquipment((e) => (e.includes(v) ? e.filter((x) => x !== v) : [...e, v]));

  return (
    <StepShell
      step={3}
      title="How you move right now"
      blurb="Two people the same size can need very different amounts of food depending on their day."
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue={
        activity !== null &&
        experience !== null &&
        days !== null &&
        minutes !== null &&
        equipment.length > 0
      }
      onContinue={() =>
        flow.next(3, {
          ...(activity ? { dailyActivity: activity } : {}),
          ...(experience ? { experience } : {}),
          ...(days ? { daysPerWeek: days } : {}),
          ...(minutes ? { sessionMinutes: minutes } : {}),
          ...(equipment.length ? { equipment } : {}),
        })
      }
    >
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-body-sm font-medium">A normal day for you</legend>
        <div className="flex flex-col gap-2">
          {ACTIVITY.map((a) => (
            <ChoiceCard
              key={a.value}
              label={a.label}
              hint={a.hint}
              selected={activity === a.value}
              onClick={() => setActivity(a.value)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-2 flex flex-col gap-2">
        <legend className="mb-2 text-body-sm font-medium">Training behind you</legend>
        <div className="flex flex-col gap-2">
          {EXPERIENCE.map((e) => (
            <ChoiceCard
              key={e.value}
              label={e.label}
              hint={e.hint}
              selected={experience === e.value}
              onClick={() => setExperience(e.value)}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-2">
        <Chips label="Days a week you can train" options={DAYS} value={days} onChange={setDays} />
      </div>

      <div className="mt-2">
        <Chips
          label="Time you have per session"
          options={MINUTES}
          value={minutes}
          onChange={setMinutes}
        />
      </div>

      <fieldset className="mt-2 flex flex-col gap-2">
        <legend className="mb-2 text-body-sm font-medium">What you can train with</legend>
        <div className="flex flex-col gap-2">
          {EQUIPMENT.map((e) => (
            <ChoiceCard
              key={e.value}
              multi
              label={e.label}
              selected={equipment.includes(e.value)}
              onClick={() => toggle(e.value)}
            />
          ))}
        </div>
      </fieldset>
    </StepShell>
  );
}
