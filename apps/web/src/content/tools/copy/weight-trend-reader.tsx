import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Weight trend reader for coaches",
  description:
    "Paste a client's weigh-ins to see the real weekly trend against normal bounce: on track, noise, a true stall, too fast, or a recomp the scale is hiding.",
  eyebrow: "Free tool · Client tracking",
  h1: "Weight trend reader",
  intro: (
    <>
      <p>
        When a client says the scale has stopped moving, a trend line settles it. Paste their recent
        weigh-ins to compare the real weekly direction with normal fluctuation, and see whether
        they're on track, still within the noise, genuinely stuck, losing too quickly, holding water
        or changing shape while the scale stays flat. You'll get one suggested adjustment, or a
        reason to stay the course, expressed as a likely range. Everything stays in your browser.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I know if a client has really plateaued?",
    answer: (
      <>
        <p>
          Fit a trend line through several weigh-ins and compare its slope with the normal bounce.
          Weekly weigh-ins of 82.1, 81.4, 81.6, 81.5, 81.3 and 81.4 kg show a trend of about −0.1 kg
          a week over five weeks: slower than a cut needs, so it reads as a genuine stall if
          adherence is good and the waist hasn't moved.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why single weigh-ins mislead",
      body: (
        <>
          <p>
            Body weight swings by one to two kilograms from day to day, and by a kilogram or more
            from week to week, without any change in body fat. Water, salt, carbohydrate, food in
            the gut, hormones and training all move the scale. A client who sees one higher reading
            after a good week often concludes the plan isn't working, when the trend is fine.
          </p>
          <p>
            The only way to see real change is to look at several readings together and ask whether
            the overall direction is larger than the bounce. That's what the reader does.
          </p>
        </>
      ),
    },
    {
      heading: "How the reader works",
      body: (
        <>
          <ol>
            <li>It fits a straight line through the weigh-ins, oldest to newest.</li>
            <li>The slope of that line is the trend: kilograms or pounds per week.</li>
            <li>The scatter of readings around the line is the noise.</li>
            <li>From the noise, it estimates a likely range for the weekly trend.</li>
            <li>
              It compares the trend with what the phase needs: a cut, maintenance or a lean gain.
            </li>
            <li>
              It checks the context you add: waist, strength, cycle timing, recent salt or travel,
              and adherence.
            </li>
          </ol>
          <p>
            Daily weigh-ins are converted to a weekly rate. More readings give a narrower range and
            a more confident read.
          </p>
        </>
      ),
    },
    {
      heading: "The verdicts",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Verdict</th>
                  <th scope="col">What it means</th>
                  <th scope="col">What to do</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>On track</td>
                  <td>The trend matches the phase</td>
                  <td>Hold the plan</td>
                </tr>
                <tr>
                  <td>Mostly noise</td>
                  <td>Too few weeks, or bounce larger than the trend</td>
                  <td>Hold and collect two more weeks</td>
                </tr>
                <tr>
                  <td>A genuine stall</td>
                  <td>Flat for several weeks on a cut</td>
                  <td>Small intake cut or more steps, if adherence is solid</td>
                </tr>
                <tr>
                  <td>Moving too fast</td>
                  <td>Losing more than about 1% a week, or gaining fast</td>
                  <td>Add or remove a little food</td>
                </tr>
                <tr>
                  <td>Recomposition</td>
                  <td>Scale flat, waist down or strength up</td>
                  <td>Hold; body composition is changing</td>
                </tr>
                <tr>
                  <td>Probably water</td>
                  <td>Flat or up with cycle or salt/travel flags</td>
                  <td>Hold; re-read next week</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            For lean gains, too slow means adding a little food; for maintenance, a slow drift means
            a small adjustment back to flat.
          </p>
        </>
      ),
    },
    {
      heading: "Target rates for each phase",
      body: (
        <>
          <p>
            For a cut, the reader treats a loss of about 0.25% to 1% of body weight a week as on
            track. For an 80 kg client, that's 0.2 to 0.8 kg. Faster than about 1.1% a week is
            flagged as too fast, because it usually costs muscle, energy and training quality. For a
            lean gain, about 0.1% to 0.6% a week is on track. For maintenance, anything within about
            0.25% either way is treated as flat.
          </p>
          <p>
            Percentages matter because the same loss means different things for different people:
            0.5 kg a week is a gentle pace for a 110 kg client and a fast one for a 55 kg client.
          </p>
        </>
      ),
    },
    {
      heading: "Recomposition: when the scale hides progress",
      body: (
        <>
          <p>
            If the scale is flat but the waist is coming down or strength is going up, the client
            may be losing fat and gaining muscle at the same time. That's especially common for
            newer lifters and people returning to training. Lowering calories in this situation
            would be a mistake; the plan is working, just not in a way the scale shows.
          </p>
          <p>
            Ask clients to measure their waist every week or two and to log their main lifts. Those
            two numbers turn a frustrating flat scale into evidence of progress.
          </p>
        </>
      ),
    },
    {
      heading: "Water: the cycle, salt, carbs and travel",
      body: (
        <>
          <p>
            Many women retain water in the days before their period, which can hold the scale flat
            or push it up by a kilogram or more. A salty restaurant meal, a high-carbohydrate day, a
            long flight or a hard leg session can do the same for anyone. If one of these applies
            and the trend is flat or slightly up, the reader treats it as probable water and
            recommends holding.
          </p>
          <p>
            Comparing weigh-ins from the same point in the cycle each month gives women a much
            cleaner trend.
          </p>
        </>
      ),
    },
    {
      heading: "Adherence first",
      body: (
        <>
          <p>
            A stall with 60% adherence isn't a plan problem; it's a consistency problem. The reader
            notes when adherence is under 80% and suggests fixing that before changing the numbers.
            Cutting calories for a client who isn't reaching their current target only makes the
            target harder to reach.
          </p>
        </>
      ),
    },
    {
      heading: "Talking to a client about a plateau",
      body: (
        <>
          <p>
            Clients who think they've plateaued are often discouraged. Show them the trend, not just
            the latest reading. Explain the bounce in plain terms: 'Your weight has gone up and down
            by about 0.8 kg, but the line through it is still heading down.' If there's a real
            stall, explain the one change you're making and why, and set a date to review it.
          </p>
          <p>
            The reader's client message is a starting point. Add something specific, such as a
            measurement or a lift that has improved, to make it personal.
          </p>
        </>
      ),
    },
    {
      heading: "Getting cleaner weigh-ins",
      body: (
        <>
          <ul>
            <li>Weigh in the morning, after using the toilet, before eating or drinking.</li>
            <li>Use the same scale on a hard, flat floor.</li>
            <li>Weigh daily and use the weekly average, or weigh on the same day each week.</li>
            <li>Note anything unusual: a late meal, travel, a hard session, cycle timing.</li>
          </ul>
          <p>Cleaner data narrows the range and makes the read more confident.</p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            The default example is six weekly weigh-ins on a cut: 82.1, 81.4, 81.6, 81.5, 81.3 and
            81.4 kg. The first week dropped 0.7 kg, mostly water from a new plan, and the next four
            weeks barely moved. The trend line through all six is about −0.1 kg a week, around 0.14%
            of body weight. That's well below the 0.25% a cut needs. With the waist flat and
            strength flat, the read is a genuine stall.
          </p>
          <p>
            If the client had reported their waist coming down over the same five weeks, the read
            would be recomposition instead, and the right move would be to hold the plan.
          </p>
        </>
      ),
    },
    {
      heading: "Weekly or daily weigh-ins?",
      body: (
        <>
          <p>
            Daily weigh-ins give more data and a smoother trend, as long as the client can see the
            number without anxiety. Weekly weigh-ins are simpler and suit clients who find daily
            numbers stressful, but a single weekly reading is more affected by that day's water.
            Either works with the reader. For daily data, paste at least two to three weeks for a
            reliable trend.
          </p>
        </>
      ),
    },
    {
      heading: "When to change the plan",
      body: (
        <>
          <p>
            Change the plan only when the read is a genuine stall, too fast or a drift, adherence is
            good, and the trend has held for at least two to three weeks. Make one change at a time,
            such as about 150 kcal less a day or 2,000 to 3,000 more steps, and keep everything else
            the same. Re-read after two weeks. Changing several things at once makes it impossible
            to know which one worked.
          </p>
        </>
      ),
    },
    {
      heading: "Reading lb weigh-ins",
      body: (
        <>
          <p>
            The reader works the same way in pounds. Paste readings in lb and choose lb as the unit;
            the trend and range are shown in lb, and the percentage of body weight is the same
            either way. For a 180 lb client on a cut, the on-track range of 0.25% to 1% a week is
            roughly 0.45 to 1.8 lb.
          </p>
        </>
      ),
    },
    {
      heading: "When the trend moves too fast",
      body: (
        <>
          <p>
            Fast loss can feel like good news, but losing more than about 1% of body weight a week
            for several weeks usually means a large share of the loss is muscle and water, energy
            and training suffer, and the result is harder to keep. Adding 100 to 200 kcal a day,
            often as carbohydrate around training, usually slows the pace to something sustainable
            without stopping progress.
          </p>
        </>
      ),
    },
    {
      heading: "Using the read in a check-in",
      body: (
        <>
          <p>
            Paste the latest weigh-ins before each weekly review, read the verdict, and use it
            alongside the check-in reader. If the trend says hold and the check-in says push, keep
            nutrition steady and progress training. If the trend says stall and adherence is solid,
            make the one small change and tell the client exactly what you've changed and when
            you'll review it. Consistent reads build client trust in the process.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            Weigh-ins are personal data. The reader runs entirely in your browser and nothing is
            saved or sent. Keep client weights in a secure system, and share trends with clients in
            a way that focuses on progress rather than the number itself, especially for clients who
            find the scale stressful.
          </p>
        </>
      ),
    },
    {
      heading: "Trend over target",
      body: (
        <>
          <p>
            Clients often focus on a goal weight. Shifting the focus to the weekly trend makes
            progress feel steadier: a client who sees a consistent downward line is far less
            discouraged by a single high reading than one who only checks whether they've hit their
            number yet.
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
    heading: "Every weigh-in in one trend",
    body: (
      <>
        <p>
          In Traiv, clients log their weight and measurements in check-ins, with progress photos,
          and you see the trend beside their plan, so reading a plateau takes a glance.
        </p>
      </>
    ),
  },
  next: [
    { label: "Client check-in reader", href: "/tools/client-check-in-reader" },
    {
      label: "Weight loss percentage calculator",
      href: "/tools/weight-loss-percentage-calculator",
    },
    { label: "Body recomposition calculator", href: "/tools/body-recomposition-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How many weigh-ins do I need?",
      a: "At least four, and ideally six or more weekly readings or two to three weeks of daily ones. More data gives a narrower, more confident range.",
    },
    {
      q: "What is a normal weekly weight loss on a cut?",
      a: "About 0.25% to 1% of body weight a week. Faster than about 1% often costs muscle and energy.",
    },
    {
      q: "Why is the scale flat when my client is losing inches?",
      a: "They may be losing fat and building muscle at once. Waist and strength are better guides than the scale in that case.",
    },
    {
      q: "Does the reader save weigh-ins?",
      a: "No. Everything runs in your browser and nothing is stored.",
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
