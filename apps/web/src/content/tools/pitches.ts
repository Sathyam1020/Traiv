import type { PitchKey } from "./types";

/**
 * Where a tool's contextual CTA sends people, and what it may claim.
 *
 * Every entry is a feature page that exists in `content/features.ts` and is not marked
 * `building`. A tool's own pitch line is written in its copy file; this table only
 * decides the destination, so no tool can link to a feature we don't have.
 * Payments are deliberately absent: `.ai/state/current.md` and ADR 0035 say they do not
 * exist yet.
 */
export const PITCHES: Record<PitchKey, { href: string; label: string }> = {
  nutrition: { href: "/features/nutrition", label: "How diet plans work in Traiv" },
  workouts: { href: "/features/plan-builder", label: "How workout plans work in Traiv" },
  "check-ins": { href: "/features/check-ins", label: "How check-ins work in Traiv" },
  "client-app": { href: "/features/client-app", label: "See the client app" },
  messaging: { href: "/features/messaging", label: "How chat works in Traiv" },
};
