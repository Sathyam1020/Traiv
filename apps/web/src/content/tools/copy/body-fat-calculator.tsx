import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Body fat calculator",
  description:
    "Estimate body fat percentage with the US Navy tape-measure method. Enter height, neck and waist (plus hip for women) in inches or centimetres.",
  eyebrow: "Free tool · Body composition",
  h1: "Body fat calculator",
  intro: (
    <>
      <p>
        Estimate your body fat percentage with nothing more than a tape measure. Enter your sex,
        height, neck and waist, plus your hip if you are a woman, and see where the result sits
        against common reference ranges.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate body fat percentage at home?",
    answer: (
      <>
        <p>
          Measure your neck and waist (and hip, for women), then apply the US Navy equations. A man
          who is 5 ft 10 in with a 15 in neck and 34 in waist comes out at about 17.5%, in the
          fitness range for men. The calculator does the logarithms for you.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the US Navy method works",
      body: (
        <>
          <p>
            The US Navy method estimates body fat from a few tape measurements and your height. It
            was developed by Hodgdon and Beckett at the Naval Health Research Center in 1984, who
            measured sailors with underwater weighing, then the reference method, and found which
            circumferences best predicted the result. The aim was a test that any recruiter could
            run with a tape measure in a couple of minutes.
          </p>
          <p>
            The equations work on logarithms of the measurements. For men, the key term is waist
            minus neck: a larger waist relative to the neck suggests more abdominal fat. For women,
            the hip is added to the waist before the neck is subtracted, because women store more
            fat on the hips and thighs. In each case, a taller frame lowers the estimate for the
            same circumferences.
          </p>
          <ul>
            <li>
              <strong>Men:</strong> %BF = 86.010 × log10(waist − neck) − 70.041 × log10(height) +
              36.76
            </li>
            <li>
              <strong>Women:</strong> %BF = 163.205 × log10(waist + hip − neck) − 97.684 ×
              log10(height) − 78.387
            </li>
          </ul>
          <p>
            These are the inch forms of the equations. The calculator converts centimetres to inches
            before applying them, so you can measure in either unit.
          </p>
        </>
      ),
    },
    {
      heading: "Where to put the tape",
      body: (
        <>
          <p>
            Accuracy depends far more on where and how you measure than on the formula. Use a
            flexible, non-stretch tape, measure on bare skin, and keep the tape level and snug
            without pressing into the skin.
          </p>
          <ul>
            <li>
              <strong>Neck:</strong> just below the larynx (Adam's apple), with the tape angled
              slightly down toward the front. Look straight ahead and keep your shoulders relaxed
              rather than shrugged.
            </li>
            <li>
              <strong>Waist, men:</strong> horizontally at the level of the navel, at the end of a
              normal breath out. Do not pull the stomach in.
            </li>
            <li>
              <strong>Waist, women:</strong> at the narrowest point of the torso, usually a little
              above the navel, again after a normal breath out.
            </li>
            <li>
              <strong>Hip, women only:</strong> around the widest part of the buttocks, with feet
              together.
            </li>
            <li>
              <strong>Height:</strong> without shoes, standing straight against a wall.
            </li>
          </ul>
          <p>
            Repeat every site at least twice and work from the mean. If two readings differ by more
            than about half a centimetre, measure again. Having someone else hold the tape helps,
            especially for the hip.
          </p>
        </>
      ),
    },
    {
      heading: "Reading your result",
      body: (
        <>
          <p>
            The calculator places your estimate in the American Council on Exercise categories,
            which are among the most widely used reference ranges.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Men</th>
                  <th scope="col">Women</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Essential fat</td>
                  <td>2 to 5%</td>
                  <td>10 to 13%</td>
                </tr>
                <tr>
                  <td>Athletes</td>
                  <td>6 to 13%</td>
                  <td>14 to 20%</td>
                </tr>
                <tr>
                  <td>Fitness</td>
                  <td>14 to 17%</td>
                  <td>21 to 24%</td>
                </tr>
                <tr>
                  <td>Average</td>
                  <td>18 to 24%</td>
                  <td>25 to 31%</td>
                </tr>
                <tr>
                  <td>Above average</td>
                  <td>25% and above</td>
                  <td>32% and above</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Women carry more essential fat than men, linked to hormonal and reproductive function,
            so every band sits higher. Essential fat is the minimum the body needs to function;
            sitting near it for long periods is not a healthy goal for most people.
          </p>
          <p>
            These categories are descriptions, not targets. Many people feel and perform well in the
            fitness or average ranges, and the right place for someone depends on their sport,
            health, age and what they can sustain.
          </p>
        </>
      ),
    },
    {
      heading: "How accurate is a tape measure estimate?",
      body: (
        <>
          <p>
            Against laboratory reference methods, the Navy equations are usually off by no more than
            three or four points for most adults. That is similar to a good consumer bioimpedance
            scale and less precise than DEXA. Error grows at the extremes: very lean, very muscular
            and very heavy people tend to see larger gaps.
          </p>
          <p>
            The bigger source of error is usually the measuring itself. Placing the waist tape two
            centimetres higher or lower, or pulling it tighter, can shift the estimate by a couple
            of points on its own. That is why a consistent routine matters more than the absolute
            number.
          </p>
          <p>
            For tracking change, the method does well. If you measure the same way each time, a
            falling waist with a steady neck reliably reflects fat loss, even if the absolute
            percentage is a few points off. Use the trend across several weeks rather than any
            single reading.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing body fat methods",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">What it needs</th>
                  <th scope="col">Typical use</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tape measure (US Navy)</td>
                  <td>A tape and two minutes</td>
                  <td>Home tracking, coaching check-ins</td>
                </tr>
                <tr>
                  <td>Skinfold calipers</td>
                  <td>Calipers and a trained tester</td>
                  <td>Gyms and sports teams</td>
                </tr>
                <tr>
                  <td>Bioimpedance scale</td>
                  <td>A smart scale</td>
                  <td>Daily home readings, sensitive to hydration</td>
                </tr>
                <tr>
                  <td>DEXA scan</td>
                  <td>A clinic visit</td>
                  <td>Detailed reference measurement</td>
                </tr>
                <tr>
                  <td>Underwater weighing</td>
                  <td>A specialist lab</td>
                  <td>Research</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            No method is perfect, and they rarely agree to the decimal. Pick one, use it
            consistently, and compare a reading only with earlier readings from the same method.
            Switching from a scale to a tape to a scan and comparing the numbers mostly measures the
            difference between the methods.
          </p>
        </>
      ),
    },
    {
      heading: "Body fat versus BMI",
      body: (
        <>
          <p>
            BMI looks only at height and weight, so it cannot tell muscle from fat. Body fat
            percentage describes what your weight is made of. Two people at 80 kg and the same
            height can have very different body fat, and therefore very different health and
            performance pictures.
          </p>
          <p>
            For anyone who trains, body fat is usually the more useful measure. It shows whether a
            change on the scale came from fat, from muscle or from water, and it stops a muscular
            person being told they are overweight when they are not.
          </p>
        </>
      ),
    },
    {
      heading: "Changing your body fat",
      body: (
        <>
          <p>
            Fat loss comes from a sustained energy deficit, supported by enough protein and some
            form of resistance training to protect muscle. A loss of around 0.5 to 1% of body weight
            a week is a common, sustainable pace. Faster than that tends to cost more muscle and is
            harder to keep up.
          </p>
          <p>
            Measure every two to four weeks under the same conditions: morning, before eating, same
            tape, same landmarks. Expect the trend to wobble; water and food in the gut can move the
            waist reading by a centimetre from day to day.
          </p>
        </>
      ),
    },
    {
      heading: "Why body fat matters for health",
      body: (
        <>
          <p>
            Body fat is not simply stored energy. Fat tissue releases hormones and signalling
            molecules that affect appetite, blood sugar control and inflammation. A healthy amount
            supports hormone production, protects organs and keeps the body warm. Too little
            disrupts menstrual cycles, weakens bones and lowers resilience to illness. Too much,
            particularly around the abdomen, raises the risk of type 2 diabetes, heart disease and
            fatty liver.
          </p>
          <p>
            Where fat is stored matters as much as how much there is. Visceral fat, packed around
            the organs inside the abdomen, is the type most closely linked with metabolic disease.
            Subcutaneous fat under the skin of the hips and thighs carries less risk. A tape
            measurement at the waist picks up visceral fat in a way that a weight-based measure
            cannot, which is part of why circumference methods remain useful.
          </p>
        </>
      ),
    },
    {
      heading: "How body fat changes with age",
      body: (
        <>
          <p>
            Body fat tends to rise with age even when weight stays the same, because muscle mass
            falls from around the age of 30 unless it is trained. For women, the menopause brings a
            shift of fat toward the abdomen. For men, fat around the middle often increases through
            middle age.
          </p>
          <p>
            Reference ranges that ignore age can therefore look harsher for older adults. A
            55-year-old at 24% body fat is close to typical for his age group; the same figure in a
            25-year-old sits higher within the average band. Resistance training and enough protein
            slow the loss of muscle, which keeps body fat lower for the same weight and supports
            strength and independence later in life.
          </p>
        </>
      ),
    },
    {
      heading: "Losing fat without losing muscle",
      body: (
        <>
          <p>
            When people diet hard without training, a large share of the weight they lose can come
            from muscle. That makes the scale look good while body fat percentage barely moves.
            Three habits change the outcome:
          </p>
          <ul>
            <li>
              <strong>Lift weights two to four times a week.</strong> Training gives the body a
              reason to keep its muscle during a deficit.
            </li>
            <li>
              <strong>Eat enough protein.</strong> Around 1.6 to 2.2 g per kilogram of body weight a
              day is a common range for people trying to keep muscle while losing fat.
            </li>
            <li>
              <strong>Keep the deficit moderate.</strong> Aim for about 0.5 to 1% of body weight a
              week rather than the fastest possible loss.
            </li>
          </ul>
          <p>
            Measured this way, a client might lose four kilograms over two months while body fat
            falls by three or four points. That is a far better result than losing six kilograms and
            keeping the same percentage.
          </p>
        </>
      ),
    },
    {
      heading: "Common measuring mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Pulling the tape too tight.</strong> The tape should sit flat on the skin
              without denting it.
            </li>
            <li>
              <strong>Measuring over clothing.</strong> Even a thin shirt adds width and lowers
              precision.
            </li>
            <li>
              <strong>Holding the breath or sucking in.</strong> Measure at the end of a normal,
              relaxed breath out.
            </li>
            <li>
              <strong>Letting the tape tilt.</strong> A tape that dips at the back reads longer. Use
              a mirror or a helper.
            </li>
            <li>
              <strong>Changing the landmark.</strong> For men, keep to the navel; for women, the
              narrowest point. Moving between them changes the result.
            </li>
            <li>
              <strong>Measuring after a large meal or a workout.</strong> Both temporarily change
              the waist reading.
            </li>
          </ul>
          <p>
            Fixing these makes the estimate repeatable, which is what lets you trust a change from
            one month to the next.
          </p>
        </>
      ),
    },
    {
      heading: "Body fat for athletes and lifters",
      body: (
        <>
          <p>
            Athletes in different sports settle at very different body fat levels. Endurance runners
            and cyclists often sit low because extra mass costs energy over distance. Strength
            athletes, throwers and rugby forwards often carry more because mass helps them produce
            and absorb force. Neither is wrong; the right level depends on the demands of the sport.
          </p>
          <p>
            For lifters, the tape method's error grows when the neck is unusually thick from
            training. A heavily developed neck lowers the waist-minus-neck figure and can make the
            estimate read lean. If you train your neck or carry a lot of upper-body muscle, compare
            the tape with a scan once, then use the tape for trends.
          </p>
          <p>
            Very low body fat is a short-term state for most athletes, reached for a competition and
            then relaxed. Holding it year-round can affect hormones, sleep, mood and performance. A
            coach can help plan when to push lower and when to ease off.
          </p>
        </>
      ),
    },
    {
      heading: "Body fat, photos and the scale together",
      body: (
        <>
          <p>
            No single measure tells the whole story. The scale moves fastest but mixes fat, muscle,
            water and food. Body fat estimates move slowly and carry a margin of error. Progress
            photos show changes in shape that numbers miss, such as a narrower waist or more
            definition in the shoulders.
          </p>
          <p>
            Used together, they correct one another. If the scale stalls for two weeks while the
            waist shrinks and the photos look leaner, fat is still coming off and water or muscle is
            masking it. If all three stall for a month, the plan probably needs adjusting. Take
            photos in the same light, pose and clothing each time so they can be compared fairly.
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
    { label: "Navy body fat calculator", href: "/tools/navy-body-fat-calculator" },
    { label: "Lean body mass calculator", href: "/tools/lean-body-mass-calculator" },
    { label: "BMI calculator", href: "/tools/bmi-calculator" },
  ],
  nextPitch: "Use these tools to build a fuller picture, then review it with your coach.",
  faq: [
    {
      q: "Is the US Navy body fat method accurate?",
      a: "For most people it lands within about three to four percentage points of lab methods. Consistent measuring matters more than the formula, and it is reliable for tracking change over time.",
    },
    {
      q: "Why do women need a hip measurement?",
      a: "Women tend to store more fat on the hips and thighs, so the women's equation adds the hip to the waist. Without it the estimate would miss much of that fat.",
    },
    {
      q: "What is a healthy body fat percentage?",
      a: "Common ranges are about 14 to 24% for men and 21 to 31% for women. Where someone feels and performs best depends on their sport, age and health.",
    },
    {
      q: "Should I measure in inches or centimetres?",
      a: "Either works. The calculator converts centimetres to inches before applying the original equations, so the result is the same.",
    },
    {
      q: "Why did my body fat go up when I lost weight?",
      a: "Small shifts are usually measuring error or water. Check you measured at the same landmarks and time of day, and look at the trend across a few weeks.",
    },
    {
      q: "Can I use this if I am very muscular?",
      a: "You can, but expect a larger margin of error at the extremes. A DEXA scan gives a better reference reading if you need one.",
    },
  ],
  disclaimer: (
    <>
      <p>
        General information only, not medical advice. Tape-measure estimates have a margin of error.
        Speak to a doctor about your weight and health.
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
