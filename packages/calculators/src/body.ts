/**
 * Body composition and size measures. Inputs are metric (kg, cm, years); widgets convert
 * imperial at the edges. Every formula names its source.
 */

export type Sex = "male" | "female";

/* ------------------------------------------------------------------- BMI */

export type BmiBand = "underweight" | "healthy" | "overweight" | "obese";

/** WHO adult cut-offs: <18.5, 18.5–24.9, 25–29.9, ≥30. */
export function bmi(weightKg: number, heightCm: number) {
  const m = heightCm / 100;
  const value = weightKg / (m * m);
  const band: BmiBand = value < 18.5 ? "underweight" : value < 25 ? "healthy" : value < 30 ? "overweight" : "obese";
  return { value, band, healthyLowKg: 18.5 * m * m, healthyHighKg: 24.9 * m * m };
}

/* ------------------------------------------------------- US Navy body fat */

const IN_PER_CM = 1 / 2.54;
const log10 = Math.log10;

/**
 * US Navy circumference method (Hodgdon & Beckett, 1984), inch form:
 * men   %BF = 86.010·log10(waist − neck) − 70.041·log10(height) + 36.76
 * women %BF = 163.205·log10(waist + hip − neck) − 97.684·log10(height) − 78.387
 */
export function navyBodyFat(sex: Sex, heightCm: number, neckCm: number, waistCm: number, hipCm: number | null) {
  const h = heightCm * IN_PER_CM;
  const n = neckCm * IN_PER_CM;
  const w = waistCm * IN_PER_CM;
  if (sex === "male") {
    if (w - n <= 0) return null;
    return 86.01 * log10(w - n) - 70.041 * log10(h) + 36.76;
  }
  if (hipCm === null) return null;
  const hip = hipCm * IN_PER_CM;
  if (w + hip - n <= 0) return null;
  return 163.205 * log10(w + hip - n) - 97.684 * log10(h) - 78.387;
}

/** ACE body fat categories, used widely for interpretation. */
export function bodyFatBand(sex: Sex, pct: number) {
  const t = sex === "male" ? [6, 14, 18, 25] : [14, 21, 25, 32];
  const names = ["Essential fat", "Athletes", "Fitness", "Average", "Above average"] as const;
  let i = 0;
  while (i < t.length && pct >= (t[i] ?? Infinity)) i++;
  return names[i] ?? "Above average";
}

/* ------------------------------------------------------------------- FFMI */

/** Fat-free mass index (Kouri et al., 1995), with the 1.8 m height normalisation. */
export function ffmi(weightKg: number, heightCm: number, bodyFatPct: number) {
  const m = heightCm / 100;
  const leanKg = weightKg * (1 - bodyFatPct / 100);
  const value = leanKg / (m * m);
  return { leanKg, value, normalised: value + 6.1 * (1.8 - m) };
}

/* ----------------------------------------------------------- ideal weight */

/** Four classic formulas, each base kg + kg per inch over 5 ft. */
const IDEAL = {
  Devine: { male: [50, 2.3], female: [45.5, 2.3] },
  Robinson: { male: [52, 1.9], female: [49, 1.7] },
  Miller: { male: [56.2, 1.41], female: [53.1, 1.36] },
  Hamwi: { male: [48, 2.7], female: [45.5, 2.2] },
} as const;

export function idealWeight(sex: Sex, heightCm: number) {
  const over = Math.max(0, heightCm * IN_PER_CM - 60);
  const rows = (Object.keys(IDEAL) as (keyof typeof IDEAL)[]).map((name) => {
    const [base, per] = IDEAL[name][sex];
    return { name, kg: base + per * over };
  });
  const kgs = rows.map((r) => r.kg);
  const b = bmi(1, heightCm);
  return { rows, lowKg: Math.min(...kgs), highKg: Math.max(...kgs), bmiRange: [b.healthyLowKg, b.healthyHighKg] as const };
}

/* -------------------------------------------------------- lean body mass */

/** Boer (1984): men 0.407W + 0.267H − 19.2; women 0.252W + 0.473H − 48.3 (kg, cm). */
export function boerLbm(sex: Sex, weightKg: number, heightCm: number) {
  return sex === "male" ? 0.407 * weightKg + 0.267 * heightCm - 19.2 : 0.252 * weightKg + 0.473 * heightCm - 48.3;
}

export function leanBodyMass(weightKg: number, method: { bodyFatPct: number } | { boer: { sex: Sex; heightCm: number } }) {
  const lean = "bodyFatPct" in method ? weightKg * (1 - method.bodyFatPct / 100) : boerLbm(method.boer.sex, weightKg, method.boer.heightCm);
  const leanKg = Math.min(weightKg, Math.max(0, lean));
  return { leanKg, fatKg: weightKg - leanKg, bodyFatPct: ((weightKg - leanKg) / weightKg) * 100 };
}

/* ------------------------------------------------------ skeletal muscle */

/**
 * Skeletal muscle mass, Lee et al. (2000):
 * SM (kg) = 0.244·W + 7.8·H(m) + 6.6·sex − 0.098·age − 3.3, sex = 1 for men, 0 for women.
 * The published equation adds an ethnicity term; it is set to zero here and the copy says so.
 */
export function muscleMass(sex: Sex, age: number, weightKg: number, heightCm: number) {
  const kg = 0.244 * weightKg + 7.8 * (heightCm / 100) + 6.6 * (sex === "male" ? 1 : 0) - 0.098 * age - 3.3;
  return { kg, pctOfBody: (kg / weightKg) * 100 };
}

/* --------------------------------------------------------------- ratios */

/** Waist-to-height: under 0.5 is the widely used "keep your waist under half your height" guide. */
export function waistToHeight(waist: number, height: number) {
  const value = waist / height;
  const band = value < 0.4 ? "low" : value < 0.5 ? "healthy" : value < 0.6 ? "increased" : "high";
  return { value, band: band as "low" | "healthy" | "increased" | "high" };
}

/** WHO (2008): substantially increased risk at ≥0.90 for men and ≥0.85 for women. */
export function waistToHip(sex: Sex, waist: number, hip: number) {
  const value = waist / hip;
  const limit = sex === "male" ? 0.9 : 0.85;
  const moderate = sex === "male" ? 0.85 : 0.8;
  const band = value >= limit ? "high" : value >= moderate ? "moderate" : "low";
  return { value, limit, band: band as "low" | "moderate" | "high" };
}

/* --------------------------------------------------- weight loss percent */

export function weightLossPercent(start: number, current: number, goal: number | null, weeksToGoal: number | null) {
  const lost = start - current;
  const pct = (lost / start) * 100;
  const goalPct = goal === null ? null : ((start - goal) / start) * 100;
  const progress = goal === null || start === goal ? null : (lost / (start - goal)) * 100;
  const remaining = goal === null ? null : current - goal;
  const weekly = remaining !== null && weeksToGoal ? remaining / weeksToGoal : null;
  const weeklyPct = weekly !== null ? (weekly / current) * 100 : null;
  return { lost, pct, goalPct, progress, remaining, weekly, weeklyPct };
}

/* ------------------------------------------------------------------ recomp */

/**
 * Recomposition: Katch-McArdle maintenance (370 + 21.6 × lean kg) × activity, eaten at a
 * 10% deficit, protein at 2.2 g/kg lean mass, timeline assuming lean mass is kept and fat
 * falls by about 0.5% of body weight a week.
 */
export const RECOMP_ACTIVITY = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725 } as const;

export function recomp(weightKg: number, bfNow: number, bfTarget: number, activity: keyof typeof RECOMP_ACTIVITY) {
  const leanKg = weightKg * (1 - bfNow / 100);
  const maintenance = (370 + 21.6 * leanKg) * RECOMP_ACTIVITY[activity];
  const calories = maintenance * 0.9;
  const proteinG = 2.2 * leanKg;
  const targetKg = leanKg / (1 - bfTarget / 100);
  const fatToLose = Math.max(0, weightKg - targetKg);
  const weeks = fatToLose > 0 ? Math.log(targetKg / weightKg) / Math.log(1 - 0.005) : 0;
  return { leanKg, maintenance, calories, proteinG, targetKg, fatToLose, weeks };
}
