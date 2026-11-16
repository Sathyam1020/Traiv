import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Client churn rate calculator for coaches",
  description:
    "Calculate your monthly client churn rate, retention rate, average client lifespan and net change for a coaching business.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Client churn rate calculator",
  intro: (
    <>
      <p>
        Add your client count on the first of the month, the clients who left and the clients who
        joined. See your monthly churn rate, retention rate, average client lifespan and the net
        change in your client base.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate client churn rate?",
    answer: (
      <>
        <p>
          Divide clients lost during the month by clients at the start of the month. Losing 2 of 40
          is a 5% monthly churn rate, so 95% stayed. At 5% a month, the average client stays about
          20 months. With 4 new clients, you finish on 42, a net gain of 2.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What churn is",
      body: (
        <>
          <p>
            Churn is the share of clients who stop coaching with you in a given period. For most
            coaching businesses, monthly churn is the most useful measure, because billing and
            check-ins usually run monthly or weekly. A 5% monthly churn rate means that, on average,
            one in twenty clients leaves each month.
          </p>
          <p>
            Churn matters because it quietly limits growth. Every client who leaves has to be
            replaced before the business can grow. A coach who signs five clients a month and loses
            five stays the same size, however hard they work on marketing. Lowering churn is often
            the fastest way to grow, because it compounds: every client kept is a client you don't
            have to replace.
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
                  <th scope="col">Default</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly churn</td>
                  <td>Clients lost ÷ clients at start</td>
                  <td>2 ÷ 40 = 5%</td>
                </tr>
                <tr>
                  <td>Monthly retention</td>
                  <td>100% − churn</td>
                  <td>95%</td>
                </tr>
                <tr>
                  <td>Average lifespan</td>
                  <td>1 ÷ monthly churn</td>
                  <td>1 ÷ 0.05 = 20 months</td>
                </tr>
                <tr>
                  <td>Net change</td>
                  <td>Added − lost</td>
                  <td>4 − 2 = +2</td>
                </tr>
                <tr>
                  <td>Ending clients</td>
                  <td>Start − lost + added</td>
                  <td>42</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            New clients are deliberately left out of the churn calculation. They grow the client
            base, but they don't change how many of your existing clients left. Mixing them in hides
            churn behind growth.
          </p>
        </>
      ),
    },
    {
      heading: "A second example",
      body: (
        <>
          <p>
            A coach starts the month with 60 clients, loses 6 and gains 5. Churn is 6 ÷ 60 = 10%,
            retention 90%, and the average client stays about 10 months. The client base shrinks by
            one, to 59, despite five new sign-ups.
          </p>
          <p>
            This coach has a marketing engine that works but a retention problem that cancels it
            out. Halving churn to 5% would turn the same month into a net gain of two clients, and
            over a year would add dozens of clients without any extra marketing.
          </p>
        </>
      ),
    },
    {
      heading: "Monthly churn over a year",
      body: (
        <>
          <p>
            Monthly churn compounds. A monthly rate that sounds small adds up to a large share of
            clients over a year.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Monthly churn</th>
                  <th scope="col">Average lifespan</th>
                  <th scope="col">Clients lost over 12 months (of a starting group)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>3%</td>
                  <td>33 months</td>
                  <td>about 31%</td>
                </tr>
                <tr>
                  <td>5%</td>
                  <td>20 months</td>
                  <td>about 46%</td>
                </tr>
                <tr>
                  <td>10%</td>
                  <td>10 months</td>
                  <td>about 72%</td>
                </tr>
                <tr>
                  <td>15%</td>
                  <td>6.7 months</td>
                  <td>about 86%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            At 5% monthly churn, nearly half of a starting group of clients has left within a year.
            At 10%, almost three quarters have. That is why even a two-point improvement in monthly
            churn has a large effect on the business.
          </p>
        </>
      ),
    },
    {
      heading: "Why coaching clients leave",
      body: (
        <>
          <ul>
            <li>
              <strong>They reached their goal</strong> and don't see a next step.
            </li>
            <li>
              <strong>They stopped seeing progress</strong> or lost motivation after an early
              plateau.
            </li>
            <li>
              <strong>They felt unsupported:</strong> slow replies, generic plans, check-ins that
              felt like a form.
            </li>
            <li>
              <strong>Life changed:</strong> money, time, health, a move or a new job.
            </li>
            <li>
              <strong>The plan didn't fit:</strong> too demanding, too rigid or not what they
              expected.
            </li>
            <li>
              <strong>Price:</strong> usually combined with one of the reasons above rather than on
              its own.
            </li>
          </ul>
          <p>
            Some churn is healthy. Clients who reach a goal and move on happily often refer others
            or come back later. The churn worth fighting is the avoidable kind: clients who leave
            because they felt forgotten or stuck.
          </p>
        </>
      ),
    },
    {
      heading: "Spotting churn before it happens",
      body: (
        <>
          <p>
            Most clients give signals before they cancel. They miss a check-in, reply more slowly,
            log fewer workouts, or stop sending photos. A sudden change in tone, such as shorter
            messages or no questions, often comes first. Coaches who notice these signals and reach
            out personally keep many clients who would otherwise have left.
          </p>
          <p>
            A simple weekly review helps: for each client, did they check in, did they train, did
            they reply? Anyone with two misses in a row gets a personal message that week. The
            client churn risk reader on this site can help with this.
          </p>
        </>
      ),
    },
    {
      heading: "Habits that keep coaching clients",
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
            None of these is complicated. What makes the difference is doing them every week for
            every client, which is where a simple system helps far more than good intentions.
          </p>
        </>
      ),
    },
    {
      heading: "Healthy churn and goal-based coaching",
      body: (
        <>
          <p>
            Not all coaching is meant to last forever. A 12-week transformation programme has a
            natural end, and clients finishing it shouldn't count as failures. For programme-based
            coaching, measure completion rate and renewal rate instead: how many finish the
            programme, and how many continue to a next phase.
          </p>
          <p>
            For ongoing monthly coaching, a lower churn rate is the goal. Many coaches mix both: a
            fixed starting programme followed by ongoing coaching for those who want to continue.
            Track each part separately.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring churn accurately",
      body: (
        <>
          <p>
            Count a client as lost in the month they stop paying or stop coaching, whichever comes
            first. Paused clients are a grey area; decide on a rule, such as counting pauses longer
            than one month as churn, and apply it consistently. Clients who move to a cheaper tier
            aren't churn, but the revenue drop is worth tracking separately.
          </p>
          <p>
            If your client numbers are small, monthly churn can jump around. One client leaving from
            a base of 10 is 10% churn. Averaging over three months gives a steadier picture.
          </p>
        </>
      ),
    },
    {
      heading: "Churn and revenue",
      body: (
        <>
          <p>
            Client churn counts people. Revenue churn counts money. If higher-paying clients leave
            more often than lower-paying ones, revenue churn will be higher than client churn.
            Tracking both shows whether you are losing your most valuable clients.
          </p>
          <p>
            The client LTV calculator turns churn into lifetime value, and the revenue projector
            shows how churn shapes revenue over a year.
          </p>
        </>
      ),
    },
    {
      heading: "Setting a churn target",
      body: (
        <>
          <p>
            Start with your current three-month average. Set a target to reduce it by a point or two
            over the next quarter, and choose one or two retention habits to focus on. Re-run the
            calculator each month. Most coaches find that a few consistent changes, such as faster
            replies and personal messages after missed check-ins, move churn more than any big new
            feature or offer.
          </p>
        </>
      ),
    },
    {
      heading: "Churn by client group",
      body: (
        <>
          <p>
            An overall churn rate can hide very different patterns. New clients in their first two
            or three months often leave at a much higher rate than clients who have been with you
            for a year. Clients on cheaper plans may churn faster than those on premium coaching.
            Clients from referrals may stay longer than those from ads.
          </p>
          <p>
            Work out churn for each group separately once a quarter. If first-quarter churn is high,
            onboarding is the place to focus. If ad clients churn faster than referral clients, look
            at what the ads promise and whether the coaching delivers it. Targeted fixes work better
            than general efforts to reduce churn across the board.
          </p>
        </>
      ),
    },
    {
      heading: "The first 90 days",
      body: (
        <>
          <p>
            Many coaching clients who leave do so in the first three months. They sign up motivated,
            hit the first plateau or busy week, and drift away if nobody notices. A strong first 90
            days makes a big difference: a clear onboarding call, a plan that suits their real
            schedule, a quick early win, and more frequent contact in the first weeks.
          </p>
          <ol>
            <li>Week 1: onboarding call, first plan, a short check-in after the first few days.</li>
            <li>
              Weeks 2 to 4: weekly check-ins with personal feedback, and one adjustment to show the
              plan responds to them.
            </li>
            <li>
              Month 2: a short progress review, with visible changes in numbers, photos or habits.
            </li>
            <li>Month 3: a goal review and the next goal agreed.</li>
          </ol>
          <p>Clients who reach month four are much more likely to stay for a long time.</p>
        </>
      ),
    },
    {
      heading: "Exit conversations",
      body: (
        <>
          <p>
            When a client decides to leave, ask briefly and kindly why. A two-question message
            works: 'What made you decide to stop?' and 'Is there anything I could have done
            differently?' Some won't answer, but those who do give you the most useful feedback
            you'll get. Thank them, wish them well and let them know they're welcome back.
          </p>
          <p>
            Record the reasons. Over a few months, patterns appear: price, time, results, feeling
            unsupported, life changes. Each pattern points to a specific improvement.
          </p>
        </>
      ),
    },
    {
      heading: "Win-back",
      body: (
        <>
          <p>
            Former clients are often the easiest new clients to win. They know your coaching, and
            many left for reasons that have since changed: a busy period has ended, money is easier,
            or they've lost the progress they made. A friendly message two or three months after
            they leave, asking how they're getting on and mentioning that you have space, often
            brings some back.
          </p>
          <p>
            Returning clients also count as new clients in the churn calculation. Track them
            separately if you want to see how many of your sign-ups are returns.
          </p>
        </>
      ),
    },
    {
      heading: "Churn and pricing",
      body: (
        <>
          <p>
            Raising prices can increase churn in the short term, especially among clients who were
            already drifting. But lower prices don't necessarily mean lower churn. Clients who pay
            more are often more committed, and very cheap coaching can attract people who are less
            serious about change.
          </p>
          <p>
            If you're considering a price change, use the price increase calculator to model it, and
            watch churn for the following two or three months.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: a monthly churn review",
      body: (
        <>
          <p>
            At the start of each month, enter last month's starting clients, losses and gains. Note
            the churn rate and compare with the previous three months. List the clients who left and
            why. Then look at who might be at risk this month: missed check-ins, slower replies,
            fewer logged workouts. Reach out to them personally this week.
          </p>
          <p>
            This takes about 20 minutes a month and is one of the most valuable habits a coaching
            business can have.
          </p>
        </>
      ),
    },
    {
      heading: "Churn as a measure of coaching quality",
      body: (
        <>
          <p>
            Churn isn't only a business number. It's also a signal of how well the coaching meets
            clients' needs. Low churn usually means clients are seeing progress, feel supported and
            value what they pay for. Rising churn often means something in the experience has
            slipped: replies have slowed, plans have become generic, or the coach is stretched too
            thin.
          </p>
          <p>
            Treat a rise in churn as feedback rather than bad luck. Ask what changed in your
            coaching, your capacity or your client mix in the months before it rose.
          </p>
        </>
      ),
    },
    {
      heading: "Churn and capacity",
      body: (
        <>
          <p>
            When a coach is stretched too thin, churn often rises. Replies slow down, check-in
            feedback gets shorter and plans become less personal. Clients notice, even if they don't
            say so, and some leave. If churn has risen as your client count has grown, check whether
            you've passed the number of clients you can serve well. The client capacity calculator
            helps estimate that limit.
          </p>
          <p>
            Sometimes the best way to lower churn is to stop adding clients for a while, raise
            prices for new ones, or bring in help, so that every client gets the attention they
            signed up for.
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
              <strong>Monthly churn</strong> = clients lost ÷ clients at the start of the month.
            </li>
            <li>
              <strong>Average lifespan</strong> = 1 ÷ monthly churn.
            </li>
            <li>
              <strong>New clients</strong> don't change churn; they change net growth.
            </li>
            <li>
              <strong>Biggest risk window:</strong> the first 90 days.
            </li>
            <li>
              <strong>Fastest fix:</strong> personal contact as soon as a client goes quiet.
            </li>
          </ul>
          <p>
            Measure churn every month, look at who left and why, and act on the warning signs before
            they turn into cancellations.
          </p>
        </>
      ),
    },
    {
      heading: "Small numbers and noisy churn",
      body: (
        <>
          <p>
            For a coach with 15 clients, losing one is nearly 7% churn and losing two is 13%.
            Month-to-month figures swing widely, which can feel alarming. Use a rolling three-month
            average instead: add the clients lost over three months and divide by the average
            starting count. That smooths out the noise and shows the real trend. As your client base
            grows, monthly figures become steadier on their own.
          </p>
        </>
      ),
    },
    {
      heading: "Annual churn versus monthly churn",
      body: (
        <>
          <p>
            Some businesses report annual churn: the share of clients who leave within a year. For
            coaching, monthly churn is usually more useful, because it responds faster to changes in
            your coaching. To estimate the share of a starting group still with you after a year,
            raise monthly retention to the power of 12. At 95% monthly retention, that's 0.95 to the
            12th power, or about 54%.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this month",
      body: (
        <>
          <p>
            Enter last month's numbers now. Then list every client who hasn't checked in for two
            weeks and send each a short, personal message today. Next month, compare churn with this
            one. That single habit is often enough to move the number.
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
    { label: "Coaching revenue projector", href: "/tools/coaching-revenue-projector" },
    { label: "Client churn risk reader", href: "/tools/client-churn-risk-reader" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "What is a good churn rate for coaching clients?",
      a: "Lower is better, but it depends on your model. For ongoing monthly coaching, many coaches aim for under 5% a month. Track your own three-month average and work to improve it.",
    },
    {
      q: "Should new clients be included in churn?",
      a: "No. Churn uses only clients lost against your starting base. New clients show up in net change.",
    },
    {
      q: "How do I calculate average client lifespan?",
      a: "Divide 1 by monthly churn as a decimal. At 5% churn, that's 1 ÷ 0.05 = 20 months.",
    },
    {
      q: "What's the difference between churn and retention?",
      a: "Retention is the share who stayed; churn is the share who left. Together they make 100%.",
    },
    {
      q: "Why does churn matter so much?",
      a: "Every lost client has to be replaced before you can grow. Lower churn compounds into a larger, steadier business.",
    },
    {
      q: "How should I count paused clients?",
      a: "Choose a rule, such as counting pauses longer than a month as churn, and use it consistently.",
    },
    {
      q: "What's the fastest way to lower churn?",
      a: "Notice early warning signs, such as missed check-ins, and reach out personally within the week.",
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
