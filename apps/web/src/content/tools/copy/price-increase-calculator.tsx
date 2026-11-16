import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Price increase calculator for coaches",
  description:
    "See how many clients you can lose and still break even after a coaching price increase, and what revenue looks like at your expected cancellations.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Price increase calculator",
  intro: (
    <>
      <p>
        Add today's price and client count, the price you're considering and your honest guess at
        cancellations. See how many you can lose before the increase costs you money, revenue at
        your expected cancellations and the revenue-neutral price.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How many clients can I lose after a price increase?",
    answer: (
      <>
        <p>
          Divide current revenue by the new price to find how many clients you need to stay level.
          At €150 with 20 clients, revenue is €3,000. At €180, you need 16.7 clients to match it, so
          you can lose 3 and still be ahead. If you expect to lose 2, revenue becomes €3,240, €240
          more than now.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why coaches avoid raising prices",
      body: (
        <>
          <p>
            Many coaches keep prices the same for years, even as their skills, results and costs
            grow. The fear is simple: clients will leave. The calculator puts a number on that fear.
            It shows how many clients you can lose before an increase costs you anything, which is
            usually more than coaches expect.
          </p>
          <p>
            It also shows the upside. If few clients leave, revenue rises immediately, often by more
            than you could gain from months of marketing. And the clients who stay are often the
            most committed, which makes the coaching easier and more rewarding.
          </p>
        </>
      ),
    },
    {
      heading: "The break-even calculation",
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
                  <td>Current revenue</td>
                  <td>Current price × clients</td>
                  <td>€150 × 20 = €3,000</td>
                </tr>
                <tr>
                  <td>If nobody leaves</td>
                  <td>New price × clients</td>
                  <td>€180 × 20 = €3,600</td>
                </tr>
                <tr>
                  <td>Clients needed to break even</td>
                  <td>Current revenue ÷ new price</td>
                  <td>€3,000 ÷ €180 = 16.7</td>
                </tr>
                <tr>
                  <td>Clients you can lose</td>
                  <td>Clients − clients needed</td>
                  <td>20 − 16.7 = 3 (whole clients)</td>
                </tr>
                <tr>
                  <td>At expected cancellations</td>
                  <td>New price × remaining clients</td>
                  <td>€180 × 18 = €3,240</td>
                </tr>
                <tr>
                  <td>Revenue-neutral price</td>
                  <td>Current revenue ÷ remaining clients</td>
                  <td>€3,000 ÷ 18 = €166.67</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The revenue-neutral price is the lowest price that keeps you level after your expected
            cancellations. Anything above it leaves you ahead.
          </p>
        </>
      ),
    },
    {
      heading: "More examples",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Scenario</th>
                  <th scope="col">Can lose</th>
                  <th scope="col">Revenue at expected cancellations</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>25 clients, €120 → €140, expect 2 to leave</td>
                  <td>3 (14.3%)</td>
                  <td>€3,220 (+€220)</td>
                </tr>
                <tr>
                  <td>20 clients, €150 → €200, expect 4 to leave</td>
                  <td>5 (25%)</td>
                  <td>€3,200 (+€200)</td>
                </tr>
                <tr>
                  <td>20 clients, €150 → €165, expect 1 to leave</td>
                  <td>1 (9.1%)</td>
                  <td>€3,135 (+€135)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Larger increases give you more room for cancellations, but they also tend to cause more.
            Smaller increases cause fewer cancellations but leave less room. The right size depends
            on how far below the market your price is and how much value you've added since you set
            it.
          </p>
        </>
      ),
    },
    {
      heading: "How many clients actually leave?",
      body: (
        <>
          <p>
            In practice, fewer clients leave over a reasonable price rise than coaches fear. Clients
            who are getting results and feel supported usually value continuity over a modest
            saving. Those who leave are often clients who were already drifting: missing check-ins,
            less engaged or close to finishing anyway.
          </p>
          <p>
            Make an honest estimate. Look at your client list and mark those you think might leave.
            That's a better guide than a general fear, and it feeds the calculator with a realistic
            number.
          </p>
        </>
      ),
    },
    {
      heading: "Raising prices for new clients only",
      body: (
        <>
          <p>
            One option is to raise prices only for new clients and keep existing clients on their
            current rate, either permanently or for a set period. This avoids any cancellations from
            the rise and rewards loyalty. Revenue grows more slowly, as new clients replace old ones
            at the higher rate.
          </p>
          <p>
            Many coaches combine the two: new clients pay the new price straight away, and existing
            clients move to it after a notice period of one to three months.
          </p>
        </>
      ),
    },
    {
      heading: "How to announce a price increase",
      body: (
        <>
          <ol>
            <li>Give notice: at least a month, ideally two or three for long-term clients.</li>
            <li>
              Explain briefly why: rising costs, more support, new features, or simply that your
              price hasn't changed in years.
            </li>
            <li>Remind them of what they get and what they've achieved.</li>
            <li>State the new price and the date it takes effect.</li>
            <li>
              Offer an option, such as locking in the current price by committing to a longer block.
            </li>
            <li>Thank them, and invite questions.</li>
          </ol>
          <p>
            Announce it personally rather than in a generic email where possible. A short message or
            a mention during a check-in feels more respectful and gives clients a chance to talk it
            through.
          </p>
        </>
      ),
    },
    {
      heading: "Adding value alongside the rise",
      body: (
        <>
          <p>
            A price increase is easier to accept when clients can see what they're paying for.
            Before raising prices, consider whether your offer could be clearer or stronger: a
            monthly progress review, a better app experience, faster replies or a more personalised
            plan. Communicating these as part of the change makes it feel like an upgrade rather
            than a charge.
          </p>
        </>
      ),
    },
    {
      heading: "When not to raise prices",
      body: (
        <>
          <p>
            If churn is already high, a price rise may push it higher. Fix retention first, then
            raise prices once clients are staying and seeing results. If your price is already at
            the top of your market and clients compare you with similar coaches, a rise may need a
            clear new benefit to justify it.
          </p>
          <p>
            If many of your clients are on tight budgets, offer a lower-cost option, such as a
            self-guided plan or group coaching, alongside the higher-priced one.
          </p>
        </>
      ),
    },
    {
      heading: "After the increase",
      body: (
        <>
          <p>
            Track cancellations and new sign-ups for two or three months. Compare actual
            cancellations with your estimate. If fewer clients left than expected, it may be a sign
            your price was below the market. If more left, ask them why; their answers will show
            whether it was the price, the timing or something else.
          </p>
          <p>Re-run the calculator with actual numbers to see how the increase played out.</p>
        </>
      ),
    },
    {
      heading: "Price and positioning",
      body: (
        <>
          <p>
            Price signals quality. A coach who charges significantly less than others may be seen as
            less experienced, even when that isn't true. Raising your price to match your skill and
            results can attract clients who are more committed and less likely to leave, which
            improves retention as well as revenue.
          </p>
        </>
      ),
    },
    {
      heading: "Price increase as a percentage",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Increase</th>
                  <th scope="col">Can lose (of 20) and break even</th>
                  <th scope="col">Share of clients</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>+10% (€150 → €165)</td>
                  <td>1</td>
                  <td>9%</td>
                </tr>
                <tr>
                  <td>+20% (€150 → €180)</td>
                  <td>3</td>
                  <td>17%</td>
                </tr>
                <tr>
                  <td>+33% (€150 → €200)</td>
                  <td>5</td>
                  <td>25%</td>
                </tr>
                <tr>
                  <td>+50% (€150 → €225)</td>
                  <td>6</td>
                  <td>33%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The share you can lose rises with the size of the increase, but more slowly than the
            increase itself. A 50% rise lets you lose a third of your clients and still break even.
            Few businesses actually lose that many, which is why significant increases often lead to
            more revenue and a more committed client base.
          </p>
        </>
      ),
    },
    {
      heading: "Clients who stay pay for the ones who leave",
      body: (
        <>
          <p>
            When some clients leave after an increase, the remaining clients pay more, and the
            business may also save time. Fewer clients means fewer check-ins, messages and plans. If
            you were close to capacity, a price rise that loses two or three clients can free time
            for better service or new clients at the higher price.
          </p>
          <p>
            That time saving isn't in the calculator, but it is real. A smaller, better-paying
            client base can be both more profitable and more sustainable.
          </p>
        </>
      ),
    },
    {
      heading: "Grandfathering existing clients",
      body: (
        <>
          <p>
            Grandfathering means keeping existing clients on their old price while new clients pay
            the new one. It removes the risk of cancellations from the increase and rewards loyalty.
            The downside is slower revenue growth and the complexity of managing several price
            points.
          </p>
          <p>
            A middle path is to grandfather for a fixed period, such as six months, then move
            everyone to the new price. Clients appreciate the notice and the extra time at the old
            rate.
          </p>
        </>
      ),
    },
    {
      heading: "Handling clients who push back",
      body: (
        <>
          <p>
            Some clients will ask about the increase. Listen, acknowledge their concern and explain
            briefly why the price is changing. Remind them of what they've achieved and what
            continues. If money is genuinely tight, you might offer a lighter package at a lower
            price rather than a discount on the full service.
          </p>
          <p>
            Avoid giving in to every request for the old price. If you do, you'll end up with many
            price points and resentment from clients who accepted the new one.
          </p>
        </>
      ),
    },
    {
      heading: "Timing an increase",
      body: (
        <>
          <p>
            Good times to raise prices include the start of a new year, the launch of a new feature
            or service, after a period of strong client results, or when you're near capacity and
            have a waiting list. Avoid raising prices during a quiet period when clients are already
            questioning their spending, or immediately after a service problem.
          </p>
          <p>
            Give at least a month's notice, and avoid surprises. Clients who feel informed and
            respected are much more likely to stay.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: running the numbers before you announce",
      body: (
        <>
          <p>
            Before announcing an increase, list your clients and mark each as likely to stay,
            uncertain or likely to leave. Count the likely leavers and half the uncertain ones as
            your expected cancellations. Enter that number into the calculator with your current and
            proposed prices. If you're comfortably ahead, proceed. If it's close, consider a smaller
            increase or a longer notice period.
          </p>
          <p>
            After the increase, compare actual cancellations with your estimate. Most coaches find
            they overestimated, which gives them more confidence next time.
          </p>
        </>
      ),
    },
    {
      heading: "Increases for packages and programmes",
      body: (
        <>
          <p>
            If you sell fixed packages rather than monthly coaching, raise the package price for new
            sales. For clients currently in a package, honour the price they paid until the package
            ends, then offer renewal at the new price. Communicate the change before the renewal
            date, so it doesn't feel like a surprise at the end.
          </p>
        </>
      ),
    },
    {
      heading: "Regular small increases",
      body: (
        <>
          <p>
            Some coaches raise prices by a small amount every year, for example 5 to 10%, to keep
            pace with costs and growing skill. Regular, predictable increases feel less dramatic to
            clients than a large rise after several years. They also keep your price in line with
            your value as your experience grows.
          </p>
        </>
      ),
    },
    {
      heading: "Value-based pricing",
      body: (
        <>
          <p>
            Pricing on value means setting a price based on what the coaching is worth to the
            client, not only on your costs or time. A client who wants to compete, recover from
            injury or change their health may value the outcome far more than the hours involved.
            Coaches who can show clear results and specialised expertise can often charge more than
            those offering general fitness coaching.
          </p>
          <p>
            A price increase is a good moment to clarify the value: who you help, what outcomes they
            get and how your coaching differs. That message helps both existing and new clients see
            why the price is fair.
          </p>
        </>
      ),
    },
    {
      heading: "Testing a new price with new clients first",
      body: (
        <>
          <p>
            If you're unsure how the market will respond, try the new price on new enquiries for a
            month or two before applying it to existing clients. Track how many calls convert
            compared with before. If conversion holds steady, the new price is accepted and you can
            apply it more widely with confidence. If conversion drops sharply, you've learned
            something without risking your existing client base.
          </p>
        </>
      ),
    },
    {
      heading: "Communicating with confidence",
      body: (
        <>
          <p>
            How you announce a price rise matters as much as the amount. Clear, confident and brief
            works best. Apologising repeatedly or over-explaining suggests the price isn't
            justified. A short message that thanks the client, states the change, gives the date and
            reminds them of what they get respects both their time and your work.
          </p>
          <p>
            Be ready to answer questions, but don't negotiate the price down in the moment. If
            someone can't afford the new rate, offer a lighter option instead.
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
              <strong>Break-even clients</strong> = current revenue ÷ new price.
            </li>
            <li>
              <strong>Can lose</strong> = current clients − break-even clients.
            </li>
            <li>
              <strong>Revenue-neutral price</strong> = current revenue ÷ remaining clients.
            </li>
            <li>
              <strong>Most coaches</strong> overestimate how many clients will leave.
            </li>
          </ul>
          <p>Estimate honestly, give notice, explain the value and track what happens.</p>
        </>
      ),
    },
    {
      heading: "Inflation and your price",
      body: (
        <>
          <p>
            If your prices haven't changed in several years, inflation has quietly cut your real
            income. Costs such as software, rent, equipment and your own living expenses have risen,
            while your price stayed the same. An increase that only keeps pace with rising costs
            isn't really a raise; it's restoring what you already earned.
          </p>
          <p>
            Explaining this briefly to clients is usually enough. Most understand that prices rise
            over time, especially when the coaching they receive has improved.
          </p>
        </>
      ),
    },
    {
      heading: "Raising prices when you're full",
      body: (
        <>
          <p>
            A waiting list is a strong signal that your price is below what the market will pay.
            Raising prices for new clients when you're full reduces demand to match capacity and
            increases revenue per client at the same time. Existing clients can move to the new
            price after a notice period, or stay on their current rate as a reward for loyalty.
          </p>
          <p>
            Either way, being full is one of the best times to raise prices, because the risk of
            losing clients is offset by the waiting list.
          </p>
        </>
      ),
    },
    {
      heading: "What to do if you lose more clients than expected",
      body: (
        <>
          <p>
            If more clients leave than the break-even number, first check whether they left because
            of the price or for other reasons that happened to coincide. Ask them. If price was the
            main reason, consider whether the new price is above what your market will bear, or
            whether the value wasn't clear enough.
          </p>
          <p>
            You can respond by adding value, offering a lighter tier, or adjusting the price for new
            clients. Avoid reversing the increase for everyone; that undermines trust with the
            clients who accepted it.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Write down your current price, client count and the price you'd like to charge. Mark
            each client as likely to stay or at risk, and enter the at-risk count as expected
            cancellations. If the result leaves you ahead, draft a short, confident announcement
            with a date at least a month away. If it's close, try a smaller step or start with new
            clients only. Either way, you'll be deciding from numbers rather than fear.
          </p>
        </>
      ),
    },
    {
      heading: "Price and client results",
      body: (
        <>
          <p>
            Clients who pay more often take coaching more seriously, show up more consistently and
            get better results. That isn't a reason to overcharge, but it is a reason not to fear
            charging fairly. A price that reflects real value tends to attract clients who value it,
            and those clients stay longer, refer more and make coaching more rewarding.
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
    { label: "Client LTV calculator", href: "/tools/client-ltv-calculator" },
    { label: "Coaching rate calculator", href: "/tools/coaching-rate-calculator" },
    {
      label: "Coaching package pricing calculator",
      href: "/tools/coaching-package-pricing-calculator",
    },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How many clients can I lose after raising my price?",
      a: "Divide current revenue by the new price to find how many clients you need; the difference from your current count is how many you can lose.",
    },
    {
      q: "What is a revenue-neutral price?",
      a: "The price that keeps revenue level after your expected cancellations: current revenue ÷ remaining clients.",
    },
    {
      q: "How much notice should I give clients?",
      a: "At least a month, ideally two or three for long-term clients.",
    },
    {
      q: "Should I raise prices for existing clients?",
      a: "Many coaches raise prices for new clients straight away and for existing clients after a notice period. Some keep loyal clients on old rates.",
    },
    {
      q: "How much should I raise my prices?",
      a: "It depends on your market and value. Use the calculator to see how much room different increases give you.",
    },
    {
      q: "What if more clients leave than expected?",
      a: "Ask them why. Their answers show whether it was price, timing or something else to fix.",
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
