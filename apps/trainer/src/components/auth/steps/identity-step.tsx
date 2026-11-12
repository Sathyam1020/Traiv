"use client";

import { Button } from "@traiv/ui/components/button";
import { GoogleButton } from "@traiv/ui/components/google-button";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { ArrowRight } from "@traiv/ui/icons";
import { useSearchParams } from "next/navigation";
import { EndorserField, useEndorserCode } from "@/components/auth/endorser-field";
import { TrustMarkers } from "@/components/auth/trust-markers";
import type { AuthFlow, AuthMode } from "@/components/auth/use-auth-flow";
import { API_BASE, MARKETING_URL } from "@/lib/api";
import { useAuthConfig } from "@/lib/query";

export function IdentityStep({ mode, flow }: { mode: AuthMode; flow: AuthFlow }) {
  const { data: config } = useAuthConfig();
  const params = useSearchParams();
  const isSignup = mode === "signup";

  // The cookie-free bridge that cannot ride through Google's own redirect round-trip
  // on the request body — `/auth/google/start` reads these straight off this link's
  // own query string instead (`attribution-design.md`).
  const googleParams = new URLSearchParams({ app: "trainer" });
  if (isSignup) {
    for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
      const value = params.get(key);
      if (value) googleParams.set(key, value);
    }
  }

  // A referral code that is still being checked is not a reason to block somebody who
  // never entered one, so an empty code is ready. Everything else waits for an answer.
  const endorser = useEndorserCode(isSignup ? flow.endorserCode : "");
  const canContinue = flow.canSubmitIdentity && endorser.ready && !flow.busy;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1.5 text-center">
        <h1 className="text-heading font-medium">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-body-sm text-fg-muted">
          {flow.otpRequired
            ? isSignup
              ? "Free for your first two clients. No card needed."
              : "Sign in to continue to your account."
            : "Development mode — no code needed."}
        </p>
      </header>

      {/* Always shown. Hiding it until credentials exist meant nobody ever saw it, and
          people look for it — so it is here, and says it is coming rather than failing
          after the click. */}
      <GoogleButton
        enabled={Boolean(config?.google)}
        href={`${API_BASE}/auth/google/start?${googleParams.toString()}`}
        label={isSignup ? "Sign up with Google" : "Sign in with Google"}
      />
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-caption text-fg-subtle">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (canContinue) void flow.sendCode();
        }}
      >
        {isSignup ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              value={flow.name}
              onChange={(e) => flow.setName(e.target.value)}
              placeholder="Rahul Deshmukh"
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="identity-email">Email</Label>
          <Input
            id="identity-email"
            type="email"
            value={flow.identityEmail}
            onChange={(e) => flow.setIdentityEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <p className="text-caption text-fg-subtle">We'll email you a code to verify it.</p>
        </div>

        {/* Signup only — there is nothing to attribute when an account already exists. */}
        {isSignup ? (
          <EndorserField
            value={flow.endorserCode}
            onChange={flow.setEndorserCode}
            state={endorser}
          />
        ) : null}

        {flow.error ? <p className="text-caption text-danger">{flow.error}</p> : null}

        <Button type="submit" className="h-11 w-full gap-2" disabled={!canContinue}>
          {flow.busy ? "Sending…" : "Continue"}
          {!flow.busy && <ArrowRight className="size-4" />}
        </Button>
      </form>

      <p className="text-center text-caption leading-relaxed text-fg-subtle">
        By continuing, you agree to our{" "}
        <a
          href={`${MARKETING_URL}/legal/terms`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-fg-muted underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href={`${MARKETING_URL}/legal/privacy`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-fg-muted underline"
        >
          Privacy Policy
        </a>
        .
      </p>

      <TrustMarkers />
    </div>
  );
}
