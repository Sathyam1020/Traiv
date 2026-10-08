"use client";

import { Skeleton } from "@traiv/ui/components/skeleton";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { IntakeFlow } from "@/components/intake/intake-flow";
import { useClientMe, useSession } from "@/lib/query";

/**
 * Picking the intake back up later.
 *
 * Separate from `/join/[code]`, which runs it inline the first time — that route cannot
 * navigate without losing the code in the URL, and this one has no code to lose. Both
 * render the same flow and read the same saved answers, so it does not matter which way
 * somebody arrives.
 */
export default function IntakePage() {
  const router = useRouter();
  const params = useParams<{ studioId: string }>();
  const studioId = typeof params.studioId === "string" ? params.studioId : null;

  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const me = useClientMe(signedIn ? studioId : null);

  useEffect(() => {
    if (!session.isPending && !signedIn) router.replace("/");
  }, [session.isPending, signedIn, router]);

  // A studio this person is not a client of answers 403, and there is nothing useful to
  // show them about it — the roster is not theirs to see.
  useEffect(() => {
    if (me.isError) router.replace("/dashboard");
  }, [me.isError, router]);

  if (session.isPending || !signedIn || !studioId || me.isPending || me.isError) {
    return <Loading />;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[32rem] flex-col justify-center px-5 py-10">
      <IntakeFlow
        studioId={studioId}
        coachName={me.data.studio.name}
        onDone={() => router.replace("/dashboard")}
      />
    </main>
  );
}

function Loading() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[32rem] flex-col gap-6 px-5 py-10">
      <Skeleton className="h-1 w-full rounded-control" />
      <Skeleton className="h-7 w-3/4" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }, (_, n) => n).map((n) => (
          <Skeleton key={n} className="h-14 w-full rounded-surface" />
        ))}
      </div>
    </main>
  );
}
