import { randomUUID } from "node:crypto";
import { schema } from "@traiv/db";
import { and, eq, isNull, ne } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { env } from "../../env.js";
import { badRequest, forbidden } from "../../errors.js";
import { mediaStorage } from "../../integrations/media-storage.js";
import { isUniqueViolation } from "../../lib/db-errors.js";
import { requireSession } from "../../middleware/session.js";
import { listStudios } from "../studio/service.js";
import { studioUploadsConfigured } from "../studio/uploads.js";
import { getUser, publicUser } from "./service.js";

const notifications = z.object({
  paymentFailures: z.boolean(),
  successfulPayments: z.boolean(),
  newLeads: z.boolean(),
  clientOnboarding: z.boolean(),
  expiringPaymentMethods: z.boolean(),
  paymentSetupFailures: z.boolean(),
  subscriptionCancellations: z.boolean(),
  automationFailures: z.boolean(),
  clientAssignments: z.boolean(),
  paymentPlansNotStarted: z.boolean(),
  reportedCommunityPosts: z.boolean(),
});
export const trainerAccountInput = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.union([z.string().trim().email().max(254), z.literal("")]),
  avatarUrl: z.string().url().max(2000).nullable(),
  language: z.literal("en"),
  notifications,
});
export const trainerAccount: Router = Router();
trainerAccount.use(async (req, _res, next) => {
  const { userId } = requireSession(req);
  if (!(await listStudios(userId)).length) throw forbidden("A trainer account is required.");
  next();
});
async function readAccount(userId: string) {
  const [user, settings] = await Promise.all([
    getUser(userId),
    db
      .select()
      .from(schema.trainerSettings)
      .where(eq(schema.trainerSettings.userId, userId))
      .then((rows) => rows[0]),
  ]);
  return {
    user: {
      ...publicUser(user),
      avatarUrl: user.avatarUrl,
      emailVerified: Boolean(user.emailVerifiedAt),
      language: "en" as const,
    },
    notifications: { ...schema.trainerNotificationDefaults, ...settings?.notifications },
    uploadsEnabled: studioUploadsConfigured(),
    emailVerificationEnabled: false,
    passwordSignInEnabled: false,
  };
}
trainerAccount.get("/", async (req, res) => {
  res.setHeader("Cache-Control", "private, no-store");
  res.json(await readAccount(requireSession(req).userId));
});
trainerAccount.post("/avatar", async (req, res) => {
  const { userId } = requireSession(req);
  const key = `traiv/trainer-avatar/${userId}/${randomUUID()}`;
  res.json({ publicId: key, ...mediaStorage.upload(key, "image", "public") });
});

async function verifyAvatar(userId: string, avatarUrl: string) {
  const url = new URL(avatarUrl);
  const prefix = `/${env.CLOUDINARY_CLOUD_NAME}/image/upload/`;
  let path: string;
  try {
    path = decodeURIComponent(url.pathname);
  } catch {
    throw badRequest("invalid_avatar", "Choose a valid profile image.");
  }
  const marker = `/traiv/trainer-avatar/${userId}/`;
  if (
    url.protocol !== "https:" ||
    url.hostname !== "res.cloudinary.com" ||
    !path.startsWith(prefix) ||
    !path.includes(marker)
  )
    throw badRequest("invalid_avatar", "Upload a profile image from your own account.");
  const key = path.slice(path.indexOf(marker) + 1).replace(/\.[^/.]+$/, "");
  if (!new RegExp(`^traiv/trainer-avatar/${userId}/[a-f0-9-]{36}$`, "u").test(key))
    throw badRequest("invalid_avatar", "Choose a valid profile image.");
  const asset = await mediaStorage.inspect(key, "image", "public");
  if (
    !["png", "jpg", "jpeg", "webp"].includes(asset.format.toLowerCase()) ||
    asset.bytes > 5 * 1024 * 1024
  )
    throw badRequest("invalid_avatar", "Choose a JPG, PNG or WebP image up to 5 MB.");
}
trainerAccount.patch("/", async (req, res) => {
  const { userId, sessionId } = requireSession(req);
  const input = trainerAccountInput.parse(req.body);
  const current = await getUser(userId);
  const email = input.email.toLowerCase() || null;
  if (!email && !current.phone)
    throw badRequest("missing_contact", "Keep an email address or phone number on your account.");
  if (input.avatarUrl && input.avatarUrl !== current.avatarUrl)
    await verifyAvatar(userId, input.avatarUrl);
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(schema.users)
        .set({
          name: input.name,
          email,
          avatarUrl: input.avatarUrl,
          locale: "en-IN",
          ...(email !== current.email ? { emailVerifiedAt: null } : {}),
        })
        .where(and(eq(schema.users.id, userId), isNull(schema.users.deletedAt)));
      await tx
        .insert(schema.trainerSettings)
        .values({ userId, notifications: input.notifications })
        .onConflictDoUpdate({
          target: schema.trainerSettings.userId,
          set: { notifications: input.notifications, updatedAt: new Date() },
        });
      if (email !== current.email) {
        await tx
          .update(schema.sessions)
          .set({ revokedAt: new Date() })
          .where(and(eq(schema.sessions.userId, userId), ne(schema.sessions.id, sessionId)));
      }
    });
  } catch (error) {
    if (isUniqueViolation(error))
      throw badRequest("email_taken", "That email is already on another account.");
    throw error;
  }
  res.json(await readAccount(userId));
});
