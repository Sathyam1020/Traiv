"use client";

import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { Logo } from "@traiv/ui/components/logo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isApiError } from "@/lib/api";
import { useRenameStudio, useSession } from "@/lib/query";

/**
 * The business-name step, reached only from `AuthGuard` redirecting a session whose
 * active studio still has `nameConfirmed: false` — both the phone-first and Google-first
 * signup paths end up here, never a general entry point. `createDefaultStudio` named the
 * studio after the person signing up because it had nothing else to call it, and that
 * placeholder must not reach a client's sidebar as if it were the business's real name.
 */
export function BusinessNameForm() {
  const router = useRouter();
  const session = useSession();
  const rename = useRenameStudio();

  const activeStudio = session.data?.studios.find((s) => s.id === session.data?.activeStudioId);

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // `AuthGuard` takes it from here once `nameConfirmed` is set — this only covers someone
  // navigating here directly while a different step is actually outstanding.
  useEffect(() => {
    if (session.isError) router.replace("/signin");
    else if (session.data?.user.needsPhone) router.replace("/link-phone");
    else if (activeStudio?.nameConfirmed) router.replace("/clients");
  }, [session.isError, session.data, activeStudio, router]);

  const submit = async () => {
    setError(null);
    if (!session.data) return;
    try {
      await rename.mutateAsync({ id: session.data.activeStudioId, name: name.trim() });
      router.push("/clients");
    } catch (e) {
      setError(isApiError(e) ? e.message : "Couldn't reach the server. Try again.");
    }
  };

  return (
    <div className="flex w-full max-w-[25rem] flex-col gap-5">
      <div className="flex flex-col items-center gap-3">
        <Logo size={44} />
        <span className="text-hero-sm font-medium">Traiv</span>
      </div>

      <div className="rounded-surface bg-surface p-6 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5">
          <header className="flex flex-col gap-1.5">
            <h1 className="text-heading font-medium">What&apos;s your business called?</h1>
            <p className="text-body-sm text-fg-muted">
              This is what your clients will see — you can change it later in Settings.
            </p>
          </header>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim() && !rename.isPending) void submit();
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="business-name">Business name</Label>
              <Input
                id="business-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="Traiv"
                autoFocus
              />
            </div>
            {error ? <p className="text-caption text-danger">{error}</p> : null}
            <Button
              type="submit"
              className="h-11 w-full"
              disabled={!name.trim() || rename.isPending}
            >
              {rename.isPending ? "Saving…" : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
