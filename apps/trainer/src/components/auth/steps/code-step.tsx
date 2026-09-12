"use client";

import { Button } from "@traiv/ui/components/button";
import { ArrowLeft } from "lucide-react";

const CHANNEL_LABEL: Record<string, string> = {
  sms: "Sent by SMS to",
  whatsapp: "Sent on WhatsApp to",
  console: "Printed to the server log for",
};

import type { AuthFlow } from "@/components/auth/use-auth-flow";
import { OtpInput } from "@/components/common/otp-input";

export function CodeStep({ flow }: { flow: AuthFlow }) {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={flow.backToIdentity}
          className="-ml-1 mb-1 flex w-fit cursor-pointer items-center gap-1.5 rounded-control px-1 py-0.5 text-caption text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-3.5" /> Change number
        </button>
        <h1 className="text-heading font-semibold tracking-[-0.02em]">Enter the code</h1>
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
  );
}
