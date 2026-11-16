/**
 * Words for the reader tools: verdict explanations and the messages coaches can adapt.
 * Original text written for Traiv (ADR 0036). The decision logic lives in
 * `@traiv/calculators/readers`; this file only says things.
 */

import type {
  CheckinVerdict,
  HealthArea,
  LiftVerdict,
  WeightVerdict,
} from "@traiv/calculators/readers";

export type Tone = "warm" | "direct" | "nononsense";
export const TONES: { value: Tone; label: string }[] = [
  { value: "warm", label: "Warm" },
  { value: "direct", label: "Direct" },
  { value: "nononsense", label: "No-nonsense" },
];

/* --------------------------------------------------------- check-in reader */

export const CHECKIN: Record<
  CheckinVerdict,
  { title: string; move: string; lever: string; leave: string; msg: Record<Tone, string> }
> = {
  refer: {
    title: "Refer out before changing the plan",
    move: "Something in the note needs a professional, not a calorie or training change. Reply with care, encourage them to see the right person, and pause any changes until they have.",
    lever: "Point them to a doctor or the relevant professional.",
    leave: "Leave calories, macros and training load exactly as they are this week.",
    msg: {
      warm: "Thanks for being so open in your check-in. Something you mentioned is worth getting checked by a doctor before we change anything, and I'd feel much better knowing you've spoken to someone. Let's keep the plan as it is for now. Look after yourself first, and tell me how you get on.",
      direct:
        "Thanks for the check-in. What you wrote about needs a doctor's view before we adjust anything, so please book an appointment this week. We'll keep the plan unchanged until then. Let me know what they say and we'll go from there.",
      nononsense:
        "Before anything else: please see a doctor about what you mentioned. That comes first. No changes to the plan until you've done that. Send me an update when you have.",
    },
  },
  pullback: {
    title: "Pull back and protect recovery",
    move: "Recovery is the limiting factor this week. Ease training for a few days and keep nutrition steady; pushing harder on poor sleep or high stress rarely brings progress.",
    lever: "Cut training volume by about a third for the next week.",
    leave: "Don't cut calories further while recovery is low.",
    msg: {
      warm: "Thanks for the honest check-in. It sounds like a heavy week, and your body needs a bit more room to recover. Let's take the training down a notch for the next few days: fewer sets, same exercises. Keep eating as planned, aim for an earlier night or two, and we'll build back up once you feel more like yourself.",
      direct:
        "Your sleep and stress numbers tell me recovery is the bottleneck right now. For the next week we'll cut training volume by about a third and keep food the same. Prioritise sleep where you can. We'll reassess at your next check-in.",
      nononsense:
        "Recovery's the problem this week, not effort. Fewer sets for seven days, food stays the same, and get to bed earlier. We'll push again when you're recovered.",
    },
  },
  behaviour: {
    title: "Fix one behaviour, not the numbers",
    move: "The plan hasn't had a fair test yet. Changing calories or training now would treat a consistency gap as a plan problem. Pick one habit to improve this week.",
    lever:
      "Agree one specific, small habit for the week, such as planning tomorrow's meals each evening or booking sessions into the calendar.",
    leave: "Keep calories and training targets unchanged until adherence is back up.",
    msg: {
      warm: "Thanks for checking in, and for being honest about the week. Rather than changing the plan, let's make it easier to follow. What's one thing that would help most this week: planning meals the night before, or putting your sessions in the calendar? Pick one and we'll focus on just that.",
      direct:
        "The plan itself looks right; the gap is consistency. This week, let's focus on one habit only. I'd suggest locking your sessions into your calendar on Sunday. If something else is getting in the way, tell me and we'll tackle that instead.",
      nononsense:
        "We're not changing the plan until it's been followed. One job this week: hit your sessions and log your food every day. Tell me what's getting in the way and we'll fix it.",
    },
  },
  recalculate: {
    title: "Recalculate the plan",
    move: "Adherence and recovery are solid, but weight has moved the wrong way or too fast for several weeks. The plan needs a small, specific adjustment.",
    lever:
      "Adjust daily intake by about 100 to 200 kcal in the right direction, or add 2,000 to 3,000 steps a day.",
    leave:
      "Keep training, protein and meal structure the same so the change is easy to read next time.",
    msg: {
      warm: "You've been really consistent, which is exactly what we needed to see whether the plan is right. It's time for a small tweak. I've adjusted your daily target slightly, and everything else stays the same. Give it two weeks and we'll see how your body responds.",
      direct:
        "Your adherence has been strong for a few weeks, so this is a plan adjustment, not an effort problem. I've changed your daily calories by a small amount; training and protein stay the same. We'll review the trend in two weeks.",
      nononsense:
        "You've done your part. The numbers need adjusting, so I've made one small change to your calories. Everything else stays. Two weeks, then we look again.",
    },
  },
  hold: {
    title: "Hold the plan",
    move: "Everything is moving as it should. Keep doing exactly what you're doing.",
    lever: "Nothing to change this week.",
    leave: "Everything.",
    msg: {
      warm: "Great check-in. Everything's moving the way we want, so we'll keep the plan exactly as it is. Keep doing what you're doing.",
      direct: "Good week. The plan is working, so no changes. Keep going.",
      nononsense: "On track. No changes. Keep going.",
    },
  },
  push: {
    title: "Hold the plan and push training",
    move: "Weight is moving at a good pace and adherence and recovery are solid. Keep nutrition steady and look for a small progression in training.",
    lever: "Add a rep or a little load to the main lifts where form allows.",
    leave: "Keep calories and meal structure as they are.",
    msg: {
      warm: "This is a really solid week: you're consistent, you're recovering well and the numbers are moving in the right direction. We'll keep your nutrition exactly as it is. In training, see if you can add a rep or a little weight to your main lifts while keeping good form. Keep it up.",
      direct:
        "Good week across the board. Nutrition stays the same. In training, aim to add a rep or a small amount of weight on your main lifts this week, as long as form stays solid.",
      nononsense:
        "Everything's working. Food stays the same. Add a rep or a little weight to your main lifts this week.",
    },
  },
  "too-early": {
    title: "Too early to change anything",
    move: "The plan is new. Early weeks are dominated by water, food volume and routine changes. Give it at least two more weeks before adjusting.",
    lever: "Nothing to change yet; keep collecting consistent data.",
    leave: "Calories, macros and training all stay the same.",
    msg: {
      warm: "Thanks for the check-in. It's still early days on this plan, and the scale tends to bounce around for the first couple of weeks while your body adjusts. Let's keep everything the same for now and look at the trend after a couple more weeks.",
      direct:
        "It's too early to judge this plan. The first weeks are mostly water and routine changes. We'll keep everything the same and review after two more weeks of data.",
      nononsense: "Too soon to read. Nothing changes. Two more weeks, then we look.",
    },
  },
};

/* --------------------------------------------------------- churn risk */

export const CHURN: Record<
  "low" | "watch" | "high" | "exit",
  { title: string; move: string; msg: Record<Tone, string> }
> = {
  low: {
    title: "Low risk",
    move: "Nothing urgent. Keep the rhythm going and notice wins out loud; that's what keeps a steady client steady.",
    msg: {
      warm: "Just wanted to say you've been really consistent lately, and it shows. I'm enjoying seeing your progress. Is there anything you'd like to focus on next?",
      direct:
        "Quick note: your consistency has been excellent. Is there a next goal you'd like to set while things are going well?",
      nononsense: "Good work lately. What's the next target?",
    },
  },
  watch: {
    title: "Worth a personal check-in",
    move: "A few signals have slipped. Reach out personally this week, ask an open question and listen before suggesting changes.",
    msg: {
      warm: "Hey, I noticed things have been a bit quieter lately, and I wanted to check in properly rather than just send the usual. How are you finding the plan at the moment? If anything isn't working, I'd much rather know so we can adjust it.",
      direct:
        "I've noticed a few things slipping over the last couple of weeks. How's the plan fitting into life right now? If something needs to change, tell me and we'll fix it this week.",
      nononsense: "Things have slipped a bit. What's getting in the way? Let's sort it this week.",
    },
  },
  high: {
    title: "High risk",
    move: "This client is likely close to leaving. Contact them today, personally, with a short message that invites an honest answer. Offer a call.",
    msg: {
      warm: "Hi, I've been thinking about you and wanted to reach out. It feels like things have been tough lately, and that's completely normal. Could we have a quick call this week to look at what's working and what isn't? No pressure, I just want to make sure the coaching is still helping you.",
      direct:
        "I can see the last few weeks have been harder. I'd like to have a 15-minute call to reset the plan around what's realistic for you right now. Does tomorrow or Thursday work?",
      nononsense:
        "It's been a rough few weeks. Let's get on a short call and reset the plan. When works for you?",
    },
  },
  exit: {
    title: "They're telling you they want out",
    move: "The note says they're thinking of stopping. Answer that directly and respectfully: acknowledge it, offer an honest option such as a pause or a lighter plan if it would genuinely help, and make leaving easy if that's what they want.",
    msg: {
      warm: "Thanks for telling me, I really appreciate the honesty. If it's a money or time thing, we could pause for a month or switch to a lighter plan. And if you've decided to stop, that's completely fine; I'll send you a plan to keep going on your own. Just let me know what feels right.",
      direct:
        "Thanks for being upfront. Two options if they help: a short pause, or a lighter plan at a lower cost. If you'd rather stop, that's fine too, and I'll make sure you leave with a plan you can follow. What would you prefer?",
      nononsense:
        "Understood. You can pause, drop to a lighter plan, or stop, and I'll send you a plan to keep going. Your call.",
    },
  },
};

/* --------------------------------------------------------- business health */

export const HEALTH_QUESTIONS: {
  area: HealthArea;
  q: string;
  options: [string, string, string];
}[] = [
  {
    area: "admin",
    q: "Time on admin each week (check-ins, messaging, scheduling)",
    options: ["Under 3 hrs", "3–8 hrs", "8+ hrs"],
  },
  {
    area: "tools",
    q: "Separate tools or apps you use to run coaching",
    options: ["1–2", "3–4", "5 or more"],
  },
  {
    area: "onboarding",
    q: "Your client onboarding",
    options: ["Structured and consistent", "A rough checklist", "Ad hoc, from memory"],
  },
  {
    area: "checkins",
    q: "Your weekly check-ins",
    options: ["Structured, easy to scan", "Freeform but regular", "Inconsistent"],
  },
  {
    area: "retention",
    q: "How long your average client stays",
    options: ["12+ months", "6–12 months", "Under 6 months"],
  },
  {
    area: "pricing",
    q: "Last time you raised your rates",
    options: ["In the last year", "1–2 years ago", "Over 2 years ago, or never"],
  },
  {
    area: "experience",
    q: "Where clients see their plan, logs and messages",
    options: ["One branded app", "A couple of tools", "DMs, spreadsheets, scattered"],
  },
  {
    area: "capacity",
    q: "Your current capacity",
    options: ["Room to grow", "Near full", "Over capacity, dropping balls"],
  },
];

export const HEALTH_FIX: Record<HealthArea, { leak: string; fix: string }> = {
  retention: {
    leak: "Clients leave too soon",
    fix: "Retention compounds everything else. Add a structured first 90 days, a monthly progress review and a personal message whenever a client misses a check-in.",
  },
  capacity: {
    leak: "You're near or past capacity",
    fix: "Work out your real capacity, then raise prices for new clients, start a waiting list or bring in help before quality slips.",
  },
  admin: {
    leak: "Admin is eating your week",
    fix: "Batch check-in reviews, use templates for plans and common replies, and move scheduling and payments into tools that run without you.",
  },
  checkins: {
    leak: "Check-ins are hard to read",
    fix: "Use the same short check-in form for every client, with numbers and a few fixed questions, so you can review each one in minutes.",
  },
  onboarding: {
    leak: "Onboarding depends on memory",
    fix: "Write a one-page onboarding checklist: welcome message, intake form, first call, first plan, first check-in date. Use it for every client.",
  },
  experience: {
    leak: "The client experience is scattered",
    fix: "Move plans, logs, check-ins and messages into one place clients can find easily. Fewer places to look means fewer reasons to drift.",
  },
  pricing: {
    leak: "Your prices are out of date",
    fix: "Review your rate against your costs and results. Raise it for new clients now and for existing clients after a notice period.",
  },
  tools: {
    leak: "Too many tools",
    fix: "List every tool and what it does. Consolidate overlapping ones; each extra app is another login for clients and another subscription for you.",
  },
};

export const HEALTH_BAND = {
  strong: "A strong, well-run business. Keep reviewing it each quarter so small leaks don't grow.",
  solid: "A solid base with a couple of leaks worth fixing. Start with the first one below.",
  leaky:
    "Several leaks are costing you time, clients or money. Fix the first one before adding anything new.",
  fragile:
    "The business is stretched. Focus on one leak at a time, starting with the first below, before growing further.",
} as const;

/* --------------------------------------------------------- lift progression */

export const LIFT: Record<
  LiftVerdict,
  {
    title: string;
    read: string;
    move: Record<"novice" | "intermediate" | "advanced", string>;
    msg: string;
  }
> = {
  progressing: {
    title: "Progressing",
    read: "Estimated strength is rising faster than the normal session-to-session bounce.",
    move: {
      novice: "Keep the same progression. Add load session to session while reps and form hold.",
      intermediate: "Keep the progression going. Small weekly load increases are working.",
      advanced: "Keep the block going and protect recovery; progress this steady is worth riding.",
    },
    msg: "Your {lift} is moving in the right direction, steadily and above the normal ups and downs. We'll keep the same progression. Keep the form tight and keep logging every set.",
  },
  wobble: {
    title: "A session wobble",
    read: "The overall trend is up, but the last session dipped. One flat day inside a rising trend is normal.",
    move: {
      novice: "Repeat the last weight next session rather than backing off.",
      intermediate:
        "Repeat the weight next session. If it dips again, check sleep, food and stress.",
      advanced: "Treat it as noise. Repeat the session and look at recovery if it happens twice.",
    },
    msg: "Don't worry about the last session on your {lift}. The trend over the last few weeks is still up, and one off day is normal. We'll repeat that weight next time.",
  },
  stall: {
    title: "A genuine stall",
    read: "Estimated strength has stayed within the normal bounce across several sessions.",
    move: {
      novice:
        "Check technique, sleep and food first. If those are fine, take a slightly smaller jump or add a set.",
      intermediate:
        "Change the driver: switch rep range, add a set, or swap to a close variation for a few weeks.",
      advanced:
        "Plan a short deload, then start a new block with a different rep range or variation.",
    },
    msg: "Your {lift} has levelled off over the last few sessions. That's normal at some point, and it's a signal to change something rather than push harder. I'm adjusting the plan for the next few weeks to get it moving again.",
  },
  grinding: {
    title: "Grinding",
    read: "Load has gone up but reps have fallen, so estimated strength is flat. You're adding weight faster than strength is building.",
    move: {
      novice: "Drop back to the last weight you hit for all reps and build again in smaller steps.",
      intermediate: "Hold the load until reps recover, or switch to smaller increments.",
      advanced:
        "Pull the load back 5 to 10% and rebuild with a rep target rather than a load target.",
    },
    msg: "On your {lift}, the weight's gone up but the reps have come down, so the extra load isn't adding strength yet. We'll take a small step back and build up again with smaller jumps.",
  },
  regressing: {
    title: "Regressing",
    read: "Estimated strength is falling by more than the normal bounce.",
    move: {
      novice:
        "Check recovery, technique and pain. Lower the load and rebuild; if anything hurts, get it assessed.",
      intermediate: "Take a deload week and review sleep, food and stress before the next block.",
      advanced:
        "Deload, review recovery and the overall training load, and plan the next block conservatively.",
    },
    msg: "Your {lift} has dipped over the last few sessions, which usually means fatigue is building. We'll take a lighter week to recover, then rebuild. Let me know if anything hurts, and how you've been sleeping.",
  },
};

/* --------------------------------------------------------- weight trend */

export const WEIGHT: Record<WeightVerdict, { title: string; lever: string; msg: string }> = {
  "on-track": {
    title: "On track",
    lever: "Nothing to change. The trend is where it should be.",
    msg: "Your weight trend is moving at a good pace. The daily ups and downs are just water and food, and the overall direction is right. We'll keep everything the same.",
  },
  noise: {
    title: "Mostly noise so far",
    lever: "Hold the plan and collect two more weeks of consistent weigh-ins.",
    msg: "The scale's bounced around, but there isn't enough data yet to see a real trend through the normal ups and downs. Keep weighing in the same way and we'll read it again in a couple of weeks.",
  },
  stall: {
    title: "A genuine stall",
    lever:
      "If adherence is solid, reduce daily intake by about 150 kcal or add 2,000 to 3,000 steps a day. If adherence is the issue, fix that first.",
    msg: "Your weight has been flat for a few weeks now, beyond the normal day-to-day noise. It's time for a small adjustment, so I've made one change to the plan. Give it two weeks and we'll see how it moves.",
  },
  "too-fast": {
    title: "Moving too fast",
    lever: "Add about 100 to 200 kcal a day to protect muscle, energy and training.",
    msg: "You're moving faster than we need, and going this quickly risks losing muscle and energy. I'm adding a little more food to keep you progressing at a pace you can sustain.",
  },
  recomp: {
    title: "Recomposition: the tape is moving",
    lever:
      "Hold the plan. The scale is flat, but your waist or strength says body composition is changing.",
    msg: "The scale looks flat, but your waist and strength tell a better story: you're losing fat and holding or building muscle at the same time. That's a great result. We'll keep the plan as it is.",
  },
  water: {
    title: "Probably water",
    lever:
      "Hold the plan. Cycle timing, salt, carbs or travel can mask fat loss for a week or more.",
    msg: "The scale's up a little, but timing explains most of it: water shifts around your cycle, salty meals or travel can add a kilo or more for a few days. Keep going as planned and we'll look again next week.",
  },
  "too-slow-gain": {
    title: "Not gaining",
    lever: "Add about 150 to 200 kcal a day, ideally from carbohydrates around training.",
    msg: "Your weight hasn't moved up over the last few weeks, so we're not quite in a surplus yet. I'm adding a little more food each day. Keep training hard and we'll check the trend in two weeks.",
  },
  drifting: {
    title: "Drifting from maintenance",
    lever: "Adjust daily intake by about 100 to 150 kcal to bring the trend back to flat.",
    msg: "Your weight has been drifting slowly over the last few weeks. It's a small change, so I'm making a small adjustment to bring it back to where we want it.",
  },
};

/* --------------------------------------------------------- difficult clients */

export const DIFFICULT: {
  value: string;
  label: string;
  boundary: string;
  move: string;
  msg: string;
  refer?: string;
}[] = [
  {
    value: "messaging",
    label: "Messages at all hours",
    boundary: "Clear response hours, agreed at the start.",
    move: "Restate your reply times kindly, explain why, and stick to them. Reply during your hours, not at midnight.",
    msg: "I love that you're so engaged, and I want to give every message proper attention. I reply between 9am and 6pm on weekdays, so if something comes in after that, I'll get back to you the next working day. If anything's urgent, put 'urgent' at the start and I'll look sooner.",
  },
  {
    value: "unrealistic",
    label: "Wants faster results",
    boundary: "Honest timelines based on evidence, not promises.",
    move: "Acknowledge the frustration, show what's already changed, and explain a realistic pace.",
    msg: "I completely understand wanting it to happen faster. Looking at the last few weeks, you've already made real progress: your trend is moving and your training is stronger. A pace like this is the one that lasts. If we push faster, we usually lose muscle and energy and it's harder to keep. Let's look at your numbers together on your next check-in.",
  },
  {
    value: "notdoing",
    label: "Not doing the work",
    boundary:
      "Coaching works when the plan is followed; the plan should be realistic enough to follow.",
    move: "Ask what's getting in the way without blame, then simplify the plan.",
    msg: "I've noticed the last couple of weeks have been tricky to stick to, and that's okay. Rather than pushing harder, let's make the plan fit your life better. What's been the biggest thing getting in the way? We can strip it back to one or two priorities for now.",
  },
  {
    value: "refund",
    label: "Wants a refund",
    boundary: "Your refund terms, applied fairly and consistently.",
    move: "Listen to the reason, check your terms, and respond calmly and clearly. If the request is fair, honour it.",
    msg: "Thanks for letting me know, and I'm sorry the coaching hasn't felt right. Could you tell me a bit more about what hasn't worked? I'll look at it against the terms we agreed and get back to you by [day] with what I can do.",
  },
  {
    value: "discount",
    label: "Wants a discount",
    boundary: "One price for the same service; a lighter option if budget is the issue.",
    move: "Hold the price, and offer a smaller package rather than a cheaper version of the same one.",
    msg: "I really appreciate you asking. To keep things fair for everyone, I don't discount the full coaching. If budget is the main thing, I do have a lighter option with programming and fortnightly check-ins at a lower price. Would that work better for you right now?",
  },
  {
    value: "comparing",
    label: "Compares you to another coach",
    boundary: "Your approach, explained with confidence and without criticising others.",
    move: "Explain why you do what you do, and invite their questions.",
    msg: "That's a fair question. Different coaches do things differently, and there's more than one way to get results. I take this approach because [reason], and it suits your goals and schedule. If there's something specific you'd like to try, let's talk about it and see whether it fits.",
  },
  {
    value: "scopecreep",
    label: "Wants extra, free",
    boundary: "What's included is written down; extras are priced.",
    move: "Remind them what's included, and offer the extra as a paid add-on or an upgrade.",
    msg: "Happy to help with that. It's a bit outside what's included in your current plan, which covers [what's included]. I can add it as a one-off for [price], or we could move you to the plan that includes it as standard. Which would you prefer?",
  },
  {
    value: "ghosting",
    label: "Ghosted, now back",
    boundary: "A warm welcome back, with a clear restart.",
    move: "Don't mention the gap critically. Welcome them back and agree a simple restart.",
    msg: "Great to hear from you. Life gets busy, and there's no need to explain. Let's start fresh: I'll set up an easier first week so you can get back into the rhythm, and we'll build from there. When would you like to begin?",
  },
  {
    value: "venting",
    label: "Off-loading a personal crisis",
    boundary: "Kindness and support, within the limits of coaching.",
    move: "Listen and respond with empathy. If it sounds serious, encourage professional support and share where to find it.",
    msg: "I'm really sorry you're going through this, and thank you for trusting me with it. Please don't worry about the plan this week; looking after yourself comes first. It might really help to talk to someone who can support you properly, like your doctor or a counsellor. I'm here when you're ready to pick things back up.",
    refer:
      "If they mention harming themselves or being in danger, encourage them to contact local emergency services or a crisis line straight away.",
  },
  {
    value: "disrespect",
    label: "Rude or inappropriate",
    boundary: "Respectful communication, both ways, is a condition of coaching.",
    move: "Stay calm, name the behaviour once, and say what happens if it continues. End the coaching if it does.",
    msg: "I want to keep working with you, and for that to happen our messages need to stay respectful on both sides. The last message crossed that line. If it happens again, I'll need to end our coaching. I'm happy to talk through whatever's frustrating you.",
    refer:
      "For harassment, threats or anything that makes you feel unsafe, stop contact, keep a record and seek advice.",
  },
];

/* --------------------------------------------------------- sales objections */

export const OBJECTIONS: {
  value: string;
  label: string;
  reframe: string;
  say: string;
  follow: string;
}[] = [
  {
    value: "price",
    label: "Too expensive",
    reframe:
      "Usually means they're not yet sure the result is worth the price, or they're comparing with something cheaper that isn't the same.",
    say: "That's fair, it's a real investment. Can I ask what you're comparing it with? What you get is a plan built around your schedule, weekly check-ins where I adjust things, and support between them. If the full coaching isn't right for your budget right now, I also have a lighter option.",
    follow:
      "No pressure at all. Would it help if I sent you a summary of exactly what's included, so you can compare it properly?",
  },
  {
    value: "think",
    label: "Need to think about it",
    reframe: "Often a polite way of saying a question hasn't been answered yet.",
    say: "Of course, it's a big decision. So I can help, what's the main thing you're weighing up: the cost, the time, or whether it'll work for you?",
    follow:
      "Take the time you need. I'll check back on [day]; if any questions come up before then, just message me.",
  },
  {
    value: "time",
    label: "No time right now",
    reframe:
      "Usually means they imagine coaching takes more time than it does, or they're worried about failing again.",
    say: "Totally understandable. Most of my clients are busy too, so the plan is built around the time you actually have, even if that's three 40-minute sessions a week. How much time could you realistically give it?",
    follow:
      "If now really isn't the time, that's fine. Would it help if I checked in again in a month?",
  },
  {
    value: "partner",
    label: "Need to ask my partner",
    reframe:
      "A real step for many people, especially with shared finances. Help them have the conversation.",
    say: "That makes complete sense. Would it help if I sent a short summary of what we talked about and what's included, so you can share it with them?",
    follow:
      "Happy to answer any questions they have too. Shall I follow up on [day] to see where you've landed?",
  },
  {
    value: "later",
    label: "I'll start after [event]",
    reframe: "Sometimes genuine timing, often a way of delaying a decision that feels big.",
    say: "That's fine, and it's good to plan around it. A lot of people find it helps to start before, even gently, so the habits are in place when life gets back to normal. Would a lighter start until then work for you?",
    follow:
      "If you'd rather wait, let's pencil in a date now so it doesn't slip. Shall I hold a spot for [date]?",
  },
  {
    value: "tried",
    label: "Tried coaching before",
    reframe: "They're worried about wasting money again. Find out what went wrong.",
    say: "I'm glad you mentioned it. What didn't work last time? Knowing that helps me show you what would be different here, and be honest if I'm not the right fit either.",
    follow:
      "Thanks for sharing that. Based on what you've told me, here's how I'd handle it differently: [specific]. Does that sound like what you were missing?",
  },
  {
    value: "diy",
    label: "I can do it myself",
    reframe: "Sometimes true. Often they know what to do but struggle to do it consistently.",
    say: "You might well be able to, and plenty of people do. What coaching adds is a plan that adapts each week, someone to keep you accountable, and help through the tricky weeks. How has going it alone worked for you so far?",
    follow:
      "If you'd like to try on your own first, that's a good plan. My door's open if you want support later.",
  },
  {
    value: "doubt",
    label: "Not sure it'll work for me",
    reframe: "They want reassurance that someone like them can succeed.",
    say: "That's a really common worry. I've worked with people in very similar situations, such as [example]. The plan starts from where you are now, not where you think you should be. What makes you feel it might not work?",
    follow:
      "Would it help to see what the first two weeks would look like for you, so you can judge for yourself?",
  },
  {
    value: "info",
    label: "Just send me the info",
    reframe: "Often a way to end the conversation politely. Send it, but make the next step clear.",
    say: "Absolutely, I'll send it straight over. So I send the right things, what matters most to you: what's included, the price, or how it works week to week?",
    follow:
      "Here's everything we talked about. The best next step is a quick 15-minute call to answer any questions. Would [day] work?",
  },
];

/* --------------------------------------------------------- scope of practice */

export type ScopeCall = "refer" | "clearance" | "lane";

export const SCOPE: {
  value: string;
  label: string;
  call: ScopeCall;
  what: string;
  message: string;
  note: string;
}[] = [
  {
    value: "healthy-training",
    label: "Healthy adult, general training",
    call: "lane",
    what: "Squarely in your lane. Screen with a health questionnaire at the start and coach as normal.",
    message:
      "Thanks for filling in the health questionnaire. Everything looks good to start, so I'll put your first plan together. If anything about your health changes, let me know.",
    note: "Health questionnaire completed; no flags. Coaching general training.",
  },
  {
    value: "healthy-nutrition",
    label: "Healthy adult, general nutrition and habits",
    call: "lane",
    what: "In your lane for general healthy eating guidance and habits. Stay away from diagnosing or treating conditions.",
    message:
      "Great, we'll focus on building habits around regular meals, protein and portions that fit your goals and schedule.",
    note: "General nutrition and habit coaching; no medical conditions disclosed.",
  },
  {
    value: "beginner",
    label: "Deconditioned beginner starting out",
    call: "lane",
    what: "In your lane. Screen carefully, start conservatively and build gradually. Refer if the questionnaire flags anything.",
    message:
      "We'll start gently and build up over the first few weeks. If anything feels wrong, such as pain, dizziness or unusual breathlessness, stop and let me know straight away.",
    note: "Beginner; health questionnaire completed; conservative start.",
  },
  {
    value: "pregnancy",
    label: "Pregnant or postpartum",
    call: "clearance",
    what: "Proceed only with clearance from their midwife or doctor, and adapt training to their guidance and stage.",
    message:
      "Congratulations. Before we change your training, please check with your midwife or doctor that you're cleared for exercise, and ask if there's anything they'd like you to avoid. Once you have that, we'll build a plan around it.",
    note: "Pregnant/postpartum. Clearance requested from midwife or doctor before programming.",
  },
  {
    value: "glp1",
    label: "On a GLP-1 / weight-loss medication",
    call: "clearance",
    what: "Coach training and habits alongside their prescriber's guidance. Don't advise on the medication itself.",
    message:
      "Thanks for letting me know. I'll focus on strength training and protein to help protect muscle, and on habits that support you. Any questions about the medication, dose or side effects are best taken to your prescriber.",
    note: "On weight-loss medication; coaching training and habits only; medication questions referred to prescriber.",
  },
  {
    value: "older-adult",
    label: "Older adult with health issues",
    call: "clearance",
    what: "Get clearance from their doctor, find out any restrictions, and adapt the plan.",
    message:
      "Before we start, please check with your doctor that you're cleared for the type of exercise we discussed, and whether there's anything to avoid. Once I have that, I'll tailor your plan around it.",
    note: "Older adult with health conditions; GP clearance requested.",
  },
  {
    value: "controlled-condition",
    label: "Controlled chronic condition (e.g. cleared diabetes/BP)",
    call: "clearance",
    what: "Proceed within the clearance and any guidance from their healthcare team. Monitor and refer if anything changes.",
    message:
      "Thanks for the clearance from your doctor. We'll work within their guidance. If anything changes, such as readings, medication or how you feel during sessions, let me know straight away.",
    note: "Controlled condition; written clearance received; coaching within guidance.",
  },
  {
    value: "return-injury",
    label: "Returning from an assessed, cleared injury",
    call: "clearance",
    what: "Work within the physiotherapist's or doctor's guidance. Build back gradually and stop if symptoms return.",
    message:
      "Good to have you back. Could you share any guidance from your physio about what to avoid or include? We'll build up gradually, and if any pain returns, stop and let me know.",
    note: "Returning from assessed injury; clinician guidance requested; gradual progression.",
  },
  {
    value: "undiagnosed-pain",
    label: "Undiagnosed or worsening pain",
    call: "refer",
    what: "Refer out now. Pause the painful movements until a clinician has assessed it.",
    message:
      "I'd like you to get that pain checked by a physio or doctor before we train it further. Let's leave out anything that aggravates it for now, and once you've been assessed, we'll plan around their advice.",
    note: "Undiagnosed pain reported; referred to physio/GP; painful movements paused.",
  },
  {
    value: "disordered-eating",
    label: "Disordered-eating signs or history",
    call: "refer",
    what: "Refer to their doctor or a specialist service. Avoid calorie targets, weighing and restrictive advice until a professional is involved.",
    message:
      "Thank you for trusting me with that. I want to make sure you get the right support, and I think speaking to your doctor or a specialist would really help. Let's take the focus off numbers for now and keep training enjoyable while you do that.",
    note: "Possible disordered eating; referred to GP/specialist; calorie and weight targets removed.",
  },
  {
    value: "therapeutic-diet",
    label: "Wants a diet to treat a disease",
    call: "refer",
    what: "Refer to a registered dietitian or their doctor. Treating disease through diet is outside a coach's scope.",
    message:
      "That's a really important goal, and it needs someone qualified to plan diets for medical conditions. A registered dietitian or your doctor is the right person. I'm happy to support the training and general habits alongside their advice.",
    note: "Therapeutic diet requested; referred to registered dietitian/GP.",
  },
  {
    value: "mental-health",
    label: "Significant mental-health concern",
    call: "refer",
    what: "Encourage professional support. Keep coaching supportive and low-pressure if appropriate, and share crisis contacts if there's any risk.",
    message:
      "I'm really glad you told me. It sounds like it would help to talk to someone who can support you properly, like your doctor or a counsellor. Training can still be part of your week if you'd like, at whatever level feels right.",
    note: "Mental health concern raised; encouraged to see GP or counsellor.",
  },
  {
    value: "acute-medical",
    label: "Acute / uncontrolled medical issue",
    call: "refer",
    what: "Stop and refer now. No training until a doctor has cleared them.",
    message:
      "Please speak to a doctor about this before we do any more training. If it's urgent, contact your local emergency services. Your health comes first, and we'll pick things back up once you've been seen.",
    note: "Acute medical issue reported; training paused; referred to doctor.",
  },
  {
    value: "meds-supplements",
    label: "Asking for medication / supplement advice",
    call: "refer",
    what: "Refer medication questions to their doctor or pharmacist. Share only general, well-established supplement information, and suggest they check it with a professional.",
    message:
      "That's a great question for your doctor or pharmacist, who can check it against your health and any other medication. I'm happy to talk about training and food habits alongside whatever they advise.",
    note: "Medication/supplement question; referred to doctor/pharmacist.",
  },
];

export const SCOPE_LABEL: Record<ScopeCall, string> = {
  refer: "Refer out now",
  clearance: "Proceed only with clearance",
  lane: "In your lane",
};
