import { schema } from "@traiv/db";
import { and, eq, gte, inArray, isNull, sql } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { requireAdmin } from "../../middleware/admin.js";
import { ROLLUP_NAME } from "../analytics/rollup.js";
import { EVENT_NAMES } from "../analytics/service.js";

/**
 * The admin Overview page (`admin-dashboard-spec.md` §1) — real DAU/WAU/MAU and
 * weekly-active-clients, read straight from `daily_metric_rollup`, same role
 * `/admin/analytics` already plays for the marketing site. Separate file because this
 * is authenticated-usage analytics, not the anonymous-visitor system that endpoint
 * reads — see `features/analytics/service.ts`.
 *
 * Only one report exists today (`overview`); more join this file's pattern as later
 * roadmap phases build out the rest of the 12-section nav.
 */
export const productAnalytics: Router = Router();

productAnalytics.use(requireAdmin());

const TREND_DAYS = 30;
// "Weekly active client" per `metric-definitions.md` — also duplicated in
// `health-score.ts` for the same reason `toDay`/`addDays` is duplicated there: avoiding
// a cross-file dependency for a four-string list.
const ENGAGEMENT_EVENTS = [
  "workout_session_completed",
  "check_in_submitted",
  "meal_logged",
  "measurement_logged",
];
const METRICS = [
  "dau_trainer",
  "dau_client",
  "wau_trainer",
  "wau_client",
  "mau_trainer",
  "mau_client",
  "signups_trainer",
] as const;
type Metric = (typeof METRICS)[number];

function toDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function addDays(day: string, delta: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return toDay(d);
}
function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

productAnalytics.get("/analytics/overview", async (_req, res) => {
  const today = toDay(new Date());
  const since = addDays(today, -TREND_DAYS);

  const [[trainers], [clients], rollups, checkpoint] = await Promise.all([
    // Mirrors `/admin/stats`'s own counting rules exactly — a trainer is a live staff
    // membership, a client is a coaching relationship, both counted the same way
    // everywhere else in the admin app.
    db
      .select({ n: sql<number>`count(distinct ${schema.memberships.userId})::int` })
      .from(schema.memberships)
      .innerJoin(schema.studios, eq(schema.studios.id, schema.memberships.studioId))
      .where(
        and(
          eq(schema.memberships.status, "active"),
          isNull(schema.memberships.deletedAt),
          isNull(schema.studios.deletedAt),
        ),
      ),

    db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.clients)
      .where(
        and(isNull(schema.clients.deletedAt), inArray(schema.clients.status, ["active", "paused"])),
      ),

    db
      .select({
        day: schema.dailyMetricRollups.day,
        metric: schema.dailyMetricRollups.metric,
        value: schema.dailyMetricRollups.value,
      })
      .from(schema.dailyMetricRollups)
      .where(
        and(
          eq(schema.dailyMetricRollups.studioId, schema.PLATFORM_ROLLUP_SCOPE),
          gte(schema.dailyMetricRollups.day, since),
          inArray(schema.dailyMetricRollups.metric, METRICS),
        ),
      )
      .orderBy(schema.dailyMetricRollups.day),

    db
      .select()
      .from(schema.analyticsCheckpoints)
      .where(eq(schema.analyticsCheckpoints.rollupName, ROLLUP_NAME))
      .limit(1)
      .then((rows) => rows[0] ?? null),
  ]);

  const series: Record<Metric, { day: string; value: number }[]> = {
    dau_trainer: [],
    dau_client: [],
    wau_trainer: [],
    wau_client: [],
    mau_trainer: [],
    mau_client: [],
    signups_trainer: [],
  };
  for (const row of rollups) {
    series[row.metric as Metric]?.push({ day: row.day, value: row.value });
  }

  const latestDay = checkpoint?.lastProcessedDay ?? null;
  const latest = (metric: Metric): number =>
    latestDay ? (series[metric].find((r) => r.day === latestDay)?.value ?? 0) : 0;

  // "This week" vs "last week" over the already-fetched 30-day window — no second query.
  const weekOf = (metric: Metric, endInclusive: string): number =>
    sum(
      series[metric]
        .filter((r) => r.day > addDays(endInclusive, -7) && r.day <= endInclusive)
        .map((r) => r.value),
    );

  const signupsThisWeek = latestDay ? weekOf("signups_trainer", latestDay) : 0;
  const signupsLastWeek = latestDay ? weekOf("signups_trainer", addDays(latestDay, -7)) : 0;

  const totalClients = clients?.n ?? 0;
  const wauClient = latest("wau_client");

  res.json({
    freshness: { lastRolledUpDay: latestDay, updatedAt: checkpoint?.updatedAt ?? null },
    totals: { trainers: trainers?.n ?? 0, clients: totalClients },
    weeklyActiveClientsRatio: totalClients > 0 ? wauClient / totalClients : null,
    latest: {
      dauTrainer: latest("dau_trainer"),
      dauClient: latest("dau_client"),
      wauTrainer: latest("wau_trainer"),
      wauClient,
      mauTrainer: latest("mau_trainer"),
      mauClient: latest("mau_client"),
    },
    signups: { thisWeek: signupsThisWeek, lastWeek: signupsLastWeek },
    series,
  });
});

const dateRange = z.object({ days: z.coerce.number().int().min(1).max(365).default(30) });

/**
 * "Where are new trainers actually coming from?" — `admin-dashboard-spec.md` §2.
 *
 * `acquisition_attribution` joined to `user`, bounded by signup date, same "raw events
 * for exploration, bounded by date range" posture as everywhere else in this file.
 * Referral is counted separately from UTM channel, never blended into one number —
 * `attribution-design.md`'s explicit instruction, since a studio could in principle
 * have both and adding the percentages together would double-count it.
 */
productAnalytics.get("/analytics/acquisition", async (req, res) => {
  const { days } = dateRange.parse(req.query);
  const since = sql.raw(`now() - interval '${days} days'`);

  const [channels, referred, totalNew] = await Promise.all([
    db.execute(sql`
      select
        coalesce(aa.first_touch_source, '(direct)') as source,
        coalesce(aa.first_touch_medium, '')          as medium,
        coalesce(aa.first_touch_campaign, '')        as campaign,
        count(distinct u.id)::int                    as signups
      from "user" u
      join membership m on m.user_id = u.id and m.role = 'owner'
      left join acquisition_attribution aa on aa.user_id = u.id
      where u.created_at >= ${since}
      group by 1, 2, 3
      order by signups desc
    `),
    db.execute(sql`
      select count(distinct m.user_id)::int as referred
      from membership m
      join referral r on r.studio_id = m.studio_id
      where m.role = 'owner' and m.user_id in (
        select id from "user" where created_at >= ${since}
      )
    `),
    db.execute(sql`
      select count(distinct u.id)::int as total
      from "user" u
      join membership m on m.user_id = u.id and m.role = 'owner'
      where u.created_at >= ${since}
    `),
  ]);

  res.json({
    days,
    totalNewTrainers: (totalNew.rows[0] as { total: number } | undefined)?.total ?? 0,
    referred: (referred.rows[0] as { referred: number } | undefined)?.referred ?? 0,
    channels: channels.rows,
  });
});

/**
 * "What features actually get used?" — `admin-dashboard-spec.md` §4.
 *
 * Feature-adoption: of the studios active in this window, what fraction had at least
 * one event for this feature — broken down by `studio.tier`, per the brief.
 */
productAnalytics.get("/analytics/product-usage", async (req, res) => {
  const { days } = dateRange.parse(req.query);
  const since = sql.raw(`now() - interval '${days} days'`);

  const FEATURES: Record<string, string[]> = {
    workouts: ["workout_session_completed"],
    nutrition: ["recipe_created", "mealplan_created"],
    check_ins: ["check_in_submitted"],
  };

  const [tierTotals, ...featureRows] = await Promise.all([
    db.execute(sql`
      select tier, count(*)::int as total
      from studio
      where deleted_at is null
      group by tier
    `),
    ...Object.entries(FEATURES).map(([feature, names]) =>
      db
        .execute(
          sql`
        select s.tier, count(distinct pe.studio_id)::int as adopted
        from product_event pe
        join studio s on s.id = pe.studio_id
        where pe.name in ${names} and pe.received_at >= ${since} and s.deleted_at is null
        group by s.tier
      `,
        )
        .then((r) => ({ feature, rows: r.rows as { tier: string; adopted: number }[] })),
    ),
  ]);

  const totalsByTier = new Map(
    (tierTotals.rows as { tier: string; total: number }[]).map((r) => [r.tier, r.total]),
  );

  res.json({
    days,
    features: featureRows.map(({ feature, rows }) => ({
      feature,
      byTier: rows.map((r) => ({
        tier: r.tier,
        adopted: r.adopted,
        total: totalsByTier.get(r.tier) ?? 0,
        rate: totalsByTier.get(r.tier) ? r.adopted / (totalsByTier.get(r.tier) as number) : null,
      })),
    })),
  });
});

/**
 * "How often do people come back and do something?" — `admin-dashboard-spec.md` §5.
 *
 * `analytics_session` (the materialized-session table) is schema-only so far — nothing
 * populates it yet, a gap flagged in `risks-and-open-questions.md` rather than papered
 * over. "Sessions a week" here is `session_started` events per distinct user per week
 * instead: a close proxy (it overcounts a user who force-quits and reopens the app
 * within one real sitting), good enough until that table is actually written to.
 */
productAnalytics.get("/analytics/engagement", async (req, res) => {
  const { days } = dateRange.parse(req.query);
  const since = sql.raw(`now() - interval '${days} days'`);

  const [sessionsPerUser, checkIns, workouts] = await Promise.all([
    db.execute(sql`
      select coalesce(
        count(*)::numeric / greatest(count(distinct user_id), 1) / (${days}::numeric / 7),
        0
      ) as sessions_per_user_per_week
      from product_event
      where name = 'session_started' and received_at >= ${since}
    `),
    db.execute(sql`
      select
        count(*)::int as submitted,
        count(*) filter (where (properties->>'on_time')::boolean)::int as on_time
      from product_event
      where name = 'check_in_submitted' and received_at >= ${since}
    `),
    db.execute(sql`
      select
        (select count(*) from product_event where name = 'workout_session_started' and received_at >= ${since})::int as started,
        (select count(*) from product_event where name = 'workout_session_completed' and received_at >= ${since})::int as completed
    `),
  ]);

  const checkInRow = checkIns.rows[0] as { submitted: number; on_time: number } | undefined;
  const workoutRow = workouts.rows[0] as { started: number; completed: number } | undefined;

  res.json({
    days,
    sessionsPerUserPerWeek: Number(
      (sessionsPerUser.rows[0] as { sessions_per_user_per_week: string } | undefined)
        ?.sessions_per_user_per_week ?? 0,
    ),
    checkInOnTimeRate:
      checkInRow && checkInRow.submitted > 0 ? checkInRow.on_time / checkInRow.submitted : null,
    workoutCompletionRate:
      workoutRow && workoutRow.started > 0 ? workoutRow.completed / workoutRow.started : null,
  });
});

/**
 * "Do people stick around?" — `admin-dashboard-spec.md` §6.
 *
 * Cohort = signup week (`studio.createdAt`). Cell = % of that week's studios whose
 * roster had >=1 "weekly active client" event in that week-since-signup window — the
 * one retention cut `metric-definitions.md` says matters most given the product's own
 * north-star metric. `cohortFilter` switches which studios count as in-cohort at all —
 * this toggle *is* the validation tool that document names: comparing the heatmap's
 * shape across the three candidate trainer-activation definitions.
 */
const COHORT_FILTERS = ["all", "narrow", "broad", "client"] as const;
const retentionQuery = z.object({
  weeks: z.coerce.number().int().min(1).max(16).default(8),
  cohortFilter: z.enum(COHORT_FILTERS).default("all"),
});

productAnalytics.get("/analytics/retention", async (req, res) => {
  const { weeks, cohortFilter } = retentionQuery.parse(req.query);

  // Every non-deleted studio with its signup week and, for each candidate definition,
  // whether it clears that bar — computed once, filtered in JS below.
  const studios = await db.execute(sql`
    select
      s.id as studio_id,
      date_trunc('week', s.created_at) as cohort_week,
      s.created_at,
      exists(
        select 1 from product_event pe
        where pe.studio_id = s.id and pe.name = 'client_joined'
          and pe.received_at <= s.created_at + interval '7 days'
      ) as narrow,
      exists(
        select 1 from product_event pe
        where pe.studio_id = s.id and pe.name = 'client_joined'
          and pe.received_at <= s.created_at + interval '7 days'
      ) and exists(
        select 1 from product_event pe
        where pe.studio_id = s.id and pe.name in ('workout_template_created', 'recipe_created')
          and pe.received_at <= s.created_at + interval '7 days'
      ) as broad
    from studio s
    where s.deleted_at is null
    order by cohort_week asc
  `);

  type StudioRow = {
    studio_id: string;
    cohort_week: Date | string;
    created_at: Date | string;
    narrow: boolean;
    broad: boolean;
  };
  const rows = studios.rows as StudioRow[];

  // "Client" activation is per-client, not per-studio — a studio counts as in-cohort
  // under this filter once any one of its clients clears the bar within 14 days of
  // joining (the one studio-level reading of a client-level definition that's still
  // computable without inventing a studio-wide average of per-client outcomes).
  const clientActivatedResult = await db.execute(sql`
    select distinct cj.studio_id
    from product_event cj
    join product_event act
      on act.user_id = cj.user_id
     and act.name in ('workout_session_completed', 'check_in_submitted')
     and act.received_at between cj.received_at and cj.received_at + interval '14 days'
    where cj.name = 'client_joined'
  `);
  const clientActivatedSet = new Set(
    (clientActivatedResult.rows as { studio_id: string }[]).map((r) => r.studio_id),
  );

  const cohortOf = (r: StudioRow) =>
    cohortFilter === "all" ||
    (cohortFilter === "narrow" && r.narrow) ||
    (cohortFilter === "broad" && r.broad) ||
    (cohortFilter === "client" && clientActivatedSet.has(r.studio_id));

  const inCohort = rows.filter(cohortOf);
  if (inCohort.length === 0) {
    res.json({ weeks, cohortFilter, cohorts: [] });
    return;
  }

  const studioIds = inCohort.map((r) => r.studio_id);
  // One "weekly active client" event, any studioId in the cohort, any time — the week
  // offset from that studio's own signup is computed in JS below.
  const activity = await db.execute(sql`
    select studio_id, received_at
    from product_event
    where studio_id in ${studioIds}
      and name in ${ENGAGEMENT_EVENTS}
  `);
  const activeWeeksByStudio = new Map<string, Set<number>>();
  for (const row of activity.rows as { studio_id: string; received_at: Date | string }[]) {
    const studio = inCohort.find((r) => r.studio_id === row.studio_id);
    if (!studio) continue;
    const signedUpAt = new Date(studio.created_at).getTime();
    const weekOffset = Math.floor(
      (new Date(row.received_at).getTime() - signedUpAt) / (7 * 86_400_000),
    );
    if (weekOffset < 0 || weekOffset >= weeks) continue;
    const set = activeWeeksByStudio.get(row.studio_id) ?? new Set<number>();
    set.add(weekOffset);
    activeWeeksByStudio.set(row.studio_id, set);
  }

  const byCohortWeek = new Map<string, StudioRow[]>();
  for (const r of inCohort) {
    const key = new Date(r.cohort_week).toISOString().slice(0, 10);
    const list = byCohortWeek.get(key) ?? [];
    list.push(r);
    byCohortWeek.set(key, list);
  }

  const cohorts = [...byCohortWeek.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, studiosInWeek]) => ({
      week,
      size: studiosInWeek.length,
      retention: Array.from({ length: weeks }, (_, w) => {
        const active = studiosInWeek.filter((s) =>
          activeWeeksByStudio.get(s.studio_id)?.has(w),
        ).length;
        return studiosInWeek.length > 0 ? active / studiosInWeek.length : null;
      }),
    }));

  res.json({ weeks, cohortFilter, cohorts });
});

/** The funnel list, for a picker — just enough to choose one before computing it. */
productAnalytics.get("/analytics/funnels", async (_req, res) => {
  const rows = await db
    .select({
      id: schema.funnelDefinitions.id,
      name: schema.funnelDefinitions.name,
      steps: schema.funnelDefinitions.steps,
    })
    .from(schema.funnelDefinitions)
    .orderBy(schema.funnelDefinitions.createdAt);
  res.json({
    funnels: rows.map((r) => ({
      id: r.id,
      name: r.name,
      stepCount: Array.isArray(r.steps) ? r.steps.length : 0,
    })),
  });
});

type FunnelStep = { name: string; properties?: Record<string, unknown> };

/**
 * "Where do people actually drop off?" — `admin-dashboard-spec.md` §3.
 *
 * Computed on demand from `product_event`, bounded by date range — a funnel is
 * exploration, not a chart on every page load, so (unlike Overview) it has no rollup.
 * Walked in JS rather than one large SQL query: correct and easy to follow beats a
 * clever aggregate for the row counts this product has today: see
 * `data-model.md`'s own "funnel/cohort exploration... bounded by date range" posture.
 */
productAnalytics.get("/analytics/funnels/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().max(64) }).parse(req.params);
  const { days } = dateRange.parse(req.query);

  const [def] = await db
    .select()
    .from(schema.funnelDefinitions)
    .where(eq(schema.funnelDefinitions.id, id))
    .limit(1);
  if (!def) {
    res.status(404).json({ error: "not_found", message: "No such funnel." });
    return;
  }

  const steps = def.steps as FunnelStep[];
  const names = [...new Set(steps.map((s) => s.name))];
  const since = sql.raw(`now() - interval '${days} days'`);

  const rows = await db.execute(sql`
    select user_id, name, properties, received_at
    from product_event
    where name in ${names} and user_id is not null and received_at >= ${since}
    order by received_at asc
  `);

  // For each user, the earliest timestamp matching each step (name + every property
  // filter the step declares) — a step with no filter matches any event of that name.
  const perUser = new Map<string, (Date | null)[]>();
  for (const row of rows.rows as {
    user_id: string;
    name: string;
    properties: Record<string, unknown>;
    received_at: Date;
  }[]) {
    const timestamps = perUser.get(row.user_id) ?? steps.map(() => null);
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (!step || step.name !== row.name) continue;
      const matches = Object.entries(step.properties ?? {}).every(
        ([k, v]) => row.properties?.[k] === v,
      );
      if (matches && !timestamps[i]) timestamps[i] = new Date(row.received_at);
    }
    perUser.set(row.user_id, timestamps);
  }

  const reachedCounts = steps.map(() => 0);
  const gapSamples: number[][] = steps.map(() => []);
  for (const timestamps of perUser.values()) {
    for (let i = 0; i < steps.length; i++) {
      if (!timestamps[i]) break; // this user's walk stops at the first missing step
      reachedCounts[i] = (reachedCounts[i] ?? 0) + 1;
      if (i > 0 && timestamps[i - 1]) {
        const gap = (timestamps[i] as Date).getTime() - (timestamps[i - 1] as Date).getTime();
        gapSamples[i]?.push(gap);
      }
    }
  }

  const median = (values: number[]): number | null => {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2
      ? (sorted[mid] as number)
      : ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
  };

  res.json({
    id: def.id,
    name: def.name,
    days,
    steps: steps.map((step, i) => ({
      name: step.name,
      properties: step.properties ?? {},
      reached: reachedCounts[i] ?? 0,
      dropOffRate:
        i === 0 || !reachedCounts[0]
          ? null
          : 1 - (reachedCounts[i] ?? 0) / (reachedCounts[i - 1] || 1),
      medianSecondsSincePreviousStep:
        i === 0
          ? null
          : (() => {
              const ms = median(gapSamples[i] ?? []);
              return ms === null ? null : Math.round(ms / 1000);
            })(),
    })),
  });
});

/** The event catalog, for the funnel builder's step picker — the server-side source of
 *  truth (`features/analytics/service.ts`), never duplicated as a second hardcoded list
 *  in the frontend. */
productAnalytics.get("/analytics/event-names", (_req, res) => {
  res.json({ names: EVENT_NAMES });
});

const funnelStepInput = z.object({
  name: z.string().min(1).max(64),
  // Only one filter key supported by the builder today — the single real case in the
  // seeded funnels (`step_index`) and every event this catalog currently defines with
  // more than one property. A second key is additive later if a real funnel needs it.
  propertyKey: z.string().max(64).optional(),
  propertyValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
});
const funnelInput = z.object({
  name: z.string().trim().min(1).max(120),
  steps: z.array(funnelStepInput).min(2).max(20),
});

function toStoredSteps(steps: z.infer<typeof funnelInput>["steps"]) {
  return steps.map((s) => ({
    name: s.name,
    ...(s.propertyKey && s.propertyValue !== undefined
      ? { properties: { [s.propertyKey]: s.propertyValue } }
      : {}),
  }));
}

/** The full funnel builder (`implementation-roadmap.md` Phase 4) — a funnel is data,
 *  not code, so creating/editing/retiring one needs no deploy. */
productAnalytics.post("/analytics/funnels", async (req, res) => {
  const body = funnelInput.parse(req.body);
  const [created] = await db
    .insert(schema.funnelDefinitions)
    .values({ id: crypto.randomUUID(), name: body.name, steps: toStoredSteps(body.steps) })
    .returning();
  res.status(201).json({ funnel: created });
});

productAnalytics.patch("/analytics/funnels/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().max(64) }).parse(req.params);
  const body = funnelInput.parse(req.body);
  const [updated] = await db
    .update(schema.funnelDefinitions)
    .set({ name: body.name, steps: toStoredSteps(body.steps) })
    .where(eq(schema.funnelDefinitions.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "not_found", message: "No such funnel." });
    return;
  }
  res.json({ funnel: updated });
});

productAnalytics.delete("/analytics/funnels/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().max(64) }).parse(req.params);
  const deleted = await db
    .delete(schema.funnelDefinitions)
    .where(eq(schema.funnelDefinitions.id, id))
    .returning({ id: schema.funnelDefinitions.id });
  if (!deleted.length) {
    res.status(404).json({ error: "not_found", message: "No such funnel." });
    return;
  }
  res.status(204).end();
});

/**
 * "Is the endorser program working?" — `admin-dashboard-spec.md` §10. Deliberately its
 * own page, never summed with Acquisition's UTM-channel numbers
 * (`attribution-design.md`'s "separate channel, not blended"). "Active" here means the
 * referred studio is not soft-deleted — the same bar `/admin/stats` and every other
 * studio count in this codebase already uses, not a new activity threshold invented
 * for this one page.
 */
productAnalytics.get("/analytics/referrals", async (req, res) => {
  const { days } = dateRange.parse(req.query);
  const since = sql.raw(`now() - interval '${days} days'`);

  const [codesCreated, referred] = await Promise.all([
    db.execute(sql`
      select count(*)::int as count from endorser
      where created_at >= ${since} and deleted_at is null
    `),
    db.execute(sql`
      select count(*)::int as total,
        count(*) filter (where s.deleted_at is null)::int as active
      from referral r
      join studio s on s.id = r.studio_id
      where r.created_at >= ${since}
    `),
  ]);

  const referredRow = referred.rows[0] as { total: number; active: number } | undefined;
  const total = referredRow?.total ?? 0;
  const active = referredRow?.active ?? 0;

  res.json({
    days,
    codesCreated: (codesCreated.rows[0] as { count: number } | undefined)?.count ?? 0,
    referralsAttributed: total,
    activeConversionRate: total > 0 ? active / total : null,
  });
});
