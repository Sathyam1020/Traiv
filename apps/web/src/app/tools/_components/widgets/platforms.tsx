"use client";

import { type Currency, formatMoney } from "@traiv/calculators/money";
import { Checkbox } from "@traiv/ui/components/checkbox";
import { useEffect, useState } from "react";
import { Field, NumberField, Slider } from "@/components/tool-controls";
import {
  BRANDING_LABEL,
  COMPARABLE,
  inrDefault,
  PLATFORMS,
  type PriceCurrency,
  STACK_TOOLS,
  USD_INR,
} from "@/content/tools/platforms";
import {
  ErrorText,
  Headline,
  Note,
  type Num,
  NumberInput,
  Pills,
  ResultPanel,
  Select,
  Stats,
  ToolForm,
  ToolLayout,
} from "../kit";
import { useTool } from "../tool-context";
import { trackCalculateSettled } from "../track";
import { CurrencyPills } from "./business";

function useSettled(key: string) {
  const tool = useTool();
  useEffect(() => {
    if (key) trackCalculateSettled(tool.slug, tool.group, tool.kind);
  }, [key, tool.slug, tool.group, tool.kind]);
}

const COMPARE_PAGES = new Set(["trainerize", "fitbudd", "everfit", "truecoach", "coachway"]);
const comparePath = (name: string) => {
  const slug = name.toLowerCase().replace(/[^a-z]/g, "");
  return COMPARE_PAGES.has(slug) ? `/compare/${slug}` : null;
};
const ORDER: Record<PriceCurrency, number> = { EUR: 0, USD: 1, INR: 2 };
const money = (x: number, c: PriceCurrency) => formatMoney(x, c, x % 1 ? 2 : 0);

/* ------------------------------------------------------ platform cost */

export function PlatformCostWidget() {
  const [clients, setClients] = useState<Num>(25);
  const [cur, setCur] = useState<"all" | PriceCurrency>("all");
  const [brandedOnly, setBrandedOnly] = useState(false);
  const n = clients === "" ? 0 : Math.round(clients);
  const valid = n >= 1 && n <= 2000;
  const rows = PLATFORMS.filter(
    (p) =>
      (cur === "all" || p.currency === cur) &&
      (!brandedOnly || (p.branding !== "none" && p.branding !== "unknown")),
  )
    .map((p) => ({ p, price: valid ? p.priceAt(n) : null }))
    .sort(
      (a, b) =>
        ORDER[a.p.currency] - ORDER[b.p.currency] ||
        (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY),
    );
  useSettled(valid ? `${n}-${cur}-${brandedOnly}` : "");
  return (
    <ToolLayout
      form={
        <ToolForm label="Coaching platform cost calculator">
          <Field label={`Active clients: ${valid ? n : "–"}`}>
            {(id) => (
              <Slider
                id={id}
                value={Math.min(200, Math.max(1, n || 1))}
                onChange={setClients}
                min={1}
                max={200}
              />
            )}
          </Field>
          <NumberInput
            label="Or type it"
            value={clients}
            onChange={setClients}
            min={1}
            max={2000}
          />
          <Select
            label="Currency"
            value={cur}
            onChange={setCur}
            options={[
              { value: "all", label: "All currencies" },
              { value: "EUR", label: "EUR" },
              { value: "USD", label: "USD" },
              { value: "INR", label: "INR" },
            ]}
          />
          <div className="flex min-h-11 items-center gap-2 text-body-sm">
            <Checkbox
              id="brand-only"
              checked={brandedOnly}
              onCheckedChange={(v) => setBrandedOnly(v === true)}
              controlClassName="min-h-11 min-w-11"
              aria-label="Hide platforms without client-app branding"
            />
            <label htmlFor="brand-only" className="cursor-pointer">
              Hide platforms without client-app branding
            </label>
          </div>
          <Note>
            Figures are the base monthly plan for your client count. Extras such as add-ons, tax and
            card fees aren't included, and nothing is converted. Platforms are listed by pricing
            currency, cheapest first.
          </Note>
        </ToolForm>
      }
      result={
        <ResultPanel label="Platform prices">
          {valid ? (
            <>
              <p className="text-caption text-fg-muted">
                Scroll the table sideways for plan details and sources.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[40rem] text-body-sm">
                  <thead>
                    <tr className="text-left text-caption text-fg-muted">
                      {[
                        "Platform",
                        "Base per month",
                        "What that covers",
                        "Client-app branding",
                        "Source",
                      ].map((h) => (
                        <th key={h} scope="col" className="py-2 pr-3 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ p, price }) => {
                      const cmp = comparePath(p.name);
                      return (
                        <tr key={p.name} className="border-t border-line align-top">
                          <td className="py-2 pr-3 font-medium">{p.name}</td>
                          <td className="py-2 pr-3 tabular-nums">
                            {price === null
                              ? "Check vendor price"
                              : price === 0
                                ? "Free"
                                : money(price, p.currency)}
                          </td>
                          <td className="py-2 pr-3">{p.covers(n)}</td>
                          <td className="py-2 pr-3">
                            <span className="font-medium">{BRANDING_LABEL[p.branding]}</span>
                            <span className="block text-caption text-fg-muted">
                              {p.brandingNote}
                            </span>
                          </td>
                          <td className="py-2 pr-3 text-caption">
                            <a
                              href={p.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-11 items-center underline"
                            >
                              vendor page
                            </a>{" "}
                            · {p.checked}
                            {cmp ? (
                              <a href={cmp} className="flex min-h-11 items-center underline">
                                Compare with Traiv
                              </a>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Note>
                Prices are read from each vendor's own page on the date shown. Where a page hides,
                contradicts or doesn't publish a price, we say so instead of guessing. Confirm the
                current price with the vendor before you decide.
              </Note>
            </>
          ) : (
            <ErrorText>Enter between 1 and 2,000 clients.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------ tool stack */

export function ToolStackWidget() {
  const [clients, setClients] = useState(15);
  const [use, setUse] = useState<Record<string, boolean>>(
    Object.fromEntries(STACK_TOOLS.map((t) => [t.key, true])),
  );
  const [prices, setPrices] = useState<Record<string, Num>>(
    Object.fromEntries(STACK_TOOLS.map((t) => [t.key, inrDefault(t.price)])),
  );
  const [currency, setCurrency] = useState<Currency>("INR");
  const [cmp, setCmp] = useState("Traiv");
  const [custom, setCustom] = useState<Num>("");
  const stack = STACK_TOOLS.reduce((a, t) => a + (use[t.key] ? Number(prices[t.key] || 0) : 0), 0);
  const platform = COMPARABLE.find((p) => p.name === cmp) ?? null;
  const allIn = (n: number) => (platform ? platform.priceAt(n) : custom === "" ? null : custom);
  const at = allIn(clients);
  let breakEven: number | null = null;
  if (platform) {
    for (let k = 5; k <= 500; k++) {
      const v = platform.priceAt(k);
      if (v !== null && v > stack) {
        breakEven = k;
        break;
      }
    }
  }
  const mismatch = platform && platform.currency !== currency;
  const m = (x: number) => formatMoney(x, currency, x % 1 ? 2 : 0);
  useSettled(`${clients}-${stack.toFixed(2)}-${cmp}-${custom}`);
  return (
    <ToolLayout
      form={
        <ToolForm label="Coaching tool stack cost calculator">
          <Field
            label={`Number of clients: ${clients}`}
            hint="An all-in-one price can rise with clients; a stack of flat subscriptions usually doesn't. Drag to find the break-even."
          >
            {(id) => <Slider id={id} value={clients} onChange={setClients} min={5} max={50} />}
          </Field>
          <CurrencyPills value={currency} onChange={setCurrency} />
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-body-sm font-medium">
              What do you pay for separately?
            </legend>
            <p className="text-caption text-fg-muted">
              Untick any tool you don't use and edit prices to match your invoices.
            </p>
            {STACK_TOOLS.map((t) => (
              <div key={t.key} className="grid grid-cols-[minmax(0,1fr)_8rem] items-center gap-3">
                <div className="flex min-h-11 items-start gap-2 text-body-sm">
                  <Checkbox
                    id={`st-${t.key}`}
                    checked={use[t.key] ?? false}
                    onCheckedChange={(v) => setUse({ ...use, [t.key]: v === true })}
                    controlClassName="min-h-11 min-w-11"
                    aria-label={`Include ${t.label.toLowerCase()}`}
                  />
                  <label htmlFor={`st-${t.key}`} className="cursor-pointer pt-2.5">
                    {t.label}
                    <span className="block text-caption text-fg-muted">{t.note}</span>
                  </label>
                </div>
                <NumberField
                  id={`stp-${t.key}`}
                  value={prices[t.key] ?? ""}
                  onChange={(v) => setPrices({ ...prices, [t.key]: v })}
                  min={0}
                  max={100000}
                  suffix={currency}
                />
              </div>
            ))}
          </fieldset>
          <Select
            label="Compare with an all-in-one"
            value={cmp}
            onChange={setCmp}
            options={[
              { value: "custom", label: "A price I enter" },
              ...COMPARABLE.map((p) => ({ value: p.name, label: `${p.name} (${p.currency})` })),
            ]}
          />
          {cmp === "custom" ? (
            <NumberInput
              label="All-in-one monthly price"
              value={custom}
              onChange={setCustom}
              min={0}
              max={100000}
              suffix={currency}
            />
          ) : null}
          <Note>
            The starting prices are each vendor's published USD figure as checked on 16 November
            2026, shown in rupees at {USD_INR.rate} INR per USD (x-rates.com, same day) as a
            starting point. Edit each one to the exact figure on your invoice. Switching currency
            changes the symbol only.
          </Note>
        </ToolForm>
      }
      result={
        <ResultPanel label="Your stack">
          {at !== null && !mismatch ? (
            <p className="text-body-sm font-medium">
              At {clients} clients, {platform ? platform.name : "the all-in-one"} is{" "}
              {m(Math.abs(stack - at))} a month {at <= stack ? "cheaper than" : "dearer than"} your
              stack.
            </p>
          ) : null}
          <Headline
            label="Your separate stack"
            value={`${m(stack)}/mo`}
            note={`${m(stack * 12)} a year, the same at any client count`}
          />
          {at !== null ? (
            <>
              <Stats
                items={[
                  {
                    label: platform ? `${platform.name} at ${clients} clients` : "All-in-one",
                    value: `${platform ? formatMoney(at, platform.currency, at % 1 ? 2 : 0) : m(at)}/mo`,
                    note: platform ? platform.covers(clients) : "Your figure",
                  },
                  ...(mismatch
                    ? []
                    : [
                        {
                          label: at <= stack ? "All-in-one saves" : "Stack saves",
                          value: `${m(Math.abs(stack - at))}/mo`,
                          note: `${m(Math.abs(stack - at) * 12)} a year`,
                        },
                      ]),
                  ...(platform && !mismatch
                    ? [
                        {
                          label: "Break-even",
                          value:
                            breakEven === null ? "Not within 500 clients" : `${breakEven} clients`,
                          note: "Where the all-in-one becomes dearer than your stack",
                        },
                      ]
                    : []),
                ]}
              />
              {mismatch ? (
                <Note>
                  {platform?.name} is priced in {platform?.currency}. Set the currency to{" "}
                  {platform?.currency} and enter your tool costs in it to see the saving and
                  break-even.
                </Note>
              ) : null}
            </>
          ) : (
            <Note>
              Choose a platform or enter an all-in-one price to compare. For reference, Traiv is
              ₹999 a month for one trainer on the Trainer plan.
            </Note>
          )}
          <Note>
            Card-processing fees scale with revenue either way and are left out. Many "flat" tools
            also charge per seat or by usage as you grow; check each invoice.
          </Note>
        </ResultPanel>
      }
    />
  );
}

/* ------------------------------------------------------ fit finder */

type Answers = {
  coach: string;
  roster: string;
  app: string;
  pay: string;
  start: string;
  market: string;
};

type Fit = { name: string; why: string[]; source: string };

function bestFit(a: Answers): { best: Fit; also: Fit | null } {
  const P = (name: string) => PLATFORMS.find((p) => p.name === name)?.source ?? "";
  const practice: Fit = {
    name: "Practice Better",
    why: [
      "Built for practitioners such as dietitians and wellness coaches, with a web portal and mobile app.",
      "A free Sprout plan for up to 3 clients; Professional is USD 69 a month for up to 300 clients.",
      "Check whether it covers the specific clinical or insurance features you need.",
    ],
    source: P("Practice Better"),
  };
  const everfit: Fit = {
    name: "Everfit",
    why: [
      "A free Starter plan for up to 5 clients, so you can test before paying.",
      "Pro is priced by client count, from USD 29 a month for 10 clients.",
      "Custom branding on Pro and above.",
    ],
    source: P("Everfit"),
  };
  const hevy: Fit = {
    name: "Hevy Coach",
    why: [
      "Workout-first coaching through the Hevy app your clients may already use.",
      "USD 25 a month for up to 10 clients, USD 50 for up to 25.",
      "No branded client app, which suits you if you said you don't need one.",
    ],
    source: P("Hevy Coach"),
  };
  const ptd: Fit = {
    name: "PT Distinction",
    why: [
      "Custom-branded iOS and Android apps on the Pro plan.",
      "Pro is USD 59.90 a month for up to 25 clients; Master is USD 89.90 for up to 50.",
      "Covers training and nutrition coaching.",
    ],
    source: P("PT Distinction"),
  };
  const traiv: Fit = {
    name: "Traiv",
    why: [
      "Workout plans, diet plans and check-ins in one app, with your name and logo in it.",
      "One Trainer plan at ₹999 a month, with a 14-day free trial.",
      "Priced in rupees, which suits coaches who bill clients in INR.",
    ],
    source: "https://www.traiv.fit/pricing",
  };
  const kahunas: Fit = {
    name: "Kahunas",
    why: [
      "Per-seat pricing that gets cheaper per client as you grow: USD 1.50 a seat at 100–199 seats.",
      "White label from the 200-seat band.",
      "Suits a large, established roster.",
    ],
    source: P("Kahunas"),
  };
  if (a.market === "us") return { best: practice, also: null };
  if (a.coach === "wellness") return { best: practice, also: everfit };
  if (a.app === "no" && a.coach === "training") return { best: hevy, also: everfit };
  if (a.start === "free" && a.coach === "nutrition") return { best: practice, also: traiv };
  if (a.start === "free") return { best: everfit, also: traiv };
  if (a.roster === "established") return { best: kahunas, also: everfit };
  if (a.app !== "no") return { best: traiv, also: ptd };
  return { best: ptd, also: traiv };
}

export function FitFinderWidget() {
  const [a, setA] = useState<Answers>({
    coach: "training",
    roster: "growing",
    app: "yes",
    pay: "own",
    start: "paid",
    market: "eu",
  });
  const [shown, setShown] = useState<Answers | null>(null);
  const r = shown ? bestFit(shown) : null;
  useSettled(r ? r.best.name : "");
  const set = (k: keyof Answers) => (v: string) => setA({ ...a, [k]: v });
  const cmp = r ? comparePath(r.best.name) : null;
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Coaching platform fit finder"
          submitLabel="Show my best-fit platform"
          onSubmit={() => setShown(a)}
        >
          <Pills
            label="What do you coach?"
            value={a.coach}
            onChange={set("coach")}
            options={[
              { value: "training", label: "Training" },
              { value: "nutrition", label: "Nutrition" },
              { value: "both", label: "Both" },
              { value: "wellness", label: "Wellness and habits" },
            ]}
          />
          <Pills
            label="How big is your client list?"
            value={a.roster}
            onChange={set("roster")}
            options={[
              { value: "solo", label: "Just starting (under 15)" },
              { value: "growing", label: "Growing (15–60)" },
              { value: "established", label: "Established (60+)" },
            ]}
          />
          <Pills
            label="Do you want a branded client app?"
            value={a.app}
            onChange={set("app")}
            options={[
              { value: "yes", label: "Yes" },
              { value: "maybe", label: "Nice to have" },
              { value: "no", label: "No" },
            ]}
          />
          <Pills
            label="Payments in your own account?"
            value={a.pay}
            onChange={set("pay")}
            options={[
              { value: "own", label: "Yes, keep control" },
              { value: "flex", label: "Don't mind a platform account" },
            ]}
          />
          <Pills
            label="How do you want to start?"
            value={a.start}
            onChange={set("start")}
            options={[
              { value: "free", label: "Free to test first" },
              { value: "paid", label: "Paid all-in-one" },
            ]}
          />
          <Pills
            label="Where and how do you work?"
            value={a.market}
            onChange={set("market")}
            options={[
              { value: "eu", label: "EU / global coaching" },
              { value: "us", label: "US clinical / insurance" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel label="Your best-fit platform">
          {r ? (
            <>
              <Headline label="Your best-fit platform" value={r.best.name} />
              <ul className="list-disc pl-5 text-body-sm">
                {r.best.why.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 text-body-sm">
                <a
                  href={r.best.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center underline"
                >
                  {r.best.name} pricing page
                </a>
                {cmp ? (
                  <a href={cmp} className="inline-flex min-h-11 items-center underline">
                    How it compares with Traiv
                  </a>
                ) : null}
              </div>
              {r.also ? (
                <Note>
                  Also worth a look: {r.also.name}. {r.also.why[0]}
                </Note>
              ) : null}
              {shown?.pay === "own" ? (
                <Note>
                  Ask each platform how client payments are processed and where payouts go;
                  arrangements vary and change, so confirm before you commit.
                </Note>
              ) : null}
              <Note>
                Prices and features from vendor pages checked on 16 November 2026. This is one
                honest suggestion, not a ranking; try the free trial or plan before you move
                clients.
              </Note>
            </>
          ) : (
            <Note>
              Answer the questions and press "Show my best-fit platform". You'll get one
              recommendation with the reasons, and a second option to consider. Sometimes that's
              Traiv; often it isn't.
            </Note>
          )}
        </ResultPanel>
      }
    />
  );
}
