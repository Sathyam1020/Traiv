/**
 * What a client should eat, worked out rather than guessed.
 *
 * This package is the only thing in Traiv allowed to decide a calorie number. The AI that
 * builds meals and workouts reads its output and composes around it; it never picks the
 * number itself. That split is the point: a model revision can change which dal shows up
 * at lunch, and it cannot move anybody's intake by 300 calories without a migration and a
 * failing test.
 *
 * Pure functions, no I/O, no network. Everything here is reproducible by hand on paper,
 * which is the standard a coach should be able to hold it to.
 *
 * ## Why the internal imports name this package rather than a relative path
 *
 * The repo is NodeNext, which means a relative import needs an explicit `./targets.js`
 * extension pointing at a `.ts` file. tsc, tsx and vitest all strip that; Turbopack does
 * not, so the marketing site's calculator could not bundle this package at all. Importing
 * through the package's own `exports` map (a Node self-reference) resolves identically
 * under every one of them. Add a new module here and it needs an `exports` entry too.
 */

export { ACTIVITY_FACTOR, absoluteFloor, bmi, bmr, tdee } from "@traiv/nutrition/bmr";
export { reviewReasons } from "@traiv/nutrition/flags";
export { energyTarget } from "@traiv/nutrition/targets";
export type {
  ActivityLevel,
  Basis,
  Body,
  DietType,
  EnergyTarget,
  Goal,
  HealthFlag,
  PlanInput,
  ReviewReason,
  Sex,
} from "@traiv/nutrition/types";
