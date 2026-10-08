import { schema } from "@traiv/db";
import { DEFAULT_COUNTRY, parsePhone, phoneProblemMessage } from "@traiv/phone";
import { and, desc, inArray, isNotNull, isNull } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { env } from "../../env.js";
import { badRequest, forbidden } from "../../errors.js";
import { otpChannels } from "../../integrations/otp/index.js";
import { clearSessionCookie, readCookie, setSessionCookie } from "../../lib/cookies.js";
import { newSessionToken } from "../../lib/crypto.js";
import { requireSession } from "../../middleware/session.js";
import { listStudios, preferredStudio } from "../studio/service.js";
import { authorizeUrl, completeGoogleLogin, googleEnabled } from "./google.js";
import {
  completeProfile,
  devIssueSession,
  getUser,
  publicUser,
  requestChallenge,
  revokeSession,
  signInDirect,
  verifyChallenge,
} from "./service.js";

export const auth: Router = Router();

/** What the sign-in screen is allowed to offer. Keeps the UI from promising what isn't wired. */
auth.get("/config", (_req, res) => {
  // `otpRequired: false` is what tells each app to collect a name and number and stop.
  res.json({ google: googleEnabled, otp: otpChannels, otpRequired: env.OTP });
});

/**
 * Sign in with a phone number alone. Enabled only when `OTP=NO`, which production
 * refuses to boot with.
 */
auth.post("/direct", async (req, res) => {
  const body = z
    .object({
      phone,
      name: z.string().max(120).optional(),
      endorserCode: z.string().max(16).optional(),
    })
    .parse(req.body);

  const { user, session, isNew, referred } = await signInDirect({
    phone: body.phone,
    name: body.name,
    endorserCode: body.endorserCode,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  setSessionCookie(res, session.token, session.expiresAt);
  res.json({ user: publicUser(user), isNew, referred });
});

/* ---- Google ---------------------------------------------------------------- */

const OAUTH_STATE = "traiv_oauth_state";

auth.get("/google/start", (_req, res) => {
  if (!googleEnabled) throw badRequest("google_off", "Google sign-in isn't configured.");
  const state = newSessionToken();
  // Single-use, short-lived, httpOnly. Compared on return — this is the CSRF guard.
  res.cookie(OAUTH_STATE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 10 * 60 * 1000,
    path: "/",
  });
  res.redirect(authorizeUrl(state));
});

auth.get("/google/callback", async (req, res) => {
  const query = z
    .object({
      code: z.string().optional(),
      state: z.string().optional(),
      error: z.string().optional(),
    })
    .parse(req.query);

  const expected = readCookie(req, OAUTH_STATE);
  res.clearCookie(OAUTH_STATE, { path: "/" });

  const fail = (reason: string) => res.redirect(`${env.WEB_ORIGIN}/signin?error=${reason}`);

  if (query.error || !query.code) return fail("google_cancelled");
  if (!expected || expected !== query.state) return fail("google_state");

  const result = await completeGoogleLogin(query.code, req.ip, req.get("user-agent"));

  if (result.outcome === "needs_phone_to_link") return fail("google_link_phone");

  setSessionCookie(res, result.session.token, result.session.expiresAt);
  res.redirect(`${env.WEB_ORIGIN}/dashboard`);
});

/**
 * Any country's mobile number, in any written form.
 *
 * Validated by the same package the apps use, so there is no shape the form accepts and
 * this refuses. The transform means every handler below receives E.164 and nothing else.
 */
const phone = z
  .string()
  .min(4)
  .max(24)
  .transform((v, ctx) => {
    const parsed = parsePhone(v, DEFAULT_COUNTRY);
    if (!parsed.ok) {
      ctx.addIssue({
        code: "custom",
        message: phoneProblemMessage(parsed.problem, DEFAULT_COUNTRY),
      });
      return z.NEVER;
    }
    return parsed.e164;
  });

auth.post("/challenge", async (req, res) => {
  const body = z
    .object({
      phone,
      name: z.string().max(120).optional(),
      endorserCode: z.string().max(16).optional(),
    })
    .parse(req.body);
  const { transport } = await requestChallenge({
    phone: body.phone,
    name: body.name,
    endorserCode: body.endorserCode,
    ip: req.ip,
  });
  // Never reveals whether the number is already registered.
  res.json({ sent: true, transport });
});

auth.post("/verify", async (req, res) => {
  const body = z.object({ phone, code: z.string().regex(/^\d{6}$/) }).parse(req.body);
  const { user, session, isNew, referred } = await verifyChallenge({
    phone: body.phone,
    code: body.code,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  setSessionCookie(res, session.token, session.expiresAt);
  res.json({ user: publicUser(user), isNew, referred });
});

auth.post("/profile", async (req, res) => {
  const { userId } = requireSession(req);
  const body = z
    .object({ email: z.string().email().optional(), name: z.string().min(1).max(120).optional() })
    .parse(req.body);
  const user = await completeProfile(userId, body);
  res.json({ user: publicUser(user) });
});

auth.get("/me", async (req, res) => {
  const { userId, activeStudioId } = requireSession(req);
  const [user, studios] = await Promise.all([getUser(userId), listStudios(userId)]);
  // Derived from the memberships just read, not re-queried — and null rather than a
  // throw when there are none. A client belongs to no studio as staff, and asking who
  // you are must not 404 because of it.
  const active = studios.some((s) => s.id === activeStudioId)
    ? activeStudioId
    : preferredStudio(studios);
  res.json({ user: publicUser(user), studios, activeStudioId: active });
});

auth.post("/logout", async (req, res) => {
  if (req.auth) await revokeSession(req.auth.sessionId);
  clearSessionCookie(res);
  res.json({ ok: true });
});

/* ---------------------------------------------------------------------------
   Development only.
   Guarded here as well as by the boot assertion in env.ts — two independent
   checks, because shipping this by accident disables authentication entirely.
   --------------------------------------------------------------------------- */

function assertDev() {
  if (env.NODE_ENV === "production" || !env.AUTH_DEV_BYPASS) {
    throw forbidden("Not available.");
  }
}

auth.get("/dev/users", async (req, res) => {
  assertDev();
  const { role } = z.object({ role: z.enum(["client"]).optional() }).parse(req.query);

  // The client app asks for `role=client` so its panel offers accounts that app can
  // actually do something with. A coach account signed in there has no coaching
  // relationship and lands on an empty dashboard, which looks like a bug rather than
  // the correct answer.
  const isClient = inArray(
    schema.users.id,
    db
      .select({ id: schema.clients.userId })
      .from(schema.clients)
      .where(and(isNotNull(schema.clients.userId), isNull(schema.clients.deletedAt))),
  );

  const users = await db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      phone: schema.users.phone,
      email: schema.users.email,
    })
    .from(schema.users)
    .where(
      role === "client"
        ? and(isNull(schema.users.deletedAt), isClient)
        : isNull(schema.users.deletedAt),
    )
    .orderBy(desc(schema.users.createdAt))
    .limit(12);
  res.json({ users });
});

auth.post("/dev/login", async (req, res) => {
  assertDev();
  const { userId } = z.object({ userId: z.string().min(1) }).parse(req.body);
  const session = await devIssueSession(userId);
  setSessionCookie(res, session.token, session.expiresAt);
  res.json({ user: publicUser(await getUser(userId)) });
});
