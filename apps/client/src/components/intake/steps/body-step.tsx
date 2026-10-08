"use client";

import { ChoiceCard } from "@traiv/ui/components/choice-card";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { useState } from "react";
import type { Sex } from "@/lib/api";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

const SEXES: readonly { value: Sex; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "undisclosed", label: "Prefer not to say" },
];

const CM_PER_FOOT = 30.48;
const CM_PER_INCH = 2.54;

/**
 * The four numbers the calorie target is built from.
 *
 * Without them there is no target, only a guess dressed up as one — which is the thing
 * this whole package exists to avoid. It is still skippable; the coach can fill it in.
 */
export function BodyStep({ flow }: { flow: IntakeFlow }) {
  const thisYear = new Date().getFullYear();
  const [age, setAge] = useState(
    flow.intake?.birthYear ? String(thisYear - flow.intake.birthYear) : "",
  );
  const [sex, setSex] = useState<Sex | null>(flow.intake?.sex ?? null);
  const [weight, setWeight] = useState(flow.weightKg ? String(flow.weightKg) : "");

  // Most people here know their height in feet and inches, so asking only for centimetres
  // gets centimetres typed badly rather than honestly.
  const [unit, setUnit] = useState<"ft" | "cm">("ft");
  const startCm = flow.intake?.heightCm ?? null;
  const [cm, setCm] = useState(startCm ? String(Math.round(startCm)) : "");
  const [feet, setFeet] = useState(startCm ? String(Math.floor(startCm / CM_PER_FOOT)) : "");
  const [inches, setInches] = useState(
    startCm ? String(Math.round((startCm % CM_PER_FOOT) / CM_PER_INCH)) : "",
  );

  const heightCm =
    unit === "cm"
      ? Number(cm)
      : Math.round((Number(feet) * CM_PER_FOOT + Number(inches) * CM_PER_INCH) * 10) / 10;

  const ageNum = Number(age);
  const weightNum = Number(weight);

  const valid = {
    age: age.trim() !== "" && ageNum >= 10 && ageNum <= 100,
    height: heightCm >= 90 && heightCm <= 250,
    weight: weight.trim() !== "" && weightNum >= 25 && weightNum <= 400,
  };

  return (
    <StepShell
      step={2}
      title="A bit about you"
      blurb="This is what your calorie target is worked out from, so it fits you rather than an average."
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue={valid.age && valid.height && valid.weight && sex !== null}
      onContinue={() =>
        flow.next(2, {
          ...(valid.age ? { birthYear: thisYear - ageNum } : {}),
          ...(sex ? { sex } : {}),
          ...(valid.height ? { heightCm } : {}),
          ...(valid.weight ? { weightKg: weightNum } : {}),
        })
      }
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="age">Age</Label>
        <div className="flex items-center gap-2">
          <Input
            id="age"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
            placeholder="30"
            className="tabular-nums"
          />
          <span className="text-body-sm text-fg-muted">years</span>
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-body-sm font-medium">Sex</legend>
        <div className="flex flex-col gap-2">
          {SEXES.map((s) => (
            <ChoiceCard
              key={s.value}
              label={s.label}
              selected={sex === s.value}
              onClick={() => setSex(s.value)}
            />
          ))}
        </div>
        <p className="text-caption text-fg-subtle">
          The calorie equation needs this. If you'd rather not say, your coach sets your target by
          hand instead.
        </p>
      </fieldset>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={unit === "cm" ? "height-cm" : "height-ft"}>Height</Label>
          <button
            type="button"
            onClick={() => setUnit(unit === "cm" ? "ft" : "cm")}
            className="cursor-pointer text-caption text-fg-muted underline-offset-2 transition-colors hover:text-fg hover:underline"
          >
            {unit === "cm" ? "Use feet and inches" : "Use centimetres"}
          </button>
        </div>

        {unit === "cm" ? (
          <div className="flex items-center gap-2">
            <Input
              id="height-cm"
              inputMode="numeric"
              value={cm}
              onChange={(e) => setCm(e.target.value.replace(/\D/g, "").slice(0, 3))}
              placeholder="165"
              className="tabular-nums"
            />
            <span className="text-body-sm text-fg-muted">cm</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              id="height-ft"
              inputMode="numeric"
              value={feet}
              onChange={(e) => setFeet(e.target.value.replace(/\D/g, "").slice(0, 1))}
              placeholder="5"
              className="tabular-nums"
            />
            <span className="text-body-sm text-fg-muted">ft</span>
            <Input
              inputMode="numeric"
              aria-label="Inches"
              value={inches}
              onChange={(e) => setInches(e.target.value.replace(/\D/g, "").slice(0, 2))}
              placeholder="5"
              className="tabular-nums"
            />
            <span className="text-body-sm text-fg-muted">in</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="weight">Weight today</Label>
        <div className="flex items-center gap-2">
          <Input
            id="weight"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value.replace(/[^\d.]/g, "").slice(0, 5))}
            placeholder="68"
            className="tabular-nums"
          />
          <span className="text-body-sm text-fg-muted">kg</span>
        </div>
        <p className="text-caption text-fg-subtle">
          Roughly is fine. You'll update it as you go, and the trend is what matters.
        </p>
      </div>
    </StepShell>
  );
}
