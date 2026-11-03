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
import {
  Apple,
  BookOpen,
  ChartArea,
  ClipboardList,
  CreditCard,
  Dumbbell,
  FileText,
  Home,
  type Icon,
  Inbox,
  LayoutGrid,
  MessageSquareText,
  Moon,
  Salad,
  Settings,
  Sparkles,
  Sun,
  User,
  Users,
  Utensils,
} from "@traiv/ui/icons";
import { cn } from "../../lib/utils";

/**
 * Every outline glyph this app has a library-drawn solid counterpart for.
 *
 * Not every icon has one — Tabler ships no filled `ChartBar`, for one — so a lookup
 * miss is expected and handled by each caller, not an error.
 */
function filledVariant(Outline: Icon) {
  switch (Outline) {
    case Inbox:
      return IconMessageFilled;
    case Users:
    case User:
      return IconUserFilled;
    case Dumbbell:
      return IconBarbellFilled;
    case LayoutGrid:
      return IconLayoutGridFilled;
    case ClipboardList:
      return IconClipboardListFilled;
    case BookOpen:
      return IconBookFilled;
    case Salad:
      return IconBowlSpoonFilled;
    case Apple:
      return IconAppleFilled;
    case CreditCard:
      return IconCreditCardFilled;
    case FileText:
      return IconFileTextFilled;
    case Sparkles:
      return IconSparklesFilled;
    case Settings:
      return IconSettingsFilled;
    case ChartArea:
      return IconChartAreaFilled;
    case Moon:
      return IconMoonFilled;
    case Sun:
      return IconSunFilled;
    case Home:
      return IconHomeFilled;
    case MessageSquareText:
      return IconMessageFilled;
    case Utensils:
      return IconToolsKitchen2Filled;
    default:
      return null;
  }
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
