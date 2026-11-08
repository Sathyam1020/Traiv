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
  useRenameStudio,
  useSession,
} from "@/lib/query";

export type LinkPhoneStep = "phone" | "code" | "business";

const RESEND_SECONDS = 30;

/**
 * The phone step a Google-first account lands on — narrower than `useAuthFlow` on
 * purpose. There is no name to collect (Google already gave one), no referral code (that
 * only applies to a brand-new account), and success attaches a phone to the session that
 * is already signed in, never creates one. Field names (`backToIdentity`, `code`,
 * `setCode`, …) match `useAuthFlow`'s shape so the same `CodeStep` presentation reads
 * the same way here as it does on /signup.
 *
 * One step further than the phone itself: `createDefaultStudio` names a brand-new
 * studio after the person, not a business, because it has nothing else to call it —
 * fine for phone signup where the person typed nothing yet either, but Google already
 * gave a real name, and "Priya Kulkarni" sitting where a business name belongs is wrong
 * the moment it renders. The business-name step is what replaces it before the sidebar
 * ever shows it.
 */
export function useLinkPhoneFlow() {
  const router = useRouter();
  const session = useSession();

  const [step, setStep] = useState<LinkPhoneStep>("phone");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [code, setCode] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [transport, setTransport] = useState<TransportName>("sms");

  const { data: authConfig } = useAuthConfig();
  const otpRequired = authConfig?.otpRequired !== false;

  const challenge = usePhoneLinkChallenge();
  const direct = usePhoneLinkDirect();
  const verify = usePhoneLinkVerify();
  const rename = useRenameStudio();

  const parsedPhone = parsePhone(phone, countryCode);
  const phoneValid = parsedPhone.ok;
  const busy = challenge.isPending || direct.isPending || verify.isPending || rename.isPending;

  // Nobody signed in, or nobody who still needs this, has any business on this screen —
  // except mid-flow: the phone mutations invalidate the session the instant they
  // succeed, which would otherwise fire this and bounce to /clients before the business
  // name step ever has a chance to show.
  useEffect(() => {
    if (step === "business") return;
    if (session.isError) router.replace("/signin");
    else if (session.data && !session.data.user.needsPhone) router.replace("/clients");
  }, [session.isError, session.data, router, step]);

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
        setStep("business");
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
      setStep("business");
    } catch (e) {
      fail(e);
    }
  }, [verify, parsedPhone, phone, code, fail]);

  const submitBusinessName = useCallback(async () => {
    setError(null);
    const name = businessName.trim();
    if (!name) {
      setError("Enter your business name.");
      return;
    }
    const studioId = session.data?.activeStudioId;
    if (!studioId) {
      setError("Couldn't find your studio. Try again.");
      return;
    }
    try {
      await rename.mutateAsync({ id: studioId, name });
      router.push("/clients");
    } catch (e) {
      fail(e);
    }
  }, [businessName, session.data?.activeStudioId, rename, router, fail]);

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
    businessName,
    setBusinessName: (v: string) => {
      setBusinessName(v);
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
    submitBusinessName,
    backToIdentity,
  };
}

export type LinkPhoneFlow = ReturnType<typeof useLinkPhoneFlow>;
