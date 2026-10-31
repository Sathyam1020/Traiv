import type { NavGroup } from "@traiv/ui/components/shell/app-shell";
import { MessageSquareText, User } from "@traiv/ui/icons";
import { FoodNavIcon, WorkoutsNavIcon, TodayNavIcon } from "./client-nav-icons";
import type { Today } from "@/lib/api";

/**
 * The client's tabs — Coachway's set, in Coachway's order.
 *
 * Today · Chat · Food · Workouts · You. There is deliberately no Progress tab: their
 * client app puts the weight and circumference charts on Today and the rest on the
 * profile, which is one fewer destination for somebody `personas.md` describes as having
 * "low tolerance for a new app, a new login, or anything they must learn".
 *
 * Chat is a placeholder so the five-tab layout can be previewed.
 * Other conditional tabs appear once their content exists. Trainerize hides Goals, Habits and
 * Nutrition until the coach has actually assigned one, and
 * `.ai/product/competitor-client-apps.md` calls that "the one idea worth stealing
 * outright" — it is the direct answer to a client who finishes onboarding and lands in
 * an app with five empty tabs. The server decides, because the server is what knows
 * whether a plan has been written; see `reveal` on `GET /c/:studioId/today`.
 *
 * This supersedes the note that used to sit here about growing to Today · Plan ·
 * Progress · Chat · You — see ADR 0023.
 *
 * `undefined` reveal is the pre-load state and yields Today · You: the two tabs that are
 * always there. Rendering the optimistic full set and then taking tabs away would move
 * the thing under somebody's thumb mid-tap, which on a phone is worse than a bar that
 * fills in.
 */
export function navFor(reveal: Today["reveal"] | undefined): readonly NavGroup[] {
  const items = [
    { href: "/dashboard", label: "Today", icon: TodayNavIcon },
    { href: "/chat", label: "Chat", icon: MessageSquareText },
    ...(reveal?.food ? [{ href: "/food", label: "Food", icon: FoodNavIcon }] : []),
    ...(reveal?.workouts ? [{ href: "/workouts", label: "Workouts", icon: WorkoutsNavIcon }] : []),
    { href: "/you", label: "Profile", icon: User },
  ];

  return [{ items }];
}
