"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { isApiError, type TransportName } from "@/lib/api";
import { useRequestCode, useUpdateProfile, useVerifyCode } from "@/lib/query";

export type AuthMode = "signin" | "signup";
export type AuthStep = "identity" | "code" | "profile";

const OAUTH_ERRORS: Record<string, string> = {
  google_cancelled: "Google sign-in was cancelled.",
  google_state: "That sign-in link expired. Try again.",
  google_link_phone: "An account already uses that email. Sign in with your phone number instead.",
  google_off: "Google sign-in isn't available right now.",
};

const RESEND_SECONDS = 30;

/**
 * The whole sign-in / sign-up state machine, kept out of the views.
 *
 * Steps are driven by what the server reports about the account, never by a local guess —
 * `needsProfile` decides whether we ask for an email, so someone who abandoned signup
 * days ago resumes in the right place.
 */
export function useAuthFlow(mode: AuthMode) {
  const router = useRouter();
  const params = useSearchParams();

  const [step, setStep] = useState<AuthStep>("identity");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [transport, setTransport] = useState<TransportName>("sms");

  const requestCode = useRequestCode();
  const verifyCode = useVerifyCode();
  const updateProfile = useUpdateProfile();

  const phoneValid = /^[6-9]\d{9}$/.test(phone);
  const canSubmitIdentity = mode === "signin" ? phoneValid : phoneValid && name.trim().length >= 2;
  const busy = requestCode.isPending || verifyCode.isPending || updateProfile.isPending;

  // Errors arrive back from the OAuth callback as a query param.
  useEffect(() => {
    const e = params.get("error");
    if (e) setError(OAUTH_ERRORS[e] ?? "Sign-in failed. Try again.");
  }, [params]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const fail = useCallback((e: unknown) => {
    setError(isApiError(e) ? e.message : "Couldn't reach the server. Try again.");
  }, []);

  const sendCode = useCallback(async () => {
    setError(null);
    try {
      const res = await requestCode.mutateAsync({
        phone,
        ...(mode === "signup" && name.trim() ? { name: name.trim() } : {}),
      });
      // The server decides — it may have fallen back to another channel.
      setTransport(res.transport);
      setSecondsLeft(RESEND_SECONDS);
      setStep("code");
    } catch (e) {
      fail(e);
    }
  }, [requestCode, phone, name, mode, fail]);

  const submitCode = useCallback(async () => {
    setError(null);
    try {
      const { user } = await verifyCode.mutateAsync({ phone, code });
      if (user.needsProfile) setStep("profile");
      else router.push("/today");
    } catch (e) {
      fail(e);
    }
  }, [verifyCode, phone, code, router, fail]);

  const submitProfile = useCallback(async () => {
    setError(null);
    try {
      await updateProfile.mutateAsync({
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(name.trim() ? { name: name.trim() } : {}),
      });
      router.push("/today");
    } catch (e) {
      fail(e);
    }
  }, [updateProfile, email, name, router, fail]);

  const backToIdentity = useCallback(() => {
    setStep("identity");
    setCode("");
    setError(null);
  }, []);

  return {
    step,
    phone,
    name,
    email,
    code,
    error,
    busy,
    secondsLeft,
    transport,
    phoneValid,
    canSubmitIdentity,
    setPhone,
    setName,
    setEmail,
    setCode: (v: string) => {
      setCode(v);
      setError(null);
    },
    sendCode,
    submitCode,
    submitProfile,
    backToIdentity,
    skipProfile: () => router.push("/today"),
  };
}

export type AuthFlow = ReturnType<typeof useAuthFlow>;
