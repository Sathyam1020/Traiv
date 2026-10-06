"use client";

import { Button } from "@traiv/ui/components/button";
import { GoogleButton } from "@traiv/ui/components/google-button";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { Logo } from "@traiv/ui/components/logo";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DevBypass } from "@/components/auth/dev-bypass";
import { type AuthMode, useSignInFlow } from "@/components/auth/use-signin-flow";
import { OtpInput } from "@/components/common/otp-input";
import { PhoneField } from "@/components/common/phone-field";
import { TrustMarkers } from "@/components/common/trust-markers";
import { API_BASE } from "@/lib/api";
import { useAuthConfig } from "@/lib/query";

const VALID_PHONE = /^[6-9]\d{9}$/;

/**
 * The same shape as the coach app's sign-in, minus the referral code — there is nothing
 * to attribute here. One form does both jobs, because auth is passwordless: an unknown
 * number gets an account, a known one gets its session.
 */
export function SignInCard({ mode, onDone }: { mode: AuthMode; onDone: () => void }) {
  const flow = useSignInFlow(mode);
  const isSignup = mode === "signup";
  const other = isSignup ? "/signin" : "/signup";
  const { data: config } = useAuthConfig();
  const [otp, setOtp] = useState("");

  const canSend = VALID_PHONE.test(flow.phone) && !flow.busy;

  async function submit() {
    const ok = await flow.submitCode(otp);
    if (ok) onDone();
    else setOtp("");
  }

  return (
    <div className="flex w-full max-w-[25rem] flex-col gap-5">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo size={44} />
        <div className="flex flex-col gap-1">
          <span className="text-hero-sm font-semibold tracking-[-0.035em]">Traiv Endorsers</span>
          <span className="text-body-sm text-fg-muted">
            Refer coaches. Track what you bring in.
          </span>
        </div>
      </div>

      <div className="rounded-surface border border-line bg-surface p-6 shadow-sm sm:p-7">
        {flow.step === "phone" ? (
          <div className="flex flex-col gap-5">
            <header className="flex flex-col gap-1.5 text-center">
              <h1 className="text-heading font-semibold tracking-[-0.02em]">
                {isSignup ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-body-sm text-fg-muted">
                {isSignup
                  ? "Takes a minute. You'll get a code to share straight away."
                  : "Sign in to continue to your account."}
              </p>
            </header>

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
                if (!canSend) return;
                void flow.sendCode().then((done) => {
                  if (done) onDone();
                });
              }}
            >
              {isSignup ? (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    value={flow.name}
                    onChange={(e) => flow.setName(e.target.value)}
                    placeholder="Sathyam Sahu"
                    autoComplete="name"
                  />
                </div>
              ) : null}

              <PhoneField
                value={flow.phone}
                onChange={flow.setPhone}
                hint={
                  flow.otpRequired
                    ? config?.otp.primary === "whatsapp"
                      ? "We'll send a WhatsApp code to verify your number."
                      : "We'll text you a code to verify your number."
                    : "Development mode — no code needed."
                }
              />

              {flow.error ? <p className="text-caption text-danger">{flow.error}</p> : null}

              <Button type="submit" className="h-11 w-full gap-2" disabled={!canSend}>
                {flow.busy ? "Signing in…" : "Continue"}
                {flow.busy ? null : <ArrowRight className="size-4" />}
              </Button>
            </form>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (otp.length === 6) void submit();
            }}
          >
            <header className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setOtp("");
                  flow.back();
                }}
                className="-ml-1 mb-1 flex w-fit cursor-pointer items-center gap-1.5 rounded-control px-1 py-0.5 text-caption text-fg-muted transition-colors hover:text-fg"
              >
                <ArrowLeft className="size-3.5" /> Change number
              </button>
              <h1 className="text-heading font-semibold tracking-[-0.02em]">Enter the code</h1>
              <p className="text-body-sm text-fg-muted">
                Sent to <span className="tabular-nums text-fg">+91 {flow.phone}</span>
              </p>
            </header>

            <OtpInput value={otp} onChange={setOtp} disabled={flow.busy} invalid={!!flow.error} />
            {flow.error ? <p className="text-caption text-danger">{flow.error}</p> : null}

            <Button
              type="submit"
              className="h-11 w-full gap-2"
              disabled={otp.length !== 6 || flow.busy}
            >
              {flow.busy ? (
                "Checking…"
              ) : (
                <>
                  Sign in <Check className="size-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>

      <p className="text-center text-caption leading-relaxed text-fg-subtle">
        By continuing, you agree to our{" "}
        <span className="font-medium text-fg-muted">Terms of Service</span> and{" "}
        <span className="font-medium text-fg-muted">Privacy Policy</span>.
      </p>

      <p className="text-center text-body-sm text-fg-muted">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link href={other} className="font-medium text-fg underline-offset-4 hover:underline">
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>

      <TrustMarkers />

      <DevBypass onSignedIn={onDone} />
    </div>
  );
}
