import { schema } from "@traiv/db";
import { and, eq, gte, isNull, lte } from "drizzle-orm";
import { db } from "../../db.js";
import { notifyClient } from "./service.js";
export function startCheckInReminders() {
  let busy = false;
  const tick = async () => {
    if (busy) return;
    busy = true;
    try {
      const now = new Date();
      const from = new Date(now);
      from.setDate(from.getDate() - 1);
      const to = new Date(now);
      to.setDate(to.getDate() + 1);
      const rows = await db
        .select({
          id: schema.checkIns.id,
          clientId: schema.clients.id,
          dueOn: schema.checkIns.dueOn,
          closesOn: schema.checkIns.closesOn,
          timeZone: schema.clientSettings.timeZone,
        })
        .from(schema.checkIns)
        .innerJoin(schema.clients, eq(schema.clients.id, schema.checkIns.clientId))
        .leftJoin(schema.clientSettings, eq(schema.clientSettings.userId, schema.clients.userId))
        .where(
          and(
            eq(schema.checkIns.status, "pending"),
            eq(schema.clients.status, "active"),
            isNull(schema.clients.deletedAt),
            lte(schema.checkIns.dueOn, to.toISOString().slice(0, 10)),
            gte(schema.checkIns.closesOn, from.toISOString().slice(0, 10)),
          ),
        );
      for (const row of rows) {
        const date = now.toLocaleDateString("en-CA", { timeZone: row.timeZone ?? "Asia/Kolkata" });
        if (date >= row.dueOn && date <= row.closesOn)
          await notifyClient(
            row.clientId,
            "checkIns",
            `reminder:${row.id}:${date}`,
            `/check-in/${row.id}?from=profile`,
          ).catch(() => console.warn("Check-in reminder delivery failed"));
      }
    } catch {
      console.warn("Check-in reminder scan failed");
    } finally {
      busy = false;
    }
  };
  const timer = setInterval(() => void tick(), 60000);
  timer.unref();
  void tick();
  return () => clearInterval(timer);
}
