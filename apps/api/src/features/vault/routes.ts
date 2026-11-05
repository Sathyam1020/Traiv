import { schema } from "@traiv/db";
import { and, eq, isNull } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { notFound } from "../../errors.js";
import { requireStudio, requireStudioAuth } from "../../middleware/authorize.js";
import { requireClient, requireClientAuth } from "../../middleware/client-authorize.js";
import { getClient } from "../studio/roster.js";
import * as vault from "./service.js";

export const trainerVault: Router = Router({ mergeParams: true });
export const clientVault: Router = Router({ mergeParams: true });
const staff = requireStudio({ param: "id" });
const id = z.string().uuid();
trainerVault.get("/", staff, async (req, res) =>
  res.json(await vault.list(requireStudioAuth(req).studioId)),
);
trainerVault.post("/uploads", staff, async (req, res) => {
  const v = z
    .object({ name: z.string().min(1).max(255), mime: z.string().max(200) })
    .parse(req.body);
  res.status(201).json(await vault.uploadTicket(requireStudioAuth(req).studioId, v.name, v.mime));
});
trainerVault.post("/", staff, async (req, res) => {
  const v = vault.resourceInput
    .extend({ uploadId: id.optional(), link: vault.safeLink.optional(), clientId: id.optional() })
    .parse(req.body);
  const studioId = requireStudioAuth(req).studioId;
  if (v.clientId) await getClient(studioId, v.clientId);
  const saved = await vault.save(studioId, vault.resourceInput.parse(v), v.uploadId, v.link);
  if (v.clientId) await vault.assign(studioId, v.clientId, saved.id);
  res.status(201).json(saved);
});
trainerVault.patch("/:resourceId", staff, async (req, res) =>
  res.json(
    await vault.update(
      requireStudioAuth(req).studioId,
      id.parse(req.params.resourceId),
      vault.resourceInput.parse(req.body),
    ),
  ),
);
trainerVault.delete("/:resourceId", staff, async (req, res) => {
  const studioId = requireStudioAuth(req).studioId,
    resourceId = id.parse(req.params.resourceId);
  await vault.resource(studioId, resourceId);
  await db
    .delete(schema.vaultResources)
    .where(
      and(eq(schema.vaultResources.id, resourceId), eq(schema.vaultResources.studioId, studioId)),
    );
  res.json({ deleted: true });
});
trainerVault.get("/:resourceId/open", staff, async (req, res) =>
  res.json({
    url: await vault.delivery(requireStudioAuth(req).studioId, id.parse(req.params.resourceId)),
  }),
);
trainerVault.get("/clients/:clientId", staff, async (req, res) =>
  res.json(
    await vault.clientResources(requireStudioAuth(req).studioId, id.parse(req.params.clientId)),
  ),
);
trainerVault.post("/clients/:clientId/:resourceId", staff, async (req, res) => {
  await vault.assign(
    requireStudioAuth(req).studioId,
    id.parse(req.params.clientId),
    id.parse(req.params.resourceId),
  );
  res.json({ assigned: true });
});
trainerVault.delete("/clients/:clientId/:resourceId", staff, async (req, res) => {
  const studioId = requireStudioAuth(req).studioId,
    clientId = id.parse(req.params.clientId),
    resourceId = id.parse(req.params.resourceId);
  await getClient(studioId, clientId);
  await vault.resource(studioId, resourceId);
  await db
    .delete(schema.vaultAssignments)
    .where(
      and(
        eq(schema.vaultAssignments.clientId, clientId),
        eq(schema.vaultAssignments.resourceId, resourceId),
      ),
    );
  res.json({ removed: true });
});
clientVault.get("/", requireClient(), async (req, res) => {
  const { studioId, clientId } = requireClientAuth(req);
  res.json(await vault.clientResources(studioId, clientId));
});
clientVault.get("/:resourceId/open", requireClient(), async (req, res) => {
  const { studioId, clientId } = requireClientAuth(req),
    resourceId = id.parse(req.params.resourceId);
  const visible = await vault.clientResources(studioId, clientId);
  if (!visible.some((r) => r.id === resourceId)) throw notFound();
  await db
    .update(schema.vaultAssignments)
    .set({ openedAt: new Date() })
    .where(
      and(
        eq(schema.vaultAssignments.clientId, clientId),
        eq(schema.vaultAssignments.resourceId, resourceId),
        isNull(schema.vaultAssignments.openedAt),
      ),
    );
  res.setHeader("Cache-Control", "no-store");
  res.json({ url: await vault.delivery(studioId, resourceId) });
});

clientVault.post("/read", requireClient(), async (req, res) => {
  const { studioId, clientId } = requireClientAuth(req);
  const { ids } = z.object({ ids: z.array(z.string().uuid()).max(1000) }).parse(req.body);
  const visible = await vault.clientResources(studioId, clientId);
  const rows = visible
    .filter((r) => ids.includes(r.id))
    .map((r) => ({ clientId, resourceId: r.id }));
  if (rows.length) await db.insert(schema.vaultReads).values(rows).onConflictDoNothing();
  res.json({ seen: true });
});
