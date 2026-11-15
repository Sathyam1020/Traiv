import { copy as phase2Copy1 } from "./copy/bench-press-calculator";
import { copy as bmiCopy } from "./copy/bmi-calculator";
import { copy as bmr } from "./copy/bmr-calculator";
import { copy as bodyFatCopy } from "./copy/body-fat-calculator";
import { copy as recompCopy } from "./copy/body-recomposition-calculator";
import { copy as bulking } from "./copy/bulking-calorie-calculator";
import { copy as calorieCycling } from "./copy/calorie-cycling-calculator";
import { copy as deficit } from "./copy/calorie-deficit-calculator";
import { copy as surplus } from "./copy/calorie-surplus-calculator";
import { copy as burned } from "./copy/calories-burned-calculator";
import { copy as caloriesPerMeal } from "./copy/calories-per-meal-calculator";
import { copy as carbCycling } from "./copy/carb-cycling-calculator";
import { copy as coachingRate } from "./copy/coaching-rate-calculator";
import { copy as creatine } from "./copy/creatine-dosage-calculator";
import { copy as cutLength } from "./copy/cut-length-calculator";
import { copy as cycle } from "./copy/cycle-phase-calculator";
import { copy as phase2Copy3 } from "./copy/deadlift-calculator";
import { copy as phase2Copy6 } from "./copy/dots-calculator";
import { copy as ffmiCopy } from "./copy/ffmi-calculator";
import { copy as fiber } from "./copy/fiber-intake-calculator";
import { copy as goalDate } from "./copy/goal-weight-date-calculator";
import { copy as idealCopy } from "./copy/ideal-weight-calculator";
import { copy as phase2Copy18 } from "./copy/injury-exercise-swap";
import { copy as fasting } from "./copy/intermittent-fasting-calculator";
import { copy as phase2Copy8 } from "./copy/ipf-gl-points-calculator";
import { copy as keto } from "./copy/keto-macro-calculator";
import { copy as lbmCopy } from "./copy/lean-body-mass-calculator";
import { copy as macro } from "./copy/macro-calculator";
import { copy as macroSplit } from "./copy/macro-split-by-body-type-calculator";
import { copy as maintenance } from "./copy/maintenance-calorie-calculator";
import { copy as muscleCopy } from "./copy/muscle-mass-calculator";
import { copy as navyCopy } from "./copy/navy-body-fat-calculator";
import { copy as phase2Copy0 } from "./copy/one-rep-max-calculator";
import { copy as phase2Copy4 } from "./copy/overhead-press-calculator";
import { copy as trainerIncome } from "./copy/personal-trainer-income-calculator";
import { copy as phase2Copy14 } from "./copy/plate-loading-calculator";
import { copy as protein } from "./copy/protein-calculator";
import { copy as proteinPerMeal } from "./copy/protein-per-meal-calculator";
import { copy as recipeMacro } from "./copy/recipe-macro-calculator";
import { copy as refeed } from "./copy/refeed-day-calculator";
import { copy as reverseDiet } from "./copy/reverse-diet-calculator";
import { copy as phase2Copy11 } from "./copy/rir-calculator";
import { copy as phase2Copy10 } from "./copy/rpe-calculator";
import { copy as phase2Copy9 } from "./copy/sinclair-calculator";
import { copy as phase2Copy2 } from "./copy/squat-calculator";
import { copy as steps } from "./copy/steps-to-calories-calculator";
import { copy as phase2Copy15 } from "./copy/strength-standards-calculator";
import { copy as sweat } from "./copy/sweat-rate-calculator";
import { copy as tdee } from "./copy/tdee-calculator";
import { copy as phase2Copy12 } from "./copy/tempo-calculator";
import { copy as whtrCopy } from "./copy/waist-to-height-ratio-calculator";
import { copy as whrCopy } from "./copy/waist-to-hip-ratio-calculator";
import { copy as phase2Copy13 } from "./copy/warm-up-set-calculator";
import { copy as water } from "./copy/water-intake-calculator";
import { copy as phase2Copy16 } from "./copy/weekly-training-volume-calculator";
import { copy as wlpCopy } from "./copy/weight-loss-percentage-calculator";
import { copy as phases } from "./copy/weight-loss-phase-calculator";
import { copy as phase2Copy5 } from "./copy/wilks-calculator";
import { copy as phase2Copy7 } from "./copy/wilks-dots-calculator";
import { copy as phase2Copy17 } from "./copy/workout-plan-builder";
import { TOOL_ENTRIES } from "./registry-data";
import type { LiveTool, ToolCopy, ToolEntry, ToolGroup } from "./types";

/**
 * The free-tool library (plan `features/free-tools/plan.md`).
 *
 * `TOOL_ENTRIES` holds all 109 researched tools. A tool is *live* once it has its copy
 * and widget registered below. Only live tools get a route, a sitemap entry, a hub card or
 * a link from another page, so nothing points at a tool that doesn't exist yet.
 */
export const COPY = {
  "one-rep-max-calculator": phase2Copy0,
  "bench-press-calculator": phase2Copy1,
  "squat-calculator": phase2Copy2,
  "deadlift-calculator": phase2Copy3,
  "overhead-press-calculator": phase2Copy4,
  "wilks-calculator": phase2Copy5,
  "dots-calculator": phase2Copy6,
  "wilks-dots-calculator": phase2Copy7,
  "ipf-gl-points-calculator": phase2Copy8,
  "sinclair-calculator": phase2Copy9,
  "rpe-calculator": phase2Copy10,
  "rir-calculator": phase2Copy11,
  "tempo-calculator": phase2Copy12,
  "warm-up-set-calculator": phase2Copy13,
  "plate-loading-calculator": phase2Copy14,
  "strength-standards-calculator": phase2Copy15,
  "weekly-training-volume-calculator": phase2Copy16,
  "workout-plan-builder": phase2Copy17,
  "injury-exercise-swap": phase2Copy18,
  "bmi-calculator": bmiCopy,
  "body-fat-calculator": bodyFatCopy,
  "navy-body-fat-calculator": navyCopy,
  "ffmi-calculator": ffmiCopy,
  "ideal-weight-calculator": idealCopy,
  "lean-body-mass-calculator": lbmCopy,
  "muscle-mass-calculator": muscleCopy,
  "waist-to-height-ratio-calculator": whtrCopy,
  "waist-to-hip-ratio-calculator": whrCopy,
  "weight-loss-percentage-calculator": wlpCopy,
  "body-recomposition-calculator": recompCopy,

  "tdee-calculator": tdee,
  "recipe-macro-calculator": recipeMacro,
  "bmr-calculator": bmr,
  "maintenance-calorie-calculator": maintenance,
  "macro-calculator": macro,
  "macro-split-by-body-type-calculator": macroSplit,
  "keto-macro-calculator": keto,
  "calorie-deficit-calculator": deficit,
  "calorie-surplus-calculator": surplus,
  "bulking-calorie-calculator": bulking,
  "goal-weight-date-calculator": goalDate,
  "weight-loss-phase-calculator": phases,
  "cut-length-calculator": cutLength,
  "steps-to-calories-calculator": steps,
  "calories-burned-calculator": burned,
  "sweat-rate-calculator": sweat,
  "intermittent-fasting-calculator": fasting,
  "cycle-phase-calculator": cycle,
  "personal-trainer-income-calculator": trainerIncome,
  "coaching-rate-calculator": coachingRate,
  "protein-calculator": protein,
  "protein-per-meal-calculator": proteinPerMeal,
  "calories-per-meal-calculator": caloriesPerMeal,
  "fiber-intake-calculator": fiber,
  "water-intake-calculator": water,
  "creatine-dosage-calculator": creatine,
  "carb-cycling-calculator": carbCycling,
  "calorie-cycling-calculator": calorieCycling,
  "refeed-day-calculator": refeed,
  "reverse-diet-calculator": reverseDiet,
} satisfies Record<string, ToolCopy>;

/** A tool with copy written. `app/tools/[slug]/widgets.ts` must map every one to a widget. */
export type LiveSlug = keyof typeof COPY;
const isLiveSlug = (s: string): s is LiveSlug => Object.hasOwn(COPY, s);

export const GROUP_LABEL: Record<ToolGroup, string> = {
  nutrition: "Calories & nutrition",
  strength: "Strength & programming",
  body: "Body composition",
  cardio: "Heart rate & cardio",
  business: "For your coaching business",
};

export const GROUP_ORDER: readonly ToolGroup[] = [
  "nutrition",
  "strength",
  "body",
  "cardio",
  "business",
];

export const ALL_TOOLS: readonly ToolEntry[] = TOOL_ENTRIES;

export const LIVE_TOOLS: readonly LiveTool[] = TOOL_ENTRIES.flatMap((e) =>
  isLiveSlug(e.slug) ? [{ ...e, slug: e.slug, copy: COPY[e.slug] }] : [],
);

const liveBySlug = new Map(LIVE_TOOLS.map((t) => [t.slug, t]));

export const liveTool = (slug: string) => liveBySlug.get(slug);

/** True for any non-tool link, and for tool links only once that tool is live. */
export function isLinkable(href: string): boolean {
  const m = /^\/tools\/([a-z0-9-]+)$/.exec(href);
  if (!m?.[1]) return true;
  return liveBySlug.has(m[1]) || LEGACY_TOOL_SLUGS.has(m[1]);
}

/**
 * The 6 related cards: the researched related tools first, then same-group tools, then
 * business tools, as the research pattern does (4 same group + 2 business). Live only.
 */
export function relatedFor(tool: ToolEntry, count = 6): LiveTool[] {
  const picked: LiveTool[] = [];
  const add = (t: LiveTool | undefined) => {
    if (t && t.slug !== tool.slug && !picked.includes(t) && picked.length < count) picked.push(t);
  };
  for (const s of tool.related) add(liveBySlug.get(s));
  for (const t of LIVE_TOOLS) if (t.group === tool.group) add(t);
  for (const t of LIVE_TOOLS) if (t.group === "business") add(t);
  for (const t of LIVE_TOOLS) add(t);
  return picked;
}

/**
 * Tools that existed before this library, at their original URLs. Each one is replaced by
 * a researched tool in a later phase. When that tool goes live, add the permanent redirect
 * to `next.config.ts` and delete the old route folder in the same change (plan §2).
 * `templates` has no counterpart and stays.
 */
export const LEGACY_TOOLS: readonly {
  slug: string;
  name: string;
  blurb: string;
  group: ToolGroup;
  replacedBy?: string;
}[] = [
  {
    slug: "calorie-calculator",
    name: "Calorie and macro calculator",
    blurb: "Calories and macros with the working shown",
    group: "nutrition",
    replacedBy: "macro-calculator",
  },
  {
    slug: "income-calculator",
    name: "Coaching income calculator",
    blurb: "What you would earn at your rate and client count",
    group: "business",
    replacedBy: "personal-trainer-income-calculator",
  },
  {
    slug: "pricing-calculator",
    name: "What to charge",
    blurb: "A monthly rate worked back from your income goal",
    group: "business",
    replacedBy: "coaching-rate-calculator",
  },
  {
    slug: "templates",
    name: "Templates for coaches",
    blurb: "Client messages, a weekly check-in and intake questions to copy",
    group: "business",
  },
];

/** Legacy pages still standing: not yet replaced by a live researched tool. */
export const STANDING_LEGACY = LEGACY_TOOLS.filter(
  (t) => !t.replacedBy || !liveBySlug.has(t.replacedBy),
);
const LEGACY_TOOL_SLUGS = new Set(STANDING_LEGACY.map((t) => t.slug));
