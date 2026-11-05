import { newId, schema } from "@traiv/db";
import { and, eq, isNull } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { env } from "../../env.js";
import { badRequest } from "../../errors.js";
import { isUniqueViolation } from "../../lib/db-errors.js";
import { requireClient } from "../../middleware/client-authorize.js";
import { requireSession } from "../../middleware/session.js";
import { toE164 } from "../auth/service.js";
import { stepsDate } from "./steps-validation.js";
export const clientSettingsRouter: Router = Router({ mergeParams: true });
const notifications = z.object({
  chat: z.boolean(),
  checkIns: z.boolean(),
  content: z.boolean(),
  community: z.boolean(),
  messageEmail: z.boolean(),
  campaignEmail: z.boolean(),
});
const zone = z
  .string()
  .max(100)
  .refine((v) => {
    try {
      new Intl.DateTimeFormat("en", { timeZone: v });
      return true;
    } catch {
      return false;
    }
  }, "Choose a valid time zone.");
clientSettingsRouter.get("/", requireClient(), async (req, res) => {
  const { userId } = requireSession(req);
  const [[user], [settings], [intake]] = await Promise.all([
    db
      .select({
        name: schema.users.name,
        email: schema.users.email,
        phone: schema.users.phone,
        avatarUrl: schema.users.avatarUrl,
        emailVerifiedAt: schema.users.emailVerifiedAt,
        phoneVerifiedAt: schema.users.phoneVerifiedAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId)),
    db.select().from(schema.clientSettings).where(eq(schema.clientSettings.userId, userId)),
    db
      .select({ heightCm: schema.userIntakes.heightCm })
      .from(schema.userIntakes)
      .where(eq(schema.userIntakes.userId, userId)),
  ]);
  res.json({
    user,
    settings: settings ?? {
      birthDate: null,
      timeZone: "Asia/Kolkata",
      language: "en",
      units: "metric",
      heightCm: intake?.heightCm ?? null,
      notifications: {
        chat: true,
        checkIns: true,
        content: true,
        community: true,
        messageEmail: false,
        campaignEmail: true,
      },
    },
    contactVerificationEnabled: false,
    emailDeliveryEnabled: false,
  });
});
clientSettingsRouter.patch("/personal", requireClient(), async (req, res) => {
  const { userId, sessionId } = requireSession(req);
  const v = z
    .object({
      firstName: z.string().trim().min(1).max(60),
      lastName: z.string().trim().max(60),
      email: z.union([z.string().trim().email().max(254), z.literal("")]),
      phone: z.string().trim().max(30),
      avatarUrl: z
        .string()
        .url()
        .max(2000)
        .refine((v) => v.startsWith("https://"))
        .nullable(),
      birthDate: stepsDate.nullable(),
      timeZone: zone,
      language: z.literal("en"),
      units: z.enum(["metric", "us", "uk"]),
      heightCm: z.number().min(90).max(250).nullable(),
    })
    .parse(req.body);
  if (v.birthDate && v.birthDate > new Date().toISOString().slice(0, 10))
    throw badRequest("invalid_birth_date", "Birth date cannot be in the future.");
  const email = v.email.toLowerCase() || null,
    phone = v.phone ? toE164(v.phone) : null;
  if (!email && !phone)
    throw badRequest("missing_contact", "Keep at least one email address or phone number.");
  const [current] = await db
    .select()
    .from(schema.users)
    .where(and(eq(schema.users.id, userId), isNull(schema.users.deletedAt)));
  if (!current) throw badRequest("missing_user", "Account not found.");
  if (phone !== current.phone && phone === env.ADMIN_PHONE)
    throw badRequest("reserved_phone", "That phone number cannot be used for this account.");
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(schema.users)
        .set({
          name: `${v.firstName} ${v.lastName}`.trim(),
          email,
          phone,
          avatarUrl: v.avatarUrl,
          ...(current.email !== email ? { emailVerifiedAt: null } : {}),
          ...(current.phone !== phone ? { phoneVerifiedAt: null } : {}),
        })
        .where(eq(schema.users.id, userId));
      const settings = {
        birthDate: v.birthDate,
        timeZone: v.timeZone,
        language: v.language,
        units: v.units,
        heightCm: v.heightCm,
      };
      await tx
        .insert(schema.clientSettings)
        .values({ userId, ...settings })
        .onConflictDoUpdate({ target: schema.clientSettings.userId, set: settings });
      await tx
        .insert(schema.userIntakes)
        .values({
          id: newId(),
          userId,
          heightCm: v.heightCm,
          birthYear: v.birthDate ? Number(v.birthDate.slice(0, 4)) : null,
        })
        .onConflictDoUpdate({
          target: schema.userIntakes.userId,
          set: {
            heightCm: v.heightCm,
            ...(v.birthDate ? { birthYear: Number(v.birthDate.slice(0, 4)) } : {}),
          },
        });
      // Contact changes affect login. Preserve this session and revoke other devices.
      if (email !== current.email || phone !== current.phone) {
        const { ne } = await import("drizzle-orm");
        await tx
          .update(schema.sessions)
          .set({ revokedAt: new Date() })
          .where(and(eq(schema.sessions.userId, userId), ne(schema.sessions.id, sessionId)));
        await tx
          .delete(schema.authIdentities)
          .where(
            and(
              eq(schema.authIdentities.userId, userId),
              eq(schema.authIdentities.provider, "phone"),
            ),
          );
      }
    });
  } catch (e) {
    if (isUniqueViolation(e))
      throw badRequest("contact_taken", "That email or phone number belongs to another account.");
    throw e;
  }
  res.json({ saved: true, contactVerificationEnabled: false });
});
clientSettingsRouter.patch("/notifications", requireClient(), async (req, res) => {
  const { userId } = requireSession(req);
  const values = notifications.parse(req.body);
  await db
    .insert(schema.clientSettings)
    .values({ userId, notifications: values })
    .onConflictDoUpdate({ target: schema.clientSettings.userId, set: { notifications: values } });
  res.json({ saved: true });
});
