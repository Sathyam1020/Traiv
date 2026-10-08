"use client";

import { useState } from "react";
import { Field, Slider } from "@/components/tool-controls";
import { rupees } from "@/content/site";

/**
 * What to charge, worked backwards from the life you want rather than from what the coach
 * down the road charges.
 *
 * Three inputs, because the honest version of this sum is three inputs: what you need to
 * earn, how many hours you will give it, and how long one client actually takes. Anything
 * more is a spreadsheet pretending to be advice.
 *
 * The hours-per-client default is 2.5 a month — roughly a check-in, a plan revision and
 * the messages in between. A coach who sees their own number is higher should raise it,
 * which is the point of showing it rather than burying it in the arithmetic.
 */
export function RateCalculator() {
  const [income, setIncome] = useState(100000);
  const [hoursPerWeek, setHoursPerWeek] = useState(25);
  const [hoursPerClient, setHoursPerClient] = useState(2.5);

  const monthlyHours = hoursPerWeek * 4.33;
  const capacity = Math.floor(monthlyHours / hoursPerClient);
  const rate = capacity > 0 ? Math.ceil(income / capacity / 100) * 100 : 0;
  const perHour = Math.round(income / monthlyHours);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14">
      <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
        <Field label="What you want to earn a month">
          {(id) => (
            <div className="flex flex-col gap-3 pt-1">
              <p className="font-display text-[2rem] font-semibold tabular-nums leading-none tracking-[-0.03em]">
                {rupees(income)}
              </p>
              <Slider
                id={id}
                value={income}
                onChange={setIncome}
                min={20000}
                max={500000}
                step={5000}
              />
            </div>
          )}
        </Field>

        <Field
          label="Hours a week you will give coaching"
          hint="Coaching hours. Not admin, not travel."
        >
          {(id) => (
            <div className="flex flex-col gap-3 pt-1">
              <p className="font-display text-[2rem] font-semibold tabular-nums leading-none tracking-[-0.03em]">
                {hoursPerWeek}
              </p>
              <Slider id={id} value={hoursPerWeek} onChange={setHoursPerWeek} min={5} max={60} />
            </div>
          )}
        </Field>

        <Field
          label="Hours one client takes a month"
          hint="A check-in, a plan revision, and the messages in between."
        >
          {(id) => (
            <div className="flex flex-col gap-3 pt-1">
              <p className="font-display text-[2rem] font-semibold tabular-nums leading-none tracking-[-0.03em]">
                {hoursPerClient}
              </p>
              <Slider
                id={id}
                value={hoursPerClient}
                onChange={setHoursPerClient}
                min={0.5}
                max={12}
                step={0.5}
              />
            </div>
          )}
        </Field>
      </form>

      <div className="flex flex-col gap-5">
        <div className="rounded-panel border border-line bg-surface p-6 sm:p-8">
          <p className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
            Charge at least
          </p>
          <p className="mt-2 font-display text-[clamp(2.25rem,6vw,3.25rem)] font-semibold tabular-nums leading-none tracking-[-0.04em]">
            {rupees(rate)}
            <span className="ml-2 align-middle text-[1rem] font-medium text-fg-subtle">
              per client, per month
            </span>
          </p>
          <p className="mt-3 max-w-[32rem] text-body-sm leading-relaxed text-fg-muted">
            At {hoursPerWeek} hours a week and {hoursPerClient} hours a client, you have room for{" "}
            <strong className="font-semibold text-fg">{capacity} clients</strong> — and {capacity}{" "}
            clients at {rupees(rate)} is {rupees(rate * capacity)} a month.
          </p>
        </div>

        <dl className="grid gap-px overflow-hidden rounded-surface border border-line bg-line sm:grid-cols-3">
          {[
            { k: "Your capacity", v: `${capacity} clients`, note: "At these hours" },
            { k: "Effective hourly", v: rupees(perHour), note: "Across coaching hours" },
            {
              k: "Software",
              v: capacity <= 1 ? "Free" : rupees(999),
              note: capacity <= 1 ? "One client" : "However many you coach",
            },
          ].map((s) => (
            <div key={s.k} className="flex flex-col gap-1 bg-surface p-5">
              <dt className="text-caption text-fg-subtle">{s.k}</dt>
              <dd className="font-display text-[1.375rem] font-semibold tabular-nums leading-none tracking-[-0.02em]">
                {s.v}
              </dd>
              <p className="text-caption text-fg-subtle">{s.note}</p>
            </div>
          ))}
        </dl>

        <p className="text-caption leading-relaxed text-fg-subtle">
          A floor, not a price. It is what you have to charge for the maths to work at full capacity
          — and nobody is at full capacity every month, so most coaches should sit above it. It also
          assumes every client stays; at a 10% monthly churn, a tenth of this number is work you are
          doing to stand still.
        </p>
      </div>
    </div>
  );
}
