import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Client capacity calculator for coaches",
  description:
    "Work out how many coaching clients you can serve well from your weekly hours, time per client, admin overhead and buffer, with revenue at capacity.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Client capacity calculator",
  intro: (
    <>
      <p>
        Enter your coaching hours, the minutes each client takes per week, your admin overhead and
        the buffer you keep free. See the most clients you can serve at that depth, your theoretical
        ceiling and, with a price, revenue at capacity.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How many coaching clients can I handle?",
    answer: (
      <>
        <p>
          Take your weekly hours, remove admin time, divide by minutes per client, then leave
          headroom. With 30 hours, 20% admin and 30 minutes per client, you have 24 hours of
          coaching time: room for 48 clients. Keeping a 15% buffer, about 40 is sustainable. At €120
          a month, that's €4,800 a month at capacity.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why capacity matters",
      body: (
        <>
          <p>
            Every coach has a limit. Past it, replies slow down, check-in feedback gets shorter,
            plans become generic and clients start to notice. Churn rises just as the business seems
            to be growing. Knowing your capacity in advance lets you plan for it: raise prices
            before you hit it, bring in help, add a group offer, or simply stop taking on clients
            until you have space.
          </p>
          <p>
            Capacity also connects your income goal to your calendar. If your goal needs 60 clients
            and your capacity is 40, no amount of marketing will close the gap without changing how
            you deliver.
          </p>
        </>
      ),
    },
    {
      heading: "How the calculation works",
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
                  <td>Coaching time</td>
                  <td>Weekly hours × (1 − admin %)</td>
                  <td>30 × 0.8 = 24 hours</td>
                </tr>
                <tr>
                  <td>Ceiling</td>
                  <td>Coaching minutes ÷ minutes per client</td>
                  <td>1,440 ÷ 30 = 48 clients</td>
                </tr>
                <tr>
                  <td>Sustainable</td>
                  <td>Ceiling × (1 − buffer %)</td>
                  <td>48 × 0.85 ≈ 40 clients</td>
                </tr>
                <tr>
                  <td>Revenue at capacity</td>
                  <td>Sustainable × price</td>
                  <td>40 × €120 = €4,800 a month</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The ceiling is the most clients you could fit if every week went perfectly. The
            sustainable figure leaves headroom for onboarding new clients, busy weeks, sick days and
            clients who need extra time.
          </p>
        </>
      ),
    },
    {
      heading: "Typical ranges by coaching mode",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Mode</th>
                  <th scope="col">Time per client per week</th>
                  <th scope="col">Typical sustainable clients</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1:1 in-person</td>
                  <td>45 to 75 minutes</td>
                  <td>about 15 to 30</td>
                </tr>
                <tr>
                  <td>Hybrid</td>
                  <td>30 to 60 minutes</td>
                  <td>about 25 to 50</td>
                </tr>
                <tr>
                  <td>Online async</td>
                  <td>15 to 40 minutes</td>
                  <td>about 40 to 80 or more</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Treat these as rough guides. Your own number depends on the depth of your service, how
            much programming you reuse, how many clients need nutrition support and how much of the
            week goes on non-coaching work.
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
                  <th scope="col">Coach</th>
                  <th scope="col">Hours</th>
                  <th scope="col">Minutes per client</th>
                  <th scope="col">Admin</th>
                  <th scope="col">Buffer</th>
                  <th scope="col">Sustainable clients</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>In-person trainer</td>
                  <td>30</td>
                  <td>60</td>
                  <td>20%</td>
                  <td>15%</td>
                  <td>20</td>
                </tr>
                <tr>
                  <td>Online coach, light touch</td>
                  <td>30</td>
                  <td>15</td>
                  <td>20%</td>
                  <td>15%</td>
                  <td>81</td>
                </tr>
                <tr>
                  <td>Hybrid coach</td>
                  <td>25</td>
                  <td>45</td>
                  <td>25%</td>
                  <td>10%</td>
                  <td>22</td>
                </tr>
                <tr>
                  <td>Online coach, standard</td>
                  <td>30</td>
                  <td>20</td>
                  <td>20%</td>
                  <td>15%</td>
                  <td>61</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The online coach with 15 minutes per client can technically hold 81 clients. Whether
            that is a good idea depends on whether 15 minutes is enough to coach them well. Many
            coaches who chase very high client counts find quality slips and churn rises.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring minutes per client honestly",
      body: (
        <>
          <p>
            Minutes per client is the input that matters most, and it's often underestimated.
            Include everything you do for a client each week: reviewing check-ins, writing feedback,
            adjusting programmes, building meal plans, answering messages, and any calls or
            sessions. Track it for a week or two for a few typical clients.
          </p>
          <p>
            Many coaches find that messaging alone takes 10 minutes or more per client per week,
            more than they expected. Some clients take far more time than others. Use an average
            across your typical client, and consider separate tiers for clients who want much more
            contact.
          </p>
        </>
      ),
    },
    {
      heading: "Admin overhead",
      body: (
        <>
          <p>
            Admin is the time that keeps the business running but isn't spent coaching: sales calls,
            content, invoicing, email, bookkeeping and learning. For many coaches it's 20 to 30% of
            the working week, and more for those who create a lot of content or run their own
            marketing.
          </p>
          <p>
            Be realistic. If you spend eight hours a week on content and sales, that's over a
            quarter of a 30-hour week. Underestimating admin is a common reason coaches feel
            overworked even when their client count looks reasonable.
          </p>
        </>
      ),
    },
    {
      heading: "Why keep a buffer",
      body: (
        <>
          <p>
            A buffer is space you deliberately keep free. It absorbs new client onboarding, which
            often takes two or three times a normal week's time; clients going through difficult
            periods who need more support; and your own sick days or holidays. Without a buffer,
            every unusual week pushes you over capacity.
          </p>
          <p>
            A buffer of 10 to 20% suits most coaches. Those with many new clients each month, or
            with clients who need a lot of support, may need more.
          </p>
        </>
      ),
    },
    {
      heading: "Raising capacity without losing quality",
      body: (
        <>
          <ul>
            <li>
              <strong>Templates and libraries:</strong> reusable programmes, exercise libraries and
              meal plan templates you adapt rather than build from scratch.
            </li>
            <li>
              <strong>Structured check-ins:</strong> a consistent form makes reviewing faster and
              feedback clearer.
            </li>
            <li>
              <strong>Batching:</strong> reviewing check-ins at set times rather than as they
              arrive.
            </li>
            <li>
              <strong>Clear messaging expectations:</strong> agreed response times and channels
              reduce constant interruptions.
            </li>
            <li>
              <strong>Group elements:</strong> a group call or community for common questions.
            </li>
            <li>
              <strong>Help:</strong> an assistant coach for some clients or tasks.
            </li>
          </ul>
          <p>
            Each of these lowers minutes per client or admin overhead, which raises capacity without
            cutting the attention clients feel.
          </p>
        </>
      ),
    },
    {
      heading: "Capacity and pricing",
      body: (
        <>
          <p>
            If you are near capacity, raising prices is often better than adding clients. Higher
            prices increase revenue without increasing workload, and if a few clients leave, you
            free space for new clients at the new rate. The price increase calculator shows how much
            client loss a rise can absorb.
          </p>
          <p>
            A waiting list is a sign you are at capacity and that demand supports a higher price.
          </p>
        </>
      ),
    },
    {
      heading: "Capacity and your income goal",
      body: (
        <>
          <p>
            Multiply sustainable clients by price to see revenue at capacity. If that falls short of
            your goal, you have three options: raise price, increase capacity through systems or
            help, or change your model, for example by adding a group programme. Knowing which gap
            you face makes the decision clearer.
          </p>
          <p>
            At the default 40 clients and €120 a month, capacity revenue is €4,800 a month, or
            €57,600 a year. If your goal is €80,000, you need either more capacity or a higher
            price; working harder within the same structure won't get you there.
          </p>
        </>
      ),
    },
    {
      heading: "Signs you're over capacity",
      body: (
        <>
          <ul>
            <li>
              <strong>Check-in replies slip</strong> from same day to two or three days.
            </li>
            <li>
              <strong>Feedback gets shorter</strong> and more generic.
            </li>
            <li>
              <strong>Programmes stay the same</strong> for longer than they should.
            </li>
            <li>
              <strong>You dread opening messages</strong> or work most evenings to keep up.
            </li>
            <li>
              <strong>Churn rises</strong> even though marketing is working.
            </li>
            <li>
              <strong>New client onboarding</strong> feels rushed.
            </li>
          </ul>
          <p>
            If several of these sound familiar, you're probably past your sustainable capacity,
            whatever the number says. Re-run the calculator with honest minutes per client and admin
            overhead, and compare with your current client count.
          </p>
        </>
      ),
    },
    {
      heading: "Capacity for in-person trainers",
      body: (
        <>
          <p>
            For in-person trainers, capacity is set mainly by session slots. A trainer working 30
            hours with 60-minute sessions and 20% admin has 24 session hours a week. With a 15%
            buffer, that's about 20 clients training once a week, or 10 training twice. Travel
            between locations, set-up and cleaning all reduce usable time, so include them in
            minutes per client.
          </p>
          <p>
            Peak times, such as early mornings and evenings, fill first. Practical capacity is often
            lower than the calculation suggests, because clients want the same popular slots.
            Offering off-peak prices or small-group sessions at busy times can help.
          </p>
        </>
      ),
    },
    {
      heading: "Capacity for online coaches",
      body: (
        <>
          <p>
            Online coaches have more flexibility in when they work, which makes capacity both larger
            and easier to overstretch. Messages arrive at all hours, and without boundaries, they
            fill every gap in the day. Setting fixed times for check-in reviews and replies, and
            telling clients when to expect responses, protects both your time and the quality of
            your coaching.
          </p>
          <p>
            Online capacity also depends heavily on systems. A coach with good templates, a
            consistent check-in form and a single platform for plans and messages can serve far more
            clients well than one juggling spreadsheets, chat apps and email.
          </p>
        </>
      ),
    },
    {
      heading: "Planning growth around capacity",
      body: (
        <>
          <p>
            Use capacity as a planning tool. If you're at 30 clients and capacity is 40, you have
            room for ten more. If you sign three a month and lose one, you'll reach capacity in
            about five months. That's the time you have to decide what comes next: a price rise, an
            assistant, a group offer or a waiting list.
          </p>
          <p>
            The coaching revenue projector shows how quickly you'll reach a given client count, and
            the capacity calculator shows whether you can serve them. Use both together.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            An online coach works 35 hours a week, spends 25 minutes per client, loses 25% to admin
            and keeps a 15% buffer. Coaching time is 35 × 0.75 = 26.25 hours, or 1,575 minutes. The
            ceiling is 1,575 ÷ 25 = 63 clients; sustainable capacity is about 53. At €180 a month,
            revenue at capacity is about €9,540 a month.
          </p>
          <p>
            If the coach builds templates that cut time per client to 20 minutes, the ceiling rises
            to 78 and sustainable capacity to about 66, worth about €2,340 more a month at the same
            price, without longer hours.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: a quarterly capacity check",
      body: (
        <>
          <p>
            Once a quarter, time a typical week, re-estimate minutes per client and admin overhead,
            and re-run the calculator. Compare sustainable capacity with your current clients and
            your growth plan. If you'll reach capacity within three months, start planning the next
            step now, so you're not forced into a rushed decision when you're already overwhelmed.
          </p>
        </>
      ),
    },
    {
      heading: "Capacity and wellbeing",
      body: (
        <>
          <p>
            Capacity isn't only a business number. Coaching is demanding work, and many coaches burn
            out by taking on more than they can sustain. Choosing a capacity that leaves room for
            rest, learning and your own training is a business decision as well as a personal one:
            rested coaches coach better, and their clients stay longer.
          </p>
        </>
      ),
    },
    {
      heading: "Capacity with mixed client types",
      body: (
        <>
          <p>
            Most coaches don't have one type of client. A roster might include a few premium clients
            who take an hour a week, many standard clients at 25 minutes and some light-touch
            clients at 10. To estimate capacity for a mix, add up the weekly minutes for each group
            and compare with your coaching time. For example, 5 premium clients at 60 minutes, 30
            standard at 25 and 10 light at 10 minutes total 1,150 minutes, about 19 hours, leaving
            room within 24 hours of coaching time.
          </p>
          <p>
            Running the calculator for each group separately also shows which clients are the most
            time-efficient for their price.
          </p>
        </>
      ),
    },
    {
      heading: "Holidays and capacity",
      body: (
        <>
          <p>
            Coaches need time off too. If you take four weeks of holiday a year and don't hand
            clients to anyone, those weeks either need covering in advance or the workload piles up
            before and after. Including some buffer for holidays, or arranging cover with another
            coach, keeps capacity realistic across the year rather than just in a typical week.
          </p>
        </>
      ),
    },
    {
      heading: "Capacity and client results",
      body: (
        <>
          <p>
            The depth of coaching affects results. Clients who get detailed feedback, timely plan
            changes and personal attention tend to progress faster and stay longer. Squeezing time
            per client to raise capacity can backfire if results suffer. Before cutting minutes per
            client, ask which parts of your time clients value most, and protect those.
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
              <strong>Coaching time</strong> = weekly hours × (1 − admin %).
            </li>
            <li>
              <strong>Ceiling</strong> = coaching minutes ÷ minutes per client.
            </li>
            <li>
              <strong>Sustainable</strong> = ceiling × (1 − buffer %).
            </li>
            <li>
              <strong>Raise capacity</strong> with templates, structured check-ins, batching and
              help, not by cutting the attention clients value.
            </li>
          </ul>
          <p>
            Measure your real minutes per client, plan growth around your sustainable number and
            decide your next step before you reach it.
          </p>
        </>
      ),
    },
    {
      heading: "Waiting lists",
      body: (
        <>
          <p>
            When you reach capacity, a waiting list keeps demand warm without overloading you. Ask
            interested people for their details and goals, tell them roughly when space might open,
            and send a short update every few weeks. When a place opens, offer it to the person at
            the top of the list. Many coaches find waiting lists also raise conversion, because
            people who wait for a place arrive committed.
          </p>
          <p>
            A long waiting list is a clear signal that your price can rise, or that it's time to add
            capacity through help or a group programme.
          </p>
        </>
      ),
    },
    {
      heading: "Capacity and onboarding",
      body: (
        <>
          <p>
            New clients take more time than established ones. An onboarding call, reviewing a
            detailed intake form, building the first plan and the extra messages of the first few
            weeks can easily triple the usual weekly time. If you sign several clients in the same
            week, that spike can push you over capacity even when your total client count looks
            fine.
          </p>
          <p>
            Staggering start dates, for example by starting new clients on set days each fortnight,
            spreads onboarding time out and keeps weekly workload steadier.
          </p>
        </>
      ),
    },
    {
      heading: "Capacity in hours versus energy",
      body: (
        <>
          <p>
            Two coaches with the same hours can have very different capacity because of energy.
            Reviewing check-ins well needs focus. After a long day of sessions or several hours of
            messaging, quality drops even if there's time left on the clock. Schedule the most
            demanding coaching tasks when you're freshest, and count only focused time as coaching
            time in the calculator.
          </p>
          <p>
            If your best work happens in the morning, that's where check-in reviews and programming
            belong. Admin and simpler messages can fill the rest.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Time how long you spend on three typical clients this week, including messages. Enter
            the average, your real hours and an honest admin share. Compare the sustainable number
            with your current client count, and decide what you'll do when you reach it.
          </p>
        </>
      ),
    },
    {
      heading: "Capacity is a choice",
      body: (
        <>
          <p>
            The calculator gives a number, but the right client count is a decision about the kind
            of coaching you want to offer. Some coaches choose fewer clients at a higher price and
            deeper support. Others choose more clients with a lighter, more systemised service. Both
            can work well. Choose deliberately, price for it and tell clients what to expect.
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
    { label: "Assistant coach ROI calculator", href: "/tools/assistant-coach-roi-calculator" },
    { label: "Group vs 1:1 coaching calculator", href: "/tools/group-vs-1on1-coaching-calculator" },
    { label: "Price increase calculator", href: "/tools/price-increase-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How many online coaching clients can one coach handle?",
      a: "It depends on time per client. Many online coaches spending 15 to 40 minutes per client per week run about 40 to 80, but quality matters more than the number.",
    },
    {
      q: "What counts as time per client?",
      a: "Everything you do for a client each week: check-in review, feedback, programme changes, meal plans, messages and calls.",
    },
    {
      q: "Why keep a buffer?",
      a: "To absorb onboarding, difficult weeks, sick days and holidays without going over capacity.",
    },
    {
      q: "How can I take more clients without working more?",
      a: "Use templates, structured check-ins, batching and clear messaging expectations, or bring in help.",
    },
    {
      q: "What should I do when I reach capacity?",
      a: "Raise prices, start a waiting list, add a group offer or bring in an assistant coach.",
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
