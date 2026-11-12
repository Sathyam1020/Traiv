import { schema } from "@traiv/db";
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
import { trainerAccount } from "./account.js";
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
auth.use("/account", trainerAccount);

/** What the sign-in screen is allowed to offer. Keeps the UI from promising what isn't wired. */
auth.get("/config", (_req, res) => {
  // `otpRequired: false` is what tells each app to collect a name and number and stop.
  res.json({ google: googleEnabled, otp: otpChannels, otpRequired: env.OTP });
});

/**
 * Sign in with an email address alone. Enabled only when `OTP=NO`, which production
 * refuses to boot with.
 */
auth.post("/direct", async (req, res) => {
  const body = z
    .object({
      email: z.string().email(),
      name: z.string().max(120).optional(),
      endorserCode: z.string().max(16).optional(),
      utmSource: z.string().max(200).optional(),
      utmMedium: z.string().max(200).optional(),
      utmCampaign: z.string().max(200).optional(),
    })
    .parse(req.body);

  const { user, session, isNew, referred } = await signInDirect({
    email: body.email,
    name: body.name,
    endorserCode: body.endorserCode,
    utmSource: body.utmSource,
    utmMedium: body.utmMedium,
    utmCampaign: body.utmCampaign,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  setSessionCookie(res, session.token, session.expiresAt);
  res.json({ user: publicUser(user), isNew, referred });
});

/* ---- Google ---------------------------------------------------------------- */

const OAUTH_STATE = "traiv_oauth_state";
const OAUTH_APP = "traiv_oauth_app";
// Google's own redirect round-trip carries no room for a request body, so the signup
// link's own utm params ride a cookie just for this one short hop instead — still no
// device identifier for an anonymous visitor (ADR 0021 is untouched; this is a signed
// Google identity completing signup, not an anonymous visit). See
// `attribution-design.md`.
const OAUTH_UTM = "traiv_oauth_utm";

// Which app started the flow — the callback is one shared route for both, and has to
// send the browser back to whichever one actually asked, not always the coach app.
const oauthApp = z.enum(["client", "trainer"]);
type OauthApp = z.infer<typeof oauthApp>;

function originFor(app: OauthApp): string {
  return app === "client" ? env.CLIENT_ORIGIN : env.WEB_ORIGIN;
}

// Each app's own sign-in page and its own post-login landing — not interchangeable.
// The client app signs in at "/" and lands on "/dashboard" ("Today"); the trainer app
// has no "/dashboard" at all, it signs in at "/signin" and lands on "/clients".
function signinPathFor(app: OauthApp): string {
  return app === "client" ? "/" : "/signin";
}

function landingPathFor(app: OauthApp): string {
  return app === "client" ? "/dashboard" : "/clients";
}

auth.get("/google/start", (req, res) => {
  if (!googleEnabled) throw badRequest("google_off", "Google sign-in isn't configured.");
  const app = oauthApp.catch("trainer").parse(req.query.app);
  const state = newSessionToken();
  // Single-use, short-lived, httpOnly. Compared on return — this is the CSRF guard.
  const cookieOpts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env.NODE_ENV === "production",
    maxAge: 10 * 60 * 1000,
    path: "/",
  };
  res.cookie(OAUTH_STATE, state, cookieOpts);
  res.cookie(OAUTH_APP, app, cookieOpts);

  const utmQuery = z
    .object({
      utm_source: z.string().max(200).optional(),
      utm_medium: z.string().max(200).optional(),
      utm_campaign: z.string().max(200).optional(),
    })
    .parse(req.query);
  if (utmQuery.utm_source || utmQuery.utm_medium || utmQuery.utm_campaign) {
    res.cookie(OAUTH_UTM, JSON.stringify(utmQuery), cookieOpts);
  }

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
  const app = oauthApp.catch("trainer").parse(readCookie(req, OAUTH_APP));
  const utmRaw = readCookie(req, OAUTH_UTM);
  res.clearCookie(OAUTH_STATE, { path: "/" });
  res.clearCookie(OAUTH_APP, { path: "/" });
  res.clearCookie(OAUTH_UTM, { path: "/" });
  // Never allowed to break a real Google sign-in over a malformed analytics cookie.
  const utm = z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
    })
    .catch({})
    .parse(
      (() => {
        try {
          return utmRaw ? JSON.parse(utmRaw) : {};
        } catch {
          return {};
        }
      })(),
    );

  const origin = originFor(app);
  const fail = (reason: string) => res.redirect(`${origin}${signinPathFor(app)}?error=${reason}`);

  if (query.error || !query.code) return fail("google_cancelled");
  if (!expected || expected !== query.state) return fail("google_state");

  // This endpoint is a browser-navigated redirect target, not a JSON API — every path
  // out of it has to end in a redirect. Without this, a thrown error (Google's token
  // exchange failing on a misconfigured redirect URI, a network blip, anything) reaches
  // the generic error middleware instead, which answers with raw `{error, message}` JSON
  // on the API's own origin — a dead end with no way back into either app.
  let result: Awaited<ReturnType<typeof completeGoogleLogin>>;
  try {
    result = await completeGoogleLogin(query.code, req.ip, req.get("user-agent"), {
      utmSource: utm.utm_source,
      utmMedium: utm.utm_medium,
      utmCampaign: utm.utm_campaign,
    });
  } catch (error) {
    const code = error instanceof Error && "code" in error ? String(error.code) : "google_failed";
    console.error("[auth] Google sign-in failed:", error instanceof Error ? error.message : error);
    return fail(code);
  }

  if (result.outcome === "email_conflict") return fail("google_email_conflict");

  setSessionCookie(res, result.session.token, result.session.expiresAt);
  res.redirect(`${origin}${landingPathFor(app)}`);
});

auth.post("/challenge", async (req, res) => {
  const body = z
    .object({
      email: z.string().email(),
      name: z.string().max(120).optional(),
      endorserCode: z.string().max(16).optional(),
      // The signup page's own query params at the moment it called this — see
      // `attribution-design.md`. Never re-derived from a cookie.
      utmSource: z.string().max(200).optional(),
      utmMedium: z.string().max(200).optional(),
      utmCampaign: z.string().max(200).optional(),
    })
    .parse(req.body);
  const { transport } = await requestChallenge({
    email: body.email,
    name: body.name,
    endorserCode: body.endorserCode,
    utmSource: body.utmSource,
    utmMedium: body.utmMedium,
    utmCampaign: body.utmCampaign,
    ip: req.ip,
  });
  // Never reveals whether the address is already registered.
  res.json({ sent: true, transport });
});

auth.post("/verify", async (req, res) => {
  const body = z
    .object({ email: z.string().email(), code: z.string().regex(/^\d{6}$/) })
    .parse(req.body);
  const { user, session, isNew, referred } = await verifyChallenge({
    email: body.email,
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
