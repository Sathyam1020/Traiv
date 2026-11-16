import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Coaching revenue projector",
  description:
    "Project 12 months of coaching revenue from starting clients, new clients per month, monthly churn and price, with your steady-state client ceiling.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Coaching revenue projector",
  intro: (
    <>
      <p>
        Add today's client count, your typical monthly sign-ups, monthly churn and price. See your
        monthly revenue in month 12, clients at the end of the year, total revenue over 12 months
        and the ceiling where growth levels off.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I project my coaching revenue?",
    answer: (
      <>
        <p>
          Each month, lose your churned clients, add your new ones and multiply by price. Starting
          with 20 clients, adding 5 a month with 5% churn at €300, you reach about 57 clients after
          12 months: €17,031 a month and €150,404 over the year.
        </p>
        <p>
          Your ceiling is new clients ÷ churn rate: 5 ÷ 0.05 = 100 clients. Growth slows as you
          approach it.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why project revenue",
      body: (
        <>
          <p>
            Revenue projections turn your current numbers into a picture of the next year. They show
            whether your growth plan is realistic, when you might need help, and which lever, more
            clients or lower churn, makes the biggest difference. Without a projection, it's easy to
            assume that adding clients each month will lead to steady growth, and to be surprised
            when it doesn't.
          </p>
          <p>
            The projector is simple by design. It uses four inputs and the same rule every month.
            That makes it easy to understand, easy to test changes and easy to check against reality
            as the year unfolds.
          </p>
        </>
      ),
    },
    {
      heading: "How the projection works",
      body: (
        <>
          <ol>
            <li>Start with your current clients.</li>
            <li>Each month, remove the share who churn.</li>
            <li>Add the new clients you sign that month.</li>
            <li>Multiply clients by price for that month's revenue.</li>
            <li>Repeat for 12 months and add up the revenue.</li>
          </ol>
          <p>
            With 20 starting clients, 5 new a month and 5% churn, the client count grows from 20 to
            about 31 by month 3, 41 by month 6, 50 by month 9 and 57 by month 12. Each month adds
            fewer net clients than the last, because more clients means more churn.
          </p>
        </>
      ),
    },
    {
      heading: "The steady-state ceiling",
      body: (
        <>
          <p>
            As your client base grows, the number of clients lost each month grows with it.
            Eventually, losses equal new sign-ups and growth stops. That point is your steady-state
            ceiling: new clients per month ÷ monthly churn rate. At 5 new clients and 5% churn, the
            ceiling is 100.
          </p>
          <p>
            The ceiling is one of the most useful numbers in coaching. It tells you that, at your
            current acquisition and retention, you will never grow past a certain size, however long
            you wait. To raise it, you have to either sign more clients each month or lose fewer.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing levers",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Scenario</th>
                  <th scope="col">Clients after 12 months</th>
                  <th scope="col">Month 12 revenue</th>
                  <th scope="col">Ceiling</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Default: 5 new, 5% churn</td>
                  <td>57</td>
                  <td>€17,031</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>8 new a month, 5% churn</td>
                  <td>84</td>
                  <td>€25,305</td>
                  <td>160</td>
                </tr>
                <tr>
                  <td>5 new a month, 3% churn</td>
                  <td>65</td>
                  <td>€19,471</td>
                  <td>167</td>
                </tr>
                <tr>
                  <td>5 new a month, 8% churn</td>
                  <td>47</td>
                  <td>€14,062</td>
                  <td>63</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Over one year, adding three new clients a month adds more revenue than cutting churn by
            two points. But the lower churn raises the long-term ceiling more, and it doesn't
            require extra marketing. Over several years, retention often wins.
          </p>
        </>
      ),
    },
    {
      heading: "Starting from zero",
      body: (
        <>
          <p>
            A new coach with no clients, signing 5 a month with 5% churn, reaches about 46 clients
            after a year, €13,789 a month at €300, and €98,005 over the year. The ceiling is still
            100. Starting with an existing base gives a head start, but the long-term destination is
            set by new clients and churn, not the starting point.
          </p>
        </>
      ),
    },
    {
      heading: "Using the projection to plan",
      body: (
        <>
          <p>
            Projections help answer practical questions. When will I reach 40 clients? Can I afford
            to hire an assistant by autumn? How many new clients a month do I need to reach €15,000
            a month? Enter your numbers, read the month-by-month table, and adjust new clients or
            churn to see what it takes.
          </p>
          <p>
            If your target is above the ceiling, no amount of time will get you there with current
            numbers. You'll need to change at least one lever.
          </p>
        </>
      ),
    },
    {
      heading: "Capacity and the projection",
      body: (
        <>
          <p>
            A projection that shows 80 clients in a year is only useful if you can coach 80 clients
            well. Check your capacity alongside your revenue plan. If the projection runs past what
            you can deliver, plan for help, a group offer or a price rise before you get there. The
            client capacity calculator can help work out your limit.
          </p>
        </>
      ),
    },
    {
      heading: "Checking projections against reality",
      body: (
        <>
          <p>
            At the end of each month, compare actual clients and revenue with the projection. If
            you're behind, check which input was off: fewer new clients than planned, or more churn.
            Update the inputs and re-run. Over a few months, your projections become more accurate,
            because they're based on your real numbers rather than hopes.
          </p>
        </>
      ),
    },
    {
      heading: "Seasonality",
      body: (
        <>
          <p>
            Real coaching businesses rarely sign the same number of clients every month. January and
            the weeks before summer are often busy; holiday months are often quiet. Churn can rise
            in the same quiet months. The projector uses averages, which smooth this out. For a more
            detailed plan, estimate new clients and churn for each quarter separately and run the
            projector for each.
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
      heading: "Price in the projection",
      body: (
        <>
          <p>
            Price multiplies everything. A 10% price rise lifts every month's revenue by 10%, as
            long as new clients and churn don't change. In reality, a price rise may slow sign-ups
            slightly or raise churn among existing clients. The price increase calculator helps
            estimate that trade-off before you change your price.
          </p>
        </>
      ),
    },
    {
      heading: "How churn shapes the curve",
      body: (
        <>
          <p>
            With no churn, every new client adds permanently to the client base, and growth is a
            straight line. With churn, each month's growth is a little smaller than the last,
            because losses grow with the client base. The curve bends towards the ceiling. Higher
            churn bends it sooner and lower; lower churn lets it climb further.
          </p>
          <p>
            That's why two coaches signing the same number of new clients can end up with very
            different businesses. The one who keeps clients longer keeps growing long after the
            other has levelled off.
          </p>
        </>
      ),
    },
    {
      heading: "Raising the ceiling",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Change</th>
                  <th scope="col">New ceiling</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>5 new a month, 5% churn</td>
                  <td>100 clients</td>
                </tr>
                <tr>
                  <td>6 new a month, 5% churn</td>
                  <td>120 clients</td>
                </tr>
                <tr>
                  <td>5 new a month, 4% churn</td>
                  <td>125 clients</td>
                </tr>
                <tr>
                  <td>5 new a month, 2.5% churn</td>
                  <td>200 clients</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Halving churn doubles the ceiling. Adding one new client a month raises it by a fifth.
            Both are worth pursuing, but retention improvements tend to be cheaper and build on
            themselves.
          </p>
        </>
      ),
    },
    {
      heading: "A realistic year",
      body: (
        <>
          <p>
            Few businesses grow evenly. A realistic year might include a busy January with 10 new
            clients, a quieter summer with 2 or 3, and a rise again in autumn. Churn might spike
            after the holidays. To model this, run the projector with your average figures, then
            adjust expectations around the seasons you know.
          </p>
          <p>
            If you want more detail, run the projector three or four times with different inputs for
            each quarter, using the end clients of one quarter as the start for the next.
          </p>
        </>
      ),
    },
    {
      heading: "From projection to plan",
      body: (
        <>
          <p>
            Once you have a projection, turn it into actions. If you need 8 new clients a month
            instead of 5, work out where they will come from: more discovery calls, a referral
            programme, a new content channel or ads. If you need churn at 3% instead of 5%, choose
            two or three retention habits to put in place this month.
          </p>
          <p>Revisit the plan monthly. A projection is useful only if it changes what you do.</p>
        </>
      ),
    },
    {
      heading: "Revenue, profit and cash",
      body: (
        <>
          <p>
            The projector shows revenue. Profit depends on costs, which often rise with clients:
            software, help, ads. Cash depends on when clients pay: upfront packages bring cash in
            early, monthly billing spreads it out. Use the coaching profit calculator alongside the
            projection to check that growth stays profitable, and plan cash for any large expenses.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: a quarterly projection review",
      body: (
        <>
          <p>
            Every quarter, enter your real starting clients, average new clients per month and
            average churn over the last three months. Compare the new projection with the old one.
            If the ceiling has risen, your business is getting healthier. If it has fallen, look at
            which input changed and why.
          </p>
          <p>
            Share the projection with anyone who depends on your income. A simple chart of the next
            12 months is often reassuring, and it makes the business's direction visible.
          </p>
        </>
      ),
    },
    {
      heading: "Common projection mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Using your best month as the average:</strong> use a realistic three-month
              average.
            </li>
            <li>
              <strong>Ignoring churn:</strong> a projection without churn always looks too good.
            </li>
            <li>
              <strong>Assuming price stays fixed:</strong> factor in planned price changes.
            </li>
            <li>
              <strong>Forgetting capacity:</strong> check that you can coach the clients the
              projection shows.
            </li>
          </ul>
          <p>Projections built on honest averages are less exciting but much more useful.</p>
        </>
      ),
    },
    {
      heading: "Growth, revenue and workload",
      body: (
        <>
          <p>
            A projection that shows revenue doubling also shows workload doubling, unless something
            changes in how you deliver. Before chasing the growth the projector shows, think about
            what your week will look like at that client count. Will you need help, better systems
            or a different mix of one-to-one and group coaching? Planning for that early prevents
            the burnout that often causes churn to rise just as the business grows.
          </p>
        </>
      ),
    },
    {
      heading: "Price changes in the projection",
      body: (
        <>
          <p>
            To model a price increase, run the projector twice: once at your current price and once
            at the new price, with slightly lower new clients or slightly higher churn if you expect
            some effect. Compare month 12 revenue and total revenue. If the higher price still comes
            out ahead with conservative assumptions, the increase is likely worth it.
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
              <strong>Each month:</strong> clients × (1 − churn) + new clients.
            </li>
            <li>
              <strong>Revenue:</strong> clients × price, summed over 12 months.
            </li>
            <li>
              <strong>Ceiling:</strong> new clients per month ÷ monthly churn.
            </li>
            <li>
              <strong>To grow past the ceiling:</strong> sign more clients or lose fewer.
            </li>
          </ul>
          <p>
            Use real three-month averages, check the projection monthly and turn it into specific
            actions.
          </p>
        </>
      ),
    },
    {
      heading: "What the ceiling means for your goals",
      body: (
        <>
          <p>
            If your income goal needs 80 clients and your ceiling is 100, you'll get there, but
            growth will slow as you approach it. If your goal needs 120 clients and your ceiling is
            100, you'll never reach it with current numbers. Comparing your goal with your ceiling
            is one of the quickest ways to see whether your plan needs more acquisition, better
            retention or a higher price.
          </p>
          <p>
            Many coaches find that a modest improvement in churn, combined with a small rise in
            price, closes the gap faster than trying to double new clients.
          </p>
        </>
      ),
    },
    {
      heading: "Group and online offers in the projection",
      body: (
        <>
          <p>
            If you add a group programme or a lower-priced online plan, its clients have a different
            price and often a different churn rate. Run the projector separately for each offer,
            then add the results. That shows how much each offer contributes, and whether a cheaper,
            higher-volume offer is worth the extra clients it needs.
          </p>
          <p>
            Mixed offers can raise the overall ceiling by reaching people who wouldn't pay for
            one-to-one coaching.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this month",
      body: (
        <>
          <p>
            Enter your real numbers: today's clients, your average new clients per month over the
            last quarter and your average monthly churn. Note the ceiling and month-12 revenue. Then
            change one input to match a realistic goal for the next quarter, and write down the
            actions that would get you there. Check back at the end of each month and update the
            inputs with what actually happened.
          </p>
        </>
      ),
    },
    {
      heading: "Projections for a new coaching business",
      body: (
        <>
          <p>
            If you're just starting, use conservative inputs: a few new clients a month and a churn
            rate of 8 to 10% until you have real data. The projection will look modest, and that's
            useful. It sets realistic expectations, shows how long it takes to build a client base,
            and helps plan savings or part-time income while the business grows.
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
    { label: "Coaching profit calculator", href: "/tools/coaching-profit-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How do I project coaching revenue for a year?",
      a: "Each month, subtract churned clients, add new ones and multiply by price. Repeat for 12 months and add up the revenue.",
    },
    {
      q: "What is the steady-state ceiling?",
      a: "The client count where monthly losses equal new sign-ups: new clients per month ÷ monthly churn rate.",
    },
    {
      q: "Why does growth slow down over time?",
      a: "As you gain clients, you lose more each month at the same churn rate. Eventually losses match new sign-ups.",
    },
    {
      q: "Which matters more, new clients or lower churn?",
      a: "More new clients usually adds more revenue in year one; lower churn raises the long-term ceiling without extra marketing.",
    },
    {
      q: "How accurate is the projection?",
      a: "It's as accurate as your inputs. Check it monthly against real numbers and update the inputs.",
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
