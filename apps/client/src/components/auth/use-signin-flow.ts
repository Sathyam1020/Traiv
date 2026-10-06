"use client";

import { useCallback, useState } from "react";
import { isApiError } from "@/lib/api";
import { useAuthConfig, useDirectSignIn, useRequestCode, useVerifyCode } from "@/lib/query";

export type SignInStep = "phone" | "code";

/**
 * Signing back in. Phone, code, done — and never a name.
 *
 * A client's account is created by following their coach's link, which is where the name
 * is asked for. Asking a returning client to type it again to get in would be absurd.
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
  const direct = useDirectSignIn();
  const { data: config } = useAuthConfig();

  // The API decides, not the app. In development with OTP=NO there is no code to send,
  // so asking for one would show a screen nobody can complete.
  const otpRequired = config?.otpRequired !== false;
  const busy = request.isPending || verify.isPending || direct.isPending;

  /** Returns true when sign-in is already complete — the no-OTP path finishes here. */
  const sendCode = useCallback(async () => {
    setError(null);
    try {
      if (!otpRequired) {
        await direct.mutateAsync({ phone });
        return true;
      }
      await request.mutateAsync({ phone });
      setStep("code");
      return false;
    } catch (e) {
      setError(isApiError(e) ? e.message : "Couldn't sign you in. Try again.");
      return false;
    }
  }, [request, direct, otpRequired, phone]);

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

  return {
    step,
    phone,
    setPhone,
    error,
    busy,
    otpRequired,
    sendCode,
    submitCode,
    back,
  };
}
