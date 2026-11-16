import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Client check-in builder for coaches",
  description:
    "Build a structured weekly check-in form for coaching clients from their goal, the metrics you track and the depth you want, ready to copy.",
  eyebrow: "Free tool · Client tracking",
  h1: "Client check-in builder",
  intro: (
    <>
      <p>
        Choose your client's goal, the things you track and how detailed you want it, and get a
        weekly check-in you can copy and send. Numbers come first, then a few short reflection
        questions, laid out so you can review each one in minutes. Your choices stay in your
        browser.
      </p>
    </>
  ),
  shortAnswer: {
    question: "What should a weekly coaching check-in include?",
    answer: (
      <>
        <p>
          A few numbers that match the client's goal and a few short questions. For fat loss, that's
          usually average weight, waist, days on plan, sessions done, sleep and steps, followed by
          what went well, what was hard and what they'd like help with. Keep it short enough to
          complete in five minutes and consistent enough to compare week to week.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why structure matters",
      body: (
        <>
          <p>
            Freeform check-ins, where clients write whatever comes to mind, are friendly but slow to
            read and hard to compare. One week a client mentions their weight, the next they don't.
            One week they describe every meal, the next they write a single line. A structured
            check-in asks for the same numbers in the same order each week, so you can scan it in a
            minute, spot changes and compare it with last week at a glance.
          </p>
          <p>
            Structure helps clients too. A clear form is quicker to fill in, and the same questions
            every week build a habit of reflecting on what worked.
          </p>
        </>
      ),
    },
    {
      heading: "Numbers first, then reflection",
      body: (
        <>
          <p>
            The builder puts the numbers at the top: weight, adherence, training, sleep, steps and
            whatever else you track. These give you the facts. Then it adds a few short reflection
            questions, which give you the context behind the facts: why a week was hard, what
            they're proud of, what they want help with. Together they make a good coaching decision
            much easier.
          </p>
          <p>
            Keeping reflection questions short and specific gets better answers. 'How was your
            week?' often gets 'fine'. 'Where did the plan feel hardest, and what got in the way?'
            gets something you can act on.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing what to track",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Goal</th>
                  <th scope="col">Default metrics</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fat loss</td>
                  <td>Weight and measurements, nutrition, training, sleep, steps</td>
                </tr>
                <tr>
                  <td>Muscle gain</td>
                  <td>Weight and measurements, nutrition, training, sleep</td>
                </tr>
                <tr>
                  <td>Recomposition</td>
                  <td>Weight and measurements, nutrition, training, progress photos</td>
                </tr>
                <tr>
                  <td>Performance</td>
                  <td>Training, sleep, energy and mood, nutrition</td>
                </tr>
                <tr>
                  <td>Health and habits</td>
                  <td>Habits, steps, sleep, energy and mood</td>
                </tr>
                <tr>
                  <td>Wellness</td>
                  <td>Energy and mood, sleep, habits</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Change the defaults freely. Track only what you'll actually use: every extra question
            makes the check-in longer for the client and longer for you to review.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing depth",
      body: (
        <>
          <ul>
            <li>
              <strong>Quick scan:</strong> one line per metric and one question. Best for
              established clients doing well, or very busy ones.
            </li>
            <li>
              <strong>Standard:</strong> a second detail for each metric and three questions. Suits
              most clients most of the time.
            </li>
            <li>
              <strong>Deep:</strong> extra details and four questions. Useful at the start of
              coaching, at a review point or when something isn't working.
            </li>
          </ul>
          <p>
            You can change depth over time. Many coaches start new clients on a standard or deep
            check-in for the first month, then move to quick scans once things are steady.
          </p>
        </>
      ),
    },
    {
      heading: "Weight and measurements",
      body: (
        <>
          <p>
            For weight, ask for an average of morning weigh-ins across the week rather than a single
            reading. Averages smooth out the daily swings from water and food. For measurements, the
            waist at the navel is the most useful single number for fat loss; hips add context. Ask
            clients to measure the same way each time, ideally on the same day.
          </p>
        </>
      ),
    },
    {
      heading: "Nutrition and training",
      body: (
        <>
          <p>
            Days on plan out of seven is a simple, honest measure of nutrition adherence that
            clients can answer quickly. Average protein adds detail where it matters. For training,
            sessions done versus planned shows consistency, and a best lift or session gives you,
            and them, something positive to notice. A question about pain or niggles catches
            problems early.
          </p>
        </>
      ),
    },
    {
      heading: "Sleep, steps, energy and mood",
      body: (
        <>
          <p>
            Sleep and stress often explain why a week went well or badly. A quick rating of sleep
            quality, energy and stress, each on a 1 to 5 scale, takes seconds to answer and gives
            you an early warning when recovery is slipping. Steps show how active they are outside
            training, which matters a great deal for fat loss.
          </p>
        </>
      ),
    },
    {
      heading: "Progress photos and cycle tracking",
      body: (
        <>
          <p>
            Photos show changes the scale and tape miss. Ask for the same angles, light, time and
            clothing each time, and only if the client is comfortable. For clients who menstruate,
            noting the cycle phase helps explain water retention, appetite and energy changes, and
            stops a normal pre-period weight rise from being read as a stall.
          </p>
        </>
      ),
    },
    {
      heading: "Using the check-in",
      body: (
        <>
          <p>
            Send the check-in on the same day each week and review it within a set time, such as 24
            or 48 hours. Reply with one clear piece of feedback and one change or focus for the
            coming week. The client check-in reader on this site can help turn the answers into a
            single decision.
          </p>
          <p>
            Consistency is what makes check-ins powerful. A simple check-in done every week, with a
            thoughtful reply, keeps clients far longer than an elaborate one done occasionally.
          </p>
        </>
      ),
    },
    {
      heading: "A sample standard check-in for fat loss",
      body: (
        <>
          <p>
            With the default fat-loss settings and standard depth, the check-in asks for average
            morning weight and waist, days on plan and average protein, sessions done and planned
            with the best session, average sleep and sleep quality, and average daily steps. It then
            asks what went well with food, where the plan felt hardest and what the client would
            like help with next week, followed by an open 'anything else' line.
          </p>
          <p>
            That's about ten short answers, which most clients complete in four or five minutes and
            you can review in two or three.
          </p>
        </>
      ),
    },
    {
      heading: "Getting honest answers",
      body: (
        <>
          <p>
            Clients sometimes shade their answers to look good, especially early on. Make it safe to
            be honest: thank them for difficult weeks, respond to low adherence with curiosity
            rather than disappointment, and never criticise a number. When clients learn that an
            honest '3 out of 7' gets help rather than judgement, check-ins become far more useful.
          </p>
        </>
      ),
    },
    {
      heading: "When clients stop sending check-ins",
      body: (
        <>
          <p>
            A missed check-in is one of the earliest signs a client may leave. Send a short,
            friendly reminder the day after, and a personal message if two are missed in a row. Make
            the form easy to complete on a phone, and consider a quick-scan version for clients who
            struggle with longer forms. The churn-risk reader on this site can help decide how to
            reach out.
          </p>
        </>
      ),
    },
    {
      heading: "Adapting check-ins over time",
      body: (
        <>
          <p>
            Review the check-in every couple of months. Remove questions that never change your
            decisions, add ones that would, and adjust depth as clients settle. A check-in that
            evolves with the client stays relevant and quick to complete.
          </p>
        </>
      ),
    },
    {
      heading: "Check-ins for in-person clients",
      body: (
        <>
          <p>
            Clients you see in person still benefit from a short weekly check-in. Sessions show you
            how they train; a check-in shows you the rest of their week: food, sleep, stress, steps
            and how they felt between sessions. A quick-scan version sent the day before a session
            gives you what you need to adjust that day's plan.
          </p>
        </>
      ),
    },
    {
      heading: "Check-ins and data protection",
      body: (
        <>
          <p>
            Check-ins can include health information, weights, measurements and photos. Store them
            securely, share them only with people who need them, and tell clients how you keep their
            information. Follow the data protection rules where you and your clients live, and
            delete what you no longer need when coaching ends.
          </p>
        </>
      ),
    },
    {
      heading: "Building the habit",
      body: (
        <>
          <p>
            Pick a fixed check-in day and time, and remind clients of it in their first week. Many
            coaches choose the start or end of the weekend, when clients have time to reflect.
            Respond reliably within your stated window. When clients see that every check-in gets a
            thoughtful reply, they keep sending them, and that habit alone protects retention.
          </p>
        </>
      ),
    },
    {
      heading: "Check-in mistakes to avoid",
      body: (
        <>
          <ul>
            <li>
              <strong>Too many questions:</strong> long forms get skipped or rushed.
            </li>
            <li>
              <strong>Questions you never act on:</strong> if an answer never changes your reply,
              drop the question.
            </li>
            <li>
              <strong>Changing the form every week:</strong> consistency is what makes comparisons
              possible.
            </li>
            <li>
              <strong>Slow replies:</strong> a check-in that sits unread for days tells the client
              it doesn't matter.
            </li>
          </ul>
          <p>A short, steady check-in with a prompt, specific reply beats any elaborate form.</p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Build a check-in for your most common client goal, copy it and send it to your clients
            on your next check-in day. Review the answers with the same order every time, and adjust
            the form after a month.
          </p>
        </>
      ),
    },
    {
      heading: "Reviewing check-ins quickly",
      body: (
        <>
          <p>
            Read the numbers first and compare them with last week. Then read the answers. Decide
            one thing to praise and one thing to change or focus on. Write a short reply that does
            both. With a consistent form, most check-ins take two to four minutes to review and
            reply to.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>The builder runs entirely in your browser. Nothing you pick is stored or sent.</p>
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
    heading: "Run this check-in every week",
    body: (
      <>
        <p>
          In Traiv, clients send their check-in in the app with answers, ratings, weight,
          measurements and photos, and you review it beside their plan and reply from the same
          place.
        </p>
      </>
    ),
  },
  next: [
    { label: "Client check-in reader", href: "/tools/client-check-in-reader" },
    { label: "Client onboarding builder", href: "/tools/client-onboarding-builder" },
    { label: "Weight trend reader", href: "/tools/weight-trend-reader" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How long should a check-in be?",
      a: "Short enough to complete in about five minutes. Most clients do best with five to eight numbers and two to four questions.",
    },
    {
      q: "How often should clients check in?",
      a: "Weekly works for most online coaching. Some coaches use fortnightly check-ins for established clients.",
    },
    {
      q: "Should I ask for progress photos?",
      a: "If the client is comfortable. Use the same angles, light and clothing each time, and keep them private.",
    },
    {
      q: "Can I change the questions?",
      a: "Yes. Copy the check-in and edit it to match your coaching style and each client's needs.",
    },
    { q: "Is anything stored?", a: "No. The builder runs in your browser and nothing is saved." },
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
