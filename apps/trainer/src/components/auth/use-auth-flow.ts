"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { isApiError, type TransportName } from "@/lib/api";
import {
  useAuthConfig,
  useDirectSignIn,
  useRequestCode,
  useUpdateProfile,
  useVerifyCode,
} from "@/lib/query";

export type AuthMode = "signin" | "signup";
export type AuthStep = "identity" | "code" | "profile";

const OAUTH_ERRORS: Record<string, string> = {
  google_cancelled: "Google sign-in was cancelled.",
  google_state: "That sign-in link expired. Try again.",
  google_email_conflict: "That email is already associated with another account.",
  google_off: "Google sign-in isn't available right now.",
  google_token: "Google sign-in failed. Try again.",
  google_profile: "Couldn't read your Google profile. Try again.",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RESEND_SECONDS = 30;

/**
 * The whole sign-in / sign-up state machine, kept out of the views.
 *
 * Steps are driven by what the server reports about the account, never by a local guess —
 * `needsProfile` decides whether we ask for an email, so the rare Google signup that
 * arrives with no address (consent partially denied) resumes in the right place. An
 * email+OTP signup always has one by construction and never sees this step.
 */
export function useAuthFlow(mode: AuthMode) {
  const router = useRouter();
  const params = useSearchParams();

  const [step, setStep] = useState<AuthStep>("identity");
  const [identityEmail, setIdentityEmail] = useState("");
  const [name, setName] = useState("");
  // Optional, and signup only. Someone who was not referred leaves it blank.
  const [endorserCode, setEndorserCode] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [transport, setTransport] = useState<TransportName>("email");

  const requestCode = useRequestCode();
  const verifyCode = useVerifyCode();
  const directSignIn = useDirectSignIn();
  const { data: authConfig } = useAuthConfig();

  // The API decides. With OTP=NO there is no code to send, so showing the code screen
  // would be a dead end.
  const otpRequired = authConfig?.otpRequired !== false;
  const updateProfile = useUpdateProfile();

  const emailValid = EMAIL.test(identityEmail.trim());
  const canSubmitIdentity = mode === "signin" ? emailValid : emailValid && name.trim().length >= 2;
  const busy =
    requestCode.isPending ||
    verifyCode.isPending ||
    directSignIn.isPending ||
    updateProfile.isPending;

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
    const trimmedEmail = identityEmail.trim();
    if (!EMAIL.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    // Signup only — there is nothing to attribute for an account that already exists.
    // Read from this page's own query string, the same way `apps/web`'s click-through
    // handoff appends them (`attribution-design.md`) — never a cookie.
    const utm =
      mode === "signup"
        ? {
            ...(params.get("utm_source") ? { utmSource: params.get("utm_source") as string } : {}),
            ...(params.get("utm_medium") ? { utmMedium: params.get("utm_medium") as string } : {}),
            ...(params.get("utm_campaign")
              ? { utmCampaign: params.get("utm_campaign") as string }
              : {}),
          }
        : {};
    try {
      if (!otpRequired) {
        const { user } = await directSignIn.mutateAsync({
          email: trimmedEmail,
          ...(mode === "signup" && name.trim() ? { name: name.trim() } : {}),
          ...(mode === "signup" && endorserCode.trim()
            ? { endorserCode: endorserCode.trim() }
            : {}),
          ...utm,
        });
        // Same landing as the verified path, including the profile step.
        if (user.needsProfile) setStep("profile");
        else router.push("/clients");
        return;
      }

      const res = await requestCode.mutateAsync({
        email: trimmedEmail,
        ...(mode === "signup" && name.trim() ? { name: name.trim() } : {}),
        ...(mode === "signup" && endorserCode.trim() ? { endorserCode: endorserCode.trim() } : {}),
        ...utm,
      });
      // The server decides — it may have fallen back to another channel.
      setTransport(res.transport);
      setSecondsLeft(RESEND_SECONDS);
      setStep("code");
    } catch (e) {
      fail(e);
    }
  }, [
    requestCode,
    directSignIn,
    otpRequired,
    identityEmail,
    name,
    endorserCode,
    mode,
    router,
    fail,
    params,
  ]);

  const submitCode = useCallback(async () => {
    setError(null);
    try {
      const { user } = await verifyCode.mutateAsync({
        email: identityEmail.trim(),
        code,
      });
      if (user.needsProfile) setStep("profile");
      else router.push("/clients");
    } catch (e) {
      fail(e);
    }
  }, [verifyCode, identityEmail, code, router, fail]);

  const submitProfile = useCallback(async () => {
    setError(null);
    try {
      await updateProfile.mutateAsync({
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(name.trim() ? { name: name.trim() } : {}),
      });
      router.push("/clients");
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
    identityEmail,
    name,
    email,
    code,
    error,
    busy,
    otpRequired,
    endorserCode,
    setEndorserCode,
    secondsLeft,
    transport,
    emailValid,
    canSubmitIdentity,
    setIdentityEmail,
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
    skipProfile: () => router.push("/clients"),
  };
}

export type AuthFlow = ReturnType<typeof useAuthFlow>;
