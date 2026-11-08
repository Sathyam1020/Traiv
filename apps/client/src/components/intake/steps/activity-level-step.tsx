"use client";

import { ChoiceCard } from "@traiv/ui/components/choice-card";
import { useState } from "react";
import type { ActivityLevel, Experience } from "@/lib/api";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

type WorkActivity = "sedentary" | "light" | "moderate" | "heavy" | "very_heavy";

const WORK_ACTIVITY: readonly { value: WorkActivity; label: string; hint: string }[] = [
  { value: "sedentary", label: "Sedentary", hint: "Desk job, mostly sitting" },
  { value: "light", label: "Light Activity", hint: "Office work with some walking" },
  { value: "moderate", label: "Moderate Activity", hint: "Standing, walking regularly" },
  { value: "heavy", label: "Heavy Activity", hint: "Physical labor, construction" },
  { value: "very_heavy", label: "Very Heavy Activity", hint: "Intense physical work" },
];

/** Reuses the existing `dailyActivity` field the nutrition calculator already depends
 * on — this question is leisure exercise frequency, the same thing that column has
 * always meant, just asked here under the reference product's own wording. */
const LEISURE_ACTIVITY: readonly { value: ActivityLevel; label: string; hint: string }[] = [
  { value: "sedentary", label: "Sedentary", hint: "Little to no exercise" },
  { value: "light", label: "Light Activity", hint: "1-3 days per week" },
  { value: "moderate", label: "Moderate Activity", hint: "3-5 days per week" },
  { value: "very", label: "Heavy Activity", hint: "6-7 days per week" },
  { value: "extra", label: "Very Heavy Activity", hint: "2x per day or intense training" },
];

const EXPERIENCE: readonly { value: Experience; label: string; hint: string }[] = [
  { value: "new", label: "Beginner", hint: "New to exercise or returning after a break" },
  { value: "some", label: "Intermediate", hint: "6+ months of consistent training" },
  {
    value: "experienced",
    label: "Advanced",
    hint: "2+ years of experience with various exercises",
  },
];

const LOCATIONS = [
  { value: "home", label: "Home", hint: "Home workouts, bodyweight exercises" },
  { value: "gym", label: "Gym", hint: "Fitness center, equipment access" },
  { value: "outdoors", label: "Outdoors", hint: "Parks, running trails, outdoor sports" },
] as const;

export function ActivityLevelStep({ flow }: { flow: IntakeFlow }) {
  // Work and leisure activity are pre-selected to the common case, matching the
  // reference screens — experience and training location are not, and Continue stays
  // disabled until both are answered.
  const [workActivity, setWorkActivity] = useState<WorkActivity>(
    (flow.intake?.workActivity as WorkActivity | null) ?? "sedentary",
  );
  const [leisure, setLeisure] = useState<ActivityLevel>(flow.intake?.dailyActivity ?? "sedentary");
  const [experience, setExperience] = useState<Experience | null>(flow.intake?.experience ?? null);
  const [locations, setLocations] = useState<string[]>(flow.intake?.trainingLocations ?? []);

  const toggle = (v: string) =>
    setLocations((l) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v]));

  return (
    <StepShell
      step={10}
      title="Activity Level"
      blurb="Answer the questions below to help us understand your activity level."
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue={experience !== null && locations.length > 0}
      onContinue={() =>
        flow.next(10, {
          workActivity,
          dailyActivity: leisure,
          ...(experience ? { experience } : {}),
          ...(locations.length ? { trainingLocations: locations } : {}),
        })
      }
    >
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-body-sm font-medium">Activity Level at Work</legend>
        <p className="mb-2 text-caption text-fg-subtle">
          How would you describe your typical workday activity?
        </p>
        <div className="flex flex-col gap-2">
          {WORK_ACTIVITY.map((a) => (
            <ChoiceCard
              key={a.value}
              label={a.label}
              hint={a.hint}
              selected={workActivity === a.value}
              onClick={() => setWorkActivity(a.value)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-2 flex flex-col gap-2">
        <legend className="mb-1 text-body-sm font-medium">Leisure Time Activity</legend>
        <p className="mb-2 text-caption text-fg-subtle">
          How often do you exercise or engage in physical activities?
        </p>
        <div className="flex flex-col gap-2">
          {LEISURE_ACTIVITY.map((a) => (
            <ChoiceCard
              key={a.value}
              label={a.label}
              hint={a.hint}
              selected={leisure === a.value}
              onClick={() => setLeisure(a.value)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-2 flex flex-col gap-2">
        <legend className="mb-1 text-body-sm font-medium">Exercise Experience</legend>
        <p className="mb-2 text-caption text-fg-subtle">
          What is your current level of exercise experience?
        </p>
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

      <fieldset className="mt-2 flex flex-col gap-2">
        <legend className="mb-1 text-body-sm font-medium">Training Preferences</legend>
        <p className="mb-2 text-caption text-fg-subtle">
          Where do you prefer to exercise or train? (Select all that apply)
        </p>
        <div className="flex flex-col gap-2">
          {LOCATIONS.map((l) => (
            <ChoiceCard
              key={l.value}
              multi
              label={l.label}
              hint={l.hint}
              selected={locations.includes(l.value)}
              onClick={() => toggle(l.value)}
            />
          ))}
        </div>
      </fieldset>
    </StepShell>
  );
}
