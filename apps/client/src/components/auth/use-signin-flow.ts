"use client";

import { useCallback, useState } from "react";
import { isApiError } from "@/lib/api";
import { useRequestCode, useVerifyCode } from "@/lib/query";

export type SignInStep = "phone" | "code";

/**
 * Signing back in. Phone, code, done.
 *
 * Deliberately not the join flow: that one attaches you to a coach as well, and these are
 * different things. Joining needs a link; signing in never does, because the account
 * already exists and the relationship was made the first time round.
 *
 * Auth is passwordless, so the API treats sign-in and sign-up as one path — an unknown
 * number gets an account. That account simply has no coach, and the dashboard says so
 * rather than this screen refusing them.
 */
export function useSignInFlow() {
  const [step, setStep] = useState<SignInStep>("phone");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const request = useRequestCode();
  const verify = useVerifyCode();

  const busy = request.isPending || verify.isPending;

  const sendCode = useCallback(async () => {
    setError(null);
    try {
      await request.mutateAsync({ phone });
      setStep("code");
    } catch (e) {
      setError(isApiError(e) ? e.message : "Couldn't send the code. Try again.");
    }
  }, [request, phone]);

  const submitCode = useCallback(
    async (otp: string) => {
      setError(null);
      try {
        await verify.mutateAsync({ phone, code: otp });
        return true;
      } catch (e) {
        setError(isApiError(e) ? e.message : "That code didn't work.");
        return false;
      }
    },
    [verify, phone],
  );

  const back = useCallback(() => {
    setError(null);
    setStep("phone");
  }, []);

  return { step, phone, setPhone, error, busy, sendCode, submitCode, back };
}
