import type { OtpTransport } from "./types.js";

type SendResponse = { id?: string; state?: string };

/**
 * android-sms-gateway (capcom6/android-sms-gateway), Cloud Server Mode.
 *
 * A phone's own SIM, sending through the project's hosted relay — `baseUrl` points at
 * `api.sms-gate.app` by default rather than a self-hosted server, so there is nothing of
 * ours to run or operate for this. Basic Auth, the same username/password the app's
 * Cloud Server screen shows directly, not a separately generated token.
 *
 * The `/3rdparty/v1/message` path is the one the project documents for exactly this
 * case — an external backend sending through the relay, as opposed to the richer
 * `/messages` surface their own dashboard and mobile app use. Worth a live smoke test
 * against a real account once credentials exist; the project's published OpenAPI spec
 * does not itself cover this path, only their prose docs do.
 */
export function androidSmsTransport(
  baseUrl: string,
  username: string,
  password: string,
): OtpTransport {
  const auth = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

  return {
    name: "android-sms",
    async send(phone, code) {
      const res = await fetch(`${baseUrl}/3rdparty/v1/message`, {
        method: "POST",
        headers: { Authorization: auth, "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumbers: [phone],
          // "NNNNNN is your Traiv verification code" is exactly the phrase India's
          // carrier-side DLT/anti-fraud filters key on for unregistered senders — it was
          // rejected outright (RESULT_ERROR_GENERIC_FAILURE) in live testing. This
          // wording wasn't; confirmed delivering end to end against a real device.
          textMessage: { text: `Your Traiv code is ${code}` },
          withDeliveryReport: false,
        }),
      });

      if (!res.ok) {
        throw new Error(`android-sms send failed (${res.status}): ${await res.text()}`);
      }

      // Best-effort read — a 2xx with an unreadable or unexpected body still means the
      // relay accepted the job, and failing the send over a parse error here would
      // retry an OTP that's already in flight.
      const body = (await res.json().catch(() => null)) as SendResponse | null;
      if (body?.state === "Failed") {
        throw new Error("android-sms send failed: relay reported state=Failed");
      }
    },
  };
}
