"use client";

import {
  type Experience,
  type Goal,
  HEALTH_AREAS,
  type HealthArea,
  type Phase,
  readBusinessHealth,
  readCheckin,
  readChurnRisk,
  readLift,
  readWeightTrend,
} from "@traiv/calculators/readers";
import { Textarea } from "@traiv/ui/components/textarea";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { Field, Slider } from "@/components/tool-controls";
import {
  CHECKIN,
  CHURN,
  DIFFICULT,
  HEALTH_BAND,
  HEALTH_FIX,
  HEALTH_QUESTIONS,
  LIFT,
  OBJECTIONS,
  SCOPE,
  SCOPE_LABEL,
  TONES,
  type Tone,
  WEIGHT,
} from "@/content/tools/reader-scripts";
import {
  ErrorText,
  fmt,
  Note,
  type Num,
  NumberInput,
  Pills,
  ResultPanel,
  Select,
  ToolForm,
  ToolLayout,
  Warning,
} from "../kit";
import { useTool } from "../tool-context";
import { trackCalculateSettled } from "../track";

/** Readers update as you type; record one settled read, not one per keystroke. */
function useSettled(key: string) {
  const tool = useTool();
  useEffect(() => {
    if (key) trackCalculateSettled(tool.slug, tool.group, tool.kind);
  }, [key, tool.slug, tool.group, tool.kind]);
}

function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <Field label={label} {...(hint ? { hint } : {})}>
      {(id) => (
        <Textarea
          id={id}
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}

function SliderField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={`${label}: ${value}%`}>
      {(id) => <Slider id={id} value={value} onChange={onChange} min={0} max={100} step={5} />}
    </Field>
  );
}

function Message({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-control border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-caption font-medium text-fg-muted">{title}</p>
        <CopyButton text={text} label={title} />
      </div>
      <p className="text-body-sm whitespace-pre-line">{text}</p>
    </div>
  );
}

function Read({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-caption font-medium text-fg-muted">{label}</p>
      <p className="mt-1 font-display text-lead font-medium">{title}</p>
      {children ? (
        <div className="mt-2 flex flex-col gap-2 text-body-sm text-fg-muted">{children}</div>
      ) : null}
    </div>
  );
}

const SCALE = ["1", "2", "3", "4", "5"].map((v) => ({ value: v, label: v }));
const TONE_PILLS = <T extends Tone>(v: T, set: (t: Tone) => void) => (
  <Pills label="Reply tone" value={v} onChange={set} options={TONES} />
);

/* -------------------------------------------------------- check-in reader */

export function CheckinReaderWidget() {
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [weight, setWeight] = useState<Num>("");
  const [weeks, setWeeks] = useState<Num>(3);
  const [adh, setAdh] = useState(85);
  const [done, setDone] = useState<Num>(3);
  const [plan, setPlan] = useState<Num>(4);
  const [sleep, setSleep] = useState<Num>(7);
  const [energy, setEnergy] = useState("3");
  const [stress, setStress] = useState("2");
  const [goal, setGoal] = useState<Goal>("deficit");
  const [note, setNote] = useState("");
  const [tone, setTone] = useState<Tone>("warm");
  const valid =
    weeks !== "" &&
    done !== "" &&
    plan !== "" &&
    sleep !== "" &&
    plan >= 1 &&
    done <= plan * 2 &&
    sleep <= 14;
  const r = useMemo(
    () =>
      valid
        ? readCheckin({
            weightChangeKg: weight === "" ? null : unit === "kg" ? weight : weight * 0.45359237,
            weeks: Number(weeks),
            adherencePct: adh,
            trainingDone: Number(done),
            trainingPlanned: Number(plan),
            sleepHours: Number(sleep),
            energy: Number(energy),
            stress: Number(stress),
            goal,
            note,
          })
        : null,
    [valid, weight, unit, weeks, adh, done, plan, sleep, energy, stress, goal, note],
  );
  useSettled(r ? r.verdict : "");
  const c = r ? CHECKIN[r.verdict] : null;
  return (
    <ToolLayout
      form={
        <ToolForm label="Client check-in reader">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
            <Field
              label="Weight change this week"
              hint="Negative for a loss, e.g. −0.4. Leave blank if not weighed."
            >
              {(id) => (
                <input
                  id={id}
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={weight}
                  placeholder="-0.4"
                  onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
                  className="h-11 w-full rounded-control border border-line-strong bg-surface px-3 text-body-sm tabular-nums"
                />
              )}
            </Field>
            <Pills
              label="Unit"
              value={unit}
              onChange={setUnit}
              options={[
                { value: "kg", label: "kg" },
                { value: "lb", label: "lb" },
              ]}
            />
          </div>
          <NumberInput
            label="Weeks on this plan"
            value={weeks}
            onChange={setWeeks}
            min={0}
            max={104}
          />
          <SliderField label="Nutrition adherence" value={adh} onChange={setAdh} />
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Training sessions done"
              value={done}
              onChange={setDone}
              min={0}
              max={14}
            />
            <NumberInput
              label="Sessions planned"
              value={plan}
              onChange={setPlan}
              min={1}
              max={14}
            />
          </div>
          <NumberInput
            label="Sleep (average hours)"
            value={sleep}
            onChange={setSleep}
            min={0}
            max={14}
            suffix="h"
          />
          <Pills label="Energy (1–5)" value={energy} onChange={setEnergy} options={SCALE} stretch />
          <Pills label="Stress (1–5)" value={stress} onChange={setStress} options={SCALE} stretch />
          <Pills
            label="Goal / phase"
            value={goal}
            onChange={setGoal}
            options={[
              { value: "deficit", label: "Fat loss" },
              { value: "maintenance", label: "Maintain" },
              { value: "surplus", label: "Muscle gain" },
            ]}
          />
          <TextField
            label="The client's note"
            hint="Checked for anything that needs a professional rather than a plan change."
            value={note}
            onChange={setNote}
            placeholder="What the client wrote about their week…"
            rows={2}
          />
          {TONE_PILLS(tone, setTone)}
        </ToolForm>
      }
      result={
        <ResultPanel label="The read">
          {r && c ? (
            <>
              <Read label="The read" title={c.title}>
                {r.reasons.map((x) => (
                  <p key={x}>{x}</p>
                ))}
                <p>{c.move}</p>
              </Read>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-control border border-line bg-surface p-4">
                  <dt className="text-caption font-medium text-fg-muted">The one lever</dt>
                  <dd className="mt-1 text-body-sm">{c.lever}</dd>
                </div>
                <div className="rounded-control border border-line bg-surface p-4">
                  <dt className="text-caption font-medium text-fg-muted">Leave alone</dt>
                  <dd className="mt-1 text-body-sm">{c.leave}</dd>
                </div>
              </dl>
              {r.verdict === "refer" ? (
                <Warning>
                  Not medical advice. If the client describes a medical emergency, tell them to
                  contact local emergency services now.
                </Warning>
              ) : null}
              <Message title="Client reply" text={c.msg[tone]} />
            </>
          ) : (
            <ErrorText>
              Enter weeks on the plan, sessions done and planned (at least 1 planned) and average
              sleep up to 14 hours.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- churn risk */

export function ChurnRiskWidget() {
  const [tenure, setTenure] = useState<Num>(12);
  const [last, setLast] = useState<"0" | "2" | "3">("0");
  const [replies, setReplies] = useState<"yes" | "slow" | "quiet">("yes");
  const [adh, setAdh] = useState<"steady" | "slipping" | "dropped">("steady");
  const [results, setResults] = useState<"ontrack" | "stalled" | "backwards">("ontrack");
  const [mood, setMood] = useState<"positive" | "neutral" | "frustrated">("positive");
  const [pay, setPay] = useState<"current" | "renewal" | "failed">("current");
  const [note, setNote] = useState("");
  const [tone, setTone] = useState<Tone>("warm");
  const r = useMemo(
    () =>
      tenure === ""
        ? null
        : readChurnRisk({
            tenureWeeks: tenure,
            lastCheckin: Number(last) as 0 | 2 | 3,
            replies,
            adherence: adh,
            results,
            mood,
            payment: pay,
            note,
          }),
    [tenure, last, replies, adh, results, mood, pay, note],
  );
  useSettled(r ? `${r.level}-${r.score}` : "");
  const c = r ? CHURN[r.exit ? "exit" : r.level] : null;
  return (
    <ToolLayout
      form={
        <ToolForm label="Client churn-risk reader">
          <NumberInput
            label="Weeks as a client"
            value={tenure}
            onChange={setTenure}
            min={0}
            max={520}
          />
          <Pills
            label="Last check-in"
            value={last}
            onChange={setLast}
            options={[
              { value: "0", label: "On time" },
              { value: "2", label: "A week late" },
              { value: "3", label: "Missed 2+" },
            ]}
          />
          <Pills
            label="Message replies"
            value={replies}
            onChange={setReplies}
            options={[
              { value: "yes", label: "Responsive" },
              { value: "slow", label: "Slower lately" },
              { value: "quiet", label: "Gone quiet" },
            ]}
          />
          <Pills
            label="Adherence trend"
            value={adh}
            onChange={setAdh}
            options={[
              { value: "steady", label: "Steady" },
              { value: "slipping", label: "Slipping" },
              { value: "dropped", label: "Dropped off" },
            ]}
          />
          <Pills
            label="Results vs their goal"
            value={results}
            onChange={setResults}
            options={[
              { value: "ontrack", label: "On track" },
              { value: "stalled", label: "Stalled" },
              { value: "backwards", label: "Going backwards" },
            ]}
          />
          <Pills
            label="Last-contact mood"
            value={mood}
            onChange={setMood}
            options={[
              { value: "positive", label: "Positive" },
              { value: "neutral", label: "Flat" },
              { value: "frustrated", label: "Frustrated" },
            ]}
          />
          <Pills
            label="Payment"
            value={pay}
            onChange={setPay}
            options={[
              { value: "current", label: "Current" },
              { value: "renewal", label: "Renewal soon" },
              { value: "failed", label: "Missed / failed" },
            ]}
          />
          <TextField
            label="Anything they said"
            hint="Checked for signs they're thinking of stopping."
            value={note}
            onChange={setNote}
            placeholder="e.g. 'money is tight right now' or 'thinking of taking a break'…"
            rows={2}
          />
          {TONE_PILLS(tone, setTone)}
        </ToolForm>
      }
      result={
        <ResultPanel label="The read">
          {r && c ? (
            <>
              <Read
                label={`Churn risk · ${r.score} point${r.score === 1 ? "" : "s"}`}
                title={c.title}
              >
                {r.exit ? (
                  <p>What they said reads as a sign they're considering stopping.</p>
                ) : null}
                {r.reasons.length ? (
                  <ul className="list-disc pl-5">
                    {r.reasons.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No warning signs right now.</p>
                )}
                <p>{c.move}</p>
              </Read>
              {r.flags.length ? (
                <Warning>
                  The note mentions {r.flags.join(" and ")}. That needs a caring personal reply and,
                  where appropriate, a referral, before any retention conversation.
                </Warning>
              ) : null}
              <Message title="Outreach message" text={c.msg[tone]} />
            </>
          ) : (
            <ErrorText>Enter how many weeks they've been a client.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- business health */

export function BusinessHealthWidget() {
  const [scores, setScores] = useState<Record<HealthArea, "0" | "1" | "2">>(
    Object.fromEntries(HEALTH_AREAS.map((a) => [a, "1"])) as Record<HealthArea, "0" | "1" | "2">,
  );
  const r = useMemo(
    () =>
      readBusinessHealth(
        Object.fromEntries(HEALTH_AREAS.map((a) => [a, Number(scores[a]) as 0 | 1 | 2])) as Record<
          HealthArea,
          0 | 1 | 2
        >,
      ),
    [scores],
  );
  useSettled(`${r.total}-${r.leaks.join()}`);
  return (
    <ToolLayout
      form={
        <ToolForm label="Coaching business health check">
          {HEALTH_QUESTIONS.map((q, i) => (
            <Pills
              key={q.area}
              label={`${i + 1}. ${q.q}`}
              value={scores[q.area]}
              onChange={(v) => setScores({ ...scores, [q.area]: v })}
              options={[
                { value: "2", label: q.options[0] },
                { value: "1", label: q.options[1] },
                { value: "0", label: q.options[2] },
              ]}
            />
          ))}
        </ToolForm>
      }
      result={
        <ResultPanel>
          <Read label="Your score" title={`${r.total} out of ${r.max}`}>
            <p>{HEALTH_BAND[r.band]}</p>
          </Read>
          {r.leaks.length ? (
            <ol className="flex flex-col gap-3">
              {r.leaks.map((k, i) => (
                <li key={k} className="rounded-control border border-line bg-surface p-4">
                  <p className="text-caption font-medium text-fg-muted">Leak {i + 1}</p>
                  <p className="mt-1 text-body-sm font-medium">{HEALTH_FIX[k].leak}</p>
                  <p className="mt-1 text-body-sm text-fg-muted">{HEALTH_FIX[k].fix}</p>
                </li>
              ))}
            </ol>
          ) : (
            <Note>No leaks: every area scored at the top. Recheck each quarter.</Note>
          )}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- difficult client */

export function DifficultClientWidget() {
  const [v, setV] = useState(DIFFICULT[0]?.value ?? "messaging");
  const d = DIFFICULT.find((x) => x.value === v) ?? DIFFICULT[0];
  useSettled(v);
  return (
    <ToolLayout
      form={
        <ToolForm label="Difficult client responder">
          <Select
            label="The situation"
            value={v}
            onChange={setV}
            options={DIFFICULT.map((x) => ({ value: x.value, label: x.label }))}
          />
          <Note>
            Every message aims to be kind and clear at the same time, so the boundary holds and the
            relationship survives. Rewrite it in your own words before sending. This isn't legal
            advice: for contracts, refunds or safety, rely on your written terms and qualified
            advice.
          </Note>
        </ToolForm>
      }
      result={
        <ResultPanel label="The response">
          {d ? (
            <>
              <Read label="The boundary" title={d.boundary}>
                <p>{d.move}</p>
              </Read>
              {d.refer ? <Warning>{d.refer}</Warning> : null}
              <Message title="Message to send" text={d.msg} />
            </>
          ) : null}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- objections */

export function ObjectionWidget() {
  const [v, setV] = useState(OBJECTIONS[0]?.value ?? "price");
  const o = OBJECTIONS.find((x) => x.value === v) ?? OBJECTIONS[0];
  useSettled(v);
  return (
    <ToolLayout
      form={
        <ToolForm label="Sales objection handler">
          <Select
            label="The objection they raised"
            value={v}
            onChange={setV}
            options={OBJECTIONS.map((x) => ({ value: x.value, label: x.label }))}
          />
          <Note>
            These responses are for honest conversations, not pressure. They help a good fit decide
            and let a poor fit leave on good terms. Edit them to sound like you.
          </Note>
        </ToolForm>
      }
      result={
        <ResultPanel label="The play">
          {o ? (
            <>
              <Read label="What it usually means" title={o.label}>
                <p>{o.reframe}</p>
              </Read>
              <Message title="What to say" text={o.say} />
              <Message title="If they still hesitate" text={o.follow} />
            </>
          ) : null}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- scope of practice */

export function ScopeWidget() {
  const [v, setV] = useState(SCOPE[0]?.value ?? "healthy-training");
  const s = SCOPE.find((x) => x.value === v) ?? SCOPE[0];
  useSettled(v);
  return (
    <ToolLayout
      form={
        <ToolForm label="Coaching scope-of-practice check">
          <Select
            label="What is the situation?"
            value={v}
            onChange={setV}
            options={SCOPE.map((x) => ({ value: x.value, label: x.label }))}
          />
          <Note>
            Cautious, general guidance only, not legal or medical advice. Your qualification's scope
            and local rules take priority.
          </Note>
        </ToolForm>
      }
      result={
        <ResultPanel label="The call">
          {s ? (
            <>
              <Read label="The call" title={SCOPE_LABEL[s.call]}>
                <p>{s.what}</p>
              </Read>
              {s.call === "refer" ? (
                <Warning>
                  If symptoms are severe or sudden, the client should contact local emergency
                  services straight away.
                </Warning>
              ) : null}
              <Message
                title={s.call === "lane" ? "Message to the client" : "Referral message"}
                text={s.message}
              />
              <Message title="File note" text={s.note} />
            </>
          ) : null}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- lift progression */

const LIFT_EXAMPLE = "100x5, 100x5, 102.5x5, 102.5x4, 105x3";

export function LiftReaderWidget() {
  const [series, setSeries] = useState("");
  const [lift, setLift] = useState("squat");
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [goal, setGoal] = useState<"strength" | "hypertrophy">("strength");
  const [exp, setExp] = useState<Experience>("intermediate");
  const [rec, setRec] = useState<"good" | "poor">("good");
  const r = useMemo(() => readLift(series, exp), [series, exp]);
  useSettled(r ? `${r.verdict}-${r.sets.length}` : "");
  const L = r ? LIFT[r.verdict] : null;
  const name = lift.trim() || "lift";
  return (
    <ToolLayout
      form={
        <ToolForm label="Lift progression reader">
          <TextField
            label="Top set each session (oldest to newest, 3 or more)"
            hint="One set per session, like 100x5, separated by commas or line breaks."
            value={series}
            onChange={setSeries}
            placeholder={LIFT_EXAMPLE}
          />
          <Field label="Lift (optional)">
            {(id) => (
              <input
                id={id}
                value={lift}
                onChange={(e) => setLift(e.target.value)}
                placeholder="squat, bench…"
                className="h-11 w-full rounded-control border border-line-strong bg-surface px-3 text-body-sm"
              />
            )}
          </Field>
          <Pills
            label="Unit"
            value={unit}
            onChange={setUnit}
            options={[
              { value: "kg", label: "kg" },
              { value: "lb", label: "lb" },
            ]}
          />
          <Pills
            label="Goal"
            value={goal}
            onChange={setGoal}
            options={[
              { value: "strength", label: "Strength" },
              { value: "hypertrophy", label: "Hypertrophy" },
            ]}
          />
          <Pills
            label="Training age"
            value={exp}
            onChange={setExp}
            options={[
              { value: "novice", label: "Novice" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
          />
          <Pills
            label="Recovery right now"
            value={rec}
            onChange={setRec}
            options={[
              { value: "good", label: "Sleep and food on point" },
              { value: "poor", label: "Under-slept / stressed" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel label="The read">
          {r && L ? (
            <>
              <Read
                label={`${name} · estimated 1RM ${fmt(r.first, 1)} → ${fmt(r.last, 1)} ${unit}`}
                title={L.title}
              >
                <p>
                  {L.read} Change across the sessions: {r.changePct >= 0 ? "+" : ""}
                  {fmt(r.changePct, 1)}%.
                </p>
                <p>
                  {rec === "poor" && r.verdict !== "progressing"
                    ? "Recovery is low right now, so fix sleep and food before changing the programme. "
                    : ""}
                  {L.move[exp]}
                  {goal === "hypertrophy"
                    ? " For hypertrophy, a stall in load can still mean growth if total hard sets are rising; check volume too."
                    : ""}
                </p>
              </Read>
              <Message title="Client message" text={L.msg.replaceAll("{lift}", name)} />
              <Note>
                A strength read from estimated 1RM (Epley), not an injury assessment. If a lift
                hurts, stop and get it assessed.
              </Note>
            </>
          ) : (
            <>
              <ErrorText>
                {series.trim()
                  ? "Enter at least three sessions as weight × reps, e.g. 100x5."
                  : "Paste three or more sessions to read the trend."}
              </ErrorText>
              <button
                type="button"
                onClick={() => setSeries(LIFT_EXAMPLE)}
                className="inline-flex min-h-11 w-fit cursor-pointer items-center rounded-control border border-line-strong px-4 text-body-sm font-medium transition-colors hover:bg-hover"
              >
                Try the example
              </button>
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- weight trend */

const WEIGHT_EXAMPLE = "82.1, 81.4, 81.6, 81.5, 81.3, 81.4";

export function WeightTrendWidget() {
  const [series, setSeries] = useState("");
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [cad, setCad] = useState<"weekly" | "daily">("weekly");
  const [phase, setPhase] = useState<Phase>("cut");
  const [adh, setAdh] = useState(85);
  const [waist, setWaist] = useState<"down" | "flat" | "up">("flat");
  const [str, setStr] = useState<"up" | "flat">("flat");
  const [cycle, setCycle] = useState<"no" | "yes">("no");
  const [event, setEvent] = useState<"no" | "yes">("no");
  const r = useMemo(
    () =>
      readWeightTrend(series, {
        daily: cad === "daily",
        phase,
        adherencePct: adh,
        waist,
        strength: str,
        cycle: cycle === "yes",
        event: event === "yes",
      }),
    [series, cad, phase, adh, waist, str, cycle, event],
  );
  useSettled(r ? `${r.verdict}-${r.weights.length}` : "");
  const W = r ? WEIGHT[r.verdict] : null;
  const rate = (x: number) => `${x >= 0 ? "+" : "−"}${fmt(Math.abs(x), 2)} ${unit}`;
  return (
    <ToolLayout
      form={
        <ToolForm label="Weight trend reader">
          <TextField
            label="Weigh-ins (oldest to newest, 4 or more)"
            hint="Use commas, spaces or line breaks between readings."
            value={series}
            onChange={setSeries}
            placeholder={WEIGHT_EXAMPLE}
          />
          <Pills
            label="Unit"
            value={unit}
            onChange={setUnit}
            options={[
              { value: "kg", label: "kg" },
              { value: "lb", label: "lb" },
            ]}
          />
          <Pills
            label="Weigh-in cadence"
            value={cad}
            onChange={setCad}
            options={[
              { value: "weekly", label: "Weekly" },
              { value: "daily", label: "Daily" },
            ]}
          />
          <Pills
            label="Phase"
            value={phase}
            onChange={setPhase}
            options={[
              { value: "cut", label: "Cut" },
              { value: "maintain", label: "Maintain" },
              { value: "gain", label: "Lean gain" },
            ]}
          />
          <SliderField label="Nutrition adherence" value={adh} onChange={setAdh} />
          <Pills
            label="Waist / tape"
            value={waist}
            onChange={setWaist}
            options={[
              { value: "down", label: "Down" },
              { value: "flat", label: "Flat" },
              { value: "up", label: "Up" },
            ]}
          />
          <Pills
            label="Strength"
            value={str}
            onChange={setStr}
            options={[
              { value: "up", label: "Up" },
              { value: "flat", label: "Flat" },
            ]}
          />
          <Pills
            label="Female, pre-period or on cycle"
            value={cycle}
            onChange={setCycle}
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
          />
          <Pills
            label="Recent salt, carbs or travel"
            value={event}
            onChange={setEvent}
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel label="The read">
          {r && W ? (
            <>
              <Read label={`Trend over ${fmt(r.weeks, 1)} weeks`} title={W.title}>
                <p>
                  About {rate(r.perWeek)} a week ({r.pct >= 0 ? "+" : "−"}
                  {fmt(Math.abs(r.pct), 2)}% of body weight), likely between {rate(r.lo)} and{" "}
                  {rate(r.hi)}. Readings bounced across {fmt(r.bounce, 1)} {unit}.
                </p>
                <p>{W.lever}</p>
                {r.adherenceLow &&
                (r.verdict === "stall" ||
                  r.verdict === "too-slow-gain" ||
                  r.verdict === "drifting") ? (
                  <p>Adherence is under 80%, so fix consistency before changing the numbers.</p>
                ) : null}
              </Read>
              <Message title="Client message" text={W.msg} />
              <Note>
                A trend read from a straight-line fit; the range reflects normal week-to-week
                bounce, not a precise prediction.
              </Note>
            </>
          ) : (
            <>
              <ErrorText>
                {series.trim()
                  ? "Enter at least four weigh-ins."
                  : "Paste four or more weigh-ins to read the trend."}
              </ErrorText>
              <button
                type="button"
                onClick={() => setSeries(WEIGHT_EXAMPLE)}
                className="inline-flex min-h-11 w-fit cursor-pointer items-center rounded-control border border-line-strong px-4 text-body-sm font-medium transition-colors hover:bg-hover"
              >
                Try the example
              </button>
            </>
          )}
        </ResultPanel>
      }
    />
  );
}
