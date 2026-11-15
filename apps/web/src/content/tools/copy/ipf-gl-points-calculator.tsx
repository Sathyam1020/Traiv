import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "IPF GL Points Calculator: IPF Goodlift Score",
  description:
    "Free IPF GL points calculator. Enter body weight and total, choose classic or equipped, and get your IPF Goodlift points as used for IPF rankings.",
  eyebrow: "Free tool · Strength",
  h1: "IPF GL points calculator",
  intro: (
    <>
      <p>
        IPF GL points, also called IPF Goodlift points, are the scoring system the International
        Powerlifting Federation uses to compare lifters across body weights and rank best lifters.
        Enter your body weight and total, choose classic or equipped and your sex, and this
        calculator gives your IPF GL points.
      </p>
    </>
  ),
  shortAnswer: {
    question: "What are IPF GL points?",
    answer: (
      <>
        <p>
          IPF GL points divide 100 times your total by a curve based on your body weight, with
          separate formulas for men and women, and for classic (raw) and equipped lifting. A 90 kg
          man with a 700 kg classic total scores about 93 points.
        </p>
        <p>
          As a rough guide, around 70 points is a capable gym lifter, 90 to 100 regionally
          competitive and more than 110 international level. The IPF introduced the formula in 2020
          to replace an earlier system.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How IPF GL points are calculated",
      body: (
        <>
          <p>
            The formula is: points = total × 100 ÷ (A − B × e^(−C × body weight)), where A, B and C
            are constants that differ for men and women and for classic and equipped lifting. The
            curve rises steeply at lower body weights and flattens at higher ones, reflecting how
            strength increases with size. The calculator applies the formula for your category
            directly.
          </p>
        </>
      ),
    },
    {
      heading: "Classic versus equipped",
      body: (
        <>
          <p>
            Classic, or raw, powerlifting allows only a belt, knee sleeves, wrist wraps and a
            singlet. Equipped powerlifting allows supportive suits, bench shirts and knee wraps,
            which can add a great deal of weight to each lift. Because equipped totals are much
            higher, the IPF uses separate coefficients so that classic and equipped lifters are
            scored on comparable scales within their own divisions. Always choose the division you
            actually lifted in.
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
      heading: "IPF GL benchmarks",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">IPF GL points</th>
                  <th scope="col">Typical level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Under 60</td>
                  <td>Beginner to early intermediate</td>
                </tr>
                <tr>
                  <td>60 to 75</td>
                  <td>Intermediate gym lifter</td>
                </tr>
                <tr>
                  <td>75 to 90</td>
                  <td>Strong, experienced lifter</td>
                </tr>
                <tr>
                  <td>90 to 100</td>
                  <td>Regionally competitive</td>
                </tr>
                <tr>
                  <td>100 to 110</td>
                  <td>Nationally competitive</td>
                </tr>
                <tr>
                  <td>Over 110</td>
                  <td>International level</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>These ranges are approximate and can vary between federations and divisions.</p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A 74 kg man totals 600 kg in classic lifting, scoring about 88 IPF GL points. A 105 kg
            man totalling 760 kg scores about 94 points. The heavier lifter's total is 160 kg
            higher, but his relative strength is only slightly greater. A 63 kg woman with a classic
            total of 400 kg scores about 88 points, the same level as the 74 kg man.
          </p>
        </>
      ),
    },
    {
      heading: "Using sub-lifts",
      body: (
        <>
          <p>
            The calculator lets you enter your squat, bench and deadlift separately as well as your
            total. Scoring individual lifts with the same formula is not official, but it can show
            which lift is relatively strongest or weakest for your body weight, which helps decide
            where to focus training.
          </p>
        </>
      ),
    },
    {
      heading: "Why the IPF changed its formula",
      body: (
        <>
          <p>
            For many years, the IPF used the Wilks formula, then briefly an earlier IPF points
            system. Analysis of competition results showed both favoured some weight classes. The GL
            formula was introduced in 2020 using a large dataset of international results, aiming to
            make best-lifter awards as fair as possible across classes and divisions. Because it is
            fitted to elite results, it is designed for competitive totals and is less precise for
            very new lifters.
          </p>
        </>
      ),
    },
    {
      heading: "Planning for competition",
      body: (
        <>
          <p>
            Competitive lifters often use IPF GL points to set meet goals, compare themselves with
            qualifying standards and plan attempts. Running a few totals through the calculator
            shows how many points each additional kilogram is worth, which helps decide whether a
            riskier third attempt is worth it. For many lifters, every 10 kg on the total adds
            roughly 1.3 to 1.5 points, depending on body weight.
          </p>
        </>
      ),
    },
    {
      heading: "Making weight",
      body: (
        <>
          <p>
            Weight classes in IPF competitions have fixed upper limits, and many lifters manage body
            weight in the weeks before a meet. Because points depend on body weight, weighing in a
            little lighter can slightly increase your score at the same total. Aggressive weight
            cuts, however, can reduce strength on the day. Most coaches recommend competing close to
            your natural body weight, especially in the early years of competition.
          </p>
        </>
      ),
    },
    {
      heading: "Masters and juniors",
      body: (
        <>
          <p>
            IPF competitions include age categories, from sub-juniors to masters. IPF GL points
            themselves do not adjust for age, but lifters compete for awards within their age
            category. If you are a masters lifter comparing your score with open lifters, remember
            that strength typically declines gradually with age, so a given score represents a
            higher level of achievement.
          </p>
        </>
      ),
    },
    {
      heading: "The IPF and its competitions",
      body: (
        <>
          <p>
            The International Powerlifting Federation is the largest international powerlifting body
            and runs world championships in both classic and equipped divisions, with age categories
            from sub-juniors to masters. It is a tested federation, meaning athletes are subject to
            anti-doping rules. National federations affiliated with the IPF use the same rules and
            scoring, so IPF GL points from a national meet are directly comparable with
            international results.
          </p>
        </>
      ),
    },
    {
      heading: "IPF weight classes",
      body: (
        <>
          <p>
            The IPF uses fixed weight classes for men and women. Men's classes range from 59 kg up
            to 120 kg and over, and women's from 47 kg up to 84 kg and over, with some additional
            junior classes. Lifters must weigh in at or below the class limit. Within each class,
            the heaviest total wins; across classes, IPF GL points decide best-lifter awards.
          </p>
        </>
      ),
    },
    {
      heading: "Competition standards that affect your total",
      body: (
        <>
          <ul>
            <li>
              <strong>Squat:</strong> the hip crease must go below the top of the knee, with
              commands to start and rack.
            </li>
            <li>
              <strong>Bench press:</strong> the bar must pause motionless on the chest before the
              press command, with head, shoulders and buttocks in contact with the bench.
            </li>
            <li>
              <strong>Deadlift:</strong> the lift must be completed with knees locked and shoulders
              back, without hitching or supporting the bar on the thighs.
            </li>
          </ul>
          <p>Training to these standards ensures that gym totals translate to the platform.</p>
        </>
      ),
    },
    {
      heading: "Attempt selection and points",
      body: (
        <>
          <p>
            A common strategy is to open with a weight you could lift for two or three reps on a bad
            day, take a confident personal best or close to it on the second attempt, and use the
            third attempt to push for a new best if the first two went well. Missing attempts has a
            big effect on the total, so conservative openers protect your score. For lifters chasing
            a points target, calculating the required total before the meet helps plan third
            attempts precisely.
          </p>
        </>
      ),
    },
    {
      heading: "Equipped lifting explained",
      body: (
        <>
          <p>
            Equipped lifters wear supportive gear: a squat suit and knee wraps for the squat, a
            bench shirt for the bench press and a deadlift suit for the deadlift. This gear stores
            elastic energy and can add tens or even hundreds of kilograms to a lifter's total.
            Because the difference is so large, equipped and classic results are scored with
            different coefficients and ranked separately. Lifters who switch between the two should
            track their GL points in each division separately.
          </p>
        </>
      ),
    },
    {
      heading: "A worked comparison across divisions",
      body: (
        <>
          <p>
            A 93 kg man who totals 720 kg classic scores about 94 points. If he trained equipped and
            totalled 850 kg, his equipped GL points would be similar, around 92, reflecting that
            equipped totals are expected to be higher. The separate coefficients allow the IPF to
            compare lifters fairly within each division.
          </p>
        </>
      ),
    },
    {
      heading: "Building toward a higher points score",
      body: (
        <>
          <p>
            Raising IPF GL points comes down to adding kilograms to the total at a stable or lower
            body weight. For most lifters, that means steady progressive training on the three
            lifts, with technique practice to meet competition standards, and supporting accessory
            work for weak points. Because the points curve is relatively flat for heavier lifters,
            they may need larger total increases to gain the same number of points as lighter
            lifters.
          </p>
        </>
      ),
    },
    {
      heading: "Using IPF GL points for qualifying totals",
      body: (
        <>
          <p>
            Many national federations set qualifying standards for championships as minimum totals
            in each weight class, while some events and selection processes consider GL points.
            Checking your projected points against previous winners and qualifiers helps set
            realistic competition goals and shows how far you are from the next level.
          </p>
        </>
      ),
    },
    {
      heading: "Common mistakes when calculating points",
      body: (
        <>
          <ul>
            <li>
              <strong>Using the wrong division.</strong> Classic and equipped coefficients differ
              greatly.
            </li>
            <li>
              <strong>Using gym body weight instead of weigh-in weight.</strong> Points depend on
              the official body weight.
            </li>
            <li>
              <strong>Mixing units.</strong> Make sure body weight and total are both in kilograms
              or both converted from pounds.
            </li>
            <li>
              <strong>Including failed lifts.</strong> Only successful attempts count toward the
              total.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "IPF GL points for women",
      body: (
        <>
          <p>
            The women's coefficients were fitted to women's competition results, so scores for women
            are directly comparable with men's on the same scale. This allows mixed-gender
            best-lifter comparisons at events that use them. As with men, lighter women receive a
            larger multiplier, reflecting how strength scales with body size.
          </p>
        </>
      ),
    },
    {
      heading: "How many points is a personal best worth?",
      body: (
        <>
          <p>
            For a 90 kg man in classic lifting, each 10 kg added to the total is worth about 1.3
            points. For lighter lifters, each kilogram is worth slightly more; for heavier lifters,
            slightly less. Knowing this helps put progress in context: a 30 kg increase in total
            over a year, a very good result for an intermediate lifter, adds roughly 4 points.
          </p>
        </>
      ),
    },
    {
      heading: "Training for a points goal",
      body: (
        <>
          <p>
            A points goal turns into a total goal at a given body weight. Once you know the total
            you need, divide the increase between the three lifts based on where you have the most
            room to improve. Many lifters find their bench press improves most slowly, so a
            realistic plan might ask for larger gains on the squat and deadlift. Spread the target
            across several training blocks rather than expecting it in one.
          </p>
        </>
      ),
    },
    {
      heading: "Recovery before a meet",
      body: (
        <>
          <p>
            In the final one to two weeks before a competition, most lifters reduce training volume
            while keeping some heavy work, a process called a taper. This lets fatigue fall while
            strength stays high, so the lifter arrives at the meet fresh. A good taper can add
            several kilograms to a total and a point or two to GL points compared with arriving
            tired.
          </p>
        </>
      ),
    },
    {
      heading: "Masters lifting and points",
      body: (
        <>
          <p>
            Masters lifters compete in age categories starting at 40, and many set personal bests
            well into their fifties and beyond, especially if they started lifting later in life.
            Comparing GL points within your age category gives a fairer picture than comparing with
            open lifters, and tracking your own points across years shows how training is slowing or
            reversing age-related strength decline.
          </p>
        </>
      ),
    },
    {
      heading: "Using points to plan weight class changes",
      body: (
        <>
          <p>
            If you are considering moving up a weight class, calculate your points at your current
            body weight and total, then at the higher body weight with the total you expect to reach
            there. If the points rise, the move is likely worthwhile. If they fall or stay flat, the
            extra body weight is not adding enough strength to justify the change.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example: comparing two lifters",
      body: (
        <>
          <p>
            Two women compete at the same meet. One weighs 57 kg and totals 370 kg classic; the
            other weighs 84 kg and totals 470 kg. The lighter lifter scores about 87 points and the
            heavier about 89, so despite a 100 kg difference in totals they are close, with the
            heavier lifter slightly stronger for her size. If the best-lifter award goes to the
            highest GL points, the heavier lifter would win by a narrow margin.
          </p>
        </>
      ),
    },
    {
      heading: "Points and personal records",
      body: (
        <>
          <p>
            Setting a new personal record at a lower body weight can produce a bigger jump in points
            than the extra kilograms alone suggest. A lifter who adds 10 kg to their total while
            dropping 2 kg of body weight gains points from both directions. That is one reason
            careful body composition work alongside strength training can be so rewarding for
            competitive lifters.
          </p>
        </>
      ),
    },
    {
      heading: "Classic lifting gear",
      body: (
        <>
          <p>
            Classic lifters may use a belt, knee sleeves, wrist wraps and a singlet, and sometimes
            specific shoes and socks for the deadlift. These items help with stability and support
            but do not store elastic energy the way equipped suits and shirts do. Using the same
            gear in training as on the platform keeps gym totals realistic estimates of competition
            totals.
          </p>
        </>
      ),
    },
    {
      heading: "Understanding the curve",
      body: (
        <>
          <p>
            The GL formula uses an exponential curve that rises steeply for lighter lifters and
            flattens for heavier ones. In practical terms, a lighter lifter needs a smaller total to
            score the same points as a heavier lifter. The steepness of the curve differs between
            men and women, and between classic and equipped divisions, which is why each category
            has its own constants.
          </p>
        </>
      ),
    },
    {
      heading: "IPF GL points for coaches",
      body: (
        <>
          <p>
            Coaches of IPF lifters can use points to rank a squad across weight classes, set
            realistic meet goals, and decide which lifters to send to championships. Reviewing each
            lifter's points after every meet, alongside notes on preparation and attempt selection,
            builds a valuable record of what works for each athlete.
          </p>
        </>
      ),
    },
    {
      heading: "Why GL points use an exponential curve",
      body: (
        <>
          <p>
            Earlier formulas like Wilks used polynomials, which can behave strangely at the edges of
            the body-weight range, bending up or down in ways that do not reflect real strength. The
            exponential curve used in IPF GL points rises smoothly and flattens toward a limit, a
            shape that better matches how strength tends to increase with body size. This makes the
            formula more stable at very light and very heavy body weights, where polynomial curves
            tend to struggle.
          </p>
        </>
      ),
    },
    {
      heading: "Planning a competition year",
      body: (
        <>
          <p>
            Many IPF lifters plan two or three competitions a year, with training blocks between
            them. A common structure is a longer building phase focused on volume and technique,
            followed by a strength phase with heavier work, a peak with near-maximal singles, a
            taper, and the meet itself. Calculating projected GL points at each stage keeps goals
            realistic and helps decide which meets to target.
          </p>
          <p>
            After each meet, a short recovery phase with lighter training and variety helps lifters
            return fresh for the next cycle.
          </p>
        </>
      ),
    },
    {
      heading: "GL points and lifter development",
      body: (
        <>
          <p>
            For developing lifters, GL points provide a clear, comparable measure of progress across
            years, even as body weight changes and lifters move between weight classes. A young
            lifter who grows from the 66 kg class to the 83 kg class over several years can compare
            their points directly to see whether their strength has kept pace with their growth.
            Coaches often use this to identify promising lifters for national squads.
          </p>
        </>
      ),
    },
    {
      heading: "Reading published results",
      body: (
        <>
          <p>
            Meet results published by IPF-affiliated federations usually list each lifter's body
            weight, attempts, total and points. When comparing your points with published results,
            check the division, the age category and the year, since rules and coefficients can
            change. Results from the same federation and division in recent years give the most
            meaningful comparisons.
          </p>
        </>
      ),
    },
    {
      heading: "Using points to compare across weight classes",
      body: (
        <>
          <p>
            Within a single weight class, the heaviest total decides the placings. Points matter
            when comparing across classes, for best-lifter awards, team scores and national
            rankings. Knowing your points tells you how your performance compares with lifters in
            every other class, not just your own, which is useful for setting goals and
            understanding where you stand nationally.
          </p>
        </>
      ),
    },
    {
      heading: "Common questions from new IPF lifters",
      body: (
        <>
          <p>
            New lifters often ask whether they need equipment to compete, whether they need to be
            strong to enter a meet, and how points are used. Classic lifting needs only a belt,
            sleeves, wrist wraps and a singlet, and many lifters compete without a belt. There is no
            minimum strength to enter most local meets. Points are used mainly for best-lifter
            awards and rankings; for most first-time lifters, the goal is simply to post a total and
            enjoy the day.
          </p>
        </>
      ),
    },
    {
      heading: "A sample progression across meets",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Meet</th>
                  <th scope="col">Body weight</th>
                  <th scope="col">Total</th>
                  <th scope="col">GL points (classic, men)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>First meet</td>
                  <td>88 kg</td>
                  <td>560 kg</td>
                  <td>about 75</td>
                </tr>
                <tr>
                  <td>Six months later</td>
                  <td>89 kg</td>
                  <td>600 kg</td>
                  <td>about 80</td>
                </tr>
                <tr>
                  <td>One year later</td>
                  <td>90 kg</td>
                  <td>640 kg</td>
                  <td>about 85</td>
                </tr>
                <tr>
                  <td>Two years later</td>
                  <td>92 kg</td>
                  <td>700 kg</td>
                  <td>about 92</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            This kind of steady progress is realistic for a committed intermediate lifter. Each meet
            adds a few points, and over two years the lifter moves from a solid gym level to a
            regionally competitive one.
          </p>
        </>
      ),
    },
    {
      heading: "Points and nutrition",
      body: (
        <>
          <p>
            Strength responds to eating enough, and especially to eating enough protein, around 1.6
            to 2.2 g per kg of body weight. Lifters who try to cut too much body weight before a
            meet often lose strength, which can lower points even if their body weight falls. A
            steady, moderate approach to body weight, with most of the effort on strength, usually
            produces the best long-term points.
          </p>
        </>
      ),
    },
    {
      heading: "What a points goal does not capture",
      body: (
        <>
          <p>
            Points summarise performance on the day, but they leave out much of what makes a lifter
            successful: consistency across meets, attempt selection, technique under pressure and
            long-term health. A lifter who reliably goes nine for nine with steady totals may be
            better placed for long-term progress than one who posts an occasional big score with
            many misses. Use points as one useful measure among several.
          </p>
          <p>
            Recording attempts made and missed, how each lift felt and what you would change next
            time, alongside points, builds a much richer picture of your development as a lifter.
          </p>
        </>
      ),
    },
    {
      heading: "Converting pounds for IPF calculations",
      body: (
        <>
          <p>
            IPF competitions use kilograms, and the GL formula expects kilograms. If you train in
            pounds, the calculator converts both body weight and total before applying the formula.
            Be careful when estimating totals from gym lifts in pounds: rounding each lift
            separately can shift the total by a kilogram or two, which makes a small difference to
            points.
          </p>
        </>
      ),
    },
    {
      heading: "Sharing your points",
      body: (
        <>
          <p>
            When you share a GL points score, include your division, sex and whether the total came
            from a meet or the gym. Those three details make the number meaningful to anyone reading
            it, and they make comparisons with other lifters fair.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Plan meet attempts from your GL points",
    whenToUse: "When you are preparing for a meet and want attempts that target a points goal.",
    pasteIn: "Your body weight, recent best lifts, division, and the GL points you want to reach.",
    text: `I'm preparing for an IPF meet.
Division: [classic / equipped], Sex: [male / female]
Body weight: [kg]
Recent best: Squat [kg], Bench [kg], Deadlift [kg]
Goal: [GL points]

1. Calculate the total I need for the goal at my body weight.
2. Suggest openers, second and third attempts for each lift that make the goal realistic.
3. Explain which lift gives the most points per kilogram of improvement for me.
4. Flag any attempt that looks too aggressive given my recent training.`,
  },
  forCoaches: {
    heading: "Using IPF GL points with clients",
    body: (
      <>
        <p>
          For IPF lifters, GL points are the most relevant measure of competitive standing. Use them
          to set meet goals and plan attempt selection.
        </p>
        <p>
          Use the sub-lift option to identify weak points. A lift that scores noticeably lower than
          the others is often the best place to focus the next training block.
        </p>
        <p>
          For non-competitive clients, any relative score works, but IPF GL points are a good choice
          if they follow IPF competitions or want to compare with IPF results.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Plan meet preparation for every client",
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
    { label: "Load the bar for each attempt", href: "/tools/plate-loading-calculator" },
  ],
  nextPitch: "Coaching IPF lifters? Traiv keeps every client's training and lifts together.",
  faq: [
    {
      q: "What are IPF GL points?",
      a: "The International Powerlifting Federation's scoring system for comparing lifters across body weights, introduced in 2020.",
    },
    {
      q: "What is a good IPF GL score?",
      a: "Around 75 is a strong gym lifter, 90 to 100 regionally competitive and over 110 international level.",
    },
    {
      q: "What is the difference between classic and equipped?",
      a: "Classic allows only a belt, sleeves and wraps; equipped allows supportive suits and shirts. They use different coefficients.",
    },
    {
      q: "How is IPF GL different from DOTS?",
      a: "It uses a different formula and separate coefficients for classic and equipped lifting, fitted to IPF results.",
    },
    {
      q: "Can I calculate points for one lift?",
      a: "The official formula is for totals, but scoring single lifts informally can show relative strengths and weaknesses.",
    },
    {
      q: "Does body weight change my score?",
      a: "Yes. A lower body weight at the same total gives a slightly higher score.",
    },
    {
      q: "Do IPF GL points adjust for age?",
      a: "No. Age categories are handled separately in competition.",
    },
    {
      q: "Why did the IPF replace Wilks?",
      a: "Analysis showed Wilks favoured some weight classes; the GL formula aims to be fairer across classes and divisions.",
    },
    {
      q: "Are IPF GL points comparable with DOTS?",
      a: "No. They use different scales. Compare scores within the same system.",
    },
    {
      q: "Is it worth cutting weight for a higher score?",
      a: "Small, well-managed reductions can help slightly, but aggressive cuts often reduce strength on the day.",
    },
  ],
  keepGoing: [
    { label: "DOTS calculator", href: "/tools/dots-calculator" },
    { label: "Wilks calculator", href: "/tools/wilks-calculator" },
    { label: "Plate loading calculator", href: "/tools/plate-loading-calculator" },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Meet preparation and training for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
