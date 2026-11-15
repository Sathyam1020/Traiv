import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Fiber Intake Calculator: How Much Fibre You Need",
  description:
    "Free fiber intake calculator. Get a daily fibre target from your calories (14 g per 1,000 kcal) or the guideline for your age and sex, with food examples.",
  eyebrow: "Free tool · Nutrition",
  h1: "Fiber intake calculator",
  intro: (
    <>
      <p>
        Fibre is the part of plant food your body cannot digest, and it does a great deal of good on
        its way through. This calculator gives you a daily fibre target, either from how many
        calories you eat or from the standard guideline for your age and sex, and shows where you
        might find it.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How much fibre do you need a day?",
    answer: (
      <>
        <p>
          The usual guideline is 14 g of fibre for every 1,000 kcal you eat, which is 28 g on a
          2,000 kcal diet. Fixed targets by age and sex are 38 g for men up to 50 and 30 g after,
          and 25 g for women up to 50 and 21 g after.
        </p>
        <p>
          Most adults eat far less: average intakes in the US and UK sit around 15 to 20 g a day.
          Raising intake gradually, over two to three weeks, with plenty of fluid, lets the gut
          adjust without discomfort.
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
            If you enter your daily calories, the headline target is 14 g per 1,000 kcal, the
            approach used by the US Dietary Guidelines. If you leave calories blank, it uses the
            fixed adequate intakes set by the US National Academies for your age and sex. Both are
            shown when you enter calories, so you can see how they compare.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Age 18 to 50</th>
                  <th scope="col">Over 50</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Men</td>
                  <td>38 g</td>
                  <td>30 g</td>
                </tr>
                <tr>
                  <td>Women</td>
                  <td>25 g</td>
                  <td>21 g</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The goal setting does not change the number. It changes the advice underneath it: fibre
            helps fullness during weight loss, and variety matters most for gut health.
          </p>
        </>
      ),
    },
    {
      heading: "Why fibre matters",
      body: (
        <>
          <ul>
            <li>
              <strong>Fullness.</strong> Fibre-rich foods are bulky and slow to digest, which helps
              control appetite, a real advantage in a calorie deficit.
            </li>
            <li>
              <strong>Digestive health.</strong> Fibre adds bulk and water to stool and keeps things
              moving, reducing constipation.
            </li>
            <li>
              <strong>Gut bacteria.</strong> Many fibres are fermented by bacteria in the large
              intestine, producing short-chain fatty acids that support the gut lining and may have
              wider health effects.
            </li>
            <li>
              <strong>Heart health.</strong> Soluble fibre, found in oats, barley, beans and some
              fruit, lowers LDL cholesterol modestly.
            </li>
            <li>
              <strong>Blood sugar.</strong> Fibre slows the absorption of carbohydrate, smoothing
              the rise in blood sugar after meals.
            </li>
            <li>
              <strong>Long-term health.</strong> A large 2019 analysis for the World Health
              Organization found that people eating 25 to 29 g of fibre a day had lower rates of
              heart disease, type 2 diabetes and bowel cancer than those eating less, with further
              benefits at higher intakes.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Soluble and insoluble fibre",
      body: (
        <>
          <p>
            Fibre is often split into two types, though most plant foods contain both. Soluble fibre
            dissolves in water to form a gel; it is the type that helps with cholesterol and blood
            sugar. Oats, barley, beans, lentils, apples, citrus fruit and psyllium are good sources.
            Insoluble fibre does not dissolve; it adds bulk and helps food move through the gut.
            Wholegrains, wheat bran, nuts, seeds and the skins of fruit and vegetables are rich in
            it. You do not need to track them separately. Eating a variety of plant foods gives you
            a good mix of both.
          </p>
        </>
      ),
    },
    {
      heading: "Where to find it",
      body: (
        <>
          <p>Approximate fibre in typical portions:</p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Food</th>
                  <th scope="col">Portion</th>
                  <th scope="col">Fibre</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lentils, cooked</td>
                  <td>200 g</td>
                  <td>about 16 g</td>
                </tr>
                <tr>
                  <td>Black beans, cooked</td>
                  <td>200 g</td>
                  <td>about 15 g</td>
                </tr>
                <tr>
                  <td>Raspberries</td>
                  <td>125 g</td>
                  <td>about 8 g</td>
                </tr>
                <tr>
                  <td>Chia seeds</td>
                  <td>2 tablespoons</td>
                  <td>about 8 g</td>
                </tr>
                <tr>
                  <td>Rolled oats</td>
                  <td>60 g dry</td>
                  <td>about 6 g</td>
                </tr>
                <tr>
                  <td>Wholemeal bread</td>
                  <td>2 slices</td>
                  <td>about 5 g</td>
                </tr>
                <tr>
                  <td>Pear, with skin</td>
                  <td>1 medium</td>
                  <td>about 5 g</td>
                </tr>
                <tr>
                  <td>Broccoli, cooked</td>
                  <td>150 g</td>
                  <td>about 5 g</td>
                </tr>
                <tr>
                  <td>Almonds</td>
                  <td>30 g</td>
                  <td>about 4 g</td>
                </tr>
                <tr>
                  <td>Baked potato, with skin</td>
                  <td>1 medium</td>
                  <td>about 4 g</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Beans and lentils are by far the richest everyday sources. Adding a portion of beans or
            lentils to one meal a day can close most of the gap between a typical intake and the
            target.
          </p>
        </>
      ),
    },
    {
      heading: "A day that reaches 30 g",
      body: (
        <>
          <p>Reaching the target does not need unusual foods. One example:</p>
          <ul>
            <li>
              <strong>Breakfast:</strong> oats with raspberries and a spoon of chia seeds, about 14
              g.
            </li>
            <li>
              <strong>Lunch:</strong> a wholemeal sandwich with salad and an apple, about 9 g.
            </li>
            <li>
              <strong>Dinner:</strong> chicken with roasted vegetables and a portion of lentils,
              about 12 g.
            </li>
            <li>
              <strong>Snack:</strong> a handful of almonds, about 4 g.
            </li>
          </ul>
          <p>That comes to around 39 g, comfortably above most targets, without any supplements.</p>
        </>
      ),
    },
    {
      heading: "Increasing fibre without discomfort",
      body: (
        <>
          <p>
            A sudden jump in fibre can cause bloating, gas and cramps while gut bacteria adjust. To
            avoid that:
          </p>
          <ul>
            <li>Add 5 g or so a day each week rather than all at once.</li>
            <li>Drink more fluid as fibre goes up; fibre draws water into the gut.</li>
            <li>Spread fibre across meals rather than eating it all at once.</li>
            <li>Cook and soften beans and vegetables if raw versions cause problems.</li>
            <li>Introduce beans and lentils in small portions at first.</li>
          </ul>
          <p>
            People with irritable bowel syndrome or other digestive conditions may need a different
            approach, sometimes limiting certain fermentable fibres for a period. A dietitian can
            help work out what suits you.
          </p>
        </>
      ),
    },
    {
      heading: "Fibre supplements",
      body: (
        <>
          <p>
            Supplements such as psyllium husk can help if you struggle to eat enough fibre, and
            psyllium in particular has good evidence for improving cholesterol and regularity. But
            supplements provide one type of fibre, while whole foods supply many types along with
            vitamins, minerals and other plant compounds. Food first, with supplements as a top-up,
            is the better approach for most people.
          </p>
        </>
      ),
    },
    {
      heading: "Fibre on low-carbohydrate diets",
      body: (
        <>
          <p>
            Low-carbohydrate and ketogenic diets often fall short on fibre because grains, beans,
            fruit and starchy vegetables are limited. Fibre is subtracted from total carbohydrate
            when counting net carbs, so it does not count against keto limits. Leafy greens,
            broccoli, cauliflower, avocado, nuts, seeds and berries all help, and chia and flax
            seeds are especially useful because they are very high in fibre and low in digestible
            carbohydrate.
          </p>
        </>
      ),
    },
    {
      heading: "Why most people fall short",
      body: (
        <>
          <p>
            Average fibre intake in most Western countries sits between 15 and 20 g a day, well
            below every major guideline. The reasons are simple: refined grains have replaced
            wholegrains in many staple foods, fruit and vegetable intake is low, and beans and
            lentils are rarely eaten. Processed foods, which make up a large share of many diets,
            are usually low in fibre because the parts of the plant that contain it are removed
            during processing.
          </p>
          <p>
            The gap is easier to close than it looks. Switching white bread, rice and pasta for
            wholegrain versions adds several grams a day without changing meals much. Adding fruit
            to breakfast, a portion of vegetables to lunch and dinner, and a serving of beans or
            lentils a few times a week typically doubles intake for someone starting from a low
            base.
          </p>
        </>
      ),
    },
    {
      heading: "Fibre and blood sugar",
      body: (
        <>
          <p>
            Soluble fibre forms a gel in the gut that slows the movement of food and the absorption
            of sugar. Meals that contain fibre, protein and fat cause a smaller, more gradual rise
            in blood sugar than the same carbohydrate eaten on its own. For people managing type 2
            diabetes or insulin resistance, higher fibre intake is associated with better blood
            sugar control and lower HbA1c in many studies.
          </p>
          <p>
            Simple swaps make a difference: steel-cut or rolled oats instead of instant cereals,
            wholegrain bread instead of white, whole fruit instead of juice, and adding beans or
            lentils to soups, stews and salads. People taking medication for diabetes should discuss
            large dietary changes with their care team, because improved blood sugar control can
            sometimes require changes to medication.
          </p>
        </>
      ),
    },
    {
      heading: "Fibre and cholesterol",
      body: (
        <>
          <p>
            Soluble fibre binds to bile acids in the gut, which are made from cholesterol. The body
            then draws on cholesterol from the blood to make more bile acids, lowering LDL
            cholesterol. The effect is modest but reliable: around 5 to 10 g of soluble fibre a day
            can lower LDL by a few percent. Oats and barley, which contain a type of soluble fibre
            called beta-glucan, have been studied most, and about 3 g of beta-glucan a day, roughly
            the amount in a large bowl of oats, has an approved health claim for lowering
            cholesterol in several countries.
          </p>
        </>
      ),
    },
    {
      heading: "Fibre for gut health",
      body: (
        <>
          <p>
            The large intestine contains trillions of bacteria, and fibre is their main food. When
            they ferment fibre, they produce short-chain fatty acids such as butyrate, which nourish
            the cells lining the colon and appear to have anti-inflammatory effects. A diet with a
            wide variety of plant foods tends to support a more diverse community of gut bacteria,
            which is generally associated with better health.
          </p>
          <p>
            Variety seems to matter as much as quantity. Different bacteria prefer different fibres,
            so eating many different plants, including grains, legumes, fruit, vegetables, nuts,
            seeds, herbs and spices, feeds a broader range of them. Some researchers suggest aiming
            for around 30 different plant foods a week, which sounds like a lot but adds up quickly
            once herbs, spices and mixed dishes are counted.
          </p>
        </>
      ),
    },
    {
      heading: "Fibre for children and older adults",
      body: (
        <>
          <p>
            Children need fibre too, in amounts that rise with age. A common rule of thumb in some
            countries is roughly 15 g a day for young children, rising toward adult levels in the
            teenage years. Older adults often need slightly less in absolute terms because they eat
            less overall, but fibre becomes particularly important for preventing constipation,
            which becomes more common with age. In both groups, adequate fluid alongside fibre is
            essential.
          </p>
        </>
      ),
    },
    {
      heading: "Fibre on a budget",
      body: (
        <>
          <p>
            Fibre-rich foods are among the cheapest foods available. Dried or tinned beans, lentils
            and chickpeas, oats, frozen vegetables, seasonal fruit, potatoes with their skins and
            wholemeal bread all deliver a lot of fibre for little money. Frozen berries and
            vegetables are as nutritious as fresh and last much longer, which reduces waste. A pot
            of lentil soup or bean chilli made in bulk can provide several days of high-fibre meals
            for very little.
          </p>
        </>
      ),
    },
    {
      heading: "Reading fibre on labels",
      body: (
        <>
          <p>
            On UK and EU labels, fibre is listed separately per 100 g. A food with at least 3 g per
            100 g can be described as a source of fibre, and one with at least 6 g as high in fibre.
            On US labels, fibre appears under total carbohydrate per serving, and 5 g or more per
            serving is considered high. Comparing cereals, breads and crackers by fibre per 100 g is
            an easy way to choose better versions of foods you already buy.
          </p>
        </>
      ),
    },
    {
      heading: "Fibre and weight management",
      body: (
        <>
          <p>
            People who eat more fibre tend to have lower body weight and gain less weight over time.
            Part of the reason is that fibre-rich foods are bulky and slow to digest, so meals feel
            larger and keep you full for longer. Fibre also slows stomach emptying and influences
            hormones involved in appetite. In weight-loss studies, simply increasing fibre has been
            associated with modest weight loss even without other changes, though combining it with
            a calorie target works better.
          </p>
        </>
      ),
    },
    {
      heading: "Adding 10 g of fibre with small swaps",
      body: (
        <>
          <p>
            Small, specific changes add up quickly. Each of these adds roughly 2 to 5 g of fibre
            without changing what kind of meal you eat:
          </p>
          <ul>
            <li>
              <strong>White bread to wholemeal:</strong> about 3 g for two slices.
            </li>
            <li>
              <strong>White rice to brown rice or a mix:</strong> about 2 g per portion.
            </li>
            <li>
              <strong>Juice to a whole piece of fruit:</strong> about 3 to 4 g.
            </li>
            <li>
              <strong>Adding a tablespoon of chia or ground flaxseed</strong> to yoghurt or oats:
              about 4 to 5 g.
            </li>
            <li>
              <strong>Half a tin of beans</strong> in a soup, stew or salad: about 5 to 7 g.
            </li>
            <li>
              <strong>Leaving the skin on potatoes:</strong> about 1 to 2 g per potato.
            </li>
            <li>
              <strong>A handful of nuts as a snack instead of crisps:</strong> about 2 to 3 g.
            </li>
          </ul>
          <p>
            Choosing three or four of these is usually enough to move a typical diet from around 18
            g a day to close to 30 g.
          </p>
        </>
      ),
    },
    {
      heading: "Fibre, fullness and calorie density",
      body: (
        <>
          <p>
            Foods high in fibre tend to have a low calorie density: they provide fewer calories per
            gram because they contain more water and indigestible material. A plate of vegetables,
            beans and wholegrains can be large and filling while containing far fewer calories than
            a smaller plate of refined, fatty foods. That is one reason high-fibre diets are
            associated with easier weight control. When building meals during a diet, filling half
            the plate with vegetables and adding a portion of beans or lentils is one of the most
            effective ways to stay full on fewer calories.
          </p>
        </>
      ),
    },
    {
      heading: "Fibre and athletes",
      body: (
        <>
          <p>
            Athletes generally benefit from fibre like everyone else, but timing matters. High-fibre
            meals take longer to digest and can cause discomfort if eaten shortly before hard
            training or competition. Many athletes eat their highest-fibre meals well away from
            sessions and choose lower-fibre carbohydrate sources, such as white rice, bread or
            bananas, in the few hours before training. Before a race or important event, some
            athletes reduce fibre for a day or two to lower the risk of stomach problems during
            exercise.
          </p>
          <p>
            Outside of those windows, fibre supports recovery and long-term health, and it helps
            endurance athletes in particular manage the large volumes of food they need without
            blood sugar swings.
          </p>
        </>
      ),
    },
    {
      heading: "Prebiotics, probiotics and fermented foods",
      body: (
        <>
          <p>
            Prebiotics are fibres that selectively feed beneficial gut bacteria. They are found in
            foods such as onions, garlic, leeks, asparagus, bananas, oats and legumes. Probiotics
            are live bacteria, found in fermented foods such as yoghurt, kefir, sauerkraut, kimchi
            and miso, and in supplements. A diet rich in both prebiotic fibres and fermented foods
            supports a healthy and diverse gut microbiome. Research on specific probiotic
            supplements is mixed and depends on the strain and the condition being treated, so food
            sources are a sensible first step for most people.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking fibre",
      body: (
        <>
          <p>
            Most food-tracking apps record fibre alongside calories and macros, which makes it easy
            to see where you stand for a week or two. You do not need to track it permanently. A
            short period of tracking usually reveals which meals are low in fibre and which simple
            additions fix them, after which a higher-fibre pattern tends to become habit.
          </p>
        </>
      ),
    },
    {
      heading: "A week of higher-fibre meals",
      body: (
        <>
          <p>
            Rotating a few high-fibre meals makes the target easy to reach without thinking about it
            every day. Breakfasts might alternate between overnight oats with chia and berries,
            wholegrain toast with peanut butter and a pear, and yoghurt with high-fibre cereal and
            fruit. Lunches might include a bean and vegetable soup, a lentil salad with feta, or a
            wholemeal wrap with hummus and salad. Dinners could include a chickpea curry with brown
            rice, a bean chilli, a stir-fry with plenty of vegetables and edamame, or salmon with
            potatoes in their skins and greens.
          </p>
          <p>
            Each of these meals delivers roughly 8 to 15 g of fibre, so three of them plus a piece
            of fruit or a handful of nuts takes most people to 30 g or more.
          </p>
        </>
      ),
    },
    {
      heading: "Fibre for people with diabetes or high cholesterol",
      body: (
        <>
          <p>
            For people managing type 2 diabetes, higher fibre intake, especially from oats, barley,
            legumes and vegetables, is associated with better blood sugar control. For high
            cholesterol, soluble fibre from oats, barley, beans, apples and psyllium helps lower LDL
            cholesterol. In both cases, fibre works best as part of an overall eating pattern rather
            than as a single fix, and any large changes should be discussed with the healthcare
            team, particularly where medication is involved.
          </p>
        </>
      ),
    },
    {
      heading: "How quickly to reach your target",
      body: (
        <>
          <p>
            If you currently eat around 15 g of fibre a day and your target is 30 g, aim to add
            about 5 g each week, reaching the target in three weeks. That gives gut bacteria time to
            adapt and keeps bloating to a minimum. Drink an extra glass or two of water each day as
            fibre rises. If discomfort appears, hold at the current level for another week before
            increasing again. Most people find that symptoms settle within a couple of weeks and
            digestion becomes more regular than before.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using fibre targets with clients",
    body: (
      <>
        <p>
          Fibre is one of the most underrated tools in fat-loss coaching. Clients who raise their
          fibre intake usually feel fuller on the same calories, which makes a deficit much easier
          to sustain.
        </p>
        <p>
          Introduce it as an addition rather than a restriction. 'Add a portion of beans to lunch'
          is a far more welcome instruction than 'cut back on snacks', and it often achieves the
          same thing.
        </p>
        <p>
          Warn clients about the adjustment period. A week of bloating can put people off for good
          if they were not expecting it.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Build fibre into every client's plan",
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
    { label: "Set your full macro split", href: "/tools/macro-calculator" },
    { label: "Work out the nutrition in a recipe", href: "/tools/recipe-macro-calculator" },
  ],
  nextPitch: "Planning meals for clients? Traiv builds diet plans from recipes and ingredients.",
  faq: [
    {
      q: "How much fibre should I eat a day?",
      a: "About 14 g per 1,000 kcal, or 25 g for women and 38 g for men under 50 (21 g and 30 g over 50).",
    },
    {
      q: "Can you eat too much fibre?",
      a: "Very high intakes, especially if increased quickly, can cause bloating and discomfort. Most people are far below the target, so too much is rarely the problem.",
    },
    {
      q: "What foods are highest in fibre?",
      a: "Beans, lentils, chickpeas, berries, chia and flax seeds, oats, wholegrains, nuts, and vegetables eaten with their skins.",
    },
    {
      q: "Does fibre help with weight loss?",
      a: "It helps indirectly by making meals more filling for fewer calories, which makes a calorie deficit easier to keep.",
    },
    {
      q: "Should I take a fibre supplement?",
      a: "Food is the best source, but a supplement such as psyllium can help if you struggle to reach the target.",
    },
    {
      q: "Does fibre count toward carbs?",
      a: "On UK and EU labels, fibre is listed separately from carbohydrate. On US labels it is included in total carbohydrate; for keto, subtract it to get net carbs.",
    },
  ],
  disclaimer: (
    <>
      <p>
        This calculator gives general information, not medical advice. If you have a digestive
        condition such as irritable bowel syndrome or inflammatory bowel disease, talk to a doctor
        or dietitian before changing your fibre intake.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Macro calculator", href: "/tools/macro-calculator" },
    { label: "Keto macro calculator", href: "/tools/keto-macro-calculator" },
    { label: "Water intake calculator", href: "/tools/water-intake-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Diet plans that are easier to live with",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
