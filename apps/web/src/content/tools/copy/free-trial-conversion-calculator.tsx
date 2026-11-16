import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Free trial conversion calculator for coaches",
  description:
    "Calculate trial-to-paid conversion, new monthly revenue, payback on ad spend and what a two-point lift in conversion is worth for a coaching business.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Free trial conversion calculator",
  intro: (
    <>
      <p>
        Enter trials started, trials that convert, your monthly price, churn and ad spend. See your
        conversion rate, the new monthly revenue it adds, how quickly the ad spend pays back and
        what a small lift in conversion would be worth.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate free trial conversion rate?",
    answer: (
      <>
        <p>
          Divide trials that become paying clients by trials started. If 10 of 40 trials convert,
          that is 25%. At €300 a month, those 10 clients add €3,000 in monthly revenue. With €1,600
          of ad spend, each paying client cost €160, repaid in about half a month.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why trials are worth measuring",
      body: (
        <>
          <p>
            A free or low-cost trial lets people experience your coaching before committing. Done
            well, it brings in clients who already know what they are paying for, which can improve
            retention. Done badly, it fills your week with people who were never going to pay.
          </p>
          <p>
            The conversion rate, trials that become paying clients divided by trials started,
            separates the two. It is the multiplier on every trial you fill, so even small
            improvements have large effects.
          </p>
        </>
      ),
    },
    {
      heading: "The calculation",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Measure</th>
                  <th scope="col">Formula</th>
                  <th scope="col">Default</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Conversion rate</td>
                  <td>Converted ÷ trials</td>
                  <td>10 ÷ 40 = 25%</td>
                </tr>
                <tr>
                  <td>New monthly revenue</td>
                  <td>Converted × price</td>
                  <td>10 × €300 = €3,000</td>
                </tr>
                <tr>
                  <td>Cost per paying client</td>
                  <td>Ad spend ÷ converted</td>
                  <td>€1,600 ÷ 10 = €160</td>
                </tr>
                <tr>
                  <td>Payback</td>
                  <td>Cost per client ÷ price</td>
                  <td>€160 ÷ €300 ≈ 0.5 months</td>
                </tr>
                <tr>
                  <td>A 2-point lift</td>
                  <td>Trials × 2% × price</td>
                  <td>40 × 0.02 × €300 = €240 a month</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The calculator also estimates the lifetime value of each month's new clients from your
            churn rate: new monthly revenue ÷ churn. At 5% churn, €3,000 of new revenue is worth
            about €60,000 over the life of those clients.
          </p>
        </>
      ),
    },
    {
      heading: "A second example",
      body: (
        <>
          <p>
            A coach starts 60 trials a month and converts 9, a 15% rate. At €300, that is €2,700 of
            new monthly revenue. With €1,600 of ad spend, each client costs about €178. Raising
            conversion to 20% would add 3 clients and €900 a month from the same ads.
          </p>
          <p>
            This coach brings in more trials than the first but converts fewer of them. Before
            spending more on ads, improving the trial experience would likely bring a better return.
          </p>
        </>
      ),
    },
    {
      heading: "Designing a trial that converts",
      body: (
        <>
          <ul>
            <li>
              <strong>Set a clear length:</strong> 7 to 14 days is common. Long enough to feel
              progress, short enough to keep urgency.
            </li>
            <li>
              <strong>Deliver a quick win:</strong> a first plan, a first check-in and a clear next
              step in the first few days.
            </li>
            <li>
              <strong>Talk to them:</strong> a short welcome message and a mid-trial check-in make
              the trial feel personal.
            </li>
            <li>
              <strong>Explain what comes next:</strong> price, what's included and how to continue,
              before the trial ends.
            </li>
            <li>
              <strong>Ask for the decision:</strong> invite them to continue in the last few days,
              rather than waiting for them to decide.
            </li>
          </ul>
          <p>
            A trial that feels like real coaching converts better than one that feels like a sample.
          </p>
        </>
      ),
    },
    {
      heading: "Free, paid or deposit?",
      body: (
        <>
          <p>
            Free trials bring the most sign-ups but often the lowest conversion, because there is no
            commitment. Low-cost paid trials, for example a small fee for the first two weeks, bring
            fewer sign-ups but more serious people. Some coaches take a deposit that counts toward
            the first month if the client continues.
          </p>
          <p>
            Test one approach at a time and compare not only conversion rate but cost per paying
            client and how long those clients stay. A model that converts slightly fewer but keeps
            them longer may be worth more.
          </p>
        </>
      ),
    },
    {
      heading: "Churn after the trial",
      body: (
        <>
          <p>
            Clients who convert from a trial sometimes leave sooner than clients who signed up
            directly, because some converted on impulse. Track churn for trial clients separately
            for a few months. If they leave quickly, the trial may be attracting the wrong people or
            promising something the full coaching doesn't deliver.
          </p>
          <p>
            The churn input in the calculator feeds the lifetime value estimate. A lower churn rate
            makes each converted trial worth much more.
          </p>
        </>
      ),
    },
    {
      heading: "When trials aren't the right model",
      body: (
        <>
          <p>
            Trials suit online coaching where the experience can be shown quickly. They suit
            high-ticket, transformation-focused programmes less well, where the value comes over
            months and a short trial may not show it. In those cases, a strong discovery call, a
            clear guarantee or a short paid starter programme often works better.
          </p>
          <p>
            Trials also take time to run. Each trial client needs onboarding and attention. Make
            sure you have capacity before running a large trial campaign.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking trial performance",
      body: (
        <>
          <p>
            Track for each trial: start date, source, whether they engaged in the first three days,
            whether they had a check-in, and whether they converted. After a month or two, look for
            patterns. Trials that engage early convert far more often, which tells you to focus on
            the first few days.
          </p>
          <p>
            Compare conversion by source too. Trials from referrals often convert at much higher
            rates than those from cold ads.
          </p>
        </>
      ),
    },
    {
      heading: "The first three days",
      body: (
        <>
          <p>
            What happens in the first three days of a trial predicts conversion more than anything
            else. Clients who receive their plan, complete a first workout or check-in, and get a
            personal message from you in that window are far more likely to continue. Clients who
            sign up and hear nothing for days often never engage.
          </p>
          <ol>
            <li>Day 1: a welcome message and their first plan.</li>
            <li>Day 2: a quick check that they've started, with a tip.</li>
            <li>Day 3: a short check-in on how it's going.</li>
          </ol>
          <p>
            Automating parts of this, while keeping a personal touch, keeps early engagement high
            without taking hours.
          </p>
        </>
      ),
    },
    {
      heading: "Conversion by trial length",
      body: (
        <>
          <p>
            Longer trials give people more time to see results, but they also delay revenue and let
            urgency fade. Shorter trials keep momentum but may not show enough value. Many coaches
            find 7 to 14 days the sweet spot.
          </p>
          <p>
            Test lengths if you are unsure. Compare not only conversion rate but cost per paying
            client and how long converted clients stay. The best trial length is the one that
            produces the most long-term clients for the effort.
          </p>
        </>
      ),
    },
    {
      heading: "Turning the trial end into a conversation",
      body: (
        <>
          <p>
            In the last few days of a trial, invite the client to a short review call or message
            exchange. Look back at what they've done, show their progress, and explain how full
            coaching continues from here. Then ask clearly if they would like to continue.
          </p>
          <p>
            Clients who have a conversation at the end of a trial convert at much higher rates than
            those who simply receive a reminder email. It also gives you useful feedback from those
            who don't continue.
          </p>
        </>
      ),
    },
    {
      heading: "Free trial or money-back guarantee?",
      body: (
        <>
          <p>
            Some coaches replace trials with a guarantee: clients pay from the start, but can get a
            refund within a set period if it isn't right for them. This brings in more committed
            clients and avoids the work of trials that never convert. It also signals confidence in
            the coaching.
          </p>
          <p>
            Guarantees and trials both reduce risk for the client. Choose the one that fits your
            offer and test it against the other if you're unsure.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: a monthly trial review",
      body: (
        <>
          <p>
            Each month, enter trials, conversions, price, churn and ad spend into the calculator.
            Note your conversion rate and cost per paying client. Look at which trials converted and
            what they had in common. Make one change to the trial experience and compare next
            month's numbers.
          </p>
          <p>
            Over a few months, small, focused changes to onboarding and the end-of-trial
            conversation usually lift conversion more than increasing ad spend.
          </p>
        </>
      ),
    },
    {
      heading: "Common trial mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>No onboarding:</strong> trial clients who don't start in the first days rarely
              convert.
            </li>
            <li>
              <strong>No ask:</strong> waiting for clients to decide on their own loses many who
              would have continued.
            </li>
            <li>
              <strong>Too many trials at once:</strong> quality drops when you can't give each
              person attention.
            </li>
            <li>
              <strong>A trial that doesn't match the full product:</strong> clients who convert
              expecting something different leave quickly.
            </li>
          </ul>
          <p>Fixing these is often the quickest way to a higher conversion rate.</p>
        </>
      ),
    },
    {
      heading: "Trials and capacity",
      body: (
        <>
          <p>
            Forty trials a month means forty new people to onboard, guide and talk to. If each needs
            an hour across the trial, that is ten hours a week on trials alone. Check your client
            capacity before scaling trial volume. A smaller number of well-run trials often produces
            more clients than a flood of trials you can't support properly.
          </p>
        </>
      ),
    },
    {
      heading: "Lifetime value of each cohort",
      body: (
        <>
          <p>
            The calculator estimates what each month's converted clients are worth over their
            lifetime, based on churn. At €3,000 of new monthly revenue and 5% churn, that cohort is
            worth about €60,000. At 10% churn, it is worth €30,000. Halving churn doubles the value
            of every trial you convert, which is why retention and conversion should be improved
            together.
          </p>
          <p>
            Compare that lifetime value with the ad spend that produced it. €1,600 of ads producing
            €60,000 of lifetime revenue is an excellent return, even before improving anything.
          </p>
        </>
      ),
    },
    {
      heading: "Reading a low conversion rate",
      body: (
        <>
          <p>
            If conversion is low, ask the people who didn't continue why. Common answers are price,
            timing, not seeing enough progress, or the trial feeling impersonal. Each points to a
            different fix: clearer pricing upfront, better onboarding, a quick early win, or more
            personal contact. Even a handful of answers is usually enough to see a pattern.
          </p>
        </>
      ),
    },
    {
      heading: "What to say at the end of a trial",
      body: (
        <>
          <p>
            A simple structure works well: remind them of their goal, show what they did and what
            changed, explain how full coaching continues, state the price and what's included, and
            ask whether they'd like to continue. Keep it personal and honest. If the coaching isn't
            right for them, say so and point them elsewhere; that honesty builds your reputation and
            often brings referrals later.
          </p>
        </>
      ),
    },
    {
      heading: "A quick summary",
      body: (
        <>
          <ul>
            <li>
              <strong>Conversion</strong> = converted ÷ trials.
            </li>
            <li>
              <strong>New monthly revenue</strong> = converted × price.
            </li>
            <li>
              <strong>Payback</strong> = (ad spend ÷ converted) ÷ price.
            </li>
            <li>
              <strong>Cohort value</strong> = new monthly revenue ÷ churn.
            </li>
            <li>
              <strong>Levers:</strong> the first three days, the end-of-trial conversation and churn
              after conversion.
            </li>
          </ul>
          <p>
            Improve onboarding first, then the ask, then scale trials once conversion is reliable.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring engagement during the trial",
      body: (
        <>
          <p>
            Conversion is the result; engagement is the leading indicator. Track simple signals
            during each trial: did they open the plan, log a workout, reply to messages, complete a
            check-in? Clients who do three or more of these in the first week convert far more often
            than those who do none.
          </p>
          <p>
            Use these signals to step in early. A client who hasn't logged anything by day three
            might need a quick personal message, a simpler first workout or a short call. A few
            minutes at the right moment often turns a silent trial into a paying client.
          </p>
        </>
      ),
    },
    {
      heading: "Pricing the continuation",
      body: (
        <>
          <p>
            The price after the trial should be clear from the start. Clients who discover the price
            only at the end feel surprised, and surprise lowers conversion. State the price on the
            sign-up page and in the welcome message, along with what continues: the plan, check-ins
            and messaging.
          </p>
          <p>
            Some coaches offer a small incentive for continuing straight after the trial, such as a
            reduced first month. Use this carefully. It can lift conversion, but if it attracts
            clients who leave once the price rises, it lowers lifetime value. Track how long
            incentive clients stay before keeping the offer.
          </p>
        </>
      ),
    },
    {
      heading: "Following up with trials that didn't convert",
      body: (
        <>
          <p>
            People who finish a trial without continuing aren't a lost cause. Ask them briefly why,
            thank them, and, with permission, add them to your email list. Some return weeks or
            months later when timing suits. A short message a month after the trial, sharing a
            useful tip and a gentle invitation, often brings a few back.
          </p>
          <p>
            Their answers to 'why not?' are also the best guide to improving the trial. Patterns
            across a few months show exactly what to change.
          </p>
        </>
      ),
    },
    {
      heading: "Trials for in-person coaching",
      body: (
        <>
          <p>
            In-person trainers often offer a free first session rather than a multi-day trial. The
            same principles apply: make the first session feel like real coaching, show a quick win,
            explain the plan from here, state the price and ask for the decision. Track
            first-session conversion the same way as trial conversion to see how it improves.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing trial sources",
      body: (
        <>
          <p>
            Trials from different sources convert very differently. A referral who starts a trial
            already trusts you; a stranger from a cold ad doesn't. Split the calculator inputs by
            source: run it once for referral trials, once for ad trials, once for social trials. The
            comparison shows where trial spend works hardest and which sources need a different
            first step, such as a call before the trial rather than straight sign-up.
          </p>
        </>
      ),
    },
    {
      heading: "When to stop offering trials",
      body: (
        <>
          <p>
            If conversion stays low after several rounds of improvement, or trial clients
            consistently leave within a couple of months, a trial may not suit your offer. Many
            coaches switch to a paid starter programme or a guarantee at that point and find both
            conversion and retention improve.
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
    heading: "Make the trial feel like real coaching",
    body: (
      <>
        <p>
          A trial converts when it feels like the real thing. In Traiv, trial clients get the same
          branded app as paying clients, with their plan, check-ins and messages from day one.
        </p>
      </>
    ),
  },
  next: [
    {
      label: "Customer acquisition cost calculator",
      href: "/tools/customer-acquisition-cost-calculator",
    },
    { label: "Discovery call calculator", href: "/tools/discovery-call-calculator" },
    { label: "Client churn rate calculator", href: "/tools/client-churn-rate-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "What is a good free trial conversion rate for coaching?",
      a: "It varies with the offer and lead source. Track your own rate and focus on improving it rather than comparing with others.",
    },
    {
      q: "How long should a coaching trial last?",
      a: "Commonly 7 to 14 days: long enough to show value, short enough to keep urgency.",
    },
    {
      q: "Should my trial be free or paid?",
      a: "Free brings more sign-ups; paid brings more committed people. Compare cost per paying client and retention for each.",
    },
    {
      q: "Why do trial clients sometimes leave quickly?",
      a: "Some convert on impulse. Track their churn separately, and make sure the trial represents the full coaching honestly.",
    },
    {
      q: "How does churn affect the result?",
      a: "It sets the lifetime value of each converted client. Lower churn makes each conversion worth more.",
    },
    {
      q: "What is payback on ad spend?",
      a: "How many months a paying client takes to repay what you spent to win them: cost per paying client ÷ monthly price.",
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
