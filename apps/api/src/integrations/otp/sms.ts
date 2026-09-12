import type { OtpTransport } from "./types.js";

const ENDPOINT = "https://api.msg91.com/api/v5/flow/";

type FlowResponse = { type?: "success" | "error"; message?: string };

/**
 * MSG91 Flow API.
 *
 * Their plain SMS send, deliberately not their OTP product — that would generate and
 * verify codes itself, leaving two sources of truth. Ours is HMAC-hashed in our own
 * table with attempt limits and single-use enforcement, so we send the text and own
 * the code.
 *
 * The message body is fixed by the DLT-registered template; `flow_id` selects it and the
 * code is substituted into its variable. We cannot compose arbitrary text.
 */
export function smsTransport(authKey: string, senderId: string, flowId: string): OtpTransport {
  return {
    name: "sms",
    async send(phone, code) {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { authkey: authKey, "content-type": "application/json" },
        // MSG91 wants the number without a leading +.
        body: JSON.stringify({
          flow_id: flowId,
          sender: senderId,
          recipients: [{ mobiles: phone.replace(/^\+/, ""), OTP: code }],
        }),
      });

      const body = (await res.json().catch(() => ({}))) as FlowResponse;

      // MSG91 answers 200 even on failure and signals the outcome in `type`, so the
      // status code alone would report every error as a success.
      if (!res.ok || body.type !== "success") {
        throw new Error(`MSG91 send failed: ${body.message ?? `HTTP ${res.status}`}`);
      }
    },
  };
}
