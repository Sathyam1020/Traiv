"use client";

import { Button } from "@traiv/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@traiv/ui/components/dialog";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { Logo } from "@traiv/ui/components/logo";
import { PhoneField } from "@traiv/ui/components/phone-field";
import { ArrowLeft, ArrowRight } from "@traiv/ui/icons";
import { OtpInput } from "@/components/common/otp-input";
import { useAuthConfig } from "@/lib/query";
import { useLinkPhoneFlow } from "./use-link-phone-flow";

const CHANNEL_LABEL: Record<string, string> = {
  sms: "Sent by SMS to",
  whatsapp: "Sent on WhatsApp to",
  console: "Printed to the server log for",
};

/**
 * The phone step for an account that signed in with Google. Reached only from
 * `AuthGuard` redirecting a session whose `needsPhone` is still true — never a general
 * entry point, which is why there is no signin/signup toggle here.
 */
export function LinkPhoneForm() {
  const flow = useLinkPhoneFlow();
  const { data: config } = useAuthConfig();

  return (
    <div className="flex w-full max-w-[25rem] flex-col gap-5">
      <div className="flex flex-col items-center gap-3">
        <Logo size={44} />
        <span className="text-hero-sm font-medium">Traiv</span>
      </div>

      <div className="rounded-surface bg-surface p-6 shadow-sm sm:p-7">
        {flow.step === "phone" ? (
          <div className="flex flex-col gap-5">
            <header className="flex flex-col gap-1.5">
              <h1 className="text-heading font-medium">Add your phone number</h1>
              <p className="text-body-sm text-fg-muted">
                Your clients reach you here — add the number you want them using.
              </p>
            </header>

            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (flow.phoneValid && !flow.busy) void flow.sendCode();
              }}
            >
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

              {flow.error ? <p className="text-caption text-danger">{flow.error}</p> : null}

              <Button
                type="submit"
                className="h-11 w-full gap-2"
                disabled={!flow.phoneValid || flow.busy}
              >
                {flow.busy ? "Sending…" : "Continue"}
                {!flow.busy && <ArrowRight className="size-4" />}
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <header className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={flow.backToIdentity}
                className="-ml-1 mb-1 flex w-fit cursor-pointer items-center gap-1.5 rounded-control px-1 py-0.5 text-caption text-fg-muted transition-colors hover:text-fg"
              >
                <ArrowLeft className="size-3.5" /> Change number
              </button>
              <h1 className="text-heading font-medium">Enter the code</h1>
              <p className="text-body-sm text-fg-muted">
                {CHANNEL_LABEL[flow.transport]}{" "}
                <span className="tabular-nums text-fg">+91 {flow.phone}</span>
              </p>
            </header>

            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (flow.code.length === 6) void flow.submitCode();
              }}
            >
              <OtpInput
                value={flow.code}
                onChange={flow.setCode}
                disabled={flow.busy}
                invalid={!!flow.error}
              />
              {flow.error ? <p className="text-caption text-danger">{flow.error}</p> : null}
              <Button
                type="submit"
                className="h-11 w-full"
                disabled={flow.code.length !== 6 || flow.busy}
              >
                {flow.busy ? "Checking…" : "Continue"}
              </Button>
            </form>

            <button
              type="button"
              disabled={flow.secondsLeft > 0 || flow.busy}
              onClick={() => void flow.sendCode()}
              className="w-fit cursor-pointer text-caption text-fg-muted transition-colors hover:text-fg disabled:cursor-default disabled:text-fg-subtle"
            >
              {flow.secondsLeft > 0 ? (
                <span className="tabular-nums">Resend in {flow.secondsLeft}s</span>
              ) : (
                "Resend the code"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Not dismissable — createDefaultStudio named the studio after the person because
          it had nothing else to call it, and that name must not reach the sidebar. */}
      <Dialog open={flow.step === "business"} onOpenChange={() => {}}>
        <DialogContent showCloseButton={false} onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>What's your business called?</DialogTitle>
            <DialogDescription>
              This is what your clients will see — you can change it later in Settings.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (flow.businessName.trim() && !flow.busy) void flow.submitBusinessName();
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="business-name">Business name</Label>
              <Input
                id="business-name"
                value={flow.businessName}
                onChange={(e) => flow.setBusinessName(e.target.value)}
                placeholder="Traiv"
                autoFocus
              />
            </div>
            {flow.error ? <p className="text-caption text-danger">{flow.error}</p> : null}
            <Button
              type="submit"
              className="h-11 w-full"
              disabled={!flow.businessName.trim() || flow.busy}
            >
              {flow.busy ? "Saving…" : "Continue"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
