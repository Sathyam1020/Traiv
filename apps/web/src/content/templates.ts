/**
 * The copy-and-paste pack.
 *
 * Real messages, written to be sent as they are. The reason this page exists rather than a
 * list of tips: a coach at nine at night does not want advice about tone, they want a
 * sentence they can send to the client who has gone quiet.
 *
 * Square brackets mark what has to be changed. Everything else is sendable.
 */

export type Template = {
  title: string;
  when: string;
  body: string;
};

export const MESSAGE_TEMPLATES: readonly Template[] = [
  {
    title: "Day one, after they pay",
    when: "Within an hour of signing up, before doubt sets in",
    body: `Hi [name] — glad you're in.

Here's what happens next. Your plan is on your phone at [link]. Add it to your home screen so it's one tap.

Week one is three sessions, thirty minutes each, and nothing you don't already have at home. It's deliberately easy — I'd rather you finish it than be impressed by it.

Log each session as you do it, even if you change something. What you actually did is more useful to me than what I planned.

Sunday I'll ask you four questions and we'll adjust. That's the whole rhythm.`,
  },
  {
    title: "The client who has gone quiet",
    when: "Seven days with nothing logged. Not later",
    body: `Hey [name] — nothing's shown up from you this week, so I wanted to check in rather than assume.

What happened? Genuinely asking — if it was a busy week that's completely normal, and if the plan isn't working for your schedule that's useful for me to know.

Either way we pick it back up from where you are, not from where the plan says you should be.`,
  },
  {
    title: "Three weeks in, when it gets hard",
    when: "Start of week three, to everybody",
    body: `[name] — week three is usually where this gets hard. Something comes up, you miss a session, and then it feels like the whole thing has slipped.

So, before it happens: if you only manage one session this week, make it [session name]. That's the one that matters most.

Missing a week doesn't undo three. It's just a week.`,
  },
  {
    title: "Asking for the referral",
    when: "The week they hit a number they are proud of",
    body: `[name], that's [specific result] in [timeframe] — you've earned that.

One ask, and no pressure at all: has anyone asked you what you've been doing? If there's one person, send them my way. Working with people who come through clients like you is the best part of this job.`,
  },
  {
    title: "Raising your price",
    when: "Six weeks before the new rate starts",
    body: `Hi [name] — a heads up rather than a surprise.

From [date] my rate goes from [old] to [new] a month. You've been with me [duration], and the coaching you're getting now isn't the coaching you signed up for — [specific improvement].

Two things. You've got until [date] at the current rate, and if you'd rather lock it in, paying a year up front holds [old] for the next twelve months.

Any questions, ask. Nothing changes before [date].`,
  },
  {
    title: "The pause, handled properly",
    when: "When somebody asks to stop for a while",
    body: `Of course — [reason] is a good reason to pause.

I'll freeze everything rather than delete it, so your plan and your history are exactly where you left them when you come back. No charge while you're paused.

When you're ready, message me and we'll restart from your current fitness, not from where you stopped. Enjoy [the thing].`,
  },
];

export type FormField = { q: string; why: string };

/**
 * The weekly check-in.
 *
 * Six questions, which is about the limit of what somebody will answer every week for six
 * months. The temptation is always to ask twelve; the coach who does gets four answers.
 */
export const CHECK_IN_FORM: readonly FormField[] = [
  {
    q: "Weight this morning, before eating",
    why: "Same conditions every week or the number is noise. The trend is what matters, never one reading.",
  },
  {
    q: "How many sessions did you actually do?",
    why: "Asked plainly, so the answer is honest. Adherence explains almost every result before the programme does.",
  },
  {
    q: "Out of ten, how hard did the training feel?",
    why: "The one number that tells you whether to push or hold. A six for three weeks means the plan is too easy.",
  },
  {
    q: "How was food — on plan, mostly, or not this week?",
    why: "Three options rather than a diary. A diary gets filled in twice and then abandoned.",
  },
  {
    q: "How are you sleeping?",
    why: "The thing that explains the week where nothing else does.",
  },
  {
    q: "Anything coming up I should plan around?",
    why: "A wedding, a work trip, an exam. The question that prevents week three.",
  },
];

export type OnboardingQuestion = { q: string; why: string };

/** What to ask before you write anybody a plan. */
export const INTAKE_QUESTIONS: readonly OnboardingQuestion[] = [
  {
    q: "What do you want to be different in three months, specifically?",
    why: '"Get fit" cannot be coached. "Fit into the suit by December" can, and it tells you what to measure.',
  },
  {
    q: "Have you done this before, and what happened?",
    why: "The most useful answer in the whole form. Whatever stopped them last time will try again.",
  },
  {
    q: "What equipment do you actually have, this week?",
    why: "Not what they plan to buy. A plan built on a gym membership they have not bought yet is a plan nobody does.",
  },
  {
    q: "Which days are realistically yours, and for how long?",
    why: "Build the week around their calendar. Four sessions written into three free evenings fails in week one.",
  },
  {
    q: "What do you eat in a normal day — actual meals, not ideal ones?",
    why: "A plan built around their kitchen gets eaten. One built around chicken and broccoli does not.",
  },
  {
    q: "Any injuries, conditions, or medication I should know about?",
    why: "Ask in writing, keep the answer, and send anybody with a condition to their doctor before you set a target.",
  },
  {
    q: "How do you want to hear from me, and how often?",
    why: "Sets the boundary at the start, which is the only time it is easy to set.",
  },
];
