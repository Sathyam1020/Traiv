import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Client onboarding builder for coaches",
  description:
    "Build a step-by-step onboarding sequence for new coaching clients, from welcome and intake to the first programme and check-in.",
  eyebrow: "Free tool · Client workflow",
  h1: "Client onboarding builder",
  intro: (
    <>
      <p>
        Choose the type of coaching, the steps you run and how long onboarding should take, and get
        a day-by-day sequence you can copy into your checklist. It covers everything from the
        welcome message and intake to the first programme and first check-in. The first weeks decide
        whether a new client stays; this makes sure nothing is forgotten. Your choices stay in your
        browser.
      </p>
    </>
  ),
  shortAnswer: {
    question: "What should a coaching onboarding process include?",
    answer: (
      <>
        <p>
          A welcome message, payment and terms, an intake form and health questionnaire, baseline
          measurements, app setup, communication norms, reviewing the intake, goal-setting, the
          first programme, an onboarding call and the first check-in. Spread them across the first
          few days or two weeks so the client feels looked after without being overwhelmed.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why onboarding matters",
      body: (
        <>
          <p>
            A new client arrives motivated and a little uncertain. What happens in the next few days
            shapes how they feel about the whole coaching relationship. A clear, warm, organised
            start builds confidence; a slow or confusing one plants doubt. Many clients who leave in
            the first two months do so because onboarding never quite got them going.
          </p>
          <p>
            A written sequence makes onboarding consistent. Your tenth client gets the same careful
            start as your first, even in a busy week.
          </p>
        </>
      ),
    },
    {
      heading: "The eleven steps",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Step</th>
                  <th scope="col">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Welcome message</td>
                  <td>Set a warm tone and explain what happens next</td>
                </tr>
                <tr>
                  <td>Payment and terms</td>
                  <td>Confirm payment and agree how coaching works</td>
                </tr>
                <tr>
                  <td>Intake and PAR-Q</td>
                  <td>Understand goals, history and health</td>
                </tr>
                <tr>
                  <td>Baseline and photos</td>
                  <td>Record a starting point to compare against</td>
                </tr>
                <tr>
                  <td>App setup</td>
                  <td>Make sure they can find their plan and message you</td>
                </tr>
                <tr>
                  <td>Communication norms</td>
                  <td>Agree reply times, check-in day and urgent contact</td>
                </tr>
                <tr>
                  <td>Review intake</td>
                  <td>Read the intake properly and note follow-ups</td>
                </tr>
                <tr>
                  <td>Goal-setting</td>
                  <td>Agree an outcome goal and behaviour goals</td>
                </tr>
                <tr>
                  <td>Deliver first programme</td>
                  <td>Give them the first plan, with a lighter first week</td>
                </tr>
                <tr>
                  <td>Onboarding call</td>
                  <td>Walk through the plan and answer questions</td>
                </tr>
                <tr>
                  <td>First check-in</td>
                  <td>Review, reply personally and make one adjustment</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Untick any step you don't use, and the sequence adjusts.</p>
        </>
      ),
    },
    {
      heading: "Choosing a timeline",
      body: (
        <>
          <ul>
            <li>
              <strong>First 3 days:</strong> a fast start for clients who are ready to go and want
              momentum.
            </li>
            <li>
              <strong>First week:</strong> a balanced pace for most clients, with time to review the
              intake properly.
            </li>
            <li>
              <strong>First two weeks:</strong> a gentler pace with a second check-in on day 14, so
              the first fortnight ends on a visible win.
            </li>
          </ul>
          <p>Whatever the timeline, keep the client informed: tell them what's next and when.</p>
        </>
      ),
    },
    {
      heading: "The welcome message",
      body: (
        <>
          <p>
            The welcome message should arrive within hours of sign-up. Thank them, mention their
            goal, explain what happens in the next few days and when they'll hear from you, and list
            anything you need, such as the intake form. A personal touch, like their name and goal,
            makes it feel like coaching rather than an automated email.
          </p>
        </>
      ),
    },
    {
      heading: "Health screening",
      body: (
        <>
          <p>
            A pre-exercise health questionnaire, such as the PAR-Q, catches conditions that need
            medical clearance before training. Ask about heart conditions, chest pain, dizziness,
            joint problems, medication, pregnancy and recent surgery. If anything is flagged, ask
            the client to get clearance from their doctor before starting. The scope-of-practice
            check on this site can help decide what to do.
          </p>
        </>
      ),
    },
    {
      heading: "Goal-setting that works",
      body: (
        <>
          <p>
            Agree one outcome goal, such as losing 5 kg or squatting body weight, and two or three
            behaviour goals the client controls, such as three sessions a week and protein at every
            meal. Outcome goals give direction; behaviour goals give the client something to succeed
            at every week. Write them down and set a date to review them.
          </p>
        </>
      ),
    },
    {
      heading: "The first programme",
      body: (
        <>
          <p>
            Make the first week lighter than you think it needs to be. New clients are learning
            exercises, finding their routine and getting used to the app. A first week that feels
            achievable builds confidence; one that leaves them exhausted or confused builds doubt.
            Include a short note explaining how to use the plan and what to focus on first.
          </p>
        </>
      ),
    },
    {
      heading: "The onboarding call",
      body: (
        <>
          <p>
            A short call of 20 to 30 minutes makes a big difference. Walk through the plan, show
            them where to find everything, answer questions and confirm the first check-in date.
            Clients who have spoken to their coach feel a much stronger connection than those who
            only receive documents.
          </p>
        </>
      ),
    },
    {
      heading: "The first check-in",
      body: (
        <>
          <p>
            The first check-in is a chance to show that the plan responds to them. Reply personally,
            mention something specific they did well and make one small adjustment based on what
            they told you. That single moment, when a client sees their feedback change the plan,
            often decides whether they trust the coaching.
          </p>
        </>
      ),
    },
    {
      heading: "A sample first week",
      body: (
        <>
          <p>
            With all steps selected and a one-week timeline, day 1 covers the welcome message,
            payment and terms, and the intake and health questionnaire. Days 2 and 3 cover reviewing
            the intake, setting up the app, agreeing communication norms and collecting baseline
            measurements. Days 4 and 5 cover goal-setting, the onboarding call and delivering the
            first programme. Day 7 is the first check-in.
          </p>
          <p>
            Each step comes with a short description of what to do, so you or an assistant can
            follow it without remembering every detail.
          </p>
        </>
      ),
    },
    {
      heading: "Onboarding for different coaching types",
      body: (
        <>
          <p>
            The sequence adapts slightly to the coaching type. Nutrition coaching collects a typical
            day of eating as part of the baseline and delivers a nutrition plan first.
            Training-focused coaching collects measurements and, if the client is comfortable,
            photos, and delivers a programme with a lighter first week. The welcome message mentions
            the client's goal by name in every case.
          </p>
        </>
      ),
    },
    {
      heading: "Automating parts of onboarding",
      body: (
        <>
          <p>
            Some steps, such as the welcome message, terms and intake form, can be sent
            automatically when a client signs up. That saves time and makes the start instant. Keep
            the personal steps personal: reviewing the intake, the onboarding call and the first
            check-in reply are where clients feel coached rather than processed.
          </p>
        </>
      ),
    },
    {
      heading: "Common onboarding mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Too much at once:</strong> sending every form, document and video on day one
              overwhelms new clients.
            </li>
            <li>
              <strong>Slow first contact:</strong> waiting days to send the welcome message lets
              doubt creep in.
            </li>
            <li>
              <strong>A hard first week:</strong> an ambitious first programme leaves clients sore
              and discouraged.
            </li>
            <li>
              <strong>No clear first check-in date:</strong> clients don't know when they'll next
              hear from you.
            </li>
            <li>
              <strong>Skipping health screening:</strong> it protects both the client and you.
            </li>
          </ul>
          <p>A written sequence avoids all five.</p>
        </>
      ),
    },
    {
      heading: "Measuring onboarding",
      body: (
        <>
          <p>
            Track how many clients complete each step and how many are still with you after 90 days.
            If many clients drop off at the same point, such as before the first check-in, that step
            needs attention. Improvements to onboarding often show up quickly in retention.
          </p>
        </>
      ),
    },
    {
      heading: "The first 90 days",
      body: (
        <>
          <p>
            Onboarding doesn't end after the first week. The first three months are when clients are
            most likely to leave, so keep contact a little higher than usual: a mid-month progress
            note, a review at four weeks and a goal check at twelve. Clients who reach month four
            are far more likely to stay for the long term.
          </p>
        </>
      ),
    },
    {
      heading: "Onboarding several clients at once",
      body: (
        <>
          <p>
            If several clients start in the same week, onboarding time can spike. Staggering start
            dates, for example starting new clients on fixed days each fortnight, spreads the work.
            A written sequence also makes it easier to hand some steps, such as app setup or
            document checks, to an assistant while you keep the personal steps.
          </p>
        </>
      ),
    },
    {
      heading: "Starting with a checklist",
      body: (
        <>
          <p>
            Copy the sequence into whatever you use to track tasks, and tick off each step for each
            new client. A simple checklist removes the mental load of remembering what's next and
            makes it obvious when something has been missed.
          </p>
        </>
      ),
    },
    {
      heading: "Onboarding message tone",
      body: (
        <>
          <p>
            Keep onboarding messages warm and practical. New clients are often nervous about
            starting, worried about doing it wrong or about being judged. Simple reassurance helps:
            tell them the first week is deliberately easy, that questions are welcome and that
            there's no such thing as a bad check-in. A calm, friendly tone does more for retention
            than any document.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Build your sequence, copy it into your task list and use it for your next new client.
            Afterwards, note anything that was missing or took longer than expected, and adjust the
            sequence.
          </p>
        </>
      ),
    },
    {
      heading: "Onboarding and your brand",
      body: (
        <>
          <p>
            Onboarding is the first real experience of your coaching. Consistent messages, a clear
            app and a personal call show clients that your business is organised and that they're in
            good hands. That impression shapes how they describe you to friends, which is often
            where your next client comes from.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            The builder runs in your browser. Your choices aren't stored or sent anywhere, so you
            can experiment freely with different sequences.
          </p>
        </>
      ),
    },
    {
      heading: "Asking for feedback",
      body: (
        <>
          <p>
            At the end of onboarding, ask one question: what could have made the start easier?
            Clients' answers are the quickest way to improve the sequence for the next person.
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
    heading: "Give new clients one place to start",
    body: (
      <>
        <p>
          In Traiv, new clients join with a code, find their plan, check-ins and chat in one app
          under your name, and you can see from your roster who has started.
        </p>
      </>
    ),
  },
  next: [
    { label: "Client check-in builder", href: "/tools/client-check-in-builder" },
    { label: "Coaching offer builder", href: "/tools/coaching-offer-builder" },
    { label: "Coaching scope-of-practice check", href: "/tools/scope-of-practice-check" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How long should client onboarding take?",
      a: "Usually three days to two weeks, depending on the client and how much setup is needed.",
    },
    {
      q: "What is a PAR-Q?",
      a: "A Physical Activity Readiness Questionnaire: a short health screening to check whether someone should get medical clearance before exercising.",
    },
    {
      q: "Should I include an onboarding call?",
      a: "Yes, if you can. A short call builds connection and prevents confusion.",
    },
    { q: "Can I edit the sequence?", a: "Yes. Copy it and adapt it to your coaching and tools." },
    { q: "Is anything saved?", a: "No. The builder runs in your browser." },
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
