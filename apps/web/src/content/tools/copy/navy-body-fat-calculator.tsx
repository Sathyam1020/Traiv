import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "US Navy body fat calculator",
  description:
    "Estimate body fat with the US Navy circumference method. Add your weight to see fat mass and lean mass in pounds or kilograms.",
  eyebrow: "Free tool · Body composition",
  h1: "US Navy body fat calculator",
  intro: (
    <>
      <p>
        Run the US Navy circumference method with a tape measure: height, neck and waist, plus hip
        for women. Add your weight if you want the result split into fat mass and lean mass.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How does the US Navy body fat calculator work?",
    answer: (
      <>
        <p>
          It applies the Hodgdon and Beckett equations to your height and tape measurements. A man
          at 5 ft 10 in with a 15 in neck and a 34 in waist gets about 17.5%. A woman at 5 ft 5 in
          with a 13 in neck, 30 in waist and 38 in hip gets about 28.6%.
        </p>
        <p>
          If you enter weight, the calculator multiplies it by the percentage to give fat mass, and
          the remainder is lean mass.
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
      heading: "Fat mass and lean mass from the same tape",
      body: (
        <>
          <p>
            A percentage on its own can be hard to act on. Adding your weight turns it into two
            quantities you can track: fat mass, the weight of the fat itself, and lean mass,
            everything else, including muscle, bone, organs and water.
          </p>
          <p>
            Take the man in the example above at 180 lb. At 17.5% body fat, fat mass is about 31.5
            lb and lean mass about 148.5 lb. If, eight weeks later, he weighs 174 lb at 15%, fat
            mass has dropped to about 26 lb while lean mass sits near 148 lb. The scale shows six
            pounds lost; the split shows that almost all of it was fat, which is what a well-run fat
            loss phase aims for.
          </p>
          <p>
            Lean mass also feeds other calculations. Katch-McArdle BMR and protein targets set per
            kilogram of lean mass both start from it, so a reasonable estimate makes those numbers
            more personal than ones based on total weight.
          </p>
        </>
      ),
    },
    {
      heading: "The method's place in the military",
      body: (
        <>
          <p>
            The US armed forces have used circumference methods for decades to check that service
            members meet body composition standards. Each branch sets its own maximum body fat by
            age and sex, and the tape test is the usual way to check it when someone exceeds the
            weight-for-height screening table.
          </p>
          <p>
            In 2023 the US Army moved to a simpler one-site abdominal tape equation for most
            soldiers, and other branches have reviewed their methods. The two- and three-site
            equations on this page remain the most widely known version and the one most civilian
            calculators use.
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
      heading: "Making your readings consistent",
      body: (
        <>
          <ol>
            <li>
              Measure first thing in the morning, after using the toilet and before eating or
              drinking much.
            </li>
            <li>Use the same flexible tape every time and keep it level all the way round.</li>
            <li>Measure on bare skin, with relaxed posture and a normal breath out.</li>
            <li>Take each site two or three times and average the readings.</li>
            <li>Record the numbers, not only the percentage, so you can see which site changed.</li>
            <li>Repeat every two to four weeks, not daily.</li>
          </ol>
          <p>
            Keeping the raw circumferences is worth the small effort. If the estimate moves, you can
            see whether the waist came down, the neck went up or a measurement slipped. That makes
            the trend easier to trust and the coaching conversation more specific.
          </p>
        </>
      ),
    },
    {
      heading: "When the number looks wrong",
      body: (
        <>
          <p>
            If an estimate seems far from what you expect, check the inputs before the body. A waist
            measured at the narrowest point rather than the navel, for a man, will read low. A neck
            measured too high, under the jaw, will also lower the result. Entering centimetres while
            the unit is set to inches produces nonsense, and the calculator will usually refuse a
            waist smaller than the neck.
          </p>
          <p>
            Some people are simply outliers. Those with a very muscular neck, a large rib cage or an
            unusual fat distribution can get estimates several points away from a scan. If the tape
            says one thing and a DEXA scan says another, trust the scan for the absolute number and
            keep using the tape for the trend.
          </p>
        </>
      ),
    },
    {
      heading: "Using the result to set a target",
      body: (
        <>
          <p>
            A body fat estimate becomes useful when it points to a goal you can reach and measure.
            Start from lean mass: if a 180 lb man at 17.5% has about 148.5 lb of lean mass and wants
            to reach 13%, divide 148.5 by 0.87 to get a target weight of about 171 lb, if lean mass
            holds steady. That is roughly 9 lb of fat to lose.
          </p>
          <p>
            At a pace of 0.5 to 1% of body weight a week, that is about two to three months of work.
            Writing it this way, as a target weight and a timeframe tied to a measurable lean mass,
            gives a coach and client something concrete to review, rather than a vague wish to get
            leaner.
          </p>
          <p>
            Check the target against the person's sport, health and life. Very low body fat is hard
            to sustain, can disrupt hormones and sleep, and is not required for most goals. For many
            people, moving from the average to the fitness range is the change that makes the most
            difference.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring women accurately",
      body: (
        <>
          <p>
            The women's equation uses three sites, so there is more room for small errors to add up.
            The hip measurement in particular varies with stance: feet together, weight on both feet
            and the tape level around the widest part of the buttocks. A partner or a mirror makes
            this much easier.
          </p>
          <p>
            Hormonal cycles can shift water retention by a kilogram or more, which can change the
            waist and hip readings slightly. Measuring at the same point in the cycle each month
            gives a cleaner comparison. After pregnancy, the hip and waist can take many months to
            settle, so treat estimates in that period as rough.
          </p>
          <p>
            Women's healthy ranges sit higher than men's for good reason. Essential fat supports
            reproductive and hormonal health, and a reading in the low teens for a woman is closer
            to an athletic extreme than a general target.
          </p>
        </>
      ),
    },
    {
      heading: "A worked tracking example",
      body: (
        <>
          <p>
            Here is how a twelve-week fat loss phase might look for a man at 5 ft 10 in, measured
            every four weeks with the same tape and routine.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Week</th>
                  <th scope="col">Weight</th>
                  <th scope="col">Neck</th>
                  <th scope="col">Waist</th>
                  <th scope="col">Body fat</th>
                  <th scope="col">Lean mass</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>180 lb</td>
                  <td>15 in</td>
                  <td>34 in</td>
                  <td>17.5%</td>
                  <td>148.5 lb</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>177 lb</td>
                  <td>15 in</td>
                  <td>33.25 in</td>
                  <td>16.0%</td>
                  <td>148.7 lb</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>174 lb</td>
                  <td>15 in</td>
                  <td>32.5 in</td>
                  <td>14.4%</td>
                  <td>148.9 lb</td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>172 lb</td>
                  <td>15 in</td>
                  <td>32 in</td>
                  <td>13.4%</td>
                  <td>149.0 lb</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The scale fell by eight pounds and the waist by two inches. Lean mass, calculated from
            the estimate, held steady and even edged up by half a pound, which is within measuring
            error. Read together, the numbers say that the loss was almost entirely fat, and that
            the training and protein targets were doing their job.
          </p>
        </>
      ),
    },
    {
      heading: "What the estimate cannot tell you",
      body: (
        <>
          <p>
            A tape method gives a single whole-body percentage. It cannot show how much of your fat
            is visceral, whether you have lost bone density, how much water you are holding or where
            in the body muscle has changed. It also does not measure fitness, blood pressure or
            blood markers, which matter more for health than any body fat figure.
          </p>
          <p>
            Treat the result as a practical tracking tool. For a medical question, such as concerns
            about weight-related illness, a doctor will use their own measurements and tests.
          </p>
        </>
      ),
    },
    {
      heading: "Why the neck is in the formula",
      body: (
        <>
          <p>
            It can seem odd that the neck appears in a body fat equation. The neck acts as a
            stand-in for frame size and lean mass. A larger neck usually belongs to a larger, more
            muscular frame, which would carry a bigger waist even at the same body fat. Subtracting
            the neck from the waist adjusts for that, so a broad-framed person is not marked down
            simply for being big.
          </p>
          <p>
            Height plays a similar role. A tall person naturally has a longer torso and larger
            circumferences, so the height term lowers the estimate for a given waist. Together, the
            neck and height terms let the equations compare people of different builds on the same
            scale.
          </p>
        </>
      ),
    },
    {
      heading: "Frequently confused terms",
      body: (
        <>
          <ul>
            <li>
              <strong>Body fat percentage:</strong> fat mass as a share of total body weight.
            </li>
            <li>
              <strong>Fat mass:</strong> the weight of the fat itself, in pounds or kilograms.
            </li>
            <li>
              <strong>Lean body mass:</strong> total weight minus fat mass, including muscle, bone,
              organs and water.
            </li>
            <li>
              <strong>Fat-free mass:</strong> often used as a synonym for lean body mass in
              calculators, though in research it excludes the small amount of essential lipid in
              cell membranes.
            </li>
            <li>
              <strong>Skeletal muscle mass:</strong> only the muscles attached to the skeleton,
              roughly half of lean mass for most adults.
            </li>
            <li>
              <strong>Visceral fat:</strong> fat stored around the internal organs. The tape method
              cannot measure it directly.
            </li>
          </ul>
          <p>
            Keeping these straight helps when comparing results from different tools. A lean mass of
            148 lb does not mean 148 lb of muscle; skeletal muscle would typically be closer to half
            of that figure.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing how often to measure",
      body: (
        <>
          <p>
            Fat changes slowly. Even a well-run fat loss phase removes only around half a kilogram
            to a kilogram of fat a week, which might move the waist by a few millimetres. Day-to-day
            variation from food, water and posture is often larger than that. Measuring daily
            therefore mostly records noise and can make progress look erratic.
          </p>
          <p>
            Every two weeks suits people in an active fat loss or muscle gain phase who want closer
            feedback. Every four weeks is enough for most people, and it pairs naturally with a
            monthly coaching review. Between measurements, a weekly average of morning weights fills
            in the picture.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: making the tape part of check-ins",
      body: (
        <>
          <p>
            The Navy method suits remote coaching because clients can do it at home with a cheap
            tape. Send a short guide with the landmarks, ask for the raw measurements as well as the
            result, and request them on the same day of the month. Review the trend in each site,
            not only the percentage, because a falling waist with a steady neck is the clearest sign
            of fat loss.
          </p>
          <p>
            If a client's numbers jump in a way that does not match their weight or photos, ask how
            and where they measured before changing anything in the plan. Most surprises turn out to
            be a slipped landmark or a tape pulled tighter than usual.
          </p>
        </>
      ),
    },
    {
      heading: "Navy estimate versus a DEXA scan",
      body: (
        <>
          <p>
            DEXA, dual-energy X-ray absorptiometry, scans the body with two low-dose X-ray beams and
            separates fat, lean tissue and bone region by region. It is often treated as the
            practical reference in sports science, though it too has a margin of error of a point or
            two and is sensitive to hydration and the machine used.
          </p>
          <p>
            When people compare the two, the tape method tends to read a little high for lean,
            muscular men and a little low for people carrying more abdominal fat, though individual
            results vary in both directions. A useful approach is to get one DEXA scan, take tape
            measurements on the same morning, and note the gap. Later tape readings can then be read
            with that offset in mind, while you keep the low cost and convenience of measuring at
            home.
          </p>
          <p>
            A scan is not needed for most people. If the goal is to see whether fat is coming down,
            the tape measured consistently answers that question well.
          </p>
        </>
      ),
    },
    {
      heading: "Body fat and health targets",
      body: (
        <>
          <p>
            For health rather than appearance, the most important shift is usually out of the
            above-average range. Moving a man from 28% to 22%, or a woman from 36% to 30%, typically
            comes with a smaller waist and improvements in blood pressure, blood sugar and
            cholesterol. Going from 15% to 10% changes how someone looks far more than it changes
            their health risk.
          </p>
          <p>
            Fitness, strength and activity matter alongside body fat. People who are physically fit
            tend to have lower health risk at every body fat level than those who are not. A
            coaching plan that builds regular training and better sleep often improves health faster
            than one focused on the percentage alone.
          </p>
        </>
      ),
    },
    {
      heading: "What to do with a high reading",
      body: (
        <>
          <p>
            A reading in the above-average range is a starting point, not a verdict. Begin with the
            habits that move body fat steadily: regular resistance training, a modest calorie
            deficit, plenty of protein, daily walking and enough sleep. Re-measure in four weeks and
            look for the waist to come down.
          </p>
          <p>
            If the reading is high and you also have symptoms such as breathlessness, very high
            blood pressure or excessive thirst, or a family history of diabetes or heart disease,
            see a doctor before starting a demanding plan. They can check the markers a tape cannot.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use your result with ChatGPT",
    whenToUse: "Once you have measured carefully and calculated your estimate.",
    pasteIn: "Paste your measurements, your result and your goal.",
    text: `I estimated my body fat with the US Navy tape method. Sex: [sex]. Height: [height]. Neck: [neck]. Waist: [waist]. Hip (if female): [hip]. Weight: [weight]. Estimate: [percent] body fat, with fat mass [fat] and lean mass [lean]. My goal is [goal] and I currently train [training]. Explain what this estimate does and does not tell me, given a typical error of three to four percentage points. Suggest a sensible measuring routine and three questions to discuss with my coach. Do not give me a calorie target without asking about my eating and activity first.`,
  },
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
    { label: "Body fat calculator", href: "/tools/body-fat-calculator" },
    { label: "Lean body mass calculator", href: "/tools/lean-body-mass-calculator" },
    { label: "FFMI calculator", href: "/tools/ffmi-calculator" },
  ],
  nextPitch: "Use these tools to build a fuller picture, then review it with your coach.",
  faq: [
    {
      q: "What measurements does the US Navy calculator need?",
      a: "Height, neck and waist for men; height, neck, waist and hip for women. Weight is optional and only used to split the result into fat mass and lean mass.",
    },
    {
      q: "How accurate is the Navy body fat formula?",
      a: "It usually lands within about three to four percentage points of lab methods for most people, with larger errors for very lean, very muscular or very heavy people.",
    },
    {
      q: "Where exactly should I measure my waist?",
      a: "Men measure horizontally at the navel. Women measure at the narrowest point of the torso. In both cases measure after a normal breath out, without pulling the stomach in.",
    },
    {
      q: "Why does the formula use logarithms?",
      a: "Body fat does not rise in a straight line with circumference. The log terms let the equations fit the curved relationship Hodgdon and Beckett found in their data.",
    },
    {
      q: "What is lean mass in the result?",
      a: "Everything that is not fat: muscle, bone, organs, connective tissue and water. It is not the same as muscle mass.",
    },
    {
      q: "Is this the test the military uses?",
      a: "It is the long-standing two- and three-site Navy method. Branches set their own limits and some have since adopted different tape equations.",
    },
    {
      q: "How often should I measure?",
      a: "Every two to four weeks, in the morning and under the same conditions. Daily readings mostly track water and food, not fat.",
    },
    {
      q: "Can I compare this with my smart scale?",
      a: "Not directly. Different methods give different numbers. Compare each method only with its own earlier readings.",
    },
    {
      q: "Can I use an AI assistant to plan from my result?",
      a: "Yes, to organise questions for your coach or doctor. Include the raw measurements, the method and its margin of error, and ask it not to treat the estimate as exact.",
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
