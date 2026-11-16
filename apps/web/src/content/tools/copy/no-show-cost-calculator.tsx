import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "No-show cost calculator for coaches and trainers",
  description:
    "Calculate the revenue you lose each week, month and year to no-shows and late cancellations, and the share of your calendar they take.",
  eyebrow: "Free tool · For your coaching business",
  h1: "No-show cost calculator",
  intro: (
    <>
      <p>
        Enter weekly no-shows, late cancellations you can't refill, your average session value and
        booked sessions per week. See revenue lost per week, month and year, the share of capacity
        lost and what halving the problem would win back.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How much do no-shows cost a personal trainer?",
    answer: (
      <>
        <p>
          Multiply lost sessions by session value. Two no-shows and one late cancellation a week at
          €40 is €120 a week, about €520 a month and €6,240 a year, 10% of a 30-session week.
          Halving them wins back about €260 a month.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why no-shows matter",
      body: (
        <>
          <p>
            A missed session isn't only one lost payment. It's a slot you held, prepared for and
            can't usually fill at short notice. For trainers who are paid per session, it's direct
            lost income. For those on retainers, it's lost value for the client, which often leads
            to lower results, lower satisfaction and eventually cancellation.
          </p>
          <p>
            Because no-shows are spread across the week, they're easy to overlook. Adding them up
            for a year usually surprises coaches. A few missed sessions a week can add up to
            thousands.
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
                  <td>Lost sessions per week</td>
                  <td>No-shows + late cancellations</td>
                  <td>2 + 1 = 3</td>
                </tr>
                <tr>
                  <td>Lost per week</td>
                  <td>Lost sessions × session value</td>
                  <td>3 × €40 = €120</td>
                </tr>
                <tr>
                  <td>Lost per month</td>
                  <td>Weekly × 4.33</td>
                  <td>≈ €520</td>
                </tr>
                <tr>
                  <td>Lost per year</td>
                  <td>Weekly × 52</td>
                  <td>€6,240</td>
                </tr>
                <tr>
                  <td>Capacity lost</td>
                  <td>Lost sessions ÷ booked sessions</td>
                  <td>3 ÷ 30 = 10%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Only count late cancellations you can't refill. If a client cancels the day before and
            you book someone else into the slot, it isn't lost revenue.
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
                  <th scope="col">Lost per week</th>
                  <th scope="col">Lost per year</th>
                  <th scope="col">Capacity lost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1 no-show, 1 late cancel, €60 sessions, 25 booked</td>
                  <td>€120</td>
                  <td>€6,240</td>
                  <td>8%</td>
                </tr>
                <tr>
                  <td>2 no-shows, 1 late cancel, €40 sessions, 30 booked</td>
                  <td>€120</td>
                  <td>€6,240</td>
                  <td>10%</td>
                </tr>
                <tr>
                  <td>4 no-shows, 2 late cancels, €50 sessions, 40 booked</td>
                  <td>€300</td>
                  <td>€15,600</td>
                  <td>15%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Even a low no-show rate adds up over a year. At 15% capacity lost, the third trainer is
            losing the equivalent of nearly two months of work.
          </p>
        </>
      ),
    },
    {
      heading: "Session value on a retainer",
      body: (
        <>
          <p>
            If clients pay a monthly fee rather than per session, divide the fee by sessions per
            month to get session value. A client paying €320 for eight sessions has a session value
            of €40. Their no-show doesn't change your income that month, but it wastes the slot and
            lowers the value they get, which affects retention.
          </p>
          <p>
            For retainer clients, the true cost of no-shows is often churn: clients who miss
            sessions see fewer results and are more likely to cancel.
          </p>
        </>
      ),
    },
    {
      heading: "Why clients miss sessions",
      body: (
        <>
          <ul>
            <li>
              <strong>Forgetting:</strong> no reminder, or a reminder too early to be useful.
            </li>
            <li>
              <strong>Low commitment:</strong> the session feels optional, especially if there's no
              cost to missing it.
            </li>
            <li>
              <strong>Schedule clashes:</strong> work, family or travel the client didn't plan
              around.
            </li>
            <li>
              <strong>Low motivation:</strong> a plateau, a bad week, or uncertainty about the plan.
            </li>
            <li>
              <strong>Illness or emergencies:</strong> unavoidable, and best handled kindly.
            </li>
          </ul>
          <p>
            Most of these can be reduced with clear policies, good reminders and a coaching
            relationship that makes sessions feel worth showing up for.
          </p>
        </>
      ),
    },
    {
      heading: "Reducing no-shows",
      body: (
        <>
          <ol>
            <li>Send a reminder the day before and a short message an hour before.</li>
            <li>Set and share a clear cancellation policy, such as 24 hours' notice.</li>
            <li>Use packages paid in advance, so sessions feel committed.</li>
            <li>Book recurring slots, so sessions become a habit.</li>
            <li>Follow up after a missed session with a friendly message, not a telling-off.</li>
            <li>Notice patterns: a client who misses two in a row may be losing motivation.</li>
          </ol>
          <p>
            Halving no-shows and late cancellations, which is realistic for many trainers, wins back
            half the annual loss.
          </p>
        </>
      ),
    },
    {
      heading: "Cancellation policies",
      body: (
        <>
          <p>
            A cancellation policy sets expectations: how much notice clients need to give, and what
            happens if they don't. Common policies include counting late cancellations as used
            sessions, charging a fee, or allowing a set number of late changes per month. Whatever
            you choose, explain it at the start, put it in writing and apply it consistently.
          </p>
          <p>
            Be fair and flexible for genuine emergencies. A rigid policy applied harshly can cost
            you a client worth far more than one session.
          </p>
        </>
      ),
    },
    {
      heading: "No-shows in online coaching",
      body: (
        <>
          <p>
            Online coaches usually have fewer live sessions, but the same idea applies to scheduled
            calls and to missed check-ins. A client who misses a weekly check-in isn't costing you a
            slot, but they're losing momentum. Track missed check-ins the same way: count them,
            notice patterns and reach out quickly. They are among the clearest early signs a client
            may leave.
          </p>
        </>
      ),
    },
    {
      heading: "Turning no-show time into value",
      body: (
        <>
          <p>
            When a session is missed, the slot doesn't have to be wasted. Some trainers keep a short
            list of clients who want extra sessions or would take an earlier slot, and message them
            when a gap appears. Others use the time for programming, content or admin. Either way,
            the slot does something useful even if the revenue is lost.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking no-shows",
      body: (
        <>
          <p>
            Keep a simple record: date, client, no-show or late cancellation, and reason if known.
            After a month, enter the weekly averages into the calculator. After a quarter, look for
            patterns by client, day and time. Fixing a handful of repeat offenders, or moving a
            troublesome time slot, often reduces no-shows more than general policies.
          </p>
        </>
      ),
    },
    {
      heading: "Reminders that work",
      body: (
        <>
          <p>
            A good reminder system is the simplest fix. Send a message the day before with the time
            and location or link, and a short note an hour before. Ask clients to reply to confirm.
            Many scheduling tools can send these automatically. Trainers who start sending reminders
            often see no-shows fall noticeably within weeks.
          </p>
          <p>
            Keep reminders friendly and brief. A reminder that feels like a warning can make clients
            defensive; one that feels like a helpful nudge works better.
          </p>
        </>
      ),
    },
    {
      heading: "Prepaid packages",
      body: (
        <>
          <p>
            When clients pay for a block of sessions in advance, they're more likely to attend,
            because each missed session feels like wasted money. Packages also protect your income:
            if a client misses a session without notice, the session is used under your policy. Many
            trainers move from pay-per-session to packages specifically to reduce no-shows and
            smooth income.
          </p>
        </>
      ),
    },
    {
      heading: "Recurring bookings",
      body: (
        <>
          <p>
            Clients with the same slot every week treat sessions as part of their routine, like a
            standing meeting. Ad hoc bookings are easier to forget or move. Encouraging clients to
            book a regular time, and keeping that slot for them, reduces both no-shows and late
            cancellations.
          </p>
        </>
      ),
    },
    {
      heading: "Talking to repeat no-shows",
      body: (
        <>
          <p>
            If a client misses several sessions, talk to them directly and kindly. Ask what's
            getting in the way. Often there's a reason you can help with: a time that no longer
            works, a change at home or work, or a loss of motivation. A different time slot, a
            shorter session or a fresh goal can solve the problem.
          </p>
          <p>
            If the pattern continues, it may be better for both of you to pause the coaching or
            change the format. A client who repeatedly misses sessions isn't getting results, and
            that reflects on your coaching.
          </p>
        </>
      ),
    },
    {
      heading: "The real cost includes churn",
      body: (
        <>
          <p>
            The calculator shows direct revenue lost. The indirect cost is often larger. Clients who
            miss sessions get fewer results, feel less connected and are more likely to cancel. A
            client worth €2,000 over their lifetime who leaves after a run of missed sessions costs
            far more than the sessions themselves.
          </p>
          <p>That's why reducing no-shows is as much a retention strategy as a revenue one.</p>
        </>
      ),
    },
    {
      heading: "For coaches: a monthly no-show review",
      body: (
        <>
          <p>
            At the end of each month, count no-shows and late cancellations, and note which clients
            and time slots were involved. Enter the weekly averages into the calculator. Identify
            one change for next month: a reminder tweak, a policy reminder, a conversation with a
            repeat no-show or moving a problem slot. Compare next month's numbers.
          </p>
          <p>Small changes usually make a visible difference within one or two months.</p>
        </>
      ),
    },
    {
      heading: "No-shows and group sessions",
      body: (
        <>
          <p>
            In group sessions, one absence doesn't lose the session, but it lowers the energy and,
            over time, the group's value. Track attendance for groups as well. Members who miss
            several sessions in a row are at high risk of leaving, and a personal message often
            brings them back.
          </p>
        </>
      ),
    },
    {
      heading: "Writing a fair cancellation policy",
      body: (
        <>
          <ol>
            <li>State the notice period clearly, for example 24 hours.</li>
            <li>
              Say what happens with late cancellations: the session is counted, a fee applies or it
              can be rescheduled once.
            </li>
            <li>Say what happens with no-shows.</li>
            <li>Explain any exceptions, such as illness or emergencies.</li>
            <li>Share it at the start, in writing, and ask clients to confirm they've read it.</li>
          </ol>
          <p>
            Clients usually accept a clear, fair policy without complaint, especially when it's
            explained as a way to protect everyone's time.
          </p>
        </>
      ),
    },
    {
      heading: "No-shows and pricing",
      body: (
        <>
          <p>
            If no-shows are common, part of your effective price is being lost. A trainer charging
            €40 a session with 10% of sessions lost effectively earns €36 a booked slot. Raising
            prices to account for expected losses is one approach, but reducing no-shows is better:
            it raises income and improves client results at the same time.
          </p>
        </>
      ),
    },
    {
      heading: "Rescheduling versus cancelling",
      body: (
        <>
          <p>
            Offering easy rescheduling, such as moving a session within the same week, often reduces
            outright no-shows. Clients who can move a session are less likely to skip it. Set
            limits, such as one reschedule per month, so flexibility doesn't become disruption.
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
              <strong>Lost per week</strong> = (no-shows + late cancellations) × session value.
            </li>
            <li>
              <strong>Per year</strong> = weekly loss × 52.
            </li>
            <li>
              <strong>Capacity lost</strong> = lost sessions ÷ booked sessions.
            </li>
            <li>
              <strong>Fixes:</strong> reminders, a clear policy, prepaid packages and recurring
              slots.
            </li>
          </ul>
          <p>Track them for a month, enter the averages and pick one fix to try first.</p>
        </>
      ),
    },
    {
      heading: "Deposits for new clients",
      body: (
        <>
          <p>
            New clients have the highest no-show rates, because they haven't yet built the habit or
            the relationship. Taking a small deposit or the first payment before the first session
            reduces no-shows sharply. Credit the deposit against their package so it doesn't feel
            like an extra charge.
          </p>
        </>
      ),
    },
    {
      heading: "Time slots and no-shows",
      body: (
        <>
          <p>
            No-shows often cluster at particular times. Early mornings may see more missed sessions
            in winter; late evenings may suffer after long workdays; Mondays and Fridays may be
            worse than mid-week. Tracking no-shows by time slot shows where the problem is
            concentrated. Moving clients who often miss a certain slot to a time that suits them
            better, or keeping riskier slots for flexible clients, can cut the overall rate.
          </p>
        </>
      ),
    },
    {
      heading: "A worked improvement",
      body: (
        <>
          <p>
            A trainer with 40 booked sessions a week sees 4 no-shows and 2 late cancellations at €50
            a session: €300 a week, €1,300 a month and €15,600 a year, or 15% of capacity. After
            introducing reminders, a 24-hour policy and prepaid packages, no-shows fall to 2 and
            late cancellations to 1. Lost revenue falls to €150 a week, saving about €650 a month
            and €7,800 a year.
          </p>
          <p>
            The changes took an afternoon to set up. Few business improvements pay back as quickly.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Count last week's no-shows and late cancellations, enter them with your session value
            and booked sessions, and note the yearly figure. Then set up a day-before reminder for
            every session this week. Next week, compare.
          </p>
        </>
      ),
    },
    {
      heading: "When the client isn't the problem",
      body: (
        <>
          <p>
            Sometimes no-shows reflect the schedule rather than the client. Slots that clash with
            school runs, commutes or shift patterns are missed more often. If several clients
            struggle with the same time, consider changing your availability. A slightly less
            convenient schedule for you can be worth it if it cuts missed sessions and keeps clients
            longer.
          </p>
        </>
      ),
    },
    {
      heading: "Online check-ins as the online no-show",
      body: (
        <>
          <p>
            For online coaches, a missed check-in plays the role of a no-show. It doesn't cost a
            slot, but it breaks the rhythm that keeps clients progressing. Treat missed check-ins
            with the same care: a reminder the day before, a friendly nudge the day after, and a
            personal conversation if two are missed in a row. Clients who keep checking in tend to
            keep paying.
          </p>
          <p>
            Counting missed check-ins each week gives online coaches an early warning system as
            useful as a trainer's no-show log.
          </p>
        </>
      ),
    },
    {
      heading: "Talking about attendance at onboarding",
      body: (
        <>
          <p>
            The best time to set expectations about attendance is the first conversation. Explain
            why consistency matters for their results, how reminders work, what the cancellation
            policy is and how to reschedule. Clients who understand the reasons are far more likely
            to show up, and far less likely to feel surprised if the policy is applied later.
          </p>
        </>
      ),
    },
    {
      heading: "Recording the result",
      body: (
        <>
          <p>
            Write down this year's estimated loss and set a target, such as halving it within three
            months. Re-run the calculator monthly with real numbers. Seeing the figure fall is a
            strong motivator to keep reminders and policies in place.
          </p>
        </>
      ),
    },
    {
      heading: "Thanking clients who show up",
      body: (
        <>
          <p>
            Attendance is a habit worth reinforcing. Noticing when a client has made every session
            for a month, and saying so, encourages them to keep going. Positive attention tends to
            work better than penalties for keeping clients consistent.
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
    { label: "Client capacity calculator", href: "/tools/client-capacity-calculator" },
    {
      label: "Coaching package pricing calculator",
      href: "/tools/coaching-package-pricing-calculator",
    },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How do I calculate the cost of no-shows?",
      a: "Multiply lost sessions per week by session value, then by 4.33 for a month or 52 for a year.",
    },
    {
      q: "Should late cancellations count?",
      a: "Only those you can't refill. If you rebook the slot, it isn't lost revenue.",
    },
    {
      q: "What is a good cancellation policy for personal trainers?",
      a: "Many use 24 hours' notice, with late cancellations counted as used sessions. Apply it consistently and kindly.",
    },
    {
      q: "How can I reduce no-shows?",
      a: "Reminders the day before and an hour before, a clear policy, prepaid packages and recurring slots.",
    },
    {
      q: "What about clients on monthly retainers?",
      a: "Divide the monthly fee by sessions to get session value. Missed sessions lower results and often lead to churn.",
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
