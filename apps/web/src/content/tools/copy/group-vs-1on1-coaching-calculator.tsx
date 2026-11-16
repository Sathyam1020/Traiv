import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Group vs 1:1 coaching calculator",
  description:
    "Compare the effective hourly rate, monthly revenue and weekly hours of one-to-one coaching and group coaching side by side.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Group vs 1:1 coaching calculator",
  intro: (
    <>
      <p>
        Enter the price, clients and hours for your one-to-one coaching and a group offer. See the
        effective hourly rate, monthly revenue and weekly hours for each, and which model earns more
        for your time.
      </p>
    </>
  ),
  shortAnswer: {
    question: "Does group coaching pay more than one-to-one?",
    answer: (
      <>
        <p>
          Often, per hour. Fifteen 1:1 clients at €400 a month taking an hour a week each bring
          €6,000 for 15 hours: about €92 an hour. A group of 30 at €150 taking 4 hours a week brings
          €4,500 for 4 hours: about €260 an hour. Effective hourly rate is monthly revenue ÷ (weekly
          hours × 4.33).
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Two ways to sell your time",
      body: (
        <>
          <p>
            One-to-one coaching sells your attention to one person at a time. It commands a higher
            price per client, because the plan, feedback and contact are all personal. Group
            coaching sells your attention to many people at once. Each pays less, but the same hour
            of your time serves more clients. The question isn't which is better; it's which suits
            your goals, your clients and your week.
          </p>
          <p>
            Comparing effective hourly rates puts the two on the same scale. It shows what each hour
            of coaching actually earns, which is often very different from what the price per client
            suggests.
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
                  <th scope="col">1:1</th>
                  <th scope="col">Group</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Price per client</td>
                  <td>€400</td>
                  <td>€150</td>
                </tr>
                <tr>
                  <td>Clients</td>
                  <td>15</td>
                  <td>30</td>
                </tr>
                <tr>
                  <td>Monthly revenue</td>
                  <td>€6,000</td>
                  <td>€4,500</td>
                </tr>
                <tr>
                  <td>Weekly hours</td>
                  <td>15 (1 h × 15)</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>Effective hourly rate</td>
                  <td>€6,000 ÷ (15 × 4.33) ≈ €92</td>
                  <td>€4,500 ÷ (4 × 4.33) ≈ €260</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Effective hourly rate divides monthly revenue by monthly hours, using 4.33 weeks per
            month. It measures delivery hours only; marketing and admin are the same for both models
            and are left out.
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
                  <th scope="col">1:1 hourly</th>
                  <th scope="col">Group hourly</th>
                  <th scope="col">Group revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Group of 15 at €150, 3 hours a week</td>
                  <td>€92</td>
                  <td>€173</td>
                  <td>€2,250</td>
                </tr>
                <tr>
                  <td>Group of 30 at €150, 4 hours a week</td>
                  <td>€92</td>
                  <td>€260</td>
                  <td>€4,500</td>
                </tr>
                <tr>
                  <td>Group of 50 at €99, 5 hours a week</td>
                  <td>€92 (20 clients at €300, 45 min)</td>
                  <td>€228</td>
                  <td>€4,950</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Group coaching usually wins on hourly rate once the group is reasonably full. A small
            group, or one that takes many hours, may earn less per hour than one-to-one. The
            calculator makes the break-even point obvious.
          </p>
        </>
      ),
    },
    {
      heading: "What group coaching gives clients",
      body: (
        <>
          <p>
            Group clients get structure, accountability and a community of people working towards
            similar goals. Many value hearing others' questions and wins, and feel less alone. They
            get less personal attention than one-to-one clients, which suits some people and not
            others.
          </p>
          <p>
            Groups work best when members share a goal and a starting point: beginners learning to
            lift, women returning to exercise after pregnancy, runners training for the same race.
            Mixed groups with very different needs are harder to coach well.
          </p>
        </>
      ),
    },
    {
      heading: "What one-to-one gives clients",
      body: (
        <>
          <p>
            One-to-one clients get a fully personal plan, detailed feedback and direct access to
            you. That suits people with specific goals, injuries, complex lives or high
            expectations, and those willing to pay for individual attention. It also tends to
            produce stronger relationships and, often, longer retention.
          </p>
          <p>
            Many clients who start in a group later move to one-to-one coaching, and some one-to-one
            clients move into a group when they want ongoing support at a lower price. Offering both
            creates a path for clients to stay with you as their needs change.
          </p>
        </>
      ),
    },
    {
      heading: "Hidden time in group coaching",
      body: (
        <>
          <p>
            Group hours aren't only the live calls. There's preparation, community moderation,
            answering questions in a group chat, and individual check-ins if you include them. A
            group that looks like 4 hours a week may really take 7 or 8. Count all of it in the
            calculator, or the hourly rate will look better than it is.
          </p>
          <p>
            Equally, count all the time in one-to-one coaching: messaging, programming and check-ins
            as well as sessions.
          </p>
        </>
      ),
    },
    {
      heading: "Group size and quality",
      body: (
        <>
          <p>
            As a group grows, hourly rate rises, but each member gets less attention. Beyond a
            certain size, members may feel anonymous and engagement drops, which can increase churn.
            Many coaches find a sweet spot between 10 and 30 members for groups with regular live
            contact, and larger numbers for programmes built mostly around recorded content and
            community.
          </p>
          <p>
            Watch retention as the group grows. A group with high churn has to keep recruiting just
            to stay the same size.
          </p>
        </>
      ),
    },
    {
      heading: "Running both models",
      body: (
        <>
          <p>
            Many coaches run a mix: a small number of premium one-to-one clients and one or two
            groups. The one-to-one clients bring high revenue per client and deep relationships; the
            groups bring high hourly rates and reach people who can't afford one-to-one. Enter each
            part into the calculator to see how much each contributes and how many hours each takes.
          </p>
          <p>
            A mix also spreads risk. If one-to-one demand dips, the group keeps income steady, and
            the other way round.
          </p>
        </>
      ),
    },
    {
      heading: "Pricing a group",
      body: (
        <>
          <p>
            Group prices are usually a fraction of one-to-one prices, often a quarter to a half.
            Price from the value members get and the number needed to fill the group, not just from
            your time. A group that needs 30 members to earn your target rate is harder to fill than
            one that needs 12 at a higher price.
          </p>
          <p>
            Test with a small founding group at an introductory price, then raise the price once
            you've proven results and have testimonials.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing your next step",
      body: (
        <>
          <p>
            If your one-to-one calendar is full and your hourly rate is below your target, a group
            can raise income without more hours. If your group struggles to fill, or members want
            more personal help, one-to-one may be the better focus. Use the calculator with real or
            realistic numbers for both, and compare not only hourly rate but total revenue and the
            kind of coaching you want to do.
          </p>
        </>
      ),
    },
    {
      heading: "Group formats",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Format</th>
                  <th scope="col">What it involves</th>
                  <th scope="col">Typical time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Live group calls</td>
                  <td>Weekly video call for teaching and Q&amp;A</td>
                  <td>1 to 2 hours a week</td>
                </tr>
                <tr>
                  <td>Small-group training</td>
                  <td>In-person sessions for 3 to 8 people</td>
                  <td>Several hours a week</td>
                </tr>
                <tr>
                  <td>Programme with community</td>
                  <td>Shared plan, group chat, occasional calls</td>
                  <td>2 to 5 hours a week</td>
                </tr>
                <tr>
                  <td>Cohort programme</td>
                  <td>Fixed start date, set length, group progress</td>
                  <td>Varies by length</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Each format has a different time cost and price. Enter the real hours for the format
            you're considering, including preparation and community time.
          </p>
        </>
      ),
    },
    {
      heading: "Retention in groups",
      body: (
        <>
          <p>
            Groups can have higher churn than one-to-one coaching, because members feel less
            personally connected and the price is lower, making it easier to leave. Strong groups
            counter this with a clear start and end, regular wins shared in the community, and some
            personal contact, such as a short individual check-in each month.
          </p>
          <p>
            Track churn for the group separately. A group with high hourly revenue but high churn
            may need more marketing effort than its hourly rate suggests.
          </p>
        </>
      ),
    },
    {
      heading: "Moving from 1:1 to group",
      body: (
        <>
          <p>
            If you're considering adding a group, start small. Invite a handful of existing or past
            clients who would benefit, run a short pilot programme, and gather feedback. Use their
            results and testimonials to fill the next round. Many coaches find their best group
            members are people who couldn't afford one-to-one coaching but wanted their approach.
          </p>
        </>
      ),
    },
    {
      heading: "Small-group personal training",
      body: (
        <>
          <p>
            In-person trainers often use small groups of two to six people as a middle ground. Each
            client pays less than for one-to-one sessions, but the trainer earns more per hour. A
            session with four clients at €25 each earns €100 an hour, compared with €60 for one
            client. Clients often enjoy training with others and stay motivated longer.
          </p>
          <p>
            Enter small-group sessions in the group column with the total hours you spend on them
            each week.
          </p>
        </>
      ),
    },
    {
      heading: "Your own preferences",
      body: (
        <>
          <p>
            Hourly rate is one factor. Your own preferences matter too. Some coaches love the energy
            of a group and find one-to-one sessions tiring; others prefer depth with a few clients.
            Coaching in a way you enjoy tends to produce better results, better retention and a
            business you want to keep running. Use the numbers to inform the decision, not to make
            it for you.
          </p>
        </>
      ),
    },
    {
      heading: "A worked transition",
      body: (
        <>
          <p>
            A coach has 15 one-to-one clients at €400, working 15 hours a week, earning €6,000 a
            month at about €92 an hour. They launch a group of 20 at €150, taking 3 hours a week,
            which brings €3,000 a month at about €231 an hour. Their total becomes €9,000 a month
            for 18 hours, an average of about €115 an hour.
          </p>
          <p>
            They haven't replaced one-to-one coaching; they've added a higher-hourly offer alongside
            it. That's often the most practical path.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: comparing models before launching",
      body: (
        <>
          <p>
            Before launching a group, estimate realistic numbers: how many people could you fill it
            with in the first round, at what price, and how many hours it would really take. Enter
            them in the calculator next to your current one-to-one numbers. If the group's hourly
            rate is only slightly higher, the extra work of launching and marketing it may not be
            worth it yet. If it's much higher, plan the launch.
          </p>
        </>
      ),
    },
    {
      heading: "Marketing a group",
      body: (
        <>
          <p>
            Groups need more members to work, which means more marketing. A clear promise, a
            specific audience, a start date and a limited number of places help fill a group.
            Existing clients, your email list and social followers are the easiest places to start.
            A group that fills from warm audiences is far cheaper to run than one that relies on
            cold ads.
          </p>
          <p>
            Factor marketing time and cost into your decision. A group with a high hourly rate but
            heavy marketing needs may earn less overall than it seems.
          </p>
        </>
      ),
    },
    {
      heading: "Group coaching and results",
      body: (
        <>
          <p>
            Clients in groups often get good results, partly because of peer accountability and
            shared motivation. But clients with specific needs, such as injuries, medical conditions
            or very particular goals, may need more individual attention than a group provides.
            Screening members, or offering a one-to-one add-on, helps make sure everyone in the
            group is well served.
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
              <strong>Effective hourly rate</strong> = monthly revenue ÷ (weekly hours × 4.33).
            </li>
            <li>
              <strong>Groups</strong> usually earn more per hour once reasonably full.
            </li>
            <li>
              <strong>1:1</strong> usually earns more per client and builds deeper relationships.
            </li>
            <li>
              <strong>Count all the time,</strong> including preparation, community and check-ins.
            </li>
          </ul>
          <p>
            Compare both with realistic numbers, then choose the mix that fits your goals, your
            clients and the coaching you enjoy.
          </p>
        </>
      ),
    },
    {
      heading: "Pricing tiers that combine both",
      body: (
        <>
          <p>
            A common structure is a group programme as the entry tier, one-to-one coaching as the
            premium tier, and a hybrid in between: group calls plus a monthly individual check-in.
            Each tier is priced from its own time and value. Clients can start in the group and move
            up as their needs or budget change.
          </p>
          <p>
            Enter each tier in the calculator separately to make sure every option earns a
            reasonable hourly rate. A hybrid tier with too much individual time can end up earning
            less per hour than either pure model.
          </p>
        </>
      ),
    },
    {
      heading: "Testing demand before committing",
      body: (
        <>
          <p>
            Before building a full group programme, gauge demand. Ask your email list or followers
            whether they'd be interested, describe the idea and the price range, and invite them to
            register interest. If enough people say yes, run a short pilot. If interest is low,
            you've saved weeks of work, and you can adjust the offer or focus on one-to-one.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Enter your current one-to-one numbers, then sketch a realistic group: how many people
            you could invite from your current audience, a price you'd be comfortable with and the
            true weekly hours. If the group's hourly rate is clearly higher, ask a few clients or
            followers whether they'd join. Their answers will tell you more than any projection.
          </p>
        </>
      ),
    },
    {
      heading: "Currency and comparisons",
      body: (
        <>
          <p>
            Both models use the same currency, and the switch only changes the symbol. If you sell
            to clients in different countries, enter prices in the currency you actually charge, so
            the comparison reflects real income. Exchange rates and payment fees can affect what you
            receive, so check them separately if they matter to your decision.
          </p>
        </>
      ),
    },
    {
      heading: "When 1:1 is the better choice",
      body: (
        <>
          <p>
            One-to-one coaching often makes more sense for specialist work: rehabilitation,
            competition preparation, complex nutrition needs or clients with medical conditions.
            These clients need individual judgement that a group can't provide, and they usually
            value it enough to pay for it. If most of your enquiries come from people like this,
            focus on one-to-one and price it well.
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
    { label: "Client capacity calculator", href: "/tools/client-capacity-calculator" },
    {
      label: "Coaching package pricing calculator",
      href: "/tools/coaching-package-pricing-calculator",
    },
    { label: "Coaching revenue projector", href: "/tools/coaching-revenue-projector" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "Does group coaching earn more than 1:1?",
      a: "Often per hour, once the group is reasonably full. A small group or one that takes many hours may earn less per hour.",
    },
    {
      q: "How do I calculate effective hourly rate?",
      a: "Monthly revenue ÷ (weekly hours × 4.33).",
    },
    {
      q: "How many people should be in a coaching group?",
      a: "Many coaches find 10 to 30 works for groups with regular live contact. Larger groups suit content-led programmes.",
    },
    {
      q: "How should I price group coaching?",
      a: "Often a quarter to a half of your one-to-one price, depending on the support included and the group size you can fill.",
    },
    {
      q: "Can I offer both group and 1:1?",
      a: "Yes. Many coaches run both, which creates a path for clients and spreads risk.",
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
