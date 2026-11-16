import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Coaching platform fit finder",
  description:
    "Answer six quick questions about your coaching, clients, app, payments and market, and get one honest platform recommendation with the reasons.",
  eyebrow: "Free tool · Honest recommendation",
  h1: "Which coaching platform fits you?",
  intro: (
    <>
      <p>
        Six quick questions, one honest suggestion. Tell us what you coach, how many clients you
        have, whether you want a branded app, how you want payments handled, how you want to start
        and where you work. You'll get the platform that fits best, the reasons and a second option.
        Sometimes it's Traiv. Often it won't be: for clinical practice, workout-only coaching or
        testing on a free plan, it names the better option.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I choose a coaching platform?",
    answer: (
      <>
        <p>
          Start with what you coach and where: clinical or insurance-based work needs a
          practice-management tool, while training and nutrition coaches need strong programme and
          meal-plan builders. Then consider client count and pricing model, whether you want a
          branded app, how payments work and whether you want to test for free first.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why one answer, not a ranking",
      body: (
        <>
          <p>
            Comparison lists often rank every platform, which leaves you to work out which one suits
            you. The fit finder does the opposite: it asks about your situation and suggests the one
            platform most likely to fit, with the reasons, plus a second option. It's built to be
            honest, so it recommends other platforms when they're a better match than Traiv.
          </p>
        </>
      ),
    },
    {
      heading: "The six questions",
      body: (
        <>
          <ol>
            <li>
              <strong>What do you coach?</strong> Training, nutrition, both, or wellness and habits.
            </li>
            <li>
              <strong>How big is your client list?</strong> Just starting, growing or established.
            </li>
            <li>
              <strong>Do you want a branded client app?</strong> Yes, nice to have, or no.
            </li>
            <li>
              <strong>Payments in your own account?</strong> Keeping control, or happy with a
              platform account.
            </li>
            <li>
              <strong>How do you want to start?</strong> Free to test first, or a paid all-in-one.
            </li>
            <li>
              <strong>Where and how do you work?</strong> EU or global coaching, or US clinical and
              insurance work.
            </li>
          </ol>
          <p>
            The last question changes the answer most, because clinical work needs very different
            software.
          </p>
        </>
      ),
    },
    {
      heading: "How the suggestion is made",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">If you…</th>
                  <th scope="col">The finder suggests</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Work in US clinical or insurance settings</td>
                  <td>Practice Better, a practice-management platform for practitioners</td>
                </tr>
                <tr>
                  <td>Coach wellness and habits</td>
                  <td>Practice Better, with Everfit as a second option</td>
                </tr>
                <tr>
                  <td>Coach training and don't need a branded app</td>
                  <td>Hevy Coach, workout-first through the Hevy app</td>
                </tr>
                <tr>
                  <td>Want to start free and coach nutrition</td>
                  <td>Practice Better's free Sprout plan</td>
                </tr>
                <tr>
                  <td>Want to start free otherwise</td>
                  <td>Everfit's free Starter plan</td>
                </tr>
                <tr>
                  <td>Have an established roster</td>
                  <td>Kahunas, whose per-seat price falls as you grow</td>
                </tr>
                <tr>
                  <td>Want a paid all-in-one with branding</td>
                  <td>Traiv, with PT Distinction as a second option</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These rules are deliberately simple and transparent. Every reason shown comes from the
            vendors' pricing pages, checked on 16 November 2026.
          </p>
        </>
      ),
    },
    {
      heading: "Clinical and insurance work",
      body: (
        <>
          <p>
            Dietitians, therapists and other practitioners working within healthcare systems often
            need features most fitness platforms don't offer, such as clinical notes, intake forms
            built for practice and, in some markets, insurance billing. A practice-management
            platform is usually a better fit. The finder suggests Practice Better here and asks you
            to confirm it covers the specific clinical features you need.
          </p>
        </>
      ),
    },
    {
      heading: "Workout-first coaching",
      body: (
        <>
          <p>
            If you coach training only and your clients are happy using a general workout app, a
            workout-first platform can be simple and affordable. Hevy Coach coaches clients through
            the Hevy app, at USD 25 a month for up to 10 clients and USD 50 for up to 25. It doesn't
            offer a branded app, which only matters if you want one.
          </p>
        </>
      ),
    },
    {
      heading: "Starting for free",
      body: (
        <>
          <p>
            Free tiers let you test a platform with a few real clients before paying. Everfit's
            Starter plan is free for up to 5 clients, Practice Better's Sprout plan for up to 3 and
            HubFit's Free plan for up to 2. Traiv offers a 14-day free trial of the full Trainer
            plan. Testing with real clients tells you far more than a demo.
          </p>
        </>
      ),
    },
    {
      heading: "Branded client apps",
      body: (
        <>
          <p>
            A branded app puts your name and logo in front of clients every day. Traiv includes your
            name and logo on the Trainer plan. PT Distinction includes custom-branded iOS and
            Android apps on Pro and Master. Everfit and TrueCoach include branding on their higher
            plans. Others sell it as an add-on or not at all. The platform cost calculator shows the
            branding position for each.
          </p>
        </>
      ),
    },
    {
      heading: "Payments",
      body: (
        <>
          <p>
            How client payments work varies between platforms and changes over time: some connect to
            your own payment account, others process payments through the platform. If keeping
            payments in your own account matters, ask each platform exactly how payments and payouts
            work before committing.
          </p>
        </>
      ),
    },
    {
      heading: "Testing before you move",
      body: (
        <>
          <p>
            Before moving all your clients, try the suggested platform with two or three of them for
            a few weeks. Rebuild one programme, run a few check-ins and ask those clients how they
            find the app. A platform that looks right on paper can feel very different in daily use,
            for you and for your clients.
          </p>
        </>
      ),
    },
    {
      heading: "When Traiv is the suggestion",
      body: (
        <>
          <p>
            The finder suggests Traiv when you coach training, nutrition or both, want a paid
            all-in-one rather than a free tier, aren't working in US clinical settings, don't yet
            have an established roster of 60 or more, and want a branded app. Traiv's Trainer plan,
            at ₹999 a month, covers workout plans, diet plans and check-ins with your name and logo
            in the client app, and it's priced in rupees.
          </p>
        </>
      ),
    },
    {
      heading: "When another platform is better",
      body: (
        <>
          <p>
            If you work in US clinical or insurance settings, a practice-management platform will
            suit you better than any fitness coaching app. If you only coach training and don't care
            about branding, a workout-first app may be simpler and cheaper. If you want to test for
            free with a few clients, a free tier is a sensible start. If you have a large roster,
            per-seat pricing can be very economical. The finder points you to these options when
            they fit.
          </p>
        </>
      ),
    },
    {
      heading: "The second option",
      body: (
        <>
          <p>
            Every suggestion includes a second option, because no single platform suits everyone
            perfectly. If the first suggestion doesn't feel right after a trial, the second is a
            good next step. Shortlisting two platforms and testing both with a few clients is often
            the quickest way to decide.
          </p>
        </>
      ),
    },
    {
      heading: "Questions to ask in a trial",
      body: (
        <>
          <ul>
            <li>How long does it take to build a programme or meal plan?</li>
            <li>How easy is it for clients to log workouts and food?</li>
            <li>How quickly can you review a check-in and reply?</li>
            <li>Do clients find the app easy to use?</li>
            <li>What does it cost at your client count in a year's time?</li>
          </ul>
          <p>Answering these with real clients tells you more than any comparison table.</p>
        </>
      ),
    },
    {
      heading: "Thinking about growth",
      body: (
        <>
          <p>
            Choose a platform that suits your next year as well as today. If you plan to add a group
            programme, hire an assistant coach or double your client count, check how the platform
            handles those changes and what it will cost. The platform cost calculator compares
            prices at any client count.
          </p>
        </>
      ),
    },
    {
      heading: "Training, nutrition or both",
      body: (
        <>
          <p>
            Coaches who programme training only need a strong workout builder, an exercise library
            with demonstrations and easy logging for clients. Nutrition coaches need meal plans,
            recipes, food logging and check-ins focused on habits. Coaches who do both benefit most
            from one platform that handles both well, so plans, logs and check-ins live in the same
            app. The finder weighs your answer to the first question heavily for this reason.
          </p>
        </>
      ),
    },
    {
      heading: "Client count and pricing",
      body: (
        <>
          <p>
            If you're just starting, a free tier or a low flat price keeps costs down while you
            build. If you're growing, look at how the price changes between 15 and 60 clients. If
            you're established, per-seat pricing or plans with high client limits often work out
            cheapest per client. The platform cost calculator shows each platform's price at any
            client count.
          </p>
        </>
      ),
    },
    {
      heading: "Starting fresh versus switching",
      body: (
        <>
          <p>
            If you're choosing your first platform, you can pick on fit alone. If you're switching,
            weigh the move itself: rebuilding programmes, moving client data and helping clients
            onto a new app. A platform that fits slightly better may not be worth a disruptive move.
            If you're mostly happy where you are, it may be better to stay and use the finder again
            when your needs change.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>The finder runs in your browser. Your answers aren't stored or sent anywhere.</p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A coach who programmes both training and nutrition, has 15 to 60 clients, wants a
            branded app, prefers to keep payments in their own account, wants a paid all-in-one and
            coaches outside US clinical settings gets Traiv as the suggestion, with PT Distinction
            as the second option. Change the market to US clinical and the suggestion becomes
            Practice Better. Change the start to free and it becomes Everfit's free Starter plan.
          </p>
        </>
      ),
    },
    {
      heading: "Confirm before you commit",
      body: (
        <>
          <p>
            Prices, plans and features change. Every reason shown comes from vendor pages checked on
            16 November 2026, but always open the vendor's pricing page and start a trial before
            moving clients. The platform cost calculator links each vendor's page with its check
            date.
          </p>
        </>
      ),
    },
    {
      heading: "Why the market question matters",
      body: (
        <>
          <p>
            Coaching in a healthcare setting, especially in the US where insurance billing is
            common, needs software built for clinical practice: notes, intake, compliance and
            billing features most fitness platforms don't have. Coaching outside those settings
            usually needs strong programme and nutrition tools, check-ins, messaging and a good
            client app instead. That's why the finder changes its answer so much on the last
            question.
          </p>
        </>
      ),
    },
    {
      heading: "Branded app: yes, nice to have or no",
      body: (
        <>
          <p>
            If you answer yes or nice to have, the finder leans towards platforms that include
            branding on the plan you'd use, such as Traiv's Trainer plan or PT Distinction's Pro
            plan. If you answer no and coach training only, it can suggest a workout-first app such
            as Hevy Coach, where clients use the standard Hevy app. Branding isn't essential for
            every coach, but for many it helps clients see the coaching as part of your business.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Answer the six questions honestly for where your business is now, note the suggestion
            and the second option, and open both pricing pages. Start a trial with the one that fits
            best, rebuild one real programme and invite two clients to try it for two weeks.
          </p>
        </>
      ),
    },
    {
      heading: "Coaching both training and nutrition",
      body: (
        <>
          <p>
            Coaches who handle both training and nutrition often run into the biggest stack problem:
            one app for workouts, another for meal plans and a third for check-ins. A platform that
            covers both in one place saves time and gives clients a single app to follow. That's one
            reason the finder leans towards an all-in-one for this answer, when a branded app and a
            paid start are also chosen.
          </p>
        </>
      ),
    },
    {
      heading: "Group and online programmes",
      body: (
        <>
          <p>
            If most of your income comes from group programmes or self-led plans, check how each
            platform handles groups: shared programmes, group messaging or community features, and
            pricing when many clients join at once. The finder's suggestions focus on one-to-one
            coaching; for group-heavy businesses, compare group features directly on each vendor's
            site.
          </p>
        </>
      ),
    },
    {
      heading: "Revisit as you grow",
      body: (
        <>
          <p>
            Your answers will change as your business does. A coach who starts with a free plan may
            want a branded all-in-one a year later; a growing roster may make per-seat pricing
            attractive. Take the finder again whenever your client count, offer or market changes.
          </p>
        </>
      ),
    },
    {
      heading: "Honest by design",
      body: (
        <>
          <p>
            The finder only recommends Traiv when it genuinely fits. In most other combinations of
            answers, it points you elsewhere, with the reasons and the vendor's pricing page.
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
    heading: "One app for the whole coaching relationship",
    body: (
      <>
        <p>
          Traiv's Trainer plan is ₹999 a month: workout plans, diet plans, check-ins and your name
          and logo in the client app, in one place. Start with the 14-day free trial.
        </p>
      </>
    ),
  },
  next: [
    {
      label: "Coaching platform cost calculator",
      href: "/tools/coaching-platform-cost-calculator",
    },
    {
      label: "Coaching tool stack cost calculator",
      href: "/tools/coaching-tool-stack-cost-calculator",
    },
    { label: "Coaching business health check", href: "/tools/coaching-business-health-check" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "Is the fit finder biased towards Traiv?",
      a: "It's built to be honest. It recommends Traiv only for coaches who want a paid all-in-one with branding, and suggests other platforms in every other case.",
    },
    {
      q: "Where do the facts come from?",
      a: "From each vendor's pricing page, checked on 16 November 2026. Confirm current details with the vendor.",
    },
    {
      q: "What if I coach both training and nutrition?",
      a: "You'll usually want one platform that handles both well, with a programme builder and meal plans in the same app.",
    },
    {
      q: "Should I choose a platform with a free plan?",
      a: "If you're just starting or want to test, a free plan or trial is a good way to check fit with real clients.",
    },
    {
      q: "Does a branded app matter?",
      a: "For many coaches, yes: clients see it every day, and it makes the coaching feel like your business.",
    },
    { q: "Is anything stored?", a: "No. The finder runs in your browser and nothing is saved." },
  ],
  keepGoing: [
    { label: "Traiv pricing", href: "/pricing" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Run your coaching business on one platform",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
