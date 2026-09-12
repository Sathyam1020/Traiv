"use client";

import { Button } from "@traiv/ui/components/button";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Switch } from "@traiv/ui/components/switch";
import { Check, Copy, RefreshCw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useJoinCode, useRotateJoinCode, useSetJoinEnabled } from "@/lib/query";

const CLIENT_APP = process.env.NEXT_PUBLIC_CLIENT_URL ?? "http://localhost:3001";

/**
 * The QR a coach shows across a gym floor, and the link they send on WhatsApp.
 *
 * Both carry the same rotatable code. Rotating is the remedy for a QR that ends up
 * somewhere public, so it is offered plainly rather than buried — but it is destructive
 * to every QR already printed, so it says so.
 */
export function JoinCard() {
  const { data, isPending } = useJoinCode();
  const rotate = useRotateJoinCode();
  const setEnabled = useSetJoinEnabled();
  const [copied, setCopied] = useState(false);
  const [confirmRotate, setConfirmRotate] = useState(false);

  if (isPending || !data) {
    return (
      <div className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="size-44" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const link = `${CLIENT_APP}/join/${data.joinCode}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked in some contexts; the link is selectable either way.
    }
  }

  return (
    <section className="flex flex-col gap-5 rounded-surface border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-subheading font-semibold">Add a client</h2>
        <p className="text-body-sm text-fg-muted">
          They scan this or open the link, sign in, and land on your roster.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div
          className={`shrink-0 rounded-surface border border-line bg-white p-3 transition-opacity ${
            data.joinEnabled ? "" : "opacity-40"
          }`}
        >
          {/* Fixed white ground and black modules — scanners need the contrast, so this
              one surface deliberately ignores the theme. */}
          <QRCodeSVG value={link} size={168} level="M" bgColor="#FFFFFF" fgColor="#000000" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
              Your code
            </span>
            <span className="font-mono text-heading font-semibold tracking-[0.14em]">
              {data.joinCode}
            </span>
          </div>

          <div className="flex items-stretch gap-2">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="h-9 min-w-0 flex-1 rounded-control border border-line-strong bg-sunken px-3 text-body-sm text-fg-muted outline-none"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => void copy()}
              className="h-9 shrink-0 gap-1.5"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-body-sm font-medium">Accepting new clients</span>
            <span className="text-caption text-fg-muted">
              Turn this off and the code stops working until you turn it back on.
            </span>
          </div>
          <Switch
            checked={data.joinEnabled}
            disabled={setEnabled.isPending}
            onCheckedChange={(v) => setEnabled.mutate(v)}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-body-sm font-medium">New code</span>
            <span className="text-caption text-fg-muted">
              {confirmRotate
                ? "Every QR and link you've already shared will stop working."
                : "Use this if your code ended up somewhere public."}
            </span>
          </div>
          {confirmRotate ? (
            <div className="flex shrink-0 gap-2">
              <Button variant="ghost" size="sm" onClick={() => setConfirmRotate(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={rotate.isPending}
                onClick={() =>
                  rotate.mutate(undefined, { onSettled: () => setConfirmRotate(false) })
                }
              >
                {rotate.isPending ? "Replacing…" : "Replace code"}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => setConfirmRotate(true)}
            >
              <RefreshCw className="size-3.5" />
              Replace
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
