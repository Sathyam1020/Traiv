"use client";

import { expenditure, resolveBody } from "@traiv/calculators/energy";
import {
  type BulkPace,
  bulkPlan,
  DEFICIT_RATE,
  type DeficitRate,
  deficitPlan,
  type SurplusSize,
  surplusPlan,
  toKg,
} from "@traiv/calculators/goals";
import { inRange, kgToLb, lbToKg } from "@traiv/calculators/units";
import type { ActivityLevel } from "@traiv/nutrition/types";
import { useState } from "react";
import {
  ActivityField,
  BODY_ERROR,
  dateLabel,
  ErrorText,
  fmt,
  Headline,
  Note,
  type Num,
  NumberInput,
  Pills,
  ResultPanel,
  Select,
  Stats,
  ToolForm,
  ToolLayout,
  useBody,
  Warning,
} from "../kit";

const today = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

const RATES: DeficitRate[] = ["relaxed", "steady", "faster", "aggressive"];
const RATE_NAME: Record<DeficitRate, string> = {
  relaxed: "Relaxed",
  steady: "Steady (recommended)",
  faster: "Faster",
  aggressive: "Aggressive",
};

/** Calorie deficit: researched defaults are imperial, moderate, steady; fields start empty there, ours start filled. */
export function DeficitWidget() {
  const body = useBody({ weight: 190 });
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [rate, setRate] = useState<DeficitRate>("steady");
  const [goal, setGoal] = useState<Num>(170);
  const unit = body.units === "imperial" ? "lb" : "kg";

  const compute = () => {
    const b = resolveBody(body.input);
    if (!b.ok) return b;
    if (goal !== "" && inRange(goal, unit === "lb" ? 40 : 18, unit === "lb" ? 600 : 272) === null)
      return { ok: false, error: "goal" } as const;
    const e = expenditure(b.value, activity);
    const plan = deficitPlan({
      tdee: e.tdee,
      bmr: e.bmr,
      sex: b.value.sex,
      weeklyLossKg: DEFICIT_RATE[rate].kg,
      currentKg: b.value.weightKg,
      goalKg: goal === "" ? null : toKg(goal, unit),
      today: today(),
    });
    return { ok: true, value: { plan, unit } } as const;
  };
  const [result, setResult] = useState(compute);

  return (
    <ToolLayout
      form={
        <ToolForm
          label="Calorie deficit calculator"
          submitLabel="Calculate my deficit"
          onSubmit={() => setResult(compute())}
        >
          {body.unitsField({ imperial: "lb / ft-in", metric: "kg / cm" })}
          {body.sexField("select")}
          {body.ageField}
          {body.heightField}
          {body.weightField("Current weight")}
          <NumberInput
            label="Goal weight (optional)"
            value={goal}
            onChange={setGoal}
            min={unit === "lb" ? 40 : 18}
            max={unit === "lb" ? 600 : 272}
            suffix={unit}
          />
          <ActivityField value={activity} onChange={setActivity} />
          <Select
            label="Weekly weight-loss goal"
            value={rate}
            onChange={setRate}
            options={RATES.map((r) => ({
              value: r,
              label: `${RATE_NAME[r]}: ${unit === "lb" ? `${DEFICIT_RATE[r].lb} lb` : `${DEFICIT_RATE[r].kg} kg`} a week`,
            }))}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {result.ok ? (
            <>
              <Headline
                label="Eat about this much a day"
                value={fmt(result.value.plan.target)}
                unit="kcal"
                note={`Maintenance ${fmt(result.value.plan.tdee)} kcal, minus a ${fmt(result.value.plan.dailyDeficit)} kcal daily deficit.`}
              />
              <Stats
                items={[
                  { label: "Maintenance (TDEE)", value: `${fmt(result.value.plan.tdee)} kcal` },
                  { label: "Daily deficit", value: `${fmt(result.value.plan.dailyDeficit)} kcal` },
                  {
                    label: "Goal date",
                    value: result.value.plan.goalDate
                      ? dateLabel(result.value.plan.goalDate)
                      : "Add a goal weight",
                    ...(result.value.plan.weeksToGoal
                      ? {
                          note: `About ${Math.ceil(result.value.plan.weeksToGoal)} weeks at this pace`,
                        }
                      : {}),
                  },
                ]}
              />
              {result.value.plan.floored ? (
                <Warning>
                  That pace would take intake below {fmt(result.value.plan.target)} kcal, the
                  minimum we will suggest without supervision, so the target is held there and the
                  deficit is smaller than requested.
                </Warning>
              ) : result.value.plan.belowBmr ? (
                <Warning>
                  This target is below your resting metabolic rate. Choose a slower pace unless a
                  professional is supervising the diet.
                </Warning>
              ) : null}
              <Note>
                Timelines assume 7,700 kcal per kg (3,500 per lb). Real loss slows as weight comes
                down, so expect the later weeks to take longer.
              </Note>
            </>
          ) : (
            <ErrorText>
              {result.error === "goal"
                ? "Enter a goal weight in range, or leave it blank."
                : BODY_ERROR[result.error]}
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

const SIZES: { value: SurplusSize; label: string }[] = [
  { value: "lean", label: "Lean gain (+200 kcal)" },
  { value: "standard", label: "Standard (+375 kcal)" },
  { value: "aggressive", label: "Aggressive (+550 kcal)" },
];

export function SurplusWidget() {
  const body = useBody({ weight: 160 });
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [size, setSize] = useState<SurplusSize>("standard");
  const [goal, setGoal] = useState<Num>(170);
  const unit = body.units === "imperial" ? "lb" : "kg";

  const compute = () => {
    const b = resolveBody(body.input);
    if (!b.ok) return b;
    if (goal !== "" && inRange(goal, unit === "lb" ? 40 : 18, unit === "lb" ? 600 : 272) === null)
      return { ok: false, error: "goal" } as const;
    const e = expenditure(b.value, activity);
    const plan = surplusPlan({
      tdee: e.tdee,
      size,
      currentKg: b.value.weightKg,
      goalKg: goal === "" ? null : toKg(goal, unit),
      today: today(),
    });
    return { ok: true, value: { plan, unit } } as const;
  };
  const [result, setResult] = useState(compute);

  return (
    <ToolLayout
      form={
        <ToolForm
          label="Calorie surplus calculator"
          submitLabel="Calculate my surplus"
          onSubmit={() => setResult(compute())}
        >
          {body.unitsField({ imperial: "lb / ft-in", metric: "kg / cm" })}
          {body.sexField("select")}
          {body.ageField}
          {body.heightField}
          {body.weightField("Current weight")}
          <NumberInput
            label="Goal weight (optional)"
            value={goal}
            onChange={setGoal}
            min={unit === "lb" ? 40 : 18}
            max={unit === "lb" ? 600 : 272}
            suffix={unit}
          />
          <ActivityField value={activity} onChange={setActivity} />
          <Select label="Surplus size" value={size} onChange={setSize} options={SIZES} />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {result.ok ? (
            <>
              <Headline
                label="Eat about this much a day"
                value={fmt(result.value.plan.target)}
                unit="kcal"
                note={`Maintenance ${fmt(result.value.plan.tdee)} kcal, plus a ${fmt(result.value.plan.surplus)} kcal surplus.`}
              />
              <Stats
                items={[
                  { label: "Maintenance (TDEE)", value: `${fmt(result.value.plan.tdee)} kcal` },
                  {
                    label: "Daily protein",
                    value: `${fmt(result.value.plan.proteinLowG)} to ${fmt(result.value.plan.proteinHighG)} g`,
                    note: "1.6 to 2.2 g per kg of body weight",
                  },
                  {
                    label: "Goal date",
                    value: result.value.plan.goalDate
                      ? dateLabel(result.value.plan.goalDate)
                      : "Add a goal weight",
                    ...(result.value.plan.weeksToGoal
                      ? {
                          note: `About ${Math.ceil(result.value.plan.weeksToGoal)} weeks, if all of it were stored`,
                        }
                      : {}),
                  },
                ]}
              />
              <Note>
                Not every surplus calorie becomes body weight, and only part of the gain is muscle.
                Treat the date as the earliest you could get there, and judge the surplus by the
                monthly trend on the scale.
              </Note>
            </>
          ) : (
            <ErrorText>
              {result.error === "goal"
                ? "Enter a goal weight in range, or leave it blank."
                : BODY_ERROR[result.error]}
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

const PACES: { value: BulkPace; label: string }[] = [
  { value: "lean", label: "Lean +10%" },
  { value: "moderate", label: "Moderate +15%" },
  { value: "aggressive", label: "Aggressive +20%" },
];

export function BulkingWidget() {
  const [maintenance, setMaintenance] = useState<Num>(2500);
  const [weight, setWeight] = useState<Num>(170);
  const [unit, setUnitRaw] = useState<"lb" | "kg">("lb");
  const [pace, setPace] = useState<BulkPace>("moderate");

  function setUnit(next: "lb" | "kg") {
    if (next === unit) return;
    if (weight !== "")
      setWeight(next === "kg" ? Math.round(lbToKg(weight) * 10) / 10 : Math.round(kgToLb(weight)));
    setUnitRaw(next);
  }

  const compute = () => {
    if (maintenance === "" || inRange(maintenance, 1000, 7000) === null)
      return { ok: false, error: "maintenance" } as const;
    if (
      weight === "" ||
      inRange(weight, unit === "lb" ? 60 : 27, unit === "lb" ? 600 : 272) === null
    )
      return { ok: false, error: "weight" } as const;
    return { ok: true, value: bulkPlan(maintenance, toKg(weight, unit), pace) } as const;
  };
  const [result, setResult] = useState(compute);

  return (
    <ToolLayout
      form={
        <ToolForm
          label="Bulking calorie calculator"
          submitLabel="Calculate my bulk"
          onSubmit={() => setResult(compute())}
        >
          <NumberInput
            label="Maintenance calories"
            hint="Not sure? Work it out with the TDEE calculator first."
            value={maintenance}
            onChange={setMaintenance}
            min={1000}
            max={7000}
            suffix="kcal"
          />
          <Pills
            label="Weight unit"
            value={unit}
            onChange={setUnit}
            options={[
              { value: "lb", label: "lb" },
              { value: "kg", label: "kg" },
            ]}
          />
          <NumberInput
            label="Body weight"
            value={weight}
            onChange={setWeight}
            min={unit === "lb" ? 60 : 27}
            max={unit === "lb" ? 600 : 272}
            suffix={unit}
          />
          <Pills label="Pace" value={pace} onChange={setPace} options={PACES} stretch />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {result.ok ? (
            <>
              <Headline
                label="Daily calories for this bulk"
                value={fmt(result.value.total)}
                unit="kcal"
                note={`${fmt(result.value.maintenance)} maintenance + ${fmt(result.value.surplus)} kcal surplus`}
              />
              <Stats
                items={[
                  {
                    label: "Protein",
                    value: `${fmt(result.value.proteinG)} g`,
                    note: "2.0 g per kg of body weight",
                  },
                  { label: "Fat", value: `${fmt(result.value.fatG)} g`, note: "25% of calories" },
                  { label: "Carbs", value: `${fmt(result.value.carbsG)} g`, note: "The rest" },
                  {
                    label: "Weekly gain, at most",
                    value:
                      unit === "lb"
                        ? `${fmt(kgToLb(result.value.weeklyGainKg), 1)} lb`
                        : `${fmt(result.value.weeklyGainKg, 2)} kg`,
                    note: "If every surplus calorie were stored",
                  },
                ]}
              />
              <Note>
                A realistic target for most lifters is 0.25 to 0.5% of body weight a week. If the
                scale climbs faster than that for a month, trim the surplus.
              </Note>
            </>
          ) : (
            <ErrorText>
              {result.error === "maintenance"
                ? "Enter maintenance calories between 1,000 and 7,000."
                : "Enter a body weight in range."}
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}
