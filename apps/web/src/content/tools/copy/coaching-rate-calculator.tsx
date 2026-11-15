import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Coaching Rate Calculator: What to Charge Per Client",
  description:
    "Free coaching rate calculator. Work out your monthly price per client from your income goal, costs, hours and churn, with capacity, breakeven and an hourly figure.",
  eyebrow: "Free tool · Coaching business",
  h1: "Coaching rate calculator",
  intro: (
    <>
      <p>
        Most coaches set their price by looking at what others charge. This calculator works it out
        from the other direction: what you want to earn, what the business costs to run, how many
        clients your hours can hold and how many you lose each month. The answer is the minimum
        monthly price per client that makes the business work.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do you work out what to charge as a coach?",
    answer: (
      <>
        <p>
          Add your target monthly pay to your monthly business costs to get the revenue you need.
          Work out how many clients your available hours can hold. Allow for churn, because some
          slots will always be empty between one client leaving and the next joining. Divide the
          revenue by the number of paying clients.
        </p>
        <p>
          With a target of 6,000 a month, 800 in costs, 25 hours available and 45 minutes per client
          a week, you have room for 33 clients. At 6 percent monthly churn, about 31 are paying on
          average, so you need to charge at least 219 a month per client.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the calculator works",
      body: (
        <>
          <ol>
            <li>
              <strong>Revenue needed:</strong> target monthly income plus monthly business costs.
            </li>
            <li>
              <strong>Capacity:</strong> hours available per week divided by hours per client per
              week, rounded down.
            </li>
            <li>
              <strong>Paying clients:</strong> capacity reduced by your monthly churn rate, because
              some slots will be empty while you replace clients who leave.
            </li>
            <li>
              <strong>Price:</strong> revenue needed divided by paying clients.
            </li>
            <li>
              <strong>Effective hourly:</strong> revenue divided by coaching hours in an average
              month.
            </li>
            <li>
              <strong>Breakeven clients:</strong> how many clients at that price cover your costs
              before you pay yourself anything.
            </li>
            <li>
              <strong>Churn cost:</strong> the monthly revenue lost to empty slots, and what the
              price would be if churn were halved.
            </li>
          </ol>
        </>
      ),
    },
    {
      heading: "Why work backwards from income",
      body: (
        <>
          <p>
            Pricing from competitors tells you what the market accepts, but not whether that price
            can support your life. A coach who copies a 99 a month price without checking the
            numbers may find they need 70 clients to pay themselves properly, which is more than
            they can coach well. Working backwards from income makes the trade-off visible: you can
            see immediately whether your goal requires a higher price, more hours, a more efficient
            model, or a lower target.
          </p>
          <p>
            Once you have the minimum price, compare it with the market. If it is far above what
            similar coaches charge, you may need to differentiate your offer, specialise, or reduce
            costs. If it is well below, you have room to raise prices or invest more in the client
            experience.
          </p>
        </>
      ),
    },
    {
      heading: "Online async versus 1:1 sessions",
      body: (
        <>
          <p>
            The coaching model changes how many clients your hours can hold. Online asynchronous
            coaching, where clients follow a programme and you review check-ins and messages,
            typically takes 30 to 60 minutes per client per week. One-to-one coaching with live
            sessions takes much more, often two to three hours a week once preparation and admin are
            included. Switching the model in the calculator changes the default hours per client to
            reflect that.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Model</th>
                  <th scope="col">Hours per client per week</th>
                  <th scope="col">Clients in 25 hours</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Online async</td>
                  <td>0.5</td>
                  <td>50</td>
                </tr>
                <tr>
                  <td>Online async</td>
                  <td>0.75</td>
                  <td>33</td>
                </tr>
                <tr>
                  <td>Hybrid (async plus a monthly call)</td>
                  <td>1.0</td>
                  <td>25</td>
                </tr>
                <tr>
                  <td>1:1 sessions</td>
                  <td>2.5</td>
                  <td>10</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The fewer clients your model can hold, the higher the price needs to be for the same
            income. That is why live one-to-one coaching usually costs several times more than an
            online programme.
          </p>
        </>
      ),
    },
    {
      heading: "What churn really costs",
      body: (
        <>
          <p>
            Churn is the share of clients who leave each month. Even with a waiting list, there is
            usually a gap between one client leaving and the next starting, and without one, slots
            can sit empty for weeks. At 6 percent monthly churn, about one client in sixteen leaves
            each month, which over a year is the equivalent of replacing most of your roster.
          </p>
          <p>
            The calculator shows how much revenue churn costs you each month and what the price
            would be if churn were halved. That figure is often surprising. Improving retention from
            6 to 3 percent can do as much for income as a price rise, and it is far easier to sell
            to clients, because it comes from better coaching rather than higher fees.
          </p>
        </>
      ),
    },
    {
      heading: "Setting your target income honestly",
      body: (
        <>
          <p>
            Your target income should be what you need to pay yourself, not what you hope the
            business will turn over. Include an allowance for tax, pension or retirement savings,
            holidays and sick days, because self-employed coaches do not get paid for time off
            unless the price covers it. Many coaches find that the income they need is higher than
            they first thought once these are included, which is one reason so many undercharge.
          </p>
        </>
      ),
    },
    {
      heading: "Business costs to include",
      body: (
        <>
          <ul>
            <li>
              <strong>Software:</strong> coaching platform, payment processing fees, scheduling,
              email and video calls.
            </li>
            <li>
              <strong>Insurance and certification:</strong> professional liability insurance,
              certification renewals and continuing education.
            </li>
            <li>
              <strong>Marketing:</strong> advertising, website hosting, design and content tools.
            </li>
            <li>
              <strong>Facilities:</strong> gym rent, studio costs or a share of a gym's fees if you
              coach in person.
            </li>
            <li>
              <strong>Professional help:</strong> an accountant or bookkeeper, legal templates.
            </li>
            <li>
              <strong>Equipment and phone:</strong> devices, internet, any equipment you provide.
            </li>
          </ul>
          <p>
            Average annual costs over twelve months, so that once-a-year expenses such as insurance
            and courses are included in the monthly figure.
          </p>
        </>
      ),
    },
    {
      heading: "Raising your price when the numbers say you should",
      body: (
        <>
          <p>
            If the calculator shows your current price is below the minimum, you have three options:
            raise prices, reduce costs, or change the model to serve more clients in the same hours.
            Raising prices is usually the fastest. A common approach is to raise prices for new
            clients first, give existing clients notice of a change at their next renewal, and
            explain what is improving alongside the price. Most clients who value the coaching stay;
            those who leave often free up space for clients who are a better fit.
          </p>
          <p>
            Price rises feel risky because losing clients is visible, while undercharging is
            invisible. The price increase calculator shows exactly how many clients you could lose
            after a rise before you would earn less than you do now, which is usually more than
            coaches expect.
          </p>
        </>
      ),
    },
    {
      heading: "Capacity is a ceiling, not a target",
      body: (
        <>
          <p>
            The capacity figure is the maximum your hours can hold. Running at full capacity all the
            time leaves no room for growth, illness, or the extra time a new or struggling client
            needs. Many coaches plan to run at around 80 to 90 percent of capacity, which in this
            calculator is partly captured by the churn adjustment. If you are constantly full with a
            waiting list, that is a strong signal that your price is too low.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A coach wants to pay herself 6,000 a month and her business costs 800 a month. She has
            25 hours a week for coaching and spends about 45 minutes per client each week. Her
            clients stay a little over a year and a half on average, which is roughly 6 percent
            monthly churn.
          </p>
          <ol>
            <li>Revenue needed: 6,000 + 800 = 6,800 a month.</li>
            <li>Capacity: 25 ÷ 0.75 = 33 clients.</li>
            <li>Paying clients after churn: 33 × 0.94 = about 31.</li>
            <li>Minimum price: 6,800 ÷ 31 = about 219 a month.</li>
            <li>Breakeven: 800 ÷ 219 = 4 clients to cover costs.</li>
          </ol>
          <p>
            If she reduced churn to 3 percent, the minimum price would fall to about 212, and she
            would lose around 220 a month less to empty slots. If she instead cut her time per
            client to 35 minutes with better systems, capacity would rise to 42 clients and the
            minimum price would fall to around 170.
          </p>
        </>
      ),
    },
    {
      heading: "Pricing tiers",
      body: (
        <>
          <p>
            Many coaches offer more than one level of service. A common structure is a lower-priced
            programme with fewer touchpoints, a standard tier with weekly check-ins, and a premium
            tier with more frequent contact or calls. You can use this calculator for each tier
            separately by adjusting the hours per client, then check that the overall mix of clients
            meets your income target. Premium tiers often take disproportionately more time, so
            price them accordingly.
          </p>
          <p>
            Tiers also give clients a way to stay with you when their circumstances change. A client
            who can no longer afford the premium tier may move to a lighter one instead of leaving,
            which helps retention.
          </p>
        </>
      ),
    },
    {
      heading: "How churn is estimated",
      body: (
        <>
          <p>
            Churn is the percentage of clients who leave in a typical month. To estimate yours,
            divide the number of clients who left over the last six or twelve months by the average
            number of clients you had, then divide by the number of months. If you averaged 25
            clients and 18 left over a year, monthly churn is 18 ÷ 25 ÷ 12, about 6 percent. You can
            also think of it in terms of average client lifetime: 6 percent monthly churn means
            clients stay about 17 months on average; 10 percent means about 10 months.
          </p>
          <p>
            If you are new and have no history, 6 to 10 percent is a reasonable assumption for
            online coaching. Track it from the start, because it will become one of the most
            important numbers in your business.
          </p>
        </>
      ),
    },
    {
      heading: "Discounts and their real cost",
      body: (
        <>
          <p>
            Discounts are tempting when starting out or during slow months, but they cost more than
            they appear to. A 20 percent discount on a 200 a month programme means you need 25
            percent more clients to earn the same revenue, and those clients take the same time.
            Discounted clients also tend to churn faster, because the decision to join was driven by
            price rather than fit. If you use offers, prefer added value, such as an extra call or a
            bonus programme, over lower prices, and make any discount time-limited.
          </p>
        </>
      ),
    },
    {
      heading: "Communicating your price",
      body: (
        <>
          <p>
            Clients do not buy a price; they buy a result, an experience and confidence that you can
            help them. Present your price alongside what is included, who it is for and what clients
            typically achieve. Coaches who explain their offer clearly tend to meet less resistance
            to higher prices than those who lead with the number. If prospective clients regularly
            say your price is too high, look first at how the offer is explained before lowering the
            price.
          </p>
        </>
      ),
    },
    {
      heading: "Rates for different coaching specialisms",
      body: (
        <>
          <p>
            Coaches who specialise in a particular group, such as pre- and postnatal clients, people
            managing a medical condition, endurance athletes or physique competitors, often command
            higher prices than generalists. Specialist knowledge reduces risk for the client, and a
            clear niche makes marketing easier because the right clients recognise themselves in
            your message. If the calculator shows a price higher than general market rates,
            specialising is one of the most effective ways to justify it.
          </p>
          <p>
            Specialisation also tends to improve retention, because clients who feel understood stay
            longer. That lowers churn, which in turn lowers the price you need to charge to meet
            your income target.
          </p>
        </>
      ),
    },
    {
      heading: "Online versus in-person pricing",
      body: (
        <>
          <p>
            Online coaching is often priced lower than in-person training because it takes less of
            the coach's time per client and has no facility costs. But it is not automatically
            cheaper to deliver well. Good online coaching includes programme design, regular
            check-ins, technique feedback and responsive messaging. Pricing it too low leads to too
            many clients for the time available, slower responses and higher churn. Use realistic
            hours per client in the calculator; underestimating them is one of the most common
            mistakes coaches make.
          </p>
        </>
      ),
    },
    {
      heading: "When to raise prices",
      body: (
        <>
          <p>
            Signs that your price is too low include a consistently full roster, a waiting list,
            clients rarely questioning the price, and working more hours than you want for the
            income you earn. When several of these are true, a price rise is usually overdue.
            Raising prices by 10 to 20 percent at a time, for new clients first, is a cautious way
            to test demand. Track how many prospective clients sign up at the new price; if
            conversion barely changes, there is room to go further.
          </p>
        </>
      ),
    },
    {
      heading: "Retention is a pricing lever",
      body: (
        <>
          <p>
            Every month a client stays is a month you do not need to replace them. Improving
            onboarding so new clients see early progress, checking in regularly, celebrating
            milestones and making it easy for clients to raise problems all improve retention. A
            coach with 3 percent monthly churn and one with 10 percent can earn the same income at
            very different prices: the first can charge less, or earn more at the same price, simply
            because fewer slots sit empty and less time goes into finding new clients.
          </p>
        </>
      ),
    },
    {
      heading: "Seasonal demand and pricing",
      body: (
        <>
          <p>
            Demand for coaching rises in January, before summer and in September, and falls in
            December and during holidays. Some coaches use this by opening new client spots in peak
            months at full price and offering programmes with a clear start date. Others offer
            quarterly or six-month packages that carry clients through quieter months. Planning for
            seasonality helps keep your roster close to capacity year-round, which is what the
            calculator assumes.
          </p>
        </>
      ),
    },
    {
      heading: "Starting out with no clients",
      body: (
        <>
          <p>
            New coaches often feel they should charge very little until they have experience. A low
            introductory price can help you get your first few clients and testimonials, but it
            should be a deliberate, time-limited step rather than a permanent price. Set your
            long-term price with this calculator, start with a modest discount for your first
            clients if you wish, and tell them clearly when the price will rise. That way, you build
            experience without anchoring your business to a price that can never support you.
          </p>
          <p>
            Even when starting out, enter realistic numbers for costs and hours. Underestimating how
            long clients take is the most common reason new coaches burn out and the most common
            reason their prices end up too low.
          </p>
        </>
      ),
    },
    {
      heading: "Monthly price versus packages",
      body: (
        <>
          <p>
            This calculator gives a monthly price, which suits ongoing coaching. Some coaches prefer
            fixed-length packages, such as a 12-week programme. To convert, multiply the monthly
            price by the number of months and adjust for churn: clients on a fixed package do not
            leave midway, so churn affects how quickly you refill spots between packages rather than
            revenue during them. Packages can improve commitment and reduce early dropouts, but they
            create a gap at the end of each package that you need to fill, either with renewals or
            new clients.
          </p>
        </>
      ),
    },
    {
      heading: "Checking your price against your time",
      body: (
        <>
          <p>
            The effective hourly figure is a useful reality check. If it comes out lower than you
            would accept for an employed role with similar responsibility, the business is not
            paying you enough for your time, even if the monthly income looks reasonable. Raising
            the price, reducing time per client through better systems, or reducing churn will all
            raise it. Comparing the effective hourly figure before and after a change is a quick way
            to see whether the change is worth making.
          </p>
        </>
      ),
    },
    {
      heading: "What clients actually compare",
      body: (
        <>
          <p>
            Clients rarely compare coaches on price alone. They compare the outcome they expect, how
            confident they feel in the coach, how convenient the service is and how it fits their
            budget. A coach who can explain clearly who they help, what clients achieve and what the
            process looks like can charge more than a coach whose offer is vague, even if their
            experience is similar. Reviews, testimonials and clear before-and-after stories, shared
            with permission, often matter more to a prospective client than a difference of 20 or 30
            a month.
          </p>
          <p>
            That is why the minimum price from this calculator is only the starting point. How you
            present your offer determines whether clients see that price as fair.
          </p>
        </>
      ),
    },
    {
      heading: "When the numbers do not work",
      body: (
        <>
          <p>
            Sometimes the calculator returns a price that feels impossible to charge in your market.
            Before deciding the business cannot work, try adjusting each input in turn. Can you
            reduce costs by changing software or sharing a space? Can you lower hours per client
            with better templates and check-in systems? Can you reduce churn with a stronger first
            month? Could you work a few more hours a week for a period while you build up? Often a
            combination of small changes brings the required price within reach. If it still does
            not, it may be worth reconsidering the model, for example adding group coaching or a
            lower-touch tier that serves more clients in the same time.
          </p>
        </>
      ),
    },
    {
      heading: "Review your rate every year",
      body: (
        <>
          <p>
            Costs rise with inflation, your experience grows and demand for your services changes.
            Reviewing your rate once a year, ideally at the same time each year, keeps your price in
            line with your business. Even a small annual increase of a few percent prevents the slow
            erosion of income that comes from keeping prices fixed while costs climb. Let existing
            clients know well in advance, explain what has improved, and consider keeping
            long-standing clients on their current price for a little longer as a thank-you.
          </p>
        </>
      ),
    },
    {
      heading: "Including your own development",
      body: (
        <>
          <p>
            Courses, certifications, mentoring and conferences help you coach better and justify
            higher prices over time, but they cost money and time. Include an annual budget for them
            in your business costs, divided by twelve, so your price funds your development rather
            than leaving it to chance. Coaches who invest steadily in their skills tend to find it
            easier to raise prices and attract the clients they most want to work with.
          </p>
        </>
      ),
    },
    {
      heading: "Rates and the value of your time off",
      body: (
        <>
          <p>
            Self-employed coaches are not paid for holidays or sick days unless their price allows
            for them. If online clients continue paying while you are away, that is built in. If you
            coach in person, include the weeks you expect not to work when setting your income
            target, so the months you do work fund the time you take off. A price that only works if
            you never take a break is too low.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using your rate in practice",
    body: (
      <>
        <p>
          Treat the result as a floor, not a target. It is the least you can charge to meet your
          goal. The right price may be higher, depending on your experience, specialism and how in
          demand you are.
        </p>
        <p>
          Re-run it whenever something changes: a new cost, fewer available hours, a change in
          churn. A price that worked last year may not work after a rent increase or a new family
          commitment.
        </p>
        <p>
          Use the churn figure as motivation. Every point of churn you remove makes every other
          number easier, and it is the part of the business most directly in your control.
        </p>
      </>
    ),
  },
  pitch: {
    key: "client-app",
    heading: "Lower churn makes every price work",
    body: (
      <>
        <p>
          Traiv gives your clients an app under your name with their workouts, diet plans and
          check-ins in one place, so the coaching they pay for is visible every day, which is what
          keeps them paying.
        </p>
      </>
    ),
  },
  next: [
    { label: "See your income at this price", href: "/tools/personal-trainer-income-calculator" },
    {
      label: "Check how many clients a price rise can afford to lose",
      href: "/tools/price-increase-calculator",
    },
  ],
  nextPitch: "Want clients to stay longer? Traiv keeps them engaged with your coaching every day.",
  faq: [
    {
      q: "How much should I charge for online coaching?",
      a: "Work it out from your income goal, costs, hours and churn rather than copying others. For many coaches the answer lands well above common introductory prices once costs and churn are included.",
    },
    {
      q: "What is a normal churn rate for coaches?",
      a: "Many online coaching businesses see monthly churn between 5 and 10 percent. Strong onboarding, regular check-ins and visible progress bring it down.",
    },
    {
      q: "Should I charge more for one-to-one coaching?",
      a: "Yes. One-to-one coaching takes more hours per client, so fewer clients fit in your week and each needs to pay more for the same income.",
    },
    {
      q: "Why is my required price so high?",
      a: "Usually because hours per client are high, available hours are limited, churn is high, or costs are significant. Each can be adjusted to bring the price down.",
    },
    {
      q: "What if my price is higher than competitors?",
      a: "Differentiate your offer, specialise in a group you serve especially well, improve retention, or reduce hours per client so the same income needs fewer paying clients.",
    },
  ],
  keepGoing: [
    {
      label: "Personal trainer income calculator",
      href: "/tools/personal-trainer-income-calculator",
    },
    { label: "Price increase calculator", href: "/tools/price-increase-calculator" },
    { label: "Client churn rate calculator", href: "/tools/client-churn-rate-calculator" },
    { label: "See the client app", href: "/features/client-app" },
  ],
  close: {
    heading: "Charge what your coaching is worth, and keep the clients who pay it",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
