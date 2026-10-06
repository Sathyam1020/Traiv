"use client";

import { useCallback, useState } from "react";
import { isApiError } from "@/lib/api";
import { forget } from "@/lib/join-code";
import {
  useAttach,
  useAuthConfig,
  useDirectSignIn,
  useRequestCode,
  useVerifyCode,
} from "@/lib/query";

export type JoinStep = "identity" | "code" | "attaching";

/**
 * Signing up and attaching to a coach, as one flow on one route.
 *
 * It never navigates between steps. That is the point: the join code lives in the URL,
 * and staying put means the URL — not storage — remains the source of truth for the whole
 * signup. `join-code.ts` is the fallback for when the tab is discarded mid-OTP, not the
 * primary carrier.
 *
 * Attaching happens here rather than on the landing page, so the person goes from "enter
 * the code" to "you're in" without an intermediate screen that could fail silently.
 */
export function useJoinFlow(code: string) {
  const [step, setStep] = useState<JoinStep>("identity");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const request = useRequestCode();
  const verify = useVerifyCode();
  const direct = useDirectSignIn();
  const attach = useAttach();
  const { data: config } = useAuthConfig();

  const otpRequired = config?.otpRequired !== false;
  const busy = request.isPending || verify.isPending || direct.isPending || attach.isPending;

  /** Attaching, kept in one place so both ways in behave identically afterwards. */
  const attachNow = useCallback(async () => {
    setStep("attaching");
    try {
      const outcome = await attach.mutateAsync(code);
      forget();
      return outcome;
    } catch (e) {
      setError(
        isApiError(e)
          ? e.message
          : "You're signed in, but we couldn't add you to this coach. Try the link again.",
      );
      return undefined;
    }
  }, [attach, code]);

  /** Returns the outcome when the no-OTP path completed the whole thing here. */
  const sendCode = useCallback(async () => {
    setError(null);
    try {
      if (!otpRequired) {
        await direct.mutateAsync({ phone, name: name.trim() || undefined });
        return attachNow();
      }
      await request.mutateAsync({ phone, name: name.trim() || undefined });
      setStep("code");
      return undefined;
    } catch (e) {
      setError(isApiError(e) ? e.message : "Couldn't sign you in. Try again.");
      return undefined;
    }
  }, [request, direct, otpRequired, attachNow, phone, name]);

  const submitCode = useCallback(
    async (otp: string) => {
      setError(null);
      try {
        await verify.mutateAsync({ phone, code: otp });
      } catch (e) {
        setError(isApiError(e) ? e.message : "That code didn't work.");
        return;
      }

      // Signed in. Attaching is a separate call and a separate failure — a wrong code and
      // a full roster are different problems and must not share a message.
      const outcome = await attachNow();
      if (!outcome) setStep("code");
      return outcome;
    },
    [verify, attachNow, phone],
  );

  /** Already signed in when the link was opened — skip signup entirely. */
  const attachOnly = useCallback(async () => {
    setError(null);
    const outcome = await attachNow();
    if (!outcome) setStep("identity");
    return outcome;
  }, [attachNow]);

  const back = useCallback(() => {
    setError(null);
    setStep("identity");
  }, []);

  return {
    step,
    phone,
    setPhone,
    name,
    setName,
    error,
    busy,
    otpRequired,
    sendCode,
    submitCode,
    attachOnly,
    back,
  };
}
