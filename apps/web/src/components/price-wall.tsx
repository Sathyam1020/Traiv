"use client";

import { useId, useState } from "react";
import { COACHWAY, coachwayMonthly, EUR_TO_INR, traivMonthly } from "@/content/comparison";

const MIN = 5;
const MAX = 100;

/** Sampled once at module scope — the shape never changes, only the marker on it. */
const POINTS = Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i);
const CEILING = coachwayMonthly(MAX) * EUR_TO_INR;

const W = 760;
const H = 260;
const PAD = { top: 20, right: 16, bottom: 34, left: 56 };

const x = (clients: number) =>
  PAD.left + ((clients - MIN) / (MAX - MIN)) * (W - PAD.left - PAD.right);
const y = (rupees: number) => H - PAD.bottom - (rupees / CEILING) * (H - PAD.top - PAD.bottom);

const path = (f: (n: number) => number) =>
  POINTS.map((n, i) => `${i === 0 ? "M" : "L"} ${x(n).toFixed(1)} ${y(f(n)).toFixed(1)}`).join(" ");

const COACHWAY_PATH = path((n) => coachwayMonthly(n) * EUR_TO_INR);
const TRAIV_PATH = path(traivMonthly);

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/**
 * What per-client pricing costs you at the point you actually want to be.
 *
 * The argument is the shape, not the numbers: one line climbs with every client you sign
 * and the other does not move. A table of two prices makes that an opinion; a chart where
 * the gap opens as you drag makes it arithmetic.
 *
 * Coachway is the worked example because their per-client formula is published and was
 * read off their own pricing page — see `comparison.ts` for the rule about which numbers
 * are allowed on this page at all.
 */
export function PriceWall() {
  const [clients, setClients] = useState(30);
  const id = useId();

  const theirs = coachwayMonthly(clients);
  const theirsInr = theirs * EUR_TO_INR;
  const ours = traivMonthly(clients);
  const saved = theirsInr - ours;

  return (
    <section className="border-y border-line bg-sunken py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[72rem] px-5 sm:px-8">
        <div className="flex max-w-[46rem] flex-col gap-4">
          <p className="text-caption font-semibold uppercase tracking-[0.1em] text-fg-subtle">
            What growing costs you
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
            Every other platform charges you more for doing well
          </h2>
          <p className="text-body leading-relaxed text-fg-muted">
            Per-client pricing means the better you get at your job, the bigger your software bill.
            Drag it and see where that ends up.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="min-w-0 flex-1">
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="h-auto w-full min-w-[34rem]"
                role="img"
                aria-label={`At ${clients} clients, Coachway costs about ${inr(theirsInr)} a month and Traiv costs ${inr(ours)}.`}
              >
                <title>Monthly cost as client count grows</title>

                {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                  <g key={t}>
                    <line
                      x1={PAD.left}
                      x2={W - PAD.right}
                      y1={y(CEILING * t)}
                      y2={y(CEILING * t)}
                      className="stroke-line"
                      strokeWidth={1}
                    />
                    <text
                      x={PAD.left - 10}
                      y={y(CEILING * t) + 4}
                      textAnchor="end"
                      className="fill-fg-subtle text-[11px] tabular-nums"
                    >
                      {t === 0 ? "₹0" : `₹${Math.round((CEILING * t) / 1000)}k`}
                    </text>
                  </g>
                ))}

                {[5, 25, 50, 75, 100].map((n) => (
                  <text
                    key={n}
                    x={x(n)}
                    y={H - 12}
                    textAnchor="middle"
                    className="fill-fg-subtle text-[11px] tabular-nums"
                  >
                    {n}
                  </text>
                ))}

                <path d={COACHWAY_PATH} fill="none" className="stroke-fg-subtle" strokeWidth={2} />
                <path d={TRAIV_PATH} fill="none" className="stroke-fg" strokeWidth={3} />

                <line
                  x1={x(clients)}
                  x2={x(clients)}
                  y1={PAD.top}
                  y2={H - PAD.bottom}
                  className="stroke-line-strong"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <circle cx={x(clients)} cy={y(theirsInr)} r={5} className="fill-fg-subtle" />
                <circle cx={x(clients)} cy={y(ours)} r={5} className="fill-fg" />

                <text
                  x={x(MAX)}
                  y={y(coachwayMonthly(MAX) * EUR_TO_INR) - 10}
                  textAnchor="end"
                  className="fill-fg-muted text-[12px] font-medium"
                >
                  Per-client pricing
                </text>
                <text x={x(MIN) + 6} y={y(999) - 12} className="fill-fg text-[12px] font-semibold">
                  Traiv — flat
                </text>
              </svg>
            </div>

            <label htmlFor={id} className="mt-6 block text-body-sm font-medium">
              <span className="tabular-nums">{clients}</span> clients
            </label>
            <input
              id={id}
              type="range"
              min={MIN}
              max={MAX}
              value={clients}
              onChange={(e) => setClients(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--color-brand)]"
            />
          </div>

          <div className="flex shrink-0 flex-col gap-4 lg:w-[19rem]">
            <Row
              label={`${COACHWAY.name}, per client`}
              value={`${inr(theirsInr)}`}
              muted
              note={`€${theirs} a month`}
            />
            <Row label="Traiv Pro" value={inr(ours)} note="Whatever the number is" />

            <div className="rounded-surface border border-line-strong bg-surface p-5">
              <p className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                Difference
              </p>
              <p className="mt-1 font-display text-[1.75rem] font-semibold tabular-nums tracking-[-0.02em]">
                {saved > 0 ? inr(saved) : inr(0)}
              </p>
              <p className="mt-1 text-caption text-fg-muted">a month, at {clients} clients</p>
            </div>

            <p className="text-caption leading-relaxed text-fg-subtle">
              {COACHWAY.name} is €{COACHWAY.base} a month for {COACHWAY.includes} clients and €
              {COACHWAY.perExtra} for each one after, from their pricing page on {COACHWAY.checked}.
              Converted at ₹{EUR_TO_INR} to the euro, which moves. Trainerize, Everfit and TrueCoach
              also bill by client count, in tiers rather than a formula.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  note,
  muted,
}: {
  label: string;
  value: string;
  note: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-body-sm text-fg-muted">{label}</span>
        <span className="text-caption text-fg-subtle">{note}</span>
      </div>
      <span
        className={`shrink-0 font-display text-[1.25rem] font-semibold tabular-nums ${
          muted ? "text-fg-muted" : "text-fg"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
