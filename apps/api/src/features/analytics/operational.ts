import { newId, schema } from "@traiv/db";
import { db } from "../../db.js";

/**
 * Technical/operational telemetry — a separate system from `track()`'s product events,
 * per `architecture-decision.md`'s "Operational monitoring" section: mixing
 * high-cardinality request-level data into product tables is the "expensive query
 * pattern" trap the brief warns against, so this writes to `operational_event`, not
 * `product_event`, and nothing ever joins the two.
 *
 * Always swallows its own errors — recording that something broke must never itself
 * become a second thing that's broken.
 */
export async function recordOperationalEvent(input: {
  // `admin_drilldown_viewed` is `privacy-security.md`'s own instruction: every admin
  // read of a specific studio's raw-ish data is itself logged, same self-referential
  // discipline the system applies everywhere else.
  name: "api_request_failed" | "api_request_completed" | "job_failed" | "admin_drilldown_viewed";
  route?: string | null;
  statusCode?: number | null;
  durationMs?: number | null;
  jobKind?: string | null;
  error?: string | null;
}): Promise<void> {
  try {
    await db.insert(schema.operationalEvents).values({
      id: newId(),
      name: input.name,
      route: input.route ?? null,
      statusCode: input.statusCode ?? null,
      durationMs: input.durationMs ?? null,
      jobKind: input.jobKind ?? null,
      error: input.error?.slice(0, 500) ?? null,
    });
  } catch {
    // Never allowed to compound the problem it's trying to record.
  }
}
