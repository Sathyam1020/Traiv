import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Client churn-risk reader for coaches",
  description:
    "Read a coaching client's churn risk from check-ins, replies, adherence, results, mood and payment, then send an honest outreach message.",
  eyebrow: "Free tool · Client tracking",
  h1: "Client churn-risk reader",
  intro: (
    <>
      <p>
        Cancellations usually follow weeks of quieter signals. Fill in what you've noticed about one
        client, from late check-ins to a change in tone or a payment problem, and see a risk level,
        the next step and a message you can personalise. When their own words suggest they want to
        stop, the reader responds to that honestly rather than with a sales pitch. Everything stays
        in your browser.
      </p>
    </>
  ),
  shortAnswer: {
    question: "What are the early signs a client will cancel?",
    answer: (
      <>
        <p>
          Look for changes rather than single events: late or missed check-ins, slower replies,
          adherence slipping, results stalling, a flatter or frustrated tone, or a payment problem.
          One signal is worth noticing; three or more together usually mean the client is close to
          leaving. If they mention money, a break or stopping, they're telling you directly.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why churn is predictable",
      body: (
        <>
          <p>
            Most clients who cancel showed signs weeks before. They check in late, then not at all.
            Their replies get shorter. Their food logs thin out. Their tone shifts from excited to
            flat. Coaches who notice these changes early, and reach out personally, keep a
            meaningful share of clients who would otherwise have left.
          </p>
          <p>
            The difficulty is noticing. With twenty or forty clients, it's easy to miss that one has
            gone quiet for ten days. A simple, regular check of each client's signals makes the
            pattern visible before it turns into a cancellation.
          </p>
        </>
      ),
    },
    {
      heading: "The signals and how they're weighted",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Signal</th>
                  <th scope="col">Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A week-late check-in</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>Two or more missed check-ins</td>
                  <td>3</td>
                </tr>
                <tr>
                  <td>Slower replies</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>Gone quiet</td>
                  <td>3</td>
                </tr>
                <tr>
                  <td>Adherence slipping / dropped off</td>
                  <td>1 / 2</td>
                </tr>
                <tr>
                  <td>Results stalled / going backwards</td>
                  <td>1 / 2</td>
                </tr>
                <tr>
                  <td>Last contact flat / frustrated</td>
                  <td>1 / 2</td>
                </tr>
                <tr>
                  <td>Renewal soon</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>Missed or failed payment</td>
                  <td>3</td>
                </tr>
                <tr>
                  <td>In the first eight weeks</td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The total sets the level: under 3 points is low risk, 3 to 5 is worth a personal
            check-in, and 6 or more is high risk. Silence and missed payments carry the most weight,
            because they are the strongest signs that a client has already started to leave.
          </p>
        </>
      ),
    },
    {
      heading: "When they tell you they want out",
      body: (
        <>
          <p>
            Sometimes the client says it directly: money is tight, they're thinking of a break, they
            want to finish up. The reader looks for these phrases and, when it finds one, treats the
            situation differently. The right response isn't a retention script. It's an honest
            acknowledgement, a genuine option if one would help, such as a pause or a lighter plan,
            and a graceful exit if that's what they want.
          </p>
          <p>
            Making it easy to leave sounds counterintuitive, but it protects your reputation and
            often brings clients back later. People remember the coach who said, 'That's completely
            fine, here's a plan to keep going on your own.'
          </p>
        </>
      ),
    },
    {
      heading: "What to do at each level",
      body: (
        <>
          <ul>
            <li>
              <strong>Low risk:</strong> keep the rhythm going. Notice their consistency and wins
              out loud, and ask about their next goal.
            </li>
            <li>
              <strong>Worth a check-in:</strong> send a personal message this week. Ask an open
              question about how the plan fits their life, and listen before suggesting changes.
            </li>
            <li>
              <strong>High risk:</strong> contact them today. Keep it short, invite an honest answer
              and offer a quick call to reset the plan.
            </li>
            <li>
              <strong>They want out:</strong> acknowledge it, offer an honest option if it helps,
              and make leaving easy.
            </li>
          </ul>
          <p>
            In every case, the message should be personal. A generic 'just checking in' is easy to
            ignore; a message that mentions their goal or a recent session shows you're paying
            attention.
          </p>
        </>
      ),
    },
    {
      heading: "The first eight weeks",
      body: (
        <>
          <p>
            New clients are the most likely to leave. They're still forming habits, haven't seen big
            results yet and may still be deciding whether coaching is worth it. The reader adds a
            point for clients in their first eight weeks, so that a small slip registers sooner.
          </p>
          <p>
            A strong onboarding, frequent contact in the first month and a visible early win, such
            as a first strength increase or a measurable change, make the biggest difference to
            whether a new client stays.
          </p>
        </>
      ),
    },
    {
      heading: "Payment problems",
      body: (
        <>
          <p>
            A failed payment can be a simple card issue or a sign that the client has decided to
            stop without saying so. Either way, it deserves a prompt, friendly message. Assume the
            best: 'Your payment didn't go through, probably a card thing. Here's the link to update
            it.' If there's no reply, follow up with a personal check-in about how they're getting
            on.
          </p>
        </>
      ),
    },
    {
      heading: "Why mood matters",
      body: (
        <>
          <p>
            Frustration is often the step before leaving. A client who feels stuck, unheard or that
            the plan doesn't fit will usually show it in tone before they cancel. Respond to
            frustration directly: acknowledge it, ask what's causing it and offer one concrete
            change. Many clients stay after a frustrated message if they feel their coach actually
            responded to it.
          </p>
        </>
      ),
    },
    {
      heading: "Building a weekly churn check",
      body: (
        <>
          <p>
            Once a week, go through your client list and note each client's signals. It takes a few
            minutes per client and quickly becomes a habit. Anyone at watch or high risk gets a
            personal message that day. Over a few months, you'll see which signals predict
            cancellations in your business and which clients respond best to early contact.
          </p>
          <p>
            Pair this with the client churn rate calculator to track whether your monthly churn
            falls as early outreach becomes routine.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A client has been with you for 12 weeks. Their last check-in was a week late, replies
            have slowed and adherence is slipping, but results are on track and their last message
            was positive. That's 2 + 1 + 1 = 4 points: worth a personal check-in. A short, warm
            message asking how the plan fits their life at the moment, sent today, is the right
            move.
          </p>
          <p>
            If they'd also missed two check-ins and gone quiet, the score would be well above 6:
            high risk, and worth a call.
          </p>
        </>
      ),
    },
    {
      heading: "Retention conversations that work",
      body: (
        <>
          <p>
            When you reach out to an at-risk client, the aim isn't to sell them on staying. It's to
            find out what's changed and whether coaching still fits. Ask an open question, listen
            and respond to what they actually say. Often the answer is practical: a schedule change,
            a plan that's too demanding, a plateau that needs explaining. Fixing that one thing
            keeps many clients.
          </p>
          <p>
            If the coaching genuinely isn't right for them anymore, say so kindly. Clients who leave
            on good terms often return, refer friends and speak well of you.
          </p>
        </>
      ),
    },
    {
      heading: "Offering a pause",
      body: (
        <>
          <p>
            A pause can be a good option for clients facing a temporary problem, such as travel, a
            busy period at work or a short-term money squeeze. Offer it with a clear end date and a
            plan to keep them moving in the meantime, such as a simple maintenance routine. Clients
            who pause with a plan are much more likely to return than those who simply cancel.
          </p>
          <p>
            Don't offer a pause to every client who goes quiet. For some, the honest conversation is
            more useful than a delay.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking what works",
      body: (
        <>
          <p>
            Keep a short note each time you reach out to an at-risk client: the signals, the
            message, and whether they stayed. After a few months, patterns appear. You may find that
            a quick voice note works better than text for some clients, or that a reset call keeps
            more clients than a message. Use what you learn to refine your outreach.
          </p>
        </>
      ),
    },
    {
      heading: "Churn risk and capacity",
      body: (
        <>
          <p>
            When churn risk rises across several clients at once, look at your own workload before
            blaming the clients. A coach stretched over too many clients replies more slowly, gives
            shorter feedback and notices less, and clients feel it. If many clients are at watch
            level at the same time, the client capacity calculator can help check whether it's time
            to raise prices, pause new sign-ups or bring in help.
          </p>
        </>
      ),
    },
    {
      heading: "Signals in group coaching",
      body: (
        <>
          <p>
            In groups, the same signals apply but are easier to miss: a member who stops posting,
            skips live calls or stops logging. Run the reader for group members who have gone quiet,
            and send a personal message rather than a group reminder. A direct, individual note
            often brings a drifting member back far more effectively than any group announcement.
          </p>
        </>
      ),
    },
    {
      heading: "What not to do",
      body: (
        <>
          <ul>
            <li>
              <strong>Don't guilt-trip.</strong> Messages like 'I haven't heard from you' put
              clients on the defensive.
            </li>
            <li>
              <strong>Don't send a generic reminder</strong> to a client who has gone quiet; it's
              easy to ignore.
            </li>
            <li>
              <strong>Don't argue</strong> with a client who wants to leave or pile on discounts to
              keep them.
            </li>
            <li>
              <strong>Don't wait</strong> for the next scheduled check-in if signals are already
              high.
            </li>
          </ul>
          <p>
            A short, kind, specific message sent early does more than any retention offer sent late.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            The reader runs in your browser and stores nothing. The note you paste stays on your
            device. When you keep notes about clients' circumstances in your own systems, store them
            securely and only as long as you need them.
          </p>
        </>
      ),
    },
    {
      heading: "The cost of a lost client",
      body: (
        <>
          <p>
            Every client who leaves takes their remaining lifetime value with them. If an average
            client is worth €1,800 over their time with you and early outreach keeps even one extra
            client a month, that's over €20,000 a year. The client LTV calculator shows what each
            client is worth in your business.
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
    heading: "See who's going quiet before they cancel",
    body: (
      <>
        <p>
          In Traiv, your client roster shows new and missing check-ins at a glance, and chat sits
          beside each client's plan, so a quiet client is easy to spot and easy to reach.
        </p>
      </>
    ),
  },
  next: [
    { label: "Client churn rate calculator", href: "/tools/client-churn-rate-calculator" },
    { label: "Client check-in reader", href: "/tools/client-check-in-reader" },
    { label: "Difficult client responder", href: "/tools/difficult-client-responder" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "What are the signs a client is about to cancel?",
      a: "Late or missed check-ins, slower replies, slipping adherence, stalled results, a flat or frustrated tone and payment problems, especially several together.",
    },
    {
      q: "How should I reach out to a quiet client?",
      a: "Personally and briefly. Mention something specific, ask an open question and offer a short call. Avoid generic check-in messages.",
    },
    {
      q: "Should I try to stop a client who wants to leave?",
      a: "Acknowledge it honestly and offer a genuine option if one would help, such as a pause or a lighter plan. If they still want to go, make it easy.",
    },
    {
      q: "Does the reader store client information?",
      a: "No. It runs in your browser and nothing is saved.",
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
