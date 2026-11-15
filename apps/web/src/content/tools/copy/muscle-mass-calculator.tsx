import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Muscle mass calculator",
  description:
    "Estimate skeletal muscle mass from sex, age, height and weight with the Lee 2000 equation. See the result in kilograms, pounds and as a share of body weight.",
  eyebrow: "Free tool · Body composition",
  h1: "Muscle mass calculator",
  intro: (
    <>
      <p>
        Estimate how much skeletal muscle you carry from your sex, age, height and weight. The
        calculator uses the Lee et al. (2000) equation and shows the result in kilograms, pounds and
        as a percentage of body weight.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How is skeletal muscle mass estimated?",
    answer: (
      <>
        <p>
          The Lee equation is: muscle (kg) = 0.244 × weight (kg) + 7.8 × height (m) + 6.6 × sex −
          0.098 × age − 3.3, where sex is 1 for men and 0 for women. For a 30-year-old man at 185 lb
          (83.9 kg) and 5 ft 10 in (1.778 m), that gives about 34.7 kg (76.5 lb), or 41.4% of body
          weight.
        </p>
        <p>
          The published equation also has an ethnicity term. This calculator sets it to zero, so
          treat the result as a general population estimate.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What skeletal muscle mass is",
      body: (
        <>
          <p>
            The body has three kinds of muscle. Cardiac muscle forms the heart, smooth muscle lines
            the gut and blood vessels, and skeletal muscle attaches to bones and moves the body.
            Skeletal muscle is the one you train in the gym, the one that declines with inactivity
            and age, and the one this calculator estimates.
          </p>
          <p>
            It is the largest tissue in the body for most adults, typically making up 30 to 45% of
            body weight. It does much more than produce movement. Skeletal muscle stores glucose,
            helps regulate blood sugar, produces heat, protects joints and acts as a protein reserve
            during illness. Higher muscle mass in older age is linked with better balance, fewer
            falls and longer independent living.
          </p>
          <p>
            Skeletal muscle is not the same as lean body mass. Lean mass includes muscle plus
            organs, bone, blood, skin and water. For most adults, skeletal muscle is roughly half of
            lean body mass.
          </p>
        </>
      ),
    },
    {
      heading: "The Lee 2000 equation",
      body: (
        <>
          <p>
            In 2000, Lee and colleagues published equations to estimate skeletal muscle mass from
            simple measurements. They measured muscle directly with MRI in a group of adults of
            different ages, sexes and ethnic backgrounds, then found which simple inputs best
            predicted it. The anthropometric version used here needs only height, weight, age and
            sex.
          </p>
          <ul>
            <li>
              <strong>Equation:</strong> SM (kg) = 0.244 × weight (kg) + 7.8 × height (m) + 6.6 ×
              sex − 0.098 × age − 3.3 + ethnicity term
            </li>
            <li>
              <strong>Sex:</strong> 1 for men, 0 for women
            </li>
            <li>
              <strong>Ethnicity term in the paper:</strong> −2.0 for Asian participants, +1.1 for
              African-American participants and 0 for white and Hispanic participants
            </li>
          </ul>
          <p>
            This calculator sets the ethnicity term to zero for everyone. That keeps the tool
            simple, but it means the result may read about 2 kg high for people of Asian background
            and about 1 kg low for people of African descent, compared with the full equation. Keep
            that in mind when reading your number.
          </p>
          <p>
            Each term has an intuitive meaning. Heavier and taller people carry more muscle. Men
            carry more than women of the same size, by about 6.6 kg on average. And muscle declines
            with age, by about 0.1 kg a year in the equation.
          </p>
        </>
      ),
    },
    {
      heading: "Working through an example",
      body: (
        <>
          <p>
            Take a 30-year-old man who weighs 185 lb (83.9 kg) and is 5 ft 10 in (1.778 m). Weight
            contributes 0.244 × 83.9 = 20.5 kg. Height contributes 7.8 × 1.778 = 13.9 kg. Being male
            adds 6.6 kg. Age subtracts 0.098 × 30 = 2.9 kg. The constant subtracts 3.3 kg.
          </p>
          <p>
            Adding these gives 20.5 + 13.9 + 6.6 − 2.9 − 3.3 = 34.7 kg, or about 76.5 lb. As a share
            of his weight, that is 41.4%.
          </p>
          <p>
            For a 45-year-old woman at 65 kg and 165 cm: 0.244 × 65 = 15.9; 7.8 × 1.65 = 12.9; age
            subtracts 4.4; the constant subtracts 3.3. The total is about 21.0 kg, or 32.3% of her
            weight.
          </p>
        </>
      ),
    },
    {
      heading: "Typical ranges",
      body: (
        <>
          <p>
            Skeletal muscle as a share of body weight varies widely. These rough ranges, drawn from
            studies using scans, give a sense of typical values for adults:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Group</th>
                  <th scope="col">Typical skeletal muscle (% of body weight)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Men, 18 to 35</td>
                  <td>About 40 to 44%</td>
                </tr>
                <tr>
                  <td>Men, 36 to 55</td>
                  <td>About 36 to 40%</td>
                </tr>
                <tr>
                  <td>Men, 56 and over</td>
                  <td>About 32 to 36%</td>
                </tr>
                <tr>
                  <td>Women, 18 to 35</td>
                  <td>About 31 to 34%</td>
                </tr>
                <tr>
                  <td>Women, 36 to 55</td>
                  <td>About 29 to 32%</td>
                </tr>
                <tr>
                  <td>Women, 56 and over</td>
                  <td>About 27 to 30%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Higher body fat lowers the percentage even when muscle mass in kilograms is normal,
            because the fat adds to the denominator. That is why the calculator shows both the
            kilograms and the percentage. For tracking change, the kilograms are usually more
            useful.
          </p>
        </>
      ),
    },
    {
      heading: "Why the estimate has limits",
      body: (
        <>
          <p>
            Lee's equation predicts the average muscle mass for a person of a given size, age and
            sex. It cannot see training history. Two 30-year-old men at the same height and weight
            get the same result, even if one is a powerlifter with low body fat and the other is
            inactive with high body fat. The lifter's real muscle mass may be several kilograms
            higher, and the inactive man's lower.
          </p>
          <p>
            Because body weight is the biggest input, gaining fat also raises the estimate. That
            makes the equation unsuitable for tracking short-term change in muscle. If weight rises
            by 5 kg, the result rises by about 1.2 kg whether the new weight is muscle or fat.
          </p>
          <p>
            For tracking muscle over time, use methods that measure composition: DEXA, bioimpedance
            with consistent conditions, or a tape-based body fat estimate converted to lean mass.
            Use this calculator for a sensible baseline figure, not a progress tracker.
          </p>
        </>
      ),
    },
    {
      heading: "Muscle and ageing",
      body: (
        <>
          <p>
            Adults lose muscle gradually from around 30, and the loss speeds up after 60. Without
            training, someone can lose 3 to 8% of their muscle mass a decade. When this loss starts
            to affect strength and function, it is called sarcopenia, and it is a major cause of
            frailty, falls and loss of independence in older adults.
          </p>
          <p>
            Resistance training slows, halts and can partly reverse this decline at any age. Studies
            of people in their 70s, 80s and 90s show meaningful gains in strength and muscle after a
            few months of supervised training. Adequate protein, about 1.0 to 1.2 g per kg of body
            weight a day or more for older adults, supports those gains.
          </p>
          <p>
            The age term in the equation, 0.1 kg a year, describes an average. It is not inevitable.
            People who train consistently through midlife often keep more muscle than the equation
            predicts.
          </p>
        </>
      ),
    },
    {
      heading: "How to build muscle",
      body: (
        <>
          <ol>
            <li>
              <strong>Train each muscle group about twice a week.</strong> Full-body or upper/lower
              splits suit most people.
            </li>
            <li>
              <strong>Use progressive overload.</strong> Add weight, reps or sets over time, so the
              muscle has a reason to adapt.
            </li>
            <li>
              <strong>Train close to failure.</strong> Most working sets should end with one to
              three reps left in reserve.
            </li>
            <li>
              <strong>Eat enough protein.</strong> About 1.6 to 2.2 g per kg of body weight a day is
              a common range for people trying to build muscle.
            </li>
            <li>
              <strong>Eat enough energy.</strong> A small surplus of 5 to 10% above maintenance
              supports gains without excessive fat.
            </li>
            <li>
              <strong>Sleep seven to nine hours.</strong> Recovery and muscle repair depend on it.
            </li>
          </ol>
          <p>
            Beginners can gain muscle quickly in their first year, sometimes 0.5 to 1 kg a month.
            That slows to a fraction of a kilogram a month for experienced lifters. Consistency over
            years matters far more than any single programme.
          </p>
        </>
      ),
    },
    {
      heading: "Muscle and metabolism",
      body: (
        <>
          <p>
            Muscle burns more energy at rest than fat, but the difference is smaller than often
            claimed. Each kilogram of muscle uses about 13 kcal a day at rest, compared with about
            4.5 kcal for fat. Adding 3 kg of muscle raises resting energy use by roughly 40 kcal a
            day.
          </p>
          <p>
            The bigger metabolic benefit comes from what muscle does. It takes up glucose after
            meals, improving blood sugar control, and the training needed to build it burns energy
            and improves fitness. People with more muscle also tend to move more in daily life,
            which adds up across a week.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring muscle directly",
      body: (
        <>
          <p>
            If you want an accurate figure rather than an estimate, you need to measure. The most
            common options are:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">What it measures</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>MRI or CT</td>
                  <td>Muscle volume directly</td>
                  <td>Research and clinical use; the reference for equations like Lee's</td>
                </tr>
                <tr>
                  <td>DEXA scan</td>
                  <td>Lean mass by region</td>
                  <td>Widely available; appendicular lean mass is used to estimate muscle</td>
                </tr>
                <tr>
                  <td>Bioimpedance (BIA)</td>
                  <td>Estimated muscle from electrical resistance</td>
                  <td>Home and gym devices; sensitive to hydration</td>
                </tr>
                <tr>
                  <td>Ultrasound</td>
                  <td>Muscle thickness at specific sites</td>
                  <td>Useful for tracking one muscle</td>
                </tr>
                <tr>
                  <td>Anthropometric equations</td>
                  <td>Estimate from size, age and sex</td>
                  <td>This calculator; quick but cannot see training</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            For most people, a DEXA scan once or twice a year combined with regular tape
            measurements and strength tracking gives a clear picture without great cost.
          </p>
        </>
      ),
    },
    {
      heading: "Muscle mass for men and women",
      body: (
        <>
          <p>
            Men carry more skeletal muscle than women on average, both in kilograms and as a share
            of body weight. Part of this comes from testosterone, which supports muscle growth, and
            part from differences in body size and fat. The Lee equation captures the average gap
            with its 6.6 kg term for men.
          </p>
          <p>
            Women respond to training in much the same way as men in relative terms. Studies
            comparing men and women on the same programme often find similar percentage gains in
            muscle size and strength, even though men start with and finish with more muscle in
            absolute terms. Resistance training is just as valuable for women, particularly for bone
            health and later-life function.
          </p>
        </>
      ),
    },
    {
      heading: "Muscle mass and health",
      body: (
        <>
          <p>
            Muscle is increasingly seen as a health marker in its own right. Higher muscle mass and
            strength are linked with lower risk of type 2 diabetes, better recovery from illness and
            surgery, and lower mortality in older adults. Grip strength, a simple proxy for overall
            strength, predicts health outcomes in large population studies.
          </p>
          <p>
            Muscle also protects joints and bones. Strong muscles absorb force and stabilise joints,
            reducing injury risk. The loading involved in resistance training stimulates bone
            formation, which helps prevent osteoporosis, particularly in women after the menopause.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking progress without a scan",
      body: (
        <>
          <p>
            Since the equation cannot track muscle gain, other markers have to do it. Strength
            progression is the most practical: if your working weights for the same reps and effort
            are rising over months, muscle is very likely growing. Circumference measurements at the
            arm, chest and thigh add detail.
          </p>
          <p>
            Combining a tape-based body fat estimate with weight gives lean mass, which tracks
            muscle better than the Lee estimate because it accounts for fat. Progress photos taken
            in the same light and pose each month show changes that numbers miss.
          </p>
          <ul>
            <li>
              <strong>Monthly:</strong> body weight average, waist and limb measurements, progress
              photos.
            </li>
            <li>
              <strong>Every session:</strong> weights, reps and effort in the training log.
            </li>
            <li>
              <strong>Every two to three months:</strong> body fat estimate and lean mass.
            </li>
            <li>
              <strong>Once or twice a year, if available:</strong> a DEXA scan.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Common myths about muscle",
      body: (
        <>
          <ul>
            <li>
              <strong>Lifting makes women bulky.</strong> Building large amounts of muscle takes
              years of focused training and eating. Most women who lift become stronger and leaner,
              not bulky.
            </li>
            <li>
              <strong>Muscle turns into fat.</strong> They are different tissues. If someone stops
              training and eats the same, they may lose muscle and gain fat, but one does not
              convert into the other.
            </li>
            <li>
              <strong>You need supplements to build muscle.</strong> Food, training and sleep do the
              work. Protein powder is a convenient way to reach protein targets, not a requirement.
            </li>
            <li>
              <strong>Older people cannot build muscle.</strong> Studies show meaningful gains even
              in people in their 80s and 90s.
            </li>
            <li>
              <strong>More training is always better.</strong> Recovery limits how much training
              produces results. Beyond a point, extra sets add fatigue more than muscle.
            </li>
          </ul>
          <p>
            Clearing up these ideas often helps clients commit to a plan they would otherwise avoid.
          </p>
        </>
      ),
    },
    {
      heading: "Using the estimate with clients",
      body: (
        <>
          <p>
            For a new client, the Lee estimate gives a quick starting figure to discuss alongside
            weight, waist and strength. It is useful for explaining why muscle matters, how it
            changes with age and why the plan includes resistance training. It should not be used to
            judge whether a client has gained muscle over a few months.
          </p>
          <p>
            When discussing the number, explain the ethnicity simplification and the population
            nature of the estimate. For a client who trains, it will likely underestimate their
            muscle. For a client who is inactive with higher body fat, it may overestimate it. Use
            their training log and measurements to track real change.
          </p>
        </>
      ),
    },
    {
      heading: "Muscle mass and protein",
      body: (
        <>
          <p>
            Protein provides the amino acids muscle is built from. Spreading intake across three to
            five meals, each with 20 to 40 g of protein, supports muscle repair better than one
            large serving. Older adults may need more per meal, around 30 to 40 g, to get the same
            muscle-building response.
          </p>
          <p>
            Good sources include meat, fish, eggs, dairy, legumes, tofu and tempeh. Plant-based
            eaters can reach their targets by combining sources and eating a little more total
            protein. A protein calculator can help set a daily target, and a meal plan can make it
            easier to hit.
          </p>
        </>
      ),
    },
    {
      heading: "Muscle loss during illness and inactivity",
      body: (
        <>
          <p>
            Muscle is lost fastest when the body is inactive. A week of bed rest can cost older
            adults about a kilogram of leg muscle. Injury, illness and periods away from training
            all speed up loss, and recovery takes longer than the loss itself.
          </p>
          <p>
            Staying as active as is safely possible during these periods helps. Light resistance
            work, walking, and keeping protein intake high can limit loss. After illness or injury,
            return to training gradually, with guidance from a doctor or physiotherapist when
            needed.
          </p>
        </>
      ),
    },
    {
      heading: "Sex, age and weight: the inputs explained",
      body: (
        <>
          <p>
            Each input in the equation reflects a real pattern. Weight is the strongest predictor
            because bigger bodies tend to carry more of everything, including muscle. Height adds
            information because taller people have longer bones and larger muscles for a given
            weight. Sex captures the average difference between men and women. Age captures the
            gradual decline that happens without training.
          </p>
          <p>
            The equation was fitted on people aged 20 to 80, so results for people outside that age
            range are less reliable. It was also built on people of a broad range of body sizes, but
            very heavy or very light people may see larger errors.
          </p>
        </>
      ),
    },
    {
      heading: "How much muscle can you gain?",
      body: (
        <>
          <p>
            Rough figures for natural muscle gain in men, under good training and nutrition, are
            about 0.75 to 1 kg a month in the first year, 0.4 to 0.5 kg a month in the second, and
            0.2 kg a month or less after that. Women typically gain about half these amounts.
            Genetics, age, sleep and consistency all move the numbers.
          </p>
          <p>
            These rates mean that a year of good training can add several kilograms of muscle for a
            beginner, which is a visible and meaningful change. After five years, gains of a
            kilogram or two a year are typical. Expectations set this way help clients stay patient
            and avoid chasing faster progress with oversized calorie surpluses.
          </p>
        </>
      ),
    },
    {
      heading: "Building muscle during fat loss",
      body: (
        <>
          <p>
            Building muscle while losing fat, often called recomposition, is possible for some
            people. Beginners, people returning to training after a break and those with higher body
            fat are most likely to manage it. For lean, experienced lifters, it is much harder, and
            gaining or holding muscle in separate phases works better.
          </p>
          <p>
            The approach is a small deficit, high protein, and challenging resistance training.
            Progress shows up in measurements, strength and photos more than on the scale, because
            weight may change slowly while composition shifts. The body recomposition calculator on
            this site can help set calories and protein for this approach.
          </p>
        </>
      ),
    },
    {
      heading: "Training through the decades",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Age</th>
                  <th scope="col">Training focus</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>20s and 30s</td>
                  <td>Build a base of muscle and strength while gains come most easily</td>
                </tr>
                <tr>
                  <td>40s and 50s</td>
                  <td>Keep training volume steady, prioritise recovery and protein</td>
                </tr>
                <tr>
                  <td>60s and 70s</td>
                  <td>Strength, power and balance work to protect function</td>
                </tr>
                <tr>
                  <td>80s and beyond</td>
                  <td>Supervised resistance training for mobility and independence</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            At every age, two or three resistance sessions a week covering the main muscle groups
            provides most of the benefit. Older adults gain from adding power work, such as standing
            up quickly from a chair, because power declines faster than strength with age.
          </p>
        </>
      ),
    },
    {
      heading: "Reading the percentage",
      body: (
        <>
          <p>
            The calculator shows muscle as a share of body weight, but that percentage needs care.
            Someone who gains fat will see their muscle percentage fall even if their muscle in
            kilograms stays the same. Someone who loses fat will see it rise without gaining any
            muscle.
          </p>
          <p>
            This is why the kilogram figure is usually more useful for tracking. The percentage is
            helpful as a rough comparison with typical ranges, while the kilograms tell you whether
            muscle itself is changing. Both are estimates from this equation, so for tracking real
            change, use the methods described above.
          </p>
        </>
      ),
    },
    {
      heading: "When to see a professional",
      body: (
        <>
          <p>
            Unexplained muscle loss, weakness that develops over weeks, or difficulty with everyday
            tasks such as climbing stairs should be checked by a doctor. These can have causes
            beyond inactivity, including thyroid problems, medication side effects and other
            conditions. Older adults who have had a fall or notice they are getting weaker benefit
            from an assessment and, often, a supervised exercise programme.
          </p>
          <p>
            For training advice, a qualified coach can design a plan that suits your experience,
            schedule and any health conditions, and adjust it as you progress.
          </p>
        </>
      ),
    },
    {
      heading: "A sample week for building muscle",
      body: (
        <>
          <p>
            A simple plan for a beginner with three days to train might look like this. Each session
            covers the whole body, with two to four working sets per exercise, ending each set with
            one to three reps in reserve.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Main lifts</th>
                  <th scope="col">Accessory work</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monday</td>
                  <td>Squat, bench press, row</td>
                  <td>Plank, calf raise</td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>Deadlift or hip hinge, overhead press, pull-down</td>
                  <td>Lunge, curl</td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>Leg press, incline press, cable row</td>
                  <td>Hip thrust, triceps extension</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Add weight or reps when every set reaches the top of the target range. After eight to
            twelve weeks, review progress and adjust exercises, volume or frequency. A coach can
            tailor this to equipment, injuries and goals.
          </p>
        </>
      ),
    },
    {
      heading: "Muscle mass and body weight goals",
      body: (
        <>
          <p>
            For many clients, the scale is the only number they watch. Adding muscle can make weight
            loss look slower than expected, or make weight gain look larger, even when body
            composition is improving. Explaining that muscle is denser than fat and takes up less
            space helps clients read their progress fairly.
          </p>
          <p>
            Setting a goal around strength, measurements or body fat, rather than weight alone,
            keeps attention on the outcomes that matter. Over a year, a client who gains three
            kilograms of muscle and loses five of fat will look and feel very different, even though
            the scale shows only two kilograms lost.
          </p>
        </>
      ),
    },
    {
      heading: "Sleep, stress and muscle",
      body: (
        <>
          <p>
            Muscle is repaired and built mainly during rest. Short sleep raises stress hormones,
            lowers testosterone and growth hormone, and reduces the muscle-building response to
            training. Studies of people sleeping five hours a night during a diet found that they
            lost more muscle and less fat than those sleeping eight hours.
          </p>
          <p>
            Chronic stress has a similar effect. For clients struggling to build muscle despite good
            training and eating, sleep and stress are often the missing pieces. Aim for seven to
            nine hours a night, a regular bedtime and some recovery time in the week.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use your result with ChatGPT",
    whenToUse: "After calculating your estimate and noting its limits.",
    pasteIn: "Paste your inputs, your result and your training history.",
    text: `I estimated my skeletal muscle mass with the Lee 2000 equation, with the ethnicity term set to zero. Sex: [sex]. Age: [age]. Height: [height]. Weight: [weight]. Estimate: [kg] of skeletal muscle, [percent] of body weight. I have trained for [time] and currently do [training]. My goal is [goal]. Explain what this population estimate can and cannot tell me about my own muscle. Suggest how to track muscle more directly, and three questions to discuss with my coach about my training and protein intake.`,
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
    key: "workouts",
    heading: "Build the training that builds muscle",
    body: (
      <>
        <p>
          In Traiv you write each client's training plan, see the sets and weights they log in the
          app, and review their measurements at check-in, all in one place under your name.
        </p>
      </>
    ),
  },
  next: [
    { label: "Lean body mass calculator", href: "/tools/lean-body-mass-calculator" },
    { label: "FFMI calculator", href: "/tools/ffmi-calculator" },
    { label: "Protein calculator", href: "/tools/protein-calculator" },
  ],
  nextPitch: "Use these tools to build a fuller picture, then review it with your coach.",
  faq: [
    {
      q: "How much muscle mass should I have?",
      a: "Typical skeletal muscle ranges are about 40 to 44% of body weight for young men and 31 to 34% for young women, falling with age. Higher body fat lowers the percentage.",
    },
    {
      q: "Is this calculator accurate?",
      a: "It gives a population average for your size, age and sex. It cannot see training history, so muscular people may carry several kilograms more than it shows.",
    },
    {
      q: "Why does the calculator ignore ethnicity?",
      a: "To keep inputs simple, the ethnicity term from the Lee equation is set to zero. That can make the estimate about 2 kg high for Asian people and about 1 kg low for people of African descent.",
    },
    {
      q: "What is the difference between muscle mass and lean mass?",
      a: "Lean mass includes muscle, organs, bone, blood and water. Skeletal muscle is roughly half of lean mass.",
    },
    {
      q: "Can I track muscle gain with this calculator?",
      a: "Not well. Because body weight is the main input, gaining fat raises the estimate too. Use a body composition method for tracking.",
    },
    {
      q: "How fast can I build muscle?",
      a: "Beginners can gain around 0.5 to 1 kg a month in their first year. Experienced lifters gain much more slowly.",
    },
    {
      q: "Does muscle loss with age happen to everyone?",
      a: "Muscle tends to decline from about 30, but resistance training and enough protein slow or partly reverse it at any age.",
    },
    {
      q: "How much protein do I need to build muscle?",
      a: "About 1.6 to 2.2 g per kg of body weight a day is a common range. Older adults may benefit from the upper end.",
    },
    {
      q: "Does more muscle boost metabolism?",
      a: "A little. Each kilogram of muscle uses about 13 kcal a day at rest. The training needed to build it matters more.",
    },
    {
      q: "What is sarcopenia?",
      a: "Age-related loss of muscle mass and strength that affects daily function. It is a major cause of frailty and falls, and training helps prevent it.",
    },
  ],
  keepGoing: [
    { label: "Workout plans in Traiv", href: "/features/plan-builder" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Track every client's progress under your name",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
