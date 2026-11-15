import { feetInchesToCm, inRange, lbToKg, type UnitSystem } from "@traiv/calculators/units";
import { ACTIVITY_FACTOR, bmr } from "@traiv/nutrition/bmr";
import type { ActivityLevel } from "@traiv/nutrition/types";

/**
 * Total daily energy expenditure: Mifflin-St Jeor BMR × an activity factor.
 *
 * BMR comes from `@traiv/nutrition`, the same function the product uses for a real
 * client, so a coach who checks a number here and then inside Traiv gets the same answer.
 */

export type Sex = "male" | "female";

export type BodyInput = {
  units: UnitSystem;
  sex: Sex;
  age: number;
  /** Imperial height arrives as feet + inches, metric as cm. */
  heightFt?: number;
  heightIn?: number;
  heightCm?: number;
  /** In the selected unit: lb for imperial, kg for metric. */
  weight: number;
};

export type EnergyInput = BodyInput & { activity: ActivityLevel };

export type Body = { sex: Sex; age: number; heightCm: number; weightKg: number };

export type EnergyResult = {
  bmr: number;
  factor: number;
  tdee: number;
  cut: number;
  maintain: number;
  bulk: number;
};

/** A 500 kcal deficit and a 300 kcal surplus: the conventional starting points. */
export const CUT_DELTA = -500;
export const BULK_DELTA = 300;

/** Ranges match the inputs' own min/max, so the form and the maths reject the same values. */
export const ENERGY_LIMITS = {
  age: [14, 100],
  heightFt: [3, 8],
  heightIn: [0, 11],
  heightCm: [100, 250],
  weightLb: [30, 600],
  weightKg: [14, 272],
} as const;

export type BodyError = "age" | "height" | "weight";
/** Kept for the TDEE widget, which predates the shared name. */
export type EnergyError = BodyError;

export type Result<T, E extends string = BodyError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/** Validates and converts one person's measurements. Every body-based tool goes through here. */
export function resolveBody(input: BodyInput): Result<Body> {
  const age = inRange(input.age, ...ENERGY_LIMITS.age);
  if (age === null) return { ok: false, error: "age" };

  let heightCm: number | null;
  if (input.units === "imperial") {
    const ft = inRange(input.heightFt ?? Number.NaN, ...ENERGY_LIMITS.heightFt);
    const inch = inRange(input.heightIn ?? Number.NaN, ...ENERGY_LIMITS.heightIn);
    heightCm = ft === null || inch === null ? null : feetInchesToCm(ft, inch);
  } else {
    heightCm = inRange(input.heightCm ?? Number.NaN, ...ENERGY_LIMITS.heightCm);
  }
  if (heightCm === null) return { ok: false, error: "height" };

  const weightKg =
    input.units === "imperial"
      ? inRange(input.weight, ...ENERGY_LIMITS.weightLb) === null
        ? null
        : lbToKg(input.weight)
      : inRange(input.weight, ...ENERGY_LIMITS.weightKg);
  if (weightKg === null) return { ok: false, error: "weight" };

  return { ok: true, value: { sex: input.sex, age, heightCm, weightKg } };
}

/** Unrounded resting rate and TDEE, for engines that build further on them. */
export function expenditure(body: Body, activity: ActivityLevel) {
  const base = bmr(body);
  const factor = ACTIVITY_FACTOR[activity];
  return { bmr: base, factor, tdee: base * factor };
}

export function energy(input: EnergyInput): Result<EnergyResult> {
  const body = resolveBody(input);
  if (!body.ok) return body;
  const { bmr: base, factor, tdee } = expenditure(body.value, input.activity);
  return {
    ok: true,
    value: {
      bmr: Math.round(base),
      factor,
      tdee: Math.round(tdee),
      cut: Math.round(tdee + CUT_DELTA),
      maintain: Math.round(tdee),
      bulk: Math.round(tdee + BULK_DELTA),
    },
  };
}
