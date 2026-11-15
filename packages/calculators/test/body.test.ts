import assert from "node:assert/strict";
import test from "node:test";
import {
  bmi,
  bodyFatBand,
  boerLbm,
  ffmi,
  idealWeight,
  leanBodyMass,
  muscleMass,
  navyBodyFat,
  recomp,
  waistToHeight,
  waistToHip,
  weightLossPercent,
} from "@traiv/calculators/body";

const close = (a: number, b: number, tol = 0.05) => Math.abs(a - b) <= tol;

test("BMI: 70 kg at 175 cm is 22.9, healthy; band edges follow WHO", () => {
  const r = bmi(70, 175);
  assert.ok(close(r.value, 22.857, 0.001));
  assert.equal(r.band, "healthy");
  assert.equal(bmi(56, 175).band, "underweight");
  assert.equal(bmi(77, 175).band, "overweight");
  assert.equal(bmi(92, 175).band, "obese");
});

test("Navy body fat matches the inch formula for a typical man and woman", () => {
  // man: 70 in tall, neck 15 in, waist 34 in -> 86.01·log10(19) − 70.041·log10(70) + 36.76
  const m = navyBodyFat("male", 70 * 2.54, 15 * 2.54, 34 * 2.54, null);
  assert.ok(m !== null && close(m, 86.01 * Math.log10(19) - 70.041 * Math.log10(70) + 36.76, 1e-6));
  const f = navyBodyFat("female", 65 * 2.54, 13 * 2.54, 30 * 2.54, 38 * 2.54);
  assert.ok(f !== null && close(f, 163.205 * Math.log10(55) - 97.684 * Math.log10(65) - 78.387, 1e-6));
  assert.equal(navyBodyFat("male", 178, 40, 38, null), null);
  assert.equal(navyBodyFat("female", 165, 33, 76, null), null);
});

test("body fat bands follow the ACE categories", () => {
  assert.equal(bodyFatBand("male", 4), "Essential fat");
  assert.equal(bodyFatBand("male", 16), "Fitness");
  assert.equal(bodyFatBand("female", 23), "Fitness");
  assert.equal(bodyFatBand("female", 35), "Above average");
});

test("FFMI: 80 kg at 180 cm and 15% body fat is about 21.0", () => {
  const r = ffmi(80, 180, 15);
  assert.ok(close(r.leanKg, 68));
  assert.ok(close(r.value, 68 / 3.24, 1e-6));
  assert.ok(close(r.normalised, r.value, 1e-9));
});

test("ideal weight: Devine for a 5 ft 10 in man is 73 kg", () => {
  const r = idealWeight("male", 70 * 2.54);
  assert.ok(close(r.rows.find((x) => x.name === "Devine")?.kg ?? 0, 73, 1e-6));
  assert.ok(r.lowKg <= r.highKg);
});

test("lean body mass by body fat and by Boer", () => {
  assert.ok(close(leanBodyMass(80, { bodyFatPct: 20 }).leanKg, 64));
  assert.ok(close(boerLbm("male", 80, 180), 0.407 * 80 + 0.267 * 180 - 19.2, 1e-9));
  assert.ok(close(leanBodyMass(80, { boer: { sex: "female", heightCm: 165 } }).leanKg, boerLbm("female", 80, 165), 1e-9));
});

test("skeletal muscle mass, Lee 2000, for a 30-year-old man", () => {
  const r = muscleMass("male", 30, 84, 178);
  assert.ok(close(r.kg, 0.244 * 84 + 7.8 * 1.78 + 6.6 - 0.098 * 30 - 3.3, 1e-9));
  assert.ok(muscleMass("female", 30, 84, 178).kg < r.kg);
});

test("waist ratios and their bands", () => {
  assert.equal(waistToHeight(80, 180).band, "healthy");
  assert.equal(waistToHeight(95, 175).band, "increased");
  assert.equal(waistToHip("male", 90, 100).band, "high");
  assert.equal(waistToHip("female", 75, 100).band, "low");
});

test("weight loss percent: 90 → 84 kg is 6.7% with progress toward a goal", () => {
  const r = weightLossPercent(90, 84, 78, 12);
  assert.ok(close(r.pct, 6.667, 0.001));
  assert.ok(close(r.progress ?? 0, 50, 1e-9));
  assert.ok(close(r.weekly ?? 0, 0.5, 1e-9));
  assert.equal(weightLossPercent(90, 84, null, null).progress, null);
});

test("recomp keeps lean mass and finds the end weight", () => {
  const r = recomp(81.65, 22, 15, "moderate");
  assert.ok(close(r.leanKg, 81.65 * 0.78, 1e-9));
  assert.ok(close(r.targetKg, r.leanKg / 0.85, 1e-9));
  assert.ok(r.calories < r.maintenance);
  assert.ok(r.weeks > 0);
});
