"use client";

import {
  bmi,
  bodyFatBand,
  ffmi,
  idealWeight,
  leanBodyMass,
  muscleMass,
  navyBodyFat,
  type RECOMP_ACTIVITY,
  recomp,
  type Sex,
  waistToHeight,
  waistToHip,
  weightLossPercent,
} from "@traiv/calculators/body";
import { cmToFeetInches, feetInchesToCm, inRange, kgToLb, lbToKg } from "@traiv/calculators/units";
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
const SEX_OPTS = [
  { value: "male" as const, label: "Male" },
  { value: "female" as const, label: "Female" },
];

/** Height fields that switch between ft/in and cm, carrying the value across. */
function useHeight(ft: number, inch: number, cm: number) {
  const [f, setF] = useState<Num>(ft);
  const [i, setI] = useState<Num>(inch);
  const [c, setC] = useState<Num>(cm);
  const toImperial = () => {
    if (c === "") return;
    const fi = cmToFeetInches(c);
    setF(fi.feet);
    setI(fi.inches);
  };
  const toMetric = () => {
    if (f !== "" && i !== "") setC(Math.round(feetInchesToCm(f, i)));
  };
  const cmValue = (u: U) =>
    u === "imperial"
      ? f === "" || i === "" || inRange(f, 1, 8) === null || inRange(i, 0, 11) === null
        ? null
        : feetInchesToCm(f, i)
      : c === "" || inRange(c, 50, 260) === null
        ? null
        : c;
  const fields = (u: U) =>
    u === "imperial" ? (
      <div className="grid grid-cols-2 gap-3">
        <NumberInput label="Height (feet)" value={f} onChange={setF} min={1} max={8} suffix="ft" />
        <NumberInput
          label="Height (inches)"
          value={i}
          onChange={setI}
          min={0}
          max={11}
          suffix="in"
        />
      </div>
    ) : (
      <NumberInput label="Height" value={c} onChange={setC} min={50} max={260} suffix="cm" />
    );
  return { toImperial, toMetric, cmValue, fields };
}

function useUnits(initial: U, onSwitch: (to: U) => void) {
  const [u, setURaw] = useState<U>(initial);
  const setU = (n: U) => {
    if (n === u) return;
    onSwitch(n);
    setURaw(n);
  };
  return { u, setU };
}

const kgFrom = (x: Num, u: U) => (x === "" ? Number.NaN : u === "imperial" ? lbToKg(x) : x);
const cmFrom = (x: Num, u: U) => (x === "" ? Number.NaN : u === "imperial" ? x * 2.54 : x);
const convW = (x: Num, to: U): Num =>
  x === "" ? x : to === "metric" ? Math.round(lbToKg(x) * 10) / 10 : Math.round(kgToLb(x));
const convL = (x: Num, to: U): Num =>
  x === ""
    ? x
    : to === "metric"
      ? Math.round(x * 2.54 * 10) / 10
      : Math.round((x / 2.54) * 10) / 10;
const showKg = (kg: number, u: U, d = 1) =>
  u === "imperial" ? `${fmt(kgToLb(kg), d)} lb` : `${fmt(kg, d)} kg`;

/* ---------------------------------------------------------------- BMI */

export function BmiWidget() {
  const h = useHeight(5, 10, 175);
  const [w, setW] = useState<Num>(70);
  const { u, setU } = useUnits("metric", (to) => {
    to === "imperial" ? h.toImperial() : h.toMetric();
    setW(convW(w, to));
  });
  const compute = () => {
    const cm = h.cmValue(u);
    const kg = kgFrom(w, u);
    if (cm === null || !(kg > 0)) return null;
    return bmi(kg, cm);
  };
  const [r, setR] = useState(compute);
  const BAND = {
    underweight: "Underweight",
    healthy: "Healthy weight",
    overweight: "Overweight",
    obese: "Obese",
  } as const;
  return (
    <ToolLayout
      form={
        <ToolForm
          label="BMI calculator"
          submitLabel="Calculate BMI"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "metric", label: "Metric" },
              { value: "imperial", label: "Imperial" },
            ]}
          />
          {h.fields(u)}
          <NumberInput
            label="Weight"
            value={w}
            onChange={setW}
            min={1}
            max={u === "imperial" ? 1000 : 450}
            suffix={u === "imperial" ? "lb" : "kg"}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline label="Your BMI" value={fmt(r.value, 1)} note={BAND[r.band]} />
              <Stats
                items={[
                  {
                    label: "Healthy weight range for your height",
                    value: `${showKg(r.healthyLowKg, u, 0)} to ${showKg(r.healthyHighKg, u, 0)}`,
                  },
                ]}
              />
              <Note>
                BMI does not separate muscle from fat. Muscular people often score as overweight
                while carrying little fat; waist measures add useful context.
              </Note>
            </>
          ) : (
            <ErrorText>Enter a height and a weight above zero.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- Navy body fat */

function useNavy(withWeight: boolean) {
  const h = useHeight(5, 10, 178);
  const [sex, setSex] = useState<Sex>("male");
  const [neck, setNeck] = useState<Num>(15);
  const [waist, setWaist] = useState<Num>(34);
  const [hip, setHip] = useState<Num>(38);
  const [w, setW] = useState<Num>("");
  const { u, setU } = useUnits("imperial", (to) => {
    to === "imperial" ? h.toImperial() : h.toMetric();
    setNeck(convL(neck, to));
    setWaist(convL(waist, to));
    setHip(convL(hip, to));
    setW(convW(w, to));
  });
  const compute = () => {
    const cm = h.cmValue(u);
    if (cm === null || neck === "" || waist === "" || (sex === "female" && hip === "")) return null;
    const pct = navyBodyFat(
      sex,
      cm,
      cmFrom(neck, u),
      cmFrom(waist, u),
      sex === "female" ? cmFrom(hip, u) : null,
    );
    if (pct === null || pct < 2 || pct > 70) return null;
    const kg = withWeight && w !== "" ? kgFrom(w, u) : null;
    return { pct, band: bodyFatBand(sex, pct), kg };
  };
  const [r, setR] = useState(compute);
  const L = u === "imperial" ? "in" : "cm";
  const form = (label: string) => (
    <ToolForm label={label} submitLabel="Calculate body fat" onSubmit={() => setR(compute())}>
      <Pills
        label="Units"
        value={u}
        onChange={setU}
        options={[
          { value: "imperial", label: "Imperial" },
          { value: "metric", label: "Metric" },
        ]}
      />
      <Select label="Sex" value={sex} onChange={setSex} options={SEX_OPTS} />
      {h.fields(u)}
      <NumberInput
        label="Neck"
        hint="Just below the larynx"
        value={neck}
        onChange={setNeck}
        min={1}
        max={u === "imperial" ? 40 : 100}
        suffix={L}
      />
      <NumberInput
        label="Waist"
        hint={sex === "male" ? "At the navel" : "At the narrowest point"}
        value={waist}
        onChange={setWaist}
        min={1}
        max={u === "imperial" ? 80 : 200}
        suffix={L}
      />
      {sex === "female" ? (
        <NumberInput
          label="Hip"
          hint="At the widest point"
          value={hip}
          onChange={setHip}
          min={1}
          max={u === "imperial" ? 90 : 230}
          suffix={L}
        />
      ) : null}
      {withWeight ? (
        <NumberInput
          label="Weight (optional, for lean mass)"
          value={w}
          onChange={setW}
          min={1}
          max={u === "imperial" ? 1000 : 450}
          suffix={u === "imperial" ? "lb" : "kg"}
        />
      ) : null}
    </ToolForm>
  );
  const result = (
    <ResultPanel>
      {r ? (
        <>
          <Headline
            label="Estimated body fat"
            value={`${fmt(r.pct, 1)}%`}
            note={`${r.band} range for ${sex === "male" ? "men" : "women"}`}
          />
          {r.kg !== null && r.kg > 0 ? (
            <Stats
              items={[
                { label: "Fat mass", value: showKg((r.kg * r.pct) / 100, u) },
                { label: "Lean mass", value: showKg(r.kg * (1 - r.pct / 100), u) },
              ]}
            />
          ) : null}
          <Note>
            US Navy circumference method. Usually no more than 3 or 4 points from lab methods;
            measure the same way each time to track change.
          </Note>
        </>
      ) : (
        <ErrorText>
          Enter height, neck and waist{sex === "female" ? " and hip" : ""}. The waist must be larger
          than the neck.
        </ErrorText>
      )}
    </ResultPanel>
  );
  return { form, result };
}

export function BodyFatWidget() {
  const n = useNavy(false);
  return <ToolLayout form={n.form("Body fat calculator")} result={n.result} />;
}

export function NavyBodyFatWidget() {
  const n = useNavy(true);
  return <ToolLayout form={n.form("Navy body fat calculator")} result={n.result} />;
}

/* ------------------------------------------------------------------- FFMI */

export function FfmiWidget() {
  const h = useHeight(5, 10, 178);
  const [w, setW] = useState<Num>(180);
  const [bf, setBf] = useState<Num>(15);
  const { u, setU } = useUnits("imperial", (to) => {
    to === "imperial" ? h.toImperial() : h.toMetric();
    setW(convW(w, to));
  });
  const compute = () => {
    const cm = h.cmValue(u);
    const kg = kgFrom(w, u);
    if (cm === null || !(kg > 0) || bf === "" || inRange(bf, 2, 60) === null) return null;
    return ffmi(kg, cm, bf);
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="FFMI calculator"
          submitLabel="Calculate FFMI"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "imperial", label: "Imperial" },
              { value: "metric", label: "Metric" },
            ]}
          />
          {h.fields(u)}
          <NumberInput
            label="Weight"
            value={w}
            onChange={setW}
            min={1}
            max={u === "imperial" ? 1000 : 450}
            suffix={u === "imperial" ? "lb" : "kg"}
          />
          <NumberInput label="Body fat" value={bf} onChange={setBf} min={2} max={60} suffix="%" />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Normalised FFMI"
                value={fmt(r.normalised, 1)}
                note={`Raw FFMI ${fmt(r.value, 1)} · lean mass ${showKg(r.leanKg, u)}`}
              />
              <Note>
                For men, 18 to 20 is typical of people who train, 20 to 22 well-developed, and
                around 25 the commonly cited upper range for drug-free lifters. Women's values run
                about 3 to 4 points lower.
              </Note>
            </>
          ) : (
            <ErrorText>Enter height, weight and a body fat percentage between 2 and 60.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* --------------------------------------------------------- ideal weight */

export function IdealWeightWidget() {
  const h = useHeight(5, 11, 180);
  const [sex, setSex] = useState<Sex>("male");
  const { u, setU } = useUnits("imperial", (to) =>
    to === "imperial" ? h.toImperial() : h.toMetric(),
  );
  const compute = () => {
    const cm = h.cmValue(u);
    return cm === null ? null : idealWeight(sex, cm);
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Ideal weight calculator"
          submitLabel="Calculate ideal weight"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "imperial", label: "Imperial (ft / lb)" },
              { value: "metric", label: "Metric (cm / kg)" },
            ]}
          />
          <Pills label="Sex" value={sex} onChange={setSex} options={SEX_OPTS} stretch />
          {h.fields(u)}
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Formula range"
                value={`${showKg(r.lowKg, u, 0)} to ${showKg(r.highKg, u, 0)}`}
              />
              <Stats items={r.rows.map((x) => ({ label: x.name, value: showKg(x.kg, u) }))} />
              <Note>
                Healthy BMI range for your height: {showKg(r.bmiRange[0], u, 0)} to{" "}
                {showKg(r.bmiRange[1], u, 0)}. These formulas ignore muscle and frame size; treat
                them as a reference, not a target.
              </Note>
            </>
          ) : (
            <ErrorText>Enter a height.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------- lean body mass */

export function LeanBodyMassWidget() {
  const h = useHeight(5, 10, 178);
  const [method, setMethod] = useState<"bf" | "boer">("bf");
  const [sex, setSex] = useState<Sex>("male");
  const [w, setW] = useState<Num>(185);
  const [bf, setBf] = useState<Num>(18);
  const { u, setU } = useUnits("imperial", (to) => {
    to === "imperial" ? h.toImperial() : h.toMetric();
    setW(convW(w, to));
  });
  const compute = () => {
    const kg = kgFrom(w, u);
    if (!(kg > 0)) return null;
    if (method === "bf")
      return bf === "" || inRange(bf, 2, 70) === null ? null : leanBodyMass(kg, { bodyFatPct: bf });
    const cm = h.cmValue(u);
    return cm === null ? null : leanBodyMass(kg, { boer: { sex, heightCm: cm } });
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Lean body mass calculator"
          submitLabel="Calculate lean body mass"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Method"
            value={method}
            onChange={setMethod}
            options={[
              { value: "bf", label: "Body fat %" },
              { value: "boer", label: "Boer formula" },
            ]}
          />
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "imperial", label: "Imperial (lb / ft)" },
              { value: "metric", label: "Metric (kg / cm)" },
            ]}
          />
          <NumberInput
            label="Weight"
            value={w}
            onChange={setW}
            min={1}
            max={u === "imperial" ? 1000 : 450}
            suffix={u === "imperial" ? "lb" : "kg"}
          />
          {method === "bf" ? (
            <NumberInput label="Body fat" value={bf} onChange={setBf} min={2} max={70} suffix="%" />
          ) : (
            <>
              <Pills label="Sex" value={sex} onChange={setSex} options={SEX_OPTS} stretch />
              {h.fields(u)}
            </>
          )}
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline label="Lean body mass" value={showKg(r.leanKg, u)} />
              <Stats
                items={[
                  { label: "Fat mass", value: showKg(r.fatKg, u) },
                  {
                    label: "Body fat",
                    value: `${fmt(r.bodyFatPct, 1)}%`,
                    note: method === "boer" ? "Implied by the Boer estimate" : "As entered",
                  },
                ]}
              />
              <Note>Lean mass includes muscle, bone, organs and water, not only muscle.</Note>
            </>
          ) : (
            <ErrorText>
              Enter a weight and{" "}
              {method === "bf" ? "a body fat percentage between 2 and 70" : "a height"}.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------- skeletal muscle */

export function MuscleMassWidget() {
  const h = useHeight(5, 10, 178);
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState<Num>(30);
  const [w, setW] = useState<Num>(185);
  const { u, setU } = useUnits("imperial", (to) => {
    to === "imperial" ? h.toImperial() : h.toMetric();
    setW(convW(w, to));
  });
  const compute = () => {
    const cm = h.cmValue(u);
    const kg = kgFrom(w, u);
    if (cm === null || !(kg > 0) || age === "" || inRange(age, 18, 90) === null) return null;
    return muscleMass(sex, age, kg, cm);
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Muscle mass calculator"
          submitLabel="Calculate muscle mass"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "imperial", label: "Imperial (lb / ft)" },
              { value: "metric", label: "Metric (kg / cm)" },
            ]}
          />
          <Pills label="Sex" value={sex} onChange={setSex} options={SEX_OPTS} stretch />
          <NumberInput label="Age" value={age} onChange={setAge} min={18} max={90} suffix="years" />
          <NumberInput
            label="Weight"
            value={w}
            onChange={setW}
            min={1}
            max={u === "imperial" ? 1000 : 450}
            suffix={u === "imperial" ? "lb" : "kg"}
          />
          {h.fields(u)}
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Estimated skeletal muscle mass"
                value={u === "imperial" ? fmt(kgToLb(r.kg), 1) : fmt(r.kg, 1)}
                unit={u === "imperial" ? "lb" : "kg"}
                note={`${fmt(r.pctOfBody, 1)}% of body weight`}
              />
              <Stats
                items={[
                  { label: "In kilograms", value: `${fmt(r.kg, 1)} kg` },
                  { label: "In pounds", value: `${fmt(kgToLb(r.kg), 1)} lb` },
                ]}
              />
              <Note>
                Lee et al. (2000) equation without its ethnicity adjustment. A population estimate;
                scans such as DEXA measure the individual.
              </Note>
            </>
          ) : (
            <ErrorText>Enter an age between 18 and 90, a weight and a height.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* --------------------------------------------------------- waist ratios */

export function WaistToHeightWidget() {
  const [waist, setWaist] = useState<Num>(80);
  const [height, setHeight] = useState<Num>(180);
  const { u, setU } = useUnits("metric", (to) => {
    setWaist(convL(waist, to));
    setHeight(convL(height, to));
  });
  const compute = () =>
    waist === "" || height === "" || waist <= 0 || height <= 0
      ? null
      : waistToHeight(waist, height);
  const [r, setR] = useState(compute);
  const L = u === "metric" ? "cm" : "in";
  const BAND = {
    low: "Below the usual range",
    healthy: "Healthy range",
    increased: "Increased risk",
    high: "High risk",
  } as const;
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Waist-to-height ratio calculator"
          submitLabel="Calculate ratio"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "metric", label: "Metric" },
              { value: "imperial", label: "Imperial" },
            ]}
          />
          <NumberInput
            label="Waist"
            hint="Midway between the lowest rib and the top of the hip bone"
            value={waist}
            onChange={setWaist}
            min={1}
            max={u === "metric" ? 250 : 100}
            suffix={L}
          />
          <NumberInput
            label="Height"
            value={height}
            onChange={setHeight}
            min={1}
            max={u === "metric" ? 260 : 102}
            suffix={L}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Waist-to-height ratio"
                value={r.value.toFixed(2)}
                note={BAND[r.band]}
              />
              <Stats
                items={[
                  {
                    label: "Waist under half your height",
                    value: `${fmt((height as number) / 2, 1)} ${L} or less`,
                  },
                ]}
              />
              {r.band === "increased" || r.band === "high" ? (
                <Warning>
                  A ratio of 0.5 or more is linked to higher cardiometabolic risk. A doctor can
                  check blood pressure, blood sugar and cholesterol.
                </Warning>
              ) : (
                <Note>
                  Keeping your waist under half your height is a simple, widely used guide.
                </Note>
              )}
            </>
          ) : (
            <ErrorText>Enter a waist and height above zero.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function WaistToHipWidget() {
  const [sex, setSex] = useState<Sex>("male");
  const [waist, setWaist] = useState<Num>(90);
  const [hip, setHip] = useState<Num>(100);
  const { u, setU } = useUnits("metric", (to) => {
    setWaist(convL(waist, to));
    setHip(convL(hip, to));
  });
  const compute = () =>
    waist === "" || hip === "" || waist <= 0 || hip <= 0 ? null : waistToHip(sex, waist, hip);
  const [r, setR] = useState(compute);
  const L = u === "metric" ? "cm" : "in";
  const BAND = {
    low: "Low risk",
    moderate: "Moderate risk",
    high: "Substantially increased risk (WHO)",
  } as const;
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Waist-to-hip ratio calculator"
          submitLabel="Calculate ratio"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "metric", label: "Metric" },
              { value: "imperial", label: "Imperial" },
            ]}
          />
          <Select label="Sex" value={sex} onChange={setSex} options={SEX_OPTS} />
          <NumberInput
            label="Waist"
            value={waist}
            onChange={setWaist}
            min={1}
            max={u === "metric" ? 250 : 100}
            suffix={L}
          />
          <NumberInput
            label="Hip"
            hint="At the widest point of the buttocks"
            value={hip}
            onChange={setHip}
            min={1}
            max={u === "metric" ? 250 : 100}
            suffix={L}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline label="Waist-to-hip ratio" value={r.value.toFixed(2)} note={BAND[r.band]} />
              <Stats
                items={[
                  {
                    label: `WHO threshold for ${sex === "male" ? "men" : "women"}`,
                    value: r.limit.toFixed(2),
                  },
                ]}
              />
              {r.band === "high" ? (
                <Warning>
                  At or above the WHO threshold. Worth discussing with a doctor, who can check
                  related health markers.
                </Warning>
              ) : (
                <Note>Measure on bare skin, after breathing out, with the tape level.</Note>
              )}
            </>
          ) : (
            <ErrorText>Enter a waist and hip above zero.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ----------------------------------------------- weight loss percentage */

export function WeightLossPercentWidget() {
  const [unit, setUnitRaw] = useState<"kg" | "lb">("kg");
  const [start, setStart] = useState<Num>(90);
  const [current, setCurrent] = useState<Num>(84);
  const [goal, setGoal] = useState<Num>("");
  const [weeks, setWeeks] = useState<Num>("");
  const setUnit = (n: "kg" | "lb") => {
    if (n === unit) return;
    const c = (x: Num): Num =>
      x === "" ? x : n === "lb" ? Math.round(kgToLb(x) * 10) / 10 : Math.round(lbToKg(x) * 10) / 10;
    setStart(c(start));
    setCurrent(c(current));
    setGoal(c(goal));
    setUnitRaw(n);
  };
  const compute = () => {
    if (start === "" || current === "" || start <= 0 || current <= 0) return null;
    return weightLossPercent(
      start,
      current,
      goal === "" ? null : goal,
      weeks === "" ? null : weeks,
    );
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Weight loss percentage calculator"
          submitLabel="Calculate percentage lost"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Units"
            value={unit}
            onChange={setUnit}
            options={[
              { value: "kg", label: "kg" },
              { value: "lb", label: "lb" },
            ]}
          />
          <NumberInput
            label="Starting weight"
            value={start}
            onChange={setStart}
            min={20}
            max={unit === "kg" ? 400 : 880}
            suffix={unit}
          />
          <NumberInput
            label="Current weight"
            value={current}
            onChange={setCurrent}
            min={20}
            max={unit === "kg" ? 400 : 880}
            suffix={unit}
          />
          <NumberInput
            label="Goal weight (optional)"
            value={goal}
            onChange={setGoal}
            min={20}
            max={unit === "kg" ? 400 : 880}
            suffix={unit}
          />
          <NumberInput
            label="Weeks to goal (optional)"
            value={weeks}
            onChange={setWeeks}
            min={1}
            max={260}
            suffix="weeks"
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label={r.lost >= 0 ? "Body weight lost" : "Body weight gained"}
                value={`${fmt(Math.abs(r.pct), 1)}%`}
                note={`${fmt(Math.abs(r.lost), 1)} ${unit} since you started`}
              />
              <Stats
                items={[
                  ...(r.progress !== null
                    ? [{ label: "Progress to goal", value: `${fmt(Math.max(0, r.progress), 0)}%` }]
                    : []),
                  ...(r.remaining !== null
                    ? [
                        {
                          label: "Still to go",
                          value: `${fmt(Math.max(0, r.remaining), 1)} ${unit}`,
                        },
                      ]
                    : []),
                  ...(r.weekly !== null && r.weeklyPct !== null
                    ? [
                        {
                          label: "Needed each week",
                          value: `${fmt(r.weekly, 2)} ${unit}`,
                          note: `${fmt(r.weeklyPct, 2)}% of current weight`,
                        },
                      ]
                    : []),
                ]}
              />
              {r.weeklyPct !== null && r.weeklyPct > 1 ? (
                <Warning>
                  That pace is over 1% of body weight a week. A longer timeframe is easier to
                  sustain and protects muscle.
                </Warning>
              ) : (
                <Note>
                  Losing 5 to 10% of body weight brings measurable health benefits for people
                  carrying excess weight.
                </Note>
              )}
            </>
          ) : (
            <ErrorText>Enter a starting and current weight above zero.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------------------- recomp */

const RECOMP_OPTS = [
  { value: "sedentary" as const, label: "Sedentary: desk job, little exercise" },
  { value: "light" as const, label: "Lightly active: 1 to 3 workouts a week" },
  { value: "moderate" as const, label: "Moderately active: 3 to 5 workouts a week" },
  { value: "very" as const, label: "Very active: 6 or 7 workouts a week" },
];

export function RecompWidget() {
  const [unit, setUnitRaw] = useState<"lb" | "kg">("lb");
  const [w, setW] = useState<Num>(180);
  const [bf, setBf] = useState<Num>(22);
  const [target, setTarget] = useState<Num>(15);
  const [activity, setActivity] = useState<keyof typeof RECOMP_ACTIVITY>("moderate");
  const setUnit = (n: "lb" | "kg") => {
    if (n === unit) return;
    if (w !== "") setW(n === "kg" ? Math.round(lbToKg(w) * 10) / 10 : Math.round(kgToLb(w)));
    setUnitRaw(n);
  };
  const compute = () => {
    if (
      w === "" ||
      bf === "" ||
      target === "" ||
      inRange(bf, 3, 60) === null ||
      inRange(target, 3, 60) === null
    )
      return "Enter a weight and body fat values between 3 and 60%.";
    if (target >= bf) return "Set a target body fat below your current body fat.";
    return recomp(unit === "lb" ? lbToKg(w) : w, bf, target, activity);
  };
  const [r, setR] = useState(compute);
  const show = (kg: number) => (unit === "lb" ? `${fmt(kgToLb(kg), 1)} lb` : `${fmt(kg, 1)} kg`);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Body recomposition calculator"
          submitLabel="Calculate my recomp"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Units"
            value={unit}
            onChange={setUnit}
            options={[
              { value: "lb", label: "lb" },
              { value: "kg", label: "kg" },
            ]}
          />
          <NumberInput
            label="Body weight"
            value={w}
            onChange={setW}
            min={unit === "lb" ? 60 : 27}
            max={unit === "lb" ? 600 : 272}
            suffix={unit}
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
            max={60}
            suffix="%"
          />
          <Select
            label="Activity level"
            value={activity}
            onChange={setActivity}
            options={RECOMP_OPTS}
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
                label="Daily calories for a recomp"
                value={fmt(r.calories)}
                unit="kcal"
                note={`About 10% under maintenance (${fmt(r.maintenance)} kcal)`}
              />
              <Stats
                items={[
                  {
                    label: "Protein",
                    value: `${fmt(r.proteinG)} g`,
                    note: "2.2 g per kg of lean mass",
                  },
                  {
                    label: "End weight at target",
                    value: show(r.targetKg),
                    note: `${show(r.fatToLose)} of fat to lose`,
                  },
                  {
                    label: "Timeline",
                    value: `About ${fmt(Math.ceil(r.weeks))} weeks`,
                    note: "If lean mass holds steady",
                  },
                ]}
              />
              <Note>
                Recomposition works best for newer lifters and those returning to training. Lift
                hard, keep protein high and judge progress by measurements and photos as well as the
                scale.
              </Note>
            </>
          )}
        </ResultPanel>
      }
    />
  );
}
