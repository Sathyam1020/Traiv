"use client";

import {
  type ActivityLevel,
  type DietType,
  energyTarget,
  type Goal,
  type HealthFlag,
  type ReviewReason,
  type Sex,
} from "@traiv/nutrition";
import { ToggleGroup, ToggleGroupItem } from "@traiv/ui/components/toggle-group";
import { useState } from "react";
import { Choice, Field, FieldGroup, NumberField } from "@/components/tool-controls";

/**
 * The public macro calculator.
 *
 * It calls `energyTarget` from `@traiv/nutrition` — the same function the product calls,
 * not a copy of the arithmetic. That is the whole point of the tool: the number a coach
 * gets on a free page is the number their client gets inside Traiv, and if we ever changed
 * the equation this page would change with it.
 *
 * It also shows its working. Every other calculator of this kind returns a number from
 * nowhere; this one prints the BMR, the activity factor and which floor caught it, so a
 * dietitian can check it by hand and a coach can explain it to a client.
 */

const SEXES: { value: Sex; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "undisclosed", label: "Prefer not to say" },
];

const GOALS: { value: Goal; label: string }[] = [
  { value: "lose_fat", label: "Lose fat" },
  { value: "build_muscle", label: "Build muscle" },
  { value: "get_stronger", label: "Get stronger" },
  { value: "maintain", label: "Stay where I am" },
  { value: "improve_fitness", label: "Get fitter" },
  { value: "general_health", label: "General health" },
];

const ACTIVITY: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Desk job, no exercise" },
  { value: "light", label: "Light — a walk most days" },
  { value: "moderate", label: "Moderate — training 3 to 5 days" },
  { value: "very", label: "Active — training 6 or 7 days" },
  { value: "extra", label: "Very active — physical job and training" },
];

const DIETS: { value: DietType; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "non_vegetarian", label: "Eats meat and fish" },
  { value: "eggetarian", label: "Vegetarian plus egg" },
  { value: "vegan", label: "Vegan" },
  { value: "jain", label: "Jain" },
];

const HEALTH: { value: HealthFlag; label: string }[] = [
  { value: "diabetes", label: "Diabetes" },
  { value: "blood_pressure", label: "Blood pressure" },
  { value: "thyroid", label: "Thyroid" },
  { value: "pcos", label: "PCOS" },
  { value: "pregnancy", label: "Pregnant or postpartum" },
  { value: "knee", label: "Knee" },
  { value: "lower_back", label: "Lower back" },
  { value: "shoulder", label: "Shoulder" },
];

/** Why a number needs a person to look at it before anyone eats to it. */
const REVIEW: Record<ReviewReason, string> = {
  pregnancy:
    "Pregnancy and the months after it are not a time to be in a deficit. This shows maintenance, and the number should come from a doctor rather than a calculator.",
  medical_condition:
    "With diabetes, blood pressure or thyroid in the picture, intake belongs with whoever manages the condition. Take this number to them rather than starting on it.",
  underweight:
    "This BMI is below 18.5. Eating less is unlikely to be the right advice, whatever the goal says.",
  target_underweight:
    "The target weight entered would put this BMI under 18.5. Worth a conversation before anybody starts.",
  age_out_of_range:
    "Mifflin-St Jeor was validated on adults between 18 and 70. Outside that it is an estimate rather than a calculation.",
  sex_undisclosed:
    "Without sex the equation splits the difference between the two constants, so this is wider of the mark than the other numbers on the page.",
  protein_hard_on_diet:
    "This much protein on a vegan or Jain diet takes planning. It is reachable, but not by accident.",
  deficit_not_possible:
    "The safety floor for this body sits above its own maintenance, so there is no deficit here that would be safe to run. This is maintenance instead.",
};

const FLOOR: Record<string, string> = {
  none: "Nothing was clamped — this is the goal adjustment applied straight to maintenance.",
  deficit_cap: "Capped at a 750 kcal deficit. Anything steeper costs muscle, not just fat.",
  bmr_floor: "Raised to resting metabolic rate. Nobody should eat below what they burn asleep.",
  absolute_floor: "Raised to the absolute floor — 1,200 kcal for women, 1,500 for men.",
};

export function CalorieCalculator() {
  const [sex, setSex] = useState<Sex>("female");
  const [age, setAge] = useState<number | "">(32);
  const [heightCm, setHeightCm] = useState<number | "">(165);
  const [weightKg, setWeightKg] = useState<number | "">(72);
  const [goal, setGoal] = useState<Goal>("lose_fat");
  const [activity, setActivity] = useState<ActivityLevel>("light");
  const [diet, setDiet] = useState<DietType>("vegetarian");
  const [health, setHealth] = useState<HealthFlag[]>([]);

  const complete = age !== "" && heightCm !== "" && weightKg !== "";
  const target = complete
    ? energyTarget({
        sex,
        age,
        heightCm,
        weightKg,
        goal,
        activity,
        diet,
        health,
      })
    : null;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14">
      <form
        className="flex flex-col gap-5"
        // Nothing to submit. Every result is derived as you type, and there is no server.
        onSubmit={(e) => e.preventDefault()}
      >
        <Field label="Sex">
          {(id) => <Choice id={id} value={sex} onChange={setSex} options={SEXES} />}
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Age">
            {(id) => (
              <NumberField id={id} value={age} onChange={setAge} min={14} max={90} suffix="yrs" />
            )}
          </Field>
          <Field label="Height">
            {(id) => (
              <NumberField
                id={id}
                value={heightCm}
                onChange={setHeightCm}
                min={120}
                max={220}
                suffix="cm"
              />
            )}
          </Field>
        </div>

        <Field label="Weight">
          {(id) => (
            <NumberField
              id={id}
              value={weightKg}
              onChange={setWeightKg}
              min={30}
              max={250}
              suffix="kg"
            />
          )}
        </Field>

        <Field label="Goal">
          {(id) => <Choice id={id} value={goal} onChange={setGoal} options={GOALS} />}
        </Field>

        <Field label="How active is the week" hint="Be honest. Most people pick one step too high.">
          {(id) => <Choice id={id} value={activity} onChange={setActivity} options={ACTIVITY} />}
        </Field>

        <Field label="Diet">
          {(id) => <Choice id={id} value={diet} onChange={setDiet} options={DIETS} />}
        </Field>

        <FieldGroup label="Anything going on" hint="Leave blank if none of these apply.">
          <ToggleGroup
            type="multiple"
            variant="outline"
            value={health}
            onValueChange={(v) => setHealth(v as HealthFlag[])}
            className="flex flex-wrap justify-start gap-2"
          >
            {HEALTH.map((h) => (
              <ToggleGroupItem
                key={h.value}
                value={h.value}
                // Every item its own pill rather than a joined bar: these are unrelated
                // conditions, and a segmented strip implies they are alternatives.
                className="h-auto cursor-pointer rounded-full border px-3.5 py-2 text-body-sm first:rounded-full last:rounded-full data-[state=on]:border-fg data-[state=on]:bg-brand data-[state=on]:text-brand-fg pointer-coarse:h-11 pointer-coarse:px-4 pointer-coarse:py-0"
              >
                {h.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FieldGroup>
      </form>

      {target && complete ? (
        <div className="flex min-w-0 flex-col gap-6">
          <div className="rounded-panel border border-line bg-surface p-6 sm:p-8">
            <p className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
              Daily target
            </p>
            <p className="mt-2 font-display text-[clamp(2.5rem,7vw,3.5rem)] font-semibold tabular-nums leading-none tracking-[-0.04em]">
              {target.kcal.toLocaleString("en-IN")}
              <span className="ml-2 align-middle text-[1rem] font-medium text-fg-subtle">kcal</span>
            </p>

            <dl className="mt-7 grid grid-cols-3 gap-px overflow-hidden rounded-surface border border-line bg-line">
              {[
                { k: "Protein", v: target.protein },
                { k: "Carbs", v: target.carbs },
                { k: "Fat", v: target.fat },
              ].map((m) => (
                <div key={m.k} className="flex flex-col gap-1 bg-surface p-4">
                  <dt className="text-caption text-fg-subtle">{m.k}</dt>
                  <dd className="font-display text-[1.375rem] font-semibold tabular-nums leading-none tracking-[-0.02em]">
                    {m.v}
                    <span className="ml-0.5 text-caption font-medium text-fg-subtle">g</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {target.review.length > 0 ? (
            <div className="flex flex-col gap-3 rounded-surface border border-line-strong bg-sunken p-6">
              <h3 className="text-body font-semibold">
                Somebody should look at this before anyone eats to it
              </h3>
              <ul className="flex flex-col gap-3">
                {target.review.map((r) => (
                  <li key={r} className="text-body-sm leading-relaxed text-fg-muted">
                    {REVIEW[r]}
                  </li>
                ))}
              </ul>
              <p className="text-caption text-fg-subtle">
                Inside Traiv a target with any of these on it waits for a coach rather than going to
                the client automatically.
              </p>
            </div>
          ) : null}

          <div className="rounded-surface border border-line p-6">
            <h3 className="text-body font-semibold">How it got there</h3>
            <dl className="mt-4 flex flex-col">
              <Row
                k="Resting rate (Mifflin-St Jeor)"
                v={`${Math.round(target.basis.bmr).toLocaleString("en-IN")} kcal`}
              />
              <Row k="Activity factor" v={`× ${target.basis.activityFactor}`} />
              <Row
                k="Maintenance"
                v={`${Math.round(target.basis.tdee).toLocaleString("en-IN")} kcal`}
              />
              <Row
                k="Goal adjustment"
                v={`${target.basis.goalAdjustmentPct > 0 ? "+" : ""}${Math.round(
                  target.basis.goalAdjustmentPct * 100,
                )}%`}
              />
              <Row
                k="Before any floor"
                v={`${Math.round(target.basis.unboundedKcal).toLocaleString("en-IN")} kcal`}
              />
              <Row k="BMI" v={target.basis.bmi.toFixed(1)} />
              <Row k="Protein" v={`${target.basis.proteinGPerKg} g per kg`} />
            </dl>
            <p className="mt-4 text-caption leading-relaxed text-fg-subtle">
              {FLOOR[target.basis.boundBy]}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center rounded-panel border border-dashed border-line-strong p-8">
          <p className="text-body-sm text-fg-muted">
            Fill in age, height and weight and the target appears here.
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line py-2.5 last:border-0">
      <dt className="text-body-sm text-fg-muted">{k}</dt>
      <dd className="text-body-sm font-medium tabular-nums">{v}</dd>
    </div>
  );
}
