import {
  Apple,
  BarChart3,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  Dumbbell,
  Inbox,
  LayoutGrid,
  type LucideIcon,
  MessageCircle,
  Palette,
  Smartphone,
  Users,
} from "lucide-react";

export type Feature = {
  slug: string;
  name: string;
  /** One line, for the dropdown. */
  blurb: string;
  icon: LucideIcon;
  /** The page's own headline and body. */
  headline: string;
  body: string;
  points: { title: string; body: string }[];
  /** Shown as the "not yet" note where it is honest to show one. */
  status?: "building";
};

/**
 * One list, three jobs: the nav dropdown, the features index, and a page each.
 *
 * Adding a feature is an entry here. Nothing else needs touching, which is the only way a
 * twelve-page section stays consistent once somebody is editing it on a Tuesday.
 */
export const FEATURES: readonly Feature[] = [
  {
    slug: "today",
    name: "Today",
    blurb: "The people who need you, first",
    icon: LayoutGrid,
    headline: "Open on the people who need you, not a wall of numbers",
    body: "Most software opens on a grid of statistics and leaves you to work out what to do. Today opens on three names and why they are there — who has not trained in nine days, whose check-in is waiting, who starts tomorrow.",
    points: [
      {
        title: "Sorted by who is slipping",
        body: "Not alphabetical, not by join date. The client about to quit is at the top because that is the one worth your next ten minutes.",
      },
      {
        title: "A week of training in one strip",
        body: "Seven dots per client. You can see a pattern breaking without opening anything.",
      },
      {
        title: "Nothing to configure",
        body: "No widgets to arrange, no date range to pick. It is the same screen every morning.",
      },
    ],
  },
  {
    slug: "plan-builder",
    name: "Plan builder",
    blurb: "Eight weeks, built once",
    icon: Dumbbell,
    headline: "Eight weeks of training, built once, edited whenever",
    body: "Progression is written into the block at the start — three weeks of building and a deload — so you are not rewriting a programme every Sunday night. Change any day, any set, any week.",
    points: [
      {
        title: "A real block, not a week on repeat",
        body: "Two four-week mesocycles with the deload where it belongs. The structure a coach would write by hand.",
      },
      {
        title: "Only movements they can do",
        body: "Bodyweight at home, dumbbells in a garage, a full gym. The plan is built from what they actually have.",
      },
      {
        title: "Their last numbers on the set row",
        body: "What they lifted last time sits next to what they are about to lift. It is the detail that makes logging worth doing.",
      },
    ],
  },
  {
    slug: "nutrition",
    name: "Nutrition",
    blurb: "Food they will actually eat",
    icon: Apple,
    headline: "Katoris and rotis, not grams of chicken breast",
    body: "Calories worked out from their body — age, height, weight, how they move — then meals built around dal, roti, curd and poha. In the units people here actually use.",
    points: [
      {
        title: "The number is calculated, never guessed",
        body: "Mifflin-St Jeor, the same equation a dietitian uses, with floors that stop anyone being told to eat too little. Every target shows its own working.",
      },
      {
        title: "Vegetarian, Jain, egg, vegan",
        body: "No onion and no garlic when that matters. A plan that ignores it is a plan that gets quietly abandoned.",
      },
      {
        title: "Home measures",
        body: "One katori, two roti, one glass. Nobody owns a kitchen scale and nobody is going to buy one.",
      },
    ],
  },
  {
    slug: "check-ins",
    name: "Check-ins",
    blurb: "A week read in one glance",
    icon: ClipboardList,
    headline: "Their whole week, in one screen, every week",
    body: "Weight, photos, how training went and how they felt — on a schedule you set. The numbers chart themselves, so a month of progress is one look rather than a scroll through chat.",
    points: [
      {
        title: "The numbers go into the trend",
        body: "A weight typed into a check-in lands on the graph. It does not sit in a message you have to find again.",
      },
      {
        title: "Photos file themselves",
        body: "Dated, in order, side by side. The comparison that actually convinces somebody they are changing.",
      },
      {
        title: "You answer with a change",
        body: "Read the week, adjust the calories or the programme, send it back. That loop is the job.",
      },
    ],
  },
  {
    slug: "client-app",
    name: "The client app",
    blurb: "Your name on it, not ours",
    icon: Smartphone,
    headline: "Your client opens your app, with your name on it",
    body: "Not a Traiv app with your logo in a corner. Your name, your colours, from the first day, with no setup fee — and nothing for them to download from an app store.",
    points: [
      {
        title: "No app store, no 80MB download",
        body: "It opens in their browser and installs to their home screen if they want it there. One less reason to never start.",
      },
      {
        title: "Built for a basement gym",
        body: "Logging works with no signal and syncs when there is some. The set they just did is not lost because the wifi is not.",
      },
      {
        title: "Free, always",
        body: "Your client never pays us anything and never sees our name.",
      },
    ],
  },
  {
    slug: "clients",
    name: "Clients",
    blurb: "Everyone, on one screen",
    icon: Users,
    headline: "Fifty people on one screen, and you can tell who is fine",
    body: "A roster that answers the only question that matters at a glance: who needs me today. Status, last session, where their plan is up to.",
    points: [
      {
        title: "Status that means something",
        body: "Active, paused, waiting, frozen. A client who stopped paying does not look the same as one on holiday.",
      },
      {
        title: "One tap to their whole history",
        body: "Plan, food, check-ins, measurements, messages. Not six tabs in four places.",
      },
      {
        title: "A full roster is not a dead end",
        body: "When you are at your limit, the next person joins a waitlist and you can see them waiting.",
      },
    ],
  },
  {
    slug: "whatsapp",
    name: "WhatsApp",
    blurb: "Where your clients already are",
    icon: MessageCircle,
    headline: "They will not open a new app. They will open WhatsApp",
    body: "Plans, reminders and check-in nudges land where your client already spends their evening. The app is there when they want detail; WhatsApp is there when they need a nudge.",
    points: [
      {
        title: "Delivery that does not depend on them installing anything",
        body: "A plan reaches a client who never opens the app, which is most of them in week one.",
      },
      {
        title: "Reminders you did not have to send",
        body: "The 9pm 'did you train' message, without you being the one awake to type it.",
      },
      {
        title: "Your number, your tone",
        body: "It reads like you, because it is from you.",
      },
    ],
    status: "building",
  },
  {
    slug: "payments",
    name: "Payments",
    blurb: "Collected, not chased",
    icon: CreditCard,
    headline: "Stop asking people for money on the 3rd",
    body: "Payment links, UPI, and invoices with GST on them. What your client pays you is yours — we take nothing on top of what the gateway charges.",
    points: [
      {
        title: "0% platform fee",
        body: "TrueCoach takes 5% of your revenue. We take none of it.",
      },
      {
        title: "GST invoices that are actually compliant",
        body: "Generated, numbered and sent. Not a Word document you edit each month.",
      },
      {
        title: "Renewals that happen without you",
        body: "The awkward monthly conversation stops being a conversation.",
      },
    ],
    status: "building",
  },
  {
    slug: "branding",
    name: "Branding",
    blurb: "It is your business, not ours",
    icon: Palette,
    headline: "Your name, your colours, no setup fee",
    body: "Trainerize charges $169 to put your name on the app. FitBudd charges $75. We charge nothing, and it works from the first client you add.",
    points: [
      {
        title: "Set it once",
        body: "Name, logo, colour. Every client you have ever added sees it immediately.",
      },
      {
        title: "Readable, whatever colour you pick",
        body: "Your colour drives the buttons, never the text or the background — so a bold brand cannot make the app unreadable.",
      },
      {
        title: "Included on every paid plan",
        body: "Not an upgrade, not an add-on.",
      },
    ],
  },
  {
    slug: "progress",
    name: "Progress",
    blurb: "Proof it is working",
    icon: BarChart3,
    headline: "The answer to “is this even working”",
    body: "Weight over months rather than a number that moved this morning. Photos in order. What they lifted in week one against week eight.",
    points: [
      {
        title: "Trends, not weigh-ins",
        body: "A single reading lies. A line over six weeks does not, and that is what the client sees.",
      },
      {
        title: "Strength, not just the scale",
        body: "The squat that went from 40kg to 60kg is the evidence on the days the scale has not moved.",
      },
      {
        title: "Shareable without a screenshot",
        body: "A monthly card they can send to whoever they told they were doing this.",
      },
    ],
    status: "building",
  },
  {
    slug: "inbox",
    name: "Inbox",
    blurb: "One place, not six chats",
    icon: Inbox,
    headline: "Every client conversation in one place",
    body: "Messages, check-in replies and questions about a plan, in one list. Not spread across WhatsApp, Instagram and a notes app.",
    points: [
      {
        title: "Attached to the person",
        body: "The conversation sits next to the plan it is about.",
      },
      {
        title: "Unanswered is visible",
        body: "You can see what you have not replied to without remembering it.",
      },
      {
        title: "An end to the evening",
        body: "Answer when you decide to, not when the notification arrives.",
      },
    ],
    status: "building",
  },
  {
    slug: "automations",
    name: "Automations",
    blurb: "The follow-up you forget",
    icon: CalendarCheck,
    headline: "The messages you meant to send",
    body: "The check-in nudge on day six. The welcome on day one. The 'you have not logged in a week' before they quit rather than after.",
    points: [
      {
        title: "Triggered by what happened",
        body: "Not a calendar. A client who misses two sessions gets a different message to one who missed none.",
      },
      {
        title: "In your words",
        body: "You write it once. We send it when it is due.",
      },
      {
        title: "Off by default",
        body: "Nothing goes out under your name that you did not write.",
      },
    ],
    status: "building",
  },
];

export const featureBySlug = (slug: string) => FEATURES.find((f) => f.slug === slug);

/** The dropdown shows the ones worth leading with; the index shows everything. */
export const NAV_FEATURES = FEATURES.slice(0, 10);
