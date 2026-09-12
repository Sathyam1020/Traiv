"use client";

import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { ArrowRight } from "lucide-react";
import { PhoneField } from "@/components/auth/phone-field";
import { TrustMarkers } from "@/components/auth/trust-markers";
import type { AuthFlow, AuthMode } from "@/components/auth/use-auth-flow";
import { GoogleMark } from "@/components/common/google-mark";
import { API_BASE } from "@/lib/api";
import { useAuthConfig } from "@/lib/query";

export function IdentityStep({ mode, flow }: { mode: AuthMode; flow: AuthFlow }) {
  const { data: config } = useAuthConfig();
  const isSignup = mode === "signup";

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1.5 text-center">
        <h1 className="text-heading font-semibold tracking-[-0.02em]">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-body-sm text-fg-muted">
          {isSignup
            ? "Free for your first two clients. No card needed."
            : "Sign in to continue to your account."}
        </p>
      </header>

      {/* Only offered when the API reports credentials are configured — never a button
          that promises something the server can't do. */}
      {config?.google ? (
        <>
          <Button asChild variant="outline" className="h-10 w-full gap-2.5 font-medium">
            <a href={`${API_BASE}/auth/google/start`}>
              <GoogleMark />
              {isSignup ? "Sign up with Google" : "Sign in with Google"}
            </a>
          </Button>
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-caption text-fg-subtle">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>
        </>
      ) : null}

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (flow.canSubmitIdentity) void flow.sendCode();
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
          hint={
            config?.otp.primary === "whatsapp"
              ? "We'll send a WhatsApp code to verify your number."
              : "We'll text you a code to verify your number."
          }
        />

        {flow.error ? <p className="text-caption text-danger">{flow.error}</p> : null}

        <Button
          type="submit"
          className="h-11 w-full gap-2"
          disabled={!flow.canSubmitIdentity || flow.busy}
        >
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
