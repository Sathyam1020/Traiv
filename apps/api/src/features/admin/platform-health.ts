import { schema } from "@traiv/db";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { requireAdmin } from "../../middleware/admin.js";
import { requireSession } from "../../middleware/session.js";
import { recordOperationalEvent } from "../analytics/operational.js";
import { ROLLUP_NAME } from "../analytics/rollup.js";

/**
 * "Which accounts need attention?" (§8), "Is anything actually broken right now?"
 * (§11), and "Can I trust the numbers on the other pages?" (§12) —
 * `admin-dashboard-spec.md`. Grouped in one file because, unlike the product pages in
 * `product-analytics.ts`, these three share a theme: platform operations, not product
 * usage — one reads `studio_activity_summary`, two read `operational_event`/the
 * rollup's own checkpoint, and none of them ever join to `product_event` directly.
 */
export const platformHealth: Router = Router();

platformHealth.use(requireAdmin());

/** Sortable/filterable table, by health score, last login, or active-client count. */
const studiosQuery = z.object({
  sort: z.enum(["healthScore", "lastLoginAt", "activeClientCount"]).default("healthScore"),
  order: z.enum(["asc", "desc"]).default("asc"),
  limit: z.coerce.number().int().min(1).max(500).default(100),
});

platformHealth.get("/analytics/studios", async (req, res) => {
  const { sort, order, limit } = studiosQuery.parse(req.query);

  const column = {
    healthScore: schema.studioActivitySummaries.healthScore,
    lastLoginAt: schema.studioActivitySummaries.lastLoginAt,
    activeClientCount: schema.studioActivitySummaries.activeClientCount,
  }[sort];

  const rows = await db
    .select({
      studioId: schema.studios.id,
      name: schema.studios.name,
      tier: schema.studios.tier,
      healthScore: schema.studioActivitySummaries.healthScore,
      lastLoginAt: schema.studioActivitySummaries.lastLoginAt,
      activeClientCount: schema.studioActivitySummaries.activeClientCount,
      updatedAt: schema.studioActivitySummaries.updatedAt,
    })
    .from(schema.studios)
    .leftJoin(
      schema.studioActivitySummaries,
      eq(schema.studioActivitySummaries.studioId, schema.studios.id),
    )
    .where(isNull(schema.studios.deletedAt))
    .orderBy(order === "asc" ? column : desc(column))
    .limit(limit);

  res.json({ studios: rows, scoreLabel: "Rule-based triage score, not a predictive model" });
});

/** The per-studio drilldown — why the score is what it is, plus a roster snapshot. */
platformHealth.get("/analytics/studios/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().max(64) }).parse(req.params);

  const [studio] = await db
    .select({
      id: schema.studios.id,
      name: schema.studios.name,
      tier: schema.studios.tier,
      createdAt: schema.studios.createdAt,
    })
    .from(schema.studios)
    .where(and(eq(schema.studios.id, id), isNull(schema.studios.deletedAt)))
    .limit(1);
  if (!studio) {
    res.status(404).json({ error: "not_found", message: "No such studio." });
    return;
  }

  const [summary] = await db
    .select()
    .from(schema.studioActivitySummaries)
    .where(eq(schema.studioActivitySummaries.studioId, id))
    .limit(1);

  const roster = await db
    .select({
      id: schema.clients.id,
      name: schema.clients.name,
      status: schema.clients.status,
      joinedVia: schema.clients.joinedVia,
    })
    .from(schema.clients)
    .where(and(eq(schema.clients.studioId, id), isNull(schema.clients.deletedAt)))
    .orderBy(desc(schema.clients.createdAt))
    .limit(50);

  // The most recent handful of real events, for "recent activity" — this is the one
  // place raw-ish `product_event` rows surface to a human, so every view of it is
  // itself an `operational_event` (`admin_drilldown_viewed`), per `privacy-security.md`.
  const recentActivity = await db
    .select({
      name: schema.productEvents.name,
      receivedAt: schema.productEvents.receivedAt,
      actorRole: schema.productEvents.actorRole,
    })
    .from(schema.productEvents)
    .where(eq(schema.productEvents.studioId, id))
    .orderBy(desc(schema.productEvents.receivedAt))
    .limit(20);

  const { userId: adminUserId } = requireSession(req);
  void recordOperationalEvent({
    name: "admin_drilldown_viewed",
    route: req.path,
    error: JSON.stringify({ adminUserId, studioId: id }),
  });

  res.json({
    studio,
    healthScore: summary?.healthScore ?? null,
    healthScoreExplanation: summary?.healthScoreExplanation ?? null,
    scoreLabel: "Rule-based triage score, not a predictive model",
    activeClientCount: summary?.activeClientCount ?? 0,
    lastLoginAt: summary?.lastLoginAt ?? null,
    recentWorkoutActivityAt: summary?.recentWorkoutActivityAt ?? null,
    roster,
    recentActivity,
  });
});

/** "Is anything actually broken right now?" — error rate, job failures, p50/p95. */
platformHealth.get("/analytics/system-health", async (_req, res) => {
  const since = sql.raw("now() - interval '24 hours'");

  const [byRoute, latency, jobFailures] = await Promise.all([
    db.execute(sql`
      select
        route,
        count(*) filter (where name = 'api_request_completed')::int as total,
        count(*) filter (where name = 'api_request_failed')::int as failed
      from operational_event
      where received_at >= ${since} and route is not null
      group by route
      order by failed desc, total desc
      limit 25
    `),
    db.execute(sql`
      select
        percentile_cont(0.5) within group (order by duration_ms) as p50,
        percentile_cont(0.95) within group (order by duration_ms) as p95
      from operational_event
      where name = 'api_request_completed' and received_at >= ${since} and duration_ms is not null
    `),
    db.execute(sql`
      select count(*)::int as count
      from operational_event
      where name = 'job_failed' and received_at >= ${since}
    `),
  ]);

  const latencyRow = latency.rows[0] as { p50: string | null; p95: string | null } | undefined;

  res.json({
    sinceHours: 24,
    byRoute: byRoute.rows,
    latencyMs: {
      p50: latencyRow?.p50 ? Math.round(Number(latencyRow.p50)) : null,
      p95: latencyRow?.p95 ? Math.round(Number(latencyRow.p95)) : null,
    },
    jobFailures: (jobFailures.rows[0] as { count: number } | undefined)?.count ?? 0,
  });
});

/** "Can I trust the numbers on the other pages?" — the one page that answers that. */
platformHealth.get("/analytics/data-quality", async (_req, res) => {
  const [todayCount, trailingAvg, checkpoint, schemaFailures] = await Promise.all([
    db.execute(sql`
      select count(*)::int as count from product_event
      where received_at >= now() - interval '24 hours'
    `),
    db.execute(sql`
      select coalesce(avg(daily)::int, 0) as avg_daily from (
        select date_trunc('day', received_at) as day, count(*) as daily
        from product_event
        where received_at >= now() - interval '8 days' and received_at < now() - interval '1 day'
        group by 1
      ) d
    `),
    db
      .select()
      .from(schema.analyticsCheckpoints)
      .where(eq(schema.analyticsCheckpoints.rollupName, ROLLUP_NAME))
      .limit(1),
    db.execute(sql`
      select count(*)::int as count from operational_event
      where name = 'api_request_failed' and route = '/analytics/events'
        and received_at >= now() - interval '24 hours'
    `),
  ]);

  const today = (todayCount.rows[0] as { count: number } | undefined)?.count ?? 0;
  const avgDaily = (trailingAvg.rows[0] as { avg_daily: number } | undefined)?.avg_daily ?? 0;
  // Flagged only in one direction worth a founder's attention: a steep *drop* against
  // the trailing week, not a healthy-looking spike — a redesign driving more usage
  // should never light up as if the pipeline broke.
  const volumeAnomaly = avgDaily > 0 && today < avgDaily * 0.5;

  const checkpointRow = checkpoint[0] ?? null;
  const rollupLagHours = checkpointRow
    ? Math.round((Date.now() - new Date(checkpointRow.updatedAt).getTime()) / 3_600_000)
    : null;

  res.json({
    eventsToday: today,
    trailingSevenDayAverage: avgDaily,
    volumeAnomaly,
    rollupLagHours,
    lastRolledUpDay: checkpointRow?.lastProcessedDay ?? null,
    schemaValidationFailuresLast24h:
      (schemaFailures.rows[0] as { count: number } | undefined)?.count ?? 0,
  });
});
