import assert from "node:assert/strict";
import test from "node:test";
import {
  dots,
  ipfGl,
  loadBar,
  oneRepMax,
  percentAtRpe,
  percentTable,
  sinclair,
  strengthLevel,
  tempoTime,
  volumeBand,
  warmupRamp,
  wilks,
} from "@traiv/calculators/strength";

const close = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;

test("1RM: 225 × 5 is 262.5 on Epley and 253.1 on Brzycki; a single is the weight itself", () => {
  assert.equal(oneRepMax(225, 5, "epley"), 262.5);
  assert.ok(close(oneRepMax(225, 5, "brzycki"), 253.125, 1e-9));
  assert.equal(oneRepMax(225, 1, "epley"), 225);
});

test("percentage table starts at the 1RM and rounds to the plate step", () => {
  const t = percentTable(262.5, "epley", 5);
  assert.equal(t[0]?.weight, 265);
  assert.equal(t[0]?.reps, 1);
  for (const row of t) assert.equal(row.weight % 5, 0);
});

test("Wilks, DOTS and IPF GL at 90 kg land on their published curves", () => {
  assert.ok(close(wilks(500, 90, "male"), 383.498031222139, 1e-9));
  assert.ok(close(dots(600, 90, "male"), 388.0, 1));
  assert.ok(close(ipfGl(700, 90, "male", "classic"), 93.1, 0.3));
  assert.ok(wilks(500, 60, "female") > wilks(500, 60, "male"));
});

test("Sinclair: 335 kg total at 89 kg is about 405; above b the coefficient is 1", () => {
  const s = sinclair(335, 89, "male");
  assert.ok(close(s.total, 405, 1));
  assert.equal(sinclair(300, 200, "male").coef, 1);
});

test("RPE chart: 5 reps at RPE 8 is 81.1%, a single at RPE 10 is 100%", () => {
  assert.ok(close(percentAtRpe(5, 8), 0.811, 1e-9));
  assert.equal(percentAtRpe(1, 10), 1);
  assert.ok(percentAtRpe(12, 6) < percentAtRpe(12, 10));
});

test("warm-up ramp never drops below the bar and ends at 85%", () => {
  const r = warmupRamp(100, "full", 20, 2.5);
  assert.equal(r[0]?.weight, 20);
  assert.equal(r.at(-1)?.weight, 85);
  assert.ok(warmupRamp(30, "quick", 20, 2.5).every((s) => s.weight >= 20));
});

test("plate loading: 102.5 kg on a 20 kg bar is 25 + 15 + 1.25 a side", () => {
  const l = loadBar(102.5, 20, [25, 20, 15, 10, 5, 2.5, 1.25]);
  assert.deepEqual(l.perSide, [25, 15, 1.25]);
  assert.equal(l.loaded, 102.5);
  assert.equal(l.short, 0);
  assert.equal(loadBar(103, 20, [25, 20, 15, 10, 5, 2.5, 1.25]).short, 0.5);
  assert.equal(loadBar(15, 20, [25]).loaded, 20);
});

test("tempo 3-1-2-0 × 8 reps × 3 sets is 6 s a rep and 144 s in total", () => {
  assert.deepEqual(tempoTime(3, 1, 2, 0, 8, 3), { perRep: 6, perSet: 48, total: 144 });
});

test("volume bands against MEV 10 / MAV 15 / MRV 20", () => {
  assert.equal(volumeBand(8, 10, 15, 20), "below-mev");
  assert.equal(volumeBand(12, 10, 15, 20), "productive");
  assert.equal(volumeBand(18, 10, 15, 20), "high");
  assert.equal(volumeBand(24, 10, 15, 20), "above-mrv");
});

test("strength standards: a 275 lb squat at 180 lb bodyweight is novice", () => {
  const s = strengthLevel(275, 180, "male", "squat");
  assert.equal(s.level, "Novice");
  assert.equal(s.nextLevel, "Intermediate");
  assert.ok(close(s.nextWeight ?? 0, 315));
});

test("changing a plate selection to an invalid denomination cannot hang loading", () => {
  assert.throws(() => loadBar(100, 20, [20, 0]), RangeError);
  assert.throws(() => loadBar(Infinity, 20, [20]), RangeError);
  assert.equal(loadBar(100, 20, []).loaded, 20);
});

test("a light female lifter cannot receive a negative IPF GL score", () => {
  assert.ok(ipfGl(100, 30, "female", "classic") > 0);
  assert.equal(ipfGl(100, 30, "female", "classic"), ipfGl(100, 40, "female", "classic"));
});
