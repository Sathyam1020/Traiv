"use client";

import { useSession } from "./use-auth";
import { useCoaches } from "./use-join";

/**
 * Which coaching relationship the app is currently showing.
 *
 * Every client-scoped request needs a studio id in its path (ADR 0014), and resolving it
 * in each screen would be the same six lines copied five times — with the failure mode
 * that one of them picks a different coach than the nav did.
 *
 * A client with two coaches and one paused gets the running one. Blocked means *nothing*
 * is running, which is the only case the status gate should take the whole screen for:
 * with one active coach and one paused, the app works and the paused relationship
 * carries its own state on its own card.
 */
export function useActiveStudio() {
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const coaches = useCoaches(signedIn);

  const running = coaches.data?.find((c) => c.status === "active");
  // Any one of their coaches will do to ask through — the answers belong to the person,
  // and the studio in the path is what authorises the read, not what scopes it.
  const studio = running ?? coaches.data?.[0];

  return {
    studioId: studio?.studio.id ?? null,
    coaches: coaches.data ?? [],
    stalled: coaches.data?.length ? (running ? null : coaches.data[0]) : null,
    isPending: session.isPending || coaches.isPending,
    signedIn,
  };
}
