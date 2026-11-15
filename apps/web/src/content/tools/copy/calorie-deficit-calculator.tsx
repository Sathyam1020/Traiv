import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Calorie Deficit Calculator: Daily Target and Goal Date",
  description:
    "Free calorie deficit calculator. Choose a weekly rate of loss and get a daily calorie target, your deficit and a realistic goal date, with safe minimums built in.",
  eyebrow: "Free tool · Nutrition",
  h1: "Calorie deficit calculator",
  intro: (
    <p>
      A calorie deficit means eating less energy than you burn, so the body makes up the difference
      from its own stores. Enter your details and how fast you want to lose, and this calculator
      gives you a daily calorie target, the size of the deficit behind it and, if you add a goal
      weight, roughly when you could get there.
    </p>
  ),
  method: "Mifflin-St Jeor maintenance minus a deficit sized to your weekly rate",
  sources: [
    {
      label:
        "Hall KD, et al. Quantification of the effect of energy imbalance on bodyweight. The Lancet, 2011.",
      href: "https://pubmed.ncbi.nlm.nih.gov/21872751/",
    },
    {
      label:
        "Mifflin MD, St Jeor ST, et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr, 1990.",
      href: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
    },
    {
      label:
        "Helms ER, Aragon AA, Fitschen PJ. Evidence-based recommendations for natural bodybuilding contest preparation. J Int Soc Sports Nutr, 2014.",
      href: "https://pubmed.ncbi.nlm.nih.gov/24864135/",
    },
  ],
  shortAnswer: {
    question: "How big should a calorie deficit be?",
    answer: (
      <>
        <p>
          For most people, a deficit of 300 to 600 kcal a day, enough to lose about 0.5 to 1 percent
          of body weight a week, is the range that works. A 500 kcal deficit is the classic starting
          point: about 0.5 kg (1 lb) a week at first.
        </p>
        <p>
          Bigger deficits lose weight faster but cost more muscle, more hunger and more dropouts.
          Women should generally not eat below about 1,200 kcal and men below about 1,500 kcal
          without supervision, and no one should sit far below their resting metabolic rate for
          long.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the calculator sets your target",
      body: (
        <>
          <ol>
            <li>
              <strong>Maintenance:</strong> resting rate from the Mifflin-St Jeor equation,
              multiplied by your activity factor.
            </li>
            <li>
              <strong>Deficit:</strong> your chosen weekly loss converted to a daily gap, using
              7,700 kcal per kg of body weight (3,500 per lb).
            </li>
            <li>
              <strong>Target:</strong> maintenance minus that deficit, never below 1,200 kcal for
              women or 1,500 kcal for men. If the floor kicks in, the result tells you, and the
              deficit shown is the one you will actually get.
            </li>
            <li>
              <strong>Goal date:</strong> if you add a goal weight, the distance divided by the
              weekly rate, counted forward from today.
            </li>
          </ol>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Pace</th>
                  <th scope="col">Weekly loss</th>
                  <th scope="col">Daily deficit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Relaxed</td>
                  <td>0.25 kg / 0.5 lb</td>
                  <td>about 275 kcal</td>
                </tr>
                <tr>
                  <td>Steady</td>
                  <td>0.5 kg / 1 lb</td>
                  <td>about 550 kcal</td>
                </tr>
                <tr>
                  <td>Faster</td>
                  <td>0.75 kg / 1.5 lb</td>
                  <td>about 825 kcal</td>
                </tr>
                <tr>
                  <td>Aggressive</td>
                  <td>1 kg / 2 lb</td>
                  <td>about 1,100 kcal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      heading: "Choosing a pace",
      body: (
        <>
          <p>
            A useful rule is to aim for 0.5 to 1 percent of body weight a week. That scales with
            size: 1 kg a week is a reasonable pace for someone at 120 kg and a punishing one for
            someone at 60 kg.
          </p>
          <ul>
            <li>
              <strong>Relaxed</strong> suits people who are already fairly lean, anyone who wants to
              keep training performance high, and people who have struggled with restrictive diets
              before.
            </li>
            <li>
              <strong>Steady</strong> is the right default for most. It is fast enough to see
              progress within a month and gentle enough to keep up.
            </li>
            <li>
              <strong>Faster</strong> can work for people with more weight to lose, for a defined
              block of a few weeks.
            </li>
            <li>
              <strong>Aggressive</strong> is for larger bodies or short, supervised phases. For most
              people it brings more hunger, lower energy and a higher chance of losing muscle.
            </li>
          </ul>
          <p>
            In studies of lean athletes, slower loss of around 0.7 percent a week preserved more
            strength and lean mass than faster loss at 1.4 percent. Speed has a price, and leaner
            people pay more of it.
          </p>
        </>
      ),
    },
    {
      heading: "Why the goal date is an estimate",
      body: (
        <>
          <p>
            The 7,700 kcal per kg rule is reasonable for the first weeks but overstates loss over
            months, for two reasons:
          </p>
          <ul>
            <li>
              <strong>A smaller body burns less.</strong> As weight comes off, maintenance falls, so
              the same intake becomes a smaller deficit.
            </li>
            <li>
              <strong>The body adapts.</strong> People tend to move a little less during a diet
              without noticing, and resting burn can drop slightly more than weight loss alone
              explains.
            </li>
          </ul>
          <p>
            Research using more detailed models (Hall and colleagues, 2011) suggests a sustained 100
            kcal daily change leads to about 5 kg of change over several years, half of it within
            the first year, far less than the simple rule implies over long periods. The practical
            answer is to recalculate after every 4 to 5 kg lost, and to expect the later part of a
            diet to take longer than the first.
          </p>
        </>
      ),
    },
    {
      heading: "The first two weeks will look strange",
      body: (
        <>
          <p>
            Starting a deficit usually means a quick drop on the scale, often 1 to 2 kg in the first
            week. Most of that is water: less food in the gut, less stored carbohydrate and the
            water held with it. Then the loss slows to the true rate, and many people think the diet
            has stopped working.
          </p>
          <p>
            Judge the diet from week two or three onward, using the weekly average of daily
            weigh-ins. Single mornings are noise: salt, sleep, stress, a hard workout or the
            menstrual cycle can move the scale by a kilogram either way.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping muscle while losing fat",
      body: (
        <>
          <p>
            Weight lost can be fat, muscle or water. The aim is to make as much of it fat as
            possible, and three things make the biggest difference:
          </p>
          <ul>
            <li>
              <strong>Protein:</strong> about 1.8 to 2.4 g per kg of body weight during a deficit,
              higher when leaner.
            </li>
            <li>
              <strong>Resistance training:</strong> keep lifting with challenging weights. It tells
              the body the muscle is still needed. Volume can come down a little, intensity should
              not.
            </li>
            <li>
              <strong>A sensible pace:</strong> smaller deficits preserve more muscle, especially
              for people who are already lean.
            </li>
          </ul>
          <p>
            Sleep matters too: in one study, dieters who slept less lost a much larger share of
            their weight as lean mass.
          </p>
        </>
      ),
    },
    {
      heading: "When progress stalls",
      body: (
        <>
          <p>
            A stall is two to three weeks with no change in the weekly average. Before cutting
            calories further, check these, roughly in order of how often they are the cause:
          </p>
          <ol>
            <li>
              <strong>Tracking gaps:</strong> cooking oil, sauces, drinks, bites while cooking, and
              weekends.
            </li>
            <li>
              <strong>Lower daily movement:</strong> check step counts against when the diet
              started.
            </li>
            <li>
              <strong>Water retention:</strong> a new training programme, more salt, stress or the
              menstrual cycle can hide fat loss for a week or two.
            </li>
            <li>
              <strong>A smaller body:</strong> if you have lost a lot, recalculate maintenance from
              your new weight.
            </li>
          </ol>
          <p>
            If none of those explain it, reduce intake by 100 to 200 kcal or add 2,000 to 3,000
            daily steps, and give it another two weeks.
          </p>
        </>
      ),
    },
    {
      heading: "Diet breaks and refeeds",
      body: (
        <>
          <p>
            Longer diets often go better with planned pauses. A diet break is one to two weeks at
            maintenance after every 8 to 12 weeks of dieting; a refeed is a single
            higher-carbohydrate day at maintenance. Neither reverses fat loss; both make the diet
            easier to sustain, and some research suggests they help preserve muscle and reduce
            adaptation. The refeed day and reverse diet calculators help plan them.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example, start to finish",
      body: (
        <>
          <p>
            A 30-year-old man, 178 cm and 85 kg, who trains four times a week wants to reach 78 kg.
            Here is how the calculator gets to his numbers:
          </p>
          <ol>
            <li>Resting rate: 10 × 85 + 6.25 × 178 − 5 × 30 + 5 = 1,818 kcal.</li>
            <li>Maintenance at the moderate factor: 1,818 × 1.55 = about 2,817 kcal.</li>
            <li>Steady pace, 0.5 kg a week: 0.5 × 7,700 ÷ 7 = 550 kcal a day.</li>
            <li>
              Target: 2,817 − 550 = about 2,267 kcal, comfortably above both his BMR and the 1,500
              kcal floor.
            </li>
            <li>Goal: 7 kg at 0.5 kg a week is 14 weeks, about three and a half months.</li>
          </ol>
          <p>
            In practice, by week eight he will weigh around 81 kg and his maintenance will have
            dropped by roughly 60 kcal. If progress slows, that is the first thing to account for:
            either accept a slightly slower finish or take another 60 to 100 kcal off.
          </p>
        </>
      ),
    },
    {
      heading: "Hunger: the real limit on any deficit",
      body: (
        <>
          <p>
            Most diets end because of hunger, not because the maths stopped working. A few choices
            make the same deficit far easier to live with:
          </p>
          <ul>
            <li>
              <strong>Protein at every meal.</strong> It is the most filling macro per calorie.
            </li>
            <li>
              <strong>High-volume foods.</strong> Vegetables, fruit, broth-based soups, potatoes and
              lean meats fill the stomach for few calories.
            </li>
            <li>
              <strong>Fewer liquid calories.</strong> Juice, sugary coffee drinks and alcohol add
              energy without fullness.
            </li>
            <li>
              <strong>A meal pattern that suits you.</strong> Some people do best with three larger
              meals, others with five smaller ones. Neither burns more; choose the one that controls
              your hunger.
            </li>
            <li>
              <strong>Enough sleep.</strong> Short sleep raises appetite, particularly for
              energy-dense foods.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Weekdays, weekends and the weekly total",
      body: (
        <>
          <p>
            Your body responds to the deficit over the week, not each day. That gives you room: some
            people eat a little less Monday to Friday and a little more at the weekend, keeping the
            weekly total the same. With a 2,200 kcal target, five days at 2,050 and two at 2,575 add
            up to the same 15,400 kcal.
          </p>
          <p>
            The catch is that weekends are where most diets quietly fail. Two unplanned days at
            maintenance plus a meal out can wipe out the deficit from the whole week. If progress is
            slow, count the weekend as carefully as the weekdays for two weeks and see what it
            shows.
          </p>
        </>
      ),
    },
    {
      heading: "Cardio or diet?",
      body: (
        <>
          <p>
            A deficit can come from eating less, moving more, or both. Eating less is the more
            reliable lever, because it is hard to burn a lot through exercise: a 30-minute run burns
            roughly 300 kcal for many people, and appetite often rises to match. Daily walking is
            the exception; it adds expenditure without much effect on hunger or recovery.
          </p>
          <p>
            A sensible split for most people is to create the deficit mainly through food, keep
            resistance training as it is, and add daily steps, gradually, when progress slows.
          </p>
        </>
      ),
    },
    {
      heading: "Why the calculator will not go below the minimums",
      body: (
        <>
          <p>
            Some people want to lose weight as fast as possible and choose the most aggressive pace
            available. For a smaller, lighter person, that pace can produce a target that is too low
            to meet basic nutrient needs from ordinary food. So the calculator holds the target at
            1,200 kcal for women and 1,500 kcal for men, the levels below which most dietary
            guidelines advise medical supervision, and tells you when it has done so.
          </p>
          <p>
            When that happens, the deficit you get is smaller than the one you asked for, and the
            goal date moves later to match. That is the honest result. If a faster timeline matters,
            the better levers are more daily movement and patience, not eating less than the
            minimum. Very low calorie diets do have a place, but only under medical care, where
            blood tests and regular check-ins can catch problems early.
          </p>
        </>
      ),
    },
    {
      heading: "Mindset for a long diet",
      body: (
        <>
          <p>
            A fat-loss phase of three or four months asks for a lot of small, repeated decisions,
            and the hardest part is rarely the first week. Motivation is high at the start and
            fades, and by week six the novelty is gone. People who succeed tend to plan for that
            rather than hoping it will not happen.
          </p>
          <p>
            It helps to decide in advance what a good day looks like, so that it is easy to
            recognise: calories close to target, protein met, a walk done. It helps to plan for the
            meals out, holidays and stressful weeks that will certainly come, and to treat them as
            part of the plan rather than as failures. And it helps to measure success by the trend
            over weeks rather than by any single day or weigh-in. A diet with a few imperfect days a
            week that runs for twelve weeks beats a perfect one that is abandoned after three.
          </p>
        </>
      ),
    },
    {
      heading: "After the deficit",
      body: (
        <p>
          When you reach your goal or the planned end of the phase, move to your new maintenance
          rather than straight back to your old intake. Recalculate maintenance at your new weight,
          expect the scale to rise a little in the first week as food volume and stored carbohydrate
          return, and keep tracking loosely for a month while your eating settles. This is the stage
          where most regain begins, so it deserves as much attention as the diet itself.
        </p>
      ),
    },
    {
      heading: "Deficits for different body sizes",
      body: (
        <>
          <p>
            A fixed weekly target in kilograms or pounds affects people of different sizes very
            differently. For someone weighing 120 kg, losing 1 kg a week is less than one percent of
            body weight and is a reasonable pace. For someone weighing 60 kg, the same 1 kg a week
            is nearly two percent, which is aggressive and likely to cost muscle and energy. That is
            why the slower options are usually the better choice for lighter people and those who
            are already fairly lean.
          </p>
          <p>
            Larger bodies also have more room between maintenance and the minimum intake, so they
            can run a bigger deficit while still eating a reasonable amount of food. A 120 kg man
            with a maintenance of 3,300 kcal can eat 2,200 kcal and still be well above the minimum,
            while a 55 kg woman with a maintenance of 1,800 kcal has far less space to work with. If
            you are smaller, choose the relaxed or steady pace, keep protein high, and accept that
            the timeline will be longer. The results will last better for it.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking well enough without tracking forever",
      body: (
        <>
          <p>
            Calorie counting is a skill, and like any skill it is hardest at the beginning. For the
            first few weeks of a deficit, weighing food and logging it carefully gives you the
            clearest picture of what you actually eat, and it teaches you what portions of your
            common foods really look like. After that, many people find they can estimate well
            enough for most meals and only need to weigh calorie-dense foods such as oils, nuts,
            cheese and spreads.
          </p>
          <p>
            The goal is not to count calories for the rest of your life. It is to learn enough about
            your usual meals that you can keep your intake close to target with less effort. Some
            people move from detailed tracking to tracking only protein and a rough calorie total,
            and later to no tracking at all with a regular weigh-in as the check. If the weekly
            average starts to drift in the wrong direction, a short period of careful tracking again
            is usually enough to find the cause.
          </p>
        </>
      ),
    },
    {
      heading: "Alcohol in a calorie deficit",
      body: (
        <>
          <p>
            Alcohol supplies about 7 kcal per gram, nearly as much as fat, and it brings no protein,
            no fullness and often a larger appetite afterward. A pint of beer or a large glass of
            wine is roughly 200 kcal, so a night out can quietly use up most of a day's deficit
            before any food is counted. Alcohol also tends to reduce sleep quality and next-day
            activity, both of which make the following day harder. You do not need to give it up to
            lose fat, but it is worth counting honestly, planning for it within the week's total,
            and keeping protein high on the days you drink.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Setting deficits for clients",
    body: (
      <>
        <p>
          Start conservatively. A client who loses steadily for twelve weeks does far better than
          one who crashes for three and quits. You can always make the deficit bigger later; it is
          much harder to recover a client who has decided that dieting means feeling awful.
        </p>
        <p>
          Give the target with its reasoning and a review date: "2,150 kcal, about 500 below your
          maintenance. We will look at your weekly average in two weeks." That frames the number as
          a hypothesis you are testing together.
        </p>
        <p>
          Plan the end before you start. Decide when the diet ends, what maintenance looks like
          afterward, and how you will get there. Regain usually happens in the weeks after a diet
          with no plan for what comes next.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Set the deficit, then watch it work",
    body: (
      <p>
        In Traiv you set each client's daily calories and macro split, build their diet plan from
        recipes, and see the food they log against it, so when progress stalls you can see whether
        the target or the intake is the problem.
      </p>
    ),
  },
  next: [
    { label: "Split this target into protein, carbs and fat", href: "/tools/macro-calculator" },
    { label: "Plan the whole diet in phases", href: "/tools/weight-loss-phase-calculator" },
  ],
  nextPitch: "Coaching fat loss? Traiv keeps each client's targets and food logs together.",
  faq: [
    {
      q: "What is a calorie deficit?",
      a: "Eating fewer calories than your body uses in a day. The difference comes from stored energy, mostly body fat, which is how weight is lost.",
    },
    {
      q: "How much weight will I lose with a 500 calorie deficit?",
      a: "About 0.45 kg (1 lb) a week at first, using the 3,500 kcal per pound rule. The rate slows over time as your body gets smaller and adapts.",
    },
    {
      q: "What is the lowest number of calories I should eat?",
      a: "Without supervision, generally not below about 1,200 kcal a day for women or 1,500 for men, and not far below your resting metabolic rate. This calculator will not suggest a target under those floors.",
    },
    {
      q: "Is a bigger deficit better?",
      a: "Faster, not better. Larger deficits increase hunger, fatigue and muscle loss, and fewer people stick with them. A deficit that loses 0.5 to 1 percent of body weight a week works for most.",
    },
    {
      q: "Why am I not losing weight in a calorie deficit?",
      a: "Usually because intake is higher than tracked, daily movement has dropped, or water retention is hiding fat loss. Check two to three weeks of weekly averages before changing anything.",
    },
    {
      q: "Should I eat back the calories I burn exercising?",
      a: "Not if you chose an activity level that includes your training, because that would count it twice. Pick the activity level that matches your normal week and eat to the target.",
    },
    {
      q: "Can I lose fat without counting calories?",
      a: "Yes. Any method that makes you eat less than you burn works, such as fixed meals, portion guides or eating mostly whole foods. Counting is simply the most precise way to know where you stand.",
    },
    {
      q: "How long should a calorie deficit last?",
      a: "Many people do well with blocks of 8 to 16 weeks, followed by at least a few weeks at maintenance. Longer diets often go better with planned diet breaks.",
    },
    {
      q: "Will I lose muscle in a deficit?",
      a: "Some lean mass loss is common, but high protein (about 1.8 to 2.4 g per kg), continued strength training and a moderate pace keep it small, and beginners can even gain muscle while losing fat.",
    },
    {
      q: "Why does the scale jump up some days?",
      a: "Water. Salt, carbohydrate, stress, sleep, hard workouts and the menstrual cycle can each move weight by a kilogram or more overnight. Use the weekly average.",
    },
    {
      q: "Is it better to cut carbs or fat to create a deficit?",
      a: "At equal calories and protein, fat loss is similar either way. Cut whichever you will miss least, and keep enough carbohydrate to train well.",
    },
    {
      q: "How accurate is the goal date?",
      a: "It is optimistic over long periods, because the 7,700 kcal per kg rule ignores the slowdown as you lose weight. Recalculate after each 4 to 5 kg and expect the last part to take longer.",
    },
    {
      q: "Is this calculator suitable for teenagers or during pregnancy?",
      a: "No. Teenagers are still growing and pregnant or breastfeeding women have higher needs. Their intake should be set by a doctor or registered dietitian.",
    },
  ],
  disclaimer: (
    <p>
      This calculator gives general information, not medical advice. If you are pregnant,
      breastfeeding, under 18, managing a medical condition or have a history of disordered eating,
      do not start a calorie deficit without talking to a doctor or registered dietitian.
    </p>
  ),
  keepGoing: [
    { label: "Goal weight date calculator", href: "/tools/goal-weight-date-calculator" },
    { label: "Weight loss phase calculator", href: "/tools/weight-loss-phase-calculator" },
    { label: "Protein calculator", href: "/tools/protein-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Fat loss you can see working, client by client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
