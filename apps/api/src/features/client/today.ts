import { schema } from "@traiv/db";
import { and, asc, desc, eq, gte, isNotNull, isNull } from "drizzle-orm";
import { db } from "../../db.js";
import { checkInState, type Day, ensureCheckIns, today } from "../studio/check-ins.js";

/**
 * Everything the client's home screen needs, in one request.
 *
 * Coachway's client fetches `/app/today` once and renders the whole screen from it, and
 * that is the right shape here for a reason this codebase has already written down:
 * `personas.md` describes a budget Android on basement-gym signal. Six round trips to
 * paint one screen is six chances to fail, and the Neon handshake from India is 2-4s
 * against a 50ms query — latency here is per *request*, not per row.
 */

/** Points on the weight sparkline. Enough to read a direction, not a medical chart. */
const WEIGHT_POINTS = 12;
const RECENT_SESSIONS = 3;

export type TodayPayload = Awaited<ReturnType<typeof getToday>>;

/**
 * No `studioId` parameter on purpose: `requireClient` has already resolved this client
 * id *within* a studio, so the id is the scope. Taking the studio again would invite a
 * caller to pass one that disagrees with it.
 */
export async function getToday(clientId: string, userId: string | null, now: Day = today()) {
  // Idempotent, and cheap when there is nothing to add. Keeping it on the read means a
  // client who signed up between cron runs still has a check-in to do, and the horizon
  // never runs dry because a scheduled job was quietly failing.
  await ensureCheckIns(clientId, now);

  const [client, due, weights, measurements, sessions, workoutPlan, goal, first] =
    await Promise.all([
      db
        .select({ name: schema.clients.name, goal: schema.clients.goal })
        .from(schema.clients)
        .where(eq(schema.clients.id, clientId))
        .limit(1),

      /**
       * The one check-in to act on: the earliest still open.
       *
       * `closes_on >= now` excludes the missed ones, which is what makes this "what can I
       * do" rather than "what did I fail at". An overdue one sorts first because its due
       * date is earlier, so urgency falls out of the ordering rather than a CASE.
       */
      db
        .select({
          id: schema.checkIns.id,
          dueOn: schema.checkIns.dueOn,
          closesOn: schema.checkIns.closesOn,
          status: schema.checkIns.status,
        })
        .from(schema.checkIns)
        .where(
          and(
            eq(schema.checkIns.clientId, clientId),
            eq(schema.checkIns.status, "pending"),
            gte(schema.checkIns.closesOn, now),
          ),
        )
        .orderBy(asc(schema.checkIns.dueOn))
        .limit(1),

      // Keyed on the user, not the client: the series belongs to the body, and somebody
      // with two coaches has one weight. Null userId is a coach-entered client with no
      // account yet, who has no series to show.
      userId
        ? db
            .select({ takenAt: schema.bodyMetrics.takenAt, weightKg: schema.bodyMetrics.weightKg })
            .from(schema.bodyMetrics)
            .where(eq(schema.bodyMetrics.userId, userId))
            .orderBy(desc(schema.bodyMetrics.takenAt))
            .limit(WEIGHT_POINTS)
        : Promise.resolve([]),

      /**
       * The latest value of each length metric — waist, hips, chest.
       *
       * `DISTINCT ON` over (metric, completed desc) is one pass; the alternative is a
       * correlated max() subquery per metric, and this screen already costs one round trip
       * too many. Ordering must lead with the distinct expression, which is why metric id
       * comes first and the display sort happens in JS.
       */
      db
        .selectDistinctOn([schema.metrics.id], {
          code: schema.metrics.code,
          name: schema.metrics.name,
          unit: schema.metrics.unit,
          position: schema.metrics.position,
          value: schema.checkInAnswers.numberValue,
          takenAt: schema.checkIns.completedAt,
          // Which check-in recorded it, so the client can open the one being quoted.
          checkInId: schema.checkIns.id,
        })
        .from(schema.checkInAnswers)
        .innerJoin(schema.metrics, eq(schema.metrics.id, schema.checkInAnswers.metricId))
        .innerJoin(schema.checkIns, eq(schema.checkIns.id, schema.checkInAnswers.checkInId))
        .where(
          and(
            eq(schema.checkIns.clientId, clientId),
            eq(schema.metrics.unitCategory, "length"),
            isNotNull(schema.checkInAnswers.numberValue),
          ),
        )
        .orderBy(asc(schema.metrics.id), desc(schema.checkIns.completedAt)),

      db
        .select({
          id: schema.sessions_.id,
          date: schema.sessions_.date,
          completedAt: schema.sessions_.completedAt,
        })
        .from(schema.sessions_)
        .where(
          and(eq(schema.sessions_.clientId, clientId), isNotNull(schema.sessions_.completedAt)),
        )
        .orderBy(desc(schema.sessions_.date))
        .limit(RECENT_SESSIONS),

      // A published programme that is this client's own copy — their trainer app
      // shows "No workout programs yet" until a coach duplicates a template onto this
      // client, and "Pull — Draft" stays invisible to the client until published. Both
      // facts are the same query: `clientId` scopes to a copy, `status = 'active'`
      // scopes to published.
      db
        .select({ id: schema.workoutTemplates.id })
        .from(schema.workoutTemplates)
        .where(
          and(
            eq(schema.workoutTemplates.clientId, clientId),
            eq(schema.workoutTemplates.status, "active"),
            isNull(schema.workoutTemplates.archivedAt),
          ),
        )
        .limit(1),

      // The goal weight they set during onboarding. It is what turns a number into
      // progress — Coachway's weight card is a Start-to-Goal bar, and without a goal there
      // is nothing to be a fraction of.
      userId
        ? db
            .select({ targetWeightKg: schema.userIntakes.targetWeightKg })
            .from(schema.userIntakes)
            .where(eq(schema.userIntakes.userId, userId))
            .limit(1)
        : Promise.resolve([]),

      // The *first* weigh-in, which is the fixed end of the Start-to-Goal bar. It cannot
      // come off `series`: that holds only the last twelve, so the bar would creep forward
      // as early history scrolled out of the window and the client would appear to lose
      // progress they had actually made.
      userId
        ? db
            .select({ weightKg: schema.bodyMetrics.weightKg })
            .from(schema.bodyMetrics)
            .where(eq(schema.bodyMetrics.userId, userId))
            .orderBy(asc(schema.bodyMetrics.takenAt))
            .limit(1)
        : Promise.resolve([]),
    ]);

  const open = due[0] ? { ...due[0], state: checkInState(due[0], now) } : null;

  // Oldest first for a chart; the query took the newest N, so reverse rather than sort.
  const series = weights
    .map((w) => ({ date: w.takenAt.toISOString().slice(0, 10), kg: w.weightKg }))
    .reverse();

  const latest = series.at(-1);
  const previous = series.at(-2);

  return {
    name: client[0]?.name ?? "",
    firstName: (client[0]?.name ?? "").trim().split(/\s+/u)[0] ?? "",
    goal: client[0]?.goal ?? null,

    checkIn: open,

    weight: {
      series,
      latest: latest?.kg ?? null,
      // Against the previous weigh-in, not against the start. "Since last time" is the
      // question somebody standing on a scale is actually asking.
      delta: latest && previous ? round1(latest.kg - previous.kg) : null,
      start: first[0]?.weightKg ?? null,
      goal: goal[0]?.targetWeightKg ?? null,
    },

    measurements: measurements
      .filter((m) => m.value !== null)
      .sort((a, b) => a.position - b.position)
      .map((m) => ({
        code: m.code,
        name: m.name,
        unit: m.unit,
        value: m.value as number,
        takenOn: m.takenAt?.toISOString().slice(0, 10) ?? null,
        checkInId: m.checkInId,
      })),

    recentSessions: sessions.map((s) => ({
      id: s.id,
      date: s.date,
      completedAt: s.completedAt?.toISOString() ?? null,
    })),

    /**
     * Which tabs this client should see.
     *
     * `competitor-client-apps.md`: Trainerize hides a tab until the coach has actually
     * put something in it, and that is "the one idea worth stealing outright". A client
     * whose coach has not written a plan gets four tabs that do something rather than
     * six, two of which are apologies. The server decides, because the server is what
     * knows.
     */
    reveal: {
      workouts: workoutPlan.length > 0,
      food: true,
      // Every admitted client can message their coach independently of assigned plans.
      chat: true,
    },
  };
}

const round1 = (n: number) => Math.round(n * 10) / 10;
