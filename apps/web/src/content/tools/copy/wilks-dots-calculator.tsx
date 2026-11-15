import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Wilks and DOTS Calculator: Both Scores Side by Side",
  description:
    "Free Wilks and DOTS calculator. Enter body weight and total once and get both relative strength scores side by side, in kg or lb.",
  eyebrow: "Free tool · Strength",
  h1: "Wilks and DOTS calculator",
  intro: (
    <>
      <p>
        Wilks and DOTS are the two most widely recognised scores for comparing powerlifters across
        body weights. Enter your body weight and total once, choose your sex, and this calculator
        shows both scores side by side so you can compare them or match whichever your federation
        uses.
      </p>
    </>
  ),
  shortAnswer: {
    question: "What is the difference between Wilks and DOTS?",
    answer: (
      <>
        <p>
          Both multiply your total by a coefficient based on body weight. This calculator uses the
          2020 revision of Wilks alongside DOTS. Their normalisation constants and coefficients
          differ, so compare rankings or changes within a formula rather than treating equal point
          values as equivalent.
        </p>
        <p>
          For most lifters in the middle of the body-weight range, the two scores are similar in
          size and give similar rankings. At the extremes, they can differ by enough to change who
          wins a best-lifter award.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How each score is calculated",
      body: (
        <>
          <p>
            Wilks 2020 multiplies your total by 600 divided by a fifth-order polynomial of body
            weight; DOTS uses 500 divided by a fourth-order polynomial with different coefficients.
            Both have separate versions for men and women. The calculator converts pounds to
            kilograms first if needed, then applies each formula.
          </p>
        </>
      ),
    },
    {
      heading: "Why relative strength scores exist",
      body: (
        <>
          <p>
            A heavier lifter can usually lift more weight than a lighter one, simply because they
            carry more muscle. That makes raw totals a poor way to compare lifters across weight
            classes. Relative strength formulas solve this by multiplying a lifter's total by a
            coefficient that depends on body weight: lighter lifters get a larger coefficient,
            heavier lifters a smaller one. The result is a single score that estimates how strong a
            lifter is for their size.
          </p>
          <p>
            These scores are used to award best-lifter prizes at competitions, rank lifters across
            weight classes, and help individual lifters track whether their strength is rising
            faster than their body weight.
          </p>
        </>
      ),
    },
    {
      heading: "Strength does not scale in a straight line with body weight",
      body: (
        <>
          <p>
            If strength rose in direct proportion to body weight, a 100 kg lifter would lift exactly
            twice as much as a 50 kg lifter. In reality, the heavier lifter usually lifts less than
            twice as much. Muscle cross-sectional area, which largely determines strength, grows
            more slowly than body mass as people get bigger, and very heavy lifters carry more
            non-muscle mass. Every relative strength formula is an attempt to model this curve as
            fairly as possible, using data from real competition results.
          </p>
        </>
      ),
    },
    {
      heading: "Using scores to track your own progress",
      body: (
        <>
          <p>
            Even if you never compete, a relative score is a useful way to see whether you are
            getting stronger for your size. If you gain body weight and your total rises, your score
            shows whether strength increased faster than weight. If you lose weight while your total
            stays the same, your score rises, reflecting a genuine improvement in relative strength.
            Tracking a score every few months alongside body weight gives a clearer picture than raw
            numbers alone.
          </p>
        </>
      ),
    },
    {
      heading: "Limitations to keep in mind",
      body: (
        <>
          <ul>
            <li>
              <strong>Scores are estimates.</strong> They are fitted to past competition data and
              are less reliable at the extremes of body weight.
            </li>
            <li>
              <strong>Different formulas, different winners.</strong> Wilks, DOTS and IPF GL can
              rank the same lifters in a slightly different order.
            </li>
            <li>
              <strong>Equipment matters.</strong> Raw and equipped totals are not directly
              comparable, even with the same formula.
            </li>
            <li>
              <strong>Age is not included.</strong> Masters and junior lifters often use additional
              age coefficients in competition.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "When the two scores differ most",
      body: (
        <>
          <p>
            The difference depends on the total, body weight and formula coefficients; there is no
            fixed conversion between the point scales. For lighter and heavier lifters, the
            differences grow. In general, the original Wilks tended to favour middle-weight men
            compared with DOTS, while DOTS gives relatively better scores to the lightest and
            heaviest classes. If your two scores differ a lot, it is likely because your body weight
            sits toward one of those extremes.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            An 82.5 kg man with a 500 kg total scores about 402.2 Wilks and about 339 DOTS, on
            different scales. A 125 kg man with a 750 kg total scores about 505.2 Wilks and about
            425 DOTS. A 52 kg woman with a 300 kg total scores noticeably differently on the two
            formulas, because women's coefficients diverge more at lower body weights. Running your
            own numbers through both shows how much the choice of formula matters for you.
          </p>
        </>
      ),
    },
    {
      heading: "Which score should you use?",
      body: (
        <>
          <p>
            If you compete, use the formula your federation uses for awards. If you are tracking
            your own progress, either works, as long as you stay consistent. DOTS is the more modern
            choice and is increasingly common; Wilks is useful for comparing with older results and
            records. Many lifters simply note both.
          </p>
        </>
      ),
    },
    {
      heading: "Other scoring systems",
      body: (
        <>
          <p>
            Besides Wilks and DOTS, the International Powerlifting Federation uses IPF GL points,
            which have separate formulas for raw and equipped lifting. Olympic weightlifting uses
            the Sinclair coefficient. Each system has its own scale, so scores from different
            systems cannot be compared directly. The IPF GL points and Sinclair calculators cover
            those systems.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking both over time",
      body: (
        <>
          <p>
            Recording both scores every few months gives a fuller picture of progress. If both rise,
            your relative strength is clearly improving. If one rises while the other barely moves,
            it usually reflects a body-weight change that the two formulas weight slightly
            differently. Either way, the trend matters more than any single result.
          </p>
        </>
      ),
    },
    {
      heading: "Why there are so many scoring systems",
      body: (
        <>
          <p>
            Powerlifting has several federations, and each has chosen the scoring system it believes
            is fairest. Over the decades, new data and better statistical methods have led to
            revised formulas, but older systems remain in use because lifters and officials know
            them well and because historical records are tied to them. Having more than one system
            is mainly a sign of ongoing efforts to make comparisons fairer.
          </p>
        </>
      ),
    },
    {
      heading: "Which lifters benefit from each formula",
      body: (
        <>
          <p>
            In general, the original Wilks formula tended to favour middle-weight men compared with
            very light or very heavy men, while DOTS spreads advantages more evenly across body
            weights. For women, differences between the formulas are larger at the lightest weights.
            If you are a very light or very heavy lifter, you may find your DOTS score compares more
            favourably with others than your Wilks score does.
          </p>
        </>
      ),
    },
    {
      heading: "A quick comparison table",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Wilks</th>
                  <th scope="col">DOTS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Introduced</td>
                  <td>1990s</td>
                  <td>Around 2019</td>
                </tr>
                <tr>
                  <td>Curve</td>
                  <td>Fifth-order polynomial</td>
                  <td>Fourth-order polynomial</td>
                </tr>
                <tr>
                  <td>Data</td>
                  <td>Older competition results</td>
                  <td>More recent competition results</td>
                </tr>
                <tr>
                  <td>Main users</td>
                  <td>Historical records, some federations</td>
                  <td>Several modern federations</td>
                </tr>
                <tr>
                  <td>Strength at extremes</td>
                  <td>Less even</td>
                  <td>More even</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      heading: "Tracking progress with both",
      body: (
        <>
          <p>
            Because both scores respond to the same things, total and body weight, they usually move
            in the same direction. If you get stronger at the same body weight, both rise. If you
            lose weight and keep your total, both rise. If you gain weight without adding much to
            your total, both fall. Watching both over time confirms that changes are real rather
            than an artefact of one formula.
          </p>
        </>
      ),
    },
    {
      heading: "Using the scores to choose a weight class",
      body: (
        <>
          <p>
            Before competing, some lifters run their expected totals at a few possible body weights
            through both formulas to decide which weight class gives them the best chance of placing
            well. If moving up a class would add a lot to the total, the scores can show whether the
            extra weight is worth it. If both scores fall with the extra weight, staying in the
            lighter class is usually the better choice.
          </p>
        </>
      ),
    },
    {
      heading: "Scores in practice: a few examples",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Lifter</th>
                  <th scope="col">Total</th>
                  <th scope="col">Wilks</th>
                  <th scope="col">DOTS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Man, 82.5 kg</td>
                  <td>500 kg</td>
                  <td>about 402.2</td>
                  <td>about 339</td>
                </tr>
                <tr>
                  <td>Man, 125 kg</td>
                  <td>750 kg</td>
                  <td>about 505.2</td>
                  <td>about 425</td>
                </tr>
                <tr>
                  <td>Woman, 60 kg</td>
                  <td>360 kg</td>
                  <td>about 474.9</td>
                  <td>about 399</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These examples use Wilks 2020 and DOTS. The point scales differ substantially. Keep the
            formula name with every recorded score and compare each result with records calculated
            using that same formula.
          </p>
        </>
      ),
    },
    {
      heading: "Why your federation's choice matters",
      body: (
        <>
          <p>
            Best-lifter awards, team scoring and some qualifying standards depend on the scoring
            system a federation uses. If you are aiming for an award, calculate your score with the
            right formula, because a lifter who wins on DOTS might place second on Wilks, or the
            other way round. For personal tracking, the choice matters much less than consistency.
          </p>
        </>
      ),
    },
    {
      heading: "Gym totals and meet totals",
      body: (
        <>
          <p>
            If you calculate both scores from gym lifts, use your best recent single in each lift
            performed to competition standards. Estimated maxes from rep sets are fine for tracking,
            but competition totals are usually a little lower than gym estimates because of strict
            standards and the pressure of the day. Note which kind of total you used so later
            comparisons are fair.
          </p>
        </>
      ),
    },
    {
      heading: "Setting goals with both scores",
      body: (
        <>
          <p>
            A simple approach is to set your goal on the formula your federation uses and record the
            other for interest. If both rise over a training year, you know your relative strength
            has improved regardless of the method. If they move differently, look at your body
            weight change, since that is usually where the formulas disagree.
          </p>
        </>
      ),
    },
    {
      heading: "How the formulas were built",
      body: (
        <>
          <p>
            Both formulas were created by fitting a curve to the totals of strong competitors across
            many weight classes. The idea is that the best lifters at each body weight represent a
            similar level of achievement, so the curve through their totals shows how strength
            naturally changes with size. A lifter's score then reflects how close they come to that
            curve. Wilks was fitted to older data and DOTS to more recent results, which partly
            explains why they differ.
          </p>
        </>
      ),
    },
    {
      heading: "Scores for very light and very heavy lifters",
      body: (
        <>
          <p>
            At the lightest body weights, small differences in weight change the coefficient a lot,
            so scores can swing noticeably with a kilogram or two of weight change. At the heaviest,
            the curves flatten, and adding body weight barely changes the coefficient. Lifters at
            either extreme should be especially careful to use their official weigh-in weight when
            calculating scores.
          </p>
        </>
      ),
    },
    {
      heading: "Recording your scores",
      body: (
        <>
          <p>
            Keep a simple log with the date, body weight, the three lifts, total, Wilks score and
            DOTS score. Over a year or two, this record shows how your relative strength has
            developed, which lifts drove the improvement and how body weight changes affected your
            scores. It also makes it easy to answer the common question of whether a gaining or
            cutting phase helped or hurt your strength.
          </p>
        </>
      ),
    },
    {
      heading: "Should you switch formulas?",
      body: (
        <>
          <p>
            If you have years of results recorded in Wilks, there is no need to abandon them. Keep
            recording Wilks for continuity and add DOTS alongside it. Over time, you will have both
            histories, which makes it easy to compare with older results and with lifters who use
            the newer system. If you are just starting out, DOTS is the more modern default, but
            recording both costs nothing.
          </p>
        </>
      ),
    },
    {
      heading: "What both formulas leave out",
      body: (
        <>
          <p>
            Neither formula accounts for age, height, limb length, training history or equipment
            differences beyond the basic raw and equipped split. A tall, long-limbed lifter may be
            at a leverage disadvantage in some lifts that no formula captures. Age adjustments are
            handled separately in masters and junior categories. Keep these factors in mind when
            comparing your score with someone else's, especially if their situation differs a lot
            from yours.
          </p>
        </>
      ),
    },
    {
      heading: "Scores for beginners",
      body: (
        <>
          <p>
            New lifters often score between 150 and 250 on both formulas in their first months of
            training. That is a normal starting point, and both scores usually rise quickly over the
            first year or two as technique improves and strength builds. Watching both climb is a
            motivating way to see progress, even before you think about competing.
          </p>
        </>
      ),
    },
    {
      heading: "Scoring single lifts informally",
      body: (
        <>
          <p>
            Both formulas are designed for full totals, but some lifters apply the same coefficient
            to a single lift to see which lift is relatively strongest. For example, multiplying
            each lift by the same coefficient shows how much each contributes to the score. This is
            not an official use, and single-lift scores cannot be compared with total-based scores,
            but it can help identify the lift with the most room to improve.
          </p>
          <p>
            For a more detailed look at each lift relative to body weight, the strength standards
            calculator ranks individual lifts from beginner to elite.
          </p>
        </>
      ),
    },
    {
      heading: "Scores are a snapshot",
      body: (
        <>
          <p>
            Both scores reflect one day's lifting at one body weight. A missed attempt, a poor
            night's sleep or a slightly heavier weigh-in can move them by several points. Look at
            the trend across several meets or training blocks rather than reading too much into a
            single result, and keep notes on the conditions so you can explain any surprises later.
          </p>
        </>
      ),
    },
    {
      heading: "Sharing your scores",
      body: (
        <>
          <p>
            When you share a score, say which formula it uses and whether the total came from a meet
            or the gym. That small detail prevents a lot of confusing comparisons.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using both scores with clients",
    body: (
      <>
        <p>
          Showing both scores helps clients understand that relative strength scoring is an estimate
          with more than one reasonable method, not a single truth.
        </p>
        <p>
          For competitive lifters, focus on the score their federation uses, but keep both in your
          records for context.
        </p>
        <p>
          For general clients, pick one score and use it consistently as a simple measure of
          strength relative to body weight.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Track strength and plans for every client",
    body: (
      <>
        <p>
          In Traiv you build workout plans for each client, set weights from their numbers, and see
          every set and rep they log, so progress on each lift is visible week by week.
        </p>
      </>
    ),
  },
  next: [
    { label: "Calculate IPF GL points", href: "/tools/ipf-gl-points-calculator" },
    { label: "See where each lift ranks", href: "/tools/strength-standards-calculator" },
  ],
  nextPitch: "Coaching lifters? Traiv keeps every client's lifts and programmes together.",
  faq: [
    {
      q: "Are Wilks and DOTS scores the same?",
      a: "This tool uses Wilks 2020 and DOTS. Their scales differ, so equal point values are not equivalent. Keep the formula name with the result.",
    },
    {
      q: "Which is more accurate?",
      a: "DOTS was fitted to more recent data and is designed to be fairer across body weights, but neither is perfect.",
    },
    {
      q: "Why are my two scores so different?",
      a: "Usually because your body weight is near one end of the range, where the formulas diverge most.",
    },
    {
      q: "Can I compare a Wilks score with a DOTS score?",
      a: "Roughly, for lifters in the middle of the body-weight range. For precise comparisons, use the same formula.",
    },
    {
      q: "Do these scores work for women?",
      a: "Yes. Both formulas have separate coefficients for women.",
    },
    { q: "Which one does the IPF use?", a: "Neither. The IPF uses its own IPF GL points system." },
    {
      q: "Can I use these for single lifts?",
      a: "They are designed for totals, though some lifters use them informally for single lifts.",
    },
    {
      q: "How often should I check my scores?",
      a: "After each meet or every few months of training is enough to see meaningful change.",
    },
  ],
  keepGoing: [
    { label: "Wilks calculator", href: "/tools/wilks-calculator" },
    { label: "DOTS calculator", href: "/tools/dots-calculator" },
    { label: "IPF GL points calculator", href: "/tools/ipf-gl-points-calculator" },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Every client's strength, measured fairly",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
