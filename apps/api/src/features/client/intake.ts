import { newId, schema } from "@traiv/db";
import type { ActivityLevel, DietType, Goal, HealthFlag, PlanInput, Sex } from "@traiv/nutrition";
import { energyTarget } from "@traiv/nutrition";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db.js";

export type WorkActivityLevel = "sedentary" | "light" | "moderate" | "heavy" | "very_heavy";

/** Everything a step can write. All optional — skipping is a supported answer. */
export type IntakePatch = Partial<{
  // Name and the avatar live on `user`, not this table — carried here so onboarding's
  // step-by-step save is the only write path a client needs, the same reasoning that
  // already routes `weightKg` through this type to `body_metric`. See `saveStep`.
  firstName: string;
  lastName: string;
  avatarUrl: string;

  goal: Goal;
  targetWeightKg: number;
  sex: Sex;
  birthYear: number;
  heightCm: number;
  weightKg: number;
  dailyActivity: ActivityLevel;
  experience: "new" | "some" | "experienced";
  daysPerWeek: number;
  sessionMinutes: number;
  equipment: string[];
  diet: DietType;
  allergies: string;
  dislikes: string;
  mealsPerDay: number;
  healthFlags: string[];
  healthNote: string;
  trainingDays: string[];
  preferredTime: string;

  workedWithCoach: boolean;
  typicalDay: string;
  workActivity: WorkActivityLevel;
  trainingLocations: string[];
  excludedIngredients: string[];
  edInduceVomiting: boolean;
  edFoodDominates: boolean;
  edRecentWeightLoss: boolean;
  edBodyImageMismatch: boolean;
  edLossOfControl: boolean;
  dietaryTags: string[];
  additionalNutritionNotes: string;
  otherNotes: string;
}>;

export const FIRST_STEP = 1;
export const LAST_STEP = 15;

/** What this person answered, plus whatever we worked out from it. */
export async function getIntake(userId: string) {
  const [intake] = await db
    .select()
    .from(schema.userIntakes)
    .where(eq(schema.userIntakes.userId, userId))
    .limit(1);

  const [weight] = await db
    .select({ weightKg: schema.bodyMetrics.weightKg })
    .from(schema.bodyMetrics)
    .where(and(eq(schema.bodyMetrics.userId, userId), eq(schema.bodyMetrics.source, "intake")))
    .limit(1);

  const [target] = await db
    .select()
    .from(schema.nutritionTargets)
    .where(eq(schema.nutritionTargets.userId, userId))
    .orderBy(desc(schema.nutritionTargets.effectiveFrom))
    .limit(1);

  return {
    intake: intake ?? null,
    weightKg: weight?.weightKg ?? null,
    // A target still waiting on a coach is not the client's to see yet.
    target: target?.status === "active" ? target : null,
    awaitingReview: target?.status === "proposed",
  };
}

/**
 * Save one step.
 *
 * Writes as the client goes rather than at the end, so closing the tab at step four costs
 * them step four and nothing else. `lastStep` is where they resume.
 *
 * Weight is the one field that does not live in the intake row — it goes to `body_metric`,
 * because a plateau is invisible in a column that gets overwritten. During onboarding there
 * is exactly one such row, held in place by a partial unique index, so stepping back to fix
 * a typo corrects the measurement instead of inventing a second data point.
 */
export async function saveStep(userId: string, step: number, patch: IntakePatch) {
  const { weightKg, firstName, lastName, avatarUrl, ...fields } = patch;

  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(schema.userIntakes)
      .values({ id: newId(), userId, lastStep: step, ...fields })
      .onConflictDoUpdate({
        target: schema.userIntakes.userId,
        set: { ...fields, lastStep: step, updatedAt: new Date() },
      })
      .returning();

    if (weightKg !== undefined) {
      await tx
        .insert(schema.bodyMetrics)
        .values({ id: newId(), userId, weightKg, source: "intake" })
        .onConflictDoUpdate({
          target: schema.bodyMetrics.userId,
          targetWhere: eq(schema.bodyMetrics.source, "intake"),
          set: { weightKg, takenAt: new Date() },
        });
    }

    // The step that asks for a name sends both halves together, so joining is safe —
    // there is no path where only one arrives and the other would need preserving.
    if (firstName !== undefined || lastName !== undefined) {
      const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();
      if (name) await tx.update(schema.users).set({ name }).where(eq(schema.users.id, userId));
    }
    if (avatarUrl !== undefined) {
      await tx.update(schema.users).set({ avatarUrl }).where(eq(schema.users.id, userId));
    }

    return row;
  });
}

/** The six answers the calculator cannot work without. */
function planInput(
  intake: typeof schema.userIntakes.$inferSelect,
  weightKg: number | null,
): PlanInput | null {
  const { goal, sex, birthYear, heightCm, dailyActivity, diet } = intake;
  if (!goal || !sex || !birthYear || !heightCm || !dailyActivity || !diet || !weightKg) {
    return null;
  }

  return {
    goal,
    sex,
    age: new Date().getUTCFullYear() - birthYear,
    heightCm,
    weightKg,
    activity: dailyActivity,
    diet,
    health: (intake.healthFlags ?? []) as HealthFlag[],
    ...(intake.targetWeightKg ? { targetWeightKg: intake.targetWeightKg } : {}),
  };
}

/**
 * Finish onboarding and work out the first target.
 *
 * Skipping is allowed all the way through, so arriving here without enough to calculate is
 * a normal outcome, not an error — the intake closes, the coach sees what is missing, and
 * no number is invented to fill the hole.
 *
 * Re-running supersedes the previous target rather than editing it. A client's calories
 * moving is a thing a coach should be able to see happening, which it isn't if the old
 * number is gone.
 */
export async function completeIntake(userId: string) {
  return db.transaction(async (tx) => {
    const [intake] = await tx
      .select()
      .from(schema.userIntakes)
      .where(eq(schema.userIntakes.userId, userId))
      .limit(1)
      .for("update");

    if (!intake) {
      const [created] = await tx
        .insert(schema.userIntakes)
        .values({ id: newId(), userId, completedAt: new Date(), lastStep: null })
        .returning();
      return { intake: created, target: null, awaitingReview: false };
    }

    const [weight] = await tx
      .select({ weightKg: schema.bodyMetrics.weightKg })
      .from(schema.bodyMetrics)
      .where(and(eq(schema.bodyMetrics.userId, userId), eq(schema.bodyMetrics.source, "intake")))
      .limit(1);

    const [done] = await tx
      .update(schema.userIntakes)
      .set({ completedAt: new Date(), lastStep: null, updatedAt: new Date() })
      .where(eq(schema.userIntakes.userId, userId))
      .returning();

    const input = planInput(intake, weight?.weightKg ?? null);
    if (!input) return { intake: done, target: null, awaitingReview: false };

    const computed = energyTarget(input);
    const needsCoach = computed.review.length > 0;

    // Retire the old one first: a partial unique index allows exactly one active target per
    // client, which is what stops the app and the coach reading different numbers.
    await tx
      .update(schema.nutritionTargets)
      .set({ status: "superseded" })
      .where(
        and(
          eq(schema.nutritionTargets.userId, userId),
          eq(schema.nutritionTargets.status, "active"),
        ),
      );

    const [target] = await tx
      .insert(schema.nutritionTargets)
      .values({
        id: newId(),
        userId,
        kcal: computed.kcal,
        proteinG: computed.protein,
        carbsG: computed.carbs,
        fatG: computed.fat,
        basis: computed.basis,
        reviewReasons: computed.review,
        status: needsCoach ? "proposed" : "active",
        createdBy: "system",
      })
      .returning();

    return {
      intake: done,
      target: needsCoach ? null : target,
      awaitingReview: needsCoach,
    };
  });
}
