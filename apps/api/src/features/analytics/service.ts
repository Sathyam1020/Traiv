import { newId, schema } from "@traiv/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db.js";

/**
 * First-party product-usage events — authenticated identity, not the marketing site's
 * anonymous visitors (that's `analyticsEvents`, ADR 0021). See
 * `docs/analytics/event-taxonomy.md` for the full catalog and the reasoning behind every
 * field; this file is the enforcement point, same role this repo's boundary-validation
 * convention (Zod, at the edge) already plays everywhere else.
 *
 * Phase 1 instrumented the first five events, each called directly from the server-side
 * code path where the real action already happened — never from a route handler
 * re-deriving "did this succeed" after the fact. Phase 2 adds the rest of the catalog,
 * including the first three events a client actually sends over `POST /analytics/events`
 * (`session_started`, `meal_logged`, `measurement_logged`) via the offline-buffered SDK
 * at `apps/client/src/lib/analytics/outbox.ts` — every other new event is still
 * server-originated, tracked the same way as Phase 1's.
 *
 * `onboarding_abandoned` is deliberately absent from `EVENT_SHAPES`: per
 * `event-taxonomy.md`, it is "computed in the rollup job, not emitted live" — there is no
 * single trigger that fires it, so it has no `track()` call site. It stays an open
 * follow-up until the rollup job defines what "abandoned" means (an inactivity
 * threshold nothing in `.ai/` currently specifies).
 */

export const SOURCE_APPS = ["trainer", "client", "admin", "endorse", "web"] as const;
export type SourceApp = (typeof SOURCE_APPS)[number];

// "endorser" added in Phase 2: `becomeEndorser` is reachable by anyone signed in, coach
// or client, and `endorse/routes.ts`'s own comment is explicit that the role is neither
// — "a third thing a person can be" — so attributing it to "trainer" or "client" would
// misrepresent who actually acted.
export const ACTOR_ROLES = ["trainer", "client", "system", "endorser"] as const;
export type ActorRole = (typeof ACTOR_ROLES)[number];

/**
 * Required/optional properties per event, exactly as named in `event-taxonomy.md`. A
 * property shape change ships as a new `event_definition.schemaVersion`, not a silent
 * edit here — see that doc's "Schema evolution" note.
 */
const EVENT_SHAPES = {
  signup_completed: z.object({
    method: z.enum(["email", "google"]),
    endorser_code: z.string().max(64).optional(),
  }),
  client_joined: z.object({}),
  check_in_submitted: z.object({
    check_in_id: z.string().min(1),
    on_time: z.boolean(),
  }),
  workout_session_completed: z.object({
    template_id: z.string().min(1),
    total_seconds: z.number().int().min(0).nullable().optional(),
  }),
  onboarding_step_completed: z.object({
    step_index: z.number().int().min(1).max(15),
  }),

  // --- Phase 2 ---
  session_started: z.object({
    app_version: z.string().min(1).max(32),
    platform: z.string().max(32).optional(),
  }),
  business_name_confirmed: z.object({}),
  // "join_code" is the only value any real call site produces today — rotating a
  // studio's own code, the one server-observable proxy for "inviting someone" (see
  // `client_invited`'s own instrumentation comment in `client/join.ts`).
  client_invited: z.object({ invite_method: z.enum(["join_code"]) }),
  workout_template_created: z.object({ session_count: z.number().int().min(0) }),
  workout_assigned_to_client: z.object({}),
  workout_session_started: z.object({ template_id: z.string().min(1) }),
  check_in_schedule_set: z.object({}),
  // The real `recipe_source`/`meal_plan_source` DB enums, not the "coach/system-copy"
  // shorthand `event-taxonomy.md` used informally — `recipeSource` is 3-valued,
  // `mealPlanSource` only 2, so they get separate shapes rather than one shared one.
  recipe_created: z.object({ source: z.enum(["system", "coach", "client"]) }),
  mealplan_created: z.object({ source: z.enum(["coach", "client"]) }),
  roster_status_changed: z.object({
    from_status: z.enum(["active", "paused", "archived", "waiting", "frozen"]),
    to_status: z.enum(["active", "paused", "archived", "waiting", "frozen"]),
  }),
  referral_code_created: z.object({}),
  referral_attributed: z.object({ endorser_id: z.string().min(1) }),
  // Never the raw food/measurement value — only that a logging action of this category
  // happened. See `privacy-security.md`'s "Sensitive health data — hard exclusion". The
  // full real `FoodItem.kind` domain (`apps/client/src/lib/api/food.ts`), not just
  // event-taxonomy.md's illustrative "(recipe/food/manual)" shorthand — "plan" and
  // "personal" are real values the logger's own save button can send.
  meal_logged: z.object({ kind: z.enum(["food", "recipe", "manual", "plan", "personal"]) }),
  measurement_logged: z.object({ metric_code: z.string().min(1).max(32) }),
} as const;

export type EventName = keyof typeof EVENT_SHAPES;
export const EVENT_NAMES = Object.keys(EVENT_SHAPES) as EventName[];

/** Events whose `properties` are restricted to a category, never a raw value, but whose
 *  category is itself informative about a person's health/body — aggregate-only, never
 *  exported raw (`privacy-security.md`). Every other event defaults to `"operational"`. */
const SENSITIVE_EVENTS: ReadonlySet<EventName> = new Set(["meal_logged", "measurement_logged"]);

export type TrackInput<N extends EventName> = {
  name: N;
  properties: z.infer<(typeof EVENT_SHAPES)[N]>;
  userId?: string | null;
  studioId?: string | null;
  actorRole: ActorRole;
  sourceApp: SourceApp;
  /** Client-minted id, for the future SDK's at-least-once retries. Server-originated
   *  calls mint their own, since there is no client retry to de-duplicate against. */
  id?: string;
  /** Defaults to now — correct for every Phase 1 call site, which tracks its event in
   *  the same request that caused it. */
  occurredAt?: Date;
};

/**
 * Record one event. Never throws on a validation failure that isn't the caller's own
 * bug — a malformed `properties` object here is a programming error in this codebase,
 * not user input, so it's fine for this to throw during development and be caught by
 * tests rather than defended against at runtime.
 *
 * Deliberately not awaited by most call sites in a way that can fail the request it's
 * attached to — see each instrumentation site's own comment for why a tracking failure
 * must never roll back or block the real action.
 */
export async function track<N extends EventName>(input: TrackInput<N>) {
  const shape = EVENT_SHAPES[input.name];
  const properties = shape.parse(input.properties);

  await db
    .insert(schema.productEvents)
    .values({
      id: input.id ?? newId(),
      name: input.name,
      occurredAt: input.occurredAt ?? new Date(),
      userId: input.userId ?? null,
      studioId: input.studioId ?? null,
      actorRole: input.actorRole,
      sourceApp: input.sourceApp,
      properties,
      privacyClass: SENSITIVE_EVENTS.has(input.name) ? "sensitive" : "operational",
    })
    .onConflictDoNothing();
}

/**
 * Many trainer-side mutations only have `membershipId` in scope, not `userId` — adding
 * `requireSession` to every route just to thread a tracking id through would touch far
 * more files than the tracking itself does. One cheap, indexed lookup instead.
 */
export async function userIdForMembership(membershipId: string | null): Promise<string | null> {
  if (!membershipId) return null;
  const [row] = await db
    .select({ userId: schema.memberships.userId })
    .from(schema.memberships)
    .where(eq(schema.memberships.id, membershipId))
    .limit(1);
  return row?.userId ?? null;
}
