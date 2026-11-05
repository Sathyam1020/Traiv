import { notifyClient } from "../notifications/service.js";
import { schema } from "@traiv/db";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { type Request, Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { notFound } from "../../errors.js";
import { authorizeStudio, requireStudio, requireStudioAuth } from "../../middleware/authorize.js";
import {
  authorizeClient,
  requireClient,
  requireClientAuth,
} from "../../middleware/client-authorize.js";
import { requireSession } from "../../middleware/session.js";
import { allow } from "../client/food.js";
import { getExerciseDetail } from "../client/workouts.js";
import { changed, isTyping, setTyping, subscribe } from "./live.js";
import { delivery, finalize, ticket } from "./media.js";
import { type Actor, history, inbox, markRead, scope, send } from "./service.js";

const channelSchema = z.enum(["chat", "photo"]).default("chat");
export const trainerMessaging: Router = Router({ mergeParams: true });
export const clientMessaging: Router = Router({ mergeParams: true });
trainerMessaging.get("/", requireStudio({ param: "id" }), async (req, res) =>
  res.json(
    await inbox(
      requireStudioAuth(req).studioId,
      requireSession(req).userId,
      channelSchema.parse(req.query.channel),
    ),
  ),
);
function mount(router: Router, coach: boolean) {
  const prefix = coach ? "/:clientId" : "";
  const gate = coach ? requireStudio({ param: "id" }) : requireClient();
  const writeGate = coach ? requireStudio({ param: "id" }) : requireClient({ write: true });
  async function actor(req: Request): Promise<Actor> {
    const auth = coach ? requireStudioAuth(req) : requireClientAuth(req);
    const clientId = coach
      ? z.string().uuid().parse(req.params.clientId)
      : requireClientAuth(req).clientId;
    await scope(auth.studioId, clientId);
    return {
      studioId: auth.studioId,
      clientId,
      userId: requireSession(req).userId,
      role: coach ? "coach" : "client",
    };
  }
  if (!coach)
    router.get("/unread", gate, async (req, res) => {
      const a = await actor(req);
      const [result] = await db
        .select({ unread: sql<number>`count(*)::int` })
        .from(schema.messages)
        .where(
          and(
            eq(schema.messages.clientId, a.clientId),
            eq(schema.messages.studioId, a.studioId),
            eq(schema.messages.channel, "chat"),
            eq(schema.messages.author, "coach"),
            sql`${schema.messages.createdAt} > coalesce((select read_at from chat_read where client_id=${a.clientId} and user_id=${a.userId} and channel='chat'), '-infinity'::timestamptz)`,
          ),
        );
      res.json({ unread: result?.unread ?? 0 });
    });
  router.get(`${prefix}/messages`, gate, async (req, res) => {
    const a = await actor(req),
      channel = channelSchema.parse(req.query.channel);
    if (!coach && channel === "photo") await allow(a.clientId, "photoLog");
    res.json(await history(a, channel, z.string().uuid().optional().parse(req.query.before)));
  });
  router.post(`${prefix}/messages`, writeGate, async (req, res) => {
    const a = await actor(req);
    const v = z
      .object({
        id: z.string().uuid(),
        body: z.string().trim().max(10000).default(""),
        replyTo: z.string().uuid().optional(),
        assets: z.array(z.string().uuid()).max(5).default([]),
        channel: channelSchema,
      })
      .refine((v) => Boolean(v.body || v.assets.length), "Write a message or add an attachment.")
      .parse(req.body);
    if (!coach && v.channel === "photo") await allow(a.clientId, "photoLog");
    const sent = await send(a, v.channel, v);
    changed(a.clientId);
    if (coach && v.channel === "chat") void notifyClient(a.clientId, "chat", `message:${v.id}`, "/chat").catch(() => console.warn("Chat push delivery failed"));
    res.status(201).json(sent);
  });
  router.post(`${prefix}/read`, gate, async (req, res) => {
    const v = z.object({ channel: channelSchema, messageId: z.string().uuid() }).parse(req.body);
    const a = await actor(req);
    await markRead(a, v.channel, v.messageId);
    changed(a.clientId);
    res.json({ saved: true });
  });
  router.post(`${prefix}/reactions`, writeGate, async (req, res) => {
    const a = await actor(req),
      v = z
        .object({
          messageId: z.string().uuid(),
          emoji: z.enum(["👍", "❤️", "🔥", "👏", "💪", "🎉"]).nullable(),
        })
        .parse(req.body);
    const [m] = await db
      .select()
      .from(schema.messages)
      .where(and(eq(schema.messages.id, v.messageId), eq(schema.messages.clientId, a.clientId)));
    if (!m) throw notFound();
    if (v.emoji)
      await db
        .insert(schema.messageReactions)
        .values({ ...v, emoji: v.emoji, userId: a.userId })
        .onConflictDoUpdate({
          target: [schema.messageReactions.messageId, schema.messageReactions.userId],
          set: { emoji: v.emoji },
        });
    else
      await db
        .delete(schema.messageReactions)
        .where(
          and(
            eq(schema.messageReactions.messageId, v.messageId),
            eq(schema.messageReactions.userId, a.userId),
          ),
        );
    res.json({ saved: true });
  });
  router.post(`${prefix}/uploads`, writeGate, async (req, res) => {
    const v = z
      .object({ name: z.string().min(1).max(200), type: z.enum(["image", "video", "raw"]) })
      .parse(req.body);
    res.json(await ticket(await actor(req), v.name, v.type));
  });
  router.post(`${prefix}/uploads/:assetId/complete`, writeGate, async (req, res) =>
    res.json(await finalize(await actor(req), z.string().uuid().parse(req.params.assetId))),
  );
  router.get(`${prefix}/media/:assetId`, gate, async (req, res) => {
    res.setHeader("Cache-Control", "private, no-store");
    res.redirect(await delivery(await actor(req), z.string().uuid().parse(req.params.assetId)));
  });
  router.get(`${prefix}/activities/:messageId`, gate, async (req, res) => {
    const a = await actor(req);
    const id = z.string().uuid().parse(req.params.messageId);
    const [message] = await db
      .select()
      .from(schema.messages)
      .where(
        and(
          eq(schema.messages.id, id),
          eq(schema.messages.clientId, a.clientId),
          eq(schema.messages.channel, "chat"),
        ),
      );
    if (!message || !["workout", "check-in"].includes(message.kind)) throw notFound();
    const card = (await history(a, "chat", undefined, id)).messages[0];
    if (!card) throw notFound();
    const exerciseRows =
      (card.detail as { exercises?: { exercise: { id: string } }[] })?.exercises ?? [];
    const ids = [...new Set(exerciseRows.map((r) => r.exercise.id))];
    const histories = await Promise.all(
      ids.map(async (id) => ({ id, ...(await getExerciseDetail(a.clientId, id)) })),
    );
    res.json({ ...card, detail: { ...(card.detail as object), histories } });
  });
  router.post(`${prefix}/typing`, writeGate, async (req, res) => {
    const a = await actor(req);
    const channel = channelSchema.parse(req.body.channel);
    setTyping(a.clientId, channel, a.role);
    res.json({ saved: true });
  });
  router.get(`${prefix}/events`, gate, async (req, res) => {
    const a = await actor(req);
    const channel = channelSchema.parse(req.query.channel);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
    const ping = () => {
      res.write(
        `event: change\ndata: ${JSON.stringify({ typing: isTyping(a.clientId, channel, coach ? "client" : "coach") })}\n\n`,
      );
    };
    ping();
    const unsubscribe = subscribe(a.clientId, ping);
    // Auth is rechecked during long-lived connections; reconnect always reconciles history.
    let running = false;
    const timer = setInterval(async () => {
      if (running) return;
      running = true;
      try {
        const [session] = await db
          .select({ id: schema.sessions.id })
          .from(schema.sessions)
          .where(
            and(
              eq(schema.sessions.id, requireSession(req).sessionId),
              isNull(schema.sessions.revokedAt),
              gt(schema.sessions.expiresAt, new Date()),
            ),
          );
        if (!session) throw notFound();
        if (coach) await authorizeStudio(a.userId, a.studioId);
        else await authorizeClient(a.userId, a.studioId);
        await scope(a.studioId, a.clientId);
        ping();
      } catch {
        res.end();
        clearInterval(timer);
      } finally {
        running = false;
      }
    }, 15000);
    res.on("close", () => {
      clearInterval(timer);
      unsubscribe();
    });
  });
  if (coach)
    router.post(`${prefix}/reviews/:checkInId`, writeGate, async (req, res) => {
      const a = await actor(req),
        id = z.string().uuid().parse(req.params.checkInId);
      const [check] = await db
        .select()
        .from(schema.checkIns)
        .where(
          and(
            eq(schema.checkIns.id, id),
            eq(schema.checkIns.clientId, a.clientId),
            eq(schema.checkIns.status, "completed"),
          ),
        );
      if (!check) throw notFound();
      await db
        .insert(schema.checkInReviews)
        .values({ checkInId: id, studioId: a.studioId, reviewerId: a.userId })
        .onConflictDoNothing();
      res.json({ reviewed: true });
    });
}
mount(trainerMessaging, true);
mount(clientMessaging, false);
