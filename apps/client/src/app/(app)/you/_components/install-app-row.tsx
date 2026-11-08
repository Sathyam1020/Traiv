"use client";

import { Download } from "@traiv/ui/icons";
import { useState } from "react";
import { promptInstall, useInstallState } from "@/lib/pwa/install-prompt";

/**
 * Lives in Settings rather than a popup — see `install-prompt.ts` for why. Hidden
 * entirely once installed; otherwise always present, because whether the browser has
 * actually handed over a working install prompt yet is outside this app's control, and
 * a row that's sometimes just not there would be exactly the "did this do anything?"
 * confusion the popup version had.
 */
export function InstallAppRow() {
  const state = useInstallState();
  const [busy, setBusy] = useState(false);
  const [noPromptYet, setNoPromptYet] = useState(false);

  if (state === "installed") return null;

  if (state === "ios-manual") {
    return (
      <div className="flex min-h-14 flex-col justify-center gap-0.5 px-4 py-3">
        <span className="flex items-center gap-4 text-sm font-medium">
          <Download className="size-5 text-fg-subtle" />
          Install Traiv
        </span>
        <span className="pl-9 text-xs text-fg-muted">
          Tap the Share icon, then "Add to Home Screen".
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="client-tappable flex min-h-14 w-full flex-col items-start justify-center gap-0.5 px-4 py-3 text-left"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        setNoPromptYet(false);
        const outcome = await promptInstall();
        setBusy(false);
        if (outcome === "unavailable") setNoPromptYet(true);
      }}
    >
      <span className="flex items-center gap-4 text-sm font-medium">
        <Download className="size-5 text-fg-subtle" />
        {busy ? "Installing…" : "Install Traiv"}
      </span>
      {noPromptYet ? (
        <span className="pl-9 text-xs text-fg-muted">
          Not available yet — look for "Install" in your browser's menu.
        </span>
      ) : null}
    </button>
  );
}
