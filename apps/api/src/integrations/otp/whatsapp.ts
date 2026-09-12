import { env } from "../../env.js";
import type { OtpTransport } from "./types.js";

/** Meta Cloud API, direct — no BSP. See ADR 0009. */
export function whatsappTransport(phoneNumberId: string, token: string): OtpTransport {
  return {
    name: "whatsapp",
    async send(phone, code) {
      const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "template",
          template: {
            name: env.WHATSAPP_OTP_TEMPLATE,
            language: { code: "en" },
            components: [
              { type: "body", parameters: [{ type: "text", text: code }] },
              {
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [{ type: "text", text: code }],
              },
            ],
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`WhatsApp send failed (${res.status}): ${await res.text()}`);
      }
    },
  };
}
