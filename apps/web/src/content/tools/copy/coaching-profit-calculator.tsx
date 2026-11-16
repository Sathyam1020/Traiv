import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Coaching profit calculator",
  description:
    "Calculate monthly and annual profit and profit margin for a coaching business from clients, price and costs for software, ads, contractors and more.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Coaching profit calculator",
  intro: (
    <>
      <p>
        Enter your clients, price per client and monthly costs for software, ads, contractors and
        anything else. See monthly revenue, total costs, monthly profit, profit margin and annual
        profit before tax.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate profit for a coaching business?",
    answer: (
      <>
        <p>
          Multiply clients by price for revenue, then subtract monthly costs. 20 clients at €300 is
          €6,000; with €1,500 of costs, profit is €4,500 a month, a 75% margin, or €54,000 a year
          before tax.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Revenue isn't profit",
      body: (
        <>
          <p>
            Coaches often talk about revenue: how many clients, what they charge, what came in last
            month. Profit is what's left after paying for everything it takes to run the business.
            Two coaches with the same revenue can have very different profits, depending on what
            they spend on software, ads, help and other costs.
          </p>
          <p>
            Profit is the number that pays you, funds growth and builds a buffer for quiet months.
            Knowing it, and knowing your margin, makes every other business decision clearer.
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
                  <td>Monthly revenue</td>
                  <td>Clients × price</td>
                  <td>20 × €300 = €6,000</td>
                </tr>
                <tr>
                  <td>Total monthly costs</td>
                  <td>Software + ads + contractors + other</td>
                  <td>€150 + €800 + €400 + €150 = €1,500</td>
                </tr>
                <tr>
                  <td>Monthly profit</td>
                  <td>Revenue − costs</td>
                  <td>€4,500</td>
                </tr>
                <tr>
                  <td>Profit margin</td>
                  <td>Profit ÷ revenue</td>
                  <td>75%</td>
                </tr>
                <tr>
                  <td>Annual profit</td>
                  <td>Monthly profit × 12</td>
                  <td>€54,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Profit here is before tax. Set aside tax separately according to the rules where you
            work.
          </p>
        </>
      ),
    },
    {
      heading: "A smaller business example",
      body: (
        <>
          <p>
            A coach with 12 clients at €250 earns €3,000 a month. Costs are €100 for software, €300
            for ads, €300 for a virtual assistant and €200 for other costs: €900 in total. Profit is
            €2,100 a month, a 70% margin, or €25,200 a year before tax.
          </p>
          <p>
            If this coach cut ads to €100 without losing clients, profit would rise to €2,300 and
            margin to 77%. If they added 4 clients at the same price, profit would rise to €3,100.
            Both are worth comparing before deciding where to put effort.
          </p>
        </>
      ),
    },
    {
      heading: "What to include in costs",
      body: (
        <>
          <ul>
            <li>
              <strong>Software and subscriptions:</strong> coaching platform, scheduling, email,
              video calls, design tools.
            </li>
            <li>
              <strong>Ads and marketing:</strong> ad spend, content help, promotional materials.
            </li>
            <li>
              <strong>Contractors or assistants:</strong> assistant coaches, virtual assistants,
              editors.
            </li>
            <li>
              <strong>Other costs:</strong> insurance, certifications and education, equipment, gym
              rent, accountant, payment processing fees, phone and internet share.
            </li>
          </ul>
          <p>
            Include costs that recur monthly, and divide annual costs by 12. Leave out your own pay;
            profit is what you take home before tax.
          </p>
        </>
      ),
    },
    {
      heading: "Reading your margin",
      body: (
        <>
          <p>
            Online coaching businesses with low overheads often have margins of 60 to 85%. In-person
            businesses with rent and equipment usually have lower margins. A falling margin over
            time is a signal to review costs; a very high margin may mean you could invest more in
            growth or help.
          </p>
          <p>
            Margin also shows how exposed you are to a drop in revenue. A business with a 75% margin
            can lose a quarter of its revenue and still cover costs. A business with a 20% margin is
            in trouble if a few clients leave.
          </p>
        </>
      ),
    },
    {
      heading: "Improving profit",
      body: (
        <>
          <ol>
            <li>
              <strong>Raise prices</strong> if you haven't in a while; it adds straight to profit.
            </li>
            <li>
              <strong>Improve retention,</strong> so you spend less replacing clients.
            </li>
            <li>
              <strong>Review subscriptions:</strong> cancel tools you no longer use or that overlap.
            </li>
            <li>
              <strong>Measure ads by cost per client,</strong> and cut campaigns that don't pay.
            </li>
            <li>
              <strong>Delegate carefully:</strong> help should free time for activities that bring
              in more than it costs.
            </li>
          </ol>
          <p>Change one thing at a time and re-run the calculator to see its effect.</p>
        </>
      ),
    },
    {
      heading: "Profit and your own pay",
      body: (
        <>
          <p>
            If you're a sole trader, profit is effectively your pay before tax. If your business is
            a company, you may pay yourself a salary that counts as a cost, and profit is what's
            left after that. Either way, compare profit with what you need to live on, plus a
            buffer, plus tax. If it falls short, you need to raise revenue, cut costs or both.
          </p>
        </>
      ),
    },
    {
      heading: "Setting aside tax",
      body: (
        <>
          <p>
            Tax rules differ widely by country. Many self-employed coaches set aside a fixed share
            of profit each month, often 20 to 30%, in a separate account, then adjust when their
            accountant confirms the actual bill. Doing this monthly avoids an unpleasant surprise at
            the end of the year.
          </p>
          <p>
            The calculator doesn't model tax, because rates and allowances vary so much. Speak to an
            accountant for advice specific to you.
          </p>
        </>
      ),
    },
    {
      heading: "Profit per client",
      body: (
        <>
          <p>
            Dividing monthly profit by clients gives profit per client: €4,500 ÷ 20 = €225 in the
            default example. This is useful for judging growth. If adding clients requires more ads
            or help, check that profit per client stays healthy as you grow. Growth that lowers
            profit per client sharply may not be worth the extra work.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking profit over time",
      body: (
        <>
          <p>
            Enter your real numbers at the end of each month and note the profit and margin. Over a
            year, you'll see seasonal patterns, the effect of price changes and the impact of new
            costs. That record makes it much easier to plan, to decide when to invest and to talk to
            an accountant or lender if you need to.
          </p>
        </>
      ),
    },
    {
      heading: "Costs that grow with clients",
      body: (
        <>
          <p>
            Some costs stay flat as you grow: an insurance policy, a website, an accountant. Others
            grow with each client: per-client software fees, payment processing, assistant time.
            Knowing which is which helps you see how profit changes as you add clients. Flat costs
            make each additional client more profitable; per-client costs reduce that effect.
          </p>
          <p>
            When choosing tools, check how their price scales. A tool with a low starting price and
            a high per-client fee can become expensive as you grow.
          </p>
        </>
      ),
    },
    {
      heading: "A worked growth example",
      body: (
        <>
          <p>
            A coach has 20 clients at €300 with €1,500 of costs, earning €4,500 profit. Growing to
            30 clients adds €3,000 of revenue. If costs rise by €500, mostly ads and a little extra
            software, profit becomes €7,000 a month, a 78% margin. If instead the coach hires an
            assistant at €1,500 a month to handle the extra clients, profit becomes €6,000, a 67%
            margin, but the coach has more time.
          </p>
          <p>Neither choice is wrong. The calculator helps compare them clearly before deciding.</p>
        </>
      ),
    },
    {
      heading: "Profit and capacity",
      body: (
        <>
          <p>
            There is a limit to how many clients one coach can serve well. As you approach it,
            adding clients may require help, which adds costs. Use the client capacity calculator to
            find your limit, then plan how profit changes beyond it. Sometimes raising prices near
            capacity is more profitable than adding clients and help.
          </p>
        </>
      ),
    },
    {
      heading: "Reviewing subscriptions",
      body: (
        <>
          <p>
            Small monthly subscriptions add up. Many coaches pay for several tools that overlap:
            scheduling, video calls, forms, payments, email, programming, nutrition and messaging.
            Once a year, list every subscription, what it does and whether you still use it.
            Consolidating onto fewer tools often saves money and time.
          </p>
          <p>
            The coaching tool stack cost calculator on this site can help total up what your current
            stack costs.
          </p>
        </>
      ),
    },
    {
      heading: "Ads and profit",
      body: (
        <>
          <p>
            Ad spend is often the largest variable cost. If ads bring clients at a cost well below
            what each client is worth, they add to profit. If not, they reduce it. Check ads by cost
            per paying client using the ad spend breakeven calculator, and cut campaigns that don't
            pay their way before cutting anything else.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: a monthly profit check",
      body: (
        <>
          <p>
            At the end of each month, enter your actual clients, average price and costs from your
            bank statement. Note profit and margin. Compare with the previous month and the same
            month last year. If margin is falling, find the cost that grew fastest. If profit is
            rising, decide how much to reinvest and how much to keep.
          </p>
          <p>
            Keep a simple record of each month's figures. After a year, you'll understand your
            business's finances far better than most coaches do.
          </p>
        </>
      ),
    },
    {
      heading: "Building a buffer",
      body: (
        <>
          <p>
            Coaching income can be uneven. A few clients leaving in the same month, or a quiet
            season, can cut revenue quickly. Many coaches aim to keep three to six months of costs
            and personal expenses in reserve. Setting aside a share of profit each month builds this
            buffer and makes the business more resilient.
          </p>
        </>
      ),
    },
    {
      heading: "Profit versus time",
      body: (
        <>
          <p>
            Profit per month is one view; profit per hour worked is another. A coach earning €4,500
            profit while working 45 hours a week earns about €23 an hour. A coach earning €4,000
            profit in 30 hours earns about €31 an hour. Tracking your hours alongside profit shows
            whether growth is making the business better or simply busier.
          </p>
          <p>
            If profit per hour is falling as you grow, look at delivery efficiency, pricing and
            whether some tasks could be handed off or automated.
          </p>
        </>
      ),
    },
    {
      heading: "Profit in in-person training",
      body: (
        <>
          <p>
            In-person trainers often have different cost structures: gym rent or a share of session
            fees, equipment, travel and insurance. Some gyms take a percentage of each session,
            which acts like a per-client cost. Include these in the calculator under other costs or
            contractors. In-person margins are often lower than online, but prices are usually
            higher, so absolute profit can still be strong.
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
              <strong>Revenue</strong> = clients × price.
            </li>
            <li>
              <strong>Profit</strong> = revenue − all monthly costs.
            </li>
            <li>
              <strong>Margin</strong> = profit ÷ revenue.
            </li>
            <li>
              <strong>Annual profit</strong> = monthly profit × 12, before tax.
            </li>
          </ul>
          <p>
            Enter real numbers each month, watch the margin trend, and set aside tax and a buffer
            from profit.
          </p>
        </>
      ),
    },
    {
      heading: "Separating business and personal money",
      body: (
        <>
          <p>
            Keeping business income and costs in a separate bank account makes profit much easier to
            track. Every payment from clients goes in; every business cost goes out. At the end of
            each month, the balance change, adjusted for any money you moved to yourself, is close
            to your profit. It also makes tax time far simpler.
          </p>
        </>
      ),
    },
    {
      heading: "Investing profit back into the business",
      body: (
        <>
          <p>
            Profit gives you choices. Some coaches reinvest a share in education, better tools, help
            or marketing, which can raise future profit. Others prioritise building a buffer or
            paying themselves more. A common approach is to decide percentages in advance: for
            example, a share for tax, a share for savings, a share for reinvestment and the rest as
            pay.
          </p>
          <p>Whatever split you choose, decide it deliberately and review it every quarter.</p>
        </>
      ),
    },
    {
      heading: "Comparing months",
      body: (
        <>
          <p>
            Profit can swing from month to month with one-off costs, such as an annual subscription,
            new equipment or a course. Note these when they happen, so a low-profit month doesn't
            cause unnecessary worry. Comparing the same month across years, or using a three-month
            average, gives a clearer picture of the trend.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this month",
      body: (
        <>
          <p>
            Open last month's bank statement and list every business cost. Enter the totals with
            your client count and average price. Note profit and margin, then pick the one cost or
            price change that would make the biggest difference and act on it this month.
          </p>
        </>
      ),
    },
    {
      heading: "Profit and growth decisions",
      body: (
        <>
          <p>
            Before adding a new cost, such as a tool, an assistant or a bigger ad budget, enter it
            into the calculator and see how profit changes at your current client count. Then
            estimate how many extra clients it would need to pay for itself. If the answer is
            realistic within a few months, the cost may be worth it. If not, wait or look for a
            cheaper way to get the same result.
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
    { label: "Coaching revenue projector", href: "/tools/coaching-revenue-projector" },
    {
      label: "Coaching tool stack cost calculator",
      href: "/tools/coaching-tool-stack-cost-calculator",
    },
    { label: "Price increase calculator", href: "/tools/price-increase-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How do I calculate my coaching profit?",
      a: "Monthly revenue (clients × price) minus monthly costs. Multiply by 12 for annual profit before tax.",
    },
    {
      q: "What is a good profit margin for online coaching?",
      a: "Many low-overhead online coaching businesses run margins of 60 to 85%. In-person businesses are usually lower.",
    },
    {
      q: "Should I include my own pay as a cost?",
      a: "Not if you're a sole trader; profit is your pay before tax. If you pay yourself a salary through a company, include it.",
    },
    {
      q: "Does the calculator include tax?",
      a: "No. Profit is before tax; set tax aside separately according to your local rules.",
    },
    {
      q: "How can I increase profit quickly?",
      a: "Raising prices and improving retention usually have the biggest effect; reviewing subscriptions and ads can help too.",
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
