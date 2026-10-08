"use client";

import { Tabs, TabsList, TabsTrigger } from "@traiv/ui/components/tabs";
import { Check } from "lucide-react";
import { useState } from "react";
import { NotifyMe } from "@/components/notify-me";
import { rupees, TIERS } from "@/content/site";

type Cycle = "monthly" | "annual";

/**
 * The three tiers, with the billing switch.
 *
 * The switch defaults to monthly even though annual is worth far more to us, because a
 * page that opens on the annual price and then jumps when you read the small print is the
 * reason people distrust pricing pages. The saving is stated on the control instead.
 *
 * Free has no annual price, so it shows "Free" on both settings rather than disappearing
 * or showing ₹0 a year, which reads as a bug.
 */
export function PricingTable() {
  const [cycle, setCycle] = useState<Cycle>("monthly");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-start gap-3">
        {/* A segmented control, which is what Tabs is. The earlier version was two
            buttons wearing `role="radio"` — same picture, no arrow-key navigation. */}
        <Tabs value={cycle} onValueChange={(v) => setCycle(v as Cycle)}>
          <TabsList className="h-auto rounded-full bg-surface p-1 ring-1 ring-line">
            <TabsTrigger
              value="monthly"
              className="cursor-pointer rounded-full px-4 py-2 text-body-sm data-[state=active]:bg-brand data-[state=active]:text-brand-fg"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              value="annual"
              className="cursor-pointer rounded-full px-4 py-2 text-body-sm data-[state=active]:bg-brand data-[state=active]:text-brand-fg"
            >
              Yearly
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-caption text-fg-subtle">
          {cycle === "annual"
            ? "Two months free. Cancel any time and we refund the unused months."
            : "A year up front is two months free."}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {TIERS.map((tier) => {
          const annual = cycle === "annual" && tier.annual !== null;
          return (
            <article
              key={tier.name}
              className={`flex flex-col gap-5 rounded-surface border bg-surface p-6 ${
                tier.hero ? "border-fg shadow-sm" : "border-line"
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-body font-semibold">{tier.name}</h3>
                  {tier.hero ? (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-caption font-medium text-brand-fg">
                      Most coaches
                    </span>
                  ) : null}
                </div>
                <p className="text-caption text-fg-muted">{tier.limit}</p>
              </div>

              <div className="flex min-h-[3.5rem] flex-col gap-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-[2rem] font-semibold tabular-nums leading-none tracking-[-0.03em]">
                    {tier.monthly === 0
                      ? "Free"
                      : annual
                        ? rupees(tier.annual as number)
                        : rupees(tier.monthly)}
                  </span>
                  {tier.monthly > 0 ? (
                    <span className="text-caption text-fg-subtle">
                      {annual ? "/ year" : "/ month"}
                    </span>
                  ) : null}
                </div>
                {tier.monthly > 0 && annual ? (
                  <p className="text-caption text-fg-subtle tabular-nums">
                    {rupees(Math.round((tier.annual as number) / 12))} a month, billed yearly
                  </p>
                ) : null}
                {tier.monthly > 0 && !annual ? (
                  <p className="text-caption text-fg-subtle">GST included</p>
                ) : null}
              </div>

              <p className="text-body-sm leading-relaxed text-fg-muted">{tier.summary}</p>

              <ul className="flex flex-1 flex-col gap-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2 text-body-sm text-fg-muted">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-fg-subtle" />
                    {f}
                  </li>
                ))}
              </ul>

              <NotifyMe
                label={tier.cta}
                source={`pricing-${tier.name.toLowerCase()}`}
                variant={tier.hero ? "primary" : "outline"}
                showArrow={false}
                className="h-11 w-full px-4"
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}
