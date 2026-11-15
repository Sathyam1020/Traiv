import assert from "node:assert/strict";
import test from "node:test";
import { energy } from "@traiv/calculators/energy";
import { formatMoney, isCurrency } from "@traiv/calculators/money";
import { type Ingredient, recipeTotals } from "@traiv/calculators/recipe";
import { cmToFeetInches, feetInchesToCm, kgToLb, lbToKg } from "@traiv/calculators/units";

/*
 * Scenarios, not one test per function: each case is a way a person actually uses the
 * tool, or a way it would actually go wrong.
 */

const DEFAULT_TDEE = {
  units: "imperial",
  sex: "male",
  age: 30,
  heightFt: 5,
  heightIn: 10,
  weight: 170,
  activity: "moderate",
} as const;

test("default page load: male, 30, 5 ft 10, 170 lb, moderate gives the hand-worked Mifflin numbers", () => {
  // 170 lb = 77.111 kg; 5 ft 10 = 177.8 cm
  // BMR = 10·77.111 + 6.25·177.8 − 5·30 + 5 = 1737.4 → TDEE = ×1.55 = 2692.9
  const r = energy(DEFAULT_TDEE);
  assert.ok(r.ok);
  assert.equal(r.value.bmr, 1737);
  assert.equal(r.value.tdee, 2693);
  assert.equal(r.value.cut, 2193);
  assert.equal(r.value.maintain, 2693);
  assert.equal(r.value.bulk, 2993);
});

test("switching to metric with the same body gives the same answer", () => {
  const metric = energy({
    ...DEFAULT_TDEE,
    units: "metric",
    heightCm: feetInchesToCm(5, 10),
    weight: lbToKg(170),
  });
  const imperial = energy(DEFAULT_TDEE);
  assert.ok(metric.ok && imperial.ok);
  assert.deepEqual(metric.value, imperial.value);
});

test("female gets the −161 constant, not the +5 one", () => {
  const male = energy(DEFAULT_TDEE);
  const female = energy({ ...DEFAULT_TDEE, sex: "female" });
  assert.ok(male.ok && female.ok);
  // 166 kcal apart before rounding; allow the rounding of each side.
  assert.ok(Math.abs(male.value.bmr - female.value.bmr - 166) <= 1);
});

test("an empty or absurd field names the field instead of returning a number", () => {
  assert.deepEqual(energy({ ...DEFAULT_TDEE, age: Number.NaN }), { ok: false, error: "age" });
  assert.deepEqual(energy({ ...DEFAULT_TDEE, age: 7 }), { ok: false, error: "age" });
  assert.deepEqual(energy({ ...DEFAULT_TDEE, heightIn: 14 }), { ok: false, error: "height" });
  assert.deepEqual(energy({ ...DEFAULT_TDEE, weight: 0 }), { ok: false, error: "weight" });
  assert.deepEqual(energy({ ...DEFAULT_TDEE, units: "metric", heightCm: 900, weight: 70 }), {
    ok: false,
    error: "height",
  });
});

test("unit round trips do not drift", () => {
  assert.equal(Math.round(kgToLb(lbToKg(170)) * 1e9) / 1e9, 170);
  assert.deepEqual(cmToFeetInches(feetInchesToCm(5, 10)), { feet: 5, inches: 10 });
  // 182.6 cm is 71.9 in → rounds to 72 in → 6 ft 0, never 5 ft 12
  assert.deepEqual(cmToFeetInches(182.6), { feet: 6, inches: 0 });
});

const SAMPLE: Ingredient[] = [
  { name: "Chicken breast", grams: 200, proteinPer100: 23, carbsPer100: 0, fatPer100: 1.5 },
  { name: "White rice (dry)", grams: 150, proteinPer100: 7, carbsPer100: 78, fatPer100: 0.6 },
  { name: "Olive oil", grams: 15, proteinPer100: 0, carbsPer100: 0, fatPer100: 100 },
  { name: "Broccoli", grams: 100, proteinPer100: 2.8, carbsPer100: 7, fatPer100: 0.4 },
];

test("the pre-filled recipe totals 907 kcal, 59 g protein, 124 g carbs, 19 g fat", () => {
  const r = recipeTotals(SAMPLE, 2, "recipe");
  assert.equal(Math.round(r.kcal), 907);
  assert.equal(Math.round(r.protein.grams), 59);
  assert.equal(Math.round(r.carbs.grams), 124);
  assert.equal(Math.round(r.fat.grams), 19);
  assert.equal(Math.round(r.protein.share * 100), 26);
  assert.equal(Math.round(r.carbs.share * 100), 55);
  assert.equal(Math.round(r.fat.share * 100), 19);
  assert.equal(r.totalGrams, 465);
  assert.equal(r.ingredientCount, 4);
});

test("per serving halves it for 2 servings; per 100 g scales by total weight", () => {
  const whole = recipeTotals(SAMPLE, 2, "recipe");
  const serving = recipeTotals(SAMPLE, 2, "serving");
  const per100 = recipeTotals(SAMPLE, 2, "per100");
  assert.ok(Math.abs(serving.kcal - whole.kcal / 2) < 1e-9);
  assert.ok(Math.abs(per100.kcal - (whole.kcal / 465) * 100) < 1e-9);
  // Shares do not change with the view.
  assert.equal(serving.protein.share, whole.protein.share);
});

test("a half-filled row, a blank recipe and nonsense servings do not break the totals", () => {
  const withBlank = recipeTotals(
    [...SAMPLE, { name: "", grams: Number.NaN, proteinPer100: 5, carbsPer100: 5, fatPer100: 5 }],
    2,
    "recipe",
  );
  assert.equal(Math.round(withBlank.kcal), 907);
  assert.equal(withBlank.ingredientCount, 4);

  const empty = recipeTotals([], 2, "per100");
  assert.equal(empty.kcal, 0);
  assert.equal(empty.protein.share, 0);

  assert.equal(recipeTotals(SAMPLE, 0, "serving").servings, 1);
  assert.equal(recipeTotals(SAMPLE, -3, "serving").servings, 1);
});

test("a per-100 g typo above 100 is clamped, not trusted", () => {
  const r = recipeTotals(
    [{ name: "Oil", grams: 10, proteinPer100: 0, carbsPer100: 0, fatPer100: 1000 }],
    1,
    "recipe",
  );
  assert.equal(r.fat.grams, 10);
});

test("currency switch changes the format, never the amount", () => {
  assert.equal(formatMoney(1234, "EUR"), "€1,234");
  assert.equal(formatMoney(1234, "USD"), "$1,234");
  assert.equal(formatMoney(1234, "GBP"), "£1,234");
  assert.equal(formatMoney(123456, "INR"), "₹1,23,456");
  assert.equal(formatMoney(19.5, "USD", 2), "$19.50");
  assert.equal(formatMoney(Number.NaN, "EUR"), "€0");
  assert.ok(isCurrency("INR"));
  assert.ok(!isCurrency("JPY"));
});
