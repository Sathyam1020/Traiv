import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Macro Calculator: Protein, Carbs and Fat in Grams (2026)",
  description:
    "Free macro calculator. Get daily calories and protein, carb and fat targets in grams for cutting, maintaining or bulking, in imperial or metric.",
  eyebrow: "Free tool · Nutrition",
  h1: "Macro calculator",
  intro: (
    <p>
      Macros are the three nutrients that supply calories: protein, carbohydrate and fat. This
      calculator estimates your daily calories from your body and activity, adjusts them for your
      goal, and splits them into grams of each macro, with protein set from your body weight so it
      stays high enough whatever the calorie target.
    </p>
  ),
  shortAnswer: {
    question: "How do you calculate your macros?",
    answer: (
      <>
        <p>
          Start with a calorie target: maintenance for holding weight, about 500 below for a cut,
          about 300 above for a bulk. Set protein first at 1.8 to 2.0 g per kg of body weight. Give
          fat about a quarter of the calories. Whatever is left is carbohydrate.
        </p>
        <p>
          For a 175 lb (79 kg) man eating 2,728 kcal to maintain, that works out to about 143 g
          protein, 76 g fat and 369 g carbohydrate. Protein and carbohydrate supply 4 kcal per gram
          and fat supplies 9.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How this calculator sets each macro",
      body: (
        <>
          <ol>
            <li>
              <strong>Calories.</strong> Resting rate from Mifflin-St Jeor, times your activity
              factor, gives maintenance. A cut subtracts 500 kcal; a bulk adds 300.
            </li>
            <li>
              <strong>Protein.</strong> 2.0 g per kg of body weight when cutting, 1.8 g per kg
              otherwise. A deficit is when muscle is most at risk, so protein goes up as calories
              come down.
            </li>
            <li>
              <strong>Fat.</strong> 25 percent of calories, but never less than 0.6 g per kg. Fat is
              needed for hormone production and to absorb some vitamins, so it has a floor even on
              small targets.
            </li>
            <li>
              <strong>Carbohydrate.</strong> Everything that remains. It is the most flexible macro
              and the main fuel for hard training.
            </li>
          </ol>
          <p>
            If a target is so small that protein and the fat floor leave no room for carbohydrate,
            the result says so rather than printing a negative number. That is a sign the calorie
            target is too low to be sensible without professional supervision.
          </p>
        </>
      ),
    },
    {
      heading: "Why protein is set per kilogram, not as a percentage",
      body: (
        <>
          <p>
            Many calculators split calories by fixed percentages, such as 30/40/30. That works at
            maintenance but goes wrong at the edges. On a 1,500 kcal diet, 30 percent protein is
            only 112 g, which can be too little for a heavier person trying to keep muscle. On a
            4,000 kcal bulk, 30 percent is 300 g, far more than anyone needs.
          </p>
          <p>
            The evidence on protein is tied to body weight. The International Society of Sports
            Nutrition recommends 1.4 to 2.0 g per kg a day for people who train, and a large 2018
            meta-analysis found the benefit for muscle levels off around 1.6 g per kg, with higher
            intakes as a reasonable margin. Setting protein per kilogram keeps it in that range at
            every calorie level.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Body weight</th>
                  <th scope="col">1.6 g/kg</th>
                  <th scope="col">1.8 g/kg</th>
                  <th scope="col">2.0 g/kg</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>60 kg (132 lb)</td>
                  <td>96 g</td>
                  <td>108 g</td>
                  <td>120 g</td>
                </tr>
                <tr>
                  <td>70 kg (154 lb)</td>
                  <td>112 g</td>
                  <td>126 g</td>
                  <td>140 g</td>
                </tr>
                <tr>
                  <td>80 kg (176 lb)</td>
                  <td>128 g</td>
                  <td>144 g</td>
                  <td>160 g</td>
                </tr>
                <tr>
                  <td>90 kg (198 lb)</td>
                  <td>144 g</td>
                  <td>162 g</td>
                  <td>180 g</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            For people carrying a lot of body fat, protein based on total weight can come out high.
            Basing it on goal weight, or about 1.2 to 1.5 g per kg of total weight, is a reasonable
            adjustment.
          </p>
        </>
      ),
    },
    {
      heading: "Carbohydrate and fat: the flexible part",
      body: (
        <>
          <p>
            Once protein is covered and fat is above its floor, the split between carbohydrate and
            fat matters much less than total calories for fat loss. Controlled studies comparing
            low-carb and low-fat diets at the same calories find very similar fat loss.
          </p>
          <p>The split is better chosen by preference and training:</p>
          <ul>
            <li>
              <strong>Hard, frequent training</strong> (lifting, team sports, intervals) runs
              largely on carbohydrate. More carbs usually means better sessions.
            </li>
            <li>
              <strong>Lighter training and a preference for richer food</strong> can suit a higher
              fat share.
            </li>
            <li>
              <strong>Appetite</strong> differs between people. Some find fat more filling; others
              find high-fibre carbohydrate keeps them fuller.
            </li>
          </ul>
          <p>
            The best split is the one someone can keep eating, week after week, while hitting their
            protein and calorie targets.
          </p>
        </>
      ),
    },
    {
      heading: "Turning grams into meals",
      body: (
        <>
          <p>
            Numbers on a screen only help if they become food. A practical way to hit macro targets
            without weighing everything for life:
          </p>
          <ul>
            <li>
              <strong>Build each meal around a protein source.</strong> Spread protein across three
              to five meals of roughly 25 to 40 g each.
            </li>
            <li>
              <strong>Add vegetables freely.</strong> They add volume and fibre for very few
              calories.
            </li>
            <li>
              <strong>Use carbohydrate portions to adjust calories.</strong> Rice, potatoes, bread,
              oats and fruit are the easiest lever.
            </li>
            <li>
              <strong>Measure fats.</strong> Oil, butter, nuts and cheese are calorie-dense and easy
              to underestimate.
            </li>
            <li>
              <strong>Aim for close, not perfect.</strong> Within about 5 to 10 g of protein and 100
              kcal of calories on most days is accurate enough to see results.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "When to change your macros",
      body: (
        <>
          <p>
            Macros are a starting point. Adjust them from what actually happens over two to three
            weeks:
          </p>
          <ul>
            <li>
              <strong>Weight not moving on a cut:</strong> reduce calories by 100 to 200, usually
              from carbohydrate or fat, and keep protein the same.
            </li>
            <li>
              <strong>Losing faster than 1 percent of body weight a week:</strong> add calories
              back.
            </li>
            <li>
              <strong>Training feels flat:</strong> move some calories from fat to carbohydrate
              before cutting total calories further.
            </li>
            <li>
              <strong>Constantly hungry:</strong> try more protein and fibre within the same
              calories, or a slightly smaller deficit.
            </li>
            <li>
              <strong>Weight changed by 4 to 5 kg:</strong> recalculate from the new weight.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Example macros for three goals",
      body: (
        <>
          <p>
            For the default person on this page, a 30-year-old man at 5 ft 10 in and 175 lb (79 kg)
            who trains three to five times a week, maintenance is about 2,728 kcal. Here is how the
            split changes with the goal:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Goal</th>
                  <th scope="col">Calories</th>
                  <th scope="col">Protein</th>
                  <th scope="col">Fat</th>
                  <th scope="col">Carbs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cut</td>
                  <td>2,228</td>
                  <td>159 g</td>
                  <td>62 g</td>
                  <td>259 g</td>
                </tr>
                <tr>
                  <td>Maintain</td>
                  <td>2,728</td>
                  <td>143 g</td>
                  <td>76 g</td>
                  <td>369 g</td>
                </tr>
                <tr>
                  <td>Bulk</td>
                  <td>3,028</td>
                  <td>143 g</td>
                  <td>84 g</td>
                  <td>425 g</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Protein rises on the cut while total calories fall, and nearly all of the change between
            goals comes out of carbohydrate. That is deliberate: carbohydrate is the macro the body
            can do with less of, and fat has a floor.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking macros without losing your mind",
      body: (
        <>
          <ul>
            <li>
              <strong>Weigh, don't eyeball, for the first two weeks.</strong> Most people
              underestimate portions of calorie-dense foods by a third or more. A short period of
              weighing calibrates the eye for good.
            </li>
            <li>
              <strong>Log before you eat, not after.</strong> Planning the day in the morning turns
              tracking into a decision rather than a confession.
            </li>
            <li>
              <strong>Repeat meals.</strong> A small set of breakfasts and lunches with known macros
              does most of the work; only dinners and occasions need thinking about.
            </li>
            <li>
              <strong>Hit protein first.</strong> If you get one number right each day, make it
              protein. Calories close to target and protein on target is a good day.
            </li>
            <li>
              <strong>Use weekly averages.</strong> A day 300 kcal over is offset by a few days
              slightly under. Bodies respond to the week, not the day.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Macros for vegetarians and vegans",
      body: (
        <>
          <p>
            The same targets work without meat, but reaching the protein number takes more planning.
            Plant proteins are often packaged with more carbohydrate or fat, so a portion that
            delivers 25 g of protein may carry more calories than chicken or fish would. Some plant
            proteins are also lower in one or more essential amino acids, which is easily solved by
            eating a variety of sources across the day.
          </p>
          <p>
            Useful staples include tofu, tempeh, seitan, lentils, chickpeas, beans, edamame, Greek
            yoghurt and cottage cheese for vegetarians, and soy or pea protein powders for anyone
            who struggles to reach the target from food. Aiming toward the upper end of the protein
            range, around 2 g per kg, gives a margin that covers the slightly lower digestibility of
            some plant proteins.
          </p>
        </>
      ),
    },
    {
      heading: "Do macros need to change with age?",
      body: (
        <p>
          Older adults generally benefit from more protein, not less. Muscle becomes less responsive
          to protein with age, and loss of muscle is one of the main drivers of reduced strength and
          independence later in life. Many researchers suggest adults over about 60 aim for at least
          1.2 to 1.6 g per kg a day, with 25 to 40 g at each main meal, combined with regular
          strength training. Calorie needs usually fall with age, so protein makes up a larger share
          of a smaller total. The calculator's per-kilogram protein setting already handles this
          well; just be sure the calorie target reflects a realistic activity level.
        </p>
      ),
    },
    {
      heading: "Macros and meal timing",
      body: (
        <>
          <p>
            Once daily totals are right, when you eat them matters much less than most people think.
            There are a few timing habits with reasonable support behind them. Spreading protein
            across three to five meals, each with roughly 25 to 40 g, seems to support muscle better
            than eating most of it in one sitting. Eating a meal containing carbohydrate and protein
            in the few hours before hard training helps performance, and eating again within a few
            hours afterwards supports recovery. Beyond that, choose a meal pattern that controls
            your hunger and fits your day, because the totals across the week drive the results.
          </p>
        </>
      ),
    },
    {
      heading: "Fibre, sugar and the quality of your macros",
      body: (
        <>
          <p>
            Two diets with identical macros can look very different on the plate. The calculator
            does not tell carbohydrate from a potato apart from carbohydrate from a sweet drink, but
            your body and your appetite notice the difference. Aim for most carbohydrate to come
            from whole grains, potatoes, beans, fruit and vegetables, which bring fibre, vitamins
            and minerals along with the energy, and keep added sugar to a modest share. A useful
            benchmark is at least 25 to 30 g of fibre a day for most adults.
          </p>
          <p>
            The same goes for fat and protein. Oily fish, olive oil, nuts and seeds supply healthier
            fats than heavily processed snacks, and varied protein sources, including some plant
            proteins, cover a wider range of nutrients than eating the same food every day. Getting
            the numbers right is the first step; filling them with mostly whole foods is what makes
            the diet good for long-term health as well as body composition.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using macros with clients",
    body: (
      <>
        <p>
          Not every client needs full macro targets. For many, a calorie target plus a protein
          target is enough, and letting carbohydrate and fat float makes the plan far easier to
          follow. Introduce full macros to clients who are already consistent and want more
          precision.
        </p>
        <p>
          When you do set macros, explain the order: protein first, then calories, then the rest.
          Clients who understand that protein is the fixed point stop worrying about whether 160 g
          or 180 g of carbs is right.
        </p>
        <p>
          Review the food log rather than just the totals. Two clients hitting the same macros, one
          with mostly whole foods and one with mostly snacks, will feel and train very differently.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Turn these macros into a diet plan",
    body: (
      <p>
        In Traiv you set each client's daily calories and their protein, carbohydrate and fat split,
        build their diet plan from recipes and ingredients, and see what they log against those
        targets.
      </p>
    ),
  },
  next: [
    { label: "Split protein across your meals", href: "/tools/protein-per-meal-calculator" },
    { label: "Work out the macros in a recipe", href: "/tools/recipe-macro-calculator" },
  ],
  nextPitch: "Building diet plans for clients? Traiv sets macro targets and plans in one place.",
  faq: [
    {
      q: "What is a good macro split?",
      a: "For most people who train: protein at 1.6 to 2.2 g per kg of body weight, fat at 20 to 35 percent of calories, and carbohydrate making up the rest. Within those ranges, the best split is the one you can stick to.",
    },
    {
      q: "Do I need to count macros to lose fat?",
      a: "No. Fat loss depends on total calories. Counting macros helps make sure protein stays high so the weight lost is mostly fat, but a calorie target plus a protein target works well for many people.",
    },
    {
      q: "How many grams of protein do I need?",
      a: "Most people who train do well on 1.6 to 2.2 g per kg of body weight a day (about 0.7 to 1 g per lb), toward the upper end during a calorie deficit. This calculator uses 1.8 g per kg, or 2.0 when cutting.",
    },
    {
      q: "Are carbs bad for fat loss?",
      a: "No. At equal calories, low-carb and higher-carb diets produce similar fat loss. Carbohydrate fuels hard training, so many people perform better with more of it.",
    },
    {
      q: "Should my macros be different on rest days?",
      a: "They can be. Some people eat more carbohydrate on training days and less on rest days while keeping protein constant. The calorie cycling and carb cycling calculators set that up.",
    },
    {
      q: "How precise do I need to be?",
      a: "Within about 5 to 10 g of your protein target and 100 kcal of your calories on most days is precise enough. Consistency over weeks matters more than accuracy on any single day.",
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
    { label: "Protein calculator", href: "/tools/protein-calculator" },
    { label: "Macro split by body type", href: "/tools/macro-split-by-body-type-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Macro targets, diet plans and food logs for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
