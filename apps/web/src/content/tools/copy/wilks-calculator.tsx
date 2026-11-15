import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Wilks Calculator: Wilks Score for Powerlifting",
  description:
    "Free Wilks calculator. Enter body weight and powerlifting total to get your Wilks score and compare strength across body weights, in kg or lb.",
  eyebrow: "Free tool · Strength",
  h1: "Wilks calculator",
  intro: (
    <>
      <p>
        The Wilks score is a long-standing way to compare powerlifters of different body weights.
        Enter your body weight and your total (squat, bench press and deadlift combined), choose
        your sex, and this calculator gives your Wilks score using the Wilks 2020 coefficients.
      </p>
    </>
  ),
  shortAnswer: {
    question: "What is a Wilks score?",
    answer: (
      <>
        <p>
          A Wilks score multiplies your powerlifting total by a coefficient based on your body
          weight, so lifters of different sizes can be compared on one scale. A 90 kg man with a 500
          kg total scores about 383.5 Wilks 2020.
        </p>
        <p>
          This tool uses Wilks 2020, also called Wilks-2. Its scale differs from the original
          formula, so do not compare this result with a historical Wilks score unless both records
          use the same version. Keep the total, body weight, sex category and formula version
          together in your training log.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the Wilks score is calculated",
      body: (
        <>
          <p>
            The score is your total multiplied by 600, divided by a fifth-order polynomial of your
            body weight in kilograms. The polynomial's coefficients were fitted by Robert Wilks to
            competition results, with separate sets for men and women. The calculator applies the
            formula directly and converts pounds to kilograms first if you enter imperial values.
          </p>
          <p>
            Because the polynomial is fitted to typical competitive body weights, results at very
            light or very heavy body weights are less reliable. The calculator limits body weight to
            the range the formula was designed for.
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
      heading: "Choosing a useful Wilks benchmark",
      body: (
        <>
          <p>
            A score is useful only alongside a named formula version and a relevant comparison
            group. Wilks 2020 uses a different scale from the original Wilks formula. A historic
            score described as nationally competitive cannot be transferred to this calculator
            without recalculating the underlying total and body weight.
          </p>
          <p>
            For competition comparisons, use results from the same federation, equipment division
            and sex category. Record the date and the formula used for any best-lifter ranking.
            Equipment rules, judging standards and the depth of the field affect what a result
            means, even when everyone uses the same mathematical coefficient.
          </p>
          <p>
            For your own training, compare with your earlier Wilks 2020 results. A higher score
            records a change in total relative to body weight; it does not independently certify a
            competition level. Set a practical next target with your coach using recent lifts rather
            than attaching an unsupported beginner or elite label to the number.
          </p>
        </>
      ),
    },
    {
      heading: "The history of the Wilks formula",
      body: (
        <>
          <p>
            Robert Wilks, an Australian powerlifting official, developed the formula in the 1990s,
            and it was adopted by the International Powerlifting Federation and many national
            federations as the standard for best-lifter awards. Over time, analysts found it
            favoured some weight classes over others, particularly middle-weight men and certain
            women's classes. An updated version was released in 2020, and many federations moved to
            DOTS or IPF GL points. The original Wilks remains the score most lifters recognise,
            which is why it is still useful for comparison with historical results.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            Two men compete at the same meet. One weighs 75 kg and totals 520 kg; the other weighs
            110 kg and totals 640 kg. The heavier lifter has the bigger total, but the Wilks scores
            tell a different story: the 75 kg lifter scores about 443.3, and the 110 kg lifter about
            449.2. Despite a 120 kg difference in totals, they are very close in strength for their
            size.
          </p>
        </>
      ),
    },
    {
      heading: "Wilks versus DOTS",
      body: (
        <>
          <p>
            DOTS was developed later using more recent competition data, and it is designed to treat
            lifters at the extremes of body weight more evenly. Wilks 2020 and DOTS use different
            scales and can produce different rankings. Compare records within a named formula. The
            Wilks and DOTS calculator shows both side by side if you want to compare.
          </p>
        </>
      ),
    },
    {
      heading: "Raising your Wilks score",
      body: (
        <>
          <p>
            There are two ways to raise your score: increase your total, or increase it more than
            your body weight. For most lifters, the most effective approach is to get stronger at a
            stable body weight, or to gain weight slowly while making sure strength rises faster.
            Losing body fat while maintaining your total also raises the score. Rapid weight cuts
            before competition can raise a score on the day but often reduce performance, so they
            need careful management.
          </p>
        </>
      ),
    },
    {
      heading: "How a powerlifting total works",
      body: (
        <>
          <p>
            A powerlifting total is the sum of a lifter's best successful squat, bench press and
            deadlift in a single competition. Each lifter gets three attempts at each lift, and only
            the heaviest successful attempt counts. If a lifter fails all three attempts on any
            lift, they do not post a total. The Wilks score is calculated from that total and the
            lifter's official body weight at weigh-in, usually taken between two and twenty-four
            hours before lifting, depending on the federation.
          </p>
        </>
      ),
    },
    {
      heading: "Calculating Wilks outside competition",
      body: (
        <>
          <p>
            Most lifters who use a Wilks calculator are not at a meet. A gym total can be built from
            your best recent single in each lift, or from estimated one-rep maxes. Estimated totals
            are useful for tracking progress, but they usually run a little higher than competition
            totals, because competition lifts must meet strict standards for depth, pauses and
            lockout, and because the pressure of a meet affects performance. Treat a gym Wilks as a
            guide and a competition Wilks as the official measure.
          </p>
        </>
      ),
    },
    {
      heading: "Wilks for women",
      body: (
        <>
          <p>
            The women's coefficients in the original Wilks formula were fitted to a smaller dataset
            of women's results, and later analysis found they tended to give women's scores a slight
            boost compared with men's at similar relative strength. This was one reason the formula
            was revised in 2020 and why many federations moved to DOTS or IPF GL points. For
            comparing women with other women of different body weights, Wilks still works reasonably
            well.
          </p>
        </>
      ),
    },
    {
      heading: "Using Wilks in a training group",
      body: (
        <>
          <p>
            Gyms and teams sometimes use Wilks to run friendly competitions between members of
            different sizes, such as a monthly total day where the highest Wilks score wins. This
            keeps lighter and heavier members on a level playing field and rewards improvement
            relative to body weight. Recording each member's score over time also gives coaches a
            simple measure of the whole group's progress.
          </p>
        </>
      ),
    },
    {
      heading: "Converting between kilograms and pounds",
      body: (
        <>
          <p>
            The Wilks formula works in kilograms. If you enter your body weight and total in pounds,
            the calculator divides by 2.2046 before applying the formula. The score itself has no
            unit, so it is the same whichever unit you start with. Be careful to convert both body
            weight and total; mixing units is a common source of wildly wrong scores in
            spreadsheets.
          </p>
        </>
      ),
    },
    {
      heading: "What a score cannot tell you",
      body: (
        <>
          <p>
            A Wilks score summarises strength relative to body weight in a single number, but it
            says nothing about which lift is strong or weak, how a lifter performs under pressure,
            or how much potential they have left. Two lifters with the same score may have very
            different lift profiles. Use the score alongside individual lift numbers, training
            history and technique assessments for a complete picture.
          </p>
        </>
      ),
    },
    {
      heading: "Preparing for your first meet",
      body: (
        <>
          <p>
            If a Wilks score has made you curious about competing, a local meet is the best place to
            start. Choose a meet several months away, learn the rules for each lift, practise
            commands with a training partner and train to competition standards. Pick conservative
            openers you could lift on a bad day. Most first-time lifters find meets far more
            welcoming than expected, and the total you post becomes the baseline for every score
            that follows.
          </p>
        </>
      ),
    },
    {
      heading: "How body weight changes affect your score",
      body: (
        <>
          <p>
            At a fixed total, changing body weight changes the coefficient. Keep both values in the
            record so you can tell whether a score moved because of a stronger lift, a weight change
            or both. Recalculate a proposed scenario rather than borrowing a point difference from
            another formula or body weight.
          </p>
        </>
      ),
    },
    {
      heading: "Scores across a lifting career",
      body: (
        <>
          <p>
            Most lifters see their score rise quickly in the first few years as strength grows
            faster than body weight, then more slowly as they approach their potential. Comparing
            your score each year with the year before is a satisfying way to see long-term progress,
            and it remains meaningful even as your body weight changes through different phases of
            training and life.
          </p>
        </>
      ),
    },
    {
      heading: "Wilks and weight classes",
      body: (
        <>
          <p>
            Powerlifting competitions group lifters into weight classes, and within each class the
            biggest total wins. Wilks is used across classes, typically to decide an overall best
            lifter. That means a lifter who wins their class may not win best lifter, and a lifter
            who finishes second in a strong class might still have the highest Wilks score of the
            day. Knowing your score helps you understand where you stand beyond your own class.
          </p>
        </>
      ),
    },
    {
      heading: "A note on the 2020 Wilks update",
      body: (
        <>
          <p>
            In 2020, an updated version of the formula, sometimes called Wilks 2 or the new Wilks,
            was released with revised coefficients and a different scale. Scores from the new
            version are not directly comparable with the original. This calculator uses Wilks 2020
            coefficients, so historic original-Wilks results must be recalculated before comparison.
            If your federation uses the updated formula, check which version a published score
            refers to before comparing.
          </p>
        </>
      ),
    },
    {
      heading: "Using Wilks to compare training partners",
      body: (
        <>
          <p>
            Training partners of different sizes often wonder who is really stronger. Wilks gives a
            fair, simple answer. It also makes friendly rivalry more motivating, because a lighter
            lifter can beat a heavier partner on score even with a smaller total, and both have a
            clear way to measure improvement against each other.
          </p>
        </>
      ),
    },
    {
      heading: "Building your total lift by lift",
      body: (
        <>
          <p>
            Raising a Wilks score means raising your total, and the total responds best when all
            three lifts improve together. Many lifters find their deadlift progresses fastest, their
            squat steadily, and their bench press slowest. A balanced programme trains each lift at
            least once or twice a week, with heavier and lighter days, and adds accessory work for
            the muscles that limit each lift. Small, regular gains on all three add up to a
            meaningful rise in score over a training year.
          </p>
          <p>
            Tracking each lift's estimated max alongside the score shows which lift is driving
            progress and which is holding it back.
          </p>
        </>
      ),
    },
    {
      heading: "When to recalculate",
      body: (
        <>
          <p>
            Recalculate your Wilks score after each competition, or at the end of a training block
            if you test or estimate your best singles. Recalculating weekly from gym estimates tends
            to be noisy, because normal day-to-day variation in strength and body weight moves the
            score up and down without reflecting real change.
          </p>
        </>
      ),
    },
    {
      heading: "Scores and motivation",
      body: (
        <>
          <p>
            A single number that summarises your strength can be surprisingly motivating. Setting a
            target score, such as 300 or 350, gives training a clear focus and makes every personal
            best feel like progress toward something. It also helps when progress on a single lift
            stalls: improvements elsewhere still move the score.
          </p>
        </>
      ),
    },
    {
      heading: "Wilks for masters lifters",
      body: (
        <>
          <p>
            Masters lifters, those aged 40 and over, often use Wilks alongside an age coefficient
            that adjusts for the natural decline in strength with age. Without the age adjustment, a
            55-year-old lifter's Wilks score compares directly with younger lifters, which can
            understate their achievement. Many masters lifters track their own Wilks score year to
            year, which is meaningful regardless of age adjustments, and use it to see how training
            is slowing or reversing age-related strength loss.
          </p>
        </>
      ),
    },
    {
      heading: "Scores are a snapshot",
      body: (
        <>
          <p>
            A Wilks score reflects your total and body weight on one day. Sleep, food, stress and
            how well a meet goes all affect it. Look at the trend across several scores rather than
            reading too much into any single result.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using Wilks with clients",
    body: (
      <>
        <p>
          Wilks scores give clients a simple way to see progress in relative strength, particularly
          during weight changes. A client who loses 5 kg and keeps the same total will see their
          score rise, a motivating result.
        </p>
        <p>
          Use the score to set goals across weight changes. Instead of a raw total target, a target
          Wilks score lets clients choose whether to gain strength, lose weight or both.
        </p>
        <p>
          Compare against the right reference. If your clients compete, use the formula their
          federation uses; for general tracking, any consistent formula works.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Track every client's strength over time",
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
    { label: "Compare with DOTS", href: "/tools/dots-calculator" },
    { label: "See Wilks and DOTS together", href: "/tools/wilks-dots-calculator" },
  ],
  nextPitch: "Coaching powerlifters? Traiv keeps every client's lifts and plans together.",
  faq: [
    {
      q: "What is a good Wilks score?",
      a: "Use results calculated with Wilks 2020 in the same division and comparison group. There is no universal point threshold that certifies a competition level.",
    },
    {
      q: "How is the Wilks score calculated?",
      a: "Total × 600 ÷ a polynomial of body weight in kilograms, with different coefficients for men and women.",
    },
    {
      q: "Is Wilks still used?",
      a: "Some federations still use it, but many have moved to DOTS or IPF GL points. It remains widely understood for comparison.",
    },
    {
      q: "Should I enter my total in kg or lb?",
      a: "Either. The calculator converts to kilograms, which the formula uses.",
    },
    {
      q: "Does Wilks account for age?",
      a: "No. Age adjustments are applied separately in masters and junior competitions.",
    },
  ],
  keepGoing: [
    { label: "DOTS calculator", href: "/tools/dots-calculator" },
    { label: "IPF GL points calculator", href: "/tools/ipf-gl-points-calculator" },
    { label: "One-rep max calculator", href: "/tools/one-rep-max-calculator" },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Relative strength, tracked for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
