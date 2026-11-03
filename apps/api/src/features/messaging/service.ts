import { newId, schema } from "@traiv/db";
import { and, asc, desc, eq, inArray, isNull, lt, or, sql } from "drizzle-orm";
import { db } from "../../db.js";
import { badRequest, notFound } from "../../errors.js";
import { getCheckIn } from "../studio/check-ins.js";
export type Channel = "chat" | "photo";
export type Actor = {
  studioId: string;
  clientId: string;
  userId: string;
  role: "coach" | "client";
};
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function scope(studioId: string, clientId: string) {
  const [client] = await db
    .select()
    .from(schema.clients)
    .where(
      and(
        eq(schema.clients.studioId, studioId),
        eq(schema.clients.id, clientId),
        isNull(schema.clients.deletedAt),
      ),
    );
  if (!client) throw notFound();
  return client;
}
/** Called within the domain write's own transaction. Source uniqueness makes retries safe. */
export async function activity(
  tx: Transaction,
  clientId: string,
  kind: "workout" | "check-in",
  sourceId: string,
) {
  const [client] = await tx
    .select({ studioId: schema.clients.studioId })
    .from(schema.clients)
    .where(eq(schema.clients.id, clientId));
  if (!client) throw notFound();
  await tx
    .insert(schema.messages)
    .values({
      id: newId(),
      studioId: client.studioId,
      clientId,
      author: "activity",
      kind,
      sourceId,
    })
    .onConflictDoNothing();
}
export async function photoMessage(
  tx: Transaction,
  input: {
    id: string;
    clientId: string;
    author: string;
    note?: string | null;
    imageUrl?: string | null;
  },
) {
  const [client] = await tx
    .select({ studioId: schema.clients.studioId })
    .from(schema.clients)
    .where(eq(schema.clients.id, input.clientId));
  if (!client) throw notFound();
  await tx.insert(schema.foodPhotoMessages).values(input).onConflictDoNothing();
  await tx
    .insert(schema.messages)
    .values({
      id: input.id,
      studioId: client.studioId,
      clientId: input.clientId,
      channel: "photo",
      author: input.author,
      body: input.note ?? "",
      kind: input.imageUrl ? "photo" : "text",
      sourceId: input.id,
    })
    .onConflictDoNothing();
}
export async function history(actor: Actor, channel: Channel, before?: string, onlyId?: string) {
  const cursor = before
    ? await db
        .select()
        .from(schema.messages)
        .where(
          and(
            eq(schema.messages.id, before),
            eq(schema.messages.clientId, actor.clientId),
            eq(schema.messages.channel, channel),
          ),
        )
        .then((rows) => rows[0])
    : null;
  if (before && !cursor) throw notFound();
  const rows = await db
    .select()
    .from(schema.messages)
    .where(
      and(
        eq(schema.messages.studioId, actor.studioId),
        eq(schema.messages.clientId, actor.clientId),
        eq(schema.messages.channel, channel),
        onlyId ? eq(schema.messages.id, onlyId) : undefined,
        cursor
          ? or(
              lt(schema.messages.createdAt, cursor.createdAt),
              and(
                eq(schema.messages.createdAt, cursor.createdAt),
                lt(schema.messages.id, cursor.id),
              ),
            )
          : undefined,
      ),
    )
    .orderBy(desc(schema.messages.createdAt), desc(schema.messages.id))
    .limit(41);
  const hasMore = rows.length > 40;
  const page = rows.slice(0, 40).reverse();
  const ids = page.map((m) => m.id);
  const [reads, reactions, attachments] = await Promise.all([
    db
      .select()
      .from(schema.messageReads)
      .where(
        and(
          eq(schema.messageReads.clientId, actor.clientId),
          eq(schema.messageReads.channel, channel),
        ),
      ),
    ids.length
      ? db
          .select()
          .from(schema.messageReactions)
          .where(inArray(schema.messageReactions.messageId, ids))
      : Promise.resolve([]),
    ids.length
      ? db
          .select({ messageId: schema.messageAttachments.messageId, asset: schema.mediaAssets })
          .from(schema.messageAttachments)
          .innerJoin(
            schema.mediaAssets,
            eq(schema.mediaAssets.id, schema.messageAttachments.assetId),
          )
          .where(
            and(
              inArray(schema.messageAttachments.messageId, ids),
              eq(schema.mediaAssets.clientId, actor.clientId),
            ),
          )
      : Promise.resolve([]),
  ]);
  const messages = await Promise.all(
    page.map(async (m) => {
      let detail: unknown = null;
      if (m.kind === "workout" && m.sourceId) {
        const [session] = await db
          .select()
          .from(schema.sessions_)
          .where(
            and(eq(schema.sessions_.id, m.sourceId), eq(schema.sessions_.clientId, actor.clientId)),
          );
        const workout = session?.workoutSessionId
          ? await db
              .select({
                name: schema.workoutSessions.name,
                programName: schema.workoutTemplates.name,
              })
              .from(schema.workoutSessions)
              .innerJoin(
                schema.workoutTemplates,
                eq(schema.workoutTemplates.id, schema.workoutSessions.templateId),
              )
              .where(eq(schema.workoutSessions.id, session.workoutSessionId))
              .then((r) => r[0])
          : null;
        if (session)
          detail = {
            ...session,
            name: workout?.name ?? "Workout",
            programName: workout?.programName ?? null,
            exercises: onlyId
              ? await db
                  .select({
                    exercise: schema.exercises,
                    log: schema.setLogs,
                    prescription: {
                      loadKg: schema.exerciseSets.weightKg,
                      repsMin: schema.exerciseSets.reps,
                      repsMax: schema.exerciseSets.repsMax,
                    },
                  })
                  .from(schema.setLogs)
                  .innerJoin(
                    schema.sessionExercises,
                    eq(schema.sessionExercises.id, schema.setLogs.sessionExerciseId),
                  )
                  .innerJoin(
                    schema.exercises,
                    eq(schema.exercises.id, schema.sessionExercises.exerciseId),
                  )
                  .leftJoin(
                    schema.exerciseSets,
                    eq(schema.exerciseSets.id, schema.setLogs.exerciseSetId),
                  )
                  .where(eq(schema.setLogs.sessionId, session.id))
                  .orderBy(asc(schema.setLogs.setNumber))
              : [],
          };
      } else if (m.kind === "check-in" && m.sourceId) {
        detail = {
          ...(await getCheckIn(actor.studioId, m.sourceId)),
          review: await db
            .select()
            .from(schema.checkInReviews)
            .where(
              and(
                eq(schema.checkInReviews.checkInId, m.sourceId),
                eq(schema.checkInReviews.studioId, actor.studioId),
              ),
            )
            .then((r) => r[0] ?? null),
        };
      }
      const legacy =
        m.kind === "photo" && m.sourceId
          ? await db
              .select()
              .from(schema.foodPhotoMessages)
              .where(
                and(
                  eq(schema.foodPhotoMessages.id, m.sourceId),
                  eq(schema.foodPhotoMessages.clientId, actor.clientId),
                ),
              )
              .then((r) => r[0])
          : null;
      return {
        ...m,
        mine: m.author === actor.role || (actor.role === "client" && m.author === "activity"),
        detail,
        legacyImage: legacy?.imageUrl ?? null,
        attachments: attachments
          .filter((a) => a.messageId === m.id)
          .map((a) => ({
            id: a.asset.id,
            name: a.asset.name,
            type: a.asset.resourceType,
            format: a.asset.format,
          })),
        reactions: reactions
          .filter((r) => r.messageId === m.id)
          .map((r) => ({ emoji: r.emoji, mine: r.userId === actor.userId })),
        read: reads.some((r) => r.userId !== actor.userId && r.readAt >= m.createdAt),
      };
    }),
  );
  return {
    messages,
    hasMore,
    readAt: reads.find((r) => r.userId === actor.userId)?.readAt ?? null,
  };
}
export async function send(
  actor: Actor,
  channel: Channel,
  input: { id: string; body: string; replyTo?: string; assets: string[] },
) {
  return db.transaction(async (tx) => {
    // Lock relationship: stable ordering and serialized duplicate sends within a conversation.
    await tx.execute(sql`select id from client where id=${actor.clientId} for update`);
    const [existing] = await tx
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.id, input.id));
    if (existing) {
      if (
        existing.clientId !== actor.clientId ||
        existing.senderId !== actor.userId ||
        existing.channel !== channel
      )
        throw badRequest("message_id_used", "Please send this as a new message.");
      return existing;
    }
    if (input.replyTo) {
      const [reply] = await tx
        .select()
        .from(schema.messages)
        .where(
          and(
            eq(schema.messages.id, input.replyTo),
            eq(schema.messages.clientId, actor.clientId),
            eq(schema.messages.channel, channel),
          ),
        );
      if (!reply) throw notFound("The original message isn't available.");
    }
    const assets = input.assets.length
      ? await tx
          .select()
          .from(schema.mediaAssets)
          .where(
            and(
              inArray(schema.mediaAssets.id, input.assets),
              eq(schema.mediaAssets.clientId, actor.clientId),
              eq(schema.mediaAssets.ownerId, actor.userId),
            ),
          )
      : [];
    if (assets.length !== input.assets.length || assets.some((a) => !a.verifiedAt))
      throw badRequest("invalid_attachment", "Finish uploading the attachment first.");
    const [message] = await tx
      .insert(schema.messages)
      .values({
        id: input.id,
        studioId: actor.studioId,
        clientId: actor.clientId,
        channel,
        author: actor.role,
        senderId: actor.userId,
        body: input.body,
        replyTo: input.replyTo,
        kind: assets.length ? "attachment" : "text",
      })
      .returning();
    if (assets.length)
      await tx
        .insert(schema.messageAttachments)
        .values(assets.map((a) => ({ messageId: input.id, assetId: a.id })));
    if (channel === "photo")
      await tx
        .insert(schema.foodPhotoMessages)
        .values({
          id: input.id,
          clientId: actor.clientId,
          author: actor.role,
          note: input.body || null,
        })
        .onConflictDoNothing();
    return message;
  });
}
export async function markRead(actor: Actor, channel: Channel, messageId: string) {
  const [message] = await db
    .select()
    .from(schema.messages)
    .where(
      and(
        eq(schema.messages.id, messageId),
        eq(schema.messages.clientId, actor.clientId),
        eq(schema.messages.channel, channel),
      ),
    );
  if (!message) throw notFound();
  await db
    .insert(schema.messageReads)
    .values({
      clientId: actor.clientId,
      userId: actor.userId,
      channel,
      readAt: sql`(select created_at from chat_message where id=${message.id})`,
    })
    .onConflictDoUpdate({
      target: [
        schema.messageReads.clientId,
        schema.messageReads.userId,
        schema.messageReads.channel,
      ],
      set: { readAt: sql`greatest(${schema.messageReads.readAt}, excluded.read_at)` },
    });
}
export async function inbox(studioId: string, userId: string, channel: Channel) {
  const cid = sql.raw('"client"."id"');
  return db
    .select({
      id: schema.clients.id,
      name: schema.clients.name,
      status: schema.clients.status,
      endsAt: schema.clients.endsAt,
      last: sql<{
        id: string;
        body: string;
        kind: string;
        createdAt: string;
      } | null>`(select json_build_object('id',m.id,'body',m.body,'kind',m.kind,'createdAt',m.created_at) from chat_message m where m.client_id=${cid} and m.channel=${channel} order by m.created_at desc,m.id desc limit 1)`,
      unread: sql<number>`(select count(*)::int from chat_message m where m.client_id=${cid} and m.channel=${channel} and m.author in ('client','activity') and m.created_at>coalesce((select r.read_at from chat_read r where r.client_id=${cid} and r.channel=${channel} and r.user_id=${userId}),'-infinity'::timestamptz))`,
      missingCheckIn: sql<boolean>`exists(select 1 from check_in c where c.client_id=${cid} and c.status='pending' and c.closes_on<current_date)`,
      newCheckIn: sql<boolean>`exists(select 1 from check_in c where c.client_id=${cid} and c.status='completed' and not exists(select 1 from check_in_review r where r.check_in_id=c.id))`,
      noContact: sql<boolean>`not exists(select 1 from chat_message m where m.client_id=${cid} and m.author='coach' and m.created_at>now()-interval '14 days')`,
      tags: sql<
        { name: string; color: string }[]
      >`(select coalesce(json_agg(json_build_object('name',t.name,'color',t.color)),'[]'::json) from client_tag ct join tag t on t.id=ct.tag_id where ct.client_id=${cid})`,
    })
    .from(schema.clients)
    .where(and(eq(schema.clients.studioId, studioId), isNull(schema.clients.deletedAt)))
    .orderBy(asc(schema.clients.name));
}
