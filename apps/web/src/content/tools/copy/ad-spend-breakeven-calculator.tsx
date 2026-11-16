import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Ad spend breakeven calculator for coaches",
  description:
    "Find the most you can pay to win a coaching client from ads, your real cost per client, ROAS and monthly profit from budget, cost per lead and conversion.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Ad spend breakeven calculator",
  intro: (
    <>
      <p>
        Add your ad budget and cost per lead, the share of leads who become clients, what a client
        pays and your gross margin. See the most you can afford to pay for each client, what you are
        actually paying, and whether the ads make money.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I know if my coaching ads are profitable?",
    answer: (
      <>
        <p>
          Compare what a client costs you with what they leave behind. Breakeven cost per client is
          package price × gross margin: a €900 package at 70% margin can absorb up to €630 of ad
          spend per client. If €1,000 buys 50 leads at €20 and 10% become clients, each client costs
          €200, leaving €430 profit per client and €2,150 a month.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What breakeven means for ads",
      body: (
        <>
          <p>
            Every paid client carries two costs: the cost of delivering the coaching and the cost of
            finding them. Gross margin covers the first. Whatever margin is left is the most you can
            spend on acquisition before a client stops being worth having. That figure is your
            breakeven customer acquisition cost, or breakeven CAC.
          </p>
          <p>
            If you pay less than breakeven to win a client, the ads make money. If you pay more,
            every new client loses money, however busy the calendar looks. Most coaches who stop
            running ads do so because they never worked out this line, and judged the ads by leads
            or likes instead of by cost per paying client.
          </p>
        </>
      ),
    },
    {
      heading: "The numbers the calculator uses",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Input</th>
                  <th scope="col">What it means</th>
                  <th scope="col">Default</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly ad budget</td>
                  <td>What you spend on ads in a month</td>
                  <td>€1,000</td>
                </tr>
                <tr>
                  <td>Cost per lead</td>
                  <td>Ad spend ÷ leads (form fills, booked calls, messages)</td>
                  <td>€20</td>
                </tr>
                <tr>
                  <td>Lead-to-client rate</td>
                  <td>Share of leads who pay</td>
                  <td>10%</td>
                </tr>
                <tr>
                  <td>Package price</td>
                  <td>Total one client pays you</td>
                  <td>€900</td>
                </tr>
                <tr>
                  <td>Gross margin</td>
                  <td>Share of the price left after delivery costs</td>
                  <td>70%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            From these, it works out leads per month (budget ÷ cost per lead), clients per month
            (leads × conversion), your real cost per client (budget ÷ clients), breakeven cost per
            client (price × margin), profit per client and profit per month.
          </p>
        </>
      ),
    },
    {
      heading: "Working through the default example",
      body: (
        <>
          <p>
            A €1,000 budget at €20 per lead buys 50 leads. At a 10% conversion rate, 5 of them
            become clients, so each client costs €1,000 ÷ 5 = €200. A €900 package with a 70% margin
            leaves €630 per client after delivery, so the ads can afford up to €630 per client. At
            €200, each client leaves €430 of profit, and five clients a month add €2,150.
          </p>
          <p>
            ROAS, or return on ad spend, tells the same story another way. The package brings in
            €900 for every €200 spent, a ROAS of 4.5. Breakeven ROAS is 1 ÷ margin, here 1 ÷ 0.7 =
            1.43: below that, the ads lose money.
          </p>
        </>
      ),
    },
    {
      heading: "What happens when one number moves",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Change</th>
                  <th scope="col">Cost per client</th>
                  <th scope="col">Profit per client</th>
                  <th scope="col">Profit per month</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Default</td>
                  <td>€200</td>
                  <td>€430</td>
                  <td>€2,150</td>
                </tr>
                <tr>
                  <td>Cost per lead rises to €30</td>
                  <td>€300</td>
                  <td>€330</td>
                  <td>€1,100</td>
                </tr>
                <tr>
                  <td>Conversion falls to 5%</td>
                  <td>€400</td>
                  <td>€230</td>
                  <td>€575</td>
                </tr>
                <tr>
                  <td>Price falls to €600</td>
                  <td>€200</td>
                  <td>€220</td>
                  <td>€1,100</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Conversion has the largest effect here. Halving it doubles the cost per client and cuts
            monthly profit by almost three quarters. That is why coaches who fix their follow-up,
            call process and offer often get more from their ads than those who chase cheaper leads.
          </p>
        </>
      ),
    },
    {
      heading: "Why gross margin matters",
      body: (
        <>
          <p>
            Gross margin is the share of the price left after the cost of delivering the coaching:
            software, assistant coaches, payment processing, any meal-plan or app subscriptions you
            pay per client. For a solo online coach, margin is often high, 70 to 90%. For coaches
            who pay assistants or deliver in rented space, it can be much lower.
          </p>
          <p>
            Leave ad spend out of margin; that is what the calculator is testing. Leave your own
            time out too, unless you want breakeven to reflect a wage. A lower margin lowers
            breakeven, so the same ads can go from profitable to unprofitable just because delivery
            costs rose.
          </p>
        </>
      ),
    },
    {
      heading: "Package price: count what a client actually pays",
      body: (
        <>
          <p>
            Use the total revenue one new client brings in, not the monthly fee. For a monthly
            client who stays six months at €150, that is €900. For a 12-week programme at €600, it
            is €600. If many clients renew, the true figure is higher; if many leave after the first
            month, it is lower.
          </p>
          <p>
            If you don't know how long clients stay, the client LTV calculator can help. Using an
            optimistic lifetime makes ads look better than they are, so it is safer to start with a
            figure you can defend from your records.
          </p>
        </>
      ),
    },
    {
      heading: "Cost per lead and what counts as a lead",
      body: (
        <>
          <p>
            A lead is whatever your ads ask people to do: fill in a form, book a call, send a
            message, start a trial. The cost per lead is your ad spend divided by that number.
            Define a lead the same way every month, or comparisons stop meaning anything.
          </p>
          <p>
            Cheap leads aren't always better. An ad that brings in many low-intent leads can have a
            lower cost per lead and a higher cost per client than one that brings in fewer, more
            serious people. Always judge ads by cost per paying client.
          </p>
        </>
      ),
    },
    {
      heading: "Improving the numbers",
      body: (
        <>
          <ul>
            <li>
              <strong>Raise conversion:</strong> reply to leads within the hour, run a clear
              discovery call, and follow up more than once.
            </li>
            <li>
              <strong>Tighten targeting:</strong> fewer, better-matched leads often lower cost per
              client.
            </li>
            <li>
              <strong>Raise the package value:</strong> longer commitments, a higher price or better
              retention increase what each client is worth.
            </li>
            <li>
              <strong>Protect margin:</strong> review software and delivery costs that scale with
              clients.
            </li>
            <li>
              <strong>Test one change at a time:</strong> change the creative, audience or offer
              separately and compare cost per client.
            </li>
          </ul>
          <p>
            Re-run the calculator after each test. The goal is a cost per client comfortably below
            breakeven, with room for bad weeks.
          </p>
        </>
      ),
    },
    {
      heading: "Budget and scaling",
      body: (
        <>
          <p>
            The calculator assumes your cost per lead and conversion rate stay the same as you spend
            more. In practice, both often get worse as you scale, because the most responsive
            audiences are reached first. Raise budgets gradually, by 20 to 30% at a time, and watch
            cost per client for a couple of weeks before raising again.
          </p>
          <p>
            Also watch capacity. Five new clients a month is very different from fifteen. Check that
            you can deliver well at the new volume before increasing spend; the client capacity
            calculator can help.
          </p>
        </>
      ),
    },
    {
      heading: "When ads aren't the answer",
      body: (
        <>
          <p>
            If your conversion rate is low and your offer isn't clear, ads usually amplify the
            problem rather than fix it. Referrals, content and partnerships often bring warmer leads
            at a lower cost. Many coaches build a steady base with these first, then use ads to grow
            once they know their conversion rate and package value.
          </p>
          <p>
            Ads are a tool for scaling something that already works. The breakeven figure tells you
            whether it works at the price you are paying.
          </p>
        </>
      ),
    },
    {
      heading: "Breakeven by package type",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Package</th>
                  <th scope="col">Price</th>
                  <th scope="col">Margin</th>
                  <th scope="col">Breakeven cost per client</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly, avg 4 months at €150</td>
                  <td>€600</td>
                  <td>80%</td>
                  <td>€480</td>
                </tr>
                <tr>
                  <td>12-week programme</td>
                  <td>€750</td>
                  <td>75%</td>
                  <td>€563</td>
                </tr>
                <tr>
                  <td>6 months at €200</td>
                  <td>€1,200</td>
                  <td>70%</td>
                  <td>€840</td>
                </tr>
                <tr>
                  <td>In-person, 3 months at €400</td>
                  <td>€1,200</td>
                  <td>50%</td>
                  <td>€600</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Higher-value packages can carry a higher cost per client. That is one reason longer
            commitments and better retention make ads more viable: the same lead costs can be
            absorbed by more revenue.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking the right numbers each month",
      body: (
        <>
          <ul>
            <li>
              <strong>Spend:</strong> the total charged by every ad platform.
            </li>
            <li>
              <strong>Leads:</strong> counted the same way each month.
            </li>
            <li>
              <strong>New clients from ads:</strong> ask every new client where they came from, and
              check against ad tracking.
            </li>
            <li>
              <strong>Revenue per client:</strong> what they actually paid, updated as they renew or
              leave.
            </li>
          </ul>
          <p>
            A simple monthly row in a spreadsheet with these four numbers lets you re-run the
            calculator with real figures and see the trend over a quarter.
          </p>
        </>
      ),
    },
    {
      heading: "Ads and attribution",
      body: (
        <>
          <p>
            Ad platforms often take credit for clients who would have found you anyway, for example
            someone who followed you for months and clicked an ad on the day they decided. Others
            under-count, missing people who saw an ad, then searched for you by name a week later.
          </p>
          <p>
            Asking new clients how they heard about you, and comparing that with the platform's
            figures, gives a more honest view. If both agree that ads brought five clients, you can
            trust the calculation. If they disagree sharply, use the more conservative number until
            you know more.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: a monthly ads review",
      body: (
        <>
          <p>
            Once a month, enter last month's real spend, leads, clients and package value into the
            calculator. Compare cost per client with breakeven. If it is well below, consider a
            modest budget increase. If it is close to or above breakeven, pause the weakest ads and
            look at conversion before spending more.
          </p>
          <p>
            Keep notes on what changed each month: new creative, a different audience, a new offer,
            a seasonal shift. Over a year, those notes show which changes actually moved cost per
            client.
          </p>
        </>
      ),
    },
    {
      heading: "Seasonality",
      body: (
        <>
          <p>
            Coaching demand rises and falls through the year. Many coaches see more interest in
            January, before summer and after holidays, and less during holiday periods. Cost per
            lead and conversion often shift with these seasons. Compare months with the same month
            last year where possible, and plan budgets around the busier periods.
          </p>
        </>
      ),
    },
    {
      heading: "Leads, calls and clients: the full path",
      body: (
        <>
          <p>
            For many coaches, an ad lead doesn't become a client directly. It books a call, the call
            happens, and some calls close. Each step loses people. If 50 leads book 25 calls, 20
            people show up and 5 sign, the lead-to-client rate is 10%, but the weak points are
            booking and show-up, not the call itself.
          </p>
          <p>
            Breaking the conversion rate into its steps shows where to focus. Faster replies raise
            booking. Reminders and a small deposit raise show-up. A clearer offer raises close rate.
            Each improvement lowers cost per client without touching the ads.
          </p>
        </>
      ),
    },
    {
      heading: "Margin examples for different coaches",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Coach</th>
                  <th scope="col">Main delivery costs</th>
                  <th scope="col">Typical gross margin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Solo online coach</td>
                  <td>Software, payment fees</td>
                  <td>80 to 90%</td>
                </tr>
                <tr>
                  <td>Online coach with assistant</td>
                  <td>Software, fees, assistant pay</td>
                  <td>55 to 70%</td>
                </tr>
                <tr>
                  <td>In-person trainer, own studio</td>
                  <td>Rent share, equipment, fees</td>
                  <td>50 to 70%</td>
                </tr>
                <tr>
                  <td>Trainer renting gym space</td>
                  <td>Rent per session, fees</td>
                  <td>40 to 60%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Use your own costs rather than these ranges. Work out what it costs to deliver one
            client for the length of their package, divide by the price, and subtract from 100%.
          </p>
        </>
      ),
    },
    {
      heading: "Stopping ads that don't work",
      body: (
        <>
          <p>
            If cost per client stays above breakeven for several weeks despite changes to creative
            and targeting, pause the ads and look at the offer and conversion process. Continuing to
            spend on ads that lose money only makes the loss bigger. Many coaches restart later with
            a clearer offer, better follow-up and a known conversion rate, and find the same ads now
            pay.
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
              <strong>Breakeven cost per client</strong> = package price × gross margin.
            </li>
            <li>
              <strong>Your cost per client</strong> = budget ÷ clients won.
            </li>
            <li>
              <strong>Profit per client</strong> = breakeven minus your cost per client.
            </li>
            <li>
              <strong>Breakeven ROAS</strong> = 1 ÷ margin.
            </li>
            <li>
              <strong>Biggest lever:</strong> conversion rate, then package value, then cost per
              lead.
            </li>
          </ul>
          <p>
            Run the numbers monthly with real figures, and only scale ads that sit comfortably below
            breakeven with room for a slow month.
          </p>
        </>
      ),
    },
    {
      heading: "Ad creative that converts for coaches",
      body: (
        <>
          <p>
            Ads that work for coaches usually speak to one specific person and one specific problem:
            a busy parent who wants to feel strong again, a runner stuck at the same 10K time, a new
            lifter who doesn't know where to start. They show a real result or a real moment from
            coaching, and they make the next step clear and low-pressure, such as a short
            application or a free call.
          </p>
          <p>
            Generic ads promising transformation for everyone tend to bring cheap but poorly matched
            leads. Specific ads cost more per lead but often far less per paying client, which is
            the number breakeven is built on. Test two or three specific angles against each other
            and keep the one with the lowest cost per client, not the lowest cost per click.
          </p>
        </>
      ),
    },
    {
      heading: "Retargeting",
      body: (
        <>
          <p>
            Retargeting shows ads to people who already visited your site, watched your videos or
            engaged with your posts. These audiences are warmer, so cost per client is often much
            lower than for cold audiences. A small retargeting budget alongside cold ads can bring
            the average cost per client down noticeably. Enter each campaign separately to see which
            one carries the profit.
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
    heading: "Give paid clients a reason to stay",
    body: (
      <>
        <p>
          Every client you buy is worth more the longer they stay. In Traiv, clients get their
          plans, check-ins and messages in an app under your brand, which makes the coaching they
          paid for visible every week.
        </p>
      </>
    ),
  },
  next: [
    {
      label: "Customer acquisition cost calculator",
      href: "/tools/customer-acquisition-cost-calculator",
    },
    { label: "Client LTV calculator", href: "/tools/client-ltv-calculator" },
    { label: "Discovery call calculator", href: "/tools/discovery-call-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "What is a good cost per client for coaching ads?",
      a: "Anything comfortably below your breakeven cost per client, which is package price × gross margin. For a €900 package at 70% margin, that is €630.",
    },
    {
      q: "What is breakeven ROAS?",
      a: "1 ÷ gross margin. At 70% margin, you need at least €1.43 of revenue for each €1 of ad spend to break even.",
    },
    {
      q: "Should I include my own time in gross margin?",
      a: "Usually not, unless you want breakeven to cover a wage. Include costs that rise with each client, such as software, assistants and payment fees.",
    },
    {
      q: "Why is my cost per client high when my leads are cheap?",
      a: "Probably a low conversion rate. Cheap leads that rarely buy cost more per client than fewer, better leads.",
    },
    {
      q: "How long should I test an ad before judging it?",
      a: "Long enough to win several clients, often two to four weeks. Judge by cost per paying client, not by clicks or leads alone.",
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
