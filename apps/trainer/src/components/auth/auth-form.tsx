"use client";

import { Logo } from "@traiv/ui/components/logo";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { DevBypass } from "@/components/auth/dev-bypass";
import { CodeStep } from "@/components/auth/steps/code-step";
import { IdentityStep } from "@/components/auth/steps/identity-step";
import { ProfileStep } from "@/components/auth/steps/profile-step";
import { type AuthMode, useAuthFlow } from "@/components/auth/use-auth-flow";

const ease = [0.16, 1, 0.3, 1] as const;

const transition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease },
};

/** Shared by /signin and /signup. The mode changes what is asked for, not the flow. */
export function AuthForm({ mode }: { mode: AuthMode }) {
  const flow = useAuthFlow(mode);
  const other = mode === "signin" ? "/signup" : "/signin";

  return (
    <div className="flex w-full max-w-[25rem] flex-col gap-5">
      <div className="flex flex-col items-center gap-3">
        <Logo size={44} />
        <span className="text-hero-sm font-semibold tracking-[-0.035em]">Traiv</span>
      </div>

      <div className="rounded-surface bg-surface p-6 shadow-sm sm:p-7">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`${flow.step}-${mode}`} {...transition}>
            {flow.step === "identity" && <IdentityStep mode={mode} flow={flow} />}
            {flow.step === "code" && <CodeStep flow={flow} />}
            {flow.step === "profile" && <ProfileStep flow={flow} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <DevBypass />

      {flow.step === "identity" ? (
        <p className="text-center text-body-sm text-fg-muted">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link href={other} className="font-medium text-fg underline-offset-4 hover:underline">
            {mode === "signin" ? "Sign up" : "Sign in"}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
