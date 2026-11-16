/**
 * Coaching business metrics: acquisition, retention, pricing and capacity. Every input is
 * the coach's own figure in one currency; nothing here converts currency. Months are
 * calendar months and a month is 52 / 12 ≈ 4.33 weeks.
 */

export const WEEKS_PER_MONTH = 52 / 12;
const safe = (x: number) => (Number.isFinite(x) ? x : 0);

/* --------------------------------------------------------- acquisition */

/** Paid ads: what one client may cost before the ads lose money. */
export function adBreakeven(budget: number, costPerLead: number, leadToClientPct: number, packagePrice: number, marginPct: number) {
  const leads = budget / costPerLead;
  const clients = leads * (leadToClientPct / 100);
  const cac = clients > 0 ? budget / clients : Number.POSITIVE_INFINITY;
  const breakevenCac = packagePrice * (marginPct / 100);
  const profitPerClient = breakevenCac - cac;
  return {
    leads,
    clients,
    cac,
    breakevenCac,
    profitPerClient,
    targetRoas: 100 / marginPct,
    roas: Number.isFinite(cac) && cac > 0 ? packagePrice / cac : 0,
    profitPerMonth: clients * profitPerClient,
  };
}

/** LTV : CAC with revenue lifetime value (price × months), not profit. */
export function acquisitionCost(spend: number, newClients: number, price: number, lifetimeMonths: number) {
  const cac = newClients > 0 ? spend / newClients : Number.POSITIVE_INFINITY;
  const ltv = price * lifetimeMonths;
  return { cac, ltv, ratio: cac > 0 && Number.isFinite(cac) ? ltv / cac : Number.POSITIVE_INFINITY, paybackMonths: price > 0 ? cac / price : Number.POSITIVE_INFINITY };
}

export function discoveryCalls(calls: number, closePct: number, clientValue: number) {
  const clients = calls * (closePct / 100);
  const lifted = calls * (Math.min(100, closePct + 10) / 100);
  return { clients, revenue: clients * clientValue, liftClients: lifted - clients, liftRevenue: (lifted - clients) * clientValue, liftedClose: Math.min(100, closePct + 10) };
}

export function emailListValue(subscribers: number, openPct: number, clickPct: number, convPct: number, price: number) {
  const buyers = subscribers * (openPct / 100) * (clickPct / 100) * (convPct / 100);
  const revenue = buyers * price;
  const perSub = subscribers > 0 ? revenue / subscribers : 0;
  return { buyers, revenue, perSubscriber: perSub, per100: perSub * 100 };
}

export function trialConversion(trials: number, converted: number, price: number, churnPct: number, adSpend: number) {
  const rate = trials > 0 ? (converted / trials) * 100 : 0;
  const mrr = converted * price;
  const cac = converted > 0 ? adSpend / converted : 0;
  return {
    rate,
    mrr,
    cac,
    paybackMonths: price > 0 ? cac / price : 0,
    liftMrr: trials * 0.02 * price,
    cohortValue: churnPct > 0 ? mrr / (churnPct / 100) : null,
  };
}

export function referralValue(clients: number, referralsPerClientYear: number, convPct: number, ltv: number, paidCac: number) {
  const newClients = clients * referralsPerClientYear * (convPct / 100);
  return { newClients, revenue: newClients * ltv, adSpendAvoided: newClients * paidCac, perMonth: newClients / 12 };
}

/* --------------------------------------------------------- retention */

export function churnRate(start: number, lost: number, added: number) {
  const churn = start > 0 ? (lost / start) * 100 : 0;
  return { churn, retention: 100 - churn, lifespanMonths: churn > 0 ? 100 / churn : Number.POSITIVE_INFINITY, end: start - lost + added, net: added - lost };
}

export function lifetimeValue(price: number, months: number) {
  return { ltv: price * months, plusOneMonth: price, firstYear: price * Math.min(12, months), months };
}

export const monthsFromChurn = (churnPct: number) => 100 / churnPct;

/** Month by month: start with the base, lose churn, then add new clients. */
export function revenueProjection(start: number, newPerMonth: number, churnPct: number, price: number, months = 12) {
  let clients = start;
  let total = 0;
  const series: { month: number; clients: number; revenue: number }[] = [];
  for (let m = 1; m <= months; m++) {
    clients = clients * (1 - churnPct / 100) + newPerMonth;
    total += clients * price;
    series.push({ month: m, clients, revenue: clients * price });
  }
  return { series, endClients: clients, endRevenue: clients * price, total, ceiling: churnPct > 0 ? newPerMonth / (churnPct / 100) : Number.POSITIVE_INFINITY };
}

/* --------------------------------------------------------- pricing */

export type PackageTier = { weeks: number; discountPct: number; price: number; monthly: number; saves: number; perHour: number };

/** Packages priced from a target rate per delivery hour, with a commitment discount ladder. */
export function packagePricing(ratePerHour: number, hoursPerWeek: number, disc12: number, disc24: number): PackageTier[] {
  return [
    { weeks: 4, d: 0 },
    { weeks: 12, d: disc12 },
    { weeks: 24, d: disc24 },
  ].map(({ weeks, d }) => {
    const full = ratePerHour * hoursPerWeek * weeks;
    const price = full * (1 - d / 100);
    const hours = hoursPerWeek * weeks;
    return { weeks, discountPct: d, price, monthly: (price / weeks) * WEEKS_PER_MONTH, saves: full - price, perHour: hours > 0 ? price / hours : 0 };
  });
}

export function priceIncrease(oldPrice: number, clients: number, newPrice: number, expectedLost: number) {
  const now = oldPrice * clients;
  const breakevenLoss = newPrice > 0 ? clients - now / newPrice : 0;
  const remaining = Math.max(0, clients - expectedLost);
  return {
    now,
    ifNobodyLeaves: newPrice * clients,
    atExpected: newPrice * remaining,
    canLose: Math.max(0, Math.floor(breakevenLoss + 1e-9)),
    canLosePct: clients > 0 ? (Math.max(0, breakevenLoss) / clients) * 100 : 0,
    neutralPrice: remaining > 0 ? now / remaining : Number.POSITIVE_INFINITY,
    ahead: newPrice * remaining >= now,
  };
}

export function profit(clients: number, price: number, costs: readonly number[]) {
  const revenue = clients * price;
  const cost = costs.reduce((a, b) => a + safe(b), 0);
  const p = revenue - cost;
  return { revenue, cost, profit: p, margin: revenue > 0 ? (p / revenue) * 100 : 0, annual: p * 12 };
}

/* --------------------------------------------------------- capacity */

export type CoachingMode = "in-person" | "online" | "hybrid";

export const CAPACITY_TYPICAL: Record<CoachingMode, { minutes: string; clients: string }> = {
  "in-person": { minutes: "45 to 75 min", clients: "about 15 to 30" },
  hybrid: { minutes: "30 to 60 min", clients: "about 25 to 50" },
  online: { minutes: "15 to 40 min", clients: "about 40 to 80 or more" },
};

export function clientCapacity(hoursPerWeek: number, minutesPerClient: number, adminPct: number, bufferPct: number, price: number | null) {
  const coachingMinutes = hoursPerWeek * 60 * (1 - adminPct / 100);
  const ceiling = minutesPerClient > 0 ? Math.floor(coachingMinutes / minutesPerClient + 1e-9) : 0;
  const sustainable = Math.floor((coachingMinutes / minutesPerClient) * (1 - bufferPct / 100) + 1e-9);
  return { ceiling, sustainable, monthly: price === null ? null : sustainable * price, yearly: price === null ? null : sustainable * price * 12 };
}

export function groupVsOneToOne(p1: number, n1: number, h1: number, pg: number, ng: number, hg: number) {
  const r1 = p1 * n1;
  const weekly1 = n1 * h1;
  const rg = pg * ng;
  const rate = (rev: number, hrs: number) => (hrs > 0 ? rev / (hrs * WEEKS_PER_MONTH) : 0);
  return {
    one: { revenue: r1, hours: weekly1, hourly: rate(r1, weekly1) },
    group: { revenue: rg, hours: hg, hourly: rate(rg, hg) },
  };
}

export function noShowCost(noShows: number, lateCancels: number, sessionValue: number, booked: number) {
  const lost = noShows + lateCancels;
  const week = lost * sessionValue;
  const month = week * WEEKS_PER_MONTH;
  return { lost, week, month, year: week * 52, capacityPct: booked > 0 ? (lost / booked) * 100 : 0, halfBackMonth: month / 2, halfBackYear: (week * 52) / 2 };
}

export type AssistantPay = "flat" | "percent" | "salary";

/** Hand clients to an assistant coach: margin kept, hours freed, and the price-rise alternative. */
export function assistantRoi(price: number, handoff: number, total: number, hoursPerClient: number, pay: AssistantPay, amount: number, platformFeePct: number) {
  const revenue = price * handoff;
  const assistant = pay === "flat" ? amount * handoff : pay === "percent" ? revenue * (amount / 100) : amount;
  const platform = revenue * (platformFeePct / 100);
  const margin = revenue - assistant - platform;
  const net = price * (1 - platformFeePct / 100);
  return {
    revenue,
    assistant,
    platform,
    margin,
    perClient: handoff > 0 ? margin / handoff : 0,
    hoursFreed: hoursPerClient * handoff,
    salaryBreakeven: pay === "salary" && net > 0 ? Math.ceil(amount / net) : null,
    raisePerClient: total > 0 ? margin / total : 0,
    raisePct: total > 0 && price > 0 ? (margin / total / price) * 100 : 0,
  };
}
