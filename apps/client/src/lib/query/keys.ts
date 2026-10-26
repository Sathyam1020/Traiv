/**
 * One place every cache key is defined.
 *
 * Keys written inline drift — two components ask for the same data under slightly
 * different keys, one invalidation misses the other, and the UI shows stale data with
 * no error. Anything cached goes here.
 */
export const queryKeys = {
  auth: {
    config: ["auth", "config"] as const,
    session: ["auth", "session"] as const,
  },
  join: {
    preview: (code: string) => ["join", "preview", code] as const,
  },
  client: {
    coaches: ["client", "coaches"] as const,
    me: (studioId: string) => ["client", "me", studioId] as const,
    intake: (studioId: string) => ["client", "intake", studioId] as const,
    today: (studioId: string) => ["client", "today", studioId] as const,
    checkIns: (studioId: string) => ["client", "check-ins", studioId] as const,
    checkIn: (studioId: string, id: string) => ["client", "check-in", studioId, id] as const,
    uploads: (studioId: string) => ["client", "uploads", studioId] as const,
    workouts: (studioId: string) => ["client", "workouts", studioId] as const,
    workout: (studioId: string, templateId: string) =>
      ["client", "workout", studioId, templateId] as const,
    workoutSession: (studioId: string, templateId: string, sessionId: string) =>
      ["client", "workout-session", studioId, templateId, sessionId] as const,
    exercise: (studioId: string, exerciseId: string) =>
      ["client", "exercise", studioId, exerciseId] as const,
  },
} as const;
