"use client";

import type { CountryCode } from "@traiv/phone";
import { Button } from "@traiv/ui/components/button";
import { Checkbox } from "@traiv/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@traiv/ui/components/dialog";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { PhoneField } from "@traiv/ui/components/phone-field";
import { cn } from "@traiv/ui/lib/utils";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { track } from "@/lib/analytics";
import { ApiError, joinWaitlist, type WaitlistInput } from "@/lib/api";

/**
 * Every call to action on the site.
 *
 * Signing up is not open, so the honest thing a button can do is take a way to reach
 * somebody when it is. A toast saying "coming soon" wastes the only moment a visitor
 * has decided they want this — which is the moment they pressed the button.
 *
 * One component for all of it rather than six: when signup does open, this becomes a
 * link in one place instead of a search for every control that should have changed.
 */

type Variant = "primary" | "outline" | "pill" | "quiet";

const VARIANTS: Record<Variant, string> = {
  primary: "h-12 rounded-control px-6 text-body-sm",
  outline: "h-12 rounded-control border border-line-strong bg-surface px-6 text-body-sm",
  // Inside the header bar, where the control sits in an existing surface.
  pill: "h-auto rounded-control px-4 py-2 text-body-sm pointer-coarse:h-11 pointer-coarse:py-0",
  quiet:
    "h-auto rounded-control bg-transparent px-3.5 py-2 text-body-sm font-normal text-fg-muted hover:bg-hover hover:text-fg pointer-coarse:h-11 pointer-coarse:py-0",
};

export function NotifyMe({
  label = "Start free",
  intent = "signup",
  source,
  variant = "primary",
  className,
  showArrow,
  onOpen,
}: {
  label?: string;
  intent?: WaitlistInput["intent"];
  /** Which control this is, e.g. "hero" or "pricing-card-pro". Reported in analytics. */
  source: string;
  variant?: Variant;
  className?: string;
  showArrow?: boolean;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const arrow = showArrow ?? variant === "primary";

  return (
    <>
      <Button
        type="button"
        variant={variant === "primary" || variant === "pill" ? "default" : "ghost"}
        onClick={() => {
          // Recorded before the dialog opens, so the funnel's first step is the press
          // rather than something that only fires if the dialog finishes mounting.
          track("click", { label, source, intent });
          onOpen?.();
          setOpen(true);
        }}
        className={cn(
          "cursor-pointer font-medium",
          VARIANTS[variant],
          variant === "outline" && "text-fg hover:bg-hover",
          className,
        )}
      >
        {label}
        {arrow ? <ArrowRight className="size-4" /> : null}
      </Button>

      <NotifyDialog open={open} onOpenChange={setOpen} intent={intent} source={source} />
    </>
  );
}

function NotifyDialog({
  open,
  onOpenChange,
  intent,
  source,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  intent: WaitlistInput["intent"];
  source: string;
}) {
  const emailId = useId();
  const nameId = useId();
  const consentId = useId();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [announcements, setAnnouncements] = useState(true);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // The server requires one of the two, so the button must not be live until there is
  // one. A disabled button that explains itself beats a live one that returns a 400.
  const hasContact = email.trim().length > 0 || phone.trim().length > 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasContact || busy) return;

    setBusy(true);
    setError(null);
    try {
      await joinWaitlist({
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        name: name.trim() || undefined,
        intent,
        source,
        path: window.location.pathname,
        announcements,
      });
      track("submit", { source, intent, announcements });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something failed on our side. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        // Reset a beat after the close animation, so the form does not visibly empty
        // itself while the dialog is still on screen.
        if (!v) setTimeout(() => setDone(false), 200);
      }}
    >
      <DialogContent className="sm:max-w-[26rem]">
        {done ? (
          <div className="flex flex-col items-start gap-3 py-2">
            <span className="flex size-10 items-center justify-center rounded-full bg-success-subtle">
              <Check className="size-5 text-success" />
            </span>
            <DialogHeader className="gap-1 text-left">
              <DialogTitle className="font-display text-[1.25rem] tracking-[-0.02em]">
                You are on the list
              </DialogTitle>
              <DialogDescription className="text-body-sm leading-relaxed">
                {announcements
                  ? "We will write to you once — the day Traiv opens. Not a newsletter, and nothing in between."
                  : "Noted, and we will not write to you. Come back whenever you like."}
              </DialogDescription>
            </DialogHeader>
            <Button
              type="button"
              variant="outline"
              className="mt-2 cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-5">
            <DialogHeader className="gap-1 text-left">
              <DialogTitle className="font-display text-[1.25rem] tracking-[-0.02em]">
                Traiv is not open yet
              </DialogTitle>
              <DialogDescription className="text-body-sm leading-relaxed">
                It is being built now. Leave an email or a number and we will tell you the day it
                opens — nothing before that.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={nameId}>Your name</Label>
                <Input
                  id={nameId}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Optional"
                  autoComplete="name"
                  className="h-11"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor={emailId}>Email</Label>
                <Input
                  id={emailId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  className="h-11"
                />
              </div>

              <PhoneField
                value={phone}
                onChange={setPhone}
                countryCode={countryCode}
                onCountryChange={setCountryCode}
                label="Phone"
                hint="Either one is enough. Both means we can reach you whichever way works."
              />

              <label
                htmlFor={consentId}
                className="flex cursor-pointer items-start gap-3 rounded-control border border-line bg-sunken p-3"
              >
                <Checkbox
                  id={consentId}
                  checked={announcements}
                  onCheckedChange={(v) => setAnnouncements(v === true)}
                  className="mt-0.5"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-body-sm font-medium">Tell me when it opens</span>
                  <span className="text-caption leading-relaxed text-fg-muted">
                    One message, at launch. Untick this and we will keep your details and send you
                    nothing.
                  </span>
                </span>
              </label>
            </div>

            {error ? (
              <p role="alert" className="text-body-sm text-danger">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={!hasContact || busy}
                className="h-11 w-full cursor-pointer"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                {busy ? "Adding you" : "Add me to the list"}
              </Button>
              <p className="text-caption text-fg-subtle">
                {hasContact
                  ? "We will not pass this on to anyone, and you can ask us to delete it."
                  : "Add an email address or a phone number."}
              </p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
