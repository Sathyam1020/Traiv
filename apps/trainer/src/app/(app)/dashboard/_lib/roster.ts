/**
 * Sample data for the design preview. Realistic shapes and Indian names so the layout is
 * judged against content it will actually hold.
 *
 * `week` is the last 7 days, oldest → today. true = trained.
 */

export type AtRiskClient = {
  id: string;
  name: string;
  severity: "high" | "medium";
  days: number;
  lastTrained: string;
  reason: string;
  week: boolean[];
};

export type WaitingCheckin = {
  id: string;
  name: string;
  askedAt: string;
  excerpt: string;
};

export type RosterEntry = {
  id: string;
  name: string;
  plan: string;
  lastSession: string;
  week: boolean[];
  adherence: number;
};

export const atRisk: AtRiskClient[] = [
  {
    id: "c1",
    name: "Priya Sharma",
    severity: "high",
    days: 9,
    lastTrained: "2 September",
    reason: "Check-ins are half as long as usual. Was training four times a week.",
    week: [false, false, false, false, false, false, false],
  },
  {
    id: "c2",
    name: "Aditya Nair",
    severity: "high",
    days: 6,
    lastTrained: "5 September",
    reason: "Mentioned knee pain on 4 September, then went quiet.",
    week: [true, false, false, false, false, false, false],
  },
  {
    id: "c3",
    name: "Meera Iyer",
    severity: "medium",
    days: 2,
    lastTrained: "9 September",
    reason: "Volume down from 62 to 38 sets a week. Still checking in.",
    week: [true, false, true, false, false, true, false],
  },
];

export const waiting: WaitingCheckin[] = [
  {
    id: "w1",
    name: "Rahul Deshmukh",
    askedAt: "Yesterday, 9:12 pm",
    excerpt:
      "Weight is stuck at 78 for three weeks even though I'm hitting protein. Should I drop calories?",
  },
  {
    id: "w2",
    name: "Sneha Kulkarni",
    askedAt: "Tuesday, 7:40 am",
    excerpt: "Travelling to Pune next week, no gym. Can you send something for a hotel room?",
  },
];

export const roster: RosterEntry[] = [
  {
    id: "r1",
    name: "Arjun Mehta",
    plan: "Push/Pull · wk 6",
    lastSession: "Today",
    week: [true, true, false, true, true, false, true],
    adherence: 96,
  },
  {
    id: "r2",
    name: "Kavya Reddy",
    plan: "Fat loss · wk 11",
    lastSession: "Today",
    week: [true, false, true, true, true, false, true],
    adherence: 91,
  },
  {
    id: "r3",
    name: "Rohan Gupta",
    plan: "Strength · wk 3",
    lastSession: "Yesterday",
    week: [true, true, false, true, false, true, false],
    adherence: 88,
  },
  {
    id: "r4",
    name: "Ananya Bose",
    plan: "Post-natal · wk 8",
    lastSession: "Yesterday",
    week: [false, true, true, false, true, true, false],
    adherence: 84,
  },
  {
    id: "r5",
    name: "Vikram Singh",
    plan: "Hypertrophy · wk 14",
    lastSession: "2 days ago",
    week: [true, false, false, true, false, true, false],
    adherence: 79,
  },
  {
    id: "r6",
    name: "Divya Menon",
    plan: "PCOS protocol · wk 5",
    lastSession: "3 days ago",
    week: [false, true, false, false, true, false, false],
    adherence: 72,
  },
];

export const summary = { total: 24, trainedThisWeek: 18, needsYou: 3 };
