import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Sinclair Calculator: Sinclair Total for Weightlifting",
  description:
    "Free Sinclair calculator. Enter body weight, snatch and clean and jerk to get your Sinclair total and coefficient for comparing Olympic weightlifters.",
  eyebrow: "Free tool · Strength",
  h1: "Sinclair calculator",
  intro: (
    <>
      <p>
        The Sinclair coefficient is used in Olympic weightlifting to compare lifters of different
        body weights. Enter your body weight, your best snatch and clean and jerk, and your sex, and
        this calculator gives your Sinclair total: what your total would be at the heaviest body
        weight.
      </p>
    </>
  ),
  shortAnswer: {
    question: "What is a Sinclair total?",
    answer: (
      <>
        <p>
          The Sinclair total is your weightlifting total (snatch plus clean and jerk) multiplied by
          a coefficient based on your body weight. It estimates what you would lift if you were as
          heavy as the heaviest competitors, so lifters of all sizes can be compared. An 89 kg man
          with a 335 kg total has a Sinclair total of about 405 kg.
        </p>
        <p>
          Lifters at or above the reference body weight have a coefficient of 1, so their Sinclair
          total equals their actual total. Lighter lifters have coefficients above 1.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the Sinclair coefficient is calculated",
      body: (
        <>
          <p>
            For lifters below a reference body weight, the coefficient is 10 raised to the power of
            A × (log10(body weight ÷ b))², where A and b are constants set for men and women. The
            reference weight b is based on the heaviest world-record holders. Lifters at or above b
            have a coefficient of 1. The constants are updated after each Olympic cycle to reflect
            current records; this calculator uses the coefficients in use since 2021.
          </p>
        </>
      ),
    },
    {
      heading: "Why weightlifting uses a different formula",
      body: (
        <>
          <p>
            Olympic weightlifting tests speed, power and technique as well as strength, and the
            relationship between body weight and performance differs from powerlifting. The Sinclair
            formula was developed by Canadian statistician Robert Sinclair specifically for
            weightlifting, and it has been the standard for decades. Powerlifting scores such as
            Wilks and DOTS are not designed for weightlifting totals, and vice versa.
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
      heading: "A worked example",
      body: (
        <>
          <p>
            A 73 kg lifter snatches 130 kg and clean and jerks 160 kg, a 290 kg total. His
            coefficient is about 1.35, giving a Sinclair total of around 391 kg. A 102 kg lifter
            with a 340 kg total has a coefficient of about 1.14 and a Sinclair total of around 387
            kg. Despite a 50 kg difference in totals, they are rated as almost equally strong for
            their size.
          </p>
        </>
      ),
    },
    {
      heading: "Sinclair benchmarks",
      body: (
        <>
          <p>
            For men, Sinclair totals around 250 to 300 kg are typical of recreational lifters with
            some training, 350 to 400 kg of strong national-level competitors, and above 450 kg of
            international elite lifters. For women, totals around 180 to 220 kg are typical of
            recreational lifters, 260 to 300 kg of national competitors, and above 320 kg of
            international elite. These are rough guides that vary between countries and eras.
          </p>
        </>
      ),
    },
    {
      heading: "Masters lifters and the Meltzer-Faber coefficient",
      body: (
        <>
          <p>
            Masters weightlifting competitions often add an age adjustment, known as the
            Sinclair-Meltzer-Faber or SMF coefficient for men and SMHF for women, which multiplies
            the Sinclair total by a factor that rises with age. This lets older lifters compare
            their performances with younger ones. This calculator gives the standard Sinclair total;
            masters lifters can apply their age factor separately.
          </p>
        </>
      ),
    },
    {
      heading: "Improving your Sinclair total",
      body: (
        <>
          <p>
            Weightlifting totals improve through a combination of technique, speed, mobility and
            strength. Many lifters find that technical refinement on the snatch and clean and jerk,
            rather than raw strength gains, produces the fastest improvement in their total.
            Strength work such as front squats, back squats and pulls supports long-term progress.
            Because body weight affects the coefficient, gaining muscle can raise your total but
            lower your coefficient, so the Sinclair total shows whether the trade-off is worth it.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing snatch and clean and jerk",
      body: (
        <>
          <p>
            A common benchmark is that the snatch is around 80 percent of the clean and jerk. If
            your snatch is much lower than that, technique or mobility in the snatch may be holding
            you back; if it is higher, your clean and jerk may have room to improve. Checking this
            ratio alongside your Sinclair total helps decide which lift to prioritise.
          </p>
        </>
      ),
    },
    {
      heading: "How a weightlifting total works",
      body: (
        <>
          <p>
            In Olympic weightlifting, each lifter has three attempts at the snatch and three at the
            clean and jerk. The best successful attempt in each lift is added to give the total. If
            a lifter fails all three attempts in either lift, they do not post a total. The Sinclair
            total is calculated from this official total and the lifter's body weight at weigh-in.
          </p>
        </>
      ),
    },
    {
      heading: "The snatch and the clean and jerk",
      body: (
        <>
          <p>
            The snatch lifts the bar from the floor to overhead in one continuous movement, usually
            catching it in a deep squat before standing up. The clean and jerk is done in two parts:
            the clean brings the bar to the shoulders, usually catching it in a front squat, and the
            jerk drives it overhead. Both demand speed, flexibility, coordination and strength,
            which is why weightlifting totals do not scale with body weight in the same way as
            powerlifting totals.
          </p>
        </>
      ),
    },
    {
      heading: "Weightlifting weight classes",
      body: (
        <>
          <p>
            International weightlifting uses a set of weight categories for men and women that has
            changed several times over the years, most recently to reduce the number of classes.
            Lifters must weigh in at or below their category limit. Sinclair totals let coaches and
            officials compare lifters across categories, for example to award a best-lifter prize at
            a competition with many classes.
          </p>
        </>
      ),
    },
    {
      heading: "Using Sinclair for team scoring",
      body: (
        <>
          <p>
            Club and university weightlifting competitions often score teams using Sinclair totals,
            so that teams with lifters of different sizes can compete fairly. A team's score is
            usually the sum of its members' Sinclair totals. Coaches can use the calculator to
            estimate team scores and decide which lifters to enter.
          </p>
        </>
      ),
    },
    {
      heading: "Technique matters more than in most strength sports",
      body: (
        <>
          <p>
            Small technical improvements can add more to a weightlifting total than months of
            strength training. Bar path, timing of the second pull, speed under the bar and
            receiving position all affect how much a lifter can successfully lift. Many coaches
            recommend that newer lifters spend a large share of their training on technique with
            moderate weights, and track their Sinclair total to see the combined effect of technical
            and strength gains.
          </p>
        </>
      ),
    },
    {
      heading: "Mobility for weightlifting",
      body: (
        <>
          <p>
            Catching a snatch or clean in a deep squat, and holding a bar overhead in a stable
            position, requires good ankle, hip, thoracic and shoulder mobility. Limited mobility
            often caps how much weight a lifter can receive safely, even if they are strong enough
            to pull it. Regular mobility work, overhead squats, and paused squats in the receiving
            positions help improve the ranges needed. Weightlifting shoes with a raised heel make
            deep positions easier for most lifters.
          </p>
        </>
      ),
    },
    {
      heading: "Strength work that supports weightlifting",
      body: (
        <>
          <p>
            Front squats, back squats, clean and snatch pulls, push presses and overhead squats are
            common strength exercises for weightlifters. A strong front squat in particular supports
            the clean, because the lifter must stand up from a deep clean. A typical guideline is
            that the best clean is about 85 to 90 percent of the best front squat. If your clean is
            much lower than that, technique may be the limit; if it is close to your front squat,
            more leg strength will help.
          </p>
        </>
      ),
    },
    {
      heading: "Sinclair for women",
      body: (
        <>
          <p>
            Women's Sinclair coefficients use a lower reference body weight, based on the heaviest
            women's world-record holders. This means coefficients for women at a given body weight
            differ from men's, and the calculator applies the correct set based on your selection.
            Women's Sinclair totals are compared with other women's, not with men's.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking progress over a season",
      body: (
        <>
          <p>
            Recording your Sinclair total after each competition, or after each training block using
            your best lifts, shows whether your relative performance is improving. Because
            weightlifters often manage body weight closely for competition, the Sinclair total is
            particularly useful for separating real progress from changes caused by moving between
            weight classes.
          </p>
        </>
      ),
    },
    {
      heading: "Competition format",
      body: (
        <>
          <p>
            A weightlifting competition starts with the snatch, with each lifter taking up to three
            attempts, followed by the clean and jerk with another three. Lifters choose their
            opening weights in advance and the bar increases through the session, with lifters
            taking their attempts as the weight reaches their chosen numbers. Lifters often open
            conservatively, because missing all three attempts in either lift means no total and no
            Sinclair score.
          </p>
        </>
      ),
    },
    {
      heading: "Typical progress for new lifters",
      body: (
        <>
          <p>
            New weightlifters often improve their totals quickly as technique develops, sometimes
            adding 10 to 20 kg to their total within the first few months. Because technique
            improvements rather than strength drive much of this early progress, Sinclair totals can
            climb steeply at first and then level off to steadier gains as lifters become more
            experienced.
          </p>
        </>
      ),
    },
    {
      heading: "Using Sinclair alongside powerlifting scores",
      body: (
        <>
          <p>
            Some athletes train both weightlifting and powerlifting. Their Sinclair total and their
            Wilks, DOTS or IPF GL points measure different qualities: the Sinclair reflects speed,
            technique and power as well as strength, while powerlifting scores mainly reflect
            maximal strength. Tracking both gives a fuller picture of an athlete's development, but
            the numbers cannot be compared directly.
          </p>
        </>
      ),
    },
    {
      heading: "Common mistakes when calculating Sinclair",
      body: (
        <>
          <ul>
            <li>
              <strong>Using a training total that mixes days.</strong> Use your best lifts from the
              same session or competition for an official comparison.
            </li>
            <li>
              <strong>Using gym body weight rather than weigh-in weight.</strong> The coefficient
              depends on official body weight.
            </li>
            <li>
              <strong>Using powerlifting totals.</strong> The Sinclair coefficient is designed only
              for snatch plus clean and jerk.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "A worked example: two women",
      body: (
        <>
          <p>
            A 59 kg woman snatches 80 kg and clean and jerks 100 kg, a 180 kg total. Her Sinclair
            coefficient is much larger than for a heavier lifter, giving a Sinclair total well above
            her actual total. An 81 kg woman with a 210 kg total has a smaller coefficient. The
            calculator shows both coefficients and Sinclair totals, making it easy to see which
            lifter is relatively stronger, even though the heavier one has the bigger actual total.
          </p>
        </>
      ),
    },
    {
      heading: "Why the reference weight changes",
      body: (
        <>
          <p>
            The Sinclair formula's reference body weight is based on the heaviest world-record
            holders. When records change and the governing body updates its weight classes, the
            reference weight and the A constant are recalculated, usually once per Olympic cycle.
            That is why Sinclair totals from different eras are not perfectly comparable. When
            comparing your total with older results, check which coefficients were in use.
          </p>
        </>
      ),
    },
    {
      heading: "Building a stronger total",
      body: (
        <>
          <p>
            Most weightlifting programmes combine three types of work: the competition lifts and
            their variations for technique and speed, strength work such as squats and pulls, and
            accessory work for the upper back, core and shoulders. Beginners usually benefit most
            from frequent technique practice; experienced lifters often need more strength work to
            keep improving. Tracking the Sinclair total over months shows how the balance of
            training is paying off.
          </p>
        </>
      ),
    },
    {
      heading: "Sinclair for youth lifters",
      body: (
        <>
          <p>
            Young weightlifters are still growing, so their body weight and strength change quickly.
            The Sinclair total helps coaches judge whether improvements reflect real progress or
            simply growth. For youth and junior lifters, the focus should stay on technique,
            mobility and safe progression, with competition results seen as part of long-term
            development rather than ends in themselves.
          </p>
        </>
      ),
    },
    {
      heading: "How the coefficient behaves",
      body: (
        <>
          <p>
            The Sinclair coefficient rises steeply for lighter lifters and approaches 1 as body
            weight nears the reference weight. In practice, a 55 kg lifter might have a coefficient
            around 1.6 to 1.7, an 81 kg lifter around 1.27, and a 109 kg lifter close to 1.1. Above
            the reference weight, the coefficient is exactly 1. This shape reflects how
            weightlifting performance increases with size, but at a decreasing rate as lifters get
            heavier.
          </p>
        </>
      ),
    },
    {
      heading: "Snatch and clean and jerk ratios",
      body: (
        <>
          <p>
            Coaches often compare the snatch with the clean and jerk to identify technical gaps. A
            snatch around 78 to 82 percent of the clean and jerk is typical. A much lower ratio
            suggests the snatch needs technical attention; a higher ratio may mean the jerk or the
            clean is limiting the total. Because the Sinclair total depends on both lifts together,
            closing a gap in the weaker lift is often the fastest way to raise it.
          </p>
        </>
      ),
    },
    {
      heading: "Recording your lifts",
      body: (
        <>
          <p>
            For each training session or competition, record the weights you made and missed for
            both lifts, along with body weight. Over time, this record shows how your total,
            coefficient and Sinclair total change, and which lift is improving fastest. It also
            helps you choose sensible openers for competitions, based on what you reliably make in
            training.
          </p>
        </>
      ),
    },
    {
      heading: "Sinclair and body weight changes",
      body: (
        <>
          <p>
            Moving up a weight category usually increases a lifter's actual total but lowers their
            coefficient. The Sinclair total shows whether the trade-off was worthwhile. If the
            Sinclair total rises after moving up, the extra body weight added more strength than the
            coefficient took away. If it falls, the lifter may perform better in the lighter
            category. Many coaches use this check when deciding whether an athlete should change
            categories.
          </p>
        </>
      ),
    },
    {
      heading: "Sinclair benchmarks by experience",
      body: (
        <>
          <p>
            Rough Sinclair totals for men: beginners in their first year often score 180 to 250 kg,
            intermediate club lifters 250 to 330 kg, national-level competitors 350 kg and up, and
            international elite above 450 kg. For women, beginners often score 120 to 180 kg, club
            lifters 180 to 240 kg, national competitors around 260 kg and up, and international
            elite above 320 kg. These ranges are broad and vary between countries.
          </p>
        </>
      ),
    },
    {
      heading: "Recovery and weightlifting",
      body: (
        <>
          <p>
            Weightlifting is technically demanding, and fatigue quickly degrades technique. Many
            weightlifters train frequently but keep most sessions below maximal weights, saving
            heavy singles for selected days. Good sleep, adequate food and planned lighter weeks
            help lifters perform their best on the days that matter, which is reflected in higher
            totals and Sinclair scores.
          </p>
        </>
      ),
    },
    {
      heading: "Scores are a snapshot",
      body: (
        <>
          <p>
            A Sinclair total reflects one session or competition. Missed attempts, fatigue or a
            heavier weigh-in can change it noticeably. Track it across several competitions to see
            the real trend.
          </p>
        </>
      ),
    },
    {
      heading: "Sharing your total",
      body: (
        <>
          <p>
            When sharing a Sinclair total, mention your body weight and whether the lifts came from
            a competition or training, so others can interpret it correctly.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using Sinclair with clients",
    body: (
      <>
        <p>
          Sinclair totals let you compare lifters in a mixed-weight group, such as a club or team,
          on a single scale, which is useful for team selection and motivating friendly competition.
        </p>
        <p>
          Track each lifter's Sinclair total across training cycles, especially if body weight
          changes. It shows whether gains in the total are keeping pace with weight gain.
        </p>
        <p>
          Check the snatch-to-clean-and-jerk ratio alongside the Sinclair total to identify which
          lift needs attention.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Plan and track weightlifting training for every athlete",
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
    { label: "Estimate a one-rep max", href: "/tools/one-rep-max-calculator" },
    { label: "Load the bar for each lift", href: "/tools/plate-loading-calculator" },
  ],
  nextPitch: "Coaching weightlifters? Traiv keeps every athlete's training and lifts together.",
  faq: [
    {
      q: "What is the Sinclair coefficient?",
      a: "A number based on body weight that adjusts a weightlifting total so lifters of different sizes can be compared.",
    },
    {
      q: "What is a good Sinclair total?",
      a: "For men, around 350 to 400 kg is strong national level; for women, around 260 to 300 kg.",
    },
    {
      q: "Does Sinclair work for powerlifting?",
      a: "No. It was designed for Olympic weightlifting totals. Powerlifting uses Wilks, DOTS or IPF GL points.",
    },
    {
      q: "Why is my coefficient 1?",
      a: "Lifters at or above the reference body weight have a coefficient of 1, so their Sinclair total equals their actual total.",
    },
    {
      q: "How often are the coefficients updated?",
      a: "After each Olympic cycle, based on the current world records.",
    },
    {
      q: "Is there an age adjustment?",
      a: "Masters competitions use an additional age factor, the Meltzer-Faber coefficient, applied to the Sinclair total.",
    },
  ],
  keepGoing: [
    { label: "One-rep max calculator", href: "/tools/one-rep-max-calculator" },
    { label: "Plate loading calculator", href: "/tools/plate-loading-calculator" },
    { label: "Wilks and DOTS calculator", href: "/tools/wilks-dots-calculator" },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Training, lifts and progress for every athlete",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
