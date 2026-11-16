import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Customer acquisition cost calculator",
  description:
    "Calculate customer acquisition cost, client lifetime value, the LTV to CAC ratio and payback period for a coaching business, in any currency.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Customer acquisition cost (CAC) calculator",
  intro: (
    <>
      <p>
        Enter what you spend on marketing each month, how many clients it brings, your monthly price
        and how long clients stay. See your cost per client, lifetime value, LTV to CAC ratio and
        how many months each client takes to pay back.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate customer acquisition cost?",
    answer: (
      <>
        <p>
          Divide monthly marketing spend by the new clients it brings. Spending €600 to win 4
          clients is a CAC of €150. At €150 a month for 6 months, a client is worth €900, so the LTV
          to CAC ratio is 6 to 1, and each client pays back their cost in about a month.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What CAC tells you",
      body: (
        <>
          <p>
            Customer acquisition cost is the average cost of winning one paying client. It is the
            single most useful number for deciding whether a marketing channel is worth what you
            spend on it. On its own, though, it is only half the picture. A €300 CAC is excellent
            for a client worth €3,000 and ruinous for a client worth €200.
          </p>
          <p>
            That is why CAC is almost always read alongside lifetime value (LTV), the total revenue
            a client brings in. The ratio between the two, and the time it takes a client to repay
            their CAC, describe whether acquisition is healthy.
          </p>
        </>
      ),
    },
    {
      heading: "The formulas",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Measure</th>
                  <th scope="col">Formula</th>
                  <th scope="col">Default example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CAC</td>
                  <td>Marketing spend ÷ new clients</td>
                  <td>€600 ÷ 4 = €150</td>
                </tr>
                <tr>
                  <td>LTV (revenue)</td>
                  <td>Monthly price × average lifetime</td>
                  <td>€150 × 6 = €900</td>
                </tr>
                <tr>
                  <td>LTV : CAC</td>
                  <td>LTV ÷ CAC</td>
                  <td>€900 ÷ €150 = 6 to 1</td>
                </tr>
                <tr>
                  <td>Payback period</td>
                  <td>CAC ÷ monthly price</td>
                  <td>€150 ÷ €150 = 1 month</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The calculator uses revenue lifetime value, not profit. That keeps it simple, but it
            means delivery costs, refunds and tax are not deducted. If your margins are low, aim for
            a higher ratio to leave room for them.
          </p>
        </>
      ),
    },
    {
      heading: "Reading the ratio",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">LTV : CAC</th>
                  <th scope="col">What it usually means</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Below 1 to 1</td>
                  <td>Clients cost more to win than they pay over their lifetime</td>
                </tr>
                <tr>
                  <td>1 to 3 to 1</td>
                  <td>
                    Each client repays their cost, but leaves a thin margin for delivery and profit
                  </td>
                </tr>
                <tr>
                  <td>3 to 5 to 1</td>
                  <td>A healthy, sustainable range for most businesses</td>
                </tr>
                <tr>
                  <td>Above 5 to 1</td>
                  <td>Very efficient; there may be room to spend more on growth</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The 3 to 1 benchmark comes from subscription businesses more widely and is a useful rule
            of thumb for coaching. A very high ratio isn't always good news: it can mean you are
            underinvesting in marketing and growing more slowly than you could.
          </p>
        </>
      ),
    },
    {
      heading: "A second example",
      body: (
        <>
          <p>
            Suppose you spend €1,200 a month and win 3 clients. CAC is €400. With the same €150
            price and 6-month lifetime, LTV is still €900, so the ratio falls to 2.25 to 1. Each
            client takes about 2.7 months to repay their cost. This business is still profitable on
            paper, but there is little room for delivery costs or for clients who leave early.
          </p>
          <p>
            Two levers would move it into the healthy range: lowering CAC by improving conversion or
            targeting, or raising LTV by improving retention or price. Raising average lifetime from
            6 to 9 months alone would lift the ratio to about 3.4 to 1.
          </p>
        </>
      ),
    },
    {
      heading: "What to include in marketing spend",
      body: (
        <>
          <ul>
            <li>
              <strong>Ad spend</strong> on every platform.
            </li>
            <li>
              <strong>Tools used for marketing,</strong> such as landing page builders, email
              software and scheduling tools, in proportion to how much they serve acquisition.
            </li>
            <li>
              <strong>Paid help:</strong> a content creator, ads manager or virtual assistant
              working on marketing.
            </li>
            <li>
              <strong>Discounts and free trials</strong> that you would not offer to existing
              clients.
            </li>
            <li>
              <strong>Referral rewards</strong> paid out for new clients.
            </li>
          </ul>
          <p>
            Many coaches leave out everything except ad spend, which makes CAC look lower than it
            is. Your own time is usually excluded, but it is worth noting how many hours go into
            content and sales; that time has a cost too.
          </p>
        </>
      ),
    },
    {
      heading: "Payback period and cash flow",
      body: (
        <>
          <p>
            Payback period tells you how long you wait to get your acquisition spend back. A
            one-month payback means a new client has covered their CAC by the end of their first
            month. A six-month payback means you are funding acquisition from your own pocket for
            half a year per client.
          </p>
          <p>
            For a small coaching business, short payback periods matter because cash is limited. If
            payback is long, a few clients leaving early can turn a good-looking LTV to CAC ratio
            into a loss. Upfront packages, such as 12-week programmes paid in advance, shorten
            payback dramatically.
          </p>
        </>
      ),
    },
    {
      heading: "CAC by channel",
      body: (
        <>
          <p>
            Your overall CAC is an average across every channel. Breaking it down shows where your
            money works hardest. Track for each new client where they came from: an ad, a referral,
            organic social, a podcast, a partnership. Then divide the spend on each channel by the
            clients it brought.
          </p>
          <p>
            Referral and organic channels often have a very low cash CAC but take time to build.
            Paid ads can scale quickly but usually cost more per client. A healthy mix gives you
            both a low average CAC and the ability to grow on demand.
          </p>
        </>
      ),
    },
    {
      heading: "Lowering CAC",
      body: (
        <>
          <ol>
            <li>
              Respond to leads quickly. Many sales are lost because the first reply arrives a day
              late.
            </li>
            <li>Clarify the offer: who it is for, what it includes, what results to expect.</li>
            <li>Add social proof: client stories and results, with permission.</li>
            <li>Follow up more than once with leads who don't buy straight away.</li>
            <li>
              Ask happy clients for referrals at the right moments, such as after a milestone.
            </li>
          </ol>
          <p>Each of these raises conversion, which lowers CAC without spending more.</p>
        </>
      ),
    },
    {
      heading: "Raising LTV",
      body: (
        <>
          <p>
            Lifetime value grows when clients stay longer or pay more. For coaching, retention is
            usually the bigger lever. Clients who see their progress, hear from you regularly and
            feel the plan fits their life tend to stay. Clients who feel forgotten between check-ins
            tend to leave.
          </p>
          <p>
            A small change in retention has a large effect. Raising average lifetime from 6 to 8
            months increases LTV by a third, without any change in marketing. The client LTV and
            churn rate calculators show this in detail.
          </p>
        </>
      ),
    },
    {
      heading: "CAC for different business models",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Model</th>
                  <th scope="col">Typical price</th>
                  <th scope="col">Typical lifetime</th>
                  <th scope="col">LTV</th>
                  <th scope="col">CAC for 3 to 1</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Online monthly coaching</td>
                  <td>€150</td>
                  <td>6 months</td>
                  <td>€900</td>
                  <td>€300 or less</td>
                </tr>
                <tr>
                  <td>Premium online coaching</td>
                  <td>€300</td>
                  <td>8 months</td>
                  <td>€2,400</td>
                  <td>€800 or less</td>
                </tr>
                <tr>
                  <td>In-person personal training</td>
                  <td>€400</td>
                  <td>5 months</td>
                  <td>€2,000</td>
                  <td>€667 or less</td>
                </tr>
                <tr>
                  <td>12-week programme</td>
                  <td>€600</td>
                  <td>1 programme</td>
                  <td>€600</td>
                  <td>€200 or less</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These figures are illustrations, not benchmarks. Your own prices and retention set your
            targets. The point is that higher-value, longer-lasting clients can justify much higher
            acquisition costs.
          </p>
        </>
      ),
    },
    {
      heading: "Blended and paid CAC",
      body: (
        <>
          <p>
            Blended CAC divides all marketing spend by all new clients, including those from
            referrals and organic channels. Paid CAC divides only paid spend by only paid clients.
            Blended CAC is usually lower and looks better, but it can hide an expensive ads channel
            subsidised by free referrals.
          </p>
          <p>
            Track both if you run ads. Blended CAC tells you the health of acquisition overall. Paid
            CAC tells you whether the ads themselves are worth it, which is the number that matters
            when deciding whether to increase ad spend.
          </p>
        </>
      ),
    },
    {
      heading: "When CAC rises",
      body: (
        <>
          <p>
            CAC often creeps up over time. Ad costs increase, audiences become saturated,
            competition grows. If CAC rises while LTV stays the same, the ratio falls and margins
            shrink. Watch the trend over several months rather than a single month, which can be
            distorted by holidays or one-off campaigns.
          </p>
          <p>
            If CAC keeps rising, look at conversion first. Improving how leads are followed up, how
            calls are run and how the offer is presented often brings CAC back down faster than
            changing ads.
          </p>
        </>
      ),
    },
    {
      heading: "Using the ratio to decide on growth",
      body: (
        <>
          <p>
            A healthy ratio and short payback mean that each new client is profitable quickly, so
            investing more in acquisition is likely to pay off. A low ratio or long payback means
            growth costs more than it returns, and spending more would make things worse.
          </p>
          <p>
            Before increasing spend, check capacity. If you can't deliver well to more clients,
            lower retention will reduce LTV and undo the gains. The client capacity calculator helps
            check that.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: a quarterly review",
      body: (
        <>
          <p>
            Every quarter, gather spend, new clients by source, average price and average lifetime.
            Enter the totals into the calculator, then repeat for each major channel. Note which
            channel has the best ratio and payback, and decide where to put more effort and where to
            cut back.
          </p>
          <p>
            Revisit average lifetime with real data. Many coaches overestimate how long clients
            stay. Using your actual figure makes the ratio more honest and the decisions better.
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
              <strong>Counting only ad spend:</strong> tools, help and discounts are acquisition
              costs too.
            </li>
            <li>
              <strong>Using an optimistic lifetime:</strong> use real retention data, not a hope.
            </li>
            <li>
              <strong>Mixing currencies:</strong> enter every figure in the same currency.
            </li>
            <li>
              <strong>Judging one month:</strong> use several months to smooth out noise.
            </li>
            <li>
              <strong>Ignoring delivery costs:</strong> a 3 to 1 ratio on revenue may be thin if
              margins are low.
            </li>
          </ul>
          <p>
            Avoiding these keeps CAC a useful guide rather than a reassuring but misleading number.
          </p>
        </>
      ),
    },
    {
      heading: "CAC and pricing",
      body: (
        <>
          <p>
            Raising prices increases LTV and improves the ratio, as long as conversion and retention
            hold. A 20% price rise with no change in conversion improves the ratio by 20%. If
            conversion falls, the effect depends on how much. The price increase calculator can help
            model existing clients' response; for new clients, test a higher price on a share of new
            leads and compare cost per client.
          </p>
        </>
      ),
    },
    {
      heading: "A worked improvement plan",
      body: (
        <>
          <p>
            Start: €1,200 spend, 3 clients, €150 price, 6-month lifetime. CAC is €400, LTV €900,
            ratio 2.25 to 1, payback 2.7 months. Step one: improve follow-up so conversion rises and
            4 clients come from the same spend. CAC falls to €300, ratio 3 to 1. Step two: improve
            retention so clients stay 8 months. LTV rises to €1,200, ratio 4 to 1, payback 2 months.
          </p>
          <p>
            Neither step needs more ad spend. Together they turn a marginal business into a healthy
            one. That is the typical shape of improvement: conversion first, then retention.
          </p>
        </>
      ),
    },
    {
      heading: "CAC for in-person trainers",
      body: (
        <>
          <p>
            In-person trainers often win clients through the gym floor, word of mouth and local
            partnerships rather than ads. Their cash CAC can be very low, but the time cost is real:
            hours spent on the floor, free sessions and consultations. If you want a fuller picture,
            estimate the hours spent winning clients each month, put a value on them, and add that
            to marketing spend.
          </p>
          <p>
            That doesn't mean these channels are bad. Often they are the best channels available.
            Counting their time cost simply makes it easier to compare them fairly with paid
            options.
          </p>
        </>
      ),
    },
    {
      heading: "Payback and upfront payment",
      body: (
        <>
          <p>
            Asking clients to pay for a block upfront, such as 12 weeks, shortens payback
            immediately. A €400 CAC against a €450 upfront payment is repaid on day one. Monthly
            billing at €150 takes nearly three months. Offering a small discount for upfront payment
            can be worth it for both cash flow and commitment.
          </p>
          <p>
            Upfront packages also tend to improve completion, because clients have committed to the
            full period.
          </p>
        </>
      ),
    },
    {
      heading: "When the ratio looks too good",
      body: (
        <>
          <p>
            A ratio above 8 or 10 to 1 can mean you are underinvesting in growth, but it can also
            mean the inputs are off. Check that spend includes every cost, that clients counted
            really came from marketing, and that lifetime reflects real retention. If the ratio
            holds up, it may be time to test a larger budget carefully.
          </p>
        </>
      ),
    },
    {
      heading: "CAC and the client experience",
      body: (
        <>
          <p>
            The cheapest client to acquire is the one you already have. Clients who stay longer
            spread their acquisition cost over more months, and clients who are happy refer others
            at almost no cost. Investing in the coaching experience, such as regular check-ins,
            clear plans, fast replies and visible progress, lowers CAC indirectly by raising
            retention and referrals.
          </p>
          <p>
            When CAC feels too high, it's worth asking whether the fix is in marketing at all, or in
            what happens after a client signs.
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
              <strong>CAC</strong> = marketing spend ÷ new clients.
            </li>
            <li>
              <strong>LTV</strong> = monthly price × average months retained.
            </li>
            <li>
              <strong>Healthy ratio:</strong> around 3 to 1 or better.
            </li>
            <li>
              <strong>Payback:</strong> CAC ÷ monthly price; shorter is safer for cash flow.
            </li>
            <li>
              <strong>Levers:</strong> conversion and retention usually beat cheaper ads.
            </li>
          </ul>
          <p>
            Recalculate every quarter with real data, by channel, and invest where the ratio and
            payback are strongest.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking where clients come from",
      body: (
        <>
          <p>
            Accurate CAC by channel depends on knowing where each client came from. The simplest
            method is a required question on your intake or booking form: 'How did you hear about
            me?', with options for each channel and a free-text 'other'. Combine that with tracking
            links on your ads and social profiles, and check both when a new client signs.
          </p>
          <p>
            Record the answer next to the client's start date and price. After a few months, you can
            total clients and revenue per channel, divide each channel's spend by its clients, and
            see a reliable CAC for each. That turns budget decisions from guesswork into a
            straightforward comparison.
          </p>
        </>
      ),
    },
    {
      heading: "Time as part of acquisition",
      body: (
        <>
          <p>
            Content, outreach and calls take time even when they cost no money. If you spend eight
            hours a week on marketing and value your time at €40 an hour, that is about €1,390 a
            month. Adding it to spend gives a fuller CAC. You don't have to include it in every
            calculation, but knowing the figure helps decide whether to outsource some tasks or
            switch to channels that take less time.
          </p>
        </>
      ),
    },
    {
      heading: "Benchmarks versus your own trend",
      body: (
        <>
          <p>
            It's tempting to compare your CAC with published averages, but coaching businesses vary
            too much for those figures to mean much. A premium coach with a long average client
            lifetime can afford a CAC that would ruin a low-priced programme. The most useful
            comparison is your own CAC over time, alongside your own LTV. If the ratio improves
            quarter after quarter, acquisition is getting healthier, whatever the averages say.
          </p>
        </>
      ),
    },
    {
      heading: "Free channels still have a cost",
      body: (
        <>
          <p>
            Organic social, a podcast or a YouTube channel can bring clients with no ad spend, which
            makes their cash CAC look close to zero. But they need equipment, editing tools,
            sometimes paid help and, above all, time. Count the cash costs in spend, and keep a
            separate note of the hours. A channel that brings two clients a month for 20 hours of
            work may be worth less than one that brings two clients for €300 of ads and two hours of
            setup.
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
    heading: "Lower CAC by keeping clients longer",
    body: (
      <>
        <p>
          Retention is the cheapest growth there is. In Traiv, clients get a branded app with their
          plans, check-ins and messages, and you can see who has stopped engaging before they
          cancel.
        </p>
      </>
    ),
  },
  next: [
    { label: "Client LTV calculator", href: "/tools/client-ltv-calculator" },
    { label: "Ad spend breakeven calculator", href: "/tools/ad-spend-breakeven-calculator" },
    { label: "Client churn rate calculator", href: "/tools/client-churn-rate-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "What is a good customer acquisition cost for a coach?",
      a: "It depends on what a client is worth. Aim for CAC at a third or less of lifetime value, a ratio of 3 to 1 or better.",
    },
    {
      q: "What should I include in CAC?",
      a: "Ad spend, marketing tools, paid help, trial discounts and referral rewards. Your own time is usually tracked separately.",
    },
    {
      q: "Which LTV to CAC ratio is healthy?",
      a: "3 to 1 is a common benchmark. Below that, margins are thin; well above it, you may be able to invest more in growth.",
    },
    {
      q: "What is CAC payback period?",
      a: "How many months a client takes to repay their acquisition cost: CAC ÷ monthly price.",
    },
    {
      q: "Why use revenue instead of profit for LTV?",
      a: "It keeps the calculation simple. If your delivery costs are high, aim for a higher ratio to leave room for them.",
    },
    {
      q: "Can I use any currency?",
      a: "Yes. Enter every figure in the same currency; the switch changes the symbol only.",
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
