"use client";

import { useState } from "react";
import { Field, Slider } from "@/components/tool-controls";
import { coachwayMonthly, EUR_TO_INR } from "@/content/comparison";
import { rupees } from "@/content/site";

/**
 * What a coaching business actually clears, once the platform has taken its share.
 *
 * The honest version of this tool. Most "income calculators" multiply two numbers and show
 * a big one; this one subtracts what the software costs, because the software cost is the
 * only part of the sum we are in a position to change — and on per-client pricing it is
 * the part that quietly eats a fifth of a busy coach's revenue.
 *
 * Only Coachway is drawn as the comparison, for the reason set out in `comparison.ts`:
 * theirs is the per-client arithmetic that is actually published. TrueCoach's 5% is shown
 * separately because it is a percentage of revenue rather than a per-head fee.
 */
export function IncomeCalculator() {
  const [clients, setClients] = useState(25);
  const [fee, setFee] = useState(4000);

  const revenue = clients * fee;
  const traiv = clients <= 1 ? 0 : 999;
  const rival = Math.round(coachwayMonthly(clients) * EUR_TO_INR);
  const truecoachFee = Math.round(revenue * 0.05);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14">
      <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
        <Field label="Clients you coach">
          {(id) => (
            <div className="flex flex-col gap-3 pt-1">
              <p className="font-display text-[2rem] font-semibold tabular-nums leading-none tracking-[-0.03em]">
                {clients}
              </p>
              <Slider id={id} value={clients} onChange={setClients} min={1} max={150} />
            </div>
          )}
        </Field>

        <Field label="What each one pays you a month">
          {(id) => (
            <div className="flex flex-col gap-3 pt-1">
              <p className="font-display text-[2rem] font-semibold tabular-nums leading-none tracking-[-0.03em]">
                {rupees(fee)}
              </p>
              <Slider id={id} value={fee} onChange={setFee} min={500} max={25000} step={500} />
            </div>
          )}
        </Field>
      </form>

      <div className="flex flex-col gap-5">
        <div className="rounded-panel border border-line bg-surface p-6 sm:p-8">
          <p className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
            Your revenue
          </p>
          <p className="mt-2 font-display text-[clamp(2.25rem,6vw,3.25rem)] font-semibold tabular-nums leading-none tracking-[-0.04em]">
            {rupees(revenue)}
            <span className="ml-2 align-middle text-[1rem] font-medium text-fg-subtle">
              a month
            </span>
          </p>
          <p className="mt-2 text-body-sm text-fg-muted tabular-nums">
            {rupees(revenue * 12)} a year, before the software takes its cut.
          </p>
        </div>

        <div className="overflow-x-auto rounded-surface border border-line">
          <table className="w-full min-w-[32rem] border-collapse text-left">
            <caption className="sr-only">
              What the platform costs at {clients} clients, and what you keep
            </caption>
            <thead>
              <tr className="border-b border-line bg-sunken">
                <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                  Platform
                </th>
                <th className="px-5 py-3.5 text-right text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                  Costs you
                </th>
                <th className="px-5 py-3.5 text-right text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                  You keep
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line bg-success-subtle/40">
                <td className="px-5 py-4 text-body-sm font-semibold">Traiv</td>
                <td className="px-5 py-4 text-right text-body-sm tabular-nums">
                  {traiv === 0 ? "Free" : rupees(traiv)}
                </td>
                <td className="px-5 py-4 text-right text-body-sm font-semibold tabular-nums">
                  {rupees(revenue - traiv)}
                </td>
              </tr>
              <tr className="border-b border-line">
                <td className="px-5 py-4 text-body-sm">
                  Coachway
                  <span className="mt-0.5 block text-caption text-fg-subtle">
                    €69 plus €9 a client
                  </span>
                </td>
                <td className="px-5 py-4 text-right text-body-sm tabular-nums text-fg-muted">
                  {rupees(rival)}
                </td>
                <td className="px-5 py-4 text-right text-body-sm tabular-nums text-fg-muted">
                  {rupees(revenue - rival)}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-4 text-body-sm">
                  TrueCoach
                  <span className="mt-0.5 block text-caption text-fg-subtle">
                    5% of your revenue, plus its subscription
                  </span>
                </td>
                <td className="px-5 py-4 text-right text-body-sm tabular-nums text-fg-muted">
                  {rupees(truecoachFee)}+
                </td>
                <td className="px-5 py-4 text-right text-body-sm tabular-nums text-fg-muted">
                  {rupees(revenue - truecoachFee)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-caption leading-relaxed text-fg-subtle">
          The euro figure is converted at ₹{EUR_TO_INR} and is indicative — your card rate will
          differ. Coachway's arithmetic was read off their pricing page on 2026-10-08. The TrueCoach
          row is the revenue share only; their subscription is on top of it, and is not shown
          because we have not re-read their current tiers.
        </p>
      </div>
    </div>
  );
}
