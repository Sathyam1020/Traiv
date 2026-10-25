"use client";

import { StepShell as Shell, type StepShellProps } from "@/components/common/step-shell";
import { LAST_STEP } from "./use-intake-flow";

/**
 * Onboarding's six questions, in the shared shell.
 *
 * A wrapper rather than six call sites each passing `total`, because the count is a
 * property of the flow and not of any one step — and because the generic shell is now
 * also what check-ins run through.
 *
 * There is no skip. Onboarding is the only thing standing between a coach and a plan
 * they can actually write, and a client who skipped every screen arrives as a name and
 * a phone number — which is exactly the state this feature exists to end. Fields that
 * genuinely don't change a plan (a goal weight, a list of dislikes) stay optional inside
 * their step, which is why `secondary` is never passed here.
 */
export function StepShell(props: Omit<StepShellProps, "total" | "secondary">) {
  return <Shell {...props} total={LAST_STEP} />;
}
