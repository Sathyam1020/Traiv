import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Macro Split by Body Type: Ecto, Meso and Endo Macros",
  description:
    "Free body type macro calculator. Get calories and a protein, carb and fat split for ectomorph, mesomorph or endomorph builds, with honest notes on the evidence.",
  eyebrow: "Free tool · Nutrition",
  h1: "Macro split by body type",
  intro: (
    <p>
      Pick the build closest to yours (ectomorph, mesomorph or endomorph) and this calculator
      estimates your daily calories, then splits them into protein, carbohydrate and fat using the
      traditional ratio for that body type. Below the tool you will find what the body types
      actually are, where the idea came from, and how much weight to put on it.
    </p>
  ),
  shortAnswer: {
    question: "What macro split suits each body type?",
    answer: (
      <>
        <p>
          The traditional starting splits are: ectomorph 25% protein, 55% carbohydrate, 20% fat;
          mesomorph 30%, 40%, 30%; endomorph 35%, 25%, 40%. The idea is that leaner, narrower builds
          handle more carbohydrate and broader builds do better with less.
        </p>
        <p>
          Treat these as a first guess. There is little evidence that body shape predicts how
          someone responds to carbohydrate, and total calories and protein matter far more than the
          ratio. Start with the split, then adjust from how you feel, train and progress.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "The three body types",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Typical description</th>
                  <th scope="col">Split (P / C / F)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ectomorph</td>
                  <td>
                    Long, narrow frame; slim wrists and shoulders; finds it hard to gain weight
                  </td>
                  <td>25 / 55 / 20</td>
                </tr>
                <tr>
                  <td>Mesomorph</td>
                  <td>Medium frame, naturally muscular; gains and loses fairly readily</td>
                  <td>30 / 40 / 30</td>
                </tr>
                <tr>
                  <td>Endomorph</td>
                  <td>Broader, rounder frame; gains fat more easily, often strong</td>
                  <td>35 / 25 / 40</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Most people are a blend rather than a pure type. If you sit between two, use the one
            that matches your history best: how easily you have gained or lost in the past says more
            than the shape of your wrists.
          </p>
        </>
      ),
    },
    {
      heading: "Where body types come from, and what the evidence says",
      body: (
        <>
          <p>
            The three types come from somatotyping, developed by the psychologist William Sheldon in
            the 1940s. Sheldon believed body shape was linked to personality, an idea that has long
            been abandoned. The physical classification survived, was refined into the Heath-Carter
            method used in sports science, and later picked up by the fitness industry as a way to
            tailor diets.
          </p>
          <p>
            The diet part is where the evidence is thinnest. Studies that assign people to diets by
            body shape have not shown that matching the macro split to the type improves results.
            What does consistently predict results is total calories, enough protein, and whether
            someone can stick with the plan.
          </p>
          <p>
            There is a kernel of sense in the idea. People who carry more body fat often have lower
            insulin sensitivity, and some find they feel better and control appetite more easily
            with less carbohydrate. Very active, lean people tend to train better with more. But
            those are effects of body composition and activity, not of frame shape, and you can
            observe them directly rather than inferring them from a body type.
          </p>
        </>
      ),
    },
    {
      heading: "How this calculator works",
      body: (
        <>
          <ol>
            <li>
              <strong>Calories:</strong> resting rate from Mifflin-St Jeor, times your activity
              factor, gives maintenance. A cut is 500 kcal below it and a bulk 300 above.
            </li>
            <li>
              <strong>Split:</strong> the calories are divided by your body type's percentages.
            </li>
            <li>
              <strong>Grams:</strong> protein and carbohydrate calories are divided by 4, fat
              calories by 9.
            </li>
          </ol>
          <p>
            Because the split is percentage-based, protein moves with calories. On a small cut,
            especially for an ectomorph split, it can fall below the 1.6 g per kg most people who
            train should aim for. Check the protein figure against your body weight and nudge it up
            if needed, taking the extra from carbohydrate.
          </p>
        </>
      ),
    },
    {
      heading: "A better way to choose your split",
      body: (
        <>
          <p>
            If you want a split that fits you rather than a category, work through these in order:
          </p>
          <ol>
            <li>
              <strong>Set protein first:</strong> 1.6 to 2.2 g per kg of body weight, higher when
              dieting.
            </li>
            <li>
              <strong>Set a fat minimum:</strong> at least 0.6 g per kg, or about 20 percent of
              calories.
            </li>
            <li>
              <strong>Choose how to spend the rest:</strong> more carbohydrate if you train hard and
              often, more fat if you train lightly and prefer richer food.
            </li>
            <li>
              <strong>Run it for three weeks:</strong> track energy, training, hunger and the weekly
              weight trend.
            </li>
            <li>
              <strong>Adjust:</strong> if sessions feel flat, shift calories toward carbohydrate; if
              hunger is the problem, try more fat or fibre.
            </li>
          </ol>
          <p>
            The body-type split is a reasonable place to start step three. It is not a reason to
            skip steps one and four.
          </p>
        </>
      ),
    },
    {
      heading: "Example splits at 2,500 kcal",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Protein</th>
                  <th scope="col">Carbohydrate</th>
                  <th scope="col">Fat</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ectomorph</td>
                  <td>156 g</td>
                  <td>344 g</td>
                  <td>56 g</td>
                </tr>
                <tr>
                  <td>Mesomorph</td>
                  <td>188 g</td>
                  <td>250 g</td>
                  <td>83 g</td>
                </tr>
                <tr>
                  <td>Endomorph</td>
                  <td>219 g</td>
                  <td>156 g</td>
                  <td>111 g</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Same calories, very different plates. The ectomorph version looks like a lot of rice,
            oats and fruit; the endomorph version has more meat, eggs, dairy, nuts and oils. Both
            deliver the same energy, and either can work if it suits the person eating it.
          </p>
        </>
      ),
    },
    {
      heading: "Signs your split is wrong for you",
      body: (
        <>
          <p>
            Whatever your type, your body will tell you within a few weeks whether a split suits
            you. Watch for these:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">What you notice</th>
                  <th scope="col">Likely cause</th>
                  <th scope="col">Try</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Training feels flat, pump is poor, legs feel heavy</td>
                  <td>Too little carbohydrate for your training load</td>
                  <td>Move 50 to 100 g of carbs in, take the calories from fat</td>
                </tr>
                <tr>
                  <td>Hungry an hour after meals</td>
                  <td>Meals low in protein, fibre or fat</td>
                  <td>Raise protein and vegetables; try more fat at the hungriest meal</td>
                </tr>
                <tr>
                  <td>Energy crashes mid-afternoon</td>
                  <td>Large, fast-digesting carbohydrate meal at lunch</td>
                  <td>Spread carbs more evenly; pair them with protein</td>
                </tr>
                <tr>
                  <td>Constant cravings for sweet food</td>
                  <td>Often too large a deficit, or carbs cut too far</td>
                  <td>Check total calories before changing the split</td>
                </tr>
                <tr>
                  <td>Lifts dropping during a cut</td>
                  <td>Low carbs, a deficit that is too steep, or poor sleep</td>
                  <td>Keep carbs around training; slow the rate of loss</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Change one thing at a time and give it two weeks. Changing the split, calories and
            training in the same week makes it impossible to tell what worked.
          </p>
        </>
      ),
    },
    {
      heading: "Body type and training style",
      body: (
        <>
          <p>
            The body-type idea is sometimes stretched to training too: ectomorphs told to avoid
            cardio, endomorphs told to do lots of it. The same caution applies. Everyone builds
            muscle with progressive resistance training, and everyone benefits from some
            cardiovascular work for health.
          </p>
          <p>What genuinely differs between people, and is worth adjusting for, is:</p>
          <ul>
            <li>
              <strong>Recovery.</strong> Some people tolerate high training volume and others need
              more rest between hard sessions. Track performance, not labels.
            </li>
            <li>
              <strong>Appetite response to exercise.</strong> Some people get much hungrier after
              cardio; for them, walking may be a better tool than running for fat loss.
            </li>
            <li>
              <strong>Starting point.</strong> Someone with little muscle and little fat needs to
              build; someone with more fat may benefit most from a modest deficit while they learn
              to train.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "From percentages to plates",
      body: (
        <>
          <p>
            A percentage split is easier to follow once it becomes a pattern of meals. Using a 2,400
            kcal target as an example, here is roughly what each split looks like across four meals:
          </p>
          <ul>
            <li>
              <strong>Ectomorph (25/55/20):</strong> about 38 g protein, 83 g carbohydrate and 13 g
              fat per meal. Think a large bowl of rice or pasta with lean meat, fruit and a little
              oil.
            </li>
            <li>
              <strong>Mesomorph (30/40/30):</strong> about 45 g protein, 60 g carbohydrate and 20 g
              fat per meal. A balanced plate: a palm or two of protein, a fist or two of carbs, a
              thumb of fat, vegetables.
            </li>
            <li>
              <strong>Endomorph (35/25/40):</strong> about 53 g protein, 38 g carbohydrate and 27 g
              fat per meal. More meat, fish, eggs and dairy, a smaller portion of starch, generous
              vegetables and some nuts or oil.
            </li>
          </ul>
          <p>
            None of these needs special foods. The difference is mostly in how much of the plate is
            starch and how much is protein and fat.
          </p>
        </>
      ),
    },
    {
      heading: "Why body-type diets remain popular",
      body: (
        <>
          <p>
            If the evidence is weak, why do so many coaches and apps still use body types? Partly
            because they are easy to understand. Telling someone they have a particular type gives
            them a simple story about why past diets did or did not work, and a clear rule to
            follow. That kind of clarity is genuinely helpful for adherence, which is the thing that
            most determines results.
          </p>
          <p>
            Body types also roughly track real differences in how active people are and how much
            body fat they carry. Someone who describes themselves as an ectomorph is often naturally
            active and lean, and many such people do train better with more carbohydrate. Someone
            who describes themselves as an endomorph often carries more fat, and some of them find a
            lower-carbohydrate approach easier to sustain. The type can point in a useful direction
            even when the underlying explanation is wrong.
          </p>
          <p>
            The risk is that the label becomes a limit. "I'm an endomorph, so I'll always struggle"
            is a belief that does more harm than any macro split. Used lightly, as a starting point
            you expect to adjust, body types are harmless and sometimes helpful. Used as destiny,
            they get in the way.
          </p>
        </>
      ),
    },
    {
      heading: "Sex, age and body type",
      body: (
        <p>
          The splits on this page apply to both men and women, but the calorie targets they are
          applied to differ, so the gram amounts differ too. Women generally have lower calorie
          needs, which means a percentage split can leave protein lower in grams than recommended,
          especially on a cut. Older adults face a similar issue because their calorie needs tend to
          fall while their protein needs per kilogram rise. In both cases, check protein in grams
          against body weight, aiming for at least 1.6 g per kg, and move calories from carbohydrate
          to protein if the split falls short.
        </p>
      ),
    },
    {
      heading: "Testing your split properly",
      body: (
        <>
          <p>
            If you want to know whether your body type split really suits you, treat it as a small
            experiment rather than a fixed rule. Keep total calories and protein the same and run
            one split for three weeks while recording your weekly average weight, how your training
            sessions felt, your hunger on a simple scale of one to five, and your energy in the
            afternoon. Then move about 100 g of carbohydrate into fat, or the reverse, and repeat
            for another three weeks with everything else unchanged.
          </p>
          <p>
            At the end, compare the two blocks. If weight change was similar and you preferred how
            one split felt, that is your answer, whatever your body type says. Most people find the
            difference is small, which is itself useful information: it means you can choose the
            split that makes meals most enjoyable and easiest to plan, without worrying that you are
            working against your physiology.
          </p>
        </>
      ),
    },
    {
      heading: "Combining body type with a goal",
      body: (
        <>
          <p>
            The calculator lets you combine a body type with a goal, and the goal changes the
            calories while the type changes how they are divided. On a cut, every split shrinks, and
            the protein figure is the one to watch most closely. On a bulk, the extra calories
            mostly go into carbohydrate for the ectomorph split and into fat for the endomorph
            split, which changes how the extra food feels to eat.
          </p>
          <p>
            If you are cutting with the ectomorph split, you may find that protein in grams falls
            below your body weight target; raise it and reduce carbohydrate by the same number of
            calories. If you are bulking with the endomorph split, the high fat share can make the
            surplus easy to eat but leave less carbohydrate for training; consider shifting toward
            the mesomorph split if sessions start to feel flat. In both cases the split is a
            starting point, and the right adjustment is the one that keeps protein adequate and
            training strong.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using body types with clients",
    body: (
      <>
        <p>
          Clients often arrive having read that they are an endomorph and should avoid carbs. The
          body-type split can be a useful bridge: it gives them a framework they recognise, and from
          there you can steer toward what the evidence supports, which is calories, protein and
          adherence.
        </p>
        <p>
          Watch for clients who use their type as a reason something cannot work for them. Their
          history of gaining or losing is real information; the label is not. Run the plan, collect
          three weeks of data, and let the results decide the split.
        </p>
        <p>
          Always check protein in grams against body weight. A percentage split can leave a lighter
          ectomorph or a dieting client short.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Set a split, then see what each client actually eats",
    body: (
      <p>
        In Traiv you set each client's calories and protein, carbohydrate and fat split, build their
        diet plan from recipes, and review their food log, so you can adjust the split from real
        intake rather than a label.
      </p>
    ),
  },
  next: [
    { label: "Set macros from body weight instead", href: "/tools/macro-calculator" },
    { label: "Check your protein target", href: "/tools/protein-calculator" },
  ],
  nextPitch: "Setting macros for clients? Traiv keeps targets, plans and food logs together.",
  faq: [
    {
      q: "How do I know my body type?",
      a: "Look at your frame and your history. Long and narrow and hard to gain points to ectomorph; naturally muscular and responsive to training points to mesomorph; broader and quick to gain fat points to endomorph. Most people are a mix.",
    },
    {
      q: "Is the body type diet backed by science?",
      a: "Only loosely. Somatotypes are a real way to describe physique, but studies have not shown that matching macros to body type improves results. Calories, protein and adherence matter far more.",
    },
    {
      q: "Should endomorphs avoid carbs?",
      a: "Not necessarily. Some people with more body fat feel better on lower carbohydrate, but fat loss at equal calories is similar either way. Try the split and judge it by your energy, hunger and progress.",
    },
    {
      q: "Can your body type change?",
      a: "Your frame does not, but body composition does. Many people who considered themselves endomorphs look and respond very differently after a year of training and better eating.",
    },
    {
      q: "Why is my protein low on the ectomorph split?",
      a: "Because the split is a percentage of calories. At lower calorie targets, 25 percent may fall below 1.6 g per kg of body weight. Raise protein to that level and take the difference from carbohydrate.",
    },
    {
      q: "Which is more important, my split or my calories?",
      a: "Calories, then protein. The split between carbohydrate and fat matters least for body composition and most for how you feel and train.",
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
    { label: "Macro calculator", href: "/tools/macro-calculator" },
    { label: "Carb cycling calculator", href: "/tools/carb-cycling-calculator" },
    { label: "Keto macro calculator", href: "/tools/keto-macro-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Splits that fit the client, adjusted from real data",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
