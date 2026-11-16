/**
 * Templates for the generator tools. Original text written for Traiv (ADR 0036). Every
 * function is pure: inputs in, strings out, so the widgets stay thin and the output is
 * the same every time for the same inputs (the name generator takes a seed).
 */

const clean = (s: string, fallback: string) => (s.trim() ? s.trim() : fallback);
const cap = (s: string) => (s ? s[0]?.toUpperCase() + s.slice(1) : s);
const words = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

/* ======================================================== check-in builder */

export const CHECKIN_GOALS = [
  "Fat loss",
  "Muscle gain",
  "Recomposition",
  "Performance",
  "Health and habits",
  "Wellness",
] as const;
export type CheckinGoal = (typeof CHECKIN_GOALS)[number];
export const CHECKIN_METRICS = [
  "Weight and measurements",
  "Nutrition and adherence",
  "Training",
  "Sleep and recovery",
  "Steps and activity",
  "Progress photos",
  "Energy and mood",
  "Habits",
  "Menstrual cycle",
] as const;
export type CheckinMetric = (typeof CHECKIN_METRICS)[number];
export type Depth = "quick" | "standard" | "deep";

export const DEFAULT_METRICS: Record<CheckinGoal, CheckinMetric[]> = {
  "Fat loss": [
    "Weight and measurements",
    "Nutrition and adherence",
    "Training",
    "Sleep and recovery",
    "Steps and activity",
  ],
  "Muscle gain": [
    "Weight and measurements",
    "Nutrition and adherence",
    "Training",
    "Sleep and recovery",
  ],
  Recomposition: [
    "Weight and measurements",
    "Nutrition and adherence",
    "Training",
    "Progress photos",
  ],
  Performance: ["Training", "Sleep and recovery", "Energy and mood", "Nutrition and adherence"],
  "Health and habits": ["Habits", "Steps and activity", "Sleep and recovery", "Energy and mood"],
  Wellness: ["Energy and mood", "Sleep and recovery", "Habits"],
};

const METRIC_LINES: Record<CheckinMetric, { quick: string[]; more: string[] }> = {
  "Weight and measurements": {
    quick: ["Average morning weight this week: ___"],
    more: ["Waist (at the navel): ___", "Hips (widest point): ___"],
  },
  "Nutrition and adherence": {
    quick: ["Days on plan out of 7: ___"],
    more: ["Average protein per day: ___ g", "Hardest meal or moment to stick to: ___"],
  },
  Training: {
    quick: ["Sessions done / planned: ___ / ___"],
    more: ["Best lift or session this week: ___", "Any pain or niggles (where, how bad 1–10): ___"],
  },
  "Sleep and recovery": {
    quick: ["Average sleep: ___ hours"],
    more: ["Sleep quality 1–5: ___", "Soreness 1–5: ___"],
  },
  "Steps and activity": {
    quick: ["Average daily steps: ___"],
    more: ["Days you hit your step target: ___ / 7"],
  },
  "Progress photos": {
    quick: ["Photos uploaded (front, side, back): yes / no"],
    more: ["Same light, time and clothing as last time: yes / no"],
  },
  "Energy and mood": { quick: ["Energy 1–5: ___"], more: ["Mood 1–5: ___", "Stress 1–5: ___"] },
  Habits: {
    quick: ["Habit target hit: ___ / 7 days"],
    more: ["Water: ___ litres a day", "Which habit felt easiest this week: ___"],
  },
  "Menstrual cycle": {
    quick: ["Cycle day or phase: ___"],
    more: ["Any symptoms affecting training or appetite: ___"],
  },
};

const REFLECTIONS: Record<CheckinGoal, string[]> = {
  "Fat loss": [
    "What went well with food this week?",
    "Where did the plan feel hardest, and what got in the way?",
    "What's one thing you'd like help with next week?",
    "How are your clothes fitting compared with last week?",
  ],
  "Muscle gain": [
    "Were you able to eat your full target most days?",
    "Which session felt strongest, and why?",
    "What's one thing you'd like help with next week?",
    "How's your appetite and digestion?",
  ],
  Recomposition: [
    "What do you notice in the mirror or in how clothes fit?",
    "Which lift moved forward this week?",
    "What's one thing you'd like help with next week?",
    "How confident do you feel about the plan, 1–5?",
  ],
  Performance: [
    "How did your key session go against target?",
    "Anything that limited performance: sleep, fuelling, stress?",
    "What's one thing you'd like help with next week?",
    "How ready do you feel for the next block, 1–5?",
  ],
  "Health and habits": [
    "Which habit felt most natural this week?",
    "What made the hard days hard?",
    "What's one thing you'd like help with next week?",
    "What would make next week 10% easier?",
  ],
  Wellness: [
    "What helped you feel good this week?",
    "What drained you?",
    "What's one thing you'd like help with next week?",
    "Anything you'd like to change in the plan?",
  ],
};

export function buildCheckin(goal: CheckinGoal, metrics: readonly CheckinMetric[], depth: Depth) {
  const lines: string[] = [`Weekly check-in · ${goal}`, "", "The numbers"];
  for (const m of CHECKIN_METRICS) {
    if (!metrics.includes(m)) continue;
    const l = METRIC_LINES[m];
    lines.push(...l.quick.map((x) => `• ${x}`));
    if (depth !== "quick")
      lines.push(...l.more.slice(0, depth === "deep" ? 3 : 1).map((x) => `• ${x}`));
  }
  if (!metrics.length) lines.push("• (Pick at least one thing to track.)");
  const n = depth === "quick" ? 1 : depth === "standard" ? 3 : 4;
  lines.push("", "Your week in a few words");
  lines.push(...(REFLECTIONS[goal] ?? []).slice(0, n).map((q, i) => `${i + 1}. ${q}`));
  lines.push("", "Anything else I should know? ___");
  return lines.join("\n");
}

/* ======================================================== onboarding builder */

export const ONBOARD_TYPES = [
  "Fat loss",
  "Muscle gain",
  "Performance",
  "Nutrition",
  "Wellness",
  "General PT",
] as const;
export type OnboardType = (typeof ONBOARD_TYPES)[number];
export const ONBOARD_STEPS = [
  "Welcome message",
  "Payment and terms",
  "Intake and PAR-Q",
  "Baseline and photos",
  "App setup",
  "Communication norms",
  "Review intake",
  "Goal-setting",
  "Deliver first programme",
  "Onboarding call",
  "First check-in",
] as const;
export type OnboardStep = (typeof ONBOARD_STEPS)[number];
export type Timeline = "3days" | "week" | "2weeks";

const STEP_TEXT: Record<OnboardStep, (t: OnboardType) => string> = {
  "Welcome message": (t) =>
    `Send a short welcome: thank them, say what happens in the next few days and when they'll hear from you. Mention their ${t.toLowerCase()} goal by name.`,
  "Payment and terms": () =>
    "Confirm payment and share your terms: what's included, reply hours, cancellation, pauses and refunds. Ask them to confirm they've read them.",
  "Intake and PAR-Q": () =>
    "Send the intake form and a pre-exercise health questionnaire (PAR-Q or similar). Refer for clearance if anything is flagged.",
  "Baseline and photos": (t) =>
    t === "Nutrition"
      ? "Collect baseline weight, waist and a typical day of eating. Photos are optional."
      : "Collect baseline weight, waist and, if they're comfortable, front, side and back photos in the same light.",
  "App setup": () =>
    "Help them log in to the app, find their plan and send a first message so you know it works.",
  "Communication norms": () =>
    "Agree how and when you'll talk: message channel, reply times, check-in day and how to flag something urgent.",
  "Review intake": () =>
    "Read the intake properly. Note goals, schedule, equipment, injuries, food preferences and anything to follow up.",
  "Goal-setting": () =>
    "Agree one outcome goal and two or three behaviour goals they control, with a date to review them.",
  "Deliver first programme": (t) =>
    t === "Nutrition"
      ? "Deliver the first nutrition plan with a short note on how to use it and what to focus on first."
      : "Deliver the first programme with a short note on how to use it, and a lighter first week.",
  "Onboarding call": () =>
    "Run a 20 to 30-minute call: walk through the plan, answer questions and confirm the first check-in date.",
  "First check-in": () =>
    "Do the first check-in, reply personally and make one small adjustment to show the plan responds to them.",
};

const PHASES: Record<Timeline, { name: string; steps: OnboardStep[] }[]> = {
  "3days": [
    {
      name: "Day 1",
      steps: [
        "Welcome message",
        "Payment and terms",
        "Intake and PAR-Q",
        "App setup",
        "Communication norms",
      ],
    },
    {
      name: "Day 2",
      steps: ["Review intake", "Baseline and photos", "Goal-setting", "Onboarding call"],
    },
    { name: "Day 3", steps: ["Deliver first programme", "First check-in"] },
  ],
  week: [
    { name: "Day 1: welcome", steps: ["Welcome message", "Payment and terms", "Intake and PAR-Q"] },
    {
      name: "Days 2–3: set up",
      steps: ["Review intake", "App setup", "Communication norms", "Baseline and photos"],
    },
    {
      name: "Days 4–5: plan",
      steps: ["Goal-setting", "Onboarding call", "Deliver first programme"],
    },
    { name: "Day 7: first check-in", steps: ["First check-in"] },
  ],
  "2weeks": [
    {
      name: "Days 1–2: welcome",
      steps: ["Welcome message", "Payment and terms", "Intake and PAR-Q"],
    },
    {
      name: "Days 3–5: set up",
      steps: ["Review intake", "App setup", "Communication norms", "Baseline and photos"],
    },
    {
      name: "Days 6–8: plan",
      steps: ["Goal-setting", "Onboarding call", "Deliver first programme"],
    },
    { name: "Days 9–14: first rhythm", steps: ["First check-in"] },
  ],
};

export function buildOnboarding(
  type: OnboardType,
  steps: readonly OnboardStep[],
  timeline: Timeline,
) {
  const out: string[] = [`Onboarding sequence · ${type} coaching`, ""];
  for (const p of PHASES[timeline]) {
    const chosen = p.steps.filter((s) => steps.includes(s));
    if (!chosen.length) continue;
    out.push(p.name);
    for (const s of chosen) out.push(`☐ ${s}: ${STEP_TEXT[s](type)}`);
    out.push("");
  }
  if (timeline === "2weeks" && steps.includes("First check-in"))
    out.push(
      "Day 14: second check-in and a short progress note, so the first two weeks end on a visible win.",
      "",
    );
  if (!steps.length) out.push("Pick at least one step.");
  return out.join("\n").trim();
}

/* ======================================================== offer builder */

export const OFFER_MODELS = [
  "1:1 coaching",
  "Group coaching",
  "Hybrid (1:1 + group)",
  "Self-led programme",
] as const;
export type OfferModel = (typeof OFFER_MODELS)[number];
export const OFFER_LENGTHS = ["Monthly", "12 weeks", "16 weeks", "6 months"] as const;
export type OfferLength = (typeof OFFER_LENGTHS)[number];
export const OFFER_ITEMS = [
  "Training programme",
  "Nutrition / meal plan",
  "Weekly check-ins",
  "Messaging support",
  "Client app",
  "Progress tracking",
  "Video form checks",
  "Onboarding call",
  "Habit coaching",
  "Community access",
] as const;
export type OfferItem = (typeof OFFER_ITEMS)[number];

const ITEM_LINE: Record<OfferItem, (m: OfferModel) => string> = {
  "Training programme": (m) =>
    m === "Self-led programme"
      ? "A structured training programme you follow at your own pace"
      : "A training programme written for your schedule, equipment and level, updated as you progress",
  "Nutrition / meal plan": () =>
    "A nutrition plan with targets and meals that fit how you actually eat",
  "Weekly check-ins": (m) =>
    m === "Group coaching"
      ? "A weekly group check-in and progress review"
      : "A weekly check-in, with personal feedback and plan changes",
  "Messaging support": () =>
    "Messaging support for questions between check-ins, with replies within an agreed time",
  "Client app": () => "Everything in one app: your plan, logs, check-ins and messages",
  "Progress tracking": () =>
    "Progress tracking for weight, measurements and lifts, so you can see change week to week",
  "Video form checks": () => "Video form checks on your main lifts",
  "Onboarding call": () => "A one-to-one onboarding call to set goals and walk through the plan",
  "Habit coaching": () => "Habit coaching for sleep, steps and routines that make results last",
  "Community access": () => "Access to a community of people working towards similar goals",
};

const LENGTH_LINE: Record<OfferLength, string> = {
  Monthly: "Rolling monthly. Stay as long as it's working for you; cancel with notice.",
  "12 weeks": "A 12-week commitment: long enough to see real change in strength, shape and habits.",
  "16 weeks": "A 16-week commitment: a full block to build, review and build again.",
  "6 months": "A 6-month commitment: time to change body composition and make the habits stick.",
};

export function buildOffer(model: OfferModel, length: OfferLength, items: readonly OfferItem[]) {
  const who =
    model === "Self-led programme"
      ? "for people who want a clear plan and like working independently"
      : model === "Group coaching"
        ? "for people who want structure, accountability and a group alongside them"
        : model === "Hybrid (1:1 + group)"
          ? "for people who want personal coaching and a group for support"
          : "for people who want a plan built around them and a coach in their corner";
  const lines = [`${model} · ${length}`, "", `${cap(who)}.`, "", "What's included"];
  lines.push(
    ...(items.length
      ? OFFER_ITEMS.filter((i) => items.includes(i)).map((i) => `• ${ITEM_LINE[i](model)}`)
      : ["• (Pick what's included.)"]),
  );
  lines.push(
    "",
    "Commitment",
    LENGTH_LINE[length],
    "",
    "What you'll need to bring",
    model === "Self-led programme"
      ? "Two to four sessions a week and a willingness to log what you do."
      : "Two to four sessions a week, honest check-ins and a willingness to try what we agree.",
    "",
    "Next step",
    "Book a short call and we'll check it's the right fit before you start.",
  );
  return lines.join("\n");
}

/* ======================================================== prompt generator */

export const PROMPT_TASKS = [
  "Client check-in reply",
  "Onboarding message",
  "Programming / plan draft",
  "Nutrition guidance draft",
  "Sales / DM reply",
  "Marketing caption",
  "Testimonial request",
  "Price-increase message",
] as const;
export type PromptTask = (typeof PROMPT_TASKS)[number];
export type PromptTone = "Warm" | "Direct" | "Clinical" | "Playful";
export type PromptLength = "Short" | "Standard" | "Detailed";

const TASK_BRIEF: Record<PromptTask, { goal: string; include: string[]; avoid: string }> = {
  "Client check-in reply": {
    goal: "Write my reply to a client's weekly check-in.",
    include: [
      "open with one specific thing they did well",
      "give one clear change or focus for next week",
      "explain the reason for that change in one sentence",
      "end with a simple question that invites a reply",
    ],
    avoid: "Don't change calories, training or anything medical without my numbers.",
  },
  "Onboarding message": {
    goal: "Write a welcome message for a new coaching client.",
    include: [
      "thank them and set a warm tone",
      "explain what happens in the next three to seven days",
      "list what I need from them, such as the intake form",
      "say when and how they'll hear from me",
    ],
    avoid: "Don't promise specific results or timelines.",
  },
  "Programming / plan draft": {
    goal: "Draft a first training plan outline for me to review and edit.",
    include: [
      "sessions per week and a simple split",
      "main exercises with sets and reps",
      "how to progress week to week",
      "a lighter first week",
    ],
    avoid: "Flag anything that should be cleared by a doctor or physiotherapist first.",
  },
  "Nutrition guidance draft": {
    goal: "Draft general nutrition guidance for a healthy adult client, for me to review.",
    include: [
      "two or three priorities, such as protein and regular meals",
      "practical examples that fit their routine",
      "how to judge whether it's working",
      "what to tell me at the next check-in",
    ],
    avoid:
      "This is general healthy-eating guidance only. Don't give advice to treat any medical condition, and tell me if anything needs a dietitian or doctor.",
  },
  "Sales / DM reply": {
    goal: "Write a reply to someone who messaged me about coaching.",
    include: [
      "thank them and reflect what they told me",
      "one or two questions to understand their goal",
      "a clear, low-pressure next step, such as a short call",
    ],
    avoid: "No pressure tactics, fake urgency or claims I can't back up.",
  },
  "Marketing caption": {
    goal: "Write an Instagram caption for my coaching account.",
    include: [
      "a first line that's specific and concrete",
      "one useful point, explained simply",
      "one real detail from my coaching",
      "a single, clear ask at the end",
    ],
    avoid:
      "No clichés, no stacked questions, no lists of three, no emoji and no exclamation marks.",
  },
  "Testimonial request": {
    goal: "Write a message asking a happy client for a short testimonial.",
    include: [
      "thank them and mention their progress specifically",
      "ask two or three simple questions they can answer",
      "make it clear they can say no",
      "ask permission before using their name or photos",
    ],
    avoid: "Don't write the testimonial for them.",
  },
  "Price-increase message": {
    goal: "Write a message telling an existing client about a price increase.",
    include: [
      "thank them for their time with me",
      "state the new price and the date it starts",
      "explain briefly why",
      "offer any option, such as locking in the current rate for a longer commitment",
    ],
    avoid: "Keep it short, confident and respectful. Don't over-apologise.",
  },
};

const TONE_LINE: Record<PromptTone, string> = {
  Warm: "warm, encouraging and human",
  Direct: "direct, clear and friendly",
  Clinical: "precise, factual and calm",
  Playful: "light, friendly and a little playful",
};
const LENGTH_PROMPT: Record<PromptLength, string> = {
  Short: "under 80 words",
  Standard: "around 120 to 180 words",
  Detailed: "up to 300 words, with short headings if useful",
};

export function buildPrompts(
  task: PromptTask,
  niche: string,
  detail: string,
  tone: PromptTone,
  length: PromptLength,
) {
  const b = TASK_BRIEF[task];
  const who = niche.trim() ? `I coach ${niche.trim()}.` : "I'm a fitness coach.";
  const client = detail.trim()
    ? `About the client: ${detail.trim()}.`
    : "I'll describe the client below if it helps.";
  const rules = `Write it in a ${TONE_LINE[tone]} tone, ${LENGTH_PROMPT[length]}. Use plain British English, sentence case and no emoji. ${b.avoid} If you need information you don't have, ask me before writing rather than guessing. Don't give medical advice.`;
  const full = [
    `You are helping a coach write. ${who} ${client}`,
    "",
    `Task: ${b.goal}`,
    "",
    "Include:",
    ...b.include.map((x) => `- ${x}`),
    "",
    rules,
    "",
    "Before the final version, list any assumptions you made in one line so I can correct them.",
  ].join("\n");
  const two = [
    `${who} ${client}`,
    "",
    `${b.goal} Give me two versions with different angles: one that leads with empathy and one that leads with the practical next step.`,
    `Each should ${b.include[0] ?? "be specific"} and stay ${LENGTH_PROMPT[length]}.`,
    rules,
  ].join("\n");
  const outline = [
    `${who} ${client}`,
    "",
    `${b.goal} Don't write the full text yet. First give me a bullet outline covering:`,
    ...b.include.map((x) => `- ${x}`),
    "",
    "Wait for my edits before writing the final version.",
    rules,
  ].join("\n");
  return { full, two, outline };
}

/* ======================================================== GLP-1 planner */

export type Glp1Stage = "starting" | "titrating" | "stable" | "tapering";
export type Glp1Challenge = "protein" | "energy" | "nausea" | "smooth";
export type Level = "Beginner" | "Intermediate" | "Advanced";

const STAGE_FOCUS: Record<Glp1Stage, string> = {
  starting:
    "The first weeks: appetite often drops quickly and side effects are most likely. Build the habits now: protein at every meal, a simple strength routine, fluids.",
  titrating:
    "The dose is rising: appetite may fall further and side effects can return after each increase. Keep training steady rather than pushing, and protect protein.",
  stable:
    "Stable dose, losing steadily: the main risk is losing muscle along with fat. Prioritise progressive strength training and hitting protein most days.",
  tapering:
    "Coming off or tapering: appetite usually returns. The habits built now, regular protein, strength training and structured meals, decide whether the result holds.",
};

const CHALLENGE_FIX: Record<Glp1Challenge, string[]> = {
  protein: [
    "Lead each meal with protein, before anything else on the plate.",
    "Use smaller, more frequent protein portions: yoghurt, eggs, milk, tofu, fish, lean meat.",
    "Use liquid protein, such as milk or a shake, on days when solid food is hard.",
    "Track protein only, not every calorie, for the first few weeks.",
  ],
  energy: [
    "Keep sessions short, 30 to 40 minutes, and stop a rep or two before failure.",
    "Train after a small meal or snack with some protein and carbohydrate.",
    "Prioritise sleep and fluids; low intake makes both matter more.",
    "Walking counts: keep daily steps up on days when strength training feels too much.",
  ],
  nausea: [
    "Eat slowly, stop at the first sign of fullness, and avoid large, fatty or very rich meals.",
    "Choose plain, cold or room-temperature foods if smells are a problem.",
    "Sip fluids through the day rather than drinking a lot at once.",
    "Report persistent nausea or vomiting to the prescriber; it isn't something to coach through.",
  ],
  smooth: [
    "Keep the routine: protein at every meal, two to four strength sessions, daily steps.",
    "Progress training gradually: a little more load or a rep at a time.",
    "Review progress every two to four weeks with weight, waist and strength.",
    "Start planning for life after the medication now, so the habits are already in place.",
  ],
};

export function buildGlp1Plan(
  stage: Glp1Stage,
  level: Level,
  days: number,
  challenge: Glp1Challenge,
) {
  const d = Math.max(1, Math.min(6, Math.round(days)));
  const split =
    d <= 2
      ? "two full-body sessions"
      : d === 3
        ? "three full-body sessions"
        : d === 4
          ? "an upper/lower split, twice each"
          : "a four-day upper/lower split plus one or two easy sessions or walks";
  const sets =
    level === "Beginner"
      ? "2 to 3 sets of 8 to 12 reps on 5 or 6 exercises"
      : level === "Intermediate"
        ? "3 sets of 6 to 12 reps on 5 or 6 exercises, with a main lift each session"
        : "3 to 4 sets across a main lift and accessories, keeping intensity and reducing volume if recovery dips";
  return [
    "GLP-1 coaching plan",
    "",
    "Where they are",
    STAGE_FOCUS[stage],
    "",
    `Training (${d} day${d === 1 ? "" : "s"} a week)`,
    `• ${cap(split)}, ${sets}.`,
    "• Prioritise compound movements: squat or leg press, hinge, push, pull, carry.",
    "• Aim to keep or slowly increase the weights; holding strength while weight falls protects muscle.",
    "• Add daily walking, building towards a step target they can sustain.",
    "",
    "Protein and food",
    "• Protein target: around 1.2 to 1.6 g per kg of body weight a day for most adults losing weight, adjusted with their prescriber or dietitian if they have kidney or other conditions.",
    "• Spread it over three or four eating occasions.",
    "• Keep fluids up, with fruit and vegetables for fibre as tolerated.",
    "",
    "Right now",
    ...CHALLENGE_FIX[challenge].map((x) => `• ${x}`),
    "",
    "What to watch at check-ins",
    "• Weight trend, waist and strength on the main lifts: strength holding means muscle is being protected.",
    "• Protein hit (days out of 7), training done, energy and side effects.",
    "• Any sign they can't eat enough to function: refer to the prescriber.",
    "",
    "Stays with the prescriber",
    "The medication, dose, side-effect management and whether to continue or stop.",
  ].join("\n");
}

/* ======================================================== captions */

export type CapTone = "Direct" | "Warm" | "Dry";
export type CapAsk = "comment" | "dm" | "save" | "none";
export type CapFields = {
  niche: string;
  audience: string;
  point: string;
  detail: string;
  keyword: string;
  tone: CapTone;
  ask: CapAsk;
};

const askLine = (ask: CapAsk, kw: string, what: string) => {
  const k = clean(kw, "PLAN").toUpperCase();
  return ask === "comment"
    ? `Comment ${k} and I'll send you ${what}.`
    : ask === "dm"
      ? `Send me ${k} and I'll share ${what}.`
      : ask === "save"
        ? "Save this for your next week of training."
        : "";
};

const toneWrap = (tone: CapTone, line: string) =>
  tone === "Dry" ? line.replace(/\.$/, ". Mildly inconvenient, I know.") : line;

export const CAPTION_FRAMES = [
  {
    name: "Client result, with permission",
    purpose: "Proof. Opens with the detail and the timeframe.",
  },
  { name: "Belief to correct", purpose: "Trust. Opens with what people do because of the belief." },
  { name: "Fixes I make most", purpose: "Saves. Opens with how many things you fix." },
  {
    name: "Why I programmed it",
    purpose: "Profile visits. Opens with a decision you made this week.",
  },
  {
    name: "Permission to ease off",
    purpose: "Shares. Opens with what they're allowed to stop doing.",
  },
  {
    name: "What I don't do",
    purpose: "Profile visits and shares. Opens with something you don't do.",
  },
  { name: "Straight how-to", purpose: "Saves. Opens with the instruction itself." },
  { name: "A real day", purpose: "Follows. Opens with a time and what you were doing." },
] as const;

export function captions(f: CapFields) {
  const niche = clean(f.niche, "fitness coaching");
  const aud = clean(f.audience, "people who train");
  const point = clean(f.point, "consistency beats intensity");
  const det = clean(f.detail, "one client logged every meal this week");
  const ask = askLine(f.ask, f.keyword, "the simple version I give clients");
  const warm = f.tone === "Warm";
  const t = (s: string) => toneWrap(f.tone, s);
  const list = [
    `${cap(det)}.\n\nThat's from a client I coach in ${niche}, shared with their permission. Nothing dramatic changed. They kept the plan simple and did it most days.\n\nWhat we worked on: ${point}.\n\n${warm ? "If you're in a similar place, that's genuinely encouraging." : "That's the whole lesson."}\n\n${ask}\n\n(Shared with the client's written consent.)`,
    `Most ${aud} I speak to change their whole week because of one belief.\n\nThey think more is always better, so they add sessions, cut food and burn out by Thursday.\n\nWhat I see in practice is different: ${point}.\n\n${cap(det)}. ${t("That's the pattern I'd follow.")}\n\n${ask}`,
    `Three things I fix for almost every new client in ${niche}.\n\nOne: the plan asks for more time than they have.\nTwo: protein is low on busy days.\nThree: they judge a week by one weigh-in.\n\nFixing those usually does more than any new programme, because ${point}.\n\n${ask}`,
    `This week I changed one thing in a client's plan.\n\n${cap(det)}, so I kept the sessions and adjusted the part that wasn't working.\n\nI programme this way because ${point}. ${warm ? "Small changes, made early, keep people going." : "Small, early changes beat big, late ones."}\n\n${ask}`,
    `You're allowed to train less this week if life is heavy.\n\nFor ${aud}, a shorter session done is worth more than a perfect one skipped. ${cap(point)}.\n\n${cap(det)}, and that's a good week.\n\n${ask}`,
    `I don't give ${aud} a new plan every week.\n\nChanging everything makes it impossible to see what's working. I keep the plan steady and adjust one thing at a time, because ${point}.\n\n${cap(det)}. ${t("That's how progress actually looks.")}\n\n${ask}`,
    `Pick one meal and add 30 g of protein to it.\n\nThat's the simplest change I give ${aud} who want results without overhauling everything. ${cap(point)}.\n\n${cap(det)}. Start with breakfast or lunch, whichever is easier, and keep it for two weeks.\n\n${ask}`,
    `6:40am, reviewing check-ins with a coffee.\n\n${cap(det)}. Reading that is the best part of the morning.\n\nThe lesson that keeps coming up: ${point}. The rest is detail.\n\n${warm ? "Back to the next one." : "Next check-in."}\n\n${ask}`,
  ];
  return CAPTION_FRAMES.map((fr, i) => ({
    ...fr,
    text: (list[i] ?? "").replace(/\n{3,}/g, "\n\n").trim(),
  })).map((c) => ({ ...c, words: words(c.text) }));
}

export function captionPrompt(f: CapFields) {
  return `Write eight Instagram captions for my fitness coaching account.\n\nNiche: ${clean(f.niche, "[niche]")}\nAudience: ${clean(f.audience, "[audience]")}\nThe one point: ${clean(f.point, "[point]")}\nOne real detail from this week: ${clean(f.detail, "[detail]")}\nTone: ${f.tone}\nEnding: ${f.ask === "none" ? "no call to action" : askLine(f.ask, f.keyword, "[what you'll send]")}\n\nUse eight different structures: a client result shared with permission, a belief to correct, three fixes I make most, why I programmed something, permission to ease off, something I don't do, a straight how-to, and a real moment from my day.\n\nRules: each under 150 words; put the real detail in the first two lines; plain, specific language; no emoji, no exclamation marks, no hashtags in the text, no 'it's not X, it's Y', no lists of three adjectives, no question as the first line, no moral at the end. If a caption mentions a client, add a line saying it's shared with their consent. Ask me if anything is unclear before writing.`;
}

/* ======================================================== hooks */

export type HookFormat = "Reel" | "Carousel" | "Caption" | "Story";
export type HookFields = {
  topic: string;
  audience: string;
  number: string;
  question: string;
  format: HookFormat;
};

export const HOOK_PATTERNS: { name: string; fits: HookFormat[] }[] = [
  { name: "Lead with a number", fits: ["Reel", "Carousel", "Caption", "Story"] },
  { name: "Admit a mistake", fits: ["Reel", "Caption"] },
  { name: "Answer their question", fits: ["Reel", "Carousel", "Story"] },
  { name: "Set the scene", fits: ["Reel", "Story"] },
  { name: "Flag a risk", fits: ["Reel", "Carousel", "Caption"] },
  { name: "Say it short", fits: ["Reel", "Story"] },
  { name: "State the plain truth", fits: ["Carousel", "Caption"] },
  { name: "Two sides", fits: ["Carousel", "Reel"] },
  { name: "Promise, with a condition", fits: ["Carousel", "Caption"] },
  { name: "What I tell clients", fits: ["Reel", "Caption", "Story"] },
];

export function hooks(f: HookFields) {
  const t = clean(f.topic, "rest days");
  const a = clean(f.audience, "people who lift");
  const n = clean(f.number, "3 kg");
  const q = clean(f.question, "Why is the scale up after a good week?").replace(/\?*$/, "?");
  const sets: string[][] = [
    [
      `${cap(n)}. Here's what it means for ${t}.`,
      `${cap(n)} changed how I coach ${t}.`,
      `The ${n} rule for ${a}.`,
      `${cap(n)}, and nobody tells ${a} why.`,
    ],
    [
      `Years ago I coached ${t} the wrong way.`,
      `My first clients paid for my ${t} mistakes.`,
      `I used to coach ${t} the hard way.`,
      `What I'd tell myself about ${t} five years ago.`,
    ],
    [
      `"${q}" Good question.`,
      `A client asked: "${q}"`,
      `"${q}" Here's my answer.`,
      `The question I get most about ${t}.`,
    ],
    [
      `Monday, 7am, a client's message about ${t}.`,
      `Halfway through a session, a client stopped and asked about ${t}.`,
      `Reading check-ins this morning, ${t} came up three times.`,
      `In the gym last night, I saw the same ${t} problem again.`,
    ],
    [
      `Before you change ${t}, check this.`,
      `${a} lose progress on ${t} in one way.`,
      `One ${t} habit that quietly stalls ${a}.`,
      `If ${t} feels harder every week, watch this first.`,
    ],
    [`${cap(t)}. Simplified.`, `${cap(t)} in one line.`, `The ${t} fix.`, `${cap(t)}, done right.`],
    [
      `${cap(t)} is simpler than you've been told.`,
      `Most advice on ${t} is noise.`,
      `${cap(t)} works when you stop overthinking it.`,
      `There's no secret to ${t}.`,
    ],
    [
      `One client nailed ${t}. One didn't. Same plan.`,
      `Two ${a}, same week, opposite results with ${t}.`,
      `What ${t} looks like on a good week and a bad one.`,
      `The difference between ${t} that works and ${t} that doesn't.`,
    ],
    [
      `Get ${t} right, if you'll give it four weeks.`,
      `${cap(t)} will work for you, as long as you keep this one thing.`,
      `Better ${t} in a month, if you start small.`,
      `Fix ${t} this week, if you'll track one number.`,
    ],
    [
      `What I tell every client about ${t}.`,
      `My ${t} advice for ${a}, in 20 seconds.`,
      `The ${t} talk I have with every new client.`,
      `If you coached with me, here's what I'd say about ${t}.`,
    ],
  ];
  return HOOK_PATTERNS.map((p, i) => ({
    ...p,
    fit: p.fits.includes(f.format),
    hooks: sets[i] ?? [],
  }));
}

export function hookPrompt(f: HookFields) {
  return `Write 100 short hooks for ${f.format.toLowerCase()} content on my fitness coaching account.\n\nTopic: ${clean(f.topic, "[topic]")}\nAudience: ${clean(f.audience, "[audience]")}\nA real number from my coaching: ${clean(f.number, "[number]")}\nA real client question this week: ${clean(f.question, "[question]")}\n\nSpread them across ten patterns: lead with a number, admit a mistake, answer their question, set the scene, flag a risk, say it short, state the plain truth, two sides, a promise with a condition, and what I tell clients.\n\nRules: under 10 words where possible; specific, not vague; something that creates tension or curiosity; must work spoken and on screen; no 'stop doing this', no 'unpopular opinion', no 'it's not X, it's Y', no emoji, no stacked questions. Mark the ten you think are strongest and say why in one line each.`;
}

/* ======================================================== bios */

export type BioCta = "link" | "dm" | "magnet";
export type BioTone = "Direct" | "Friendly" | "Premium";
export type BioFields = {
  who: string;
  outcome: string;
  method: string;
  proof: string;
  cta: BioCta;
  tone: BioTone;
};

export const BIO_LAYOUTS = [
  {
    name: "Four-line stack",
    purpose: "Who, outcome, method and call to action on separate lines.",
  },
  { name: "Result first", purpose: "Opens with what you deliver." },
  { name: "Single line", purpose: "Compact, with separators." },
  { name: "Proof on top", purpose: "Credibility and method first." },
  { name: "Reader question", purpose: "Opens with the question your reader is asking." },
  { name: "Quiet and clean", purpose: "Three calm lines, no symbols." },
  { name: "Credential lead", purpose: "Your proof carries the opening line." },
  { name: "Point to the link", purpose: "Short header with an arrow to the link." },
] as const;

export function bios(f: BioFields) {
  const who = clean(f.who, "busy people");
  const out = clean(f.outcome, "get strong and stay consistent");
  const how = clean(f.method, "simple plans and weekly check-ins");
  const proof = f.proof.trim();
  const cta =
    f.cta === "link" ? "Start below" : f.cta === "dm" ? "DM 'START' to apply" : "Free guide below";
  const lead = f.tone === "Premium" ? "Coaching for" : f.tone === "Friendly" ? "Helping" : "I help";
  const opts = [
    `${lead} ${who}\n${cap(out)}\n${cap(how)}\n${cta} ↓`,
    `${cap(out)}, for ${who}.\n${cap(how)}.\n${proof ? `${proof}\n` : ""}${cta} ↓`,
    `${cap(who)} | ${out} | ${how} | ${cta}`,
    `${proof ? `${proof} · ` : ""}${cap(how)}\n${lead} ${who} ${out}\n${cta} ↓`,
    `Want to ${out}?\nI coach ${who} with ${how}.\n${cta} ↓`,
    `${cap(who)}\n${cap(out)}\n${cta}`,
    `${proof ? cap(proof) : "Online coach"}\n${lead} ${who} ${out}\n${cta} ↓`,
    `${cap(out)} | ${who}\n→ ${cta}`,
  ];
  return BIO_LAYOUTS.map((l, i) => {
    const raw = opts[i] ?? "";
    const text = raw.length > 150 ? `${raw.slice(0, 149).trimEnd()}…` : raw;
    return { ...l, text, chars: [...text].length };
  });
}

/* ======================================================== business names */

export type NameStyle = "personal" | "descriptive" | "abstract";

const DESC_SUFFIX = [
  "Collective",
  "Method",
  "Lab",
  "Club",
  "Studio",
  "Project",
  "Works",
  "Co.",
  "Coaching",
  "Academy",
  "House",
  "Room",
];
const DESC_PREFIX = ["The", "Simply", "True", "Daily", "Steady", "Honest"];
const ABSTRACT_ROOTS = [
  "Kinto",
  "Varo",
  "Ondra",
  "Mavik",
  "Solen",
  "Arlo",
  "Teiro",
  "Novak",
  "Brevo",
  "Lumen",
  "Halden",
  "Ostra",
  "Pelo",
  "Rivet",
  "Cairn",
  "Fable",
];
const ABSTRACT_TAIL = ["Fitness", "Coaching", "Strength", "Performance", "Training", "Movement"];

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function businessNames(
  name: string,
  niche: string,
  location: string,
  style: NameStyle,
  seed: number,
) {
  const r = rng(seed);
  const pick = <T>(xs: readonly T[]) => xs[Math.floor(r() * xs.length)] as T;
  const n = cap(clean(niche, "strength"));
  const first = name.trim().split(/\s+/)[0] ?? "";
  const last = name.trim().split(/\s+/).slice(-1)[0] ?? "";
  const loc = cap(location.trim());
  const out = new Set<string>();
  let guard = 0;
  while (out.size < 12 && guard++ < 200) {
    let s: string;
    if (style === "personal" && first) {
      s = pick([
        `${cap(first)} ${pick(["Coaching", "Strength", "Fitness", "Training"])}`,
        `Coached by ${cap(first)}`,
        `${cap(last || first)} ${n} ${pick(["Co.", "Club", "Method"])}`,
        `${cap(first)}'s ${n} ${pick(["Lab", "Room", "Club"])}`,
        `Team ${cap(last || first)}`,
      ]);
    } else if (style === "abstract") {
      s = `${pick(ABSTRACT_ROOTS)} ${pick(ABSTRACT_TAIL)}`;
    } else {
      s = pick([
        `${n} ${pick(DESC_SUFFIX)}`,
        `${pick(DESC_PREFIX)} ${n} ${pick(["Club", "Method", "Project", "Studio"])}`,
        `${n} & ${pick(["Steel", "Stride", "Form", "Grit", "Balance"])}`,
      ]);
    }
    if (loc && r() < 0.35) s = `${loc} ${s}`;
    out.add(s.replace(/\s+/g, " ").trim());
  }
  return [...out].slice(0, 12).map((x) => ({
    name: x,
    chars: [...x].length,
    domain: `${x
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "")}.com`,
  }));
}

/* ======================================================== reel scripts */

export type ReelAsk = "follow" | "comment" | "save" | "none";
export type ReelFields = {
  topic: string;
  audience: string;
  point: string;
  number: string;
  keyword: string;
  tone: CapTone;
  ask: ReelAsk;
};

export const REEL_PATTERNS = [
  {
    name: "Belief, then the number",
    purpose: "Reach: corrects the belief your audience started with.",
  },
  {
    name: "Their question, answered",
    purpose: "Saves and messages: the question they were about to ask.",
  },
  { name: "A mistake I made", purpose: "Trust: owning an early error, with a specific detail." },
  { name: "What I tell clients", purpose: "Profile visits: a look inside your coaching." },
  { name: "Two clients, one week", purpose: "Shares: a contrast without the formula." },
  {
    name: "One thing to do today",
    purpose: "Saves and follows: a single small step they can take now.",
  },
] as const;

export function reels(f: ReelFields) {
  const t = clean(f.topic, "protein at breakfast");
  const a = clean(f.audience, "people who lift");
  const p = clean(f.point, "the first meal sets up the rest of the day").replace(/\.$/, "");
  const n = clean(f.number, "30 g of protein by 9am");
  const ask =
    f.ask === "follow"
      ? "Follow for one practical coaching tip a week."
      : f.ask === "comment"
        ? `Comment ${clean(f.keyword, "PLAN").toUpperCase()} and I'll send you the simple version.`
        : f.ask === "save"
          ? "Save this and try it tomorrow."
          : "That's it.";
  const dry = f.tone === "Dry" ? " Thrilling, I know." : "";
  const warm = f.tone === "Warm" ? " You don't need to get it perfect." : "";
  const scripts = [
    [
      `Most ${a} think ${t} doesn't matter much.`,
      `Here's what I see when clients actually try it: ${p}. It sounds like a small detail, but it shapes how the rest of the day goes, and most people notice the difference within a week.${warm}`,
      `The number I use is ${n}. Simple, measurable, repeatable.${dry}`,
      ask,
    ],
    [
      `A client asked me about ${t} this week.`,
      `My answer: ${p}. It sounds small, but it changes the whole day. Once it's in place, the decisions that used to feel hard start to look after themselves.${warm}`,
      `In practice, that means ${n}.`,
      ask,
    ],
    [
      `I coached ${t} badly for my first two years.`,
      `I overcomplicated it, with long lists of rules nobody could follow. What actually works is simpler: ${p}. Clients stick with it because it fits into a normal week.`,
      `Now I start every new client on ${n}.${dry}`,
      ask,
    ],
    [
      `Here's what I tell every new client about ${t}.`,
      `${cap(p)}. Get that right and the rest gets easier. It's the first thing we fix, before we touch anything else in the plan.${warm}`,
      `We start with ${n}, then build from there.`,
      ask,
    ],
    [
      `Two clients, same week, same plan. One sorted ${t}, one didn't.`,
      `The one who did had steadier energy, fewer cravings and better sessions, because ${p}. The other spent the week wondering why nothing was working.`,
      `The difference was ${n}. That's all.${dry}`,
      ask,
    ],
    [
      `One thing to do today for ${t}.`,
      `${cap(p)}, so start there. You don't need a new plan or a new app, just one change you can repeat tomorrow and the day after.${warm}`,
      `Aim for ${n}. Tomorrow, do it again.`,
      ask,
    ],
  ];
  const timing = ["0–3 s · Hook", "3–20 s · Point", "20–25 s · Proof", "25–30 s · Ask"];
  return REEL_PATTERNS.map((pt, i) => {
    const parts = (scripts[i] ?? []).map((text, j) => ({
      label: timing[j] ?? "",
      text,
      words: words(text),
    }));
    const total = parts.reduce((s, x) => s + x.words, 0);
    return {
      ...pt,
      parts,
      words: total,
      seconds: Math.round((total / 150) * 60),
      text: parts.map((x) => `[${x.label}]\n${x.text}`).join("\n\n"),
    };
  });
}

export function reelPrompt(f: ReelFields) {
  return `Write six 30-second talking-head reel scripts for my fitness coaching account.\n\nTopic: ${clean(f.topic, "[topic]")}\nAudience: ${clean(f.audience, "[audience]")}\nThe one point: ${clean(f.point, "[point]")}\nOne real number or client question: ${clean(f.number, "[number]")}\nTone: ${f.tone}\nEnding: ${f.ask}\n\nStructure each script in four timed parts: hook (0–3 s), point (3–20 s), proof (20–25 s), ask (25–30 s), about 75 spoken words in total. Use six patterns: a belief then the number, their question answered, a mistake I made, what I tell clients, two clients in one week, and one thing to do today.\n\nRules: spoken, plain language; no 'stop doing this', no 'unpopular opinion', no 'it's not X, it's Y', no emoji; one idea per script. Show the word count and a read-aloud time for each.`;
}

/* ======================================================== AI writing checker */

export const WRITING_SAMPLE =
  "It's not about the diet. It's about the habits.\n\nIn today's fast-paced world, staying consistent is harder than ever.\n\nTired of starting over every Monday? Sick of stalling? Ready to finally change?\n\nDiscipline, patience, and commitment will unlock your potential. Let's go! You've got this!\n\nIf you'd like, I can send you a plan.";

export const TELL_FIX: Record<string, string> = {
  contrast: "Say what it is, directly. Drop the 'not this, but that' setup.",
  worldopener: "Start with something specific from this week instead of the state of the world.",
  questions: "Ask one question at most, or replace them with a statement of the problem.",
  triple: "Pick the one quality that matters and give an example of it.",
  buzz: "Swap each buzzword for the plain thing you mean: 'lift heavier', 'eat more protein'.",
  cheer: "End on something useful, such as the next step, instead of a pep talk.",
  offer: "Make a clear offer in your own voice, or cut the line.",
  tired: "Describe the situation in the reader's words rather than asking if they're tired of it.",
  signpost: "Cut the throat-clearing and start with the point.",
  imagine: "Show a real example instead of asking them to imagine one.",
  intensifiers: "Remove most intensifiers; the sentence is usually stronger without them.",
  dashes: "Use full stops and commas; a dash every line reads as machine-made.",
  exclaim: "Use full stops. Let the content carry the energy.",
  hedge: "Say it plainly, or leave it out.",
  wrapup: "Stop when you've made the point; no summary needed.",
};

export function rewritePrompt(draft: string) {
  return `Rewrite the draft below so it sounds like me, a fitness coach writing to my own clients and followers.\n\nHere are three things I've written that sound like me:\n1. [paste something you wrote]\n2. [paste something you wrote]\n3. [paste something you wrote]\n\nRules for the rewrite:\n- Keep my meaning and any facts exactly; don't add claims, numbers or results.\n- Start with something specific and concrete, not a general statement about the world.\n- No 'it's not X, it's Y' framing, no stacked questions, no lists of three abstract words.\n- No buzzwords such as unlock, journey, transform, elevate, empower or game-changer.\n- No pep-talk sign-offs and no 'if you'd like, I can' offers.\n- No emoji, no exclamation marks, few dashes.\n- Use short, plain sentences, the way I'd say it out loud.\n- Keep it about the same length or shorter.\n\nGive me the rewrite, then list any line you weren't sure how to keep in my voice.\n\nDraft:\n"""\n${draft.trim()}\n"""`;
}
