"use client";

import { Button } from "@traiv/ui/components/button";
import { Download } from "@traiv/ui/icons";
import { useState } from "react";
import { promptInstall, useInstallState } from "@/lib/pwa/install-prompt";

/**
 * Lives in Settings rather than a popup — see `install-prompt.ts` for why. Hidden
 * entirely once installed; otherwise always present, because whether the browser has
 * actually handed over a working install prompt yet is outside this app's control, and
 * a button that's sometimes just not there would be exactly the "did this do
 * anything?" confusion the popup version had.
 */
export function InstallAppCard() {
  const state = useInstallState();
  const [busy, setBusy] = useState(false);
  const [noPromptYet, setNoPromptYet] = useState(false);

  if (state === "installed") return null;

  return (
    <section className="flex flex-col gap-3 rounded-surface border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-subheading font-semibold">Install Traiv Coach</h2>
        <p className="text-body-sm text-fg-muted">
          Opens straight to Clients, full-screen, no address bar.
        </p>
      </div>

      {state === "ios-manual" ? (
        <p className="text-body-sm text-fg-muted">
          Tap the Share icon in Safari, then "Add to Home Screen".
        </p>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-fit gap-1.5"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setNoPromptYet(false);
            const outcome = await promptInstall();
            setBusy(false);
            if (outcome === "unavailable") setNoPromptYet(true);
          }}
        >
          <Download className="size-3.5" />
          {busy ? "Installing…" : "Install"}
        </Button>
      )}

      {noPromptYet ? (
        <p className="text-caption text-fg-muted">
          Your browser hasn't offered installation yet. Look for "Install Traiv Coach" in its menu,
          or the install icon in the address bar.
        </p>
      ) : null}
    </section>
  );
}
