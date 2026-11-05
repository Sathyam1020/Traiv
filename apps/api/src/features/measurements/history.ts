import { schema } from "@traiv/db";
import { and, asc, eq, gte, lte } from "drizzle-orm";
import { db } from "../../db.js";
import { listMetrics } from "../studio/check-ins.js";
export async function measurementHistory(
  studioId: string,
  clientId: string,
  userId: string | null,
  from: string,
  to: string,
) {
  const start = new Date(`${from}T00:00:00Z`),
    end = new Date(`${to}T23:59:59.999Z`);
  const [metrics, answers, manual, weights] = await Promise.all([
    listMetrics(studioId),
    db
      .select({
        id: schema.checkIns.id,
        takenAt: schema.checkIns.completedAt,
        code: schema.metrics.code,
        number: schema.checkInAnswers.numberValue,
        rating: schema.checkInAnswers.ratingValue,
        image: schema.checkInAnswers.imageUrl,
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
      ),
    userId
      ? db
          .select()
          .from(schema.bodyMetrics)
          .where(
            and(
              eq(schema.bodyMetrics.userId, userId),
              gte(schema.bodyMetrics.takenAt, start),
              lte(schema.bodyMetrics.takenAt, end),
            ),
          )
          .orderBy(asc(schema.bodyMetrics.takenAt))
      : [],
  ]);
  const fields = metrics.filter((m) => m.shared && m.type !== "text");
  const visible = new Set(fields.map((m) => m.code));
  type Entry = {
    id: string;
    takenAt: string;
    source: string;
    values: Record<string, number>;
    imageUrls: Record<string, string>;
  };
  const grouped = new Map<string, Entry>();
  for (const a of answers) {
    if (!a.takenAt || !visible.has(a.code)) continue;
    const e = grouped.get(a.id) ?? {
      id: a.id,
      takenAt: a.takenAt.toISOString(),
      source: "check_in",
      values: {},
      imageUrls: {},
    };
    if (a.number != null || a.rating != null) e.values[a.code] = (a.number ?? a.rating) as number;
    if (a.image) e.imageUrls[a.code] = a.image;
    grouped.set(a.id, e);
  }
  const entries: Entry[] = [
    ...grouped.values(),
    ...manual.map((m) => ({
      id: m.id,
      takenAt: m.takenAt.toISOString(),
      source: "measurement",
      values: Object.fromEntries(Object.entries(m.values).filter(([code]) => visible.has(code))),
      imageUrls: Object.fromEntries(
        Object.entries(m.imageUrls).filter(([code]) => visible.has(code)),
      ),
    })),
    ...weights
      .filter((w) => w.source !== "check_in" && w.source !== "development")
      .map((w) => ({
        id: w.id,
        takenAt: w.takenAt.toISOString(),
        source: "weight",
        values: { weight: w.weightKg },
        imageUrls: {},
      })),
  ];
  return {
    fields,
    entries: entries.sort((a, b) => a.takenAt.localeCompare(b.takenAt) || a.id.localeCompare(b.id)),
  };
}
