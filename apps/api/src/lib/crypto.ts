import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { env } from "../env.js";

/**
 * OTPs and session tokens are stored hashed, never in plaintext.
 *
 * HMAC rather than a bare hash: a 6-digit code has only a million possibilities, so a
 * plain SHA-256 of it is trivially reversible from a leaked table. Keying the hash with
 * the server secret means a database dump alone is not enough.
 */
export function hash(value: string): string {
  return createHmac("sha256", env.SESSION_SECRET).update(value).digest("hex");
}

/**
 * OTPs get their own key, and are bound to the challenge they belong to.
 *
 * Separate key: a session token is 256 bits of randomness and a code is one of a million,
 * so they do not deserve the same blast radius. Leaking the session secret should not also
 * hand over every outstanding code.
 *
 * Bound to the id: without it, the same six digits hash identically in every row, so one
 * recovered code is reusable anywhere it appears and identical hashes reveal identical
 * codes across users. The id makes each hash useful only in its own row.
 */
export function hashOtp(challengeId: string, code: string): string {
  return createHmac("sha256", env.OTP_PEPPER).update(`${challengeId}:${code}`).digest("hex");
}

/** Constant-time compare for a challenge-bound OTP hash. */
export function otpMatches(challengeId: string, code: string, expectedHash: string): boolean {
  const a = Buffer.from(hashOtp(challengeId, code), "hex");
  const b = Buffer.from(expectedHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Constant-time compare, so response timing can't be used to guess a code. */
export function matches(value: string, expectedHash: string): boolean {
  const a = Buffer.from(hash(value), "hex");
  const b = Buffer.from(expectedHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Cryptographically random 6-digit code. Not Math.random. */
export function newOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function newSessionToken(): string {
  return randomBytes(32).toString("base64url");
}
