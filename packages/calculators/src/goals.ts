import type { Sex } from "@traiv/calculators/energy";
import { KG_PER_LB } from "@traiv/calculators/units";
import { absoluteFloor } from "@traiv/nutrition/bmr";

/**
 * Deficits, surpluses and the time they take.
 *
 * The energy content of body-weight change is taken as 7,700 kcal per kg (3,500 per lb),
 * the long-standing approximation. It overstates loss over long periods because the body
 * adapts (Hall et al., 2011), so every timeline here is labelled as an estimate and the
 * copy explains why real progress slows.
 */

export const KCAL_PER_KG = 7700;
export const KCAL_PER_LB = 3500;

/** Weekly change in kilograms, whichever unit the person used. */
export const toKg = (value: number, units: "lb" | "kg") =>
  units === "lb" ? value * KG_PER_LB : value;

export type DeficitRate = "relaxed" | "steady" | "faster" | "aggressive";

/** Weekly loss for each named rate, in the unit the page is showing. */
export const DEFICIT_RATE: Record<DeficitRate, { lb: number; kg: number }> = {
  relaxed: { lb: 0.5, kg: 0.25 },
  steady: { lb: 1, kg: 0.5 },
  faster: { lb: 1.5, kg: 0.75 },
  aggressive: { lb: 2, kg: 1 },
};

export function dailyDeltaForWeeklyKg(kgPerWeek: number): number {
  return (kgPerWeek * KCAL_PER_KG) / 7;
}

export type DeficitPlan = {
  tdee: number;
  dailyDeficit: number;
  target: number;
  /** The target before any floor was applied. */
  requested: number;
  /** Which floor raised the target, if any. */
  floored: "minimum" | null;
  belowBmr: boolean;
  weeksToGoal: number | null;
  goalDate: Date | null;
};

export function deficitPlan(args: {
  tdee: number;
  bmr: number;
  sex: Sex;
  weeklyLossKg: number;
  currentKg: number;
  goalKg: number | null;
  today: Date;
}): DeficitPlan {
  const dailyDeficit = dailyDeltaForWeeklyKg(args.weeklyLossKg);
  const requested = args.tdee - dailyDeficit;
  const floor = absoluteFloor(args.sex);
  const target = Math.max(requested, floor);
  const actualDeficit = args.tdee - target;
  let weeksToGoal: number | null = null;
  let goalDate: Date | null = null;
  if (args.goalKg !== null && args.goalKg < args.currentKg && actualDeficit > 0) {
    const weeklyKg = (actualDeficit * 7) / KCAL_PER_KG;
    weeksToGoal = (args.currentKg - args.goalKg) / weeklyKg;
    goalDate = addDays(args.today, Math.ceil(weeksToGoal * 7));
  }
  return {
    tdee: args.tdee,
    dailyDeficit: actualDeficit,
    target,
    requested,
    floored: target > requested ? "minimum" : null,
    belowBmr: target < args.bmr,
    weeksToGoal,
    goalDate,
  };
}

export type SurplusSize = "lean" | "standard" | "aggressive";
export const SURPLUS_KCAL: Record<SurplusSize, number> = {
  lean: 200,
  standard: 375,
  aggressive: 550,
};

export type SurplusPlan = {
  tdee: number;
  surplus: number;
  target: number;
  proteinLowG: number;
  proteinHighG: number;
  weeksToGoal: number | null;
  goalDate: Date | null;
};

export function surplusPlan(args: {
  tdee: number;
  size: SurplusSize;
  currentKg: number;
  goalKg: number | null;
  today: Date;
}): SurplusPlan {
  const surplus = SURPLUS_KCAL[args.size];
  let weeksToGoal: number | null = null;
  let goalDate: Date | null = null;
  if (args.goalKg !== null && args.goalKg > args.currentKg) {
    const weeklyKg = (surplus * 7) / KCAL_PER_KG;
    weeksToGoal = (args.goalKg - args.currentKg) / weeklyKg;
    goalDate = addDays(args.today, Math.ceil(weeksToGoal * 7));
  }
  return {
    tdee: args.tdee,
    surplus,
    target: args.tdee + surplus,
    proteinLowG: 1.6 * args.currentKg,
    proteinHighG: 2.2 * args.currentKg,
    weeksToGoal,
    goalDate,
  };
}

export type BulkPace = "lean" | "moderate" | "aggressive";
export const BULK_PACE: Record<BulkPace, number> = { lean: 0.1, moderate: 0.15, aggressive: 0.2 };

export type BulkPlan = {
  maintenance: number;
  surplus: number;
  total: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  /** Upper-bound weight change a week if the whole surplus were stored. */
  weeklyGainKg: number;
};

export function bulkPlan(maintenance: number, weightKg: number, pace: BulkPace): BulkPlan {
  const surplus = maintenance * BULK_PACE[pace];
  const total = maintenance + surplus;
  const proteinG = 2.0 * weightKg;
  const fatG = (total * 0.25) / 9;
  const carbsG = Math.max(0, (total - proteinG * 4 - fatG * 9) / 4);
  return {
    maintenance,
    surplus,
    total,
    proteinG,
    fatG,
    carbsG,
    weeklyGainKg: (surplus * 7) / KCAL_PER_KG,
  };
}

export function addDays(d: Date, days: number): Date {
  const out = new Date(d.getTime());
  out.setUTCDate(out.getUTCDate() + days);
  return out;
}
