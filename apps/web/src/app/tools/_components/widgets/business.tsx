"use client";

import { coachingIncome, coachingRate, type IncomeModel } from "@traiv/calculators/business";
import { CURRENCIES, CURRENCY_LABEL, type Currency, formatMoney } from "@traiv/calculators/money";
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
} from "../kit";

/** Every money tool gets this (ADR 0036): EUR default, plus USD, GBP and INR. Format only. */
function CurrencyPills({ value, onChange }: { value: Currency; onChange: (c: Currency) => void }) {
  return (
    <Pills
      label="Currency"
      value={value}
      onChange={onChange}
      options={CURRENCIES.map((c) => ({ value: c, label: CURRENCY_LABEL[c] }))}
    />
  );
}

const v = (x: Num) => (x === "" ? Number.NaN : x);
const finite = (...xs: number[]) => xs.every((x) => Number.isFinite(x) && x >= 0);

export function IncomeWidget() {
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [model, setModel] = useState<IncomeModel>("in-person");
  const [rate, setRate] = useState<Num>(50);
  const [sessions, setSessions] = useState<Num>(25);
  const [split, setSplit] = useState<Num>(20);
  const [price, setPrice] = useState<Num>(150);
  const [clients, setClients] = useState<Num>(30);
  const [hours, setHours] = useState<Num>(0.75);
  const [weeks, setWeeks] = useState<Num>(48);
  const [costs, setCosts] = useState<Num>(300);

  const compute = () => {
    const w = v(weeks);
    const c = v(costs);
    if (!finite(w, c) || w < 1 || w > 52) return null;
    if (model === "in-person") {
      const [r, s, g] = [v(rate), v(sessions), split === "" ? 0 : v(split)];
      if (!finite(r, s, g) || s > 80 || g > 100) return null;
      return coachingIncome({
        model,
        sessionRate: r,
        sessionsPerWeek: s,
        gymSplitPct: g,
        weeksPerYear: w,
        monthlyCosts: c,
      });
    }
    const [p, n, h] = [v(price), v(clients), v(hours)];
    if (!finite(p, n, h) || n > 500 || h <= 0 || h > 40) return null;
    return coachingIncome({
      model,
      pricePerClient: p,
      clients: n,
      hoursPerClient: h,
      weeksPerYear: w,
      monthlyCosts: c,
    });
  };
  const [r, setR] = useState(compute);
  const money = (x: number) => formatMoney(x, currency);

  return (
    <ToolLayout
      form={
        <ToolForm
          label="Personal trainer income calculator"
          submitLabel="Calculate my income"
          onSubmit={() => setR(compute())}
        >
          <Pills
            label="How you coach"
            value={model}
            onChange={setModel}
            stretch
            options={[
              { value: "in-person", label: "In-person sessions" },
              { value: "online", label: "Online coaching" },
            ]}
          />
          <CurrencyPills value={currency} onChange={setCurrency} />
          {model === "in-person" ? (
            <>
              <NumberInput
                label="Session rate"
                value={rate}
                onChange={setRate}
                min={0}
                max={100000}
                suffix={currency}
              />
              <NumberInput
                label="Sessions per week"
                value={sessions}
                onChange={setSessions}
                min={0}
                max={80}
              />
              <NumberInput
                label="Gym split (optional)"
                hint="The share the gym keeps, if any."
                value={split}
                onChange={setSplit}
                min={0}
                max={100}
                suffix="%"
              />
            </>
          ) : (
            <>
              <NumberInput
                label="Monthly price per client"
                value={price}
                onChange={setPrice}
                min={0}
                max={100000}
                suffix={currency}
              />
              <NumberInput
                label="Number of clients"
                value={clients}
                onChange={setClients}
                min={0}
                max={500}
              />
              <NumberInput
                label="Hours per client per week"
                value={hours}
                onChange={setHours}
                min={0.1}
                max={40}
                suffix="h"
              />
            </>
          )}
          <NumberInput
            label="Working weeks per year"
            value={weeks}
            onChange={setWeeks}
            min={1}
            max={52}
          />
          <NumberInput
            label="Monthly business costs"
            value={costs}
            onChange={setCosts}
            min={0}
            max={100000}
            suffix={currency}
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {r ? (
            <>
              <Headline
                label="Monthly take-home, before tax"
                value={money(r.monthlyTake)}
                note={`${money(r.annualTake)} a year · ${fmt(r.hoursPerWeek, 1)} coaching hours a week`}
              />
              <Stats
                items={[
                  { label: "Monthly revenue", value: money(r.monthlyGross) },
                  { label: "Annual revenue", value: money(r.annualGross) },
                  { label: "Annual take-home", value: money(r.annualTake) },
                  {
                    label: "Effective hourly",
                    value: money(r.hourly),
                    note: "Take-home per coaching hour",
                  },
                ]}
              />
              <Note>
                Take-home here is revenue minus any gym split and your business costs. It is before
                income tax and does not count unpaid admin hours, which lower the real hourly
                figure.
              </Note>
            </>
          ) : (
            <ErrorText>
              Fill in every field with a number in range: weeks between 1 and 52, gym split up to
              100%.
            </ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

export function RateWidget() {
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [model, setModel] = useState<"online" | "sessions">("online");
  const [income, setIncome] = useState<Num>(6000);
  const [costs, setCosts] = useState<Num>(800);
  const [hours, setHours] = useState<Num>(0.75);
  const [avail, setAvail] = useState<Num>(25);
  const [churn, setChurn] = useState<Num>(6);

  const switchModel = (m: "online" | "sessions") => {
    if (m === model) return;
    // 1:1 clients usually take two to three hours a week; async online clients under one.
    setHours(m === "sessions" ? 2.5 : 0.75);
    setModel(m);
  };

  const compute = () => {
    const [i, c, h, a, ch] = [v(income), v(costs), v(hours), v(avail), v(churn)];
    if (!finite(i, c, h, a, ch) || h < 0.1 || a < 1 || a > 80 || ch > 90) return "input" as const;
    return (
      coachingRate({
        targetMonthlyIncome: i,
        monthlyCosts: c,
        hoursPerClient: h,
        hoursAvailable: a,
        churnPct: ch,
      }) ?? ("capacity" as const)
    );
  };
  const [r, setR] = useState(compute);
  const money = (x: number) => formatMoney(x, currency);

  return (
    <ToolLayout
      form={
        <ToolForm
          label="Coaching rate calculator"
          submitLabel="Calculate my rate"
          onSubmit={() => setR(compute())}
        >
          <CurrencyPills value={currency} onChange={setCurrency} />
          <NumberInput
            label="Target monthly income (your pay)"
            value={income}
            onChange={setIncome}
            min={0}
            max={1000000}
            suffix={currency}
          />
          <NumberInput
            label="Business costs per month"
            value={costs}
            onChange={setCosts}
            min={0}
            max={1000000}
            suffix={currency}
          />
          <Pills
            label="Coaching model"
            value={model}
            onChange={switchModel}
            stretch
            options={[
              { value: "online", label: "Online async" },
              { value: "sessions", label: "1:1 sessions" },
            ]}
          />
          <NumberInput
            label="Hours per client per week"
            value={hours}
            onChange={setHours}
            min={0.1}
            max={40}
            suffix="h"
          />
          <NumberInput
            label="Hours available per week for coaching"
            value={avail}
            onChange={setAvail}
            min={1}
            max={80}
            suffix="h"
          />
          <NumberInput
            label="Expected monthly churn"
            value={churn}
            onChange={setChurn}
            min={0}
            max={90}
            suffix="%"
          />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {typeof r === "string" ? (
            <ErrorText>
              {r === "capacity"
                ? "Those hours do not fit a single client. Add hours or reduce the time per client."
                : "Fill in every field: hours available between 1 and 80, churn up to 90%."}
            </ErrorText>
          ) : (
            <>
              <Headline
                label="Charge at least, per client per month"
                value={money(r.price)}
                note={`To pay yourself ${money(v(income))} and cover ${money(v(costs))} of costs`}
              />
              <Stats
                items={[
                  {
                    label: "Client capacity",
                    value: fmt(r.capacity),
                    note: `${fmt(r.billable, 1)} paying on average after churn`,
                  },
                  { label: "Effective hourly", value: money(r.hourly) },
                  { label: "Clients to cover costs", value: fmt(r.breakevenClients) },
                  { label: "Lost to churn each month", value: money(r.monthlyChurnLoss) },
                ]}
              />
              <Note>
                If you halved churn, the same income would need {money(r.priceAtHalfChurn)} a month
                per client. Keeping clients longer is the cheapest raise there is.
              </Note>
            </>
          )}
        </ResultPanel>
      }
    />
  );
}
