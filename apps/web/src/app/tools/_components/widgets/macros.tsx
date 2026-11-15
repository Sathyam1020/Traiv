"use client";

import { expenditure, resolveBody } from "@traiv/calculators/energy";
import {
  BODY_TYPE_SHARES,
  type BodyType,
  type Goal,
  type KetoCarbs,
  ketoMacros,
  macrosFor,
  macrosFromShares,
} from "@traiv/calculators/macros";
import { inRange } from "@traiv/calculators/units";
import type { ActivityLevel } from "@traiv/nutrition/types";
import { useState } from "react";
import {
  ActivityField,
  BODY_ERROR,
  ErrorText,
  fmt,
  Headline,
  MacroBars,
  Note,
  type Num,
  NumberInput,
  Pills,
  ResultPanel,
  ToolForm,
  ToolLayout,
  useBody,
  Warning,
} from "../kit";

const GOALS: { value: Goal; label: string }[] = [
  { value: "cut", label: "Cut" },
  { value: "maintain", label: "Maintain" },
  { value: "bulk", label: "Bulk" },
];
const GOAL_DELTA: Record<Goal, number> = { cut: -500, maintain: 0, bulk: 300 };
const GOAL_LABEL: Record<Goal, string> = {
  cut: "Cut: 500 kcal below maintenance",
  maintain: "Maintenance",
  bulk: "Bulk: 300 kcal above maintenance",
};

/** Researched defaults: imperial, male, 30, 5 ft 10 in, 175 lb, moderate, maintain. */
function useMacroBase() {
  const body = useBody({ weight: 175 });
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  return { body, activity, setActivity, goal, setGoal };
}

export function MacroWidget() {
  const s = useMacroBase();
  const compute = () => {
    const b = resolveBody(s.body.input);
    if (!b.ok) return b;
    const e = expenditure(b.value, s.activity);
    const calories = Math.round(e.tdee + GOAL_DELTA[s.goal]);
    return {
      ok: true,
      value: { tdee: e.tdee, macros: macrosFor(calories, b.value.weightKg, s.goal) },
    } as const;
  };
  const [result, setResult] = useState(compute);

  return (
    <ToolLayout
      form={
        <ToolForm
          label="Macro calculator"
          submitLabel="Calculate my macros"
          onSubmit={() => setResult(compute())}
        >
          {s.body.unitsField({ imperial: "Imperial", metric: "Metric" })}
          {s.body.sexField("pills")}
          {s.body.ageField}
          {s.body.heightField}
          {s.body.weightField()}
          <ActivityField value={s.activity} onChange={s.setActivity} />
          <Pills label="Goal" value={s.goal} onChange={s.setGoal} options={GOALS} stretch />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {result.ok ? (
            <>
              <Headline
                label={GOAL_LABEL[s.goal]}
                value={fmt(result.value.macros.calories)}
                unit="kcal/day"
                note={`Maintenance (TDEE) is about ${fmt(result.value.tdee)} kcal.`}
              />
              <MacroBars m={result.value.macros} />
              {result.value.macros.squeezed ? (
                <Warning>
                  This calorie target is too small to fit the protein and fat minimums. Raise the
                  target or speak to a dietitian before using it.
                </Warning>
              ) : null}
              <Note>
                Protein is set per kilogram of body weight, fat at a quarter of calories, and
                carbohydrate fills the rest.
              </Note>
            </>
          ) : (
            <ErrorText>{BODY_ERROR[result.error]}</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

const TYPES: { value: BodyType; label: string }[] = [
  { value: "ectomorph", label: "Ectomorph" },
  { value: "mesomorph", label: "Mesomorph" },
  { value: "endomorph", label: "Endomorph" },
];
const TYPE_NOTE: Record<BodyType, string> = {
  ectomorph: "Naturally slim, finds it hard to gain: 25% protein, 55% carbs, 20% fat.",
  mesomorph: "Medium build, gains and loses fairly easily: 30% protein, 40% carbs, 30% fat.",
  endomorph: "Broader build, gains fat more easily: 35% protein, 25% carbs, 40% fat.",
};

export function MacroSplitWidget() {
  const s = useMacroBase();
  const [type, setType] = useState<BodyType>("mesomorph");
  const compute = () => {
    const b = resolveBody(s.body.input);
    if (!b.ok) return b;
    const e = expenditure(b.value, s.activity);
    const calories = Math.round(e.tdee + GOAL_DELTA[s.goal]);
    return {
      ok: true,
      value: { tdee: e.tdee, type, macros: macrosFromShares(calories, BODY_TYPE_SHARES[type]) },
    } as const;
  };
  const [result, setResult] = useState(compute);

  return (
    <ToolLayout
      form={
        <ToolForm
          label="Macro split by body type"
          submitLabel="Calculate my split"
          onSubmit={() => setResult(compute())}
        >
          {s.body.unitsField({ imperial: "Imperial", metric: "Metric" })}
          {s.body.sexField("pills")}
          {s.body.ageField}
          {s.body.heightField}
          {s.body.weightField()}
          <ActivityField value={s.activity} onChange={s.setActivity} />
          <Pills label="Body type" value={type} onChange={setType} options={TYPES} stretch />
          <Pills label="Goal" value={s.goal} onChange={s.setGoal} options={GOALS} stretch />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {result.ok ? (
            <>
              <Headline
                label={GOAL_LABEL[s.goal]}
                value={fmt(result.value.macros.calories)}
                unit="kcal/day"
                note={`Maintenance (TDEE) is about ${fmt(result.value.tdee)} kcal.`}
              />
              <p className="text-body-sm">
                <span className="font-medium capitalize">{result.value.type}</span>
                <span className="text-fg-muted">: {TYPE_NOTE[result.value.type]}</span>
              </p>
              <MacroBars m={result.value.macros} />
              <Note>
                Body-type splits are a starting point. Check that protein reaches at least 1.6 g per
                kg (0.7 g per lb) of body weight whichever type you choose.
              </Note>
            </>
          ) : (
            <ErrorText>{BODY_ERROR[result.error]}</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

const CARBS: { value: `${KetoCarbs}`; label: string }[] = [
  { value: "20", label: "20 g strict" },
  { value: "30", label: "30 g standard" },
  { value: "50", label: "50 g liberal" },
];

export function KetoWidget() {
  const s = useMacroBase();
  const [carbs, setCarbs] = useState<`${KetoCarbs}`>("30");
  const [bodyFat, setBodyFat] = useState<Num>("");
  const compute = () => {
    const b = resolveBody(s.body.input);
    if (!b.ok) return b;
    if (bodyFat !== "" && inRange(bodyFat, 4, 60) === null)
      return { ok: false, error: "bodyfat" } as const;
    const e = expenditure(b.value, s.activity);
    const calories = Math.round(e.tdee + GOAL_DELTA[s.goal]);
    return {
      ok: true,
      value: {
        tdee: e.tdee,
        macros: ketoMacros(
          calories,
          b.value.weightKg,
          Number(carbs) as KetoCarbs,
          bodyFat === "" ? null : bodyFat,
        ),
      },
    } as const;
  };
  const [result, setResult] = useState(compute);

  return (
    <ToolLayout
      form={
        <ToolForm
          label="Keto macro calculator"
          submitLabel="Calculate my keto macros"
          onSubmit={() => setResult(compute())}
        >
          {s.body.unitsField({ imperial: "Imperial", metric: "Metric" })}
          {s.body.sexField("pills")}
          {s.body.ageField}
          {s.body.heightField}
          {s.body.weightField()}
          <NumberInput
            label="Body fat % (optional)"
            hint="If you know it, protein is set from lean mass instead of total weight."
            value={bodyFat}
            onChange={setBodyFat}
            min={4}
            max={60}
            suffix="%"
          />
          <ActivityField value={s.activity} onChange={s.setActivity} />
          <Pills label="Net carb limit" value={carbs} onChange={setCarbs} options={CARBS} stretch />
          <Pills label="Goal" value={s.goal} onChange={s.setGoal} options={GOALS} stretch />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {result.ok ? (
            <>
              <Headline
                label={GOAL_LABEL[s.goal]}
                value={fmt(result.value.macros.calories)}
                unit="kcal/day"
                note={`Maintenance (TDEE) is about ${fmt(result.value.tdee)} kcal.`}
              />
              <MacroBars m={result.value.macros} />
              <Note>
                Protein is set from{" "}
                {result.value.macros.proteinBasis === "lean"
                  ? "lean mass (1.8 g per kg of lean body weight)"
                  : "total body weight (1.6 g per kg); add body fat % to base it on lean mass"}
                . Carbs are net (total minus fibre). Fat makes up the rest.
              </Note>
              {result.value.macros.squeezed ? (
                <Warning>
                  Fat is under half of calories at this target, which is low for keto. The deficit
                  may be too large for this approach.
                </Warning>
              ) : null}
            </>
          ) : (
            <ErrorText>
              {result.error === "bodyfat"
                ? "Enter a body fat percentage between 4 and 60, or leave it blank."
                : BODY_ERROR[result.error]}
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}
