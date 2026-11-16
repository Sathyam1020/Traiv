"use client";

import {
  type AssistantPay,
  acquisitionCost,
  adBreakeven,
  assistantRoi,
  CAPACITY_TYPICAL,
  type CoachingMode,
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
} from "@traiv/calculators/metrics";
import { type Currency, formatMoney } from "@traiv/calculators/money";
import { Checkbox } from "@traiv/ui/components/checkbox";
import { useState } from "react";
import {
  ErrorText,
  fmt,
  Headline,
  Note,
  type Num,
  NumberInput,
  Pills,
  ResultPanel,
  Stats,
  ToolForm,
  ToolLayout,
  Warning,
} from "../kit";
import { CurrencyPills } from "./business";
import { Table } from "./strength";

const ok = (...xs: Num[]): boolean => xs.every((x) => x !== "" && Number.isFinite(x) && x >= 0);
const n = (x: Num) => (x === "" ? 0 : x);

function useMoney() {
  const [currency, setCurrency] = useState<Currency>("EUR");
  const money = (x: number, d = 0) => formatMoney(x, currency, d);
  const pills = <CurrencyPills value={currency} onChange={setCurrency} />;
  return { currency, money, pills };
}

/** A money field: the suffix shows the chosen currency code. */
function Money({
  label,
  value,
  onChange,
  currency,
  hint,
  max = 10_000_000,
}: {
  label: string;
  value: Num;
  onChange: (v: Num) => void;
  currency: Currency;
  hint?: string;
  max?: number;
}) {
  return (
    <NumberInput
      label={label}
      value={value}
      onChange={onChange}
      min={0}
      max={max}
      suffix={currency}
      {...(hint ? { hint } : {})}
    />
  );
}

const months = (x: number) => (Number.isFinite(x) ? `${fmt(x, 1)} months` : "Never");

/* -------------------------------------------------------- ad spend */

export function AdBreakevenWidget() {
  const m = useMoney();
  const [budget, setBudget] = useState<Num>(1000);
  const [cpl, setCpl] = useState<Num>(20);
  const [cr, setCr] = useState<Num>(10);
  const [price, setPrice] = useState<Num>(900);
  const [margin, setMargin] = useState<Num>(70);
  const compute = () =>
    ok(budget, cpl, cr, price, margin) &&
    n(cpl) > 0 &&
    n(cr) > 0 &&
    n(margin) > 0 &&
    n(margin) <= 100 &&
    n(cr) <= 100
      ? adBreakeven(n(budget), n(cpl), n(cr), n(price), n(margin))
      : null;
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Ad spend breakeven calculator"
          submitLabel="Calculate breakeven"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <Money
            label="Monthly ad budget"
            value={budget}
            onChange={setBudget}
            currency={m.currency}
          />
          <Money label="Cost per lead" value={cpl} onChange={setCpl} currency={m.currency} />
          <NumberInput
            label="Lead-to-client rate"
            value={cr}
            onChange={setCr}
            min={0.1}
            max={100}
            suffix="%"
          />
          <Money
            label="Package price per client"
            hint="Total revenue from one client: monthly fee × months retained, or a one-off programme fee."
            value={price}
            onChange={setPrice}
            currency={m.currency}
          />
          <NumberInput
            label="Gross margin"
            hint="What's left of the price after delivery costs such as software, assistants and payment fees. Leave ad spend out; that's what is being tested."
            value={margin}
            onChange={setMargin}
            min={1}
            max={100}
            suffix="%"
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Highest cost per client before the ads lose money (breakeven CAC)"
                value={m.money(r.breakevenCac)}
                note={`Your cost per client at these numbers: ${Number.isFinite(r.cac) ? m.money(r.cac) : "no clients yet"}. ${r.profitPerClient >= 0 ? "There is room to spend." : "Each client loses money."}`}
              />
              <Stats
                items={[
                  {
                    label: "Profit per client",
                    value: m.money(r.profitPerClient),
                    note: "Gross profit minus acquisition cost",
                  },
                  {
                    label: "ROAS needed to break even",
                    value: `${fmt(r.targetRoas, 2)}×`,
                    note: "Revenue per unit of ad spend",
                  },
                  {
                    label: "Your ROAS",
                    value: `${fmt(r.roas, 1)}×`,
                    note: "Package price ÷ cost per client",
                  },
                  {
                    label: "A month at this budget",
                    value: `${fmt(r.leads)} leads · ${fmt(r.clients, 1)} clients`,
                    note: `${m.money(r.profitPerMonth)} profit`,
                  },
                ]}
              />
              <Note>
                Assumes the whole budget is spent at this cost per lead and conversion rate. Monthly
                profit is clients won × profit per client.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter a budget, a cost per lead above zero, a conversion rate and margin between 1 and
              100%, and a price.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- assistant coach */

const PAY_DEFAULT: Record<AssistantPay, number> = { flat: 60, percent: 40, salary: 3000 };

export function AssistantRoiWidget() {
  const m = useMoney();
  const [price, setPrice] = useState<Num>(200);
  const [handoff, setHandoff] = useState<Num>(15);
  const [total, setTotal] = useState<Num>(40);
  const [hours, setHours] = useState<Num>(0.5);
  const [pay, setPayRaw] = useState<AssistantPay>("flat");
  const [amount, setAmount] = useState<Num>(60);
  const [fee, setFee] = useState<"none" | "share">("none");
  const [feePct, setFeePct] = useState<Num>(5);
  const setPay = (p: AssistantPay) => {
    setPayRaw(p);
    setAmount(PAY_DEFAULT[p]);
  };
  const compute = () => {
    if (!ok(price, handoff, total, hours, amount, feePct) || n(handoff) < 1 || n(total) < 1)
      return null;
    if (n(handoff) > n(total)) return "handoff" as const;
    return assistantRoi(
      n(price),
      n(handoff),
      n(total),
      n(hours),
      pay,
      n(amount),
      fee === "share" ? Math.min(100, n(feePct)) : 0,
    );
  };
  const [r, setR] = useState(compute);
  const LABEL = {
    flat: "Flat fee per handed-off client / month",
    percent: "Share of the client's fee",
    salary: "Monthly salary",
  } as const;
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Assistant coach ROI calculator"
          submitLabel="Calculate the handoff"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <Money
            label="Price per client / month"
            value={price}
            onChange={setPrice}
            currency={m.currency}
          />
          <NumberInput
            label="Clients you would hand to the assistant"
            value={handoff}
            onChange={setHandoff}
            min={1}
            max={1000}
          />
          <NumberInput
            label="Your current total active clients"
            value={total}
            onChange={setTotal}
            min={1}
            max={2000}
          />
          <NumberInput
            label="Hours you spend per client / week"
            value={hours}
            onChange={setHours}
            min={0}
            max={20}
            suffix="h"
          />
          <Pills
            label="How you pay the assistant"
            value={pay}
            onChange={setPay}
            options={[
              { value: "flat", label: "Flat / client" },
              { value: "percent", label: "% of fee" },
              { value: "salary", label: "Monthly salary" },
            ]}
          />
          {pay === "percent" ? (
            <NumberInput
              label={LABEL[pay]}
              value={amount}
              onChange={setAmount}
              min={0}
              max={100}
              suffix="%"
            />
          ) : (
            <Money label={LABEL[pay]} value={amount} onChange={setAmount} currency={m.currency} />
          )}
          <Pills
            label="Platform fee on client payments"
            value={fee}
            onChange={setFee}
            options={[
              { value: "none", label: "No revenue share" },
              { value: "share", label: "Platform takes a share" },
            ]}
          />
          {fee === "share" ? (
            <NumberInput
              label="Platform or payment fee"
              value={feePct}
              onChange={setFeePct}
              min={0}
              max={100}
              suffix="%"
            />
          ) : null}
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r === "handoff" ? (
            <ErrorText>
              You can't hand over more clients than you have. Check the two client numbers.
            </ErrorText>
          ) : r ? (
            <>
              <Headline
                label="Margin you keep from the handoff"
                value={`${m.money(r.margin)}/mo`}
                note={
                  r.margin > 0
                    ? `You keep ${m.money(r.margin)} a month and free ${fmt(r.hoursFreed, 1)} hours a week. Hire if those hours are worth more to you than the margin you give up.`
                    : "At these numbers the handoff loses money: the assistant and fees cost more than the clients bring in."
                }
              />
              <Stats
                items={[
                  { label: "Per handed-off client", value: `${m.money(r.perClient)}/mo` },
                  { label: "Hours freed per week", value: `${fmt(r.hoursFreed, 1)} h` },
                  ...(r.salaryBreakeven !== null
                    ? [
                        {
                          label: "Salary break-even",
                          value: `${r.salaryBreakeven} clients`,
                          note: "Needed to cover the salary",
                        },
                      ]
                    : []),
                  {
                    label: "Or raise prices instead",
                    value: `+${m.money(r.raisePerClient)}/client`,
                    note: `About ${fmt(r.raisePct)}% on each of your ${n(total)} clients nets the same margin without hiring`,
                  },
                ]}
              />
              {r.margin <= 0 ? (
                <Warning>
                  Raise the price, hand over more clients or rework the pay before hiring.
                </Warning>
              ) : (
                <Note>
                  Count platform and payment fees before calling it margin. The freed hours only
                  help if you put them into sales, content or your own clients.
                </Note>
              )}
            </>
          ) : (
            <ErrorText>
              Enter a price, at least one client to hand over, your total clients, hours and pay.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- capacity */

export function ClientCapacityWidget() {
  const m = useMoney();
  const [mode, setMode] = useState<CoachingMode>("online");
  const [hours, setHours] = useState<Num>(30);
  const [mins, setMins] = useState<Num>(30);
  const [admin, setAdmin] = useState<Num>(20);
  const [buffer, setBuffer] = useState<Num>(15);
  const [price, setPrice] = useState<Num>(120);
  const compute = () =>
    ok(hours, mins, admin, buffer) &&
    n(hours) >= 1 &&
    n(mins) >= 1 &&
    n(admin) < 100 &&
    n(buffer) < 100
      ? {
          ...clientCapacity(n(hours), n(mins), n(admin), n(buffer), price === "" ? null : price),
          mins: n(mins),
          mode,
        }
      : null;
  const [r, setR] = useState(compute);
  const MODE = { "in-person": "1:1 in-person", online: "Online async", hybrid: "Hybrid" } as const;
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Client capacity calculator"
          submitLabel="Calculate capacity"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="Coaching mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "in-person", label: "1:1 in-person" },
              { value: "online", label: "Online async" },
              { value: "hybrid", label: "Hybrid" },
            ]}
          />
          <NumberInput
            label="Coaching hours available per week"
            value={hours}
            onChange={setHours}
            min={1}
            max={100}
            suffix="h"
          />
          <NumberInput
            label="Minutes per client per week"
            hint="Include sessions, check-in reviews, programme updates and messages."
            value={mins}
            onChange={setMins}
            min={1}
            max={600}
            suffix="min"
          />
          <NumberInput
            label="Admin overhead"
            hint="Time lost each week to sales, content, invoicing and email."
            value={admin}
            onChange={setAdmin}
            min={0}
            max={80}
            suffix="%"
          />
          <NumberInput
            label="No-show or churn buffer"
            hint="Spare time you keep for onboarding and unpredictable weeks."
            value={buffer}
            onChange={setBuffer}
            min={0}
            max={50}
            suffix="%"
          />
          {m.pills}
          <Money
            label="Price per client / month (optional)"
            value={price}
            onChange={setPrice}
            currency={m.currency}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label={`Max sustainable clients · ${MODE[r.mode]}`}
                value={fmt(r.sustainable)}
                unit="clients"
                note={`Without any buffer the limit is ${r.ceiling}. For ${MODE[r.mode].toLowerCase()} coaching, ${CAPACITY_TYPICAL[r.mode].clients} is common.`}
              />
              {r.monthly !== null && r.yearly !== null ? (
                <Stats
                  items={[
                    { label: "Revenue at capacity / month", value: m.money(r.monthly) },
                    { label: "Revenue at capacity / year", value: m.money(r.yearly) },
                  ]}
                />
              ) : (
                <Note>Add a price per client to see revenue at capacity.</Note>
              )}
              <Table
                head={["Mode", "Typical time per client per week", "Typical sustainable clients"]}
                rows={(Object.keys(MODE) as CoachingMode[]).map((k) => [
                  MODE[k],
                  CAPACITY_TYPICAL[k].minutes,
                  CAPACITY_TYPICAL[k].clients,
                ])}
              />
              <Note>
                Spending {r.mins} minutes on each client, your week fits about {r.sustainable} of
                them. Shorter reviews would fit more, but thinner feedback is a common reason
                clients cancel. Treat this as a limit, not a target.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter at least 1 hour and 1 minute per client, with admin and buffer under 100%.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- retention */

export function ChurnRateWidget() {
  const [start, setStart] = useState<Num>(40);
  const [lost, setLost] = useState<Num>(2);
  const [added, setAdded] = useState<Num>(4);
  const compute = () => {
    if (!ok(start, lost, added) || n(start) < 1) return null;
    if (n(lost) > n(start)) return "lost" as const;
    return churnRate(n(start), n(lost), n(added));
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Client churn rate calculator"
          submitLabel="Calculate churn rate"
          onSubmit={() => setR(compute())}
        >
          <NumberInput
            label="Clients at start of month"
            value={start}
            onChange={setStart}
            min={1}
            max={100000}
          />
          <NumberInput
            label="Clients lost this month"
            hint="Cancellations and finished clients in this month."
            value={lost}
            onChange={setLost}
            min={0}
            max={100000}
          />
          <NumberInput
            label="Clients added this month"
            hint="New sign-ups don't change churn; they show up in net change."
            value={added}
            onChange={setAdded}
            min={0}
            max={100000}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r === "lost" ? (
            <ErrorText>You can't lose more clients than you started the month with.</ErrorText>
          ) : r ? (
            <>
              <Headline
                label="Monthly churn rate"
                value={`${fmt(r.churn, 1)}%`}
                note={`${n(lost)} lost of ${n(start)} at the start of the month`}
              />
              <Stats
                items={[
                  {
                    label: "Monthly retention",
                    value: `${fmt(r.retention, 1)}%`,
                    note: "The clients who stayed",
                  },
                  {
                    label: "Average client lifespan",
                    value: Number.isFinite(r.lifespanMonths)
                      ? `${fmt(r.lifespanMonths, 1)} months`
                      : "No churn this month",
                    note: "1 ÷ monthly churn",
                  },
                  {
                    label: "Net change this month",
                    value: `${r.net >= 0 ? "+" : ""}${r.net}`,
                    note: `Ending on ${r.end} clients`,
                  },
                ]}
              />
              <Note>
                Churn compares departures with the clients you began the month with. Sign-ups grow
                your headcount without changing it.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter at least one starting client and whole numbers for lost and added.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function ClientLtvWidget() {
  const m = useMoney();
  const [price, setPrice] = useState<Num>(300);
  const [mode, setMode] = useState<"retention" | "churn">("retention");
  const [ret, setRet] = useState<Num>(6);
  const [churn, setChurn] = useState<Num>(16.67);
  const compute = () => {
    if (!ok(price)) return null;
    if (mode === "retention")
      return ok(ret) && n(ret) >= 0.1 ? lifetimeValue(n(price), n(ret)) : null;
    return ok(churn) && n(churn) >= 0.1 && n(churn) <= 100
      ? lifetimeValue(n(price), monthsFromChurn(n(churn)))
      : null;
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Client LTV calculator"
          submitLabel="Calculate client LTV"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <Money
            label="Monthly price per client"
            value={price}
            onChange={setPrice}
            currency={m.currency}
          />
          <Pills
            label="How do you measure retention?"
            value={mode}
            onChange={setMode}
            options={[
              { value: "retention", label: "Avg months" },
              { value: "churn", label: "Monthly churn %" },
            ]}
          />
          {mode === "retention" ? (
            <NumberInput
              label="Average retention"
              value={ret}
              onChange={setRet}
              min={0.1}
              max={240}
              suffix="months"
            />
          ) : (
            <NumberInput
              label="Monthly churn rate"
              hint="Converted to months as 1 ÷ (churn ÷ 100)."
              value={churn}
              onChange={setChurn}
              min={0.1}
              max={100}
              suffix="%"
            />
          )}
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Lifetime value per client"
                value={m.money(r.ltv)}
                note={`${m.money(n(price))} × ${fmt(r.months, 1)} months`}
              />
              <Stats
                items={[
                  {
                    label: "One more month of retention",
                    value: m.money(r.plusOneMonth),
                    note: "What +1 month adds per client",
                  },
                  {
                    label: "Revenue in the first 12 months",
                    value: m.money(r.firstYear),
                    note: "Capped at lifetime value",
                  },
                  { label: "Average months retained", value: fmt(r.months, 1) },
                ]}
              />
              <Note>
                These are figures for one client; scale them by your roster to see the whole
                business.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter a price and a retention of at least 0.1 months, or a churn rate between 0.1 and
              100%.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function RevenueProjectorWidget() {
  const m = useMoney();
  const [start, setStart] = useState<Num>(20);
  const [add, setAdd] = useState<Num>(5);
  const [churn, setChurn] = useState<Num>(5);
  const [price, setPrice] = useState<Num>(300);
  const compute = () =>
    ok(start, add, churn, price) && n(churn) <= 100
      ? revenueProjection(n(start), n(add), n(churn), n(price))
      : null;
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Coaching revenue projector"
          submitLabel="Project my revenue"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <NumberInput
            label="Starting clients"
            value={start}
            onChange={setStart}
            min={0}
            max={2000}
          />
          <NumberInput
            label="New clients per month"
            value={add}
            onChange={setAdd}
            min={0}
            max={500}
          />
          <NumberInput
            label="Monthly churn"
            hint="Percentage of clients leaving in a typical month."
            value={churn}
            onChange={setChurn}
            min={0}
            max={100}
            suffix="%"
          />
          <Money
            label="Price per client / month"
            value={price}
            onChange={setPrice}
            currency={m.currency}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Monthly revenue in month 12"
                value={m.money(r.endRevenue)}
                note={`After 12 months you have about ${fmt(r.endClients)} clients paying ${m.money(n(price))} each.`}
              />
              <Stats
                items={[
                  { label: "Clients after 12 months", value: fmt(r.endClients) },
                  { label: "Total revenue over 12 months", value: m.money(r.total) },
                  {
                    label: "Steady-state ceiling",
                    value: Number.isFinite(r.ceiling)
                      ? `${fmt(r.ceiling)} clients`
                      : "No ceiling at 0% churn",
                    note: "New per month ÷ churn rate",
                  },
                ]}
              />
              <Table
                head={["Month", "Clients", "Revenue"]}
                rows={r.series
                  .filter((x) => x.month % 3 === 0)
                  .map((x) => [`Month ${x.month}`, fmt(x.clients), m.money(x.revenue)])}
              />
              <Note>
                Growth stops where monthly losses equal monthly sign-ups. More sign-ups or fewer
                losses lift that ceiling.
              </Note>
            </>
          ) : (
            <ErrorText>Enter clients, a monthly churn between 0 and 100% and a price.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- acquisition */

export function CacWidget() {
  const m = useMoney();
  const [spend, setSpend] = useState<Num>(600);
  const [clients, setClients] = useState<Num>(4);
  const [price, setPrice] = useState<Num>(150);
  const [life, setLife] = useState<Num>(6);
  const compute = () =>
    ok(spend, clients, price, life) && n(clients) > 0 && n(price) > 0 && n(spend) > 0
      ? acquisitionCost(n(spend), n(clients), n(price), n(life))
      : null;
  const [r, setR] = useState(compute);
  const verdict = (x: number) =>
    x >= 5
      ? "Above 5 to 1: acquisition is very efficient, and there may be room to spend more on growth."
      : x >= 3
        ? "Between 3 and 5 to 1: a healthy, sustainable range."
        : x >= 1
          ? "Below 3 to 1: each client earns back their cost, but the margin for delivery and profit is thin."
          : "Below 1 to 1: clients cost more to win than they pay over their lifetime.";
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Customer acquisition cost calculator"
          submitLabel="Calculate CAC"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <Money
            label="Monthly marketing spend"
            hint="Monthly cost of finding clients, including ads, marketing tools and paid help."
            value={spend}
            onChange={setSpend}
            currency={m.currency}
          />
          <NumberInput
            label="New clients per month"
            value={clients}
            onChange={setClients}
            min={0}
            max={10000}
          />
          <Money
            label="Monthly price per client"
            value={price}
            onChange={setPrice}
            currency={m.currency}
          />
          <NumberInput
            label="Average client lifetime"
            hint="Average months a client keeps paying."
            value={life}
            onChange={setLife}
            min={0}
            max={240}
            suffix="months"
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="LTV to CAC ratio"
                value={`${fmt(r.ratio, 1)} to 1`}
                note="3 to 1 is a common benchmark for a healthy business"
              />
              <Stats
                items={[
                  {
                    label: "Customer acquisition cost",
                    value: m.money(r.cac),
                    note: "Marketing spend ÷ new clients",
                  },
                  {
                    label: "Lifetime value (revenue)",
                    value: m.money(r.ltv),
                    note: "Price × lifetime",
                  },
                  {
                    label: "CAC payback",
                    value: months(r.paybackMonths),
                    note: "Months to earn the cost back",
                  },
                ]}
              />
              <Note>
                {verdict(r.ratio)} This uses revenue, not profit, and leaves out tax, refunds and
                delivery costs.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter marketing spend, at least one new client, a price and a lifetime.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function DiscoveryCallWidget() {
  const m = useMoney();
  const [calls, setCalls] = useState<Num>(20);
  const [close, setClose] = useState<Num>(30);
  const [value, setValue] = useState<Num>(1500);
  const compute = () =>
    ok(calls, close, value) && n(close) <= 100
      ? discoveryCalls(n(calls), n(close), n(value))
      : null;
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Discovery call calculator"
          submitLabel="Calculate call value"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <NumberInput
            label="Discovery calls per month"
            value={calls}
            onChange={setCalls}
            min={0}
            max={500}
          />
          <NumberInput
            label="Close rate"
            hint="Share of calls that become a paying client."
            value={close}
            onChange={setClose}
            min={0}
            max={100}
            suffix="%"
          />
          <Money
            label="Average client value"
            hint="Revenue a new client brings, such as the package fee."
            value={value}
            onChange={setValue}
            currency={m.currency}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Monthly new revenue"
                value={m.money(r.revenue)}
                note={`${n(calls)} calls at ${n(close)}% close = ${fmt(r.clients, 1)} new clients`}
              />
              <Stats
                items={[
                  {
                    label: "New clients / month",
                    value: fmt(r.clients, 1),
                    note: "Calls × close rate",
                  },
                  {
                    label: "Value of one call",
                    value: m.money(n(calls) > 0 ? r.revenue / n(calls) : 0),
                    note: "Revenue ÷ calls",
                  },
                  {
                    label: "+10 points of close rate",
                    value: `+${m.money(r.liftRevenue)}`,
                    note: "Same calls, higher close",
                  },
                ]}
              />
              <Note>
                Lifting your close rate from {n(close)}% to {r.liftedClose}% turns the same{" "}
                {n(calls)} calls into {fmt(r.liftClients, 1)} more clients, with nothing extra on
                your calendar.
              </Note>
            </>
          ) : (
            <ErrorText>Enter calls, a close rate between 0 and 100% and a client value.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function EmailListWidget() {
  const m = useMoney();
  const [subs, setSubs] = useState<Num>(500);
  const [open, setOpen] = useState<Num>(40);
  const [click, setClick] = useState<Num>(8);
  const [conv, setConv] = useState<Num>(5);
  const [price, setPrice] = useState<Num>(300);
  const compute = () =>
    ok(subs, open, click, conv, price) &&
    n(subs) >= 1 &&
    n(open) <= 100 &&
    n(click) <= 100 &&
    n(conv) <= 100
      ? emailListValue(n(subs), n(open), n(click), n(conv), n(price))
      : null;
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Email list value calculator"
          submitLabel="Calculate list value"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <NumberInput
            label="Subscribers on your list"
            value={subs}
            onChange={setSubs}
            min={1}
            max={10000000}
          />
          <NumberInput
            label="Open rate"
            hint="Percentage opening a typical email."
            value={open}
            onChange={setOpen}
            min={0}
            max={100}
            suffix="%"
          />
          <NumberInput
            label="Click rate (of openers)"
            hint="Of those who open, the percentage clicking your link."
            value={click}
            onChange={setClick}
            min={0}
            max={100}
            suffix="%"
          />
          <NumberInput
            label="Purchase conversion (of clickers)"
            hint="Of those who click, the percentage buying."
            value={conv}
            onChange={setConv}
            min={0}
            max={100}
            suffix="%"
          />
          <Money
            label="Offer price"
            hint="Price of the campaign offer, such as a package or first month."
            value={price}
            onChange={setPrice}
            currency={m.currency}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Revenue per campaign"
                value={m.money(r.revenue)}
                note={`${fmt(r.buyers, 1)} buyers × ${m.money(n(price))} offer`}
              />
              <Stats
                items={[
                  {
                    label: "Revenue per subscriber",
                    value: m.money(r.perSubscriber, 2),
                    note: "Per send",
                  },
                  {
                    label: "Value of 100 more subscribers",
                    value: m.money(r.per100),
                    note: "Extra revenue per campaign",
                  },
                  {
                    label: "Buyers per campaign",
                    value: fmt(r.buyers, 1),
                    note: "Openers → clickers → buyers",
                  },
                ]}
              />
              <Note>
                Per-campaign projections. Multiply by the campaigns you send in a year for the
                list's annual value.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter at least one subscriber, rates between 0 and 100% and a price.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function TrialConversionWidget() {
  const m = useMoney();
  const [trials, setTrials] = useState<Num>(40);
  const [conv, setConv] = useState<Num>(10);
  const [price, setPrice] = useState<Num>(300);
  const [churn, setChurn] = useState<Num>(5);
  const [spend, setSpend] = useState<Num>(1600);
  const compute = () => {
    if (!ok(trials, conv, price, churn, spend) || n(trials) < 1 || n(churn) > 100) return null;
    if (n(conv) > n(trials)) return "conv" as const;
    return trialConversion(n(trials), n(conv), n(price), n(churn), n(spend));
  };
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Free trial conversion calculator"
          submitLabel="Calculate my conversion"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <NumberInput
            label="Trials started per month"
            value={trials}
            onChange={setTrials}
            min={0}
            max={5000}
          />
          <NumberInput
            label="Trials that become paying clients"
            value={conv}
            onChange={setConv}
            min={0}
            max={5000}
          />
          <Money
            label="Price per client / month"
            value={price}
            onChange={setPrice}
            currency={m.currency}
          />
          <NumberInput
            label="Monthly churn"
            hint="Percentage of paying clients leaving each month."
            value={churn}
            onChange={setChurn}
            min={0}
            max={100}
            suffix="%"
          />
          <Money
            label="Ad spend per month"
            hint="Leave at 0 without paid ads."
            value={spend}
            onChange={setSpend}
            currency={m.currency}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r === "conv" ? (
            <ErrorText>More trials converted than started. Check the two trial numbers.</ErrorText>
          ) : r ? (
            <>
              <Headline
                label="Trial-to-paid conversion"
                value={`${fmt(r.rate, 1)}%`}
                note={`${n(conv)} paying clients from ${n(trials)} trials: ${m.money(r.mrr)} of new monthly revenue.`}
              />
              <Stats
                items={[
                  {
                    label: "New monthly revenue",
                    value: m.money(r.mrr),
                    note: "Converted × price",
                  },
                  {
                    label: "Payback on ad spend",
                    value: months(r.paybackMonths),
                    note: `${m.money(r.cac)} per paying client`,
                  },
                  {
                    label: "A 2-point lift is worth",
                    value: `${m.money(r.liftMrr)}/mo`,
                    note: "Same lead flow",
                  },
                  ...(r.cohortValue !== null
                    ? [
                        {
                          label: "Lifetime value of this month's converts",
                          value: m.money(r.cohortValue),
                          note: "New revenue ÷ churn",
                        },
                      ]
                    : []),
                ]}
              />
              <Note>
                Conversion multiplies every trial you pay for. A two-point lift adds clients from
                leads you already have, with no extra spend.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter at least one trial, conversions, a price, churn up to 100% and ad spend.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function ReferralValueWidget() {
  const m = useMoney();
  const [clients, setClients] = useState<Num>(20);
  const [rate, setRate] = useState<Num>(1.5);
  const [conv, setConv] = useState<Num>(40);
  const [ltv, setLtv] = useState<Num>(900);
  const [cac, setCac] = useState<Num>(120);
  const compute = () =>
    ok(clients, rate, conv, ltv, cac) && n(clients) >= 1 && n(conv) <= 100
      ? referralValue(n(clients), n(rate), n(conv), n(ltv), n(cac))
      : null;
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Referral value calculator"
          submitLabel="Calculate referral value"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <NumberInput
            label="Active clients"
            value={clients}
            onChange={setClients}
            min={1}
            max={100000}
          />
          <NumberInput
            label="Referrals per client per year"
            hint="Average referrals one client makes in a year."
            value={rate}
            onChange={setRate}
            min={0}
            max={100}
          />
          <NumberInput
            label="Referral conversion rate"
            hint="Percentage of referred people who sign up."
            value={conv}
            onChange={setConv}
            min={0}
            max={100}
            suffix="%"
          />
          <Money
            label="Average client lifetime value"
            hint="Total revenue from an average client."
            value={ltv}
            onChange={setLtv}
            currency={m.currency}
          />
          <Money
            label="Cost per client from paid ads"
            hint="Your paid-ads cost per client, used for comparison."
            value={cac}
            onChange={setCac}
            currency={m.currency}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Referral revenue per year"
                value={m.money(r.revenue)}
                note={`${fmt(r.newClients, 1)} new clients × ${m.money(n(ltv))} lifetime value`}
              />
              <Stats
                items={[
                  {
                    label: "New clients per year",
                    value: fmt(r.newClients, 1),
                    note: "From referrals alone",
                  },
                  {
                    label: "Paid ad spend avoided",
                    value: m.money(r.adSpendAvoided),
                    note: "Same clients bought with ads",
                  },
                  { label: "Referral clients per month", value: fmt(r.perMonth, 1) },
                ]}
              />
              <Note>
                Annual projections from your inputs. Raise the referral rate by half a point to see
                what a regular, structured referral ask is worth.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter at least one client, a conversion rate up to 100% and the two values.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- pricing */

export function PackagePricingWidget() {
  const m = useMoney();
  const [rate, setRate] = useState<Num>(60);
  const [core, setCore] = useState<Num>(0.4);
  const [xs, setXs] = useState({ checkin: true, meal: true, msg: true });
  const [hrs, setHrs] = useState<{ checkin: Num; meal: Num; msg: Num }>({
    checkin: 0.15,
    meal: 0.1,
    msg: 0.1,
  });
  const [d12, setD12] = useState<Num>(10);
  const [d24, setD24] = useState<Num>(15);
  const total =
    n(core) +
    (xs.checkin ? n(hrs.checkin) : 0) +
    (xs.meal ? n(hrs.meal) : 0) +
    (xs.msg ? n(hrs.msg) : 0);
  const compute = () =>
    ok(rate, core, d12, d24, hrs.checkin, hrs.meal, hrs.msg) &&
    n(rate) >= 1 &&
    total > 0 &&
    n(d12) < 100 &&
    n(d24) < 100
      ? { tiers: packagePricing(n(rate), total, n(d12), n(d24)), total }
      : null;
  const [r, setR] = useState(compute);
  const EXTRAS = [
    { key: "checkin", label: "Weekly check-in review" },
    { key: "meal", label: "Meal plan / nutrition" },
    { key: "msg", label: "Messaging and support" },
  ] as const;
  const t12 = r?.tiers[1];
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Coaching package pricing calculator"
          submitLabel="Price my packages"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <Money
            label="Target revenue per delivery hour"
            hint="Your target earnings per hour spent delivering coaching. The coaching rate calculator can help set it."
            value={rate}
            onChange={setRate}
            currency={m.currency}
            max={1000}
          />
          <NumberInput
            label="Core coaching time per week"
            hint="Calls and programme writing for one client; tick extras below to add their time."
            value={core}
            onChange={setCore}
            min={0}
            max={40}
            suffix="h/wk"
          />
          <fieldset className="flex flex-col gap-3">
            <legend className="text-body-sm font-medium">
              Included extras (time per client per week)
            </legend>
            {EXTRAS.map((x) => (
              <div key={x.key} className="grid grid-cols-[minmax(0,1fr)_8rem] items-end gap-3">
                <div className="flex min-h-11 items-center gap-2 text-body-sm">
                  <Checkbox
                    id={`pkg-${x.key}`}
                    aria-label={`Include ${x.label.toLowerCase()}`}
                    checked={xs[x.key]}
                    onCheckedChange={(c) => setXs({ ...xs, [x.key]: c === true })}
                    controlClassName="min-h-11 min-w-11"
                  />
                  <label htmlFor={`pkg-${x.key}`} className="cursor-pointer">
                    {x.label}
                  </label>
                </div>
                <NumberInput
                  label={`${x.label} hours`}
                  value={hrs[x.key]}
                  onChange={(v) => setHrs({ ...hrs, [x.key]: v })}
                  min={0}
                  max={40}
                  suffix="h"
                />
              </div>
            ))}
          </fieldset>
          <Note>
            Total delivery time: {fmt(total, 2)} hours a week per client. Clear a box to drop that
            extra.
          </Note>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="12-week discount"
              value={d12}
              onChange={setD12}
              min={0}
              max={99}
              suffix="%"
            />
            <NumberInput
              label="24-week discount"
              value={d24}
              onChange={setD24}
              min={0}
              max={99}
              suffix="%"
            />
          </div>
          <Note>
            The 4-week block is the pay-as-you-go option; commitment discounts of 5 to 15% are
            typical.
          </Note>
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r && t12 ? (
            <>
              <Headline
                label="12-week package price"
                value={m.money(t12.price)}
                note={`${fmt(r.total, 2)} delivery hours a week at ${m.money(n(rate))} an hour with a ${t12.discountPct}% commitment discount: about ${m.money(t12.monthly)} a month and ${m.money(t12.perHour)} per delivery hour.`}
              />
              <Table
                head={["Package", "Price", "Per month", "Client saves", "Per hour"]}
                rows={r.tiers.map((x) => [
                  x.weeks === 4
                    ? "4-week block (rolling)"
                    : `${x.weeks}-week (${x.discountPct}% off)`,
                  m.money(x.price),
                  m.money(x.monthly),
                  m.money(x.saves),
                  m.money(x.perHour),
                ])}
              />
              <Note>
                Your revenue per delivery hour eases from {m.money(r.tiers[0]?.perHour ?? 0)} on the
                4-week block to {m.money(r.tiers[2]?.perHour ?? 0)} at 24 weeks; that's what the
                commitment discount costs you.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter a rate of at least 1, some delivery time and discounts under 100%.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function PriceIncreaseWidget() {
  const m = useMoney();
  const [p0, setP0] = useState<Num>(150);
  const [clients, setClients] = useState<Num>(20);
  const [p1, setP1] = useState<Num>(180);
  const [cancel, setCancel] = useState<Num>(2);
  const compute = () => {
    if (!ok(p0, clients, p1, cancel) || n(clients) < 1 || n(p0) <= 0 || n(p1) <= 0) return null;
    if (n(cancel) > n(clients)) return "cancel" as const;
    return priceIncrease(n(p0), n(clients), n(p1), n(cancel));
  };
  const [r, setR] = useState(compute);
  const diff = (x: number, now: number) =>
    `${x - now >= 0 ? "+" : "−"}${m.money(Math.abs(x - now))} vs now`;
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Price increase calculator"
          submitLabel="Check the increase"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <Money
            label="Current price per client / month"
            value={p0}
            onChange={setP0}
            currency={m.currency}
          />
          <NumberInput
            label="Active clients"
            hint="Clients paying the current rate."
            value={clients}
            onChange={setClients}
            min={1}
            max={100000}
          />
          <Money
            label="New price per client / month"
            value={p1}
            onChange={setP1}
            currency={m.currency}
          />
          <NumberInput
            label="Expected cancellations"
            hint="Your honest guess at how many clients leave over the increase."
            value={cancel}
            onChange={setCancel}
            min={0}
            max={100000}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r === "cancel" ? (
            <ErrorText>Expected cancellations can't be more than your active clients.</ErrorText>
          ) : r ? (
            <>
              <Headline
                label="Clients you can lose and still break even"
                value={`${r.canLose} of ${n(clients)}`}
                note={`${fmt(r.canLosePct, 1)}% of your clients. At ${m.money(n(p1))} you still match today's ${m.money(r.now)} a month.`}
              />
              <Stats
                items={[
                  {
                    label: "Current monthly revenue",
                    value: m.money(r.now),
                    note: "Current price × clients",
                  },
                  {
                    label: "If nobody leaves",
                    value: m.money(r.ifNobodyLeaves),
                    note: diff(r.ifNobodyLeaves, r.now),
                  },
                  {
                    label: "At your expected cancellations",
                    value: m.money(r.atExpected),
                    note: diff(r.atExpected, r.now),
                  },
                  {
                    label: "Revenue-neutral price",
                    value: Number.isFinite(r.neutralPrice) ? m.money(r.neutralPrice, 2) : "n/a",
                    note: "Holds you level after those cancellations",
                  },
                ]}
              />
              {r.ahead ? (
                <Note>
                  Your estimate of {n(cancel)} cancellations is within the {r.canLose} you can
                  absorb, so the rise should leave you better off.
                </Note>
              ) : (
                <Warning>
                  On your own estimate you'd lose more clients than the increase can absorb. Try a
                  smaller rise, a later start date for existing clients, or more value in the
                  package.
                </Warning>
              )}
            </>
          ) : (
            <ErrorText>
              Enter both prices above zero, at least one client and expected cancellations.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function ProfitWidget() {
  const m = useMoney();
  const [clients, setClients] = useState<Num>(20);
  const [price, setPrice] = useState<Num>(300);
  const [soft, setSoft] = useState<Num>(150);
  const [ads, setAds] = useState<Num>(800);
  const [contr, setContr] = useState<Num>(400);
  const [other, setOther] = useState<Num>(150);
  const compute = () =>
    ok(clients, price, soft, ads, contr, other) && n(clients) >= 1
      ? profit(n(clients), n(price), [n(soft), n(ads), n(contr), n(other)])
      : null;
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Coaching profit calculator"
          submitLabel="Calculate my profit"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <NumberInput
            label="Number of clients"
            value={clients}
            onChange={setClients}
            min={1}
            max={1000}
          />
          <Money
            label="Price per client / month"
            value={price}
            onChange={setPrice}
            currency={m.currency}
          />
          <p className="text-body-sm font-medium">Monthly costs</p>
          <Money
            label="Software and subscriptions"
            value={soft}
            onChange={setSoft}
            currency={m.currency}
          />
          <Money label="Ads and marketing" value={ads} onChange={setAds} currency={m.currency} />
          <Money
            label="Contractors or VA"
            value={contr}
            onChange={setContr}
            currency={m.currency}
          />
          <Money label="Other costs" value={other} onChange={setOther} currency={m.currency} />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Monthly profit"
                value={m.money(r.profit)}
                note={`${m.money(r.revenue)} revenue minus ${m.money(r.cost)} costs`}
              />
              <Stats
                items={[
                  { label: "Monthly revenue", value: m.money(r.revenue), note: "Clients × price" },
                  { label: "Total monthly costs", value: m.money(r.cost) },
                  { label: "Profit margin", value: `${fmt(r.margin)}%`, note: "Profit ÷ revenue" },
                  { label: "Annual profit", value: m.money(r.annual), note: "Monthly profit × 12" },
                ]}
              />
              {r.profit < 0 ? (
                <Warning>
                  Costs are higher than revenue. Look at price, client count and the largest cost
                  line first.
                </Warning>
              ) : (
                <Note>
                  Profit here is before tax. Set income tax aside separately; these costs affect
                  what you owe but aren't your tax bill.
                </Note>
              )}
            </>
          ) : (
            <ErrorText>Enter at least one client, a price and your costs (0 is fine).</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function GroupVsOneWidget() {
  const m = useMoney();
  const [p1, setP1] = useState<Num>(400);
  const [n1, setN1] = useState<Num>(15);
  const [h1, setH1] = useState<Num>(1);
  const [pg, setPg] = useState<Num>(150);
  const [ng, setNg] = useState<Num>(30);
  const [hg, setHg] = useState<Num>(4);
  const compute = () =>
    ok(p1, n1, h1, pg, ng, hg) && n(n1) * n(h1) > 0 && n(hg) > 0
      ? groupVsOneToOne(n(p1), n(n1), n(h1), n(pg), n(ng), n(hg))
      : null;
  const [r, setR] = useState(compute);
  const groupWins = r ? r.group.hourly > r.one.hourly : false;
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Group vs 1:1 coaching calculator"
          submitLabel="Compare the two models"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <p className="text-body-sm font-medium">1:1 coaching</p>
          <Money
            label="Price per client / month"
            value={p1}
            onChange={setP1}
            currency={m.currency}
          />
          <NumberInput
            label="Number of 1:1 clients"
            value={n1}
            onChange={setN1}
            min={0}
            max={1000}
          />
          <NumberInput
            label="Hours per client / week"
            value={h1}
            onChange={setH1}
            min={0}
            max={40}
            suffix="h"
          />
          <p className="text-body-sm font-medium">Group coaching</p>
          <Money
            label="Price per member / month"
            value={pg}
            onChange={setPg}
            currency={m.currency}
          />
          <NumberInput
            label="Members in the group"
            value={ng}
            onChange={setNg}
            min={0}
            max={10000}
          />
          <NumberInput
            label="Total coaching hours / week"
            value={hg}
            onChange={setHg}
            min={0}
            max={80}
            suffix="h"
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label={`${groupWins ? "Group" : "1:1"} coaching earns more per hour`}
                value={`${m.money(groupWins ? r.group.hourly : r.one.hourly)}/hr`}
                note={`Compared with ${m.money(groupWins ? r.one.hourly : r.group.hourly)}/hr for ${groupWins ? "one-to-one" : "the group"}`}
              />
              <Table
                head={["", "1:1", "Group"]}
                rows={[
                  [
                    "Effective hourly rate",
                    `${m.money(r.one.hourly)}/hr`,
                    `${m.money(r.group.hourly)}/hr`,
                  ],
                  ["Monthly revenue", m.money(r.one.revenue), m.money(r.group.revenue)],
                  ["Weekly hours", `${fmt(r.one.hours, 1)} h`, `${fmt(r.group.hours, 1)} h`],
                ]}
              />
              <Note>
                Effective hourly rate = monthly revenue ÷ (weekly hours × 4.33).{" "}
                {groupWins
                  ? "The group earns more per hour because the same hours serve more people at once."
                  : "1:1 earns more per hour at these numbers; the group needs more members or a higher price to catch up."}
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter prices, client numbers and some coaching hours for both models.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function NoShowCostWidget() {
  const m = useMoney();
  const [ns, setNs] = useState<Num>(2);
  const [lc, setLc] = useState<Num>(1);
  const [value, setValue] = useState<Num>(40);
  const [booked, setBooked] = useState<Num>(30);
  const compute = () =>
    ok(ns, lc, value, booked) && n(booked) >= 1 && n(ns) + n(lc) <= n(booked)
      ? noShowCost(n(ns), n(lc), n(value), n(booked))
      : null;
  const [r, setR] = useState(compute);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="No-show cost calculator"
          submitLabel="Calculate what it costs"
          onSubmit={() => setR(compute())}
        >
          {m.pills}
          <NumberInput
            label="No-shows per week"
            hint="Sessions missed without notice."
            value={ns}
            onChange={setNs}
            min={0}
            max={200}
          />
          <NumberInput
            label="Late cancellations per week"
            hint="Only the ones too late to refill."
            value={lc}
            onChange={setLc}
            min={0}
            max={200}
          />
          <Money
            label="Average session value"
            hint="For retainer clients: monthly fee divided by monthly sessions."
            value={value}
            onChange={setValue}
            currency={m.currency}
          />
          <NumberInput
            label="Booked sessions per week"
            hint="Total sessions booked in a typical week."
            value={booked}
            onChange={setBooked}
            min={1}
            max={500}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Revenue lost per year"
                value={m.money(r.year)}
                note={`${m.money(r.week)} a week from ${r.lost} missed sessions, ${fmt(r.capacityPct)}% of the ${n(booked)} you book.`}
              />
              <Stats
                items={[
                  { label: "Lost per week", value: m.money(r.week) },
                  { label: "Lost per month", value: m.money(r.month), note: "Weekly × 4.33" },
                  { label: "Capacity lost", value: `${fmt(r.capacityPct)}%` },
                ]}
              />
              <Note>
                Cutting missed sessions by half would recover about {m.money(r.halfBackMonth)} a
                month, or {m.money(r.halfBackYear)} a year, without a single extra booking.
              </Note>
            </>
          ) : (
            <ErrorText>
              Enter booked sessions (at least 1), and lost sessions that don't exceed them.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}
