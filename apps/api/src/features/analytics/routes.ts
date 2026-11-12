import { Router } from "express";
import { z } from "zod";
import { requireSession } from "../../middleware/session.js";
import { EVENT_NAMES, SOURCE_APPS, track } from "./service.js";

export const analytics: Router = Router();

/**
 * Batched ingestion — the contract the Phase 2 client SDK will call. Nothing calls this
 * yet (Phase 1's five events are all tracked directly from server-side code, not over
 * HTTP), but the shape needs to be right before that SDK exists, not after.
 *
 * Authenticated only. There is no anonymous product-event path on purpose — an
 * anonymous visitor is `analytics_event`'s subject (ADR 0021), not this table's.
 */
const batchBody = z.object({
  events: z
    .array(
      z.object({
        id: z.string().min(1).max(64),
        name: z.enum(EVENT_NAMES as [string, ...string[]]),
        occurredAt: z.iso.datetime(),
        sourceApp: z.enum(SOURCE_APPS),
        properties: z.record(z.string(), z.unknown()).default({}),
      }),
    )
    .min(1)
    .max(50),
});

analytics.post("/events", async (req, res) => {
  const { userId, activeStudioId } = requireSession(req);
  const { events } = batchBody.parse(req.body);

  for (const e of events) {
    // sourceApp names which app sent it, which is also exactly who the actor is —
    // "trainer"/"client" apps only ever report their own user's actions. "admin"/
    // "endorse"/"web" events have no actorRole mapping yet (nothing sends those over
    // this route today) and are rejected rather than guessed at.
    if (e.sourceApp !== "trainer" && e.sourceApp !== "client") continue;
    await track({
      id: e.id,
      name: e.name as (typeof EVENT_NAMES)[number],
      properties: e.properties as never,
      userId,
      studioId: activeStudioId,
      actorRole: e.sourceApp,
      sourceApp: e.sourceApp,
      occurredAt: new Date(e.occurredAt),
    });
  }

  res.status(201).json({ accepted: events.length });
});
