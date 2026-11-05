import { Capacitor, registerPlugin } from "@capacitor/core";
import { http } from "./api/client";
export const SystemSettings = registerPlugin<{ open(): Promise<void> }>("SystemSettings");
export async function notificationPermission() {
  if (Capacitor.isNativePlatform()) {
    const { PushNotifications } = await import("@capacitor/push-notifications");
    return (await PushNotifications.checkPermissions()).receive;
  }
  return typeof Notification === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
    ? "unavailable"
    : Notification.permission;
}
export async function enablePush(studioId: string) {
  const config = (
    await http.get<{ webKey: string | null; ios: boolean; android: boolean }>(
      `/c/${studioId}/push/config`,
    )
  ).data;
  if (Capacitor.isNativePlatform()) {
    const platform = Capacitor.getPlatform();
    if (platform === "ios" ? !config.ios : !config.android)
      throw new Error("Native push delivery isn't configured on the server yet.");
    const { PushNotifications } = await import("@capacitor/push-notifications");
    if ((await PushNotifications.requestPermissions()).receive !== "granted")
      throw new Error("Allow notifications in your phone’s settings.");
    let resolveCompletion: () => void = () => {};
    let rejectCompletion: (reason: unknown) => void = () => {};
    const pending = new Promise<void>((resolve, reject) => {
      resolveCompletion = resolve;
      rejectCompletion = reject;
    });
    const completion = { promise: pending, resolve: resolveCompletion, reject: rejectCompletion };
    void pending.catch(() => {});
    const success = await PushNotifications.addListener("registration", (token) => {
      void http
        .post(`/c/${studioId}/push`, { platform, endpoint: token.value })
        .then(() => {
          sessionStorage.setItem("traiv-push", JSON.stringify({ studioId, endpoint: token.value }));
          completion.resolve();
        })
        .catch(completion.reject);
    });
    const failure = await PushNotifications.addListener("registrationError", () =>
      completion.reject(new Error("Couldn't register this device for notifications.")),
    );
    const timeout = setTimeout(
      () => completion.reject(new Error("Device registration timed out. Try again.")),
      20000,
    );
    try {
      await PushNotifications.register();
      await completion.promise;
    } finally {
      clearTimeout(timeout);
      await success.remove();
      await failure.remove();
    }
  } else {
    if (!config.webKey)
      throw new Error("Browser push delivery isn't configured on the server yet.");
    if (
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    )
      throw new Error(
        "Push isn't supported here. On iPhone, add Traiv to your Home Screen and open it there.",
      );
    if ((await Notification.requestPermission()) !== "granted")
      throw new Error("Allow notifications in your browser’s site settings.");
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    const decoded = atob(config.webKey.replaceAll("-", "+").replaceAll("_", "/"));
    const key = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: key,
      }));
    await http.post(`/c/${studioId}/push`, { platform: "web", ...subscription.toJSON() });
    sessionStorage.setItem(
      "traiv-push",
      JSON.stringify({ studioId, endpoint: subscription.endpoint }),
    );
  }
}

export async function unregisterPush() {
  const value = sessionStorage.getItem("traiv-push");
  if (value) {
    const { studioId, endpoint } = JSON.parse(value) as { studioId: string; endpoint: string };
    await http.delete(`/c/${studioId}/push`, { data: { endpoint } });
    sessionStorage.removeItem("traiv-push");
  }
  if (!Capacitor.isNativePlatform() && "serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    await subscription?.unsubscribe();
  }
}
