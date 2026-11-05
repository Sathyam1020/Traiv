"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Switch } from "@traiv/ui/components/switch";
import { Check, HeartPulse, Link as LinkIcon, RefreshCw, ShieldCheck } from "@traiv/ui/icons";
import { useEffect, useState } from "react";
import { http } from "@/lib/api/client";
import { connectHealth, healthPlatform, syncHealth } from "@/lib/health";
import { useActiveStudio } from "@/lib/query";
import { SettingsPage } from "../common";
export default function IntegrationsPage() {
  const { studioId } = useActiveStudio();
  const qc = useQueryClient();
  const connection = useQuery({
    queryKey: ["health", studioId],
    queryFn: async () =>
      (
        await http.get<{ enabled: boolean; provider: string | null; lastSyncedAt: string | null }>(
          `/c/${studioId}/health`,
        )
      ).data,
    enabled: Boolean(studioId),
  });
  const [platform, setPlatform] = useState<ReturnType<typeof healthPlatform>>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    setPlatform(healthPlatform());
  }, []);
  const name = platform === "health_connect" ? "Health Connect" : "Apple Health";
  async function action(mode: "connect" | "disconnect" | "sync") {
    if (!studioId) return;
    setBusy(true);
    setError("");
    try {
      if (mode === "connect") await connectHealth(studioId);
      else if (mode === "sync") await syncHealth(studioId);
      else
        await http.put(`/c/${studioId}/health`, {
          provider: connection.data?.provider ?? platform,
          enabled: false,
        });
      await qc.invalidateQueries({ queryKey: ["health", studioId] });
      window.dispatchEvent(new Event("traiv:steps-updated"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't update this integration.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <SettingsPage title="Integrations">
      <div className="space-y-4 px-4 py-5">
        <p className="text-sm leading-relaxed text-fg-muted">
          Traiv reads health data from your phone’s built-in health platform. Activity tracked by
          compatible watches and fitness apps flows in through there.
        </p>
        {!platform && (
          <p className="rounded-2xl bg-warning-subtle p-4 text-sm leading-relaxed text-warning">
            Health syncing is available in the Traiv iOS and Android apps. Browsers and the
            installed PWA cannot access Apple Health or Health Connect.
          </p>
        )}
        <section className="rounded-[24px] bg-surface p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-signal-subtle">
              <HeartPulse className="size-6 text-signal-text" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">{platform ? name : "Apple Health / Health Connect"}</h2>
              <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                Steps and workouts from your phone and connected watch
              </p>
            </div>
            <Switch
              aria-label={`Connect ${name}`}
              fullWidth={false}
              checked={Boolean(connection.data?.enabled)}
              disabled={!platform || busy || connection.isPending || connection.isError}
              onCheckedChange={(on) => void action(on ? "connect" : "disconnect")}
            />
          </div>
          <div className="mt-4 space-y-3 border-t border-line pt-4">
            {["Steps", "Workouts"].map((label) => (
              <div key={label} className="flex items-center justify-between gap-3 text-sm">
                <span>{label}</span>
                <span className="flex items-center gap-2 text-xs text-fg-subtle">
                  {connection.data?.lastSyncedAt && <Check className="size-4 text-success" />}
                  {connection.data?.lastSyncedAt
                    ? `Last sync ${new Date(connection.data.lastSyncedAt).toLocaleString()}`
                    : "Not synced"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={!platform || !connection.data?.enabled || busy}
              onClick={() => void action("sync")}
            >
              <RefreshCw className="size-4" />
              {busy ? "Syncing…" : "Sync now"}
            </Button>
          </div>
          {connection.isError && (
            <p role="alert" className="mt-3 text-sm text-danger">
              Couldn't load your connection.{" "}
              <button type="button" className="underline" onClick={() => void connection.refetch()}>
                Retry
              </button>
            </p>
          )}
          {error && (
            <p role="alert" className="mt-3 text-sm text-danger">
              {error}
            </p>
          )}
        </section>
        <section className="rounded-[24px] bg-surface p-5">
          <h2 className="text-xs font-medium text-fg-subtle">Connected through your phone</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Compatible fitness apps and watches share data through Apple Health on iPhone or Health
            Connect on Android. Connect them there, then open Traiv and sync.
          </p>
          <details className="mt-4 rounded-2xl bg-panel p-3 text-sm">
            <summary className="flex cursor-pointer items-center gap-2 font-medium">
              <LinkIcon className="size-4 text-signal-text" />
              How to connect your health platform
            </summary>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-fg-muted">
              <li>
                iPhone: open Health, select your profile, then Apps and Traiv. Allow steps and
                workouts.
              </li>
              <li>
                Android: open Health Connect in your phone’s settings, select App permissions, then
                Traiv. Allow steps and exercise sessions.
              </li>
              <li>
                Enable your watch’s health sharing in its companion app, then use Sync now here.
              </li>
              <li>
                To revoke permission, turn off access in your phone’s health settings. Disconnecting
                here stops Traiv syncing and keeps previously imported history.
              </li>
            </ol>
          </details>
        </section>
        <section className="flex gap-3 rounded-[24px] bg-surface p-5">
          <ShieldCheck className="size-6 shrink-0 text-signal-text" />
          <div>
            <h2 className="text-sm font-semibold">Your data stays yours</h2>
            <p className="mt-1 text-xs leading-relaxed text-fg-muted">
              Traiv reads only the steps and workouts you authorize and shares them with your coach.
              It does not request write access to your phone’s health store. You can disconnect at
              any time.
            </p>
          </div>
        </section>
      </div>
    </SettingsPage>
  );
}
