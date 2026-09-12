import { env } from "../../env.js";
import { consoleTransport } from "./console.js";
import { smsTransport } from "./sms.js";
import type { OtpTransport, TransportName } from "./types.js";
import { whatsappTransport } from "./whatsapp.js";

export type { OtpTransport, TransportName } from "./types.js";

const smsReady = Boolean(env.MSG91_AUTH_KEY && env.MSG91_SENDER_ID && env.MSG91_FLOW_ID);
const whatsappReady = Boolean(env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_ACCESS_TOKEN);

function build(name: TransportName): OtpTransport | null {
  if (name === "console") return consoleTransport;
  if (name === "sms") {
    return smsReady
      ? smsTransport(
          env.MSG91_AUTH_KEY as string,
          env.MSG91_SENDER_ID as string,
          env.MSG91_FLOW_ID as string,
        )
      : null;
  }
  return whatsappReady
    ? whatsappTransport(env.WHATSAPP_PHONE_NUMBER_ID as string, env.WHATSAPP_ACCESS_TOKEN as string)
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
  return async function send(phone: string, code: string): Promise<SendResult> {
    try {
      await first.send(phone, code);
      return { transport: first.name, fellBack: false };
    } catch (primaryError) {
      if (!second || second.name === first.name) throw primaryError;

      console.error(
        `[otp] ${first.name} failed, trying ${second.name}:`,
        primaryError instanceof Error ? primaryError.message : primaryError,
      );

      await second.send(phone, code);
      return { transport: second.name, fellBack: true };
    }
  };
}

export const sendOtp = createSender(primary, fallback);
