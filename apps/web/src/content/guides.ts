/**
 * The guides.
 *
 * Written rather than generated, and kept to things we can say something concrete about:
 * how coaching businesses here actually get clients, why clients quit in week three, and
 * what to charge. Where a claim is ours rather than a measured fact, it is written as
 * ours — "in our experience", "we think" — because a confident unsourced statistic is the
 * fastest way to lose a reader who knows the subject better than we do.
 *
 * `.ai/design/voice.md` applies to every line here.
 */

export type Guide = {
  slug: string;
  title: string;
  /** The index card and the meta description. */
  summary: string;
  /** Read time, in minutes. Counted, not guessed — update it when the body changes. */
  minutes: number;
  sections: { heading: string; paras: string[] }[];
};

export const GUIDES: readonly Guide[] = [
  {
    slug: "first-ten-clients",
    title: "Getting your first ten online coaching clients",
    summary:
      "Where online coaching clients in India actually come from, in what order, and the two things that work before you have any proof.",
    minutes: 7,
    sections: [
      {
        heading: "Start with people who already know you train them",
        paras: [
          "Almost every coach who builds an online practice starts with their offline one. The people who already pay you in a gym are the only prospects you have who have seen you work, and converting one of them costs a conversation rather than a campaign.",
          "The conversation is simpler than it sounds: you are moving the plan, the check-in and the follow-up onto their phone, and keeping the sessions you already do. The price does not have to change in month one. What you are testing is whether the online half works at all, and the fastest way to find out is with somebody who will tell you honestly when it does not.",
          "Three of these is a start. Three people who get a plan on their phone, log it, and come back in a week with numbers is the only proof that matters — and it is also your first three testimonials, with before-and-after photos you have permission to use.",
        ],
      },
      {
        heading: "Then the referral you have to actually ask for",
        paras: [
          "Coaches assume referrals happen. Mostly they do not, because a happy client does not think of themselves as a salesperson and will not mention you unprompted.",
          'Ask once, specifically, at the moment it is easiest to say yes: the week somebody hits a number they are proud of. Not "refer me to anyone" — "is there one person who has asked you what you have been doing?" One name is a far easier request than an open one, and it is the request that gets answered.',
        ],
      },
      {
        heading: "Content, but only one kind",
        paras: [
          "The advice to post daily is given by people who do not coach forty clients. What actually converts, in our experience, is a small number of posts that solve a specific problem for a specific person — what to eat at a wedding, how to train around a bad knee, what a week of Indian vegetarian food at 1,600 calories looks like.",
          "That last one is worth noticing: the posts that travel are the ones nobody else bothers to write because they take real work. A seven-day vegetarian meal plan in katoris is a day's effort and it will bring you clients for a year. A quote card will not.",
          "Post the thing only you would know. You are competing with people who post more than you; you are not competing with people who know your clients better.",
        ],
      },
      {
        heading: "What to skip until you have ten",
        paras: [
          'Paid ads. A logo. A website. A course. A second Instagram account for your "brand". Each of these is a way to feel like you are building a business while not coaching anybody, and all of them are cheaper and easier once you have ten clients telling you what they actually want.',
          "The one exception is the thing a prospect sees when they say yes. If signing up means a WhatsApp conversation, a Google Sheet and a bank transfer screenshot, some number of people will quietly not finish. That is worth fixing early, and it is most of what Traiv is for.",
        ],
      },
    ],
  },
  {
    slug: "why-clients-quit",
    title: "Why clients quit in week three, and what to do about it",
    summary:
      "Nobody cancels because the programme was wrong. They cancel because the week got away from them and nobody noticed. What to watch, and when.",
    minutes: 6,
    sections: [
      {
        heading: "They do not quit. They stop, and then they quit",
        paras: [
          "A cancellation is never the first event. It is the fourth or fifth: a missed session, then two, then a week with no logging, then a week with no message either, and then — often a month later — a WhatsApp saying they have been busy and want to pause.",
          "By the time you get that message there is nothing to do. The coaching relationship ended three weeks earlier, in silence, and the cancellation is paperwork.",
          'Which means the only intervention that works is the one that happens at the gap, not at the cancellation. The question a coach needs answered every morning is not "how is everybody doing" — it is "who has gone quiet".',
        ],
      },
      {
        heading: "The three-week window",
        paras: [
          "Week one is motivation. Week two is habit. Week three is where it meets an actual life — a work trip, a wedding, a child's exam — and the plan loses. That is not a failure of the plan; it is what the third week of anything is.",
          "What separates the clients who come back from the ones who do not is whether somebody said something during that week. Not an automated nudge that reads like software. A sentence that proves you noticed.",
          'In our experience the message that works does not ask them to train. It asks what happened — and it is much easier to answer than "you have missed three sessions".',
        ],
      },
      {
        heading: "Make the first week impossible to fail",
        paras: [
          "Most plans are built for the client the coach wishes they had. Four sessions, sixty minutes, in a gym, starting Monday.",
          "A first week that is three sessions of thirty minutes, with equipment they definitely have, will be completed — and a completed week is the only thing that makes a second week likely. The ambitious programme can start in week two, once the habit exists to carry it.",
          "The same goes for food. A client who is handed a plan requiring four new ingredients will eat it for four days. One built around what is already in their kitchen gets eaten for months.",
        ],
      },
      {
        heading: "What to actually watch",
        paras: [
          "Three signals, in order of how much they tell you: days since their last logged session, days since their last message to you, and whether the last check-in came back. Any one of those crossing a week is worth a sentence from you.",
          "This is the whole reason Traiv's home screen opens on names rather than numbers. A dashboard that tells you your average weekly adherence is 68% is interesting once. A screen that tells you Arjun has not trained in nine days is actionable this morning.",
        ],
      },
    ],
  },
  {
    slug: "pricing-your-coaching",
    title: "How to price online coaching in India",
    summary:
      "Why the number should come from your hours rather than the market, what a discount actually costs you, and how to raise a price without losing the client.",
    minutes: 6,
    sections: [
      {
        heading: "Price from your week, not from Instagram",
        paras: [
          "The most common way coaches set a price is to find out what somebody else charges and sit slightly under it. It feels safe and it is the single most expensive decision in the business, because you have no idea what that person's costs, salary or client count are.",
          "The defensible version works backwards: what you need to earn, how many coaching hours you will actually give, and how long one client genuinely takes. Three numbers you know, producing one you can hold a line on.",
          "Our rate calculator does that arithmetic, and the output is a floor rather than a price — what you must charge for the maths to work at full capacity. Nobody is at full capacity every month, so the working number sits above it.",
        ],
      },
      {
        heading: "What a discount really costs",
        paras: [
          "A 20% discount on a ₹5,000 client is not 20% of your profit. It is 20% of the revenue on a client who takes exactly the same hours as a full-price one — so it comes almost entirely out of what you keep.",
          "It also sets the price for everyone that client talks to. A discount given once privately becomes your rate publicly, usually within a month.",
          "When somebody cannot afford the number, the better answer is a smaller service rather than a smaller price: fewer check-ins, a group instead of one-to-one, a plan without the weekly call. That keeps the rate intact and gives them something real.",
        ],
      },
      {
        heading: "Raising a price without losing the client",
        paras: [
          "Two rules carry most of it. The new price applies to new clients immediately; existing clients get notice and a date. And the message says what changed, not that costs went up.",
          "A client who has been with you a year has seen your coaching get better. Say that, give them six weeks, and offer to lock the old rate for anybody who pays a year up front. In our experience most people stay, and the ones who leave over 15% were already close to leaving.",
          "The thing not to do is raise it quietly and hope nobody checks. They check.",
        ],
      },
      {
        heading: "Count the software as a cost, because it is one",
        paras: [
          "At twenty clients on a per-client platform, software is often the second-largest cost in a coaching business after the coach's own time — and it grows exactly when you do.",
          "Whatever you use, work out what it costs you at the client count you are aiming for rather than the one you have. The number at fifty clients is the one that matters, and on most platforms it is not the number on the pricing page.",
        ],
      },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
