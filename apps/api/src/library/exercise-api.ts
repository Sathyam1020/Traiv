import { schema } from "@traiv/db";
import { type ExerciseFacets, normalizeFilters } from "@traiv/exercises";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db.js";
import { env } from "../env.js";
import { AppError, badRequest } from "../errors.js";

const PREFIX = "exa:";
export const exerciseApiEnabled = () => env.EXERCISE_CATALOG === "exerciseapi";
export const isProviderExercise = (id: string) => id.startsWith(PREFIX);
const sourceId = z
  .string()
  .min(1)
  .max(240)
  .refine(
    (value) =>
      Array.from(value).every(
        (c) => c.charCodeAt(0) >= 32 && c !== "/" && c !== String.fromCharCode(92),
      ),
    "Invalid exercise identifier",
  );
const remoteSchema = z.object({
  id: sourceId,
  name: z.string(),
  primaryMuscles: z.array(z.string()).default([]),
  secondaryMuscles: z.array(z.string()).default([]),
  equipment: z.string().nullable(),
  force: z.string().nullable().optional(),
  level: z.string().nullable(),
  mechanic: z.string().nullable(),
  category: z.string(),
  instructions: z.array(z.string()).default([]),
  exerciseTips: z.array(z.string()).default([]),
  overview: z.string().default(""),
  videos: z
    .array(z.object({ url: z.string().url(), aspectRatio: z.string().optional() }))
    .default([]),
});
type Remote = z.infer<typeof remoteSchema>;
export type CatalogOptions = {
  q?: string;
  muscle?: string;
  equipment?: string;
  category?: string;
  offset?: number;
};

// No process-wide payload cache: provider guidance permits per-device caching only.
let blockedUntil = 0;
async function request(path: string, params?: URLSearchParams) {
  if (!env.EXERCISEAPI_KEY)
    throw new AppError(
      503,
      "exercise_provider_unconfigured",
      "The exercise library is not configured.",
    );
  if (Date.now() < blockedUntil)
    throw new AppError(
      429,
      "exercise_provider_limit",
      "The exercise library request limit has been reached. Please try again later.",
    );
  const url = new URL(`https://api.exerciseapi.dev/v1/${path}`);
  if (params) url.search = params.toString();
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "X-API-Key": env.EXERCISEAPI_KEY, Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
      redirect: "error",
    });
  } catch {
    throw new AppError(
      503,
      "exercise_provider_unavailable",
      "The exercise library is temporarily unavailable. Your saved workouts are still available.",
    );
  }
  if (response.status === 429) {
    const retry = Number(response.headers.get("Retry-After") ?? 60);
    blockedUntil = Date.now() + Math.max(1, Number.isFinite(retry) ? retry : 60) * 1000;
    throw new AppError(
      429,
      "exercise_provider_limit",
      "The exercise library request limit has been reached. Please try again later.",
    );
  }
  if (!response.ok)
    throw new AppError(
      response.status === 404 ? 404 : 503,
      "exercise_provider_error",
      response.status === 404
        ? "This exercise is no longer available from the provider."
        : "Couldn't load the exercise library. Please try again.",
    );
  const remaining = response.headers.get("X-RateLimit-Remaining");
  const reset = Number(response.headers.get("X-RateLimit-Reset"));
  if (remaining === "0" && Number.isFinite(reset) && reset * 1000 > Date.now())
    blockedUntil = reset * 1000;
  try {
    return await response.json();
  } catch {
    throw new AppError(
      502,
      "exercise_provider_invalid",
      "The exercise library returned an invalid response.",
    );
  }
}

function muscleGroup(raw: string) {
  const name = raw.toLowerCase();
  for (const [pattern, label] of [
    ["pector", "Chest"],
    ["deltoid", "Shoulders"],
    ["triceps", "Triceps"],
    ["biceps brach", "Biceps"],
    ["latissimus", "Lats"],
    ["trapez", "Traps"],
    ["erector", "Lower back"],
    ["rectus femoris", "Quadriceps"],
    ["vastus", "Quadriceps"],
    ["biceps femoris", "Hamstrings"],
    ["semitend", "Hamstrings"],
    ["glute", "Glutes"],
    ["gastrocn", "Calves"],
    ["soleus", "Calves"],
    ["abdomin", "Abdominals"],
    ["obliqu", "Abdominals"],
    ["brachiorad", "Forearms"],
  ]) {
    if (pattern && label && name.includes(pattern)) return label;
  }
  return raw || "Full body";
}
function patternFor(e: Remote): typeof schema.exercises.$inferInsert.pattern {
  const n = e.name.toLowerCase();
  if (/yoga|mobility|stretch|physical_therapy|pilates/.test(e.category)) return "mobility";
  if (/conditioning/.test(e.category)) return "cardio";
  if (/lunge|split squat/.test(n)) return "lunge";
  if (/deadlift|hip thrust|good morning|glute bridge|swing/.test(n)) return "hinge";
  if (/squat|leg press/.test(n)) return "squat";
  if (/carry|farmer|suitcase/.test(n)) return "carry";
  if (/pull.?up|chin.?up|pulldown/.test(n)) return "pull_vertical";
  if (/row/.test(n)) return "pull_horizontal";
  if (/overhead|shoulder press|military press|handstand/.test(n)) return "push_vertical";
  if (e.force === "push") return "push_horizontal";
  if (e.force === "pull") return "pull_horizontal";
  return "core";
}
function fieldsFor(e: Remote) {
  if (/conditioning/.test(e.category)) return ["duration", "distance"];
  if (/yoga|mobility|stretch|pilates/.test(e.category)) return ["duration"];
  return e.equipment === "body only" ? ["reps", "rest"] : ["weight", "reps", "rest"];
}
export function mapExercise(e: Remote) {
  const video = e.videos.find((v) => {
    try {
      const u = new URL(v.url);
      return u.protocol === "https:" && u.hostname === "cdn.exerciseapi.dev";
    } catch {
      return false;
    }
  });
  return {
    id: PREFIX + e.id,
    name: e.name,
    pattern: patternFor(e),
    muscle: muscleGroup(e.primaryMuscles[0] ?? "Full body"),
    equipment: e.equipment ?? "body only",
    videoUrl: video?.url ?? null,
    imageUrl: null,
    videoAspectRatio: video?.aspectRatio ?? null,
    description: [e.overview, ...e.instructions].filter(Boolean).join("\n\n"),
    cues: e.exerciseTips.join("\n"),
    secondaryMuscles: [...new Set(e.secondaryMuscles.map(muscleGroup))],
    stimulus: e.mechanic,
    level: e.level,
    category: e.category,
    defaultFields: fieldsFor(e),
    location: null,
    injuryRisk: null,
    studioId: null,
    shared: true,
    createdAt: new Date(0),
    deletedAt: null,
  };
}
export async function providerExercise(id: string) {
  if (!isProviderExercise(id))
    throw badRequest("invalid_provider_exercise", "Invalid exercise reference.");
  const externalId = sourceId.parse(id.slice(PREFIX.length));
  const body = parseProviderResponse(
    z.object({ data: remoteSchema }),
    await request(`exercises/${encodeURIComponent(externalId)}`),
  );
  return mapExercise(body.data);
}
export async function providerExercises(opts: CatalogOptions) {
  const offset = opts.offset ?? 0;
  // Always enforce free-compatible page sizes, including while a key has a Pro trial.
  if (offset >= 500)
    return { exercises: [], hasMore: false, nextOffset: null, limitReached: true, total: null };
  const params = new URLSearchParams({ limit: "20", offset: String(offset) });
  const filters = normalizeFilters(opts);
  for (const [name, value] of Object.entries(filters)) if (value) params.set(name, value);
  const body = parseProviderResponse(
    z.object({
      data: z.array(remoteSchema).max(20),
      total: z.number().int().nonnegative().nullable(),
      limit: z.number().int().min(1).max(100),
      offset: z.number().int().nonnegative(),
    }),
    await request("exercises", params),
  );
  if (body.offset !== offset || body.data.length > body.limit)
    throw new AppError(
      502,
      "exercise_provider_invalid",
      "The exercise library returned an invalid page. Please retry.",
    );
  const end = offset + body.data.length;
  const more =
    body.data.length > 0 &&
    (body.total === null ? body.data.length === body.limit : end < body.total);
  const hasMore = more && end < 500;
  return {
    exercises: body.data.map(mapExercise),
    hasMore,
    nextOffset: hasMore ? end : null,
    limitReached: more && end >= 500,
    total: body.total,
  };
}

/** Persist only a coach-selected movement's identity and prescription defaults, never a catalog/media mirror. */
export async function materializeProviderExercise(id: string) {
  if (!isProviderExercise(id)) return;
  const [existing] = await db
    .select({ id: schema.exercises.id })
    .from(schema.exercises)
    .where(eq(schema.exercises.id, id));
  if (existing) return;
  if (!exerciseApiEnabled())
    throw badRequest("exercise_provider_disabled", "This exercise provider is disabled.");
  const e = await providerExercise(id);
  await db
    .insert(schema.exercises)
    .values({
      id: e.id,
      name: e.name,
      pattern: e.pattern,
      muscle: e.muscle,
      equipment: e.equipment,
      defaultFields: e.defaultFields,
    })
    .onConflictDoNothing();
}

/** Resolve old shared movements only when a clear name/equipment match exists; never replace a custom video. */
export async function enrichDemonstration<
  T extends { id: string; name: string; equipment: string; videoUrl: string | null },
>(
  row: T,
): Promise<
  T & {
    videoAspectRatio?: string | null;
    description?: string | null;
    cues?: string | null;
    demonstrationUnavailable?: boolean;
  }
> {
  if (!exerciseApiEnabled() || row.videoUrl) return row;
  try {
    if (isProviderExercise(row.id)) {
      const e = await providerExercise(row.id);
      return {
        ...row,
        videoUrl: e.videoUrl,
        videoAspectRatio: e.videoAspectRatio,
        description: e.description,
        cues: e.cues,
      };
    }
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const page = await providerExercises({ q: row.name });
    const matches = page.exercises.filter(
      (e) =>
        normalize(e.name) === normalize(row.name) &&
        (e.equipment === row.equipment ||
          row.equipment === "full_gym" ||
          (row.equipment === "dumbbells" && e.equipment === "dumbbell") ||
          (row.equipment === "bands" && e.equipment === "band") ||
          (row.equipment === "bodyweight" && e.equipment === "body only")),
    );
    const e = matches.length === 1 ? matches[0] : null;
    return e
      ? {
          ...row,
          videoUrl: e.videoUrl,
          videoAspectRatio: e.videoAspectRatio,
          description: e.description,
          cues: e.cues,
        }
      : row;
  } catch {
    return { ...row, demonstrationUnavailable: true };
  } // A provider outage never blocks workout/history access.
}

/** Reference endpoints describe the whole catalog, independently of any search page. */
export async function providerExerciseFacets(): Promise<ExerciseFacets> {
  const [muscleBody, equipmentBody, categoryBody] = await Promise.all([
    request("muscles"),
    request("equipment"),
    request("categories"),
  ]);
  const muscleRows = parseProviderResponse(
    z.object({
      data: z.array(z.object({ displayGroup: z.string(), muscles: z.array(z.string()) })),
    }),
    muscleBody,
  ).data;
  const equipments = parseProviderResponse(
    z.object({ data: z.array(z.string()) }),
    equipmentBody,
  ).data;
  const categories = parseProviderResponse(
    z.object({ data: z.array(z.object({ category: z.string() })) }),
    categoryBody,
  ).data;
  const muscleAliases: Record<string, string[]> = {};
  for (const group of muscleRows)
    for (const raw of [group.displayGroup, ...group.muscles]) {
      const key = raw.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
      muscleAliases[key] = [
        ...new Set([...(muscleAliases[key] ?? []), group.displayGroup.toLowerCase()]),
      ];
    }
  return {
    source: "exerciseapi",
    muscles: muscleRows.map((row) => row.displayGroup.toLowerCase()),
    equipments,
    categories: categories.map((row) => row.category),
    muscleAliases,
  };
}

function parseProviderResponse<T extends z.ZodType>(shape: T, data: unknown): z.output<T> {
  const result = shape.safeParse(data);
  if (!result.success)
    throw new AppError(
      502,
      "exercise_provider_invalid",
      "The exercise library returned an invalid response. Please retry.",
    );
  return result.data;
}
