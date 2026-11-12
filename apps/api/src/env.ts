import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { z } from "zod";

// One .env at the repo root, loaded relative to this file rather than the working
// directory — so `pnpm seed`, `pnpm dev` and drizzle-kit all see the same values
// regardless of which folder they are run from.
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../.env") });

// `KEY=` with nothing after the `=` is how a human leaves an optional var unset — but
// `.optional()` only accepts a genuinely missing key, not an empty string, so a plain
// `z.string().email().optional()` throws on it instead of treating it as absent. This
// normalises the empty-string case to `undefined` first, for any field where blank and
// unset must mean the same thing.
const optionalEmail = () =>
  z.preprocess((v) => (v === "" ? undefined : v), z.string().email().optional());

/**
 * Environment is parsed once, at boot. The process refuses to start if anything is
 * missing or malformed — a misconfigured server should fail immediately and loudly,
 * not at 2am on the first request that happens to touch the missing variable.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  EXERCISEAPI_KEY: z.string().optional(),
  EXERCISE_CATALOG: z.enum(["legacy", "exerciseapi"]).default("legacy"),
  FOOD_LABEL_API_KEY: z.string().optional(),
  FOOD_LABEL_MODEL: z.string().default("gpt-4.1-mini"),
  API_PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  // Separate from SESSION_SECRET on purpose: a six-digit code and a 256-bit token should
  // not share a key, so leaking one does not compromise the other.
  OTP_PEPPER: z.string().min(32, "OTP_PEPPER must be at least 32 characters"),

  AUTH_DEV_BYPASS: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),

  /**
   * The single platform administrator, by email address — ADR 0034. Was by phone
   * number; phone auth no longer exists at all, so this had to move with it.
   *
   * One admin by construction: there is one value here, and no endpoint that grants the
   * role. Admin access is therefore revoked by changing this and restarting, which is
   * the only control that cannot itself be compromised by a bug in the admin surface.
   * Unset means nobody is an admin and the admin API answers 403 to everyone.
   */
  ADMIN_EMAIL: optionalEmail(),

  /**
   * `OTP=NO` skips code verification entirely: an email and a name create or open an
   * account. Development only — it means anyone who knows an address can sign in as
   * that person, so production refuses to boot with it.
   */
  OTP: z
    .enum(["YES", "NO"])
    .default("YES")
    .transform((v) => v === "YES"),

  // --- OTP delivery — ADR 0034 ---
  // Phone auth (sms/whatsapp/android-sms) is retired; "email" (Resend) is the only
  // real transport. Switching it, if that ever happens again, is a one-line change here.
  OTP_TRANSPORT: z.enum(["email", "console"]).default("email"),
  OTP_FALLBACK: z.enum(["email", "none"]).default("none"),

  // Resend. A verified sending domain (resend.com/domains) is required before this can
  // reach a real inbox — unverified, Resend only accepts its own `*.resend.dev` test
  // addresses. Blank in development — the console transport prints OTPs to stdout instead.
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_ADDRESS: optionalEmail(),

  // Where the coach app runs. Used for CORS and the post-auth redirect.
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  // Where the client app runs. A second origin, not a second API — both are allowed
  // through CORS, and credentials require echoing the exact origin that called.
  CLIENT_ORIGIN: z.string().url().default("http://localhost:3001"),
  ENDORSE_ORIGIN: z.string().url().default("http://localhost:3002"),
  ADMIN_ORIGIN: z.string().url().default("http://localhost:3003"),
  // The public marketing site. Allowed through CORS for the waitlist, the analytics
  // beacon and the blog — none of which carry a session, which is why those routes are
  // mounted outside every authorisation gate rather than given a weaker one.
  MARKETING_ORIGIN: z.string().url().default("http://localhost:3004"),
  // Unset in development so the cookie stays host-only on localhost.
  COOKIE_DOMAIN: z.string().optional(),

  // Google sign-in is enabled only when both are present; the button is hidden otherwise.
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().default("http://localhost:4000/auth/google/callback"),

  /**
   * Cloudinary, for progress photos and profile pictures.
   *
   * The browser uploads straight to Cloudinary; this API only signs the request, so the
   * secret never leaves the server and the image bytes never pass through it. Unset means
   * the signing route answers 503 and the photo steps of a check-in say so — every other
   * step still works, which is what keeps the feature testable without an account.
   */
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Blank in development — ConsoleMailer prints to stdout instead.
  AWS_REGION: z.string().default("ap-south-1"),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  SES_FROM_ADDRESS: z.string().email().optional(),
});

function load() {
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid environment:\n${issues}\n\nCopy .env.example to .env.`);
  }

  const env = parsed.data;

  // Guard two. The dev bypass skips authentication entirely, so it gets a check that
  // cannot be defeated by a single misconfigured variable. The route-level guard is
  // the other one. See ADR 0005.
  // A transport selected without its credentials would silently degrade to printing
  // OTPs into the server log — nobody receives one and signup fails with no error.
  if (env.NODE_ENV === "production") {
    const missing: string[] = [];
    const needsEmail = env.OTP_TRANSPORT === "email" || env.OTP_FALLBACK === "email";

    if (needsEmail && !(env.RESEND_API_KEY && env.RESEND_FROM_ADDRESS)) {
      missing.push("RESEND_API_KEY, RESEND_FROM_ADDRESS");
    }
    if (env.OTP_TRANSPORT === "console") {
      missing.push("OTP_TRANSPORT=console is not permitted in production");
    }
    if (!env.OTP) {
      missing.push("OTP=NO is not permitted in production — anyone could sign in as anyone");
    }
    if (missing.length) {
      throw new Error(
        `OTP transport is misconfigured for production:\n  ${missing.join("\n  ")}\n\n` +
          "Refusing to start — OTPs would be written to the log instead of sent.",
      );
    }
  }

  if (env.NODE_ENV === "production" && env.AUTH_DEV_BYPASS) {
    throw new Error(
      "AUTH_DEV_BYPASS is enabled in production. Refusing to start. " +
        "This flag disables authentication and must never be set outside development.",
    );
  }

  return env;
}

export const env = load();
export type Env = typeof env;
