"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignInCard } from "@/components/auth/signin-card";
import { useSession } from "@/lib/query";

/**
 * Sign in.
 *
 * Signing in and joining a coach are separate: a client who already has an account gets
 * back in from here, with nothing to dig out of WhatsApp. Only the coach's link can
 * create the relationship, which is why the card says so plainly rather than offering a
 * signup that would leave someone with an account and no coach.
 */
export default function SignInPage() {
  const router = useRouter();
  const session = useSession();
  const signedIn = Boolean(session.data?.user);

  useEffect(() => {
    if (signedIn) router.replace("/dashboard");
  }, [signedIn, router]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-10">
      <SignInCard onDone={() => router.replace("/dashboard")} />
    </main>
  );
}
