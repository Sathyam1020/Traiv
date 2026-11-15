import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "DOTS Calculator: DOTS Score for Powerlifting",
  description:
    "Free DOTS calculator. Enter body weight and total to get your DOTS score, compare lifters across weight classes and see how your score changes with your total.",
  eyebrow: "Free tool · Strength",
  h1: "DOTS calculator",
  intro: (
    <>
      <p>
        DOTS is a modern relative strength score used by many powerlifting federations to compare
        lifters of different body weights. Enter your body weight and total, choose your sex, and
        this calculator gives your DOTS score and a table showing how it would change with a bigger
        or smaller total.
      </p>
    </>
  ),
  shortAnswer: {
    question: "What is a DOTS score?",
    answer: (
      <>
        <p>
          DOTS multiplies your powerlifting total by a coefficient based on your body weight,
          producing a score that compares lifters of different sizes fairly. A 90 kg man with a 600
          kg total scores about 388 DOTS.
        </p>
        <p>
          Roughly, 300 marks a strong gym lifter, 400 a nationally competitive lifter and 500 or
          more a world-class one. DOTS was introduced to fix imbalances in the original Wilks
          formula, especially at the lightest and heaviest body weights.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How DOTS is calculated",
      body: (
        <>
          <p>
            DOTS divides 500 by a fourth-order polynomial of body weight in kilograms, with separate
            coefficients for men and women, and multiplies the result by your total. The
            coefficients were fitted to a large set of modern competition results. The calculator
            limits body weight to the range the formula was built for, roughly 40 to 210 kg for men
            and 40 to 150 kg for women.
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
      heading: "DOTS benchmarks",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">DOTS</th>
                  <th scope="col">Typical level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Under 250</td>
                  <td>Beginner to early intermediate</td>
                </tr>
                <tr>
                  <td>250 to 300</td>
                  <td>Intermediate</td>
                </tr>
                <tr>
                  <td>300 to 350</td>
                  <td>Strong, experienced lifter</td>
                </tr>
                <tr>
                  <td>350 to 400</td>
                  <td>Regionally competitive</td>
                </tr>
                <tr>
                  <td>400 to 450</td>
                  <td>Nationally competitive</td>
                </tr>
                <tr>
                  <td>Over 450</td>
                  <td>Elite</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These ranges are guides, not official standards. Scores vary by federation, equipment
            and era.
          </p>
        </>
      ),
    },
    {
      heading: "Why DOTS replaced Wilks in many federations",
      body: (
        <>
          <p>
            Analysts found that the original Wilks formula gave some body weights an advantage,
            which affected best-lifter awards. DOTS, short for Dynamic Objective Team Scoring, was
            developed using more recent data and a different curve shape, aiming to treat all body
            weights more evenly. Several federations adopted it from around 2019, while the
            International Powerlifting Federation developed its own system, IPF GL points.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A 60 kg woman totals 360 kg. Her DOTS score is about 399, which is regionally
            competitive. A 90 kg woman with a 430 kg total scores about 383. Even though the heavier
            lifter has a bigger total, the lighter lifter is stronger relative to her size. The
            table under the result lets you see how adding 50 or 100 kg to your total would change
            your score.
          </p>
        </>
      ),
    },
    {
      heading: "Using the total table",
      body: (
        <>
          <p>
            The table under your result shows your DOTS score at your current total and at totals 50
            and 100 kg higher and lower. It is a quick way to see how much progress a given increase
            represents, and to set goals. For many lifters, each additional 10 kg on the total adds
            roughly six to eight DOTS points, though the exact amount depends on body weight.
          </p>
        </>
      ),
    },
    {
      heading: "Improving your DOTS score",
      body: (
        <>
          <p>
            Like any relative score, DOTS rises when your total grows faster than your body weight.
            Focus on the lift with the most room to improve, which is often the bench press for men
            and the bench press or squat for women. Small improvements in each lift add up: 5 kg on
            each of the three lifts adds 15 kg to the total.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing a weight class",
      body: (
        <>
          <p>
            Competitive lifters sometimes use DOTS to decide whether to move up or down a weight
            class. If gaining 5 kg would let you add 30 kg to your total, your DOTS score would
            likely rise, suggesting the move could pay off. If gaining weight adds little strength,
            staying in your current class is usually better. Running a few scenarios through the
            calculator helps make that decision with numbers rather than guesswork.
          </p>
        </>
      ),
    },
    {
      heading: "What DOTS stands for",
      body: (
        <>
          <p>
            DOTS is short for Dynamic Objective Team Scoring. The name reflects its original
            purpose: providing an objective way to score lifters across weight classes for team and
            best-lifter competitions. It was developed by powerlifting enthusiasts using modern
            competition data and has since been adopted by several federations as their primary
            relative strength measure.
          </p>
        </>
      ),
    },
    {
      heading: "DOTS for women",
      body: (
        <>
          <p>
            DOTS uses a separate set of coefficients for women, fitted to women's competition
            results. Because the curve is designed to be fair across the whole body-weight range, it
            tends to give lighter and heavier women more balanced scores than the original Wilks
            formula did. Women who compare their scores with older Wilks-based rankings may notice
            differences, especially at the lightest and heaviest body weights.
          </p>
        </>
      ),
    },
    {
      heading: "Gym totals versus meet totals",
      body: (
        <>
          <p>
            If you calculate DOTS from gym lifts, use your best recent single in each lift performed
            to competition standards: below parallel in the squat, a pause on the chest in the
            bench, and full lockout in the deadlift. Estimated maxes from rep sets are useful for
            tracking, but they tend to give slightly higher totals than you would achieve in
            competition. Meet totals, performed under judges, are the most reliable basis for
            comparison.
          </p>
        </>
      ),
    },
    {
      heading: "Setting a DOTS goal",
      body: (
        <>
          <p>
            A DOTS goal gives you a target that stays meaningful whether your body weight goes up or
            down. For example, a lifter aiming for 400 DOTS can use the calculator to see what total
            they would need at different body weights, then decide whether to focus on strength,
            weight management or both. Breaking the goal into smaller steps, such as 10 to 20 points
            per training cycle, keeps it achievable.
          </p>
        </>
      ),
    },
    {
      heading: "DOTS in team competitions",
      body: (
        <>
          <p>
            Some events score teams by adding up members' DOTS scores, allowing teams with lifters
            of different sizes to compete fairly. Coaches selecting team members can use DOTS to
            identify which lifters contribute most to the team score, rather than simply choosing
            the lifters with the biggest totals.
          </p>
        </>
      ),
    },
    {
      heading: "Tested and untested federations",
      body: (
        <>
          <p>
            Powerlifting federations differ in whether they test athletes for performance-enhancing
            drugs. Totals and DOTS scores in tested federations are generally lower at the top level
            than in untested ones. If you compare your score with published rankings, check which
            type of federation the rankings come from, so you compare like with like.
          </p>
        </>
      ),
    },
    {
      heading: "How much of your score comes from each lift",
      body: (
        <>
          <p>
            For most lifters, the deadlift contributes the largest share of the total, followed by
            the squat, then the bench press. A typical split might be about 35 to 40 percent from
            the deadlift, 35 percent from the squat and 25 to 30 percent from the bench. If one lift
            contributes much less than expected, improving it can raise your total and score
            efficiently.
          </p>
        </>
      ),
    },
    {
      heading: "Body weight scenarios",
      body: (
        <>
          <p>
            DOTS makes it easy to compare plans. A 90 kg man with a 600 kg total scores about 388.
            If he loses 5 kg and keeps the same total, his score rises to roughly 400. If he gains 5
            kg and adds 30 kg to his total, it rises to about 397. Both routes improve the score,
            but in different ways, and seeing the numbers helps a lifter choose which suits their
            goals and preferences.
          </p>
        </>
      ),
    },
    {
      heading: "How often to update your score",
      body: (
        <>
          <p>
            Recalculating after each competition, or at the end of each training block using your
            best singles, gives a clear record of progress. Weekly recalculation from gym estimates
            tends to be noisy and can be discouraging when normal day-to-day variation shows up as
            falling scores. Look for the trend across several months.
          </p>
        </>
      ),
    },
    {
      heading: "DOTS and powerlifting rankings",
      body: (
        <>
          <p>
            Online databases that collect results from many federations often allow sorting by DOTS,
            making it a convenient way to see how a performance compares with lifters around the
            world. When reading these rankings, check the federation, equipment and testing status,
            since these affect totals, and remember that rankings only include lifters who have
            competed.
          </p>
        </>
      ),
    },
    {
      heading: "Starting points for new lifters",
      body: (
        <>
          <p>
            Many new lifters score between 150 and 250 DOTS after their first months of training.
            That is a normal starting point, and the early years often bring rapid improvement as
            technique and strength develop together. Setting a goal of 50 more points over the next
            year is ambitious but realistic for many beginners training consistently.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example across a training year",
      body: (
        <>
          <p>
            A 75 kg woman starts the year with a 300 kg total, scoring about 292 DOTS. Over twelve
            months, she adds 30 kg to her total while her body weight rises to 77 kg. Her new score
            is about 317, a gain of roughly 25 points. Her total rose 10 percent while her body
            weight rose under 3 percent, which the DOTS score captures neatly in a single number.
          </p>
        </>
      ),
    },
    {
      heading: "DOTS for lifters who do not compete",
      body: (
        <>
          <p>
            Plenty of people lift for health, strength and enjoyment without ever stepping on a
            platform. For them, DOTS offers a simple, objective way to see whether they are getting
            stronger relative to their size. Calculating it every few months from your best gym
            lifts, performed with good technique, is enough to track progress and set motivating
            goals.
          </p>
        </>
      ),
    },
    {
      heading: "Limitations of single-number scores",
      body: (
        <>
          <p>
            A single score is useful but incomplete. Two lifters with the same DOTS may have very
            different strengths: one might have a strong deadlift and weak bench, the other the
            reverse. Looking at individual lifts alongside the score helps identify where training
            should focus. The strength standards calculator ranks each lift against body weight
            separately.
          </p>
        </>
      ),
    },
    {
      heading: "Federations and records",
      body: (
        <>
          <p>
            Different federations keep their own records, and DOTS-based rankings are common in some
            federations' databases. If you look up how your score compares with others, use rankings
            from federations with similar rules and testing policies to your own. Comparing a tested
            classic total with untested equipped results, for example, gives a misleading picture.
          </p>
        </>
      ),
    },
    {
      heading: "Body composition and DOTS",
      body: (
        <>
          <p>
            Because DOTS uses total body weight, it does not distinguish between muscle and fat. Two
            lifters of the same weight and total score the same, even if one carries much more
            muscle. Over time, improving body composition, adding muscle and losing fat while
            keeping body weight similar, tends to raise strength and therefore the score.
          </p>
        </>
      ),
    },
    {
      heading: "Why heavier lifters have lower coefficients",
      body: (
        <>
          <p>
            A heavier body carries more muscle, but also more bone, organs and often more fat, none
            of which add directly to lifting strength. In addition, muscle strength depends on
            cross-sectional area, which grows more slowly than body mass as people get larger. The
            DOTS curve captures this: as body weight rises, the coefficient falls, so a heavier
            lifter needs a proportionally larger total to earn the same score as a lighter lifter.
          </p>
          <p>
            This is why a lighter lifter with a smaller total can outscore a heavier one, and why
            relative scores reward getting stronger without simply getting heavier.
          </p>
        </>
      ),
    },
    {
      heading: "How accurate is DOTS?",
      body: (
        <>
          <p>
            No formula perfectly captures the relationship between body weight and strength for
            every individual. DOTS was designed to be as fair as possible across the range of
            competitive body weights, using a large set of results. It works well for most lifters
            in typical weight ranges and less precisely at the very lightest and heaviest weights,
            where fewer lifters compete. Treat small differences of a few points between lifters as
            essentially equal.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking DOTS during a diet",
      body: (
        <>
          <p>
            During a fat-loss phase, a stable or rising DOTS score is one of the clearest signs that
            you are keeping strength while losing weight. If your total stays the same while body
            weight falls, your score rises. If your score drops noticeably, your total may be
            falling faster than your body weight, which can signal that the deficit is too large or
            recovery too poor. Checking your score every few weeks during a diet helps catch this
            early.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing your best lifts",
      body: (
        <>
          <p>
            For a gym DOTS calculation, use the heaviest single you have completed to competition
            standards in each lift within the last few months. If you have not tested singles
            recently, estimates from sets of three to five reps are a reasonable substitute, but
            note them as estimates. Mixing a recent squat with a bench from two years ago gives a
            total that does not reflect your current strength.
          </p>
          <p>
            Recalculating with fresh numbers after each training block keeps the score honest and
            useful for planning.
          </p>
        </>
      ),
    },
    {
      heading: "DOTS for masters and juniors",
      body: (
        <>
          <p>
            DOTS does not include age adjustments, so a 60-year-old and a 25-year-old with the same
            total and body weight receive the same score. In competition, age categories handle
            this, and some events apply separate age coefficients on top of DOTS for masters awards.
            For personal tracking, comparing your own score across years is meaningful at any age,
            and steady scores into later decades are a genuine achievement.
          </p>
        </>
      ),
    },
    {
      heading: "Using DOTS to set realistic expectations",
      body: (
        <>
          <p>
            Seeing where your score sits on the benchmark ranges helps set expectations. A lifter at
            280 DOTS aiming for 450 within a year is likely to be disappointed, but aiming for 320
            is ambitious and achievable for many. Setting goals in steps of 20 to 40 points per year
            for intermediate lifters keeps training focused and motivating without setting up
            frustration.
          </p>
        </>
      ),
    },
    {
      heading: "Scores are a snapshot",
      body: (
        <>
          <p>
            Any DOTS score reflects one day's lifting at one body weight. A poor night's sleep, a
            missed attempt or a slightly heavier weigh-in can move it by several points. Judge
            progress by the trend across several meets or training blocks, and celebrate steady
            improvement rather than chasing a single number.
          </p>
        </>
      ),
    },
    {
      heading: "Sharing your score",
      body: (
        <>
          <p>
            DOTS is widely understood in powerlifting communities, so it is a convenient number to
            share with training partners, coaches and online groups when discussing progress across
            different body weights.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Plan how to raise your DOTS score",
    whenToUse: "When you want a realistic plan to improve your score over the next few months.",
    pasteIn:
      "Your body weight, your best squat, bench and deadlift, your DOTS score and your target.",
    text: `My powerlifting numbers:
Body weight: [weight]
Squat: [kg], Bench: [kg], Deadlift: [kg]
Current DOTS: [score]
Target DOTS: [score] by [date]

1. Tell me which lift has the most room to improve for my body weight.
2. Suggest how many kg I need to add to my total to hit the target at my current body weight.
3. Compare the effect of staying at this body weight with gaining or losing 3 kg.
4. Outline a 12-week training focus to get there.`,
  },
  forCoaches: {
    heading: "Using DOTS with clients",
    body: (
      <>
        <p>
          DOTS gives competitive lifters a clear target that accounts for body weight, which is
          useful when planning weight class changes or deciding where to focus training.
        </p>
        <p>
          Use the total table to set realistic goals. Showing a client that 20 kg on their total
          adds about 14 points makes progress feel concrete.
        </p>
        <p>
          For non-competitive clients, a DOTS score tracked every few months is a simple measure of
          strength relative to body weight, especially during diets.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Programme and track strength for every client",
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
    { label: "Compare with Wilks", href: "/tools/wilks-dots-calculator" },
    { label: "Calculate IPF GL points", href: "/tools/ipf-gl-points-calculator" },
  ],
  nextPitch: "Coaching competitive lifters? Traiv keeps every client's lifts in one place.",
  faq: [
    {
      q: "Which DOTS score counts as strong?",
      a: "Around 300 is a strong gym lifter, 400 nationally competitive and 500 elite.",
    },
    {
      q: "How is DOTS different from Wilks?",
      a: "DOTS uses a newer curve fitted to recent data and treats very light and very heavy lifters more evenly.",
    },
    {
      q: "Which federations use DOTS?",
      a: "Several national and international federations outside the IPF use it for best-lifter awards.",
    },
    { q: "Does DOTS work for women?", a: "Yes. It has separate coefficients for men and women." },
    {
      q: "Does DOTS work on one lift instead of a full total?",
      a: "It is designed for full totals, but some lifters use it informally for single lifts to compare relative strength.",
    },
    {
      q: "How many points is 10 kg on my total worth?",
      a: "Roughly six to eight DOTS points for most lifters, depending on body weight.",
    },
    {
      q: "Is DOTS better than IPF GL points?",
      a: "Neither is objectively better. Use the system your federation uses; for personal tracking, pick one and stay consistent.",
    },
  ],
  keepGoing: [
    { label: "Wilks calculator", href: "/tools/wilks-calculator" },
    { label: "IPF GL points calculator", href: "/tools/ipf-gl-points-calculator" },
    { label: "Strength standards calculator", href: "/tools/strength-standards-calculator" },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Strength scores and programmes for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
