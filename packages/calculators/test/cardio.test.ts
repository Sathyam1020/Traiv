import assert from "node:assert/strict";
import { test } from "node:test";
import {
  beepTest,
  clock,
  cooperCategory,
  cooperRanges,
  cooperVo2,
  heartRateZones,
  intervalWalk,
  maxHeartRate,
  mile15Vo2,
  pace,
  restingHrVo2,
  riegel,
  rucking,
  timerAt,
  timerSegments,
  timerTotal,
  vo2Category,
  vo2Ranges,
  zone2,
} from "../src/cardio.ts";

const near = (a: number, b: number, d = 0.05) => assert.ok(Math.abs(a - b) <= d, `${a} vs ${b}`);

test("a 30-year-old's max heart rate by the three formulas", () => {
  const m = maxHeartRate(30);
  assert.equal(m.fox, 190);
  near(m.tanaka, 187);
  near(m.gellish, 186);
});

test("zones use % of max without a resting rate and heart rate reserve with one", () => {
  const z = heartRateZones(187, null);
  assert.deepEqual([z[1]?.loBpm, z[1]?.hiBpm], [112, 131]);
  const k = heartRateZones(187, 60);
  assert.deepEqual([k[1]?.loBpm, k[1]?.hiBpm], [136, 149]);
});

test("zone 2 for a 40-year-old by each method", () => {
  const a = zone2(40, 60, null, "hrmax");
  assert.deepEqual([Math.round(a.lo), Math.round(a.hi)], [108, 126]);
  const k = zone2(40, 60, null, "karvonen");
  assert.deepEqual([Math.round(k.lo), Math.round(k.hi)], [132, 144]);
  const m = zone2(40, 60, null, "maf");
  assert.deepEqual([m.lo, m.hi], [130, 140]);
  assert.equal(zone2(40, 60, 185, "hrmax").max, 185);
});

test("beep test level 9 shuttle 5", () => {
  const r = beepTest(9, 5);
  assert.ok(r);
  near(r.vo2, 44.9);
  assert.equal(r.shuttles, 77);
  assert.equal(r.metres, 1540);
  assert.equal(r.speedKmh, 12.5);
  assert.equal(beepTest(9, 12), null);
  assert.equal(vo2Category(r.vo2, 30, "male"), "Good");
});

test("field VO2 estimates", () => {
  near(cooperVo2(2400), 42.4);
  near(mile15Vo2(12.5), 42.1);
  near(restingHrVo2(190, 60), 48.5);
});

test("VO2 categories at the band edges", () => {
  assert.equal(vo2Category(40.9, 35, "male"), "Fair");
  assert.equal(vo2Category(41.0, 35, "male"), "Good");
  assert.equal(vo2Category(60, 25, "female"), "Superior");
  assert.equal(vo2Category(10, 70, "female"), "Very poor");
  assert.equal(vo2Ranges(30, "male").length, 6);
});

test("Cooper distance ratings", () => {
  assert.equal(cooperCategory(2400, 30, "male"), "Good");
  assert.equal(cooperCategory(2701, 30, "male"), "Excellent");
  assert.equal(cooperCategory(1450, 30, "female"), "Poor");
  assert.equal(cooperRanges(30, "male")[0]?.label, "Under 1,500 m");
});

test("Riegel predicts a 52:07 10K from a 25:00 5K", () => {
  assert.equal(clock(riegel(1500, 5000, 10000)), "52:07");
  assert.equal(clock(riegel(1500, 5000, 42195)), "3:59:47");
});

test("pace for 10 km in 50 minutes", () => {
  const p = pace(10000, 3000);
  assert.equal(clock(p.secPerKm), "5:00");
  assert.equal(clock(p.secPerMile), "8:03");
  near(p.kmh, 12);
  near(p.mph, 7.46);
});

test("Japanese interval walking for 175 lb", () => {
  const r = intervalWalk(175 * 0.45359237, 3, 3, 5, "4.0", "2.5", 4);
  assert.equal(r.minutes, 30);
  assert.equal(Math.round(r.briskKcal), 104);
  assert.equal(Math.round(r.easyKcal), 63);
  assert.equal(Math.round(r.total), 167);
  assert.equal(Math.round(r.steadyKcal), 146);
  assert.equal(Math.round(r.weekly), 667);
});

test("rucking costs more with load, grade and soft terrain", () => {
  const base = rucking(80, 15, 1.341, 0, "pavement", 60);
  assert.ok(base.addedPct > 5 && base.addedPct < 20);
  assert.ok(rucking(80, 15, 1.341, 5, "pavement", 60).total > base.total * 1.4);
  assert.ok(rucking(80, 15, 1.341, 0, "sand", 60).total > base.total * 1.5);
});

test("timer sequences", () => {
  const t = timerSegments("tabata", { work: 20, rest: 10, rounds: 8 });
  assert.equal(t.length, 16);
  assert.equal(timerTotal(t), 240);
  assert.equal(timerTotal(timerSegments("emom", { minutes: 10 })), 600);
  assert.equal(timerSegments("custom", { work: 40, rest: 0, rounds: 6 }).length, 6);
  const at = timerAt(t, 25);
  assert.equal(at.segment?.kind, "rest");
  assert.equal(at.remaining, 5);
  assert.equal(timerAt(t, 240).done, true);
});
