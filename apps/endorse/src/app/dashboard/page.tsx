"use client";

import { Button } from "@traiv/ui/components/button";
import { Logo } from "@traiv/ui/components/logo";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useEndorser, useJoinProgramme, useLogout, useReferrals, useSession } from "@/lib/query";

/**
 * An endorser's home: their code, and who it brought in.
 *
 * No earnings anywhere on this screen. Commission needs payments, which do not exist, and
 * showing a number we cannot pay yet would be a promise rather than a fact.
 */
export default function DashboardPage() {
  const router = useRouter();
  const session = useSession();
  const signedIn = Boolean(session.data?.user);

  const endorser = useEndorser(signedIn);
  const referrals = useReferrals(Boolean(endorser.data));
  const join = useJoinProgramme();
  const logout = useLogout();

  useEffect(() => {
    if (!session.isPending && !signedIn) router.replace("/");
  }, [session.isPending, signedIn, router]);

  if (session.isPending || !signedIn || endorser.isPending) return <Loading />;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[36rem] flex-col gap-6 px-5 py-10">
      <header className="flex items-center justify-between">
        <Logo size={28} />
        <Button
          variant="ghost"
          size="sm"
          disabled={logout.isPending}
          onClick={() => logout.mutate(undefined, { onSettled: () => router.replace("/") })}
        >
          Sign out
        </Button>
      </header>

      {endorser.data ? (
        <>
          <CodeCard code={endorser.data.code} referrals={endorser.data.referrals} />

          <section className="flex flex-col gap-3">
            <h2 className="text-caption font-semibold uppercase tracking-[0.08em] text-fg-subtle">
              Coaches you brought in
            </h2>

            {referrals.isPending ? (
              <Skeleton className="h-20 w-full rounded-surface" />
            ) : referrals.isError ? (
              <Panel>
                <p className="text-body-sm text-fg-muted">
                  Couldn't load your referrals. Check your connection and try again.
                </p>
                <Button variant="outline" size="sm" onClick={() => void referrals.refetch()}>
                  Try again
                </Button>
              </Panel>
            ) : referrals.data?.length ? (
              <ul className="flex flex-col gap-2">
                {referrals.data.map((r) => (
                  <li
                    key={`${r.studioName}-${r.joinedAt}`}
                    className="flex items-center justify-between gap-3 rounded-surface border border-line bg-surface px-4 py-3"
                  >
                    <span className="min-w-0 truncate text-body-sm font-medium">
                      {r.studioName}
                    </span>
                    <span className="shrink-0 text-caption tabular-nums text-fg-subtle">
                      {new Date(r.joinedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Panel>
                <p className="text-body-sm text-fg-muted">
                  Nobody yet. Share your code with a coach — it goes in the box on their signup
                  screen.
                </p>
              </Panel>
            )}
          </section>
        </>
      ) : (
        <Panel>
          <div className="flex flex-col gap-1">
            <h1 className="text-heading font-semibold tracking-[-0.02em]">Become an endorser</h1>
            <p className="text-body-sm text-fg-muted">
              You get a code. Any coach who signs up with it is counted as yours.
            </p>
          </div>
          <Button
            className="h-10 w-fit gap-2"
            disabled={join.isPending}
            onClick={() => join.mutate()}
          >
            {join.isPending ? "Setting up…" : "Get my code"}
          </Button>
          {join.isError ? (
            <p className="text-caption text-danger">That didn't work. Try again.</p>
          ) : null}
        </Panel>
      )}
    </main>
  );
}

function CodeCard({ code, referrals }: { code: string; referrals: number }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked in some contexts; the code is selectable either way.
    }
  }

  return (
    <section className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <span className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
          Your code
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-display font-semibold tracking-[0.12em]">{code}</span>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => void copy()}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <span className="text-display font-semibold tabular-nums">{referrals}</span>{" "}
        <span className="text-body-sm text-fg-muted">
          {referrals === 1 ? "coach signed up with it" : "coaches signed up with it"}
        </span>
      </div>
    </section>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col items-start gap-3 rounded-surface border border-line bg-surface p-5">
      {children}
    </section>
  );
}

function Loading() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[36rem] flex-col gap-6 px-5 py-10">
      <Skeleton className="size-7 rounded-control" />
      <Skeleton className="h-36 w-full rounded-surface" />
      <Skeleton className="h-20 w-full rounded-surface" />
    </main>
  );
}
