import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Coaching business health check",
  description:
    "Score your coaching business on admin, tools, onboarding, check-ins, retention, pricing, client experience and capacity, and see your biggest leaks.",
  eyebrow: "Free tool · Business check-up",
  h1: "Coaching business health check",
  intro: (
    <>
      <p>
        Answer eight quick questions about how your coaching business runs day to day, from admin
        time and tools to retention, prices and capacity. You'll get a score out of 16, the areas
        costing you the most and a practical fix for each. In most coaching businesses, the biggest
        gains come from fewer wasted hours and fewer lost clients rather than more leads. Your
        answers stay in your browser.
      </p>
    </>
  ),
  shortAnswer: {
    question: "What makes a coaching business healthy?",
    answer: (
      <>
        <p>
          Look beyond revenue at the habits that protect it. A healthy coaching business keeps admin
          under control, uses a small number of tools, onboards and checks in every client the same
          way, keeps clients for many months, reviews prices regularly, gives clients one clear
          place to find everything, and has room to grow. Each area scores 0 to 2, for a total out
          of 16.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why these eight areas",
      body: (
        <>
          <p>
            Coaching businesses rarely fail because the coach doesn't know enough about training or
            nutrition. They struggle because of what surrounds the coaching: hours lost to admin,
            clients who leave after a few months, a scattered client experience, prices that haven't
            moved in years, and a calendar that's full before the business is profitable. The eight
            questions cover the areas that most often decide whether a coaching business grows or
            stalls.
          </p>
          <p>
            Each area is simple to measure and possible to improve within a few weeks. That's what
            makes the check useful: it points to specific changes rather than a vague sense that
            things could be better.
          </p>
        </>
      ),
    },
    {
      heading: "How scoring works",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Area</th>
                  <th scope="col">2 points</th>
                  <th scope="col">1 point</th>
                  <th scope="col">0 points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Admin time</td>
                  <td>Under 3 hours a week</td>
                  <td>3 to 8 hours</td>
                  <td>8+ hours</td>
                </tr>
                <tr>
                  <td>Tools</td>
                  <td>1 to 2</td>
                  <td>3 to 4</td>
                  <td>5 or more</td>
                </tr>
                <tr>
                  <td>Onboarding</td>
                  <td>Structured and consistent</td>
                  <td>A rough checklist</td>
                  <td>Ad hoc</td>
                </tr>
                <tr>
                  <td>Check-ins</td>
                  <td>Structured, easy to scan</td>
                  <td>Freeform but regular</td>
                  <td>Inconsistent</td>
                </tr>
                <tr>
                  <td>Client retention</td>
                  <td>12+ months</td>
                  <td>6 to 12 months</td>
                  <td>Under 6 months</td>
                </tr>
                <tr>
                  <td>Last price rise</td>
                  <td>In the last year</td>
                  <td>1 to 2 years ago</td>
                  <td>Over 2 years or never</td>
                </tr>
                <tr>
                  <td>Client experience</td>
                  <td>One branded app</td>
                  <td>A couple of tools</td>
                  <td>Scattered</td>
                </tr>
                <tr>
                  <td>Capacity</td>
                  <td>Room to grow</td>
                  <td>Near full</td>
                  <td>Over capacity</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The total out of 16 gives a band: 14 or more is strong, 10 to 13 solid, 6 to 9 leaky,
            and under 6 fragile.
          </p>
        </>
      ),
    },
    {
      heading: "How leaks are chosen",
      body: (
        <>
          <p>
            Your biggest leaks are the areas that scored lowest. When several areas tie, the check
            uses a fixed priority: retention first, then capacity, admin, check-ins, onboarding,
            client experience, pricing and tools. Retention comes first because it compounds every
            other number: a business that keeps clients longer needs fewer new ones, earns more from
            each and has more time to improve everything else.
          </p>
          <p>
            The check shows up to three leaks. Fix the first before starting on the second; trying
            to fix everything at once usually means fixing nothing properly.
          </p>
        </>
      ),
    },
    {
      heading: "Retention: the leak that matters most",
      body: (
        <>
          <p>
            If clients stay under six months on average, most of your effort goes into replacing
            them. Retention improves with a strong first 90 days, regular structured check-ins,
            visible progress and personal contact when clients go quiet. Even moving average
            retention from five months to eight increases lifetime value by 60% without a single new
            client.
          </p>
          <p>
            The client churn rate and LTV calculators on this site show what retention is worth in
            your business.
          </p>
        </>
      ),
    },
    {
      heading: "Admin and tools",
      body: (
        <>
          <p>
            Admin hours grow quietly: answering the same questions, chasing check-ins, rebuilding
            plans, scheduling, invoicing. More than eight hours a week is a sign that systems could
            do more. Templates for programmes and common replies, batching check-in reviews and
            automating scheduling and payments can each save hours.
          </p>
          <p>
            Too many tools add to admin. Each extra app is another login for clients, another
            subscription and another place for information to get lost. Consolidating onto fewer
            tools usually makes the business both cheaper and easier to run.
          </p>
        </>
      ),
    },
    {
      heading: "Onboarding and check-ins",
      body: (
        <>
          <p>
            Onboarding sets the tone for the whole coaching relationship. A structured process, with
            a welcome message, intake form, first call, first plan and a set first check-in date,
            makes every new client feel looked after and makes your job easier. Ad hoc onboarding
            means some clients get a great start and others get a forgotten one.
          </p>
          <p>
            Check-ins are where coaching actually happens each week. A short, consistent form with
            the same numbers and questions every time lets you review each client quickly and spot
            changes. Freeform check-ins take longer to read and make trends harder to see.
          </p>
        </>
      ),
    },
    {
      heading: "Pricing",
      body: (
        <>
          <p>
            If you haven't raised your prices in over two years, your real income has probably
            fallen as costs have risen. Reviewing prices every year, against your costs, results and
            demand, keeps your business sustainable. The price increase calculator shows how many
            clients you could lose and still come out ahead.
          </p>
        </>
      ),
    },
    {
      heading: "Client experience",
      body: (
        <>
          <p>
            When clients have to look in three places, a messaging app, a spreadsheet and an email,
            for their plan, logs and feedback, they're more likely to drift. One clear, branded
            place for everything makes coaching feel professional and easy to follow, which supports
            both results and retention.
          </p>
        </>
      ),
    },
    {
      heading: "Capacity",
      body: (
        <>
          <p>
            A full calendar feels like success, but being over capacity means quality slips: slower
            replies, shorter feedback, missed details. If you're near or past capacity, raise prices
            for new clients, start a waiting list or bring in help before quality suffers. The
            client capacity calculator helps estimate your real limit.
          </p>
        </>
      ),
    },
    {
      heading: "Re-checking every quarter",
      body: (
        <>
          <p>
            Run the check every three months. Note your score and leaks, fix the top one, then
            re-check. Over a year, most coaches see their score rise by several points, and the
            improvements usually show up in retention, hours and revenue.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A coach answers: 3 to 8 hours of admin, 3 to 4 tools, a rough onboarding checklist,
            freeform check-ins, clients staying 6 to 12 months, last price rise 1 to 2 years ago, a
            couple of tools for the client experience, and near full. Every answer scores 1, for a
            total of 8: leaky. The top three leaks are retention, capacity and admin.
          </p>
          <p>
            The plan that follows is clear: tighten the first 90 days and check-in follow-up to lift
            retention, review capacity before taking more clients, and batch admin into fixed
            blocks. Three months later, the same coach might score 11 or 12.
          </p>
        </>
      ),
    },
    {
      heading: "Fixing one leak at a time",
      body: (
        <>
          <p>
            It's tempting to fix everything at once, but changes compete for your attention and none
            of them sticks. Choose the top leak, decide one concrete change, and give it four to six
            weeks. For retention, that might be a personal message to every client who misses a
            check-in. For admin, two fixed check-in review blocks a week. Then re-take the check and
            move to the next leak.
          </p>
        </>
      ),
    },
    {
      heading: "Health beyond the score",
      body: (
        <>
          <p>
            The score measures systems, not your skill as a coach or your clients' results. A coach
            with a modest score may still get excellent results; better systems simply let those
            results reach more people with less strain. Use the check as a map of where time and
            money leak out, not as a judgement of your coaching.
          </p>
        </>
      ),
    },
    {
      heading: "Sharing the result with your team",
      body: (
        <>
          <p>
            If you work with an assistant coach or a virtual assistant, take the check together.
            They often see leaks you don't: the check-ins that take longest, the questions clients
            ask most, the tools that cause confusion. Agreeing the top leak together makes the fix
            more likely to stick.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            The check runs entirely in your browser. Your answers aren't stored or sent anywhere, so
            you can answer honestly.
          </p>
        </>
      ),
    },
    {
      heading: "What a strong score looks like in practice",
      body: (
        <>
          <p>
            Coaches who score 14 or more usually share a few habits: they review check-ins in fixed
            blocks, onboard every client the same way, keep clients for a year or more, review
            prices annually, run clients through one app and keep some capacity free. None of these
            needs a large team or a big budget, just consistent systems built over time.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Answer the eight questions honestly, note your top leak and choose one change you can
            start this week. Put a reminder in your calendar to re-take the check in three months.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Put the result to work",
    body: (
      <>
        <p>
          Run the numbers with your own figures, not industry averages. Pull the last three months
          from your payment records and client list: how many clients started, how many left, what
          each paid and what you spent to find them. Real figures make the result specific to your
          business, and they often show that one lever matters far more than the rest.
        </p>
        <p>
          Then change one thing and measure it. Pick the lever the calculator says is worth most,
          set a target for the next month or quarter, and re-run the numbers at the end. A business
          improves the same way a client does: one deliberate change at a time, checked against what
          actually happened.
        </p>
      </>
    ),
  },
  pitch: {
    key: "client-app",
    heading: "Fix several leaks in one place",
    body: (
      <>
        <p>
          In Traiv, plans, nutrition, check-ins and chat sit in one app under your name. Fewer
          tools, a clearer client experience and less admin are often the fastest leaks to close.
        </p>
      </>
    ),
  },
  next: [
    { label: "Client capacity calculator", href: "/tools/client-capacity-calculator" },
    { label: "Client churn rate calculator", href: "/tools/client-churn-rate-calculator" },
    {
      label: "Coaching tool stack cost calculator",
      href: "/tools/coaching-tool-stack-cost-calculator",
    },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "What is a good score?",
      a: "14 or more out of 16 is strong; 10 to 13 is a solid base with a couple of leaks to fix.",
    },
    {
      q: "Which leak should I fix first?",
      a: "The first one listed. Retention usually comes first, because it affects every other number.",
    },
    {
      q: "Is my data saved?",
      a: "No. The check runs in your browser and nothing is stored or sent.",
    },
    {
      q: "How often should I take the check?",
      a: "Every quarter, after fixing the top leak from the previous check.",
    },
  ],
  keepGoing: [
    { label: "The client app in Traiv", href: "/features/client-app" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Run your coaching business on one platform",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
