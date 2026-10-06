"use client";

import { Button } from "@traiv/ui/components/button";
import { Logo } from "@traiv/ui/components/logo";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { DevBypass } from "@/components/auth/dev-bypass";
import { useSignInFlow } from "@/components/auth/use-signin-flow";
import { OtpInput } from "@/components/common/otp-input";
import { PhoneField } from "@/components/common/phone-field";

const VALID_PHONE = /^[6-9]\d{9}$/;

export function SignInCard({ onDone }: { onDone: () => void }) {
  const flow = useSignInFlow();
  const [otp, setOtp] = useState("");

  const canSend = VALID_PHONE.test(flow.phone) && !flow.busy;

  async function submit() {
    const ok = await flow.submitCode(otp);
    if (ok) onDone();
    else setOtp("");
  }

  return (
    <div className="flex w-full max-w-[25rem] flex-col gap-5">
      <div className="flex flex-col items-center gap-3">
        <Logo size={40} />
        <span className="text-hero-sm font-semibold tracking-[-0.035em]">Traiv</span>
      </div>

      <div className="rounded-surface border border-line bg-surface p-6 shadow-sm sm:p-7">
        {flow.step === "phone" ? (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (canSend) void flow.sendCode();
            }}
          >
            <header className="flex flex-col gap-1.5">
              <h1 className="text-subheading font-semibold tracking-[-0.02em]">Sign in</h1>
              <p className="text-body-sm text-fg-muted">Use the number your coach has for you.</p>
            </header>

            <PhoneField
              value={flow.phone}
              onChange={flow.setPhone}
              hint="We'll text you a code to verify your number."
            />

            {flow.error ? <p className="text-caption text-danger">{flow.error}</p> : null}

            <Button type="submit" className="h-10 w-full gap-2" disabled={!canSend}>
              {flow.busy ? "Sending…" : "Continue"}
              {flow.busy ? null : <ArrowRight className="size-4" />}
            </Button>
          </form>
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
              <h1 className="text-subheading font-semibold tracking-[-0.02em]">Enter the code</h1>
              <p className="text-body-sm text-fg-muted">
                Sent to <span className="tabular-nums text-fg">+91 {flow.phone}</span>
              </p>
            </header>

            <OtpInput value={otp} onChange={setOtp} disabled={flow.busy} invalid={!!flow.error} />

            {flow.error ? <p className="text-caption text-danger">{flow.error}</p> : null}

            <Button
              type="submit"
              className="h-10 w-full gap-2"
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

      <DevBypass onSignedIn={onDone} />

      {/* The one thing this screen has to make clear: there is no self-serve signup.
          A coach's link is what creates the relationship, and nothing here can. */}
      <div className="rounded-surface border border-line bg-sunken px-4 py-3">
        <p className="text-caption leading-relaxed text-fg-muted">
          <span className="font-medium text-fg">New here?</span> You'll need the link or QR code
          your coach sent you — that's what connects your account to them. Signing in here won't do
          it on its own.
        </p>
      </div>
    </div>
  );
}
