import {
  IconAppleFilled,
  IconBarbellFilled,
  IconBookFilled,
  IconBowlSpoonFilled,
  IconChartAreaFilled,
  IconClipboardListFilled,
  IconCreditCardFilled,
  IconFileTextFilled,
  IconHomeFilled,
  IconLayoutGridFilled,
  IconMessageFilled,
  IconMoonFilled,
  IconSettingsFilled,
  IconSparklesFilled,
  IconSunFilled,
  IconToolsKitchen2Filled,
  IconUserFilled,
} from "@tabler/icons-react";
import type { Icon } from "@traiv/ui/icons";
import { cn } from "../../lib/utils";

/**
 * Every outline glyph this app has a library-drawn solid counterpart for.
 *
 * Not every icon has one — Tabler ships no filled `ChartBar`, for one — so a lookup
 * miss is expected and handled by each caller, not an error.
 */
const filledIcons = {
  Inbox: IconMessageFilled,
  Users: IconUserFilled,
  User: IconUserFilled,
  Dumbbell: IconBarbellFilled,
  LayoutGrid: IconLayoutGridFilled,
  ClipboardList: IconClipboardListFilled,
  BookOpen: IconBookFilled,
  Salad: IconBowlSpoonFilled,
  Apple: IconAppleFilled,
  CreditCard: IconCreditCardFilled,
  FileText: IconFileTextFilled,
  Sparkles: IconSparklesFilled,
  Settings: IconSettingsFilled,
  ChartArea: IconChartAreaFilled,
  Moon: IconMoonFilled,
  Sun: IconSunFilled,
  Home: IconHomeFilled,
  MessageSquareText: IconMessageFilled,
  Utensils: IconToolsKitchen2Filled,
};

function filledVariant(Outline: Icon) {
  // Stable adapter names survive module refreshes and compiler-created function
  // wrappers; reference equality between imported components does not.
  const name = Outline.displayName;
  return name && name in filledIcons ? filledIcons[name as keyof typeof filledIcons] : null;
}

/** Library-drawn solids only in the desktop sidebar; mobile/content icons retain their style. */
export function SolidSidebarIcon({ icon: Outline, className }: { icon: Icon; className?: string }) {
  const Filled = filledVariant(Outline);
  const style = cn("sidebar-solid-icon", className);
  return Filled ? (
    <Filled aria-hidden="true" className={style} />
  ) : (
    <Outline aria-hidden="true" className={style} />
  );
}

/**
 * Outline at rest, the same icon's library-drawn solid once active — a client's
 * Overview/Development/Nutrition… tab row, not the sidebar (which is always solid, see
 * `SolidSidebarIcon` above). Falls back to the outline icon, active or not, if a future
 * caller passes one with no filled counterpart in the lookup above — rendering nothing
 * rather than a visually different glyph when the tab opens is the wrong trade. Where no
 * matched pair existed (Development's `BarChart`), the outline itself was swapped for
 * one that does, rather than mixing an unrelated glyph in for just the active state —
 * see `ChartArea`.
 */
export function ActiveStateIcon({
  icon: Outline,
  active,
  className,
}: {
  icon: Icon;
  active: boolean;
  className?: string;
}) {
  const Filled = active ? filledVariant(Outline) : null;
  const Glyph = Filled ?? Outline;
  return <Glyph aria-hidden="true" className={className} />;
}
