"use client";

import { ENERGY_LIMITS, type EnergyResult, energy } from "@traiv/calculators/energy";
import {
  cmToFeetInches,
  feetInchesToCm,
  kgToLb,
  lbToKg,
  type UnitSystem,
} from "@traiv/calculators/units";
import type { ActivityLevel } from "@traiv/nutrition/types";
import { type FormEvent, useState } from "react";
import { Choice, Field, FieldGroup, NumberField } from "@/components/tool-controls";
import { TOOL_CARD, TOOL_CARD_FORM, TOOL_CARD_RESULT } from "../kit";
import { Segmented } from "../segmented";
import { useTool } from "../tool-context";
import { trackCalculateSettled } from "../track";

/*
 * Defaults match the researched page: imperial, male, 30, 5 ft 10 in, 170 lb, moderate.
 * Metric defaults (178 cm) are the researched metric field's own default.
 */

const ACTIVITY: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary: little or no exercise" },
  { value: "light", label: "Light: exercise 1 to 3 days a week" },
  { value: "moderate", label: "Moderate: exercise 3 to 5 days a week" },
  { value: "very", label: "Very active: exercise 6 or 7 days a week" },
  { value: "extra", label: "Extra active: hard training plus a physical job" },
];

const ERROR_TEXT = {
  age: `Enter an age between ${ENERGY_LIMITS.age[0]} and ${ENERGY_LIMITS.age[1]}.`,
  height: "Enter a height between 3 ft and 8 ft 11 in (100 to 250 cm).",
  weight: "Enter a weight between 30 and 600 lb (14 to 272 kg).",
} as const;

type Num = number | "";
const n = (v: Num) => (v === "" ? Number.NaN : v);

export function TdeeWidget() {
  const tool = useTool();
  const [units, setUnits] = useState<UnitSystem>("imperial");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState<Num>(30);
  const [ft, setFt] = useState<Num>(5);
  const [inch, setInch] = useState<Num>(10);
  const [cm, setCm] = useState<Num>(178);
  const [weight, setWeight] = useState<Num>(170);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");

  const compute = () =>
    energy({
      units,
      sex,
      age: n(age),
      heightFt: n(ft),
      heightIn: n(inch),
      heightCm: n(cm),
      weight: n(weight),
      activity,
    });

  const [result, setResult] = useState<ReturnType<typeof energy>>(compute);

  function switchUnits(next: UnitSystem) {
    if (next === units) return;
    // Carry the body across rather than resetting it: someone who typed their numbers in
    // the wrong system should not have to type them again.
    if (next === "metric") {
      if (ft !== "" && inch !== "") setCm(Math.round(feetInchesToCm(ft, inch)));
      if (weight !== "") setWeight(Math.round(lbToKg(weight) * 10) / 10);
    } else {
      if (cm !== "") {
        const fi = cmToFeetInches(cm);
        setFt(fi.feet);
        setInch(fi.inches);
      }
      if (weight !== "") setWeight(Math.round(kgToLb(weight)));
    }
    setUnits(next);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const r = compute();
    setResult(r);
    if (r.ok) trackCalculateSettled(tool.slug, tool.group, tool.kind, 0);
  }

  return (
    <div className={TOOL_CARD}>
      <form onSubmit={submit} className={TOOL_CARD_FORM} aria-label="TDEE calculator">
        <FieldGroup label="Units">
          <Segmented
            label="Units"
            value={units}
            onChange={switchUnits}
            options={[
              { value: "imperial", label: "Imperial (lb / ft)" },
              { value: "metric", label: "Metric (kg / cm)" },
            ]}
          />
        </FieldGroup>
        <FieldGroup label="Sex">
          <Segmented
            label="Sex"
            value={sex}
            onChange={setSex}
            stretch
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
        </FieldGroup>
        <Field label="Age">
          {(id) => (
            <NumberField id={id} value={age} onChange={setAge} min={14} max={100} suffix="years" />
          )}
        </Field>
        {units === "imperial" ? (
          <FieldGroup label="Height">
            <div className="grid grid-cols-2 gap-3">
              <label className="sr-only" htmlFor="tdee-ft">
                Height in feet
              </label>
              <NumberField id="tdee-ft" value={ft} onChange={setFt} min={3} max={8} suffix="ft" />
              <label className="sr-only" htmlFor="tdee-in">
                Height in inches
              </label>
              <NumberField
                id="tdee-in"
                value={inch}
                onChange={setInch}
                min={0}
                max={11}
                suffix="in"
              />
            </div>
          </FieldGroup>
        ) : (
          <Field label="Height">
            {(id) => (
              <NumberField id={id} value={cm} onChange={setCm} min={100} max={250} suffix="cm" />
            )}
          </Field>
        )}
        <Field label="Weight">
          {(id) => (
            <NumberField
              id={id}
              value={weight}
              onChange={setWeight}
              min={units === "imperial" ? 30 : 14}
              max={units === "imperial" ? 600 : 272}
              suffix={units === "imperial" ? "lb" : "kg"}
            />
          )}
        </Field>
        <Field label="Activity level">
          {(id) => <Choice id={id} value={activity} onChange={setActivity} options={ACTIVITY} />}
        </Field>
        <button
          type="submit"
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-control bg-brand px-5 py-2.5 text-body-sm font-medium text-brand-fg transition-colors hover:bg-brand-hover"
        >
          Calculate TDEE
        </button>
      </form>

      <TdeeResult result={result} />
    </div>
  );
}

function TdeeResult({ result }: { result: ReturnType<typeof energy> }) {
  return (
    <section aria-live="polite" aria-label="Your result" className={TOOL_CARD_RESULT}>
      {result.ok ? (
        <Values v={result.value} />
      ) : (
        <p role="alert" className="text-body-sm text-fg">
          {ERROR_TEXT[result.error]}
        </p>
      )}
    </section>
  );
}

function Values({ v }: { v: EnergyResult }) {
  const kcal = (x: number) => x.toLocaleString("en-US");
  return (
    <>
      <div>
        <p className="text-caption font-medium text-fg-muted">Your maintenance calories (TDEE)</p>
        <p className="mt-2 font-display text-display font-medium tabular-nums">
          {kcal(v.tdee)} <span className="text-lead text-fg-muted">kcal/day</span>
        </p>
        <p className="mt-2 text-body-sm text-fg-muted tabular-nums">
          BMR {kcal(v.bmr)} kcal × activity factor {v.factor}
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Cut", value: v.cut, note: "500 below maintenance" },
          { label: "Maintain", value: v.maintain, note: "Holds weight steady" },
          { label: "Bulk", value: v.bulk, note: "300 above maintenance" },
        ].map((c) => (
          <li key={c.label} className="rounded-control border border-line bg-surface p-4">
            <p className="text-caption font-medium text-fg-muted">{c.label}</p>
            <p className="mt-1 font-display text-lead font-medium tabular-nums">{kcal(c.value)}</p>
            <p className="text-caption text-fg-muted">{c.note}</p>
          </li>
        ))}
      </ul>
      <p className="text-caption text-fg-muted">
        Treat this as a starting estimate. Two to three weeks of weigh-ins at this intake will tell
        you how close it is.
      </p>
    </>
  );
}
