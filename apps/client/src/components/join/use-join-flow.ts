"use client";

import { useCallback, useState } from "react";
import { isApiError } from "@/lib/api";
import { forget } from "@/lib/join-code";
import { useAttach, useRequestCode, useVerifyCode } from "@/lib/query";

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
  const attach = useAttach();

  const busy = request.isPending || verify.isPending || attach.isPending;

  const sendCode = useCallback(async () => {
    setError(null);
    try {
      await request.mutateAsync({ phone, name: name.trim() || undefined });
      setStep("code");
    } catch (e) {
      setError(isApiError(e) ? e.message : "Couldn't send the code. Try again.");
    }
  }, [request, phone, name]);

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
      setStep("attaching");
      try {
        const outcome = await attach.mutateAsync(code);
        forget();
        return outcome;
      } catch (e) {
        setStep("code");
        setError(
          isApiError(e)
            ? e.message
            : "You're signed in, but we couldn't add you to this coach. Try the link again.",
        );
        return;
      }
    },
    [verify, attach, phone, code],
  );

  /** Already signed in when the link was opened — skip signup entirely. */
  const attachOnly = useCallback(async () => {
    setError(null);
    setStep("attaching");
    try {
      const outcome = await attach.mutateAsync(code);
      forget();
      return outcome;
    } catch (e) {
      setStep("identity");
      setError(isApiError(e) ? e.message : "Couldn't add you to this coach.");
      return;
    }
  }, [attach, code]);

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
    sendCode,
    submitCode,
    attachOnly,
    back,
  };
}
