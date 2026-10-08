"use client";

import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { useState } from "react";
import type { AuthFlow } from "@/components/auth/use-auth-flow";

/**
 * Shape only — the server owns the real rule, and an address is proven by sending to it,
 * never by a pattern. This exists so the button can say "no" before the round trip.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProfileStep({ flow }: { flow: AuthFlow }) {
  const [touched, setTouched] = useState(false);

  const email = flow.email.trim();
  const valid = EMAIL.test(email);
  // Saving nothing is what "Skip for now" is for, so the button that claims to save an
  // address stays shut until there is one. Only complain after they have left the field —
  // an address is wrong for most of the time it takes to type one.
  const showError = touched && email.length > 0 && !valid;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-heading font-semibold tracking-[-0.02em]">Where should receipts go?</h1>
        <p className="text-body-sm text-fg-muted">
          For invoices and account recovery. Nothing else.
        </p>
      </header>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid && !flow.busy) void flow.submitProfile();
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={flow.email}
            onChange={(e) => flow.setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="you@example.com"
            aria-invalid={showError || undefined}
            aria-describedby="email-status"
          />
          <p id="email-status" aria-live="polite" className="text-caption text-danger">
            {showError ? "That doesn't look like an email address." : ""}
          </p>
        </div>

        {flow.error ? <p className="text-caption text-danger">{flow.error}</p> : null}

        <Button type="submit" className="h-11 w-full" disabled={!valid || flow.busy}>
          {flow.busy ? "Saving…" : "Open Traiv"}
        </Button>
        <button
          type="button"
          onClick={flow.skipProfile}
          disabled={flow.busy}
          className="mx-auto w-fit cursor-pointer text-caption text-fg-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-60"
        >
          Skip for now
        </button>
      </form>
    </div>
  );
}
