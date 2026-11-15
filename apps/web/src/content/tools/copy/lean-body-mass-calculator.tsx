import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Lean body mass calculator",
  description:
    "Calculate lean body mass from your weight and body fat percentage, or estimate it with the Boer formula from height, weight and sex.",
  eyebrow: "Free tool · Body composition",
  h1: "Lean body mass calculator",
  intro: (
    <>
      <p>
        Find out how much of your weight is not fat. Use your body fat percentage if you know it, or
        the Boer formula from height, weight and sex if you don't. See lean mass, fat mass and body
        fat side by side.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate lean body mass?",
    answer: (
      <>
        <p>
          If you know your body fat, multiply your weight by (1 − body fat). At 185 lb and 18% body
          fat, lean mass is 185 × 0.82 = 151.7 lb (68.8 kg). Without a body fat figure, the Boer
          formula estimates it from height, weight and sex: about 137.6 lb for a man at 185 lb and 5
          ft 10 in.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What lean body mass includes",
      body: (
        <>
          <p>
            Lean body mass is everything in the body except fat: skeletal muscle, organs, bone,
            blood, skin, connective tissue and water. For most adults it makes up somewhere between
            60 and 90% of total weight. It is often confused with muscle, but skeletal muscle is
            only part of it, usually around half.
          </p>
          <p>
            That distinction matters when reading the number. A lean mass of 68 kg does not mean 68
            kg of muscle. Water alone makes up about 70 to 75% of lean tissue, which is why lean
            mass can rise or fall by a kilogram or two with hydration, salt and carbohydrate intake,
            without any real change in muscle.
          </p>
        </>
      ),
    },
    {
      heading: "Two ways to calculate it",
      body: (
        <>
          <p>
            The most direct route uses a body fat percentage. If you know body fat from a scan,
            calipers, a smart scale or a tape method, lean mass is simply weight minus fat mass. Its
            accuracy depends on how good the body fat figure is.
          </p>
          <p>
            When no body fat figure is available, equations estimate lean mass from height, weight
            and sex. The Boer formula, published in 1984, is one of the most widely used:
          </p>
          <ul>
            <li>
              <strong>Men:</strong> LBM = 0.407 × weight (kg) + 0.267 × height (cm) − 19.2
            </li>
            <li>
              <strong>Women:</strong> LBM = 0.252 × weight (kg) + 0.473 × height (cm) − 48.3
            </li>
          </ul>
          <p>
            Other equations, such as James (1976) and Hume (1966), use a similar approach. Boer
            tends to hold up better at higher body weights, which is why the calculator offers it.
            Like all such equations, it describes an average person of a given size. It cannot know
            whether someone is unusually muscular or unusually lean.
          </p>
        </>
      ),
    },
    {
      heading: "Working through an example",
      body: (
        <>
          <p>
            Take a man at 185 lb (83.9 kg) and 5 ft 10 in (177.8 cm) with an estimated body fat of
            18%. Using the body fat method, fat mass is 18% of 83.9 kg, about 15.1 kg (33.3 lb), and
            lean mass is 68.8 kg (151.7 lb).
          </p>
          <p>
            Using the Boer formula instead: 0.407 × 83.9 = 34.2; 0.267 × 177.8 = 47.5; adding them
            and subtracting 19.2 gives 62.4 kg (137.6 lb). That implies a body fat of about 25.6%,
            quite different from the 18% estimate.
          </p>
          <p>
            The gap shows the limit of a formula that does not know body composition. If this man
            trains regularly and carries more muscle than average for his size, the body fat method
            is probably closer. If he does not train, Boer may be nearer the mark. Whenever you have
            a reasonable body fat estimate, use it.
          </p>
        </>
      ),
    },
    {
      heading: "Why lean body mass is useful",
      body: (
        <>
          <ul>
            <li>
              <strong>Setting protein targets.</strong> Protein needs track lean mass more closely
              than total weight. A common range for people who train is 1.8 to 2.7 g per kg of lean
              mass. At 68.8 kg lean, 2.2 g per kg gives about 151 g a day.
            </li>
            <li>
              <strong>Estimating metabolism.</strong> The Katch-McArdle equation estimates BMR as
              370 + 21.6 × lean mass in kg. At 68.8 kg lean, that is about 1,856 kcal a day before
              activity.
            </li>
            <li>
              <strong>Tracking a diet.</strong> Keeping lean mass steady while weight falls shows
              that the loss came from fat.
            </li>
            <li>
              <strong>Tracking a bulk.</strong> Lean mass rising faster than fat mass suggests a
              well-judged surplus.
            </li>
            <li>
              <strong>Medicine.</strong> Some drug doses are based on lean mass rather than total
              weight.
            </li>
          </ul>
          <p>
            In each case lean mass makes a number more personal than one based on total body weight,
            which overestimates needs for people with more fat and underestimates them for people
            with more muscle.
          </p>
        </>
      ),
    },
    {
      heading: "How lean mass changes",
      body: (
        <>
          <p>
            Lean mass rises with resistance training, enough protein and enough total energy.
            Beginners can gain several kilograms in their first year. After that, progress slows to
            a kilogram or two a year at best, and less for experienced lifters.
          </p>
          <p>
            It falls with inactivity, illness, ageing and aggressive dieting. Adults lose muscle at
            a gradual rate from around 30, faster after 60 unless they train. During a calorie
            deficit, lifting weights and eating enough protein are the two most effective ways to
            protect it.
          </p>
          <p>
            Short-term swings are often water. A low-carbohydrate diet can drop lean mass by a
            kilogram or more in a few days as stored glycogen and its water are used up. That is why
            lean mass is best compared across several weeks or months.
          </p>
        </>
      ),
    },
    {
      heading: "Methods for measuring body composition",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">Strengths</th>
                  <th scope="col">Watch out for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>DEXA scan</td>
                  <td>Detailed, regional breakdown</td>
                  <td>Cost, small radiation dose, hydration effects</td>
                </tr>
                <tr>
                  <td>Bioimpedance</td>
                  <td>Quick, cheap, at home</td>
                  <td>Large swings with water and timing</td>
                </tr>
                <tr>
                  <td>Skinfold calipers</td>
                  <td>Cheap and portable</td>
                  <td>Needs a skilled tester</td>
                </tr>
                <tr>
                  <td>Tape measure (US Navy)</td>
                  <td>Free, repeatable</td>
                  <td>Estimate with a few points of error</td>
                </tr>
                <tr>
                  <td>Boer and similar equations</td>
                  <td>Needs only height and weight</td>
                  <td>Ignores actual composition</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Choose the most practical method you can repeat, and compare results only with earlier
            results from the same method.
          </p>
        </>
      ),
    },
    {
      heading: "Lean mass during weight loss",
      body: (
        <>
          <p>
            When people lose weight, some of the loss comes from lean mass. Without training and
            with low protein, a quarter or more of the weight lost can be lean tissue. With
            resistance training and enough protein, that share can fall well below 10%, so nearly
            all the loss is fat.
          </p>
          <p>
            Tracking lean mass during a diet shows whether the plan is protecting it. Suppose a
            client starts at 90 kg with 30% body fat: 63 kg lean, 27 kg fat. After twelve weeks,
            they weigh 84 kg at 25% body fat: 63 kg lean, 21 kg fat. All six kilograms came from
            fat, which is the ideal outcome. If they had reached 84 kg at 28% instead, lean mass
            would be 60.5 kg, and 2.5 kg of the loss would have been lean tissue.
          </p>
          <p>
            Small differences in body fat estimates can blur this picture, so look for a trend over
            several measurements rather than one comparison.
          </p>
        </>
      ),
    },
    {
      heading: "Lean mass during a muscle gain phase",
      body: (
        <>
          <p>
            In a muscle gain phase, the aim is for lean mass to rise while fat mass rises only a
            little. A ratio of about one part fat to one part lean is reasonable for many
            intermediate lifters; beginners can often do better, and experienced lifters often
            worse.
          </p>
          <p>
            Water and glycogen complicate the picture. Starting a gain phase with more carbohydrate
            fills muscle glycogen, which adds water and shows up as lean mass within days. Treat the
            first couple of weeks with caution and judge the phase over two to three months.
          </p>
        </>
      ),
    },
    {
      heading: "Lean mass for men and women",
      body: (
        <>
          <p>
            Men typically carry more lean mass than women of the same height and weight, mainly
            because of more muscle and less essential fat. Lean mass makes up about 75 to 90% of
            body weight for many men and about 65 to 80% for many women.
          </p>
          <p>
            These differences show up in the Boer formula's different coefficients for men and
            women. They also explain why protein and calorie targets based on lean mass suit both
            sexes better than targets based on total weight. A 70 kg woman with 30% body fat has 49
            kg of lean mass; a 70 kg man with 15% body fat has 59.5 kg. Their needs differ even
            though they weigh the same.
          </p>
        </>
      ),
    },
    {
      heading: "Using lean mass with other calculators",
      body: (
        <>
          <p>
            Several other tools on this site use lean mass as an input or produce it as an output.
            The FFMI calculator divides lean mass by height squared to describe muscularity for
            height. The body recomposition calculator uses lean mass to set calories and protein.
            The Navy body fat calculator can give you lean mass from a tape measure if you add your
            weight.
          </p>
          <p>
            Using the same lean mass figure across these tools keeps your numbers consistent. If you
            update body fat, update lean mass too, so protein and calorie targets follow.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring well at home",
      body: (
        <>
          <ol>
            <li>
              Weigh in the morning after using the toilet, before food or drink, on the same scale.
            </li>
            <li>Use the same body fat method each time, at the same time of day.</li>
            <li>For smart scales, keep hydration and caffeine similar before readings.</li>
            <li>For tape methods, measure on bare skin with the tape level and snug.</li>
            <li>
              Record weight and body fat, then calculate lean mass, rather than relying on a
              device's own lean mass figure.
            </li>
            <li>Repeat every two to four weeks, not daily.</li>
          </ol>
          <p>
            These steps reduce noise from water and timing, so changes in lean mass reflect real
            change in the body.
          </p>
        </>
      ),
    },
    {
      heading: "Lean mass and health",
      body: (
        <>
          <p>
            Higher lean mass, particularly muscle, is linked with better blood sugar control,
            stronger bones, better balance and longer life. Low lean mass in older adults predicts
            frailty, falls and hospital stays. Keeping lean mass through midlife and later is one of
            the most valuable things a training plan can do.
          </p>
          <p>
            Lean mass is not the only marker of health. Body fat distribution, fitness, blood
            pressure and blood markers matter too. A doctor can assess these if you have concerns
            about your health.
          </p>
        </>
      ),
    },
    {
      heading: "When the two methods disagree",
      body: (
        <>
          <p>
            It is common for the body fat method and the Boer formula to give results several
            kilograms apart. Boer assumes an average body composition for someone of your size. If
            you train and carry more muscle than average, it will underestimate your lean mass. If
            you are inactive and carry more fat than average, it may overestimate it.
          </p>
          <p>
            Use the disagreement as information. A large gap between your body fat-based lean mass
            and the Boer figure suggests your composition differs from the average, in one direction
            or the other. For setting targets, the body fat method is usually the better choice when
            you have a reasonable estimate.
          </p>
        </>
      ),
    },
    {
      heading: "Lean mass and calorie needs",
      body: (
        <>
          <p>
            Lean tissue drives most of the body's resting energy use. Organs such as the liver,
            brain, heart and kidneys are especially active, and muscle adds a smaller but meaningful
            share. That is why equations based on lean mass, such as Katch-McArdle, can estimate
            resting metabolism more precisely than those based on total weight for people with very
            high or very low body fat.
          </p>
          <p>
            For a man with 68.8 kg of lean mass, Katch-McArdle gives a BMR of about 1,856 kcal.
            Multiplying by an activity factor of 1.55 for moderate exercise gives a maintenance
            estimate of about 2,880 kcal. Compare that with a weight-based estimate; if the two
            differ a lot, body composition is probably the reason.
          </p>
          <p>
            Any estimate is a starting point. Track weight for two to three weeks at a given intake,
            and adjust if it moves more than expected.
          </p>
        </>
      ),
    },
    {
      heading: "Worked example: protein from lean mass",
      body: (
        <>
          <p>
            Take a woman at 70 kg with 32% body fat. Her lean mass is 70 × 0.68 = 47.6 kg. At 2.0 g
            of protein per kg of lean mass, her target is about 95 g a day. Using total weight at
            the same rate would give 140 g, about 45 g more than her lean mass suggests she needs.
          </p>
          <p>
            For a man at 90 kg with 12% body fat, lean mass is 79.2 kg. At 2.0 g per kg of lean
            mass, that is about 158 g. A total-weight target of 1.8 g per kg gives a similar 162 g,
            because his body fat is low. The lean mass method matters most for people with higher
            body fat.
          </p>
        </>
      ),
    },
    {
      heading: "Ages and lean mass",
      body: (
        <>
          <p>
            Lean mass usually peaks in the twenties or early thirties and declines slowly after
            that. The decline speeds up after 60, especially in people who do not train. Bone
            mineral also falls, particularly in women after the menopause.
          </p>
          <p>
            Regular resistance training, adequate protein and an active lifestyle slow these
            changes. For older clients, keeping lean mass is often a more important goal than losing
            weight, because muscle and bone underpin balance, mobility and independence.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: lean mass in check-ins",
      body: (
        <>
          <p>
            Lean mass gives clients a second number to watch when the scale is slow. Ask for weight
            and a consistent body fat measurement every four weeks, calculate lean mass and fat
            mass, and show both trends. A client who sees fat mass fall while lean mass holds is far
            more likely to stay with the plan than one watching the scale alone.
          </p>
          <p>
            If lean mass falls across two check-ins during a diet, look at protein intake, training
            attendance and the size of the deficit before cutting calories further. Those three
            levers usually explain the change, and fixing them protects the muscle the client has
            worked for.
          </p>
        </>
      ),
    },
    {
      heading: "Lean mass is not a fixed number",
      body: (
        <>
          <p>
            Your lean mass shifts slightly every day with hydration, food and stored carbohydrate.
            Treat any single result as a reading within a range of a kilogram or so either way. Over
            months, the direction of the trend is what tells you whether training and nutrition are
            working.
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
    key: "nutrition",
    heading: "Turn lean mass into a plan",
    body: (
      <>
        <p>
          In Traiv you set each client's calories and protein in their diet plan, and see their
          check-in measurements beside it, so targets follow the body they actually have.
        </p>
      </>
    ),
  },
  next: [
    { label: "FFMI calculator", href: "/tools/ffmi-calculator" },
    { label: "Body fat calculator", href: "/tools/body-fat-calculator" },
    { label: "Protein calculator", href: "/tools/protein-calculator" },
  ],
  nextPitch: "Use these tools to build a fuller picture, then review it with your coach.",
  faq: [
    {
      q: "What is lean body mass?",
      a: "Your total weight minus fat mass. It includes muscle, organs, bone, blood, skin and water, not only muscle.",
    },
    {
      q: "What is a normal lean body mass?",
      a: "For most adults, lean mass is about 60 to 90% of body weight. Men usually sit higher than women because they carry less essential fat.",
    },
    {
      q: "Is lean body mass the same as muscle mass?",
      a: "No. Skeletal muscle is roughly half of lean body mass for most adults. The rest is organs, bone, water and other tissue.",
    },
    {
      q: "Which method should I use?",
      a: "If you have a reasonable body fat estimate, use the body fat method. Use Boer only when you don't, and remember it ignores muscularity.",
    },
    {
      q: "Why use lean mass for protein targets?",
      a: "Protein needs track lean tissue. Setting protein per kilogram of lean mass avoids overestimating needs for people with more fat.",
    },
    {
      q: "Can lean body mass change quickly?",
      a: "Water and glycogen can move it by a kilogram or more in days. Real muscle changes take weeks to months.",
    },
    {
      q: "How do I increase lean body mass?",
      a: "Lift weights consistently, eat enough protein, and eat enough total energy. Progress is fastest in the first year of training.",
    },
  ],
  keepGoing: [
    { label: "Diet plans in Traiv", href: "/features/nutrition" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Track every client's progress under your name",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
