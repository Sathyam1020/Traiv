import type { NavGroup } from "@traiv/ui/components/shell/app-shell";
import { MessageSquareText, User } from "@traiv/ui/icons";
import type { Today } from "@/lib/api";
import { FoodNavIcon, TodayNavIcon, WorkoutsNavIcon } from "./client-nav-icons";

/**
 * The client's tabs — Coachway's set, in Coachway's order.
 *
 * Today · Chat · Food · Workouts · You. There is deliberately no Progress tab: their
 * client app puts the weight and circumference charts on Today and the rest on the
 * profile, which is one fewer destination for somebody `personas.md` describes as having
 * "low tolerance for a new app, a new login, or anything they must learn".
 *
 * Chat is a placeholder so the five-tab layout can be previewed. Workouts is always
 * present too — confirmed directly against the real Coachway app (2026-11-08): it shows
 * the tab with a "No plans yet" empty state rather than hiding it, the same way `/food`
 * and `/you` are never hidden either. `/workouts/page.tsx` already has that empty state.
 * Food stays conditional on `reveal.food` — not re-verified against the reference app,
 * left as it was.
 *
 * `undefined` reveal is the pre-load state and yields Today · Workouts · You: the tabs
 * that do not depend on it. Rendering the optimistic full set and then taking Food away
 * would move the thing under somebody's thumb mid-tap, which on a phone is worse than a
 * bar that fills in.
 */
export function navFor(reveal: Today["reveal"] | undefined): readonly NavGroup[] {
  const items = [
    { href: "/dashboard", label: "Today", icon: TodayNavIcon },
    { href: "/chat", label: "Chat", icon: MessageSquareText },
    ...(reveal?.food ? [{ href: "/food", label: "Food", icon: FoodNavIcon }] : []),
    { href: "/workouts", label: "Workouts", icon: WorkoutsNavIcon },
    { href: "/you", label: "Profile", icon: User },
  ];

  return [{ items }];
}
