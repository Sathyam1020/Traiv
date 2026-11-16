import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Client lifetime value (LTV) calculator for coaches",
  description:
    "Calculate client lifetime value from monthly price and average retention or monthly churn, plus what one more month of retention is worth.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Client LTV calculator",
  intro: (
    <>
      <p>
        Enter what a client pays each month and how long clients stay, either as average months or
        as a monthly churn rate. See lifetime value per client, what one more month of retention
        adds and the revenue in a client's first year.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate client lifetime value?",
    answer: (
      <>
        <p>
          Multiply monthly price by average months retained. At €300 a month for 6 months, a client
          is worth €1,800. If you know churn instead, divide 100 by the monthly churn percentage to
          get months: 16.67% churn is about 6 months. Each extra month of retention adds another
          €300 per client.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What lifetime value means",
      body: (
        <>
          <p>
            Client lifetime value, or LTV, is the total revenue an average client brings in over the
            time they coach with you. It is one of the most important numbers in a coaching business
            because it sets how much you can afford to spend to win a client, how much a retention
            improvement is worth, and how stable your income is.
          </p>
          <p>
            A business with a high LTV can invest in marketing, pay for help and weather slow
            months. A business with a low LTV has to keep finding new clients just to stand still.
            Most coaches who feel stuck on a revenue treadmill have an LTV problem rather than a
            marketing problem.
          </p>
        </>
      ),
    },
    {
      heading: "Two ways to calculate it",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">Formula</th>
                  <th scope="col">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Average months</td>
                  <td>Monthly price × average months</td>
                  <td>€300 × 6 = €1,800</td>
                </tr>
                <tr>
                  <td>Monthly churn</td>
                  <td>Monthly price × (100 ÷ churn %)</td>
                  <td>€300 × (100 ÷ 16.67) ≈ €1,800</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Use average months if you know how long clients typically stay, for example from your
            payment records. Use churn if you track how many clients leave each month. The two are
            linked: average months is roughly 1 divided by monthly churn.
          </p>
        </>
      ),
    },
    {
      heading: "Worked examples",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Price</th>
                  <th scope="col">Retention</th>
                  <th scope="col">Lifetime value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>€150</td>
                  <td>4 months</td>
                  <td>€600</td>
                </tr>
                <tr>
                  <td>€150</td>
                  <td>6 months</td>
                  <td>€900</td>
                </tr>
                <tr>
                  <td>€300</td>
                  <td>6 months</td>
                  <td>€1,800</td>
                </tr>
                <tr>
                  <td>€300</td>
                  <td>12.5 months (8% churn)</td>
                  <td>€3,750</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Doubling either price or retention doubles LTV. In practice, retention is often easier
            to improve than price, and it brings other benefits: more referrals, steadier income and
            less time spent onboarding new clients.
          </p>
        </>
      ),
    },
    {
      heading: "What one more month is worth",
      body: (
        <>
          <p>
            The calculator shows what adding one month to average retention is worth per client:
            simply the monthly price. That sounds small, but it applies to every client. For a coach
            with 30 clients at €300, one extra month of average retention is worth €9,000 across the
            client base, without a single new sign-up.
          </p>
          <p>
            That figure is a useful way to judge retention efforts. If a change, such as a monthly
            progress review or a better onboarding call, keeps clients one month longer on average,
            it's worth up to the monthly price per client.
          </p>
        </>
      ),
    },
    {
      heading: "First-year revenue",
      body: (
        <>
          <p>
            First-year revenue is what a client brings in during their first 12 months, capped at
            their lifetime value. For a client who stays 6 months, it equals LTV. For a client who
            stays 20 months, it's 12 × the monthly price. This is useful for planning, because many
            decisions, such as hiring or upgrading equipment, are made on a yearly horizon.
          </p>
        </>
      ),
    },
    {
      heading: "LTV and acquisition cost",
      body: (
        <>
          <p>
            LTV sets the ceiling on what you can spend to win a client. A common rule of thumb is to
            keep customer acquisition cost at a third or less of LTV, a ratio of 3 to 1. At €1,800
            LTV, that's up to €600 per client. At €900 LTV, it's €300.
          </p>
          <p>
            Improving retention raises LTV and gives you more room to spend on marketing. The
            customer acquisition cost calculator shows the ratio in detail.
          </p>
        </>
      ),
    },
    {
      heading: "Revenue LTV versus profit LTV",
      body: (
        <>
          <p>
            This calculator uses revenue. Profit LTV subtracts the cost of delivering the coaching,
            such as software, assistants and payment fees. For a solo online coach with high
            margins, the two are close. For a coach with significant delivery costs, profit LTV may
            be much lower and is the better number for acquisition decisions.
          </p>
          <p>
            To estimate profit LTV, multiply revenue LTV by your gross margin. At €1,800 revenue LTV
            and a 75% margin, profit LTV is €1,350.
          </p>
        </>
      ),
    },
    {
      heading: "Raising LTV through retention",
      body: (
        <>
          <ul>
            <li>
              <strong>A predictable weekly rhythm:</strong> the same check-in day, a reply within an
              agreed time, and a plan update when it's due.
            </li>
            <li>
              <strong>Visible progress:</strong> weight trends, measurements, photos, strength
              numbers and habits, shown back to the client regularly.
            </li>
            <li>
              <strong>Early action on silence:</strong> a personal message when a client misses a
              check-in, before the gap becomes a cancellation.
            </li>
            <li>
              <strong>Plans that fit real life:</strong> adjusting for travel, illness and busy
              weeks rather than expecting perfect adherence.
            </li>
            <li>
              <strong>Clear next goals:</strong> when a client reaches one goal, agree the next one
              before motivation fades.
            </li>
          </ul>
          <p>
            Each of these keeps clients engaged and seeing value, which is what keeps them paying.
          </p>
        </>
      ),
    },
    {
      heading: "Raising LTV through pricing and packages",
      body: (
        <>
          <p>
            Price is the other lever. A modest price rise for new clients, a premium tier with more
            support, or a longer commitment package can all raise LTV. Longer packages, such as 6 or
            12 months, also raise retention, because clients commit upfront and give the coaching
            time to work.
          </p>
          <p>
            Be careful not to raise price without adding or communicating value. A rise that drives
            up churn can lower LTV overall. The price increase calculator helps model the trade-off.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring retention from your records",
      body: (
        <>
          <p>
            Look at clients who started at least a year ago. For each, count the months they paid.
            Average those months. That's a realistic average retention. Including only recent
            clients underestimates lifetime, because many are still active; including only clients
            who left overestimates churn.
          </p>
          <p>
            Repeat every quarter. As your coaching improves, average retention should rise, and LTV
            with it.
          </p>
        </>
      ),
    },
    {
      heading: "Segmenting LTV",
      body: (
        <>
          <p>
            Average LTV can hide big differences. Clients from referrals may stay much longer than
            clients from ads. Clients on premium tiers may stay longer than those on basic plans.
            Calculate LTV for each group to see where your most valuable clients come from and which
            offers keep people longest.
          </p>
        </>
      ),
    },
    {
      heading: "LTV across your whole client base",
      body: (
        <>
          <p>
            Per-client LTV becomes more powerful when multiplied across your business. A coach with
            30 clients and an average LTV of €1,800 has a client base worth about €54,000 in future
            revenue at today's retention. If retention rises from 6 to 8 months, that value rises to
            €72,000, an extra €18,000 without new clients.
          </p>
          <p>
            Thinking of retention in these terms helps prioritise. A small improvement in how long
            clients stay is often worth more than a big marketing push.
          </p>
        </>
      ),
    },
    {
      heading: "LTV and the first weeks",
      body: (
        <>
          <p>
            Lifetime value is decided early. Clients who have a strong start, with a clear plan, a
            quick win and regular contact, tend to stay much longer than those who start slowly.
            Investing extra time in the first month, such as an onboarding call, an early plan
            adjustment and a progress check at week four, usually pays for itself many times over
            through longer retention.
          </p>
        </>
      ),
    },
    {
      heading: "Upsells and LTV",
      body: (
        <>
          <p>
            LTV also grows when clients buy more. A client who adds nutrition coaching, moves to a
            premium tier or books a block of in-person sessions raises their lifetime value. Offer
            upgrades when they fit the client's goals, not as a sales tactic. A client who feels
            their coaching evolves with them stays longer and spends more naturally.
          </p>
        </>
      ),
    },
    {
      heading: "LTV for programme-based coaching",
      body: (
        <>
          <p>
            If you sell fixed programmes rather than ongoing coaching, LTV is the price of the first
            programme plus any follow-on programmes. A client who completes a 12-week programme at
            €600 and continues to a second at €500 has an LTV of €1,100. Track renewal rates: the
            share of clients who continue after each programme. Raising renewals is the main way to
            raise LTV for this model.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example: the value of better retention",
      body: (
        <>
          <p>
            A coach charges €150 a month and clients stay 4 months on average: LTV is €600. With 25
            clients, the client base is worth about €15,000. After introducing monthly progress
            reviews and faster replies, average retention rises to 6 months. LTV becomes €900, and
            the same 25 clients are worth €22,500.
          </p>
          <p>
            That extra €7,500 comes from the same clients, the same price and no new marketing, just
            from keeping clients two months longer.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: tracking LTV",
      body: (
        <>
          <p>
            Once a quarter, pull your payment records and calculate average months retained for
            clients who started at least a year ago. Enter your current price and that figure into
            the calculator. Note the LTV and compare with last quarter. Then calculate LTV
            separately for clients from your main acquisition channels to see which bring the most
            valuable clients.
          </p>
          <p>
            Use the results to guide where you spend time and money: more effort on channels that
            bring long-staying clients, and on the retention habits that move average months up.
          </p>
        </>
      ),
    },
    {
      heading: "Common mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Using an optimistic retention figure:</strong> use real data from clients who
              started at least a year ago.
            </li>
            <li>
              <strong>Ignoring discounts:</strong> if many clients pay less than list price, use the
              actual average paid.
            </li>
            <li>
              <strong>Mixing models:</strong> calculate LTV separately for programmes and ongoing
              coaching.
            </li>
            <li>
              <strong>Forgetting costs:</strong> for acquisition decisions, multiply by your margin.
            </li>
          </ul>
          <p>An honest LTV makes every decision built on it more reliable.</p>
        </>
      ),
    },
    {
      heading: "Discounts and real LTV",
      body: (
        <>
          <p>
            If you offer discounts, such as a cheaper first month, a referral discount or a lower
            rate for longer packages, the average client pays less than your list price. Use the
            average price clients actually pay over their lifetime, not the headline price. A coach
            with a €300 list price but frequent discounts may find the real average is closer to
            €260, which lowers LTV by more than 10%.
          </p>
        </>
      ),
    },
    {
      heading: "LTV and the decision to hire",
      body: (
        <>
          <p>
            LTV helps decide when to bring in help. If an assistant costs €1,500 a month and lets
            you serve 10 more clients worth €1,800 each over their lifetime, the extra clients bring
            €18,000 of lifetime revenue. Even after the assistant's cost over those clients'
            lifetimes, the hire may pay off, especially if it also improves retention by keeping
            replies fast. The assistant coach ROI calculator models this in more detail.
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
              <strong>LTV</strong> = monthly price × average months retained.
            </li>
            <li>
              <strong>From churn:</strong> average months = 100 ÷ monthly churn %.
            </li>
            <li>
              <strong>One extra month</strong> of retention is worth one month's price per client.
            </li>
            <li>
              <strong>Main levers:</strong> retention, then price and package length.
            </li>
          </ul>
          <p>
            Recalculate every quarter with real data and use it to set your maximum acquisition
            cost.
          </p>
        </>
      ),
    },
    {
      heading: "Why LTV feels abstract, and how to make it concrete",
      body: (
        <>
          <p>
            Lifetime value can feel like a theoretical number. A simple way to make it concrete is
            to look at a real former client: how long did they coach with you, and what did they pay
            in total? Do the same for five or six recent former clients. The average of those totals
            is your real LTV, and it's often a surprise in one direction or the other.
          </p>
          <p>
            Seeing actual names and totals also makes retention feel personal. Each extra month a
            client stays isn't an abstract improvement; it's another month of helping a real person,
            and another month of income.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this month",
      body: (
        <>
          <p>
            Pull the payment history for clients who started a year or more ago and work out their
            average months. Enter it with your current price, note the LTV, and pick one retention
            habit to strengthen this month. Re-run the calculator next quarter to see the change.
          </p>
        </>
      ),
    },
    {
      heading: "LTV and client experience",
      body: (
        <>
          <p>
            Behind every LTV figure is a series of weeks in which a client decided to keep going.
            Clear plans, prompt replies and honest feedback make those decisions easy. Improving LTV
            is really about making each week of coaching worth continuing.
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
    { label: "Client churn rate calculator", href: "/tools/client-churn-rate-calculator" },
    {
      label: "Customer acquisition cost calculator",
      href: "/tools/customer-acquisition-cost-calculator",
    },
    { label: "Price increase calculator", href: "/tools/price-increase-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "What is a good client lifetime value for a coach?",
      a: "It depends on price and retention. What matters most is that LTV is comfortably higher than what you spend to win a client, ideally three times or more.",
    },
    {
      q: "How do I convert churn to average months?",
      a: "Divide 100 by monthly churn as a percentage. At 5% churn, that's 20 months.",
    },
    {
      q: "Should LTV use revenue or profit?",
      a: "This calculator uses revenue. For acquisition decisions, multiply by your gross margin for a profit-based figure.",
    },
    {
      q: "What is the quickest way to raise LTV?",
      a: "Usually retention: regular check-ins, visible progress and early action when clients go quiet.",
    },
    {
      q: "How often should I recalculate LTV?",
      a: "Every quarter, using real retention data from your records.",
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
