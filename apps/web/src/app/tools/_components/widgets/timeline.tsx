"use client";

import { resolveBody } from "@traiv/calculators/energy";
import {
  type CutPace,
  cutLength,
  goalWeightDate,
  weightLossPhases,
} from "@traiv/calculators/timeline";
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
type WUnit = "lb" | "kg";
const toKg = (v: number, u: WUnit) => (u === "lb" ? lbToKg(v) : v);
const show = (kg: number, u: WUnit, d = 1) =>
  u === "lb" ? `${fmt(kgToLb(kg), d)} lb` : `${fmt(kg, d)} kg`;
const W_RANGE = { lb: [40, 600], kg: [18, 272] } as const;

/* ------------------------------------------------------------ goal date */

const RATES = [
  { key: "0.25", lb: 0.25, kg: 0.1, name: "Very gradual" },
  { key: "0.5", lb: 0.5, kg: 0.25, name: "Steady (recommended)" },
  { key: "0.75", lb: 0.75, kg: 0.35, name: "Faster" },
  { key: "1", lb: 1, kg: 0.5, name: "Aggressive" },
  { key: "1.5", lb: 1.5, kg: 0.7, name: "Very aggressive" },
  { key: "2", lb: 2, kg: 0.9, name: "Extreme" },
] as const;

const SAFETY = {
  gentle: "A gentle pace. Easy to sustain, and a good choice when you are already fairly lean.",
  recommended: "Between 0.5 and 1% of body weight a week: the range most people can keep up.",
  fast: "Over 1% of body weight a week. Workable for a short phase with high protein and strength training.",
  extreme:
    "Over 1.5% of body weight a week. Hard to sustain and likely to cost muscle; choose a slower rate.",
} as const;

export function GoalDateWidget() {
  const [u, setURaw] = useState<WUnit>("lb");
  const [current, setCurrent] = useState<Num>(190);
  const [goal, setGoal] = useState<Num>(170);
  const [rate, setRate] = useState<string>("0.5");
  const setU = (next: WUnit) => {
    if (next === u) return;
    const conv = (x: Num) =>
      x === "" ? x : next === "kg" ? Math.round(lbToKg(x) * 10) / 10 : Math.round(kgToLb(x));
    setCurrent(conv(current));
    setGoal(conv(goal));
    setURaw(next);
  };
  const compute = () => {
    const [lo, hi] = W_RANGE[u];
    if (
      current === "" ||
      goal === "" ||
      inRange(current, lo, hi) === null ||
      inRange(goal, lo, hi) === null
    )
      return null;
    const r = RATES.find((x) => x.key === rate) ?? RATES[1];
    const weeklyKg = u === "lb" ? lbToKg(r.lb) : r.kg;
    return goalWeightDate(toKg(current, u), toKg(goal, u), weeklyKg, today());
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Goal weight date calculator"
          submitLabel="Calculate my target date"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "lb", label: "lb" },
              { value: "kg", label: "kg" },
            ]}
          />
          <NumberInput
            label="Current weight"
            value={current}
            onChange={setCurrent}
            min={W_RANGE[u][0]}
            max={W_RANGE[u][1]}
            suffix={u}
          />
          <NumberInput
            label="Goal weight"
            value={goal}
            onChange={setGoal}
            min={W_RANGE[u][0]}
            max={W_RANGE[u][1]}
            suffix={u}
          />
          <Select
            label="Weekly rate of change"
            value={rate}
            onChange={setRate}
            options={RATES.map((x) => ({
              value: x.key,
              label: `${x.name}: ${u === "lb" ? `${x.lb} lb` : `${x.kg} kg`} a week`,
            }))}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r === null ? (
            <ErrorText>
              Enter a current and goal weight between {W_RANGE[u][0]} and {W_RANGE[u][1]} {u}.
            </ErrorText>
          ) : r.direction === "none" ? (
            <Note>
              Your goal weight is the same as your current weight, so there is no timeline to work
              out.
            </Note>
          ) : (
            <>
              <Headline
                label="You could reach your goal around"
                value={dateLabel(r.date)}
                note={`About ${Math.ceil(r.weeks)} weeks at this pace`}
              />
              <Stats
                items={[
                  {
                    label: r.direction === "lose" ? "Daily deficit needed" : "Daily surplus needed",
                    value: `${fmt(r.dailyDelta)} kcal`,
                  },
                  { label: "Weeks", value: fmt(Math.ceil(r.weeks)) },
                ]}
              />
              {r.safety === "extreme" || r.safety === "fast" ? (
                <Warning>{SAFETY[r.safety]}</Warning>
              ) : (
                <Note>{SAFETY[r.safety]}</Note>
              )}
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------ weight loss phases */

export function PhasesWidget() {
  const body = useBody({ weight: 210 });
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [deficit, setDeficit] = useState("500");
  const [goal, setGoal] = useState<Num>(180);
  const u: WUnit = body.units === "imperial" ? "lb" : "kg";
  const compute = () => {
    const b = resolveBody(body.input);
    if (!b.ok) return { error: BODY_ERROR[b.error] };
    if (goal === "" || inRange(goal, W_RANGE[u][0], W_RANGE[u][1]) === null)
      return { error: "Enter a goal weight in range." };
    const goalKg = toKg(goal, u);
    if (goalKg >= b.value.weightKg)
      return { error: "Set a goal weight below your current weight." };
    return {
      u,
      ...weightLossPhases({
        ...b.value,
        startKg: b.value.weightKg,
        goalKg,
        activity,
        dailyDeficit: Number(deficit),
        today: today(),
      }),
    };
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Weight loss phase calculator"
          submitLabel="Build my phase plan"
          onSubmit={() => setR(compute())}
        >
          {body.unitsField({ imperial: "lb / ft-in", metric: "kg / cm" })}
          {body.sexField("select")}
          {body.ageField}
          {body.heightField}
          {body.weightField("Current weight")}
          <NumberInput
            label="Goal weight"
            value={goal}
            onChange={setGoal}
            min={W_RANGE[u][0]}
            max={W_RANGE[u][1]}
            suffix={u}
          />
          <ActivityField value={activity} onChange={setActivity} />
          <Select
            label="Daily deficit"
            value={deficit}
            onChange={setDeficit}
            options={[
              { value: "250", label: "Gentle: 250 kcal a day" },
              { value: "500", label: "Steady: 500 kcal a day (recommended)" },
              { value: "750", label: "Faster: 750 kcal a day" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {"error" in r ? (
            <ErrorText>{r.error}</ErrorText>
          ) : (
            <>
              <Headline
                label={r.reached ? "Estimated finish" : "After the planned phases"}
                value={dateLabel(r.finish)}
                note={`${r.phases.length} phase${r.phases.length === 1 ? "" : "s"}, about ${r.totalWeeks} weeks including 2-week maintenance breaks`}
              />
              <div className="table-scroll overflow-x-auto">
                <table className="w-full text-body-sm tabular-nums">
                  <thead>
                    <tr className="text-left text-caption text-fg-muted">
                      <th scope="col" className="py-2 pr-3 font-medium">
                        Phase
                      </th>
                      <th scope="col" className="py-2 pr-3 font-medium">
                        Daily target
                      </th>
                      <th scope="col" className="py-2 pr-3 font-medium">
                        Weeks
                      </th>
                      <th scope="col" className="py-2 font-medium">
                        Weight
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.phases.map((p) => (
                      <tr key={p.phase} className="border-t border-line">
                        <td className="py-2 pr-3">{p.phase}</td>
                        <td className="py-2 pr-3">
                          {fmt(p.target)} kcal{p.floored ? " *" : ""}
                        </td>
                        <td className="py-2 pr-3">{p.weeks}</td>
                        <td className="py-2">
                          {show(p.startKg, r.u)} → {show(p.endKg, r.u)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {r.phases.some((p) => p.floored) ? (
                <Warning>
                  * Held at the 1,200 / 1,500 kcal minimum, so the real deficit is smaller in that
                  phase.
                </Warning>
              ) : null}
              <Note>
                Each phase resets the target from maintenance at your new weight, so the calorie
                number falls while the pace stays steady. Weight loss inside a phase slows slightly
                as you get lighter.
              </Note>
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ---------------------------------------------------------------- cut length */

export function CutLengthWidget() {
  const [u, setURaw] = useState<WUnit>("lb");
  const [weight, setWeight] = useState<Num>(185);
  const [sex, setSex] = useState<"male" | "female">("male");
  const [bf, setBf] = useState<Num>(20);
  const [target, setTarget] = useState<Num>(12);
  const [pace, setPace] = useState<`${CutPace}`>("0.0075");
  const setU = (next: WUnit) => {
    if (next === u) return;
    if (weight !== "")
      setWeight(next === "kg" ? Math.round(lbToKg(weight) * 10) / 10 : Math.round(kgToLb(weight)));
    setURaw(next);
  };
  const compute = () => {
    if (weight === "" || inRange(weight, W_RANGE[u][0], W_RANGE[u][1]) === null)
      return "Enter a weight in range.";
    if (bf === "" || inRange(bf, 3, 60) === null)
      return "Enter current body fat between 3 and 60%.";
    if (target === "" || inRange(target, 3, 55) === null)
      return "Enter target body fat between 3 and 55%.";
    if (target >= bf) return "Set a target body fat below your current body fat.";
    return cutLength(toKg(weight, u), bf, target, Number(pace) as CutPace, sex);
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Cut length calculator"
          submitLabel="Calculate my cut length"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "lb", label: "lb" },
              { value: "kg", label: "kg" },
            ]}
          />
          <Select
            label="Sex"
            value={sex}
            onChange={setSex}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
          <NumberInput
            label="Current weight"
            value={weight}
            onChange={setWeight}
            min={W_RANGE[u][0]}
            max={W_RANGE[u][1]}
            suffix={u}
          />
          <NumberInput
            label="Current body fat"
            value={bf}
            onChange={setBf}
            min={3}
            max={60}
            suffix="%"
          />
          <NumberInput
            label="Target body fat"
            value={target}
            onChange={setTarget}
            min={3}
            max={55}
            suffix="%"
          />
          <Select
            label="Weekly loss pace"
            value={pace}
            onChange={setPace}
            options={[
              { value: "0.005", label: "Relaxed: 0.5% of body weight a week" },
              { value: "0.0075", label: "Steady: 0.75% a week (recommended)" },
              { value: "0.01", label: "Faster: 1% a week" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {typeof r === "string" ? (
            <ErrorText>{r}</ErrorText>
          ) : (
            <>
              <Headline
                label="Length of the cut"
                value={fmt(Math.ceil(r.totalWeeks))}
                unit="weeks"
                note={`${fmt(Math.ceil(r.weeks))} weeks of dieting${r.dietBreaks ? ` plus ${r.dietBreaks} two-week diet break${r.dietBreaks === 1 ? "" : "s"}` : ""}`}
              />
              <Stats
                items={[
                  { label: "Fat to lose", value: show(r.fatToLose, u) },
                  { label: "End weight", value: show(r.targetKg, u) },
                  { label: "First week's loss", value: show(r.firstWeekLossKg, u, 2) },
                ]}
              />
              {r.belowFloor ? (
                <Warning>
                  That target is very lean. Going this low can affect hormones, energy and health,
                  and is usually only held briefly for competition, ideally with professional
                  support.
                </Warning>
              ) : (
                <Note>
                  Assumes lean mass is kept, which needs high protein and continued strength
                  training.
                </Note>
              )}
            </>
          )}
        </ResultPanel>
      }
    />
  );
}
