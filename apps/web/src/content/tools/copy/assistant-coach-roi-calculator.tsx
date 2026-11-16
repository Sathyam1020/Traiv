import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Assistant coach ROI calculator",
  description:
    "See the margin you keep and the hours you free by handing clients to an assistant coach, paid per client, by share or by salary.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Assistant coach ROI calculator",
  intro: (
    <>
      <p>
        Enter what clients pay, how many you'd hand over, how much time each takes and how you'd pay
        an assistant: a flat fee per client, a share of the fee or a monthly salary. See the margin
        you keep, hours freed, the salary break-even and the price rise that would earn the same
        without hiring.
      </p>
    </>
  ),
  shortAnswer: {
    question: "Is hiring an assistant coach worth it?",
    answer: (
      <>
        <p>
          Compare the margin you keep with the hours you free. Handing 15 clients at €200 to an
          assistant paid €60 per client keeps €2,100 a month, €140 per client, and frees 7.5 hours a
          week at half an hour per client. If a platform takes 5% of payments, the margin falls to
          €1,950.
        </p>
        <p>
          To earn the same €2,100 without hiring, you'd need to raise each of your 40 clients by
          about €52.50 a month.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why coaches hire assistants",
      body: (
        <>
          <p>
            At some point, many coaches hit a ceiling: they have more demand than time. An assistant
            coach lets them take on more clients, or free their own time for higher-value work such
            as sales, content, premium clients or simply rest. The assistant handles some clients
            day to day, with the head coach overseeing programmes and quality.
          </p>
          <p>
            The trade-off is margin. Each handed-off client brings in the same fee but costs you the
            assistant's pay. The question is whether the margin you keep, plus the time you free, is
            worth more than coaching those clients yourself.
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
                  <th scope="col">Measure</th>
                  <th scope="col">Formula</th>
                  <th scope="col">Default</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Revenue from handed-off clients</td>
                  <td>Price × clients handed off</td>
                  <td>€200 × 15 = €3,000</td>
                </tr>
                <tr>
                  <td>Assistant cost (flat)</td>
                  <td>Fee per client × clients</td>
                  <td>€60 × 15 = €900</td>
                </tr>
                <tr>
                  <td>Platform fee</td>
                  <td>Revenue × fee %</td>
                  <td>€0 with no revenue share</td>
                </tr>
                <tr>
                  <td>Margin you keep</td>
                  <td>Revenue − assistant − platform</td>
                  <td>€2,100</td>
                </tr>
                <tr>
                  <td>Hours freed</td>
                  <td>Hours per client × clients</td>
                  <td>0.5 × 15 = 7.5 a week</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The price-rise comparison spreads the same margin across all your current clients:
            €2,100 ÷ 40 = €52.50 per client per month, about 26% on a €200 price.
          </p>
        </>
      ),
    },
    {
      heading: "Three ways to pay an assistant",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Pay model</th>
                  <th scope="col">Default</th>
                  <th scope="col">Margin on 15 clients at €200</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Flat fee per client</td>
                  <td>€60 per client per month</td>
                  <td>€2,100</td>
                </tr>
                <tr>
                  <td>Share of the fee</td>
                  <td>40% of each client's fee</td>
                  <td>€1,800</td>
                </tr>
                <tr>
                  <td>Monthly salary</td>
                  <td>€3,000 a month</td>
                  <td>−€150 with a 5% platform fee</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Flat fees and shares scale with the number of clients handed off, so the risk is low. A
            salary is fixed, so it only pays off once enough clients are handed over. With a 5%
            platform fee, each client nets €190, and you'd need 16 clients to cover a €3,000 salary.
          </p>
        </>
      ),
    },
    {
      heading: "The salary break-even",
      body: (
        <>
          <p>
            For a salaried assistant, the salary break-even is the number of handed-off clients
            needed to cover the salary: salary ÷ net revenue per client. At €2,500 a month with no
            platform fee and €200 per client, that's 13 clients. Handing over 20 clients would leave
            €1,500 a month of margin and free 10 hours a week.
          </p>
          <p>
            Salaried assistants make most sense once you have a steady flow of clients to hand over,
            and when you want an assistant who is committed to your business full time.
          </p>
        </>
      ),
    },
    {
      heading: "Counting platform and payment fees",
      body: (
        <>
          <p>
            If your coaching platform or payment processor takes a share of client payments, it
            reduces margin on every handed-off client. A 5% fee on €3,000 is €150 a month. Choose
            'Platform takes a share' and enter the percentage to include it. Card processing fees
            typically apply on top of any platform share; include them in the same percentage if you
            want a fuller picture.
          </p>
        </>
      ),
    },
    {
      heading: "What the freed hours are worth",
      body: (
        <>
          <p>
            The calculator shows hours freed per week, but their value depends on what you do with
            them. If you use 7.5 hours to take on more premium clients, run sales calls or build a
            group programme, the return may be far higher than the margin you gave up. If the hours
            disappear into email and admin, the handoff mainly costs you money.
          </p>
          <p>
            Before hiring, decide what the freed time is for, and set a target, such as five new
            premium clients within three months.
          </p>
        </>
      ),
    },
    {
      heading: "Raising prices instead",
      body: (
        <>
          <p>
            The 'raise prices instead' figure shows the alternative: earning the same margin by
            charging all your current clients more, without hiring. In the default example, that's
            about €52.50 more per client per month, a 26% increase. For some coaches, a smaller
            price rise plus fewer clients is a better route to the same income with less management.
          </p>
          <p>
            The two aren't mutually exclusive. Many coaches raise prices and hire, so that the
            assistant's clients are more profitable from the start.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping quality high",
      body: (
        <>
          <ul>
            <li>
              <strong>Write down your method:</strong> how you programme, how you review check-ins,
              how you respond to common questions.
            </li>
            <li>
              <strong>Start small:</strong> hand over a few clients first, review the assistant's
              work closely, then expand.
            </li>
            <li>
              <strong>Review regularly:</strong> read a sample of check-in replies each week.
            </li>
            <li>
              <strong>Stay visible:</strong> a monthly call or message from you keeps handed-off
              clients connected to your brand.
            </li>
            <li>
              <strong>Track churn:</strong> compare retention for handed-off clients with your own.
            </li>
          </ul>
          <p>
            If handed-off clients leave faster, the margin you keep shrinks quickly. Quality is the
            foundation of the whole calculation.
          </p>
        </>
      ),
    },
    {
      heading: "Which clients to hand over",
      body: (
        <>
          <p>
            Hand over clients who are well established, need standard support and fit the
            assistant's strengths. Keep clients with complex needs, high-value packages or close
            relationships with you. Tell clients about the change honestly and explain the benefits:
            more frequent contact, faster replies, the same programme philosophy.
          </p>
        </>
      ),
    },
    {
      heading: "Hiring your first assistant",
      body: (
        <>
          <p>
            Many coaches hire their first assistant from among former clients, coaching students or
            newly qualified coaches who share their philosophy. Start with a trial period and a
            small number of clients. Agree on how the assistant will be paid, what they're
            responsible for, how often you'll review their work and how client communication will be
            handled.
          </p>
          <p>
            Put the agreement in writing, including what happens if either of you wants to end it.
            Check the employment or contractor rules where you work, as they differ by country.
          </p>
        </>
      ),
    },
    {
      heading: "Training an assistant",
      body: (
        <>
          <p>
            An assistant will only coach your way if you show them how. Record short videos or write
            simple guides on how you build programmes, review check-ins, adjust plans and handle
            common questions. Share examples of good feedback. Review their first few weeks closely
            and give clear, constructive notes.
          </p>
          <p>
            Time spent training an assistant early saves far more time later and protects your
            reputation with clients.
          </p>
        </>
      ),
    },
    {
      heading: "When hiring isn't the answer",
      body: (
        <>
          <p>
            If your margin after hiring is small, the freed hours have no clear use, or you're not
            sure you can maintain quality, hiring may not be the right step yet. Raising prices,
            improving systems or limiting client numbers might achieve your goals with less risk.
            The calculator's price-rise comparison helps weigh that option.
          </p>
        </>
      ),
    },
    {
      heading: "A worked comparison",
      body: (
        <>
          <p>
            A coach with 40 clients at €200 is near capacity. Option one: hand 15 clients to an
            assistant at €60 each, keeping €2,100 a month and freeing 7.5 hours. Option two: raise
            prices by €25 for all 40 clients, adding €1,000 a month, and accept that 2 or 3 might
            leave, which frees about 1 to 1.5 hours. Option three: do both.
          </p>
          <p>
            The best option depends on what the coach wants: more income, more time or both. Running
            the numbers side by side makes the choice clearer.
          </p>
        </>
      ),
    },
    {
      heading: "Telling clients about the change",
      body: (
        <>
          <p>
            Clients choose coaches partly for the person. When you hand a client to an assistant,
            explain why and what they gain: more frequent contact, faster replies, the same
            programming approach, and your continued oversight. Introduce the assistant personally,
            and stay in touch occasionally yourself. Clients who feel valued through the change are
            much more likely to stay.
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
              <strong>Margin</strong> = handed-off revenue − assistant pay − platform fees.
            </li>
            <li>
              <strong>Hours freed</strong> = hours per client × clients handed off.
            </li>
            <li>
              <strong>Salary break-even</strong> = salary ÷ net revenue per client.
            </li>
            <li>
              <strong>Alternative:</strong> the price rise across all clients that earns the same
              margin.
            </li>
          </ul>
          <p>
            Hire when the margin is healthy, you know what the freed time is for, and you can keep
            quality high.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring the handoff after three months",
      body: (
        <>
          <p>
            Three months after handing clients over, review the results. Compare churn for
            handed-off clients with your own clients. Check whether the freed hours went where you
            planned. Re-run the calculator with real margins and any changes in client numbers. If
            retention held and the freed time produced new revenue, consider handing over more. If
            not, fix quality or adjust the arrangement before expanding.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Enter your real price, client count and time per client. Try each pay model with a
            realistic amount and note the margin and hours freed. Then write down what you'd do with
            those hours. If the answer is clear and valuable, start a conversation with a potential
            assistant.
          </p>
        </>
      ),
    },
    {
      heading: "Contractor or employee",
      body: (
        <>
          <p>
            Many assistants start as contractors paid per client, which keeps costs flexible. As the
            arrangement grows, some coaches move to employment for stability and commitment. The
            rules differ by country, so check what applies before choosing.
          </p>
        </>
      ),
    },
    {
      heading: "Platform fees and margin",
      body: (
        <>
          <p>
            Even a small platform share adds up: at 5% on €3,000 of handed-off revenue, that's €150
            a month or €1,800 a year. Check what your current platform takes before deciding whether
            a handoff is worth it.
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
    { label: "Coaching profit calculator", href: "/tools/coaching-profit-calculator" },
    { label: "Price increase calculator", href: "/tools/price-increase-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "What's a fair way to pay an assistant coach?",
      a: "It varies. Common models are a flat fee per client, a share of each client's fee, or a salary. Use the calculator to see your margin for each.",
    },
    {
      q: "How many clients should I hand over?",
      a: "Start with a few, review quality, then expand. For a salaried assistant, at least enough to cover the salary break-even.",
    },
    {
      q: "What is the salary break-even?",
      a: "Salary ÷ net revenue per handed-off client: the number of clients needed to cover the salary.",
    },
    {
      q: "Should I raise prices instead of hiring?",
      a: "Sometimes. The calculator shows the price rise that would earn the same margin without hiring; many coaches do both.",
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
