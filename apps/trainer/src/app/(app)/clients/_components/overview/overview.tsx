"use client";

import { Avatar } from "@traiv/ui/components/avatar";
import { Badge } from "@traiv/ui/components/badge";
import { Skeleton } from "@traiv/ui/components/skeleton";
import {
  CalendarDays,
  CircleAlert,
  ClipboardList,
  CreditCard,
  Dumbbell,
  type Icon,
  Salad,
  Scale,
  Smartphone,
  Star,
  User,
  Utensils,
} from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import { useState } from "react";
import type { CheckInTrend as CheckInTrendData, ClientOverview, EnergyBasis } from "@/lib/api";
import { shortDate } from "../duration-cell";
import { CheckInTrend, CheckInTrendSkeleton } from "./check-in-trend";

const DIET_LABEL: Record<string, string> = {
  vegetarian: "Vegetarian",
  non_vegetarian: "Non-vegetarian",
  eggetarian: "Eggetarian",
  vegan: "Vegan",
  jain: "Jain",
};

const FLAG_LABEL: Record<string, string> = {
  knee: "Knee",
  lower_back: "Lower back",
  shoulder: "Shoulder",
  diabetes: "Diabetes",
  blood_pressure: "Blood pressure",
  thyroid: "Thyroid",
  pcos: "PCOS",
  pregnancy: "Pregnancy",
};

const REVIEW_LABEL: Record<string, string> = {
  pregnancy: "Pregnant",
  medical_condition: "Medical condition",
  underweight: "Underweight",
  very_low_target: "Target is very low",
  deficit_not_possible: "Deficit not possible",
};

/**
 * One glyph and colour per activity kind — `roster.ts`'s `activity` array is the
 * complete list of kinds this ever emits (`created`, `activated`, `checkin`, `workout`,
 * `nutrition`, `food`). Every kind gets its own entry on purpose: a feed where a
 * check-in, a workout and a meal plan all render as the same blue calendar icon reads as
 * one long list of nothing, not a record of what actually happened.
 */
const ACTIVITY_STYLE: Record<string, { icon: Icon; bg: string; fg: string }> = {
  created: { icon: User, bg: "bg-blue-50", fg: "text-blue-600" },
  activated: { icon: Smartphone, bg: "bg-violet-50", fg: "text-violet-600" },
  checkin: { icon: ClipboardList, bg: "bg-green-50", fg: "text-green-600" },
  workout: { icon: Dumbbell, bg: "bg-sky-50", fg: "text-sky-600" },
  nutrition: { icon: Salad, bg: "bg-orange-50", fg: "text-orange-600" },
  food: { icon: Utensils, bg: "bg-teal-50", fg: "text-teal-600" },
};
const DEFAULT_ACTIVITY_STYLE = { icon: CalendarDays, bg: "bg-blue-50", fg: "text-blue-600" };

/** Live client summaries and recorded activity. */
export function Overview({
  data,
  checkIns,
  onNavigate,
}: {
  data: ClientOverview;
  onNavigate?: (tab: "Nutrition" | "Development") => void;
  /** Undefined while its own request is still in flight. */
  checkIns?: CheckInTrendData;
}) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 pb-24 sm:px-6 lg:pb-6">
      {data.hasAccount ? null : <NotJoined />}
      {data.constraints ? <ConstraintsBanner constraints={data.constraints} /> : null}

      <HeadlineStrip data={data} />
      <EnergyBar energy={data.energy} nutrition={data.nutrition} />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Panel
          label="Current meal plan"
          headline={data.currentPlan?.name ?? "No meal plan assigned"}
          foot={
            data.currentPlan
              ? `${data.currentPlan.kcal.toLocaleString()} kcal/day · Open nutrition →`
              : "No active meal plan"
          }
          onClick={() => onNavigate?.("Nutrition")}
        />
        <Panel
          label="Latest workout"
          headline={data.latestWorkout?.name ?? "No workouts recorded"}
          foot={
            data.latestWorkout
              ? `${data.latestWorkout.minutes ?? 0} min · ${shortDate(new Date(data.latestWorkout.completedAt))} · View details →`
              : "Completed workouts appear here"
          }
          onClick={() => onNavigate?.("Development")}
        />
        <MessagesTrend weeks={data.messageWeeks} />
      </div>

      <div className="grid grid-cols-1 gap-3 border-line border-t pt-4 lg:grid-cols-2">
        {checkIns ? <CheckInTrend trend={checkIns} /> : <CheckInTrendSkeleton />}
        <ActivityFeed activity={data.activity} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Injuries, PCOS, thyroid — whatever the coach noted as a constraint on this client.
 * The schema comment calls this "shown at the top of every plan"; this is the one place
 * in the trainer app that was actually showing it, so it was being fetched and never
 * rendered at all.
 */
function ConstraintsBanner({ constraints }: { constraints: string }) {
  return (
    <div className="flex items-start gap-3 rounded-surface border border-warning/30 bg-warning-subtle px-4 py-3">
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
      <div>
        <p className="text-body-sm font-medium text-warning">Constraints</p>
        <p className="mt-0.5 text-body-sm leading-relaxed text-fg-muted">{constraints}</p>
      </div>
    </div>
  );
}

function NotJoined() {
  return (
    <p className="rounded-surface border border-line bg-sunken/50 px-4 py-3 text-body-sm text-fg-muted">
      This client hasn&apos;t joined yet. Their age, weight and intake answers fill in here the
      moment they sign in with your code.
    </p>
  );
}

/**
 * The headline row: one bordered container divided into cells, not four cards.
 *
 * A card per figure puts a border around each one and makes four equal-weight objects
 * out of what is really one summary line. Dividers say "these belong together".
 */
function HeadlineStrip({ data }: { data: ClientOverview }) {
  const started = new Date(data.startedAt);
  const journeyWeek = Math.max(1, Math.floor((Date.now() - started.getTime()) / 604800000) + 1);
  const w = data.weight;

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-surface border border-line bg-surface sm:grid-cols-2 xl:grid-cols-4">
      <Cell
        icon={Star}
        label="Happiness"
        value={data.happiness == null ? "N/A" : `${data.happiness} / 5`}
        foot={data.happiness == null ? "No ratings yet" : "From check-ins"}
        muted={data.happiness == null}
        tone={happinessTone(data.happiness)}
      />
      <Cell icon={CreditCard} label="Next payment" value="N/A" foot="No payments found" muted />
      <Cell
        icon={Scale}
        label="Weight"
        value={w ? `${w.currentKg} kg` : "N/A"}
        foot={
          w
            ? `${w.changeKg >= 0 ? "+" : ""}${w.changeKg} kg since last weigh-in${
                w.targetKg ? ` · ${w.targetKg} kg goal` : ""
              }`
            : "No weigh-ins recorded"
        }
        muted={!w}
      />
      <Cell
        icon={CalendarDays}
        label="Journey"
        value={`Week ${journeyWeek}`}
        foot={`Started ${started.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`}
      />
    </div>
  );
}

const CELL_TONE = {
  success: { bg: "bg-success-subtle", fg: "text-success" },
  warning: { bg: "bg-warning-subtle", fg: "text-warning" },
  danger: { bg: "bg-danger-subtle", fg: "text-danger" },
} as const;

function Cell({
  icon: Glyph,
  label,
  value,
  foot,
  muted = false,
  tone,
}: {
  icon: Icon;
  label: string;
  value: string;
  foot: string;
  muted?: boolean;
  tone?: keyof typeof CELL_TONE;
}) {
  const t = tone ? CELL_TONE[tone] : null;
  return (
    <section
      className={cn(
        "flex flex-col gap-2 border-line border-b p-4 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0 xl:border-b-0 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0",
        t?.bg,
      )}
    >
      <span
        className={cn(
          "flex items-center gap-1.5 text-caption uppercase tracking-[0.06em]",
          t?.fg ?? "text-fg-subtle",
        )}
      >
        <Glyph className="size-3.5" aria-hidden="true" />
        {label}
      </span>
      <span
        className={cn("font-semibold text-2xl tabular-nums", muted ? "text-fg-subtle" : "text-fg")}
      >
        {value}
      </span>
      <span className="text-caption text-fg-muted">{foot}</span>
    </section>
  );
}

/**
 * Three bands, not a continuous gradient — Coachway's own Happiness card only ever
 * evidenced one data point (a green card at 4.5/5), so the boundaries here are drawn
 * from the mood check-in's own five labels (`weekly-fields.tsx`: Very low, Low,
 * Neutral, Good, Great), not invented from scratch: 1-2 is the two "low" labels, 3 is
 * "Neutral", 4-5 is the two "good" labels.
 */
function happinessTone(happiness: number | null): keyof typeof CELL_TONE | undefined {
  if (happiness == null) return undefined;
  if (happiness <= 2) return "danger";
  if (happiness <= 3) return "warning";
  return "success";
}

/**
 * BMR, TDEE and the target on one line, with the assessment beside them.
 *
 * A horizontal strip rather than three boxes in a card: these are one derivation read
 * left to right, and the target only means anything next to the two numbers it came
 * from.
 */
function EnergyBar({
  energy,
  nutrition,
}: {
  energy: ClientOverview["energy"];
  nutrition: ClientOverview["nutrition"];
}) {
  if (energy.source === "none") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-surface border border-line bg-sunken/40 px-5 py-4">
        <span className="text-body-sm text-fg-muted">
          {energy.missing.length > 0
            ? `Energy needs ${listOf(energy.missing)} before it can be worked out.`
            : "Energy is not available yet."}
        </span>
        <Preferences nutrition={nutrition} />
      </div>
    );
  }

  const basis = energy.basis as EnergyBasis | null;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-surface border border-line bg-surface px-5 py-4">
      <Metric label="BMR" value={basis?.bmr ?? null} />
      <Divider />
      <Metric label="TDEE" value={basis?.tdee ?? null} />
      <Divider />
      <Metric label="Target" value={energy.kcal} />
      <Divider />

      {/* Theirs reads "ED RISK / No Risk". Ours says what it actually is: the reasons a
          human should look at this target. There is no eating-disorder screener behind
          it and the label will not imply one. */}
      <span className="flex flex-col gap-0.5">
        <span className="text-caption uppercase tracking-[0.06em] text-fg-subtle">Review</span>
        {energy.review.length === 0 ? (
          <span className="flex items-center gap-1.5 font-medium text-body-sm text-success">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
            Nothing flagged
          </span>
        ) : (
          <span className="flex flex-wrap gap-1">
            {energy.review.map((r) => (
              <Badge key={r} variant="outline" className="text-danger">
                {REVIEW_LABEL[r] ?? r}
              </Badge>
            ))}
          </span>
        )}
      </span>

      <span className="ml-auto flex items-center gap-2">
        <Preferences nutrition={nutrition} />
      </span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | null }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-caption uppercase tracking-[0.06em] text-fg-subtle">{label}</span>
      <span className="font-semibold text-subheading tabular-nums">
        {value === null ? "—" : value.toLocaleString("en-IN")}
      </span>
    </span>
  );
}

const Divider = () => <span aria-hidden="true" className="h-8 w-px bg-line" />;

/** Diet, allergies, dislikes and flags — or the one chip that says there are none. */
function Preferences({ nutrition }: { nutrition: ClientOverview["nutrition"] }) {
  if (!nutrition) return <Badge variant="outline">No preferences</Badge>;

  const allergies = meaningful(nutrition.allergies);
  const dislikes = meaningful(nutrition.dislikes);
  const chips: { key: string; text: string; danger?: boolean }[] = [];

  if (nutrition.diet) {
    chips.push({ key: "diet", text: DIET_LABEL[nutrition.diet] ?? nutrition.diet });
  }
  if (allergies) chips.push({ key: "a", text: `Allergic to ${allergies}`, danger: true });
  if (dislikes) chips.push({ key: "d", text: `Dislikes ${dislikes}` });
  for (const f of nutrition.healthFlags) {
    chips.push({ key: f, text: FLAG_LABEL[f] ?? f, danger: true });
  }

  if (chips.length === 0) return <Badge variant="outline">No preferences</Badge>;

  return (
    <span className="flex flex-wrap justify-end gap-1.5">
      {chips.map((c) => (
        <Badge key={c.key} variant="outline" className={cn(c.danger && "text-danger")}>
          {c.text}
        </Badge>
      ))}
    </span>
  );
}

/** A labelled panel: small-caps label, a headline, and a footnote pinned to the bottom. */
function Panel({
  label,
  headline,
  foot,
  onClick,
}: {
  label: string;
  headline: string;
  foot: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-48 flex-col rounded-surface border border-line bg-surface p-5 text-left transition-colors hover:bg-sunken/40 focus-visible:outline-2 focus-visible:outline-primary"
    >
      <span className="text-caption uppercase tracking-[0.06em] text-fg-subtle">{label}</span>
      <span className="mt-3 font-semibold text-heading tracking-[-0.02em]">{headline}</span>
      <span className="mt-auto pt-4 text-body-sm text-fg-muted">{foot}</span>
    </button>
  );
}

/** Four weeks of actual coach and client messages. */
function MessagesTrend({ weeks }: { weeks: ClientOverview["messageWeeks"] }) {
  const max = Math.max(1, ...weeks.map((w) => w.coach + w.client));
  const coach = weeks.reduce((n, w) => n + w.coach, 0);
  const client = weeks.reduce((n, w) => n + w.client, 0);
  return (
    <section className="flex min-h-48 flex-col rounded-surface border border-line bg-surface p-5">
      <div className="flex justify-between gap-2 text-caption text-fg-muted">
        <span className="uppercase tracking-wider">Messages trend</span>
        <span>
          Coach: {coach} · Client: {client}
        </span>
      </div>
      <div className="relative mt-4 flex h-24 items-end gap-4 border-b border-line">
        {!coach && !client && (
          <span className="absolute inset-0 flex items-center justify-center text-caption text-fg-muted">
            No messages this period
          </span>
        )}
        {weeks.map((w) => (
          <div
            key={w.key}
            title={`${w.label}: Coach ${w.coach}, Client ${w.client}`}
            className="z-10 flex h-full flex-1 items-end justify-center gap-1"
          >
            <div
              className="w-5 rounded-t bg-blue-700"
              style={{ height: `${(w.coach / max) * 100}%` }}
            />
            <div
              className="w-5 rounded-t bg-blue-400"
              style={{ height: `${(w.client / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-4 text-[10px] text-fg-muted">
        {weeks.map((w) => (
          <span key={w.key} className="flex-1 text-center">
            {w.label}
          </span>
        ))}
      </div>
    </section>
  );
}

function ActivityFeed({ activity }: { activity: ClientOverview["activity"] }) {
  const [filter, setFilter] = useState("All");
  const visible = filter === "Emails" || filter === "Invoices" ? [] : activity;
  return (
    <section className="rounded-surface border border-line bg-surface p-5">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-subheading">Activity</h3>
        <div className="flex rounded-xl border border-line bg-sunken/40 p-1">
          {["All", "Activity", "Emails", "Invoices"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-caption transition-colors",
                filter === f
                  ? "bg-surface font-semibold text-fg shadow-sm"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      {/* A fixed height, scrolling on its own — without this, a client with months of
          history stretches the whole page instead of staying put beside Check-in trend,
          which is exactly the overflow Coachway's own `height: 400px` box avoids. */}
      <div className="max-h-[400px] overflow-y-auto">
        {!visible.length ? (
          <p className="py-16 text-center text-body-sm text-fg-muted">
            {filter === "All" || filter === "Activity"
              ? "No activity recorded yet."
              : `No ${filter.toLowerCase()} recorded.`}
          </p>
        ) : (
          <ol>
            {visible.map((e, i) => {
              const style = ACTIVITY_STYLE[e.kind] ?? DEFAULT_ACTIVITY_STYLE;
              const Glyph = style.icon;
              return (
                <li key={e.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full",
                        style.bg,
                        style.fg,
                      )}
                    >
                      <Glyph className="size-4" />
                    </span>
                    {i < visible.length - 1 && <span className="w-px flex-1 bg-line" />}
                  </div>
                  <div className="min-w-0 flex-1 pb-6 pt-1">
                    <p className="text-body-sm font-semibold">{e.title}</p>
                    <p className="mt-1 text-caption text-fg-muted">
                      {new Date(e.at).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {e.by && (
                    <div className="flex shrink-0 items-start gap-2 pt-1.5">
                      <span className="text-caption font-medium text-fg-muted">{e.by}</span>
                      <Avatar name={e.by} size={24} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Free-text "none".
 *
 * Allergies and dislikes are typed by the client, so "nothing", "none", "na" and "-"
 * all mean empty. Rendering "nothing" as a danger chip tells a coach the opposite of
 * what the client said.
 */
const NEGATIVES = new Set(["none", "nothing", "no", "na", "n/a", "nil", "-", "--"]);
const meaningful = (v: string | null) => (v && !NEGATIVES.has(v.trim().toLowerCase()) ? v : null);

const listOf = (items: string[]) =>
  items.length === 1 ? items[0] : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

/** The same shape, before the request lands. */
export function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 sm:px-6">
      <Skeleton className="h-28 rounded-surface" />
      <Skeleton className="h-16 rounded-surface" />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-40 rounded-surface" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-surface" />
        <Skeleton className="h-80 rounded-surface" />
      </div>
    </div>
  );
}
