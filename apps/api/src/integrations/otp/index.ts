import { env } from "../../env.js";
import { consoleTransport } from "./console.js";
import { resendTransport } from "./resend.js";
import type { OtpTransport, TransportName } from "./types.js";

export type { OtpTransport, TransportName } from "./types.js";

const emailReady = Boolean(env.RESEND_API_KEY && env.RESEND_FROM_ADDRESS);

function build(name: TransportName): OtpTransport | null {
  if (name === "console") return consoleTransport;
  return emailReady
    ? resendTransport(env.RESEND_API_KEY as string, env.RESEND_FROM_ADDRESS as string)
    : null;
}

/**
 * Primary transport, plus an optional fallback used only when the primary send throws.
 *
 * A configured transport with missing credentials falls back to console in development
 * and is rejected at boot in production — see env.ts. Silently printing OTPs to a
 * production log means nobody ever receives one and signup dies without an error.
 */
const primary = build(env.OTP_TRANSPORT) ?? consoleTransport;
const fallback = env.OTP_FALLBACK === "none" ? null : build(env.OTP_FALLBACK);

export const otpChannels = {
  primary: primary.name,
  fallback: fallback?.name ?? null,
  live: primary.name !== "console",
};

export type SendResult = { transport: TransportName; fellBack: boolean };

/**
 * Attempts the primary, then the fallback. Throws only if every configured channel
 * failed — the caller records the error and leaves `sentAt` null so the user's hourly
 * quota is not spent on our outage.
 *
 * Takes its transports as arguments so the fallback behaviour can be tested with fakes
 * rather than by reaching for module mocks.
 */
export function createSender(first: OtpTransport, second: OtpTransport | null) {
  return async function send(target: string, code: string): Promise<SendResult> {
    try {
      await first.send(target, code);
      return { transport: first.name, fellBack: false };
    } catch (primaryError) {
      if (!second || second.name === first.name) throw primaryError;

      console.error(
        `[otp] ${first.name} failed, trying ${second.name}:`,
        primaryError instanceof Error ? primaryError.message : primaryError,
      );

      await second.send(target, code);
      return { transport: second.name, fellBack: true };
    }
  };
}

export const sendOtp = createSender(primary, fallback);
