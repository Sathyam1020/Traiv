"use client";

import { Badge } from "@traiv/ui/components/badge";
import { Skeleton } from "@traiv/ui/components/skeleton";
import {
  CalendarDays,
  CreditCard,
  type Icon,
  Scale,
  Smartphone,
  Star,
  User,
} from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
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

/** Four weeks, as the messages chart labels them. */
const CHART_WEEKS = 4;

/**
 * The client's overview.
 *
 * Four bands: the headline figures as one divided strip, the energy line, what they are
 * on right now, then the two trends. All of it from a single request.
 *
 * Several panels have nothing behind them yet — ratings, payments, messages, check-ins.
 * They render in full with their real empty state rather than being hidden, because a
 * coach who cannot see a panel does not conclude it is unbuilt, they conclude they
 * missed it.
 */
export function Overview({
  data,
  checkIns,
}: {
  data: ClientOverview;
  /** Undefined while its own request is still in flight. */
  checkIns?: CheckInTrendData;
}) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 pb-24 sm:px-6 lg:pb-6">
      {data.hasAccount ? null : <NotJoined />}

      <HeadlineStrip data={data} />
      <EnergyBar energy={data.energy} nutrition={data.nutrition} />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Panel
          label="Current meal plan"
          headline="No meal plan assigned"
          foot="No active meal plan"
        />
        <Panel
          label="Latest workout"
          headline={data.training.lastSessionAt ? "Logged a session" : "No recent workouts"}
          foot={
            data.training.lastSessionAt
              ? `${shortDate(new Date(data.training.lastSessionAt))} · ${data.training.sessions} in ${data.training.windowDays} days`
              : "No recent activity"
          }
        />
        <MessagesTrend />
      </div>

      <div className="grid grid-cols-1 gap-3 border-line border-t pt-4 lg:grid-cols-2">
        {checkIns ? <CheckInTrend trend={checkIns} /> : <CheckInTrendSkeleton />}
        <ActivityFeed activity={data.activity} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

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
  const startsToday = new Date().toDateString() === started.toDateString();
  const w = data.weight;

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-surface border border-line bg-surface sm:grid-cols-2 xl:grid-cols-4">
      <Cell icon={Star} label="Happiness" value="N/A" foot="No ratings yet" muted />
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
        label="Starting"
        value={startsToday ? "Today" : shortDate(started)}
        foot={`Starts ${started.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`}
      />
    </div>
  );
}

function Cell({
  icon: Glyph,
  label,
  value,
  foot,
  muted = false,
}: {
  icon: Icon;
  label: string;
  value: string;
  foot: string;
  muted?: boolean;
}) {
  return (
    <section className="flex flex-col gap-2 border-line border-b p-4 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0 xl:border-b-0 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0">
      <span className="flex items-center gap-1.5 text-caption uppercase tracking-[0.06em] text-fg-subtle">
        <Glyph className="size-3.5" aria-hidden="true" />
        {label}
      </span>
      <span
        className={cn(
          "font-semibold text-display tabular-nums",
          muted ? "text-fg-subtle" : "text-fg",
        )}
      >
        {value}
      </span>
      <span className="text-caption text-fg-muted">{foot}</span>
    </section>
  );
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
function Panel({ label, headline, foot }: { label: string; headline: string; foot: string }) {
  return (
    <section className="flex min-h-40 flex-col rounded-surface border border-line bg-surface p-4">
      <span className="text-caption uppercase tracking-[0.06em] text-fg-subtle">{label}</span>
      <span className="mt-3 font-semibold text-heading tracking-[-0.02em]">{headline}</span>
      <span className="mt-auto pt-4 text-body-sm text-fg-muted">{foot}</span>
    </section>
  );
}

/**
 * Four weeks of coach-versus-client messages.
 *
 * Nothing writes a message yet, so every bar is zero. The axis is still drawn: an empty
 * chart with its weeks labelled reads as "no messages", where a blank panel reads as
 * broken.
 */
function MessagesTrend() {
  const weeks = Array.from({ length: CHART_WEEKS }, (_, i) => {
    const end = new Date(Date.now() - (CHART_WEEKS - 1 - i) * 7 * 86_400_000);
    const start = new Date(end.getTime() - 6 * 86_400_000);
    const d = (x: Date) =>
      `${String(x.getMonth() + 1).padStart(2, "0")}/${String(x.getDate()).padStart(2, "0")}`;
    return { key: d(start), label: `${d(start)} – ${d(end)}` };
  });

  return (
    <section className="flex min-h-40 flex-col rounded-surface border border-line bg-surface p-4">
      <span className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-caption uppercase tracking-[0.06em] text-fg-subtle">
          Messages trend
        </span>
        <span className="flex gap-3 text-caption text-fg-muted tabular-nums">
          <span>Coach: 0</span>
          <span>Client: 0</span>
        </span>
      </span>

      <span className="relative mt-4 flex flex-1 items-end gap-2 border-line border-b">
        <span aria-hidden="true" className="absolute inset-x-0 top-1/3 h-px bg-line/60" />
        <span aria-hidden="true" className="absolute inset-x-0 top-2/3 h-px bg-line/60" />
        {weeks.map((w) => (
          <span key={w.key} className="relative z-10 min-w-0 flex-1" />
        ))}
      </span>

      <span className="mt-1.5 flex gap-2 text-fg-subtle tabular-nums [font-size:0.625rem]">
        {weeks.map((w) => (
          <span key={w.key} className="min-w-0 flex-1 truncate text-center">
            {w.label}
          </span>
        ))}
      </span>
    </section>
  );
}

/**
 * What has actually happened to this client.
 *
 * Only two kinds of event are recorded anywhere: the client row being created, and the
 * first app login. Status changes and delivered emails are absent because nothing
 * writes them down — an audit table is what would make this feed real.
 */
function ActivityFeed({ activity }: { activity: ClientOverview["activity"] }) {
  const ICON: Record<string, Icon> = { created: User, activated: Smartphone };

  return (
    <section className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-4 sm:p-5">
      <span className="font-semibold text-subheading">Activity</span>

      {activity.length === 0 ? (
        <p className="py-8 text-center text-body-sm text-fg-muted">Nothing recorded yet.</p>
      ) : (
        <ol className="flex flex-col">
          {activity.map((e, i) => {
            const Glyph = ICON[e.kind] ?? CalendarDays;
            const last = i === activity.length - 1;
            return (
              <li key={e.kind} className="flex gap-3">
                <span className="flex flex-col items-center">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sunken text-fg-muted">
                    <Glyph className="size-4" aria-hidden="true" />
                  </span>
                  {last ? null : <span aria-hidden="true" className="w-px flex-1 bg-line" />}
                </span>
                <span className={cn("flex flex-col gap-0.5", last ? "pb-0" : "pb-5")}>
                  <span className="font-medium text-body-sm">{e.title}</span>
                  <span className="text-caption text-fg-muted">
                    {new Date(e.at).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      )}
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
