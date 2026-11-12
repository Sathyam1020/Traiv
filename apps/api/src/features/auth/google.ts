import { newId, schema } from "@traiv/db";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../db.js";
import { env } from "../../env.js";
import { badRequest } from "../../errors.js";
import { track } from "../analytics/service.js";
import { createDefaultStudio, resolveActiveStudio } from "../studio/service.js";
import { issueSession } from "./service.js";

// Verified against Google's OIDC discovery document, not from memory.
const AUTHORIZE = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN = "https://oauth2.googleapis.com/token";
const USERINFO = "https://openidconnect.googleapis.com/v1/userinfo";

export const googleEnabled = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);

export function authorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `${AUTHORIZE}?${params}`;
}

type Profile = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

async function fetchProfile(code: string): Promise<Profile> {
  const tokenRes = await fetch(TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID ?? "",
      client_secret: env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) throw badRequest("google_token", "Google sign-in failed. Try again.");

  const { access_token } = (await tokenRes.json()) as { access_token?: string };
  if (!access_token) throw badRequest("google_token", "Google sign-in failed. Try again.");

  const meRes = await fetch(USERINFO, { headers: { Authorization: `Bearer ${access_token}` } });
  if (!meRes.ok) throw badRequest("google_profile", "Couldn't read your Google profile.");
  return (await meRes.json()) as Profile;
}

/**
 * Resolve a Google login to a session.
 *
 * The account-linking rule is the important part. An email collected via `/profile` or
 * email+OTP signup can be unverified at either end, so if someone arrives from Google
 * with an email that matches an existing *unverified* email, linking them would hand
 * over that account to whoever actually controls the mailbox. We refuse — and since
 * Google itself vouches for the address (`profile.email_verified`), the other account's
 * claim was never real, so it loses the address and the Google sign-in proceeds as a
 * fresh account instead. Only when Google doesn't vouch for it either do we have no safe
 * way to resolve who the address really belongs to, so that case is refused outright.
 * See ADR 0034 (was ADR 0005, back when phone was the proven identity to fall back to).
 */
export async function completeGoogleLogin(
  code: string,
  ip?: string,
  userAgent?: string,
  utm?: { utmSource?: string; utmMedium?: string; utmCampaign?: string },
) {
  const profile = await fetchProfile(code);
  const email = profile.email?.toLowerCase() ?? null;

  const [existingIdentity] = await db
    .select({ userId: schema.authIdentities.userId })
    .from(schema.authIdentities)
    .where(
      and(
        eq(schema.authIdentities.provider, "google"),
        eq(schema.authIdentities.providerUid, profile.sub),
      ),
    )
    .limit(1);

  if (existingIdentity) {
    const session = await issueSession(db, existingIdentity.userId, ip, userAgent);
    return { session, outcome: "signed_in" as const };
  }

  if (email) {
    const [byEmail] = await db
      .select()
      .from(schema.users)
      .where(and(eq(schema.users.email, email), isNull(schema.users.deletedAt)))
      .limit(1);

    // The classic federated pre-hijack: an attacker signs up with the victim's address
    // and waits for them to click "Sign in with Google". Linking to an account that
    // never proved the address would hand over whatever the attacker set up on it.
    if (byEmail && !byEmail.emailVerifiedAt) {
      if (!profile.email_verified) {
        // Neither side has proven this address, so there is no safe way to tell who it
        // really belongs to. Refuse rather than guess.
        return { outcome: "email_conflict" as const };
      }
      // Google has verified it and this account has not, so the unverified claim loses
      // the address — it was never actually theirs. Falls through to "create a new
      // account" below, using the address this just freed.
      await db
        .update(schema.users)
        .set({ email: null, updatedAt: new Date() })
        .where(eq(schema.users.id, byEmail.id));
    } else if (byEmail) {
      await db.transaction(async (tx) => {
        await tx.insert(schema.authIdentities).values({
          id: newId(),
          userId: byEmail.id,
          provider: "google",
          providerUid: profile.sub,
        });
        // A new way into an account is a credential change. Anything already signed in
        // predates that proof, so it does not survive it.
        await tx
          .update(schema.sessions)
          .set({ revokedAt: new Date() })
          .where(and(eq(schema.sessions.userId, byEmail.id), isNull(schema.sessions.revokedAt)));
      });

      const session = await issueSession(db, byEmail.id, ip, userAgent);
      return { session, outcome: "linked" as const };
    }
  }

  const id = newId();
  await db.transaction(async (tx) => {
    await tx.insert(schema.users).values({
      id,
      email,
      name: profile.name ?? "",
      avatarUrl: profile.picture ?? null,
      // Google verifies the address, so ours is verified too — unlike an email typed at signup.
      emailVerifiedAt: profile.email_verified ? new Date() : null,
    });
    await tx.insert(schema.authIdentities).values({
      id: newId(),
      userId: id,
      provider: "google",
      providerUid: profile.sub,
    });
    await createDefaultStudio(tx, { id, name: profile.name ?? "" });

    // Same transaction as the user, same reasoning as the phone-signup path in
    // `service.ts` — see `attribution-design.md`. Only when at least one param
    // actually arrived (the `OAUTH_UTM` cookie, set only when `/google/start` saw one).
    if (utm?.utmSource || utm?.utmMedium || utm?.utmCampaign) {
      await tx.insert(schema.acquisitionAttributions).values({
        userId: id,
        firstTouchSource: utm.utmSource ?? null,
        firstTouchMedium: utm.utmMedium ?? null,
        firstTouchCampaign: utm.utmCampaign ?? null,
        firstTouchAt: new Date(),
        lastTouchSource: utm.utmSource ?? null,
        lastTouchMedium: utm.utmMedium ?? null,
        lastTouchCampaign: utm.utmCampaign ?? null,
        lastTouchAt: new Date(),
      });
    }
  });

  const activeStudioId = await resolveActiveStudio(id);
  const session = await issueSession(db, id, ip, userAgent, activeStudioId);

  // After the transaction, never allowed to fail the signup it's describing — same
  // reasoning as the phone-signup instrumentation in service.ts.
  await track({
    name: "signup_completed",
    properties: { method: "google" },
    userId: id,
    studioId: activeStudioId,
    actorRole: "trainer",
    sourceApp: "trainer",
  }).catch(() => {});

  return { session, outcome: "created" as const };
}
