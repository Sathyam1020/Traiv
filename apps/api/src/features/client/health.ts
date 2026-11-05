import { schema } from "@traiv/db";
import { eq } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { badRequest } from "../../errors.js";
import { requireClient, requireClientAuth } from "../../middleware/client-authorize.js";
import { isFutureStepDate, stepsDate, stepsWrite } from "./steps-validation.js";
export const clientHealth: Router = Router({ mergeParams: true });
clientHealth.get("/", requireClient(), async (req, res) => {
  const [row] = await db
    .select()
    .from(schema.healthConnections)
    .where(eq(schema.healthConnections.clientId, requireClientAuth(req).clientId));
  res.json(row ?? { enabled: false, provider: null, lastSyncedAt: null });
});
clientHealth.put("/", requireClient({ write: true }), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  const v = z
    .object({ provider: z.enum(["apple_health", "health_connect"]), enabled: z.boolean() })
    .parse(req.body);
  await db
    .insert(schema.healthConnections)
    .values({ clientId, ...v })
    .onConflictDoUpdate({ target: schema.healthConnections.clientId, set: v });
  res.json({ saved: true });
});
clientHealth.post("/sync", requireClient({ write: true }), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  const v = z
    .object({
      provider: z.enum(["apple_health", "health_connect"]),
      timeZone: stepsWrite.shape.timeZone,
      steps: z
        .array(z.object({ date: stepsDate, count: z.number().int().min(0).max(200000) }))
        .max(31),
      workouts: z
        .array(
          z.object({
            id: z.string().min(1).max(300),
            type: z.string().max(100),
            start: z.string().datetime(),
            end: z.string().datetime(),
            duration: z.number().int().min(0).max(604800),
            calories: z.number().nonnegative().max(100000).optional(),
            source: z.string().max(200).optional(),
          }),
        )
        .max(1000),
    })
    .parse(req.body);
  const [connection] = await db
    .select()
    .from(schema.healthConnections)
    .where(eq(schema.healthConnections.clientId, clientId));
  if (!connection?.enabled || connection.provider !== v.provider)
    throw badRequest("health_disconnected", "Connect your health platform before syncing.");
  if (
    v.steps.some((d) => isFutureStepDate(d.date, v.timeZone)) ||
    v.workouts.some((w) => w.end < w.start || Date.parse(w.end) > Date.now() + 60000)
  )
    throw badRequest("invalid_health_dates", "Health entries cannot be in the future.");
  await db.transaction(async (tx) => {
    for (const day of v.steps)
      await tx
        .insert(schema.dailySteps)
        .values({ clientId, ...day, source: "health" })
        .onConflictDoUpdate({
          target: [schema.dailySteps.clientId, schema.dailySteps.date],
          set: { count: day.count, updatedAt: new Date() },
          setWhere: eq(schema.dailySteps.source, "health"),
        });
    for (const w of v.workouts)
      await tx
        .insert(schema.healthWorkouts)
        .values({
          clientId,
          externalId: `${v.provider}:${w.id}`,
          provider: v.provider,
          type: w.type,
          startedAt: new Date(w.start),
          endedAt: new Date(w.end),
          duration: w.duration,
          calories: w.calories,
          source: w.source,
        })
        .onConflictDoUpdate({
          target: [schema.healthWorkouts.clientId, schema.healthWorkouts.externalId],
          set: { duration: w.duration, calories: w.calories, endedAt: new Date(w.end) },
        });
    await tx
      .update(schema.healthConnections)
      .set({ lastSyncedAt: new Date() })
      .where(eq(schema.healthConnections.clientId, clientId));
  });
  res.json({ lastSyncedAt: new Date().toISOString() });
});
