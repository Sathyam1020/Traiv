/**
 * Energy and fluid from movement.
 *
 * MET values come from the 2011 Compendium of Physical Activities (Ainsworth et al.).
 * Calories = MET × 3.5 × kg ÷ 200 per minute, i.e. gross energy including resting burn.
 */

export const ACTIVITIES = {
  walking: { label: "Walking (3.5 mph, brisk)", met: 4.3 },
  running: { label: "Running (6 mph / 10-min mile)", met: 9.8 },
  cycling: { label: "Cycling (moderate, 12 to 14 mph)", met: 8.0 },
  weights: { label: "Weight training (general)", met: 3.5 },
  hiit: { label: "HIIT / circuit training", met: 8.0 },
  swimming: { label: "Swimming (moderate)", met: 5.8 },
  yoga: { label: "Yoga (Hatha)", met: 2.5 },
  elliptical: { label: "Elliptical trainer (moderate)", met: 5.0 },
  rowing: { label: "Rowing machine (moderate)", met: 7.0 },
  hiking: { label: "Hiking (cross-country)", met: 6.0 },
  rope: { label: "Jump rope (moderate)", met: 11.8 },
  basketball: { label: "Basketball (game)", met: 8.0 },
} as const;
export type ActivityKey = keyof typeof ACTIVITIES;

export const kcalPerMinute = (met: number, kg: number) => (met * 3.5 * kg) / 200;

export function caloriesBurned(activity: ActivityKey, kg: number, minutes: number) {
  const met = ACTIVITIES[activity].met;
  const perMin = kcalPerMinute(met, kg);
  return { met, perMin, perHour: perMin * 60, total: perMin * minutes };
}

/* ------------------------------------------------------------------ steps */

export const WALK_PACE = {
  slow: { label: "Slow stroll (2.0 mph / 3.2 km/h)", mph: 2.0, met: 2.8 },
  average: { label: "Average (3.0 mph / 4.8 km/h)", mph: 3.0, met: 3.5 },
  brisk: { label: "Brisk (3.5 mph / 5.6 km/h)", mph: 3.5, met: 4.3 },
  fast: { label: "Fast (4.0 mph / 6.4 km/h)", mph: 4.0, met: 5.0 },
} as const;
export type WalkPace = keyof typeof WALK_PACE;

/** Stride ≈ 41.4% of height, the midpoint of the common 0.413 (women) / 0.415 (men) estimates. */
export const STRIDE_RATIO = 0.414;

export function stepsToCalories(steps: number, kg: number, heightCm: number, pace: WalkPace) {
  const strideM = (heightCm / 100) * STRIDE_RATIO;
  const km = (steps * strideM) / 1000;
  const miles = km / 1.609344;
  const minutes = (miles / WALK_PACE[pace].mph) * 60;
  const total = kcalPerMinute(WALK_PACE[pace].met, kg) * minutes;
  return { km, miles, minutes, total, per1000: steps > 0 ? (total / steps) * 1000 : 0, strideM };
}

/* -------------------------------------------------------------- sweat rate */

export function sweatRate(preKg: number, postKg: number, fluidL: number, minutes: number) {
  const lossL = Math.max(0, preKg - postKg + fluidL);
  const hours = minutes / 60;
  const perHour = hours > 0 ? lossL / hours : 0;
  const pctLost = ((preKg - postKg) / preKg) * 100;
  return {
    lossL,
    perHour,
    pctLost,
    /** Drink plan: about three quarters of sweat losses per hour keeps most people under 2%. */
    drinkPerHour: perHour * 0.75,
    /** Replace 1.5 L for every kg still down after the session. */
    rehydrateL: Math.max(0, preKg - postKg) * 1.5,
    status: pctLost >= 2 ? ("high" as const) : pctLost < 0 ? ("gained" as const) : ("ok" as const),
  };
}
