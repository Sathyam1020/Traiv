import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). Traiv facts from `content/features.ts` (nutrition). */

export const copy: ToolCopy = {
  title: "Recipe Macro Calculator: Per Serving and Per 100 g (2026)",
  description:
    "Free recipe macro calculator. Enter each ingredient's grams and label macros to get calories, protein, carbs and fat for the whole dish, per serving or per 100 g.",
  eyebrow: "Free tool · Nutrition",
  h1: "Recipe macro calculator",
  intro: (
    <p>
      Add up the calories and macros in anything you cook. Type in each ingredient's weight and the
      protein, carbs and fat printed on its label, say how many portions it makes, and read the
      totals for the whole pot, one serving or 100 g. There is no food database to search: you use
      the numbers on the packets in your own kitchen.
    </p>
  ),
  shortAnswer: {
    question: "How do you work out the macros in a recipe?",
    answer: (
      <>
        <p>
          For each ingredient, multiply the grams you used by the label's figure per 100 g and
          divide by 100. Add the ingredients together for the recipe's protein, carbohydrate and
          fat. Calories are protein × 4 + carbs × 4 + fat × 9. Divide by the number of servings for
          one portion.
        </p>
        <p>
          The example already filled in, 200 g chicken breast, 150 g dry rice, 15 g olive oil and
          100 g broccoli, comes to about 907 kcal: 59 g protein, 124 g carbohydrate and 19 g fat, or
          about 453 kcal each if it is split in two.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What the calculator does with your numbers",
      body: (
        <>
          <p>Every row goes through the same three steps:</p>
          <ol>
            <li>
              <strong>Scale the label to the amount used.</strong> 150 g of rice at 78 g
              carbohydrate per 100 g is 150 × 78 ÷ 100 = 117 g of carbohydrate.
            </li>
            <li>
              <strong>Add up the rows.</strong> Protein, carbohydrate and fat are totalled
              separately, along with the total weight of the ingredients.
            </li>
            <li>
              <strong>Turn grams into calories.</strong> 4 kcal per gram of protein and carbohydrate
              and 9 per gram of fat. These are the Atwater factors, the general values most food
              labels are built on.
            </li>
          </ol>
          <p>The three views then divide the same totals in different ways:</p>
          <ul>
            <li>
              <strong>Whole recipe:</strong> everything in the pan.
            </li>
            <li>
              <strong>Per serving:</strong> the whole recipe divided by the number of servings.
            </li>
            <li>
              <strong>Per 100 g:</strong> the whole recipe scaled to 100 g of its raw ingredient
              weight, for when you weigh out a portion rather than splitting the dish evenly.
            </li>
          </ul>
          <p>
            The percentage under each macro is that macro's share of the calories, not of the
            weight. That is why 19 g of fat can be 19% of a dish while 124 g of carbohydrate is 55%.
          </p>
        </>
      ),
    },
    {
      heading: "Raw or cooked: the mistake that changes everything",
      body: (
        <>
          <p>
            Most errors in recipe maths come from mixing raw and cooked weights. Rice roughly
            triples in weight as it absorbs water; chicken loses a quarter or more as it cooks. The
            macros do not change in the pan, but the grams do.
          </p>
          <ul>
            <li>
              <strong>Use the state the label describes.</strong> A bag of rice gives figures for
              dry rice, so weigh it dry. A pack of chicken describes it raw, so weigh it raw.
            </li>
            <li>
              <strong>Be careful with "per 100 g".</strong> The per 100 g view is based on raw
              ingredient weight. If you weigh portions of the cooked dish, weigh the whole cooked
              dish once, then divide the whole-recipe totals by that weight instead.
            </li>
            <li>
              <strong>Count the oil.</strong> A tablespoon of olive oil is about 14 g and 120 kcal.
              It is the ingredient people most often leave out, and in the example it supplies most
              of the fat.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Why the total can differ from the labels",
      body: (
        <>
          <p>
            Add the label calories for each ingredient and you may get a slightly different number
            from the one here. Labels can count fibre at about 2 kcal per gram, use food-specific
            factors instead of 4-4-9, and round each figure. This calculator works from the macros
            only, so the calories always agree with the protein, carbohydrate and fat it shows. For
            planning meals, a difference of a few percent makes no practical difference.
          </p>
        </>
      ),
    },
    {
      heading: "The example recipe, row by row",
      body: (
        <>
          <p>
            Here is the pre-filled recipe worked through by hand, so you can check any recipe of
            your own the same way. Each row is grams used × the label figure ÷ 100.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Ingredient</th>
                  <th scope="col">Grams</th>
                  <th scope="col">Protein</th>
                  <th scope="col">Carbs</th>
                  <th scope="col">Fat</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Chicken breast</td>
                  <td>200</td>
                  <td>46.0 g</td>
                  <td>0 g</td>
                  <td>3.0 g</td>
                </tr>
                <tr>
                  <td>White rice (dry)</td>
                  <td>150</td>
                  <td>10.5 g</td>
                  <td>117.0 g</td>
                  <td>0.9 g</td>
                </tr>
                <tr>
                  <td>Olive oil</td>
                  <td>15</td>
                  <td>0 g</td>
                  <td>0 g</td>
                  <td>15.0 g</td>
                </tr>
                <tr>
                  <td>Broccoli</td>
                  <td>100</td>
                  <td>2.8 g</td>
                  <td>7.0 g</td>
                  <td>0.4 g</td>
                </tr>
                <tr>
                  <th scope="row">Total</th>
                  <td>465</td>
                  <td>59.3 g</td>
                  <td>124.0 g</td>
                  <td>19.3 g</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Calories: 59.3 × 4 + 124.0 × 4 + 19.3 × 9 = 237 + 496 + 174 = <strong>907 kcal</strong>.
            Split two ways, each plate is about 453 kcal with 30 g of protein. Notice that 15 g of
            oil, three percent of the ingredients by weight, supplies almost a fifth of the
            calories.
          </p>
        </>
      ),
    },
    {
      heading: "When the label doesn't give a per 100 g column",
      body: (
        <>
          <p>
            Labels in the UK and EU always show values per 100 g. American labels usually show them
            per serving instead, with the serving size in grams printed alongside. Converting takes
            one division:
          </p>
          <p>
            <code>value per 100 g = value per serving ÷ serving size in grams × 100</code>
          </p>
          <p>
            A cereal listing 5 g of protein in a 40 g serving has 5 ÷ 40 × 100 ={" "}
            <strong>12.5 g per 100 g</strong>. Do the same for carbohydrate and fat, then type those
            three numbers into the row.
          </p>
          <ul>
            <li>
              <strong>Serving given only in cups or spoons?</strong> Weigh one serving once and use
              that weight. Cup measures vary too much between foods to convert reliably.
            </li>
            <li>
              <strong>"Total carbohydrate" includes fibre on US labels.</strong> Use the figure as
              printed. The difference is small for most recipes, and staying consistent matters more
              than the last gram.
            </li>
            <li>
              <strong>No label at all?</strong> For fresh produce, meat and fish, a national food
              database such as USDA FoodData Central gives standard raw values per 100 g.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Portioning a batch by cooked weight",
      body: (
        <>
          <p>
            Splitting a pot into equal servings works when everyone takes the same amount. When
            portions vary, or the dish is eaten over several days, weighing is more accurate. This
            is how to do it:
          </p>
          <ol>
            <li>
              Enter every ingredient at its raw or dry weight and note the whole-recipe calories.
            </li>
            <li>
              Weigh the empty pot before cooking, then weigh it again full once cooking is finished.
            </li>
            <li>Subtract the pot to get the cooked weight of the food.</li>
            <li>Divide the whole-recipe calories by the cooked weight, then multiply by 100.</li>
          </ol>
          <p>
            If the example recipe weighs 1,100 g once cooked, it holds 907 ÷ 1,100 × 100 ={" "}
            <strong>82 kcal per 100 g</strong>. A 350 g bowl is then about 289 kcal. The same
            arithmetic works for protein, carbohydrate and fat: divide each recipe total by the
            cooked weight and multiply by the grams on the plate.
          </p>
          <p>
            This is different from the calculator's own per 100 g view, which uses the raw weight of
            the ingredients because it can't know how much water the dish gained or lost in the pan.
          </p>
        </>
      ),
    },
    {
      heading: "Ingredients that are easy to get wrong",
      body: (
        <>
          <p>A few ingredients cause most of the error in home-cooked recipe totals:</p>
          <ul>
            <li>
              <strong>Oils and butter.</strong> Every gram of fat is 9 kcal, and a free pour is
              rarely the tablespoon people think it is. Weigh the bottle before and after cooking
              for an exact figure.
            </li>
            <li>
              <strong>Sauces, dressings and nut butters.</strong> Small volumes, dense calories. A
              heaped spoon of peanut butter can be twice a level one.
            </li>
            <li>
              <strong>Marinades.</strong> If most of the marinade is poured away, count only what
              stayed on the food, or count half as a reasonable estimate.
            </li>
            <li>
              <strong>Deep and shallow frying.</strong> Food absorbs some of the frying oil and
              leaves the rest in the pan. Count the oil the food took up, not the whole bottle.
              Weighing the oil before and after gives a good estimate.
            </li>
            <li>
              <strong>Cooking sprays.</strong> A one-second spray is a few calories. A ten-second
              spray is not.
            </li>
            <li>
              <strong>Dried weights of grains and pasta.</strong> Typing in cooked rice at a dry
              rice label overstates carbohydrate by about two thirds.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Building a client's recipe list",
      body: (
        <>
          <p>
            Most people rotate a small set of meals. A short list of their regular recipes, each
            worked out once with the totals saved, makes everything after it easier:
          </p>
          <ul>
            <li>
              Planning a day becomes choosing from meals with known numbers rather than estimating.
            </li>
            <li>
              Food logging gets faster and more accurate, because the client logs a recipe rather
              than six ingredients.
            </li>
            <li>
              Small changes are easy to test. Swap full-fat yoghurt for low-fat, or rice for half
              rice and half vegetables, and see the difference before cooking it.
            </li>
          </ul>
          <p>
            Keep each recipe with its ingredient weights, servings and the date it was worked out.
            If a brand changes its recipe or the client changes how they cook it, re-run it.
          </p>
          <p>
            Ten regular recipes is a good first goal. That usually covers most of what a person eats
            in a normal week, and once those ten are worked out, the meals left to estimate are the
            occasional ones: a restaurant dinner, a celebration, a holiday. Those matter far less to
            the weekly average than the breakfast eaten five days in a row.
          </p>
        </>
      ),
    },
    {
      heading: "Meal prep: turning one recipe into a week of portions",
      body: (
        <>
          <p>
            Batch cooking is where recipe totals pay for themselves. Cook once, work out the numbers
            once, and every container for the rest of the week has a known value. A routine that
            works for most people:
          </p>
          <ol>
            <li>
              Decide the number of portions before cooking, and set the servings field to match.
              Five lunches means five servings.
            </li>
            <li>
              Enter every ingredient, including the oil and any sauce, at the weight that goes into
              the pan.
            </li>
            <li>
              Check the per-serving figure against the target for that meal. If one lunch should be
              around 600 kcal with 40 g of protein, adjust the protein source or the carbohydrate
              before you cook, not after.
            </li>
            <li>
              Divide the cooked food evenly by weight, using the cooked-weight method above, rather
              than by eye. Containers filled by eye often differ by 20 percent or more.
            </li>
            <li>
              Write the per-serving calories and protein on the lid, or in a note, so logging takes
              a second.
            </li>
          </ol>
          <p>
            For a family recipe where only one person is tracking, use the cooked-weight method and
            weigh just that person's plate. The rest of the household eats normally and the numbers
            stay accurate.
          </p>
        </>
      ),
    },
    {
      heading: "How accurate is a recipe total, really?",
      body: (
        <>
          <p>
            Accurate enough to plan with, not accurate to the last calorie. It helps to know where
            the error comes from, so you know which parts are worth worrying about:
          </p>
          <ul>
            <li>
              <strong>Labels themselves</strong> are allowed some tolerance. In the EU and the US a
              declared value can differ from a lab measurement by a meaningful margin, and fresh
              foods vary naturally from one batch to the next.
            </li>
            <li>
              <strong>Weighing</strong> is the part you control. A kitchen scale that reads to the
              gram removes most of the error that matters. Spoons and cups add far more.
            </li>
            <li>
              <strong>Cooking losses</strong> such as fat dripping from meat or oil left in the pan
              mean the plate holds slightly less than the inputs. Counting the inputs errs on the
              safe side.
            </li>
            <li>
              <strong>The 4-4-9 factors</strong> are averages. For mixed home cooking they land
              within a few percent of more detailed methods.
            </li>
          </ul>
          <p>
            Put together, a carefully weighed home recipe is usually within about 5 to 10 percent of
            its true value. That is well inside the margin a coach adjusts for anyway with
            two-weekly check-ins, and far better than estimating a portion by sight.
          </p>
        </>
      ),
    },
    {
      heading: "Adjusting a recipe to hit a target",
      body: (
        <>
          <p>
            Say each plate of the example recipe needs to come down from about 453 kcal to around
            350, while protein goes up. Three changes, each made in the calculator before cooking,
            get there:
          </p>
          <ol>
            <li>
              <strong>Oil from 15 g to 5 g.</strong> 10 g less fat is 90 kcal off the whole recipe,
              and the dish is still cooked in oil.
            </li>
            <li>
              <strong>Dry rice from 150 g to 100 g.</strong> 39 g less carbohydrate and a little
              protein: about 173 kcal off.
            </li>
            <li>
              <strong>Chicken from 200 g to 250 g.</strong> 11.5 g more protein for about 53 kcal.
            </li>
          </ol>
          <p>
            The recipe moves from 907 kcal to about <strong>697 kcal</strong>: 67 g protein, 85 g
            carbohydrate and 10 g fat. Split two ways, that is about 349 kcal and 34 g of protein a
            plate, against 453 kcal and 30 g before. It is the same meal on the same plate, and the
            client is unlikely to notice anything but a little more chicken.
          </p>
          <p>
            Order matters when you make changes like these. Cut the calorie-dense extras first (oil,
            butter, cheese, sauces), then adjust the starch, and only then change the protein.
            Clients will accept a smaller pour of oil far more readily than a smaller portion of
            rice.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Ask for a lighter or higher-protein version of the same dish",
    whenToUse:
      "When a recipe your client loves doesn't fit their targets and you want swaps rather than a new recipe.",
    pasteIn:
      "The ingredient list with grams, the per-serving totals, and the target you want one serving to hit.",
    text: `Here is a recipe with its macros from a recipe calculator.

Ingredients (grams): [list each ingredient and weight]
Servings: [number]
Per serving now: [kcal] kcal, [P] g protein, [C] g carbs, [F] g fat
Target per serving: [kcal] kcal and at least [P] g protein

Suggest up to three ingredient swaps or quantity changes that get one serving close to the target without changing what the dish is. For each change, give the new grams and the approximate effect on calories and protein. Keep the swaps to ingredients from a normal supermarket.`,
  },
  forCoaches: {
    heading: "Using recipe totals with clients",
    body: (
      <>
        <p>
          Clients often have three or four meals they cook every week. Running those through once,
          with their own brands and portions, tells you more than any database entry for "chicken
          curry", and it gives the client a number they trust because they produced it.
        </p>
        <p>
          Ask them to send the per-serving figures and a photo of what one serving looks like on the
          plate. If their portion is bigger than the split says, you have found where the gap
          between their target and their results is coming from.
        </p>
        <p>
          A small change to a staple meal, such as 10 g less oil or 50 g more chicken, compounds
          across every time they cook it. That is usually an easier conversation than replacing the
          meal.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Build diet plans from recipes, with the macros already worked out",
    body: (
      <p>
        In Traiv you build a client's diet plan from recipes and ingredients, set their daily
        calorie and macro targets, and see what they log against the plan. Swap a recipe or change a
        portion and the plan's totals follow.
      </p>
    ),
  },
  next: [
    { label: "Find the daily macros this meal has to fit into", href: "/tools/macro-calculator" },
    {
      label: "Work out how many calories one meal should be",
      href: "/tools/calories-per-meal-calculator",
    },
  ],
  nextPitch:
    "Planning meals for clients? Traiv builds diet plans from recipes with the macros attached.",
  faq: [
    {
      q: "Where do I find the protein, carbs and fat per 100 g?",
      a: "On the nutrition label of the packet, in the per 100 g column. For loose foods without a label, such as fresh vegetables or butcher's meat, a national food composition table like USDA FoodData Central gives standard values.",
    },
    {
      q: "Should I weigh ingredients raw or cooked?",
      a: "Weigh each ingredient in the state its label describes, which is usually raw or dry. Mixing a cooked weight with a raw label is the most common reason recipe totals come out wrong.",
    },
    {
      q: "Why is the per 100 g figure lower than I expected?",
      a: "Per 100 g here is based on raw ingredient weight. If the dish loses water while cooking, 100 g of the cooked result holds more than 100 g of raw ingredients. Weigh the whole cooked dish and divide by that weight if you portion it by weight.",
    },
    {
      q: "Does the calculator include fibre and alcohol?",
      a: "No. Calories come from protein, carbohydrate and fat only, at 4, 4 and 9 kcal per gram. Fibre and alcohol are left out so the calorie total always matches the macros shown.",
    },
    {
      q: "How many ingredients can I add?",
      a: "Up to 30 rows. Rows with no grams entered are ignored, so you can leave empty rows in place.",
    },
    {
      q: "Is anything I type saved or sent anywhere?",
      a: "No. The calculation runs in your browser and nothing you type is stored. Refreshing the page brings back the example recipe.",
    },
    {
      q: "Can I use this for a client's meal plan?",
      a: "Yes. Run the client's usual recipes through it with their brands and portions, then use the per-serving figures when you plan their day.",
    },
  ],
  keepGoing: [
    { label: "Macro calculator", href: "/tools/macro-calculator" },
    { label: "Calories per meal calculator", href: "/tools/calories-per-meal-calculator" },
    { label: "TDEE calculator", href: "/tools/tdee-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Recipes, diet plans and food logs, for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
