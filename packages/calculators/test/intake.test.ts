import assert from "node:assert/strict";
import { test } from "node:test";

test("calorie cycling never pushes rest days below the floor", async () => {
  const { calorieCycling, REST_DAY_FLOOR } = await import("../src/intake.ts");
  const r = calorieCycling(2000, 6, "aggressive");
  assert.ok(r.floored);
  assert.ok(r.rest.calories >= REST_DAY_FLOOR(2000) - 1);
  assert.ok(Math.abs(r.weekCycled - r.weekFlat) < 1);
  assert.equal(calorieCycling(2000, 3, "moderate").floored, false);
});

test("carb cycling flags averages too low to cycle", async () => {
  const { carbCycling } = await import("../src/intake.ts");
  assert.equal(carbCycling(1200, 90, 4, "moderate").tooLow, true);
  assert.equal(carbCycling(2600, 80, 4, "moderate").tooLow, false);
});
