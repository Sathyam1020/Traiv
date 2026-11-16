import assert from "node:assert/strict";
import { test } from "node:test";
import {
  acquisitionCost,
  adBreakeven,
  assistantRoi,
  churnRate,
  clientCapacity,
  discoveryCalls,
  emailListValue,
  groupVsOneToOne,
  lifetimeValue,
  monthsFromChurn,
  noShowCost,
  packagePricing,
  priceIncrease,
  profit,
  referralValue,
  revenueProjection,
  trialConversion,
} from "../src/metrics.ts";

const near = (a: number, b: number, d = 0.5) => assert.ok(Math.abs(a - b) <= d, `${a} vs ${b}`);

test("ad spend breakeven at the default numbers", () => {
  const r = adBreakeven(1000, 20, 10, 900, 70);
  assert.equal(r.leads, 50);
  near(r.clients, 5, 1e-9);
  near(r.cac, 200, 1e-9);
  near(r.breakevenCac, 630, 1e-9);
  near(r.profitPerClient, 430, 1e-9);
  near(r.targetRoas, 1.43, 0.01);
  near(r.roas, 4.5, 1e-9);
  near(r.profitPerMonth, 2150, 1e-6);
});

test("CAC, LTV and payback", () => {
  const r = acquisitionCost(600, 4, 150, 6);
  assert.equal(r.cac, 150);
  assert.equal(r.ltv, 900);
  assert.equal(r.ratio, 6);
  assert.equal(r.paybackMonths, 1);
  assert.equal(acquisitionCost(600, 0, 150, 6).cac, Number.POSITIVE_INFINITY);
});

test("discovery calls, email list and trials", () => {
  const d = discoveryCalls(20, 30, 1500);
  near(d.clients, 6, 1e-9);
  near(d.revenue, 9000, 1e-6);
  near(d.liftRevenue, 3000, 1e-6);
  const e = emailListValue(500, 40, 8, 5, 300);
  near(e.buyers, 0.8, 1e-9);
  near(e.revenue, 240, 1e-6);
  near(e.perSubscriber, 0.48, 1e-9);
  near(e.per100, 48, 1e-6);
  const t = trialConversion(40, 10, 300, 5, 1600);
  assert.equal(t.rate, 25);
  assert.equal(t.mrr, 3000);
  assert.equal(t.cac, 160);
  near(t.paybackMonths, 0.53, 0.01);
  near(t.liftMrr, 240, 1e-6);
  assert.equal(t.cohortValue, 60000);
});

test("referrals", () => {
  const r = referralValue(20, 1.5, 40, 900, 120);
  near(r.newClients, 12, 1e-9);
  near(r.revenue, 10800, 1e-6);
  near(r.adSpendAvoided, 1440, 1e-6);
  near(r.perMonth, 1, 1e-9);
});

test("churn, lifetime value and projection", () => {
  const c = churnRate(40, 2, 4);
  assert.equal(c.churn, 5);
  assert.equal(c.retention, 95);
  assert.equal(c.lifespanMonths, 20);
  assert.equal(c.end, 42);
  assert.equal(lifetimeValue(300, 6).ltv, 1800);
  assert.equal(lifetimeValue(300, 6).firstYear, 1800);
  assert.equal(lifetimeValue(300, 20).firstYear, 3600);
  near(monthsFromChurn(16.67), 6, 0.01);
  const p = revenueProjection(20, 5, 5, 300);
  near(p.endClients, 56.8, 0.1);
  near(p.endRevenue, 17031, 1);
  near(p.total, 150404, 1);
  assert.equal(p.ceiling, 100);
});

test("package ladder at 60 per hour and 0.75 hours a week", () => {
  const [a, b, c] = packagePricing(60, 0.75, 10, 15);
  near(a?.price ?? 0, 180, 1e-6);
  near(a?.monthly ?? 0, 195, 0.5);
  near(b?.price ?? 0, 486, 1e-6);
  near(b?.monthly ?? 0, 175.5, 0.1);
  near(b?.saves ?? 0, 54, 1e-6);
  near(b?.perHour ?? 0, 54, 1e-6);
  near(c?.price ?? 0, 918, 1e-6);
  near(c?.saves ?? 0, 162, 1e-6);
  near(c?.perHour ?? 0, 51, 1e-6);
});

test("price increase break-even", () => {
  const r = priceIncrease(150, 20, 180, 2);
  assert.equal(r.now, 3000);
  assert.equal(r.ifNobodyLeaves, 3600);
  assert.equal(r.atExpected, 3240);
  assert.equal(r.canLose, 3);
  near(r.canLosePct, 16.7, 0.05);
  near(r.neutralPrice, 166.67, 0.01);
  assert.equal(r.ahead, true);
  assert.equal(priceIncrease(150, 20, 180, 5).ahead, false);
});

test("profit", () => {
  const r = profit(20, 300, [150, 800, 400, 150]);
  assert.equal(r.revenue, 6000);
  assert.equal(r.cost, 1500);
  assert.equal(r.profit, 4500);
  assert.equal(r.margin, 75);
  assert.equal(r.annual, 54000);
});

test("capacity, group versus 1:1 and no-shows", () => {
  const c = clientCapacity(30, 30, 20, 15, 120);
  assert.equal(c.ceiling, 48);
  assert.equal(c.sustainable, 40);
  assert.equal(c.monthly, 4800);
  assert.equal(c.yearly, 57600);
  const g = groupVsOneToOne(400, 15, 1, 150, 30, 4);
  near(g.one.hourly, 92, 0.5);
  near(g.group.hourly, 260, 0.5);
  const n = noShowCost(2, 1, 40, 30);
  assert.equal(n.week, 120);
  near(n.month, 520, 0.01);
  assert.equal(n.year, 6240);
  near(n.capacityPct, 10, 1e-9);
  near(n.halfBackMonth, 260, 0.01);
  assert.equal(n.halfBackYear, 3120);
});

test("assistant coach handoff", () => {
  const r = assistantRoi(200, 15, 40, 0.5, "flat", 60, 0);
  assert.equal(r.revenue, 3000);
  assert.equal(r.margin, 2100);
  assert.equal(r.perClient, 140);
  assert.equal(r.hoursFreed, 7.5);
  near(r.raisePerClient, 52.5, 1e-9);
  const s = assistantRoi(200, 15, 40, 0.5, "salary", 3000, 5);
  assert.equal(s.salaryBreakeven, 16);
  assert.ok(s.margin < 0);
});
