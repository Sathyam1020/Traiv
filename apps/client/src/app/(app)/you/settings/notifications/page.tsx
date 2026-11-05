"use client";
import { Capacitor } from "@capacitor/core";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Switch } from "@traiv/ui/components/switch";
import { Bell, ClipboardList, FileText, Mail, MessageSquareText, Users } from "@traiv/ui/icons";
import { useEffect, useState } from "react";
import { http } from "@/lib/api/client";
import { enablePush, notificationPermission, SystemSettings } from "@/lib/push";
import { useActiveStudio } from "@/lib/query";
import { type NotificationPreferences, useSettings } from "@/lib/query/use-settings";
import { SettingsPage } from "../common";
export default function NotificationsPage() {
  const { studioId } = useActiveStudio();
  const settings = useSettings(studioId);
  const qc = useQueryClient();
  const [permission, setPermission] = useState("checking");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let status: PermissionStatus | undefined;
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      void notificationPermission()
        .then((value) => {
          if (active) setPermission(value);
        })
        .catch(() => {
          if (active) setPermission("unavailable");
        });
    };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    if (!Capacitor.isNativePlatform() && navigator.permissions) {
      void navigator.permissions
        .query({ name: "notifications" })
        .then((value) => {
          if (!active) return;
          status = value;
          status.addEventListener("change", refresh);
        })
        .catch(() => {});
    }
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      status?.removeEventListener("change", refresh);
    };
  }, []);
  const pushAllowed = permission === "granted";
  async function toggle(key: keyof NotificationPreferences, value: boolean) {
    if (!studioId || !settings.data) return;
    if (
      ["chat", "checkIns", "content", "community"].includes(key) &&
      (!pushAllowed || key === "community")
    )
      return;
    setBusy(true);
    setError("");
    try {
      const next = { ...settings.data.settings.notifications, [key]: value };
      await http.patch(`/c/${studioId}/settings/notifications`, next);
      qc.setQueryData(["client-settings", studioId], {
        ...settings.data,
        settings: { ...settings.data.settings, notifications: next },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save preferences.");
    } finally {
      setBusy(false);
    }
  }
  async function enable() {
    if (!studioId) return;
    setBusy(true);
    setError("");
    try {
      if (permission === "denied" && Capacitor.isNativePlatform()) await SystemSettings.open();
      else await enablePush(studioId);
      setPermission(await notificationPermission());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't enable notifications.");
    } finally {
      setPermission(await notificationPermission().catch(() => "unavailable"));
      setBusy(false);
    }
  }
  const rows = [
    {
      key: "chat",
      title: "Chat Messages",
      description: "Receive notifications for new messages from your coach in the chat",
      Icon: MessageSquareText,
    },
    {
      key: "checkIns",
      title: "Check-in Reminders",
      description: "Get reminded to complete your weekly check-ins and progress updates",
      Icon: ClipboardList,
    },
    {
      key: "content",
      title: "New Content",
      description:
        "Be notified when your coach assigns new workouts, meal plans, or important documents",
      Icon: FileText,
    },
    {
      key: "community",
      title: "Community Posts",
      description: "Community updates will be available when communities launch",
      Icon: Users,
    },
  ] as const;
  return (
    <SettingsPage title="Notifications">
      <div className="space-y-6 px-4 py-5">
        <p className="text-sm text-fg-muted">Choose what you hear about, and how.</p>
        {!pushAllowed && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-[24px] bg-warning-subtle p-4"
          >
            <Bell className="mt-1 size-6 shrink-0 text-warning" />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold">
                {permission === "checking"
                  ? "Checking notification permission…"
                  : permission === "denied"
                    ? "Notifications are blocked for Traiv"
                    : permission === "unavailable"
                      ? "Push notifications aren't available here"
                      : "Enable notifications for Traiv"}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                {permission === "denied"
                  ? Capacitor.isNativePlatform()
                    ? "Open your phone’s Settings → Notifications → Traiv and turn on Allow notifications. Then return here."
                    : "You declined notification access. Open this site’s permissions using the icon beside the address bar, set Notifications to Allow, then return here. Traiv cannot reopen the permission popup while access is blocked."
                  : permission === "unavailable"
                    ? "On iPhone or iPad, add Traiv to your Home Screen and open it from there. Otherwise, use a browser that supports push notifications or the native app."
                    : permission === "checking"
                      ? "Your push preferences will be available after permission is checked."
                      : "Allow notifications in the system popup before choosing which push updates to receive. If you dismiss it, you can try again here."}
              </p>
              {permission !== "checking" && permission !== "unavailable" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 px-0 text-warning"
                  disabled={busy}
                  onClick={() => {
                    if (permission === "denied" && !Capacitor.isNativePlatform()) {
                      void notificationPermission().then(setPermission);
                    } else void enable();
                  }}
                >
                  {busy
                    ? "Please wait…"
                    : permission === "denied"
                      ? Capacitor.isNativePlatform()
                        ? "Open Settings"
                        : "Check permission again"
                      : "Enable notifications"}
                </Button>
              )}
            </div>
          </div>
        )}
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        {settings.isPending ? (
          <p className="text-sm text-fg-muted">Loading preferences…</p>
        ) : settings.isError ? (
          <div role="alert">
            <p>Couldn't load preferences.</p>
            <Button variant="outline" onClick={() => void settings.refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            <NotificationGroup title="Push Notifications">
              {!pushAllowed && (
                <p
                  id="push-permission-hint"
                  className="border-b border-line px-4 py-3 text-xs leading-relaxed text-fg-muted"
                >
                  Push notifications are off on this device. Enable access above to use these
                  switches. Your saved choices are kept.
                </p>
              )}
              {rows.map(({ key, title, description, Icon }) => (
                <div key={key} className="flex items-start gap-3 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-signal-subtle text-signal-text">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-fg-muted">{description}</p>
                  </div>
                  <Switch
                    aria-label={title}
                    fullWidth={false}
                    checked={
                      pushAllowed &&
                      key !== "community" &&
                      settings.data.settings.notifications[key]
                    }
                    aria-describedby={!pushAllowed ? "push-permission-hint" : undefined}
                    disabled={busy || !pushAllowed || key === "community"}
                    onCheckedChange={(v) => void toggle(key, v)}
                  />
                </div>
              ))}
            </NotificationGroup>
            <NotificationGroup title="Email Notifications">
              {[
                {
                  key: "messageEmail",
                  title: "New Message Emails",
                  description:
                    "Receive email notifications for new messages when you're not active in the app",
                },
                {
                  key: "campaignEmail",
                  title: "Campaign Emails",
                  description:
                    "Receive newsletters, health tips, success stories, and important updates from your coaching team",
                },
              ].map(({ key, title, description }) => (
                <div key={key} className="flex items-start gap-3 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-signal-subtle text-signal-text">
                    <Mail className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-fg-muted">{description}</p>
                  </div>
                  <Switch
                    aria-label={title}
                    fullWidth={false}
                    checked={
                      settings.data.settings.notifications[key as keyof NotificationPreferences]
                    }
                    disabled={busy}
                    onCheckedChange={(v) => void toggle(key as keyof NotificationPreferences, v)}
                  />
                </div>
              ))}
            </NotificationGroup>
            <p className="text-xs leading-relaxed text-fg-subtle">
              Email delivery is not enabled yet. Your choices are saved for when it becomes
              available.
            </p>
          </>
        )}
      </div>
    </SettingsPage>
  );
}
function NotificationGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-fg-muted">{title}</h2>
      <div className="divide-y divide-line overflow-hidden rounded-[24px] bg-surface">
        {children}
      </div>
    </section>
  );
}
