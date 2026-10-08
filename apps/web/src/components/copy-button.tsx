"use client";

import { toast } from "@traiv/ui/components/sonner";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

/**
 * Copy one template to the clipboard.
 *
 * The icon changes for two seconds as well as raising a toast, because on a phone the
 * toast often lands under a thumb and the only feedback the person sees is the button.
 *
 * `navigator.clipboard` is unavailable on an insecure origin and can be refused outright,
 * so the failure path says to select the text by hand rather than silently doing nothing.
 */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      toast(`${label} copied`);
      setTimeout(() => setDone(false), 2000);
    } catch {
      toast("Could not reach the clipboard", {
        description: "Select the text and copy it by hand.",
      });
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-control border border-line-strong bg-surface px-3 py-1.5 text-caption font-medium transition-colors hover:bg-hover pointer-coarse:min-h-11 pointer-coarse:px-3.5"
    >
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}
