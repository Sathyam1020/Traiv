import { newId, schema } from "@traiv/db";
import { and, asc, eq, gte, isNull, lte, or } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { requireStudio, requireStudioAuth } from "../../middleware/authorize.js";
import { isFutureStepDate } from "../client/steps-validation.js";
import { badRequest } from "../../errors.js";
import { developmentClient } from "./development.js";
import {
  measurementFields,
  measurementPeriod,
  measurementWrite,
  withCircumference,
  type MeasurementEvent,
} from "./measurement-data.js";
export const measurementsRouter: Router = Router({ mergeParams: true });
measurementsRouter.get("/", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const clientId = z.string().uuid().parse(req.params.clientId);
  const client = await developmentClient(studioId, clientId);
  const { from, to } = measurementPeriod.parse(req.query);
  const start = new Date(`${from}T00:00:00Z`),
    end = new Date(`${to}T23:59:59.999Z`);
  const [answers, manual, weights, fields] = await Promise.all([
    db
      .select({
        checkInId: schema.checkIns.id,
        takenAt: schema.checkIns.completedAt,
        code: schema.metrics.code,
        number: schema.checkInAnswers.numberValue,
        rating: schema.checkInAnswers.ratingValue,
      })
      .from(schema.checkInAnswers)
      .innerJoin(schema.checkIns, eq(schema.checkIns.id, schema.checkInAnswers.checkInId))
      .innerJoin(schema.metrics, eq(schema.metrics.id, schema.checkInAnswers.metricId))
      .where(
        and(
          eq(schema.checkIns.clientId, clientId),
          eq(schema.checkIns.status, "completed"),
          gte(schema.checkIns.completedAt, start),
          lte(schema.checkIns.completedAt, end),
        ),
      )
      .orderBy(asc(schema.checkIns.completedAt)),
    db
      .select()
      .from(schema.clientMeasurements)
      .where(
        and(
          eq(schema.clientMeasurements.clientId, clientId),
          gte(schema.clientMeasurements.takenAt, start),
          lte(schema.clientMeasurements.takenAt, end),
        ),
      )
      .orderBy(asc(schema.clientMeasurements.takenAt)),
    client.userId
      ? db
          .select()
          .from(schema.bodyMetrics)
          .where(
            and(
              eq(schema.bodyMetrics.userId, client.userId),
              gte(schema.bodyMetrics.takenAt, start),
              lte(schema.bodyMetrics.takenAt, end),
            ),
          )
          .orderBy(asc(schema.bodyMetrics.takenAt))
      : Promise.resolve([]),
    db
      .select({
        code: schema.metrics.code,
        name: schema.metrics.name,
        unit: schema.metrics.unit,
        type: schema.metrics.type,
      })
      .from(schema.metrics)
      .where(
        and(
          or(isNull(schema.metrics.studioId), eq(schema.metrics.studioId, studioId)),
          isNull(schema.metrics.archivedAt),
        ),
      ),
  ]);
  const grouped = new Map<string, MeasurementEvent>();
  for (const answer of answers) {
    const value = answer.number ?? answer.rating;
    if (value == null || !answer.takenAt) continue;
    const event = grouped.get(answer.checkInId) ?? {
      id: answer.checkInId,
      takenAt: answer.takenAt.toISOString(),
      source: "check_in",
      values: {},
    };
    event.values[answer.code] = value;
    grouped.set(answer.checkInId, event);
  }
  // Check-in weights already appear in grouped answers; body_metric carries the same submission.
  const events = [
    ...grouped.values(),
    ...manual.map((r) => ({
      id: r.id,
      takenAt: r.takenAt.toISOString(),
      source: "coach",
      values: r.values,
    })),
    ...weights
      .filter((r) => r.source !== "check_in" && r.source !== "development")
      .map((r) => ({
        id: r.id,
        takenAt: r.takenAt.toISOString(),
        source: r.source,
        values: { weight: r.weightKg },
      })),
  ];
  const registry = new Map(measurementFields.map((f) => [f.code, f]));
  for (const f of fields)
    if ((f.type === "number" || f.type === "rating") && !registry.has(f.code))
      registry.set(f.code, {
        code: f.code,
        name: f.name,
        unit: f.unit ?? "",
        group: "Other measurements",
      });
  res.json({
    fields: [
      ...registry.values(),
      {
        code: "total_circumference",
        name: "Total circumference",
        unit: "cm",
        group: "Circumference",
      },
    ],
    entries: withCircumference(events).sort((a, b) => a.takenAt.localeCompare(b.takenAt)),
  });
});
measurementsRouter.post("/", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const clientId = z.string().uuid().parse(req.params.clientId);
  const client = await developmentClient(studioId, clientId);
  const body = measurementWrite.parse(req.body);
  if (isFutureStepDate(body.date, body.timeZone))
    throw badRequest("future_measurement", "Measurements cannot be in the future.");
  const values = Object.fromEntries(
    Object.entries(body.values).filter(([, value]) => value !== undefined),
  ) as Record<string, number>;
  const now = new Date();
  const takenAt =
    body.date === now.toLocaleDateString("en-CA", { timeZone: body.timeZone })
      ? now
      : new Date(`${body.date}T12:00:00Z`);
  await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(schema.clientMeasurements)
      .values({ id: body.id, clientId, takenAt, values })
      .onConflictDoNothing()
      .returning({ id: schema.clientMeasurements.id });
    if (inserted.length && values.weight != null && client.userId)
      await tx.insert(schema.bodyMetrics).values({
        id: newId(),
        userId: client.userId,
        takenAt,
        weightKg: values.weight,
        source: "development",
      });
  });
  res.status(201).json({ saved: true });
});
