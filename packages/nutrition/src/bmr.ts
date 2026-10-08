import type { ActivityLevel, Body, Sex } from "@traiv/nutrition/types";

/**
 * Mifflin-St Jeor, which lands within 10% of measured resting metabolic rate for about
 * 71% of adults against Harris-Benedict's 61%. Harris-Benedict dates from 1919 and
 * overestimates modern sedentary adults by 5-15%.
 *
 * It is still a prediction. A third of people sit outside ±10% whichever equation you
 * pick, which is exactly why the coach can override and why every target records how it
 * was derived.
 */
export function bmr({ sex, age, heightCm, weightKg }: Body): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  // Someone who would rather not say still needs a number. The midpoint of the two is
  // honest about the uncertainty — and `flags.ts` sends them for review rather than
  // letting a 166 kcal guess pass as a calculation.
  if (sex === "undisclosed") return base + (5 + -161) / 2;

  return sex === "male" ? base + 5 : base - 161;
}

/** Long-standing Harris-Benedict multipliers; every calculator in the field uses these. */
export const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

export function tdee(body: Body, activity: ActivityLevel): number {
  return bmr(body) * ACTIVITY_FACTOR[activity];
}

/**
 * Derived, never asked, and never the thing that decides a plan — it says nothing about
 * body composition. It earns its place in one job only: catching someone who should not
 * be put in a deficit by a formula.
 */
export function bmi(heightCm: number, weightKg: number): number {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

/**
 * The lowest daily intake either guideline body will stand behind without supervision:
 * 1,200 for women, 1,500 for men.
 *
 * Undisclosed takes the 1,200 floor because it is the absolute adult minimum in the
 * Dietary Guidelines, and because a coach is reviewing that target anyway.
 */
export function absoluteFloor(sex: Sex): number {
  return sex === "male" ? 1500 : 1200;
}
