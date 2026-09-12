"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/query";

/**
 * Gate for signed-in pages.
 *
 * The API is the real authority — it rejects unauthenticated requests regardless of what
 * the browser does. This only stops a signed-out person seeing the shell of a page they
 * have no business being on.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, isPending, isError } = useSession();

  useEffect(() => {
    if (isError) router.replace("/signin");
    else if (data?.user.needsPhone) router.replace("/signup");
  }, [isError, data, router]);

  if (isPending || isError || data?.user.needsPhone) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <span className="text-body-sm text-fg-muted">Checking your session…</span>
      </div>
    );
  }

  return <>{children}</>;
}
