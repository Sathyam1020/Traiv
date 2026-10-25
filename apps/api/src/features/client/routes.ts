import { newId, schema } from "@traiv/db";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { requireStudio, requireStudioAuth } from "../../middleware/authorize.js";
import {
  READABLE_STATUSES,
  requireClient,
  requireClientAuth,
} from "../../middleware/client-authorize.js";
import { requireSession } from "../../middleware/session.js";
import { getClientCheckIn, listClientCheckIns, submitClientCheckIn } from "./check-ins.js";
import { completeIntake, FIRST_STEP, getIntake, LAST_STEP, saveStep } from "./intake.js";
import { joinByCode, previewJoin, rotateJoinCode, setJoinEnabled } from "./join.js";
import { getToday } from "./today.js";
import { signUpload, uploadsConfigured } from "./uploads.js";

export const join: Router = Router();

const code = z.string().min(4).max(16);

/** Public — the scanner sees who they are joining before being asked to sign in. */
join.get("/:code", async (req, res) => {
  const { code: c } = z.object({ code }).parse(req.params);
  res.json(await previewJoin(c));
});

join.post("/:code", async (req, res) => {
  const { userId } = requireSession(req);
  const { code: c } = z.object({ code }).parse(req.params);
  res.json(await joinByCode(userId, c));
});

/* ---- coach-side management, scoped to the studio named in the URL ---- */

export const studioJoin: Router = Router({ mergeParams: true });

/**
 * Mounted at `/studios/:studioId`, so the tenant comes from the request rather than the
 * session.
 *
 * `activeStudioId` is one value shared by every tab. A coach with studio A open in one
 * tab and B in another would have the first tab's writes land in B, and the membership
 * check would pass because they belong to both. The studio is per-tab UI state, so it
 * has to travel with the request. `activeStudioId` is now only "where to land after
 * signing in".
 */
studioJoin.get("/join-code", requireStudio({ param: "studioId" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const [studio] = await db
    .select({
      joinCode: schema.studios.joinCode,
      joinEnabled: schema.studios.joinEnabled,
      name: schema.studios.name,
    })
    .from(schema.studios)
    .where(eq(schema.studios.id, studioId))
    .limit(1);
  res.json(studio);
});

// Owner only: rotating invalidates every QR and link the studio has already handed out.
studioJoin.post(
  "/join-code/rotate",
  requireStudio({ param: "studioId", role: "owner" }),
  async (req, res) => {
    const { studioId } = requireStudioAuth(req);
    res.json({ joinCode: await rotateJoinCode(studioId) });
  },
);

// Owner only: closing the door to new clients is a studio-administration decision.
studioJoin.patch(
  "/join-code",
  requireStudio({ param: "studioId", role: "owner" }),
  async (req, res) => {
    const { studioId } = requireStudioAuth(req);
    const { enabled } = z.object({ enabled: z.boolean() }).parse(req.body);
    await setJoinEnabled(studioId, enabled);
    res.json({ joinEnabled: enabled });
  },
);

/* ---- client-side, scoped to the studio named in the URL ---- */

export const clientApp: Router = Router();

/**
 * Who the client is to this studio, and whose studio it is.
 *
 * A waiting client needs to see they are queued and a frozen one needs to see they are
 * frozen (ADR 0013), which is impossible if every status but `active` is refused
 * outright. Branding comes along because it is on ADR 0014's allowed-read list and the
 * app cannot render a studio without it.
 */
/**
 * Every studio this user is a client of.
 *
 * Not `requireClient` — that gate answers "may you act in *this* studio", and this is the
 * question that comes before it: which studios are there to ask about. A signed-in user
 * with no coaching relationship gets an empty list, not a 403, because having no coach is
 * a normal state and not a denial.
 *
 * Archived and deleted relationships are excluded here exactly as `requireClient`
 * excludes them, so the list never offers a studio that the next request would refuse.
 */
clientApp.get("/", async (req, res) => {
  const { userId } = requireSession(req);

  const rows = await db
    .select({
      studioId: schema.studios.id,
      name: schema.studios.name,
      brandDisplayName: schema.studios.brandDisplayName,
      brandLogoUrl: schema.studios.brandLogoUrl,
      brandColor: schema.studios.brandColor,
      clientId: schema.clients.id,
      status: schema.clients.status,
      joinedAt: schema.clients.createdAt,
    })
    .from(schema.clients)
    .innerJoin(schema.studios, eq(schema.studios.id, schema.clients.studioId))
    .where(
      and(
        eq(schema.clients.userId, userId),
        isNull(schema.clients.deletedAt),
        isNull(schema.studios.deletedAt),
        inArray(schema.clients.status, READABLE_STATUSES),
      ),
    )
    .orderBy(asc(schema.clients.createdAt));

  res.json({
    coaches: rows.map((r) => ({
      clientId: r.clientId,
      status: r.status,
      joinedAt: r.joinedAt,
      studio: {
        id: r.studioId,
        name: r.brandDisplayName || r.name,
        logoUrl: r.brandLogoUrl,
        color: r.brandColor,
      },
    })),
  });
});

clientApp.get("/:studioId/me", requireClient(), async (req, res) => {
  const { studioId, clientId, status } = requireClientAuth(req);

  const [studio] = await db
    .select({
      name: schema.studios.name,
      brandDisplayName: schema.studios.brandDisplayName,
      brandLogoUrl: schema.studios.brandLogoUrl,
      brandColor: schema.studios.brandColor,
    })
    .from(schema.studios)
    .where(eq(schema.studios.id, studioId))
    .limit(1);

  res.json({
    clientId,
    status,
    studio: {
      id: studioId,
      name: studio?.brandDisplayName || studio?.name,
      logoUrl: studio?.brandLogoUrl ?? null,
      color: studio?.brandColor ?? null,
    },
  });
});

/* ---- the home screen ---- */

/**
 * One request paints the whole screen.
 *
 * `personas.md` is a budget Android on basement-gym signal, and the Neon handshake from
 * India is 2-4s against a 50ms query — the cost here is per *request*, so six of them to
 * render one screen is six chances to fail slowly. Read-only, not `{ write: true }`: a
 * paused client should still see their own history and be told why it is paused.
 */
clientApp.get("/:studioId/today", requireClient(), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  const { userId } = requireSession(req);
  res.json({ today: await getToday(clientId, userId) });
});

/**
 * Log a weight, outside a check-in.
 *
 * `body_metric` is keyed on the user and append-only, which is exactly what this is: the
 * series the adaptation loop reads, and the one a check-in's weight answer also appends
 * to. `source` distinguishes them so a chart can say where a number came from.
 *
 * Weight is the only metric with a standalone home. Everything else a check-in asks for
 * lives in `check_in_answer`, which needs a check-in to belong to — so measurements
 * arrive weekly rather than whenever, and that is a schema fact rather than a choice
 * made here.
 */
clientApp.post("/:studioId/weight", requireClient({ write: true }), async (req, res) => {
  const { userId } = requireSession(req);
  // The same range as the column's check constraint. The database is what enforces it;
  // this is so a slipped decimal comes back as a message instead of a 500.
  const { kg } = z.object({ kg: z.number().min(25).max(400) }).parse(req.body);

  await db.insert(schema.bodyMetrics).values({
    id: newId(),
    userId,
    weightKg: kg,
    source: "client",
  });

  res.status(201).json({ weightKg: kg });
});

/* ---- check-ins ---- */

const checkInParam = z.object({ checkInId: z.string().max(64) });

clientApp.get("/:studioId/check-ins", requireClient(), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  res.json(await listClientCheckIns(clientId));
});

clientApp.get("/:studioId/check-ins/:checkInId", requireClient(), async (req, res) => {
  const { studioId, clientId } = requireClientAuth(req);
  const { checkInId } = checkInParam.parse(req.params);
  res.json(await getClientCheckIn(studioId, clientId, checkInId));
});

/**
 * One answer per metric, exactly one value field — which the `check_in_answer_one_value`
 * constraint also enforces, so a payload that slips past this is refused by the database
 * rather than stored as something nobody can read.
 */
const answerSchema = z.object({
  metricId: z.string().max(64),
  numberValue: z.number().finite().nullable().optional(),
  textValue: z.string().max(4000).nullable().optional(),
  ratingValue: z.number().int().min(1).max(5).nullable().optional(),
  imageUrl: z.string().url().max(2000).nullable().optional(),
});

/**
 * Submit.
 *
 * `submissionId` is accepted and deliberately not stored. The client mints one per draft
 * and resends it on retry; submission is already idempotent because answers are replaced
 * rather than appended and the row is set to `completed` either way, so a retry after a
 * dropped response converges instead of creating a second check-in. Reading it here is
 * what lets the field be checked in a test rather than being a comment in the client.
 */
clientApp.post(
  "/:studioId/check-ins/:checkInId",
  requireClient({ write: true }),
  async (req, res) => {
    const { studioId, clientId } = requireClientAuth(req);
    const { checkInId } = checkInParam.parse(req.params);
    const { answers } = z
      .object({
        answers: z.array(answerSchema).max(40),
        submissionId: z.string().uuid().optional(),
      })
      .parse(req.body);

    res.json({ checkIn: await submitClientCheckIn(studioId, clientId, checkInId, answers) });
  },
);

/* ---- photo uploads ---- */

/**
 * A signed ticket for one photo, uploaded by the browser straight to Cloudinary.
 *
 * The folder is derived from the client id inside the signature, so a ticket cannot be
 * pointed at anybody else's photos. 503 when Cloudinary is not configured, which the
 * check-in form reads to hide the camera rather than offering a button that fails.
 */
clientApp.post("/:studioId/uploads/sign", requireClient({ write: true }), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  const { kind } = z
    .object({ kind: z.enum(["check-in", "avatar"]).default("check-in") })
    .parse(req.body ?? {});
  res.json(signUpload(clientId, kind));
});

/** Asked before the form offers a camera at all. Cheap, and answers without a secret. */
clientApp.get("/:studioId/uploads/config", requireClient(), (_req, res) => {
  res.json({ uploads: uploadsConfigured() });
});

/**
 * Onboarding.
 *
 * The answers belong to the person, not to one coaching relationship — somebody who hires
 * a dietitian alongside their lifting coach should not be asked their height twice.
 *
 * Still mounted under a studio, because that is what establishes the right to be here: you
 * may edit your own profile while you are somebody's client. The studio decides whether the
 * request is allowed; the session decides whose row it touches, so there is no id in the
 * body for anyone to swap for somebody else's.
 */

const EQUIPMENT = ["full_gym", "home_basics", "dumbbells", "bodyweight", "bands"] as const;
const HEALTH_FLAGS = [
  "knee",
  "lower_back",
  "shoulder",
  "diabetes",
  "blood_pressure",
  "thyroid",
  "pcos",
  "pregnancy",
] as const;
const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

/**
 * Every field optional, because every step is skippable. The ranges match the check
 * constraints on the table — the database is the one that actually enforces them, this
 * just means a slipped decimal comes back as a message instead of a 500.
 */
const intakePatch = z
  .object({
    goal: z.enum([
      "lose_fat",
      "build_muscle",
      "get_stronger",
      "maintain",
      "improve_fitness",
      "general_health",
    ]),
    targetWeightKg: z.number().min(25).max(400),
    sex: z.enum(["male", "female", "undisclosed"]),
    birthYear: z.int().min(1900).max(2100),
    heightCm: z.number().min(90).max(250),
    weightKg: z.number().min(25).max(400),
    dailyActivity: z.enum(["sedentary", "light", "moderate", "very", "extra"]),
    experience: z.enum(["new", "some", "experienced"]),
    daysPerWeek: z.int().min(1).max(7),
    sessionMinutes: z.int().min(10).max(240),
    equipment: z.array(z.enum(EQUIPMENT)).max(EQUIPMENT.length),
    diet: z.enum(["vegetarian", "non_vegetarian", "eggetarian", "vegan", "jain"]),
    allergies: z.string().max(500),
    dislikes: z.string().max(500),
    mealsPerDay: z.int().min(1).max(8),
    healthFlags: z.array(z.enum(HEALTH_FLAGS)).max(HEALTH_FLAGS.length),
    healthNote: z.string().max(1000),
    trainingDays: z.array(z.enum(DAYS)).max(7),
    preferredTime: z.enum(["morning", "afternoon", "evening", "varies"]),
  })
  .partial();

clientApp.get("/:studioId/intake", requireClient(), async (req, res) => {
  const { userId } = requireSession(req);
  res.json(await getIntake(userId));
});

clientApp.patch("/:studioId/intake", requireClient({ write: true }), async (req, res) => {
  const { userId } = requireSession(req);
  const { step, ...patch } = z
    .object({ step: z.int().min(FIRST_STEP).max(LAST_STEP) })
    .extend(intakePatch.shape)
    .parse(req.body);

  await saveStep(userId, step, patch);
  res.json(await getIntake(userId));
});

clientApp.post("/:studioId/intake/complete", requireClient({ write: true }), async (req, res) => {
  const { userId } = requireSession(req);
  const { target, awaitingReview } = await completeIntake(userId);
  res.json({ target, awaitingReview });
});
