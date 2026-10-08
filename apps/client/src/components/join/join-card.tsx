"use client";

import { isValidMobile } from "@traiv/phone";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { Logo } from "@traiv/ui/components/logo";
import { PhoneField } from "@traiv/ui/components/phone-field";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { OtpInput } from "@/components/common/otp-input";
import { useJoinFlow } from "@/components/join/use-join-flow";
import type { JoinOutcome } from "@/lib/api";

/**
 * Signing up to a specific coach.
 *
 * The coach's name is shown before anything is asked, because a stranger tapping a link
 * from WhatsApp has to know whose link it is before typing their phone number into it.
 */
export function JoinCard({
  code,
  studioName,
  signedIn,
  onDone,
}: {
  code: string;
  studioName: string;
  signedIn: boolean;
  onDone: (outcome: JoinOutcome) => void;
}) {
  const flow = useJoinFlow(code);
  const [otp, setOtp] = useState("");

  const canSend = isValidMobile(flow.phone, flow.countryCode) && !flow.busy;

  async function send() {
    // The no-OTP path signs in and attaches in one go, so it returns the outcome here.
    const outcome = await flow.sendCode();
    if (outcome) onDone(outcome);
  }

  async function submit() {
    const outcome = await flow.submitCode(otp);
    if (outcome) onDone(outcome);
    else setOtp("");
  }

  async function attachExisting() {
    const outcome = await flow.attachOnly();
    if (outcome) onDone(outcome);
  }

  return (
    <div className="flex w-full max-w-[25rem] flex-col gap-5">
      <div className="flex flex-col items-center gap-3">
        <Logo size={40} />
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-caption uppercase tracking-[0.08em] text-fg-subtle">
            You've been invited by
          </span>
          <span className="text-heading font-semibold tracking-[-0.02em]">{studioName}</span>
        </div>
      </div>

      <div className="rounded-surface border border-line bg-surface p-6 shadow-sm sm:p-7">
        {signedIn ? (
          <div className="flex flex-col gap-4">
            <p className="text-body-sm text-fg-muted">
              You're already signed in. Add {studioName} as your coach to continue.
            </p>
            <Button className="h-10 w-full gap-2" disabled={flow.busy} onClick={attachExisting}>
              {flow.busy ? "Adding…" : "Continue"}
              {flow.busy ? null : <ArrowRight className="size-4" />}
            </Button>
            {flow.error ? <p className="text-caption text-danger">{flow.error}</p> : null}
          </div>
        ) : flow.step === "identity" ? (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (canSend) void send();
            }}
          >
            <header className="flex flex-col gap-1.5">
              <h1 className="text-subheading font-semibold tracking-[-0.02em]">
                Create your account
              </h1>
              <p className="text-body-sm text-fg-muted">
                {flow.otpRequired
                  ? "Free. Your coach sets everything else up."
                  : "Development mode — no code needed."}
              </p>
            </header>

            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                value={flow.name}
                onChange={(e) => flow.setName(e.target.value)}
                placeholder="Priya Nair"
                autoComplete="name"
              />
            </div>

            <PhoneField
              value={flow.phone}
              onChange={flow.setPhone}
              countryCode={flow.countryCode}
              onCountryChange={flow.setCountryCode}
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
              {flow.step === "attaching" ? (
                "Adding you…"
              ) : flow.busy ? (
                "Checking…"
              ) : (
                <>
                  Verify <Check className="size-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>

      <p className="text-center text-caption text-fg-subtle">
        By continuing you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}
