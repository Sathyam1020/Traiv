import { schema } from "@traiv/db";
import { and, eq } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { requireClient } from "../../middleware/client-authorize.js";
import { requireSession } from "../../middleware/session.js";
import { pushConfig } from "./service.js";
export const clientPush: Router = Router({ mergeParams: true });
clientPush.get("/config", requireClient(), (_req, res) => res.json(pushConfig()));
clientPush.post("/", requireClient(), async (req, res) => {
  const v = z
    .object({
      platform: z.enum(["web", "ios", "android"]),
      endpoint: z.string().min(10).max(4000),
      keys: z.object({ p256dh: z.string().max(300), auth: z.string().max(200) }).optional(),
    })
    .parse(req.body);
  if (v.platform === "web") {
    const url = z.string().url().parse(v.endpoint);
    const host = new URL(url).hostname;
    if (
      !url.startsWith("https://") ||
      !["fcm.googleapis.com", "updates.push.services.mozilla.com", "web.push.apple.com"].some(
        (h) => host === h || host.endsWith(`.${h}`),
      ) ||
      !v.keys
    ) {
      res.status(400).json({ message: "Invalid push endpoint." });
      return;
    }
  } else if (!/^[a-zA-Z0-9_:-]+$/.test(v.endpoint)) {
    res.status(400).json({ message: "Invalid device token." });
    return;
  }
  const userId = requireSession(req).userId;
  await db
    .insert(schema.pushSubscriptions)
    .values({ userId, endpoint: v.endpoint, platform: v.platform, credentials: v.keys ?? {} })
    .onConflictDoUpdate({
      target: schema.pushSubscriptions.endpoint,
      set: { userId, platform: v.platform, credentials: v.keys ?? {} },
    });
  res.json({ saved: true });
});
clientPush.delete("/", requireClient(), async (req, res) => {
  const { endpoint } = z.object({ endpoint: z.string().max(4000) }).parse(req.body);
  await db
    .delete(schema.pushSubscriptions)
    .where(
      and(
        eq(schema.pushSubscriptions.endpoint, endpoint),
        eq(schema.pushSubscriptions.userId, requireSession(req).userId),
      ),
    );
  res.json({ removed: true });
});
