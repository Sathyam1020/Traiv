import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Coaching package pricing calculator",
  description:
    "Price 4-week, 12-week and 24-week coaching packages from your target hourly rate, delivery time per client and a commitment discount ladder.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Coaching package pricing calculator",
  intro: (
    <>
      <p>
        Enter the revenue you want per delivery hour, the time each client takes each week and the
        extras you include. Set discounts for 12 and 24-week commitments and see each package's
        price, monthly equivalent, client saving and revenue per hour.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I price a coaching package?",
    answer: (
      <>
        <p>
          Start from delivery time. At €60 an hour and 0.75 hours a week per client, a 4-week block
          is €60 × 0.75 × 4 = €180. A 12-week package at a 10% discount is €486, about €175 a month,
          and €54 per delivery hour. A 24-week package at 15% off is €918, about €166 a month.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Pricing from time, not guesswork",
      body: (
        <>
          <p>
            Many coaches set package prices by looking at what others charge, then adjusting by
            feel. That can work, but it often leads to packages that underpay the coach for the time
            they take, especially once check-ins, messaging and meal plans are added. Pricing from
            delivery time makes the link between price and work explicit.
          </p>
          <p>
            The approach is simple: decide what you want to earn for each hour of delivery, estimate
            how many hours a client takes each week, and multiply. Then offer discounts for longer
            commitments, so clients who commit for longer pay a little less per month, and you get
            stability in return.
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
                  <th scope="col">Package</th>
                  <th scope="col">Formula</th>
                  <th scope="col">Default</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>4-week block</td>
                  <td>Rate × hours per week × 4</td>
                  <td>€60 × 0.75 × 4 = €180</td>
                </tr>
                <tr>
                  <td>12-week package</td>
                  <td>Rate × hours × 12 × (1 − 10%)</td>
                  <td>€540 × 0.9 = €486</td>
                </tr>
                <tr>
                  <td>24-week package</td>
                  <td>Rate × hours × 24 × (1 − 15%)</td>
                  <td>€1,080 × 0.85 = €918</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The monthly equivalent spreads each package over months (price ÷ weeks × 4.33). The
            client saving is the difference from paying the full rate. Revenue per hour is the
            package price ÷ total delivery hours, which falls as the discount grows.
          </p>
        </>
      ),
    },
    {
      heading: "Counting delivery time honestly",
      body: (
        <>
          <p>
            Delivery time includes everything you do for a client each week, not just calls. The
            calculator separates it into core coaching time, such as calls and programming, and
            extras:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Part of delivery</th>
                  <th scope="col">Default time per week</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Core coaching: calls and programming</td>
                  <td>0.40 hours (24 minutes)</td>
                </tr>
                <tr>
                  <td>Weekly check-in review</td>
                  <td>0.15 hours (9 minutes)</td>
                </tr>
                <tr>
                  <td>Meal plan and nutrition</td>
                  <td>0.10 hours (6 minutes)</td>
                </tr>
                <tr>
                  <td>Messaging and support</td>
                  <td>0.10 hours (6 minutes)</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td>0.75 hours (45 minutes)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Time a typical week for a few clients to check your estimates. Many coaches find
            messaging takes far more time than they assumed, which is a common reason packages feel
            underpriced.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing a target hourly rate",
      body: (
        <>
          <p>
            Your target rate should cover your pay, business costs, tax and time that isn't
            billable, such as marketing and admin. The coaching rate calculator on this site works
            this out from your income goal and hours. If you're unsure, start with that figure, then
            compare package prices with your market to see if they're realistic.
          </p>
          <p>
            A rate of €60 an hour of delivery doesn't mean €60 for every hour you work. Much of your
            week goes on non-delivery tasks, so the delivery rate has to be higher than your
            effective hourly pay.
          </p>
        </>
      ),
    },
    {
      heading: "The commitment discount ladder",
      body: (
        <>
          <p>
            Longer packages help both sides. Clients get a lower monthly price and more time to see
            results. You get predictable income, fewer onboarding cycles and better retention. A
            discount of 5 to 15% for 12 weeks and slightly more for 24 weeks is common.
          </p>
          <p>
            The discount has a cost: your revenue per hour falls. In the default example, it eases
            from €60 on the 4-week block to €54 on 12 weeks and €51 on 24 weeks. That trade is
            usually worth it, because longer clients cost less to acquire and onboard, and they
            refer more.
          </p>
        </>
      ),
    },
    {
      heading: "A higher-rate example",
      body: (
        <>
          <p>
            At €80 an hour with 1 hour of delivery a week, a 4-week block is €320, about €347 a
            month. A 12-week package at 10% off is €864, about €312 a month, saving the client €96.
            A 24-week package at 15% off is €1,632, about €295 a month, saving €288. Revenue per
            hour is €80, €72 and €68.
          </p>
          <p>
            This shape suits premium coaching with more support, such as weekly calls and detailed
            nutrition. The same discount ladder applies; the base rate and delivery time set the
            level.
          </p>
        </>
      ),
    },
    {
      heading: "Removing extras",
      body: (
        <>
          <p>
            Untick an extra to see what a lighter package would cost. Without meal plans and with
            lighter messaging, for example, delivery time falls and so does price. This is a useful
            way to design tiers: a basic package with programming and check-ins, a standard package
            with nutrition, and a premium package with calls and unlimited messaging.
          </p>
          <p>
            Price each tier from its own delivery time, so the premium tier pays for the extra work
            it involves.
          </p>
        </>
      ),
    },
    {
      heading: "Presenting packages to clients",
      body: (
        <>
          <ul>
            <li>
              <strong>Lead with outcomes,</strong> not hours: what they'll achieve and how you'll
              support them.
            </li>
            <li>
              <strong>Show the monthly equivalent</strong> alongside the package price, so it's easy
              to compare.
            </li>
            <li>
              <strong>Highlight the saving</strong> for longer packages.
            </li>
            <li>
              <strong>Recommend one option</strong> based on their goals, rather than leaving them
              to choose alone.
            </li>
            <li>
              <strong>Explain what happens at the end:</strong> renewal, a next phase or a
              maintenance option.
            </li>
          </ul>
          <p>
            Clients rarely think in delivery hours. The hours are for your pricing; the outcomes are
            for the conversation.
          </p>
        </>
      ),
    },
    {
      heading: "Upfront or monthly payments?",
      body: (
        <>
          <p>
            Packages can be paid upfront or split into monthly payments. Upfront payment improves
            cash flow and commitment. Monthly payments make longer packages more accessible. Some
            coaches offer a small extra discount for paying upfront.
          </p>
          <p>
            Whatever you choose, make the terms clear: what happens if a client wants to pause,
            leave early or extend. Clear terms prevent difficult conversations later.
          </p>
        </>
      ),
    },
    {
      heading: "Checking prices against the market",
      body: (
        <>
          <p>
            Once you have prices from delivery time, compare them with coaches offering similar
            services in your market. If your prices are much lower, you may be underestimating your
            rate or overestimating your efficiency. If they're much higher, check whether your
            delivery time is unusually high and whether some of it could be streamlined.
          </p>
          <p>
            Your price doesn't have to match others. If your results, experience or service justify
            a higher price, charge it; the calculator shows what that price represents in your time.
          </p>
        </>
      ),
    },
    {
      heading: "Reviewing prices regularly",
      body: (
        <>
          <p>
            Revisit package pricing every six to twelve months. Re-time your delivery for a few
            clients, update your target rate for rising costs and income goals, and re-run the
            calculator. If prices need to rise, the price increase calculator shows how many clients
            you can lose and still come out ahead.
          </p>
        </>
      ),
    },
    {
      heading: "Package structures coaches use",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Structure</th>
                  <th scope="col">How it works</th>
                  <th scope="col">Suits</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rolling monthly</td>
                  <td>Pay month to month, cancel anytime</td>
                  <td>Clients wary of commitment; ongoing coaching</td>
                </tr>
                <tr>
                  <td>Fixed blocks</td>
                  <td>4, 12 or 24 weeks paid upfront or in instalments</td>
                  <td>Goal-based coaching with a clear timeline</td>
                </tr>
                <tr>
                  <td>Tiered</td>
                  <td>Basic, standard and premium with different support levels</td>
                  <td>A range of budgets and needs</td>
                </tr>
                <tr>
                  <td>Hybrid</td>
                  <td>A fixed starting block, then rolling monthly</td>
                  <td>New clients who need commitment early on</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The calculator prices fixed blocks, but the same delivery-time approach works for any
            structure. Price each tier from its own delivery time and add a discount for commitment
            where it fits.
          </p>
        </>
      ),
    },
    {
      heading: "Designing tiers from delivery time",
      body: (
        <>
          <p>A three-tier structure might look like this, all at €60 an hour of delivery:</p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Tier</th>
                  <th scope="col">What's included</th>
                  <th scope="col">Hours per week</th>
                  <th scope="col">4-week price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic</td>
                  <td>Programming and fortnightly check-in</td>
                  <td>0.35</td>
                  <td>€84</td>
                </tr>
                <tr>
                  <td>Standard</td>
                  <td>Programming, weekly check-in, messaging</td>
                  <td>0.65</td>
                  <td>€156</td>
                </tr>
                <tr>
                  <td>Premium</td>
                  <td>All of standard, plus nutrition and a fortnightly call</td>
                  <td>1.10</td>
                  <td>€264</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Pricing each tier from its own time keeps the premium tier from being underpriced for
            the extra work, and gives clients a clear reason to choose a higher tier.
          </p>
        </>
      ),
    },
    {
      heading: "Delivery time can fall with good systems",
      body: (
        <>
          <p>
            Templates, a programme library, standard check-in forms and saved messages for common
            questions can cut delivery time per client without making coaching feel generic. If
            delivery time falls from 0.75 to 0.6 hours a week, your revenue per hour rises from €60
            to €75 at the same package price.
          </p>
          <p>
            That's not a reason to cut prices. It's a reason to invest in systems that free time for
            more clients or better service.
          </p>
        </>
      ),
    },
    {
      heading: "What happens when clients use more time",
      body: (
        <>
          <p>
            Some clients take far more time than average: frequent messages, many questions, complex
            plans. If a large share of clients do, your real revenue per hour falls below target.
            Set clear expectations about response times and what's included, and consider a premium
            tier for clients who want more contact.
          </p>
          <p>
            Track time for a few of your most demanding clients. If they consistently take twice the
            average, a premium tier at twice the price may be fairer for everyone.
          </p>
        </>
      ),
    },
    {
      heading: "Package length and results",
      body: (
        <>
          <p>
            Longer packages often lead to better results, because clients have more time to build
            habits and get past early plateaus. A 12-week package gives enough time for visible
            change in strength, body composition or fitness. A 24-week package allows for a full
            phase of progress and a review.
          </p>
          <p>
            Linking package length to realistic timelines for the client's goal helps them choose. A
            client who wants to lose 10 kg sustainably needs months, not weeks; a 24-week package
            fits that goal far better than four weeks.
          </p>
        </>
      ),
    },
    {
      heading: "Renewals",
      body: (
        <>
          <p>
            Plan what happens at the end of each package. A review call, a summary of progress and a
            clear offer for the next phase make renewal natural. Many coaches offer the same
            commitment discount for renewals, so clients who continue keep their lower monthly rate.
            Renewals are much cheaper than finding new clients.
          </p>
        </>
      ),
    },
    {
      heading: "Pricing for in-person sessions",
      body: (
        <>
          <p>
            For in-person training, delivery time includes travel, set-up and session time. A
            60-minute session might take 75 to 90 minutes of your time once travel and preparation
            are counted. Use the full time when calculating price. If you rent gym space per
            session, include that cost too, or the package will underpay you.
          </p>
        </>
      ),
    },
    {
      heading: "A worked comparison: underpricing",
      body: (
        <>
          <p>
            A coach charges €120 for a 4-week block, believing it takes about half an hour a week
            per client. After timing a few clients, they find delivery takes 0.75 hours a week. At
            €120 for 3 hours of delivery, they earn €40 an hour, a third less than their €60 target.
            Pricing from actual time, the block should be €180.
          </p>
          <p>
            This gap is common. Timing delivery honestly is often the single most useful step in
            fixing package pricing.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: a pricing review checklist",
      body: (
        <>
          <ol>
            <li>Time delivery for three typical clients for a week.</li>
            <li>Update your target rate per delivery hour.</li>
            <li>Re-run the calculator with real time and rate.</li>
            <li>Compare new prices with current prices and your market.</li>
            <li>Decide whether to change prices for new clients, existing clients or both.</li>
            <li>Plan how to communicate any change.</li>
          </ol>
          <p>
            Doing this once or twice a year keeps your pricing aligned with your work and your
            goals.
          </p>
        </>
      ),
    },
    {
      heading: "When clients ask for discounts",
      body: (
        <>
          <p>
            If a client asks for a lower price, offer a lighter package instead of discounting the
            full one. Removing meal plans or reducing check-in frequency lowers delivery time and
            price together, so your revenue per hour stays on target. Discounting the full package
            lowers revenue per hour and sets a precedent for others.
          </p>
        </>
      ),
    },
    {
      heading: "Payment plans for longer packages",
      body: (
        <>
          <p>
            A 24-week package at €918 is a large single payment for many clients. Splitting it into
            six monthly payments of €153 keeps the commitment discount while making it more
            affordable. Some coaches charge slightly more for payment plans than for paying in full,
            to reward upfront payment. Whatever you choose, state the terms clearly before the
            client commits.
          </p>
          <p>
            Payment plans also make longer packages easier to recommend on a discovery call, because
            the monthly figure is close to what clients expect to pay for ongoing coaching.
          </p>
        </>
      ),
    },
    {
      heading: "Pricing group and hybrid offers",
      body: (
        <>
          <p>
            Group coaching changes the maths. Delivery time is shared across members, so the
            per-client delivery time is much lower. A weekly group call of one hour for 10 members
            is 0.1 hours per member, plus individual check-in time. Price group packages from the
            per-member time and add the value of community, which many clients rate highly.
          </p>
          <p>The group vs 1:1 coaching calculator compares the two models directly.</p>
        </>
      ),
    },
    {
      heading: "Including onboarding time",
      body: (
        <>
          <p>
            The first week of a new client often takes much more time than later weeks: an
            onboarding call, a detailed questionnaire review, building the first plan. If onboarding
            takes two extra hours, spread it across the package. On a 4-week block, that's an extra
            half hour a week; on a 24-week package, it's about 5 minutes a week. This is another
            reason longer packages are more efficient for you.
          </p>
        </>
      ),
    },
    {
      heading: "Reading the revenue per hour column",
      body: (
        <>
          <p>
            Revenue per hour shows what each package really pays you for delivery. If it falls below
            the rate you need to cover costs and pay yourself fairly, the discount is too deep or
            the delivery time too high. Keep an eye on it whenever you change a discount or add an
            extra. It's a better guide than the package price alone.
          </p>
        </>
      ),
    },
    {
      heading: "Psychological pricing",
      body: (
        <>
          <p>
            Prices just below a round number, such as €486 rather than €500, can feel lower to
            clients, while round numbers can feel more premium. Either can work. More important is
            consistency: prices that follow a clear logic, such as the same monthly equivalent
            across tiers or a clear saving for commitment, are easier for clients to understand and
            trust.
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
              <strong>Package price</strong> = rate per delivery hour × hours per week × weeks × (1
              − discount).
            </li>
            <li>
              <strong>Delivery time</strong> includes calls, programming, check-ins, meal plans and
              messaging.
            </li>
            <li>
              <strong>Longer packages</strong> lower revenue per hour but improve retention and
              stability.
            </li>
            <li>
              <strong>Review</strong> prices every 6 to 12 months with real time measurements.
            </li>
          </ul>
          <p>
            Price from time, present outcomes, and keep revenue per hour at or above your target.
          </p>
        </>
      ),
    },
    {
      heading: "Value for the client",
      body: (
        <>
          <p>
            The client saving column shows what each package saves compared with paying the full
            rate. In the default example, a 12-week client saves €54 and a 24-week client €162.
            Showing this saving clearly, alongside the monthly equivalent, makes the longer options
            easy to choose. Many clients pick the middle option when three are presented, so make
            the 12-week package your recommended choice if it suits most people.
          </p>
          <p>
            Avoid making the discount so large that the shortest package looks overpriced. A ladder
            that feels fair at every step builds trust.
          </p>
        </>
      ),
    },
    {
      heading: "Pricing for different markets",
      body: (
        <>
          <p>
            The same delivery-time approach works in any market, but target rates differ. A coach in
            a large city with high living costs needs a higher rate than one in a smaller town.
            Online coaches serving international clients often price in one currency for everyone.
            Use the currency switch to see prices formatted in EUR, USD, GBP or INR; the numbers
            stay the same, so set your rate in the currency you actually charge.
          </p>
        </>
      ),
    },
    {
      heading: "Seasonal offers",
      body: (
        <>
          <p>
            Some coaches run seasonal packages, such as a 12-week spring programme or a January
            kick-start. Price these from the same delivery time and rate, then decide whether to add
            a seasonal discount. A limited-time offer can boost sign-ups, but discounting too often
            trains clients to wait for deals. Many coaches find a fixed start date with a cohort
            feel works better than a discount.
          </p>
        </>
      ),
    },
    {
      heading: "Questions to ask before changing prices",
      body: (
        <>
          <ul>
            <li>Has my delivery time changed since I set these prices?</li>
            <li>Has my target rate changed with my costs or income goals?</li>
            <li>Do my current prices reflect my experience and results?</li>
            <li>How do my prices compare with coaches offering similar support?</li>
            <li>How will existing clients be affected, and how will I tell them?</li>
          </ul>
          <p>
            Working through these questions before re-running the calculator keeps pricing decisions
            deliberate rather than reactive.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example with fewer extras",
      body: (
        <>
          <p>
            A coach offers a lighter package: programming and a weekly check-in, without meal plans
            or regular messaging. Delivery time is 0.4 core hours plus 0.15 for check-ins, or 0.55
            hours a week. At €60 an hour, the 4-week block is €132, the 12-week package at 10% off
            is €356.40, and the 24-week package at 15% off is €673.20. This gives clients a
            lower-priced entry point while keeping the coach's revenue per hour on target.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Time three typical clients for a week, enter the real delivery time and your target
            rate, and compare the prices with what you charge now. If there's a gap, plan the change
            for new clients first.
          </p>
        </>
      ),
    },
    {
      heading: "Packages and your capacity",
      body: (
        <>
          <p>
            Delivery time per client also sets how many clients you can take. At 0.75 hours a week,
            30 hours of coaching time supports about 40 clients. If you add extras that push
            delivery to 1 hour, the same time supports 30. Higher-touch packages earn more per
            client but cap your client count sooner. Price them so that a full roster at the higher
            delivery time still meets your income goal.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping it simple",
      body: (
        <>
          <p>
            Three packages are usually enough. More options make choosing harder and pricing
            messier. Start with a rolling block, a 12-week commitment and a 24-week commitment, and
            add tiers only when clients clearly ask for them.
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
    key: "check-ins",
    heading: "Keep clients coming back each week",
    body: (
      <>
        <p>
          In Traiv, clients get their plans, check-ins and messages in an app under your name, and
          you see who has gone quiet before they cancel. Retention is where most of these numbers
          are won or lost.
        </p>
      </>
    ),
  },
  next: [
    { label: "Coaching rate calculator", href: "/tools/coaching-rate-calculator" },
    { label: "Price increase calculator", href: "/tools/price-increase-calculator" },
    { label: "Client capacity calculator", href: "/tools/client-capacity-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How should I price a coaching package?",
      a: "Multiply your target rate per delivery hour by hours per client per week and the package length, then apply a discount for longer commitments.",
    },
    {
      q: "What discount should I offer for longer packages?",
      a: "Commonly 5 to 15% for 12 weeks and a little more for 24 weeks. The calculator shows what each discount costs per hour.",
    },
    {
      q: "What counts as delivery time?",
      a: "Everything you do for a client each week: calls, programming, check-in review, meal plans and messaging.",
    },
    {
      q: "Should packages be paid upfront?",
      a: "Upfront improves cash flow and commitment; monthly payments make longer packages more accessible. Many coaches offer both.",
    },
    {
      q: "How often should I review package prices?",
      a: "Every six to twelve months, after re-timing your delivery and updating your target rate.",
    },
  ],
  keepGoing: [
    { label: "Check-ins in Traiv", href: "/features/check-ins" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Run your coaching business on one platform",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
