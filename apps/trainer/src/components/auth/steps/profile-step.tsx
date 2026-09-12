"use client";

import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import type { AuthFlow } from "@/components/auth/use-auth-flow";

export function ProfileStep({ flow }: { flow: AuthFlow }) {
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
          void flow.submitProfile();
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={flow.email}
            onChange={(e) => flow.setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        {flow.error ? <p className="text-caption text-danger">{flow.error}</p> : null}
        <Button type="submit" className="h-11 w-full" disabled={flow.busy}>
          {flow.busy ? "Saving…" : "Open Traiv"}
        </Button>
        <button
          type="button"
          onClick={flow.skipProfile}
          className="mx-auto w-fit cursor-pointer text-caption text-fg-muted transition-colors hover:text-fg"
        >
          Skip for now
        </button>
      </form>
    </div>
  );
}
