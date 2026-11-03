/**
 * Client navigation uses the same Tabler family as the rest of the product.
 *
 * Workouts uses `Dumbbell`, not the heart-rate glyph the tab used before — Tabler
 * ships no filled `IconHeartRateMonitor`, and the active-tab treatment needs every
 * bottom-bar icon to have a real solid counterpart, same as `Dumbbell` already gets
 * elsewhere (see `solid-sidebar-icon.tsx`).
 */
export {
  Dumbbell as WorkoutsNavIcon,
  Home as TodayNavIcon,
  Utensils as FoodNavIcon,
} from "@traiv/ui/icons";
