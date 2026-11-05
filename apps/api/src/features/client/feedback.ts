import { schema } from "@traiv/db";
import { and, count, eq, gte } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { tooManyRequests } from "../../errors.js";
import { requireClient, requireClientAuth } from "../../middleware/client-authorize.js";
import { requireSession } from "../../middleware/session.js";
export const clientFeedbackRouter: Router = Router({ mergeParams: true });
// Write-only for clients. An admin-only inbox can be added later; there is no coach read endpoint.
clientFeedbackRouter.post("/", requireClient(), async (req, res) => {
  const body = z
    .object({
      id: z.string().uuid(),
      message: z.string().trim().min(1).max(4000),
      appVersion: z.string().trim().min(1).max(40),
    })
    .parse(req.body);
  const { userId } = requireSession(req);
  const { studioId, clientId } = requireClientAuth(req);
  const [existing] = await db
    .select({ id: schema.clientFeedback.id })
    .from(schema.clientFeedback)
    .where(and(eq(schema.clientFeedback.id, body.id), eq(schema.clientFeedback.userId, userId)));
  if (existing) {
    res.json({ received: true });
    return;
  }
  const [recent] = await db
    .select({ count: count() })
    .from(schema.clientFeedback)
    .where(
      and(
        eq(schema.clientFeedback.userId, userId),
        gte(schema.clientFeedback.createdAt, new Date(Date.now() - 10 * 60 * 1000)),
      ),
    );
  if ((recent?.count ?? 0) >= 5)
    throw tooManyRequests(
      "You've sent several messages recently. Please wait a few minutes before sending another.",
    );
  await db
    .insert(schema.clientFeedback)
    .values({ ...body, userId, studioId, clientId })
    .onConflictDoNothing();
  res.status(201).json({ received: true });
});
