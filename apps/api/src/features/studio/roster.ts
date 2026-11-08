import { newId, schema } from "@traiv/db";
import type { ActivityLevel, DietType, Goal, HealthFlag, Sex } from "@traiv/nutrition";
import { energyTarget } from "@traiv/nutrition";
import { and, asc, desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import { db } from "../../db.js";
import { badRequest, notFound } from "../../errors.js";

/**
 * The coach's roster.
 *
 * Everything here is scoped by `studioId`, which the route takes from the URL and
 * `requireStudio` proves — never from the session. ADR 0014: the tenant is in the path
 * or it is nowhere.
 */

/**
 * The four the coach's tabs show. `waiting` and `frozen` are not states a coach set
 * (ADR 0013, deferred) and stay off the roster entirely.
 *
 * `pending` is not a fifth value on `client_status` — it is `active` plus "has an
 * account but hasn't finished the 15-step intake yet," computed at read time. A coach
 * cannot set a client to pending, which is exactly right: it describes where the client
 * is, not a decision the coach made, and it clears itself the moment intake completes.
 */
export const ROSTER_STATUSES = ["active", "pending", "paused", "archived"] as const;
export type RosterStatus = (typeof ROSTER_STATUSES)[number];

/** What a coach can actually set via PATCH. `pending` is read-only — see above. */
export const SETTABLE_CLIENT_STATUSES = ["active", "paused", "archived"] as const;
export type SettableClientStatus = (typeof SETTABLE_CLIENT_STATUSES)[number];

/** How recently a check-in must have been submitted to count as new to read. */
const FRESH_DAYS = 7;
/** How close to the end date counts as "ending soon". */
const ENDING_DAYS = 30;

export const FILTERS = ["all", "unread", "new-checkin", "missing-checkin", "ending-soon"] as const;
export type Filter = (typeof FILTERS)[number];

/**
 * The signals the chips count, as SQL fragments over one correlated subquery each.
 *
 * `last_session` is the most recent completed `training_session` for the client. A client
 * who has never logged one is stale by definition — they joined and never started, which
 * is exactly who the coach wants to see.
 *
 * `unread` has no source: there is no messages table yet. It is here rather than removed
 * so the chip exists the day messaging does, and it correctly counts zero until then —
 * there genuinely are no unread messages.
 */
/**
 * The outer column is written out, not interpolated.
 *
 * `${schema.clients.id}` renders **unqualified** — a bare `"id"` — and inside this
 * subquery that resolves to `training_session.id`, so the correlation compares a client
 * id against a session id, matches nothing, and every client comes back as having never
 * trained. It typechecks, it runs, and it is silently wrong. See the Drizzle notes in
 * `.ai/engineering/dependencies.md`.
 */
const CLIENT_ID = sql.raw('"client"."id"');
/** Same reasoning as `CLIENT_ID` — `${schema.clients.userId}` interpolated inside a
 * nested subquery renders as a bare, unqualified `"user_id"`, which `user_intake` also
 * has a column named. Unqualified, it resolves to the subquery's own `user_id`, not the
 * outer client's, and the check becomes `ui.user_id = ui.user_id` — always true. */
const CLIENT_USER_ID = sql.raw('"client"."user_id"');

/** Has an account, and hasn't finished the 15-step intake. See `ROSTER_STATUSES`. */
const pendingOnboarding = sql<boolean>`(
  ${CLIENT_USER_ID} is not null
  and not exists (
    select 1 from user_intake ui
    where ui.user_id = ${CLIENT_USER_ID} and ui.completed_at is not null
  )
)`;

/** What a tab or a row's badge actually shows — `client.status` with `pending` carved
 * out of `active`, not a value the column itself ever holds. */
const displayStatus = sql<RosterStatus>`(case
  when ${schema.clients.status} = 'active' and ${pendingOnboarding} then 'pending'
  else ${schema.clients.status}::text
end)`;

const lastSession = sql<Date | null>`(
  select max(ts.completed_at) from training_session ts
  where ts.client_id = ${CLIENT_ID} and ts.completed_at is not null
)`;

/** The Plans column's two signals — same "active, published, not archived" and "active,
 * not archived" definitions `getClientOverview`'s `currentPlan` and `listClientPrograms`
 * already use, just read in bulk for the roster rather than per client. */
const currentMealPlan = sql<{ id: string; name: string } | null>`(
  select json_build_object('id', mp.id, 'name', mp.name)
  from meal_plan_template mp
  where mp.client_id = ${CLIENT_ID}
    and mp.status = 'active' and mp.published_document is not null and mp.archived_at is null
  order by mp.created_at desc
  limit 1
)`;

const currentWorkoutPlan = sql<{ id: string; name: string } | null>`(
  select json_build_object('id', wt.id, 'name', wt.name)
  from workout_template wt
  where wt.client_id = ${CLIENT_ID} and wt.status = 'active' and wt.archived_at is null
  order by wt.created_at desc
  limit 1
)`;

/**
 * A check-in that was due and never submitted, and one submitted recently.
 *
 * These replace what used to be staleness heuristics over `training_session` — "nobody
 * has logged a workout for ten days" was the closest thing available before check-ins
 * existed, and it answered a different question. `CLIENT_ID` is raw for the same reason
 * as `lastSession`: an interpolated column renders unqualified and silently binds to
 * the wrong table inside the subquery.
 */
const missedCheckIn = sql<boolean>`exists (
  select 1 from check_in c
  where c.client_id = ${CLIENT_ID} and c.status = 'pending' and c.closes_on < current_date
)`;

const recentCheckIn = sql<boolean>`exists (
  select 1 from check_in c
  where c.client_id = ${CLIENT_ID} and c.status = 'completed'
    and c.completed_at >= now() - interval '${sql.raw(String(FRESH_DAYS))} days'
)`;

const SIGNALS = {
  all: sql`true`,
  unread: sql`false`,
  "new-checkin": recentCheckIn,
  "missing-checkin": missedCheckIn,
  "ending-soon": sql`(
    ${schema.clients.endsAt} is not null
    and ${schema.clients.endsAt} <= now() + interval '${sql.raw(String(ENDING_DAYS))} days'
  )`,
} satisfies Record<Filter, unknown>;

export type RosterQuery = {
  studioId: string;
  viewerId?: string;
  status: RosterStatus;
  filter: Filter;
  search?: string;
  sort: "duration" | "name" | "recent";
  page: number;
  perPage: number;
};

const alive = (studioId: string) =>
  and(eq(schema.clients.studioId, studioId), isNull(schema.clients.deletedAt));

export async function listRoster(q: RosterQuery) {
  const signals = {
    ...SIGNALS,
    unread: sql`exists (select 1 from chat_message m where m.client_id=${CLIENT_ID} and m.author in ('client','activity') and m.created_at > coalesce((select r.read_at from chat_read r where r.client_id=${CLIENT_ID} and r.channel=m.channel and r.user_id=${q.viewerId ?? ""}), '-infinity'::timestamptz))`,
  };
  const base = alive(q.studioId);
  const search = q.search?.trim();

  // `pending` carves itself out of `active` rather than being a column value — see
  // `ROSTER_STATUSES`. Each tab's WHERE has to mirror that split, or a client would
  // show up under both Active and Pending (or neither).
  const statusMatch =
    q.status === "pending"
      ? and(eq(schema.clients.status, "active"), pendingOnboarding)
      : q.status === "active"
        ? and(eq(schema.clients.status, "active"), sql`not (${pendingOnboarding})`)
        : eq(schema.clients.status, q.status);

  const where = and(
    base,
    statusMatch,
    signals[q.filter],
    search ? sql`${schema.clients.name} ilike ${`%${search}%`}` : undefined,
  );

  // `startedAt`, not `createdAt` — "duration" and "recent" are both claims about when
  // the coaching actually began, and a backfilled client's row can be added today for a
  // relationship that started months ago.
  const order =
    q.sort === "name"
      ? [asc(schema.clients.name)]
      : q.sort === "recent"
        ? [desc(schema.clients.startedAt)]
        : [asc(schema.clients.startedAt)];

  const [rows, [total], statusCounts, filterCounts, allTags] = await Promise.all([
    db
      .select({
        id: schema.clients.id,
        name: schema.clients.name,
        status: displayStatus,
        startedAt: schema.clients.startedAt,
        endsAt: schema.clients.endsAt,
        lastSessionAt: lastSession,
        lastMessage: sql<{
          body: string;
          kind: string;
          createdAt: string;
        } | null>`(select json_build_object('body',m.body,'kind',m.kind,'createdAt',m.created_at) from chat_message m where m.client_id=${CLIENT_ID} order by m.created_at desc,m.id desc limit 1)`,
        mealPlan: currentMealPlan,
        workoutPlan: currentWorkoutPlan,
        checkInsEnabled: schema.clients.checkInsEnabled,
      })
      .from(schema.clients)
      .where(where)
      .orderBy(...order)
      .limit(q.perPage)
      .offset((q.page - 1) * q.perPage),

    db.select({ n: sql<number>`count(*)::int` }).from(schema.clients).where(where),

    // One pass for every tab's count, so the header does not cost four queries.
    // Grouped by the same carved-out status every tab filters on, not the raw column —
    // otherwise a pending client would count toward Active's tab number too.
    db
      .select({ status: displayStatus, n: sql<number>`count(*)::int` })
      .from(schema.clients)
      .where(base)
      .groupBy(displayStatus),

    // And one for every chip, within the tab being looked at.
    db
      .select({
        unread: sql<number>`count(*) filter (where ${signals.unread})::int`,
        newCheckin: sql<number>`count(*) filter (where ${signals["new-checkin"]})::int`,
        missingCheckin: sql<number>`count(*) filter (where ${signals["missing-checkin"]})::int`,
        endingSoon: sql<number>`count(*) filter (where ${signals["ending-soon"]})::int`,
        all: sql<number>`count(*)::int`,
      })
      .from(schema.clients)
      .where(and(base, statusMatch)),

    db
      .select({
        clientId: schema.clientTags.clientId,
        id: schema.tags.id,
        name: schema.tags.name,
        color: schema.tags.color,
      })
      .from(schema.clientTags)
      .innerJoin(schema.tags, eq(schema.tags.id, schema.clientTags.tagId))
      .innerJoin(schema.clients, eq(schema.clients.id, schema.clientTags.clientId))
      .where(base)
      .orderBy(asc(schema.tags.name)),
  ]);

  const tagsByClient = new Map<string, { id: string; name: string; color: string }[]>();
  for (const t of allTags) {
    const list = tagsByClient.get(t.clientId) ?? [];
    list.push({ id: t.id, name: t.name, color: t.color });
    tagsByClient.set(t.clientId, list);
  }

  const counts = Object.fromEntries(statusCounts.map((r) => [r.status, r.n]));
  const chips = filterCounts[0];

  return {
    clients: rows.map((r) => ({ ...r, tags: tagsByClient.get(r.id) ?? [] })),
    total: total?.n ?? 0,
    page: q.page,
    perPage: q.perPage,
    statuses: {
      active: counts.active ?? 0,
      pending: counts.pending ?? 0,
      paused: counts.paused ?? 0,
      archived: counts.archived ?? 0,
    },
    filters: {
      all: chips?.all ?? 0,
      unread: chips?.unread ?? 0,
      "new-checkin": chips?.newCheckin ?? 0,
      "missing-checkin": chips?.missingCheckin ?? 0,
      "ending-soon": chips?.endingSoon ?? 0,
    },
  };
}

/**
 * One client, for the top of their own screen.
 *
 * Six queries at once rather than six in a row: they do not depend on each other, and a
 * round trip to Neon from India is about 250ms, so in sequence this screen would open in
 * a second and a half instead of a quarter of one.
 *
 * The personal facts — age, sex, height, weight — hang off `users.id`, not off this
 * client row, because a person answers the intake once however many coaches they have
 * (ADR 0004). `client.userId` is nullable, so a client the coach added by hand and who
 * has never signed in genuinely has none of it. That is `hasAccount: false`, and it is a
 * state the screen has to show rather than a set of empty fields.
 */
export async function getClient(studioId: string, clientId: string) {
  const [row] = await db
    .select({
      id: schema.clients.id,
      userId: schema.clients.userId,
      name: schema.clients.name,
      status: displayStatus,
      goal: schema.clients.goal,
      constraints: schema.clients.constraints,
      startedAt: schema.clients.startedAt,
      endsAt: schema.clients.endsAt,
      activatedAt: schema.clients.activatedAt,
      coachId: schema.clients.coachId,
    })
    .from(schema.clients)
    .where(and(alive(studioId), eq(schema.clients.id, clientId)))
    .limit(1);

  if (!row) throw notFound("No such client.");

  const forUser = <T>(q: Promise<T>, empty: T) => (row.userId ? q : Promise.resolve(empty));

  const [coach, tags, intake, weights, lastSession, account] = await Promise.all([
    db
      .select({ name: schema.users.name })
      .from(schema.memberships)
      .innerJoin(schema.users, eq(schema.users.id, schema.memberships.userId))
      .where(eq(schema.memberships.id, row.coachId))
      .limit(1),

    listClientTags(clientId),

    forUser(
      db
        .select({
          sex: schema.userIntakes.sex,
          birthYear: schema.userIntakes.birthYear,
          heightCm: schema.userIntakes.heightCm,
          goal: schema.userIntakes.goal,
          targetWeightKg: schema.userIntakes.targetWeightKg,
          completedAt: schema.userIntakes.completedAt,
        })
        .from(schema.userIntakes)
        .where(eq(schema.userIntakes.userId, row.userId as string))
        .limit(1),
      [],
    ),

    // Two rows: the newest, and the newest from more than a week ago. That is every
    // number the weight line needs — where they are, and which way they are going.
    forUser(
      db
        .select({ weightKg: schema.bodyMetrics.weightKg, takenAt: schema.bodyMetrics.takenAt })
        .from(schema.bodyMetrics)
        .where(eq(schema.bodyMetrics.userId, row.userId as string))
        .orderBy(desc(schema.bodyMetrics.takenAt))
        .limit(2),
      [],
    ),

    db
      .select({ completedAt: schema.sessions_.completedAt })
      .from(schema.sessions_)
      .where(and(eq(schema.sessions_.clientId, clientId), isNotNull(schema.sessions_.completedAt)))
      .orderBy(desc(schema.sessions_.completedAt))
      .limit(1),

    forUser(
      db
        .select({ lastSeenAt: schema.users.lastSeenAt })
        .from(schema.users)
        .where(eq(schema.users.id, row.userId as string))
        .limit(1),
      [],
    ),
  ]);

  const { userId, coachId, ...client } = row;

  return {
    ...client,
    hasAccount: userId !== null,
    coachName: coach[0]?.name ?? null,
    tags,
    intake: intake[0] ?? null,
    weightKg: weights[0]?.weightKg ?? null,
    weightTakenAt: weights[0]?.takenAt ?? null,
    lastSessionAt: lastSession[0]?.completedAt ?? null,
    lastSeenAt: account[0]?.lastSeenAt ?? null,
  };
}

/* -------------------------------------------------------------------------- */
/* The overview                                                                */
/* -------------------------------------------------------------------------- */

/** The training window the overview summarises. */
const TRAINING_WINDOW_DAYS = 30;

/**
 * Everything the client's overview screen shows, in one request.
 *
 * One aggregate rather than six round trips, because the alternative is six sequential
 * trips to a database on another continent. The five reads below do not depend on each
 * other, so they go out together.
 *
 * `energy` and `nutrition` are null when the client has no account. Age, sex, height and
 * weight hang off `users.id` — a person answers the intake once however many coaches
 * they have (ADR 0004) — so a client the coach typed in genuinely has none of it. Four
 * nulls cannot be told apart from four unanswered questions; `hasAccount` can.
 */
export async function getClientOverview(studioId: string, clientId: string) {
  const [row] = await db
    .select({
      id: schema.clients.id,
      userId: schema.clients.userId,
      startedAt: schema.clients.startedAt,
      endsAt: schema.clients.endsAt,
      activatedAt: schema.clients.activatedAt,
      goal: schema.clients.goal,
      constraints: schema.clients.constraints,
    })
    .from(schema.clients)
    .where(and(alive(studioId), eq(schema.clients.id, clientId)))
    .limit(1);

  if (!row) throw notFound("No such client.");
  const userId = row.userId;

  const forUser = <T>(q: () => Promise<T>, empty: T) => (userId ? q() : Promise.resolve(empty));

  const [intakeRows, weights, targets, sessions] = await Promise.all([
    forUser(
      () =>
        db
          .select({
            sex: schema.userIntakes.sex,
            birthYear: schema.userIntakes.birthYear,
            heightCm: schema.userIntakes.heightCm,
            goal: schema.userIntakes.goal,
            targetWeightKg: schema.userIntakes.targetWeightKg,
            dailyActivity: schema.userIntakes.dailyActivity,
            diet: schema.userIntakes.diet,
            allergies: schema.userIntakes.allergies,
            dislikes: schema.userIntakes.dislikes,
            healthFlags: schema.userIntakes.healthFlags,
            completedAt: schema.userIntakes.completedAt,
          })
          .from(schema.userIntakes)
          .where(eq(schema.userIntakes.userId, userId as string))
          .limit(1),
      [],
    ),

    // Newest first. The delta needs the most recent reading and the newest one that is
    // at least a week old, so a client who weighed in three times today still shows a
    // week's change rather than zero.
    forUser(
      () =>
        db
          .select({ weightKg: schema.bodyMetrics.weightKg, takenAt: schema.bodyMetrics.takenAt })
          .from(schema.bodyMetrics)
          .where(eq(schema.bodyMetrics.userId, userId as string))
          .orderBy(desc(schema.bodyMetrics.takenAt))
          .limit(60),
      [],
    ),

    forUser(
      () =>
        db
          .select({
            kcal: schema.nutritionTargets.kcal,
            proteinG: schema.nutritionTargets.proteinG,
            carbsG: schema.nutritionTargets.carbsG,
            fatG: schema.nutritionTargets.fatG,
            basis: schema.nutritionTargets.basis,
            reviewReasons: schema.nutritionTargets.reviewReasons,
            effectiveFrom: schema.nutritionTargets.effectiveFrom,
          })
          .from(schema.nutritionTargets)
          .where(
            and(
              eq(schema.nutritionTargets.userId, userId as string),
              eq(schema.nutritionTargets.status, "active"),
            ),
          )
          .limit(1),
      [],
    ),

    db
      .select({ completedAt: schema.sessions_.completedAt })
      .from(schema.sessions_)
      .where(
        and(
          eq(schema.sessions_.clientId, clientId),
          isNotNull(schema.sessions_.completedAt),
          sql`${schema.sessions_.completedAt} >= now() - interval '${sql.raw(
            String(TRAINING_WINDOW_DAYS),
          )} days'`,
        ),
      )
      .orderBy(desc(schema.sessions_.completedAt)),
  ]);

  const [plans, workoutAssignments, workouts, completedCheckIns, ratings, messageCounts, foodLogs] =
    await Promise.all([
      db
        .select({
          id: schema.mealPlanTemplates.id,
          name: schema.mealPlanTemplates.name,
          kcal: schema.mealPlanTemplates.calorieTarget,
          status: schema.mealPlanTemplates.status,
          published: sql<boolean>`${schema.mealPlanTemplates.publishedDocument} is not null`,
          createdAt: schema.mealPlanTemplates.createdAt,
          archivedAt: schema.mealPlanTemplates.archivedAt,
          createdBy: schema.mealPlanTemplates.createdBy,
        })
        .from(schema.mealPlanTemplates)
        .where(
          and(
            eq(schema.mealPlanTemplates.studioId, studioId),
            eq(schema.mealPlanTemplates.clientId, clientId),
          ),
        )
        .orderBy(desc(schema.mealPlanTemplates.createdAt))
        .limit(100),
      // A client's own copy of a workout template, same `clientId`-is-a-copy shape ADR
      // 0024 already uses — this is the "Workout assigned" activity entry, distinct from
      // "Workout completed" below, which is a session the client actually did.
      db
        .select({
          id: schema.workoutTemplates.id,
          name: schema.workoutTemplates.name,
          createdAt: schema.workoutTemplates.createdAt,
          createdBy: schema.workoutTemplates.createdBy,
        })
        .from(schema.workoutTemplates)
        .where(
          and(
            eq(schema.workoutTemplates.studioId, studioId),
            eq(schema.workoutTemplates.clientId, clientId),
          ),
        )
        .orderBy(desc(schema.workoutTemplates.createdAt))
        .limit(100),
      db
        .select({
          id: schema.sessions_.id,
          name: schema.workoutSessions.name,
          completedAt: schema.sessions_.completedAt,
          startedAt: schema.sessions_.startedAt,
          intensity: schema.sessions_.intensity,
        })
        .from(schema.sessions_)
        .leftJoin(
          schema.workoutSessions,
          eq(schema.sessions_.workoutSessionId, schema.workoutSessions.id),
        )
        .where(
          and(eq(schema.sessions_.clientId, clientId), isNotNull(schema.sessions_.completedAt)),
        )
        .orderBy(desc(schema.sessions_.completedAt))
        .limit(100),
      db
        .select({ id: schema.checkIns.id, completedAt: schema.checkIns.completedAt })
        .from(schema.checkIns)
        .where(and(eq(schema.checkIns.clientId, clientId), isNotNull(schema.checkIns.completedAt)))
        .orderBy(desc(schema.checkIns.completedAt))
        .limit(100),
      db
        .select({ value: sql<number>`avg(${schema.checkInAnswers.ratingValue})::float` })
        .from(schema.checkInAnswers)
        .innerJoin(schema.checkIns, eq(schema.checkInAnswers.checkInId, schema.checkIns.id))
        .where(
          and(
            eq(schema.checkIns.clientId, clientId),
            isNotNull(schema.checkIns.completedAt),
            isNotNull(schema.checkInAnswers.ratingValue),
          ),
        ),
      db
        .select({
          week: sql<string>`date_trunc('week', ${schema.messages.createdAt})::date::text`,
          author: schema.messages.author,
          count: sql<number>`count(*)::int`,
        })
        .from(schema.messages)
        .where(
          and(
            eq(schema.messages.studioId, studioId),
            eq(schema.messages.clientId, clientId),
            inArray(schema.messages.author, ["coach", "client"]),
            sql`${schema.messages.createdAt} >= date_trunc('week', now()) - interval '3 weeks'`,
          ),
        )
        .groupBy(
          sql`date_trunc('week', ${schema.messages.createdAt})::date::text`,
          schema.messages.author,
        ),
      db
        .select({
          id: schema.foodLogEntries.id,
          name: schema.foodLogEntries.manualName,
          loggedAt: schema.foodLogEntries.loggedAt,
        })
        .from(schema.foodLogEntries)
        .where(eq(schema.foodLogEntries.clientId, clientId))
        .orderBy(desc(schema.foodLogEntries.loggedAt))
        .limit(100),
    ]);

  // Who assigned it — only for the activity kinds Coachway itself attributes (a meal
  // plan or workout template a coach gave this client), resolved in one follow-up query
  // rather than a join per row above, since most of those rows carry no `createdBy` at
  // all for a client-authored copy.
  const assignerIds = [
    ...new Set(
      [...plans.map((p) => p.createdBy), ...workoutAssignments.map((w) => w.createdBy)].filter(
        (id): id is string => id !== null,
      ),
    ),
  ];
  const assignerNames =
    assignerIds.length === 0
      ? new Map<string, string>()
      : new Map(
          (
            await db
              .select({ id: schema.memberships.id, name: schema.users.name })
              .from(schema.memberships)
              .innerJoin(schema.users, eq(schema.users.id, schema.memberships.userId))
              .where(inArray(schema.memberships.id, assignerIds))
          ).map((m) => [m.id, m.name] as const),
        );
  const assignerOf = (membershipId: string | null) =>
    membershipId ? (assignerNames.get(membershipId) ?? null) : null;

  const currentPlan =
    plans.find((p) => p.status === "active" && p.published && !p.archivedAt) ?? null;
  const lastWorkout = workouts[0];
  const messageWeeks = Array.from({ length: 4 }, (_, i) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - (3 - i) * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
    const counts = messageCounts.filter((m) => m.week === key);
    return {
      key,
      label: `${start.getDate()}/${start.getMonth() + 1} – ${end.getDate()}/${end.getMonth() + 1}`,
      coach: counts.find((m) => m.author === "coach")?.count ?? 0,
      client: counts.find((m) => m.author === "client")?.count ?? 0,
    };
  });
  const activity: { id: string; kind: string; at: Date; title: string; by: string | null }[] = [
    { id: "created", kind: "created", at: row.startedAt, title: "Client created", by: null },
    ...(row.activatedAt
      ? [
          {
            id: "activated",
            kind: "activated",
            at: row.activatedAt,
            title: "Client activated",
            by: null,
          },
        ]
      : []),
    ...completedCheckIns.map((c) => ({
      id: `checkin-${c.id}`,
      kind: "checkin",
      at: c.completedAt!,
      title: "Check-in completed: Weekly Check-In",
      by: null,
    })),
    ...workouts.map((w) => ({
      id: `workout-${w.id}`,
      kind: "workout",
      at: w.completedAt!,
      title: `Workout completed: ${w.name ?? "Workout"}`,
      by: null,
    })),
    ...workoutAssignments.map((w) => ({
      id: `workout-assigned-${w.id}`,
      kind: "workout",
      at: w.createdAt,
      title: `Workout assigned: ${w.name}`,
      by: assignerOf(w.createdBy),
    })),
    ...plans.flatMap((p) => [
      {
        id: `plan-${p.id}`,
        kind: "nutrition",
        at: p.createdAt,
        title: `Meal plan assigned: ${p.name}`,
        by: assignerOf(p.createdBy),
      },
      ...(p.archivedAt
        ? [
            {
              id: `removed-${p.id}`,
              kind: "nutrition",
              at: p.archivedAt,
              title: `Meal plan removed: ${p.name}`,
              by: assignerOf(p.createdBy),
            },
          ]
        : []),
    ]),
    ...foodLogs.map((f) => ({
      id: `food-${f.id}`,
      kind: "food",
      at: f.loggedAt,
      title: f.name ? `Food logged: ${f.name}` : "Food logged",
      by: null,
    })),
  ];
  activity.sort((a, b) => b.at.getTime() - a.at.getTime());
  const intake = intakeRows[0] ?? null;
  const latest = weights[0] ?? null;

  // The reading before the latest one — the card says "since last weigh-in", so that is
  // what it compares against, not a fixed window.
  const earlier = weights[1] ?? null;

  return {
    id: row.id,
    hasAccount: userId !== null,
    startedAt: row.startedAt,
    endsAt: row.endsAt,
    activatedAt: row.activatedAt,
    coachingGoal: row.goal,
    constraints: row.constraints,

    weight: latest
      ? {
          currentKg: latest.weightKg,
          takenAt: latest.takenAt,
          // Null rather than zero when there is nothing to compare against: "no change"
          // and "we have only ever weighed you once" are different facts.
          changeKg: earlier ? round1(latest.weightKg - earlier.weightKg) : 0,
          comparedTo: earlier?.takenAt ?? null,
          weighIns: weights.length,
          targetKg: intake?.targetWeightKg ?? null,
        }
      : null,

    energy: energyFor(intake, latest?.weightKg ?? null, targets[0] ?? null),

    nutrition: intake
      ? {
          diet: intake.diet,
          allergies: intake.allergies,
          dislikes: intake.dislikes,
          healthFlags: intake.healthFlags ?? [],
          intakeCompletedAt: intake.completedAt,
        }
      : null,

    happiness: ratings[0]?.value == null ? null : round1(ratings[0].value),
    currentPlan: currentPlan
      ? { id: currentPlan.id, name: currentPlan.name, kcal: currentPlan.kcal }
      : null,
    latestWorkout: lastWorkout
      ? {
          name: lastWorkout.name ?? "Workout",
          completedAt: lastWorkout.completedAt,
          intensity: lastWorkout.intensity,
          minutes: lastWorkout.startedAt
            ? Math.max(
                0,
                Math.round(
                  (lastWorkout.completedAt!.getTime() - lastWorkout.startedAt.getTime()) / 60000,
                ),
              )
            : null,
        }
      : null,
    messageWeeks,
    activity: activity.slice(0, 100),

    training: {
      windowDays: TRAINING_WINDOW_DAYS,
      sessions: sessions.length,
      lastSessionAt: sessions[0]?.completedAt ?? null,
      // One entry per day a session was completed, newest first, for the sparkline.
      days: [...new Set(sessions.map((s) => (s.completedAt as Date).toISOString().slice(0, 10)))],
    },
  };
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * The energy card: a stored target if one is active, otherwise one computed from the
 * intake so the card works before any plan exists.
 *
 * `source` says which, because a coach looking at a number needs to know whether it is
 * what the client was actually prescribed or what the calculator would suggest today.
 */
function energyFor(
  intake: {
    sex: "male" | "female" | "undisclosed" | null;
    birthYear: number | null;
    heightCm: number | null;
    goal: Goal | null;
    targetWeightKg: number | null;
    dailyActivity: ActivityLevel | null;
    diet: DietType | null;
    healthFlags: string[] | null;
  } | null,
  weightKg: number | null,
  stored: {
    kcal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    basis: unknown;
    reviewReasons: string[] | null;
    effectiveFrom: Date;
  } | null,
) {
  if (stored) {
    return {
      source: "prescribed" as const,
      kcal: stored.kcal,
      proteinG: stored.proteinG,
      carbsG: stored.carbsG,
      fatG: stored.fatG,
      basis: stored.basis,
      review: stored.reviewReasons ?? [],
      effectiveFrom: stored.effectiveFrom,
      missing: [] as string[],
    };
  }

  // Everything the Mifflin-St Jeor equation needs. Naming what is missing is more use to
  // a coach than an empty card — they are the one who can go and ask for it.
  const missing: string[] = [];
  if (!intake?.sex || intake.sex === "undisclosed") missing.push("sex");
  if (!intake?.birthYear) missing.push("age");
  if (!intake?.heightCm) missing.push("height");
  if (!weightKg) missing.push("weight");
  if (!intake?.dailyActivity) missing.push("activity level");
  if (!intake?.goal) missing.push("goal");
  if (missing.length > 0 || !intake) return { source: "none" as const, missing };

  const body = {
    sex: intake.sex as Sex,
    age: new Date().getFullYear() - (intake.birthYear as number),
    heightCm: intake.heightCm as number,
    weightKg: weightKg as number,
  };
  const target = energyTarget({
    ...body,
    goal: intake.goal as Goal,
    activity: intake.dailyActivity as ActivityLevel,
    diet: (intake.diet ?? "vegetarian") as DietType,
    health: (intake.healthFlags ?? []) as HealthFlag[],
    ...(intake.targetWeightKg ? { targetWeightKg: intake.targetWeightKg } : {}),
  });

  return {
    source: "computed" as const,
    kcal: target.kcal,
    proteinG: target.protein,
    carbsG: target.carbs,
    fatG: target.fat,
    basis: target.basis,
    review: target.review,
    effectiveFrom: null,
    missing: [] as string[],
  };
}

/**
 * Change a client's status or end date.
 *
 * Scoped by studio in the `where`, not only by the middleware: a coach of studio A
 * passing a client id from studio B updates nothing rather than updating somebody
 * else's row, which is the difference between a 404 and a breach.
 */
export async function updateClient(
  studioId: string,
  clientId: string,
  patch: {
    status?: SettableClientStatus;
    startedAt?: Date;
    endsAt?: Date | null;
    checkInWeekday?: number | null;
    checkInGraceDays?: number | null;
    checkInsEnabled?: boolean;
  },
) {
  const [updated] = await db
    .update(schema.clients)
    .set(patch)
    .where(and(alive(studioId), eq(schema.clients.id, clientId)))
    .returning({
      id: schema.clients.id,
      status: schema.clients.status,
      startedAt: schema.clients.startedAt,
      endsAt: schema.clients.endsAt,
    });

  if (!updated) throw notFound("No such client.");
  return updated;
}

/* -------------------------------------------------------------------------- */
/* Tags                                                                        */
/* -------------------------------------------------------------------------- */

export async function listTags(studioId: string) {
  return db
    .select({
      id: schema.tags.id,
      name: schema.tags.name,
      description: schema.tags.description,
      color: schema.tags.color,
      uses: sql<number>`(
        select count(*)::int from client_tag ct where ct.tag_id = ${schema.tags.id}
      )`,
    })
    .from(schema.tags)
    .where(eq(schema.tags.studioId, studioId))
    .orderBy(asc(schema.tags.name));
}

export async function createTag(
  studioId: string,
  input: { name: string; description?: string | null; color: string },
) {
  const name = input.name.trim();

  // Checked here as well as by the unique index, so the coach gets "you already have
  // that one" rather than a constraint violation turned into a 400 by a catch.
  const [existing] = await db
    .select({ id: schema.tags.id })
    .from(schema.tags)
    .where(
      and(eq(schema.tags.studioId, studioId), sql`lower(${schema.tags.name}) = lower(${name})`),
    )
    .limit(1);

  if (existing) throw badRequest("tag_exists", "You already have a tag with that name.");

  const [tag] = await db
    .insert(schema.tags)
    .values({
      id: newId(),
      studioId,
      name,
      description: input.description?.trim() || null,
      color: input.color.toLowerCase(),
    })
    .returning();

  return tag;
}

export async function deleteTag(studioId: string, tagId: string) {
  const deleted = await db
    .delete(schema.tags)
    .where(and(eq(schema.tags.studioId, studioId), eq(schema.tags.id, tagId)))
    .returning({ id: schema.tags.id });

  if (deleted.length === 0) throw notFound("No such tag.");
}

/**
 * Replace a client's tags with exactly this set.
 *
 * A whole-set write rather than add/remove calls: the picker shows the final state, so
 * sending the final state is what makes a double-click and a slow network idempotent.
 * Every id is checked against the studio first — a tag from another studio is not a
 * validation error to report, it is an id the coach was never meant to have.
 */
export async function setClientTags(studioId: string, clientId: string, tagIds: string[]) {
  // Both checks at once. They do not depend on each other, and a round trip to Neon
  // from India is about 250ms — this write used to spend nine of them in a row, which
  // is two and a quarter seconds of a coach watching a spinner to add one tag.
  const [[client], mine] = await Promise.all([
    db
      .select({ id: schema.clients.id })
      .from(schema.clients)
      .where(and(alive(studioId), eq(schema.clients.id, clientId)))
      .limit(1),

    tagIds.length
      ? db
          .select({ id: schema.tags.id })
          .from(schema.tags)
          .where(and(eq(schema.tags.studioId, studioId), inArray(schema.tags.id, tagIds)))
      : Promise.resolve([] as { id: string }[]),
  ]);

  if (!client) throw notFound("No such client.");
  if (mine.length !== tagIds.length) throw badRequest("unknown_tag", "One of those tags is gone.");

  // "No tags" is a delete and nothing else, and the answer is known without asking.
  if (mine.length === 0) {
    await db.delete(schema.clientTags).where(eq(schema.clientTags.clientId, clientId));
    return [];
  }

  // One statement, so no BEGIN and no COMMIT either — a single statement is already
  // atomic. Only `mine` reaches it, so the ownership check above is still the only
  // thing deciding which tags a coach may use.
  //
  // It removes what is going and adds what is new rather than clearing the lot and
  // writing it back: deleting a (client, tag) row and re-inserting the same pair inside
  // one statement trips the primary key, because the index still sees the row the CTE
  // deleted. Leaving the unchanged rows alone sidesteps that and writes less.
  await db.execute(sql`
    with wanted (tag_id) as (
      values ${sql.join(
        mine.map((t) => sql`(${t.id})`),
        sql`, `,
      )}
    ),
    gone as (
      delete from client_tag
      where client_id = ${clientId} and tag_id not in (select tag_id from wanted)
    )
    insert into client_tag (client_id, tag_id)
    select ${clientId}, tag_id from wanted
    on conflict (client_id, tag_id) do nothing
  `);

  return listClientTags(clientId);
}

export function listClientTags(clientId: string) {
  return db
    .select({ id: schema.tags.id, name: schema.tags.name, color: schema.tags.color })
    .from(schema.clientTags)
    .innerJoin(schema.tags, eq(schema.tags.id, schema.clientTags.tagId))
    .where(eq(schema.clientTags.clientId, clientId))
    .orderBy(asc(schema.tags.name));
}
