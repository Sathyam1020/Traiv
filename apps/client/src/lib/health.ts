import { Capacitor } from "@capacitor/core";
import { localDay } from "@traiv/ui/lib/steps";
import { http } from "./api/client";
export const healthPlatform = () =>
  Capacitor.isNativePlatform()
    ? Capacitor.getPlatform() === "ios"
      ? "apple_health"
      : "health_connect"
    : null;
export async function connectHealth(studioId: string) {
  const provider = healthPlatform();
  if (!provider) throw new Error("Health syncing requires the iOS or Android app.");
  const { Health } = await import("@capgo/capacitor-health");
  const available = await Health.isAvailable();
  if (!available.available)
    throw new Error(
      "Health data isn't available on this device. On Android, install or update Health Connect.",
    );
  await Health.requestAuthorization({ read: ["steps", "workouts"], write: [] });
  if (provider === "health_connect") {
    const access = await Health.checkAuthorization({ read: ["steps", "workouts"], write: [] });
    if (access.readDenied.length)
      throw new Error("Allow steps and workouts in Health Connect to connect.");
  }
  // iOS intentionally does not reveal read-permission denial. Empty data isn't proof of permission.
  await http.put(`/c/${studioId}/health`, { provider, enabled: true });
  return syncHealth(studioId);
}
export async function syncHealth(studioId: string) {
  const provider = healthPlatform();
  if (!provider) throw new Error("Open the native app to sync health data.");
  const { Health } = await import("@capgo/capacitor-health");
  const now = new Date(),
    start = new Date();
  start.setDate(start.getDate() - 29);
  start.setHours(0, 0, 0, 0);
  const [steps, workouts] = await Promise.all([
    Health.queryAggregated({
      dataType: "steps",
      startDate: start.toISOString(),
      endDate: now.toISOString(),
      bucket: "day",
      aggregation: "sum",
    }),
    Health.queryWorkouts({
      startDate: start.toISOString(),
      endDate: now.toISOString(),
      limit: 1000,
    }),
  ]);
  return (
    await http.post(`/c/${studioId}/health/sync`, {
      provider,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      steps: steps.samples.map((s) => ({
        date: localDay(new Date(s.startDate)),
        count: Math.round(s.value),
      })),
      workouts: workouts.workouts.map((w) => ({
        id: `${w.sourceName ?? "device"}:${w.startDate}:${w.endDate}:${w.workoutType}`,
        type: w.workoutType,
        start: w.startDate,
        end: w.endDate,
        duration: Math.round(w.duration),
        calories: w.totalEnergyBurned,
        source: w.sourceName,
      })),
    })
  ).data;
}
