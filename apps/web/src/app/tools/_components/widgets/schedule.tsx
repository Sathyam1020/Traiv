"use client";

import {
  cyclePhase,
  fastingWindow,
  fmtClock,
  isEating,
  PROTOCOLS,
  type Protocol,
} from "@traiv/calculators/schedule";
import { inRange } from "@traiv/calculators/units";
import { Input } from "@traiv/ui/components/input";
import { useEffect, useId, useState } from "react";
import {
  dateLabel,
  ErrorText,
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

/* ------------------------------------------------------- intermittent fasting */

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? (h ?? 0) * 60 + (m ?? 0) : null;
};

export function FastingWidget() {
  const [protocol, setProtocol] = useState<Protocol>("16:8");
  const [anchor, setAnchor] = useState<"last" | "first">("last");
  const [time, setTime] = useState("20:00");
  const [now, setNow] = useState<number | null>(null);
  const id = useId();
  // The clock is read after mount so the server-rendered page and the first client render agree.
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);
  const minutes = toMin(time);
  const w = minutes === null ? null : fastingWindow(protocol, anchor, minutes);
  return (
    <ToolLayout
      form={
        <ToolForm label="Intermittent fasting calculator">
          <Select
            label="Protocol"
            value={protocol}
            onChange={setProtocol}
            options={(Object.keys(PROTOCOLS) as Protocol[]).map((k) => ({
              value: k,
              label: PROTOCOLS[k].label,
            }))}
          />
          {protocol !== "5:2" ? (
            <>
              <Pills
                label="I want to set my"
                value={anchor}
                onChange={setAnchor}
                options={[
                  { value: "last", label: "Last meal" },
                  { value: "first", label: "First meal" },
                ]}
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor={id} className="text-body-sm font-medium">
                  {anchor === "last" ? "Last meal time" : "First meal time"}
                </label>
                <Input
                  id={id}
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="tabular-nums"
                />
              </div>
            </>
          ) : null}
        </ToolForm>
      }
      result={
        <ResultPanel>
          {protocol === "5:2" ? (
            <>
              <Headline
                label="5:2 is set by days, not hours"
                value="2 days"
                unit="a week"
                note="About 500 kcal (women) or 600 kcal (men) on two non-consecutive days"
              />
              <Note>
                Eat normally on the other five days. Pick two days that are usually quieter, such as
                Monday and Thursday.
              </Note>
            </>
          ) : w === null ? (
            <ErrorText>Enter a time, for example 20:00.</ErrorText>
          ) : (
            <>
              <Headline
                label="Your eating window"
                value={`${fmtClock(w.eatStart)} to ${fmtClock(w.eatEnd)}`}
                note={`Fast for ${w.fastHours} hours, eat within ${w.eatHours}`}
              />
              <Stats
                items={[
                  { label: "Fast starts", value: fmtClock(w.eatEnd) },
                  { label: "Fast ends", value: fmtClock(w.eatStart) },
                  ...(now === null
                    ? []
                    : [
                        {
                          label: "Right now",
                          value: isEating(w, now) ? "Eating window" : "Fasting",
                        },
                      ]),
                ]}
              />
              <Note>
                Water, black coffee and plain tea are fine during the fast. Total calories still
                decide weight change.
              </Note>
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

/* --------------------------------------------------------------- cycle phase */

const PHASE_NAME = {
  menstrual: "Menstrual",
  follicular: "Follicular",
  ovulation: "Ovulation (estimated)",
  luteal: "Luteal",
} as const;
const PHASE_NOTE = {
  menstrual:
    "Energy can be lower for the first day or two. Train by feel; many people are fine to train normally.",
  follicular:
    "Often a good time for harder sessions and progress on lifts, as energy tends to rise.",
  ovulation:
    "An estimate, not a fertility prediction. Some notice a short dip in energy around this point.",
  luteal:
    "Appetite and water retention often rise, especially in the last week. Expect the scale to be higher.",
} as const;

export function CyclePhaseWidget() {
  const [last, setLast] = useState("");
  const [length, setLength] = useState<Num>(28);
  const [today, setToday] = useState<Date | null>(null);
  const id = useId();
  useEffect(() => {
    const d = new Date();
    setToday(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())));
    // Default the date to 10 days ago so the page shows a worked example.
    const ex = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() - 10));
    setLast((v) => v || ex.toISOString().slice(0, 10));
  }, []);
  const lenOk = length !== "" && inRange(length, 21, 35) !== null;
  const lastDate = last ? new Date(`${last}T00:00:00Z`) : null;
  const r = today && lastDate && lenOk ? cyclePhase(lastDate, length as number, today) : null;
  return (
    <ToolLayout
      form={
        <ToolForm label="Cycle phase calculator">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-body-sm font-medium">
              First day of your last period
            </label>
            <Input
              id={id}
              type="date"
              value={last}
              onChange={(e) => setLast(e.target.value)}
              className="tabular-nums"
            />
          </div>
          <NumberInput
            label="Average cycle length"
            hint="Between 21 and 35 days."
            value={length}
            onChange={setLength}
            min={21}
            max={35}
            suffix="days"
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {!lenOk ? (
            <ErrorText>Enter an average cycle length between 21 and 35 days.</ErrorText>
          ) : today === null || !last ? (
            <Note>Enter the first day of your last period.</Note>
          ) : r === null ? (
            <ErrorText>
              That date is in the future. Enter the first day of your most recent period.
            </ErrorText>
          ) : (
            <>
              <Headline
                label={`Day ${r.day} of ${length}`}
                value={PHASE_NAME[r.phase]}
                note={PHASE_NOTE[r.phase]}
              />
              <Stats
                items={[
                  { label: "Next period expected", value: dateLabel(r.nextPeriod) },
                  {
                    label: "Follicular",
                    value: `Days ${r.ranges.follicular[0]} to ${r.ranges.follicular[1]}`,
                  },
                  { label: "Luteal", value: `Days ${r.ranges.luteal[0]} to ${r.ranges.luteal[1]}` },
                ]}
              />
              <Note>
                {r.overdue
                  ? "That date is more than one cycle ago, so this projects forward. For accuracy, enter your most recent period."
                  : "Phases are estimates for a regular cycle. Do not use this for contraception or to plan or avoid pregnancy."}
              </Note>
            </>
          )}
        </ResultPanel>
      }
    />
  );
}
