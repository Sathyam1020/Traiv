"use client";

import { Button } from "@traiv/ui/components/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isApiError } from "@/lib/api";
import { useSession } from "@/lib/query";

/**
 * Gate for signed-in pages.
 *
 * The API is the real authority — it rejects unauthenticated requests regardless of what
 * the browser does. This only stops a signed-out person seeing the shell of a page they
 * have no business being on.
 *
 * Only a real 401 means "not signed in." `useSession` doesn't retry, so a single dropped
 * request — the API restarting, a network blip, a slow cold start — used to read as
 * `isError` exactly like an expired session and bounce the coach to `/signin`, even
 * though their cookie was still good for weeks. A non-auth failure gets a retry instead.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, isPending, isError, error, refetch } = useSession();
  const unauthorized = isError && isApiError(error) && error.status === 401;

  useEffect(() => {
    if (unauthorized) router.replace("/signin");
    else if (data?.user.needsPhone) router.replace("/link-phone");
  }, [unauthorized, data, router]);

  if (isError && !unauthorized) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-canvas">
        <span className="text-body-sm text-fg-muted">Couldn&apos;t reach the server.</span>
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (isPending || unauthorized || data?.user.needsPhone) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <span className="text-body-sm text-fg-muted">Checking your session…</span>
      </div>
    );
  }

  return <>{children}</>;
}
