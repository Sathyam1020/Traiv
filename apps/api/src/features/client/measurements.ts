import { newId, schema } from "@traiv/db";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { badRequest } from "../../errors.js";
import { requireClient, requireClientAuth } from "../../middleware/client-authorize.js";
import { requireSession } from "../../middleware/session.js";
import { measurementHistory } from "../measurements/history.js";
import { listMetrics } from "../studio/check-ins.js";
import { measurementPeriod } from "../studio/measurement-data.js";
import { isFutureStepDate, stepsDate, stepsWrite } from "./steps-validation.js";
export const clientMeasurementsRouter: Router = Router({ mergeParams: true });
clientMeasurementsRouter.get("/", requireClient(), async (req, res) => {
  const { studioId } = requireClientAuth(req);
  res.json((await listMetrics(studioId)).filter((m) => m.shared && m.type !== "text"));
});
clientMeasurementsRouter.post("/", requireClient({ write: true }), async (req, res) => {
  const { studioId, clientId } = requireClientAuth(req);
  const body = z
    .object({
      id: z.string().uuid(),
      metricId: z.string().uuid(),
      date: stepsDate,
      timeZone: stepsWrite.shape.timeZone,
      value: z.union([z.number().finite(), z.string().url().max(2000)]),
    })
    .parse(req.body);
  if (isFutureStepDate(body.date, body.timeZone))
    throw badRequest("future_measurement", "Measurements cannot be in the future.");
  const metric = (await listMetrics(studioId)).find(
    (m) => m.id === body.metricId && m.shared && m.type !== "text",
  );
  if (!metric) throw badRequest("invalid_measurement", "Choose an available measurement.");
  const value = body.value;
  if (
    metric.type === "image"
      ? typeof value !== "string" || !value.startsWith("https://")
      : typeof value !== "number" ||
        (metric.type === "rating"
          ? !Number.isInteger(value) || value < 1 || value > 5
          : value <= 0 || value > (metric.code === "weight" ? 500 : 1000))
  )
    throw badRequest("invalid_measurement", "Enter a valid measurement.");
  const now = new Date();
  const takenAt =
    body.date === now.toLocaleDateString("en-CA", { timeZone: body.timeZone })
      ? now
      : new Date(`${body.date}T12:00:00Z`);
  await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(schema.clientMeasurements)
      .values({
        id: body.id,
        clientId,
        takenAt,
        values: typeof value === "number" ? { [metric.code]: value } : {},
        imageUrls: typeof value === "string" ? { [metric.code]: value } : {},
      })
      .onConflictDoNothing()
      .returning({ id: schema.clientMeasurements.id });
    if (inserted.length && metric.code === "weight" && typeof value === "number")
      await tx.insert(schema.bodyMetrics).values({
        id: newId(),
        userId: requireSession(req).userId,
        takenAt,
        weightKg: value,
        source: "development",
      });
  });
  res.status(201).json({ saved: true });
});

clientMeasurementsRouter.get("/history", requireClient(), async (req, res) => {
  const { studioId, clientId } = requireClientAuth(req);
  const { from, to } = measurementPeriod.parse(req.query);
  res.json(await measurementHistory(studioId, clientId, requireSession(req).userId, from, to));
});
