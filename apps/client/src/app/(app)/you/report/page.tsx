"use client";
import { Button } from "@traiv/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@traiv/ui/components/dialog";
import { Textarea } from "@traiv/ui/components/textarea";
import { Check, MessageSquareText, ShieldCheck } from "@traiv/ui/icons";
import { useId, useRef, useState } from "react";
import { http } from "@/lib/api/client";
import { useActiveStudio } from "@/lib/query";
import { APP_VERSION } from "@/lib/version";
import { SettingsPage } from "../settings/common";
export default function ReportIssuePage() {
  const { studioId } = useActiveStudio();
  const inputId = useId();
  const submission = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!studioId || !message.trim() || busy) return;
    setBusy(true);
    setError("");
    submission.current ??= crypto.randomUUID();
    try {
      await http.post(`/c/${studioId}/feedback`, {
        id: submission.current,
        message: message.trim(),
        appVersion: APP_VERSION,
      });
      setOpen(false);
      setMessage("");
      submission.current = null;
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send your message. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <SettingsPage title="Report Issue" fill>
      <div className="flex flex-1 flex-col px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <MessageSquareText className="size-6 text-fg-subtle" />
          <h2 className="text-base font-semibold">We’d love to hear from you</h2>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-fg-muted">
          Share a feature request, suggest an improvement, report a problem, or simply tell us how
          we’re doing.
        </p>
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-fg-subtle" />
          <div>
            <h3 className="text-sm font-medium">
              Your feedback will not be shared with your coach
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-fg-muted">
              Messages are saved privately for the Traiv development team.
            </p>
          </div>
        </div>
        {sent && (
          <div
            role="status"
            className="mt-5 flex items-start gap-3 rounded-2xl bg-success-subtle p-4 text-success"
          >
            <Check className="size-5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Message received</p>
              <p className="mt-1 text-xs">Thanks for helping us improve Traiv.</p>
            </div>
          </div>
        )}
        <div className="mt-auto pt-8">
          <Button
            disabled={!studioId}
            className="h-12 w-full shrink-0 rounded-xl bg-signal text-signal-fg"
            onClick={() => {
              setError("");
              setOpen(true);
            }}
          >
            Send us a message
          </Button>
        </div>
      </div>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!busy) setOpen(value);
        }}
      >
        <DialogContent
          variant="scrollable"
          className="max-h-[85dvh] p-0"
          onInteractOutside={(e) => busy && e.preventDefault()}
        >
          <DialogHeader className="shrink-0">
            <DialogTitle>Send us a message</DialogTitle>
            <DialogDescription>
              Tell us what happened or what you’d like to improve.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={send} className="flex min-h-0 flex-col">
            <div className="min-h-0 overflow-y-auto px-5 py-4">
              <label htmlFor={inputId} className="mb-2 block text-sm font-medium">
                Your message
              </label>
              <Textarea
                id={inputId}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  submission.current = null;
                }}
                maxLength={4000}
                rows={7}
                required
                disabled={busy}
                className="w-full resize-y"
                placeholder="Describe the issue or share your feedback…"
              />
              <p className="mt-2 text-right text-xs text-fg-subtle">{message.length} / 4,000</p>
              {error && (
                <p role="alert" className="mt-3 text-sm text-danger">
                  {error}
                </p>
              )}
            </div>
            <footer className="flex shrink-0 justify-end gap-2 border-t border-line px-5 py-4">
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy || !message.trim()}>
                {busy ? "Sending…" : "Send message"}
              </Button>
            </footer>
          </form>
        </DialogContent>
      </Dialog>
    </SettingsPage>
  );
}
