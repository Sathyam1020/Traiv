import { expenditure, type Sex } from "@traiv/calculators/energy";
import { addDays, KCAL_PER_KG } from "@traiv/calculators/goals";
import { absoluteFloor } from "@traiv/nutrition/bmr";
import type { ActivityLevel } from "@traiv/nutrition/types";

/**
 * Timelines for changing weight: a goal date at a fixed weekly rate, a multi-phase diet
 * that recalculates as weight falls, and the length of a cut from body-fat targets.
 */

/* ------------------------------------------------------------ goal date */

export type RateSafety = "gentle" | "recommended" | "fast" | "extreme";

/** Weekly change as a share of body weight: <0.5% gentle, ≤1% recommended, ≤1.5% fast. */
export function rateSafety(weeklyKg: number, currentKg: number): RateSafety {
  const pct = (weeklyKg / currentKg) * 100;
  if (pct < 0.5) return "gentle";
  if (pct <= 1) return "recommended";
  if (pct <= 1.5) return "fast";
  return "extreme";
}

export function goalWeightDate(currentKg: number, goalKg: number, weeklyKg: number, today: Date) {
  const direction: "lose" | "gain" | "none" =
    goalKg < currentKg ? "lose" : goalKg > currentKg ? "gain" : "none";
  const distance = Math.abs(currentKg - goalKg);
  const weeks = direction === "none" || weeklyKg <= 0 ? 0 : distance / weeklyKg;
  return {
    direction,
    weeks,
    date: addDays(today, Math.ceil(weeks * 7)),
    dailyDelta: (weeklyKg * KCAL_PER_KG) / 7,
    safety: rateSafety(weeklyKg, currentKg),
  };
}

/* ------------------------------------------------------ weight loss phases */

export type Phase = {
  phase: number;
  startKg: number;
  endKg: number;
  target: number;
  weeks: number;
  floored: boolean;
};

const PHASE_WEEKS = 12;
const BREAK_WEEKS = 2;
const MAX_PHASES = 8;

/**
 * Simulates a diet week by week. Each phase sets its target from maintenance at the
 * phase's starting weight minus the chosen deficit (never below the 1,200/1,500 floor),
 * holds it for up to 12 weeks while maintenance falls with weight, then recalculates.
 * Two maintenance weeks sit between phases.
 */
export function weightLossPhases(args: {
  sex: Sex;
  age: number;
  heightCm: number;
  startKg: number;
  goalKg: number;
  activity: ActivityLevel;
  dailyDeficit: number;
  today: Date;
}) {
  const phases: Phase[] = [];
  let kg = args.startKg;
  let totalWeeks = 0;
  const floor = absoluteFloor(args.sex);
  const body = (w: number) => ({
    sex: args.sex,
    age: args.age,
    heightCm: args.heightCm,
    weightKg: w,
  });
  while (kg > args.goalKg + 0.05 && phases.length < MAX_PHASES) {
    const tdee0 = expenditure(body(kg), args.activity).tdee;
    const target = Math.max(tdee0 - args.dailyDeficit, floor);
    const startKg = kg;
    let weeks = 0;
    while (weeks < PHASE_WEEKS && kg > args.goalKg + 0.05) {
      const deficit = expenditure(body(kg), args.activity).tdee - target;
      if (deficit <= 0) break;
      kg = Math.max(args.goalKg, kg - (deficit * 7) / KCAL_PER_KG);
      weeks += 1;
    }
    if (weeks === 0) break;
    phases.push({
      phase: phases.length + 1,
      startKg,
      endKg: kg,
      target,
      weeks,
      floored: target > tdee0 - args.dailyDeficit,
    });
    totalWeeks += weeks;
    if (kg > args.goalKg + 0.05) totalWeeks += BREAK_WEEKS;
  }
  const reached = kg <= args.goalKg + 0.05;
  return {
    phases,
    totalWeeks,
    finish: addDays(args.today, totalWeeks * 7),
    reached,
    capped: phases.length >= MAX_PHASES && !reached,
  };
}

/* --------------------------------------------------------------- cut length */

export type CutPace = 0.005 | 0.0075 | 0.01;

/** Lowest body fat we will plan a cut to without a warning (essential fat plus margin). */
export const LEAN_FLOOR = { male: 8, female: 16 } as const;

export function cutLength(
  weightKg: number,
  bfNow: number,
  bfTarget: number,
  pace: CutPace,
  sex: Sex,
) {
  const lean = weightKg * (1 - bfNow / 100);
  const targetKg = lean / (1 - bfTarget / 100);
  const fatToLose = Math.max(0, weightKg - targetKg);
  // Weight falls by a fixed share each week, so the loss shrinks as the body does.
  const weeks = fatToLose > 0 ? Math.log(targetKg / weightKg) / Math.log(1 - pace) : 0;
  const breaks = Math.floor(weeks / 10);
  return {
    targetKg,
    fatToLose,
    weeks,
    firstWeekLossKg: weightKg * pace,
    dietBreaks: breaks,
    totalWeeks: weeks + breaks * BREAK_WEEKS,
    belowFloor: bfTarget < LEAN_FLOOR[sex],
  };
}
