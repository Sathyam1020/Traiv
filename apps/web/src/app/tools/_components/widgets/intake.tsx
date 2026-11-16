"use client";

import {
  type CarbSwing,
  type CycleSplit,
  calorieCycling,
  caloriesPerMeal,
  carbCycling,
  creatineDose,
  fiberTarget,
  type MealStyle,
  type ProteinActivity,
  type ProteinGoal,
  proteinPerMeal,
  proteinTarget,
  type RefeedProtein,
  refeedDay,
  reverseDiet,
  waterIntake,
} from "@traiv/calculators/intake";
import { inRange, kgToLb, lbToKg } from "@traiv/calculators/units";
import { useState } from "react";
import {
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
  Warning,
} from "../kit";

type WUnit = "lb" | "kg";
const toKg = (v: number, u: WUnit) => (u === "lb" ? lbToKg(v) : v);

/** A weight field with its own lb/kg pills, converting the value when the unit flips. */
function useWeight(initial: number, unit: WUnit) {
  const [u, setURaw] = useState<WUnit>(unit);
  const [w, setW] = useState<Num>(initial);
  const setU = (next: WUnit) => {
    if (next === u) return;
    if (w !== "") setW(next === "kg" ? Math.round(lbToKg(w) * 10) / 10 : Math.round(kgToLb(w)));
    setURaw(next);
  };
  const kg =
    w === ""
      ? null
      : inRange(w, u === "lb" ? 30 : 14, u === "lb" ? 600 : 272) === null
        ? null
        : toKg(w, u);
  return { u, setU, w, setW, kg };
}

function WeightFields({
  s,
  label = "Body weight",
  unitLabels = { lb: "Imperial (lb)", kg: "Metric (kg)" },
}: {
  s: ReturnType<typeof useWeight>;
  label?: string;
  unitLabels?: { lb: string; kg: string };
}) {
  return (
    <>
      <Pills
        label="Units"
        value={s.u}
        onChange={s.setU}
        options={[
          { value: "lb", label: unitLabels.lb },
          { value: "kg", label: unitLabels.kg },
        ]}
      />
      <NumberInput
        label={label}
        value={s.w}
        onChange={s.setW}
        min={s.u === "lb" ? 30 : 14}
        max={s.u === "lb" ? 600 : 272}
        suffix={s.u}
      />
    </>
  );
}

const WEIGHT_ERROR = "Enter a body weight between 30 and 600 lb (14 to 272 kg).";

/* ---------------------------------------------------------------- protein */

const PROTEIN_GOALS: { value: ProteinGoal; label: string }[] = [
  { value: "maintain", label: "Maintain (around 1.6 g/kg)" },
  { value: "build", label: "Build muscle (around 1.8 g/kg)" },
  { value: "lose", label: "Lose fat (around 2.0 g/kg)" },
];
const PROTEIN_ACTIVITY: { value: ProteinActivity; label: string }[] = [
  { value: "active", label: "Active: trains regularly" },
  { value: "light", label: "Lightly active" },
  { value: "very", label: "Very active: hard training" },
];

export function ProteinWidget() {
  const wt = useWeight(170, "lb");
  const [goal, setGoal] = useState<ProteinGoal>("build");
  const [activity, setActivity] = useState<ProteinActivity>("active");
  const compute = () => (wt.kg === null ? null : proteinTarget(wt.kg, goal, activity));
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Protein calculator"
          submitLabel="Calculate protein"
          onSubmit={() => setR(compute())}
        >
          <WeightFields s={wt} />
          <Select label="Goal" value={goal} onChange={setGoal} options={PROTEIN_GOALS} />
          <Select
            label="Activity level"
            value={activity}
            onChange={setActivity}
            options={PROTEIN_ACTIVITY}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Daily protein"
                value={fmt(r.grams)}
                unit="g"
                note={`${r.gPerKg.toFixed(1)} g per kg (${(r.gPerKg * 0.4536).toFixed(2)} g per lb) of body weight`}
              />
              <Stats
                items={[
                  { label: "Sensible range", value: `${fmt(r.low)} to ${fmt(r.high)} g` },
                  { label: "Per meal, over 4 meals", value: `${fmt(r.perMealOf4)} g` },
                  { label: "Calories from protein", value: `${fmt(r.grams * 4)} kcal` },
                ]}
              />
              <Note>
                Hit the daily total most days; the exact gram matters far less than consistency.
              </Note>
            </>
          ) : (
            <ErrorText>{WEIGHT_ERROR}</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ---------------------------------------------------------- protein per meal */

export function ProteinPerMealWidget() {
  const wt = useWeight(80, "kg");
  const [goal, setGoal] = useState<ProteinGoal>("build");
  const [meals, setMeals] = useState("4");
  const r = wt.kg === null ? null : proteinPerMeal(wt.kg, goal, Number(meals));
  return (
    <ToolLayout
      form={
        <ToolForm label="Protein per meal calculator">
          <Pills
            label="Units"
            value={wt.u}
            onChange={wt.setU}
            options={[
              { value: "kg", label: "kg" },
              { value: "lb", label: "lb" },
            ]}
          />
          <NumberInput
            label="Body weight"
            value={wt.w}
            onChange={wt.setW}
            min={wt.u === "lb" ? 66 : 30}
            max={wt.u === "lb" ? 550 : 250}
            suffix={wt.u}
          />
          <Pills
            label="Goal"
            value={goal}
            onChange={setGoal}
            stretch
            options={[
              { value: "maintain", label: "Maintain" },
              { value: "build", label: "Build muscle" },
              { value: "lose", label: "Lose fat" },
            ]}
          />
          <Select
            label="Protein meals per day"
            value={meals}
            onChange={setMeals}
            options={["2", "3", "4", "5", "6"].map((m) => ({ value: m, label: `${m} meals` }))}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Protein per meal"
                value={fmt(r.perMeal)}
                unit="g"
                note={`${meals} meals a day`}
              />
              <Stats
                items={[
                  { label: "Daily protein", value: `${fmt(r.daily)} g` },
                  { label: "Per-meal guide (0.4 g/kg)", value: `${fmt(r.threshold)} g` },
                ]}
              />
              {r.status === "low" ? (
                <Warning>
                  Each meal is on the small side for muscle protein synthesis. Fewer, larger protein
                  meals, or a higher daily total, would put each one closer to the 0.4 g/kg guide.
                </Warning>
              ) : r.status === "high" ? (
                <Note>
                  These are large protein meals. That is fine; more meals would spread the same
                  total more evenly.
                </Note>
              ) : (
                <Note>Each meal sits close to the 0.4 g per kg guide used in the research.</Note>
              )}
            </>
          ) : (
            <ErrorText>Enter a body weight between 30 and 250 kg (66 to 550 lb).</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ---------------------------------------------------------- calories per meal */

export function CaloriesPerMealWidget() {
  const [target, setTarget] = useState<Num>(2200);
  const [meals, setMeals] = useState("4");
  const [style, setStyle] = useState<MealStyle>("even");
  const [post, setPost] = useState("3");
  const n = Number(meals);
  const ok = target !== "" && inRange(target, 800, 6000) !== null;
  const split = ok ? caloriesPerMeal(target, n, style, Math.min(Number(post), n)) : null;
  return (
    <ToolLayout
      form={
        <ToolForm label="Calories per meal calculator">
          <NumberInput
            label="Daily calorie target"
            value={target}
            onChange={setTarget}
            min={800}
            max={6000}
            suffix="kcal"
          />
          <Select
            label="Number of meals"
            value={meals}
            onChange={setMeals}
            options={["2", "3", "4", "5", "6"].map((m) => ({ value: m, label: `${m} meals` }))}
          />
          <Pills
            label="Split style"
            value={style}
            onChange={setStyle}
            options={[
              { value: "even", label: "Even" },
              { value: "front", label: "Front-loaded" },
              { value: "post", label: "Post-workout" },
            ]}
          />
          {style === "post" ? (
            <Select
              label="Which meal is post-workout?"
              value={String(Math.min(Number(post), n))}
              onChange={setPost}
              options={Array.from({ length: n }, (_, i) => ({
                value: String(i + 1),
                label: `Meal ${i + 1}`,
              }))}
            />
          ) : null}
        </ToolForm>
      }
      result={
        <ResultPanel>
          {split ? (
            <>
              <Headline
                label={style === "even" ? "Each meal" : "Average meal"}
                value={fmt((target as number) / n)}
                unit="kcal"
                note={`${fmt(target as number)} kcal across ${n} meals`}
              />
              <ul className="flex flex-col gap-2">
                {split.map((kcal, i) => (
                  <li
                    key={`meal-${i + 1}`}
                    className="flex items-center justify-between rounded-control border border-line bg-surface px-4 py-3 text-body-sm tabular-nums"
                  >
                    <span>
                      Meal {i + 1}
                      {style === "post" && i + 1 === Math.min(Number(post), n)
                        ? " · post-workout"
                        : ""}
                    </span>
                    <span className="font-medium">{fmt(kcal)} kcal</span>
                  </li>
                ))}
              </ul>
              <Note>
                {style === "front"
                  ? "Larger meals early, smaller in the evening. Useful if you train in the morning or get hungry late."
                  : style === "post"
                    ? "The meal after training gets a larger share, to refuel and recover."
                    : "Equal meals make planning simple and keep energy steady."}
              </Note>
            </>
          ) : (
            <ErrorText>Enter a daily target between 800 and 6,000 kcal.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------------------ fibre */

export function FiberWidget() {
  const [sex, setSex] = useState<"female" | "male">("female");
  const [age, setAge] = useState<Num>(35);
  const [kcal, setKcal] = useState<Num>(2000);
  const [goal, setGoal] = useState<"general" | "loss" | "gut">("general");
  const ageOk = age !== "" && inRange(age, 18, 99) !== null;
  const kcalOk = kcal === "" || inRange(kcal, 800, 6000) !== null;
  const r = ageOk && kcalOk ? fiberTarget(age as number, sex, kcal === "" ? null : kcal) : null;
  const GOAL_NOTE = {
    general: "Most adults eat well under this. Raise intake gradually over two to three weeks.",
    loss: "Fibre-rich foods are filling for few calories, which helps in a deficit.",
    gut: "Mix sources: oats, beans, vegetables, fruit, nuts and wholegrains feed different gut bacteria.",
  } as const;
  return (
    <ToolLayout
      form={
        <ToolForm label="Fiber intake calculator">
          <Pills
            label="Sex"
            value={sex}
            onChange={setSex}
            stretch
            options={[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
            ]}
          />
          <NumberInput label="Age" value={age} onChange={setAge} min={18} max={99} suffix="years" />
          <NumberInput
            label="Daily calories (optional)"
            value={kcal}
            onChange={setKcal}
            min={800}
            max={6000}
            suffix="kcal"
          />
          <Pills
            label="Main goal"
            value={goal}
            onChange={setGoal}
            options={[
              { value: "general", label: "General health" },
              { value: "loss", label: "Weight loss" },
              { value: "gut", label: "Gut health" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Daily fibre target"
                value={fmt(r.headline)}
                unit="g"
                note={
                  r.which === "calories"
                    ? "14 g for every 1,000 kcal you eat"
                    : "Fixed adequate intake for your age and sex"
                }
              />
              <Stats
                items={[
                  ...(r.byCalories !== null
                    ? [{ label: "By calories (14 g/1,000 kcal)", value: `${fmt(r.byCalories)} g` }]
                    : []),
                  { label: "Fixed guideline for your age and sex", value: `${r.fixed} g` },
                ]}
              />
              <Note>{GOAL_NOTE[goal]}</Note>
            </>
          ) : (
            <ErrorText>
              Enter an age between 18 and 99 and, if you add calories, between 800 and 6,000.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------------------ water */

export function WaterWidget() {
  const wt = useWeight(170, "lb");
  const [minutes, setMinutes] = useState<Num>(45);
  const compute = () =>
    wt.kg === null || minutes === "" || inRange(minutes, 0, 480) === null
      ? null
      : waterIntake(wt.kg, minutes);
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Water intake calculator"
          submitLabel="Calculate water intake"
          onSubmit={() => setR(compute())}
        >
          <WeightFields s={wt} />
          <NumberInput
            label="Exercise today"
            value={minutes}
            onChange={setMinutes}
            min={0}
            max={480}
            suffix="min"
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Daily fluid target"
                value={fmt(r.liters, 1)}
                unit="litres"
                note={`About ${fmt(r.flOz)} fl oz, or ${fmt(r.glasses)} glasses of 250 ml`}
              />
              <Stats
                items={[
                  { label: "Baseline", value: `${fmt(r.baseMl / 1000, 1)} L` },
                  { label: "Added for exercise", value: `${fmt(r.exerciseMl / 1000, 2)} L` },
                ]}
              />
              <Note>
                Includes all drinks. Food supplies roughly a fifth of daily water too. Pale yellow
                urine is a good sign you are close.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter a body weight in range and exercise between 0 and 480 minutes.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* --------------------------------------------------------------- creatine */

export function CreatineWidget() {
  const wt = useWeight(170, "lb");
  const [approach, setApproach] = useState<"skip" | "load">("skip");
  const compute = () => (wt.kg === null ? null : creatineDose(wt.kg, approach === "load"));
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Creatine dosage calculator"
          submitLabel="Calculate creatine dose"
          onSubmit={() => setR(compute())}
        >
          <WeightFields s={wt} />
          <Select
            label="Loading approach"
            value={approach}
            onChange={setApproach}
            options={[
              { value: "skip", label: "Skip loading (slower, gentler)" },
              { value: "load", label: "Load then maintain (faster)" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Daily maintenance dose"
                value={fmt(r.maintenance, r.maintenance % 1 ? 1 : 0)}
                unit="g"
                note="Creatine monohydrate, any time of day, every day"
              />
              <Stats
                items={
                  r.loading !== null
                    ? [
                        {
                          label: "Loading dose",
                          value: `${r.loading} g/day`,
                          note: `For ${r.loadingDays} days`,
                        },
                        {
                          label: "Split into",
                          value: `4 × ${r.loadingPerDose} g`,
                          note: "Spread across the day",
                        },
                        { label: "Muscles near full", value: `About ${r.saturationDays} days` },
                      ]
                    : [
                        { label: "Loading", value: "None" },
                        { label: "Muscles near full", value: `About ${r.saturationDays} days` },
                      ]
                }
              />
              <Note>
                Expect 0.5 to 2 kg of extra water in the muscles in the first weeks. That is normal
                and not fat.
              </Note>
            </>
          ) : (
            <ErrorText>{WEIGHT_ERROR}</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ---------------------------------------------------------- calorie cycling */

const DAYS = ["2", "3", "4", "5", "6"].map((d) => ({ value: d, label: d }));

function DayCards({
  a,
  b,
}: {
  a: {
    title: string;
    count: number;
    d: { calories: number; protein: number; carbs: number; fat: number };
  };
  b: {
    title: string;
    count: number;
    d: { calories: number; protein: number; carbs: number; fat: number };
  };
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {[a, b].map((x) => (
        <li key={x.title} className="rounded-control border border-line bg-surface p-4">
          <p className="text-caption font-medium text-fg-muted">
            {x.title} · {x.count} {x.count === 1 ? "day" : "days"}
          </p>
          <p className="mt-1 font-display text-lead font-medium tabular-nums">
            {fmt(x.d.calories)} kcal
          </p>
          <p className="mt-1 text-caption text-fg-muted tabular-nums">
            P {fmt(x.d.protein)} g · C {fmt(x.d.carbs)} g · F {fmt(x.d.fat)} g
          </p>
        </li>
      ))}
    </ul>
  );
}

export function CalorieCyclingWidget() {
  const [mode, setMode] = useState<"average" | "maintenance">("average");
  const [average, setAverage] = useState<Num>(2400);
  const [maintenance, setMaintenance] = useState<Num>(2600);
  const [goal, setGoal] = useState("0");
  const [days, setDays] = useState("4");
  const [split, setSplit] = useState<CycleSplit>("moderate");
  const compute = () => {
    const avg =
      mode === "average" ? average : maintenance === "" ? "" : maintenance * (1 + Number(goal));
    if (avg === "" || inRange(avg, 1000, 7000) === null) return null;
    return calorieCycling(avg, Number(days), split);
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Calorie cycling calculator"
          submitLabel="Calculate day targets"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Start from"
            value={mode}
            onChange={setMode}
            options={[
              { value: "average", label: "Daily average" },
              { value: "maintenance", label: "Maintenance + goal" },
            ]}
          />
          {mode === "average" ? (
            <NumberInput
              label="Average daily calories"
              value={average}
              onChange={setAverage}
              min={1000}
              max={7000}
              suffix="kcal"
            />
          ) : (
            <>
              <NumberInput
                label="Maintenance calories"
                value={maintenance}
                onChange={setMaintenance}
                min={1000}
                max={7000}
                suffix="kcal"
              />
              <Select
                label="Goal"
                value={goal}
                onChange={setGoal}
                options={[
                  { value: "-0.2", label: "Fat loss (−20%)" },
                  { value: "-0.1", label: "Mild fat loss (−10%)" },
                  { value: "0", label: "Maintain (0%)" },
                  { value: "0.1", label: "Lean gain (+10%)" },
                ]}
              />
            </>
          )}
          <Select label="Training days per week" value={days} onChange={setDays} options={DAYS} />
          <Pills
            label="Training-day boost"
            value={split}
            onChange={setSplit}
            options={[
              { value: "mild", label: "Mild (10%)" },
              { value: "moderate", label: "Moderate (20%)" },
              { value: "aggressive", label: "Aggressive (30%)" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <DayCards
                a={{ title: "Training days", count: r.trainingDays, d: r.train }}
                b={{ title: "Rest days", count: r.restDays, d: r.rest }}
              />
              <Stats
                items={[
                  { label: "Week, cycled", value: `${fmt(r.weekCycled)} kcal` },
                  { label: "Week, same every day", value: `${fmt(r.weekFlat)} kcal` },
                ]}
              />
              <Note>
                The weekly total is unchanged; only its distribution across the days moves.
              </Note>
              {r.floored ? (
                <Note>
                  With this many training days the full boost would leave rest days too low, so rest
                  days are held at {fmt(r.rest.calories)} kcal and the training-day boost is
                  smaller.
                </Note>
              ) : null}
              {r.rest.calories < 1200 ? (
                <Warning>
                  Rest days fall below 1,200 kcal. Choose a milder boost or fewer training days.
                </Warning>
              ) : null}
            </>
          ) : (
            <ErrorText>Enter calories between 1,000 and 7,000.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------------ carb cycling */

export function CarbCyclingWidget() {
  const [maintenance, setMaintenance] = useState<Num>(2600);
  const wt = useWeight(80, "kg");
  const [goal, setGoal] = useState("-0.2");
  const [days, setDays] = useState("4");
  const [swing, setSwing] = useState<CarbSwing>("moderate");
  const compute = () => {
    if (maintenance === "" || inRange(maintenance, 1000, 7000) === null || wt.kg === null)
      return null;
    return carbCycling(maintenance * (1 + Number(goal)), wt.kg, Number(days), swing);
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Carb cycling calculator"
          submitLabel="Calculate carb day targets"
          onSubmit={() => setR(compute())}
        >
          <NumberInput
            label="Maintenance calories"
            value={maintenance}
            onChange={setMaintenance}
            min={1000}
            max={7000}
            suffix="kcal"
          />
          <Pills
            label="Units"
            value={wt.u}
            onChange={wt.setU}
            options={[
              { value: "kg", label: "kg" },
              { value: "lb", label: "lb" },
            ]}
          />
          <NumberInput
            label="Body weight"
            value={wt.w}
            onChange={wt.setW}
            min={wt.u === "lb" ? 30 : 14}
            max={wt.u === "lb" ? 600 : 272}
            suffix={wt.u}
          />
          <Select
            label="Goal"
            value={goal}
            onChange={setGoal}
            options={[
              { value: "-0.2", label: "Fat loss (−20%)" },
              { value: "-0.1", label: "Mild fat loss (−10%)" },
              { value: "0", label: "Maintain (0%)" },
              { value: "0.1", label: "Muscle gain (+10%)" },
            ]}
          />
          <Select label="Training days per week" value={days} onChange={setDays} options={DAYS} />
          <Pills
            label="Low-day carb cut"
            value={swing}
            onChange={setSwing}
            options={[
              { value: "mild", label: "Mild (30%)" },
              { value: "moderate", label: "Moderate (50%)" },
              { value: "aggressive", label: "Aggressive (75%)" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <DayCards
                a={{ title: "High-carb days", count: r.highDays, d: r.high }}
                b={{ title: "Low-carb days", count: r.lowDays, d: r.low }}
              />
              <Stats
                items={[
                  { label: "Average daily carbs", value: `${fmt(r.avgCarbs)} g` },
                  { label: "Week, cycled", value: `${fmt(r.weekCycled)} kcal` },
                  { label: "Week, flat", value: `${fmt(r.weekFlat)} kcal` },
                ]}
              />
              <Note>
                Protein (2.0 g/kg) and fat (0.8 g/kg) stay the same every day; only carbohydrate
                moves.
              </Note>
              {r.tooLow ? (
                <Warning>
                  At this calorie level there is little room for carbohydrate after protein and fat,
                  so cycling makes little difference.
                </Warning>
              ) : null}
            </>
          ) : (
            <ErrorText>
              Enter maintenance between 1,000 and 7,000 kcal and a body weight in range.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ---------------------------------------------------------------- refeed */

export function RefeedWidget() {
  const [maintenance, setMaintenance] = useState<Num>(2600);
  const [deficit, setDeficit] = useState<Num>(500);
  const [weeks, setWeeks] = useState<Num>(8);
  const [basis, setBasis] = useState<`${RefeedProtein}`>("0.3");
  const compute = () => {
    if (maintenance === "" || inRange(maintenance, 1200, 7000) === null) return null;
    if (deficit === "" || inRange(deficit, 0, 1500) === null) return null;
    if (weeks === "" || inRange(weeks, 0, 104) === null) return null;
    return refeedDay(maintenance, deficit, weeks, Number(basis) as RefeedProtein);
  };
  const [r, setR] = useState(compute);
  const FREQ = {
    "not-yet": "Not needed yet. Most people start refeeds after four or more weeks of dieting.",
    fortnightly: "One refeed day every two weeks.",
    weekly: "One refeed day a week.",
  } as const;
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Refeed day calculator"
          submitLabel="Calculate the refeed day"
          onSubmit={() => setR(compute())}
        >
          <NumberInput
            label="Maintenance calories"
            value={maintenance}
            onChange={setMaintenance}
            min={1200}
            max={7000}
            suffix="kcal"
          />
          <NumberInput
            label="Daily deficit"
            value={deficit}
            onChange={setDeficit}
            min={0}
            max={1500}
            suffix="kcal"
          />
          <NumberInput
            label="Weeks in the deficit"
            value={weeks}
            onChange={setWeeks}
            min={0}
            max={104}
            suffix="weeks"
          />
          <Select
            label="Protein basis"
            value={basis}
            onChange={setBasis}
            options={[
              { value: "0.3", label: "Standard (30% of maintenance)" },
              { value: "0.35", label: "High (35% of maintenance)" },
              { value: "0.25", label: "Moderate (25% of maintenance)" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <DayCards
                a={{ title: "Diet days", count: 6, d: r.cut }}
                b={{ title: "Refeed day", count: 1, d: r.refeed }}
              />
              <Stats
                items={[
                  { label: "Extra carbs on the refeed", value: `+${fmt(r.carbSwing)} g` },
                  {
                    label: "How often",
                    value:
                      r.frequency === "not-yet"
                        ? "Not yet"
                        : r.frequency === "weekly"
                          ? "Weekly"
                          : "Every 2 weeks",
                  },
                ]}
              />
              <Note>
                {FREQ[r.frequency]} Expect the scale to rise a little the next morning; that is
                water and glycogen.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter maintenance (1,200 to 7,000), a deficit (0 to 1,500) and weeks (0 to 104).
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ----------------------------------------------------------- reverse diet */

export function ReverseDietWidget() {
  const [current, setCurrent] = useState<Num>(1500);
  const [maintenance, setMaintenance] = useState<Num>(2100);
  const [step, setStep] = useState<Num>(75);
  const wt = useWeight(160, "lb");
  const compute = () => {
    if (current === "" || inRange(current, 500, 6000) === null) return "current" as const;
    if (maintenance === "" || inRange(maintenance, 800, 7000) === null)
      return "maintenance" as const;
    if (step === "" || inRange(step, 50, 150) === null) return "step" as const;
    if (wt.kg === null) return "weight" as const;
    return reverseDiet(current, maintenance, step, wt.kg);
  };
  const [r, setR] = useState(compute);
  const ERR = {
    current: "Enter current calories between 500 and 6,000.",
    maintenance: "Enter maintenance between 800 and 7,000.",
    step: "Choose a weekly increase between 50 and 150 kcal.",
    weight: WEIGHT_ERROR,
  } as const;
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Reverse diet calculator"
          submitLabel="Build my schedule"
          onSubmit={() => setR(compute())}
        >
          <NumberInput
            label="Current daily calories"
            value={current}
            onChange={setCurrent}
            min={500}
            max={6000}
            suffix="kcal"
          />
          <NumberInput
            label="Maintenance calories"
            value={maintenance}
            onChange={setMaintenance}
            min={800}
            max={7000}
            suffix="kcal"
          />
          <NumberInput
            label="Weekly calorie increase"
            hint="50 is slow and cautious; 150 gets there quickly."
            value={step}
            onChange={setStep}
            min={50}
            max={150}
            suffix="kcal"
          />
          <Pills
            label="Units"
            value={wt.u}
            onChange={wt.setU}
            options={[
              { value: "lb", label: "lb" },
              { value: "kg", label: "kg" },
            ]}
          />
          <NumberInput
            label="Body weight"
            value={wt.w}
            onChange={wt.setW}
            min={wt.u === "lb" ? 60 : 27}
            max={wt.u === "lb" ? 600 : 272}
            suffix={wt.u}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {typeof r === "string" ? (
            <ErrorText>{ERR[r]}</ErrorText>
          ) : r.weeks === 0 ? (
            <Note>
              You are already at or above this maintenance level, so there is nothing to reverse.
            </Note>
          ) : (
            <>
              <Headline
                label="Time to reach maintenance"
                value={String(r.weeks)}
                unit={r.weeks === 1 ? "week" : "weeks"}
                note={`${fmt(r.from)} → ${fmt(r.to)} kcal, +${fmt(r.step)} a week · protein ${fmt(r.proteinG)} g a day`}
              />
              <ol className="flex max-h-72 flex-col gap-1.5 overflow-y-auto">
                {r.schedule.map((s) => (
                  <li
                    key={s.week}
                    className="flex items-center justify-between rounded-control border border-line bg-surface px-4 py-2.5 text-body-sm tabular-nums"
                  >
                    <span>Week {s.week}</span>
                    <span className="font-medium">{fmt(s.calories)} kcal</span>
                  </li>
                ))}
              </ol>
              <Note>
                Hold a step for an extra week if the weekly average climbs more than about 0.5 kg.
              </Note>
            </>
          )}
        </ResultPanel>
      }
    />
  );
}
