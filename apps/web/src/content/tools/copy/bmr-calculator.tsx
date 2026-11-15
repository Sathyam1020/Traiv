import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "BMR Calculator: Your Resting Calorie Burn (2026)",
  description:
    "Free BMR calculator using the Mifflin-St Jeor equation. Find how many calories your body burns at complete rest, in imperial or metric, with the working shown.",
  eyebrow: "Free tool · Nutrition",
  h1: "BMR calculator",
  intro: (
    <p>
      Basal metabolic rate is the energy your body spends just keeping you alive: breathing,
      circulating blood, keeping organs running and holding your temperature steady. This calculator
      estimates it from sex, age, height and weight using the Mifflin-St Jeor equation, the one most
      dietitians reach for first.
    </p>
  ),
  shortAnswer: {
    question: "What is BMR, and how is it calculated?",
    answer: (
      <>
        <p>
          BMR is the number of calories you would burn in a day if you did nothing at all.
          Mifflin-St Jeor works it out as 10 × weight in kg + 6.25 × height in cm − 5 × age, then
          adds 5 for men or subtracts 161 for women.
        </p>
        <p>
          A 30-year-old man who is 5 ft 10 in and 170 lb has a BMR of about 1,737 kcal. That is the
          floor his body needs before he walks to the kitchen. Everything he does on top of it is
          added later, through an activity factor, to give his total daily energy expenditure.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What BMR is made of",
      body: (
        <>
          <p>
            Most of the energy you burn in a day goes on things you never think about. For a typical
            adult the resting share is between 55 and 75 percent of the total, and it is spread
            across the body very unevenly.
          </p>
          <ul>
            <li>
              <strong>The liver and brain</strong> together use roughly 40 percent of resting
              energy, even though they make up only a few percent of body weight.
            </li>
            <li>
              <strong>The heart and kidneys</strong> are small and expensive: per kilogram, they
              burn more than any other tissue.
            </li>
            <li>
              <strong>Skeletal muscle</strong> uses about a fifth of resting energy. Per kilogram it
              is cheap at rest, but there is a lot of it.
            </li>
            <li>
              <strong>Fat tissue</strong> burns very little: a few calories per kilogram a day.
            </li>
          </ul>
          <p>
            That is why two people of the same weight can have different resting rates, and why the
            equation uses height and sex as well as weight. Taller people tend to have bigger
            organs; men tend to carry more muscle and less fat at the same weight.
          </p>
        </>
      ),
    },
    {
      heading: "The Mifflin-St Jeor equation, step by step",
      body: (
        <>
          <p>The equation needs weight in kilograms, height in centimetres and age in years:</p>
          <ul>
            <li>
              Men: <code>(10 × weight) + (6.25 × height) − (5 × age) + 5</code>
            </li>
            <li>
              Women: <code>(10 × weight) + (6.25 × height) − (5 × age) − 161</code>
            </li>
          </ul>
          <p>
            Using imperial inputs, the calculator first converts: pounds × 0.4536 gives kilograms,
            and total inches × 2.54 gives centimetres. Here is the default example worked through:
          </p>
          <ol>
            <li>170 lb × 0.4536 = 77.1 kg, so 10 × 77.1 = 771</li>
            <li>5 ft 10 in is 70 in, × 2.54 = 177.8 cm, so 6.25 × 177.8 = 1,111</li>
            <li>5 × 30 years = 150</li>
            <li>771 + 1,111 − 150 + 5 = 1,737 kcal</li>
          </ol>
          <p>
            Each extra kilogram adds 10 kcal, each extra centimetre adds about 6, and each extra
            year takes away 5. The constant at the end is where the 166 kcal gap between men and
            women comes from.
          </p>
        </>
      ),
    },
    {
      heading: "Which BMR equation is most accurate?",
      body: (
        <>
          <p>
            There are several equations, and they give answers within a hundred calories or so of
            each other for most people. The differences matter less than knowing what each was built
            from.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Equation</th>
                  <th scope="col">Year</th>
                  <th scope="col">Uses</th>
                  <th scope="col">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mifflin-St Jeor</td>
                  <td>1990</td>
                  <td>Weight, height, age, sex</td>
                  <td>Most adults; the usual default</td>
                </tr>
                <tr>
                  <td>Harris-Benedict (revised)</td>
                  <td>1984</td>
                  <td>Weight, height, age, sex</td>
                  <td>Comparing with older references</td>
                </tr>
                <tr>
                  <td>Katch-McArdle</td>
                  <td>1975</td>
                  <td>Lean body mass</td>
                  <td>People who know their body fat accurately</td>
                </tr>
                <tr>
                  <td>Cunningham</td>
                  <td>1980</td>
                  <td>Lean body mass</td>
                  <td>Very muscular, very active people</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            When the American Dietetic Association reviewed the common equations against measured
            resting rates in 2005, Mifflin-St Jeor came out as the most reliable for healthy adults,
            landing within 10 percent for more people than the alternatives. The lean-mass equations
            can be better for athletes, but only if body fat is measured well, and a guessed body
            fat percentage adds more error than it removes.
          </p>
        </>
      ),
    },
    {
      heading: "BMR, RMR and TDEE are three different numbers",
      body: (
        <>
          <p>These terms get used interchangeably, but they are not the same thing:</p>
          <ul>
            <li>
              <strong>BMR (basal metabolic rate)</strong> is measured under strict conditions: after
              a night's sleep, twelve hours without food, lying still in a warm room. It is the true
              minimum.
            </li>
            <li>
              <strong>RMR (resting metabolic rate)</strong> is measured with looser rules and
              usually comes out a little higher. In practice the equations predict something between
              the two, and most people use the terms as if they were the same.
            </li>
            <li>
              <strong>TDEE (total daily energy expenditure)</strong> is everything: resting
              metabolism, plus the energy used digesting food, plus all movement and exercise. It is
              the number that matters for setting a calorie target.
            </li>
          </ul>
          <p>
            To go from BMR to TDEE, multiply by an activity factor between 1.2 (desk job, no
            exercise) and 1.9 (hard training on top of physical work). The TDEE and maintenance
            calculators do this step for you.
          </p>
        </>
      ),
    },
    {
      heading: "What changes your BMR",
      body: (
        <>
          <ul>
            <li>
              <strong>Body size.</strong> More weight, of any kind, raises BMR. Losing weight lowers
              it, which is one reason fat loss slows over time.
            </li>
            <li>
              <strong>Muscle.</strong> Adding muscle raises resting burn, but less than gym folklore
              suggests: roughly 10 to 15 kcal a day per kilogram of muscle. Building 3 kg of muscle
              adds about the energy in a small apple.
            </li>
            <li>
              <strong>Age.</strong> The equation subtracts 5 kcal a year. A large 2021 study of
              measured expenditure found it stays fairly stable from the twenties to about 60, then
              declines; much of the earlier drop people notice comes from moving less and losing
              muscle.
            </li>
            <li>
              <strong>Dieting.</strong> After a long or aggressive diet, resting burn can fall a
              little more than the weight loss alone explains. This adaptation is real but usually
              modest.
            </li>
            <li>
              <strong>Thyroid function, illness and some medications</strong> can shift BMR
              substantially. An equation cannot see any of these.
            </li>
            <li>
              <strong>Pregnancy and breastfeeding</strong> raise energy needs well above what any of
              these equations predict.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Can you speed up your metabolism?",
      body: (
        <>
          <p>
            Not in the ways most products promise. Green tea, chilli, cold showers and
            "metabolism-boosting" foods produce effects of a few calories a day at most, too small
            to show up on a scale.
          </p>
          <p>The things that genuinely change how much you burn are less exciting:</p>
          <ul>
            <li>
              <strong>Moving more through the day.</strong> Walking, standing and general activity
              vary by hundreds of calories between people, far more than BMR does.
            </li>
            <li>
              <strong>Strength training.</strong> It preserves muscle during a diet, which protects
              resting burn and keeps the weight lost from being muscle.
            </li>
            <li>
              <strong>Eating enough protein.</strong> Protein costs more energy to digest than
              carbohydrate or fat, and helps keep muscle during a deficit.
            </li>
            <li>
              <strong>Not dieting harder than necessary.</strong> Moderate deficits lead to less
              adaptation than crash diets.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "BMR at different sizes and ages",
      body: (
        <>
          <p>
            To get a feel for how much BMR varies, here are Mifflin-St Jeor estimates for a range of
            people. Each row changes one or two things from the row above, so you can see which
            inputs move the number most.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Person</th>
                  <th scope="col">Height</th>
                  <th scope="col">Weight</th>
                  <th scope="col">BMR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Woman, 25</td>
                  <td>160 cm</td>
                  <td>55 kg</td>
                  <td>1,264 kcal</td>
                </tr>
                <tr>
                  <td>Woman, 45</td>
                  <td>160 cm</td>
                  <td>55 kg</td>
                  <td>1,164 kcal</td>
                </tr>
                <tr>
                  <td>Woman, 45</td>
                  <td>170 cm</td>
                  <td>75 kg</td>
                  <td>1,426 kcal</td>
                </tr>
                <tr>
                  <td>Man, 25</td>
                  <td>175 cm</td>
                  <td>70 kg</td>
                  <td>1,674 kcal</td>
                </tr>
                <tr>
                  <td>Man, 45</td>
                  <td>175 cm</td>
                  <td>70 kg</td>
                  <td>1,574 kcal</td>
                </tr>
                <tr>
                  <td>Man, 45</td>
                  <td>185 cm</td>
                  <td>100 kg</td>
                  <td>1,936 kcal</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Twenty years of age moves the estimate by 100 kcal. Twenty kilograms of weight moves it
            by 200, and ten centimetres of height by about 60. Body size, not age, is what mostly
            separates one person's resting burn from another's.
          </p>
        </>
      ),
    },
    {
      heading: "Common misunderstandings about BMR",
      body: (
        <ul>
          <li>
            <strong>"Eating below BMR damages your metabolism."</strong> A short period below BMR
            does no lasting harm, and very large people on supervised diets often eat below it
            safely. The real problems with eating that little are hunger, low energy, poor training
            and muscle loss, which make a diet hard to sustain.
          </li>
          <li>
            <strong>"A slow metabolism is why I can't lose weight."</strong> Measured resting rates
            of people who say this are usually close to what the equations predict. Differences
            between people mostly come from daily movement and intake, both of which are easy to
            misjudge.
          </li>
          <li>
            <strong>"Thin people have fast metabolisms."</strong> Larger bodies burn more at rest,
            not less. People who stay slim easily often move more through the day or eat less than
            they appear to.
          </li>
          <li>
            <strong>"BMR is the minimum I am allowed to eat."</strong> It is a reference point, not
            a rule. A sensible fat-loss target usually sits between BMR and TDEE.
          </li>
        </ul>
      ),
    },
    {
      heading: "Using BMR to sanity-check a diet",
      body: (
        <p>
          The most practical everyday use of BMR is as a quick check on any calorie target, whether
          it comes from an app, a plan someone found online or a coach. Compare the target with the
          BMR shown above. If it sits well above BMR and below your estimated maintenance, it is in
          the normal range for fat loss. If it sits at or below BMR, the deficit is large, and it is
          worth asking whether that pace is necessary and whether the person can sustain it while
          training and working. If it sits above maintenance, it is a gaining target, whatever it
          was called. This one comparison catches most of the badly set targets people bring to a
          coach, and it takes a few seconds.
        </p>
      ),
    },
    {
      heading: "BMR for teenagers and older adults",
      body: (
        <>
          <p>
            The equation accepts ages from 14, but it was built on adults. Teenagers who are still
            growing need energy for growth on top of what the formula predicts, and very active
            teenagers can need far more than the activity factors suggest. At the other end, adults
            past about 70 often have less muscle than the average adult of their weight, so the
            estimate can run a little high. In both groups the number is still useful as a rough
            reference, but setting actual intake is better done with a doctor or registered
            dietitian, especially if weight is changing quickly.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using BMR with clients",
    body: (
      <>
        <p>
          BMR is most useful as a guardrail rather than a target. When you set a client's intake for
          fat loss, check it against their resting rate. If the target is close to or below BMR, the
          deficit is too large to sustain, and you are likely to see fatigue, poor training and a
          client who gives up.
        </p>
        <p>
          It is also a good teaching number. Clients are often surprised that most of their daily
          burn happens while they are doing nothing, and that a gym session adds less than they
          thought. That conversation makes it easier to talk about daily steps and food, which move
          the needle more than the workout's calorie count.
        </p>
        <p>
          Recalculate after significant weight change. A client who has lost 10 kg has a resting
          rate about 100 kcal lower than when they started, before any adaptation.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Set each client's targets from their own numbers",
    body: (
      <p>
        In Traiv you set each client's daily calories and protein, carbohydrate and fat split, build
        their diet plan from recipes, and review the food they log against it. When their weight
        changes, you update the target in one place.
      </p>
    ),
  },
  next: [
    {
      label: "Turn this BMR into daily calories with an activity level",
      href: "/tools/tdee-calculator",
    },
    { label: "Find your maintenance calories", href: "/tools/maintenance-calorie-calculator" },
  ],
  nextPitch:
    "Setting targets for clients? Traiv keeps each client's targets and food logs together.",
  faq: [
    {
      q: "What is a normal BMR?",
      a: "For adults it commonly falls between about 1,200 and 1,500 kcal a day for women and 1,500 to 1,900 kcal for men, but taller, heavier and more muscular people sit higher. There is no single healthy number; it depends on body size.",
    },
    {
      q: "Is BMR the same as the calories I should eat?",
      a: "No. BMR covers only what your body burns at complete rest. Eating at your BMR would leave nothing for daily movement and exercise, so it would put most people in a large deficit. Use your TDEE or maintenance calories to set a target.",
    },
    {
      q: "Why is my BMR lower than my friend's?",
      a: "Usually because of body size and sex. Larger and taller people have more tissue to maintain, and men tend to carry more muscle at the same weight. Age also lowers the estimate by 5 kcal a year.",
    },
    {
      q: "How accurate is the Mifflin-St Jeor equation?",
      a: "It predicts resting rate within about 10 percent for most healthy adults, which made it the most reliable of the common equations in a 2005 review. Around one person in three still falls outside that range, so treat it as an estimate.",
    },
    {
      q: "Does building muscle raise BMR a lot?",
      a: "Less than often claimed. Each kilogram of muscle adds roughly 10 to 15 kcal a day at rest. The bigger benefit of strength training is keeping muscle during a diet, so the weight you lose is mostly fat.",
    },
    {
      q: "Can I measure my BMR exactly?",
      a: "Yes, with indirect calorimetry, which measures the oxygen you use and the carbon dioxide you breathe out. Some clinics and sports labs offer it. For most people an equation plus a few weeks of weigh-ins is accurate enough.",
    },
    {
      q: "Should I use this if I am pregnant, ill or on thyroid medication?",
      a: "Use it only as a rough reference. Pregnancy, illness and thyroid conditions all change energy needs in ways the equation cannot see, so a doctor or registered dietitian should set intake.",
    },
  ],
  disclaimer: (
    <p>
      This calculator gives general information, not medical advice. If you are pregnant,
      breastfeeding, under 18, managing a medical condition or have a history of disordered eating,
      talk to a doctor or registered dietitian before changing what you eat.
    </p>
  ),
  keepGoing: [
    { label: "TDEE calculator", href: "/tools/tdee-calculator" },
    { label: "Maintenance calorie calculator", href: "/tools/maintenance-calorie-calculator" },
    { label: "Macro calculator", href: "/tools/macro-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Targets, plans and food logs for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
