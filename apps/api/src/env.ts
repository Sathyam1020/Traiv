import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { z } from "zod";

// One .env at the repo root, loaded relative to this file rather than the working
// directory — so `pnpm seed`, `pnpm dev` and drizzle-kit all see the same values
// regardless of which folder they are run from.
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../.env") });

/**
 * Environment is parsed once, at boot. The process refuses to start if anything is
 * missing or malformed — a misconfigured server should fail immediately and loudly,
 * not at 2am on the first request that happens to touch the missing variable.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
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

  // --- OTP delivery ---
  // Switching the primary channel is a one-line change here.
  OTP_TRANSPORT: z.enum(["sms", "whatsapp", "console"]).default("sms"),
  OTP_FALLBACK: z.enum(["sms", "whatsapp", "none"]).default("none"),

  // MSG91. FLOW_ID is the DLT-registered template; SENDER_ID the registered 6-char header.
  MSG91_AUTH_KEY: z.string().optional(),
  MSG91_SENDER_ID: z.string().optional(),
  MSG91_FLOW_ID: z.string().optional(),

  // Blank in development — the console transport prints OTPs to stdout instead.
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: z.string().optional(),
  WHATSAPP_OTP_TEMPLATE: z.string().default("traiv_otp"),

  // Where the coach app runs. Used for CORS and the post-auth redirect.
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  // Where the client app runs. A second origin, not a second API — both are allowed
  // through CORS, and credentials require echoing the exact origin that called.
  CLIENT_ORIGIN: z.string().url().default("http://localhost:3001"),
  // Unset in development so the cookie stays host-only on localhost.
  COOKIE_DOMAIN: z.string().optional(),

  // Google sign-in is enabled only when both are present; the button is hidden otherwise.
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().default("http://localhost:4000/auth/google/callback"),

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
    const needsSms = env.OTP_TRANSPORT === "sms" || env.OTP_FALLBACK === "sms";
    const needsWhatsapp = env.OTP_TRANSPORT === "whatsapp" || env.OTP_FALLBACK === "whatsapp";

    if (needsSms && !(env.MSG91_AUTH_KEY && env.MSG91_SENDER_ID && env.MSG91_FLOW_ID)) {
      missing.push("MSG91_AUTH_KEY, MSG91_SENDER_ID, MSG91_FLOW_ID");
    }
    if (needsWhatsapp && !(env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_ACCESS_TOKEN)) {
      missing.push("WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN");
    }
    if (env.OTP_TRANSPORT === "console") {
      missing.push("OTP_TRANSPORT=console is not permitted in production");
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
