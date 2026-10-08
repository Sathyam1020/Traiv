/** Biological sex, because the BMR equation needs it. Not gender. */
export type Sex = "male" | "female" | "undisclosed";

export type Goal =
  | "lose_fat"
  | "build_muscle"
  | "get_stronger"
  | "maintain"
  | "improve_fitness"
  | "general_health";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "extra";

export type DietType = "vegetarian" | "non_vegetarian" | "eggetarian" | "vegan" | "jain";

export type HealthFlag =
  | "knee"
  | "lower_back"
  | "shoulder"
  | "diabetes"
  | "blood_pressure"
  | "thyroid"
  | "pcos"
  | "pregnancy";

export type Body = {
  sex: Sex;
  /** Years. */
  age: number;
  heightCm: number;
  weightKg: number;
};

export type PlanInput = Body & {
  goal: Goal;
  activity: ActivityLevel;
  diet: DietType;
  health: readonly HealthFlag[];
  targetWeightKg?: number;
};

/**
 * Why a target is what it is.
 *
 * Stored alongside every target so "why 1,840?" has an answer a coach can check by hand,
 * rather than a number that appeared once and can never be reproduced.
 */
export type Basis = {
  formula: "mifflin-st-jeor@1";
  bmr: number;
  tdee: number;
  activityFactor: number;
  goalAdjustmentPct: number;
  /** What the adjustment alone produced, before any floor was applied. */
  unboundedKcal: number;
  boundBy: "none" | "deficit_cap" | "bmr_floor" | "absolute_floor";
  proteinGPerKg: number;
  bmi: number;
};

/**
 * Something a person has to look at before this target reaches the client.
 *
 * A non-empty list means the target is `proposed`, never `active`.
 */
export type ReviewReason =
  | "pregnancy"
  | "medical_condition"
  | "underweight"
  | "target_underweight"
  | "age_out_of_range"
  | "sex_undisclosed"
  | "protein_hard_on_diet"
  /** The safety floor sits above this person's maintenance, so no safe deficit exists. */
  | "deficit_not_possible";

export type EnergyTarget = {
  kcal: number;
  /** Grams. */
  protein: number;
  carbs: number;
  fat: number;
  basis: Basis;
  /** Empty means safe to activate without a coach looking at it first. */
  review: ReviewReason[];
};
