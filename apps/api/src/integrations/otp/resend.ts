import { Resend } from "resend";
import type { OtpTransport } from "./types.js";

/**
 * Resend. `from` must be an address on a domain verified in the Resend dashboard — an
 * unverified domain only accepts delivery to the account owner's own address. See
 * ADR 0034.
 */
export function resendTransport(apiKey: string, from: string): OtpTransport {
  const resend = new Resend(apiKey);

  return {
    name: "email",
    async send(target, code) {
      const { error } = await resend.emails.send({
        from,
        to: target,
        subject: `${code} is your Traiv code`,
        html: `<p>Your Traiv verification code is <strong>${code}</strong>.</p><p>It expires in 5 minutes.</p>`,
      });

      if (error) {
        throw new Error(`Resend send failed: ${error.message}`);
      }
    },
  };
}
