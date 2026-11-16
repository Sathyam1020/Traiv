import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Coaching tool stack cost calculator",
  description:
    "Add up what your separate coaching tools cost each month and year, and compare the total with an all-in-one coaching platform at your client count.",
  eyebrow: "Free tool · Coaching business",
  h1: "Coaching tool stack cost calculator",
  intro: (
    <>
      <p>
        Running coaching across separate apps adds up quietly. Choose which tools you pay for, put
        in what your invoices actually say, and move the client slider to see your monthly and
        yearly spend beside Traiv or another platform. Where an all-in-one gets dearer as you grow,
        you'll see the client count at which a separate setup becomes the cheaper option.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How much does a coaching tool stack cost?",
    answer: (
      <>
        <p>
          Add up every subscription you use to run your coaching. With list prices checked in
          November 2026, a workout builder, meal planner, form builder, scheduler, file storage and
          community platform come to about USD 236 a month, roughly ₹22,175 at that day's exchange
          rate, or about ₹2,66,100 a year. Traiv's Trainer plan is ₹999 a month.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why stacks get expensive",
      body: (
        <>
          <p>
            Coaches often add tools one at a time as needs arise: a programme app, then a form
            builder for check-ins, then a scheduler, then somewhere to store videos, then a
            community space. Each subscription looks small on its own. Added together, they can cost
            more than a single platform, and they create extra work: several logins, data in
            different places and clients switching between apps.
          </p>
          <p>The calculator adds them up so you can see the real total.</p>
        </>
      ),
    },
    {
      heading: "The default stack",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Tool</th>
                  <th scope="col">Default</th>
                  <th scope="col">Price as listed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Workout builder</td>
                  <td>TrueCoach Standard, up to 20 active clients</td>
                  <td>USD 57.99 a month</td>
                </tr>
                <tr>
                  <td>Meal planning</td>
                  <td>That Clean Life Starter</td>
                  <td>USD 30 a month</td>
                </tr>
                <tr>
                  <td>Check-in forms</td>
                  <td>Typeform Basic</td>
                  <td>USD 39 a month</td>
                </tr>
                <tr>
                  <td>Scheduling</td>
                  <td>Calendly Standard</td>
                  <td>USD 10 per seat</td>
                </tr>
                <tr>
                  <td>File storage</td>
                  <td>Dropbox Plus, 2 TB</td>
                  <td>USD 9.99 a month</td>
                </tr>
                <tr>
                  <td>Community</td>
                  <td>Circle Professional</td>
                  <td>USD 89 a month (annual billing basis)</td>
                </tr>
                <tr>
                  <td>Payment processing</td>
                  <td>Per transaction</td>
                  <td>USD 0 a month</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Defaults come from each vendor's own page, checked on 16 November 2026 in USD, and are
            shown in rupees at 93.97 INR per USD (x-rates.com, the same day) as a starting point.
            Edit every price to match what you actually pay.
          </p>
        </>
      ),
    },
    {
      heading: "How the comparison works",
      body: (
        <>
          <p>
            Your stack is a flat total: it stays the same whatever your client count, unless a tool
            charges per client. Choose an all-in-one platform from the list, or enter a price
            yourself. For platforms with published pricing, the calculator works out their price at
            your client count and shows the difference and the break-even point, where the
            all-in-one starts to cost more than your stack.
          </p>
          <p>
            Many all-in-one platforms charge more as you add clients, so the break-even matters.
            Below it, the all-in-one is cheaper; above it, the stack is cheaper on subscriptions
            alone.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            With all seven default tools ticked, the stack comes to ₹22,175 a month, or ₹2,66,100 a
            year. Traiv's Trainer plan is ₹999 a month at any client count, so at 15 clients it's
            ₹21,176 a month cheaper than the stack, and there's no break-even within 500 clients
            because the price doesn't rise with clients. Pick another platform from the list, such
            as Everfit or PT Distinction, to compare it in its own currency.
          </p>
        </>
      ),
    },
    {
      heading: "No currency conversion",
      body: (
        <>
          <p>
            The default tool prices are converted once, at a dated rate, so they can be compared
            with Traiv's rupee price. After that, switching currency changes the symbol only; the
            calculator never converts what you type. If you compare with a platform priced in
            another currency, set the currency to match and enter your own tool costs in it.
          </p>
        </>
      ),
    },
    {
      heading: "What the numbers leave out",
      body: (
        <>
          <ul>
            <li>
              <strong>Payment processing fees,</strong> which scale with revenue whichever tools you
              use.
            </li>
            <li>
              <strong>Per-seat and usage charges</strong> as you grow, which some 'flat' tools add.
            </li>
            <li>
              <strong>Your time:</strong> moving between tools, copying data and helping clients
              with several apps.
            </li>
            <li>
              <strong>Features:</strong> an all-in-one may lack something a specialist tool does
              well, or the other way round.
            </li>
          </ul>
          <p>
            Use the totals as one input into your decision, alongside time, features and the client
            experience.
          </p>
        </>
      ),
    },
    {
      heading: "The hidden cost of switching apps",
      body: (
        <>
          <p>
            When clients use one app for workouts, another for food, a form for check-ins and a chat
            app for messages, they're more likely to miss things. Some drift away. Fewer apps
            usually means a simpler experience, which supports adherence and retention. That benefit
            doesn't show in the subscription total, but it often matters more.
          </p>
        </>
      ),
    },
    {
      heading: "When a stack is the better choice",
      body: (
        <>
          <p>
            A stack can make sense if you rely on a specialist tool that no all-in-one matches, if
            you already have long-term discounts, or if your client count is high enough that
            per-client platform pricing overtakes your flat stack. The break-even figure shows when
            that happens.
          </p>
        </>
      ),
    },
    {
      heading: "Reviewing subscriptions",
      body: (
        <>
          <p>
            Once a year, list every subscription, what it does and whether you still use it. Cancel
            tools you've stopped using, merge ones that overlap and renegotiate where you can. Even
            if you keep a stack, a yearly review often saves a meaningful amount.
          </p>
        </>
      ),
    },
    {
      heading: "Stacks for different coaches",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Coach</th>
                  <th scope="col">Typical stack</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Online training coach</td>
                  <td>Workout builder, form builder, scheduler, file storage</td>
                </tr>
                <tr>
                  <td>Nutrition coach</td>
                  <td>Meal planner, form builder, scheduler, video calls</td>
                </tr>
                <tr>
                  <td>Hybrid coach</td>
                  <td>Workout builder, meal planner, forms, scheduler, community</td>
                </tr>
                <tr>
                  <td>Group programme coach</td>
                  <td>Workout builder, community platform, email, payments</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Untick the tools you don't use and add up what you actually pay. Most coaches find at
            least one subscription they'd forgotten about.
          </p>
        </>
      ),
    },
    {
      heading: "Per-client tools",
      body: (
        <>
          <p>
            Some tools in a stack charge per client or per seat, such as a workout builder with
            client limits or a scheduler priced per seat. As you grow, those costs rise too, which
            moves the break-even point. Check each tool's pricing page for limits, and update the
            price in the calculator when you move up a tier. The default workout builder, TrueCoach
            Standard, covers up to 20 active clients; above that, its Pro plan is USD 136.99 a
            month.
          </p>
        </>
      ),
    },
    {
      heading: "Break-even, explained",
      body: (
        <>
          <p>
            The break-even is the client count where the chosen all-in-one platform starts to cost
            more each month than your stack. With a flat-priced platform, there may be no break-even
            at all within 500 clients. With per-client pricing, it can arrive quickly. Drag the
            client slider to see how the comparison changes as you grow.
          </p>
        </>
      ),
    },
    {
      heading: "Time saved",
      body: (
        <>
          <p>
            Using one platform instead of several often saves time each week: fewer logins, no
            copying data between tools, one place to review check-ins and reply. If you save even
            two hours a week and value your time at USD 40 an hour, that's about USD 350 a month,
            more than many stacks cost. The subscription total is only part of the picture.
          </p>
        </>
      ),
    },
    {
      heading: "Client experience",
      body: (
        <>
          <p>
            Clients notice when they have to use several apps. A workout in one place, meals in
            another, a form link for check-ins and messages in a chat app can feel disjointed, and
            some clients stop engaging. One app where everything lives together is usually easier
            for clients to follow, which supports results and retention.
          </p>
        </>
      ),
    },
    {
      heading: "When to switch",
      body: (
        <>
          <p>
            Switching from a stack to an all-in-one makes most sense when the all-in-one is cheaper
            or similar in price at your client count, covers the features you rely on, and you have
            time to move clients carefully. Plan the move: rebuild templates first, move a few
            clients, then the rest. Cancel the old subscriptions only once everyone is settled.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping a stack well organised",
      body: (
        <>
          <p>
            If you keep a stack, make it work smoothly. Use the same login email for every tool,
            link them where integrations exist, keep a simple document of which tool does what, and
            review costs once a year. A well-organised stack can work well; a disorganised one costs
            time every day.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing with Traiv",
      body: (
        <>
          <p>
            Traiv's Trainer plan is ₹999 a month for one trainer and covers workout plans, diet
            plans and check-ins, with your name and logo in the client app. It's the default
            comparison, so the result shows how much your stack costs against it straight away.
            Replace the default tool prices with your own invoices for an exact figure.
          </p>
        </>
      ),
    },
    {
      heading: "A worked comparison at 40 clients",
      body: (
        <>
          <p>
            With the default stack at USD 235.98 a month, Everfit Pro at 40 clients is USD 95 a
            month for up to 50 clients, still well under the stack. Hevy Coach at 40 clients is USD
            90. The default workout builder in the stack, TrueCoach Standard, covers only 20 active
            clients, so a coach with 40 clients would need TrueCoach Pro at USD 136.99 instead,
            raising the stack to USD 314.98.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            The calculator runs entirely in your browser. Your prices and choices aren't stored or
            sent.
          </p>
        </>
      ),
    },
    {
      heading: "Annual versus monthly billing",
      body: (
        <>
          <p>
            Several tools in a typical stack show lower prices for annual billing. The community
            default, Circle Professional, is listed on an annual billing basis, and Calendly's page
            suggests its listed per-seat price may also reflect yearly billing. If you pay monthly,
            your real costs may be higher than the defaults. Check your invoices and enter what you
            actually pay.
          </p>
        </>
      ),
    },
    {
      heading: "Taxes",
      body: (
        <>
          <p>
            Many software subscriptions add VAT or sales tax depending on where you are. List prices
            usually exclude it. If you want the calculator to reflect what leaves your account,
            enter prices including tax for every tool, and compare with an all-in-one price that
            includes tax too.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing with other platforms",
      body: (
        <>
          <p>
            Choose any platform with published pricing from the list to compare with it instead of
            Traiv. Platforms priced in USD or EUR are calculated at your client count, with the
            saving and break-even shown once your currency matches theirs. Set the currency, enter
            your tool costs in it, and the comparison updates as you drag the client slider.
          </p>
        </>
      ),
    },
    {
      heading: "The yearly view",
      body: (
        <>
          <p>
            Monthly costs can look small; yearly totals show the real scale. At the default prices,
            the stack is about ₹2,66,100 a year. Even if your own invoices are half the defaults,
            that's still well over ₹1,00,000 a year on subscriptions. Seeing the yearly figure is
            often what prompts coaches to review their tools.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            List every subscription you pay for, untick the defaults you don't use, and replace each
            price with the figure on your last invoice. Note the monthly and yearly totals, compare
            them with an all-in-one, and decide whether any tool can go.
          </p>
        </>
      ),
    },
    {
      heading: "What each default covers",
      body: (
        <>
          <ul>
            <li>
              <strong>Workout builder:</strong> TrueCoach Standard, which lists up to 20 active
              clients at USD 57.99 a month.
            </li>
            <li>
              <strong>Meal planning:</strong> That Clean Life Starter at USD 30 a month, billed
              monthly.
            </li>
            <li>
              <strong>Check-in forms:</strong> Typeform Basic at USD 39 a month, billed monthly.
            </li>
            <li>
              <strong>Scheduling:</strong> Calendly Standard at USD 10 per seat, as listed.
            </li>
            <li>
              <strong>File storage:</strong> Dropbox Plus with 2 TB at USD 9.99 a month, billed
              monthly.
            </li>
            <li>
              <strong>Community:</strong> Circle Professional at USD 89 a month, listed on an annual
              billing basis.
            </li>
            <li>
              <strong>Payments:</strong> most processors charge per transaction rather than monthly,
              so the default is zero.
            </li>
          </ul>
          <p>
            Each is converted to rupees at 93.97 INR per USD as a starting point. Replace them with
            your own figures.
          </p>
        </>
      ),
    },
    {
      heading: "Gyms and teams",
      body: (
        <>
          <p>
            If several coaches work under one business, many separate tools charge per seat, so the
            stack grows with each coach. Traiv's Gym plan is ₹2,499 a month for gyms with three or
            more trainers. To compare, multiply the per-seat tools in your stack by the number of
            coaches, and compare the total with the gym plan you're considering.
          </p>
        </>
      ),
    },
    {
      heading: "Questions to ask before cancelling a tool",
      body: (
        <>
          <ul>
            <li>Does the all-in-one do this job as well, or well enough?</li>
            <li>Will clients lose anything they use every week?</li>
            <li>
              Can you export your data, such as programmes, forms or videos, before cancelling?
            </li>
            <li>Is there a contract or annual renewal date to plan around?</li>
          </ul>
          <p>Cancel only once clients are settled in the new setup and your data is safe.</p>
        </>
      ),
    },
    {
      heading: "Why the stack stays flat",
      body: (
        <>
          <p>
            Most tools in a typical stack charge per account rather than per client, so their price
            doesn't change whether you coach 10 clients or 40. That's why the stack line is flat in
            the calculator. Many coaching platforms charge more as clients grow, which is why
            break-even exists. Traiv's Trainer plan is a single monthly price for one trainer, so
            the comparison with Traiv doesn't change as you drag the client slider.
          </p>
        </>
      ),
    },
    {
      heading: "Hours across several tools",
      body: (
        <>
          <p>
            Every extra tool adds small tasks: logging in, copying a client's details, sending a
            link, checking another inbox. Spread across a week and a full roster, those minutes add
            up. Coaches who move to one platform often say the biggest gain wasn't the subscription
            saving but the time they got back for coaching.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy and data",
      body: (
        <>
          <p>
            When client information is spread across several tools, it's stored in several places,
            each with its own privacy terms. Fewer tools means fewer places holding personal and
            health data, which is simpler to manage and easier to explain to clients.
          </p>
        </>
      ),
    },
    {
      heading: "A worked comparison with your own numbers",
      body: (
        <>
          <p>
            Suppose you pay ₹2,500 a month for a workout app, ₹1,200 for a form builder and ₹800 for
            scheduling, and don't use the other tools. Untick meal planning, storage and community,
            and enter those three figures. Your stack becomes ₹4,500 a month, or ₹54,000 a year.
            Against Traiv at ₹999 a month, that's ₹3,501 a month less, or ₹42,012 a year, before
            counting the time saved by using one app.
          </p>
        </>
      ),
    },
    {
      heading: "What to do with the result",
      body: (
        <>
          <p>
            If the all-in-one is clearly cheaper and covers what you need, plan a move: rebuild your
            templates, trial it with a few clients, then switch the rest and cancel the old tools.
            If your stack is cheaper or does something you can't replace, keep it, but review it
            each year. Either way, you'll know exactly what your tools cost.
          </p>
        </>
      ),
    },
    {
      heading: "Exchange rates",
      body: (
        <>
          <p>
            The default rupee figures use one dated rate, 93.97 INR per USD from x-rates.com on 16
            November 2026. Your card may charge a different rate plus a foreign transaction fee, so
            your real rupee cost for USD tools is often a little higher. Enter the amount that
            actually leaves your account.
          </p>
        </>
      ),
    },
    {
      heading: "Reviewing again later",
      body: (
        <>
          <p>
            Revisit the calculator when you add a tool, when a vendor changes its price or when your
            client count changes a lot. Keeping the numbers current turns it into a quick yearly
            check on what your business spends to run.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping it simple for clients",
      body: (
        <>
          <p>
            Every tool you cut is one less app, login or link for your clients. Fewer moving parts
            means fewer missed check-ins and fewer 'where do I find my plan?' messages, which is
            good for them and for you.
          </p>
        </>
      ),
    },
    {
      heading: "Nothing leaves this page",
      body: (
        <>
          <p>
            Prices you edit, tools you untick and the platform you pick stay on your device. Reload
            the page to start again from the defaults.
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
    heading: "One app for the whole coaching relationship",
    body: (
      <>
        <p>
          Traiv's Trainer plan is ₹999 a month: workout plans, diet plans, check-ins and your name
          and logo in the client app, in one place. Start with the 14-day free trial.
        </p>
      </>
    ),
  },
  next: [
    {
      label: "Coaching platform cost calculator",
      href: "/tools/coaching-platform-cost-calculator",
    },
    { label: "Coaching profit calculator", href: "/tools/coaching-profit-calculator" },
    { label: "Coaching platform fit finder", href: "/tools/coaching-platform-fit-finder" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "Is an all-in-one platform always cheaper?",
      a: "No. It depends on your stack and client count. The break-even shows where the two cross.",
    },
    {
      q: "Are payment fees included?",
      a: "No. Card-processing fees scale with revenue either way and are left out.",
    },
    {
      q: "Can I change the default prices?",
      a: "Yes. Edit every price to match your invoices, and untick tools you don't use.",
    },
    { q: "Does it convert currencies?", a: "No. Enter every figure in the same currency." },
    {
      q: "Where do the default prices come from?",
      a: "Entry-tier list prices read off each vendor's page on 16 November 2026.",
    },
  ],
  keepGoing: [
    { label: "Traiv pricing", href: "/pricing" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Run your coaching business on one platform",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
