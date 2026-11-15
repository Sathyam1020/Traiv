/**
 * Daily intake targets that are not calories: protein, fibre, water, creatine, and how
 * calories or carbohydrate are distributed across meals and days.
 *
 * Each function documents where its numbers come from. Where the literature gives a
 * range, the function picks a stated point in it and the page copy explains the range.
 */

/* ------------------------------------------------------------------ protein */

export type ProteinGoal = "maintain" | "build" | "lose";
export type ProteinActivity = "light" | "active" | "very";

/** ISSN (2017): 1.4 to 2.0 g/kg for people who train; higher in a deficit. */
export const PROTEIN_BASE: Record<ProteinGoal, number> = { maintain: 1.6, build: 1.8, lose: 2.0 };
export const PROTEIN_ACTIVITY_ADJ: Record<ProteinActivity, number> = {
  light: -0.2,
  active: 0,
  very: 0.2,
};

export function proteinTarget(weightKg: number, goal: ProteinGoal, activity: ProteinActivity) {
  const gPerKg = Math.min(2.4, Math.max(1.2, PROTEIN_BASE[goal] + PROTEIN_ACTIVITY_ADJ[activity]));
  const grams = gPerKg * weightKg;
  return {
    gPerKg,
    grams,
    low: Math.max(1.2, gPerKg - 0.2) * weightKg,
    high: Math.min(2.4, gPerKg + 0.2) * weightKg,
    perMealOf4: grams / 4,
  };
}

/** Per-meal protein. 0.4 g/kg per meal over four meals (Schoenfeld & Aragon, 2018). */
export const PER_MEAL_G_PER_KG = 0.4;
export const PER_MEAL_DAILY: Record<ProteinGoal, number> = { maintain: 1.6, build: 1.8, lose: 2.2 };

export function proteinPerMeal(weightKg: number, goal: ProteinGoal, meals: number) {
  const daily = PER_MEAL_DAILY[goal] * weightKg;
  const perMeal = daily / meals;
  const threshold = PER_MEAL_G_PER_KG * weightKg;
  const status: "low" | "ok" | "high" =
    perMeal < Math.min(20, threshold * 0.75) ? "low" : perMeal > threshold * 1.6 ? "high" : "ok";
  return { daily, perMeal, threshold, status };
}

/* ------------------------------------------------------------- meals/calories */

export type MealStyle = "even" | "front" | "post";

/**
 * Splits a daily target across meals. Front-loaded weights fall linearly (n…1);
 * post-workout gives the chosen meal 1.5 shares and the rest 1 share each.
 */
export function caloriesPerMeal(target: number, meals: number, style: MealStyle, postMeal = 1) {
  const weights = Array.from({ length: meals }, (_, i) => {
    if (style === "front") return meals - i;
    if (style === "post") return i + 1 === postMeal ? 1.5 : 1;
    return 1;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => (target * w) / total);
}

/* ------------------------------------------------------------------- fibre */

export type FiberGoal = "general" | "loss" | "gut";

/**
 * Two standard references: 14 g per 1,000 kcal (US Dietary Guidelines / IOM), and the
 * IOM fixed adequate intakes: men 38 g (≤50) or 30 g (>50); women 25 g or 21 g.
 */
export function fiberTarget(age: number, sex: "male" | "female", calories: number | null) {
  const fixed = sex === "male" ? (age > 50 ? 30 : 38) : age > 50 ? 21 : 25;
  const byCalories = calories === null ? null : (calories / 1000) * 14;
  const headline = byCalories ?? fixed;
  return {
    fixed,
    byCalories,
    headline,
    which: byCalories === null ? ("fixed" as const) : ("calories" as const),
  };
}

/* ------------------------------------------------------------------- water */

/**
 * A common practical rule: half an ounce per pound of body weight (≈33 ml/kg), plus about
 * 12 fl oz (355 ml) for every 30 minutes of exercise. Food supplies some water too; the
 * copy says so.
 */
export const WATER_ML_PER_KG = (0.5 * 29.5735) / 0.45359237; // 32.6 ml/kg
export const WATER_ML_PER_EXERCISE_MIN = 355 / 30;

export function waterIntake(weightKg: number, exerciseMin: number) {
  const base = weightKg * WATER_ML_PER_KG;
  const add = Math.max(0, exerciseMin) * WATER_ML_PER_EXERCISE_MIN;
  const ml = base + add;
  return {
    baseMl: base,
    exerciseMl: add,
    ml,
    liters: ml / 1000,
    flOz: ml / 29.5735,
    glasses: ml / 250,
  };
}

/* ---------------------------------------------------------------- creatine */

/** ISSN (2017): load 0.3 g/kg/day for 5–7 days, maintain 3–5 g/day (≈0.03 g/kg). */
export function creatineDose(weightKg: number, load: boolean) {
  const maintenance = Math.min(10, Math.max(3, Math.round(weightKg * 0.03 * 2) / 2));
  const loading = load ? Math.round(weightKg * 0.3) : null;
  return {
    maintenance,
    loading,
    loadingDays: load ? 7 : 0,
    loadingPerDose: loading === null ? null : Math.round((loading / 4) * 2) / 2,
    /** Days until muscle stores are near full on the slow route. */
    saturationDays: load ? 7 : 28,
  };
}

/* ------------------------------------------------------------- cycling days */

export type DaySplit = { calories: number; protein: number; carbs: number; fat: number };

function day(calories: number, protein: number, fatShare: number): DaySplit {
  const fat = (calories * fatShare) / 9;
  const carbs = Math.max(0, (calories - protein * 4 - fat * 9) / 4);
  return { calories, protein, carbs, fat };
}

export const CYCLE_SPLIT = { mild: 0.1, moderate: 0.2, aggressive: 0.3 } as const;
export type CycleSplit = keyof typeof CYCLE_SPLIT;

/**
 * Calorie cycling: training days get `split` above the weekly average; rest days absorb
 * the difference so the week totals the same as eating the average every day.
 * Protein is held constant at 30% of the average; training days run lower fat (20%),
 * rest days higher (35%).
 */
export function calorieCycling(average: number, trainingDays: number, split: CycleSplit) {
  const train = average * (1 + CYCLE_SPLIT[split]);
  const restDays = 7 - trainingDays;
  const rest = restDays > 0 ? (average * 7 - train * trainingDays) / restDays : train;
  const protein = (average * 0.3) / 4;
  return {
    train: day(train, protein, 0.2),
    rest: day(rest, protein, 0.35),
    trainingDays,
    restDays,
    weekCycled: train * trainingDays + rest * restDays,
    weekFlat: average * 7,
  };
}

export const CARB_SWING = { mild: 0.3, moderate: 0.5, aggressive: 0.75 } as const;
export type CarbSwing = keyof typeof CARB_SWING;

/**
 * Carb cycling: protein (2.0 g/kg) and fat (0.8 g/kg) stay fixed; low days run carbs
 * `swing` below the daily average and high days absorb the difference.
 */
export function carbCycling(
  averageCalories: number,
  weightKg: number,
  trainingDays: number,
  swing: CarbSwing,
) {
  const protein = 2.0 * weightKg;
  const fat = 0.8 * weightKg;
  const avgCarbs = Math.max(0, (averageCalories - protein * 4 - fat * 9) / 4);
  const lowDays = 7 - trainingDays;
  const low = avgCarbs * (1 - CARB_SWING[swing]);
  const high = trainingDays > 0 ? (avgCarbs * 7 - low * lowDays) / trainingDays : avgCarbs;
  const kcal = (c: number) => protein * 4 + fat * 9 + c * 4;
  return {
    high: { calories: kcal(high), protein, carbs: high, fat },
    low: { calories: kcal(low), protein, carbs: low, fat },
    avgCarbs,
    highDays: trainingDays,
    lowDays,
    weekCycled: kcal(high) * trainingDays + kcal(low) * lowDays,
    weekFlat: averageCalories * 7,
  };
}

/* --------------------------------------------------------------- refeed */

export type RefeedProtein = 0.25 | 0.3 | 0.35;

/**
 * A refeed day: calories back to maintenance, almost all of the increase as carbohydrate.
 * Protein stays at the same grams on both days; fat drops to 15% of calories on the refeed.
 */
export function refeedDay(
  maintenance: number,
  deficit: number,
  weeks: number,
  proteinShare: RefeedProtein,
) {
  const protein = (maintenance * proteinShare) / 4;
  const cutCals = Math.max(0, maintenance - deficit);
  const cut = day(cutCals, protein, 0.25);
  const refeed = day(maintenance, protein, 0.15);
  const frequency: "not-yet" | "fortnightly" | "weekly" =
    weeks < 4 ? "not-yet" : weeks >= 8 || deficit >= 750 ? "weekly" : "fortnightly";
  return { cut, refeed, carbSwing: refeed.carbs - cut.carbs, frequency };
}

/* ---------------------------------------------------------- reverse diet */

export function reverseDiet(current: number, maintenance: number, step: number, weightKg: number) {
  const gap = Math.max(0, maintenance - current);
  const weeks = step > 0 ? Math.ceil(gap / step) : 0;
  const schedule = Array.from({ length: weeks }, (_, i) => ({
    week: i + 1,
    calories: Math.min(maintenance, current + step * (i + 1)),
  }));
  return { weeks, schedule, proteinG: 1.8 * weightKg, from: current, to: maintenance, step };
}
