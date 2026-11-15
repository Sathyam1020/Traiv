/**
 * Unit conversion shared by every public calculator.
 *
 * Exact definitions, not rounded ones: the international pound is 0.45359237 kg by
 * definition (1959), and the inch is 2.54 cm by definition. Rounding happens once, at
 * display, so a value switched imperial → metric → imperial comes back unchanged.
 */

export const KG_PER_LB = 0.45359237;
export const CM_PER_IN = 2.54;

export type UnitSystem = "imperial" | "metric";

export const lbToKg = (lb: number) => lb * KG_PER_LB;
export const kgToLb = (kg: number) => kg / KG_PER_LB;

export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * CM_PER_IN;
}

/**
 * Whole feet plus inches rounded to the nearest inch. A 12-inch remainder from rounding
 * rolls into the next foot, so 5 ft 11.6 in reads as 6 ft 0 in, never 5 ft 12 in.
 */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = Math.round(cm / CM_PER_IN);
  return { feet: Math.floor(totalInches / 12), inches: totalInches % 12 };
}

/** A finite number inside [min, max], or null. Every calculator validates through this. */
export function inRange(value: number, min: number, max: number): number | null {
  return Number.isFinite(value) && value >= min && value <= max ? value : null;
}
