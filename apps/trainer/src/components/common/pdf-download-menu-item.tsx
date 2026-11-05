"use client";

import { DropdownMenuItem } from "@traiv/ui/components/dropdown-menu";
import { Download, Loader } from "@traiv/ui/icons";
import { notifyAction } from "@traiv/ui/lib/action-feedback";
import { useRef, useState } from "react";

const activeDownloads = new Set<string>();

export function PdfDownloadMenuItem({
  kind,
  studioId,
  id,
  disabled = false,
}: {
  kind: "workout" | "mealplan";
  studioId: string;
  id: string;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const running = useRef(false);
  async function download() {
    const key = `${kind}:${studioId}:${id}`;
    if (running.current || activeDownloads.has(key)) return;
    activeDownloads.add(key);
    running.current = true;
    setBusy(true);
    notifyAction("Preparing your PDF…", "success");
    try {
      const { downloadPlanPdf } = await import("@/lib/pdf/download");
      const missing = await downloadPlanPdf(kind, studioId, id);
      notifyAction(
        missing ? "PDF downloaded. Some images were unavailable." : "PDF downloaded",
        "success",
      );
    } catch {
      notifyAction("Couldn't download the PDF. Please try again.", "error");
    } finally {
      activeDownloads.delete(key);
      running.current = false;
      setBusy(false);
    }
  }
  return (
    <DropdownMenuItem
      disabled={disabled || busy || !studioId}
      onSelect={(event) => {
        event.preventDefault();
        void download();
      }}
    >
      {busy ? <Loader className="size-4 animate-spin" /> : <Download className="size-4" />}
      {busy ? "Preparing PDF…" : "Download as PDF"}
    </DropdownMenuItem>
  );
}
