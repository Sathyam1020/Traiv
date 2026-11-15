import type { ComponentType } from "react";
import type { LiveSlug } from "@/content/tools/registry";
import {
  CaloriesBurnedWidget,
  StepsWidget,
  SweatRateWidget,
} from "../_components/widgets/activity";
import { IncomeWidget, RateWidget } from "../_components/widgets/business";
import { BmrWidget, MaintenanceWidget } from "../_components/widgets/energy";
import { BulkingWidget, DeficitWidget, SurplusWidget } from "../_components/widgets/goals";
import {
  CalorieCyclingWidget,
  CaloriesPerMealWidget,
  CarbCyclingWidget,
  CreatineWidget,
  FiberWidget,
  ProteinPerMealWidget,
  ProteinWidget,
  RefeedWidget,
  ReverseDietWidget,
  WaterWidget,
} from "../_components/widgets/intake";
import { KetoWidget, MacroSplitWidget, MacroWidget } from "../_components/widgets/macros";
import { InjurySwapWidget, PlanBuilderWidget } from "../_components/widgets/programs";
import { RecipeMacroWidget } from "../_components/widgets/recipe-macro";
import { CyclePhaseWidget, FastingWidget } from "../_components/widgets/schedule";
import {
  BenchWidget,
  DeadliftWidget,
  DotsWidget,
  IpfGlWidget,
  OhpWidget,
  OneRepMaxWidget,
  PlateLoadingWidget,
  RirWidget,
  RpeWidget,
  SinclairWidget,
  SquatWidget,
  StandardsWidget,
  TempoWidget,
  VolumeWidget,
  WarmupWidget,
  WilksDotsWidget,
  WilksWidget,
} from "../_components/widgets/strength";
import { TdeeWidget } from "../_components/widgets/tdee";
import { CutLengthWidget, GoalDateWidget, PhasesWidget } from "../_components/widgets/timeline";

/** Every tool with copy has a widget, or this file stops compiling. */
export const WIDGETS: Record<LiveSlug, ComponentType> = {
  "one-rep-max-calculator": OneRepMaxWidget,
  "bench-press-calculator": BenchWidget,
  "squat-calculator": SquatWidget,
  "deadlift-calculator": DeadliftWidget,
  "overhead-press-calculator": OhpWidget,
  "wilks-calculator": WilksWidget,
  "dots-calculator": DotsWidget,
  "wilks-dots-calculator": WilksDotsWidget,
  "ipf-gl-points-calculator": IpfGlWidget,
  "sinclair-calculator": SinclairWidget,
  "rpe-calculator": RpeWidget,
  "rir-calculator": RirWidget,
  "tempo-calculator": TempoWidget,
  "warm-up-set-calculator": WarmupWidget,
  "plate-loading-calculator": PlateLoadingWidget,
  "strength-standards-calculator": StandardsWidget,
  "weekly-training-volume-calculator": VolumeWidget,
  "workout-plan-builder": PlanBuilderWidget,
  "injury-exercise-swap": InjurySwapWidget,

  "tdee-calculator": TdeeWidget,
  "recipe-macro-calculator": RecipeMacroWidget,
  "bmr-calculator": BmrWidget,
  "maintenance-calorie-calculator": MaintenanceWidget,
  "macro-calculator": MacroWidget,
  "macro-split-by-body-type-calculator": MacroSplitWidget,
  "keto-macro-calculator": KetoWidget,
  "calorie-deficit-calculator": DeficitWidget,
  "calorie-surplus-calculator": SurplusWidget,
  "bulking-calorie-calculator": BulkingWidget,
  "goal-weight-date-calculator": GoalDateWidget,
  "weight-loss-phase-calculator": PhasesWidget,
  "cut-length-calculator": CutLengthWidget,
  "steps-to-calories-calculator": StepsWidget,
  "calories-burned-calculator": CaloriesBurnedWidget,
  "sweat-rate-calculator": SweatRateWidget,
  "intermittent-fasting-calculator": FastingWidget,
  "cycle-phase-calculator": CyclePhaseWidget,
  "personal-trainer-income-calculator": IncomeWidget,
  "coaching-rate-calculator": RateWidget,
  "protein-calculator": ProteinWidget,
  "protein-per-meal-calculator": ProteinPerMealWidget,
  "calories-per-meal-calculator": CaloriesPerMealWidget,
  "fiber-intake-calculator": FiberWidget,
  "water-intake-calculator": WaterWidget,
  "creatine-dosage-calculator": CreatineWidget,
  "carb-cycling-calculator": CarbCyclingWidget,
  "calorie-cycling-calculator": CalorieCyclingWidget,
  "refeed-day-calculator": RefeedWidget,
  "reverse-diet-calculator": ReverseDietWidget,
};
