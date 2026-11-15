"use client";

import {
  dots,
  type Formula,
  ipfGl,
  LEVELS,
  type Lift,
  loadBar,
  oneRepMax,
  percentAtRpe,
  percentTable,
  roundToNearest,
  type Sex,
  sinclair,
  strengthLevel,
  tempoTime,
  type VolumeBand,
  volumeBand,
  warmupRamp,
  wilks,
} from "@traiv/calculators/strength";
import { inRange, kgToLb, lbToKg } from "@traiv/calculators/units";
import { Checkbox } from "@traiv/ui/components/checkbox";
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
} from "../kit";

type U = "lb" | "kg";
const step = (u: U) => (u === "lb" ? 5 : 2.5);
const conv = (x: Num, to: U): Num =>
  x === "" ? x : to === "kg" ? Math.round(lbToKg(x) * 2) / 2 : Math.round(kgToLb(x));
const UNIT_OPTS = [
  { value: "lb" as const, label: "lb" },
  { value: "kg" as const, label: "kg" },
];
const SEX_OPTS = [
  { value: "male" as const, label: "Male" },
  { value: "female" as const, label: "Female" },
];

export function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-sm tabular-nums">
        <thead>
          <tr className="text-left text-caption text-fg-subtle">
            {head.map((h) => (
              <th key={h} scope="col" className="py-2 pr-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r[0])} className="border-t border-line">
              {r.map((c, i) => (
                <td key={`${String(r[0])}-${i}`} className="py-2 pr-3">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------------------------------------- 1RM family */

export function makeOneRepMaxWidget(opts: {
  label: string;
  weight: number;
  formulaAs: "pills" | "select";
  lift?: string;
}) {
  return function OneRepMaxWidget() {
    const [u, setURaw] = useState<U>("lb");
    const [w, setW] = useState<Num>(opts.weight);
    const [reps, setReps] = useState<Num>(5);
    const [formula, setFormula] = useState<Formula>("epley");
    const setU = (n: U) => {
      if (n === u) return;
      setW(conv(w, n));
      setURaw(n);
    };
    const compute = () => {
      if (w === "" || w <= 0 || reps === "" || inRange(reps, 1, 36) === null) return null;
      const orm = oneRepMax(w, reps, formula);
      return { orm, table: percentTable(orm, formula, step(u)) };
    };
    const r = compute();
    const formulaOpts = [
      { value: "epley" as const, label: "Epley" },
      { value: "brzycki" as const, label: "Brzycki" },
    ];
    return (
      <ToolLayout
        form={
          <ToolForm label={opts.label} submitLabel="Calculate 1RM">
            <Pills label="Units" value={u} onChange={setU} options={UNIT_OPTS} />
            <NumberInput
              label={`Weight lifted${opts.lift ? ` (${opts.lift})` : ""}`}
              value={w}
              onChange={setW}
              min={0}
              max={u === "lb" ? 2000 : 900}
              suffix={u}
            />
            <NumberInput label="Reps performed" value={reps} onChange={setReps} min={1} max={36} />
            {opts.formulaAs === "pills" ? (
              <Pills label="Formula" value={formula} onChange={setFormula} options={formulaOpts} />
            ) : (
              <Select label="Formula" value={formula} onChange={setFormula} options={formulaOpts} />
            )}
          </ToolForm>
        }
        result={
          <ResultPanel>
            {r ? (
              <>
                <Headline
                  label={`Estimated one-rep max · ${formula === "epley" ? "Epley" : "Brzycki"}`}
                  value={fmt(r.orm, 1)}
                  unit={u}
                />
                <Table
                  head={["% of 1RM", "Working weight", "Est. reps"]}
                  rows={r.table.map((t) => [
                    `${Math.round(t.pct * 100)}%`,
                    `${fmt(t.weight, u === "kg" ? 1 : 0)} ${u}`,
                    t.reps,
                  ])}
                />
                <Note>
                  Working weights are rounded to the nearest {step(u)} {u}. Estimates are most
                  reliable from sets of 10 reps or fewer.
                </Note>
              </>
            ) : (
              <ErrorText>Enter a weight above zero and between 1 and 36 reps.</ErrorText>
            )}
          </ResultPanel>
        }
      />
    );
  };
}

export const OneRepMaxWidget = makeOneRepMaxWidget({
  label: "One-rep max calculator",
  weight: 225,
  formulaAs: "pills",
});
export const BenchWidget = makeOneRepMaxWidget({
  label: "Bench press calculator",
  weight: 185,
  formulaAs: "select",
  lift: "bench",
});
export const SquatWidget = makeOneRepMaxWidget({
  label: "Squat calculator",
  weight: 225,
  formulaAs: "select",
  lift: "squat",
});
export const DeadliftWidget = makeOneRepMaxWidget({
  label: "Deadlift calculator",
  weight: 315,
  formulaAs: "select",
  lift: "deadlift",
});
export const OhpWidget = makeOneRepMaxWidget({
  label: "Overhead press calculator",
  weight: 185,
  formulaAs: "select",
  lift: "overhead press",
});

/* ------------------------------------------------------------- score family */

function useScoreInputs(bw: number, total: number) {
  const [u, setURaw] = useState<U>("kg");
  const [sex, setSex] = useState<Sex>("male");
  const [bwv, setBw] = useState<Num>(bw);
  const [tot, setTot] = useState<Num>(total);
  const setU = (n: U) => {
    if (n === u) return;
    setBw(conv(bwv, n));
    setTot(conv(tot, n));
    setURaw(n);
  };
  const kg = (x: Num) => (x === "" ? Number.NaN : u === "lb" ? lbToKg(x) : x);
  const valid = bwv !== "" && tot !== "" && kg(bwv) >= 30 && kg(bwv) <= 250 && kg(tot) > 0;
  return { u, setU, sex, setSex, bwv, setBw, tot, setTot, kg, valid };
}

function ScoreFields({
  s,
  totalLabel = "Total lifted",
}: {
  s: ReturnType<typeof useScoreInputs>;
  totalLabel?: string;
}) {
  return (
    <>
      <Pills
        label="Units"
        value={s.u}
        onChange={s.setU}
        options={[
          { value: "kg", label: "kg" },
          { value: "lb", label: "lb" },
        ]}
      />
      <Pills label="Sex" value={s.sex} onChange={s.setSex} options={SEX_OPTS} stretch />
      <NumberInput
        label="Body weight"
        value={s.bwv}
        onChange={s.setBw}
        min={s.u === "kg" ? 30 : 66}
        max={s.u === "kg" ? 250 : 550}
        suffix={s.u}
      />
      <NumberInput
        label={totalLabel}
        value={s.tot}
        onChange={s.setTot}
        min={0}
        max={s.u === "kg" ? 1500 : 3300}
        suffix={s.u}
      />
    </>
  );
}

const SCORE_ERR =
  "Enter a body weight between 30 and 250 kg (66 to 550 lb) and a total above zero.";

export function WilksWidget() {
  const s = useScoreInputs(90, 500);
  const compute = () => (s.valid ? wilks(s.kg(s.tot), s.kg(s.bwv), s.sex) : null);
  const r = compute();
  return (
    <ToolLayout
      form={
        <ToolForm label="Wilks calculator" submitLabel="Calculate Wilks score">
          <ScoreFields s={s} />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r !== null ? (
            <>
              <Headline label="Wilks 2020 score" value={fmt(r, 1)} note="Wilks 2020 coefficients" />
              <Note>
                Compare with records using Wilks 2020, the same division and judging standards.
                Original Wilks scores use a different scale.
              </Note>
            </>
          ) : (
            <ErrorText>{SCORE_ERR}</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function DotsWidget() {
  const s = useScoreInputs(90, 600);
  const compute = () => (s.valid ? dots(s.kg(s.tot), s.kg(s.bwv), s.sex) : null);
  const r = compute();
  return (
    <ToolLayout
      form={
        <ToolForm label="DOTS calculator" submitLabel="Calculate DOTS score">
          <ScoreFields s={s} />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r !== null ? (
            <>
              <Headline label="DOTS score" value={fmt(r, 1)} />
              <Table
                head={["Total", "DOTS at this body weight"]}
                rows={[-100, -50, 0, 50, 100].map((d) => {
                  const t = s.kg(s.tot) + d;
                  return [
                    `${fmt(s.u === "kg" ? t : kgToLb(t))} ${s.u}`,
                    fmt(dots(t, s.kg(s.bwv), s.sex), 1),
                  ];
                })}
              />
              <Note>
                Rough guide: 300 is a strong gym lifter, 400 nationally competitive, 500 and above
                world class.
              </Note>
            </>
          ) : (
            <ErrorText>{SCORE_ERR}</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function WilksDotsWidget() {
  const s = useScoreInputs(82.5, 500);
  const compute = () =>
    s.valid
      ? { w: wilks(s.kg(s.tot), s.kg(s.bwv), s.sex), d: dots(s.kg(s.tot), s.kg(s.bwv), s.sex) }
      : null;
  const r = compute();
  return (
    <ToolLayout
      form={
        <ToolForm label="Wilks and DOTS calculator" submitLabel="Calculate scores">
          <ScoreFields s={s} />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Stats
                items={[
                  { label: "Wilks", value: fmt(r.w, 1) },
                  { label: "DOTS", value: fmt(r.d, 1) },
                ]}
              />
              <Note>
                Wilks 2020 and DOTS use different scales. Compare progress within the same formula
                rather than comparing their point values directly.
              </Note>
            </>
          ) : (
            <ErrorText>{SCORE_ERR}</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function IpfGlWidget() {
  const s = useScoreInputs(90, 700);
  const [lifts, setLifts] = useState<Num[]>(["", "", ""]);
  const setLift = (index: number, value: Num) => {
    const next = lifts.map((load, i) => (i === index ? value : load));
    setLifts(next);
    if (next.some((load) => load !== ""))
      s.setTot(next.reduce<number>((sum, load) => sum + (load === "" ? 0 : load), 0));
  };
  const setUnit = (unit: U) => {
    if (unit === s.u) return;
    setLifts(lifts.map((load) => conv(load, unit)));
    s.setU(unit);
  };
  const [div, setDiv] = useState<"classic" | "equipped">("classic");
  const compute = () =>
    s.valid && lifts.every((load) => load === "" || load >= 0)
      ? ipfGl(s.kg(s.tot), s.kg(s.bwv), s.sex, div)
      : null;
  const r = compute();
  return (
    <ToolLayout
      form={
        <ToolForm label="IPF GL points calculator" submitLabel="Calculate IPF GL points">
          <ScoreFields s={{ ...s, setU: setUnit }} totalLabel="Total (squat + bench + deadlift)" />
          <p className="text-caption text-fg-muted">
            Or add your individual lifts. Entered lifts update the total.
          </p>
          {(["Squat", "Bench", "Deadlift"] as const).map((label, index) => (
            <NumberInput
              key={label}
              label={`${label} (optional)`}
              value={lifts[index] ?? ""}
              onChange={(value) => setLift(index, value)}
              min={0}
              max={s.u === "kg" ? 1000 : 2200}
              suffix={s.u}
            />
          ))}
          <Pills
            label="Division"
            value={div}
            onChange={setDiv}
            options={[
              { value: "classic", label: "Classic (raw)" },
              { value: "equipped", label: "Equipped" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r !== null ? (
            <>
              <Headline
                label="IPF GL points"
                value={fmt(r, 2)}
                note={`${div === "classic" ? "Classic" : "Equipped"} powerlifting`}
              />
              {s.kg(s.bwv) < 40 ? (
                <Note>
                  Body weight is below the formula’s 40 kg floor. The calculation uses 40 kg; treat
                  the score as approximate.
                </Note>
              ) : null}
              <Note>
                Around 70 is a capable gym lifter, 90 to 100 regionally competitive, and over 110
                international level.
              </Note>
            </>
          ) : (
            <ErrorText>{SCORE_ERR}</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function SinclairWidget() {
  const [u, setURaw] = useState<U>("kg");
  const [sex, setSex] = useState<Sex>("male");
  const [bw, setBw] = useState<Num>(89);
  const [sn, setSn] = useState<Num>(150);
  const [cj, setCj] = useState<Num>(185);
  const setU = (n: U) => {
    if (n === u) return;
    setBw(conv(bw, n));
    setSn(conv(sn, n));
    setCj(conv(cj, n));
    setURaw(n);
  };
  const kg = (x: Num) => (x === "" ? Number.NaN : u === "lb" ? lbToKg(x) : x);
  const compute = () => {
    if (!(kg(bw) >= 30 && kg(bw) <= 250) || !(kg(sn) > 0) || !(kg(cj) > 0)) return null;
    const raw = kg(sn) + kg(cj);
    return { raw, ...sinclair(raw, kg(bw), sex) };
  };
  const r = compute();
  return (
    <ToolLayout
      form={
        <ToolForm label="Sinclair calculator" submitLabel="Calculate Sinclair total">
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "kg", label: "kg" },
              { value: "lb", label: "lb" },
            ]}
          />
          <Pills label="Sex" value={sex} onChange={setSex} options={SEX_OPTS} stretch />
          <NumberInput
            label="Body weight"
            value={bw}
            onChange={setBw}
            min={0}
            max={600}
            suffix={u}
          />
          <NumberInput label="Snatch" value={sn} onChange={setSn} min={0} max={600} suffix={u} />
          <NumberInput
            label="Clean and jerk"
            value={cj}
            onChange={setCj}
            min={0}
            max={700}
            suffix={u}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Sinclair total"
                value={fmt(r.total, 1)}
                unit="kg"
                note={`Actual total ${fmt(r.raw, 1)} kg × coefficient ${r.coef.toFixed(4)}`}
              />
              <Note>
                The Sinclair total shows what you would lift at the heaviest body weight, so lifters
                of different sizes can be compared.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter a body weight between 30 and 250 kg and both lifts above zero.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* --------------------------------------------------------------- RPE / RIR */

function useEffort(defaultReps: number, defaultRpe: number) {
  const [mode, setMode] = useState<"pct" | "work">("pct");
  const [u, setURaw] = useState<U>("lb");
  const [reps, setReps] = useState<Num>(defaultReps);
  const [rpe, setRpe] = useState(String(defaultRpe));
  const [w, setW] = useState<Num>("");
  const setU = (n: U) => {
    if (n === u) return;
    setW(conv(w, n));
    setURaw(n);
  };
  return { mode, setMode, u, setU, reps, setReps, rpe, setRpe, w, setW };
}

function EffortResult({ e }: { e: ReturnType<typeof useEffort> }) {
  if (e.reps === "" || inRange(e.reps, 1, 12) === null)
    return <ErrorText>Enter between 1 and 12 reps.</ErrorText>;
  const pct = percentAtRpe(e.reps, Number(e.rpe));
  const hasW = e.w !== "" && e.w > 0;
  return (
    <>
      <Headline
        label="Percent of one-rep max"
        value={`${fmt(pct * 100, 1)}%`}
        note={`${e.reps} reps at RPE ${e.rpe} (${fmt(10 - Number(e.rpe), 1)} reps in reserve)`}
      />
      {hasW ? (
        e.mode === "pct" ? (
          <Stats
            items={[
              { label: "Estimated one-rep max", value: `${fmt((e.w as number) / pct, 1)} ${e.u}` },
            ]}
          />
        ) : (
          <Stats
            items={[
              {
                label: "Working weight for this set",
                value: `${fmt(roundToNearest((e.w as number) * pct, step(e.u)), 1)} ${e.u}`,
                note: `From a ${fmt(e.w as number)} ${e.u} one-rep max`,
              },
            ]}
          />
        )
      ) : (
        <Note>
          {e.mode === "pct"
            ? "Add the weight you used to estimate your one-rep max."
            : "Add your one-rep max to get the weight for this set."}
        </Note>
      )}
    </>
  );
}

function EffortForm({
  e,
  label,
  rpeField,
}: {
  e: ReturnType<typeof useEffort>;
  label: string;
  rpeField: React.ReactNode;
}) {
  return (
    <ToolForm label={label}>
      <Pills
        label="Work out"
        value={e.mode}
        onChange={e.setMode}
        options={[
          { value: "pct", label: "% and one-rep max" },
          { value: "work", label: "Working weight" },
        ]}
      />
      <Pills label="Units" value={e.u} onChange={e.setU} options={UNIT_OPTS} />
      <NumberInput label="Reps" value={e.reps} onChange={e.setReps} min={1} max={12} />
      {rpeField}
      <NumberInput
        label={e.mode === "pct" ? "Weight used (optional)" : "Your one-rep max"}
        value={e.w}
        onChange={e.setW}
        min={0}
        max={e.u === "lb" ? 2000 : 900}
        suffix={e.u}
      />
    </ToolForm>
  );
}

export function RpeWidget() {
  const e = useEffort(5, 8);
  const RPES = ["10", "9.5", "9", "8.5", "8", "7.5", "7", "6.5", "6"];
  const left: Record<string, string> = {
    "10": "0 reps left",
    "9.5": "0 to 1 left",
    "9": "1 rep left",
    "8.5": "1 to 2 left",
    "8": "2 reps left",
    "7.5": "2 to 3 left",
    "7": "3 reps left",
    "6.5": "3 to 4 left",
    "6": "4 reps left",
  };
  return (
    <ToolLayout
      form={
        <EffortForm
          e={e}
          label="RPE calculator"
          rpeField={
            <Select
              label="Target RPE"
              value={e.rpe}
              onChange={e.setRpe}
              options={RPES.map((x) => ({ value: x, label: `${x}: ${left[x]}` }))}
            />
          }
        />
      }
      result={
        <ResultPanel>
          <EffortResult e={e} />
        </ResultPanel>
      }
    />
  );
}

export function RirWidget() {
  const e = useEffort(8, 8);
  return (
    <ToolLayout
      form={
        <EffortForm
          e={e}
          label="RIR calculator"
          rpeField={
            <Select
              label="Reps in reserve"
              value={e.rpe}
              onChange={e.setRpe}
              options={[0, 1, 2, 3, 4, 5].map((rir) => ({
                value: String(10 - rir),
                label: `${rir}${rir === 0 ? ": to failure" : rir === 1 ? " rep left" : " reps left"} (RPE ${10 - rir})`,
              }))}
            />
          }
        />
      }
      result={
        <ResultPanel>
          <EffortResult e={e} />
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------------------- tempo */

export function TempoWidget() {
  const [ecc, setEcc] = useState<Num>(3);
  const [bot, setBot] = useState<Num>(1);
  const [con, setCon] = useState<Num>(2);
  const [top, setTop] = useState<Num>(0);
  const [reps, setReps] = useState<Num>(8);
  const [sets, setSets] = useState<Num>(3);
  const ok =
    [ecc, bot, con, top].every((x) => x !== "" && x >= 0 && x <= 20) &&
    reps !== "" &&
    sets !== "" &&
    reps >= 1 &&
    sets >= 1;
  const r = ok
    ? tempoTime(
        ecc as number,
        bot as number,
        con as number,
        top as number,
        reps as number,
        sets as number,
      )
    : null;
  return (
    <ToolLayout
      form={
        <ToolForm label="Tempo calculator">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <NumberInput label="Lower" value={ecc} onChange={setEcc} min={0} max={20} suffix="s" />
            <NumberInput
              label="Pause at bottom"
              value={bot}
              onChange={setBot}
              min={0}
              max={20}
              suffix="s"
            />
            <NumberInput
              label="Lift"
              hint="Explosive counts as 1"
              value={con}
              onChange={setCon}
              min={0}
              max={20}
              suffix="s"
            />
            <NumberInput
              label="Pause at top"
              value={top}
              onChange={setTop}
              min={0}
              max={20}
              suffix="s"
            />
          </div>
          <NumberInput label="Reps per set" value={reps} onChange={setReps} min={1} max={100} />
          <NumberInput label="Sets" value={sets} onChange={setSets} min={1} max={50} />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label={`Tempo ${ecc}-${bot}-${con}-${top}`}
                value={`${r.perSet} s`}
                note="Time under tension per set"
              />
              <Stats
                items={[
                  { label: "Per rep", value: `${r.perRep} s` },
                  {
                    label: "Per session",
                    value: `${fmt(r.total / 60, 1)} min`,
                    note: `${r.total} s across ${sets} sets`,
                  },
                ]}
              />
              <Note>
                Most muscle-building work lands at 20 to 70 seconds per set. Slow lowering builds
                control; it does not need to be very slow to work.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter each tempo phase from 0 to 20 seconds, and at least one rep and one set.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------------------ warm-up */

export function WarmupWidget() {
  const [u, setURaw] = useState<U>("lb");
  const [w, setW] = useState<Num>(225);
  const [reps, setReps] = useState<Num>(5);
  const [mode, setMode] = useState<"full" | "quick">("full");
  const setU = (n: U) => {
    if (n === u) return;
    setW(conv(w, n));
    setURaw(n);
  };
  const bar = u === "lb" ? 45 : 20;
  const compute = () =>
    w === "" || w < bar || reps === "" ? null : warmupRamp(w, mode, bar, step(u));
  const r = compute();
  return (
    <ToolLayout
      form={
        <ToolForm label="Warm-up set calculator" submitLabel="Build warm-up ramp">
          <Pills label="Units" value={u} onChange={setU} options={UNIT_OPTS} />
          <NumberInput
            label="Working weight"
            value={w}
            onChange={setW}
            min={bar}
            max={u === "lb" ? 2000 : 900}
            suffix={u}
          />
          <NumberInput label="Working set reps" value={reps} onChange={setReps} min={1} max={30} />
          <Pills
            label="Ramp"
            value={mode}
            onChange={setMode}
            options={[
              { value: "full", label: "Full (5 steps)" },
              { value: "quick", label: "Quick (3 steps)" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Warm-up sets"
                value={String(r.length)}
                unit="sets"
                note={`Then ${reps} × ${w} ${u}`}
              />
              <Table
                head={["Set", "Weight", "Reps"]}
                rows={[
                  ...r.map((s, i) => [
                    i + 1,
                    `${fmt(s.weight, u === "kg" ? 1 : 0)} ${u}${s.pct === 0 ? " (bar)" : ` (${Math.round(s.pct * 100)}%)`}`,
                    s.reps,
                  ]),
                  ["Work", `${w} ${u}`, reps],
                ]}
              />
              <Note>
                Rest 60 to 90 seconds between warm-up sets. Low reps near the top keep you fresh for
                the working sets.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter a working weight of at least the bar ({bar} {u}).
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ----------------------------------------------------------- plate loading */

const PLATES = { kg: [25, 20, 15, 10, 5, 2.5, 1.25], lb: [45, 35, 25, 10, 5, 2.5] } as const;
const BARS = { kg: [20, 15, 10], lb: [45, 35, 25] } as const;

export function PlateLoadingWidget() {
  const [u, setURaw] = useState<U>("kg");
  const [target, setTarget] = useState<Num>(102.5);
  const [bar, setBar] = useState("20");
  const [have, setHave] = useState<number[]>([...PLATES.kg]);
  const setU = (n: U) => {
    if (n === u) return;
    setTarget(conv(target, n));
    setBar(String(BARS[n][0]));
    setHave([...PLATES[n]]);
    setURaw(n);
  };
  const toggle = (p: number) =>
    setHave((h) => (h.includes(p) ? h.filter((x) => x !== p) : [...h, p]));
  const compute = () =>
    target === "" || target < Number(bar) ? null : loadBar(target, Number(bar), have);
  const r = compute();
  return (
    <ToolLayout
      form={
        <ToolForm label="Plate loading calculator" submitLabel="Load the bar">
          <Pills
            label="Units"
            value={u}
            onChange={setU}
            options={[
              { value: "kg", label: "kg" },
              { value: "lb", label: "lb" },
            ]}
          />
          <NumberInput
            label="Target weight"
            value={target}
            onChange={setTarget}
            min={0}
            max={u === "kg" ? 600 : 1300}
            suffix={u}
          />
          <Select
            label="Bar weight"
            value={bar}
            onChange={setBar}
            options={BARS[u].map((b, i) => ({
              value: String(b),
              label: `${b} ${u}${i === 0 ? " standard bar" : i === 1 ? (u === "kg" ? " women's bar" : " lighter bar") : " technique bar"}`,
            }))}
          />
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-body-sm font-medium">Plates you have</legend>
            <div className="flex flex-wrap gap-2">
              {PLATES[u].map((p) => (
                <div
                  key={p}
                  className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line px-3 text-body-sm"
                >
                  <Checkbox
                    id={`plate-${u}-${p}`}
                    aria-label={`${p} ${u} plates`}
                    checked={have.includes(p)}
                    onCheckedChange={() => toggle(p)}
                    controlClassName="min-h-11 min-w-11"
                  />
                  <label htmlFor={`plate-${u}-${p}`} className="cursor-pointer">
                    {p} {u}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Each side of the bar"
                value={r.perSide.length ? r.perSide.join(" + ") : "No plates"}
                unit={r.perSide.length ? u : undefined}
                note={`Bar ${bar} ${u} · loaded ${fmt(r.loaded, 2)} ${u}`}
              />
              {r.short > 0 ? (
                <Note>
                  Closest you can load is {fmt(r.loaded, 2)} {u}, {fmt(r.short, 2)} {u} short. Add
                  smaller plates to get closer.
                </Note>
              ) : (
                <Note>
                  Load the heaviest plates first, closest to the collar side of the sleeve.
                </Note>
              )}
            </>
          ) : (
            <ErrorText>Enter a target at least as heavy as the selected bar.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------ strength standards */

export function StandardsWidget() {
  const [u, setURaw] = useState<U>("lb");
  const [sex, setSex] = useState<Sex>("male");
  const [lift, setLift] = useState<Lift>("squat");
  const [orm, setOrm] = useState<Num>(275);
  const [bw, setBw] = useState<Num>(180);
  const setU = (n: U) => {
    if (n === u) return;
    setOrm(conv(orm, n));
    setBw(conv(bw, n));
    setURaw(n);
  };
  const compute = () =>
    orm === "" || bw === "" || orm <= 0 || bw <= 0 ? null : strengthLevel(orm, bw, sex, lift);
  const r = compute();
  return (
    <ToolLayout
      form={
        <ToolForm label="Strength standards calculator" submitLabel="Rank this lift">
          <Pills label="Units" value={u} onChange={setU} options={UNIT_OPTS} />
          <Pills label="Sex" value={sex} onChange={setSex} options={SEX_OPTS} stretch />
          <Select
            label="Lift"
            value={lift}
            onChange={setLift}
            options={[
              { value: "squat", label: "Back squat" },
              { value: "bench", label: "Bench press" },
              { value: "deadlift", label: "Deadlift" },
              { value: "ohp", label: "Overhead press" },
            ]}
          />
          <NumberInput
            label="One-rep max"
            value={orm}
            onChange={setOrm}
            min={0}
            max={u === "lb" ? 2000 : 900}
            suffix={u}
          />
          <NumberInput
            label="Body weight"
            value={bw}
            onChange={setBw}
            min={0}
            max={u === "lb" ? 600 : 272}
            suffix={u}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Your level"
                value={r.level}
                note={`${r.ratio.toFixed(2)} × body weight`}
              />
              <Note>
                Strength Level bodyweight-ratio benchmarks, checked 15 November 2026. These describe
                a lifting community, not the general population, and do not adjust for age.
              </Note>
              <Table
                head={["Level", "From"]}
                rows={LEVELS.map((l, i) => [
                  l,
                  i === 0
                    ? "Start"
                    : `${r.thresholds[i - 1]} × BW (${fmt((r.thresholds[i - 1] ?? 0) * (bw as number))} ${u})`,
                ])}
              />
              {r.nextLevel && r.nextWeight ? (
                <Note>
                  {r.nextLevel} starts at about {fmt(r.nextWeight)} {u} at your body weight.
                </Note>
              ) : (
                <Note>You are at the top level for this lift.</Note>
              )}
            </>
          ) : (
            <ErrorText>Enter a one-rep max and body weight above zero.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------------ weekly volume */

const MUSCLES: [string, number, number][] = [
  ["Chest", 5, 4],
  ["Back", 6, 4],
  ["Shoulders", 4, 3],
  ["Biceps", 3, 3],
  ["Triceps", 3, 3],
  ["Quads", 5, 3],
  ["Hamstrings", 4, 2],
  ["Glutes", 3, 2],
  ["Calves", 3, 2],
  ["Abs", 4, 2],
];
const BAND_LABEL: Record<VolumeBand, string> = {
  "below-mev": "Below MEV",
  productive: "Productive",
  high: "High",
  "above-mrv": "Above MRV",
};

export function VolumeWidget() {
  const [mev, setMev] = useState<Num>(10);
  const [mav, setMav] = useState<Num>(15);
  const [mrv, setMrv] = useState<Num>(20);
  const [rows, setRows] = useState(
    MUSCLES.map(([name, sets, sessions]) => ({
      name,
      sets: sets as Num,
      sessions: sessions as Num,
    })),
  );
  const set = (i: number, k: "sets" | "sessions", v: Num) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const ok =
    mev !== "" &&
    mav !== "" &&
    mrv !== "" &&
    mev >= 0 &&
    mev <= mav &&
    mav <= mrv &&
    rows.every(
      (row) =>
        row.sets !== "" &&
        row.sessions !== "" &&
        row.sets >= 0 &&
        row.sessions >= 0 &&
        row.sessions <= 7,
    );
  return (
    <ToolLayout
      form={
        <ToolForm label="Weekly training volume calculator">
          <div className="grid grid-cols-3 gap-3">
            <NumberInput label="MEV" value={mev} onChange={setMev} min={0} max={50} />
            <NumberInput label="MAV" value={mav} onChange={setMav} min={0} max={50} />
            <NumberInput label="MRV" value={mrv} onChange={setMrv} min={0} max={60} />
          </div>
          {rows.map((r, i) => (
            <div key={r.name} className="grid grid-cols-2 gap-3">
              <NumberInput
                label={`${r.name} sets per session`}
                value={r.sets}
                onChange={(v) => set(i, "sets", v)}
                min={0}
                max={30}
              />
              <NumberInput
                label={`${r.name} sessions per week`}
                value={r.sessions}
                onChange={(v) => set(i, "sessions", v)}
                min={0}
                max={7}
              />
            </div>
          ))}
        </ToolForm>
      }
      result={
        <ResultPanel>
          {ok ? (
            <>
              <Table
                head={["Muscle", "Weekly sets", "Status"]}
                rows={rows.map((r) => {
                  const w = (r.sets === "" ? 0 : r.sets) * (r.sessions === "" ? 0 : r.sessions);
                  return [
                    r.name,
                    w,
                    BAND_LABEL[volumeBand(w, mev as number, mav as number, mrv as number)],
                  ];
                })}
              />
              <Note>
                Count hard sets only: sets taken within about three reps of failure. Adjust the
                landmarks to your own recovery over a few training blocks.
              </Note>
            </>
          ) : (
            <ErrorText>Set MEV, MAV and MRV in increasing order.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}
