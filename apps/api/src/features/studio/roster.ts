import { newId, schema } from "@traiv/db";
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

/** The three the coach's tabs show. `waiting` and `frozen` are not states a coach set. */
export const ROSTER_STATUSES = ["active", "paused", "archived"] as const;
export type RosterStatus = (typeof ROSTER_STATUSES)[number];

/** How long without a logged session before the coach should be looking. */
const STALE_DAYS = 10;
/** How recent a session counts as something new to read. */
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

const lastSession = sql<Date | null>`(
  select max(ts.completed_at) from training_session ts
  where ts.client_id = ${CLIENT_ID} and ts.completed_at is not null
)`;

const SIGNALS = {
  all: sql`true`,
  unread: sql`false`,
  "new-checkin": sql`${lastSession} >= now() - interval '${sql.raw(String(FRESH_DAYS))} days'`,
  "missing-checkin": sql`(
    ${lastSession} is null or ${lastSession} < now() - interval '${sql.raw(String(STALE_DAYS))} days'
  )`,
  "ending-soon": sql`(
    ${schema.clients.endsAt} is not null
    and ${schema.clients.endsAt} <= now() + interval '${sql.raw(String(ENDING_DAYS))} days'
  )`,
} satisfies Record<Filter, unknown>;

export type RosterQuery = {
  studioId: string;
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
  const base = alive(q.studioId);
  const search = q.search?.trim();

  const where = and(
    base,
    eq(schema.clients.status, q.status),
    SIGNALS[q.filter],
    search ? sql`${schema.clients.name} ilike ${`%${search}%`}` : undefined,
  );

  const order =
    q.sort === "name"
      ? [asc(schema.clients.name)]
      : q.sort === "recent"
        ? [desc(schema.clients.createdAt)]
        : [asc(schema.clients.createdAt)];

  const [rows, [total], statusCounts, filterCounts, allTags] = await Promise.all([
    db
      .select({
        id: schema.clients.id,
        name: schema.clients.name,
        status: schema.clients.status,
        startedAt: schema.clients.createdAt,
        endsAt: schema.clients.endsAt,
        lastSessionAt: lastSession,
      })
      .from(schema.clients)
      .where(where)
      .orderBy(...order)
      .limit(q.perPage)
      .offset((q.page - 1) * q.perPage),

    db.select({ n: sql<number>`count(*)::int` }).from(schema.clients).where(where),

    // One pass for every tab's count, so the header does not cost three queries.
    db
      .select({ status: schema.clients.status, n: sql<number>`count(*)::int` })
      .from(schema.clients)
      .where(base)
      .groupBy(schema.clients.status),

    // And one for every chip, within the tab being looked at.
    db
      .select({
        unread: sql<number>`count(*) filter (where ${SIGNALS.unread})::int`,
        newCheckin: sql<number>`count(*) filter (where ${SIGNALS["new-checkin"]})::int`,
        missingCheckin: sql<number>`count(*) filter (where ${SIGNALS["missing-checkin"]})::int`,
        endingSoon: sql<number>`count(*) filter (where ${SIGNALS["ending-soon"]})::int`,
        all: sql<number>`count(*)::int`,
      })
      .from(schema.clients)
      .where(and(base, eq(schema.clients.status, q.status))),

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
      status: schema.clients.status,
      goal: schema.clients.goal,
      constraints: schema.clients.constraints,
      startedAt: schema.clients.createdAt,
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
  patch: { status?: RosterStatus; endsAt?: Date | null },
) {
  const [updated] = await db
    .update(schema.clients)
    .set(patch)
    .where(and(alive(studioId), eq(schema.clients.id, clientId)))
    .returning({
      id: schema.clients.id,
      status: schema.clients.status,
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
