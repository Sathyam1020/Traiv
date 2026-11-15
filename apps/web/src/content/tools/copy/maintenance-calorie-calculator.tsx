import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Maintenance Calorie Calculator: Calories to Hold Weight",
  description:
    "Free maintenance calorie calculator. Find the daily calories that keep your weight steady from BMR and activity level, plus targets to lose or gain.",
  eyebrow: "Free tool · Nutrition",
  h1: "Maintenance calorie calculator",
  intro: (
    <p>
      Maintenance calories are the daily intake at which your weight stays where it is. Enter your
      sex, age, height, weight and how active you are, and this calculator estimates that number
      with the Mifflin-St Jeor equation, then shows sensible starting points for losing or gaining
      from it.
    </p>
  ),
  shortAnswer: {
    question: "How do you find your maintenance calories?",
    answer: (
      <>
        <p>
          Estimate your resting burn (BMR) from your body measurements, then multiply it by an
          activity factor that matches your normal week. For a 30-year-old man who is 5 ft 10 in,
          170 lb and trains three to five times a week, that is 1,737 × 1.55, or about 2,693 kcal a
          day.
        </p>
        <p>
          The estimate is a starting point. Eat at it for two to three weeks while weighing yourself
          most mornings: if the weekly average holds steady, you have found your real maintenance.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why maintenance is the number everything else hangs on",
      body: (
        <>
          <p>
            Every nutrition goal is defined relative to maintenance. A fat-loss diet is maintenance
            minus a deficit. A muscle-building phase is maintenance plus a surplus. A diet break is
            a return to maintenance. Get this number roughly right and every other target follows;
            get it badly wrong and the plan fails in ways that look like willpower problems but are
            really arithmetic.
          </p>
          <p>
            It is also a goal in its own right. After a long diet, during a stressful stretch of
            life, or for someone happy with their weight who wants to train well, eating at
            maintenance is the plan. Learning to hold weight steady is a skill, and people who have
            dieted repeatedly often have the least practice at it.
          </p>
        </>
      ),
    },
    {
      heading: "How the calculator works it out",
      body: (
        <>
          <ol>
            <li>
              <strong>Resting rate.</strong> Mifflin-St Jeor: 10 × weight (kg) + 6.25 × height (cm)
              − 5 × age, plus 5 for men or minus 161 for women.
            </li>
            <li>
              <strong>Activity.</strong> That resting rate is multiplied by one of five factors:
            </li>
          </ol>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Activity level</th>
                  <th scope="col">Factor</th>
                  <th scope="col">What it looks like</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sedentary</td>
                  <td>1.2</td>
                  <td>Desk job, little planned exercise</td>
                </tr>
                <tr>
                  <td>Lightly active</td>
                  <td>1.375</td>
                  <td>Light exercise 1 to 3 days, or plenty of walking</td>
                </tr>
                <tr>
                  <td>Moderately active</td>
                  <td>1.55</td>
                  <td>Exercise 3 to 5 days</td>
                </tr>
                <tr>
                  <td>Very active</td>
                  <td>1.725</td>
                  <td>Hard exercise 6 or 7 days</td>
                </tr>
                <tr>
                  <td>Extra active</td>
                  <td>1.9</td>
                  <td>Hard daily training or a physical job plus training</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The results also show a target about 500 kcal below maintenance, which tends to produce
            roughly half a kilogram (one pound) of loss a week at first, and one 300 kcal above it
            for slow, lean gain.
          </p>
        </>
      ),
    },
    {
      heading: "Finding your true maintenance with real data",
      body: (
        <>
          <p>
            Any equation is a population average. Your real maintenance can sit a couple of hundred
            calories either side of it. The way to find it is simple, if a little tedious:
          </p>
          <ol>
            <li>
              Eat close to the calculated number every day for two to three weeks. Weekends count.
            </li>
            <li>
              Weigh yourself on waking on most days, and log what you eat as accurately as you
              reasonably can.
            </li>
            <li>
              Compare the average weight of week three with week two, ignoring week one, when water
              moves most.
            </li>
            <li>
              If the average has dropped, you were below maintenance; if it has risen, you were
              above it. A change of about 0.5 kg in a week is roughly 550 kcal a day of difference.
            </li>
          </ol>
          <p>
            You can also work backwards from your log. If you averaged 2,400 kcal a day and lost
            0.25 kg a week, your maintenance is about 2,400 + (0.25 × 7,700 ÷ 7), which is roughly
            2,675 kcal.
          </p>
        </>
      ),
    },
    {
      heading: "Weight goes up and down even at maintenance",
      body: (
        <>
          <p>
            Maintenance does not mean the same number on the scale every morning. Day-to-day swings
            of 0.5 to 1.5 kg are normal and come from water, salt, carbohydrate stores, food still
            being digested and, for many women, the menstrual cycle.
          </p>
          <ul>
            <li>A salty restaurant meal can add a kilo overnight that is gone two days later.</li>
            <li>A hard leg session can hold extra water in the muscles for a few days.</li>
            <li>
              More carbohydrate than usual refills glycogen stores, and each gram is stored with
              water.
            </li>
          </ul>
          <p>
            A sensible definition of holding weight is a weekly average that stays within about 1 kg
            over a month. Chasing the daily number leads to cutting calories after one heavy
            morning, which is how maintenance turns back into an unplanned diet.
          </p>
        </>
      ),
    },
    {
      heading: "Why maintenance can drift",
      body: (
        <>
          <p>Your maintenance is not fixed. It moves with:</p>
          <ul>
            <li>
              <strong>Weight change.</strong> A lighter body costs less to run and to move. Lose 10
              kg and maintenance typically falls by 150 to 250 kcal.
            </li>
            <li>
              <strong>Daily movement.</strong> A new job, a move to a place where you walk less, or
              an injury can change maintenance more than any change to training.
            </li>
            <li>
              <strong>Training phase.</strong> A high-volume block burns more than a light week.
            </li>
            <li>
              <strong>Recent dieting.</strong> After a long deficit people often move a little less
              without noticing, and maintenance is slightly lower for a while.
            </li>
            <li>
              <strong>Age.</strong> Slowly, mostly through loss of muscle and activity rather than
              metabolism itself.
            </li>
          </ul>
          <p>
            Recalculate after any big change in weight or routine, then check it against the scale
            again.
          </p>
        </>
      ),
    },
    {
      heading: "Moving to maintenance after a diet",
      body: (
        <>
          <p>
            The end of a fat-loss phase is where many people regain. The diet stops, there is no
            plan for what comes next, and intake drifts up past maintenance. A few habits make the
            transition smoother:
          </p>
          <ul>
            <li>
              Recalculate maintenance at the new, lower weight rather than returning to the old
              number.
            </li>
            <li>
              Expect the scale to rise 1 to 2 kg in the first week as food volume and glycogen
              return. That is not fat.
            </li>
            <li>
              Keep protein high and keep training, which helps hold on to the muscle you kept during
              the diet.
            </li>
            <li>
              Some people prefer to step up gradually, adding 100 to 150 kcal a week. The reverse
              diet calculator can lay out that schedule.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Example maintenance levels",
      body: (
        <>
          <p>
            These are estimates for three different people at each activity level, to show how much
            the activity factor changes the answer for the same body.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Person (BMR)</th>
                  <th scope="col">Sedentary</th>
                  <th scope="col">Light</th>
                  <th scope="col">Moderate</th>
                  <th scope="col">Very active</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Woman, 35, 165 cm, 65 kg (1,345)</td>
                  <td>1,614</td>
                  <td>1,850</td>
                  <td>2,085</td>
                  <td>2,321</td>
                </tr>
                <tr>
                  <td>Man, 30, 178 cm, 77 kg (1,738)</td>
                  <td>2,085</td>
                  <td>2,389</td>
                  <td>2,693</td>
                  <td>2,997</td>
                </tr>
                <tr>
                  <td>Man, 50, 183 cm, 95 kg (1,849)</td>
                  <td>2,218</td>
                  <td>2,542</td>
                  <td>2,866</td>
                  <td>3,189</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            For any one person, the gap between sedentary and very active is 700 to 1,000 kcal a
            day. Choosing the right level matters more than any other input, which is why it is
            worth being honest about the last month rather than the plan for next month.
          </p>
        </>
      ),
    },
    {
      heading: "Daily steps tell you more than the gym",
      body: (
        <>
          <p>
            The activity factors lump everything together, but most of the difference between people
            comes from movement outside planned exercise: walking, standing, chores, fidgeting.
            Researchers call it non-exercise activity thermogenesis, and between two people of the
            same size it can differ by several hundred calories a day.
          </p>
          <p>
            A rough guide to picking a level from step count, assuming no other formal training:
          </p>
          <ul>
            <li>Under 5,000 steps a day: sedentary.</li>
            <li>5,000 to 7,500: light.</li>
            <li>7,500 to 10,000: moderate, or light plus regular training.</li>
            <li>Over 12,000, or a job on your feet all day: very active once training is added.</li>
          </ul>
          <p>
            If a client's steps fall, their maintenance falls with them, even if their training
            stays the same. That is one of the most common reasons weight creeps up at a fixed
            intake.
          </p>
        </>
      ),
    },
    {
      heading: "Holding weight long term",
      body: (
        <>
          <p>
            People who keep weight off for years tend to share a few habits, according to
            long-running registries of successful maintainers. None of them is clever; all of them
            are consistent:
          </p>
          <ul>
            <li>
              They weigh themselves regularly and act on a trend early, before it becomes a large
              regain.
            </li>
            <li>They keep similar meals on most days and save flexibility for occasions.</li>
            <li>
              They stay physically active, often more than people expect, with walking a large part
              of it.
            </li>
            <li>They keep protein and fibre high, which helps with appetite.</li>
            <li>
              They have a defined upper limit, such as 2 kg above their target, that triggers a
              short correction.
            </li>
          </ul>
          <p>
            Maintenance is not the absence of a plan. It is a plan with a wider target and a clear
            rule for what happens when the weight drifts.
          </p>
        </>
      ),
    },
    {
      heading: "Maintenance is a range, not a single number",
      body: (
        <>
          <p>
            It is easy to treat maintenance as an exact figure, so that eating 50 kcal over it feels
            like a mistake. In reality the body tolerates a band of intake without any meaningful
            change in weight over weeks. Expenditure itself moves from day to day with sleep,
            stress, temperature and how much you happen to walk. Food labels and portion estimates
            carry their own errors of several percent.
          </p>
          <p>
            A more useful way to think about it is a band of roughly 100 to 200 kcal either side of
            the calculated number. Days inside that band are maintenance days. What matters is where
            the weekly average sits within the band over a month, and the scale will tell you that
            far more reliably than any single day of tracking.
          </p>
          <p>
            Thinking in ranges also makes maintenance easier to live with. It leaves room for a
            larger meal one evening and a lighter lunch the next day, without either one feeling
            like a problem. People who hold their weight comfortably for years usually think this
            way, whether or not they track anything.
          </p>
        </>
      ),
    },
    {
      heading: "When the calculator is likely to be off",
      body: (
        <p>
          Equations are built from averages, so they work best for people who are close to average.
          They are less reliable for very tall or very short people, for people with a lot of muscle
          or a lot of body fat, for older adults whose daily activity has dropped, and for anyone
          whose job involves heavy physical work that the activity categories do not describe well.
          Shift workers and people with irregular sleep can also run a little differently. None of
          this makes the estimate useless; it just means the two-week check against the scale is
          more important for these groups, and the first adjustment may be larger than usual.
        </p>
      ),
    },
    {
      heading: "Maintenance for different goals",
      body: (
        <>
          <p>
            Maintenance is usually described as the intake that keeps weight stable, but people use
            it for several different purposes. A runner in a heavy training block eats at
            maintenance to recover and perform, and may need to raise it week by week as mileage
            climbs. Someone recovering from an injury might eat at maintenance while training less,
            which means their maintenance number itself falls for a while. A person who has just
            finished a long diet eats at maintenance to let hunger, energy and training settle
            before deciding what to do next.
          </p>
          <p>
            In each case the calculation is the same, but the right activity level and the way you
            check the result are different. The runner should judge maintenance by energy and
            performance as well as weight. The injured person should recalculate with a lower
            activity level and expect to adjust again when training resumes. The person coming off a
            diet should accept a small rise on the scale in the first week and then look for
            stability. Choosing the activity level honestly for the current phase, rather than the
            usual one, keeps the estimate useful.
          </p>
        </>
      ),
    },
    {
      heading: "Maintenance while travelling, on holiday or during busy weeks",
      body: (
        <>
          <p>
            Life rarely runs on a steady routine for months at a time. Holidays, work trips, exams,
            a new baby or a stressful project all change how and when you eat, and they often change
            how much you move as well. Trying to hit an exact number during those weeks usually ends
            in frustration. A better aim is to stay roughly within the maintenance band: keep
            protein reasonable at each meal, choose one or two larger meals rather than grazing all
            day, and keep walking where you can.
          </p>
          <p>
            Expect the scale to be noisy afterward. Travel, different food, more salt and disrupted
            sleep can add one or two kilograms of water that disappear within a week of getting back
            to normal. Wait for the weekly average to settle before deciding whether anything has
            really changed. Most people find that a week or two away moves their true weight far
            less than the first weigh-in back suggests.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using maintenance with clients",
    body: (
      <>
        <p>
          Start new clients at estimated maintenance for the first two weeks when you can. It gives
          you a clean baseline, shows you how accurately they log, and teaches them that tracking is
          about information rather than restriction. Once you know their real maintenance from the
          data, every later target is far more reliable.
        </p>
        <p>
          Put maintenance phases in the plan on purpose: between cuts, around holidays, during busy
          work periods. A client who has successfully held their weight for a month has learned
          something that most diets never teach.
        </p>
        <p>
          When a client's weight stops moving on a cut, check maintenance first. If they have lost a
          lot, the deficit they started with may now be close to zero.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Set maintenance, then see whether it holds",
    body: (
      <p>
        In Traiv you set each client's daily calorie and macro targets, build their diet plan from
        recipes, and see the food they log against it, so you can tell from real intake whether the
        number you set is their true maintenance.
      </p>
    ),
  },
  next: [
    { label: "Plan a deficit from this number", href: "/tools/calorie-deficit-calculator" },
    { label: "Split these calories into macros", href: "/tools/macro-calculator" },
  ],
  nextPitch: "Coaching clients on this? Traiv keeps each client's targets and food logs together.",
  faq: [
    {
      q: "What are maintenance calories?",
      a: "The daily calorie intake that keeps your body weight roughly stable. It equals your total daily energy expenditure: resting metabolism plus digestion plus all movement and exercise.",
    },
    {
      q: "Is maintenance the same as TDEE?",
      a: "Yes, in practice. TDEE is the energy you spend in a day, and maintenance is the intake that matches it. The two words describe the same number from opposite sides.",
    },
    {
      q: "How accurate is this estimate?",
      a: "It is usually within about 10 to 15 percent. The best way to find your true maintenance is to eat at the estimate for two to three weeks and see whether your weekly average weight changes.",
    },
    {
      q: "Why am I gaining weight at my maintenance calories?",
      a: "Either the estimate is high for you, the food log is missing something (cooking oils, drinks and weekends are the usual gaps), or the gain is water from more carbohydrate or salt. Check the trend over two to three weeks before changing anything.",
    },
    {
      q: "Should maintenance be the same every day?",
      a: "No. Expenditure varies with how much you move. Some people eat a little more on training days and less on rest days while keeping the weekly average at maintenance.",
    },
    {
      q: "How often should I recalculate maintenance?",
      a: "After every 4 to 5 kg (about 10 lb) of weight change, and whenever your job, daily movement or training volume changes for more than a few weeks.",
    },
    {
      q: "Can I eat at maintenance and still build muscle or lose fat?",
      a: "Yes, especially if you are new to training or returning after a break. With enough protein and progressive training, body composition can improve at maintenance even while the scale barely moves.",
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
    { label: "Calorie deficit calculator", href: "/tools/calorie-deficit-calculator" },
    { label: "Reverse diet calculator", href: "/tools/reverse-diet-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Know each client's real maintenance, not just the estimate",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
