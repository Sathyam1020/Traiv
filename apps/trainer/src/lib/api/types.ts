export type User = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  needsPhone: boolean;
  needsProfile: boolean;
};

export type Studio = {
  id: string;
  slug: string;
  name: string;
  tier: "free" | "starter" | "pro" | "studio";
  role: "owner" | "coach";
};

export type Session = {
  user: User;
  studios: Studio[];
  activeStudioId: string;
};

export type TransportName = "whatsapp" | "sms" | "console";

export type AuthConfig = {
  google: boolean;
  otp: { primary: TransportName; fallback: TransportName | null; live: boolean };
  /** False in development with OTP=NO: a name and a number are enough. */
  otpRequired: boolean;
};

export type DevUser = { id: string; name: string; phone: string | null; email: string | null };

/* -------------------------------------------------------------------------- */
/* The roster                                                                  */
/* -------------------------------------------------------------------------- */

/** The three a coach's tabs show. `waiting` and `frozen` are not states a coach set. */
export type RosterStatus = "active" | "paused" | "archived";

export type RosterFilter = "all" | "unread" | "new-checkin" | "missing-checkin" | "ending-soon";

export type Tag = {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  uses?: number;
};

export type RosterClient = {
  id: string;
  name: string;
  status: RosterStatus;
  startedAt: string;
  endsAt: string | null;
  lastSessionAt: string | null;
  tags: Tag[];
};

export type Roster = {
  clients: RosterClient[];
  total: number;
  page: number;
  perPage: number;
  statuses: Record<RosterStatus, number>;
  filters: Record<RosterFilter, number>;
};

/**
 * One client, for their own screen.
 *
 * `hasAccount` is the field the header actually branches on. Everything below it that
 * describes a body rather than a relationship — age, sex, height, weight — is keyed on
 * the user, and a client the coach typed in has no user. Four nulls cannot tell the
 * screen apart from four unanswered questions; this can.
 */
export type ClientProfile = {
  id: string;
  name: string;
  status: RosterStatus;
  goal: string | null;
  constraints: string | null;
  startedAt: string;
  endsAt: string | null;
  activatedAt: string | null;
  hasAccount: boolean;
  coachName: string | null;
  tags: Tag[];
  intake: {
    sex: "male" | "female" | "undisclosed" | null;
    birthYear: number | null;
    heightCm: number | null;
    goal: string | null;
    targetWeightKg: number | null;
    completedAt: string | null;
  } | null;
  weightKg: number | null;
  weightTakenAt: string | null;
  lastSessionAt: string | null;
  lastSeenAt: string | null;
};

/** The client's overview screen, served as one aggregate. */
export type ClientOverview = {
  id: string;
  hasAccount: boolean;
  startedAt: string;
  endsAt: string | null;
  activatedAt: string | null;
  coachingGoal: string | null;
  constraints: string | null;
  weight: {
    currentKg: number;
    takenAt: string;
    /** Against the previous weigh-in. 0 when there is only one. */
    changeKg: number;
    comparedTo: string | null;
    weighIns: number;
    targetKg: number | null;
  } | null;
  energy: EnergyCard;
  nutrition: {
    diet: string | null;
    allergies: string | null;
    dislikes: string | null;
    healthFlags: string[];
    intakeCompletedAt: string | null;
  } | null;
  activity: { kind: "activated" | "created"; at: string; title: string }[];
  training: {
    windowDays: number;
    sessions: number;
    lastSessionAt: string | null;
    days: string[];
  };
};

export type EnergyBasis = {
  formula: string;
  bmr: number;
  tdee: number;
  activityFactor: number;
  goalAdjustmentPct: number;
  unboundedKcal: number;
  boundBy: string;
  proteinGPerKg: number;
  bmi: number;
};

export type EnergyCard =
  | {
      /** `prescribed` is what the client was actually given; `computed` is today's suggestion. */
      source: "prescribed" | "computed";
      kcal: number;
      proteinG: number;
      carbsG: number;
      fatG: number;
      basis: EnergyBasis | null;
      review: string[];
      effectiveFrom: string | null;
      missing: string[];
    }
  | { source: "none"; missing: string[] };

export type CheckInState = "completed" | "missed" | "overdue" | "upcoming";

export type CheckInCell = {
  id: string;
  /** `YYYY-MM-DD`. A check-in is due on a day, not at an instant. */
  date: string;
  closesOn: string;
  state: CheckInState;
  completedAt: string | null;
};

export type CheckInTrend = {
  cells: number;
  checkIns: CheckInCell[];
  /** Null before anything has settled — different from nought, and shown differently. */
  completionRate: number | null;
  currentStreak: number;
  completed: number;
  missed: number;
};

export type RosterParams = {
  status: RosterStatus;
  filter: RosterFilter;
  search?: string;
  sort: "duration" | "name" | "recent";
  page: number;
  perPage: number;
};
