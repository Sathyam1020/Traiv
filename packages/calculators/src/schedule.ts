/**
 * Clock and calendar tools: fasting windows and menstrual cycle phase.
 * Times are minutes after midnight; dates are UTC calendar days.
 */

export const PROTOCOLS = {
  "16:8": { label: "16:8: fast 16 hours, eat 8", fast: 16, eat: 8 },
  "18:6": { label: "18:6: fast 18 hours, eat 6", fast: 18, eat: 6 },
  "20:4": { label: "20:4: fast 20 hours, eat 4", fast: 20, eat: 4 },
  omad: { label: "OMAD: one meal a day (about 23:1)", fast: 23, eat: 1 },
  "5:2": { label: "5:2: two low-calorie days (not clock-based)", fast: 0, eat: 24 },
} as const;
export type Protocol = keyof typeof PROTOCOLS;

const wrap = (m: number) => ((m % 1440) + 1440) % 1440;

export function fastingWindow(protocol: Protocol, anchor: "last" | "first", minutes: number) {
  const p = PROTOCOLS[protocol];
  if (protocol === "5:2") return null;
  const eatStart = anchor === "first" ? wrap(minutes) : wrap(minutes - p.eat * 60);
  const eatEnd = wrap(eatStart + p.eat * 60);
  return { eatStart, eatEnd, fastHours: p.fast, eatHours: p.eat };
}

/** Whether a time of day falls in the eating window (handles windows that cross midnight). */
export function isEating(window: { eatStart: number; eatEnd: number }, now: number) {
  const { eatStart: s, eatEnd: e } = window;
  return s <= e ? now >= s && now < e : now >= s || now < e;
}

export const fmtClock = (m: number) => {
  const h = Math.floor(wrap(m) / 60);
  const min = wrap(m) % 60;
  const ampm = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
};

/* ------------------------------------------------------------- cycle phase */

export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";

const DAY = 86_400_000;

/**
 * Estimated phase for a regular cycle. Ovulation is placed 14 days before the next period
 * (the luteal phase is the more constant half), with a ±1 day window.
 */
export function cyclePhase(lastPeriod: Date, cycleLength: number, today: Date) {
  const elapsed = Math.floor((today.getTime() - lastPeriod.getTime()) / DAY);
  if (elapsed < 0) return null;
  const day = (elapsed % cycleLength) + 1;
  const ovulationDay = cycleLength - 14;
  const phase: CyclePhase =
    day <= 5
      ? "menstrual"
      : day < ovulationDay - 1
        ? "follicular"
        : day <= ovulationDay + 1
          ? "ovulation"
          : "luteal";
  const cyclesDone = Math.floor(elapsed / cycleLength);
  const nextPeriod = new Date(lastPeriod.getTime() + (cyclesDone + 1) * cycleLength * DAY);
  return {
    day,
    phase,
    ovulationDay,
    nextPeriod,
    overdue: elapsed >= cycleLength,
    ranges: {
      menstrual: [1, 5] as const,
      follicular: [6, ovulationDay - 2] as const,
      ovulation: [ovulationDay - 1, ovulationDay + 1] as const,
      luteal: [ovulationDay + 2, cycleLength] as const,
    },
  };
}
