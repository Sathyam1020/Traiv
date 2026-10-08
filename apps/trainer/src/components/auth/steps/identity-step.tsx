"use client";

import { Button } from "@traiv/ui/components/button";
import { GoogleButton } from "@traiv/ui/components/google-button";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { PhoneField } from "@traiv/ui/components/phone-field";
import { ArrowRight } from "lucide-react";
import { EndorserField, useEndorserCode } from "@/components/auth/endorser-field";
import { TrustMarkers } from "@/components/auth/trust-markers";
import type { AuthFlow, AuthMode } from "@/components/auth/use-auth-flow";
import { API_BASE } from "@/lib/api";
import { useAuthConfig } from "@/lib/query";

export function IdentityStep({ mode, flow }: { mode: AuthMode; flow: AuthFlow }) {
  const { data: config } = useAuthConfig();
  const isSignup = mode === "signup";

  // A referral code that is still being checked is not a reason to block somebody who
  // never entered one, so an empty code is ready. Everything else waits for an answer.
  const endorser = useEndorserCode(isSignup ? flow.endorserCode : "");
  const canContinue = flow.canSubmitIdentity && endorser.ready && !flow.busy;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1.5 text-center">
        <h1 className="text-heading font-semibold tracking-[-0.02em]">
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
        href={`${API_BASE}/auth/google/start`}
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

        <PhoneField
          value={flow.phone}
          onChange={flow.setPhone}
          countryCode={flow.countryCode}
          onCountryChange={flow.setCountryCode}
          hint={
            config?.otp.primary === "whatsapp"
              ? "We'll send a WhatsApp code to verify your number."
              : "We'll text you a code to verify your number."
          }
        />

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
        <span className="font-medium text-fg-muted">Terms of Service</span> and{" "}
        <span className="font-medium text-fg-muted">Privacy Policy</span>.
      </p>

      <TrustMarkers />
    </div>
  );
}
