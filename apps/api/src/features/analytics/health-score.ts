import { schema } from "@traiv/db";
import { sql } from "drizzle-orm";
import { db } from "../../db.js";

// Duplicated from `rollup.ts` rather than imported, to avoid a circular import between
// the two files (`startAnalyticsRollup` calls this module; this module would otherwise
// need to import back from it).
function toDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function addDays(day: string, delta: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return toDay(d);
}

/**
 * The rule-based (0-100) studio health score — `metric-definitions.md`'s weight table,
 * exactly. Explainable, not predictive: every input that produced the score is stored
 * alongside it (`studioActivitySummaries.healthScoreExplanation`), and the admin UI is
 * required to label it "rule-based triage score, not a predictive model" every time it
 * shows the number — never present an arbitrary weighted score as validated.
 *
 * Run from the same hourly tick as the daily rollup (`startAnalyticsRollup`), but
 * operates on "right now," not a historical backfill walk — a health score is a current
 * snapshot, overwritten in place, never a time series of its own.
 */
const WEIGHTS = {
  loggedInWithin7Days: 25,
  activeClientEngaged: 25,
  coreFeatureUsed14d: 20,
  onboardingCompletionRate: 15,
  noDropInActiveClients30d: 15,
} as const;

const ENGAGEMENT_EVENTS = [
  "workout_session_completed",
  "check_in_submitted",
  "meal_logged",
  "measurement_logged",
];
const CORE_FEATURE_EVENTS = [
  "workout_template_created",
  "recipe_created",
  "mealplan_created",
  "check_in_schedule_set",
];

export async function computeHealthScores(): Promise<void> {
  const today = toDay(new Date());
  const thirtyDaysAgo = addDays(today, -30);

  const [
    studioOwners,
    lastLogins,
    activeClients,
    engaged,
    coreFeature,
    onboarding,
    baselineRows,
    recentWorkouts,
  ] = await Promise.all([
    db.execute(sql`
      select s.id as studio_id, m.user_id as owner_user_id
      from studio s
      join membership m on m.studio_id = s.id and m.role = 'owner'
        and m.status = 'active' and m.deleted_at is null
      where s.deleted_at is null
    `),
    db.execute(sql`
      select user_id, max(last_used_at) as last_used_at
      from session
      group by user_id
    `),
    db.execute(sql`
      select studio_id, count(*)::int as active_clients
      from client
      where deleted_at is null and status in ('active', 'paused')
      group by studio_id
    `),
    db.execute(sql`
      select distinct studio_id
      from product_event
      where name in ${ENGAGEMENT_EVENTS}
        and received_at >= now() - interval '7 days'
        and studio_id is not null
    `),
    db.execute(sql`
      select distinct studio_id
      from product_event
      where name in ${CORE_FEATURE_EVENTS}
        and received_at >= now() - interval '14 days'
        and studio_id is not null
    `),
    db.execute(sql`
      select c.studio_id,
        count(*) filter (where ui.completed_at is not null)::int as completed,
        count(*)::int as total
      from client c
      left join user_intake ui on ui.user_id = c.user_id
      where c.deleted_at is null and c.user_id is not null and c.status in ('active', 'paused')
      group by c.studio_id
    `),
    db.execute(sql`
      select studio_id, value from daily_metric_rollup
      where metric = 'active_clients' and day = ${thirtyDaysAgo} and studio_id != ${schema.PLATFORM_ROLLUP_SCOPE}
    `),
    db.execute(sql`
      select studio_id, max(received_at) as at
      from product_event
      where name = 'workout_session_completed' and studio_id is not null
      group by studio_id
    `),
  ]);

  const lastLoginByUser = new Map(
    (lastLogins.rows as { user_id: string; last_used_at: Date | string }[]).map((r) => [
      r.user_id,
      new Date(r.last_used_at),
    ]),
  );
  const activeClientsByStudio = new Map(
    (activeClients.rows as { studio_id: string; active_clients: number }[]).map((r) => [
      r.studio_id,
      r.active_clients,
    ]),
  );
  const engagedStudios = new Set((engaged.rows as { studio_id: string }[]).map((r) => r.studio_id));
  const coreFeatureStudios = new Set(
    (coreFeature.rows as { studio_id: string }[]).map((r) => r.studio_id),
  );
  const onboardingByStudio = new Map(
    (onboarding.rows as { studio_id: string; completed: number; total: number }[]).map((r) => [
      r.studio_id,
      r,
    ]),
  );
  const baselineByStudio = new Map(
    (baselineRows.rows as { studio_id: string; value: number }[]).map((r) => [
      r.studio_id,
      r.value,
    ]),
  );
  const recentWorkoutByStudio = new Map(
    (recentWorkouts.rows as { studio_id: string; at: Date | string }[]).map((r) => [
      r.studio_id,
      new Date(r.at),
    ]),
  );

  const sevenDaysAgoMs = Date.now() - 7 * 86_400_000;

  for (const row of studioOwners.rows as { studio_id: string; owner_user_id: string }[]) {
    const activeClientCount = activeClientsByStudio.get(row.studio_id) ?? 0;

    const lastUsedAt = lastLoginByUser.get(row.owner_user_id) ?? null;
    const loggedInWithin7Days = Boolean(lastUsedAt && lastUsedAt.getTime() >= sevenDaysAgoMs);

    const activeClientEngaged = engagedStudios.has(row.studio_id);
    const coreFeatureUsed14d = coreFeatureStudios.has(row.studio_id);

    const onboardingRow = onboardingByStudio.get(row.studio_id);
    const onboardingRate =
      onboardingRow && onboardingRow.total > 0
        ? onboardingRow.completed / onboardingRow.total
        : null; // no clients with an account yet — nothing to score, full credit below

    const baseline = baselineByStudio.get(row.studio_id);
    const noDropKnown = baseline !== undefined;
    const noDrop = !noDropKnown || activeClientCount >= baseline;

    const explanation = {
      loggedInWithin7Days: {
        pass: loggedInWithin7Days,
        weight: WEIGHTS.loggedInWithin7Days,
        lastLoginAt: lastUsedAt?.toISOString() ?? null,
      },
      activeClientEngaged: { pass: activeClientEngaged, weight: WEIGHTS.activeClientEngaged },
      coreFeatureUsed14d: { pass: coreFeatureUsed14d, weight: WEIGHTS.coreFeatureUsed14d },
      onboardingCompletionRate: {
        rate: onboardingRate,
        weight: WEIGHTS.onboardingCompletionRate,
        note: onboardingRate === null ? "no clients with an account yet — full credit" : null,
      },
      noDropInActiveClients30d: {
        pass: noDrop,
        weight: WEIGHTS.noDropInActiveClients30d,
        note: noDropKnown ? null : "no_baseline_yet",
        activeClientCount,
        baselineActiveClientCount: baseline ?? null,
      },
    };

    const score = Math.round(
      (loggedInWithin7Days ? WEIGHTS.loggedInWithin7Days : 0) +
        (activeClientEngaged ? WEIGHTS.activeClientEngaged : 0) +
        (coreFeatureUsed14d ? WEIGHTS.coreFeatureUsed14d : 0) +
        (onboardingRate === null
          ? WEIGHTS.onboardingCompletionRate
          : onboardingRate * WEIGHTS.onboardingCompletionRate) +
        (noDrop ? WEIGHTS.noDropInActiveClients30d : 0),
    );

    // Today's snapshot, for the comparison this same input makes 30 days from now.
    await db
      .insert(schema.dailyMetricRollups)
      .values({
        day: today,
        studioId: row.studio_id,
        metric: "active_clients",
        value: activeClientCount,
      })
      .onConflictDoUpdate({
        target: [
          schema.dailyMetricRollups.day,
          schema.dailyMetricRollups.studioId,
          schema.dailyMetricRollups.metric,
        ],
        set: { value: activeClientCount },
      });

    await db
      .insert(schema.studioActivitySummaries)
      .values({
        studioId: row.studio_id,
        lastLoginAt: lastUsedAt,
        activeClientCount,
        recentWorkoutActivityAt: recentWorkoutByStudio.get(row.studio_id) ?? null,
        healthScore: score,
        healthScoreExplanation: explanation,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.studioActivitySummaries.studioId,
        set: {
          lastLoginAt: lastUsedAt,
          activeClientCount,
          recentWorkoutActivityAt: recentWorkoutByStudio.get(row.studio_id) ?? null,
          healthScore: score,
          healthScoreExplanation: explanation,
          updatedAt: new Date(),
        },
      });
  }
}
