"use client";

import {
  ACTIVITIES,
  type ActivityKey,
  caloriesBurned,
  stepsToCalories,
  sweatRate,
  WALK_PACE,
  type WalkPace,
} from "@traiv/calculators/activity";
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

type U = "imperial" | "metric";
const FLOZ_PER_L = 33.814;

/* ----------------------------------------------------------- calories burned */

export function CaloriesBurnedWidget() {
  const [u, setURaw] = useState<U>("imperial");
  const [weight, setWeight] = useState<Num>(170);
  const [activity, setActivity] = useState<ActivityKey>("walking");
  const [minutes, setMinutes] = useState<Num>(30);
  const setU = (next: U) => {
    if (next === u) return;
    if (weight !== "")
      setWeight(
        next === "metric" ? Math.round(lbToKg(weight) * 10) / 10 : Math.round(kgToLb(weight)),
      );
    setURaw(next);
  };
  const compute = () => {
    const ok =
      weight !== "" &&
      inRange(weight, u === "imperial" ? 30 : 14, u === "imperial" ? 600 : 272) !== null;
    if (!ok || minutes === "" || inRange(minutes, 1, 1440) === null) return null;
    return caloriesBurned(activity, u === "imperial" ? lbToKg(weight) : weight, minutes);
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Calories burned calculator"
          submitLabel="Calculate calories burned"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "imperial", label: "Imperial (lb)" },
              { value: "metric", label: "Metric (kg)" },
            ]}
          />
          <NumberInput
            label="Body weight"
            value={weight}
            onChange={setWeight}
            min={u === "imperial" ? 30 : 14}
            max={u === "imperial" ? 600 : 272}
            suffix={u === "imperial" ? "lb" : "kg"}
          />
          <Select
            label="Activity"
            value={activity}
            onChange={setActivity}
            options={(Object.keys(ACTIVITIES) as ActivityKey[]).map((k) => ({
              value: k,
              label: ACTIVITIES[k].label,
            }))}
          />
          <NumberInput
            label="Duration"
            value={minutes}
            onChange={setMinutes}
            min={1}
            max={1440}
            suffix="min"
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Calories burned"
                value={fmt(r.total)}
                unit="kcal"
                note={`${ACTIVITIES[activity].label}, MET ${r.met}`}
              />
              <Stats
                items={[
                  { label: "Per minute", value: `${fmt(r.perMin, 1)} kcal` },
                  { label: "Per hour", value: `${fmt(r.perHour)} kcal` },
                ]}
              />
              <Note>
                Includes what you would burn at rest anyway. Estimates from MET values are typically
                within 20 to 30% for most people; fitness and technique change the real figure.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter a body weight in range and a duration between 1 and 1,440 minutes.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* --------------------------------------------------------------------- steps */

export function StepsWidget() {
  const [u, setURaw] = useState<U>("imperial");
  const [steps, setSteps] = useState<Num>(10000);
  const [weight, setWeight] = useState<Num>(170);
  const [height, setHeight] = useState<Num>(67);
  const [pace, setPace] = useState<WalkPace>("average");
  const setU = (next: U) => {
    if (next === u) return;
    if (weight !== "")
      setWeight(
        next === "metric" ? Math.round(lbToKg(weight) * 10) / 10 : Math.round(kgToLb(weight)),
      );
    if (height !== "")
      setHeight(next === "metric" ? Math.round(height * 2.54) : Math.round(height / 2.54));
    setURaw(next);
  };
  const compute = () => {
    const imp = u === "imperial";
    if (steps === "" || inRange(steps, 1, 200000) === null) return null;
    if (weight === "" || inRange(weight, imp ? 30 : 14, imp ? 600 : 272) === null) return null;
    if (height === "" || inRange(height, imp ? 36 : 91, imp ? 96 : 244) === null) return null;
    return stepsToCalories(
      steps,
      imp ? lbToKg(weight) : weight,
      imp ? height * 2.54 : height,
      pace,
    );
  };
  const [r, setR] = useState(compute);
  const imp = u === "imperial";
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Steps to calories calculator"
          submitLabel="Calculate calories from steps"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "imperial", label: "Imperial (lb, in)" },
              { value: "metric", label: "Metric (kg, cm)" },
            ]}
          />
          <NumberInput label="Step count" value={steps} onChange={setSteps} min={1} max={200000} />
          <NumberInput
            label="Body weight"
            value={weight}
            onChange={setWeight}
            min={imp ? 30 : 14}
            max={imp ? 600 : 272}
            suffix={imp ? "lb" : "kg"}
          />
          <NumberInput
            label="Height"
            value={height}
            onChange={setHeight}
            min={imp ? 36 : 91}
            max={imp ? 96 : 244}
            suffix={imp ? "in" : "cm"}
          />
          <Select
            label="Walking pace"
            value={pace}
            onChange={setPace}
            options={(Object.keys(WALK_PACE) as WalkPace[]).map((k) => ({
              value: k,
              label: WALK_PACE[k].label,
            }))}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Calories burned walking"
                value={fmt(r.total)}
                unit="kcal"
                note={`${fmt(Number(steps))} steps`}
              />
              <Stats
                items={[
                  {
                    label: "Distance",
                    value: imp ? `${fmt(r.miles, 2)} mi` : `${fmt(r.km, 2)} km`,
                  },
                  { label: "Walking time", value: `${fmt(r.minutes)} min` },
                  { label: "Per 1,000 steps", value: `${fmt(r.per1000)} kcal` },
                ]}
              />
              <Note>
                Stride is estimated at 41% of height ({fmt(r.strideM * 100)} cm). Totals include
                resting burn during the walk; the extra above resting is roughly 70 to 80% of this.
              </Note>
            </>
          ) : (
            <ErrorText>Enter steps (1 to 200,000), body weight and height in range.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ---------------------------------------------------------------- sweat rate */

export function SweatRateWidget() {
  const [u, setURaw] = useState<U>("imperial");
  const [pre, setPre] = useState<Num>(176);
  const [post, setPost] = useState<Num>(173);
  const [fluid, setFluid] = useState<Num>(20);
  const [minutes, setMinutes] = useState<Num>(60);
  const setU = (next: U) => {
    if (next === u) return;
    const w = (x: Num) =>
      x === ""
        ? x
        : next === "metric"
          ? Math.round(lbToKg(x) * 10) / 10
          : Math.round(kgToLb(x) * 10) / 10;
    setPre(w(pre));
    setPost(w(post));
    if (fluid !== "")
      setFluid(
        next === "metric"
          ? Math.round((fluid / FLOZ_PER_L) * 1000)
          : Math.round((fluid / 1000) * FLOZ_PER_L),
      );
    setURaw(next);
  };
  const compute = () => {
    const imp = u === "imperial";
    const wOk = (x: Num) => x !== "" && inRange(x, imp ? 30 : 14, imp ? 600 : 272) !== null;
    if (!wOk(pre) || !wOk(post)) return null;
    if (fluid === "" || inRange(fluid, 0, imp ? 200 : 6000) === null) return null;
    if (minutes === "" || inRange(minutes, 5, 480) === null) return null;
    const kg = (x: number) => (imp ? lbToKg(x) : x);
    return sweatRate(
      kg(pre as number),
      kg(post as number),
      imp ? fluid / FLOZ_PER_L : fluid / 1000,
      minutes,
    );
  };
  const [r, setR] = useState(compute);
  const imp = u === "imperial";
  const vol = (l: number) => (imp ? `${fmt(l * FLOZ_PER_L)} fl oz` : `${fmt(l, 2)} L`);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Sweat rate calculator"
          submitLabel="Calculate sweat rate"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "imperial", label: "Imperial (lb, fl oz)" },
              { value: "metric", label: "Metric (kg, ml)" },
            ]}
          />
          <NumberInput
            label="Weight before the session"
            value={pre}
            onChange={setPre}
            min={imp ? 30 : 14}
            max={imp ? 600 : 272}
            suffix={imp ? "lb" : "kg"}
          />
          <NumberInput
            label="Weight after the session"
            value={post}
            onChange={setPost}
            min={imp ? 30 : 14}
            max={imp ? 600 : 272}
            suffix={imp ? "lb" : "kg"}
          />
          <NumberInput
            label="Fluid drunk during the session"
            value={fluid}
            onChange={setFluid}
            min={0}
            max={imp ? 200 : 6000}
            suffix={imp ? "fl oz" : "ml"}
          />
          <NumberInput
            label="Session length"
            value={minutes}
            onChange={setMinutes}
            min={5}
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
                label="Sweat rate"
                value={imp ? fmt(r.perHour * FLOZ_PER_L) : fmt(r.perHour, 2)}
                unit={imp ? "fl oz / hour" : "L / hour"}
                note={`${vol(r.lossL)} lost in total`}
              />
              <Stats
                items={[
                  { label: "Body weight lost", value: `${fmt(r.pctLost, 1)}%` },
                  { label: "Drink per hour next time", value: vol(r.drinkPerHour) },
                  { label: "To rehydrate after", value: vol(r.rehydrateL) },
                ]}
              />
              {r.status === "high" ? (
                <Warning>
                  You lost 2% or more of body weight. Drink more during sessions of this length,
                  with some sodium.
                </Warning>
              ) : r.status === "gained" ? (
                <Note>
                  You weighed more after than before, which usually means you drank more than you
                  sweated.
                </Note>
              ) : (
                <Note>
                  Weigh in minimal dry clothing, after the toilet, before and after, for the most
                  accurate figure.
                </Note>
              )}
            </>
          ) : (
            <ErrorText>
              Enter both weights, fluid and a session length between 5 and 480 minutes.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}
