import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Calories Per Meal Calculator: Split Your Daily Calories",
  description:
    "Free calories per meal calculator. Split a daily calorie target across two to six meals: evenly, front-loaded, or with a bigger post-workout meal.",
  eyebrow: "Free tool · Nutrition",
  h1: "Calories per meal calculator",
  intro: (
    <>
      <p>
        A daily calorie target is easier to follow once it becomes a number for each meal. Enter
        your target, choose how many meals you eat and how you like to spread them, and this
        calculator shows how many calories each meal should be.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How many calories should each meal be?",
    answer: (
      <>
        <p>
          Divide your daily target by the number of meals for an even split. On 2,200 kcal and four
          meals, that is 550 kcal a meal. If you prefer bigger meals earlier in the day, or a bigger
          meal after training, shift calories toward those meals while keeping the total the same.
        </p>
        <p>
          There is no best number of meals for fat loss or muscle gain. Total calories decide weight
          change; the split is about what keeps you full, fuels your training and fits your day.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "The three split styles",
      body: (
        <>
          <ul>
            <li>
              <strong>Even.</strong> Every meal gets the same share. Simple to plan and good for
              steady energy.
            </li>
            <li>
              <strong>Front-loaded.</strong> Meals get progressively smaller through the day. With
              four meals, the first gets four shares, the second three, the third two and the last
              one. Suits people who train in the morning, who are hungriest early, or who want a
              light evening.
            </li>
            <li>
              <strong>Post-workout.</strong> The meal after training gets one and a half shares and
              the others one each. Suits people who train later in the day and want more food for
              recovery.
            </li>
          </ul>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Style (2,200 kcal, 4 meals)</th>
                  <th scope="col">Meal 1</th>
                  <th scope="col">Meal 2</th>
                  <th scope="col">Meal 3</th>
                  <th scope="col">Meal 4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Even</td>
                  <td>550</td>
                  <td>550</td>
                  <td>550</td>
                  <td>550</td>
                </tr>
                <tr>
                  <td>Front-loaded</td>
                  <td>880</td>
                  <td>660</td>
                  <td>440</td>
                  <td>220</td>
                </tr>
                <tr>
                  <td>Post-workout (meal 3)</td>
                  <td>489</td>
                  <td>489</td>
                  <td>733</td>
                  <td>489</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      heading: "Does meal frequency affect metabolism?",
      body: (
        <>
          <p>
            Eating little and often was once said to keep metabolism high. Controlled studies have
            not found that. The energy used to digest food is proportional to how much you eat, not
            how often, so six small meals and three large ones burn the same amount if the total is
            the same.
          </p>
          <p>
            Meal frequency does affect hunger, and people differ. Some feel better with three
            substantial meals and no snacking. Others find long gaps lead to overeating later and do
            better with four or five smaller meals. Choose the pattern that makes your target
            easiest to hit.
          </p>
        </>
      ),
    },
    {
      heading: "Does eating late make you gain weight?",
      body: (
        <>
          <p>
            The evidence is mixed. Some studies link late eating with poorer blood sugar control and
            with eating more overall, especially when late meals are unplanned snacks. Others find
            no difference when total calories are the same.
          </p>
          <p>
            A practical view: if eating late leads you to eat more than planned, front-loading
            helps. If you train in the evening or simply prefer a larger dinner, there is no strong
            reason to avoid it as long as the daily total is right. Large meals right before bed can
            disturb sleep for some people, so leaving two or three hours is a sensible habit.
          </p>
        </>
      ),
    },
    {
      heading: "Building a meal to a calorie number",
      body: (
        <>
          <p>Once you know a meal should be about 550 kcal, build it in a set order:</p>
          <ol>
            <li>Choose a protein source worth 25 to 40 g of protein, roughly 150 to 250 kcal.</li>
            <li>
              Add a portion of carbohydrate, such as rice, potatoes, bread or fruit, sized to fill
              most of the remaining calories.
            </li>
            <li>Add vegetables freely; they add volume for few calories.</li>
            <li>
              Finish with a measured fat, such as oil, butter, cheese or nuts, which uses the last
              50 to 150 kcal.
            </li>
          </ol>
          <p>
            After a week or two of building meals this way, most people can estimate a 500 or 700
            kcal plate by eye without tracking every gram.
          </p>
        </>
      ),
    },
    {
      heading: "Snacks count too",
      body: (
        <>
          <p>
            If you eat snacks, either count them as one of your meals or reserve a fixed number of
            calories for them before splitting the rest. A common mistake is splitting the full
            target across main meals and then snacking on top, which quietly adds 300 to 500 kcal a
            day.
          </p>
        </>
      ),
    },
    {
      heading: "Splitting calories around a training session",
      body: (
        <>
          <p>
            If you train in the late afternoon, a common approach is to eat a moderate lunch, a
            smaller carbohydrate-rich snack an hour or two before training, and a larger
            post-workout dinner. The post-workout style in this calculator gives that meal one and a
            half times the share of the others, which suits this pattern.
          </p>
          <p>
            Morning trainers often do better with front-loading: a substantial breakfast after
            training, a solid lunch and a lighter evening. If you train early and fasted, the first
            meal of the day is effectively your post-workout meal, so it makes sense for it to be
            one of the larger ones.
          </p>
          <p>
            Whatever the timing, the aim is the same: enough carbohydrate and protein close to the
            session to fuel it and start recovery, without leaving the rest of the day short.
          </p>
        </>
      ),
    },
    {
      heading: "Shift workers and irregular schedules",
      body: (
        <>
          <p>
            If your days do not follow a normal pattern, think of meals in relation to waking and
            sleeping rather than clock times. Your first meal is breakfast whenever you wake. Try to
            keep the largest meals in your waking hours and avoid a heavy meal right before sleep,
            which can disturb rest. Keeping the same number of meals on work and non-work days, even
            if the times move, makes planning simpler and helps keep total intake steady.
          </p>
          <p>
            Night shift workers often find a front-loaded split helpful, with a main meal before the
            shift, smaller meals during it and a light meal before sleeping. Others prefer a
            substantial meal in the middle of the shift. Either can work if the daily total is
            right.
          </p>
        </>
      ),
    },
    {
      heading: "Using meal targets without tracking every gram",
      body: (
        <>
          <p>
            Meal targets are easier to estimate than daily totals. Once you know roughly what 500
            kcal of your usual foods looks like, you can build meals by eye and only check the
            occasional one. A simple approach is to weigh and log carefully for one or two weeks,
            photograph each plate, and then use those photos as reference meals.
          </p>
          <p>
            Hand-portion methods help too. For many people a palm of protein, a cupped hand of
            carbohydrate, a fist of vegetables and a thumb of fat comes to roughly 400 to 600 kcal,
            depending on the foods chosen and the size of the hands. Larger people naturally get
            larger portions, which loosely matches their larger calorie needs.
          </p>
        </>
      ),
    },
    {
      heading: "When meal sizes should differ",
      body: (
        <>
          <p>
            Equal meals are a sensible default, but there are good reasons to vary them. Families
            often share one main meal, so it may make sense to keep that meal larger and others
            smaller. People who get very hungry in the evening may prefer a small breakfast and a
            bigger dinner. Athletes with two training sessions may want two larger meals around
            them. The tool lets you choose the style that fits; the weekly result on the scale
            depends on the total, not the shape.
          </p>
        </>
      ),
    },
    {
      heading: "Liquid calories and meals",
      body: (
        <>
          <p>
            Drinks with calories, such as milky coffee, juice, smoothies, soft drinks and alcohol,
            count toward your daily total but often get left out of meal planning. Either count them
            as part of the meal they accompany or set aside a fixed amount for them before splitting
            your target. A large milky coffee can be 150 to 250 kcal, which is a third of a small
            meal.
          </p>
        </>
      ),
    },
    {
      heading: "Meal splits for common goals",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Goal</th>
                  <th scope="col">Suggested meals</th>
                  <th scope="col">Suggested style</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fat loss with evening hunger</td>
                  <td>3 to 4</td>
                  <td>Even, or a slightly larger dinner</td>
                </tr>
                <tr>
                  <td>Fat loss with morning training</td>
                  <td>3 to 4</td>
                  <td>Front-loaded</td>
                </tr>
                <tr>
                  <td>Muscle gain</td>
                  <td>4 to 6</td>
                  <td>Even or post-workout</td>
                </tr>
                <tr>
                  <td>Endurance training</td>
                  <td>4 to 5</td>
                  <td>Post-workout, with carbs before and after sessions</td>
                </tr>
                <tr>
                  <td>Busy schedule</td>
                  <td>3</td>
                  <td>Even, with a planned snack if needed</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These are starting points. Your hunger, energy and schedule over two or three weeks will
            show what works better for you.
          </p>
        </>
      ),
    },
    {
      heading: "Families and shared meals",
      body: (
        <>
          <p>
            If you cook for a family, plan around the shared meal rather than fighting it. Decide
            roughly how many calories your portion of the family dinner should be and adjust the
            other meals around it. Serve yourself first, measure the calorie-dense parts such as
            sauces and oils, and fill the rest of the plate with vegetables. Children and partners
            do not need to eat the same portions or the same targets; the shared meal can stay the
            same while portions differ.
          </p>
        </>
      ),
    },
    {
      heading: "Breakfast: big, small or skipped?",
      body: (
        <>
          <p>
            Some people are not hungry in the morning and feel better with a light breakfast or none
            at all, which is the basis of many intermittent fasting patterns. Others wake up hungry
            and find that a substantial breakfast reduces snacking later. Studies comparing large
            and small breakfasts at the same daily calories show broadly similar weight loss, though
            some find better appetite control with a bigger breakfast. Neither approach is right for
            everyone.
          </p>
          <p>
            If you skip breakfast, set the number of meals to two or three and let the remaining
            meals carry the calories. Make sure the first meal of the day contains a good amount of
            protein, since skipping breakfast is one of the main reasons people fall short on
            protein.
          </p>
        </>
      ),
    },
    {
      heading: "Common mistakes when splitting calories",
      body: (
        <>
          <ul>
            <li>
              <strong>Splitting the full target and snacking on top.</strong> Snacks need a share of
              the target too.
            </li>
            <li>
              <strong>Saving too much for the evening.</strong> A very small breakfast and lunch
              often leads to overeating later.
            </li>
            <li>
              <strong>Ignoring drinks.</strong> Milky coffees, juices and alcohol count toward the
              meal they come with.
            </li>
            <li>
              <strong>Making every meal identical in composition.</strong> Calories can be equal
              while meals differ; carbohydrate around training, for example.
            </li>
            <li>
              <strong>Changing the split every day.</strong> A consistent pattern is easier to plan
              and stick to.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Planning a week of meals from your targets",
      body: (
        <>
          <p>
            Once you know roughly how many calories each meal should be, planning a week becomes
            much simpler. Choose two or three breakfasts, two or three lunches and four or five
            dinners that land near your meal targets, and rotate them. Write the list on your phone
            or fridge so you are not deciding from scratch each day. When you shop, buy the
            ingredients for those meals and a few staple snacks, and nothing else that tempts you to
            eat outside the plan.
          </p>
          <p>
            Repetition is not a weakness. Most people who keep their weight stable for years eat a
            relatively small set of meals most days and save variety for weekends and special
            occasions. A plan built from familiar meals is easier to follow than one that asks you
            to cook something new every night, and it makes tracking almost effortless, because once
            you know the calories in your regular meals, you rarely need to check them again.
          </p>
        </>
      ),
    },
    {
      heading: "Adjusting meal sizes when progress stalls",
      body: (
        <>
          <p>
            If your weight is not moving as planned after two or three weeks, adjust the daily
            target rather than the number of meals, then let the calculator recalculate each meal.
            Taking 150 kcal off a 2,200 kcal target across four meals means each meal shrinks by
            under 40 kcal, which is about a teaspoon of oil or a slice of cheese. Small changes
            spread across meals are much easier to accept than removing an entire meal or snack.
          </p>
        </>
      ),
    },
    {
      heading: "Eating out within a meal target",
      body: (
        <>
          <p>
            Restaurant meals are often much larger than home-cooked ones, commonly 800 to 1,500 kcal
            for a main course. If you know you are eating out, you can either lighten the other
            meals that day or choose dishes that land closer to your usual meal size: grilled
            protein, vegetables or salad, and a measured portion of starch, with sauces and
            dressings on the side. Sharing a starter or dessert rather than having your own, and
            skipping the bread basket, keeps the meal closer to target without making the occasion
            feel restricted.
          </p>
          <p>
            One larger meal does not undo a week of good eating. What matters is the weekly total,
            so a planned restaurant meal is simply part of the plan.
          </p>
        </>
      ),
    },
    {
      heading: "Meal targets for muscle gain",
      body: (
        <>
          <p>
            When eating in a surplus, splitting calories across four to six meals often makes the
            total easier to reach, because each meal stays a comfortable size. Placing a larger meal
            after training helps recovery, and a protein-rich snack before bed adds calories without
            crowding other meals. If you struggle to eat enough, liquid calories such as milk or
            smoothies at one meal can add several hundred calories without much extra fullness.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using meal targets with clients",
    body: (
      <>
        <p>
          Per-meal numbers are often easier for clients than a daily total, because they turn one
          big target into a series of small decisions. A client who knows breakfast is about 500
          kcal does not need to keep a running total all day.
        </p>
        <p>
          Match the split to the client's day rather than an ideal. A shift worker, a parent with an
          early start and someone who trains after work need different patterns, and the best one is
          whichever they can repeat.
        </p>
        <p>
          When a client consistently overeats in the evening, look at their daytime meals first.
          Moving calories earlier often fixes evening hunger more effectively than willpower.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Turn meal targets into a diet plan",
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
    { label: "Find your daily calorie target", href: "/tools/tdee-calculator" },
    { label: "Split your protein across meals", href: "/tools/protein-per-meal-calculator" },
  ],
  nextPitch:
    "Planning meals for clients? Traiv builds diet plans from recipes with calories attached.",
  faq: [
    {
      q: "How many meals a day is best?",
      a: "Whatever lets you hit your calorie and protein targets most easily. Three to five meals suits most people; total intake matters far more than frequency.",
    },
    {
      q: "Is it better to eat a big breakfast?",
      a: "Some people find a larger breakfast reduces hunger and evening snacking. Others prefer a smaller morning meal. Both work if the daily total is right.",
    },
    {
      q: "Should my post-workout meal be bigger?",
      a: "It can help with recovery and is a sensible place for more carbohydrate and protein, but it is optional. The daily total matters more.",
    },
    {
      q: "Does eating more often boost metabolism?",
      a: "No. The energy used to digest food depends on how much you eat, not how many meals you split it into.",
    },
    {
      q: "Do snacks count as meals?",
      a: "Yes. Either include snacks in your meal count or set aside calories for them before splitting the rest.",
    },
    {
      q: "Is eating late bad for weight loss?",
      a: "Not necessarily. It matters mainly if late eating leads to eating more overall. Keep the daily total on target and leave a few hours before bed if late meals disturb your sleep.",
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
    { label: "TDEE calculator", href: "/tools/tdee-calculator" },
    { label: "Protein per meal calculator", href: "/tools/protein-per-meal-calculator" },
    { label: "Intermittent fasting calculator", href: "/tools/intermittent-fasting-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Meal plans built around each client's day",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
