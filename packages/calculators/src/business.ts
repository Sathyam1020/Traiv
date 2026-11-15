/**
 * Coaching business arithmetic. Money is in whole currency units the coach typed; the
 * currency only changes formatting (see money.ts). Weeks per month = 52 / 12.
 */

export const WEEKS_PER_MONTH = 52 / 12;

export type IncomeModel = "in-person" | "online";

export type IncomeInput =
  | {
      model: "in-person";
      sessionRate: number;
      sessionsPerWeek: number;
      gymSplitPct: number;
      weeksPerYear: number;
      monthlyCosts: number;
    }
  | {
      model: "online";
      pricePerClient: number;
      clients: number;
      hoursPerClient: number;
      weeksPerYear: number;
      monthlyCosts: number;
    };

export type IncomeResult = {
  monthlyGross: number;
  annualGross: number;
  monthlyTake: number;
  annualTake: number;
  hoursPerWeek: number;
  hourly: number;
};

export function coachingIncome(i: IncomeInput): IncomeResult {
  let annualGross: number;
  let annualAfterSplit: number;
  let hoursPerWeek: number;
  if (i.model === "in-person") {
    annualGross = i.sessionRate * i.sessionsPerWeek * i.weeksPerYear;
    annualAfterSplit = annualGross * (1 - Math.min(100, Math.max(0, i.gymSplitPct)) / 100);
    hoursPerWeek = i.sessionsPerWeek;
  } else {
    // Online clients pay monthly whether or not the coach takes a week off.
    annualGross = i.pricePerClient * i.clients * 12;
    annualAfterSplit = annualGross;
    hoursPerWeek = i.clients * i.hoursPerClient;
  }
  const annualTake = annualAfterSplit - i.monthlyCosts * 12;
  const workedHours = hoursPerWeek * i.weeksPerYear;
  return {
    monthlyGross: annualGross / 12,
    annualGross,
    monthlyTake: annualTake / 12,
    annualTake,
    hoursPerWeek,
    hourly: workedHours > 0 ? annualTake / workedHours : 0,
  };
}

export type RateInput = {
  targetMonthlyIncome: number;
  monthlyCosts: number;
  hoursPerClient: number;
  hoursAvailable: number;
  churnPct: number;
};

export type RateResult = {
  revenueNeeded: number;
  capacity: number;
  /** Clients actually paying on average once churn gaps are allowed for. */
  billable: number;
  price: number;
  hourly: number;
  breakevenClients: number;
  monthlyChurnLoss: number;
  /** Price if churn were halved, to show what retention is worth. */
  priceAtHalfChurn: number;
};

export function coachingRate(r: RateInput): RateResult | null {
  const capacity = r.hoursPerClient > 0 ? Math.floor(r.hoursAvailable / r.hoursPerClient) : 0;
  if (capacity < 1) return null;
  const churn = Math.min(90, Math.max(0, r.churnPct)) / 100;
  const revenueNeeded = r.targetMonthlyIncome + r.monthlyCosts;
  const billableAt = (c: number) => capacity * (1 - c);
  const billable = billableAt(churn);
  const price = revenueNeeded / billable;
  return {
    revenueNeeded,
    capacity,
    billable,
    price,
    hourly: revenueNeeded / (capacity * r.hoursPerClient * WEEKS_PER_MONTH),
    breakevenClients: price > 0 ? Math.ceil(r.monthlyCosts / price) : 0,
    monthlyChurnLoss: price * capacity * churn,
    priceAtHalfChurn: revenueNeeded / billableAt(churn / 2),
  };
}
