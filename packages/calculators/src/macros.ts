/**
 * Turning a calorie target into grams of protein, carbohydrate and fat.
 *
 * Protein is set per kilogram of body weight first, because it is the macro with the
 * clearest evidence for a minimum (ISSN position stand, 2017: 1.4 to 2.0 g/kg for people
 * who train, toward the top of the range in a deficit). Fat is a share of calories with a
 * floor per kilogram, so a small target never pushes it to near zero. Carbohydrate fills
 * what is left. Calories use 4/4/9 kcal per gram.
 */

export type Goal = "cut" | "maintain" | "bulk";

export type MacroGrams = { protein: number; carbs: number; fat: number };

export type MacroLine = { grams: number; kcal: number; share: number };

export type MacroResult = {
  calories: number;
  protein: MacroLine;
  carbs: MacroLine;
  fat: MacroLine;
  /** Set when the calorie target could not hold the protein and fat floors. */
  squeezed: boolean;
};

export const PROTEIN_G_PER_KG: Record<Goal, number> = { cut: 2.0, maintain: 1.8, bulk: 1.8 };
export const FAT_SHARE = 0.25;
export const FAT_FLOOR_G_PER_KG = 0.6;

function lines(calories: number, g: MacroGrams, squeezed: boolean): MacroResult {
  const pk = g.protein * 4;
  const ck = g.carbs * 4;
  const fk = g.fat * 9;
  const total = pk + ck + fk;
  const share = (k: number) => (total > 0 ? k / total : 0);
  return {
    calories,
    protein: { grams: g.protein, kcal: pk, share: share(pk) },
    carbs: { grams: g.carbs, kcal: ck, share: share(ck) },
    fat: { grams: g.fat, kcal: fk, share: share(fk) },
    squeezed,
  };
}

/** Default split: protein per kg, fat 25% with a per-kg floor, carbohydrate the rest. */
export function macrosFor(calories: number, weightKg: number, goal: Goal): MacroResult {
  const protein = PROTEIN_G_PER_KG[goal] * weightKg;
  const fatFloor = FAT_FLOOR_G_PER_KG * weightKg;
  let fat = Math.max((calories * FAT_SHARE) / 9, fatFloor);
  let carbs = (calories - protein * 4 - fat * 9) / 4;
  let squeezed = false;
  if (carbs < 0) {
    // Not enough room: hold protein, drop fat to its floor, and report it.
    fat = fatFloor;
    carbs = Math.max(0, (calories - protein * 4 - fat * 9) / 4);
    squeezed = true;
  }
  return lines(calories, { protein, carbs, fat }, squeezed);
}

/** A split given as percentages of calories (used by the body-type tool). */
export function macrosFromShares(
  calories: number,
  shares: { protein: number; carbs: number; fat: number },
): MacroResult {
  return lines(
    calories,
    {
      protein: (calories * shares.protein) / 4,
      carbs: (calories * shares.carbs) / 4,
      fat: (calories * shares.fat) / 9,
    },
    false,
  );
}

export type BodyType = "ectomorph" | "mesomorph" | "endomorph";

/**
 * The traditional somatotype splits. These are a starting heuristic, not physiology: there
 * is little evidence that body shape predicts how someone handles carbohydrate, and the
 * copy says so. Kept because coaches and clients ask for them.
 */
export const BODY_TYPE_SHARES: Record<BodyType, { protein: number; carbs: number; fat: number }> = {
  ectomorph: { protein: 0.25, carbs: 0.55, fat: 0.2 },
  mesomorph: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  endomorph: { protein: 0.35, carbs: 0.25, fat: 0.4 },
};

/** Keto: fixed net carbohydrate, protein from lean mass when known, fat fills the rest. */
export type KetoCarbs = 20 | 30 | 50;

export function ketoMacros(
  calories: number,
  weightKg: number,
  netCarbs: KetoCarbs,
  bodyFatPercent: number | null,
): MacroResult & { proteinBasis: "lean" | "total" } {
  const lean = bodyFatPercent === null ? null : weightKg * (1 - bodyFatPercent / 100);
  // 1.8 g per kg of lean mass is about 0.8 g per lb, the usual keto anchor. Without body
  // fat, 1.6 g per kg of total weight lands in a similar place for most people.
  const protein = lean === null ? 1.6 * weightKg : 1.8 * lean;
  const carbs = netCarbs;
  const fatKcal = calories - protein * 4 - carbs * 4;
  const fat = Math.max(0, fatKcal / 9);
  return {
    ...lines(calories, { protein, carbs, fat }, fatKcal < calories * 0.5),
    proteinBasis: lean === null ? "total" : "lean",
  };
}
