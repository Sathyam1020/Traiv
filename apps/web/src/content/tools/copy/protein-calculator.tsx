import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Protein Calculator: How Much Protein You Need a Day",
  description:
    "Free protein calculator. Get a daily protein target in grams from your body weight, goal and activity, with a sensible range and a per-meal figure.",
  eyebrow: "Free tool · Nutrition",
  h1: "Protein calculator",
  intro: (
    <>
      <p>
        Protein builds and repairs muscle, keeps you full and helps protect muscle when you eat
        less. This calculator sets a daily protein target from your body weight, adjusted for your
        goal and how hard you train, and shows a sensible range and how much to aim for at each
        meal.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How much protein do you need a day?",
    answer: (
      <>
        <p>
          Most people who train do well on 1.6 to 2.2 g of protein per kg of body weight a day,
          which is about 0.7 to 1 g per pound. Aim toward the lower end to maintain, the middle to
          build muscle and the upper end when losing fat.
        </p>
        <p>
          For a 170 lb (77 kg) person building muscle and training regularly, 1.8 g per kg works out
          to about 139 g a day, or roughly 35 g at each of four meals. The general minimum for
          sedentary adults is much lower, 0.8 g per kg, but that figure was set to prevent
          deficiency, not to support training.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the calculator sets your target",
      body: (
        <>
          <p>
            The calculator starts from a base amount for your goal, adjusts it for your activity
            level, and multiplies by your body weight in kilograms.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Goal</th>
                  <th scope="col">Base</th>
                  <th scope="col">Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Maintain</td>
                  <td>1.6 g/kg</td>
                  <td>Enough to support training and keep muscle for most people</td>
                </tr>
                <tr>
                  <td>Build muscle</td>
                  <td>1.8 g/kg</td>
                  <td>
                    A margin above the point where extra protein stops adding muscle in most studies
                  </td>
                </tr>
                <tr>
                  <td>Lose fat</td>
                  <td>2.0 g/kg</td>
                  <td>Muscle is most at risk in a calorie deficit, so protein goes up</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Lightly active people subtract 0.2 g per kg and very active people add 0.2 g per kg. The
            target always stays between 1.2 and 2.4 g per kg, which covers the range supported by
            research for people who exercise.
          </p>
          <p>
            The range shown with your result is 0.2 g per kg either side of your target. Any day
            inside it is a good day. Consistency across weeks matters far more than hitting an exact
            gram.
          </p>
        </>
      ),
    },
    {
      heading: "What the research says",
      body: (
        <>
          <p>
            The International Society of Sports Nutrition recommends 1.4 to 2.0 g of protein per kg
            of body weight a day for people who exercise, and suggests intakes above that may help
            during a calorie deficit. A large 2018 analysis of 49 studies found that protein's
            benefit for muscle and strength levelled off at about 1.6 g per kg a day on average,
            with the upper limit of the confidence interval around 2.2 g per kg.
          </p>
          <p>
            For dieting, several studies of lean, trained people losing weight found that higher
            intakes, around 2.3 to 3.1 g per kg of lean mass, preserved more muscle. That is why the
            fat-loss setting sits higher than the others.
          </p>
          <p>
            The often-quoted 0.8 g per kg figure is the recommended dietary allowance for the
            general population. It is the amount needed to avoid deficiency in most sedentary
            adults. It was never meant as a target for people trying to build or keep muscle, and
            older adults in particular often do better above it.
          </p>
        </>
      ),
    },
    {
      heading: "Protein for heavier bodies",
      body: (
        <>
          <p>
            Setting protein from total body weight works well for most people, but for someone
            carrying a lot of body fat it can produce a very high number. Fat tissue needs very
            little protein, so a 130 kg person at 40 percent body fat does not need 260 g a day.
          </p>
          <p>
            Two simple adjustments work well. One is to base protein on a realistic goal weight
            instead of current weight. The other is to use around 1.2 to 1.5 g per kg of current
            weight. Both land close to what lean mass would suggest, without needing a body fat
            measurement.
          </p>
        </>
      ),
    },
    {
      heading: "Good protein sources",
      body: (
        <>
          <p>
            Protein is easy to reach once you know which foods carry the most per portion.
            Approximate values for typical servings:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Food</th>
                  <th scope="col">Portion</th>
                  <th scope="col">Protein</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Chicken breast, cooked</td>
                  <td>120 g</td>
                  <td>about 36 g</td>
                </tr>
                <tr>
                  <td>Salmon, cooked</td>
                  <td>120 g</td>
                  <td>about 30 g</td>
                </tr>
                <tr>
                  <td>Greek yoghurt, plain</td>
                  <td>200 g</td>
                  <td>about 20 g</td>
                </tr>
                <tr>
                  <td>Eggs</td>
                  <td>3 large</td>
                  <td>about 19 g</td>
                </tr>
                <tr>
                  <td>Cottage cheese</td>
                  <td>150 g</td>
                  <td>about 17 g</td>
                </tr>
                <tr>
                  <td>Tofu, firm</td>
                  <td>150 g</td>
                  <td>about 18 g</td>
                </tr>
                <tr>
                  <td>Lentils, cooked</td>
                  <td>200 g</td>
                  <td>about 18 g</td>
                </tr>
                <tr>
                  <td>Whey protein</td>
                  <td>1 scoop (30 g)</td>
                  <td>about 24 g</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Animal proteins tend to deliver more protein per calorie and a complete set of essential
            amino acids. Plant proteins work well too, especially when you combine several sources
            over the day and aim toward the upper end of your range.
          </p>
        </>
      ),
    },
    {
      heading: "Is high protein safe?",
      body: (
        <>
          <p>
            For healthy adults, intakes up to around 2.2 g per kg and somewhat beyond have been
            studied without evidence of harm to kidneys, bones or the liver. Concerns about kidney
            damage come mainly from studies of people who already had kidney disease, for whom lower
            protein intakes are often advised.
          </p>
          <p>
            If you have kidney disease, diabetes with kidney involvement, or any condition where a
            doctor has advised limiting protein, follow that advice rather than a calculator. For
            everyone else, the main practical downside of very high protein is that it crowds out
            other foods, especially carbohydrate for training and fibre-rich plants.
          </p>
        </>
      ),
    },
    {
      heading: "Spreading protein through the day",
      body: (
        <>
          <p>
            Your daily total matters most, but how you spread it helps too. Muscle protein synthesis
            responds well to doses of roughly 0.3 to 0.4 g per kg at a time, which for most people
            is 25 to 40 g. Spreading protein across three to five meals tends to work better than
            eating most of it at dinner, a pattern that is very common.
          </p>
          <p>
            A practical approach is to start each meal with its protein source: eggs or yoghurt at
            breakfast, meat, fish, tofu or beans at lunch and dinner, and a protein-rich snack if
            there is a long gap. The protein per meal calculator splits your total across the number
            of meals you eat.
          </p>
        </>
      ),
    },
    {
      heading: "Protein needs change with age",
      body: (
        <>
          <p>
            As people get older, muscle becomes less responsive to the protein they eat. To get the
            same effect, older adults generally need more protein at each meal and across the day.
            Many researchers recommend that adults over 60 eat at least 1.2 g per kg a day, and that
            active older adults aim for the same ranges as younger people who train.
          </p>
          <p>
            Combined with strength training, adequate protein is one of the most effective ways to
            slow the loss of muscle and strength that comes with age, which matters for balance,
            independence and long-term health as much as for appearance.
          </p>
        </>
      ),
    },
    {
      heading: "Protein while losing weight",
      body: (
        <>
          <p>
            When you eat less than you burn, the body draws on stored energy, and without a reason
            to keep muscle it will break some down along with fat. Two things send that reason:
            resistance training, which signals that the muscle is needed, and enough protein, which
            supplies the building blocks to maintain it. That is why the fat-loss setting raises
            protein to 2.0 g per kg.
          </p>
          <p>
            Higher protein also helps a diet in a more everyday way. Protein is the most filling of
            the three macronutrients, and the body spends more energy digesting it than it does
            carbohydrate or fat. On a calorie-restricted diet, both effects make the target easier
            to keep. People who keep protein high during a diet commonly report less hunger and
            fewer cravings than those who cut protein along with everything else.
          </p>
        </>
      ),
    },
    {
      heading: "Protein for endurance athletes",
      body: (
        <>
          <p>
            Runners, cyclists and other endurance athletes sometimes assume protein matters only for
            lifters. In fact, long and hard endurance training breaks down muscle protein too, and
            adequate protein supports recovery and adaptation. Most guidance for endurance athletes
            falls around 1.2 to 1.6 g per kg a day, rising during heavy training blocks or when
            dieting. The calculator's maintain setting with the very active option lands in that
            range and is a sensible starting point.
          </p>
        </>
      ),
    },
    {
      heading: "Reading protein on a food label",
      body: (
        <>
          <p>
            Protein on a label is listed in grams per 100 g and, on many products, per serving. To
            compare foods, look at protein per 100 kcal as well as per portion. Chicken breast
            provides about 20 g of protein per 100 kcal; Greek yoghurt about 10 g; cheddar cheese
            about 6 g; peanut butter about 4 g. Foods high on that scale help you reach a protein
            target without using up a large share of your calories, which is especially useful
            during a diet.
          </p>
        </>
      ),
    },
    {
      heading: "A simple way to check your current intake",
      body: (
        <>
          <p>
            Before changing anything, it helps to know where you start. For three ordinary days,
            write down the main protein source at each meal and roughly how much of it you ate. Use
            the table above to estimate grams. Most people find they reach 60 to 80 percent of their
            target, with breakfast and lunch contributing much less than dinner. Closing the gap is
            then a matter of adding a protein source to the lighter meals, which is usually easier
            than overhauling the whole diet.
          </p>
        </>
      ),
    },
    {
      heading: "Protein on a budget",
      body: (
        <>
          <p>
            High-protein eating does not have to be expensive. Eggs, tinned tuna and sardines,
            frozen chicken, dried lentils and beans, milk, plain yoghurt, cottage cheese, tofu and
            peanut butter are among the cheapest sources of protein per gram in most supermarkets.
            Buying larger packs, cooking in batches and using frozen rather than fresh meat and fish
            all cut costs further. Protein powder, bought in larger tubs, is also often cheaper per
            gram of protein than many fresh foods, which makes it a practical tool rather than a
            luxury.
          </p>
          <p>
            Combining a cheaper plant source with a smaller amount of animal protein, such as
            lentils with a little minced meat, or beans with cheese, stretches the budget while
            keeping each meal high in protein.
          </p>
        </>
      ),
    },
    {
      heading: "Protein and appetite",
      body: (
        <>
          <p>
            Of the three macronutrients, protein has the strongest effect on fullness. Meals high in
            protein tend to keep people satisfied for longer and reduce how much they eat at the
            next meal. Part of this comes from hormones released in the gut in response to protein,
            and part from the slower digestion of protein-rich foods. In practical terms, if you
            often feel hungry an hour or two after eating, the first thing to check is whether that
            meal contained a decent serving of protein. Adding one is usually more effective than
            eating a larger portion of everything else.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using protein targets with clients",
    body: (
      <>
        <p>
          Protein is usually the first target worth setting with a new client, before calories or a
          full macro split. It is easy to understand, it improves body composition whatever else
          happens, and it naturally pushes meals toward more filling foods.
        </p>
        <p>
          Give the target in grams and translate it into food. Telling a client to eat 140 g of
          protein means little; showing them that it is eggs at breakfast, a chicken salad at lunch,
          Greek yoghurt in the afternoon and salmon at dinner makes it something they can do
          tomorrow.
        </p>
        <p>
          Check the food log for where protein actually sits. Most clients eat little at breakfast
          and a lot at dinner, and moving 20 g from dinner to breakfast often fixes both the total
          and the afternoon snacking.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Set protein targets and see what clients eat",
    body: (
      <>
        <p>
          In Traiv you set each client's daily calories and protein, carbohydrate and fat targets,
          build their diet plan from recipes, and see the food they log against those targets.
        </p>
      </>
    ),
  },
  next: [
    { label: "Split this protein across your meals", href: "/tools/protein-per-meal-calculator" },
    { label: "Set the rest of your macros", href: "/tools/macro-calculator" },
  ],
  nextPitch:
    "Setting protein for clients? Traiv keeps each client's targets and food logs together.",
  faq: [
    {
      q: "How much protein do I need to build muscle?",
      a: "About 1.6 to 2.2 g per kg of body weight a day for most people, which is roughly 0.7 to 1 g per pound. Benefits level off around 1.6 g per kg on average, so 1.8 g per kg gives a comfortable margin.",
    },
    {
      q: "Is 0.8 g per kg enough?",
      a: "It is enough to prevent deficiency in most sedentary adults, which is what that guideline was designed for. People who train, are losing weight or are over 60 generally do better on more.",
    },
    {
      q: "Should I base protein on my current or goal weight?",
      a: "Current weight is fine for most people. If you carry a lot of body fat, use your goal weight or about 1.2 to 1.5 g per kg of current weight instead.",
    },
    {
      q: "Can I eat too much protein?",
      a: "For healthy people, intakes well above these targets appear safe, but they add little benefit and can crowd out carbohydrate and fibre. If you have kidney disease, follow your doctor's advice.",
    },
    {
      q: "Do I need protein shakes?",
      a: "No. They are a convenient way to top up protein when meals fall short, but whole foods can provide all the protein you need.",
    },
    {
      q: "Does it matter when I eat protein?",
      a: "The daily total matters most. Spreading it over three to five meals of 25 to 40 g each is a sensible way to get there and may help a little more than eating it all at once.",
    },
  ],
  disclaimer: (
    <>
      <p>
        This calculator gives general information, not medical advice. If you are pregnant,
        breastfeeding, under 18, managing a medical condition such as kidney disease, or have a
        history of disordered eating, talk to a doctor or registered dietitian before changing what
        you eat.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Protein per meal calculator", href: "/tools/protein-per-meal-calculator" },
    { label: "Macro calculator", href: "/tools/macro-calculator" },
    { label: "Calorie deficit calculator", href: "/tools/calorie-deficit-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Protein targets clients can actually hit",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
