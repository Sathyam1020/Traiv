"use client";

import {
  beepTest,
  clock,
  cooperCategory,
  cooperRanges,
  cooperVo2,
  heartRateZones,
  intervalWalk,
  METRES_PER_MILE,
  maxHeartRate,
  mile15Vo2,
  pace,
  RACES,
  restingHrVo2,
  riegel,
  rucking,
  type Sex,
  type Terrain,
  type TimerMode,
  timerAt,
  timerSegments,
  timerTotal,
  vo2Category,
  vo2Ranges,
  type WalkPace,
  type Zone2Method,
  zone2,
} from "@traiv/calculators/cardio";
import { inRange, kgToLb, lbToKg } from "@traiv/calculators/units";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
} from "../kit";
import { Table } from "./strength";

const SEX_OPTS = [
  { value: "male" as const, label: "Male" },
  { value: "female" as const, label: "Female" },
];
const MPH = 0.44704;
const ok = (x: Num, lo: number, hi: number): x is number => x !== "" && inRange(x, lo, hi) !== null;

function TimeFields({
  h,
  m,
  s,
  setH,
  setM,
  setS,
  hours = true,
}: {
  h: Num;
  m: Num;
  s: Num;
  setH: (v: Num) => void;
  setM: (v: Num) => void;
  setS: (v: Num) => void;
  hours?: boolean;
}) {
  return (
    <div className={`grid gap-3 ${hours ? "grid-cols-3" : "grid-cols-2"}`}>
      {hours ? (
        <NumberInput label="Hours" value={h} onChange={setH} min={0} max={23} suffix="h" />
      ) : null}
      <NumberInput
        label="Minutes"
        value={m}
        onChange={setM}
        min={0}
        max={hours ? 59 : 600}
        suffix="min"
      />
      <NumberInput label="Seconds" value={s} onChange={setS} min={0} max={59} suffix="s" />
    </div>
  );
}
const seconds = (h: Num, m: Num, s: Num) =>
  (h === "" ? 0 : h) * 3600 + (m === "" ? 0 : m) * 60 + (s === "" ? 0 : s);

/* ----------------------------------------------------------- heart rate */

export function HeartRateZoneWidget() {
  const [age, setAge] = useState<Num>(30);
  const [rest, setRest] = useState<Num>("");
  const [method, setMethod] = useState<"mhr" | "karvonen">("mhr");
  const compute = () => {
    if (!ok(age, 14, 100)) return "Enter an age between 14 and 100.";
    if (method === "karvonen" && !ok(rest, 30, 120))
      return "Add a resting heart rate between 30 and 120 bpm for the Karvonen method.";
    const m = maxHeartRate(age);
    return {
      m,
      zones: heartRateZones(m.tanaka, method === "karvonen" && rest !== "" ? rest : null),
    };
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Heart rate zone calculator"
          submitLabel="Calculate zones"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Method"
            value={method}
            onChange={setMethod}
            options={[
              { value: "mhr", label: "% of max HR" },
              { value: "karvonen", label: "Karvonen (HR reserve)" },
            ]}
          />
          <NumberInput
            label="Age"
            value={age}
            onChange={setAge}
            min={14}
            max={100}
            suffix="years"
          />
          <NumberInput
            label="Resting heart rate (optional)"
            hint="Take it first thing in the morning, before you get up."
            value={rest}
            onChange={(v) => {
              setRest(v);
              if (v !== "") setMethod("karvonen");
            }}
            min={30}
            max={120}
            suffix="bpm"
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
                label="Your max heart rate (Tanaka)"
                value={fmt(r.m.tanaka)}
                unit="bpm"
                note={`208 − 0.7 × age. The classic 220 − age gives ${fmt(r.m.fox)} bpm.`}
              />
              <Table
                head={["Zone", "Range", "Used for"]}
                rows={r.zones.map((z) => [
                  `${z.name} (${z.lo * 100}–${z.hi * 100}%)`,
                  `${z.loBpm}–${z.hiBpm} bpm`,
                  z.use,
                ])}
              />
              <Note>
                {method === "karvonen"
                  ? "Karvonen: resting rate plus a share of heart rate reserve (max minus resting)."
                  : "Share of max heart rate."}{" "}
                Your real max can be 10 to 20 bpm away from any formula, so let how the effort feels
                settle close calls.
              </Note>
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

export function MaxHeartRateWidget() {
  const [age, setAge] = useState<Num>(30);
  const [rest, setRest] = useState<Num>("");
  const compute = () => {
    if (!ok(age, 14, 100)) return null;
    const m = maxHeartRate(age);
    const z = heartRateZones(m.tanaka, null);
    return { m, z2: z[1], z4: z[3], reserve: ok(rest, 30, 120) ? m.tanaka - rest : null };
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Max heart rate calculator"
          submitLabel="Calculate max heart rate"
          onSubmit={() => setR(compute())}
        >
          <NumberInput
            label="Age"
            hint="The three formulas only need your age."
            value={age}
            onChange={setAge}
            min={14}
            max={100}
            suffix="years"
          />
          <NumberInput
            label="Resting heart rate (optional)"
            hint="Adds your heart rate reserve, used by the Karvonen method."
            value={rest}
            onChange={setRest}
            min={30}
            max={120}
            suffix="bpm"
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Estimated max heart rate"
                value={fmt(r.m.tanaka)}
                unit="bpm"
                note="Tanaka, 208 − 0.7 × age: the estimate most coaches start from"
              />
              <Stats
                items={[
                  {
                    label: "220 − age (Fox)",
                    value: `${fmt(r.m.fox)} bpm`,
                    note: "The classic rule",
                  },
                  {
                    label: "Tanaka",
                    value: `${fmt(r.m.tanaka)} bpm`,
                    note: "208 − 0.7 × age, meta-analysis",
                  },
                  {
                    label: "Gellish",
                    value: `${fmt(r.m.gellish)} bpm`,
                    note: "207 − 0.7 × age, long-term data",
                  },
                  ...(r.reserve !== null
                    ? [
                        {
                          label: "Heart rate reserve",
                          value: `${fmt(r.reserve)} bpm`,
                          note: "Tanaka max minus resting",
                        },
                      ]
                    : []),
                ]}
              />
              {r.z2 && r.z4 ? (
                <Stats
                  items={[
                    { label: "Z2 aerobic (60–70%)", value: `${r.z2.loBpm}–${r.z2.hiBpm} bpm` },
                    { label: "Z4 threshold (80–90%)", value: `${r.z4.loBpm}–${r.z4.hiBpm} bpm` },
                  ]}
                />
              ) : null}
              <Note>
                Age formulas miss individuals by about 10 to 12 bpm on average. A hard,
                well-warmed-up field test gives a real number.
              </Note>
            </>
          ) : (
            <ErrorText>Enter an age between 14 and 100.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function Zone2Widget() {
  const [age, setAge] = useState<Num>(40);
  const [rest, setRest] = useState<Num>(60);
  const [max, setMax] = useState<Num>("");
  const [method, setMethod] = useState<Zone2Method>("hrmax");
  const compute = () => {
    if (!ok(age, 14, 100) || !ok(rest, 30, 110)) return null;
    if (max !== "" && !ok(max, 120, 230)) return null;
    return zone2(age, rest, max === "" ? null : max, method);
  };
  const [r, setR] = useState(compute);
  const LABEL = {
    hrmax: "60–70% of max HR",
    karvonen: "60–70% of heart rate reserve",
    maf: "MAF: 180 − age ceiling",
  } as const;
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Zone 2 heart rate calculator"
          submitLabel="Calculate my zone 2"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Method"
            value={method}
            onChange={setMethod}
            options={[
              { value: "hrmax", label: "%HRmax" },
              { value: "karvonen", label: "Karvonen" },
              { value: "maf", label: "MAF" },
            ]}
          />
          <NumberInput
            label="Age"
            value={age}
            onChange={setAge}
            min={14}
            max={100}
            suffix="years"
          />
          <NumberInput
            label="Resting heart rate (for Karvonen)"
            value={rest}
            onChange={setRest}
            min={30}
            max={110}
            suffix="bpm"
          />
          <NumberInput
            label="Tested max heart rate (optional)"
            hint="Replaces 220 − age when you have a real number."
            value={max}
            onChange={setMax}
            min={120}
            max={230}
            suffix="bpm"
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Your zone 2 range"
                value={`${fmt(r.lo)}–${fmt(r.hi)}`}
                unit="bpm"
                note={LABEL[method]}
              />
              <Stats
                items={[
                  {
                    label: method === "maf" ? "MAF ceiling" : "Max HR used",
                    value: `${fmt(r.max)} bpm`,
                    note:
                      method === "maf"
                        ? "180 − age"
                        : r.maxFromTest
                          ? "Your tested max"
                          : "220 − age",
                  },
                  {
                    label: "The talk test",
                    value: "Full sentences",
                    note: "Steady breathing; you could keep going for a long time",
                  },
                ]}
              />
              <Note>
                The three methods define zone 2 differently, so they disagree. If you can't speak in
                full sentences, you are above zone 2 whatever the number says.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter an age, a resting heart rate between 30 and 110 and, if you add one, a tested
              max between 120 and 230.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------- field tests */

function CategoryTable({
  rows,
  current,
  head,
}: {
  rows: { name: string; label: string }[];
  current: string;
  head: string;
}) {
  return (
    <Table
      head={["Rating", head]}
      rows={[...rows]
        .reverse()
        .map((x) => [x.name === current ? `${x.name} (you)` : x.name, x.label])}
    />
  );
}

export function BeepTestWidget() {
  const [level, setLevel] = useState<Num>(9);
  const [shuttle, setShuttle] = useState<Num>(5);
  const [age, setAge] = useState<Num>(30);
  const [sex, setSex] = useState<Sex>("male");
  const compute = () => {
    if (!ok(level, 1, 21) || !ok(shuttle, 1, 16)) return null;
    const b = beepTest(level, shuttle);
    if (!b) return null;
    const rated = ok(age, 13, 90);
    return {
      b,
      cat: rated ? vo2Category(b.vo2, age, sex) : null,
      ranges: rated ? vo2Ranges(age, sex) : null,
    };
  };
  const [r, setR] = useState(compute);
  const smax = ok(level, 1, 21) ? (beepTest(level, 1)?.shuttlesInLevel ?? 0) : 0;
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Beep test calculator"
          submitLabel="Calculate result"
          onSubmit={() => setR(compute())}
        >
          <NumberInput
            label="Level reached (1 to 21)"
            value={level}
            onChange={setLevel}
            min={1}
            max={21}
          />
          <NumberInput
            label="Shuttle at that level"
            hint={
              smax
                ? `There are ${smax} shuttles in level ${level}; give the last one you finished.`
                : "Enter a level first, then the last shuttle completed."
            }
            value={shuttle}
            onChange={setShuttle}
            min={1}
            max={16}
          />
          <NumberInput
            label="Age, for the rating"
            value={age}
            onChange={setAge}
            min={13}
            max={90}
            suffix="years"
          />
          <Pills
            label="Sex, for the rating norms"
            value={sex}
            onChange={setSex}
            options={SEX_OPTS}
            stretch
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Estimated VO2 max (Ramsbottom 20 m shuttle run)"
                value={fmt(r.b.vo2, 1)}
                unit="ml/kg/min"
                note={r.cat ? `Rating: ${r.cat}` : "Add an age for a rating"}
              />
              <Stats
                items={[
                  { label: "Final speed", value: `${fmt(r.b.speedKmh, 1)} km/h` },
                  { label: "Shuttles completed", value: `${fmt(r.b.shuttles)} × 20 m` },
                  { label: "Distance covered", value: `${fmt(r.b.metres)} m` },
                ]}
              />
              {r.ranges && r.cat ? (
                <CategoryTable rows={r.ranges} current={r.cat} head="VO2 max (ml/kg/min)" />
              ) : null}
              <Note>
                Ratings are broad general-population guides for your age and sex. A field estimate
                can differ from a lab test by a few points, so compare it with your own retests.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter a level from 1 to 21 and a shuttle that exists at that level.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function CooperTestWidget() {
  const [age, setAge] = useState<Num>(30);
  const [sex, setSex] = useState<Sex>("male");
  const [dist, setDist] = useState<Num>(2400);
  const [unit, setUnitRaw] = useState<"m" | "km" | "mi">("m");
  const toM = (x: number, u: typeof unit) =>
    u === "m" ? x : u === "km" ? x * 1000 : x * METRES_PER_MILE;
  const setUnit = (u: typeof unit) => {
    if (dist !== "") {
      const m = toM(dist, unit);
      setDist(
        u === "m"
          ? Math.round(m)
          : u === "km"
            ? Math.round(m / 10) / 100
            : Math.round((m / METRES_PER_MILE) * 100) / 100,
      );
    }
    setUnitRaw(u);
  };
  const compute = () => {
    if (!ok(age, 13, 90) || dist === "" || dist <= 0) return null;
    const m = toM(dist, unit);
    if (m < 600 || m > 6000) return null;
    const p = pace(m, 720);
    return {
      m,
      vo2: cooperVo2(m),
      cat: cooperCategory(m, age, sex),
      ranges: cooperRanges(age, sex),
      p,
    };
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Cooper test calculator"
          submitLabel="Calculate result"
          onSubmit={() => setR(compute())}
        >
          <NumberInput label="Age" value={age} onChange={setAge} min={13} max={90} suffix="years" />
          <Pills
            label="Sex, for the rating norms"
            value={sex}
            onChange={setSex}
            options={SEX_OPTS}
            stretch
          />
          <Pills
            label="Distance unit"
            value={unit}
            onChange={setUnit}
            options={[
              { value: "m", label: "meters" },
              { value: "km", label: "km" },
              { value: "mi", label: "miles" },
            ]}
          />
          <NumberInput
            label="Distance covered in 12 minutes"
            value={dist}
            onChange={setDist}
            min={0}
            max={unit === "m" ? 6000 : 6}
            suffix={unit}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Estimated VO2 max (Cooper 12-minute run)"
                value={fmt(r.vo2, 1)}
                unit="ml/kg/min"
                note={`Rating: ${r.cat}`}
              />
              <Stats
                items={[
                  { label: "Distance run", value: `${fmt(r.m)} m in 12 min` },
                  {
                    label: "Average pace",
                    value: `${clock(r.p.secPerKm)} /km`,
                    note: `${clock(r.p.secPerMile)} /mi`,
                  },
                ]}
              />
              <CategoryTable rows={r.ranges} current={r.cat} head="Distance in 12 minutes" />
              <Note>
                Ratings follow Cooper's published 12-minute run norms for your age and sex. Retest
                on the same course to see real change.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter an age between 13 and 90 and a 12-minute distance between 600 m and 6 km.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function Vo2MaxWidget() {
  const [method, setMethod] = useState<"cooper" | "mile" | "rhr">("cooper");
  const [age, setAge] = useState<Num>(30);
  const [sex, setSex] = useState<Sex>("male");
  const [dist, setDist] = useState<Num>(2400);
  const [unit, setUnitRaw] = useState<"m" | "mi">("m");
  const [mm, setMm] = useState<Num>(12);
  const [ss, setSs] = useState<Num>(30);
  const [rest, setRest] = useState<Num>(60);
  const [max, setMax] = useState<Num>("");
  const setUnit = (u: "m" | "mi") => {
    if (dist !== "" && u !== unit)
      setDist(
        u === "mi"
          ? Math.round((dist / METRES_PER_MILE) * 100) / 100
          : Math.round(dist * METRES_PER_MILE),
      );
    setUnitRaw(u);
  };
  const compute = () => {
    if (!ok(age, 13, 90)) return "Enter an age between 13 and 90.";
    let vo2: number;
    if (method === "cooper") {
      if (dist === "" || dist <= 0) return "Enter the distance you covered in 12 minutes.";
      const m = unit === "m" ? dist : dist * METRES_PER_MILE;
      if (m < 600 || m > 6000) return "Enter a 12-minute distance between 600 m and 6 km.";
      vo2 = cooperVo2(m);
    } else if (method === "mile") {
      const t = seconds(0, mm, ss) / 60;
      if (t < 6 || t > 40) return "Enter a 1.5-mile time between 6 and 40 minutes.";
      vo2 = mile15Vo2(t);
    } else {
      if (!ok(rest, 30, 120)) return "Enter a resting heart rate between 30 and 120 bpm.";
      if (max !== "" && !ok(max, 120, 230))
        return "Enter a max heart rate between 120 and 230, or leave it blank.";
      vo2 = restingHrVo2(max === "" ? 220 - age : max, rest);
    }
    return { vo2, cat: vo2Category(vo2, age, sex), ranges: vo2Ranges(age, sex) };
  };
  const [r, setR] = useState(compute);
  const LABEL = {
    cooper: "Cooper 12-minute run",
    mile: "1.5-mile run",
    rhr: "Resting heart rate (Uth)",
  } as const;
  return (
    <ToolLayout
      form={
        <ToolForm
          label="VO2 max calculator"
          submitLabel="Calculate VO2 max"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Method"
            value={method}
            onChange={setMethod}
            options={[
              { value: "cooper", label: "Cooper 12-min run" },
              { value: "mile", label: "1.5-mile run" },
              { value: "rhr", label: "Resting heart rate" },
            ]}
          />
          <NumberInput label="Age" value={age} onChange={setAge} min={13} max={90} suffix="years" />
          <Pills
            label="Sex, for the category norms"
            value={sex}
            onChange={setSex}
            options={SEX_OPTS}
            stretch
          />
          {method === "cooper" ? (
            <>
              <Pills
                label="Distance unit"
                value={unit}
                onChange={setUnit}
                options={[
                  { value: "m", label: "meters" },
                  { value: "mi", label: "miles" },
                ]}
              />
              <NumberInput
                label="Distance covered in 12 minutes"
                value={dist}
                onChange={setDist}
                min={0}
                max={unit === "m" ? 6000 : 4}
                suffix={unit}
              />
            </>
          ) : method === "mile" ? (
            <TimeFields
              h=""
              m={mm}
              s={ss}
              setH={() => {}}
              setM={setMm}
              setS={setSs}
              hours={false}
            />
          ) : (
            <>
              <NumberInput
                label="Resting heart rate"
                value={rest}
                onChange={setRest}
                min={30}
                max={120}
                suffix="bpm"
              />
              <NumberInput
                label="Max heart rate (optional)"
                hint="Leave blank to use 220 − age."
                value={max}
                onChange={setMax}
                min={120}
                max={230}
                suffix="bpm"
              />
            </>
          )}
        </ToolForm>
      }
      result={
        <ResultPanel>
          {typeof r === "string" ? (
            <ErrorText>{r}</ErrorText>
          ) : (
            <>
              <Headline
                label={`Estimated VO2 max (${LABEL[method]})`}
                value={fmt(r.vo2, 1)}
                unit="ml/kg/min"
                note={`Category: ${r.cat}`}
              />
              <CategoryTable rows={r.ranges} current={r.cat} head="VO2 max (ml/kg/min)" />
              <Note>
                Categories are broad general-population guides for your age and sex. A field
                estimate can differ from a lab test by a few points; repeat the same method to track
                change.
              </Note>
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------- running */

export function RacePredictorWidget() {
  const [race, setRace] = useState<string>("5k");
  const [custom, setCustom] = useState<Num>(8);
  const [cu, setCu] = useState<"km" | "mi" | "m">("km");
  const [h, setH] = useState<Num>(0);
  const [m, setM] = useState<Num>(25);
  const [s, setS] = useState<Num>(0);
  const compute = () => {
    const t = seconds(h, m, s);
    const d =
      race === "custom"
        ? custom === "" || custom <= 0
          ? 0
          : cu === "km"
            ? custom * 1000
            : cu === "mi"
              ? custom * METRES_PER_MILE
              : custom
        : (RACES.find((x) => x.key === race)?.metres ?? 0);
    if (d < 400 || t <= 0) return null;
    const p = pace(d, t);
    if (p.kmh > 30 || p.kmh < 3) return null;
    const name = RACES.find((x) => x.key === race)?.label;
    return {
      label: `from a ${clock(t)} ${name ?? "race"}`,
      rows: RACES.map((x) => {
        const t2 = riegel(t, d, x.metres);
        const pp = pace(x.metres, t2);
        return [
          x.label,
          Math.abs(x.metres - d) < 1 ? "Your time" : "Predicted",
          clock(t2),
          clock(pp.secPerKm),
          clock(pp.secPerMile),
        ];
      }),
      far: RACES.some((x) => x.metres > d * 2),
    };
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Race time predictor"
          submitLabel="Predict race times"
          onSubmit={() => setR(compute())}
        >
          <Select
            label="Recent race distance"
            value={race}
            onChange={setRace}
            options={[
              ...RACES.map((x) => ({ value: x.key as string, label: x.label })),
              { value: "custom", label: "Custom distance" },
            ]}
          />
          {race === "custom" ? (
            <>
              <Pills
                label="Distance unit"
                value={cu}
                onChange={setCu}
                options={[
                  { value: "km", label: "km" },
                  { value: "mi", label: "miles" },
                  { value: "m", label: "meters" },
                ]}
              />
              <NumberInput
                label="Custom distance"
                value={custom}
                onChange={setCustom}
                min={0}
                max={cu === "m" ? 100000 : 100}
                suffix={cu}
              />
            </>
          ) : null}
          <TimeFields h={h} m={m} s={s} setH={setH} setM={setM} setS={setS} />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <p className="text-caption font-medium text-fg-subtle">Equivalent times {r.label}</p>
              <Table head={["Distance", "", "Time", "Pace /km", "Pace /mi"]} rows={r.rows} />
              <Note>
                Riegel's formula, T2 = T1 × (D2 ÷ D1)^1.06. The row marked "Your time" is the race
                you entered.{" "}
                {r.far
                  ? "Predictions more than double your race distance assume endurance that race didn't test, so read them as a best case."
                  : ""}
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter a distance of at least 400 m and a realistic finishing time.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

const RACE_ROWS = RACES.filter((x) => ["5k", "10k", "half", "marathon"].includes(x.key));

export function RunningPaceWidget() {
  const [unit, setUnitRaw] = useState<"km" | "mi">("km");
  const [dist, setDist] = useState<Num>(10);
  const [h, setH] = useState<Num>(0);
  const [m, setM] = useState<Num>(50);
  const [s, setS] = useState<Num>(0);
  const setUnit = (u: "km" | "mi") => {
    if (u !== unit && dist !== "")
      setDist(
        Math.round(
          (u === "mi" ? (dist * 1000) / METRES_PER_MILE : (dist * METRES_PER_MILE) / 1000) * 1000,
        ) / 1000,
      );
    setUnitRaw(u);
  };
  const preset = (km: number) =>
    setDist(unit === "km" ? km : Math.round(((km * 1000) / METRES_PER_MILE) * 1000) / 1000);
  const compute = () => {
    const t = seconds(h, m, s);
    if (dist === "" || dist <= 0 || t <= 0) return null;
    const metres = unit === "km" ? dist * 1000 : dist * METRES_PER_MILE;
    const p = pace(metres, t);
    if (p.kmh > 40) return null;
    return {
      p,
      label: `${dist} ${unit} in ${clock(t)}`,
      rows: RACE_ROWS.map((x) => [
        x.label,
        x.key === "half"
          ? "21.0975 km"
          : x.key === "marathon"
            ? "42.195 km"
            : `${x.metres / 1000} km`,
        clock((x.metres / 1000) * p.secPerKm),
      ]),
    };
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Running pace calculator"
          submitLabel="Calculate pace"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Distance unit"
            value={unit}
            onChange={setUnit}
            options={[
              { value: "km", label: "km" },
              { value: "mi", label: "mi" },
            ]}
          />
          <NumberInput
            label="Distance"
            value={dist}
            onChange={setDist}
            min={0}
            max={unit === "km" ? 500 : 310}
            suffix={unit}
          />
          <div className="flex flex-wrap gap-2">
            {[
              ["5K", 5],
              ["10K", 10],
              ["Half", 21.0975],
              ["Marathon", 42.195],
            ].map(([l, k]) => (
              <button
                key={l}
                type="button"
                onClick={() => preset(k as number)}
                className="inline-flex min-h-11 cursor-pointer items-center rounded-control border border-line-strong px-4 text-body-sm font-medium transition-colors hover:bg-hover"
              >
                {l}
              </button>
            ))}
          </div>
          <TimeFields h={h} m={m} s={s} setH={setH} setM={setM} setS={setS} />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label={`Your pace · ${r.label}`}
                value={clock(r.p.secPerKm)}
                unit="min/km"
              />
              <Stats
                items={[
                  { label: "Pace per mile", value: `${clock(r.p.secPerMile)} min/mi` },
                  { label: "Speed (km/h)", value: `${fmt(r.p.kmh, 1)} km/h` },
                  { label: "Speed (mph)", value: `${fmt(r.p.mph, 1)} mph` },
                ]}
              />
              <Table head={["Race", "Distance", "Time at this pace"]} rows={r.rows} />
              <Note>
                These times assume you hold this pace from start to finish. Longer races usually run
                a little slower per kilometre, so treat long-distance times as a best case.
              </Note>
            </>
          ) : (
            <ErrorText>Enter a distance and a time above zero.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------- walking */

export function IntervalWalkingWidget() {
  const [u, setURaw] = useState<"imperial" | "metric">("imperial");
  const [w, setW] = useState<Num>(175);
  const [proto, setProto] = useState<"japanese" | "custom">("japanese");
  const [brisk, setBrisk] = useState<Num>(3);
  const [easy, setEasy] = useState<Num>(3);
  const [rounds, setRounds] = useState<Num>(5);
  const [bp, setBp] = useState<WalkPace>("4.0");
  const [ep, setEp] = useState<WalkPace>("2.5");
  const [sessions, setSessions] = useState<Num>(4);
  const setU = (n: typeof u) => {
    if (n !== u && w !== "") setW(Math.round((n === "metric" ? lbToKg(w) : kgToLb(w)) * 10) / 10);
    setURaw(n);
  };
  const setP = (p: typeof proto) => {
    setProto(p);
    if (p === "japanese") {
      setBrisk(3);
      setEasy(3);
      setRounds(5);
    }
  };
  const compute = () => {
    const kg = w === "" ? 0 : u === "imperial" ? lbToKg(w) : w;
    if (
      kg < 25 ||
      kg > 230 ||
      !ok(brisk, 1, 30) ||
      !ok(easy, 1, 30) ||
      !ok(rounds, 1, 20) ||
      !ok(sessions, 1, 14)
    )
      return null;
    return intervalWalk(kg, brisk, easy, rounds, bp, ep, sessions);
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Interval walking calculator"
          submitLabel="Calculate my session"
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
          <NumberInput
            label="Body weight"
            value={w}
            onChange={setW}
            min={u === "imperial" ? 60 : 27}
            max={u === "imperial" ? 500 : 227}
            suffix={u === "imperial" ? "lb" : "kg"}
          />
          <Pills
            label="Protocol"
            value={proto}
            onChange={setP}
            options={[
              { value: "japanese", label: "Japanese 3-3 × 5" },
              { value: "custom", label: "Custom" },
            ]}
          />
          <div className="grid grid-cols-3 gap-3">
            <NumberInput
              label="Brisk"
              value={brisk}
              onChange={(v) => {
                setBrisk(v);
                setProto("custom");
              }}
              min={1}
              max={30}
              suffix="min"
            />
            <NumberInput
              label="Easy"
              value={easy}
              onChange={(v) => {
                setEasy(v);
                setProto("custom");
              }}
              min={1}
              max={30}
              suffix="min"
            />
            <NumberInput
              label="Rounds"
              value={rounds}
              onChange={(v) => {
                setRounds(v);
                setProto("custom");
              }}
              min={1}
              max={20}
            />
          </div>
          <Select
            label="Brisk pace"
            value={bp}
            onChange={setBp}
            options={[
              { value: "3.5", label: "Brisk: 3.5 mph / 5.6 km/h" },
              { value: "4.0", label: "Fast: 4.0 mph / 6.4 km/h" },
            ]}
          />
          <Select
            label="Easy pace"
            value={ep}
            onChange={setEp}
            options={[
              { value: "2.0", label: "Stroll: 2.0 mph / 3.2 km/h" },
              { value: "2.5", label: "Comfortable: 2.5 mph / 4.0 km/h" },
            ]}
          />
          <NumberInput
            label="Sessions per week"
            value={sessions}
            onChange={setSessions}
            min={1}
            max={14}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label={`Calories in ${fmt(r.minutes)} minutes`}
                value={fmt(r.total)}
                unit="kcal"
              />
              <Stats
                items={[
                  { label: "Brisk intervals", value: `${fmt(r.briskKcal)} kcal` },
                  { label: "Easy intervals", value: `${fmt(r.easyKcal)} kcal` },
                  { label: "Steady 3 mph walk, same time", value: `${fmt(r.steadyKcal)} kcal` },
                  { label: `A week at ${sessions} sessions`, value: `${fmt(r.weekly)} kcal` },
                ]}
              />
              <Note>
                Calories use MET values from the Compendium of Physical Activities. In the research,
                this method's real payoff is fitness and blood pressure; the extra calories over a
                steady walk are modest.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter a body weight, interval lengths from 1 to 30 minutes, 1 to 20 rounds and 1 to 14
              sessions.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

const TERRAIN_OPTS: { value: Terrain; label: string }[] = [
  { value: "pavement", label: "Pavement or track" },
  { value: "dirt", label: "Dirt road" },
  { value: "light-brush", label: "Trail or light brush" },
  { value: "heavy-brush", label: "Heavy brush" },
  { value: "sand", label: "Loose sand" },
];

export function RuckingWidget() {
  const [u, setURaw] = useState<"imperial" | "metric">("imperial");
  const [w, setW] = useState<Num>(175);
  const [load, setLoad] = useState<Num>(30);
  const [speed, setSpeed] = useState<"2.5" | "3.0" | "3.5" | "4.0">("3.0");
  const [grade, setGrade] = useState<Num>(0);
  const [terrain, setTerrain] = useState<Terrain>("pavement");
  const [dur, setDur] = useState<Num>(60);
  const setU = (n: typeof u) => {
    if (n !== u) {
      const c = (x: Num): Num =>
        x === "" ? x : Math.round((n === "metric" ? lbToKg(x) : kgToLb(x)) * 10) / 10;
      setW(c(w));
      setLoad(c(load));
    }
    setURaw(n);
  };
  const compute = () => {
    const kg = w === "" ? 0 : u === "imperial" ? lbToKg(w) : w;
    const lk = load === "" ? 0 : u === "imperial" ? lbToKg(load) : load;
    if (kg < 25 || kg > 230 || lk < 0 || lk > 70 || !ok(grade, 0, 20) || !ok(dur, 5, 600))
      return null;
    return rucking(kg, lk, Number(speed) * MPH, grade, terrain, dur);
  };
  const [r, setR] = useState(compute);
  const W = u === "imperial" ? "lb" : "kg";
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Rucking calorie calculator"
          submitLabel="Calculate my burn"
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
          <NumberInput
            label="Body weight"
            value={w}
            onChange={setW}
            min={u === "imperial" ? 60 : 27}
            max={u === "imperial" ? 500 : 227}
            suffix={W}
          />
          <NumberInput
            label="Pack or vest load"
            value={load}
            onChange={setLoad}
            min={0}
            max={u === "imperial" ? 150 : 68}
            suffix={W}
          />
          <Select
            label="Walking pace"
            value={speed}
            onChange={setSpeed}
            options={[
              { value: "2.5", label: "Easy: 2.5 mph / 4.0 km/h" },
              { value: "3.0", label: "Steady: 3.0 mph / 4.8 km/h" },
              { value: "3.5", label: "Brisk: 3.5 mph / 5.6 km/h" },
              { value: "4.0", label: "Fast: 4.0 mph / 6.4 km/h" },
            ]}
          />
          <NumberInput
            label="Average uphill grade"
            value={grade}
            onChange={setGrade}
            min={0}
            max={20}
            suffix="%"
          />
          <Select label="Terrain" value={terrain} onChange={setTerrain} options={TERRAIN_OPTS} />
          <NumberInput
            label="Duration"
            value={dur}
            onChange={setDur}
            min={5}
            max={600}
            suffix="min"
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline label={`Calories in ${dur} minutes`} value={fmt(r.total)} unit="kcal" />
              <Stats
                items={[
                  { label: "Burn rate", value: `${fmt(r.perMin, 1)} kcal/min` },
                  { label: "Same walk, no load", value: `${fmt(r.unloaded)} kcal` },
                  { label: "The load adds", value: `+${fmt(r.addedPct)}%` },
                ]}
              />
              <Note>
                Pandolf load-carriage equation with terrain factors, designed for steady walking
                with a load on level or rising ground. Descents aren't covered. An estimate, not a
                measurement.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter a body weight, a load up to 68 kg (150 lb), a grade from 0 to 20% and 5 to 600
              minutes.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------- workout timer */

function useBeep(muted: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  return useCallback(
    (freq: number, ms: number) => {
      if (muted || typeof window === "undefined") return;
      try {
        ctx.current ??= new AudioContext();
        const c = ctx.current;
        const o = c.createOscillator();
        const g = c.createGain();
        o.frequency.value = freq;
        g.gain.value = 0.15;
        o.connect(g).connect(c.destination);
        o.start();
        o.stop(c.currentTime + ms / 1000);
      } catch {
        // Audio is optional; the visual timer still runs.
      }
    },
    [muted],
  );
}

export function WorkoutTimerWidget() {
  const [mode, setMode] = useState<TimerMode>("tabata");
  const [emom, setEmom] = useState<Num>(10);
  const [amrap, setAmrap] = useState<Num>(12);
  const [tw, setTw] = useState<Num>(20);
  const [tr, setTr] = useState<Num>(10);
  const [tn, setTn] = useState<Num>(8);
  const [cw, setCw] = useState<Num>(40);
  const [cr, setCr] = useState<Num>(20);
  const [cn, setCn] = useState<Num>(6);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const started = useRef<number | null>(null);
  const base = useRef(0);
  const box = useRef<HTMLElement>(null);
  const beep = useBeep(muted);
  const lastIdx = useRef(-1);
  const lastSec = useRef(-1);

  const valid =
    mode === "emom"
      ? ok(emom, 1, 90)
      : mode === "amrap"
        ? ok(amrap, 1, 120)
        : mode === "tabata"
          ? ok(tw, 1, 3600) && ok(tr, 0, 3600) && ok(tn, 1, 99)
          : ok(cw, 1, 3600) && ok(cr, 0, 3600) && ok(cn, 1, 99);
  const segs = useMemo(() => {
    if (!valid) return [];
    const v = (x: Num) => (x === "" ? 0 : x);
    return mode === "emom"
      ? timerSegments("emom", { minutes: v(emom) })
      : mode === "amrap"
        ? timerSegments("amrap", { minutes: v(amrap) })
        : timerSegments(
            mode,
            mode === "tabata"
              ? { work: v(tw), rest: v(tr), rounds: v(tn) }
              : { work: v(cw), rest: v(cr), rounds: v(cn) },
          );
  }, [valid, mode, emom, amrap, tw, tr, tn, cw, cr, cn]);
  const total = timerTotal(segs);
  const at = timerAt(segs, elapsed);

  const reset = useCallback(() => {
    setRunning(false);
    started.current = null;
    base.current = 0;
    lastIdx.current = -1;
    lastSec.current = -1;
    setElapsed(0);
  }, []);

  // Changing the setup resets the clock.
  useEffect(() => reset(), [segs, reset]);

  useEffect(() => {
    if (!running) return;
    started.current = performance.now();
    const id = window.setInterval(() => {
      if (started.current === null) return;
      const e = base.current + (performance.now() - started.current) / 1000;
      setElapsed(Math.min(e, total));
    }, 100);
    let lock: WakeLockSentinel | null = null;
    navigator.wakeLock
      ?.request("screen")
      .then((l) => {
        lock = l;
      })
      .catch(() => {});
    return () => {
      window.clearInterval(id);
      if (started.current !== null) base.current += (performance.now() - started.current) / 1000;
      started.current = null;
      lock?.release().catch(() => {});
    };
  }, [running, total]);

  useEffect(() => {
    if (!running) return;
    if (at.done) {
      beep(440, 900);
      setRunning(false);
      return;
    }
    if (at.index !== lastIdx.current) {
      lastIdx.current = at.index;
      beep(at.segment?.kind === "rest" ? 520 : 880, 350);
    }
    const sec = Math.ceil(at.remaining);
    if (sec !== lastSec.current) {
      lastSec.current = sec;
      if (sec <= 3 && sec > 0) beep(660, 120);
    }
  }, [at, running, beep]);

  const toggle = useCallback(() => {
    if (!valid) return;
    if (at.done) reset();
    setRunning((x) => !x);
  }, [valid, at.done, reset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      if (e.code !== "Space" || t?.closest("input, select, textarea, button, a, [role=radio]"))
        return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const full = () => {
    const el = box.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  };

  const phase = !valid
    ? "Check the settings"
    : at.done
      ? "Done"
      : elapsed === 0 && !running
        ? "Ready"
        : mode === "amrap"
          ? "As many rounds as possible"
          : at.segment?.kind === "rest"
            ? "Rest"
            : "Work";
  const roundLabel = at.segment
    ? mode === "amrap"
      ? "AMRAP"
      : `Round ${at.segment.round} of ${at.segment.rounds}`
    : "";
  const shown = valid ? (elapsed === 0 && !running ? (segs[0]?.seconds ?? 0) : at.remaining) : 0;
  const btn =
    "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-control border border-line-strong px-4 text-body-sm font-medium transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50";
  const HELP = {
    emom: "Every minute on the minute: a new minute starts on each beep, and whatever is left after the work is your rest.",
    amrap:
      "One countdown. Repeat the circuit for as many rounds as you can before it reaches zero.",
    tabata:
      "Classic Tabata is 20 seconds of work and 10 of rest for 8 rounds. All three can be changed.",
    custom: "Any work, rest and round count. Set rest to 0 for back-to-back work intervals.",
  } as const;

  return (
    <ToolLayout
      form={
        <ToolForm label="Workout timer settings">
          <Pills
            label="Mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "emom", label: "EMOM" },
              { value: "amrap", label: "AMRAP" },
              { value: "tabata", label: "Tabata" },
              { value: "custom", label: "Custom" },
            ]}
          />
          {mode === "emom" ? (
            <NumberInput
              label="Total minutes"
              value={emom}
              onChange={setEmom}
              min={1}
              max={90}
              suffix="min"
            />
          ) : null}
          {mode === "amrap" ? (
            <NumberInput
              label="Minutes on the clock"
              value={amrap}
              onChange={setAmrap}
              min={1}
              max={120}
              suffix="min"
            />
          ) : null}
          {mode === "tabata" || mode === "custom" ? (
            <div className="grid grid-cols-3 gap-3">
              <NumberInput
                label="Work"
                value={mode === "tabata" ? tw : cw}
                onChange={mode === "tabata" ? setTw : setCw}
                min={1}
                max={3600}
                suffix="s"
              />
              <NumberInput
                label="Rest"
                value={mode === "tabata" ? tr : cr}
                onChange={mode === "tabata" ? setTr : setCr}
                min={0}
                max={3600}
                suffix="s"
              />
              <NumberInput
                label="Rounds"
                value={mode === "tabata" ? tn : cn}
                onChange={mode === "tabata" ? setTn : setCn}
                min={1}
                max={99}
              />
            </div>
          ) : null}
          <Note>{HELP[mode]}</Note>
        </ToolForm>
      }
      result={
        <section
          ref={box}
          aria-label="Workout timer"
          className="flex min-w-0 flex-col items-center justify-center gap-5 rounded-surface border border-line bg-sunken p-5 text-center sm:p-7"
        >
          <p className="text-caption font-medium text-fg-subtle">{roundLabel}</p>
          <p aria-live="polite" className="text-lead font-medium">
            {phase}
          </p>
          <p className="font-display text-display font-medium tabular-nums" aria-hidden="true">
            {clock(Math.ceil(shown))}
          </p>
          <p className="text-body-sm text-fg-muted">Total work and rest: {clock(total)}</p>
          {!valid ? <ErrorText>Enter values inside the allowed ranges to start.</ErrorText> : null}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={toggle}
              disabled={!valid}
              className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-control bg-brand px-5 py-2.5 text-body-sm font-medium text-brand-fg transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {running ? "Pause" : at.done ? "Restart" : elapsed > 0 ? "Resume" : "Start"}
            </button>
            <button type="button" onClick={reset} className={btn}>
              Reset
            </button>
            <button type="button" onClick={full} className={btn}>
              Fullscreen
            </button>
            <button
              type="button"
              onClick={() => setMuted((x) => !x)}
              aria-pressed={!muted}
              className={btn}
            >
              {muted ? "Sound off" : "Sound on"}
            </button>
          </div>
          <Note>
            The space bar starts and pauses the clock. While it runs, the page asks your browser to
            stop the screen dimming. Nothing leaves your device and no account is needed.
          </Note>
        </section>
      }
    />
  );
}
