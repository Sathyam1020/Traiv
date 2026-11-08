"use client";

import { type CountryCode, DEFAULT_COUNTRY, parsePhone } from "@traiv/phone";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { isApiError, type TransportName } from "@/lib/api";
import {
  useAuthConfig,
  usePhoneLinkChallenge,
  usePhoneLinkDirect,
  usePhoneLinkVerify,
  useSession,
} from "@/lib/query";

export type LinkPhoneStep = "phone" | "code";

const RESEND_SECONDS = 30;

/**
 * The phone step a Google-first account lands on — narrower than `useAuthFlow` on
 * purpose. There is no name to collect (Google already gave one), no referral code (that
 * only applies to a brand-new account), and success attaches a phone to the session that
 * is already signed in, never creates one. Field names (`backToIdentity`, `code`,
 * `setCode`, …) match `useAuthFlow`'s shape so the same `CodeStep` presentation reads
 * the same way here as it does on /signup.
 *
 * The business-name step used to live here as a local dialog — moved to `AuthGuard` +
 * `/business-name` instead, driven by `studio.nameConfirmed` rather than a step this
 * flow remembered in local state, so it survives a refresh and covers the phone-first
 * signup path too, not just this one.
 */
export function useLinkPhoneFlow() {
  const router = useRouter();
  const session = useSession();

  const [step, setStep] = useState<LinkPhoneStep>("phone");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [transport, setTransport] = useState<TransportName>("sms");

  const { data: authConfig } = useAuthConfig();
  const otpRequired = authConfig?.otpRequired !== false;

  const challenge = usePhoneLinkChallenge();
  const direct = usePhoneLinkDirect();
  const verify = usePhoneLinkVerify();

  const parsedPhone = parsePhone(phone, countryCode);
  const phoneValid = parsedPhone.ok;
  const busy = challenge.isPending || direct.isPending || verify.isPending;

  // `AuthGuard` takes it from here the moment `needsPhone` clears — including on to
  // `/business-name` if that's still outstanding too.
  useEffect(() => {
    if (session.isError) router.replace("/signin");
    else if (session.data && !session.data.user.needsPhone) router.replace("/clients");
  }, [session.isError, session.data, router]);

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
    if (!parsedPhone.ok) {
      setError("Enter a valid mobile number.");
      return;
    }
    const e164 = parsedPhone.e164;
    try {
      if (!otpRequired) {
        await direct.mutateAsync({ phone: e164 });
        return;
      }
      const res = await challenge.mutateAsync({ phone: e164 });
      setTransport(res.transport);
      setSecondsLeft(RESEND_SECONDS);
      setStep("code");
    } catch (e) {
      fail(e);
    }
  }, [parsedPhone, otpRequired, direct, challenge, fail]);

  const submitCode = useCallback(async () => {
    setError(null);
    try {
      await verify.mutateAsync({ phone: parsedPhone.ok ? parsedPhone.e164 : phone, code });
    } catch (e) {
      fail(e);
    }
  }, [verify, parsedPhone, phone, code, fail]);

  const backToIdentity = useCallback(() => {
    setStep("phone");
    setCode("");
    setError(null);
  }, []);

  return {
    step,
    phone,
    setPhone,
    countryCode,
    setCountryCode,
    code,
    setCode: (v: string) => {
      setCode(v);
      setError(null);
    },
    error,
    busy,
    otpRequired,
    secondsLeft,
    transport,
    phoneValid,
    sendCode,
    submitCode,
    backToIdentity,
  };
}

export type LinkPhoneFlow = ReturnType<typeof useLinkPhoneFlow>;
