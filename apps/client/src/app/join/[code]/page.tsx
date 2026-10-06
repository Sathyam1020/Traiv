"use client";

import { Button } from "@traiv/ui/components/button";
import { Logo } from "@traiv/ui/components/logo";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { CircleCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { JoinCard } from "@/components/join/join-card";
import { isApiError } from "@/lib/api";
import { isJoinCode, normalise, remember } from "@/lib/join-code";
import { useJoinPreview, useSession } from "@/lib/query";

/**
 * The whole join flow lives on this one route, and never navigates away from it.
 *
 * That is deliberate: the code is in the URL, so as long as the page does not move, the
 * URL stays the source of truth through signup. `join-code.ts` mirrors it into session
 * storage for the one case this cannot cover — the tab being discarded while someone is
 * in another app reading their SMS.
 */
export default function JoinPage() {
  const params = useParams<{ code: string }>();
  const raw = typeof params.code === "string" ? params.code : "";
  const code = isJoinCode(raw) ? normalise(raw) : null;

  // Written before anything else can happen, so a discarded tab still knows the code.
  useEffect(() => {
    if (code) remember(code);
  }, [code]);

  const preview = useJoinPreview(code);
  const session = useSession();
  const [joined, setJoined] = useState<string | null>(null);

  if (joined) return <Done studioName={joined} />;

  if (!code) {
    return (
      <Shell
        title="That link doesn't look right"
        body="Check the link your coach sent, or ask them to send it again."
      />
    );
  }

  if (preview.isPending || session.isPending) return <Loading />;

  if (preview.isError) {
    const err = preview.error;
    // The API distinguishes a dead code from a coach who has closed their doors, and so
    // should the screen — one is worth re-asking the coach about, the other is not.
    const closed = isApiError(err) && err.code === "join_disabled";
    return (
      <Shell
        title={closed ? "Not accepting new clients" : "That link isn't valid any more"}
        body={
          closed
            ? "This coach has paused new signups. Check with them before trying again."
            : "The link may have been replaced. Ask your coach for a new one."
        }
      />
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-10">
      <JoinCard
        code={code}
        studioName={preview.data.name}
        signedIn={Boolean(session.data?.user)}
        onDone={setJoined}
      />
    </main>
  );
}

function Loading() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-10">
      <div className="flex w-full max-w-[25rem] flex-col items-center gap-5">
        <Skeleton className="size-10 rounded-surface" />
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-[19rem] w-full rounded-surface" />
      </div>
    </main>
  );
}

function Shell({ title, body }: { title: string; body: string }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <Logo size={40} />
      <div className="flex max-w-[32ch] flex-col gap-2">
        <h1 className="text-heading font-semibold tracking-[-0.02em]">{title}</h1>
        <p className="text-body-sm text-fg-muted">{body}</p>
      </div>
    </main>
  );
}

function Done({ studioName }: { studioName: string }) {
  const router = useRouter();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <CircleCheck className="size-11 text-success" />
      <div className="flex max-w-[32ch] flex-col gap-2">
        <h1 className="text-heading font-semibold tracking-[-0.02em]">You're in</h1>
        <p className="text-body-sm text-fg-muted">
          {studioName} is now your coach. They'll set up your plan — nothing else is needed from you
          right now.
        </p>
      </div>
      {/* `replace`, not `push`: the join link is spent, and leaving it in history sends
          anyone who taps back into a flow they have already completed. */}
      <Button onClick={() => router.replace("/dashboard")}>Continue</Button>
    </main>
  );
}
