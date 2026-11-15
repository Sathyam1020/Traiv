import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Waist-to-height ratio calculator",
  description:
    "Divide your waist by your height to get your waist-to-height ratio. See whether your waist is under half your height, the widely used healthy guide.",
  eyebrow: "Free tool · Body composition",
  h1: "Waist-to-height ratio calculator",
  intro: (
    <>
      <p>
        Enter your waist and your height, in centimetres or inches, to get your waist-to-height
        ratio and see where it falls against the widely used guide of keeping your waist under half
        your height.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate waist-to-height ratio?",
    answer: (
      <>
        <p>
          Divide waist circumference by height, using the same unit for both. An 80 cm waist at 180
          cm tall gives 80 ÷ 180 = 0.44, inside the healthy range. A ratio of 0.5 or more, meaning a
          waist at least half your height, is linked with higher health risk.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why the waist matters",
      body: (
        <>
          <p>
            Where the body stores fat matters for health. Fat around the abdomen, particularly
            visceral fat packed around the organs, is closely linked with type 2 diabetes, high
            blood pressure, heart disease and fatty liver. Fat on the hips and thighs carries less
            of that risk. A measure of size that ignores the waist, such as BMI, misses this
            difference.
          </p>
          <p>
            The waist-to-height ratio captures it with one simple division. A larger waist for a
            given height suggests more abdominal fat. Dividing by height adjusts for body size, so a
            tall person is not penalised simply for having a longer torso. The result works across
            adults of different heights, sexes and many ethnic backgrounds with a single cut-off.
          </p>
        </>
      ),
    },
    {
      heading: "The 0.5 guide",
      body: (
        <>
          <p>
            The best-known guide is simple: a waist smaller than half your height, which is a ratio
            below 0.5. It was proposed by Margaret Ashwell and colleagues in the 1990s and has since
            been supported by large reviews. In 2022, the UK's National Institute for Health and
            Care Excellence (NICE) recommended that adults use it alongside BMI, with a ratio of 0.5
            to 0.59 indicating increased health risk and 0.6 or more indicating high risk.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Ratio</th>
                  <th scope="col">What it suggests</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Below 0.4</td>
                  <td>Below the usual range; may be very lean</td>
                </tr>
                <tr>
                  <td>0.4 to 0.49</td>
                  <td>Healthy range</td>
                </tr>
                <tr>
                  <td>0.5 to 0.59</td>
                  <td>Increased health risk</td>
                </tr>
                <tr>
                  <td>0.6 and above</td>
                  <td>High health risk</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            A ratio below 0.4 is not automatically a concern, but for people who are not naturally
            slim it can be a sign of being underweight. The calculator flags it so you can consider
            it in context.
          </p>
        </>
      ),
    },
    {
      heading: "Working through examples",
      body: (
        <>
          <p>
            Someone 180 cm tall with an 80 cm waist has a ratio of 80 ÷ 180 = 0.44, inside the
            healthy range. To stay under 0.5, their waist would need to stay under 90 cm.
          </p>
          <p>
            In inches, a person 5 ft 10 in tall (70 in) with a 34 in waist has a ratio of 34 ÷ 70 =
            0.49, just inside the healthy range. Someone 5 ft 8 in tall (68 in) with a 38 in waist
            has a ratio of 38 ÷ 68 = 0.56, in the increased-risk range. Their half-height waist
            would be 34 in.
          </p>
          <p>
            Centimetres and inches give the same answer here, provided waist and height are entered
            in the same unit. Mixing inches and centimetres is the most common mistake.
          </p>
        </>
      ),
    },
    {
      heading: "How to measure your waist",
      body: (
        <>
          <p>
            Use a flexible, non-stretch tape. Stand upright with your feet together and your weight
            evenly spread, and breathe out normally. Find the bottom of your lowest rib and the top
            of your hip bone, and place the tape midway between them, usually close to the level of
            the navel. Keep the tape level all the way round and snug without pressing into the
            skin.
          </p>
          <p>
            Measure on bare skin rather than over clothing. Take two readings; if they differ by
            more than a centimetre, take a third and use the average of the two closest. Measure in
            the morning, before eating, when the abdomen is least affected by food and drink.
          </p>
          <p>
            Different guidelines use slightly different waist sites. The WHO uses the midpoint
            between rib and hip bone; some US guidance uses the top of the hip bone. Choose one and
            keep to it, so your readings can be compared over time.
          </p>
        </>
      ),
    },
    {
      heading: "Waist-to-height ratio versus BMI",
      body: (
        <>
          <p>
            BMI uses weight and height, so it cannot tell where fat is stored or whether weight is
            muscle. The waist-to-height ratio uses a tape measure, so it picks up abdominal fat
            directly. Studies comparing the two have found the ratio predicts cardiometabolic risk
            at least as well as BMI, and often better.
          </p>
          <p>
            The two work well together. A person with a BMI in the overweight range but a
            waist-to-height ratio below 0.5 may be muscular with little abdominal fat. A person with
            a healthy BMI but a ratio above 0.5 may carry more visceral fat than their weight
            suggests, sometimes described as normal-weight central obesity. NICE suggests using both
            for adults with a BMI under 35.
          </p>
        </>
      ),
    },
    {
      heading: "Why one cut-off works for most people",
      body: (
        <>
          <p>
            Many health measures need different thresholds for men and women or for different ethnic
            groups. The waist-to-height ratio is unusual in that the 0.5 cut-off performs reasonably
            well across these groups. Height already accounts for much of the difference in body
            size between people.
          </p>
          <p>
            It is not perfect. Some research suggests slightly lower thresholds may suit certain
            Asian populations, and the ratio has not been validated as thoroughly in older adults or
            during pregnancy. For most adults, though, 0.5 is a dependable and easy-to-remember
            guide.
          </p>
        </>
      ),
    },
    {
      heading: "Children and teenagers",
      body: (
        <>
          <p>
            The waist-to-height ratio has been studied in children from about the age of five, and
            the 0.5 guide appears to apply there too. That makes it simpler than BMI for children,
            which needs age- and sex-specific charts. It is still best interpreted by a health
            professional for anyone under 18, since growth affects body proportions.
          </p>
        </>
      ),
    },
    {
      heading: "Lowering your ratio",
      body: (
        <>
          <p>
            Because height doesn't change in adulthood, the only way to lower the ratio is to reduce
            your waist. Abdominal fat, and visceral fat in particular, responds well to the same
            habits that reduce body fat overall: a modest calorie deficit, regular physical
            activity, enough sleep and limited alcohol.
          </p>
          <p>
            Exercise appears to reduce visceral fat even when weight barely changes. Both aerobic
            exercise, such as brisk walking, cycling or running, and resistance training help. Spot
            exercises like sit-ups strengthen the abdominal muscles but do not specifically burn fat
            from the waist.
          </p>
          <p>
            Expect the waist to fall by a centimetre or two a month with consistent effort. For
            someone 175 cm tall with a 92 cm waist, a ratio of 0.53, reaching 87 cm would bring the
            ratio below 0.5. That is a concrete, measurable goal, often reached in two to four
            months.
          </p>
        </>
      ),
    },
    {
      heading: "Using the ratio to track progress",
      body: (
        <>
          <p>
            The waist-to-height ratio is well suited to tracking because it relies on a single tape
            measurement that changes in response to fat loss. Measure every two to four weeks, at
            the same time of day and the same site. Write down the waist measurement, not just the
            ratio, so you can see the change in centimetres or inches.
          </p>
          <p>
            Weight and waist do not always move together. During the early weeks of a new training
            plan, weight may stay flat while the waist shrinks as fat is lost and muscle gained. The
            waist reading can show progress the scale misses, which helps keep motivation up.
          </p>
        </>
      ),
    },
    {
      heading: "What the ratio cannot tell you",
      body: (
        <>
          <p>
            A tape measure cannot separate visceral fat from fat just under the skin of the abdomen.
            Two people with the same waist may have different amounts of visceral fat. Bloating, a
            full stomach or poor posture can also change the reading from day to day.
          </p>
          <p>
            The ratio is a screening tool, not a diagnosis. A high ratio does not mean someone has a
            disease, and a low ratio does not rule one out. Blood pressure, blood tests and a
            doctor's assessment give the fuller picture. Use the ratio as a quick, repeatable check
            that tells you when it might be worth looking further.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: adding the ratio to check-ins",
      body: (
        <>
          <p>
            The waist-to-height ratio is one of the easiest measures to add to a client's routine.
            It needs only a tape, takes a minute, and the target, a waist under half your height, is
            simple to explain. Clients can relate to a waist size more easily than to a body fat
            percentage.
          </p>
          <p>
            Ask clients to send the raw waist measurement at each check-in. Calculate the ratio,
            track the waist trend, and celebrate progress toward the 0.5 mark. For clients whose
            weight barely moves, a falling waist is often the clearest evidence that their effort is
            paying off.
          </p>
        </>
      ),
    },
    {
      heading: "Common questions about measuring",
      body: (
        <>
          <ul>
            <li>
              <strong>Should I measure at the navel?</strong> The navel is close to the midpoint for
              many people, but not all. Use the midpoint between the lowest rib and top of the hip
              bone if you can find them.
            </li>
            <li>
              <strong>Should I breathe in or out?</strong> Measure at the end of a normal breath
              out, without holding it or pulling the stomach in.
            </li>
            <li>
              <strong>Can I measure over a shirt?</strong> Bare skin is better. Clothing adds width
              and reduces accuracy.
            </li>
            <li>
              <strong>How tight should the tape be?</strong> Snug and flat against the skin, without
              pressing in.
            </li>
            <li>
              <strong>What if my readings vary?</strong> Take two or three and average them.
              Variation of half a centimetre is normal.
            </li>
          </ul>
          <p>
            Consistency matters more than perfection. Measuring the same way each time is what makes
            changes meaningful.
          </p>
        </>
      ),
    },
    {
      heading: "Waist-to-height ratio and age",
      body: (
        <>
          <p>
            Waist size tends to increase with age, even when weight stays steady, as fat shifts
            toward the abdomen and muscle declines. For women, the change often speeds up around the
            menopause. The 0.5 guide still applies, but it may take more effort to stay under it in
            later decades.
          </p>
          <p>
            Regular strength training and an active lifestyle help slow these changes. For older
            adults, keeping the ratio under 0.5 is linked with lower cardiometabolic risk, and the
            same habits that protect it also support strength, balance and mobility.
          </p>
        </>
      ),
    },
    {
      heading: "A quick reference by height",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Height</th>
                  <th scope="col">Waist for a ratio of 0.5</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>155 cm (5 ft 1 in)</td>
                  <td>77.5 cm (30.5 in)</td>
                </tr>
                <tr>
                  <td>165 cm (5 ft 5 in)</td>
                  <td>82.5 cm (32.5 in)</td>
                </tr>
                <tr>
                  <td>175 cm (5 ft 9 in)</td>
                  <td>87.5 cm (34.4 in)</td>
                </tr>
                <tr>
                  <td>185 cm (6 ft 1 in)</td>
                  <td>92.5 cm (36.4 in)</td>
                </tr>
                <tr>
                  <td>195 cm (6 ft 5 in)</td>
                  <td>97.5 cm (38.4 in)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            A waist below the figure for your height keeps your ratio under 0.5. The calculator
            shows the exact figure for the height you enter.
          </p>
        </>
      ),
    },
    {
      heading: "Ratio and body type",
      body: (
        <>
          <p>
            Some people naturally carry a wider rib cage or a longer torso, which can raise the
            waist slightly for their height. Athletes with very developed core muscles may also
            measure a little larger. In those cases, a ratio just above 0.5 may reflect build more
            than fat. Tracking the trend over time, and comparing with other measures such as body
            fat, helps separate the two.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Use the result with your clients",
    body: (
      <>
        <p>
          A single body measurement tells you where a client is today. A series of them, taken the
          same way, tells you which direction they are moving. Agree on a measuring routine at the
          first check-in: same time of day, same tape or scale, same landmarks. Then repeat it every
          two to four weeks rather than every few days, so normal day-to-day swings in water and
          food volume don't crowd out the real trend.
        </p>
        <p>
          Talk about the number with care. Many clients carry years of history with the scale and
          with words like overweight. Explain what the measure can and cannot see, pair it with
          something the client can feel, such as energy, strength or how clothes fit, and keep the
          conversation on the next useful action rather than the label.
        </p>
      </>
    ),
  },
  pitch: {
    key: "check-ins",
    heading: "Keep every measurement in one place",
    body: (
      <>
        <p>
          In Traiv, clients log weight, measurements and progress photos in their check-ins, and you
          see the trend beside their plan. No spreadsheets to chase, and no numbers lost in chat.
        </p>
      </>
    ),
  },
  next: [
    { label: "Waist-to-hip ratio calculator", href: "/tools/waist-to-hip-ratio-calculator" },
    { label: "BMI calculator", href: "/tools/bmi-calculator" },
    { label: "Body fat calculator", href: "/tools/body-fat-calculator" },
  ],
  nextPitch: "Use these tools to build a fuller picture, then review it with your coach.",
  faq: [
    {
      q: "What is a healthy waist-to-height ratio?",
      a: "Below 0.5, meaning a waist less than half your height. A ratio from 0.5 to 0.59 suggests increased health risk, and 0.6 or above suggests high risk.",
    },
    {
      q: "Is waist-to-height ratio better than BMI?",
      a: "For abdominal fat and cardiometabolic risk, it often predicts at least as well. The two work best together.",
    },
    {
      q: "Does the 0.5 rule work for men and women?",
      a: "Yes. The same cut-off works reasonably well for both sexes and across many ethnic groups.",
    },
    {
      q: "Where should I measure my waist?",
      a: "Midway between the lowest rib and the top of the hip bone, on bare skin, after a normal breath out.",
    },
    {
      q: "Can I use inches?",
      a: "Yes. Use the same unit for waist and height and the ratio is the same.",
    },
    {
      q: "What should I do if my ratio is 0.5 or higher?",
      a: "Treat it as a prompt to look at habits and talk to a doctor, who can check blood pressure, blood sugar and cholesterol.",
    },
  ],
  disclaimer: (
    <>
      <p>
        General information only, not medical advice. Waist measures are screening tools and do not
        diagnose any condition. Speak to a doctor about your health.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Check-ins in Traiv", href: "/features/check-ins" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Track every client's progress under your name",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
