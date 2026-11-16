import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Lift progression reader for coaches",
  description:
    "Paste a client's top sets to read the estimated 1RM trend: progressing, a one-day wobble, a stall, grinding or regressing, with the programming move to make.",
  eyebrow: "Free tool · Client tracking",
  h1: "Lift progression reader",
  intro: (
    <>
      <p>
        A single great or poor session says little about real progress. Paste the top set from a
        client's recent sessions, as weight × reps, to compare the trend in estimated one-rep max
        with ordinary day-to-day variation. You'll see whether the lift is climbing, having an off
        day, stuck, being forced or slipping, plus a programming suggestion suited to the lifter's
        experience. It reads strength only and doesn't assess injuries. Everything stays in your
        browser.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I know if a client's lift has stalled?",
    answer: (
      <>
        <p>
          Convert each top set to an estimated one-rep max and look at the trend across several
          sessions. If the change stays inside the normal session-to-session bounce, about 2 to 3%,
          the lift has stalled. If load has gone up but reps have fallen so the estimate is flat,
          they're grinding. Sessions of 100×5, 100×5, 102.5×5, 102.5×4 and 105×3 read as grinding.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why estimated 1RM",
      body: (
        <>
          <p>
            Clients rarely do the same weight for the same reps every session. One week it's 100 kg
            for 5, the next 102.5 kg for 4. Comparing those directly is hard. Converting each set to
            an estimated one-rep max with the Epley formula, weight × (1 + reps ÷ 30), puts every
            session on the same scale. 100 × 5 is about 116.7 kg; 102.5 × 4 is about 116.2 kg.
            Almost the same strength, expressed differently.
          </p>
          <p>
            The estimate isn't a prediction of what the client could actually lift for one rep. It's
            a consistent way to compare sessions.
          </p>
        </>
      ),
    },
    {
      heading: "Normal bounce",
      body: (
        <>
          <p>
            Strength varies from session to session with sleep, food, stress, warm-up and
            motivation. For most lifters, a swing of 2 to 3% in estimated 1RM between sessions is
            normal. The reader uses about 2% for novices, 2.5% for intermediates and 3% for advanced
            lifters, whose heavier loads tend to vary more.
          </p>
          <p>
            A change smaller than the bounce isn't a signal. A trend larger than the bounce across
            several sessions is.
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
                  <th scope="col">What it looks like</th>
                  <th scope="col">Typical move</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Progressing</td>
                  <td>Trend up by more than the bounce</td>
                  <td>Keep the progression</td>
                </tr>
                <tr>
                  <td>Session wobble</td>
                  <td>Trend up, but the last session dipped</td>
                  <td>Repeat the weight next time</td>
                </tr>
                <tr>
                  <td>Stall</td>
                  <td>Trend flat within the bounce</td>
                  <td>Change the driver: reps, sets or variation</td>
                </tr>
                <tr>
                  <td>Grinding</td>
                  <td>Load up, reps down, estimate flat</td>
                  <td>Hold or reduce load; smaller jumps</td>
                </tr>
                <tr>
                  <td>Regressing</td>
                  <td>Trend down by more than the bounce</td>
                  <td>Deload and review recovery</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The move depends on training age. A novice who stalls usually needs a technique or
            recovery fix; an advanced lifter usually needs a new training block.
          </p>
        </>
      ),
    },
    {
      heading: "Worked examples",
      body: (
        <>
          <ul>
            <li>
              <strong>100×5, 102.5×5, 105×5, 107.5×5:</strong> estimated 1RM rises steadily from
              about 117 to 125 kg. Progressing.
            </li>
            <li>
              <strong>100×5, 100×5, 100×5, 100×5:</strong> flat. A stall, if it continues over
              several weeks.
            </li>
            <li>
              <strong>100×5, 102.5×4, 105×3, 107.5×2:</strong> the load rises, but reps fall so fast
              that estimated strength drifts between about 115 and 117 kg. Grinding.
            </li>
            <li>
              <strong>110×5, 105×5, 100×5, 95×5:</strong> falling by more than the bounce.
              Regressing.
            </li>
          </ul>
          <p>
            The default example in the reader, 100×5, 100×5, 102.5×5, 102.5×4, 105×3, reads as
            grinding: the client is adding weight faster than they're building strength.
          </p>
        </>
      ),
    },
    {
      heading: "Why grinding matters",
      body: (
        <>
          <p>
            Grinding is easy to miss because the numbers on the bar keep going up. Clients and
            coaches feel progress. But if reps fall as fast as load rises, strength isn't actually
            improving, and the sets are getting harder and riskier. Technique often breaks down on
            grinding sets, and recovery suffers.
          </p>
          <p>
            The fix is to slow down: hold the load until reps come back, or use smaller increments.
            Many lifters progress faster overall by taking smaller steps.
          </p>
        </>
      ),
    },
    {
      heading: "Stalls by training age",
      body: (
        <>
          <p>
            Novices can usually progress session to session for months. When they stall, the cause
            is often technique, sleep, food or simply jumping too far. Fix those before changing the
            programme. Intermediates progress week to week or block to block; a stall usually means
            the current stimulus has run its course, and changing the rep range, adding a set or
            swapping to a close variation helps. Advanced lifters progress over months; a stall
            often calls for a short deload and a new block.
          </p>
        </>
      ),
    },
    {
      heading: "Recovery and the read",
      body: (
        <>
          <p>
            Poor sleep and high stress can make a progressing lifter look stalled for a week or two.
            If the client is under-slept or stressed, the reader suggests fixing recovery before
            changing the programme. One rough week doesn't justify rewriting a plan that was
            working.
          </p>
        </>
      ),
    },
    {
      heading: "Strength and hypertrophy goals",
      body: (
        <>
          <p>
            For strength, the estimated 1RM is the main measure. For hypertrophy, it's only part of
            the picture: a client can grow muscle while their top-set estimate stays flat, as long
            as total hard sets and effort are rising. If the goal is size, check weekly volume and
            how close sets are taken to failure before calling it a stall.
          </p>
        </>
      ),
    },
    {
      heading: "Logging sets well",
      body: (
        <>
          <p>
            Log the top working set each session with the weight, reps and, ideally, how hard it
            felt. Use the same exercise and the same standard each time: the same squat depth, the
            same bench pause. A change in technique or range of motion can make a lift look like
            it's progressing or regressing when it isn't.
          </p>
        </>
      ),
    },
    {
      heading: "Changing the driver",
      body: (
        <>
          <p>
            When a lift stalls, the progression method has usually run its course. Changing the
            driver means changing what makes the lift progress, not just adding effort.
          </p>
          <ul>
            <li>
              <strong>Rep range:</strong> move from sets of 5 to sets of 8, or the other way.
            </li>
            <li>
              <strong>Volume:</strong> add a working set for a few weeks.
            </li>
            <li>
              <strong>Frequency:</strong> train the lift twice a week instead of once.
            </li>
            <li>
              <strong>Variation:</strong> swap to a close variation, such as a paused squat or
              close-grip bench, for a block.
            </li>
            <li>
              <strong>Intensity method:</strong> add a top set followed by back-off sets.
            </li>
          </ul>
          <p>Choose one change and give it three to six weeks before judging it.</p>
        </>
      ),
    },
    {
      heading: "Deloads",
      body: (
        <>
          <p>
            A deload is a planned lighter week: fewer sets, lighter loads or both. It lets fatigue
            drop while fitness stays, and it often reveals strength that fatigue was hiding. Many
            intermediate and advanced lifters deload every four to eight weeks. If a lift is
            regressing, a deload is usually the first step before changing anything else.
          </p>
          <p>
            A typical deload keeps the same exercises with about half the sets and loads around 10%
            lighter.
          </p>
        </>
      ),
    },
    {
      heading: "Talking to clients about stalls",
      body: (
        <>
          <p>
            Clients often feel a stall is a failure. Explain that every lifter stalls, that it's a
            normal signal to change something, and that the trend over months matters more than any
            single session. Showing the estimated 1RM trend, rather than just the latest set, helps
            them see progress in context.
          </p>
          <p>
            Celebrate other wins too: better technique, more consistent attendance, a new rep record
            at a lighter weight. Strength rarely moves in a straight line.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking several lifts",
      body: (
        <>
          <p>
            Run the reader for each main lift separately. It's common for one lift to progress while
            another stalls, especially when training focuses more on one movement. Reading them side
            by side helps decide where to adjust and where to leave the programme alone.
          </p>
          <p>
            If every lift is stalling at once, the cause is usually recovery, nutrition or overall
            training load rather than any one exercise.
          </p>
        </>
      ),
    },
    {
      heading: "Pounds and kilograms",
      body: (
        <>
          <p>
            The reader works in either unit. The estimated 1RM and the percentage change are the
            same whatever unit you use; only the displayed numbers differ. Enter all sessions in the
            same unit, and don't mix kilograms and pounds in one series.
          </p>
        </>
      ),
    },
    {
      heading: "How many sessions to paste",
      body: (
        <>
          <p>
            Three sessions is the minimum, but five to eight give a far more reliable read. With
            only three, one unusual day has a big effect on the trend. With eight, a single off day
            barely moves it, and real stalls or progressions stand out clearly. Use the top working
            set from each session rather than warm-ups or back-off sets.
          </p>
        </>
      ),
    },
    {
      heading: "Bodyweight and strength",
      body: (
        <>
          <p>
            If a client is losing weight on a cut, holding strength is often a win in itself. A flat
            estimated 1RM while bodyweight falls means relative strength is rising. During a cut, a
            stall is usually expected; a regression is the signal to watch for, because it can mean
            the deficit is too large or recovery is poor.
          </p>
        </>
      ),
    },
    {
      heading: "Reading accessory lifts",
      body: (
        <>
          <p>
            The reader works for any lift logged as weight × reps, including accessories such as
            rows, lunges or curls. For accessories, small stalls matter less; they're usually there
            to support the main lifts or add volume. Focus the reader on the lifts your client's
            goal depends on, and use accessory trends mainly to spot fatigue across the whole
            programme.
          </p>
        </>
      ),
    },
    {
      heading: "When to get help",
      body: (
        <>
          <p>
            If a client's lift regresses alongside pain, unusual fatigue, poor sleep that doesn't
            improve, or a loss of appetite, look beyond the programme. Persistent fatigue can have
            medical causes, and pain needs assessment. Encourage them to see a doctor or
            physiotherapist, and lighten training while they do.
          </p>
        </>
      ),
    },
    {
      heading: "A worked read of the default example",
      body: (
        <>
          <p>
            The example sessions are 100×5, 100×5, 102.5×5, 102.5×4 and 105×3. Their estimated 1RMs
            are about 116.7, 116.7, 119.6, 116.2 and 115.5 kg. The load rose by 5 kg, but reps fell
            from 5 to 3, and estimated strength actually dipped slightly. For an intermediate
            lifter, the move is to hold the load until reps recover, or use smaller increments,
            rather than adding more weight next session.
          </p>
          <p>
            A client message explaining this in plain words, 'the weight's gone up, but the extra
            load isn't adding strength yet', helps them accept a small step back.
          </p>
        </>
      ),
    },
    {
      heading: "Effort ratings",
      body: (
        <>
          <p>
            If your clients log how hard each top set felt, on an RPE or reps-in-reserve scale, add
            that to the picture. A flat estimated 1RM at a lower effort rating means strength is
            actually rising; the same numbers at a higher rating suggest fatigue is building.
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
    key: "workouts",
    heading: "Every set logged, every trend visible",
    body: (
      <>
        <p>
          In Traiv, clients log their sets in the app against the plan you wrote, so you can see
          whether a lift is climbing, grinding or stalled without copying numbers into a
          spreadsheet.
        </p>
      </>
    ),
  },
  next: [
    { label: "One-rep max calculator", href: "/tools/one-rep-max-calculator" },
    { label: "RPE calculator", href: "/tools/rpe-calculator" },
    {
      label: "Weekly training volume calculator",
      href: "/tools/weekly-training-volume-calculator",
    },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How do I calculate estimated 1RM?",
      a: "The Epley formula: weight × (1 + reps ÷ 30). 100 kg for 5 reps is about 116.7 kg.",
    },
    {
      q: "What is normal session-to-session variation?",
      a: "Roughly 2 to 3% in estimated 1RM for most lifters. Smaller changes aren't a real signal.",
    },
    {
      q: "What does grinding mean?",
      a: "Load is going up but reps are falling, so estimated strength is flat. The lifter is adding weight faster than strength is building.",
    },
    {
      q: "Is this an injury assessment?",
      a: "No. It reads strength trends only. If a lift causes pain, stop and get it assessed.",
    },
  ],
  keepGoing: [
    { label: "Workout plans in Traiv", href: "/features/plan-builder" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Run your coaching business on one platform",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
