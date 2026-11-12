import { schema } from "@traiv/db";
import { Router } from "express";
import { z } from "zod";
import { studioExerciseEdits } from "../../library/exercise-customizations.js";
import { requireStudio, requireStudioAuth } from "../../middleware/authorize.js";
import { requireSession } from "../../middleware/session.js";
import { stepsDate as developmentDay, stepsPeriod } from "../client/steps-validation.js";
import { trainerMessaging } from "../messaging/routes.js";
import { trainerVault } from "../vault/routes.js";
import {
  checkInTrend,
  createMetric,
  ensureCheckIns,
  getCheckIn,
  listMetrics,
  submitCheckIn,
} from "./check-ins.js";
import { clientFoodRouter } from "./client-food.js";
import {
  development,
  developmentClient,
  readSteps,
  reviewDevelopment,
  saveStepGoal,
} from "./development.js";
import {
  archiveMealPlan,
  clientMealPlans,
  clientPlanCreateSchema,
  createClientMealPlan,
  createMealPlan,
  discardMealPlan,
  duplicateMealPlan,
  getMealPlan,
  listMealPlans,
  liveMealPlanTemplates,
  mealPlanPresets,
  mealPlanRecipeOption,
  planDocumentSchema,
  planWriteSchema,
  presetSchema,
  publishMealPlan,
  saveMealPlanPreset,
  updateMealPlan,
} from "./meal-plans.js";
import { measurementsRouter } from "./measurements.js";
import {
  createIngredient,
  deleteIngredient,
  deleteRecipe,
  duplicateRecipe,
  getIngredient,
  getRecipe,
  ingredientInput,
  libraryQuery,
  listIngredients,
  listRecipes,
  parseNutritionInput,
  recipeInput,
  saveRecipe,
  updateIngredient,
} from "./nutrition.js";
import {
  createTag,
  deleteTag,
  FILTERS,
  getClient,
  getClientOverview,
  listRoster,
  listTags,
  ROSTER_STATUSES,
  SETTABLE_CLIENT_STATUSES,
  setClientTags,
  updateClient,
} from "./roster.js";
import { activateStudio, listStudios, preferredStudio, renameStudio } from "./service.js";
import { trainingRouter } from "./training.js";
import { signStudioUpload, studioUploadsConfigured } from "./uploads.js";
import {
  archiveTemplate,
  createExercise,
  createTemplate,
  deleteExercise,
  deleteSavedSection,
  duplicateTemplate,
  duplicateTemplateForClient,
  exerciseFacets,
  getExercise,
  getTemplate,
  listClientPrograms,
  listExercises,
  listSavedSections,
  listTemplates,
  saveClientProgramAsTemplate,
  saveSectionForReuse,
  setTemplateStatus,
  updateExercise,
  updateTemplate,
} from "./workouts.js";

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

/** The business's own name, not the owner's — owner-only, same reasoning as billing. */
studios.patch("/:id", requireStudio({ param: "id", role: "owner" }), async (req, res) => {
  const { userId } = requireSession(req);
  const { studioId } = requireStudioAuth(req);
  const body = z.object({ name: z.string().trim().min(1).max(120) }).parse(req.body);
  res.json({ studio: await renameStudio(studioId, userId, body.name) });
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
  res.json(
    await listRoster({
      studioId,
      viewerId: requireSession(req).userId,
      ...rosterQuery.parse(req.query),
    }),
  );
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
 * Pause, resume, end, set when the coaching finishes, or correct when it started.
 *
 * `endsAt` is nullable on purpose and `null` is a value here, not an omission — clearing
 * a date is a thing a coach does, so the schema distinguishes "not sent" from "sent as
 * null" rather than treating both as no change. `startedAt` is not nullable — every
 * client has a start date, open-ended or not, so there is nothing to clear.
 */
const clientPatch = z.object({
  status: z.enum(SETTABLE_CLIENT_STATUSES).optional(),
  startedAt: z.iso.datetime().optional(),
  endsAt: z.iso.datetime().nullable().optional(),
  /** Null means "inherit the studio's", which is a value here, not an omission. */
  checkInWeekday: z.number().int().min(0).max(6).nullable().optional(),
  checkInGraceDays: z.number().int().min(1).max(60).nullable().optional(),
  checkInsEnabled: z.boolean().optional(),
});

studios.patch("/:id/clients/:clientId", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId, membershipId } = requireStudioAuth(req);
  const { clientId } = clientParam.parse(req.params);
  const body = clientPatch.parse(req.body);

  res.json({
    client: await updateClient(studioId, clientId, membershipId, {
      ...(body.status ? { status: body.status } : {}),
      ...(body.startedAt ? { startedAt: new Date(body.startedAt) } : {}),
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

/* -------------------------------------------------------------------------- */
/* Media uploads — the studio-scoped twin of the client app's check-in uploads */
/* -------------------------------------------------------------------------- */

/**
 * A signed ticket for one upload, uploaded by the browser straight to Cloudinary.
 *
 * The folder is derived from the studio id inside the signature, so a ticket cannot be
 * pointed at anybody else's media. 503 when Cloudinary is not configured, which the New
 * Recipe/New Ingredient panels read to hide the upload button rather than offering one
 * that fails.
 */
studios.post("/:id/uploads/sign", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { kind } = z
    .object({
      kind: z.enum([
        "recipe-image",
        "recipe-video",
        "ingredient-image",
        "mealplan-cover",
        "exercise-image",
        "exercise-video",
      ]),
    })
    .parse(req.body ?? {});
  res.json(signStudioUpload(studioId, kind));
});

/** Asked before a panel offers an upload button at all. */
studios.get("/:id/uploads/config", requireStudio({ param: "id" }), (_req, res) => {
  res.json({ uploads: studioUploadsConfigured() });
});

/* -------------------------------------------------------------------------- */
/* Workouts — ADR 0024: Template → Session → Exercise → Set                    */
/* -------------------------------------------------------------------------- */

const templateParam = z.object({ templateId: z.string().max(64) });

const setInput = z.object({
  id: z.string().max(64).optional(),
  reps: z.int().min(0).max(1000).nullable().optional(),
  repsMax: z.int().min(0).max(1000).nullable().optional(),
  weightKg: z.number().min(0).max(1000).nullable().optional(),
  seconds: z.int().min(0).max(86_400).nullable().optional(),
  distanceM: z.number().min(0).max(1_000_000).nullable().optional(),
  calories: z.int().min(0).max(10_000).nullable().optional(),
  restSeconds: z.int().min(0).max(3600).nullable().optional(),
});

/** "The fields a set starts with … in this order" — a free list, not an enum, because
 * a coach can pick any combination for any exercise. */
const FIELD_NAMES = [
  "weight",
  "reps",
  "rep_range",
  "rest",
  "duration",
  "distance",
  "calories",
] as const;

const templateInput = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(4096).nullable().optional(),
  imageUrl: z.string().url().max(2000).nullable().optional(),
  defaultValues: z
    .object({
      sets: z.int().min(1).max(20).optional(),
      reps: z.int().min(0).max(1000).optional(),
      rest: z.int().min(0).max(3600).optional(),
      weightKg: z.number().min(0).max(1000).optional(),
      durationSeconds: z.int().min(0).max(86_400).optional(),
      distanceM: z.number().min(0).max(1_000_000).optional(),
    })
    .nullable()
    .optional(),
  sessions: z
    .array(
      z.object({
        id: z.string().max(64).optional(),
        name: z.string().trim().max(120),
        exercises: z
          .array(
            z.object({
              id: z.string().max(64).optional(),
              exerciseId: z.string().max(256),
              fields: z.array(z.enum(FIELD_NAMES)).max(7).optional(),
              supersetGroup: z.int().min(0).max(20).nullable().optional(),
              note: z.string().max(1000).nullable().optional(),
              sets: z.array(setInput).max(20),
            }),
          )
          .max(40),
      }),
    )
    .max(20),
});

studios.get("/:id/exercise-customizations", requireStudio({ param: "id" }), async (req, res) => {
  res.setHeader("Cache-Control", "private, no-store");
  res.json({ exercises: await studioExerciseEdits(requireStudioAuth(req).studioId) });
});

studios.get("/:id/exercise-filters", requireStudio({ param: "id" }), async (req, res) => {
  res.setHeader("Cache-Control", "private, no-store");
  res.json(await exerciseFacets(requireStudioAuth(req).studioId));
});

studios.get("/:id/exercises", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const opts = z
    .object({
      offset: z.coerce.number().int().min(0).max(100000).optional(),
      q: z.string().trim().max(200).optional(),
      muscle: z.string().max(60).optional(),
      equipment: z.string().max(60).optional(),
      category: z.string().max(60).optional(),
    })
    .parse(req.query);
  res.setHeader("Cache-Control", "private, no-store");
  res.json(await listExercises(studioId, opts));
});

studios.get("/:id/exercises/:exerciseId", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { exerciseId } = z.object({ exerciseId: z.string().max(256) }).parse(req.params);
  res.setHeader("Cache-Control", "private, no-store");
  res.json({ exercise: await getExercise(studioId, exerciseId) });
});

const exerciseWrite = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().max(8192).nullable().optional(),
  muscle: z.string().trim().min(1).max(60),
  secondaryMuscles: z.array(z.string().max(60)).max(6).optional(),
  equipment: z.string().trim().min(1).max(60),
  pattern: z.enum(schema.movementPattern.enumValues),
  imageUrl: z.string().url().max(2000).nullable().optional(),
  videoUrl: z.string().url().max(2000).nullable().optional(),
  stimulus: z.string().max(60).nullable().optional(),
  level: z.string().max(60).nullable().optional(),
  category: z.string().max(60).nullable().optional(),
  location: z.string().max(60).nullable().optional(),
  injuryRisk: z.string().max(60).nullable().optional(),
  defaultFields: z.array(z.enum(FIELD_NAMES)).max(7).optional(),
});

studios.post("/:id/exercises", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  res.status(201).json({ exercise: await createExercise(studioId, exerciseWrite.parse(req.body)) });
});

studios.patch("/:id/exercises/:exerciseId", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { exerciseId } = z.object({ exerciseId: z.string().max(256) }).parse(req.params);
  res.json({ exercise: await updateExercise(studioId, exerciseId, exerciseWrite.parse(req.body)) });
});

studios.delete("/:id/exercises/:exerciseId", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { exerciseId } = z.object({ exerciseId: z.string().max(256) }).parse(req.params);
  await deleteExercise(studioId, exerciseId);
  res.status(204).end();
});

/* ---- the studio's template library ---- */

studios.get("/:id/workout-templates", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { status } = z.object({ status: z.enum(["draft", "active"]).optional() }).parse(req.query);
  res.json({ templates: await listTemplates(studioId, { status }) });
});

studios.post("/:id/workout-templates", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId, membershipId } = requireStudioAuth(req);
  res.status(201).json({
    template: await createTemplate(studioId, null, membershipId, templateInput.parse(req.body)),
  });
});

studios.get(
  "/:id/workout-templates/:templateId",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId } = requireStudioAuth(req);
    const { templateId } = templateParam.parse(req.params);
    res.json({ template: await getTemplate(studioId, templateId) });
  },
);

studios.patch(
  "/:id/workout-templates/:templateId",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId } = requireStudioAuth(req);
    const { templateId } = templateParam.parse(req.params);
    res.json({
      template: await updateTemplate(studioId, templateId, templateInput.parse(req.body)),
    });
  },
);

studios.delete(
  "/:id/workout-templates/:templateId",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId } = requireStudioAuth(req);
    const { templateId } = templateParam.parse(req.params);
    await archiveTemplate(studioId, templateId);
    res.status(204).end();
  },
);

studios.post(
  "/:id/workout-templates/:templateId/duplicate",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId, membershipId } = requireStudioAuth(req);
    const { templateId } = templateParam.parse(req.params);
    res.status(201).json({ template: await duplicateTemplate(studioId, templateId, membershipId) });
  },
);

studios.patch(
  "/:id/workout-templates/:templateId/status",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId } = requireStudioAuth(req);
    const { templateId } = templateParam.parse(req.params);
    const { status } = z.object({ status: z.enum(["draft", "active"]) }).parse(req.body);
    res.json({ template: await setTemplateStatus(studioId, templateId, status) });
  },
);

/* ---- a client's own programmes ---- */

studios.get("/:id/clients/:clientId/workouts", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { clientId } = clientParam.parse(req.params);
  await getClient(studioId, clientId);
  res.json({ templates: await listClientPrograms(studioId, clientId) });
});

/** "Create new program" — written for this client directly, not copied. */
studios.post(
  "/:id/clients/:clientId/workouts",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId, membershipId } = requireStudioAuth(req);
    const { clientId } = clientParam.parse(req.params);
    await getClient(studioId, clientId);
    res.status(201).json({
      template: await createTemplate(
        studioId,
        clientId,
        membershipId,
        templateInput.parse(req.body),
      ),
    });
  },
);

/**
 * "Duplicate from Template" → "Customize Template". Copies one studio template into one
 * client's own list, as a fresh draft only they (once published) will see.
 */
studios.post(
  "/:id/clients/:clientId/workouts/from-template",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId, membershipId } = requireStudioAuth(req);
    const { clientId } = clientParam.parse(req.params);
    await getClient(studioId, clientId);

    const body = z
      .object({
        templateId: z.string().max(64),
        name: z.string().trim().max(120).optional(),
        description: z.string().max(4096).nullable().optional(),
        imageUrl: z.string().url().max(2000).nullable().optional(),
      })
      .parse(req.body);

    res.status(201).json({
      template: await duplicateTemplateForClient(
        studioId,
        body.templateId,
        clientId,
        membershipId,
        {
          name: body.name,
          description: body.description,
          imageUrl: body.imageUrl,
        },
      ),
    });
  },
);

studios.post(
  "/:id/clients/:clientId/workouts/:templateId/save-as-template",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId, membershipId } = requireStudioAuth(req);
    const { clientId } = clientParam.parse(req.params);
    const { templateId } = templateParam.parse(req.params);
    await getClient(studioId, clientId);
    res
      .status(201)
      .json({ template: await saveClientProgramAsTemplate(studioId, templateId, membershipId) });
  },
);

/* ---- saved sections ---- */

studios.get("/:id/workout-sections/saved", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  res.json({ sections: await listSavedSections(studioId) });
});

studios.post(
  "/:id/workout-sessions/:sessionId/save-for-reuse",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId } = requireStudioAuth(req);
    const { sessionId } = z.object({ sessionId: z.string().max(64) }).parse(req.params);
    const { name } = z
      .object({ name: z.string().trim().max(120).optional() })
      .parse(req.body ?? {});
    res.status(201).json({ section: await saveSectionForReuse(studioId, sessionId, name) });
  },
);

studios.delete(
  "/:id/workout-sections/saved/:savedId",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId } = requireStudioAuth(req);
    const { savedId } = z.object({ savedId: z.string().max(64) }).parse(req.params);
    await deleteSavedSection(studioId, savedId);
    res.status(204).end();
  },
);

/* Nutrition: every endpoint carries the same per-request studio membership gate. */
studios.get("/:id/ingredients", requireStudio({ param: "id" }), async (req, res) => {
  res.json(await listIngredients(requireStudioAuth(req).studioId, libraryQuery.parse(req.query)));
});
studios.post("/:id/ingredients", requireStudio({ param: "id" }), async (req, res) => {
  res
    .status(201)
    .json(
      await createIngredient(
        requireStudioAuth(req).studioId,
        parseNutritionInput(ingredientInput, req.body),
      ),
    );
});
studios.get("/:id/ingredients/:ingredientId", requireStudio({ param: "id" }), async (req, res) => {
  res.json(
    await getIngredient(
      requireStudioAuth(req).studioId,
      z.string().min(1).max(64).parse(req.params.ingredientId),
    ),
  );
});
studios.patch(
  "/:id/ingredients/:ingredientId",
  requireStudio({ param: "id" }),
  async (req, res) => {
    res.json(
      await updateIngredient(
        requireStudioAuth(req).studioId,
        z.string().min(1).max(64).parse(req.params.ingredientId),
        parseNutritionInput(ingredientInput, req.body),
      ),
    );
  },
);
studios.delete(
  "/:id/ingredients/:ingredientId",
  requireStudio({ param: "id" }),
  async (req, res) => {
    await deleteIngredient(
      requireStudioAuth(req).studioId,
      z.string().min(1).max(64).parse(req.params.ingredientId),
    );
    res.json({ deleted: true });
  },
);
studios.get("/:id/recipes", requireStudio({ param: "id" }), async (req, res) => {
  res.json(await listRecipes(requireStudioAuth(req).studioId, libraryQuery.parse(req.query)));
});
studios.post("/:id/recipes", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId, membershipId } = requireStudioAuth(req);
  res
    .status(201)
    .json(await saveRecipe(studioId, membershipId, parseNutritionInput(recipeInput, req.body)));
});
studios.get("/:id/recipes/:recipeId", requireStudio({ param: "id" }), async (req, res) => {
  res.json(
    await getRecipe(
      requireStudioAuth(req).studioId,
      z.string().min(1).max(64).parse(req.params.recipeId),
    ),
  );
});
studios.patch("/:id/recipes/:recipeId", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId, membershipId } = requireStudioAuth(req);
  res.json(
    await saveRecipe(
      studioId,
      membershipId,
      parseNutritionInput(recipeInput, req.body),
      z.string().min(1).max(64).parse(req.params.recipeId),
    ),
  );
});
studios.post(
  "/:id/recipes/:recipeId/duplicate",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId, membershipId } = requireStudioAuth(req);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.body);
    res
      .status(201)
      .json(
        await duplicateRecipe(
          studioId,
          membershipId,
          z.string().min(1).max(64).parse(req.params.recipeId),
          id,
        ),
      );
  },
);
studios.delete("/:id/recipes/:recipeId", requireStudio({ param: "id" }), async (req, res) => {
  await deleteRecipe(
    requireStudioAuth(req).studioId,
    z.string().min(1).max(64).parse(req.params.recipeId),
  );
  res.json({ deleted: true });
});

// Meal plan templates. Client assignment is deliberately a later phase.
studios.get("/:id/mealplan-presets", requireStudio({ param: "id" }), async (req, res) => {
  res.json(await mealPlanPresets(requireStudioAuth(req).studioId));
});
studios.post("/:id/mealplan-presets", requireStudio({ param: "id" }), async (req, res) => {
  res
    .status(201)
    .json(await saveMealPlanPreset(requireStudioAuth(req).studioId, presetSchema.parse(req.body)));
});
studios.get("/:id/mealplan-recipes/:recipeId", requireStudio({ param: "id" }), async (req, res) => {
  res.json(
    await mealPlanRecipeOption(
      requireStudioAuth(req).studioId,
      z.string().parse(req.params.recipeId),
    ),
  );
});
studios.get("/:id/mealplans", requireStudio({ param: "id" }), async (req, res) => {
  const q = z
    .object({
      search: z.string().max(120).default(""),
      page: z.coerce.number().int().min(1).max(10000).default(1),
    })
    .parse(req.query);
  res.json(await listMealPlans(requireStudioAuth(req).studioId, q.search, q.page));
});
studios.post("/:id/mealplans", requireStudio({ param: "id" }), async (req, res) => {
  const auth = requireStudioAuth(req);
  const input = z.object({ id: z.string().uuid(), document: planDocumentSchema }).parse(req.body);
  res
    .status(201)
    .json(await createMealPlan(auth.studioId, auth.membershipId, input.id, input.document));
});
studios.get("/:id/mealplans/:planId", requireStudio({ param: "id" }), async (req, res) => {
  res.json(
    await getMealPlan(requireStudioAuth(req).studioId, z.string().uuid().parse(req.params.planId)),
  );
});
studios.put("/:id/mealplans/:planId", requireStudio({ param: "id" }), async (req, res) => {
  const auth = requireStudioAuth(req);
  res.json(
    await updateMealPlan(
      auth.studioId,
      auth.membershipId,
      z.string().uuid().parse(req.params.planId),
      planWriteSchema.parse(req.body),
    ),
  );
});
studios.post("/:id/mealplans/:planId/publish", requireStudio({ param: "id" }), async (req, res) => {
  res.json(
    await publishMealPlan(
      requireStudioAuth(req).studioId,
      z.string().uuid().parse(req.params.planId),
      z.object({ expectedUpdatedAt: z.iso.datetime() }).parse(req.body).expectedUpdatedAt,
    ),
  );
});
studios.post("/:id/mealplans/:planId/discard", requireStudio({ param: "id" }), async (req, res) => {
  const auth = requireStudioAuth(req);
  res.json(
    await discardMealPlan(
      auth.studioId,
      auth.membershipId,
      z.string().uuid().parse(req.params.planId),
      z.object({ expectedUpdatedAt: z.iso.datetime() }).parse(req.body).expectedUpdatedAt,
    ),
  );
});
studios.post(
  "/:id/mealplans/:planId/duplicate",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const auth = requireStudioAuth(req);
    res
      .status(201)
      .json(
        await duplicateMealPlan(
          auth.studioId,
          auth.membershipId,
          z.string().uuid().parse(req.params.planId),
          z.object({ id: z.string().uuid() }).parse(req.body).id,
        ),
      );
  },
);
studios.post("/:id/mealplans/:planId/archive", requireStudio({ param: "id" }), async (req, res) => {
  await archiveMealPlan(
    requireStudioAuth(req).studioId,
    z.string().uuid().parse(req.params.planId),
    z.object({ expectedUpdatedAt: z.iso.datetime() }).parse(req.body).expectedUpdatedAt,
  );
  res.json({ archived: true });
});

studios.get(
  "/:id/clients/:clientId/mealplans",
  requireStudio({ param: "id" }),
  async (req, res) => {
    res.json(
      await clientMealPlans(
        requireStudioAuth(req).studioId,
        z.string().uuid().parse(req.params.clientId),
      ),
    );
  },
);
studios.post(
  "/:id/clients/:clientId/mealplans",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const auth = requireStudioAuth(req);
    res
      .status(201)
      .json(
        await createClientMealPlan(
          auth.studioId,
          z.string().uuid().parse(req.params.clientId),
          auth.membershipId,
          clientPlanCreateSchema.parse(req.body),
        ),
      );
  },
);
studios.get("/:id/mealplan-templates/live", requireStudio({ param: "id" }), async (req, res) => {
  const q = z
    .object({
      search: z.string().max(120).default(""),
      page: z.coerce.number().int().min(1).max(10000).default(1),
    })
    .parse(req.query);
  res.json(await liveMealPlanTemplates(requireStudioAuth(req).studioId, q.search, q.page));
});

studios.use("/:id/clients/:clientId/food", clientFoodRouter);
studios.use("/:id/clients/:clientId/measurements", measurementsRouter);
studios.use("/:id/clients/:clientId/training", requireStudio({ param: "id" }), trainingRouter);

studios.use("/:id/inbox", trainerMessaging);

studios.get(
  "/:id/clients/:clientId/development",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId } = requireStudioAuth(req);
    const { clientId } = clientParam.parse(req.params);
    res.json(await development(studioId, clientId));
  },
);
studios.get("/:id/clients/:clientId/steps", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { clientId } = clientParam.parse(req.params);
  await developmentClient(studioId, clientId);
  const { start, end } = stepsPeriod.parse(req.query);
  res.json(await readSteps(clientId, start, end));
});
studios.put(
  "/:id/clients/:clientId/step-goal",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId } = requireStudioAuth(req);
    const { clientId } = clientParam.parse(req.params);
    await developmentClient(studioId, clientId);
    const { date, count } = z
      .object({ date: developmentDay, count: z.number().int().min(100).max(100000) })
      .parse(req.body);
    await saveStepGoal(clientId, date, count);
    res.json({ saved: true });
  },
);
studios.post(
  "/:id/clients/:clientId/development/:checkInId/review",
  requireStudio({ param: "id" }),
  async (req, res) => {
    const { studioId } = requireStudioAuth(req);
    const { clientId } = clientParam.parse(req.params);
    const checkInId = z.string().uuid().parse(req.params.checkInId);
    await reviewDevelopment(studioId, clientId, checkInId, requireSession(req).userId);
    res.json({ saved: true });
  },
);

studios.use("/:id/vault", trainerVault);
