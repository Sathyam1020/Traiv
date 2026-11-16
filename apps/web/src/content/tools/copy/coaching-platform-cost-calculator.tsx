import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Coaching platform cost calculator",
  description:
    "Compare the monthly base price of 18 coaching platforms at your client count, with what each plan covers, client-app branding and dated vendor sources.",
  eyebrow: "Free tool · Platform pricing",
  h1: "What will a coaching platform cost you?",
  intro: (
    <>
      <p>
        Set your number of active clients to compare the base monthly price of eighteen coaching
        platforms, from the vendors' own pricing pages. See what each price covers, whether the
        client app can carry your branding, and where a vendor doesn't publish a price. Every figure
        shows its source and the date it was checked.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How much does online coaching software cost?",
    answer: (
      <>
        <p>
          It depends heavily on how many clients you have. At 25 clients, published base prices
          checked in November 2026 range from about USD 30 a month to well over USD 100, and some
          vendors only quote on request. Per-client pricing gets expensive as you grow, while flat
          or seat-band pricing often gets cheaper per client.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why client count changes everything",
      body: (
        <>
          <p>
            Most coaching platforms price by the number of clients you coach, but they do it in very
            different ways. Some charge a flat monthly fee with unlimited clients. Some use bands,
            such as up to 25 or up to 50 clients. Some charge a base fee plus a price per extra
            client. Some charge per seat, with the rate falling as you grow. A platform that's
            cheapest at 10 clients can be one of the most expensive at 60.
          </p>
          <p>
            That's why a single headline price tells you very little. The calculator shows what each
            platform's base plan costs at your client count, so you can compare like with like.
          </p>
        </>
      ),
    },
    {
      heading: "How prices were collected",
      body: (
        <>
          <p>
            Every price was read off the vendor's own public pricing page on 16 November 2026, using
            monthly billing where the page shows it. Each row links to the page it came from and
            shows the date. Where a page couldn't be read, worked its price out with a script,
            showed conflicting figures or asked for a quote, the calculator says 'Check vendor
            price' rather than guessing.
          </p>
          <p>
            Prices change. Treat the table as a starting point and confirm the current figure with
            any vendor you're seriously considering.
          </p>
        </>
      ),
    },
    {
      heading: "What's included and what isn't",
      body: (
        <>
          <ul>
            <li>
              <strong>Included:</strong> the base monthly subscription for the plan that covers your
              client count.
            </li>
            <li>
              <strong>Not included:</strong> add-ons such as branded apps sold separately, taxes,
              payment processing fees and any currency conversion.
            </li>
            <li>
              <strong>Grouping:</strong> rows are grouped by the currency the vendor prices in, then
              sorted by price.
            </li>
          </ul>
          <p>
            The currency filter shows EUR, USD or INR prices only. Nothing is converted; a USD price
            stays a USD price.
          </p>
        </>
      ),
    },
    {
      heading: "Client-app branding",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Label</th>
                  <th scope="col">Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Included</td>
                  <td>Your branding in the client app on the plan shown</td>
                </tr>
                <tr>
                  <td>Higher tier</td>
                  <td>Branding available, but on a more expensive plan</td>
                </tr>
                <tr>
                  <td>Paid add-on</td>
                  <td>Branding sold separately, often as a one-time fee</td>
                </tr>
                <tr>
                  <td>Not offered</td>
                  <td>The vendor states it doesn't offer a branded app</td>
                </tr>
                <tr>
                  <td>Not stated</td>
                  <td>The pricing page doesn't say</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Branding matters because clients see the app every day. An app with your name and logo
            makes the coaching feel like your business rather than someone else's. Tick 'Hide
            platforms without client-app branding' to focus on the ones that offer it.
          </p>
        </>
      ),
    },
    {
      heading: "Examples at 25 clients",
      body: (
        <>
          <p>
            At 25 clients, the published base prices include Trainero at USD 30 a month on its US
            page with unlimited clients, HubFit Standard at USD 39 for up to 50 clients, Hevy Coach
            at USD 50 for 11 to 25 clients, PT Distinction Pro at USD 59.90 for up to 25 clients,
            Kahunas at USD 62.50 for 25 seats at USD 2.50 each, Practice Better Professional at USD
            69, Everfit Pro at USD 75 for up to 35 clients, FitBudd Pro at USD 89 with 20 clients
            included plus five at USD 2 each, and TrueCoach Pro at USD 136.99 for up to 50 active
            clients. Coachway is EUR 249 at 25 clients: EUR 69 for five plus twenty at EUR 9 each.
            Traiv's Trainer plan is ₹999 a month.
          </p>
        </>
      ),
    },
    {
      heading: "Flat, banded, per-client and per-seat pricing",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Model</th>
                  <th scope="col">How it works</th>
                  <th scope="col">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Flat</td>
                  <td>One price, unlimited clients</td>
                  <td>Trainero Premium</td>
                </tr>
                <tr>
                  <td>Banded</td>
                  <td>A price for each client band</td>
                  <td>Everfit, PT Distinction, Hevy Coach</td>
                </tr>
                <tr>
                  <td>Base plus per client</td>
                  <td>A base fee plus a price for each extra client</td>
                  <td>Coachway, FitBudd</td>
                </tr>
                <tr>
                  <td>Per seat</td>
                  <td>A rate per seat, falling as you grow</td>
                  <td>Kahunas</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Flat pricing is predictable. Banded pricing jumps at each threshold. Per-client pricing
            grows steadily with your roster. Per-seat pricing can become very cheap per client at
            scale. Think about where your client count will be in a year, not just today.
          </p>
        </>
      ),
    },
    {
      heading: "The cost of switching",
      body: (
        <>
          <p>
            Moving platforms takes time: rebuilding programmes and templates, moving client data,
            setting up check-ins and helping clients install a new app. A platform that's slightly
            cheaper but disrupts your clients may cost more in churn than it saves. If you're happy
            with your current platform, a small price difference is rarely worth the move.
          </p>
        </>
      ),
    },
    {
      heading: "What price doesn't show",
      body: (
        <>
          <p>
            The table compares base prices, not features or quality. Two platforms at the same price
            can differ greatly in workout builders, nutrition tools, check-ins, messaging, payments,
            app quality and support. Shortlist two or three on price and branding, then try each
            with a few real clients before deciding.
          </p>
        </>
      ),
    },
    {
      heading: "Branded apps sold separately",
      body: (
        <>
          <p>
            Several platforms sell branded apps as add-ons. Trainerize lists a custom branded app as
            a USD 169 one-time add-on on Pro, included on Studio Plus. FitBudd's fully
            white-labelled app is on Super Pro at USD 149 a month plus USD 75 setup, and its FAQ
            adds Apple and Google developer fees. These add-ons aren't in the base price, so add
            them yourself if branding is important to you.
          </p>
        </>
      ),
    },
    {
      heading: "How prices move with client count",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Platform</th>
                  <th scope="col">10 clients</th>
                  <th scope="col">60 clients</th>
                  <th scope="col">100 clients</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Trainero (US page)</td>
                  <td>USD 30</td>
                  <td>USD 30</td>
                  <td>USD 30</td>
                </tr>
                <tr>
                  <td>HubFit</td>
                  <td>USD 39</td>
                  <td>USD 69</td>
                  <td>USD 69</td>
                </tr>
                <tr>
                  <td>Hevy Coach</td>
                  <td>USD 25</td>
                  <td>USD 160</td>
                  <td>USD 160</td>
                </tr>
                <tr>
                  <td>Kahunas</td>
                  <td>USD 50</td>
                  <td>USD 120</td>
                  <td>USD 150</td>
                </tr>
                <tr>
                  <td>Practice Better</td>
                  <td>USD 35</td>
                  <td>USD 69</td>
                  <td>USD 69</td>
                </tr>
                <tr>
                  <td>Everfit</td>
                  <td>USD 29</td>
                  <td>USD 120</td>
                  <td>USD 140</td>
                </tr>
                <tr>
                  <td>FitBudd</td>
                  <td>USD 79</td>
                  <td>USD 159</td>
                  <td>USD 239</td>
                </tr>
                <tr>
                  <td>Coachway</td>
                  <td>EUR 114</td>
                  <td>EUR 564</td>
                  <td>EUR 924</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Flat and banded prices stay steady across wide ranges, while base-plus-per-client
            pricing climbs with every client. Kahunas's per-seat rate falls as seats rise, so its
            total grows more slowly. Plans that stop at a client limit, such as PT Distinction at 50
            or TrueCoach at 50 active clients, show as above the largest published tier once you
            pass it.
          </p>
        </>
      ),
    },
    {
      heading: "Thinking a year ahead",
      body: (
        <>
          <p>
            Choose a platform for where your business is heading, not only where it is today. If you
            have 15 clients now and aim for 50 within a year, compare prices at both numbers. A
            platform that's cheap today but doubles in price at your target size may not be the best
            long-term choice, especially once you add the cost of switching later.
          </p>
        </>
      ),
    },
    {
      heading: "Free tiers",
      body: (
        <>
          <p>
            Several platforms offer free plans for a small number of clients: Everfit's Starter plan
            for up to 5 clients, Practice Better's Sprout plan for up to 3 and HubFit's Free plan
            for up to 2. They're useful for testing a platform with real clients, but most coaches
            outgrow them quickly. Check what the first paid tier costs at your client count before
            building your business on a free plan.
          </p>
        </>
      ),
    },
    {
      heading: "Currency and where you're based",
      body: (
        <>
          <p>
            Many vendors show prices in different currencies depending on where you visit from, and
            some charge tax on top. The table shows the currency the vendor's page displayed when
            checked. If you pay in another currency, your bank's exchange rate and any card fees
            will change the final cost. Nothing in the calculator is converted.
          </p>
        </>
      ),
    },
    {
      heading: "Annual billing",
      body: (
        <>
          <p>
            Many platforms offer discounts for paying a year in advance, often 15 to 20%. The table
            uses monthly billing where the page shows it, so annual prices may be lower. Annual
            billing saves money but locks you in; it's worth it once you're confident a platform
            suits you.
          </p>
        </>
      ),
    },
    {
      heading: "Questions to ask vendors",
      body: (
        <>
          <ul>
            <li>What exactly counts as an active client?</li>
            <li>What happens to the price when I pass my plan's client limit?</li>
            <li>Is a branded client app included, and on which plan?</li>
            <li>How are client payments processed, and where do payouts go?</li>
            <li>What's included in support, and how quickly do they respond?</li>
            <li>How easy is it to export my data if I leave?</li>
          </ul>
          <p>
            Clear answers to these questions often matter more than a small difference in price.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing with Traiv",
      body: (
        <>
          <p>
            Traiv's Trainer plan is ₹999 a month for one trainer, with workout plans, diet plans,
            check-ins and your name and logo in the client app; its Gym plan is ₹2,499 a month for
            gyms with three or more trainers. Because Traiv prices in rupees, compare it in INR
            rather than converting. For several platforms, there's a dedicated comparison page
            linked from the table.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            The calculator runs in your browser. Your client count isn't stored or sent anywhere.
          </p>
        </>
      ),
    },
    {
      heading: "Branding and your business",
      body: (
        <>
          <p>
            When a client opens their coaching app every day, the name they see matters. A
            platform's own brand reminds them they're using someone else's product; your name and
            logo remind them they're working with you. For many coaches that difference shows up in
            referrals and retention, which is why the calculator lets you hide platforms that don't
            offer client-app branding at all.
          </p>
        </>
      ),
    },
    {
      heading: "Reading the table on a phone",
      body: (
        <>
          <p>
            On a small screen, the table scrolls sideways. Platform and price stay at the left,
            followed by what the price covers, the branding position and the source with its check
            date. Tap 'vendor page' to open the pricing page the figure came from, and 'Compare with
            Traiv' where a detailed comparison page exists.
          </p>
        </>
      ),
    },
    {
      heading: "Platforms we couldn't price",
      body: (
        <>
          <p>
            Six platforms show 'Check vendor price'. My PT Hub's and Paperbell's pages couldn't be
            read when checked. FitSW calculates its price in the page itself, so no fixed figure was
            readable. Trainerize's page showed conflicting figures for the same plans. Exercise.com
            and Virtuagym give prices only on request. Rather than guess, we link to each page so
            you can see the current figure yourself.
          </p>
        </>
      ),
    },
    {
      heading: "Price is one part of the decision",
      body: (
        <>
          <p>
            A cheaper platform that your clients find hard to use can cost you more in churn than it
            saves in subscriptions. Use the price table to shortlist, then judge the shortlist on
            the things clients feel every week: how easy the app is, how quickly they can log a
            session or a meal, and how check-ins and messages work.
          </p>
        </>
      ),
    },
    {
      heading: "Why prices differ so much",
      body: (
        <>
          <p>
            Coaching platforms serve different coaches. Some are built for solo online coaches and
            price low for small rosters. Some target studios and gyms, with higher prices and more
            staff features. Some are practice-management tools for dietitians and therapists. Some
            focus on one thing, such as workouts, and keep the price low by doing less. When two
            prices differ a lot, it's usually because the platforms are aimed at different coaches,
            not because one is overcharging.
          </p>
        </>
      ),
    },
    {
      heading: "Prices in rupees",
      body: (
        <>
          <p>
            Most platforms in the table price in US dollars or euros. Traiv prices in rupees: the
            Trainer plan is ₹999 a month and the Gym plan ₹2,499 a month for gyms with three or more
            trainers. Choose INR in the currency filter to see rupee-priced plans on their own. If
            you pay a USD or EUR platform from an Indian card, the amount charged will depend on
            your bank's exchange rate and any foreign transaction fee.
          </p>
        </>
      ),
    },
    {
      heading: "Using the calculator",
      body: (
        <>
          <ol>
            <li>Set your current number of active clients.</li>
            <li>Filter by the currency you'd pay in, if you like.</li>
            <li>Tick the branding filter if a branded client app matters to you.</li>
            <li>Note the three or four lowest prices that meet your needs.</li>
            <li>Open each vendor page to confirm the current price and plan details.</li>
            <li>Repeat at the client count you expect in a year.</li>
          </ol>
          <p>That gives you a realistic shortlist to trial.</p>
        </>
      ),
    },
    {
      heading: "Free trials",
      body: (
        <>
          <p>
            Most platforms offer either a free plan or a free trial. Traiv offers a 14-day free
            trial of the Trainer plan. Use a trial to rebuild one real programme, run a check-in and
            ask a client to use the app for a week. That tells you more about value than the price
            alone, and it shows whether the platform will actually save you time.
          </p>
        </>
      ),
    },
    {
      heading: "Hidden costs to watch for",
      body: (
        <>
          <ul>
            <li>One-time setup fees for branded apps.</li>
            <li>Apple and Google developer account fees for white-label apps.</li>
            <li>Extra charges per client above a plan's limit.</li>
            <li>Payment processing fees on client payments.</li>
            <li>Taxes added at checkout.</li>
          </ul>
          <p>
            None of these are in the base price shown. Add the ones that apply to you when
            comparing.
          </p>
        </>
      ),
    },
    {
      heading: "When the cheapest isn't the best",
      body: (
        <>
          <p>
            The lowest price at your client count is a good starting point, not a decision. A
            platform that saves USD 20 a month but costs you two hours a week in workarounds, or
            makes clients less likely to log their sessions, is more expensive in practice. Weigh
            price against the time it saves you and how well your clients use it.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Set your client count, note the platforms that fit your budget and branding needs, then
            open two or three vendor pages to confirm today's prices. Try the one that fits best
            with a few clients before deciding.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping prices honest",
      body: (
        <>
          <p>
            We'd rather show 'Check vendor price' than a figure we can't stand behind. If you spot a
            price that has changed since the check date, the vendor page linked in that row is the
            place to confirm it.
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
      label: "Coaching tool stack cost calculator",
      href: "/tools/coaching-tool-stack-cost-calculator",
    },
    { label: "Coaching platform fit finder", href: "/tools/coaching-platform-fit-finder" },
    { label: "Coaching profit calculator", href: "/tools/coaching-profit-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "Which coaching platform is cheapest?",
      a: "It depends on your client count. Some are free for a handful of clients; flat-priced ones get cheaper per client as you grow. Use the slider to compare at your number.",
    },
    {
      q: "Why do some rows say 'Check vendor price'?",
      a: "Because the vendor's page couldn't be read, showed conflicting figures, calculated prices in a script or asked for a quote. We don't guess.",
    },
    {
      q: "Are taxes and payment fees included?",
      a: "No. The table shows base subscriptions only.",
    },
    {
      q: "Are prices converted between currencies?",
      a: "No. Each price is shown in the vendor's own currency.",
    },
    {
      q: "How often are prices checked?",
      a: "Each row shows the date it was checked. Always confirm with the vendor before buying.",
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
