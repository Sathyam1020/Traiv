import type { CapacitorConfig } from "@capacitor/cli";
// Next.js uses server routes; native shells load the same first-party hosted client.
// Set this to the deployed HTTPS client origin before release (LAN URL for a device in dev).
const url = process.env.TRAIV_NATIVE_URL ?? "http://localhost:3001";
if (process.env.NODE_ENV === "production" && !url.startsWith("https://")) throw new Error("Set TRAIV_NATIVE_URL to the deployed HTTPS client origin.");
const config: CapacitorConfig = {
  appId: "app.traiv.client", appName: "Traiv", webDir: "native-web",
  server: { url, cleartext: url.startsWith("http://") },
  plugins: { PushNotifications: { presentationOptions: ["badge", "sound", "alert"] } },
};
export default config;
