import { createSign } from "node:crypto";
import { connect } from "node:http2";
import { schema } from "@traiv/db";
import { and, eq } from "drizzle-orm";
import webpush from "web-push";
import { db } from "../../db.js";

const pushEnv = () => ({
  publicKey: process.env.WEB_PUSH_PUBLIC_KEY,
  privateKey: process.env.WEB_PUSH_PRIVATE_KEY,
  subject: process.env.WEB_PUSH_SUBJECT ?? "mailto:support@example.invalid",
});
export function pushConfig() {
  return {
    webKey: pushEnv().publicKey ?? null,
    ios: Boolean(
      process.env.APNS_KEY &&
        process.env.APNS_KEY_ID &&
        process.env.APNS_TEAM_ID &&
        process.env.APNS_BUNDLE_ID,
    ),
    android: Boolean(
      process.env.FCM_PROJECT_ID && process.env.FCM_CLIENT_EMAIL && process.env.FCM_PRIVATE_KEY,
    ),
  };
}
function jwt(header: object, payload: object, key: string, algorithm: string) {
  const data = `${Buffer.from(JSON.stringify(header)).toString("base64url")}.${Buffer.from(JSON.stringify(payload)).toString("base64url")}`;
  const signer = createSign(algorithm).update(data);
  return `${data}.${signer.sign({ key: key.replaceAll("\\n", "\n"), dsaEncoding: "ieee-p1363" }).toString("base64url")}`;
}
async function sendAndroid(token: string, title: string, body: string, url: string) {
  const now = Math.floor(Date.now() / 1000);
  const assertion = jwt(
    { alg: "RS256", typ: "JWT" },
    {
      iss: process.env.FCM_CLIENT_EMAIL,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    },
    process.env.FCM_PRIVATE_KEY ?? "",
    "RSA-SHA256",
  );
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(15000),
  });
  const auth = (await response.json()) as { access_token?: string };
  if (!response.ok || !auth.access_token) throw new Error("FCM credentials rejected");
  const sent = await fetch(
    `https://fcm.googleapis.com/v1/projects/${process.env.FCM_PROJECT_ID}/messages:send`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${auth.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ message: { token, notification: { title, body }, data: { url } } }),
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!sent.ok) throw new Error(`FCM delivery failed: ${sent.status}`);
}
async function sendIos(token: string, title: string, body: string, url: string) {
  const authorization = jwt(
    { alg: "ES256", kid: process.env.APNS_KEY_ID },
    { iss: process.env.APNS_TEAM_ID, iat: Math.floor(Date.now() / 1000) },
    process.env.APNS_KEY ?? "",
    "SHA256",
  );
  await new Promise<void>((resolve, reject) => {
    const client = connect(
      process.env.APNS_SANDBOX === "true"
        ? "https://api.sandbox.push.apple.com"
        : "https://api.push.apple.com",
    );
    client.on("error", reject);
    const request = client.request({
      ":method": "POST",
      ":path": `/3/device/${token}`,
      authorization: `bearer ${authorization}`,
      "apns-topic": process.env.APNS_BUNDLE_ID,
      "apns-push-type": "alert",
    });
    let status = 0;
    request.on("response", (headers) => {
      status = Number(headers[":status"]);
    });
    request.on("data", () => {});
    request.on("error", (e) => {
      client.close();
      reject(e);
    });
    request.on("end", () => {
      client.close();
      status === 200 ? resolve() : reject(new Error(`APNs delivery failed: ${status}`));
    });
    request.setTimeout(15000, () => {
      request.close();
      client.destroy();
      reject(new Error("APNs request timed out"));
    });
    request.end(JSON.stringify({ aps: { alert: { title, body }, sound: "default" }, url }));
  });
}
export async function notifyClient(
  clientId: string,
  category: "chat" | "checkIns" | "content",
  eventId: string,
  url: string,
) {
  const [client] = await db
    .select({ userId: schema.clients.userId, status: schema.clients.status })
    .from(schema.clients)
    .where(eq(schema.clients.id, clientId));
  if (!client?.userId || client.status !== "active") return;
  const userId = client.userId;
  const [prefs] = await db
    .select()
    .from(schema.clientSettings)
    .where(eq(schema.clientSettings.userId, userId));
  if (prefs?.notifications[category] === false) return;
  const config = pushConfig();
  const subscriptions = (
    await db
      .select()
      .from(schema.pushSubscriptions)
      .where(eq(schema.pushSubscriptions.userId, userId))
  ).filter((s) =>
    s.platform === "web"
      ? Boolean(config.webKey && pushEnv().privateKey)
      : s.platform === "ios"
        ? config.ios
        : config.android,
  );
  if (!subscriptions.length) return;
  const claim = await db
    .insert(schema.notificationDeliveries)
    .values({ userId, eventId })
    .onConflictDoNothing()
    .returning();
  if (!claim.length) return;
  const title = "Traiv",
    body =
      category === "chat"
        ? "You have a new message from your coach."
        : category === "checkIns"
          ? "Your check-in is ready to complete."
          : "Your coach has shared new content with you.";
  const results = await Promise.allSettled(
    subscriptions.map(async (s) => {
      if (s.platform === "web") {
        const env = pushEnv();
        try {
          await webpush.sendNotification(
            {
              endpoint: s.endpoint,
              keys: { p256dh: s.credentials.p256dh ?? "", auth: s.credentials.auth ?? "" },
            },
            JSON.stringify({ title, body, url }),
            {
              vapidDetails: {
                subject: env.subject,
                publicKey: env.publicKey ?? "",
                privateKey: env.privateKey ?? "",
              },
              TTL: 3600,
              timeout: 15000,
            },
          );
        } catch (e) {
          const status = (e as { statusCode?: number }).statusCode;
          if (status === 404 || status === 410)
            await db
              .delete(schema.pushSubscriptions)
              .where(eq(schema.pushSubscriptions.endpoint, s.endpoint));
          throw e;
        }
      } else if (s.platform === "ios") await sendIos(s.endpoint, title, body, url);
      else await sendAndroid(s.endpoint, title, body, url);
    }),
  );
  if (results.every((r) => r.status === "rejected")) {
    await db
      .delete(schema.notificationDeliveries)
      .where(
        and(
          eq(schema.notificationDeliveries.userId, userId),
          eq(schema.notificationDeliveries.eventId, eventId),
        ),
      );
    throw new Error("Notification delivery failed");
  }
}
