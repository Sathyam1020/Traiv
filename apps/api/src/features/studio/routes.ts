import { Router } from "express";
import { z } from "zod";
import { requireStudio, requireStudioAuth } from "../../middleware/authorize.js";
import { requireSession } from "../../middleware/session.js";
import {
  checkInTrend,
  createMetric,
  ensureCheckIns,
  getCheckIn,
  listMetrics,
  submitCheckIn,
} from "./check-ins.js";
import {
  createTag,
  deleteTag,
  FILTERS,
  getClient,
  getClientOverview,
  listRoster,
  listTags,
  ROSTER_STATUSES,
  setClientTags,
  updateClient,
} from "./roster.js";
import { activateStudio, listStudios, preferredStudio } from "./service.js";

export const studios: Router = Router();

/**
 * Not studio-scoped — it lists the memberships the caller has, so it is the one place
 * that legitimately reads across studios. The active studio is derived from that same
 * list rather than re-queried, and a session naming a studio no longer in it simply
 * does not win.
 */
studios.get("/", async (req, res) => {
  const { userId, activeStudioId } = requireSession(req);
  const mine = await listStudios(userId);
  const active = mine.some((s) => s.id === activeStudioId) ? activeStudioId : preferredStudio(mine);
  res.json({ studios: mine, activeStudioId: active });
});

/** Switching is an authorization decision, so it goes through the same gate as any other. */
studios.post("/:id/activate", requireStudio({ param: "id" }), async (req, res) => {
  const { sessionId } = requireSession(req);
  const { studioId } = requireStudioAuth(req);
  res.json({ studio: await activateStudio(sessionId, studioId) });
});

/* -------------------------------------------------------------------------- */
/* The roster                                                                  */
/* -------------------------------------------------------------------------- */

const rosterQuery = z.object({
  status: z.enum(ROSTER_STATUSES).default("active"),
  filter: z.enum(FILTERS).default("all"),
  search: z.string().trim().max(120).optional(),
  sort: z.enum(["duration", "name", "recent"]).default("duration"),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(25),
});

studios.get("/:id/clients", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  res.json(await listRoster({ studioId, ...rosterQuery.parse(req.query) }));
});

const clientParam = z.object({ clientId: z.string().max(64) });

/** One client's own screen. Scoped by studio in the query, not only by the middleware. */
studios.get("/:id/clients/:clientId", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { clientId } = clientParam.parse(req.params);
  res.json({ client: await getClient(studioId, clientId) });
});

/** The client's overview screen, as one aggregate rather than six round trips. */
studios.get("/:id/clients/:clientId/overview", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { clientId } = clientParam.parse(req.params);
  res.json({ overview: await getClientOverview(studioId, clientId) });
});

/* -------------------------------------------------------------------------- */
/* Check-ins                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The trend the overview draws.
 *
 * Materialising runs on read rather than only on a cron. A coach opening a client the
 * app has never scheduled for should not see an empty grid because a job has not fired
 * yet, and `ensureCheckIns` is idempotent, so doing it here costs one insert that
 * conflicts away.
 */
studios.get(
  "/:id/clients/:clientId/check-ins",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId } = requireStudioAuth(req);
    const { clientId } = clientParam.parse(req.params);

    // Prove the client is in this studio before scheduling anything for them.
    await getClient(studioId, clientId);
    await ensureCheckIns(clientId);

    res.json({ trend: await checkInTrend(clientId) });
  },
);

studios.get("/:id/check-ins/:checkInId", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { checkInId } = z.object({ checkInId: z.string().max(64) }).parse(req.params);
  res.json({ checkIn: await getCheckIn(studioId, checkInId) });
});

/** One answer per metric. Exactly one value field, which the database also enforces. */
const answerSchema = z.object({
  metricId: z.string().max(64),
  numberValue: z.number().finite().nullable().optional(),
  textValue: z.string().max(4000).nullable().optional(),
  ratingValue: z.number().int().min(1).max(5).nullable().optional(),
  imageUrl: z.string().url().max(2000).nullable().optional(),
});

studios.post("/:id/check-ins/:checkInId", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { checkInId } = z.object({ checkInId: z.string().max(64) }).parse(req.params);
  const { answers } = z.object({ answers: z.array(answerSchema).max(40) }).parse(req.body);

  res.json({ checkIn: await submitCheckIn(studioId, checkInId, answers) });
});

studios.get("/:id/metrics", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  res.json({ metrics: await listMetrics(studioId) });
});

studios.post("/:id/metrics", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const body = z
    .object({
      code: z
        .string()
        .trim()
        .min(2)
        .max(40)
        .regex(/^[a-z][a-z0-9_]*$/, "Lower case, digits and underscores."),
      name: z.string().trim().min(1).max(60),
      type: z.enum(["number", "text", "image", "rating"]),
      unit: z.string().trim().max(20).nullable().optional(),
    })
    .parse(req.body);

  res.status(201).json({ metric: await createMetric(studioId, body) });
});

/**
 * Pause, resume, end, or set when the coaching finishes.
 *
 * `endsAt` is nullable on purpose and `null` is a value here, not an omission — clearing
 * a date is a thing a coach does, so the schema distinguishes "not sent" from "sent as
 * null" rather than treating both as no change.
 */
const clientPatch = z.object({
  status: z.enum(ROSTER_STATUSES).optional(),
  endsAt: z.iso.datetime().nullable().optional(),
  /** Null means "inherit the studio's", which is a value here, not an omission. */
  checkInWeekday: z.number().int().min(0).max(6).nullable().optional(),
  checkInGraceDays: z.number().int().min(1).max(60).nullable().optional(),
  checkInsEnabled: z.boolean().optional(),
});

studios.patch("/:id/clients/:clientId", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { clientId } = clientParam.parse(req.params);
  const body = clientPatch.parse(req.body);

  res.json({
    client: await updateClient(studioId, clientId, {
      ...(body.status ? { status: body.status } : {}),
      ...("endsAt" in body ? { endsAt: body.endsAt ? new Date(body.endsAt) : null } : {}),
      ...("checkInWeekday" in body ? { checkInWeekday: body.checkInWeekday } : {}),
      ...("checkInGraceDays" in body ? { checkInGraceDays: body.checkInGraceDays } : {}),
      ...(body.checkInsEnabled !== undefined ? { checkInsEnabled: body.checkInsEnabled } : {}),
    }),
  });
});

const tagIds = z.object({ tagIds: z.array(z.string().max(64)).max(20) });

studios.put("/:id/clients/:clientId/tags", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { clientId } = z.object({ clientId: z.string().max(64) }).parse(req.params);
  res.json({ tags: await setClientTags(studioId, clientId, tagIds.parse(req.body).tagIds) });
});

/* -------------------------------------------------------------------------- */
/* Tags                                                                        */
/* -------------------------------------------------------------------------- */

studios.get("/:id/tags", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  res.json({ tags: await listTags(studioId) });
});

const newTag = z.object({
  name: z.string().trim().min(1).max(40),
  description: z.string().trim().max(200).nullish(),
  // Lower-cased before it reaches the CHECK, which only accepts lower-case hex.
  color: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^#[0-9a-f]{6}$/, "Pick a colour."),
});

studios.post("/:id/tags", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  res.status(201).json({ tag: await createTag(studioId, newTag.parse(req.body)) });
});

studios.delete("/:id/tags/:tagId", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { tagId } = z.object({ tagId: z.string().max(64) }).parse(req.params);
  await deleteTag(studioId, tagId);
  res.sendStatus(204);
});
