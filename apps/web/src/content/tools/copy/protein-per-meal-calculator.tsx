import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Protein Per Meal Calculator: How to Split Your Protein",
  description:
    "Free protein per meal calculator. Split your daily protein across two to six meals and see whether each meal reaches the 0.4 g/kg per-meal guide.",
  eyebrow: "Free tool · Nutrition",
  h1: "Protein per meal calculator",
  intro: (
    <>
      <p>
        Knowing your daily protein target is half the job. The other half is spreading it across the
        day in amounts your muscles can use well. This calculator splits your protein across the
        number of meals you eat and checks each meal against the per-meal guide used in research.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How much protein should you eat per meal?",
    answer: (
      <>
        <p>
          Roughly 0.4 g per kg of body weight per meal, across at least four meals, is a practical
          target. For an 80 kg person that is about 32 g a meal. Most people do well with 25 to 40 g
          per meal.
        </p>
        <p>
          This approach comes from a 2018 review by Schoenfeld and Aragon, which suggested that
          spreading protein in doses of about 0.4 g per kg over four or more meals is a good way to
          reach a daily intake of around 1.6 g per kg for muscle growth.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the calculator works",
      body: (
        <>
          <p>
            It sets a daily total from your goal: 1.6 g per kg to maintain, 1.8 g per kg to build
            muscle and 2.2 g per kg to lose fat. It divides that by the number of meals you choose
            and compares each meal with 0.4 g per kg of body weight.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Body weight</th>
                  <th scope="col">Daily (build, 1.8 g/kg)</th>
                  <th scope="col">3 meals</th>
                  <th scope="col">4 meals</th>
                  <th scope="col">5 meals</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>60 kg (132 lb)</td>
                  <td>108 g</td>
                  <td>36 g</td>
                  <td>27 g</td>
                  <td>22 g</td>
                </tr>
                <tr>
                  <td>70 kg (154 lb)</td>
                  <td>126 g</td>
                  <td>42 g</td>
                  <td>32 g</td>
                  <td>25 g</td>
                </tr>
                <tr>
                  <td>80 kg (176 lb)</td>
                  <td>144 g</td>
                  <td>48 g</td>
                  <td>36 g</td>
                  <td>29 g</td>
                </tr>
                <tr>
                  <td>90 kg (198 lb)</td>
                  <td>162 g</td>
                  <td>54 g</td>
                  <td>41 g</td>
                  <td>32 g</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            If each meal falls well short of the guide, the result suggests fewer, larger protein
            meals or a higher daily total. If meals are very large, it simply notes that more meals
            would spread the same protein more evenly. Neither is wrong; the daily total still
            matters most.
          </p>
        </>
      ),
    },
    {
      heading: "Is there a limit to how much protein you can use in one meal?",
      body: (
        <>
          <p>
            A popular idea says the body can only use 20 to 30 g of protein at once and the rest is
            wasted. The research is more nuanced. Studies measuring muscle protein synthesis found
            that about 20 to 25 g of high-quality protein maximised the response in young adults
            over the following few hours, which is where the idea came from.
          </p>
          <p>
            Later work showed that larger doses still get used. A 2023 study gave participants 25 g
            or 100 g of protein in one meal and found the larger dose produced a longer and greater
            total anabolic response over twelve hours. Protein beyond the immediate need is not
            simply discarded; it is digested and used over a longer period.
          </p>
          <p>
            So there is no hard cap. Spreading protein across several meals is a sensible default,
            because it gives repeated opportunities to stimulate muscle growth through the day and
            helps with appetite, but a large protein meal is not a waste.
          </p>
        </>
      ),
    },
    {
      heading: "Why distribution matters",
      body: (
        <>
          <p>
            Most people eat very little protein at breakfast, a moderate amount at lunch and most of
            it at dinner. Studies comparing that skewed pattern with an even one, at the same daily
            total, have found modestly better muscle protein synthesis with the even pattern, though
            the effect on actual muscle gain over months is smaller and less certain.
          </p>
          <p>
            The clearest practical benefit of even distribution is often appetite. A breakfast with
            30 g of protein tends to keep people fuller through the morning than one with 8 g, which
            makes the rest of the day's eating easier to manage, especially in a calorie deficit.
          </p>
        </>
      ),
    },
    {
      heading: "Hitting 30 to 40 g at breakfast",
      body: (
        <>
          <p>
            Breakfast is where most people fall short. Some simple ways to reach a meaningful
            amount:
          </p>
          <ul>
            <li>
              <strong>Eggs plus something.</strong> Three eggs and a slice of cheese or a pot of
              yoghurt on the side gets you close to 30 g.
            </li>
            <li>
              <strong>Greek yoghurt bowls.</strong> 250 g of Greek yoghurt with fruit and a spoon of
              nut butter is around 25 to 30 g.
            </li>
            <li>
              <strong>Protein in your oats.</strong> Cook oats in milk and stir in a scoop of
              protein powder after cooking.
            </li>
            <li>
              <strong>Leftovers.</strong> Last night's chicken or beans in a wrap is a perfectly
              good breakfast.
            </li>
            <li>
              <strong>Cottage cheese.</strong> On toast or with fruit; 200 g is around 22 g of
              protein.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Protein before bed",
      body: (
        <>
          <p>
            Muscle repair continues overnight, and some studies suggest that eating around 30 to 40
            g of slowly digested protein, such as casein or cottage cheese, before sleep can
            modestly improve overnight muscle protein synthesis. This is a useful option if your
            daily total is hard to reach or if dinner is early, but it is not essential if your
            total and spacing are already good.
          </p>
        </>
      ),
    },
    {
      heading: "Plant-based meals",
      body: (
        <>
          <p>
            Many plant proteins contain less of the amino acid leucine, which plays a key role in
            switching on muscle protein synthesis, and are digested slightly less completely. In
            practice this means plant-based meals may need a little more protein to have the same
            effect: around 0.4 to 0.5 g per kg rather than 0.4 g. Combining sources, such as beans
            with grains or tofu with seeds, and using soy or pea protein when needed, makes these
            amounts easy to reach.
          </p>
        </>
      ),
    },
    {
      heading: "The leucine threshold",
      body: (
        <>
          <p>
            Leucine is one of the essential amino acids, and it acts as a signal that switches on
            muscle protein synthesis. Research suggests a meal needs roughly 2 to 3 g of leucine to
            trigger a strong response in young adults, a little more in older adults. Most animal
            proteins contain about 8 to 10 percent leucine, so 25 to 30 g of protein from meat,
            fish, eggs or dairy typically reaches that level. Many plant proteins contain less,
            which is one reason plant-based meals may need slightly more protein to have the same
            effect.
          </p>
          <p>
            You do not need to count leucine. Aiming for the per-meal target from a varied range of
            protein sources takes care of it. The concept simply explains why meals with only 10 or
            15 g of protein do less for muscle than the same total protein concentrated into fewer,
            larger servings.
          </p>
        </>
      ),
    },
    {
      heading: "How meal spacing affects the result",
      body: (
        <>
          <p>
            After a protein-rich meal, muscle protein synthesis rises for a few hours and then
            returns toward baseline, even if amino acids are still present in the blood. Spacing
            meals three to five hours apart gives repeated opportunities to raise it again. Eating
            protein constantly in small amounts, by contrast, does not seem to produce a bigger
            total effect, and very long gaps of eight hours or more mean fewer opportunities through
            the day.
          </p>
          <p>
            In practice this lines up well with how most people already eat: breakfast, lunch, an
            afternoon snack and dinner, each containing a decent serving of protein. The
            calculator's default of four meals reflects that pattern.
          </p>
        </>
      ),
    },
    {
      heading: "Protein per meal in a calorie deficit",
      body: (
        <>
          <p>
            When calories are limited, it is tempting to eat two larger meals and skip the rest.
            That can work, but it makes it harder to reach the per-meal guide at every eating
            occasion, and long gaps tend to increase hunger. If you use fewer meals, make each one
            substantial in protein. If you use more, make sure each still contains a meaningful
            amount rather than spreading protein so thinly that no meal reaches 20 g.
          </p>
          <p>
            High-protein, lower-calorie foods help here: lean meats, white fish, egg whites, Greek
            yoghurt, cottage cheese, tofu and protein powders all deliver a lot of protein for
            relatively few calories.
          </p>
        </>
      ),
    },
    {
      heading: "Protein around training",
      body: (
        <>
          <p>
            The period after training was once described as a narrow window in which protein had to
            be eaten within 30 minutes. Later research found the window is much wider. If you ate a
            protein-rich meal in the few hours before training, there is no rush afterward; a normal
            meal within a couple of hours is fine. If you train fasted, for example first thing in
            the morning, eating protein reasonably soon afterward makes more sense.
          </p>
          <p>
            Treat the meal before or after training as one of your protein meals rather than an
            extra. That keeps your daily total and spacing on target without adding complexity.
          </p>
        </>
      ),
    },
    {
      heading: "Examples of 30 to 40 g meals",
      body: (
        <>
          <p>
            These everyday meals land in the range most people should aim for at each eating
            occasion:
          </p>
          <ul>
            <li>
              <strong>Breakfast:</strong> three eggs scrambled with 50 g of feta, on wholegrain
              toast.
            </li>
            <li>
              <strong>Breakfast:</strong> 250 g Greek yoghurt with berries, oats and a spoon of
              peanut butter.
            </li>
            <li>
              <strong>Lunch:</strong> a wrap with 120 g of chicken, salad and hummus.
            </li>
            <li>
              <strong>Lunch:</strong> a lentil and tuna salad with a can of tuna and a cup of cooked
              lentils.
            </li>
            <li>
              <strong>Dinner:</strong> 150 g of salmon with potatoes and vegetables.
            </li>
            <li>
              <strong>Dinner:</strong> a tofu and edamame stir-fry with 200 g of firm tofu and a
              portion of edamame.
            </li>
            <li>
              <strong>Snack:</strong> a protein shake made with milk, or 250 g of cottage cheese
              with fruit.
            </li>
          </ul>
          <p>
            Having two or three go-to options for each meal makes hitting the target almost
            automatic, because you are no longer deciding from scratch each time.
          </p>
        </>
      ),
    },
    {
      heading: "When fewer meals make sense",
      body: (
        <>
          <p>
            Some people prefer eating two or three larger meals, for example because of work
            schedules, intermittent fasting or simple preference. That is fine. With fewer meals,
            aim for a larger amount at each, 40 to 60 g, so the daily total is still reached. The
            research showing that larger single doses are still well used makes this a reasonable
            approach, especially if you are eating enough protein overall.
          </p>
        </>
      ),
    },
    {
      heading: "How the per-meal guide was derived",
      body: (
        <>
          <p>
            The figure of 0.4 g per kg per meal comes from studies that measured muscle protein
            synthesis after different doses of protein. Researchers found that the response
            increased with dose up to a point and then flattened, and when that point was expressed
            relative to body weight, it landed around 0.24 g per kg for young adults in the early
            studies. Schoenfeld and Aragon then added a safety margin to account for differences
            between individuals and protein sources, arriving at 0.4 g per kg per meal. Spread over
            four meals, that also delivers 1.6 g per kg a day, the level linked to most of the
            benefit for muscle growth.
          </p>
          <p>
            Older adults seem to need a higher dose per meal to get the same response, often closer
            to 0.4 to 0.6 g per kg, which is another reason the guide includes a margin.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking per-meal protein without an app",
      body: (
        <>
          <p>
            You do not need to log every gram to apply this. Learn the approximate protein in your
            regular protein sources, then check each meal has at least one serving that reaches 25
            to 30 g. A palm-sized portion of meat or fish, three eggs, a 200 g pot of Greek yoghurt
            or a block of tofu each comes close. If a meal has none of those, add one.
          </p>
        </>
      ),
    },
    {
      heading: "Spreading protein when your schedule is unpredictable",
      body: (
        <>
          <p>
            Not everyone can eat at regular times. Shift workers, parents of young children and
            people who travel for work often eat when they can rather than when they plan to. In
            that situation, focus on two things: make sure each meal you do eat contains a solid
            protein source, and keep a few portable high-protein options to hand for long gaps, such
            as protein bars with at least 15 to 20 g of protein, single-serve yoghurts, cheese,
            boiled eggs, jerky or a shaker with protein powder. These cover the gaps without needing
            a kitchen, and they stop a missed meal from becoming a missed day of protein.
          </p>
        </>
      ),
    },
    {
      heading: "Protein per meal for weight loss",
      body: (
        <>
          <p>
            During a diet, hitting the per-meal target at each meal does two jobs at once: it
            supports muscle retention and it keeps hunger under control. Many people find that a
            breakfast with 30 g of protein noticeably reduces snacking before lunch. If calories are
            tight, choose leaner protein sources so the per-meal target fits within the meal's
            calorie budget, and keep the protein portion the same even when other parts of the meal
            shrink.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using per-meal targets with clients",
    body: (
      <>
        <p>
          Clients who struggle to reach a daily protein target usually have a breakfast or lunch
          problem, not a dinner problem. Showing them a per-meal number makes the gap visible and
          turns one large target into three or four small, manageable ones.
        </p>
        <p>
          Keep meal counts realistic. A client who eats three meals a day will not suddenly eat five
          because a calculator suggests it. Set targets for the meals they actually eat, and add a
          protein snack only if the numbers do not work otherwise.
        </p>
        <p>
          Use photos. Asking clients to photograph each meal for a week and checking the protein
          source on the plate is often more useful than a detailed food log.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Plan meals with protein built in",
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
    { label: "Find your daily protein target", href: "/tools/protein-calculator" },
    { label: "Split your calories across meals", href: "/tools/calories-per-meal-calculator" },
  ],
  nextPitch:
    "Planning meals for clients? Traiv builds diet plans from recipes with protein targets attached.",
  faq: [
    {
      q: "How much protein should I eat per meal?",
      a: "About 0.4 g per kg of body weight per meal, which is 25 to 40 g for most people, across three to five meals.",
    },
    {
      q: "Can my body only absorb 30 g of protein at a time?",
      a: "No. Absorption is not limited in that way. Smaller doses of 20 to 25 g maximise the immediate muscle-building response, but larger meals are still digested and used over a longer period.",
    },
    {
      q: "How many protein meals should I have?",
      a: "Three to five works well for most people. Four meals spaced about four hours apart is a common, practical pattern.",
    },
    {
      q: "Is it bad to eat most of my protein at dinner?",
      a: "Not harmful, but spreading it more evenly may support muscle a little better and often helps control appetite earlier in the day.",
    },
    {
      q: "Does protein timing matter around workouts?",
      a: "Having a protein-rich meal within a few hours before or after training is sensible, but the daily total and an even spread across the day matter more than the exact timing.",
    },
    {
      q: "Do plant-based meals need more protein?",
      a: "Slightly. Aim for around 0.4 to 0.5 g per kg per meal from plant sources and combine different proteins across the day.",
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
    { label: "Protein calculator", href: "/tools/protein-calculator" },
    { label: "Calories per meal calculator", href: "/tools/calories-per-meal-calculator" },
    { label: "Macro calculator", href: "/tools/macro-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Protein spread across the day, for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
