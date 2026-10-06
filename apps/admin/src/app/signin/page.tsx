"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignInCard } from "@/components/auth/signin-card";
import { useSession } from "@/lib/query";

export default function Page() {
  const router = useRouter();
  const session = useSession();
  const signedIn = Boolean(session.data?.user);

  useEffect(() => {
    if (signedIn) router.replace("/dashboard");
  }, [signedIn, router]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-10">
      <SignInCard mode="signin" onDone={() => router.replace("/dashboard")} />
    </main>
  );
}
