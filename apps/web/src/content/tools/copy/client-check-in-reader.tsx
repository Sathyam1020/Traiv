import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Client check-in reader for coaches",
  description:
    "Turn a client's weekly check-in into one clear coaching decision, the single lever to change, what to leave alone and a ready-to-adapt reply.",
  eyebrow: "Free tool · Client tracking",
  h1: "Client check-in reader",
  intro: (
    <>
      <p>
        Weekly check-ins rarely point in one direction. The scale might be flat while adherence
        looks great and sleep looks poor. Add this week's numbers and the client's note, and you'll
        get a single recommended action, the one thing to change, what to keep the same and a reply
        you can edit and send. The note is also checked for anything a doctor or other professional
        should see. Everything stays in your browser.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How should I respond to a client's weekly check-in?",
    answer: (
      <>
        <p>
          Decide on one move, not several. Safety comes first: if the note mentions something
          medical, refer out and change nothing. Then recovery: poor sleep, low energy or high
          stress means easing training. Then consistency: under about 75% adherence, fix one habit
          before touching the numbers. Only when all three are solid does the weight trend decide
          whether to hold, push or adjust.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why one move matters",
      body: (
        <>
          <p>
            When a check-in arrives, it's tempting to respond to everything at once: lower calories
            a little, add a session, suggest earlier nights, swap two exercises. Clients who get
            four changes in one week rarely follow all of them, and when the next check-in arrives,
            nobody knows which change made the difference. One clear move is easier to follow,
            easier to read the following week and easier for the client to feel good about.
          </p>
          <p>
            The reader is built around that principle. It works through the signals in a fixed order
            of priority, stops at the first one that needs action, and tells you what to leave alone
            so the change stays readable.
          </p>
        </>
      ),
    },
    {
      heading: "The order the reader checks things",
      body: (
        <>
          <ol>
            <li>
              <strong>Safety:</strong> the client's note is scanned for words linked with medical
              symptoms, possible disordered eating, low mood, pregnancy or injury. Any of these
              means refer out and change nothing in the plan.
            </li>
            <li>
              <strong>Recovery:</strong> sleep under 6 hours, energy of 2 or lower, or stress of 4
              or higher means pulling back training while keeping nutrition steady.
            </li>
            <li>
              <strong>Consistency:</strong> nutrition adherence under 75%, or fewer than three
              quarters of planned sessions, means working on one habit rather than changing targets.
            </li>
            <li>
              <strong>Weeks on plan:</strong> if the plan is less than three weeks old and weight
              isn't on track, it's too early to change anything.
            </li>
            <li>
              <strong>Weight trend against the goal:</strong> only now does the scale decide between
              holding, pushing training or recalculating the plan.
            </li>
          </ol>
          <p>
            This order reflects a simple idea: you can't judge whether a plan works until it has
            been followed, by someone who is recovering, and who is safe to keep training.
          </p>
        </>
      ),
    },
    {
      heading: "What each verdict means",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Verdict</th>
                  <th scope="col">When</th>
                  <th scope="col">What to do</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Refer out</td>
                  <td>The note suggests a medical or mental health issue</td>
                  <td>Reply with care, encourage the right professional, change nothing</td>
                </tr>
                <tr>
                  <td>Pull back</td>
                  <td>Recovery signals are poor</td>
                  <td>Cut training volume by about a third; keep food steady</td>
                </tr>
                <tr>
                  <td>Fix one habit</td>
                  <td>Adherence or attendance is low</td>
                  <td>Agree one small habit; keep targets the same</td>
                </tr>
                <tr>
                  <td>Too early</td>
                  <td>Plan under three weeks old</td>
                  <td>Hold everything and collect more data</td>
                </tr>
                <tr>
                  <td>Recalculate</td>
                  <td>Good adherence, wrong trend for 3+ weeks</td>
                  <td>Adjust intake by about 100 to 200 kcal, or add steps</td>
                </tr>
                <tr>
                  <td>Push</td>
                  <td>Everything on track</td>
                  <td>Keep nutrition; progress training slightly</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Every verdict comes with a reply in three tones: warm, direct and no-nonsense. Choose
            the one that matches how you usually talk to that client, then adapt it.
          </p>
        </>
      ),
    },
    {
      heading: "Reading weight change for each goal",
      body: (
        <>
          <p>
            For fat loss, the reader treats a loss of roughly 0.1 to 1 kg a week as on track. Less
            than that, after three weeks of good adherence, suggests the plan needs a small
            adjustment; more than that suggests adding food to protect muscle and energy. For muscle
            gain, a gain of up to about 0.5 kg a week is on track. For maintenance, anything within
            about 0.4 kg either way is fine.
          </p>
          <p>
            These ranges are deliberately broad, because one week's weight change is mostly water,
            food in the gut and salt. If you have a run of weigh-ins, the weight trend reader on
            this site gives a better read of the underlying trend.
          </p>
        </>
      ),
    },
    {
      heading: "Why recovery comes before calories",
      body: (
        <>
          <p>
            A client sleeping five hours a night, stressed at work and low on energy won't respond
            well to a bigger deficit or harder training. Fatigue raises hunger, lowers training
            quality and makes adherence harder. Cutting calories further in that state often leads
            to a worse week, not a better one.
          </p>
          <p>
            Easing training for a few days while keeping food steady gives the body room to recover.
            Once sleep and stress improve, progress usually resumes, and the client trusts that you
            noticed how they were really doing.
          </p>
        </>
      ),
    },
    {
      heading: "Why consistency comes before changing the plan",
      body: (
        <>
          <p>
            If a client follows their nutrition 60% of the time, the plan hasn't really been tested.
            Lowering calories won't help, because the problem isn't the target; it's getting to the
            target. Changing the numbers also sends a confusing message: that the plan was wrong,
            when really it wasn't followed.
          </p>
          <p>
            Instead, ask what's getting in the way and agree one specific habit for the week.
            Planning tomorrow's meals each evening, keeping a protein option at work, or booking
            sessions into the calendar on Sunday are typical examples. Small, specific changes are
            far more likely to stick than general advice to be more consistent.
          </p>
        </>
      ),
    },
    {
      heading: "Scanning the note for red flags",
      body: (
        <>
          <p>
            Clients often mention important things in passing: feeling dizzy during a session,
            skipping meals all day, not having had a period for months, a pain that's getting worse,
            feeling low for weeks. The reader looks for words linked with these, and if it finds
            them, it recommends referring out before anything else.
          </p>
          <p>
            Word matching can't understand context, so it will sometimes flag something harmless or
            miss something phrased unusually. Always read the note yourself. The scan is a safety
            net, not a replacement for your judgement.
          </p>
        </>
      ),
    },
    {
      heading: "Tone and the reply",
      body: (
        <>
          <p>
            The same decision can be delivered in very different ways. Some clients respond best to
            warmth and encouragement; others prefer a straight answer with no padding. The reader
            drafts the reply in three tones so you can match the client. In every case, edit the
            message so it sounds like you and mentions something specific from their week.
          </p>
          <p>
            Specific details matter. 'Great week' is fine; 'Great week, and three sessions while
            travelling is no small thing' shows you actually read the check-in. That's a big part of
            why clients stay.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A client on a fat-loss plan for three weeks reports −0.4 kg this week, 85% adherence,
            three of four sessions, seven hours of sleep, energy 3 and stress 2. There's nothing in
            the note. Safety, recovery and consistency all pass. Weight is moving at a sensible
            pace. The verdict is push: keep nutrition the same and look for a small progression in
            training.
          </p>
          <p>
            If the same client had reported five hours of sleep and stress of 4, the verdict would
            be pull back, whatever the scale said. That's the point of the order: the scale is the
            last thing to decide, not the first.
          </p>
        </>
      ),
    },
    {
      heading: "Using the reader across your roster",
      body: (
        <>
          <p>
            The reader handles one check-in at a time, but its real value comes from using the same
            order for every client, every week. When each check-in is read the same way, decisions
            become consistent, faster and easier to explain. Clients notice that changes have
            reasons, and you spend less time agonising over borderline cases.
          </p>
          <p>
            Many coaches review check-ins in a set block each week. Working through the same
            questions in the same order, safety, recovery, consistency, then the trend, keeps each
            review to a few minutes without cutting corners.
          </p>
        </>
      ),
    },
    {
      heading: "When the reader and your judgement disagree",
      body: (
        <>
          <p>
            You know your client; the reader only knows the numbers you entered. If it says push but
            you know the client is about to start a stressful project at work, hold instead. If it
            says hold but the client has asked for a challenge and is recovering well, a small
            progression may be right. Use the verdict as a structured second opinion, not a rule.
          </p>
        </>
      ),
    },
    {
      heading: "Check-in questions that make reading easier",
      body: (
        <>
          <p>
            The reader works best when check-ins capture the same few numbers every week: weight
            change, adherence, sessions done and planned, sleep, energy, stress and a short note. If
            your check-in form asks for these consistently, each review becomes quick and
            comparable. The client check-in builder on this site can help design a form around them.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            Check-ins often contain personal and health information. The reader runs entirely in
            your browser, and nothing you type is stored or sent anywhere. In your own systems, keep
            client check-ins in a secure place, share them only with people who need to see them,
            and follow the data protection rules where you and your clients live.
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
    heading: "Review every check-in in one place",
    body: (
      <>
        <p>
          In Traiv, check-ins arrive with answers, ratings, weight, measurements and photos beside
          the client's plan, so each read takes minutes and the reply goes from the same screen.
        </p>
      </>
    ),
  },
  next: [
    { label: "Weight trend reader", href: "/tools/weight-trend-reader" },
    { label: "Client churn-risk reader", href: "/tools/client-churn-risk-reader" },
    { label: "Client check-in builder", href: "/tools/client-check-in-builder" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "What should I change after a check-in?",
      a: "Usually one thing. Check safety, then recovery, then consistency; only change calories or training when all three are solid and the trend has been off for a few weeks.",
    },
    {
      q: "How long should I wait before adjusting a plan?",
      a: "At least two to three weeks of good adherence. Early weeks are dominated by water and routine changes.",
    },
    {
      q: "What counts as a red flag in a check-in?",
      a: "Mentions of chest pain, fainting, disordered eating, missed periods, worsening pain, pregnancy or significant low mood. Refer out and change nothing until the client has seen the right professional.",
    },
    {
      q: "Does the reader store my client's data?",
      a: "No. Everything runs in your browser and nothing is saved or sent anywhere.",
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
