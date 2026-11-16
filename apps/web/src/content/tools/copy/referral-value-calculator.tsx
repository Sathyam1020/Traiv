import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Referral value calculator for coaches",
  description:
    "Estimate the revenue client referrals bring each year, new clients from referrals and the ad spend they save, for a coaching business.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Referral value calculator",
  intro: (
    <>
      <p>
        Enter your active clients, how many people each refers in a year, how many referrals
        convert, average client lifetime value and your cost per client from ads. See referral
        revenue per year, new clients and the ad spend you avoid.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How much are client referrals worth?",
    answer: (
      <>
        <p>
          Multiply clients by referrals per client and conversion rate to get new clients, then by
          lifetime value. Twenty clients each referring 1.5 people a year, with 40% converting,
          bring 12 new clients. At €900 each, that is €10,800 a year, and €1,440 you didn't spend on
          ads at €120 per client.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why referrals matter",
      body: (
        <>
          <p>
            Referred clients arrive already trusting you, because someone they know has vouched for
            your coaching. They tend to convert more often, cost little or nothing to acquire and,
            in many businesses, stay longer than clients from other sources. For most coaches,
            referrals are the cheapest and most reliable growth channel available.
          </p>
          <p>
            Yet many coaches leave referrals to chance. Putting a number on them makes it easier to
            justify the small effort it takes to ask, and to see what a structured referral
            programme could add.
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
                  <th scope="col">Step</th>
                  <th scope="col">Formula</th>
                  <th scope="col">Default</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Referrals per year</td>
                  <td>Clients × referrals per client</td>
                  <td>20 × 1.5 = 30</td>
                </tr>
                <tr>
                  <td>New clients</td>
                  <td>Referrals × conversion</td>
                  <td>30 × 40% = 12</td>
                </tr>
                <tr>
                  <td>Referral revenue</td>
                  <td>New clients × lifetime value</td>
                  <td>12 × €900 = €10,800</td>
                </tr>
                <tr>
                  <td>Ad spend avoided</td>
                  <td>New clients × paid CAC</td>
                  <td>12 × €120 = €1,440</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Referral clients per month is simply new clients ÷ 12, here 1 a month on average.</p>
        </>
      ),
    },
    {
      heading: "Small changes, large effects",
      body: (
        <>
          <p>
            Raising referrals per client from 1.5 to 2.0 a year adds 4 more clients and €3,600 in
            revenue at these numbers. Raising conversion from 40% to 50% adds 3 clients and €2,700.
            Both are achievable with a deliberate referral ask and a smooth process for referred
            people.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Scenario</th>
                  <th scope="col">New clients a year</th>
                  <th scope="col">Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Default</td>
                  <td>12</td>
                  <td>€10,800</td>
                </tr>
                <tr>
                  <td>2.0 referrals per client</td>
                  <td>16</td>
                  <td>€14,400</td>
                </tr>
                <tr>
                  <td>50% conversion</td>
                  <td>15</td>
                  <td>€13,500</td>
                </tr>
                <tr>
                  <td>Both</td>
                  <td>20</td>
                  <td>€18,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      heading: "When to ask for referrals",
      body: (
        <>
          <ul>
            <li>
              <strong>After a milestone:</strong> a personal best, a goal weight, a first pull-up, a
              clothes size.
            </li>
            <li>
              <strong>After positive feedback:</strong> when a client thanks you or shares a win.
            </li>
            <li>
              <strong>At a natural review point:</strong> the end of a 12-week block or a quarterly
              check-in.
            </li>
            <li>
              <strong>When they mention someone:</strong> a partner, friend or colleague who wants
              similar help.
            </li>
          </ul>
          <p>
            Clients are most willing to refer when they feel their progress. Make the ask specific:
            'Do you know someone who's been trying to get stronger but doesn't know where to start?'
            works better than 'Know anyone who'd like coaching?'
          </p>
        </>
      ),
    },
    {
      heading: "Making referring easy",
      body: (
        <>
          <p>
            Give clients something simple to share: a link to your booking page, a short message
            they can forward, or a card. Tell them what happens next for the person they refer, so
            they feel comfortable recommending you. Thank them personally whether or not the
            referral becomes a client.
          </p>
          <p>
            For the person referred, make the first step smooth: a quick reply, a friendly call, and
            an acknowledgement of who sent them. That warmth helps conversion and shows the referrer
            they made a good recommendation.
          </p>
        </>
      ),
    },
    {
      heading: "Should you reward referrals?",
      body: (
        <>
          <p>
            Some coaches offer a reward, such as a free week, a discount or a small gift, for each
            referral who signs up. Rewards can increase referrals, but they are not essential. Many
            clients refer because they want to help a friend, and a sincere thank-you matters to
            them more than a discount.
          </p>
          <p>
            If you do offer rewards, keep them simple and include their cost when you compare
            referrals with paid acquisition. Even a generous reward is usually far cheaper than a
            paid client.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking referrals",
      body: (
        <>
          <p>
            Ask every new client how they heard about you, and record the referrer. Over a few
            months, you'll see your real referrals-per-client rate and referral conversion rate.
            Those replace estimates in the calculator with your own figures.
          </p>
          <p>
            Also note which clients refer most. They are often your most engaged clients, and their
            experience is a useful model for what keeps people happy.
          </p>
        </>
      ),
    },
    {
      heading: "Referrals and retention",
      body: (
        <>
          <p>
            Referrals and retention reinforce each other. Clients who stay longer have more time to
            refer, and clients who refer are often more committed themselves. Referred clients tend
            to have a friend going through the same thing, which can help them stick with it.
          </p>
          <p>
            Improving the coaching experience therefore lifts both numbers. Regular check-ins,
            visible progress and quick responses make clients more likely to stay and more likely to
            tell others.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing with paid acquisition",
      body: (
        <>
          <p>
            The ad spend avoided figure shows what the same clients would cost through paid ads. At
            €120 per client, 12 referral clients save €1,440 a year. If your paid CAC is higher, say
            €300, the saving rises to €3,600. That comparison often makes a small investment in a
            referral programme easy to justify.
          </p>
        </>
      ),
    },
    {
      heading: "Building a simple referral programme",
      body: (
        <>
          <ol>
            <li>Decide when you'll ask: after milestones, at review points, or both.</li>
            <li>Write a short, specific ask you can adapt for each client.</li>
            <li>Create a shareable link or message for clients to send.</li>
            <li>Decide whether to offer a reward, and keep it simple.</li>
            <li>Track every referral and who sent it.</li>
            <li>Thank every referrer personally.</li>
          </ol>
          <p>
            A programme like this takes an hour to set up and a few minutes a week to run. At the
            default numbers, even a small lift in referrals per client is worth thousands a year.
          </p>
        </>
      ),
    },
    {
      heading: "Referral conversion rate",
      body: (
        <>
          <p>
            Referral conversion is the share of referred people who become clients. It is usually
            higher than for other leads, because trust is already there. If yours is low, the
            problem is often the first contact: a slow reply, a generic message, or a process that
            feels like a sales funnel rather than a personal recommendation.
          </p>
          <p>
            Reply to referrals quickly and personally. Mention the person who referred them, ask
            about their goals and offer a friendly conversation rather than a hard sell.
          </p>
        </>
      ),
    },
    {
      heading: "Referrals from people who aren't clients",
      body: (
        <>
          <p>
            Referrals don't only come from clients. Physiotherapists, doctors, dietitians, gym
            owners and other professionals can refer people who need coaching. Building
            relationships with a few local or online professionals can bring a steady flow of
            well-matched clients.
          </p>
          <p>
            Be clear about what you offer and who it suits, keep referrers updated with permission,
            and refer to them in return where appropriate.
          </p>
        </>
      ),
    },
    {
      heading: "Lifetime value for referred clients",
      body: (
        <>
          <p>
            If referred clients stay longer than average in your business, use their actual lifetime
            value in the calculator. Many coaches find referred clients stay longer because they
            have a friend in a similar situation and arrived with realistic expectations. Even a
            modest difference in lifetime makes referrals more valuable still.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: a quarterly referral review",
      body: (
        <>
          <p>
            Every quarter, count referrals, conversions and the clients who referred. Enter the
            totals into the calculator. Compare with the previous quarter and with your paid
            acquisition cost. Note which moments produced the most referrals and plan more of them.
          </p>
          <p>
            Share the results with your clients, too. Thanking them and telling them their friend is
            doing well reinforces the habit of referring.
          </p>
        </>
      ),
    },
    {
      heading: "Referrals and capacity",
      body: (
        <>
          <p>
            A successful referral programme can bring more clients than you can comfortably serve.
            Before pushing referrals hard, check your capacity. If you are near full, consider a
            waiting list, a price increase or bringing in help. A waiting list can itself increase
            demand, because people value what others are waiting for.
          </p>
        </>
      ),
    },
    {
      heading: "A worked year",
      body: (
        <>
          <p>
            A coach with 20 clients starts asking for referrals at milestones and review points.
            Over the year, referrals per client rise from 1.0 to 2.0 and conversion stays at 40%.
            New referral clients rise from 8 to 16. At a lifetime value of €900, referral revenue
            grows from €7,200 to €14,400. At a paid acquisition cost of €120, the coach avoids
            €1,920 in ad spend.
          </p>
          <p>
            The only investment was a few minutes per client asking at the right time, and a simple
            way to share the booking link.
          </p>
        </>
      ),
    },
    {
      heading: "Referrals in online coaching",
      body: (
        <>
          <p>
            Online clients can refer people anywhere, which widens the pool. Shareable progress,
            such as a before-and-after photo with permission or a message about how they feel, often
            prompts friends to ask who their coach is. Make it easy for clients to pass on your
            details when that happens: a short link to a booking page or a friendly intro message
            they can forward.
          </p>
          <p>
            Online communities, such as a client group, also generate referrals as members share
            their experience with friends.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring referral quality",
      body: (
        <>
          <p>
            Not all referrals are equal. Track how long referred clients stay and what they pay,
            compared with clients from other sources. If referred clients stay noticeably longer,
            use their lifetime value in the calculator. The higher value strengthens the case for
            investing in referrals over paid acquisition.
          </p>
        </>
      ),
    },
    {
      heading: "What makes clients refer",
      body: (
        <>
          <p>
            Clients refer when three things are true: they are getting results, they feel looked
            after, and they know someone who would benefit. You can influence all three. Results
            come from a good plan and consistency. Feeling looked after comes from regular
            check-ins, quick replies and noticing their progress. Knowing someone comes up naturally
            if you ask the right question at the right time.
          </p>
          <p>
            Of the three, feeling looked after is the one coaches most often underestimate. A client
            who gets fair results but feels personally supported often refers more than one with
            great results who feels like a number.
          </p>
        </>
      ),
    },
    {
      heading: "Referral etiquette",
      body: (
        <>
          <p>
            Respect privacy. Never share a client's details or results with a referred person
            without permission. When a referral becomes a client, thank the referrer without
            revealing private information about their friend. If the referral doesn't sign, still
            thank the referrer; they did you a favour.
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
              <strong>New clients</strong> = clients × referrals per client × conversion.
            </li>
            <li>
              <strong>Referral revenue</strong> = new clients × lifetime value.
            </li>
            <li>
              <strong>Ad spend avoided</strong> = new clients × paid acquisition cost.
            </li>
            <li>
              <strong>Levers:</strong> asking at milestones, making sharing easy and replying
              quickly to referrals.
            </li>
          </ul>
          <p>
            Track referrals for a quarter, enter real numbers and set a target for the next quarter.
          </p>
        </>
      ),
    },
    {
      heading: "Words that make the ask easier",
      body: (
        <>
          <p>
            Many coaches avoid asking for referrals because it feels awkward. A natural, specific
            phrasing makes it easier for both sides. After a client shares a win, something like
            this works well: 'That's a brilliant result. If you know anyone who's been wanting to do
            something similar, I've got space for a couple of new clients this month, and I'd love
            to help them too.'
          </p>
          <p>
            Mentioning limited space is honest if true, and it tells clients you are selective.
            Naming the kind of person you help, such as someone returning to training after a break,
            helps clients think of a specific friend rather than a vague anyone.
          </p>
        </>
      ),
    },
    {
      heading: "Referral rewards that fit coaching",
      body: (
        <>
          <ul>
            <li>
              <strong>A free week or month</strong> of coaching for the referrer when the friend
              signs up.
            </li>
            <li>
              <strong>A discount on the next block</strong> of coaching.
            </li>
            <li>
              <strong>A small gift,</strong> such as a branded water bottle or a book.
            </li>
            <li>
              <strong>A shared reward,</strong> such as a discount for both the referrer and the new
              client.
            </li>
          </ul>
          <p>
            Whatever you choose, keep it simple to explain and include its cost when comparing
            referrals with paid acquisition. A free month worth €150 per new client is still cheaper
            than most paid acquisition.
          </p>
        </>
      ),
    },
    {
      heading: "Testimonials and referrals",
      body: (
        <>
          <p>
            Testimonials and referrals come from the same moments: when a client feels their
            progress. Asking for both at the same time works well. A client who writes a short
            testimonial has just put their experience into words, which makes it easier for them to
            recommend you to someone specific. With permission, testimonials also help referred
            people decide to sign.
          </p>
        </>
      ),
    },
    {
      heading: "When referrals dry up",
      body: (
        <>
          <p>
            If referrals slow down, look at the client experience first. Are check-ins regular? Are
            clients seeing progress? Do they feel heard? Referrals fall when clients feel neglected,
            often before cancellations rise, so a drop in referrals can be an early warning.
          </p>
          <p>
            Then look at the ask. Have you stopped asking? Busy periods often crowd out the small
            habits that bring referrals. Re-start the ask at milestones and review points, and the
            numbers usually recover within a couple of months.
          </p>
        </>
      ),
    },
    {
      heading: "Referral revenue in context",
      body: (
        <>
          <p>
            At the default figures, referrals bring €10,800 a year from 20 clients. For a coach
            earning €6,000 a month, that is about 15% of annual revenue at almost no acquisition
            cost. Raising it is one of the highest-return activities available to a small coaching
            business.
          </p>
        </>
      ),
    },
    {
      heading: "Referral clients per month",
      body: (
        <>
          <p>
            Spread across the year, 12 referral clients is one a month. That steady flow is valuable
            in itself: it smooths out busy and quiet months, keeps the calendar full without ads,
            and makes revenue more predictable. Coaches with a reliable referral stream often find
            they can be more selective about new clients and pricing, because they're not dependent
            on a single acquisition channel.
          </p>
        </>
      ),
    },
    {
      heading: "Combining referrals with other channels",
      body: (
        <>
          <p>
            Referrals work best alongside other channels rather than instead of them. Content and
            email keep you visible so that when a client mentions you, the friend can look you up
            and find something useful. Ads can then fill gaps in quieter months. Track each
            channel's clients and lifetime value, and you'll see that referral clients usually cost
            the least and stay the longest, which is a good reason to protect the habits that
            produce them.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Pick three clients who have had a recent win. In your next message or check-in,
            congratulate them and make a specific, friendly ask. Note any referrals in a simple
            list. Repeat each week, and after a month, enter your real numbers into the calculator.
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
    heading: "Make progress easy to see and share",
    body: (
      <>
        <p>
          Clients refer when they can see their progress. In Traiv, check-ins collect weight,
          measurements and photos, so you and your client can look back on how far they've come
          together.
        </p>
      </>
    ),
  },
  next: [
    { label: "Client LTV calculator", href: "/tools/client-ltv-calculator" },
    {
      label: "Customer acquisition cost calculator",
      href: "/tools/customer-acquisition-cost-calculator",
    },
    { label: "Email list value calculator", href: "/tools/email-list-value-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How do I calculate the value of referrals?",
      a: "Clients × referrals per client × conversion rate gives new clients; multiply by lifetime value for revenue.",
    },
    {
      q: "How many referrals should I expect per client?",
      a: "It varies. Track yours by asking every new client how they heard about you.",
    },
    {
      q: "Should I offer a referral reward?",
      a: "It can help, but many clients refer without one. Include any reward cost when comparing with paid acquisition.",
    },
    {
      q: "When is the best time to ask for a referral?",
      a: "After a milestone or positive feedback, when the client feels their progress most.",
    },
    {
      q: "Why compare referrals with paid ads?",
      a: "It shows the acquisition cost you avoid, which helps justify the effort of a referral programme.",
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
